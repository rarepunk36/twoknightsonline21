// ────────────────────────────────────────
//   ХОД ПО СОСЕДНИМ КЛЕТКАМ (вверх, вниз, влево, вправо)
// ────────────────────────────────────────
function attackWerewolfForCurrentPlayer(targetX, targetY, movePlayerToTarget = false, manualOnly = false) {
  const currentPlayer = players[currentPlayerIndex];
  const werewolfTarget = getWerewolfAtKey(`${targetX},${targetY}`);
  if (!currentPlayer || !werewolfTarget) return false;
  clearReachable();
  if (movePlayerToTarget) {
    currentPlayer.x = targetX;
    currentPlayer.y = targetY;
  }
  movesRemaining = 0;
  updatePawns();
  const battleResult = finalizeWerewolfBattle(currentPlayerIndex, { initiatedByWerewolf: false });
  if (battleResult) {
    showBattleModal(battleResult);
  }
  requestTurnAdvance({ manualOnly });
  return true;
}

game.addEventListener("click", e => {
  if (gameEnded) return;
  if (typeof ballistaShotInFlight !== "undefined" && ballistaShotInFlight) return;
  if (typeof harpoonAnimationInFlight !== "undefined" && harpoonAnimationInFlight) return;
  if (
    typeof socket !== "undefined" &&
    socket &&
    typeof canLocalPlayerAct === "function" &&
    !canLocalPlayerAct() &&
    !(typeof performingRemoteAction !== "undefined" && performingRemoteAction)
  ) {
    return;
  }
  const rect = game.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const gridX = Math.floor(clickX / cellSize);
  const gridY = Math.floor(clickY / cellSize);

  const currentPlayer = players[currentPlayerIndex];
  const currentLayer = currentPlayer?.layer || WORLD_LAYER_UPPER;
  const boundsCols = currentLayer === WORLD_LAYER_TROLL_CAVE ? TROLL_CAVE_INTERIOR_COLS : COLS;
  const boundsRows = currentLayer === WORLD_LAYER_TROLL_CAVE ? TROLL_CAVE_INTERIOR_ROWS : ROWS;
  if (gridX < 0 || gridX >= boundsCols || gridY < 0 || gridY >= boundsRows) return;
  const key = `${gridX},${gridY}`;
  if (
    (currentPlayer.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER &&
    typeof isUpperWorldKeyVisibleToPlayer === "function" &&
    !isUpperWorldKeyVisibleToPlayer(key, currentPlayerIndex) &&
    !reachableKeys.has(key)
  ) {
    return;
  }
  if (ballistaModePlayerIndex === currentPlayerIndex) {
    tryBallistaShot(gridX, gridY);
    return;
  }
  if (typeof harpoonModePlayerIndex !== "undefined" && harpoonModePlayerIndex === currentPlayerIndex) {
    tryUseHarpoonAtCell(currentPlayerIndex, gridX, gridY);
    return;
  }
  if (bridgeModePlayerIndex === currentPlayerIndex) {
    tryApplyBridgeToCell(currentPlayerIndex, key);
    return;
  }
  if (typeof voidShardModePlayerIndex !== "undefined" && voidShardModePlayerIndex === currentPlayerIndex) {
    tryApplyVoidShardToCell(currentPlayerIndex, key);
    return;
  }
  if ((currentPlayer.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE) {
    if (gridX === currentPlayer.x && gridY === currentPlayer.y) {
      const entranceIndex = getTrollCaveEntranceIndexByKey(key);
      if (movesRemaining <= 0 || entranceIndex < 0) return;
      movesRemaining = 0;
      clearReachable();
      exitTrollCave(currentPlayerIndex, entranceIndex);
      endTurn();
      return;
    }
    if (movesRemaining <= 0 || !reachableKeys.has(key)) return;
    if (
      typeof isTrollInCave === "function" &&
      isTrollInCave() &&
      trollState?.interiorKey === key
    ) {
      showPrivatePickupToastForPlayer(currentPlayerIndex, "Тролль преградил путь.");
      return;
    }
    const caveDefenderIndex = players.findIndex((player, index) => {
      return index !== currentPlayerIndex &&
        (player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE &&
        player.x === gridX &&
        player.y === gridY;
    });
    if (caveDefenderIndex !== -1) {
      if (typeof isNonAggressionPactActive === "function" && isNonAggressionPactActive()) {
        showPrivatePickupToastForPlayer(currentPlayerIndex, "Пакт о ненападении запрещает атаковать другого игрока.");
        return;
      }
      if (currentPlayer.pocket.army <= 0) {
        showPickupToast(`Игрок ${currentPlayerIndex + 1} не может атаковать: в кармане нет войск.`);
        return;
      }
      if ((players[caveDefenderIndex].invulnTurnsRemaining || 0) > 0) {
        showPickupToast("На противника действует неприкосновенность — атака невозможна.");
        showReachable();
        refreshTurnControls();
        return;
      }
      clearReachable();
      const attackerStartX = currentPlayer.x;
      const attackerStartY = currentPlayer.y;
      currentPlayer.x = gridX;
      currentPlayer.y = gridY;
      movesRemaining = 0;
      updatePawns();
      players.forEach((_, index) => updatePlayerResources(index));
      beginPlayerBattleCardSelection(currentPlayerIndex, caveDefenderIndex, {
        targetX: gridX,
        targetY: gridY,
        noSteal: false,
        defenderOwnsCastle: false,
        attackerStartX,
        attackerStartY
      });
      return;
    }
    finalizeMove(gridX, gridY);
    return;
  }
  if ((currentPlayer.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER) {
    if (gridX === currentPlayer.x && gridY === currentPlayer.y) {
      return;
    }
    if (movesRemaining <= 0) {
      return;
    }
    if (!reachableKeys.has(key)) return;
    finalizeMove(gridX, gridY);
    return;
  }
  if (gridX === currentPlayer.x && gridY === currentPlayer.y) {
    if ((currentPlayer.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER && getWerewolfAtKey(key)) {
      attackWerewolfForCurrentPlayer(gridX, gridY, false, false);
      return;
    }
    openContextForKey(key, currentPlayerIndex);
    return;
  }
  if (movesRemaining <= 0) {
    return;
  }
  const wasReachable = reachableKeys.has(key);
  if (!wasReachable) return;
  const mercenaryTarget = getMercenaryAtKey(key);
  if (mercenaryTarget) {
    if (currentPlayer.pocket.army <= 0) {
      showPickupToast("В кармане нет войск для боя.");
      return;
    }
    // Сначала игрок становится на клетку наёмника, затем начинается бой
    clearReachable();
    currentPlayer.x = gridX;
    currentPlayer.y = gridY;
    updatePawns();
    const battleResult = resolveMercenaryBattle(currentPlayerIndex, mercenaryTarget);
    if (battleResult && battleResult.winnerIndex === currentPlayerIndex) {
      clearMercenaryCell(mercenaryTarget.x, mercenaryTarget.y);
      const idx = mercenaries.findIndex(m => m.id === mercenaryTarget.id);
      if (idx !== -1) mercenaries.splice(idx, 1);
    }
    showBattleModal(battleResult);
    endTurn();
    return;
  }
  const thiefTarget = getThiefAtKey(key);
  if (thiefTarget) {
    clearReachable();
    const hit = Math.random() < 0.5;
    if (!hit) {
      showPickupToast("Вы промахнулись");
      endTurn();
      return;
    }
    clearThiefCell(thiefTarget.x, thiefTarget.y);
    const idx = thieves.findIndex(t => t.id === thiefTarget.id);
    if (idx !== -1) thieves.splice(idx, 1);
    finalizeMove(gridX, gridY);
    return;
  }
  const werewolfTarget = getWerewolfAtKey(key);
  if (werewolfTarget) {
    attackWerewolfForCurrentPlayer(gridX, gridY, true, false);
    return;
  }
  const caravanTarget = getCaravanAtKey(key);
  if (caravanTarget) {
    robCaravan(currentPlayerIndex, caravanTarget);
    return;
  }
  const messengerTarget = getMessengerAtKey(key);
  if (messengerTarget) {
    if (messengerTarget.targetPlayerIndex === currentPlayerIndex) {
      clearReachable();
      currentPlayer.x = gridX;
      currentPlayer.y = gridY;
      movesRemaining = 0;
      updatePawns();
      openMessengerModal(messengerTarget.id, currentPlayerIndex);
      return;
    }
    robMessenger(currentPlayerIndex, messengerTarget);
    return;
  }
  const node = nodeByPos[key];
  if (node && node.id === 15 && currentPlayer.resources.influence < 500) {
    showPickupToast("Нужно 500 влияния, чтобы войти к Королю.");
    return;
  }
  const barbarianTarget = barbarianCells.find(cell => cell.key === key);
  const isGuardCell = guardKey && key === guardKey;
  if (isGuardCell) {
    if (typeof isQuarantineActive === "function" && isQuarantineActive()) {
      showPrivatePickupToastForPlayer(currentPlayerIndex, "В городе карантин. Стража никого не пропускает.");
      return;
    }
    const playerPosKey = `${currentPlayer.x},${currentPlayer.y}`;
    const nearGuard = guardApproachKeys.has(playerPosKey);
    if (!guardAccess[currentPlayerIndex] && !nearGuard) {
      showPrivatePickupToastForPlayer(currentPlayerIndex, "Подойдите ближе к страже!");
      return;
    }
    if (!guardAccess[currentPlayerIndex]) {
      const canBribe = getTotalGold(currentPlayer) >= 500;
      const canInfluence = currentPlayer.resources.influence >= 300;
      if (!canBribe && !canInfluence) {
        showPickupToast("Нужно 500 золота или 300 влияния, чтобы оплатить проход к стражу");
        return;
      }
    }
    clearReachable();
    showGuardModalFor(currentPlayerIndex, gridX, gridY, guardAccess[currentPlayerIndex]);
    return;
  }

  const defenderIndex = players.findIndex((player, index) => {
    return index !== currentPlayerIndex &&
      (player.layer || WORLD_LAYER_UPPER) === (currentPlayer.layer || WORLD_LAYER_UPPER) &&
      player.x === gridX &&
      player.y === gridY;
  });

  if (defenderIndex !== -1) {
    if (typeof isTavernSafeCell === "function" && isTavernSafeCell(key, currentPlayer.layer || WORLD_LAYER_UPPER)) {
      finalizeMove(gridX, gridY);
      return;
    }
    const caveSpecialAtKey = specialByPos[key];
    if (
      caveSpecialAtKey &&
      caveSpecialAtKey.type === "troll-cave" &&
      typeof getTrollCaveIndexByKey === "function" &&
      typeof openCaveEntranceChoiceModal === "function"
    ) {
      const caveIndex = getTrollCaveIndexByKey(key);
      if (caveIndex >= 0) {
        clearReachable();
        openCaveEntranceChoiceModal(currentPlayerIndex, defenderIndex, caveIndex, gridX, gridY);
        return;
      }
    }
    if (typeof isNonAggressionPactActive === "function" && isNonAggressionPactActive()) {
      showPrivatePickupToastForPlayer(currentPlayerIndex, "Пакт о ненападении запрещает атаковать другого игрока.");
      return;
    }
    if (currentPlayer.pocket.army <= 0) {
      const attackerLabel = typeof currentPlayer.id === "number"
        ? `Игрок ${currentPlayer.id + 1}`
        : `Игрок ${currentPlayerIndex + 1}`;
      showPickupToast(`${attackerLabel} не может атаковать: в кармане нет войск.`);
      return;
    }
    if ((players[defenderIndex].invulnTurnsRemaining || 0) > 0) {
      showPickupToast("На противника действует неприкосновенность — атака невозможна.");
      showReachable();
      refreshTurnControls();
      return;
    }

    const castleKey = getCastleBaseKeyForPos(gridX, gridY) || key;
    const node = nodeByPos[castleKey];
    const defenderOwnsCastle =
      node &&
      node.type === "castle" &&
      typeof castleOwnersByKey !== "undefined" &&
      castleOwnersByKey[castleKey] === defenderIndex;

    clearReachable();
    // PvP начинается только после перемещения атакующего на целевую клетку.
    const attackerStartX = currentPlayer.x;
    const attackerStartY = currentPlayer.y;
    currentPlayer.x = gridX;
    currentPlayer.y = gridY;
    movesRemaining = 0;
    updatePawns();
    players.forEach((_, index) => updatePlayerResources(index));
    beginPlayerBattleCardSelection(currentPlayerIndex, defenderIndex, {
      targetX: gridX,
      targetY: gridY,
      noSteal: defenderOwnsCastle,
      defenderOwnsCastle,
      attackerStartX,
      attackerStartY
    });
    return;
  }
  if (barbarianTarget) {
    if (currentPlayer.pocket.army <= 0) {
      showPickupToast("В кармане нет войск для боя.");
      return;
    }
  }

  if (isMovementBlockedKey(key)) return;
  if (!wasReachable) return;

  finalizeMove(gridX, gridY);
});
