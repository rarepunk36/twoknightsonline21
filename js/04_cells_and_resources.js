// ────────────────────────────────────────
//   ОТМЕЧАЕМ ВАЖНЫЕ КЛЕТКИ
// ────────────────────────────────────────
const nodeMap = {};
const nodeByPos = {};
const castleOwnersByKey = {};
const castleStatsByKey = {};
const CASTLE_LEVELS = {
  1: {armor: 100, health: 50},
  2: {armor: 200, health: 75},
  3: {armor: 300, health: 100}
};
const CASTLE_FEATURES = {
  wall: {cost: 300, armor: 75, label: "Стена"},
  lumber: {cost: 50, income: 3, label: "Лесопилка"},
  mine: {cost: 200, income: 10, label: "Шахта"},
  clay: {cost: 400, income: 15, label: "Глиняный карьер"}
};

function ensureCastleStats(key) {
  if (!castleStatsByKey[key]) {
    castleStatsByKey[key] = {
      level: 1,
      wall: false,
      lumber: false,
      mine: false,
      mineLevel: 0,
      clay: false,
      storageArmy: 0,
      armorCurrent: null,
      healthCurrent: null
    };
  }
  const stats = castleStatsByKey[key];
  const prevArmorMax = stats.armor || 0;
  const prevHealthMax = stats.health || 0;
  stats.level = Math.max(1, Math.min(3, stats.level));
  const levelInfo = CASTLE_LEVELS[stats.level] || CASTLE_LEVELS[1];
  const wallBonus = stats.wall ? CASTLE_FEATURES.wall.armor : 0;
  stats.armor = levelInfo.armor + wallBonus;
  if (stats.armorCurrent === null || typeof stats.armorCurrent !== "number") {
    stats.armorCurrent = stats.armor;
  } else {
    if (stats.armor > prevArmorMax) {
      stats.armorCurrent += (stats.armor - prevArmorMax);
    }
  }
  stats.health = levelInfo.health;
  if (stats.healthCurrent === null || typeof stats.healthCurrent !== "number") {
    stats.healthCurrent = stats.health;
  } else {
    if (stats.health > prevHealthMax) {
      stats.healthCurrent += (stats.health - prevHealthMax);
    }
  }
  stats.mineLevel = Math.max(0, Math.min(2, Number(stats.mineLevel) || 0));
  if (stats.mineLevel === 0 && stats.mine) {
    stats.mineLevel = 1;
  }
  stats.mine = stats.mineLevel > 0;
  stats.income =
    (stats.lumber ? CASTLE_FEATURES.lumber.income : 0) +
    (stats.mineLevel >= 1 ? CASTLE_FEATURES.mine.income : 0) +
    (stats.mineLevel >= 2 ? 25 : 0) +
    (stats.clay ? CASTLE_FEATURES.clay.income : 0);
  updateCastleBars(key);
  return stats;
}

function updateCastleBadge(key) {
  const cell = grid[key];
  if (!cell) return;
  const stats = ensureCastleStats(key);
  let badge = cell.querySelector(".castle-level");
  if (!badge) {
    badge = document.createElement("div");
    badge.className = "castle-level";
    cell.appendChild(badge);
  }
  badge.textContent = `Ур. ${stats.level}`;
  let wallBadge = cell.querySelector(".castle-wall");
  if (stats.wall) {
    if (!wallBadge) {
      wallBadge = document.createElement("div");
      wallBadge.className = "castle-wall";
      wallBadge.textContent = "СТЕНА";
      cell.appendChild(wallBadge);
    }
    wallBadge.style.display = "block";
  } else if (wallBadge) {
    wallBadge.style.display = "none";
  }
}

function updateCastleBars(key) {
  for (let pi = 0; pi < 2; pi++) {
    const panel = document.querySelector(`.panel-castle-bars[data-panel-castle="${pi}"]`);
    if (!panel) continue;
    const ownedKey = Object.keys(castleOwnersByKey).find(k => castleOwnersByKey[k] === pi);
    const stats = ownedKey ? castleStatsByKey[ownedKey] : null;
    if (!ownedKey || !stats) {
      panel.style.display = "none";
      continue;
    }
    panel.style.display = "flex";
    const armorMax = stats.armor || 0;
    const healthMax = stats.health || 0;
    const armorCur = Math.max(0, Math.round(stats.armorCurrent || 0));
    const healthCur = Math.max(0, Math.round(stats.healthCurrent || 0));

    const armorFill = panel.querySelector(".panel-castle-bar-fill.armor");
    const healthFill = panel.querySelector(".panel-castle-bar-fill.health");
    const labels = panel.querySelectorAll(".panel-castle-bar-label");

    const armorPct = armorMax > 0 ? Math.min(100, Math.round((armorCur / armorMax) * 100)) : 0;
    const healthPct = healthMax > 0 ? Math.min(100, Math.round((healthCur / healthMax) * 100)) : 0;

    if (armorFill) armorFill.style.width = armorPct + "%";
    if (healthFill) healthFill.style.width = healthPct + "%";
    if (labels[0]) labels[0].textContent = armorCur;
    if (labels[1]) labels[1].textContent = healthCur;
  }
}

function setCellIcon(cell, iconName, altText) {
  if (!cell || !iconName) return;
  let icon = cell.querySelector("img.icon");
  if (!icon) {
    icon = document.createElement("img");
    icon.className = "icon";
    cell.appendChild(icon);
  }
  cell.classList.add("has-icon");
  icon.src = `assets/icons/${iconName}`;
  icon.alt = altText || "";
  return icon;
}

function clearCellIcon(cell) {
  if (!cell) return;
  const icon = cell.querySelector("img.icon");
  if (icon) icon.remove();
  cell.classList.remove("has-icon");
}

function clearCellTextNodes(cell) {
  if (!cell) return;
  Array.from(cell.childNodes).forEach(node => {
    if (node.nodeType === 3) {
      node.remove();
    }
  });
}

function clearBrokenResourceSmoke(cell) {
  if (!cell) return;
  cell.querySelectorAll(".broken-resource-smoke").forEach(node => node.remove());
  cell.classList.remove("broken-resource-smoking");
}

function syncBrokenResourceSmoke(cell, enabled) {
  if (!cell) return;
  clearBrokenResourceSmoke(cell);
  if (!enabled) return;
  cell.classList.add("broken-resource-smoking");
}

function restoreImportantNodeCell(key, cell) {
  const node = nodeByPos[key];
  if (!node || !cell) return false;
  cell.classList.remove("inactive", "special", "resource-disabled", "mercenary", "thief", "cutthroat", "messenger", "caravan", "werewolf", "mage", "portal", "wormhole", "stairs", "flower", "clover", "stone", "rainbow-stone", "void-shard", "master", "troll", "troll-cave", "treasure", "troll-cave-numbered", "troll-cave-entrance", "troll-cave-pit", "troll-cave-loot", "troll-cave-troll", "world-cell-hidden");
  cell.classList.add("important", node.type);
  cell.textContent = node.label || node.id || "";
  clearCellIcon(cell);
  clearBrokenResourceSmoke(cell);
  cell.removeAttribute("data-barbarian");
  cell.removeAttribute("title");
  const iconDef = ICONS_BY_ID[node.id];
  if (iconDef) {
    cell.textContent = "";
    setCellIcon(cell, iconDef.file, iconDef.alt);
  }
  if (node.id === 21) cell.classList.add("tavern-node");
  if (node.type === "castle") {
    const ownerIndex = castleOwnersByKey[key];
    const owner = typeof ownerIndex === "number" ? players?.[ownerIndex] : null;
    if (owner) {
      cell.classList.add("owned");
      cell.style.background = owner.color || "";
      cell.style.borderColor = owner.color || "";
    } else {
      cell.classList.remove("owned");
      cell.style.background = "";
      cell.style.borderColor = "";
    }
    updateCastleBadge(key);
    updateCastleBars(key);
  } else {
    cell.style.background = "";
    cell.style.borderColor = "";
  }
  return true;
}

const ICONS_BY_ID = {
  2: { file: "barracks.png", alt: "КАЗ" },
  6: { file: "hire.png", alt: "НАЕМ" },
  9: { file: "shop.png", alt: "ЛАВ" },
  10: { file: "dragon.png", alt: "Дракон" },
  11: { file: "castle_11.png", alt: "Замок" },
  15: { file: "king.png", alt: "КОР" },
  17: { file: "castle_17.png", alt: "Замок" },
  19: { file: "workshop.png", alt: "МАС" },
  20: { file: "guard.png", alt: "СТ" },
  21: { file: "tavern.png", alt: "Таверна" }
};
importantNodes.forEach(node => {
  const key = `${node.x},${node.y}`;
  const cell = grid[key];
    if (cell) {
      cell.classList.add("important", node.type);
      cell.classList.remove("inactive");
      cell.textContent = node.label || node.id;
    const entry = {id: node.id, x: node.x, y: node.y, elem: cell, type: node.type};
    nodeMap[node.id] = entry;
    nodeByPos[key] = entry;
    if (node.type === "castle") {
      castleOwnersByKey[key] = undefined;
      ensureCastleStats(key);
      updateCastleBadge(key);
    }
    if (node.id === 2) cell.classList.add("barracks-node");
    if (node.id === 9) cell.classList.add("shop-node");
    if (node.id === 19) cell.classList.add("workshop-node");
    if (node.id === 21) cell.classList.add("tavern-node");
    const iconDef = ICONS_BY_ID[node.id];
    if (iconDef) {
      cell.textContent = "";
      if (node.type === "dragon") {
        cell.classList.add("dragon-2x2");
        cell.style.width = `calc(var(--cell-size) * 2)`;
        cell.style.height = `calc(var(--cell-size) * 2)`;
        cell.style.zIndex = "5";
      }
      if (node.type === "castle") {
        cell.classList.add("castle-2x2");
        cell.style.width = `calc(var(--cell-size) * 2)`;
        cell.style.height = `calc(var(--cell-size) * 2)`;
        cell.style.zIndex = "5";
      }
      setCellIcon(cell, iconDef.file, iconDef.alt);
      if (node.type === "castle") {
        updateCastleBadge(key);
      }
    }
  }
});

