// ------------------------------------------------------------
//   Online mode: lobby rooms + host authoritative match
// ------------------------------------------------------------
function getPersistentClientId() {
  const fallback = `client-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  try {
    const existing = window.localStorage.getItem("twoknightsClientId");
    if (existing) return existing;
    window.localStorage.setItem("twoknightsClientId", fallback);
    return fallback;
  } catch (error) {
    return fallback;
  }
}

const persistentClientId = getPersistentClientId();
const socket = typeof io !== "undefined"
  ? io({ auth: { clientId: persistentClientId } })
  : null;
let isHost = false;
let localPlayerIndex = null;
let currentRoomCode = "";
let onlineMatchStarted = false;
let lobbyState = null;
let applyingRemoteState = false;
let lastStateFingerprint = "";
let lastEmitAt = 0;
let performingRemoteAction = false;
let currentPrivateUiPlayerIndex = null;
let deferredPrivateTurnPlayerIndex = null;
let delegatedTurnBlockPlayerIndex = null;
let onlineGamePaused = false;

const lobbyOverlay = document.getElementById("lobbyOverlay");
const lobbyStatusText = document.getElementById("lobbyStatusText");
const resetLobbyBtn = document.getElementById("resetLobbyBtn");
const pauseGameBtn = document.getElementById("pauseGameBtn");
const pauseOverlay = document.getElementById("pauseOverlay");
const resumeGameBtn = document.getElementById("resumeGameBtn");
const heroSlot0Btn = document.getElementById("heroSlot0Btn");
const heroSlot1Btn = document.getElementById("heroSlot1Btn");
const heroSlot0Status = document.getElementById("heroSlot0Status");
const heroSlot1Status = document.getElementById("heroSlot1Status");
const debugOpenBtn = document.getElementById("debugOpenBtn");
const closeDebugLogBtn = document.getElementById("closeDebugLogBtn");
const debugOverlay = document.getElementById("debugOverlay");
const debugOverlayText = document.getElementById("debugOverlayText");
const copyDebugLogBtn = document.getElementById("copyDebugLogBtn");

let lastNetworkEvent = "boot";
let lastStateUpdateAt = 0;
let lastHostActionAt = 0;
let lastClientActionAt = 0;
const debugLogEntries = [];
let lastDebugMessage = "";
let lastDebugMessageCount = 0;

function debugNow() {
  return new Date().toLocaleTimeString("ru-RU", { hour12: false });
}

function isNoisyDebugMessage(message) {
  const text = String(message || "").trim();
  if (!text) return true;
  return (
    /^emitState:/.test(text) ||
    /^stateUpdate:turn=/.test(text) ||
    /^applyState:turn=/.test(text) ||
    /^resumeState:turn=/.test(text) ||
    /^(hostAction|performHostAction):private_ui_action$/.test(text) ||
    /^(hostAction|performHostAction):dom_click$/.test(text) ||
    /^hostActionIgnored:/.test(text)
  );
}

function pushDebugLog(message) {
  const text = String(message || "").trim();
  if (isNoisyDebugMessage(text)) return;
  const now = debugNow();
  if (text === lastDebugMessage && debugLogEntries.length > 0) {
    lastDebugMessageCount += 1;
    debugLogEntries[debugLogEntries.length - 1] = `[${now}] ${text} x${lastDebugMessageCount}`;
    return;
  }
  lastDebugMessage = text;
  lastDebugMessageCount = 1;
  debugLogEntries.push(`[${now}] ${text}`);
  if (debugLogEntries.length > 120) {
    debugLogEntries.splice(0, debugLogEntries.length - 120);
  }
}

function shallowClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function updateDebugOverlay() {
  if (!debugOverlayText) return;
  const lines = [
    "=== STATUS ===",
    `room=${currentRoomCode || "-"}`,
    `started=${onlineMatchStarted}`,
    `isHost=${isHost}`,
    `localPlayerIndex=${localPlayerIndex}`,
    `currentPlayerIndex=${typeof currentPlayerIndex !== "undefined" ? currentPlayerIndex : "-"}`,
    `movesRemaining=${typeof movesRemaining !== "undefined" ? movesRemaining : "-"}`,
    `lastDie=${typeof lastDie1 !== "undefined" ? lastDie1 : "-"}:${typeof lastDie2 !== "undefined" ? lastDie2 : "-"}`,
    `lastRoll=${typeof lastRoll !== "undefined" ? lastRoll : "-"}`,
    `pendingTurnAdvance=${typeof pendingTurnAdvance !== "undefined" ? pendingTurnAdvance : "-"}`,
    `pendingTurnManualOnly=${typeof pendingTurnManualOnly !== "undefined" ? pendingTurnManualOnly : "-"}`,
    `pendingTurnRequiresManualConfirm=${typeof pendingTurnRequiresManualConfirm !== "undefined" ? pendingTurnRequiresManualConfirm : "-"}`,
    `blockingModalTurnPlayerIndex=${typeof blockingModalTurnPlayerIndex !== "undefined" ? blockingModalTurnPlayerIndex : "-"}`,
    `deferredPrivateTurnPlayerIndex=${deferredPrivateTurnPlayerIndex}`,
    `delegatedTurnBlockPlayerIndex=${delegatedTurnBlockPlayerIndex}`,
    `applyingRemoteState=${applyingRemoteState}`,
    `performingRemoteAction=${performingRemoteAction}`,
    `lastEvent=${lastNetworkEvent}`,
    `stateUpdateAt=${lastStateUpdateAt || "-"}`,
    `hostActionAt=${lastHostActionAt || "-"}`,
    `clientActionAt=${lastClientActionAt || "-"}`
  ];
  if (typeof resourceSpawnDebug !== "undefined" && resourceSpawnDebug) {
    lines.push(
      "",
      "=== RESOURCE SPAWN ===",
      `turn=${resourceSpawnDebug.turn ?? "-"}`,
      `emptyKeys=${resourceSpawnDebug.emptyKeysCount ?? "-"}`,
      `requested=${Array.isArray(resourceSpawnDebug.requestedTypes) ? resourceSpawnDebug.requestedTypes.join(",") : "-"}`,
      `picked=${Array.isArray(resourceSpawnDebug.pickedKeys) ? resourceSpawnDebug.pickedKeys.join(" | ") : "-"}`,
      `placed=${Array.isArray(resourceSpawnDebug.placedTypes) ? resourceSpawnDebug.placedTypes.join(",") : "-"}`,
      `placedCount=${resourceSpawnDebug.placedCount ?? "-"}`,
      `reason=${resourceSpawnDebug.failedReason ?? "-"}`
    );
  }
  const logLines = debugLogEntries.length ? debugLogEntries : ["[log] pending..."];
  debugOverlayText.value = `${lines.join("\n")}\n\n=== LOG ===\n${logLines.join("\n")}`;
  debugOverlayText.scrollTop = debugOverlayText.scrollHeight;
}

function markNetworkEvent(label) {
  if (!isNoisyDebugMessage(label)) {
    lastNetworkEvent = label;
  }
  updateDebugOverlay();
}

function maybeAcknowledgeDeferredTurnBlock(source = "unknown") {
  if (isHost || !onlineMatchStarted) return;
  if (!Number.isInteger(localPlayerIndex)) return;
  if (deferredPrivateTurnPlayerIndex !== localPlayerIndex) return;
  if (typeof hasBlockingTurnModalOpen === "function" && hasBlockingTurnModalOpen()) return;
  if (typeof shouldRoutePrivateUiActionToHost !== "function" || !shouldRoutePrivateUiActionToHost(localPlayerIndex)) return;
  pushDebugLog(`deferredAckAuto:${source}:p${localPlayerIndex}`);
  const sent = emitPrivateUiActionToHost({
    modalType: "turnBlock",
    actionType: "close",
    playerIndex: localPlayerIndex
  });
  if (sent) {
    deferredPrivateTurnPlayerIndex = null;
  }
}

function updatePanelTitles() {
  playerPanels.forEach((panel, index) => {
    const title = panel?.querySelector(".player-name");
    if (!title || !players[index]) return;
    title.innerHTML = `<span class="player-color" data-color="${index}"></span>${players[index].name}`;
  });
  const dots = Array.from(document.querySelectorAll(".player-color"));
  dots.forEach((dot, index) => {
    const player = players[index];
    if (player) {
      dot.style.background = player.color;
    }
  });
}

function lockGameUi(locked) {
  document.body.classList.toggle("lobby-open", locked);
  if (lobbyOverlay) {
    lobbyOverlay.style.display = locked ? "flex" : "none";
  }
  updateDebugOverlay();
}

function applyPauseState(paused) {
  onlineGamePaused = Boolean(paused);
  if (pauseOverlay) {
    pauseOverlay.style.display = onlineGamePaused ? "flex" : "none";
  }
  if (pauseGameBtn) {
    pauseGameBtn.textContent = onlineGamePaused ? "НА ПАУЗЕ" : "ПАУЗА";
  }
  if (typeof refreshTurnControls === "function") {
    refreshTurnControls();
  }
}

function setLobbyStatus(text) {
  if (lobbyStatusText) {
    lobbyStatusText.textContent = text;
  }
}

function updateHeroButton(button, statusElem, hero) {
  if (!button || !statusElem) return;
  const taken = Boolean(hero?.taken);
  const isYours = Boolean(hero?.isYours);
  button.disabled = (taken && !isYours) || onlineMatchStarted;
  button.classList.toggle("taken", taken && !isYours);
  button.classList.toggle("selected", isYours);
  if (isYours) {
    statusElem.textContent = "Chosen by you";
  } else if (taken) {
    statusElem.textContent = "Taken";
  } else {
    statusElem.textContent = "Free";
  }
}

function applyLobbyState(nextState) {
  lobbyState = nextState || null;
  if (!nextState?.started) {
    onlineMatchStarted = false;
    isHost = false;
    lastStateFingerprint = "";
  }
  currentRoomCode = nextState?.roomCode || currentRoomCode || "";

  const hero0 = nextState?.heroes?.find(hero => hero.index === 0);
  const hero1 = nextState?.heroes?.find(hero => hero.index === 1);
  updateHeroButton(heroSlot0Btn, heroSlot0Status, hero0);
  updateHeroButton(heroSlot1Btn, heroSlot1Status, hero1);

  if (!currentRoomCode) {
    setLobbyStatus("Подключаем общее лобби...");
    lockGameUi(true);
    return;
  }
  if (nextState?.started) {
    setLobbyStatus("Матч запускается...");
    if (!onlineMatchStarted) {
      lockGameUi(true);
    }
    updateDebugOverlay();
    return;
  }
  if (typeof nextState?.yourSlot === "number" && nextState.yourSlot >= 0) {
    const freeHeroes = (nextState.heroes || []).filter(hero => !hero.taken).length;
    if (freeHeroes > 0) {
      setLobbyStatus("Герой выбран. Ждем второго игрока.");
    } else {
      setLobbyStatus("Оба героя выбраны, запускаем матч.");
    }
  } else {
    setLobbyStatus("Выберите свободного героя.");
  }
  lockGameUi(true);
  updateDebugOverlay();
}

function showRoomError(message) {
  pushDebugLog(`showRoomError:${message || "Lobby error."}`);
  setLobbyStatus(message || "Ошибка лобби.");
  if (!onlineMatchStarted) {
    lockGameUi(true);
  }
  updateDebugOverlay();
}

function buildState() {
  return {
    players: players.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      x: p.x,
      y: p.y,
      layer: p.layer,
      underworldState: shallowClone(p.underworldState),
      trollCaveEntranceIndex: p.trollCaveEntranceIndex,
      resources: shallowClone(p.resources),
      pocket: shallowClone(p.pocket),
      income: shallowClone(p.income),
      attack: p.attack,
      hasSword: p.hasSword,
      hasArmor: p.hasArmor,
      hasWorkshopSword: p.hasWorkshopSword,
      barbarianKills: p.barbarianKills,
      slowTurnsRemaining: p.slowTurnsRemaining,
      noDoubleTurnsRemaining: p.noDoubleTurnsRemaining,
      royalBlessingTurnsRemaining: p.royalBlessingTurnsRemaining,
      poisonCount: p.poisonCount,
      fogOfWarCount: p.fogOfWarCount,
      invisPotionCount: p.invisPotionCount,
      luckPotionCount: p.luckPotionCount,
      invulnPotionCount: p.invulnPotionCount,
      invisTurnsRemaining: p.invisTurnsRemaining,
      luckTurnsRemaining: p.luckTurnsRemaining,
      invulnTurnsRemaining: p.invulnTurnsRemaining,
      cloverCount: p.cloverCount,
      dragonChipCount: p.dragonChipCount,
      tavernFishkaPlaysThisTurn: p.tavernFishkaPlaysThisTurn,
      trollClubCount: p.trollClubCount,
      werewolfFangCount: p.werewolfFangCount,
      flowerCount: p.flowerCount,
      voidShardCount: p.voidShardCount,
      tokenCount: p.tokenCount,
      ballistaCount: p.ballistaCount,
      ballistaLevel: p.ballistaLevel,
      ballistaShotsThisTurn: p.ballistaShotsThisTurn,
      boltCount: p.boltCount,
      harpoonCount: p.harpoonCount,
      bootsCount: p.bootsCount,
      ringCount: p.ringCount,
      terrorRingCount: p.terrorRingCount,
      rainbowStoneCount: p.rainbowStoneCount,
      mysticStoneCount: p.mysticStoneCount,
      werewolfAmuletCount: p.werewolfAmuletCount,
      luckAmuletCount: p.luckAmuletCount,
      builderAmuletCount: p.builderAmuletCount,
      builderAmuletChargeCount: p.builderAmuletChargeCount,
      builderAmuletTurnCounter: p.builderAmuletTurnCounter,
      hasCrystalSword: p.hasCrystalSword,
      heroHiltCount: p.heroHiltCount,
      trapStunCount: p.trapStunCount,
      bridgeCount: p.bridgeCount,
      beerProtectionTurnsRemaining: p.beerProtectionTurnsRemaining,
      beerSlowTurnsRemaining: p.beerSlowTurnsRemaining,
      beerEffectStartedTurn: p.beerEffectStartedTurn,
      tavernWheelPlaysThisTurn: p.tavernWheelPlaysThisTurn,
      tavernDragonPlaysThisTurn: p.tavernDragonPlaysThisTurn,
      stoneBonusRollsRemaining: p.stoneBonusRollsRemaining,
      stoneSpeedTurnsRemaining: p.stoneSpeedTurnsRemaining,
      stunnedTurnsRemaining: p.stunnedTurnsRemaining,
      stunSource: p.stunSource,
      barbarianRewards: shallowClone(p.barbarianRewards)
    })),
    currentPlayerIndex,
    movesRemaining,
    lastRoll,
    lastRollText,
    lastDie1,
    lastDie2,
    extraTurnPending,
    extraTurnReason,
    justRolledDouble,
    robberAmbushThisSession,
    robbersEnabled,
    turnCounter,
    turnsUntilResources,
    turnsUntilTreasure,
    treasureTurnsRemaining,
    flowerTurnsRemaining,
    masterNextSpawnTurn,
    masterTurnsRemaining,
    masterActive,
    barbarianPhaseStarted,
    barbarianCells: shallowClone(barbarianCells),
    barbarianRespawnTimers: shallowClone(barbarianRespawnTimers),
    robberEvent: shallowClone(robberEvent),
    guardAccess: shallowClone(guardAccess),
    gameEnded,
    gameTimerSeconds,
    resourceByPos: Object.values(resourceByPos).map(entry => ({
      key: entry.key,
      x: entry.x,
      y: entry.y,
      typeKey: entry.type?.key || entry.typeKey
    })),
    specialByPos: Object.values(specialByPos).map(entry => ({
      key: entry.key,
      x: entry.x,
      y: entry.y,
      label: entry.label,
      extraClass: entry.extraClass,
      ownerIndex: entry.ownerIndex,
      featureKey: entry.featureKey,
      sourceCastleKey: entry.sourceCastleKey,
      disabled: entry.disabled,
      type: entry.type,
      mageId: entry.mageId
    })),
    treasure: treasure ? { key: treasure.key, x: treasure.x, y: treasure.y } : null,
    flowerArtifact: flowerArtifact ? { key: flowerArtifact.key, x: flowerArtifact.x, y: flowerArtifact.y } : null,
    cloverArtifact: cloverArtifact ? { key: cloverArtifact.key, x: cloverArtifact.x, y: cloverArtifact.y } : null,
    fishka: typeof fishka !== "undefined" && fishka ? { key: fishka.key, x: fishka.x, y: fishka.y, turnsRemaining: fishka.turnsRemaining } : null,
    nextFishkaSpawnTurn: typeof nextFishkaSpawnTurn !== "undefined" ? nextFishkaSpawnTurn : null,
    cloverTurnsRemaining,
    nextCloverSpawnTurn,
    stoneByPos: Object.values(stoneByPos).map(entry => ({
      key: entry.key,
      x: entry.x,
      y: entry.y,
      turnsRemaining: entry.turnsRemaining
    })),
    rainbowByPos: Object.values(rainbowByPos).map(entry => ({
      key: entry.key,
      x: entry.x,
      y: entry.y,
      turnsRemaining: entry.turnsRemaining
    })),
    rainbowSpawnTurns: shallowClone(rainbowSpawnTurns),
    rainbowSpawnIndex,
    flowerSpawnTurns: shallowClone(flowerSpawnTurns),
    flowerSpawnIndex,
    nextStoneSpawnTurn: typeof nextStoneSpawnTurn !== "undefined" ? nextStoneSpawnTurn : null,
    voidShardByPos: typeof voidShardByPos !== "undefined"
      ? Object.values(voidShardByPos).map(entry => ({
          key: entry.key,
          x: entry.x,
          y: entry.y,
          turnsRemaining: entry.turnsRemaining
        }))
      : [],
    voidShardSpawnTurn: typeof voidShardSpawnTurn !== "undefined" ? voidShardSpawnTurn : null,
    portalState: typeof portalState !== "undefined" && portalState ? {
      active: portalState.active,
      keys: Array.isArray(portalState.keys) ? shallowClone(portalState.keys) : [],
      turnsRemaining: portalState.turnsRemaining,
      nextSpawnTurn: portalState.nextSpawnTurn
    } : null,
    mageSlot: {
      active: mageSlot.active,
      turnsRemaining: mageSlot.turnsRemaining,
      key: mageSlot.key,
      x: mageSlot.x,
      y: mageSlot.y,
      nextSpawnTurn: mageSlot.nextSpawnTurn
    },
    trollState: shallowClone(trollState),
    trollCaveInteriorState: shallowClone(trollCaveInteriorState),
    trollCaves: TROLL_CAVES.map(cave => ({
      key: cave.key,
      x: cave.x,
      y: cave.y,
      looted: cave.looted
    })),
    mercenaries: shallowClone(mercenaries),
    mercenaryIdCounter,
    thieves: shallowClone(thieves),
    thiefIdCounter,
    cutthroats: shallowClone(cutthroats),
    cutthroatIdCounter,
    messengers: shallowClone(messengers),
    messengerIdCounter,
    caravans: shallowClone(caravans),
    caravanIdCounter,
    werewolfState: shallowClone(werewolfState),
    trapStunFields: shallowClone(trapStunFields),
    trapStunIdCounter,
    bridgeOpenedKeys: Array.from(bridgeOpenedKeys),
    scheduledWorldEvents: typeof cloneWorldEventSchedule === "function" ? cloneWorldEventSchedule() : [],
    scheduledRoyalMessengerTurns: typeof scheduledRoyalMessengerTurns !== "undefined" ? shallowClone(scheduledRoyalMessengerTurns) : [],
    pendingRoyalMessengerEvents: typeof pendingRoyalMessengerEvents === "number" ? pendingRoyalMessengerEvents : 0,
    scheduledCaravanTurns: typeof scheduledCaravanTurns !== "undefined" ? shallowClone(scheduledCaravanTurns) : [],
    pendingCaravanEvents: typeof pendingCaravanEvents === "number" ? pendingCaravanEvents : 0,
    scheduledFullMoonTurns: typeof scheduledFullMoonTurns !== "undefined" ? shallowClone(scheduledFullMoonTurns) : [],
    pendingFullMoonEvents: typeof pendingFullMoonEvents === "number" ? pendingFullMoonEvents : 0,
    fullMoonEventState: shallowClone(fullMoonEventState),
    scheduledFogOfWarTurns: typeof scheduledFogOfWarTurns !== "undefined" ? shallowClone(scheduledFogOfWarTurns) : [],
    pendingFogOfWarEvents: typeof pendingFogOfWarEvents === "number" ? pendingFogOfWarEvents : 0,
    fogOfWarState: shallowClone(fogOfWarState),
    activeDayBuffs: typeof activeDayBuffs !== "undefined" ? activeDayBuffs.slice() : [],
    prevTimeOfDayKey: typeof prevTimeOfDayKey !== "undefined" ? prevTimeOfDayKey : null,
    activeWorldEvents: typeof cloneActiveWorldEvents === "function" ? cloneActiveWorldEvents() : {},
    kingAuctionState: typeof cloneKingAuctionState === "function" ? cloneKingAuctionState() : null,
    kingGenerosityState: typeof cloneKingGenerosityState === "function" ? cloneKingGenerosityState() : null,
    gameWinnerIndex,
    upperWormhole: shallowClone(upperWormhole),
    wormholeSpawnTurns: shallowClone(wormholeSpawnTurns),
    wormholeSpawnIndex,
    lastBattleResult: shallowClone(lastBattleResult),
    lastBattleId,
    pendingPlayerBattle: typeof clonePendingPlayerBattleForSync === "function" ? clonePendingPlayerBattleForSync() : null,
    playerBattleSequenceId: typeof playerBattleSequenceId === "number" ? playerBattleSequenceId : 0,
    playerBattleRevealState: shallowClone(playerBattleRevealState),
    pendingTurnAdvance,
    pendingTurnManualOnly,
    pendingTurnRequiresManualConfirm: typeof pendingTurnRequiresManualConfirm === "boolean" ? pendingTurnRequiresManualConfirm : false,
    deferredPrivateTurnPlayerIndex,
    ballistaModePlayerIndex,
    harpoonModePlayerIndex,
    bridgeModePlayerIndex,
    voidShardModePlayerIndex: typeof voidShardModePlayerIndex === "number" ? voidShardModePlayerIndex : null,
    reachableKeys: Array.from(reachableKeys),
    castleOwnersByKey: shallowClone(castleOwnersByKey),
    castleStatsByKey: shallowClone(castleStatsByKey)
  };
}

function emitStateNow(force = false) {
  if (!socket || !onlineMatchStarted || !isHost || applyingRemoteState) return;
  const now = Date.now();
  if (!force && now - lastEmitAt < 150) return;
  const state = buildState();
  const fingerprint = JSON.stringify(state);
  if (!force && fingerprint === lastStateFingerprint) return;
  lastStateFingerprint = fingerprint;
  lastEmitAt = now;
  if (force) {
    markNetworkEvent("statePushed");
  }
  socket.emit("hostState", state);
}

function resetDynamicCells() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const key = `${x},${y}`;
      if (nodeByPos[key]) {
        restoreImportantNodeCell(key, grid[key]);
        continue;
      }
      setCellToInactive(x, y, { skipTreasureCleanup: true });
    }
  }

  Object.keys(resourceByPos).forEach(key => delete resourceByPos[key]);
  Object.keys(specialByPos).forEach(key => delete specialByPos[key]);
  Object.keys(stoneByPos).forEach(key => delete stoneByPos[key]);
  Object.keys(rainbowByPos).forEach(key => delete rainbowByPos[key]);
  if (typeof voidShardByPos !== "undefined") {
    Object.keys(voidShardByPos).forEach(key => delete voidShardByPos[key]);
  }
  if (typeof initPortalState === "function") {
    initPortalState();
  } else if (typeof portalState !== "undefined" && portalState) {
    portalState.active = false;
    portalState.keys = [];
    portalState.turnsRemaining = 0;
    portalState.nextSpawnTurn = null;
  }
  barbarianCells.length = 0;
  barbarianRespawnTimers.length = 0;
  mercenaries.length = 0;
  thieves.length = 0;
  cutthroats.length = 0;
  messengers.length = 0;
  caravans.length = 0;
  werewolfState = null;
  treasure = null;
  flowerArtifact = null;
  cloverArtifact = null;
  if (typeof fishka !== "undefined" && fishka) {
    const fishkaCell = fishka.elem;
    if (fishkaCell) {
      fishkaCell.classList.remove("fishka", "important");
      clearCellIcon(fishkaCell);
      fishkaCell.classList.add("inactive");
    }
    fishka = null;
  }
  masterActive = false;
  mageSlot.active = false;
  mageSlot.key = null;
  mageSlot.x = null;
  mageSlot.y = null;
  if (mageSlot.timerElem) {
    mageSlot.timerElem.remove();
    mageSlot.timerElem = null;
  }
  if (trollState.prevKey) clearTrollTokenAt(trollState.prevKey);
  if (trollState.key) clearTrollTokenAt(trollState.key);
}

function applyResourceEntry(entry) {
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  const type = resourceTypes.find(t => t.key === entry.typeKey);
  if (!type) return;
  cell.classList.remove("inactive");
  cell.classList.add("resource", "important");
  cell.textContent = "";
  const iconDef = RESOURCE_ICONS[type.key];
  if (iconDef) {
    const icon = setCellIcon(cell, iconDef.file, iconDef.alt);
    if (icon) icon.classList.add("resource-icon");
  } else {
    cell.textContent = type.label;
  }
  resourceByPos[key] = { type, x: entry.x, y: entry.y, key };
}

function applySpecialEntry(entry) {
  const success = setSpecialCell(
    entry.x,
    entry.y,
    entry.label,
    entry.extraClass || null,
    entry.ownerIndex ?? null,
    entry.featureKey ?? null,
    entry.sourceCastleKey ?? null,
    entry.type ? { type: entry.type, mageId: entry.mageId } : {}
  );
  if (!success) return;
  if (entry.disabled) setSpecialCellDisabled(entry.key, true);
  const cell = grid[entry.key];
  if (!cell) return;
  if (entry.extraClass === "mage") {
    setCellIcon(cell, "mage.png", "Mage");
  }
  if (entry.extraClass === "portal") {
    cell.textContent = "";
    setCellIcon(cell, "portal.png", "Портал");
  }
  if (entry.extraClass === "troll-cave") {
    setCellIcon(cell, "troll_cave.png", "Troll cave");
  }
  if (entry.featureKey &&
      typeof applySpecialFeatureIcon === "function" &&
      (entry.featureKey === "lumber" || entry.featureKey === "mine" || entry.featureKey === "clay")) {
    applySpecialFeatureIcon(entry.x, entry.y, entry.featureKey);
  }
}

function applyTreasure(entry) {
  if (!entry) return;
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("treasure", "important");
  cell.textContent = "";
  setCellIcon(cell, "treasure.png", "Treasure");
  treasure = { key, x: entry.x, y: entry.y, elem: cell };
}

function applyFlower(entry) {
  if (!entry) return;
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("flower", "important");
  cell.textContent = "";
  setCellIcon(cell, FLOWER_ICON.file, FLOWER_ICON.alt);
  flowerArtifact = { key, x: entry.x, y: entry.y, elem: cell };
}

function applyClover(entry) {
  if (!entry) return;
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("clover", "important");
  cell.textContent = "";
  setCellIcon(cell, "clover.png", "Clover");
  cloverArtifact = { key, x: entry.x, y: entry.y, elem: cell };
}

function applyFishka(entry) {
  if (!entry) return;
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("fishka", "important");
  cell.textContent = "";
  setCellIcon(cell, "fishka.png", "Фишка Дракона");
  fishka = { key, x: entry.x, y: entry.y, elem: cell, turnsRemaining: entry.turnsRemaining ?? 5 };
}

function applyStone(entry) {
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("stone", "important");
  cell.textContent = "";
  setCellIcon(cell, "stone.png", "Stone");
  stoneByPos[key] = { key, x: entry.x, y: entry.y, turnsRemaining: entry.turnsRemaining };
}

function applyRainbow(entry) {
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("rainbow-stone", "important");
  cell.textContent = "";
  setCellIcon(cell, "rainbow_stone.png", "Rainbow stone");
  rainbowByPos[key] = { key, x: entry.x, y: entry.y, turnsRemaining: entry.turnsRemaining };
}

function applyVoidShard(entry) {
  if (typeof voidShardByPos === "undefined") return;
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("void-shard", "important");
  cell.textContent = "";
  setCellIcon(cell, "void_shard.png", "Void shard");
  voidShardByPos[key] = { key, x: entry.x, y: entry.y, turnsRemaining: entry.turnsRemaining };
}

function applyMaster() {
  const key = MASTER_CELL.key;
  const cell = grid[key];
  if (!cell) return;
  masterActive = true;
  cell.classList.remove("inactive");
  cell.classList.add("master", "important");
  cell.textContent = "";
  setCellIcon(cell, "grand_master.png", "Master");
}

function applyMageSlot(slot) {
  if (!slot || !slot.active || !slot.key) return;
  const cell = grid[slot.key];
  if (!cell) return;
  setSpecialCell(slot.x, slot.y, mageSlot.label, "mage", null, null, null, { type: "mage", mageId: mageSlot.id });
  setCellIcon(cell, "mage.png", "Mage");
  mageSlot.active = true;
  mageSlot.key = slot.key;
  mageSlot.x = slot.x;
  mageSlot.y = slot.y;
  mageSlot.turnsRemaining = slot.turnsRemaining;
  updateMageTimer(mageSlot);
}

function applyBarbarianCell(entry) {
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("important", "barbarian");
  cell.textContent = "";
  cell.setAttribute("data-barbarian", "true");
  setCellIcon(cell, "barbarian_village.png", "Варвары");
  if (!Number.isInteger(entry.attackTimer)) entry.attackTimer = 25;
  if (!Number.isInteger(entry.targetPlayerIndex)) entry.targetPlayerIndex = 0;
  if (!Number.isInteger(entry.spawnTurn)) entry.spawnTurn = typeof turnCounter !== "undefined" ? turnCounter : 0;
  if (!Number.isFinite(Number(entry.growthBonus))) entry.growthBonus = 0;
  if (typeof updateBarbarianTimerVisual === "function") {
    updateBarbarianTimerVisual(entry);
  }
}

function applyMercenary(entry) {
  setCellToMercenary(entry.x, entry.y);
}

function applyThief(entry) {
  setCellToThief(entry.x, entry.y);
}

function applyCutthroat(entry) {
  setCellToCutthroat(entry.x, entry.y);
}

function applyMessenger(entry) {
  setCellToMessenger(entry.x, entry.y);
}

function applyCaravan(entry) {
  setCellToCaravan(entry.x, entry.y);
}

function applyWerewolf(entry) {
  if (!entry) return;
  setCellToWerewolf(entry.x, entry.y);
}

function applyCastleOwnershipVisuals() {
  Object.entries(nodeByPos || {}).forEach(([key, node]) => {
    if (!node || node.type !== "castle" || !node.elem) return;
    const ownerIndex = castleOwnersByKey[key];
    const owner = typeof ownerIndex === "number" ? players[ownerIndex] : null;
    if (owner) {
      node.elem.classList.add("owned");
      node.elem.style.setProperty("--owner-glow", owner.color || "transparent");
    } else {
      node.elem.classList.remove("owned");
      node.elem.style.setProperty("--owner-glow", "transparent");
    }
    if (typeof updateCastleBadge === "function") {
      updateCastleBadge(key);
    }
    if (typeof updateCastleBars === "function") {
      updateCastleBars(key);
    }
  });
}

function applyState(state) {
  applyingRemoteState = true;
  lastStateUpdateAt = Date.now();
  markNetworkEvent("applyState");

  currentPlayerIndex = Object.prototype.hasOwnProperty.call(state, "currentPlayerIndex") ? state.currentPlayerIndex : currentPlayerIndex;
  if (typeof syncPreparedBlockingModalTurn === "function") {
    syncPreparedBlockingModalTurn(currentPlayerIndex);
  }
  movesRemaining = Object.prototype.hasOwnProperty.call(state, "movesRemaining") ? state.movesRemaining : movesRemaining;
  lastRoll = Object.prototype.hasOwnProperty.call(state, "lastRoll") ? state.lastRoll : lastRoll;
  lastRollText = Object.prototype.hasOwnProperty.call(state, "lastRollText") ? state.lastRollText : lastRollText;
  lastDie1 = Object.prototype.hasOwnProperty.call(state, "lastDie1") ? state.lastDie1 : lastDie1;
  lastDie2 = Object.prototype.hasOwnProperty.call(state, "lastDie2") ? state.lastDie2 : lastDie2;
  extraTurnPending = Object.prototype.hasOwnProperty.call(state, "extraTurnPending") ? state.extraTurnPending : extraTurnPending;
  extraTurnReason = Object.prototype.hasOwnProperty.call(state, "extraTurnReason") ? state.extraTurnReason : extraTurnReason;
  justRolledDouble = Object.prototype.hasOwnProperty.call(state, "justRolledDouble") ? state.justRolledDouble : justRolledDouble;
  robberAmbushThisSession = Object.prototype.hasOwnProperty.call(state, "robberAmbushThisSession") ? state.robberAmbushThisSession : robberAmbushThisSession;
  robbersEnabled = Object.prototype.hasOwnProperty.call(state, "robbersEnabled") ? state.robbersEnabled : robbersEnabled;
  turnCounter = Object.prototype.hasOwnProperty.call(state, "turnCounter") ? state.turnCounter : turnCounter;
  turnsUntilResources = Object.prototype.hasOwnProperty.call(state, "turnsUntilResources") ? state.turnsUntilResources : turnsUntilResources;
  turnsUntilTreasure = Object.prototype.hasOwnProperty.call(state, "turnsUntilTreasure") ? state.turnsUntilTreasure : turnsUntilTreasure;
  treasureTurnsRemaining = Object.prototype.hasOwnProperty.call(state, "treasureTurnsRemaining") ? state.treasureTurnsRemaining : treasureTurnsRemaining;
  flowerTurnsRemaining = Object.prototype.hasOwnProperty.call(state, "flowerTurnsRemaining") ? state.flowerTurnsRemaining : flowerTurnsRemaining;
  masterNextSpawnTurn = Object.prototype.hasOwnProperty.call(state, "masterNextSpawnTurn") ? state.masterNextSpawnTurn : masterNextSpawnTurn;
  masterTurnsRemaining = Object.prototype.hasOwnProperty.call(state, "masterTurnsRemaining") ? state.masterTurnsRemaining : masterTurnsRemaining;
  masterActive = Object.prototype.hasOwnProperty.call(state, "masterActive") ? state.masterActive : masterActive;
  barbarianPhaseStarted = Object.prototype.hasOwnProperty.call(state, "barbarianPhaseStarted") ? state.barbarianPhaseStarted : barbarianPhaseStarted;
  robberEvent = Object.prototype.hasOwnProperty.call(state, "robberEvent") ? state.robberEvent : robberEvent;
  gameEnded = Object.prototype.hasOwnProperty.call(state, "gameEnded") ? state.gameEnded : gameEnded;
  gameWinnerIndex = Number.isInteger(state.gameWinnerIndex) ? state.gameWinnerIndex : null;
  gameTimerSeconds = Object.prototype.hasOwnProperty.call(state, "gameTimerSeconds") ? state.gameTimerSeconds : gameTimerSeconds;
  const incomingBattleId = Object.prototype.hasOwnProperty.call(state, "lastBattleId") ? state.lastBattleId : lastBattleId;
  const incomingBattleResult = Object.prototype.hasOwnProperty.call(state, "lastBattleResult") ? state.lastBattleResult : lastBattleResult;
  if (typeof pendingPlayerBattle !== "undefined") {
    pendingPlayerBattle = state.pendingPlayerBattle ? { ...state.pendingPlayerBattle } : null;
  }
  if (typeof playerBattleSequenceId !== "undefined") {
    playerBattleSequenceId = Object.prototype.hasOwnProperty.call(state, "playerBattleSequenceId") ? state.playerBattleSequenceId : playerBattleSequenceId;
  }
  if (typeof playerBattleRevealState !== "undefined") {
    playerBattleRevealState = state.playerBattleRevealState ? { ...state.playerBattleRevealState } : null;
  }
  pendingTurnAdvance = Object.prototype.hasOwnProperty.call(state, "pendingTurnAdvance") ? state.pendingTurnAdvance : pendingTurnAdvance;
  pendingTurnManualOnly = Object.prototype.hasOwnProperty.call(state, "pendingTurnManualOnly") ? state.pendingTurnManualOnly : pendingTurnManualOnly;
  if (typeof pendingTurnRequiresManualConfirm !== "undefined") {
    pendingTurnRequiresManualConfirm = Object.prototype.hasOwnProperty.call(state, "pendingTurnRequiresManualConfirm") ? state.pendingTurnRequiresManualConfirm : pendingTurnRequiresManualConfirm;
  }
  if (Object.prototype.hasOwnProperty.call(state, "deferredPrivateTurnPlayerIndex")) {
    deferredPrivateTurnPlayerIndex = Number.isInteger(state.deferredPrivateTurnPlayerIndex)
      ? state.deferredPrivateTurnPlayerIndex
      : null;
  }
  ballistaModePlayerIndex = Number.isInteger(state.ballistaModePlayerIndex) ? state.ballistaModePlayerIndex : null;
  if (typeof harpoonModePlayerIndex !== "undefined") {
    harpoonModePlayerIndex = Number.isInteger(state.harpoonModePlayerIndex) ? state.harpoonModePlayerIndex : null;
  }
  bridgeModePlayerIndex = Number.isInteger(state.bridgeModePlayerIndex) ? state.bridgeModePlayerIndex : null;
  if (typeof voidShardModePlayerIndex !== "undefined") {
    voidShardModePlayerIndex = Number.isInteger(state.voidShardModePlayerIndex) ? state.voidShardModePlayerIndex : null;
  }
  upperWormhole = Object.prototype.hasOwnProperty.call(state, "upperWormhole") ? state.upperWormhole : upperWormhole;
  wormholeSpawnTurns = Array.isArray(state.wormholeSpawnTurns) ? state.wormholeSpawnTurns.slice() : wormholeSpawnTurns;
  wormholeSpawnIndex = Object.prototype.hasOwnProperty.call(state, "wormholeSpawnIndex") ? state.wormholeSpawnIndex : wormholeSpawnIndex;
  if (Array.isArray(state.rainbowSpawnTurns)) {
    rainbowSpawnTurns.length = 0;
    rainbowSpawnTurns.push(...state.rainbowSpawnTurns);
  }
  if (typeof state.rainbowSpawnIndex === "number") {
    rainbowSpawnIndex = state.rainbowSpawnIndex;
  }
  if (Array.isArray(state.flowerSpawnTurns)) {
    flowerSpawnTurns.length = 0;
    flowerSpawnTurns.push(...state.flowerSpawnTurns);
  }
  if (typeof state.flowerSpawnIndex === "number") {
    flowerSpawnIndex = state.flowerSpawnIndex;
  }
  if (Object.prototype.hasOwnProperty.call(state, "nextStoneSpawnTurn")) {
    nextStoneSpawnTurn = state.nextStoneSpawnTurn;
  }
  if (Array.isArray(state.scheduledWorldEvents)) {
    scheduledWorldEvents = state.scheduledWorldEvents.map(event => ({ ...event }));
  }
  if (Array.isArray(state.scheduledRoyalMessengerTurns)) {
    scheduledRoyalMessengerTurns = state.scheduledRoyalMessengerTurns.slice();
  }
  if (typeof pendingRoyalMessengerEvents !== "undefined") {
    pendingRoyalMessengerEvents = Number.isFinite(state.pendingRoyalMessengerEvents)
      ? Math.max(0, Math.floor(state.pendingRoyalMessengerEvents))
      : pendingRoyalMessengerEvents;
  }
  if (Array.isArray(state.scheduledCaravanTurns)) {
    scheduledCaravanTurns = state.scheduledCaravanTurns.slice();
  }
  if (typeof pendingCaravanEvents !== "undefined") {
    pendingCaravanEvents = Number.isFinite(state.pendingCaravanEvents)
      ? Math.max(0, Math.floor(state.pendingCaravanEvents))
      : pendingCaravanEvents;
  }
  if (Array.isArray(state.scheduledFullMoonTurns)) {
    scheduledFullMoonTurns = state.scheduledFullMoonTurns.slice();
  }
  if (typeof pendingFullMoonEvents !== "undefined") {
    pendingFullMoonEvents = Number.isFinite(state.pendingFullMoonEvents)
      ? Math.max(0, Math.floor(state.pendingFullMoonEvents))
      : pendingFullMoonEvents;
  }
  fullMoonEventState = state.fullMoonEventState ? { ...state.fullMoonEventState } : null;
  if (Array.isArray(state.scheduledFogOfWarTurns)) {
    scheduledFogOfWarTurns = state.scheduledFogOfWarTurns.slice();
  }
  if (typeof pendingFogOfWarEvents !== "undefined") {
    pendingFogOfWarEvents = Number.isFinite(state.pendingFogOfWarEvents)
      ? Math.max(0, Math.floor(state.pendingFogOfWarEvents))
      : pendingFogOfWarEvents;
  }
  fogOfWarState = state.fogOfWarState ? { ...state.fogOfWarState } : null;
  if (Array.isArray(state.activeDayBuffs)) {
    activeDayBuffs = state.activeDayBuffs.slice();
  }
  if (typeof state.prevTimeOfDayKey !== "undefined") {
    prevTimeOfDayKey = state.prevTimeOfDayKey;
  }
  if (state.activeWorldEvents && typeof state.activeWorldEvents === "object") {
    activeWorldEvents = Object.fromEntries(
      Object.entries(state.activeWorldEvents).map(([key, value]) => [key, { ...value }])
    );
  }
  if (typeof normalizeKingAuctionState === "function") {
    kingAuctionState = normalizeKingAuctionState(state.kingAuctionState);
  }
  if (typeof normalizeKingGenerosityState === "function") {
    kingGenerosityState = normalizeKingGenerosityState(state.kingGenerosityState);
  }

  state.players?.forEach((data, idx) => {
    if (!players[idx]) return;
    Object.assign(players[idx], data);
  });

  Object.keys(castleOwnersByKey).forEach(key => delete castleOwnersByKey[key]);
  Object.assign(castleOwnersByKey, state.castleOwnersByKey || {});
  Object.keys(castleStatsByKey).forEach(key => delete castleStatsByKey[key]);
  Object.assign(castleStatsByKey, state.castleStatsByKey || {});
  applyCastleOwnershipVisuals();

  if (Array.isArray(state.guardAccess)) {
    guardAccess.length = 0;
    guardAccess.push(...state.guardAccess);
  }

  if (Array.isArray(state.trollCaves)) {
    state.trollCaves.forEach(cave => {
      const idx = getTrollCaveIndexByKey(cave.key);
      if (idx >= 0) TROLL_CAVES[idx].looted = cave.looted;
    });
  }

  resetDynamicCells();
  (state.specialByPos || []).forEach(applySpecialEntry);
  (state.resourceByPos || []).forEach(applyResourceEntry);

  if (state.treasure) applyTreasure(state.treasure);
  if (state.flowerArtifact) applyFlower(state.flowerArtifact);
  if (state.cloverArtifact) applyClover(state.cloverArtifact);
  if (state.fishka && typeof applyFishka === "function") applyFishka(state.fishka);
  if (Object.prototype.hasOwnProperty.call(state, "nextFishkaSpawnTurn") && typeof nextFishkaSpawnTurn !== "undefined") {
    nextFishkaSpawnTurn = state.nextFishkaSpawnTurn;
  }
  cloverTurnsRemaining = Object.prototype.hasOwnProperty.call(state, "cloverTurnsRemaining") ? state.cloverTurnsRemaining : cloverTurnsRemaining;
  nextCloverSpawnTurn = Object.prototype.hasOwnProperty.call(state, "nextCloverSpawnTurn") ? state.nextCloverSpawnTurn : nextCloverSpawnTurn;

  (state.stoneByPos || []).forEach(applyStone);
  (state.rainbowByPos || []).forEach(applyRainbow);
  (state.voidShardByPos || []).forEach(applyVoidShard);
  if (typeof voidShardSpawnTurn !== "undefined") {
    voidShardSpawnTurn = Object.prototype.hasOwnProperty.call(state, "voidShardSpawnTurn") ? state.voidShardSpawnTurn : voidShardSpawnTurn;
  }

  if (state.portalState && typeof portalState !== "undefined" && portalState) {
    portalState.active = Boolean(state.portalState.active);
    portalState.keys = Array.isArray(state.portalState.keys) ? state.portalState.keys.slice() : [];
    portalState.turnsRemaining = Object.prototype.hasOwnProperty.call(state.portalState, "turnsRemaining") ? state.portalState.turnsRemaining : portalState.turnsRemaining;
    portalState.nextSpawnTurn = Object.prototype.hasOwnProperty.call(state.portalState, "nextSpawnTurn") ? state.portalState.nextSpawnTurn : portalState.nextSpawnTurn;
  }

  if (state.masterActive) applyMaster();

  if (state.mageSlot) {
    mageSlot.nextSpawnTurn = Object.prototype.hasOwnProperty.call(state.mageSlot, "nextSpawnTurn") ? state.mageSlot.nextSpawnTurn : mageSlot.nextSpawnTurn;
    applyMageSlot(state.mageSlot);
  }

  if (state.trollState) {
    trollState = Object.assign(trollState, state.trollState);
    trollState.prevKey = null;
    updateTrollVisual();
  }
  if (state.trollCaveInteriorState && typeof trollCaveInteriorState !== "undefined") {
    trollCaveInteriorState = shallowClone(state.trollCaveInteriorState);
  }

  barbarianCells.length = 0;
  (state.barbarianCells || []).forEach(entry => {
    applyBarbarianCell(entry);
    barbarianCells.push(entry);
  });
  barbarianRespawnTimers.length = 0;
  if (Array.isArray(state.barbarianRespawnTimers)) {
    barbarianRespawnTimers.push(...state.barbarianRespawnTimers);
  }

  mercenaries.length = 0;
  (state.mercenaries || []).forEach(entry => {
    applyMercenary(entry);
    mercenaries.push(entry);
  });
  mercenaryIdCounter = Object.prototype.hasOwnProperty.call(state, "mercenaryIdCounter") ? state.mercenaryIdCounter : mercenaryIdCounter;

  thieves.length = 0;
  (state.thieves || []).forEach(entry => {
    applyThief(entry);
    thieves.push(entry);
  });
  thiefIdCounter = Object.prototype.hasOwnProperty.call(state, "thiefIdCounter") ? state.thiefIdCounter : thiefIdCounter;

  cutthroats.length = 0;
  (state.cutthroats || []).forEach(entry => {
    applyCutthroat(entry);
    cutthroats.push(entry);
  });
  cutthroatIdCounter = Object.prototype.hasOwnProperty.call(state, "cutthroatIdCounter") ? state.cutthroatIdCounter : cutthroatIdCounter;

  messengers.length = 0;
  (state.messengers || []).forEach(entry => {
    applyMessenger(entry);
    messengers.push(entry);
  });
  messengerIdCounter = Object.prototype.hasOwnProperty.call(state, "messengerIdCounter") ? state.messengerIdCounter : messengerIdCounter;

  caravans.length = 0;
  (state.caravans || []).forEach(entry => {
    applyCaravan(entry);
    caravans.push(entry);
  });
  caravanIdCounter = Object.prototype.hasOwnProperty.call(state, "caravanIdCounter") ? state.caravanIdCounter : caravanIdCounter;

  werewolfState = state.werewolfState ? { ...state.werewolfState } : null;
  if (werewolfState) {
    applyWerewolf(werewolfState);
  }

  if (typeof trapStunFields !== "undefined") {
    trapStunFields.length = 0;
    (state.trapStunFields || []).forEach(entry => {
      trapStunFields.push({
        id: entry.id,
        ownerIndex: entry.ownerIndex,
        anchorKey: entry.anchorKey,
        keys: Array.isArray(entry.keys) ? entry.keys.slice() : []
      });
    });
  }
  if (typeof trapStunIdCounter !== "undefined") {
    trapStunIdCounter = Object.prototype.hasOwnProperty.call(state, "trapStunIdCounter") ? state.trapStunIdCounter : trapStunIdCounter;
  }
  if (typeof bridgeOpenedKeys !== "undefined") {
    bridgeOpenedKeys.clear();
    (state.bridgeOpenedKeys || []).forEach(key => bridgeOpenedKeys.add(key));
  }
  if (typeof renderTrapStunFields === "function") {
    renderTrapStunFields();
  }

  clearReachable();
  const modeViewerIndex = typeof localPlayerIndex === "number" ? localPlayerIndex : currentPlayerIndex;
  if (ballistaModePlayerIndex === modeViewerIndex && typeof showBallistaRange === "function") {
    showBallistaRange(ballistaModePlayerIndex);
  } else if (typeof harpoonModePlayerIndex !== "undefined" && harpoonModePlayerIndex === modeViewerIndex && typeof showHarpoonTargets === "function") {
    showHarpoonTargets(harpoonModePlayerIndex);
  } else {
    showReachable();
  }

  updatePanelTitles();
  updatePawns();
  players.forEach((_, idx) => {
    updatePlayerResources(idx);
    updateInventory(idx);
  });
  if (typeof castleModal !== "undefined" &&
      castleModal &&
      castleModal.style.display === "flex" &&
      typeof refreshCastleModal === "function" &&
      typeof castleModalKey !== "undefined" &&
      castleModalKey &&
      typeof castleModalPlayerIndex === "number") {
    refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  }
  if (typeof hireModal !== "undefined" &&
      hireModal &&
      hireModal.style.display === "flex" &&
      typeof openHire === "function" &&
      typeof hirePlayerIndex === "number") {
    openHire(hirePlayerIndex);
  }
  if (typeof pendingTavernPlayerIndex === "number") {
    if (typeof syncTavernModalState === "function") syncTavernModalState(pendingTavernPlayerIndex);
    if (typeof syncTavernWheelModalState === "function") syncTavernWheelModalState(pendingTavernPlayerIndex);
    if (typeof syncTavernDragonModalState === "function") syncTavernDragonModalState(pendingTavernPlayerIndex);
    if (typeof syncTavernFishkaModalState === "function") syncTavernFishkaModalState(pendingTavernPlayerIndex);
  }
  if (typeof refreshVisibleWorld === "function") {
    refreshVisibleWorld();
  }
  if (gameEnded && typeof showGameOver === "function") {
    showGameOver(gameWinnerIndex);
  }
  updateTurnUI();
  updateStatusPanel();
  if (typeof syncKingAuctionModalVisibility === "function") {
    syncKingAuctionModalVisibility();
  }
  if (typeof syncKingGenerosityModalVisibility === "function") {
    syncKingGenerosityModalVisibility();
  }
  if (typeof syncPlayerBattleCardModalFromState === "function") {
    syncPlayerBattleCardModalFromState();
  }
  maybeAcknowledgeDeferredTurnBlock("applyState");
  if (incomingBattleId !== lastBattleId) {
    lastBattleId = incomingBattleId;
    lastBattleResult = incomingBattleResult;
    if (lastBattleResult) {
      showBattleModal(lastBattleResult, true);
    }
  }
  if (typeof updateRobberToggleButtons === "function") {
    updateRobberToggleButtons();
  }
  if (typeof updateRobberModalVisibility === "function") {
    updateRobberModalVisibility();
  }
  if (gameTimerDisplay) {
    const timerLabel = typeof GAME_TIMER_LABEL === "string" && GAME_TIMER_LABEL
      ? GAME_TIMER_LABEL
      : "ВРЕМЯ";
    gameTimerDisplay.textContent = `${timerLabel}: ${formatTime(gameTimerSeconds)}`;
  }

  applyingRemoteState = false;
  updateDebugOverlay();
}

function getActionFromEvent(e) {
  const target = e.target;
  if (!target) return null;

  if (game && game.contains(target)) {
    const rect = game.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const gridX = Math.floor(clickX / cellSize);
    const gridY = Math.floor(clickY / cellSize);
    const dimensions = typeof getVisibleWorldDimensions === "function"
      ? getVisibleWorldDimensions()
      : { cols: COLS, rows: ROWS };
    if (gridX >= 0 && gridX < dimensions.cols && gridY >= 0 && gridY < dimensions.rows) {
      return { type: "game_click", x: gridX, y: gridY };
    }
  }

  const clickable = target.closest(
    "#rollBtn, #endTurnBtn, #newGameBtn, button, [data-buy], [data-lavka-buy], [data-workshop-buy], [data-hire], [data-city-reward], [data-city-exchange], [data-castle-feature], [data-castle-storage]"
  );
  if (!clickable) return null;

  const action = { type: "dom_click" };
  if (clickable.id === "castleDepositBtn" || clickable.id === "castleWithdrawBtn") {
    const inputId = clickable.id === "castleDepositBtn" ? "castleDepositInput" : "castleWithdrawInput";
    const input = document.getElementById(inputId);
    action.inputId = inputId;
    action.inputValue = input ? input.value : "";
  }

  if (clickable.id) {
    action.id = clickable.id;
    return action;
  }

  const dataKeys = [
    "buy",
    "lavkaBuy",
    "workshopBuy",
    "hire",
    "cityReward",
    "cityExchange",
    "castleFeature",
    "castleStorage"
  ];
  for (const key of dataKeys) {
    const dataValue = clickable.dataset[key];
    if (dataValue) {
      action.dataKey = key;
      action.dataValue = dataValue;
      return action;
    }
  }

  return null;
}

function performHostAction(action) {
  if (!action) return;
  if (action.type === "dom_click" && action.id === "endTurnBtn") {
    deferredPrivateTurnPlayerIndex = null;
    if (typeof refreshTurnControls === "function") {
      refreshTurnControls();
    }
  }
  performingRemoteAction = true;
  lastHostActionAt = Date.now();
  if (action.type === "dom_click" && action.id === "endTurnBtn") {
    pushDebugLog(`hostEndTurnClick:p${currentPlayerIndex}`);
    markNetworkEvent("hostEndTurnClick");
  }
  if (action.type === "private_ui_action") {
    performPrivateUiAction(action);
    performingRemoteAction = false;
    updateDebugOverlay();
    return;
  }
  if (action.type === "game_click") {
    const rect = game.getBoundingClientRect();
    const clickX = rect.left + (action.x + 0.5) * cellSize;
    const clickY = rect.top + (action.y + 0.5) * cellSize;
    const evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: clickX,
      clientY: clickY
    });
    game.dispatchEvent(evt);
    performingRemoteAction = false;
    updateDebugOverlay();
    return;
  }
  if (action.type === "dom_click") {
    if (action.id === "endTurnBtn" && typeof tryFinishPendingTurn === "function") {
      tryFinishPendingTurn(true);
      performingRemoteAction = false;
      updateDebugOverlay();
      return;
    }
    let el = null;
    if (action.inputId) {
      const input = document.getElementById(action.inputId);
      if (input) {
        input.value = action.inputValue ?? "";
      }
    }
    if (action.id) {
      el = document.getElementById(action.id);
    } else if (action.dataKey) {
      const attr = action.dataKey.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      el = document.querySelector(`[data-${attr}="${action.dataValue}"]`);
    }
    if (el) el.click();
  }
  performingRemoteAction = false;
  updateDebugOverlay();
}

function performPrivateUiAction(action) {
  const modalType = String(action?.modalType || "").trim();
  const actionType = String(action?.actionType || "").trim();
  const playerIndex = Number(action?.playerIndex);
  const payload = action?.payload || {};
  if (modalType === "turnBlock" && actionType === "close") {
    pushDebugLog(`turnBlockCloseRecv:p${playerIndex}:defer=${deferredPrivateTurnPlayerIndex}`);
    const matchesDeferredPlayer =
      !Number.isInteger(playerIndex) ||
      deferredPrivateTurnPlayerIndex === playerIndex;
    if (!matchesDeferredPlayer) {
      pushDebugLog(`turnBlockCloseIgnored:p${playerIndex}:defer=${deferredPrivateTurnPlayerIndex}`);
      return;
    }
    deferredPrivateTurnPlayerIndex = null;
    if (typeof resumeTurnFlowAfterModalChange === "function") {
      resumeTurnFlowAfterModalChange();
    } else if (typeof refreshTurnControls === "function") {
      refreshTurnControls();
    }
    return;
  }
  currentPrivateUiPlayerIndex = Number.isInteger(playerIndex) ? playerIndex : null;
  try {
    const clickBySelector = selector => {
      const elem = document.querySelector(selector);
      if (elem) elem.click();
    };
    if (modalType === "hire") {
      if (Number.isInteger(playerIndex)) {
        hirePlayerIndex = playerIndex;
      }
      if (actionType === "buy" && typeof buyHireOption === "function") {
        buyHireOption(payload.hireType);
        return;
      }
    }
    if (modalType === "castle") {
      if (payload.key) {
        castleModalKey = payload.key;
      }
      if (Number.isInteger(playerIndex)) {
        castleModalPlayerIndex = playerIndex;
      }
      if (castleModalKey && Number.isInteger(castleModalPlayerIndex) && typeof refreshCastleModal === "function") {
        refreshCastleModal(castleModalKey, castleModalPlayerIndex);
      }
      if (actionType === "buyFeature" && typeof buyCastleFeature === "function") {
        buyCastleFeature(payload.featureKey);
        return;
      }
      if (actionType === "buyBallista" && typeof buyCastleBallista === "function") {
        buyCastleBallista();
        return;
      }
      if (actionType === "upgradeBallista" && typeof upgradeCastleBallista === "function") {
        upgradeCastleBallista();
        return;
      }
      if (actionType === "buyBolt" && typeof buyCastleBolt === "function") {
        buyCastleBolt();
        return;
      }
      if (actionType === "buyTrapStun" && typeof buyCastleTrapStun === "function") {
        buyCastleTrapStun();
        return;
      }
      if (actionType === "buyBridge" && typeof buyCastleBridge === "function") {
        buyCastleBridge();
        return;
      }
      if (actionType === "depositArmy" && typeof depositCastleArmy === "function") {
        depositCastleArmy(payload.amount);
        return;
      }
      if (actionType === "withdrawArmy" && typeof withdrawCastleArmy === "function") {
        withdrawCastleArmy(payload.amount);
        return;
      }
      if (actionType === "upgrade" && typeof upgradeCastleLevel === "function") {
        upgradeCastleLevel();
      }
      if (actionType === "builderCharge") {
        clickBySelector("#castleBuilderChargeBtn");
      }
      return;
    }
    if (modalType === "tavern") {
      if (Number.isInteger(playerIndex)) {
        pendingTavernPlayerIndex = playerIndex;
      }
      if (actionType === "drinkBeer" && typeof drinkTavernBeer === "function") {
        drinkTavernBeer(playerIndex);
        return;
      }
      if (actionType === "spinWheel" && typeof startTavernWheelSpin === "function") {
        startTavernWheelSpin(playerIndex, payload.bet, payload.color);
        return;
      }
      if (actionType === "startDragon" && typeof startTavernDragonGame === "function") {
        startTavernDragonGame(playerIndex, payload.bet);
        return;
      }
      if (actionType === "cashoutDragon" && typeof cashOutTavernDragon === "function") {
        cashOutTavernDragon(playerIndex);
        return;
      }
      if (actionType === "openFishka" && typeof openTavernFishkaModal === "function") {
        openTavernFishkaModal();
        if (typeof broadcastTavernSpectatorEvent === "function") {
          broadcastTavernSpectatorEvent(playerIndex, "tavernSpectatorFishkaShow", { playerIndex });
        }
        return;
      }
      if (actionType === "backFromFishka" && typeof returnFromTavernFishka === "function") {
        returnFromTavernFishka();
        if (typeof broadcastTavernSpectatorEvent === "function") {
          broadcastTavernSpectatorEvent(playerIndex, "tavernSpectatorShow", { playerIndex });
        }
        return;
      }
      if (actionType === "spinFishka" && typeof startTavernFishkaSpin === "function") {
        startTavernFishkaSpin(playerIndex);
        return;
      }
      if (actionType === "closeTavern" && typeof closeTavernModal === "function") {
        const canCloseTavern = !(typeof tavernWheelVisualInProgress !== "undefined" && tavernWheelVisualInProgress) &&
          !(typeof tavernDragonVisualInProgress !== "undefined" && tavernDragonVisualInProgress) &&
          !(typeof tavernFishkaVisualInProgress !== "undefined" && tavernFishkaVisualInProgress) &&
          !(typeof tavernWheelRound !== "undefined" && tavernWheelRound) &&
          !(typeof tavernDragonRound !== "undefined" && tavernDragonRound) &&
          !(typeof tavernFishkaRound !== "undefined" && tavernFishkaRound);
        closeTavernModal();
        if (canCloseTavern && typeof broadcastTavernSpectatorEvent === "function") {
          broadcastTavernSpectatorEvent(playerIndex, "tavernSpectatorClose", { playerIndex });
        }
        return;
      }
      if (actionType === "openWheel" && typeof openTavernWheelModal === "function") {
        openTavernWheelModal();
        if (typeof broadcastTavernSpectatorEvent === "function") {
          broadcastTavernSpectatorEvent(playerIndex, "tavernSpectatorWheelShow", { playerIndex });
        }
        return;
      }
      if (actionType === "openDragon" && typeof openTavernDragonModal === "function") {
        openTavernDragonModal();
        if (typeof broadcastTavernSpectatorEvent === "function") {
          broadcastTavernSpectatorEvent(playerIndex, "tavernSpectatorDragonShow", { playerIndex });
        }
        return;
      }
      if (actionType === "backFromWheel" && typeof returnFromTavernWheel === "function") {
        returnFromTavernWheel();
        if (typeof broadcastTavernSpectatorEvent === "function") {
          broadcastTavernSpectatorEvent(playerIndex, "tavernSpectatorShow", { playerIndex });
        }
        return;
      }
      if (actionType === "backFromDragon" && typeof returnFromTavernDragon === "function") {
        returnFromTavernDragon();
        if (typeof broadcastTavernSpectatorEvent === "function") {
          broadcastTavernSpectatorEvent(playerIndex, "tavernSpectatorShow", { playerIndex });
        }
        return;
      }
      return;
    }
    if (modalType === "caveEntrance") {
      if (actionType === "enter" && typeof executeCaveEntranceEnter === "function") {
        executeCaveEntranceEnter(playerIndex, payload.caveIndex);
        return;
      }
      if (actionType === "attack" && typeof executeCaveEntranceAttack === "function") {
        executeCaveEntranceAttack(playerIndex, payload.defenderIndex, payload.gridX, payload.gridY);
      }
      return;
    }
    if (modalType === "inventory") {
      if (actionType === "cancelBallista" && typeof cancelBallistaMode === "function") {
        cancelBallistaMode(playerIndex);
        return;
      }
      if (actionType === "cancelHarpoon" && typeof cancelHarpoonMode === "function") {
        cancelHarpoonMode(playerIndex);
        return;
      }
      if (actionType === "cancelBridge" && typeof cancelBridgeMode === "function") {
        cancelBridgeMode(playerIndex);
        return;
      }
      if (actionType === "cancelVoidShard" && typeof cancelVoidShardMode === "function") {
        cancelVoidShardMode(playerIndex);
        return;
      }
      if (actionType === "use" && payload.useAction && typeof applyPotion === "function") {
        applyPotion(playerIndex, payload.useAction);
      }
      return;
    }
    if (modalType === "playerBattle") {
      if (actionType === "chooseCard" && typeof submitPlayerBattleCard === "function") {
        submitPlayerBattleCard(playerIndex, payload.cardKey, payload.battleId);
      }
      return;
    }
    if (modalType === "kingAuction") {
      if (actionType === "submit" && typeof submitKingAuctionBid === "function") {
        submitKingAuctionBid(playerIndex, payload.amount);
      }
      return;
    }
    if (modalType === "kingGenerosity") {
      if (actionType === "claim" && typeof selectKingGenerosityGift === "function") {
        selectKingGenerosityGift(playerIndex, payload.giftKey);
      }
      return;
    }
    if (modalType === "barracks") {
      if (Number.isInteger(playerIndex)) {
        barracksPlayerIndex = playerIndex;
        if (typeof syncBarracksModalState === "function") {
          syncBarracksModalState(playerIndex);
        }
      }
      if (actionType === "buy" && payload.buyType) {
        clickBySelector(`[data-buy="${payload.buyType}"]`);
      }
      return;
    }
    if (modalType === "lavka") {
      if (Number.isInteger(playerIndex)) {
        lavkaPlayerIndex = playerIndex;
        if (typeof syncLavkaModalState === "function") {
          syncLavkaModalState(playerIndex);
        }
      }
      if (actionType === "buy" && payload.buyType) {
        clickBySelector(`[data-lavka-buy="${payload.buyType}"]`);
      }
      return;
    }
    if (modalType === "workshop") {
      if (Number.isInteger(playerIndex)) {
        workshopPlayerIndex = playerIndex;
        if (typeof syncWorkshopModalState === "function") {
          syncWorkshopModalState(playerIndex);
        }
      }
      if (actionType === "buy" && payload.buyType) {
        clickBySelector(`[data-workshop-buy="${payload.buyType}"]`);
      }
      return;
    }
    if (modalType === "city") {
      if (Number.isInteger(playerIndex)) {
        cityPlayerIndex = playerIndex;
        if (typeof syncCityModalState === "function") {
          syncCityModalState(playerIndex);
        }
      }
      if (actionType === "reward" && payload.rewardType) {
        clickBySelector(`[data-city-reward="${payload.rewardType}"]`);
        return;
      }
      if (actionType === "exchange" && payload.exchangeType) {
        clickBySelector(`[data-city-exchange="${payload.exchangeType}"]`);
        return;
      }
      if (actionType === "poison" && typeof handleCityPoisonUse === "function") {
        handleCityPoisonUse();
        return;
      }
    }
    if (modalType === "master") {
      if (Number.isInteger(playerIndex)) {
        pendingMasterPlayerIndex = playerIndex;
        if (typeof syncMasterModalState === "function") {
          syncMasterModalState(playerIndex);
        }
      }
      if (actionType === "buyHilt") clickBySelector("#masterBuyHilt");
      if (actionType === "buyGold") clickBySelector("#masterBuyGold");
      if (actionType === "buyToken") clickBySelector("#masterBuyToken");
      if (actionType === "buyGoldRainbow") clickBySelector("#masterBuyGoldRainbow");
      if (actionType === "buyTerrorRing") clickBySelector("#masterBuyTerrorRing");
      return;
    }
    if (modalType === "mage") {
      if (payload.mageId && typeof getMageSlotById === "function") {
        pendingMageSlot = getMageSlotById(payload.mageId);
      }
      if (Number.isInteger(playerIndex)) {
        pendingMagePlayerIndex = playerIndex;
        if (typeof updateMageActionButtons === "function") {
          updateMageActionButtons(playerIndex);
        }
      }
      if (actionType === "act" && payload.action) {
        clickBySelector(`[data-mage-action="${payload.action}"]`);
      }
      return;
    }
    if (modalType === "stone") {
      if (payload.key) {
        pendingStoneKey = payload.key;
      }
      if (Number.isInteger(playerIndex)) {
        pendingStonePlayerIndex = playerIndex;
      }
      if (actionType === "touch") {
        clickBySelector("#stoneTouchBtn");
      }
      if (actionType === "pickup") {
        clickBySelector("#stonePickupBtn");
      }
      return;
    }
    if (modalType === "repair") {
      if (actionType === "confirm") {
        clickBySelector("#repairConfirm");
      }
      return;
    }
    if (modalType === "messenger") {
      if (payload.messengerId) {
        pendingMessengerInteraction = {
          messengerId: payload.messengerId,
          playerIndex
        };
      }
      if (actionType === "confirm") {
        clickBySelector("#messengerConfirm");
      }
      return;
    }
    if (modalType === "guard") {
      if (payload.move) {
        pendingGuardMove = payload.move;
      }
      if (Number.isInteger(playerIndex)) {
        pendingGuardPlayerIndex = playerIndex;
        if (typeof updateGuardModalButtons === "function") {
          updateGuardModalButtons(playerIndex, Boolean(guardAccess?.[playerIndex]));
        }
      }
      if (actionType === "gold") clickBySelector("#guardBribeBtn");
      if (actionType === "influence") clickBySelector("#guardInfluenceBtn");
      if (actionType === "pass" && typeof handleGuardPass === "function") {
        handleGuardPass();
      }
    }
  } finally {
    currentPrivateUiPlayerIndex = null;
  }
}

function emitPrivateUiActionToHost(action) {
  if (!socket || !onlineMatchStarted || isHost) return false;
  socket.emit("clientAction", { type: "private_ui_action", ...action });
  pushDebugLog(`clientPrivateUi:${action?.modalType || "-"}:${action?.actionType || "-"}`);
  markNetworkEvent(`clientPrivateUi:${action?.modalType || "-"}`);
  return true;
}

function forceStartHostTurn() {
  if (!onlineMatchStarted || !isHost) return;
  if (typeof doRoll !== "function") return;
  if (movesRemaining > 0) return;
  pushDebugLog("forceStartHostTurn");
  markNetworkEvent("forceStartHostTurn");
  doRoll();
  emitStateNow(true);
}

function emitPrivateUiToPlayer(playerIndex, type, payload = {}) {
  if (!socket || !onlineMatchStarted || !isHost) return false;
  if (
    Number.isInteger(playerIndex) &&
    /Modal$/.test(String(type)) &&
    String(type) !== "showWorldEventModal"
  ) {
    deferredPrivateTurnPlayerIndex = playerIndex;
  }
  pushDebugLog(`privateUi:${type}:p${playerIndex}:defer=${deferredPrivateTurnPlayerIndex}`);
  socket.emit("privateUi", { playerIndex, type, payload });
  markNetworkEvent(`privateUi:${type}`);
  return true;
}

if (copyDebugLogBtn && debugOverlayText) {
  copyDebugLogBtn.addEventListener("click", async () => {
    const text = debugOverlayText.value || "";
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        debugOverlayText.focus();
        debugOverlayText.select();
        document.execCommand("copy");
      }
      copyDebugLogBtn.textContent = "Скопировано";
      setTimeout(() => {
        copyDebugLogBtn.textContent = "Копировать";
      }, 1200);
    } catch (err) {
      pushDebugLog(`copyFailed:${err?.message || err}`);
      updateDebugOverlay();
    }
  });
}

if (debugOpenBtn && debugOverlay) {
  debugOpenBtn.addEventListener("click", () => {
    debugOverlay.classList.add("open");
    updateDebugOverlay();
  });
}

if (closeDebugLogBtn && debugOverlay) {
  closeDebugLogBtn.addEventListener("click", () => {
    debugOverlay.classList.remove("open");
  });
}

if (heroSlot0Btn && socket) {
  heroSlot0Btn.addEventListener("click", () => {
    socket.emit("selectHero", { heroIndex: 0 });
  });
}

if (heroSlot1Btn && socket) {
  heroSlot1Btn.addEventListener("click", () => {
    socket.emit("selectHero", { heroIndex: 1 });
  });
}

if (resetLobbyBtn && socket) {
  resetLobbyBtn.addEventListener("click", () => {
    socket.emit("resetLobby");
    setLobbyStatus("Сбрасываем лобби...");
  });
}

if (pauseGameBtn && socket) {
  pauseGameBtn.addEventListener("click", () => {
    if (!onlineMatchStarted) return;
    socket.emit("togglePause", { paused: true });
  });
}

if (resumeGameBtn && socket) {
  resumeGameBtn.addEventListener("click", () => {
    socket.emit("togglePause", { paused: false });
  });
}

lockGameUi(Boolean(socket));

if (socket) {
  socket.on("connect", () => {
    pushDebugLog(`connect:${socket.id}`);
    markNetworkEvent("connect");
    if (!onlineMatchStarted && !currentRoomCode) {
      setLobbyStatus("Подключено. Загружаем общее лобби...");
    }
    updateDebugOverlay();
  });

  socket.on("disconnect", reason => {
    pushDebugLog(`disconnect:${reason || "unknown"}`);
    markNetworkEvent("disconnect");
    if (onlineMatchStarted) {
      setLobbyStatus("Connection lost. Trying to reconnect to the match...");
    } else {
      setLobbyStatus("Connection lost. Trying to reconnect...");
      lockGameUi(true);
    }
    updateDebugOverlay();
  });

  socket.on("roomError", payload => {
    pushDebugLog(`roomError:${payload?.message || "Room error."}`);
    markNetworkEvent("roomError");
    showRoomError(payload?.message || "Room error.");
    updateDebugOverlay();
  });

  socket.on("lobbyState", payload => {
    pushDebugLog(`lobbyState:started=${Boolean(payload?.started)} yourSlot=${payload?.yourSlot}`);
    markNetworkEvent("lobbyState");
    applyLobbyState(payload);
    updateDebugOverlay();
  });

  socket.on("matchStarted", payload => {
    pushDebugLog(`matchStarted:host=${Boolean(payload?.isHost)} player=${payload?.localPlayerIndex} resumed=${Boolean(payload?.resumed)}`);
    markNetworkEvent("matchStarted");
    onlineMatchStarted = true;
    isHost = Boolean(payload?.isHost);
    localPlayerIndex = Number.isInteger(payload?.localPlayerIndex) ? payload.localPlayerIndex : null;
    currentRoomCode = payload?.roomCode || currentRoomCode;
    applyPauseState(Boolean(payload?.paused));
    lastStateFingerprint = "";
    lastEmitAt = 0;
    setLobbyStatus("Матч начался.");
    lockGameUi(false);
    updatePanelTitles();
    const resumed = Boolean(payload?.resumed);
    if (!resumed) {
      resetGameState();
    }
    updateDebugOverlay();
    if (isHost && !resumed) {
      setTimeout(() => emitStateNow(true), 0);
      setTimeout(() => {
        forceStartHostTurn();
      }, 150);
      setTimeout(() => {
        if (lastDie1 === null && lastDie2 === null && movesRemaining <= 0) {
          forceStartHostTurn();
        }
      }, 900);
    }
  });

  socket.on("hostAction", action => {
    if (!onlineMatchStarted) return;
    if (!isHost) {
      return;
    }
    lastHostActionAt = Date.now();
    if (action.type === "dom_click" && action.id === "endTurnBtn") {
      pushDebugLog(`hostAction:endTurn:p${currentPlayerIndex}`);
      markNetworkEvent("hostAction:endTurn");
    }
    performHostAction(action);
    setTimeout(() => emitStateNow(true), 0);
  });

  socket.on("stateUpdate", state => {
    if (!onlineMatchStarted || isHost) return;
    if (!state || applyingRemoteState) return;
    lastStateUpdateAt = Date.now();
    applyState(state);
  });

  socket.on("resumeState", state => {
    if (!state || applyingRemoteState) return;
    lastStateUpdateAt = Date.now();
    applyState(state);
    if (isHost && typeof scheduleAutoRoll === "function") {
      scheduleAutoRoll();
    }
  });

  socket.on("pauseState", payload => {
    applyPauseState(Boolean(payload?.paused));
    pushDebugLog(`pauseState:${Boolean(payload?.paused)}`);
    markNetworkEvent(`pauseState:${Boolean(payload?.paused) ? "on" : "off"}`);
  });

  socket.on("sharedToast", payload => {
    const text = String(payload?.text || "").trim();
    if (!text) return;
    pushDebugLog(`sharedToast:${text}`);
    markNetworkEvent("sharedToast");
    if (typeof showPickupToast === "function") {
      showPickupToast(text, { skipBroadcast: true });
    }
  });

  socket.on("privateUi", message => {
    const type = String(message?.type || "").trim();
    const payload = message?.payload || {};
    const targetPlayerIndex = Number(message?.playerIndex);
    if (!type) return;
    pushDebugLog(`privateUiRecv:${type}:p${targetPlayerIndex}`);
    markNetworkEvent(`privateUiRecv:${type}`);
    if (
      /Modal$/.test(type) &&
      type !== "showWorldEventModal" &&
      Number.isInteger(targetPlayerIndex) &&
      targetPlayerIndex === localPlayerIndex
    ) {
      delegatedTurnBlockPlayerIndex = targetPlayerIndex;
      pushDebugLog(`delegatedTurnBlockOpen:p${targetPlayerIndex}`);
    }
    if (type === "flashPrice" && typeof flashPrice === "function") {
      const selector = String(payload.selector || "").trim();
      if (!selector) return;
      const scheduleFlash = () => {
        const btn = document.querySelector(selector);
        if (!btn) return;
        flashPrice(
          btn,
          payload.amountText,
          payload.iconSrc,
          payload.iconAlt
        );
      };
      if (typeof requestAnimationFrame === "function") {
        setTimeout(() => {
          requestAnimationFrame(() => requestAnimationFrame(scheduleFlash));
        }, 120);
      } else {
        setTimeout(scheduleFlash, 120);
      }
      return;
    }
    if (type === "showBattleModal" && typeof showBattleModal === "function") {
      showBattleModal(payload.result, true);
      return;
    }
    if (type === "showPlayerBattleCards" && typeof openPlayerBattleCardModal === "function") {
      openPlayerBattleCardModal(payload.playerIndex, payload.battle);
      return;
    }
    if (type === "revealPlayerBattleCards" && typeof showPlayerBattleCardReveal === "function") {
      showPlayerBattleCardReveal(payload);
      return;
    }
    if (type === "hidePlayerBattleCards" && typeof closePlayerBattleCardModal === "function") {
      closePlayerBattleCardModal();
      return;
    }
    if (type === "showPickupToast" && typeof showPickupToast === "function") {
      showPickupToast(String(payload.text || ""), { skipBroadcast: true });
      return;
    }
    if (type === "showWorldEventModal" && typeof enqueueWorldEventModal === "function") {
      enqueueWorldEventModal({
        title: String(payload.title || "СОБЫТИЕ"),
        text: String(payload.text || "")
      });
      return;
    }
    if (type === "showKingAuctionModal" && typeof openKingAuctionModal === "function") {
      openKingAuctionModal(payload.playerIndex);
      return;
    }
    if (type === "showKingGenerosityModal" && typeof openKingGenerosityModal === "function") {
      openKingGenerosityModal(payload.playerIndex);
      return;
    }
    if (type === "activateBallistaMode") {
      if (Number.isInteger(payload.playerIndex)) {
        ballistaModePlayerIndex = payload.playerIndex;
        if (typeof showBallistaRange === "function") {
          showBallistaRange(payload.playerIndex);
        }
        if (typeof updateInventory === "function") {
          updateInventory(payload.playerIndex);
        }
      }
      return;
    }
    if (type === "animateBallistaBolt") {
      if (typeof animateBallistaBolt === "function" && typeof payload.fromX === "number") {
        animateBallistaBolt(payload.fromX, payload.fromY, payload.toX, payload.toY, null);
      }
      return;
    }
    if (type === "clearBallistaMode") {
      if (!Number.isInteger(payload.playerIndex) || ballistaModePlayerIndex === payload.playerIndex) {
        ballistaModePlayerIndex = null;
      }
      if (typeof clearReachable === "function") {
        clearReachable();
      }
      if (typeof showReachable === "function") {
        showReachable();
      }
      if (Number.isInteger(payload.playerIndex) && typeof updateInventory === "function") {
        updateInventory(payload.playerIndex);
      }
      return;
    }
    if (type === "activateHarpoonMode") {
      if (typeof harpoonModePlayerIndex !== "undefined" && Number.isInteger(payload.playerIndex)) {
        harpoonModePlayerIndex = payload.playerIndex;
        if (typeof showHarpoonTargets === "function") {
          showHarpoonTargets(payload.playerIndex);
        }
        if (typeof updateInventory === "function") {
          updateInventory(payload.playerIndex);
        }
      }
      return;
    }
    if (type === "animateHarpoonPickup") {
      if (typeof animateHarpoonPickup === "function" && typeof payload.fromGridX === "number") {
        const fromX = payload.fromGridX * cellSize + cellSize / 2;
        const fromY = payload.fromGridY * cellSize + cellSize / 2;
        const toX = payload.toGridX * cellSize + cellSize / 2;
        const toY = payload.toGridY * cellSize + cellSize / 2;
        if (typeof harpoonAnimationInFlight !== "undefined") harpoonAnimationInFlight = true;
        if (typeof refreshTurnControls === "function") refreshTurnControls();
        animateHarpoonPickup(fromX, fromY, toX, toY, payload.iconSrc, () => {
          if (typeof harpoonAnimationInFlight !== "undefined") harpoonAnimationInFlight = false;
          if (typeof refreshTurnControls === "function") refreshTurnControls();
        });
      }
      return;
    }
    if (type === "clearHarpoonMode") {
      if (typeof harpoonModePlayerIndex !== "undefined") {
        if (!Number.isInteger(payload.playerIndex) || harpoonModePlayerIndex === payload.playerIndex) {
          harpoonModePlayerIndex = null;
        }
      }
      if (typeof clearReachable === "function") clearReachable();
      if (typeof showReachable === "function") showReachable();
      if (Number.isInteger(payload.playerIndex) && typeof updateInventory === "function") {
        updateInventory(payload.playerIndex);
      }
      return;
    }
    if (type === "activateBridgeMode") {
      if (Number.isInteger(payload.playerIndex)) {
        bridgeModePlayerIndex = payload.playerIndex;
        if (typeof clearReachable === "function") {
          clearReachable();
        }
        if (typeof showReachable === "function") {
          showReachable();
        }
        if (typeof updateInventory === "function") {
          updateInventory(payload.playerIndex);
        }
      }
      return;
    }
    if (type === "activateVoidShardMode") {
      if (typeof voidShardModePlayerIndex !== "undefined" && Number.isInteger(payload.playerIndex)) {
        voidShardModePlayerIndex = payload.playerIndex;
        if (typeof clearReachable === "function") {
          clearReachable();
        }
        if (typeof showVoidShardTargets === "function") {
          showVoidShardTargets(payload.playerIndex);
        }
        if (typeof updateInventory === "function") {
          updateInventory(payload.playerIndex);
        }
      }
      return;
    }
    if (type === "clearBridgeMode") {
      if (!Number.isInteger(payload.playerIndex) || bridgeModePlayerIndex === payload.playerIndex) {
        bridgeModePlayerIndex = null;
      }
      if (typeof clearReachable === "function") {
        clearReachable();
      }
      if (typeof showReachable === "function") {
        showReachable();
      }
      if (Number.isInteger(payload.playerIndex) && typeof updateInventory === "function") {
        updateInventory(payload.playerIndex);
      }
      return;
    }
    if (type === "clearVoidShardMode") {
      if (typeof voidShardModePlayerIndex !== "undefined") {
        if (!Number.isInteger(payload.playerIndex) || voidShardModePlayerIndex === payload.playerIndex) {
          voidShardModePlayerIndex = null;
        }
      }
      if (typeof clearReachable === "function") {
        clearReachable();
      }
      if (typeof showReachable === "function") {
        showReachable();
      }
      if (Number.isInteger(payload.playerIndex) && typeof updateInventory === "function") {
        updateInventory(payload.playerIndex);
      }
      return;
    }
    if (type === "clearWormholeVisual") {
      if (typeof upperWormhole !== "undefined") {
        upperWormhole = null;
      }
      if (typeof clearRenderedWormholes === "function") {
        clearRenderedWormholes();
      }
      if (typeof refreshVisibleWorld === "function") {
        refreshVisibleWorld();
      }
      return;
    }
    if (type === "showBarracksModal" && typeof openBarracks === "function") {
      openBarracks(payload.playerIndex);
      return;
    }
    if (type === "showLavkaModal" && typeof openLavka === "function") {
      openLavka(payload.playerIndex);
      return;
    }
    if (type === "showWorkshopModal" && typeof openWorkshop === "function") {
      openWorkshop(payload.playerIndex);
      return;
    }
    if (type === "showCityModal" && typeof openCity === "function") {
      openCity(payload.playerIndex);
      return;
    }
    if (type === "showMasterModal" && typeof openMasterModal === "function") {
      openMasterModal(payload.playerIndex);
      return;
    }
    if (type === "showTavernModal" && typeof openTavernModal === "function") {
      openTavernModal(payload.playerIndex);
      return;
    }
    if (type === "barbarianRaidNotify" && typeof openBarbarianRaidModal === "function") {
      openBarbarianRaidModal(String(payload.text || ""));
      return;
    }
    if (type === "showCaveEntranceChoiceModal" && typeof showCaveEntranceChoiceModal === "function") {
      showCaveEntranceChoiceModal(payload);
      return;
    }
    if (type === "startTavernWheelSpin" && typeof beginTavernWheelSpinVisual === "function") {
      beginTavernWheelSpinVisual(payload);
      return;
    }
    if (type === "finishTavernWheelSpin" && typeof finishTavernWheelSpinVisual === "function") {
      finishTavernWheelSpinVisual(payload);
      return;
    }
    if (type === "startTavernDragon" && typeof beginTavernDragonVisual === "function") {
      beginTavernDragonVisual();
      return;
    }
    if (type === "finishTavernDragon" && typeof finishTavernDragonVisual === "function") {
      finishTavernDragonVisual(payload);
      return;
    }
    if (type === "startTavernFishkaSpin" && typeof beginTavernFishkaSpinVisual === "function") {
      beginTavernFishkaSpinVisual(payload);
      return;
    }
    if (type === "finishTavernFishkaSpin" && typeof finishTavernFishkaSpinVisual === "function") {
      finishTavernFishkaSpinVisual(payload);
      return;
    }
    if (type === "tavernSpectatorShow" && typeof openTavernSpectatorView === "function") {
      openTavernSpectatorView(payload.playerIndex);
      return;
    }
    if (type === "tavernSpectatorWheelShow" && typeof openTavernWheelSpectatorShow === "function") {
      openTavernWheelSpectatorShow();
      return;
    }
    if (type === "tavernSpectatorDragonShow" && typeof openTavernDragonSpectatorShow === "function") {
      openTavernDragonSpectatorShow();
      return;
    }
    if (type === "tavernSpectatorWheelSpin" && typeof openTavernWheelSpectatorVisual === "function") {
      openTavernWheelSpectatorVisual(payload);
      return;
    }
    if (type === "tavernSpectatorWheelFinish" && typeof finishTavernWheelSpectatorVisual === "function") {
      finishTavernWheelSpectatorVisual(payload);
      return;
    }
    if (type === "tavernSpectatorDragonStart" && typeof openTavernDragonSpectatorVisual === "function") {
      openTavernDragonSpectatorVisual(payload);
      return;
    }
    if (type === "tavernSpectatorDragonFinish" && typeof finishTavernDragonSpectatorVisual === "function") {
      finishTavernDragonSpectatorVisual(payload);
      return;
    }
    if (type === "tavernSpectatorFishkaShow" && typeof openTavernFishkaSpectatorShow === "function") {
      openTavernFishkaSpectatorShow();
      return;
    }
    if (type === "tavernSpectatorFishkaSpin" && typeof openTavernFishkaSpectatorVisual === "function") {
      openTavernFishkaSpectatorVisual(payload);
      return;
    }
    if (type === "tavernSpectatorFishkaFinish" && typeof finishTavernFishkaSpectatorVisual === "function") {
      finishTavernFishkaSpectatorVisual(payload);
      return;
    }
    if (type === "tavernSpectatorClose" && typeof closeTavernSpectatorView === "function") {
      closeTavernSpectatorView();
      return;
    }
    if (type === "showMageModal" && typeof openMageModal === "function" && typeof getMageSlotById === "function") {
      const slot = getMageSlotById(payload.mageId);
      if (slot) openMageModal(slot, payload.playerIndex);
      return;
    }
    if (type === "showStoneModal" && typeof openStoneModal === "function") {
      openStoneModal(payload.key, payload.playerIndex);
      return;
    }
    if (type === "showStoneResultModal" && typeof openStoneResultModal === "function") {
      openStoneResultModal(payload.text, payload.playerIndex);
      return;
    }
    if (type === "showRepairModal" && typeof openRepairModal === "function") {
      openRepairModal(payload.entry, payload.playerIndex);
      return;
    }
    if (type === "showMessengerModal" && typeof openMessengerModal === "function") {
      openMessengerModal(payload.messengerId, payload.playerIndex);
      return;
    }
    if (type === "showGuardModal" && typeof showGuardModalFor === "function") {
      showGuardModalFor(payload.playerIndex, payload.x, payload.y, payload.unlocked);
      return;
    }
    if (type === "showCastleModal" && typeof showCastleModal === "function") {
      showCastleModal(payload.key, payload.playerIndex);
      return;
    }
    if (type === "showHireModal" && typeof openHire === "function") {
      openHire(payload.playerIndex);
      return;
    }
    if (type === "showTrollCaveModal" && typeof openTrollCaveModal === "function") {
      openTrollCaveModal(payload.text, payload.playerIndex);
    }
  });

  document.addEventListener("click", e => {
    if (!onlineMatchStarted) return;
    if (isHost || applyingRemoteState || performingRemoteAction) return;
    if (onlineGamePaused) return;
    if (e.target?.closest?.("#castleModal, #tavernModal, #tavernWheelModal, #tavernDragonModal, #tavernFishkaModal, #hireModal, #trollCaveModal, #barbarianRaidModal, #caveEntranceChoiceModal, #battleModal, #playerBattleCardModal, #worldEventModal, #kingAuctionModal, #kingGenerosityModal, #barracksModal, #lavkaModal, #workshopModal, #cityModal, #masterModal, #mageModal, #stoneModal, #stoneResultModal, #repairModal, #messengerModal, #guardModal")) {
      return;
    }
    const action = getActionFromEvent(e);
    if (!action) return;
    if (typeof canLocalPlayerAct === "function" && !canLocalPlayerAct()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    lastClientActionAt = Date.now();
    if (action.type === "dom_click" && action.id === "endTurnBtn") {
      pushDebugLog(`clientAction:${action.type}:${action.id}`);
    }
    markNetworkEvent(`clientAction:${action.type}`);
    e.preventDefault();
    e.stopImmediatePropagation();
    socket.emit("clientAction", action);
  }, true);

  document.addEventListener("click", e => {
    if (!onlineMatchStarted) return;
    if (!isHost || applyingRemoteState || performingRemoteAction) return;
    if (onlineGamePaused) return;
    if (e.target?.closest?.("#castleModal, #tavernModal, #tavernWheelModal, #tavernDragonModal, #tavernFishkaModal, #hireModal, #trollCaveModal, #barbarianRaidModal, #caveEntranceChoiceModal, #battleModal, #playerBattleCardModal, #worldEventModal, #kingAuctionModal, #kingGenerosityModal, #barracksModal, #lavkaModal, #workshopModal, #cityModal, #masterModal, #mageModal, #stoneModal, #stoneResultModal, #repairModal, #messengerModal, #guardModal")) {
      return;
    }
    const action = getActionFromEvent(e);
    if (action && typeof canLocalPlayerAct === "function" && !canLocalPlayerAct()) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    if (action) {
      lastHostActionAt = Date.now();
      if (action.type === "dom_click" && action.id === "endTurnBtn") {
        pushDebugLog(`hostLocalAction:${action.type}:${action.id}`);
      }
      markNetworkEvent(`hostLocalAction:${action.type}`);
      socket.emit("hostAction", action);
    }
    setTimeout(() => emitStateNow(), 0);
  }, true);

  setInterval(() => {
    emitStateNow();
    updateDebugOverlay();
  }, 400);
}

updateDebugOverlay();