const RESOURCE_INTERVAL = 6;
const RESOURCE_MIN_DISTANCE = 9;
const resourceTypes = [
  {key: "gold", label: "З", min: 200, max: 400},
  {key: "army", label: "В", min: 5, max: 8},
  {key: "resources", label: "Р", min: 50, max: 75}
];
const ARMY_RESOURCE_MID_GAME_RANGE = [10, 18];
const ARMY_RESOURCE_LATE_GAME_RANGE = [18, 27];
const RESOURCE_ICONS = {
  gold: { file: "gold.png", alt: "Золото" },
  army: { file: "army.png", alt: "Войска" },
  resources: { file: "resources.png", alt: "Ресурсы" }
};
let resourceSpawnDebug = {
  turn: 0,
  emptyKeysCount: 0,
  requestedTypes: [],
  pickedKeys: [],
  placedTypes: [],
  placedCount: 0,
  failedReason: "not-run"
};
const resourceByPos = {};
const specialByPos = {};
const trapStunFields = [];
let trapStunIdCounter = 1;
const SPAWN_BLOCKED_COORDINATES = [
  { x: 20, yStart: 23, yEnd: 25 },
  { x: 21, yStart: 21, yEnd: 25 },
  { x: 22, yStart: 20, yEnd: 25 },
  { x: 23, yStart: 19, yEnd: 25 },
  { x: 24, yStart: 18, yEnd: 25 },
  { x: 25, yStart: 18, yEnd: 25 },
  { x: 26, yStart: 17, yEnd: 25 },
  { x: 27, yStart: 17, yEnd: 25 },
  { x: 28, yStart: 16, yEnd: 25 },
  { x: 29, yStart: 16, yEnd: 25 },
  { x: 30, yStart: 16, yEnd: 25 }
];
const spawnBlockedKeys = new Set();
SPAWN_BLOCKED_COORDINATES.forEach(range => {
  const x = range.x - 1;
  for (let y = range.yStart; y <= range.yEnd; y++) {
    spawnBlockedKeys.add(`${x},${y - 1}`);
  }
});
const dragonSpawnBlockedKeys = new Set();
importantNodes.forEach(node => {
  if (node.type !== "dragon") return;
  dragonSpawnBlockedKeys.add(`${node.x},${node.y}`);
  dragonSpawnBlockedKeys.add(`${node.x + 1},${node.y}`);
  dragonSpawnBlockedKeys.add(`${node.x},${node.y + 1}`);
  dragonSpawnBlockedKeys.add(`${node.x + 1},${node.y + 1}`);
});
function isSpawnBlocked(x, y) {
  const key = `${x},${y}`;
  return spawnBlockedKeys.has(key) || dragonSpawnBlockedKeys.has(key);
}
let turnsUntilResources = RESOURCE_INTERVAL;
let toastTimer = null;
const TREASURE_INTERVAL = 20;
const TREASURE_DURATION = 2;
let turnsUntilTreasure = TREASURE_INTERVAL;
let treasure = null;
let treasureTurnsRemaining = 0;
const FLOWER_SPAWN_MIN_TURN = 1;
const FLOWER_SPAWN_MAX_TURN = 250;
const FLOWER_SPAWN_COUNT = 6;
const FLOWER_MIN_DURATION = 5;
const FLOWER_MAX_DURATION = 8;
const FLOWER_ICON = { file: "mystic_flower.png", alt: "Таинственный цветок" };
const flowerSpawnTurns = [];
let flowerSpawnIndex = 0;
let flowerArtifact = null;
let flowerTurnsRemaining = 0;
const CLOVER_SPAWN_MIN = 15;
const CLOVER_SPAWN_MAX = 30;
const CLOVER_DURATION = 5;
let nextCloverSpawnTurn = null;
let cloverArtifact = null;
let cloverTurnsRemaining = 0;
const FISHKA_FIRST_SPAWN_MIN = 15;
const FISHKA_FIRST_SPAWN_MAX = 20;
const FISHKA_RESPAWN_MIN = 17;
const FISHKA_RESPAWN_MAX = 25;
const FISHKA_DURATION = 5;
const FISHKA_CHIP_MIN = 3;
const FISHKA_CHIP_MAX = 5;
let nextFishkaSpawnTurn = null;
let fishka = null;

function initFishkaSpawns() {
  nextFishkaSpawnTurn = randomIntRange(FISHKA_FIRST_SPAWN_MIN, FISHKA_FIRST_SPAWN_MAX);
}
initFishkaSpawns();
const STONE_FIRST_MIN_TURN = 15;
const STONE_FIRST_MAX_TURN = 25;
const STONE_COOLDOWN_MIN = 12;
const STONE_COOLDOWN_MAX = 20;
const STONE_DURATION = 8;
let nextStoneSpawnTurn = null;
const stoneByPos = {};
const PORTAL_FIRST_MIN_TURN = 18;
const PORTAL_FIRST_MAX_TURN = 30;
const PORTAL_COOLDOWN_MIN = 28;
const PORTAL_COOLDOWN_MAX = 42;
const PORTAL_MIN_DURATION = 25;
const PORTAL_MAX_DURATION = 35;
const PORTAL_MIN_DISTANCE = 18;
const PORTAL_LABEL = "";
const PORTAL_ICON = { file: "portal.png", alt: "Портал" };
let portalState = null;
const RAINBOW_SPAWN_MIN_TURN = 1;
const RAINBOW_SPAWN_MAX_TURN = 270;
const RAINBOW_SPAWN_COUNT = 6;
const RAINBOW_MIN_DURATION = 5;
const RAINBOW_MAX_DURATION = 8;
const rainbowSpawnTurns = [];
let rainbowSpawnIndex = 0;
const rainbowByPos = {};
const VOID_SHARD_SPAWN_MIN_TURN = 15;
const VOID_SHARD_SPAWN_MAX_TURN = 300;
const VOID_SHARD_MIN_DURATION = 4;
const VOID_SHARD_MAX_DURATION = 6;
const VOID_SHARD_ICON = { file: "void_shard.png", alt: "Осколок пустоты" };
let voidShardSpawnTurn = null;
const voidShardByPos = {};
const MASTER_CELL = { x: 15, y: 1, key: "15,1" };
const MASTER_SPAWN_INTERVAL = 20;
const MASTER_DURATION = 6;
let masterNextSpawnTurn = 20;
let masterTurnsRemaining = 0;
let masterActive = false;
function randomIntRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function initFlowerSpawns() {
  const picked = new Set();
  while (picked.size < FLOWER_SPAWN_COUNT) {
    picked.add(randomIntRange(FLOWER_SPAWN_MIN_TURN, FLOWER_SPAWN_MAX_TURN));
  }
  flowerSpawnTurns.length = 0;
  flowerSpawnTurns.push(...Array.from(picked).sort((a, b) => a - b));
  flowerSpawnIndex = 0;
}
initFlowerSpawns();
function initStoneSpawns() {
  nextStoneSpawnTurn = randomIntRange(STONE_FIRST_MIN_TURN, STONE_FIRST_MAX_TURN);
}
initStoneSpawns();
function initPortalState() {
  portalState = {
    active: false,
    keys: [],
    turnsRemaining: 0,
    nextSpawnTurn: randomIntRange(PORTAL_FIRST_MIN_TURN, PORTAL_FIRST_MAX_TURN)
  };
}
initPortalState();
function initCloverSpawns() {
  nextCloverSpawnTurn = randomIntRange(CLOVER_SPAWN_MIN, CLOVER_SPAWN_MAX);
}
initCloverSpawns();
function initRainbowSpawns() {
  const picked = new Set();
  while (picked.size < RAINBOW_SPAWN_COUNT) {
    picked.add(randomIntRange(RAINBOW_SPAWN_MIN_TURN, RAINBOW_SPAWN_MAX_TURN));
  }
  rainbowSpawnTurns.length = 0;
  rainbowSpawnTurns.push(...Array.from(picked).sort((a, b) => a - b));
  rainbowSpawnIndex = 0;
}
initRainbowSpawns();
const MAGE_POSITIONS = [
  { x: 8, y: 5 },  // 09:06
  { x: 28, y: 17 } // 29:18
];
const MAGE_MIN_DURATION = 7;
const MAGE_MAX_DURATION = 9;
const MAGE_MIN_COOLDOWN = 15;
const MAGE_MAX_COOLDOWN = 20;
const mageSlot = {
  id: "mage",
  label: "МАГ",
  active: false,
  turnsRemaining: 0,
  cell: null,
  key: null,
  x: null,
  y: null,
  timerElem: null,
  nextSpawnTurn: 20,
  nextSpawnIndex: null
};
const TROLL_CAVES = [
  { x: 0, y: 11, key: "0,11", looted: false }, // 01:12
  { x: 13, y: 0, key: "13,0", looted: false } // 14:01
];
const TROLL_CAVE_INTERIOR_COLS = 20;
const TROLL_CAVE_INTERIOR_ROWS = 15;
// Два наружных входа ведут в две зоны одной общей внутренней пещеры.
const TROLL_CAVE_ENTRANCE_CELL_NUMBERS = [
  [290, 291],
  [43, 44, 63]
];
const TROLL_CAVE_PIT_CELL_NUMBER = 137;
const TROLL_CAVE_PIT_FIRST_SPAWN_MIN_TURN = 20;
const TROLL_CAVE_PIT_FIRST_SPAWN_MAX_TURN = 30;
const TROLL_CAVE_PIT_RESPAWN_MIN_TURNS = 15;
const TROLL_CAVE_PIT_RESPAWN_MAX_TURNS = 30;
const TROLL_CAVE_BLOCKED_CELL_NUMBERS_RAW = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 76, 77, 78, 79, 80, 81, 82, 89, 94, 98, 99, 100, 101, 104, 105, 111,
  112, 119, 120, 121, 122, 130, 131, 132, 140, 141, 144, 160, 161, 179, 180, 181, 182,
  186, 187, 193, 194, 195, 199, 200, 201, 202, 203, 206, 207, 208, 212, 213, 214, 215,
  216, 219, 220, 221, 222, 233, 239, 240, 241, 242, 259, 260, 261, 262, 263, 264, 265,
  266, 267, 268, 269, 272, 273, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286,
  287, 288, 289, 292, 293, 294, 295, 296, 297, 298, 299, 300
];
const TROLL_CAVE_ENTRANCE_CELL_NUMBER_SET = new Set(TROLL_CAVE_ENTRANCE_CELL_NUMBERS.flat());
const TROLL_CAVE_BLOCKED_CELL_NUMBERS = TROLL_CAVE_BLOCKED_CELL_NUMBERS_RAW.filter(
  number => !TROLL_CAVE_ENTRANCE_CELL_NUMBER_SET.has(number)
);
const TROLL_CAVE_BLOCKED_KEYS = new Set(TROLL_CAVE_BLOCKED_CELL_NUMBERS.map(number => {
  const index = Math.max(0, number - 1);
  return `${index % TROLL_CAVE_INTERIOR_COLS},${Math.floor(index / TROLL_CAVE_INTERIOR_COLS)}`;
}));
let trollCaveInteriorState = {
  generation: 0,
  sourceCaveIndex: null,
  lootByPos: {},
  pitActive: false,
  pitNextSpawnTurn: randomIntRange(
    TROLL_CAVE_PIT_FIRST_SPAWN_MIN_TURN,
    TROLL_CAVE_PIT_FIRST_SPAWN_MAX_TURN
  )
};

function getTrollCaveCellKeyByNumber(number) {
  const index = Math.max(0, Number(number) - 1);
  return `${index % TROLL_CAVE_INTERIOR_COLS},${Math.floor(index / TROLL_CAVE_INTERIOR_COLS)}`;
}

function getTrollCaveCellNumber(x, y) {
  return y * TROLL_CAVE_INTERIOR_COLS + x + 1;
}

function getTrollCaveEntranceIndexByKey(key) {
  return TROLL_CAVE_ENTRANCE_CELL_NUMBERS.findIndex(numbers =>
    numbers.some(number => getTrollCaveCellKeyByNumber(number) === key)
  );
}

function isTrollCavePitActive() {
  return Boolean(trollCaveInteriorState?.pitActive);
}

function handleTrollCavePitSpawn() {
  if (!trollCaveInteriorState || isTrollCavePitActive()) return false;
  if (!Number.isFinite(trollCaveInteriorState.pitNextSpawnTurn)) {
    trollCaveInteriorState.pitNextSpawnTurn = turnCounter + randomIntRange(
      TROLL_CAVE_PIT_RESPAWN_MIN_TURNS,
      TROLL_CAVE_PIT_RESPAWN_MAX_TURNS
    );
  }
  if (turnCounter < trollCaveInteriorState.pitNextSpawnTurn) return false;
  trollCaveInteriorState.pitActive = true;
  trollCaveInteriorState.pitNextSpawnTurn = null;
  return true;
}

function consumeTrollCavePit(options = {}) {
  if (!trollCaveInteriorState || !isTrollCavePitActive()) return false;
  trollCaveInteriorState.pitActive = false;
  trollCaveInteriorState.pitNextSpawnTurn = turnCounter + randomIntRange(
    TROLL_CAVE_PIT_RESPAWN_MIN_TURNS,
    TROLL_CAVE_PIT_RESPAWN_MAX_TURNS
  );
  if (options.refresh !== false && typeof refreshVisibleWorld === "function") {
    refreshVisibleWorld();
  }
  if (options.emit !== false && typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  return true;
}

function clearTrollCaveInteriorPosition() {
  trollState.interiorX = null;
  trollState.interiorY = null;
  trollState.interiorKey = null;
}

function placeTrollInsideCave(caveIndex) {
  const entranceKeys = new Set(
    TROLL_CAVE_ENTRANCE_CELL_NUMBERS.flat().map(getTrollCaveCellKeyByNumber)
  );
  const pitKey = getTrollCaveCellKeyByNumber(TROLL_CAVE_PIT_CELL_NUMBER);
  const occupied = new Set(Object.keys(trollCaveInteriorState?.lootByPos || {}));
  if (typeof players !== "undefined" && Array.isArray(players)) {
    players.forEach(player => {
      if ((player?.layer || "upper") === "troll-cave") {
        occupied.add(`${player.x},${player.y}`);
      }
    });
  }
  const availableKeys = [];
  for (let y = 0; y < TROLL_CAVE_INTERIOR_ROWS; y += 1) {
    for (let x = 0; x < TROLL_CAVE_INTERIOR_COLS; x += 1) {
      const key = `${x},${y}`;
      if (TROLL_CAVE_BLOCKED_KEYS.has(key)) continue;
      if (entranceKeys.has(key) || key === pitKey || occupied.has(key)) continue;
      availableKeys.push(key);
    }
  }
  if (!availableKeys.length) {
    clearTrollCaveInteriorPosition();
    return false;
  }
  const key = availableKeys[Math.floor(Math.random() * availableKeys.length)];
  const [x, y] = key.split(",").map(Number);
  trollState.interiorX = x;
  trollState.interiorY = y;
  trollState.interiorKey = key;
  return true;
}

function notifyTrollCaveArrival(caveIndex, options = {}) {
  if (caveIndex < 0 || caveIndex >= TROLL_CAVES.length) return;
  TROLL_CAVES[caveIndex].looted = false;
  placeTrollInsideCave(caveIndex);
  if (!options.skipLootDeposit && typeof depositTrollCarriedLootInCave === "function") {
    depositTrollCarriedLootInCave(caveIndex, options);
  }
  trollState.caveLootCarryLimit = null;
  trollState.caveLootCarryCount = 0;
}
function getTrollCaveIndexByKey(key) {
  return TROLL_CAVES.findIndex(cave => cave.key === key);
}

function markTrollCaveLooted(index, value) {
  if (index < 0 || index >= TROLL_CAVES.length) return;
  TROLL_CAVES[index].looted = value;
}

const TROLL_STAY_MIN = 5;
const TROLL_STAY_MAX = 8;
const TROLL_RESPAWN_TURNS = 5;
const TROLL_SPEED = 4;
const TROLL_STUN_DURATION = 5;
const TROLL_EVENT_SPEED_MIN = 5;
const TROLL_EVENT_SPEED_MAX = 7;
const TROLL_EXTRA_STEPS = 0;
const TROLL_CAVE_ARTIFACT_CHANCE = 0.1;
const TROLL_CAVE_RESOURCE_CELL_LIMIT = 15;
const TROLL_CAVE_INITIAL_LOOT_SLOTS = 3;
const TROLL_EVENT_CARRIED_LOOT_LIMIT = 7;
const TROLL_CAVE_LOOT_SCALE_TURN = 150;
const TROLL_CAVE_LOOT_SLOT_RANGES = {
  gold: [50, 300],
  resources: [20, 150],
  army: [5, 15]
};
const TROLL_CAVE_LOOT_LATE_SLOT_RANGES = {
  gold: [250, 500],
  resources: [100, 200],
  army: [10, 20]
};
let trollState = {
  x: null,
  y: null,
  key: null,
  currentCaveIndex: null,
  targetCaveIndex: null,
  turnsRemaining: 0,
  moving: false,
  path: [],
  pathIndex: 0,
  prevKey: null,
  stunUsed: false,
  active: true,
  respawnTurns: 0,
  respawnCountdownPending: false,
  roamTurnsRemaining: 0,
  roamTargetX: null,
  roamTargetY: null,
  interiorX: null,
  interiorY: null,
  interiorKey: null,
  carriedCaveLootSlots: [],
  caveLootCarryLimit: null,
  caveLootCarryCount: 0
};

function accumulateTrollCaveLootSlot(options = {}) {
  if (!Array.isArray(trollState.carriedCaveLootSlots)) {
    trollState.carriedCaveLootSlots = [];
  }
  const carryLimit = trollState.caveLootCarryLimit;
  const carriedDuringLimitedRun = Math.max(0, Number(trollState.caveLootCarryCount) || 0);
  if (Number.isFinite(carryLimit) && carryLimit >= 0 && carriedDuringLimitedRun >= carryLimit) {
    return false;
  }
  const typeKeys = Object.keys(TROLL_CAVE_LOOT_SLOT_RANGES);
  const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
  const lootTurn = Number.isFinite(options.turn) ? options.turn : turnCounter;
  const activeRanges = lootTurn >= TROLL_CAVE_LOOT_SCALE_TURN
    ? TROLL_CAVE_LOOT_LATE_SLOT_RANGES
    : TROLL_CAVE_LOOT_SLOT_RANGES;
  const [minimum, maximum] = activeRanges[typeKey];
  trollState.carriedCaveLootSlots.push({
    typeKey,
    amount: randomIntRange(minimum, maximum)
  });
  if (Number.isFinite(carryLimit) && carryLimit >= 0) {
    trollState.caveLootCarryCount = carriedDuringLimitedRun + 1;
  }
  return true;
}

function initTrollCaves() {
  TROLL_CAVES.forEach((cave, index) => {
    const placed = setSpecialCell(
      cave.x,
      cave.y,
      "",
      "troll-cave",
      null,
      null,
      null,
      { type: "troll-cave", caveIndex: index }
    );
    if (!placed) return;
    const cell = grid[cave.key];
    if (cell) {
      cell.textContent = "";
      setCellIcon(cell, "troll_cave.png", "Пещера троллей");
    }
  });
}

function initTrollState() {
  initTrollCaves();
  const startIndex = Math.floor(Math.random() * TROLL_CAVES.length);
  const cave = TROLL_CAVES[startIndex];
  trollState.currentCaveIndex = startIndex;
  trollState.targetCaveIndex = null;
  trollState.moving = false;
  trollState.path = [];
  trollState.pathIndex = 0;
  trollState.x = cave.x;
  trollState.y = cave.y;
  trollState.key = cave.key;
  trollState.turnsRemaining = randomIntRange(TROLL_STAY_MIN, TROLL_STAY_MAX);
  trollState.prevKey = null;
  trollState.stunUsed = false;
  trollState.active = true;
  trollState.respawnTurns = 0;
  trollState.respawnCountdownPending = false;
  trollState.roamTurnsRemaining = 0;
  trollState.roamTargetX = null;
  trollState.roamTargetY = null;
  trollState.carriedCaveLootSlots = [];
  trollState.caveLootCarryLimit = null;
  trollState.caveLootCarryCount = 0;
  for (let index = 0; index < TROLL_CAVE_INITIAL_LOOT_SLOTS; index += 1) {
    accumulateTrollCaveLootSlot({ turn: 0 });
  }
  notifyTrollCaveArrival(startIndex, { silent: true, skipArtifactRoll: true });
  updateTrollVisual();
}

function isTrollInCave() {
  if (trollState.currentCaveIndex === null) return false;
  const cave = TROLL_CAVES[trollState.currentCaveIndex];
  return !trollState.moving && trollState.key === cave.key;
}

function hasPlayersInsideTrollCave() {
  return typeof players !== "undefined" &&
    Array.isArray(players) &&
    players.some(player => (player?.layer || "upper") === "troll-cave");
}

function clearTrollTokenAt(key) {
  const cell = grid[key];
  if (!cell) return;
  const token = cell.querySelector(".troll-token");
  if (token) token.remove();
  cell.classList.remove("troll");
  if (cell.title && cell.title.indexOf("Тролли:") === 0) {
    cell.removeAttribute("title");
  }
}

function ensureTrollTokenAt(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.add("troll");
  let token = cell.querySelector(".troll-token");
  if (!token) {
    token = document.createElement("img");
    token.className = "troll-token";
    token.src = "assets/icons/troll.png";
    token.alt = "Тролли";
    cell.appendChild(token);
  }
  const trollArmy =
    typeof getTimeOfDay === "function" && getTimeOfDay().key === "evening" ? 20 : 25;
  cell.title = `Тролли: ${trollArmy} войск`;
}

function updateTrollVisual() {
  const upperWorldVisible =
    typeof getVisibleWorldLayer !== "function" ||
    getVisibleWorldLayer() === WORLD_LAYER_UPPER;
  if (!upperWorldVisible) {
    trollState.prevKey = trollState.key;
    return;
  }
  if (trollState.prevKey) {
    clearTrollTokenAt(trollState.prevKey);
  }
  if (!trollState.active || !trollState.key) return;
  if (!isTrollInCave()) {
    ensureTrollTokenAt(trollState.x, trollState.y);
  }
  trollState.prevKey = trollState.key;
}

function spawnTrollAtRandomCave() {
  const index = Math.floor(Math.random() * TROLL_CAVES.length);
  const cave = TROLL_CAVES[index];
  trollState.currentCaveIndex = index;
  trollState.targetCaveIndex = null;
  trollState.moving = false;
  trollState.path = [];
  trollState.pathIndex = 0;
  trollState.x = cave.x;
  trollState.y = cave.y;
  trollState.key = cave.key;
  trollState.turnsRemaining = randomIntRange(TROLL_STAY_MIN, TROLL_STAY_MAX);
  trollState.prevKey = null;
  trollState.stunUsed = false;
  trollState.active = true;
  trollState.respawnTurns = 0;
  trollState.respawnCountdownPending = false;
  trollState.roamTurnsRemaining = 0;
  trollState.roamTargetX = null;
  trollState.roamTargetY = null;
  trollState.caveLootCarryLimit = null;
  trollState.caveLootCarryCount = 0;
  notifyTrollCaveArrival(index, { skipArtifactRoll: true });
  updateTrollVisual();
}

function handleTrollDefeat() {
  if (!trollState.active) return;
  const deathX = trollState.x;
  const deathY = trollState.y;
  let deliveryCaveIndex = Number.isInteger(trollState.targetCaveIndex)
    ? trollState.targetCaveIndex
    : trollState.currentCaveIndex;
  if (!Number.isInteger(deliveryCaveIndex)) {
    deliveryCaveIndex = TROLL_CAVES.reduce((nearestIndex, cave, index) => {
      const nearest = TROLL_CAVES[nearestIndex];
      const distance = Math.abs(cave.x - deathX) + Math.abs(cave.y - deathY);
      const nearestDistance = Math.abs(nearest.x - deathX) + Math.abs(nearest.y - deathY);
      return distance < nearestDistance ? index : nearestIndex;
    }, 0);
  }
  if (typeof depositTrollCarriedLootInCave === "function") {
    depositTrollCarriedLootInCave(deliveryCaveIndex, { silent: true, skipArtifactRoll: true });
  }
  if (trollState.key) {
    clearTrollTokenAt(trollState.key);
  }
  trollState.active = false;
  trollState.respawnTurns = TROLL_RESPAWN_TURNS;
  trollState.respawnCountdownPending = true;
  trollState.roamTurnsRemaining = 0;
  trollState.roamTargetX = null;
  trollState.roamTargetY = null;
  trollState.caveLootCarryLimit = null;
  trollState.caveLootCarryCount = 0;
  trollState.currentCaveIndex = null;
  trollState.targetCaveIndex = null;
  trollState.moving = false;
  trollState.path = [];
  trollState.pathIndex = 0;
  trollState.x = null;
  trollState.y = null;
  trollState.key = null;
  trollState.prevKey = null;
  clearTrollCaveInteriorPosition();
  if (typeof emitStateNow === "function") emitStateNow(true);
}

function startTrollsLeaveCaves(duration) {
  if (!trollState.active) return;
  const wasAlreadyRoaming = (trollState.roamTurnsRemaining || 0) > 0;
  trollState.roamTurnsRemaining = Math.max(trollState.roamTurnsRemaining || 0, duration);
  trollState.caveLootCarryLimit = TROLL_EVENT_CARRIED_LOOT_LIMIT;
  if (!wasAlreadyRoaming) trollState.caveLootCarryCount = 0;
  if (isTrollInCave() && hasPlayersInsideTrollCave()) return;
  if (isTrollInCave() && !hasPlayersInsideTrollCave()) {
    forceTrollExitCave();
  }
  trollState.currentCaveIndex = null;
  trollState.targetCaveIndex = null;
  trollState.moving = false;
  trollState.path = [];
  trollState.pathIndex = 0;
  trollState.stunUsed = false;
}

function getRandomTrollCaveIndex(excludedIndex = null) {
  const availableIndexes = TROLL_CAVES
    .map((_, index) => index)
    .filter(index => index !== excludedIndex);
  if (!availableIndexes.length) return 0;
  return availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
}

function placeTrollAtExteriorCave(caveIndex) {
  const cave = TROLL_CAVES[caveIndex];
  if (!cave) return false;
  trollState.currentCaveIndex = caveIndex;
  trollState.x = cave.x;
  trollState.y = cave.y;
  trollState.key = cave.key;
  return true;
}

function forceTrollExitCave() {
  clearTrollCaveInteriorPosition();
  const exitIndex = Number.isInteger(trollState.currentCaveIndex)
    ? trollState.currentCaveIndex
    : getRandomTrollCaveIndex();
  if (!placeTrollAtExteriorCave(exitIndex)) return;
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  const valid = dirs.filter(([dx, dy]) => {
    const nx = trollState.x + dx;
    const ny = trollState.y + dy;
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;
    const key = `${nx},${ny}`;
    if (blockedCellKeys.has(key)) return false;
    if (nodeByPos[key]) return false;
    return true;
  });
  if (valid.length) {
    const [dx, dy] = valid[Math.floor(Math.random() * valid.length)];
    trollState.x += dx;
    trollState.y += dy;
    trollState.key = `${trollState.x},${trollState.y}`;
  }
  updateTrollVisual();
}

function buildTrollPath(start, end) {
  const path = [];
  let cx = start.x;
  let cy = start.y;
  let remainingX = end.x - start.x;
  let remainingY = end.y - start.y;
  let extra = Math.max(0, TROLL_EXTRA_STEPS);

  while (remainingX !== 0 || remainingY !== 0) {
    const moveX = remainingX !== 0 && (remainingY === 0 || Math.random() < 0.5);
    if (moveX) {
      const stepX = remainingX > 0 ? 1 : -1;
      const nx = cx + stepX;
      const ny = cy;
      const key = `${nx},${ny}`;
      if (!nodeByPos[key] && !resourceByPos[key] && !specialByPos[key] &&
          !barbarianCells.some(cell => cell.key === key) &&
          !(treasure && treasure.key === key) &&
          !(flowerArtifact && flowerArtifact.key === key) &&
          !stoneByPos[key] && !rainbowByPos[key] && !voidShardByPos[key]) {
        cx = nx;
        remainingX -= stepX;
        path.push({ x: cx, y: cy, key: `${cx},${cy}` });
      } else {
        remainingX -= stepX;
      }
    } else {
      const stepY = remainingY > 0 ? 1 : -1;
      const nx = cx;
      const ny = cy + stepY;
      const key = `${nx},${ny}`;
      if (!nodeByPos[key] && !resourceByPos[key] && !specialByPos[key] &&
          !barbarianCells.some(cell => cell.key === key) &&
          !(treasure && treasure.key === key) &&
          !(flowerArtifact && flowerArtifact.key === key) &&
          !stoneByPos[key] && !rainbowByPos[key] && !voidShardByPos[key]) {
        cy = ny;
        remainingY -= stepY;
        path.push({ x: cx, y: cy, key: `${cx},${cy}` });
      } else {
        remainingY -= stepY;
      }
    }

    while (extra >= 2 && Math.random() < 0.4) {
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      const valid = dirs.filter(([dx, dy]) => {
        const nx = cx + dx;
        const ny = cy + dy;
        const key = `${nx},${ny}`;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;
        if (nodeByPos[key]) return false;
        if (resourceByPos[key]) return false;
        if (specialByPos[key]) return false;
        if (barbarianCells.some(cell => cell.key === key)) return false;
        if (treasure && treasure.key === key) return false;
        if (flowerArtifact && flowerArtifact.key === key) return false;
        if (stoneByPos[key]) return false;
        if (rainbowByPos[key]) return false;
        if (voidShardByPos[key]) return false;
        return true;
      });
      if (!valid.length) break;
      const [dx, dy] = valid[Math.floor(Math.random() * valid.length)];
      cx += dx;
      cy += dy;
      path.push({ x: cx, y: cy, key: `${cx},${cy}` });
      cx -= dx;
      cy -= dy;
      path.push({ x: cx, y: cy, key: `${cx},${cy}` });
      extra -= 2;
    }
  }
  while (extra >= 2) {
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    const valid = dirs.filter(([dx, dy]) => {
      const nx = cx + dx;
      const ny = cy + dy;
      const key = `${nx},${ny}`;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return false;
      if (nodeByPos[key]) return false;
      if (resourceByPos[key]) return false;
      if (specialByPos[key]) return false;
      if (barbarianCells.some(cell => cell.key === key)) return false;
      if (treasure && treasure.key === key) return false;
      if (flowerArtifact && flowerArtifact.key === key) return false;
      if (stoneByPos[key]) return false;
      if (rainbowByPos[key]) return false;
      if (voidShardByPos[key]) return false;
      return true;
    });
    if (!valid.length) break;
    const [dx, dy] = valid[Math.floor(Math.random() * valid.length)];
    cx += dx;
    cy += dy;
    path.push({ x: cx, y: cy, key: `${cx},${cy}` });
    cx -= dx;
    cy -= dy;
    path.push({ x: cx, y: cy, key: `${cx},${cy}` });
    extra -= 2;
  }

  return path;
}

function startTrollMove() {
  if (trollState.currentCaveIndex === null) return;
  clearTrollCaveInteriorPosition();
  trollState.caveLootCarryLimit = null;
  trollState.caveLootCarryCount = 0;
  const exitIndex = Number.isInteger(trollState.currentCaveIndex)
    ? trollState.currentCaveIndex
    : getRandomTrollCaveIndex();
  if (!placeTrollAtExteriorCave(exitIndex)) return;
  const targetIndex = getRandomTrollCaveIndex(exitIndex);
  const start = { x: trollState.x, y: trollState.y };
  const end = { x: TROLL_CAVES[targetIndex].x, y: TROLL_CAVES[targetIndex].y };
  trollState.targetCaveIndex = targetIndex;
  trollState.path = buildTrollPath(start, end);
  trollState.pathIndex = 0;
  trollState.moving = true;
  trollState.stunUsed = false;
}

function isCellBlockedForTroll(x, y) {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  const key = `${x},${y}`;
  if (blockedCellKeys.has(key)) return true;
  if (nodeByPos[key]) return true;
  if (barbarianCells.some(cell => cell.key === key)) return true;
  if (resourceByPos[key]) return true;
  if (specialByPos[key]) return true;
  if (treasure && treasure.key === key) return true;
  if (flowerArtifact && flowerArtifact.key === key) return true;
  if (stoneByPos[key]) return true;
  if (rainbowByPos[key]) return true;
  if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) return true;
  return false;
}

function pickRoamTarget() {
  for (let attempt = 0; attempt < 50; attempt++) {
    const tx = Math.floor(Math.random() * COLS);
    const ty = Math.floor(Math.random() * ROWS);
    if (!isCellBlockedForTroll(tx, ty)) {
      trollState.roamTargetX = tx;
      trollState.roamTargetY = ty;
      return;
    }
  }
  trollState.roamTargetX = trollState.x;
  trollState.roamTargetY = trollState.y;
}

function returnTrollToCave() {
  if (!trollState.active || trollState.x === null || trollState.y === null) return;
  const caveIndex = Math.floor(Math.random() * TROLL_CAVES.length);
  const cave = TROLL_CAVES[caveIndex];
  trollState.targetCaveIndex = caveIndex;
  trollState.currentCaveIndex = null;
  trollState.path = buildTrollPath(
    { x: trollState.x, y: trollState.y },
    { x: cave.x, y: cave.y }
  );
  trollState.pathIndex = 0;
  trollState.moving = true;
  trollState.stunUsed = false;
}

function handleTrollsTurn() {
  if (trollState.roamTurnsRemaining > 0) {
    trollState.roamTurnsRemaining -= 1;
    if (trollState.roamTurnsRemaining <= 0) {
      if (!isTrollInCave()) {
        if (trollState.active) accumulateTrollCaveLootSlot();
        returnTrollToCave();
        updateTrollVisual();
        return;
      }
    }
  }
  if (!trollState.active) {
    if (trollState.respawnCountdownPending) {
      trollState.respawnCountdownPending = false;
      return;
    }
    if (trollState.respawnTurns > 0) {
      trollState.respawnTurns -= 1;
      if (trollState.respawnTurns <= 0) {
        spawnTrollAtRandomCave();
      }
    }
    return;
  }
  const roaming = (trollState.roamTurnsRemaining || 0) > 0;
  if (!roaming && trollState.currentCaveIndex === null && !trollState.moving) return;
  // Таймер выхода продолжает идти, пока игрок задерживает тролля внутри.
  // Если срок уже наступил, тролль покинет пещеру на первом ходу без игроков.
  if (!roaming && isTrollInCave() && !trollState.moving) {
    trollState.turnsRemaining = Math.max(0, trollState.turnsRemaining - 1);
  }
  if (
    isTrollInCave() &&
    typeof handleTrollInsideCaveTurn === "function" &&
    handleTrollInsideCaveTurn()
  ) {
    updateTrollVisual();
    return;
  }
  if (roaming && isTrollInCave()) {
    forceTrollExitCave();
  }
  if (!roaming && !trollState.moving && trollState.turnsRemaining <= 0) {
    startTrollMove();
  }
  if (!isTrollInCave()) {
    accumulateTrollCaveLootSlot();
  }
  const canStun = roaming || trollState.moving;
  if (canStun && Array.isArray(players)) {
    const nearby = players
      .map(p => ({
        player: p,
        dist: Math.abs(p.x - trollState.x) + Math.abs(p.y - trollState.y)
      }))
      .filter(entry => (entry.player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER)
      .filter(entry => entry.dist <= 5)
      .filter(entry => (entry.player.invisTurnsRemaining || 0) <= 0)
      .filter(entry => entry.player.stunSource !== "troll" || (entry.player.stunnedTurnsRemaining || 0) <= 0)
      .sort((a, b) => a.dist - b.dist);
    if (!trollState.stunUsed && nearby.length && Math.random() < 0.5) {
      const target = nearby[0].player;
      let stepsToMove = 1;
      let tx = trollState.x;
      let ty = trollState.y;
      while (stepsToMove > 0) {
        const dist = Math.abs(target.x - tx) + Math.abs(target.y - ty);
        if (dist <= 1) break;
        const dx2 = target.x - tx;
        const dy2 = target.y - ty;
        if (Math.abs(dx2) >= Math.abs(dy2)) {
          tx += dx2 > 0 ? 1 : -1;
        } else {
          ty += dy2 > 0 ? 1 : -1;
        }
        stepsToMove -= 1;
      }
      trollState.x = tx;
      trollState.y = ty;
      trollState.key = `${tx},${ty}`;
      target.stunnedTurnsRemaining = TROLL_STUN_DURATION;
      target.stunSource = "troll";
      trollState.stunUsed = true;
      if (!roaming) {
        const targetCave = TROLL_CAVES[trollState.targetCaveIndex];
        if (targetCave) {
          trollState.path = buildTrollPath({ x: trollState.x, y: trollState.y }, { x: targetCave.x, y: targetCave.y });
          trollState.pathIndex = 0;
        }
      }
      updateTrollVisual();
      return;
    }
  }
  if (roaming) {
    const eventSpeed = randomIntRange(TROLL_EVENT_SPEED_MIN, TROLL_EVENT_SPEED_MAX);
    moveTrollRoaming(eventSpeed);
  } else if (trollState.moving) {
    let steps = TROLL_SPEED;
    while (steps > 0 && trollState.pathIndex < trollState.path.length) {
      const next = trollState.path[trollState.pathIndex];
      trollState.pathIndex += 1;
      trollState.x = next.x;
      trollState.y = next.y;
      trollState.key = next.key;
      steps -= 1;
    }
    if (trollState.pathIndex >= trollState.path.length) {
      const cave = TROLL_CAVES[trollState.targetCaveIndex];
      trollState.currentCaveIndex = trollState.targetCaveIndex;
      trollState.targetCaveIndex = null;
      trollState.moving = false;
      trollState.path = [];
      trollState.pathIndex = 0;
      trollState.x = cave.x;
      trollState.y = cave.y;
      trollState.key = cave.key;
      notifyTrollCaveArrival(trollState.currentCaveIndex);
      trollState.turnsRemaining = randomIntRange(TROLL_STAY_MIN, TROLL_STAY_MAX);
      trollState.stunUsed = false;
    }
  }
  updateTrollVisual();
}

function moveTrollRoaming(speed) {
  let steps = speed;
  while (steps > 0) {
    if (trollState.roamTargetX === null || trollState.roamTargetY === null ||
        (trollState.x === trollState.roamTargetX && trollState.y === trollState.roamTargetY)) {
      pickRoamTarget();
    }
    const dx = trollState.roamTargetX - trollState.x;
    const dy = trollState.roamTargetY - trollState.y;
    const dirs = [];
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx !== 0) dirs.push([dx > 0 ? 1 : -1, 0]);
      if (dy !== 0) dirs.push([0, dy > 0 ? 1 : -1]);
    } else {
      if (dy !== 0) dirs.push([0, dy > 0 ? 1 : -1]);
      if (dx !== 0) dirs.push([dx > 0 ? 1 : -1, 0]);
    }
    if (dx === 0 && dy === 0) {
      pickRoamTarget();
      steps -= 1;
      continue;
    }
    let moved = false;
    for (let i = 0; i < dirs.length; i++) {
      const [sdx, sdy] = dirs[i];
      const nx = trollState.x + sdx;
      const ny = trollState.y + sdy;
      if (!isCellBlockedForTroll(nx, ny)) {
        trollState.x = nx;
        trollState.y = ny;
        trollState.key = `${nx},${ny}`;
        trollState.currentCaveIndex = null;
        trollState.targetCaveIndex = null;
        moved = true;
        break;
      }
    }
    if (!moved) {
      const fallback = [[1,0],[-1,0],[0,1],[0,-1]];
      const valid = fallback.filter(([fx, fy]) => {
        const nx = trollState.x + fx;
        const ny = trollState.y + fy;
        return !isCellBlockedForTroll(nx, ny);
      });
      if (valid.length) {
        const [sdx, sdy] = valid[Math.floor(Math.random() * valid.length)];
        trollState.x += sdx;
        trollState.y += sdy;
        trollState.key = `${trollState.x},${trollState.y}`;
        trollState.currentCaveIndex = null;
        trollState.targetCaveIndex = null;
      } else {
        pickRoamTarget();
      }
    }
    steps -= 1;
  }
}

function isTrollAtKey(key) {
  return trollState.active && trollState.key === key;
}

function isTrollInCaveAtKey(key) {
  return isTrollAtKey(key) && isTrollInCave();
}

initTrollState();

const BARBARIAN_START_TURN = 10;
const BARBARIAN_LATE_GAME_TURN = 200;
const BARBARIAN_RESPAWN_MIN = 8;
const BARBARIAN_RESPAWN_MAX = 14;
const MAX_BARBARIAN_CELLS = 3;
const LATE_GAME_MAX_BARBARIAN_CELLS = 4;
const BARBARIAN_FURY_MULTIPLIER = 1.3;
const BARBARIAN_ARMY_EARLY_MIN = 7;
const BARBARIAN_ARMY_EARLY_MAX = 10;
const BARBARIAN_ARMY_MID_MIN = 20;
const BARBARIAN_ARMY_MID_MAX = 30;
const BARBARIAN_ARMY_LATE_MIN = 30;
const BARBARIAN_ARMY_LATE_MAX = 40;
const BARBARIAN_GROWTH_INTERVAL = 20;
const BARBARIAN_GROWTH_AMOUNT = 5;
const BARBARIAN_CAP_EARLY = 30;
const BARBARIAN_CAP_MID = 50;
const BARBARIAN_ATTACK_TIMER_START = 25;
const BARBARIAN_CASTLE_STEAL_RATIO = 0.15;
const BARBARIAN_CASTLE_STEAL_RATIO_LATE = 0.2;
let turnCounter = 0;
let barbarianPhaseStarted = false;
let barbarianCells = [];
let barbarianRespawnTimers = [];
const ROBBER_CHANCE = 0.05;
const ROBBER_GOLD_REWARD_MIN = 200;
const ROBBER_GOLD_REWARD_MAX = 350;
const ROBBER_RESOURCE_REWARD_MIN = 15;
const ROBBER_RESOURCE_REWARD_MAX = 25;
const ROBBER_LOSS_PENALTY = 0.6;
const ROBBER_INFLUENCE_LOSS = 15;
let robberEvent = null;

function cellIndex(x, y) {
  return y * COLS + x + 1;
}

function setCellToInactive(x, y, {skipTreasureCleanup = false} = {}) {
    const key = `${x},${y}`;
    const cell = grid[key];
  if (!cell) return;
  if (nodeByPos[key]) {
    restoreImportantNodeCell(key, cell);
    return;
  }
  if (!skipTreasureCleanup && treasure && treasure.key === key) {
    clearTreasure();
    return;
  }
  cell.classList.remove("resource", "important", "owned", "reachable", "harpoon-target", "barbarian", "special", "forest", "resource-disabled", "mercenary", "thief", "cutthroat", "messenger", "caravan", "werewolf", "mage", "portal", "wormhole", "stairs", "flower", "clover", "stone", "rainbow-stone", "void-shard", "master", "troll", "troll-cave", "tavern", "tavern-node", "treasure", "fishka", "troll-cave-numbered", "troll-cave-entrance", "troll-cave-pit", "troll-cave-loot", "troll-cave-troll", "world-cell-hidden");
  cell.classList.add("inactive");
  cell.textContent = "";
  clearCellIcon(cell);
  clearBrokenResourceSmoke(cell);
  const trollToken = cell.querySelector(".troll-token");
  if (trollToken) trollToken.remove();
  cell.style.background = "";
  cell.style.borderColor = "";
  cell.style.color = "";
  cell.removeAttribute("data-barbarian");
  cell.removeAttribute("title");
  if (specialByPos[key]) {
    delete specialByPos[key];
  }
}

function setSpecialCell(x, y, label, extraClass = null, ownerIndex = null, featureKey = null, sourceCastleKey = null, meta = {}) {
  const key = `${x},${y}`;
  if (blockedCellKeys.has(key)) return false;
  if (nodeByPos[key]) return false;
  const cell = grid[key];
  if (!cell) return false;
  const previous = specialByPos[key];
  if (previous && previous.extraClass && previous.extraClass !== extraClass) {
    cell.classList.remove(previous.extraClass);
  }
  cell.classList.remove("inactive");
  cell.classList.add("important", "special");
  if (extraClass) cell.classList.add(extraClass);
  cell.textContent = label;
  clearCellIcon(cell);
  cell.classList.remove("resource-disabled");
  const entry = {
    x,
    y,
    label,
    extraClass,
    ownerIndex,
    featureKey,
    sourceCastleKey,
    disabled: false
  };
  entry.key = key;
  Object.assign(entry, meta);
  specialByPos[key] = entry;
  return true;
}

function setSpecialCellDisabled(key, disabled) {
  const entry = specialByPos[key];
  if (!entry) return false;
  const cell = grid[key];
  if (!cell) return false;
  entry.disabled = Boolean(disabled);
  if (entry.disabled) {
    cell.classList.add("resource-disabled");
  } else {
    cell.classList.remove("resource-disabled");
  }
  syncBrokenResourceSmoke(cell, entry.disabled && ["lumber", "mine", "clay"].includes(entry.featureKey));
  return true;
}

function clearTrapMarkerAt(key) {
  const cell = grid[key];
  const marker = cell?.querySelector(".trap-stun-marker");
  if (marker) marker.remove();
}

function clearTrapStunFieldOverlays() {
  if (typeof game === "undefined" || !game) return;
  game.querySelectorAll(".trap-stun-field").forEach(node => node.remove());
}

function shouldRevealTrapStunField(ownerIndex) {
  if (typeof socket === "undefined" || !socket) return true;
  if (typeof onlineMatchStarted === "undefined" || !onlineMatchStarted) return true;
  if (typeof localPlayerIndex !== "number") return false;
  return ownerIndex === localPlayerIndex;
}

function renderTrapStunFields() {
  Object.keys(grid).forEach(clearTrapMarkerAt);
  clearTrapStunFieldOverlays();
  if (
    typeof getVisibleWorldLayer === "function" &&
    getVisibleWorldLayer() !== "upper"
  ) return;
  trapStunFields.forEach(field => {
    if (!shouldRevealTrapStunField(field.ownerIndex)) return;
    if (typeof game === "undefined" || !game) return;
    const coords = (field.keys || []).map(key => key.split(",").map(Number));
    if (!coords.length) return;
    const minX = Math.min(...coords.map(([x]) => x));
    const minY = Math.min(...coords.map(([, y]) => y));
    const overlay = document.createElement("div");
    overlay.className = "trap-stun-field";
    overlay.style.left = `${minX * cellSize}px`;
    overlay.style.top = `${minY * cellSize}px`;
    overlay.style.width = `${cellSize * 2}px`;
    overlay.style.height = `${cellSize * 2}px`;
    const img = document.createElement("img");
    img.className = "trap-stun-field-icon";
    img.src = "assets/icons/trap_stun.png?v=1";
    img.alt = "???????-????";
    overlay.appendChild(img);
    game.appendChild(overlay);
  });
}

function removeTrapStunFieldById(id) {
  const index = trapStunFields.findIndex(field => field.id === id);
  if (index === -1) return null;
  const [removed] = trapStunFields.splice(index, 1);
  renderTrapStunFields();
  return removed;
}

function isSpecialFeatureDisabled(ownerIndex, featureKey, sourceCastleKey = null) {
  return Object.values(specialByPos).some(entry => {
    if (entry.ownerIndex !== ownerIndex) return false;
    if (entry.featureKey !== featureKey) return false;
    if (sourceCastleKey && entry.sourceCastleKey !== sourceCastleKey) return false;
    return entry.disabled;
  });
}

function clearAllResources() {
  Object.values(resourceByPos).forEach(entry => {
    setCellToInactive(entry.x, entry.y);
  });
  Object.keys(resourceByPos).forEach(key => delete resourceByPos[key]);
}

function getManhattanDistance(keyA, keyB) {
  const [x1, y1] = keyA.split(",").map(Number);
  const [x2, y2] = keyB.split(",").map(Number);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function pickResourceSpawnKeys(emptyKeys, requiredCount, minDistance) {
  const shuffledCandidates = emptyKeys
    .map(key => {
      const [x, y] = key.split(",").map(Number);
      return { key, x, y };
    })
    .sort(() => Math.random() - 0.5);
  const pickedCandidates = [];
  for (const candidate of shuffledCandidates) {
    const fits = pickedCandidates.every(existing =>
      Math.abs(existing.x - candidate.x) + Math.abs(existing.y - candidate.y) >= minDistance
    );
    if (!fits) continue;
    pickedCandidates.push(candidate);
    if (pickedCandidates.length >= requiredCount) {
      return pickedCandidates.map(entry => entry.key);
    }
  }
  return pickedCandidates.map(entry => entry.key);
}

function pickSingleResourceKey(emptyKeys, existingKeys, minDistance) {
  const shuffledKeys = emptyKeys.slice().sort(() => Math.random() - 0.5);
  return shuffledKeys.find(candidateKey =>
    existingKeys.every(existingKey => getManhattanDistance(existingKey, candidateKey) >= minDistance)
  ) || null;
}

function spawnResources() {
  clearAllResources();
  const emptyKeys = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const key = `${x},${y}`;
      if (nodeByPos[key]) continue;
      if (resourceByPos[key]) continue;
      if (specialByPos[key]) continue;
      if (cloverArtifact && cloverArtifact.key === key) continue;
      if (fishka && fishka.key === key) continue;
      if (barbarianCells.some(cell => cell.key === key)) continue;
      if (isSpawnBlocked(x, y)) continue;
      if (blockedCellKeys.has(key)) continue;
      if (treasure && treasure.key === key) continue;
      if (players.some(p => p.x === x && p.y === y)) continue;
      emptyKeys.push(key);
    }
  }
  resourceSpawnDebug = {
    turn: typeof turnCounter !== "undefined" ? turnCounter : 0,
    emptyKeysCount: emptyKeys.length,
    requestedTypes: [],
    pickedKeys: [],
    placedTypes: [],
    placedCount: 0,
    failedReason: emptyKeys.length === 0 ? "no-empty-keys" : "pending"
  };
  if (emptyKeys.length === 0) {
    if (typeof updateDebugOverlay === "function") updateDebugOverlay();
    return;
  }
  const goldType = resourceTypes.find(type => type.key === "gold");
  const armyType = resourceTypes.find(type => type.key === "army");
  const resType = resourceTypes.find(type => type.key === "resources");
  const baseTypes = [goldType, resType, armyType].filter(Boolean);
  const isMorning = typeof getTimeOfDay === "function" && getTimeOfDay().key === "morning";
  const typesToSpawn = isMorning ? [...baseTypes, ...baseTypes] : baseTypes;
  resourceSpawnDebug.requestedTypes = typesToSpawn.map(type => type.key);
  const pickedResourceKeys = pickResourceSpawnKeys(emptyKeys, typesToSpawn.length, RESOURCE_MIN_DISTANCE);
  resourceSpawnDebug.pickedKeys = pickedResourceKeys.slice();
  if (pickedResourceKeys.length < typesToSpawn.length) {
    resourceSpawnDebug.failedReason = `base-pick-failed:${pickedResourceKeys.length}/${typesToSpawn.length}`;
  }
  if (pickedResourceKeys.length >= typesToSpawn.length && armyType && Math.random() < 0.2) {
    const remainingKeys = emptyKeys.filter(key => !pickedResourceKeys.includes(key));
    const extraArmyKey = pickSingleResourceKey(remainingKeys, pickedResourceKeys, RESOURCE_MIN_DISTANCE);
    if (extraArmyKey) {
      pickedResourceKeys.push(extraArmyKey);
      typesToSpawn.push(armyType);
      resourceSpawnDebug.requestedTypes = typesToSpawn.map(type => type.key);
      resourceSpawnDebug.pickedKeys = pickedResourceKeys.slice();
    }
  }
  for (let index = 0; index < pickedResourceKeys.length; index++) {
    const key = pickedResourceKeys[index];
    const type = typesToSpawn[index];
    if (!type) continue;
    const [xStr, yStr] = key.split(",");
    const x = Number(xStr);
    const y = Number(yStr);
    const cell = grid[key];
    if (!cell) continue;
    cell.classList.add("resource", "important");
    cell.classList.remove("inactive");
    const iconDef = RESOURCE_ICONS[type.key];
    if (iconDef) {
      cell.textContent = "";
      const icon = setCellIcon(cell, iconDef.file, iconDef.alt);
      if (icon) icon.classList.add("resource-icon");
    } else {
      cell.textContent = type.label;
    }
    resourceByPos[key] = {type, x, y, key};
    resourceSpawnDebug.placedTypes.push(type.key);
  }
  resourceSpawnDebug.placedCount = resourceSpawnDebug.placedTypes.length;
  if (resourceSpawnDebug.placedCount > 0) {
    resourceSpawnDebug.failedReason = "ok";
  } else if (resourceSpawnDebug.failedReason === "pending") {
    resourceSpawnDebug.failedReason = "no-placements";
  }
  turnsUntilResources = RESOURCE_INTERVAL;
  updateStatusPanel();
  if (typeof pushDebugLog === "function") {
    pushDebugLog(
      `resourceSpawn:turn=${resourceSpawnDebug.turn} empty=${resourceSpawnDebug.emptyKeysCount} requested=${resourceSpawnDebug.requestedTypes.join(",") || "-"} picked=${resourceSpawnDebug.pickedKeys.join("|") || "-"} placed=${resourceSpawnDebug.placedTypes.join(",") || "-"} reason=${resourceSpawnDebug.failedReason}`
    );
  }
  if (typeof updateDebugOverlay === "function") updateDebugOverlay();
}
function updateStatusPanel() {
  const resourceValue = Math.max(0, turnsUntilResources);
  if (resourceCountdown) {
    resourceCountdown.textContent = resourceValue;
  }
  if (resourceCountdownLeft) {

    resourceCountdownLeft.textContent = resourceValue;
  }
  if (resourceCountdownRight) {
    resourceCountdownRight.textContent = resourceValue;
  }
  if (treasureState || treasureStateRight) {
    let text = "";
    if (treasure) {
      text = `Сокровище активно (${treasureTurnsRemaining} ходов)`;
    } else {
      const treasureDelay = Math.max(0, turnsUntilTreasure);
      text =
        treasureDelay === 0
          ? "Сокровище появится в текущем ходе"
          : `Сокровище появится через ${treasureDelay} ходов`;
    }
    if (treasureState) treasureState.textContent = text;
    if (treasureStateRight) treasureStateRight.textContent = text;
  }
}

function getAvailableBarbarianKeys() {
  const emptyKeys = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const key = `${x},${y}`;
      if (nodeByPos[key]) continue;
      if (resourceByPos[key]) continue;
      if (specialByPos[key]) continue;
      if (isSpawnBlocked(x, y)) continue;
      if (blockedCellKeys.has(key)) continue;
      if (treasure && treasure.key === key) continue;
      if (cloverArtifact && cloverArtifact.key === key) continue;
      if (fishka && fishka.key === key) continue;
      if (barbarianCells.some(cell => cell.key === key)) continue;
      if (players.some(player => player.x === x && player.y === y)) continue;
      const cell = grid[key];
      if (!cell || !cell.classList.contains("inactive")) continue;
      emptyKeys.push(key);
    }
  }
  return emptyKeys;
}

function getBarbarianCellLimit() {
  return turnCounter >= BARBARIAN_LATE_GAME_TURN ? LATE_GAME_MAX_BARBARIAN_CELLS : MAX_BARBARIAN_CELLS;
}

function getBarbarianBaseArmyForTurn() {
  let min = BARBARIAN_ARMY_EARLY_MIN;
  let max = BARBARIAN_ARMY_EARLY_MAX;
  if (turnCounter >= 225) {
    min = BARBARIAN_ARMY_LATE_MIN;
    max = BARBARIAN_ARMY_LATE_MAX;
  } else if (turnCounter >= 150) {
    min = BARBARIAN_ARMY_MID_MIN;
    max = BARBARIAN_ARMY_MID_MAX;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBarbarianArmyCapForTurn() {
  if (turnCounter >= 225) return Infinity;
  if (turnCounter >= 150) return BARBARIAN_CAP_MID;
  return BARBARIAN_CAP_EARLY;
}

function getRandomBarbarianTargetIndex() {
  const indexes = players
    .map((player, index) => (player ? index : -1))
    .filter(index => index >= 0);
  if (!indexes.length) return null;
  return indexes[Math.floor(Math.random() * indexes.length)];
}

function getBarbarianEffectiveArmy(baseArmy) {
  const normalizedBaseArmy = Math.max(1, Math.floor(Number(baseArmy) || 0));
  if (typeof isBarbarianFuryActive === "function" && isBarbarianFuryActive()) {
    return Math.max(1, Math.ceil(normalizedBaseArmy * BARBARIAN_FURY_MULTIPLIER));
  }
  return normalizedBaseArmy;
}

function updateBarbarianTimerVisual(entry) {
  if (!entry) return;
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  let badge = cell.querySelector(".barbarian-timer-badge");
  if (!badge) {
    badge = document.createElement("div");
    badge.className = "barbarian-timer-badge";
    cell.appendChild(badge);
  }
  const target = players[entry.targetPlayerIndex];
  const color = target?.color || "#9a9a9a";
  badge.style.background = color;
  badge.style.borderColor = color;
  badge.textContent = String(Math.max(0, Number.isInteger(entry.attackTimer) ? entry.attackTimer : 0));
  badge.title = target
    ? `Варвары нападут на замок ${target.name || `Игрок ${entry.targetPlayerIndex + 1}`} через ${Math.max(0, entry.attackTimer || 0)} ходов`
    : "Варвары выбирают цель";
}

function updateBarbarianCellVisual(entry) {
  if (!entry) return;
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("important", "barbarian");
  cell.textContent = "";
  setCellIcon(cell, "barbarian_village.png", "Варвары");
  cell.setAttribute("data-barbarian", "true");
  let displayArmy = entry.army;
  if (typeof getTimeOfDay === "function") {
    if (getTimeOfDay().key === "night") displayArmy = Math.ceil(entry.army * 1.5);
    else if (getTimeOfDay().key === "morning") displayArmy = Math.ceil(entry.army * 0.7);
  }
  const lootGold = Math.max(0, Math.floor(Number(entry.lootGold) || 0));
  const lootResources = Math.max(0, Math.floor(Number(entry.lootResources) || 0));
  cell.title = `ВАРВАРЫ: ${displayArmy} войск${
    lootGold > 0 || lootResources > 0
      ? `\nКуш в лагере: ${lootGold} золота, ${lootResources} ресурсов`
      : ""
  }`;
  updateBarbarianTimerVisual(entry);
}

function syncBarbarianStrengths() {
  barbarianCells.forEach(entry => {
    if (!entry) return;
    const baseArmy = Math.max(1, Math.floor(Number(entry.baseArmy ?? entry.army) || 0));
    entry.baseArmy = baseArmy;
    const growthBonus = Math.max(0, Math.floor(Number(entry.growthBonus) || 0));
    entry.army = getBarbarianEffectiveArmy(baseArmy + growthBonus);
    updateBarbarianCellVisual(entry);
  });
}

function spawnBarbarianCell() {
  if (barbarianCells.length >= getBarbarianCellLimit()) return false;
  const availableKeys = getAvailableBarbarianKeys();
  if (availableKeys.length === 0) return false;
  const pickIndex = Math.floor(Math.random() * availableKeys.length);
  const key = availableKeys[pickIndex];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const baseArmy = getBarbarianBaseArmyForTurn();
  const army = getBarbarianEffectiveArmy(baseArmy);
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("important", "barbarian");
  cell.textContent = "В";
  cell.title = "ВАРВАРЫ";
  setCellIcon(cell, "barbarian_village.png", "Варвары");
  cell.setAttribute("data-barbarian", "true");
  const entry = {
    key,
    x,
    y,
    baseArmy,
    army,
    growthBonus: 0,
    spawnTurn: turnCounter,
    attackTimer: BARBARIAN_ATTACK_TIMER_START,
    targetPlayerIndex: getRandomBarbarianTargetIndex()
  };
  barbarianCells.push(entry);
  updateBarbarianCellVisual(entry);
  cell.title = `ВАРВАРЫ: ${army} войск`;
  return true;
}

function spawnInitialBarbarianCells() {
  while (barbarianCells.length < getBarbarianCellLimit()) {
    if (!spawnBarbarianCell()) break;
  }
}

function ensureBarbarianCellsCount() {
  while (barbarianCells.length < getBarbarianCellLimit()) {
    if (!spawnBarbarianCell()) break;
  }
}

function removeBarbarianCell(key) {
  const index = barbarianCells.findIndex(cell => cell.key === key);
  if (index === -1) return null;
  const removed = barbarianCells.splice(index, 1)[0];
  setCellToInactive(removed.x, removed.y);
  return removed;
}

function scheduleBarbarianRespawn() {
  const delay =
    Math.floor(Math.random() * (BARBARIAN_RESPAWN_MAX - BARBARIAN_RESPAWN_MIN + 1)) +
    BARBARIAN_RESPAWN_MIN;
  barbarianRespawnTimers.push(delay);
}

function handleBarbarianRespawns() {
  if (!barbarianPhaseStarted) return;
  for (let i = barbarianRespawnTimers.length - 1; i >= 0; i--) {
    barbarianRespawnTimers[i] -= 1;
    if (barbarianRespawnTimers[i] <= 0) {
      barbarianRespawnTimers.splice(i, 1);
      const spawned = spawnBarbarianCell();
      if (!spawned) {
        barbarianRespawnTimers.push(1);
      }
    }
  }
}

function resolveBarbarianCastleAttack(entry) {
  const target = players[entry.targetPlayerIndex];
  if (!target) return;
  const ratio = turnCounter >= BARBARIAN_LATE_GAME_TURN
    ? BARBARIAN_CASTLE_STEAL_RATIO_LATE
    : BARBARIAN_CASTLE_STEAL_RATIO;
  const goldStolen = Math.floor(Math.max(0, target.resources?.gold || 0) * ratio);
  const resourcesStolen = Math.floor(Math.max(0, target.resources?.resources || 0) * ratio);
  target.resources.gold = Math.max(0, (target.resources?.gold || 0) - goldStolen);
  target.resources.resources = Math.max(0, (target.resources?.resources || 0) - resourcesStolen);
  // Украденное накапливается в лагере варваров — заберёт тот, кто их убьёт.
  entry.lootGold = (entry.lootGold || 0) + goldStolen;
  entry.lootResources = (entry.lootResources || 0) + resourcesStolen;
  if (typeof updatePlayerResources === "function") {
    updatePlayerResources(entry.targetPlayerIndex);
  }
  const targetName = target.name || `Игрок ${entry.targetPlayerIndex + 1}`;
  if (goldStolen > 0 || resourcesStolen > 0) {
    if (typeof showPickupToast === "function") {
      showPickupToast(
        `Варвары напали на замок ${targetName}: украдено ${goldStolen} золота и ${resourcesStolen} ресурсов. Куш спрятан в их лагере.`
      );
    }
    const victimMessage = `Варвары напали на ваш замок!\nУкрадено: ${goldStolen} золота, ${resourcesStolen} ресурсов.\nКуш спрятан в их лагере — верните его, победив варваров.`;
    if (
      typeof shouldDelegatePrivateUiToPlayer === "function" &&
      shouldDelegatePrivateUiToPlayer(entry.targetPlayerIndex)
    ) {
      if (typeof emitPrivateUiToPlayer === "function") {
        emitPrivateUiToPlayer(entry.targetPlayerIndex, "showBarbarianRaidModal", { text: victimMessage });
      }
    } else if (typeof openBarbarianRaidModal === "function") {
      openBarbarianRaidModal(victimMessage);
    }
  }
  if (typeof emitStateNow === "function") emitStateNow(true);
}

function tickBarbarianCells() {
  if (!barbarianPhaseStarted) return;
  barbarianCells.forEach(entry => {
    if (!entry) return;
    const spawnTurn = Number.isInteger(entry.spawnTurn) ? entry.spawnTurn : turnCounter;
    const turnsAlive = turnCounter - spawnTurn;
    if (turnsAlive > 0 && turnsAlive % BARBARIAN_GROWTH_INTERVAL === 0) {
      const cap = getBarbarianArmyCapForTurn();
      const currentTotal = (entry.baseArmy || 0) + (entry.growthBonus || 0);
      if (currentTotal < cap) {
        entry.growthBonus = (entry.growthBonus || 0) + BARBARIAN_GROWTH_AMOUNT;
        entry.army = getBarbarianEffectiveArmy((entry.baseArmy || 0) + entry.growthBonus);
        updateBarbarianCellVisual(entry);
      }
    }
    if (!Number.isInteger(entry.attackTimer)) {
      entry.attackTimer = BARBARIAN_ATTACK_TIMER_START;
    }
    entry.attackTimer -= 1;
    if (entry.attackTimer <= 0) {
      resolveBarbarianCastleAttack(entry);
      entry.attackTimer = BARBARIAN_ATTACK_TIMER_START;
      entry.targetPlayerIndex = getRandomBarbarianTargetIndex();
    }
    updateBarbarianTimerVisual(entry);
  });
}

function scaleBarbarianReward(army, min, max) {
  const factor = (army - 5) / 10;
  const scaled = min + Math.round(factor * (max - min));
  return Math.min(max, Math.max(min, scaled));
}

function getTreasureEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (voidShardByPos[key]) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (masterActive && key === MASTER_CELL.key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function getFlowerEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (voidShardByPos[key]) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function getStoneEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (voidShardByPos[key]) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function getRainbowEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    const [x, y] = key.split(",").map(Number);
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (voidShardByPos[key]) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (isSpawnBlocked(x, y)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function clearTreasure() {
  if (!treasure) return;
  const { x, y } = treasure;
  const cell = treasure.elem;
  if (cell) {
    cell.classList.remove("treasure", "important");
    clearCellIcon(cell);
    setCellToInactive(x, y, { skipTreasureCleanup: true });
  }
  treasure = null;
  treasureTurnsRemaining = 0;
  updateStatusPanel();
}

function spawnTreasure() {
  clearTreasure();
  const eligibleKeys = getTreasureEligibleKeys();
  if (eligibleKeys.length === 0) return;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("treasure", "important");
  cell.textContent = "";
  setCellIcon(cell, "treasure.png", "Сокровище");
  treasure = { key, x, y, elem: cell };
  treasureTurnsRemaining = TREASURE_DURATION;
  updateStatusPanel();
}

function clearFlower() {
  if (!flowerArtifact) return;
  const { x, y } = flowerArtifact;
  const cell = flowerArtifact.elem;
  if (cell) {
    cell.classList.remove("flower", "important");
    clearCellIcon(cell);
    setCellToInactive(x, y, { skipTreasureCleanup: true });
  }
  flowerArtifact = null;
  flowerTurnsRemaining = 0;
}

function clearClover() {
  if (!cloverArtifact) return;
  const { x, y } = cloverArtifact;
  const cell = cloverArtifact.elem;
  if (cell) {
    cell.classList.remove("clover", "important");
    clearCellIcon(cell);
    setCellToInactive(x, y, { skipTreasureCleanup: true });
  }
  cloverArtifact = null;
  cloverTurnsRemaining = 0;
}

function clearStone(key) {
  const entry = stoneByPos[key];
  if (!entry) return;
  setCellToInactive(entry.x, entry.y);
  delete stoneByPos[key];
}

function clearPortalPair() {
  if (!portalState?.active) return;
  (portalState.keys || []).forEach(key => {
    const entry = specialByPos[key];
    if (!entry) return;
    setCellToInactive(entry.x, entry.y);
  });
  portalState.active = false;
  portalState.keys = [];
  portalState.turnsRemaining = 0;
  portalState.nextSpawnTurn = turnCounter + randomIntRange(PORTAL_COOLDOWN_MIN, PORTAL_COOLDOWN_MAX);
}

function getPortalEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    const [x, y] = key.split(",").map(Number);
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (masterActive && key === MASTER_CELL.key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (isSpawnBlocked(x, y)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function spawnPortalPair() {
  if (!portalState || portalState.active) return false;
  const eligibleKeys = getPortalEligibleKeys();
  if (eligibleKeys.length < 2) return false;
  const shuffledKeys = eligibleKeys.slice().sort(() => Math.random() - 0.5);
  let firstKey = null;
  let secondKey = null;
  for (const candidateFirstKey of shuffledKeys) {
    const [x1, y1] = candidateFirstKey.split(",").map(Number);
    const distantKeys = eligibleKeys.filter(candidateSecondKey => {
      if (candidateSecondKey === candidateFirstKey) return false;
      const [x2, y2] = candidateSecondKey.split(",").map(Number);
      return Math.abs(x1 - x2) + Math.abs(y1 - y2) >= PORTAL_MIN_DISTANCE;
    });
    if (!distantKeys.length) continue;
    firstKey = candidateFirstKey;
    secondKey = distantKeys[Math.floor(Math.random() * distantKeys.length)];
    break;
  }
  if (!firstKey || !secondKey) return false;
  const [x1, y1] = firstKey.split(",").map(Number);
  const [x2, y2] = secondKey.split(",").map(Number);
  const placedFirst = setSpecialCell(x1, y1, PORTAL_LABEL, "portal", null, null, null, { type: "portal" });
  const placedSecond = setSpecialCell(x2, y2, PORTAL_LABEL, "portal", null, null, null, { type: "portal" });
  if (!placedFirst || !placedSecond) {
    if (placedFirst) setCellToInactive(x1, y1);
    if (placedSecond) setCellToInactive(x2, y2);
    return false;
  }
  const firstCell = grid[firstKey];
  const secondCell = grid[secondKey];
  if (firstCell) {
    firstCell.textContent = "";
    setCellIcon(firstCell, PORTAL_ICON.file, PORTAL_ICON.alt);
  }
  if (secondCell) {
    secondCell.textContent = "";
    setCellIcon(secondCell, PORTAL_ICON.file, PORTAL_ICON.alt);
  }
  portalState.active = true;
  portalState.keys = [firstKey, secondKey];
  portalState.turnsRemaining = randomIntRange(PORTAL_MIN_DURATION, PORTAL_MAX_DURATION);
  return true;
}

function getOtherPortalKey(key) {
  if (!portalState?.active || !Array.isArray(portalState.keys)) return null;
  if (!portalState.keys.includes(key)) return null;
  return portalState.keys.find(entry => entry !== key) || null;
}

function clearRainbowStone(key) {
  const entry = rainbowByPos[key];
  if (!entry) return;
  setCellToInactive(entry.x, entry.y);
  delete rainbowByPos[key];
}

function clearVoidShard(key) {
  const entry = voidShardByPos[key];
  if (!entry) return;
  setCellToInactive(entry.x, entry.y);
  delete voidShardByPos[key];
}

function spawnMasterCell() {
  const key = MASTER_CELL.key;
  const cell = grid[key];
  if (!cell) return false;
  if (!cell.classList.contains("inactive")) return false;
  cell.classList.remove("inactive");
  cell.classList.add("master", "important");
  cell.textContent = "";
  setCellIcon(cell, "grand_master.png", "Великий Мастер");
  masterActive = true;
  masterTurnsRemaining = MASTER_DURATION;
  return true;
}

function clearMasterCell() {
  if (!masterActive) return;
  setCellToInactive(MASTER_CELL.x, MASTER_CELL.y);
  masterActive = false;
  masterTurnsRemaining = 0;
  masterNextSpawnTurn = turnCounter + MASTER_SPAWN_INTERVAL;
}

function spawnFlower() {
  const eligibleKeys = getFlowerEligibleKeys();
  if (eligibleKeys.length === 0) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("flower", "important");
  cell.textContent = "";
  setCellIcon(cell, FLOWER_ICON.file, FLOWER_ICON.alt);
  flowerArtifact = { key, x, y, elem: cell };
  flowerTurnsRemaining = randomIntRange(FLOWER_MIN_DURATION, FLOWER_MAX_DURATION);
  return true;
}

function getCloverEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (masterActive && key === MASTER_CELL.key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function spawnClover() {
  const eligibleKeys = getCloverEligibleKeys();
  if (eligibleKeys.length === 0) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("clover", "important");
  cell.textContent = "";
  setCellIcon(cell, "clover.png", "Клевер");
  cloverArtifact = { key, x, y, elem: cell };
  cloverTurnsRemaining = CLOVER_DURATION;
  return true;
}

function getFishkaEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (voidShardByPos[key]) return false;
    if (masterActive && key === MASTER_CELL.key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function spawnFishka() {
  if (fishka) return false;
  const eligibleKeys = getFishkaEligibleKeys();
  if (eligibleKeys.length === 0) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("fishka", "important");
  cell.textContent = "";
  setCellIcon(cell, "fishka.png", "Фишка Дракона");
  fishka = { key, x, y, elem: cell, turnsRemaining: FISHKA_DURATION };
  return true;
}

function clearFishka() {
  if (!fishka) return;
  const { x, y } = fishka;
  const cell = fishka.elem;
  if (cell) {
    cell.classList.remove("fishka", "important");
    clearCellIcon(cell);
    setCellToInactive(x, y, { skipTreasureCleanup: true });
  }
  fishka = null;
  nextFishkaSpawnTurn = turnCounter + randomIntRange(FISHKA_RESPAWN_MIN, FISHKA_RESPAWN_MAX);
}

function spawnStone() {
  const eligibleKeys = getStoneEligibleKeys();
  if (eligibleKeys.length === 0) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("stone", "important");
  cell.textContent = "";
  setCellIcon(cell, "stone.png", "Необычный камень");
  stoneByPos[key] = { key, x, y, turnsRemaining: STONE_DURATION };
  return true;
}

function spawnRainbowStone() {
  const eligibleKeys = getRainbowEligibleKeys();
  if (eligibleKeys.length === 0) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("rainbow-stone", "important");
  cell.textContent = "";
  setCellIcon(cell, "rainbow_stone.png", "Радужный камень");
  rainbowByPos[key] = {
    key,
    x,
    y,
    turnsRemaining: randomIntRange(RAINBOW_MIN_DURATION, RAINBOW_MAX_DURATION)
  };
  return true;
}

function getVoidShardSpawnEligibleKeys() {
  const playerPositions = new Set(players.map(p => `${p.x},${p.y}`));
  return Object.keys(grid).filter(key => {
    const [x, y] = key.split(",").map(Number);
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (voidShardByPos[key]) return false;
    if (cloverArtifact && cloverArtifact.key === key) return false;
    if (fishka && fishka.key === key) return false;
    if (playerPositions.has(key)) return false;
    if (treasure && treasure.key === key) return false;
    if (flowerArtifact && flowerArtifact.key === key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (isSpawnBlocked(x, y)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    if (!cell) return false;
    if (!cell.classList.contains("inactive")) return false;
    return true;
  });
}

function spawnVoidShard() {
  const eligibleKeys = getVoidShardSpawnEligibleKeys();
  if (eligibleKeys.length === 0) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [xStr, yStr] = key.split(",");
  const x = Number(xStr);
  const y = Number(yStr);
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("void-shard", "important");
  cell.textContent = "";
  setCellIcon(cell, VOID_SHARD_ICON.file, VOID_SHARD_ICON.alt);
  voidShardByPos[key] = {
    key,
    x,
    y,
    turnsRemaining: randomIntRange(VOID_SHARD_MIN_DURATION, VOID_SHARD_MAX_DURATION)
  };
  return true;
}

function handleFlowerTimers() {
  if (flowerArtifact) {
    flowerTurnsRemaining -= 1;
    if (flowerTurnsRemaining <= 0) {
      clearFlower();
    }
  }
  if (!flowerArtifact && flowerSpawnIndex < flowerSpawnTurns.length) {
    const nextTurn = flowerSpawnTurns[flowerSpawnIndex];
    if (turnCounter >= nextTurn) {
      const spawned = spawnFlower();
      if (spawned) {
        flowerSpawnIndex += 1;
      }
    }
  }
}

function handleCloverTimers() {
  if (cloverArtifact) {
    cloverTurnsRemaining -= 1;
    if (cloverTurnsRemaining <= 0) {
      clearClover();
    }
  }
}

function handleStoneSpawns() {
  if (nextStoneSpawnTurn === null) {
    nextStoneSpawnTurn = randomIntRange(STONE_FIRST_MIN_TURN, STONE_FIRST_MAX_TURN);
  }
  if (turnCounter < nextStoneSpawnTurn) return;
  const spawned = spawnStone();
  if (spawned) {
    nextStoneSpawnTurn =
      turnCounter + randomIntRange(STONE_COOLDOWN_MIN, STONE_COOLDOWN_MAX);
  }
}

function handleCloverSpawns() {
  if (nextCloverSpawnTurn === null) {
    nextCloverSpawnTurn = randomIntRange(CLOVER_SPAWN_MIN, CLOVER_SPAWN_MAX);
  }
  if (turnCounter < nextCloverSpawnTurn) return;
  spawnClover();
  nextCloverSpawnTurn = turnCounter + randomIntRange(CLOVER_SPAWN_MIN, CLOVER_SPAWN_MAX);
}

function handleFishkaTimers() {
  if (!fishka) return;
  fishka.turnsRemaining -= 1;
  if (fishka.turnsRemaining <= 0) {
    clearFishka();
  }
}

function handleFishkaSpawns() {
  if (fishka) return;
  if (nextFishkaSpawnTurn === null) {
    nextFishkaSpawnTurn = randomIntRange(FISHKA_FIRST_SPAWN_MIN, FISHKA_FIRST_SPAWN_MAX);
  }
  if (turnCounter < nextFishkaSpawnTurn) return;
  spawnFishka();
  nextFishkaSpawnTurn = turnCounter + randomIntRange(FISHKA_RESPAWN_MIN, FISHKA_RESPAWN_MAX);
}

function handleRainbowSpawns() {
  if (rainbowSpawnIndex >= rainbowSpawnTurns.length) return;
  const nextTurn = rainbowSpawnTurns[rainbowSpawnIndex];
  if (turnCounter < nextTurn) return;
  const spawned = spawnRainbowStone();
  if (spawned) {
    rainbowSpawnIndex += 1;
  }
}

function handleVoidShardSpawns() {
  if (voidShardSpawnTurn === null) {
    voidShardSpawnTurn = randomIntRange(VOID_SHARD_SPAWN_MIN_TURN, VOID_SHARD_SPAWN_MAX_TURN);
  }
  if (voidShardSpawnTurn < 0) return;
  if (Object.keys(voidShardByPos).length > 0) return;
  if (turnCounter < voidShardSpawnTurn) return;
  const spawned = spawnVoidShard();
  if (spawned) {
    voidShardSpawnTurn = -1;
  }
}

function handleRainbowTimers() {
  Object.values(rainbowByPos).forEach(entry => {
    entry.turnsRemaining -= 1;
    if (entry.turnsRemaining <= 0) {
      clearRainbowStone(entry.key);
    }
  });
}

function handlePortalTimers() {
  if (!portalState?.active) return;
  portalState.turnsRemaining -= 1;
  if (portalState.turnsRemaining <= 0) {
    clearPortalPair();
  }
}

function handlePortalSpawns() {
  if (!portalState) {
    initPortalState();
  }
  if (portalState.active) return;
  if (turnCounter < portalState.nextSpawnTurn) return;
  const spawned = spawnPortalPair();
  if (!spawned) {
    portalState.nextSpawnTurn = turnCounter + 1;
  }
}

function handleMasterCell() {
  if (typeof isMasterJourneyActive === "function" && isMasterJourneyActive()) {
    if (masterActive) {
      clearMasterCell();
    }
    return;
  }
  if (masterActive) {
    masterTurnsRemaining -= 1;
    if (masterTurnsRemaining <= 0) {
      clearMasterCell();
    }
    return;
  }
  if (turnCounter >= masterNextSpawnTurn) {
    const spawned = spawnMasterCell();
    if (!spawned) {
      return;
    }
  }
}

function handleStoneTimers() {
  Object.values(stoneByPos).forEach(entry => {
    entry.turnsRemaining -= 1;
    if (entry.turnsRemaining <= 0) {
      clearStone(entry.key);
    }
  });
}

function handleVoidShardTimers() {
  Object.values(voidShardByPos).forEach(entry => {
    entry.turnsRemaining -= 1;
    if (entry.turnsRemaining <= 0) {
      clearVoidShard(entry.key);
    }
  });
}

function getMageSlotById(id) {
  return mageSlot.id === id ? mageSlot : null;
}

function getMageSlotByKey(key) {
  return mageSlot.active && mageSlot.key === key ? mageSlot : null;
}

function updateMageTimer(slot) {
  if (!slot || !slot.cell) return;
  if (!slot.timerElem) {
    const cell = grid[slot.key];
    if (!cell) return;
    const timer = document.createElement("div");
    timer.className = "mage-timer";
    cell.appendChild(timer);
    slot.timerElem = timer;
    slot.cell = cell;
  }
  if (slot.timerElem) {
    slot.timerElem.textContent = slot.turnsRemaining.toString();
  }
}

function spawnMageCell(slot) {
  if (!slot || slot.active) return false;
  if (slot.nextSpawnIndex === null) {
    slot.nextSpawnIndex = Math.floor(Math.random() * MAGE_POSITIONS.length);
  }
  const pick = MAGE_POSITIONS[slot.nextSpawnIndex];
  const success = setSpecialCell(
    pick.x,
    pick.y,
    slot.label,
    "mage",
    null,
    null,
    null,
    { type: "mage", mageId: slot.id }
  );
  if (!success) return false;
  slot.nextSpawnIndex = (slot.nextSpawnIndex + 1) % MAGE_POSITIONS.length;
  const key = `${pick.x},${pick.y}`;
  const cell = grid[key];
  if (cell) {
    setCellIcon(cell, "mage.png", "Маг");
  }
  slot.active = true;
  slot.turnsRemaining = randomIntRange(MAGE_MIN_DURATION, MAGE_MAX_DURATION);
  slot.cell = cell || null;
  slot.key = key;
  slot.x = pick.x;
  slot.y = pick.y;
  updateMageTimer(slot);
  return true;
}

function removeMageCell(slot) {
  if (!slot || !slot.active) return;
  const cell = grid[slot.key];
  if (cell) {
    const timer = cell.querySelector(".mage-timer");
    if (timer) timer.remove();
  }
  if (typeof slot.x === "number" && typeof slot.y === "number") {
    setCellToInactive(slot.x, slot.y);
  }
  slot.active = false;
  slot.turnsRemaining = 0;
  slot.cell = null;
  slot.timerElem = null;
  slot.key = null;
  slot.x = null;
  slot.y = null;
  slot.nextSpawnTurn = turnCounter + randomIntRange(MAGE_MIN_COOLDOWN, MAGE_MAX_COOLDOWN);
  if (typeof closeMageModal === "function" && pendingMageSlot === slot) {
    closeMageModal();
  }
}

function handleMageCellTimers() {
  const slot = mageSlot;
  if (typeof isMageJourneyActive === "function" && isMageJourneyActive()) {
    if (slot.active) {
      removeMageCell(slot);
    }
    return;
  }
  if (slot.active) {
    slot.turnsRemaining -= 1;
    updateMageTimer(slot);
    if (slot.turnsRemaining <= 0) {
      removeMageCell(slot);
    }
    return;
  }
  if (turnCounter >= slot.nextSpawnTurn) {
    spawnMageCell(slot);
  }
}
