// ────────────────────────────────────────
//   ПЕШКИ
// ────────────────────────────────────────
const startNode = importantNodes.find(n => n.id === 6) || {x: 0, y: 0};
const players = [
  {
    id: 0,
    name: "Игрок 1",
    color: "#4cc9f0",
    x: startNode.x,
    y: startNode.y,
    layer: "upper",
    underworldState: null,
    trollCaveEntranceIndex: null,
    resources: {gold: 0, army: 0, influence: 0, resources: 0},
    pocket: {gold: 0, army: 0, resources: 0},
    income: {resources: 0},
    attack: 6,
    hasSword: false,
    hasArmor: false,
    hasWorkshopSword: false,
    barbarianKills: 0,
    slowTurnsRemaining: 0,
    noDoubleTurnsRemaining: 0,
    royalBlessingTurnsRemaining: 0,
    poisonCount: 0,
    invisPotionCount: 0,
    luckPotionCount: 0,
    invulnPotionCount: 0,
    fogOfWarCount: 0,
    invisTurnsRemaining: 0,
    luckTurnsRemaining: 0,
    invulnTurnsRemaining: 0,
    cloverCount: 0,
    trollClubCount: 0,
    flowerCount: 0,
    voidShardCount: 0,
    tokenCount: 0,
    bootsCount: 0,
    ballistaCount: 0,
    ballistaLevel: 0,
    ballistaShotsThisTurn: 0,
    boltCount: 0,
    harpoonCount: 0,
    ringCount: 0,
    terrorRingCount: 0,
    rainbowStoneCount: 0,
    mysticStoneCount: 0,
    heroHiltCount: 0,
    werewolfFangCount: 0,
    werewolfAmuletCount: 0,
    luckAmuletCount: 0,
    builderAmuletCount: 0,
    builderAmuletChargeCount: 0,
    builderAmuletTurnCounter: 0,
    hasCrystalSword: false,
    trapStunCount: 0,
    bridgeCount: 0,
    beerProtectionTurnsRemaining: 0,
    beerSlowTurnsRemaining: 0,
    beerEffectStartedTurn: null,
    tavernWheelPlaysThisTurn: 0,
    tavernDragonPlaysThisTurn: 0,
    stoneBonusRollsRemaining: 0,
    stoneSpeedTurnsRemaining: 0,
    stunnedTurnsRemaining: 0,
    stunSource: null,
    barbarianRewards: {r5: false, r10: false, r20: false}
  },
  {
    id: 1,
    name: "Игрок 2",
    color: "#ff595e",
    x: startNode.x,
    y: startNode.y,
    layer: "upper",
    underworldState: null,
    trollCaveEntranceIndex: null,
    resources: {gold: 0, army: 0, influence: 0, resources: 0},
    pocket: {gold: 0, army: 0, resources: 0},
    income: {resources: 0},
    attack: 6,
    hasSword: false,
    hasArmor: false,
    hasWorkshopSword: false,
    barbarianKills: 0,
    slowTurnsRemaining: 0,
    noDoubleTurnsRemaining: 0,
    royalBlessingTurnsRemaining: 0,
    poisonCount: 0,
    invisPotionCount: 0,
    luckPotionCount: 0,
    invulnPotionCount: 0,
    fogOfWarCount: 0,
    invisTurnsRemaining: 0,
    luckTurnsRemaining: 0,
    invulnTurnsRemaining: 0,
    cloverCount: 0,
    trollClubCount: 0,
    flowerCount: 0,
    voidShardCount: 0,
    tokenCount: 0,
    bootsCount: 0,
    ballistaCount: 0,
    ballistaLevel: 0,
    ballistaShotsThisTurn: 0,
    boltCount: 0,
    harpoonCount: 0,
    ringCount: 0,
    terrorRingCount: 0,
    rainbowStoneCount: 0,
    mysticStoneCount: 0,
    heroHiltCount: 0,
    werewolfFangCount: 0,
    werewolfAmuletCount: 0,
    luckAmuletCount: 0,
    builderAmuletCount: 0,
    builderAmuletChargeCount: 0,
    builderAmuletTurnCounter: 0,
    hasCrystalSword: false,
    trapStunCount: 0,
    bridgeCount: 0,
    beerProtectionTurnsRemaining: 0,
    beerSlowTurnsRemaining: 0,
    beerEffectStartedTurn: null,
    tavernWheelPlaysThisTurn: 0,
    tavernDragonPlaysThisTurn: 0,
    stoneBonusRollsRemaining: 0,
    stoneSpeedTurnsRemaining: 0,
    stunnedTurnsRemaining: 0,
    stunSource: null,
    barbarianRewards: {r5: false, r10: false, r20: false}
  }
];
const pawns = players.map((player, index) => {
  const pawn = document.createElement("div");
  pawn.className = "pawn";
  pawn.textContent = "";
  pawn.style.boxShadow = `0 0 12px ${player.color}88`;
  const icon = document.createElement("img");
  icon.className = "icon";
  icon.src = index === 0 ? "assets/icons/player_1.png" : "assets/icons/player_2.png";
  icon.alt = index === 0 ? "Игрок 1" : "Игрок 2";
  icon.style.filter = `drop-shadow(0 0 10px ${player.color}aa)`;
  pawn.appendChild(icon);
  game.appendChild(pawn);
  return pawn;
});
const MAGE_SLOW_COST = 750;
const MAGE_NO_DOUBLE_COST = 750;
const MAGE_POISON_COST = 6500;
const MAGE_SLOW_DURATION = 15;
const MAGE_NO_DOUBLE_DURATION = 15;
const MAGE_SLOW_PENALTY = 3;
const POISON_INFLUENCE_THRESHOLD = 1000;
const ROYAL_BLESSING_DISCOUNT = 0.3;
const ROYAL_BLESSING_MIN_TURNS = 15;
const ROYAL_BLESSING_MAX_TURNS = 25;
playerColorDots.forEach((dot, index) => {
  const player = players[index];
  if (player) dot.style.background = player.color;
});
const guardAccess = players.map(() => false);
let pendingGuardMove = null;
let pendingGuardPlayerIndex = null;
const POTION_INVIS_TURNS = 25;
const POTION_LUCK_TURNS = 25;
const CLOVER_LUCK_TURNS = 18;
const TAVERN_CELL_KEY = "1,1";
const TAVERN_BEER_COST = 250;
const TAVERN_BEER_PROTECTION_TURNS = 6;
const TAVERN_BEER_SLOW_TURNS = 10;
const TAVERN_BEER_SLOW_PENALTY = 4;
const TAVERN_WHEEL_MAX_PLAYS_PER_TURN = 3;
const TAVERN_WHEEL_SPIN_DURATION_MS = 3000;
const TAVERN_DRAGON_MAX_PLAYS_PER_TURN = 2;
const TAVERN_DRAGON_GROWTH_MS = 9000;
const TAVERN_DRAGON_MAX_MULTIPLIER = 50;
const BALLISTA_COST = 600;
const BALLISTA_LEVEL_2_COST = 1000;
const BOLT_COST = 125;
const TRAP_STUN_COST = 100;
const TRAP_STUN_DURATION = 3;
const SPECIAL_ARTIFACT_SLOT_LIMIT = 3;
const BALLISTA_RANGE = 12;
const BALLISTA_DAMAGE_MIN = 13;
const BALLISTA_DAMAGE_MAX = 17;
const HARPOON_GOLD_COST = 1000;
const HARPOON_RESOURCE_COST = 500;
const HARPOON_RANGE = 12;
const BRIDGE_COST = 300;
const CASTLE_MINE_LEVEL_2_COST = 300;
const CASTLE_MINE_LEVEL_2_INCOME = 30;
const WORLD_EVENT_MIN_TURN = 15;
const WORLD_EVENT_MAX_TURN = 300;
const WORLD_EVENT_TRIGGER_CHANCE = 0.5;
const WORLD_EVENT_GOLD_TAX_MULTIPLIER = 1.3;
const WORLD_EVENT_TROLL_HUNT_GOLD_REWARD = 1000;
const ROYAL_MESSENGER_EVENT_ENABLED = false;
const ROYAL_MESSENGER_MIN_TURN = 75;
const ROYAL_MESSENGER_MAX_TURN = 350;
const ROYAL_MESSENGER_MIN_SPAWNS = 1;
const ROYAL_MESSENGER_MAX_SPAWNS = 3;
const ROYAL_MESSENGER_TAX_GOLD = 500;
const ROYAL_MESSENGER_EMPTY_CASTLE_INFLUENCE_LOSS = 150;
const ROYAL_MESSENGER_NO_CASTLE_INFLUENCE_LOSS = 100;
const ROYAL_MESSENGER_SUCCESS_INFLUENCE_REWARD = 150;
const ROYAL_MESSENGER_RETURN_GOLD_FINE = 500;
const ROYAL_MESSENGER_SPEED_MIN = 3;
const ROYAL_MESSENGER_SPEED_MAX = 4;
const CARAVAN_MIN_TURN = 15;
const CARAVAN_MAX_TURN = 350;
const CARAVAN_MIN_SPAWNS = 1;
const CARAVAN_MAX_SPAWNS = 3;
const CARAVAN_GOLD_MIN = 350;
const CARAVAN_GOLD_MAX = 1000;
const CARAVAN_SPEED_MIN = 4;
const CARAVAN_SPEED_MAX = 6;
const CARAVAN_SUCCESS_INFLUENCE_REWARD = 50;
const CARAVAN_EMPTY_INFLUENCE_LOSS = 100;
const FULL_MOON_MIN_TURN = 15;
const FULL_MOON_MAX_TURN = 350;
const FULL_MOON_MIN_SPAWNS = 1;
const FULL_MOON_MAX_SPAWNS = 2;
const FULL_MOON_MIN_DURATION = 15;
const FULL_MOON_MAX_DURATION = 25;
const FULL_MOON_WEREWOLF_SPAWN_DELAY = 3;
const WEREWOLF_SPEED_MIN = 6;
const WEREWOLF_SPEED_MAX = 9;
const WEREWOLF_ATTACK_MIN = 20;
const WEREWOLF_ATTACK_MAX = 35;
const WEREWOLF_MAX_HEALTH = 60;
const WEREWOLF_MOVE_INTERVAL = 2;
const WEREWOLF_RETARGET_INTERVAL = 4;
const WEREWOLF_FORCED_TARGET_TURNS = 5;
const FOG_OF_WAR_MIN_TURN = 3;
const FOG_OF_WAR_MAX_TURN = 350;
const FOG_OF_WAR_MIN_SPAWNS = 1;
const FOG_OF_WAR_MAX_SPAWNS = 3;
const FOG_OF_WAR_MIN_DURATION = 10;
const FOG_OF_WAR_MAX_DURATION = 15;
const FOG_OF_WAR_PLAYER_RADIUS = 4;
const FOG_OF_WAR_ICON_COUNT = 3;
const FOG_OF_WAR_EVENT_ENABLED = true;
const ROYAL_TAX_EVENT_ENABLED = false;
const HERO_BATTLE_INFLUENCE_LOSS = 50;
const PLAYER_BATTLE_CARD_REVEAL_DELAY = 1400;
const PLAYER_BATTLE_CARD_RULES = {
  attack: {
    key: "attack",
    name: "Атака",
    mark: "⚔",
    always: "Личная атака героя усилена на 125%.",
    victory: "20% армии наносит удар 1 к 1 без ответа.",
    beats: "feint"
  },
  defense: {
    key: "defense",
    name: "Оборона",
    mark: "◆",
    always: "75% армии уходит в резерв и точно выживает.",
    victory: "При поражении в бою противник заберёт только 25% добычи вместо 80%.",
    beats: "attack"
  },
  feint: {
    key: "feint",
    name: "Финт",
    mark: "✦",
    always: "Личная атака противника ослаблена на 75%.",
    victory: "50% шанс выбить случайный предмет противника.",
    beats: "defense"
  }
};
const KING_CONCERN_ROLL_PENALTY = 3;
const WORLD_EVENTS = {
  nonAggressionPact: {
    key: "nonAggressionPact",
    title: "Королевский указ",
    minDuration: 20,
    maxDuration: 30,
    getMessage: duration => `Король объявил Пакт о ненападении. Вы не можете атаковать другого игрока ${duration} ходов.`
  },
  goldTax: {
    key: "goldTax",
    title: "Королевский указ",
    minDuration: 20,
    maxDuration: 40,
    getMessage: duration => `Король объявил о дополнительном налоге! Все покупки дороже на 30% в течении ${duration} ходов.`
  },
  merchantsStrike: {
    key: "merchantsStrike",
    title: "Королевский указ",
    minDuration: 15,
    maxDuration: 40,
    getMessage: duration => `Торговцы объявили забастовку! ${duration} ходов они не будут продавать товары`
  },
  barbarianFury: {
    key: "barbarianFury",
    title: "Королевский указ",
    minDuration: 10,
    maxDuration: 30,
    getMessage: duration => `Варвары готовятся к войне... Они стали сильнее на ${duration} ходов, будь осторожен.`
  },
  trollHunt: {
    key: "trollHunt",
    title: "Королевский указ",
    minDuration: 10,
    maxDuration: 20,
    getMessage: duration => `Король объявил охоту на троллей! За убийство троллей рыцари получат 1000 золота в течении ${duration} ходов.`
  },
  mageJourney: {
    key: "mageJourney",
    title: "Королевский указ",
    minDuration: 20,
    maxDuration: 35,
    getMessage: duration => `Маг отправился в дальнее странствие, его не будет ${duration} ходов.`
  },
  masterJourney: {
    key: "masterJourney",
    title: "Королевский указ",
    minDuration: 20,
    maxDuration: 35,
    getMessage: duration => `Великий мастер отправился в дальнее странствие, его не будет ${duration} ходов.`
  },
  kingConcern: {
    key: "kingConcern",
    title: "Королевский указ",
    minDuration: 10,
    maxDuration: 15,
    getMessage: duration => `Король беспокоится о своей безопасности. Пусть тот, у кого больше армия, передвигается помедленнее на протяжении ${duration} ходов.`
  },
  mercenaryRiot: {
    key: "mercenaryRiot",
    title: "Королевский указ",
    instant: true,
    getMessage: () => "Наемники грабят ближайшие деревни, будьте осторожны."
  },
  wealthTax: {
    key: "wealthTax",
    title: "Королевский указ",
    instant: true,
    getMessage: () => "Король собирает налог с богачей! Самый богатый игрок заплатит 15% от своих накоплений."
  },
  royalTax: {
    key: "royalTax",
    title: "Королевский указ",
    rollsPerGame: 2,
    instant: true,
    minTax: 300,
    maxTax: 1000
  },
  kingAuction: {
    key: "kingAuction",
    title: "Аукцион короля",
    instant: true
  },
  kingGenerosity: {
    key: "kingGenerosity",
    title: "Щедрость короля",
    instant: true
  },
  quarantine: {
    key: "quarantine",
    title: "Королевский указ",
    minDuration: 15,
    maxDuration: 25,
    delayedActivationTurns: 5,
    getMessage: duration => `В городе карантин! Приказ никого не впускать ${duration} ходов. Покиньте город в течении 5 ходов.`
  },
  trollsLeaveCaves: {
    key: "trollsLeaveCaves",
    title: "Королевский указ",
    rollsPerGame: 2,
    minDuration: 30,
    maxDuration: 30,
    getMessage: duration => `Тролли покинули пещеры на ${duration} ходов.`
  }
};
let mineLevel2OwnerPlayerIndex = null;
let scheduledWorldEvents = [];
let activeWorldEvents = {};
let worldEventModalQueue = [];
let scheduledRoyalMessengerTurns = [];
let pendingRoyalMessengerEvents = 0;
let scheduledCaravanTurns = [];
let pendingCaravanEvents = 0;
let scheduledFullMoonTurns = [];
let pendingFullMoonEvents = 0;
let fullMoonEventState = null;
let scheduledFogOfWarTurns = [];
let pendingFogOfWarEvents = 0;
let fogOfWarState = null;
let pendingPlayerBattle = null;
let playerBattleSequenceId = 0;
let playerBattleRevealState = null;
let playerBattleResolveTimer = null;
let localPlayerBattleSelection = null;
const fogOfWarVariantsByKey = {};
let kingAuctionState = normalizeKingAuctionState();
let kingAuctionViewerPlayerIndex = null;
const kingAuctionDraftBids = players.map(() => "");
let kingGenerosityState = normalizeKingGenerosityState();
let kingGenerosityViewerPlayerIndex = null;
const messengers = [];
let messengerIdCounter = 1;
let pendingMessengerInteraction = null;
const caravans = [];
let caravanIdCounter = 1;
let werewolfState = null;
const ROYAL_MESSENGER_EVENT_TITLE = "Королевский указ";
const ROYAL_MESSENGER_EVENT_TEXT = "Король отправил гонцов в ваши замки, чтобы собрать налог 500 золотых монет. Проследите, чтобы монеты дошли до казны!";
const ROYAL_MESSENGER_SPAWN_KEYS = guardNode
  ? [
      `${guardNode.x},${guardNode.y - 1}`,
      `${guardNode.x - 1},${guardNode.y}`
    ]
  : [];
const CARAVAN_EVENT_TITLE = "Событие";
const CARAVAN_EVENT_TEXT = "В королевстве проезжает караван!";
const CARAVAN_START_KEY = "0,0";
const FULL_MOON_EVENT_TITLE = "Событие";
const FULL_MOON_EVENT_TEXT = "Сегодня полнолуние, будьте осторожны! В королевстве водятся оборотни...";
const FOG_OF_WAR_EVENT_TITLE = "Событие";
const FOG_OF_WAR_EVENT_TEXT = "Королевство окутало туманом, не потеряйтесь!";

const KING_GENEROSITY_GIFTS = [
  {
    key: "army-8",
    title: "+8 войск",
    text: "Получить +8 войск в карман.",
    apply(player) {
      player.pocket.army += 8;
      return "Король подарил вам 8 войск.";
    }
  },
  {
    key: "gold-500",
    title: "+500 золота",
    text: "Получить +500 золота в карман.",
    apply(player) {
      player.pocket.gold += 500;
      return "Король подарил вам 500 золота.";
    }
  },
  {
    key: "influence-100",
    title: "+100 влияния",
    text: "Получить +100 влияния.",
    apply(player) {
      player.resources.influence += 100;
      return "Король подарил вам 100 влияния.";
    }
  },
  {
    key: "resources-200",
    title: "+200 ресурсов",
    text: "Получить +200 ресурсов в карман.",
    apply(player) {
      player.pocket.resources += 200;
      return "Король подарил вам 200 ресурсов.";
    }
  },
  {
    key: "bolt-3",
    title: "3 болта",
    text: "Получить 3 болта для баллисты.",
    apply(player) {
      player.boltCount = (player.boltCount || 0) + 3;
      return "Король подарил вам 3 болта.";
    }
  },
  {
    key: "potion-luck",
    title: "Зелье удачи",
    text: "Получить зелье удачи.",
    apply(player) {
      player.luckPotionCount = (player.luckPotionCount || 0) + 1;
      return "Король подарил вам зелье удачи.";
    }
  },
  {
    key: "potion-invis-2",
    title: "2 зелья невидимости",
    text: "Получить 2 зелья невидимости.",
    apply(player) {
      player.invisPotionCount = (player.invisPotionCount || 0) + 2;
      return "Король подарил вам 2 зелья невидимости.";
    }
  },
  {
    key: "bridge-2",
    title: "2 моста",
    text: "Получить 2 моста.",
    apply(player) {
      player.bridgeCount = (player.bridgeCount || 0) + 2;
      return "Король подарил вам 2 моста.";
    }
  },
  {
    key: "rainbow",
    title: "Радужный камень",
    text: "Получить радужный камень.",
    isAvailable(player) {
      return hasFreeSpecialArtifactSlot(player);
    },
    apply(player) {
      if (!tryAddSpecialArtifactToInventory(player, "rainbow")) {
        return "У вас не нашлось места для радужного камня.";
      }
      return "Король подарил вам радужный камень.";
    }
  },
  {
    key: "gold-1000",
    title: "+1000 золота",
    text: "Получить +1000 золота в карман.",
    apply(player) {
      player.pocket.gold += 1000;
      return "Король подарил вам 1000 золота.";
    }
  },
  {
    key: "army-5",
    title: "+5 войск",
    text: "Получить +5 войск в карман.",
    apply(player) {
      player.pocket.army += 5;
      return "Король подарил вам 5 войск.";
    }
  },
  {
    key: "bridge-1",
    title: "1 мост",
    text: "Получить 1 мост.",
    apply(player) {
      player.bridgeCount = (player.bridgeCount || 0) + 1;
      return "Король подарил вам мост.";
    }
  },
  {
    key: "bolt-2",
    title: "2 болта",
    text: "Получить 2 болта для баллисты.",
    apply(player) {
      player.boltCount = (player.boltCount || 0) + 2;
      return "Король подарил вам 2 болта.";
    }
  },
  {
    key: "trap-stun-3",
    title: "3 ловушки-стан",
    text: "Получить 3 ловушки-стан.",
    apply(player) {
      player.trapStunCount = (player.trapStunCount || 0) + 3;
      return "Король подарил вам 3 ловушки-стан.";
    }
  },
  {
    key: "trap-stun-1",
    title: "1 ловушка-стан",
    text: "Получить 1 ловушку-стан.",
    apply(player) {
      player.trapStunCount = (player.trapStunCount || 0) + 1;
      return "Король подарил вам ловушку-стан.";
    }
  },
  {
    key: "resources-100",
    title: "+100 ресурсов",
    text: "Получить +100 ресурсов в карман.",
    apply(player) {
      player.pocket.resources += 100;
      return "Король подарил вам 100 ресурсов.";
    }
  },
  {
    key: "flower",
    title: "Таинственный цветок",
    text: "Получить таинственный цветок.",
    isAvailable(player) {
      return hasFreeSpecialArtifactSlot(player);
    },
    apply(player) {
      if (!tryAddSpecialArtifactToInventory(player, "flower")) {
        return "У вас не нашлось места для таинственного цветка.";
      }
      return "Король подарил вам таинственный цветок.";
    }
  }
];

function normalizeKingGenerosityState(state = null) {
  const offers = players.map((_, index) => {
    const rawOffers = Array.isArray(state?.offers?.[index]) ? state.offers[index] : [];
    return rawOffers
      .map(entry => String(entry || "").trim())
      .filter(key => KING_GENEROSITY_GIFTS.some(gift => gift.key === key))
      .slice(0, 2);
  });
  const chosen = players.map((_, index) => Boolean(state?.chosen?.[index]));
  return {
    active: Boolean(state?.active),
    offers,
    chosen
  };
}

function normalizeKingAuctionState(state = null) {
  const bids = players.map((_, index) => {
    const value = state?.bids?.[index];
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : null;
  });
  const submitted = players.map((_, index) => Boolean(state?.submitted?.[index]));
  return {
    active: Boolean(state?.active),
    bids,
    submitted
  };
}

function cloneKingAuctionState() {
  return normalizeKingAuctionState(kingAuctionState);
}

function cloneKingGenerosityState() {
  return normalizeKingGenerosityState(kingGenerosityState);
}

function isKingAuctionActive() {
  return Boolean(kingAuctionState?.active);
}

function isKingGenerosityActive() {
  return Boolean(kingGenerosityState?.active);
}

function isRoyalBlessingScope(scope) {
  return scope === "barracks" || scope === "lavka" || scope === "workshop";
}

function getPlayerGoldDiscountRate(player, scope = "general") {
  let rate = 0;
  if (player && player.ringCount) {
    rate = Math.max(rate, 0.15);
  }
  if (player && (player.royalBlessingTurnsRemaining || 0) > 0 && isRoyalBlessingScope(scope)) {
    rate = Math.max(rate, ROYAL_BLESSING_DISCOUNT);
  }
  if (getTimeOfDay().key === "evening" && (scope === "barracks" || scope === "lavka" || scope === "workshop")) {
    rate = Math.max(rate, 0.13);
  }
  if (isDayBuffActive("discount10") && (scope === "poison" || scope === "workshop")) {
    rate = Math.max(rate, 0.10);
  }
  return rate;
}

function isKingAuctionBlockingGameplay() {
  return isKingAuctionActive();
}

function isKingGenerosityBlockingGameplay() {
  return isKingGenerosityActive();
}

function sanitizeKingAuctionBidAmount(value) {
  return Math.max(0, Math.floor(Number(value) || 0));
}

function getKingGenerosityGiftByKey(giftKey) {
  return KING_GENEROSITY_GIFTS.find(gift => gift.key === giftKey) || null;
}

function getAvailableKingGenerosityGifts(player) {
  return KING_GENEROSITY_GIFTS.filter(gift => {
    if (typeof gift.isAvailable !== "function") return true;
    return gift.isAvailable(player);
  });
}

function pickRandomKingGenerosityOffers(player) {
  const pool = getAvailableKingGenerosityGifts(player).slice();
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(2, pool.length)).map(gift => gift.key);
}

function getKingAuctionResultTitle() {
  return WORLD_EVENTS.kingAuction?.title || "Аукцион короля";
}

function getKingAuctionIntroText() {
  return "Король объявляет аукцион на свое благославление! Победитель получит скидку 30% на покупки за золото в казарме, лавке и мастерской на 15-25 ходов. Скидка не суммируется с кольцом убеждения.";
}

function canPlayerBuildMineLevel2(playerIndex) {
  return mineLevel2OwnerPlayerIndex === null || mineLevel2OwnerPlayerIndex === playerIndex;
}

function getPlayerBallistaLevel(player) {
  if (!player || (player.ballistaCount || 0) <= 0) return 0;
  return Math.max(1, Math.min(2, Math.floor(Number(player.ballistaLevel) || 1)));
}

let ballistaModePlayerIndex = null;
let ballistaShotInFlight = false;
let harpoonModePlayerIndex = null;
let harpoonAnimationInFlight = false;
let bridgeModePlayerIndex = null;
let voidShardModePlayerIndex = null;
const bridgeOpenedKeys = new Set();
const INVENTORY_ITEMS = [
  {key: "poison", label: "Яд", icon: "poison.png", count: player => player.poisonCount || 0},
  {key: "potion-invis", label: "Зелье невидимости", icon: "potion_invis.png", count: player => player.invisPotionCount || 0, useAction: "potion-invis"},
  {key: "potion-luck", label: "Зелье удачи", icon: "potion_luck.png", count: player => player.luckPotionCount || 0, useAction: "potion-luck"},
  {key: "potion-invuln", label: "Зелье неприкосновенности", icon: "potion_invis.png", count: player => player.invulnPotionCount || 0, useAction: "potion-invuln"},
  {key: "clover", label: "Клевер", icon: "clover.png", count: player => player.cloverCount || 0, useAction: "clover"},
  {key: "flower", label: "Таинственный цветок", icon: "mystic_flower.png", count: player => player.flowerCount || 0},
  {key: "void-shard", label: "Осколок пустоты", icon: "void_shard.png", count: player => player.voidShardCount || 0, useAction: "void-shard"},
  {key: "token", label: "Жетон", icon: "token.png", count: player => player.tokenCount || 0},
  {key: "boots", label: "Сапоги", icon: "boots.png", count: player => player.bootsCount || 0},
  {key: "ballista", label: "Баллиста", icon: "ballista.png", count: player => player.ballistaCount || 0, useAction: "ballista"},
  {key: "bolt", label: "Болт", icon: "ballista_bolt.png", count: player => player.boltCount || 0},
  {key: "harpoon", label: "Горпун", icon: "harpoon.png", count: player => player.harpoonCount || 0, useAction: "harpoon"},
  {key: "trap-stun", label: "Ловушка-стан", icon: "trap_stun.png?v=1", count: player => player.trapStunCount || 0, useAction: "trap-stun"},
  {key: "bridge", label: "Мост", icon: "stairs.png", count: player => player.bridgeCount || 0, useAction: "bridge"},
  {key: "ring", label: "Кольцо убеждения", icon: "ring_persuasion.png", count: player => player.ringCount || 0},
  {key: "terror-ring", label: "Кольцо ужаса", icon: "ring_terror.png", count: player => player.terrorRingCount || 0},
  {key: "rainbow-stone", label: "Радужный камень", icon: "rainbow_stone.png", count: player => player.rainbowStoneCount || 0},
  {key: "mystic-stone", label: "Необычный камень", icon: "stone.png", count: player => player.mysticStoneCount || 0},
  {key: "troll-club", label: "Дубинка троллей", icon: "troll_club.png", count: player => player.trollClubCount || 0},
  {key: "hero-hilt", label: "Рукоять меча героя", icon: "hero_hilt.png", count: player => player.heroHiltCount || 0},
  {key: "werewolf-fang", label: "Клык оборотня", icon: "werewolf_fang.png", count: player => player.werewolfFangCount || 0},
  {key: "werewolf-amulet", label: "Амулет оборотня", icon: "werewolf_amulet.png", count: player => player.werewolfAmuletCount || 0},
  {key: "luck-amulet", label: "Амулет удачи", icon: "luck_amulet.png", count: player => player.luckAmuletCount || 0},
  {key: "builder-amulet", label: "Амулет строителя", icon: "builder_amulet.png", count: player => player.builderAmuletChargeCount || 0, alwaysShow: player => (player.builderAmuletCount || 0) > 0},
  {key: "crystal-sword", label: "Кристальный меч", icon: "crystal_sword.png", count: player => (player.hasCrystalSword ? 1 : 0)},
  {key: "sword", label: "Меч героя", icon: "sword.png", count: player => (player.hasSword ? 1 : 0)},
  {key: "fog-of-war", label: "Туман войны", icon: "fog_1.png", count: player => player.fogOfWarCount || 0, useAction: "fog-of-war"}
];

const WORLD_LAYER_UPPER = "upper";
const WORLD_LAYER_UNDER = "under";
const WORLD_LAYER_TROLL_CAVE = "troll-cave";
const TROLL_CAVE_VIEW_ZOOM = 1.28;
let lastVisibleWorldLayoutLayer = null;
const TIME_OF_DAY_CYCLE = [
  { key: "day",     label: "День",   duration: 40, bg: 'url("assets/map-plateau.jpg")' },
  { key: "evening", label: "Вечер",  duration: 15, bg: 'url("assets/backgrounds/evening_bg.png")' },
  { key: "night",   label: "Ночь",   duration: 25, bg: 'url("assets/backgrounds/night_bg.png")' },
  { key: "morning", label: "Утро",   duration: 15, bg: 'url("assets/backgrounds/morning_bg.png")' },
];
const TIME_OF_DAY_CYCLE_LENGTH = TIME_OF_DAY_CYCLE.reduce((sum, e) => sum + e.duration, 0);
const DAY_BUFF_POOL = [
  { key: "trollGold",    label: "Дополнительная награда за убийство троллей +700 золота" },
  { key: "discount10",   label: "Скидка на яд и меч героя 10%" },
  { key: "freeRepair",   label: "Бесплатная починка сломанных клеток" },
  { key: "randomRes10",  label: "+10 ресурсов каждый ход случайному игроку" },
  { key: "invulnPotion", label: "Зелье неприкосновенности в лавке (15 ходов, 750 золота)" },
  { key: "carpenter",    label: "Плотник в мастерской: +50 брони замка за 1500 золота" },
  { key: "castleArmor",  label: "Замки теряют 30 брони (только в течении дня)" },
  { key: "pickupFail",   label: "Шанс подбора -30% (ресурсы, золото, войска)" },
];
let activeDayBuffs = [];
let prevTimeOfDayKey = null;
let castleArmorDayBuffReductions = {};
const FULL_MOON_UPPER_WORLD_BG = 'url("assets/backgrounds/full_moon_bg.png")';
const UNDERWORLD_BG = 'url("assets/backgrounds/underworld_bg.png")';
const TROLL_CAVE_INTERIOR_BG = 'url("assets/backgrounds/troll_cave_bg.png")';
const WORMHOLE_ICON = { file: "wormhole.png", alt: "Червоточина" };
const STAIRS_ICON = { file: "stairs.png", alt: "Лестница" };
const UNDERWORLD_GOLD_COUNT = 5;
const UNDERWORLD_RESOURCES_COUNT = 3;
const UNDERWORLD_GOLD_MIN = 500;
const UNDERWORLD_GOLD_MAX = 750;
const UNDERWORLD_RESOURCES_MIN = 100;
const UNDERWORLD_RESOURCES_MAX = 150;
const UNDERWORLD_REWARD_LATE_MULTIPLIER = 1.8;
const UNDERWORLD_REWARD_LATE_TURN = 175;
const WORMHOLE_MIN_SPAWNS = 1;
const WORMHOLE_MAX_SPAWNS = 3;
const WORMHOLE_MIN_SPAWN_TURN = 75;
const WORMHOLE_MAX_SPAWN_TURN = 300;
let wormholeSpawnTurns = [];
let wormholeSpawnIndex = 0;
let upperWormhole = null;

function initWormholeSpawns() {
  const picked = new Set();
  const count = randomIntRange(WORMHOLE_MIN_SPAWNS, WORMHOLE_MAX_SPAWNS);
  while (picked.size < count) {
    picked.add(randomIntRange(WORMHOLE_MIN_SPAWN_TURN, WORMHOLE_MAX_SPAWN_TURN));
  }
  wormholeSpawnTurns = Array.from(picked).sort((a, b) => a - b);
  wormholeSpawnIndex = 0;
  upperWormhole = null;
}

function cloneWorldEventSchedule() {
  return scheduledWorldEvents.map(event => ({ ...event }));
}

function cloneActiveWorldEvents() {
  return Object.fromEntries(
    Object.entries(activeWorldEvents).map(([key, value]) => [key, { ...value }])
  );
}

function initRoyalMessengerSchedule() {
  if (!ROYAL_MESSENGER_EVENT_ENABLED) {
    scheduledRoyalMessengerTurns = [];
    pendingRoyalMessengerEvents = 0;
    while (messengers.length > 0) {
      removeMessengerAtIndex(messengers.length - 1);
    }
    return;
  }
  const picked = new Set();
  const count = randomIntRange(ROYAL_MESSENGER_MIN_SPAWNS, ROYAL_MESSENGER_MAX_SPAWNS);
  while (picked.size < count) {
    picked.add(randomIntRange(ROYAL_MESSENGER_MIN_TURN, ROYAL_MESSENGER_MAX_TURN));
  }
  scheduledRoyalMessengerTurns = Array.from(picked).sort((a, b) => a - b);
}

function isRoyalMessengerEventActive() {
  return messengers.length > 0;
}

function initCaravanSchedule() {
  const picked = new Set();
  const count = randomIntRange(CARAVAN_MIN_SPAWNS, CARAVAN_MAX_SPAWNS);
  while (picked.size < count) {
    picked.add(randomIntRange(CARAVAN_MIN_TURN, CARAVAN_MAX_TURN));
  }
  scheduledCaravanTurns = Array.from(picked).sort((a, b) => a - b);
}

function isCaravanEventActive() {
  return caravans.length > 0;
}

function initFullMoonSchedule() {
  const picked = new Set();
  const count = randomIntRange(FULL_MOON_MIN_SPAWNS, FULL_MOON_MAX_SPAWNS);
  while (picked.size < count) {
    picked.add(randomIntRange(FULL_MOON_MIN_TURN, FULL_MOON_MAX_TURN));
  }
  scheduledFullMoonTurns = Array.from(picked).sort((a, b) => a - b);
}

function isFullMoonEventActive() {
  return Boolean(werewolfState || fullMoonEventState);
}

function initFogOfWarSchedule() {
  if (!FOG_OF_WAR_EVENT_ENABLED) {
    scheduledFogOfWarTurns = [];
    pendingFogOfWarEvents = 0;
    fogOfWarState = null;
    return;
  }
  const picked = new Set();
  const count = randomIntRange(FOG_OF_WAR_MIN_SPAWNS, FOG_OF_WAR_MAX_SPAWNS);
  while (picked.size < count) {
    picked.add(randomIntRange(FOG_OF_WAR_MIN_TURN, FOG_OF_WAR_MAX_TURN));
  }
  scheduledFogOfWarTurns = Array.from(picked).sort((a, b) => a - b);
}

function isFogOfWarActive() {
  return Boolean(fogOfWarState);
}

function initFogOfWarVariants() {
  Object.keys(fogOfWarVariantsByKey).forEach(key => delete fogOfWarVariantsByKey[key]);
  Object.keys(grid).forEach(key => {
    fogOfWarVariantsByKey[key] = randomIntRange(1, FOG_OF_WAR_ICON_COUNT);
  });
}

function initWorldEventSchedule() {
  scheduledWorldEvents = [];
  activeWorldEvents = {};
  Object.values(WORLD_EVENTS).forEach(def => {
    if (!ROYAL_TAX_EVENT_ENABLED && def.key === WORLD_EVENTS.royalTax.key) return;
    const rolls = Math.max(1, Number(def.rollsPerGame) || 1);
    for (let i = 0; i < rolls; i += 1) {
      if (Math.random() >= WORLD_EVENT_TRIGGER_CHANCE) continue;
      const event = {
        key: def.key,
        startTurn: randomIntRange(WORLD_EVENT_MIN_TURN, WORLD_EVENT_MAX_TURN)
      };
      if (!def.instant) {
        event.duration = randomIntRange(def.minDuration, def.maxDuration);
        event.turnsUntilActive = Math.max(0, Number(def.delayedActivationTurns) || 0);
      }
      scheduledWorldEvents.push(event);
    }
  });
  scheduledWorldEvents.sort((a, b) => a.startTurn - b.startTurn);
}

function isWorldEventActive(eventKey) {
  const state = activeWorldEvents[eventKey];
  if (!state) return false;
  if ((state.turnsUntilActive || 0) > 0) return false;
  return (state.remainingTurns || 0) > 0;
}

function isNonAggressionPactActive() {
  return isWorldEventActive(WORLD_EVENTS.nonAggressionPact.key);
}

function isMerchantsStrikeActive() {
  return isWorldEventActive(WORLD_EVENTS.merchantsStrike.key);
}

function isQuarantineActive() {
  return isWorldEventActive(WORLD_EVENTS.quarantine.key);
}

function isBarbarianFuryActive() {
  return isWorldEventActive(WORLD_EVENTS.barbarianFury.key);
}

function isTrollHuntActive() {
  return isWorldEventActive(WORLD_EVENTS.trollHunt.key);
}

function isMageJourneyActive() {
  return isWorldEventActive(WORLD_EVENTS.mageJourney.key);
}

function isMasterJourneyActive() {
  return isWorldEventActive(WORLD_EVENTS.masterJourney.key);
}

function getKingConcernState() {
  return activeWorldEvents[WORLD_EVENTS.kingConcern.key] || null;
}

function getKingConcernTargetPlayerIndex() {
  const state = getKingConcernState();
  return Number.isInteger(state?.targetPlayerIndex) ? state.targetPlayerIndex : null;
}

function getKingConcernPenalty(playerIndex) {
  if (!isWorldEventActive(WORLD_EVENTS.kingConcern.key)) return 0;
  return getKingConcernTargetPlayerIndex() === playerIndex ? KING_CONCERN_ROLL_PENALTY : 0;
}

function getWorldEventMessage(eventKey, duration) {
  const def = WORLD_EVENTS[eventKey];
  return def?.getMessage ? def.getMessage(duration) : "";
}

function getWorldEventStatusLabel(eventKey) {
  if (eventKey === WORLD_EVENTS.nonAggressionPact.key) return "Пакт о ненападении";
  if (eventKey === WORLD_EVENTS.goldTax.key) return "Налог +30%";
  if (eventKey === WORLD_EVENTS.merchantsStrike.key) return "Забастовка торговцев";
  if (eventKey === WORLD_EVENTS.barbarianFury.key) return "Ярость варваров";
  if (eventKey === WORLD_EVENTS.trollHunt.key) return "Охота на троллей";
  if (eventKey === WORLD_EVENTS.mageJourney.key) return "Странствие мага";
  if (eventKey === WORLD_EVENTS.masterJourney.key) return "Странствие Великого Мастера";
  if (eventKey === WORLD_EVENTS.kingConcern.key) return "Опасение короля";
  if (eventKey === WORLD_EVENTS.quarantine.key) return "Карантин";
  if (eventKey === "fullMoon") return "Полнолуние";
  if (eventKey === "fogOfWar") return "Туман войны";
  return "Событие";
}

function getExtraWorldEventStatusEntries() {
  const entries = [];
  if (fullMoonEventState) {
    const remainingTurns = Math.max(0, (fullMoonEventState.expiresAtTurn || turnCounter) - turnCounter + 1);
    if (remainingTurns > 0) {
      entries.push(["fullMoon", { remainingTurns }]);
    }
  }
  if (fogOfWarState) {
    const remainingTurns = Math.max(0, (fogOfWarState.expiresAtTurn || turnCounter) - turnCounter + 1);
    if (remainingTurns > 0) {
      entries.push(["fogOfWar", { remainingTurns }]);
    }
  }
  return entries;
}

function renderWorldEventStatus(playerIndex) {
  if (!Array.isArray(worldEventStatusRoots)) return;
  const root = worldEventStatusRoots.find(elem => Number(elem?.dataset?.worldEventStatus) === playerIndex);
  if (!root) return;
  const list = root.querySelector(".world-event-status-list");
  if (!list) return;
  const activeEntries = [...Object.entries(activeWorldEvents), ...getExtraWorldEventStatusEntries()]
    .filter(([, state]) => (state?.remainingTurns || 0) > 0 || (state?.turnsUntilActive || 0) > 0)
    .sort((a, b) => {
      const aValue = (a[1].turnsUntilActive || 0) > 0 ? a[1].turnsUntilActive : (a[1].remainingTurns || 0);
      const bValue = (b[1].turnsUntilActive || 0) > 0 ? b[1].turnsUntilActive : (b[1].remainingTurns || 0);
      return aValue - bValue;
    });
  if (!activeEntries.length) {
    list.textContent = "Нет активных событий";
    return;
  }
  list.innerHTML = activeEntries
    .map(([eventKey, state]) => {
      const label = getWorldEventStatusLabel(eventKey);
      if ((state.turnsUntilActive || 0) > 0) {
        return `<div class="world-event-status-item"><strong>${label}</strong>: активируется через ${state.turnsUntilActive} ходов</div>`;
      }
      const turns = state.remainingTurns || 0;
      return `<div class="world-event-status-item"><strong>${label}</strong>: ещё ${turns} ходов</div>`;
    })
    .join("");
}

function enqueueWorldEventModal(payload) {
  if (!payload || !worldEventModal || !worldEventText) return;
  worldEventModalQueue.push(payload);
  if (window.getComputedStyle(worldEventModal).display !== "none") return;
  const next = worldEventModalQueue.shift();
  if (!next) return;
  worldEventTitle.textContent = next.title || "СОБЫТИЕ";
  worldEventText.textContent = next.text || "";
  worldEventModal.style.display = "flex";
  refreshTurnControls();
}

function closeWorldEventModal() {
  if (!worldEventModal) return;
  const wasVisible = window.getComputedStyle(worldEventModal).display !== "none";
  worldEventModal.style.display = "none";
  if (worldEventModalQueue.length > 0) {
    const next = worldEventModalQueue.shift();
    if (next) {
      worldEventTitle.textContent = next.title || "СОБЫТИЕ";
      worldEventText.textContent = next.text || "";
      worldEventModal.style.display = "flex";
    }
  }
  if (!wasVisible && window.getComputedStyle(worldEventModal).display === "none") return;
  resumeTurnFlowAfterModalChange();
}

function syncKingAuctionModalState(viewerPlayerIndex = kingAuctionViewerPlayerIndex) {
  if (!kingAuctionModal || !Array.isArray(kingAuctionOfferCards)) return;
  const showAllPlayers = !Number.isInteger(viewerPlayerIndex);
  if (kingAuctionDescription) {
    kingAuctionDescription.textContent = getKingAuctionIntroText();
  }
  let visibleCards = 0;
  kingAuctionOfferCards.forEach(card => {
    const playerIndex = Number(card.dataset.kingAuctionPlayer);
    const player = players[playerIndex];
    const submitted = Boolean(kingAuctionState?.submitted?.[playerIndex]);
    const shouldShow =
      Boolean(player) &&
      (showAllPlayers || playerIndex === viewerPlayerIndex) &&
      (!showAllPlayers || !submitted);
    card.classList.toggle("is-hidden", !shouldShow);
    if (!shouldShow || !player) return;
    visibleCards += 1;
    const nameElem = card.querySelector(".king-auction-player-name");
    if (nameElem) {
      nameElem.textContent = player.name || `Игрок ${playerIndex + 1}`;
      nameElem.style.color = player.color || "";
    }
    const goldElem = card.querySelector(`[data-king-auction-gold="${playerIndex}"]`);
    if (goldElem) {
      goldElem.textContent = String(getTotalGold(player));
    }
    const input = card.querySelector(`[data-king-auction-input="${playerIndex}"]`);
    if (input) {
      if (document.activeElement !== input) {
        input.value = kingAuctionDraftBids[playerIndex] || "";
      }
      input.max = String(getTotalGold(player));
      input.disabled = submitted;
    }
    const button = card.querySelector(`[data-king-auction-submit="${playerIndex}"]`);
    if (button) {
      button.disabled = submitted;
    }
    const status = card.querySelector(`[data-king-auction-status="${playerIndex}"]`);
    if (status) {
      status.textContent = submitted ? "Ставка отправлена." : "";
    }
  });
  kingAuctionModal.style.display = isKingAuctionActive() && visibleCards > 0 ? "flex" : "none";
  refreshTurnControls();
}

function openKingAuctionModal(playerIndex = null) {
  kingAuctionViewerPlayerIndex = Number.isInteger(playerIndex) ? playerIndex : null;
  syncKingAuctionModalState(kingAuctionViewerPlayerIndex);
}

function closeKingAuctionModal() {
  if (!kingAuctionModal) return;
  const wasVisible = window.getComputedStyle(kingAuctionModal).display !== "none";
  kingAuctionModal.style.display = "none";
  kingAuctionViewerPlayerIndex = null;
  if (!wasVisible) return;
  resumeTurnFlowAfterModalChange();
}

function syncKingAuctionModalVisibility() {
  if (!kingAuctionModal) return;
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!isKingAuctionActive()) {
    closeKingAuctionModal();
    return;
  }
  if (!inMultiplayer) {
    openKingAuctionModal(null);
    return;
  }
  if (typeof localPlayerIndex !== "number") return;
  if (kingAuctionState.submitted?.[localPlayerIndex]) {
    closeKingAuctionModal();
    return;
  }
  openKingAuctionModal(localPlayerIndex);
}

function syncKingGenerosityModalState(viewerPlayerIndex = kingGenerosityViewerPlayerIndex) {
  if (!kingGenerosityModal || !Array.isArray(kingGenerosityOfferCards)) return;
  const showAllPlayers = !Number.isInteger(viewerPlayerIndex);
  if (kingGenerosityDescription) {
    kingGenerosityDescription.textContent = "Король хочет порадовать подданых! Выберите один из подарков!";
  }
  let visibleCards = 0;
  kingGenerosityOfferCards.forEach(card => {
    const playerIndex = Number(card.dataset.kingGenerosityPlayer);
    const player = players[playerIndex];
    const chosen = Boolean(kingGenerosityState?.chosen?.[playerIndex]);
    const shouldShow =
      Boolean(player) &&
      (showAllPlayers || playerIndex === viewerPlayerIndex) &&
      (!showAllPlayers || !chosen);
    card.classList.toggle("is-hidden", !shouldShow);
    if (!shouldShow || !player) return;
    visibleCards += 1;
    const nameElem = card.querySelector(".king-generosity-player-name");
    if (nameElem) {
      nameElem.textContent = player.name || `Игрок ${playerIndex + 1}`;
      nameElem.style.color = player.color || "";
    }
    const statusElem = card.querySelector(`[data-king-generosity-status="${playerIndex}"]`);
    if (statusElem) {
      statusElem.textContent = chosen ? "Подарок уже выбран." : "Доступно 2 подарка. Можно взять только один.";
    }
    const offers = Array.isArray(kingGenerosityState?.offers?.[playerIndex]) ? kingGenerosityState.offers[playerIndex] : [];
    const buttons = Array.from(card.querySelectorAll(`[data-king-generosity-player-choice="${playerIndex}"]`));
    buttons.forEach((button, offerIndex) => {
      const giftKey = offers[offerIndex] || "";
      const gift = getKingGenerosityGiftByKey(giftKey);
      const titleElem = button.querySelector(`[data-king-generosity-choice-title="${offerIndex}"]`);
      const textElem = button.querySelector(`[data-king-generosity-choice-text="${offerIndex}"]`);
      button.dataset.giftKey = giftKey;
      button.disabled = chosen || !gift;
      button.style.display = gift ? "flex" : "none";
      if (titleElem) {
        titleElem.textContent = gift ? gift.title : "";
      }
      if (textElem) {
        textElem.textContent = gift ? gift.text : "";
      }
    });
  });
  kingGenerosityModal.style.display = isKingGenerosityActive() && visibleCards > 0 ? "flex" : "none";
  refreshTurnControls();
}

function openKingGenerosityModal(playerIndex = null) {
  kingGenerosityViewerPlayerIndex = Number.isInteger(playerIndex) ? playerIndex : null;
  syncKingGenerosityModalState(kingGenerosityViewerPlayerIndex);
}

function closeKingGenerosityModal() {
  if (!kingGenerosityModal) return;
  const wasVisible = window.getComputedStyle(kingGenerosityModal).display !== "none";
  kingGenerosityModal.style.display = "none";
  kingGenerosityViewerPlayerIndex = null;
  if (!wasVisible) return;
  resumeTurnFlowAfterModalChange();
}

function syncKingGenerosityModalVisibility() {
  if (!kingGenerosityModal) return;
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!isKingGenerosityActive()) {
    closeKingGenerosityModal();
    return;
  }
  if (!inMultiplayer) {
    openKingGenerosityModal(null);
    return;
  }
  if (typeof localPlayerIndex !== "number") return;
  if (kingGenerosityState.chosen?.[localPlayerIndex]) {
    closeKingGenerosityModal();
    return;
  }
  openKingGenerosityModal(localPlayerIndex);
}

function announceKingAuctionResult(result) {
  const payloadByPlayerIndex = {};
  const bids = Array.isArray(result?.bids) ? result.bids : players.map(() => 0);
  players.forEach((player, playerIndex) => {
    if (!player) return;
    const ownBid = bids[playerIndex] || 0;
    const opponentIndex = getOpponentIndex(playerIndex);
    const opponentBid = bids[opponentIndex] || 0;
    if (!Number.isInteger(result?.winnerPlayerIndex)) {
      payloadByPlayerIndex[playerIndex] = {
        title: getKingAuctionResultTitle(),
        text: `Король не смог определить победителя. Вы предложили ${ownBid} золота, соперник — ${opponentBid}. Благославление никому не досталось.`
      };
      return;
    }
    if (playerIndex === result.winnerPlayerIndex) {
      payloadByPlayerIndex[playerIndex] = {
        title: getKingAuctionResultTitle(),
        text: `Вы предложили ${ownBid} золота против ${opponentBid} у соперника и победили в аукционе. Благославление действует ${result.duration} ходов.`
      };
      return;
    }
    payloadByPlayerIndex[playerIndex] = {
      title: getKingAuctionResultTitle(),
      text: `Вы предложили ${ownBid} золота, но соперник заплатил ${opponentBid}. Благославление на ${result.duration} ходов досталось ему.`
    };
  });
  announcePlayerSpecificWorldEvent(payloadByPlayerIndex);
}

function resolveKingAuctionWorldEvent() {
  if (!isKingAuctionActive()) return;
  const bids = players.map((_, index) => sanitizeKingAuctionBidAmount(kingAuctionState?.bids?.[index]));
  let winnerPlayerIndex = null;
  if (bids[0] !== bids[1]) {
    winnerPlayerIndex = bids[0] > bids[1] ? 0 : 1;
  }
  const duration = Number.isInteger(winnerPlayerIndex)
    ? randomIntRange(ROYAL_BLESSING_MIN_TURNS, ROYAL_BLESSING_MAX_TURNS)
    : 0;
  if (Number.isInteger(winnerPlayerIndex) && players[winnerPlayerIndex]) {
    players[winnerPlayerIndex].royalBlessingTurnsRemaining = duration;
  }
  const result = { winnerPlayerIndex, duration, bids };
  kingAuctionState = normalizeKingAuctionState();
  closeKingAuctionModal();
  players.forEach((_, playerIndex) => updatePlayerResources(playerIndex));
  announceKingAuctionResult(result);
  refreshTurnControls();
  scheduleAutoRoll();
}

function submitKingAuctionBid(playerIndex, amount) {
  if (!isKingAuctionActive() || !Number.isInteger(playerIndex) || !players[playerIndex]) return false;
  if (kingAuctionState.submitted?.[playerIndex]) return false;
  const player = players[playerIndex];
  const normalizedAmount = sanitizeKingAuctionBidAmount(amount);
  const totalGold = getTotalGold(player);
  if (normalizedAmount > totalGold) {
    showPrivatePickupToastForPlayer(playerIndex, "У вас недостаточно золота для такой ставки.");
    syncKingAuctionModalState();
    return false;
  }
  if (normalizedAmount > 0) {
    spendGold(player, normalizedAmount);
  }
  kingAuctionState.active = true;
  kingAuctionState.bids[playerIndex] = normalizedAmount;
  kingAuctionState.submitted[playerIndex] = true;
  kingAuctionDraftBids[playerIndex] = "";
  updatePlayerResources(playerIndex);
  const allSubmitted = kingAuctionState.submitted.every(Boolean);
  const actionText = normalizedAmount > 0
    ? `Королю передано ${normalizedAmount} золота.`
    : "Вы решили не жертвовать золото.";
  showPrivatePickupToastForPlayer(
    playerIndex,
    allSubmitted ? actionText : `${actionText} Ожидаем ставку соперника.`
  );
  if (Number.isInteger(kingAuctionViewerPlayerIndex) && kingAuctionViewerPlayerIndex === playerIndex) {
    closeKingAuctionModal();
  } else {
    syncKingAuctionModalState();
  }
  if (allSubmitted) {
    resolveKingAuctionWorldEvent();
  } else {
    refreshTurnControls();
  }
  return true;
}

function startKingAuctionWorldEvent() {
  kingAuctionState = normalizeKingAuctionState({ active: true });
  kingAuctionDraftBids.fill("");
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!inMultiplayer) {
    openKingAuctionModal(null);
    return;
  }
  players.forEach((_, playerIndex) => {
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "showKingAuctionModal", { playerIndex });
      return;
    }
    openKingAuctionModal(playerIndex);
  });
}

function finishKingGenerosityWorldEvent() {
  kingGenerosityState = normalizeKingGenerosityState();
  closeKingGenerosityModal();
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  refreshTurnControls();
  scheduleAutoRoll();
}

function selectKingGenerosityGift(playerIndex, giftKey) {
  if (!isKingGenerosityActive() || !Number.isInteger(playerIndex) || !players[playerIndex]) return false;
  if (kingGenerosityState.chosen?.[playerIndex]) return false;
  const offers = Array.isArray(kingGenerosityState?.offers?.[playerIndex]) ? kingGenerosityState.offers[playerIndex] : [];
  if (!offers.includes(giftKey)) return false;
  const gift = getKingGenerosityGiftByKey(giftKey);
  if (!gift) return false;
  const player = players[playerIndex];
  if (typeof gift.isAvailable === "function" && !gift.isAvailable(player)) {
    showPrivatePickupToastForPlayer(playerIndex, "Этот подарок сейчас недоступен.");
    syncKingGenerosityModalState();
    return false;
  }
  const resultText = gift.apply(player);
  kingGenerosityState.chosen[playerIndex] = true;
  updatePlayerResources(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, resultText || `Получен подарок: ${gift.title}.`);
  const allChosen = kingGenerosityState.chosen.every(Boolean);
  if (Number.isInteger(kingGenerosityViewerPlayerIndex) && kingGenerosityViewerPlayerIndex === playerIndex) {
    closeKingGenerosityModal();
  } else {
    syncKingGenerosityModalState();
  }
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  if (allChosen) {
    finishKingGenerosityWorldEvent();
  } else {
    refreshTurnControls();
  }
  return true;
}

function startKingGenerosityWorldEvent() {
  const offers = players.map(player => pickRandomKingGenerosityOffers(player));
  kingGenerosityState = normalizeKingGenerosityState({
    active: true,
    offers,
    chosen: players.map(() => false)
  });
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!inMultiplayer) {
    openKingGenerosityModal(null);
    return;
  }
  players.forEach((_, playerIndex) => {
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "showKingGenerosityModal", { playerIndex });
      return;
    }
    openKingGenerosityModal(playerIndex);
  });
}

function announceWorldEvent(eventKey, duration) {
  const def = WORLD_EVENTS[eventKey];
  if (!def) return;
  const payload = {
    title: def.title,
    text: getWorldEventMessage(eventKey, duration)
  };
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!inMultiplayer) {
    enqueueWorldEventModal(payload);
    return;
  }
  players.forEach((_, playerIndex) => {
    if (typeof shouldDelegatePrivateUiToPlayer === "function" && shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "showWorldEventModal", payload);
      return;
    }
    enqueueWorldEventModal(payload);
  });
}

function announcePlayerSpecificWorldEvent(payloadByPlayerIndex) {
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  players.forEach((_, playerIndex) => {
    const payload = payloadByPlayerIndex[playerIndex];
    if (!payload) return;
    if (!inMultiplayer) {
      enqueueWorldEventModal(payload);
      return;
    }
    if (typeof shouldDelegatePrivateUiToPlayer === "function" && shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "showWorldEventModal", payload);
      return;
    }
    enqueueWorldEventModal(payload);
  });
}

function showPrivateWorldEventModalForPlayer(playerIndex, title, text) {
  const payload = { title, text };
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!inMultiplayer) {
    enqueueWorldEventModal(payload);
    return;
  }
  if (typeof shouldDelegatePrivateUiToPlayer === "function" && shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showWorldEventModal", payload);
    return;
  }
  enqueueWorldEventModal(payload);
}

function announceRoyalMessengerEvent() {
  announceWorldEventModalToAll(ROYAL_MESSENGER_EVENT_TITLE, ROYAL_MESSENGER_EVENT_TEXT);
}

function announceCaravanEvent() {
  announceWorldEventModalToAll(CARAVAN_EVENT_TITLE, CARAVAN_EVENT_TEXT);
}

function announceFullMoonEvent() {
  announceWorldEventModalToAll(FULL_MOON_EVENT_TITLE, FULL_MOON_EVENT_TEXT);
}

function announceFogOfWarEvent() {
  announceWorldEventModalToAll(FOG_OF_WAR_EVENT_TITLE, FOG_OF_WAR_EVENT_TEXT);
}

function announceWorldEventModalToAll(title, text) {
  const payload = { title, text };
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!inMultiplayer) {
    enqueueWorldEventModal(payload);
    return;
  }
  players.forEach((_, playerIndex) => {
    if (typeof shouldDelegatePrivateUiToPlayer === "function" && shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "showWorldEventModal", payload);
      return;
    }
    enqueueWorldEventModal(payload);
  });
}

function applyRoyalTaxWorldEvent() {
  const def = WORLD_EVENTS.royalTax;
  if (!def) return;
  const payloadByPlayerIndex = {};
  players.forEach((player, playerIndex) => {
    if (!player) return;
    const taxAmount = randomIntRange(def.minTax, def.maxTax);
    const paidAmount = Math.min(getTotalGold(player), taxAmount);
    if (paidAmount > 0) {
      spendGold(player, paidAmount);
    }
    updatePlayerResources(playerIndex);
    payloadByPlayerIndex[playerIndex] = {
      title: def.title,
      text: `Король взыскал налог с подданных! Вы заплатили ${paidAmount} золота`
    };
  });
  announcePlayerSpecificWorldEvent(payloadByPlayerIndex);
}

function applyWealthTaxWorldEvent() {
  const def = WORLD_EVENTS.wealthTax;
  if (!def) return;
  const payloadByPlayerIndex = {};
  const totals = players
    .map((player, playerIndex) => ({ player, playerIndex, totalGold: player ? getTotalGold(player) : 0 }))
    .filter(({ player }) => Boolean(player));
  if (totals.length === 0) return;

  const maxGold = Math.max(...totals.map(entry => entry.totalGold));
  const richestPlayers = totals.filter(entry => entry.totalGold === maxGold);

  if (richestPlayers.length !== 1) {
    totals.forEach(({ playerIndex }) => {
      payloadByPlayerIndex[playerIndex] = {
        title: def.title,
        text: "Король собирает налог с богачей! Но в этот раз самый богатый игрок не определился."
      };
    });
    announcePlayerSpecificWorldEvent(payloadByPlayerIndex);
    return;
  }

  const richest = richestPlayers[0];
  const taxAmount = Math.min(richest.totalGold, Math.max(0, Math.round(richest.totalGold * 0.15)));
  if (taxAmount > 0) {
    spendGold(richest.player, taxAmount);
  }
  richest.player.resources.influence += 150;

  totals.forEach(({ playerIndex }) => {
    updatePlayerResources(playerIndex);
  });

  totals.forEach(({ playerIndex }) => {
    payloadByPlayerIndex[playerIndex] = playerIndex === richest.playerIndex
      ? {
          title: def.title,
          text: `Король собирает налог с богачей! Вы заплатили ${taxAmount} золота и получили 150 влияния.`
        }
      : {
          title: def.title,
          text: `Король собирает налог с богачей! Самый богатый игрок заплатил ${taxAmount} золота.`
        };
  });

  announcePlayerSpecificWorldEvent(payloadByPlayerIndex);
}

function applyMercenaryRiotWorldEvent() {
  const def = WORLD_EVENTS.mercenaryRiot;
  if (!def) return;
  players.forEach((player, playerIndex) => {
    if (!player) return;
    const target = findRandomOwnedResourceTarget(playerIndex);
    if (!target) return;
    spawnWorldEventMercenary(target, getMercenaryStrength(target.entry?.featureKey));
  });
  announceWorldEvent(def.key, 0);
}

function applyKingConcernWorldEvent(event) {
  const def = WORLD_EVENTS.kingConcern;
  if (!def) return;
  const payloadByPlayerIndex = {};
  const armies = players
    .map((player, playerIndex) => ({ player, playerIndex, pocketArmy: Math.max(0, player?.pocket?.army || 0) }))
    .filter(({ player }) => Boolean(player));
  if (!armies.length) return;

  const maxArmy = Math.max(...armies.map(entry => entry.pocketArmy));
  const leaders = armies.filter(entry => entry.pocketArmy === maxArmy);
  const targetPlayerIndex = leaders.length === 1 ? leaders[0].playerIndex : null;

  activeWorldEvents[event.key] = {
    startTurn: turnCounter,
    duration: event.duration,
    remainingTurns: event.duration,
    turnsUntilActive: Math.max(0, event.turnsUntilActive || 0),
    targetPlayerIndex
  };

  armies.forEach(({ playerIndex }) => {
    if (targetPlayerIndex === null) {
      payloadByPlayerIndex[playerIndex] = {
        title: def.title,
        text: `Король беспокоится о своей безопасности. Но сейчас армия в кармане у игроков одинакова, поэтому никто не замедлен.`
      };
      return;
    }
    payloadByPlayerIndex[playerIndex] = playerIndex === targetPlayerIndex
      ? {
          title: def.title,
          text: `Король беспокоится о своей безопасности. У вас больше войск в кармане, поэтому следующие ${event.duration} ходов ваш бросок уменьшается на ${KING_CONCERN_ROLL_PENALTY}.`
        }
      : {
          title: def.title,
          text: `Король беспокоится о своей безопасности. У соперника больше войск в кармане, поэтому следующие ${event.duration} ходов его бросок уменьшается на ${KING_CONCERN_ROLL_PENALTY}.`
        };
  });

  players.forEach((_, playerIndex) => updatePlayerResources(playerIndex));
  announcePlayerSpecificWorldEvent(payloadByPlayerIndex);
}

function getMessengerAtKey(key) {
  return messengers.find(entry => entry.key === key) || null;
}

function setCellToMessenger(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("important", "messenger");
  cell.textContent = "";
  setCellIcon(cell, "messenger.png", "Гонец");
  return true;
}

function clearMessengerCell(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return;
  const node = nodeByPos[key];
  if (node) {
    restoreImportantNodeCell(key, cell);
    return;
  }
  setCellToInactive(x, y);
}

function clearTransientContentForMessengerSpawnKey(key) {
  const [x, y] = key.split(",").map(Number);
  if (treasure?.key === key) clearTreasure();
  if (flowerArtifact?.key === key) clearFlower();
  if (cloverArtifact?.key === key) clearClover();
  if (stoneByPos[key]) clearStone(key);
  if (rainbowByPos[key]) clearRainbowStone(key);
  if (typeof voidShardByPos !== "undefined" && voidShardByPos[key] && typeof clearVoidShard === "function") {
    clearVoidShard(key);
  }
  const barbarianIndex = barbarianCells.findIndex(entry => entry.key === key);
  if (barbarianIndex !== -1) {
    barbarianCells.splice(barbarianIndex, 1);
  }
  const mercenaryIndex = mercenaries.findIndex(entry => entry.key === key);
  if (mercenaryIndex !== -1) {
    mercenaries.splice(mercenaryIndex, 1);
  }
  const thiefIndex = thieves.findIndex(entry => entry.key === key);
  if (thiefIndex !== -1) {
    thieves.splice(thiefIndex, 1);
  }
  const cutthroatIndex = cutthroats.findIndex(entry => entry.key === key);
  if (cutthroatIndex !== -1) {
    cutthroats.splice(cutthroatIndex, 1);
  }
  const caravanIndex = caravans.findIndex(entry => entry.key === key);
  if (caravanIndex !== -1) {
    removeCaravanAtIndex(caravanIndex);
  }
  if (werewolfState?.key === key) {
    clearWerewolfCell(werewolfState.x, werewolfState.y);
    werewolfState = null;
    fullMoonEventState = null;
  }
  if (typeof trollState !== "undefined" && trollState?.active && trollState.key === key) {
    clearTrollTokenAt(key);
    trollState.active = false;
    trollState.key = null;
    trollState.prevKey = null;
    trollState.turnsRemaining = 0;
  }
  if (specialByPos[key]) {
    setCellToInactive(x, y);
    return;
  }
  const cell = grid[key];
  if (!cell) return;
  if (!cell.classList.contains("inactive")) {
    setCellToInactive(x, y);
  }
}

function removeMessengerAtIndex(index) {
  const messenger = messengers[index];
  if (!messenger) return;
  clearMessengerCell(messenger.x, messenger.y);
  messengers.splice(index, 1);
}

function isMessengerStepAllowed(nx, ny, targetKey) {
  const key = `${nx},${ny}`;
  if (blockedCellKeys.has(key)) return false;
  if (key === targetKey) return true;
  const cell = grid[key];
  if (!cell || !cell.classList.contains("inactive")) return false;
  if (resourceByPos[key]) return false;
  if (specialByPos[key]) return false;
  if (barbarianCells.some(entry => entry.key === key)) return false;
  if (mercenaries.some(entry => entry.key === key)) return false;
  if (thieves.some(entry => entry.key === key)) return false;
  if (cutthroats.some(entry => entry.key === key)) return false;
  if (messengers.some(entry => entry.key === key)) return false;
  if (players.some(player => player.x === nx && player.y === ny)) return false;
  if (treasure?.key === key) return false;
  if (flowerArtifact?.key === key) return false;
  if (cloverArtifact?.key === key) return false;
  if (stoneByPos[key]) return false;
  if (rainbowByPos[key]) return false;
  if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) return false;
  if (typeof trollState !== "undefined" && trollState?.active && trollState.key === key) return false;
  return true;
}

function findMessengerPath(startKey, targetKey, maxDepth = 80) {
  const [sx, sy] = startKey.split(",").map(Number);
  const queue = [{ x: sx, y: sy }];
  const prev = new Map();
  const startId = `${sx},${sy}`;
  prev.set(startId, null);
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  let depth = 0;
  while (queue.length && depth <= maxDepth) {
    const nextQueue = [];
    for (const node of queue) {
      const key = `${node.x},${node.y}`;
      if (key === targetKey) {
        const path = [];
        let cur = key;
        while (cur && cur !== startId) {
          path.push(cur);
          cur = prev.get(cur);
        }
        path.reverse();
        return path;
      }
      for (const { dx, dy } of dirs) {
        const nx = node.x + dx;
        const ny = node.y + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const nkey = `${nx},${ny}`;
        if (prev.has(nkey)) continue;
        if (!isMessengerStepAllowed(nx, ny, targetKey)) continue;
        prev.set(nkey, key);
        nextQueue.push({ x: nx, y: ny });
      }
    }
    queue.splice(0, queue.length, ...nextQueue);
    depth += 1;
  }
  return null;
}

function moveMessenger(messenger) {
  if (!messenger?.targetKey || messenger.key === messenger.targetKey) return;
  const path = findMessengerPath(messenger.key, messenger.targetKey, 120);
  if (!path || !path.length) return;
  const steps = Math.min(randomIntRange(ROYAL_MESSENGER_SPEED_MIN, ROYAL_MESSENGER_SPEED_MAX), path.length);
  clearMessengerCell(messenger.x, messenger.y);
  for (let i = 0; i < steps; i += 1) {
    const [nx, ny] = path[i].split(",").map(Number);
    messenger.x = nx;
    messenger.y = ny;
    messenger.key = `${nx},${ny}`;
    if (messenger.key === messenger.targetKey) break;
  }
}

function resolveMessengerCastleVisit(messenger) {
  const targetPlayer = players[messenger.targetPlayerIndex];
  if (!targetPlayer) return;
  const castleKey = getFirstOwnedCastleKey(messenger.targetPlayerIndex);
  const ownsTargetCastle = castleKey && castleKey === messenger.targetCastleKey;
  messenger.cargoGold = 0;
  if (ownsTargetCastle && (targetPlayer.resources.gold || 0) >= ROYAL_MESSENGER_TAX_GOLD) {
    targetPlayer.resources.gold -= ROYAL_MESSENGER_TAX_GOLD;
    messenger.cargoGold = ROYAL_MESSENGER_TAX_GOLD;
    showPrivatePickupToastForPlayer(
      messenger.targetPlayerIndex,
      `Королевский гонец забрал ${ROYAL_MESSENGER_TAX_GOLD} золота из вашего замка.`
    );
  } else {
    targetPlayer.resources.influence -= ROYAL_MESSENGER_EMPTY_CASTLE_INFLUENCE_LOSS;
    showPrivatePickupToastForPlayer(
      messenger.targetPlayerIndex,
      `В вашем замке не нашлось ${ROYAL_MESSENGER_TAX_GOLD} золота. Потеряно ${ROYAL_MESSENGER_EMPTY_CASTLE_INFLUENCE_LOSS} влияния.`
    );
  }
  messenger.phase = "toGuard";
  messenger.targetKey = guardKey;
  updatePlayerResources(messenger.targetPlayerIndex);
  if (guardKey !== messenger.key) {
    setCellToMessenger(messenger.x, messenger.y);
  }
}

function resolveMessengerGuardArrival(messenger) {
  const targetPlayer = players[messenger.targetPlayerIndex];
  if (!targetPlayer) return;
  if ((messenger.cargoGold || 0) > 0) {
    targetPlayer.resources.influence += ROYAL_MESSENGER_SUCCESS_INFLUENCE_REWARD;
    showPrivatePickupToastForPlayer(
      messenger.targetPlayerIndex,
      `Гонец доставил налог королю. Вы получаете ${ROYAL_MESSENGER_SUCCESS_INFLUENCE_REWARD} влияния.`
    );
  } else {
    const fine = Math.min(getTotalGold(targetPlayer), ROYAL_MESSENGER_RETURN_GOLD_FINE);
    if (fine > 0) {
      spendGold(targetPlayer, fine);
    }
    showPrivatePickupToastForPlayer(
      messenger.targetPlayerIndex,
      fine > 0
        ? `Гонец вернулся без денег. Король взыскал ${fine} золота.`
        : "Гонец вернулся без денег. Король попытался взыскать 500 золота, но казна пуста."
    );
  }
  updatePlayerResources(messenger.targetPlayerIndex);
}

function advanceMessengers() {
  if (!ROYAL_MESSENGER_EVENT_ENABLED) {
    pendingRoyalMessengerEvents = 0;
    while (messengers.length > 0) {
      removeMessengerAtIndex(messengers.length - 1);
    }
    return;
  }
  for (let i = messengers.length - 1; i >= 0; i -= 1) {
    const messenger = messengers[i];
    const targetPlayer = players[messenger.targetPlayerIndex];
    if (!targetPlayer) {
      removeMessengerAtIndex(i);
      continue;
    }
    if (!messenger.targetKey) {
      removeMessengerAtIndex(i);
      continue;
    }
    moveMessenger(messenger);
    if (messenger.key === messenger.targetKey) {
      if (messenger.phase === "toCastle") {
        resolveMessengerCastleVisit(messenger);
        continue;
      }
      if (messenger.phase === "toGuard") {
        resolveMessengerGuardArrival(messenger);
        removeMessengerAtIndex(i);
        continue;
      }
    }
    setCellToMessenger(messenger.x, messenger.y);
  }
  if (!isRoyalMessengerEventActive() && pendingRoyalMessengerEvents > 0) {
    pendingRoyalMessengerEvents -= 1;
    startRoyalMessengerEvent();
  }
}

function startRoyalMessengerEvent() {
  if (!ROYAL_MESSENGER_EVENT_ENABLED) return false;
  announceRoyalMessengerEvent();
  const pendingPlayers = players
    .map((player, playerIndex) => ({
      player,
      playerIndex,
      castleKey: getFirstOwnedCastleKey(playerIndex)
    }));
  ROYAL_MESSENGER_SPAWN_KEYS.forEach(key => {
    clearTransientContentForMessengerSpawnKey(key);
  });
  const availableSpawnKeys = ROYAL_MESSENGER_SPAWN_KEYS.filter(key => {
    const [x, y] = key.split(",").map(Number);
    if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return false;
    if (messengers.some(entry => entry.key === key)) return false;
    if (players.some(player => (player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER && `${player.x},${player.y}` === key)) return false;
    const cell = grid[key];
    return Boolean(cell) && cell.classList.contains("inactive");
  });

  pendingPlayers.forEach(({ playerIndex, castleKey }) => {
    if (castleKey) return;
    const player = players[playerIndex];
    if (!player) return;
    player.resources.influence -= ROYAL_MESSENGER_NO_CASTLE_INFLUENCE_LOSS;
    updatePlayerResources(playerIndex);
    showPrivatePickupToastForPlayer(
      playerIndex,
      `У вас нет замка. Потеряно ${ROYAL_MESSENGER_NO_CASTLE_INFLUENCE_LOSS} влияния.`
    );
  });

  pendingPlayers
    .filter(entry => Boolean(entry.castleKey))
    .forEach(({ playerIndex, castleKey }) => {
      const spawnKey = availableSpawnKeys.shift();
      if (!spawnKey) return;
      const [x, y] = spawnKey.split(",").map(Number);
      messengers.push({
        id: messengerIdCounter++,
        key: spawnKey,
        x,
        y,
        targetPlayerIndex: playerIndex,
        targetCastleKey: castleKey,
        targetKey: castleKey,
        phase: "toCastle",
        cargoGold: 0
      });
      setCellToMessenger(x, y);
    });
  return true;
}

function activateScheduledRoyalMessengerEvents() {
  if (!ROYAL_MESSENGER_EVENT_ENABLED) {
    scheduledRoyalMessengerTurns = [];
    pendingRoyalMessengerEvents = 0;
    return;
  }
  if (!scheduledRoyalMessengerTurns.length) return;
  const activating = scheduledRoyalMessengerTurns.filter(turn => turn === turnCounter);
  if (!activating.length) return;
  scheduledRoyalMessengerTurns = scheduledRoyalMessengerTurns.filter(turn => turn !== turnCounter);
  activating.forEach(() => {
    if (isRoyalMessengerEventActive()) {
      pendingRoyalMessengerEvents += 1;
      return;
    }
    startRoyalMessengerEvent();
  });
}

function robMessenger(playerIndex, messenger) {
  const attacker = players[playerIndex];
  if (!attacker || !messenger) return false;
  const stolenGold = Math.max(0, messenger.cargoGold || 0);
  attacker.x = messenger.x;
  attacker.y = messenger.y;
  movesRemaining = 0;
  clearReachable();
  updatePawns();
  if (stolenGold > 0) {
    attacker.pocket.gold += stolenGold;
    messenger.cargoGold = 0;
    updatePlayerResources(playerIndex);
    showPrivateWorldEventModalForPlayer(playerIndex, "Грабёж гонца", "Вы ограбили гонца и получаете 500 золота.");
  } else {
    showPrivateWorldEventModalForPlayer(playerIndex, "Грабёж гонца", "У гонца нет денег.");
  }
  endTurn();
  return true;
}

function getMessengerById(id) {
  return messengers.find(entry => entry.id === id) || null;
}

function openMessengerModal(messengerId, playerIndex) {
  const messenger = getMessengerById(messengerId);
  const player = players[playerIndex];
  if (!messenger || !player || !messengerModal || !messengerConfirm) return;
  prepareBlockingModalTurn(playerIndex);
  pendingMessengerInteraction = { messengerId, playerIndex };
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showMessengerModal", { messengerId, playerIndex });
    return;
  }
  const canAfford = getTotalGold(player) >= ROYAL_MESSENGER_TAX_GOLD;
  const isAlreadyFilled = (messenger.cargoGold || 0) >= ROYAL_MESSENGER_TAX_GOLD;
  if (messengerModalText) {
    if (isAlreadyFilled) {
      messengerModalText.textContent = "У этого гонца уже есть 500 золота.";
    } else {
      messengerModalText.textContent = "Вы можете передать своему гонцу 500 золота. Сначала деньги возьмутся из кармана, затем из замка.";
    }
  }
  messengerConfirm.disabled = isAlreadyFilled || !canAfford;
  messengerModal.style.display = "flex";
}

function closeMessengerModal() {
  const wasVisible = messengerModal && window.getComputedStyle(messengerModal).display !== "none";
  if (messengerModal) messengerModal.style.display = "none";
  pendingMessengerInteraction = null;
  if (!wasVisible) return;
  resumeTurnFlowAfterModalChange();
}

function fillMessengerWithGold(playerIndex, messengerId) {
  const player = players[playerIndex];
  const messenger = getMessengerById(messengerId);
  if (!player || !messenger) return false;
  if (messenger.targetPlayerIndex !== playerIndex) return false;
  if ((messenger.cargoGold || 0) >= ROYAL_MESSENGER_TAX_GOLD) {
    showPrivatePickupToastForPlayer(playerIndex, "У гонца уже есть 500 золота.");
    closeMessengerModal();
    return false;
  }
  if (getTotalGold(player) < ROYAL_MESSENGER_TAX_GOLD) {
    showPrivatePickupToastForPlayer(playerIndex, "Не хватает золота для пополнения гонца.");
    if (!shouldDelegatePrivateUiToPlayer(playerIndex)) {
      openMessengerModal(messengerId, playerIndex);
    }
    return false;
  }
  spendGold(player, ROYAL_MESSENGER_TAX_GOLD);
  messenger.cargoGold = ROYAL_MESSENGER_TAX_GOLD;
  updatePlayerResources(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Вы передали гонцу 500 золота.");
  closeMessengerModal();
  return true;
}

function getCaravanById(id) {
  return caravans.find(entry => entry.id === id) || null;
}

function getCaravanAtKey(key) {
  return caravans.find(entry => entry.key === key) || null;
}

function setCellToCaravan(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("important", "caravan");
  cell.textContent = "";
  setCellIcon(cell, "caravan.png", "Караван");
  return true;
}

function clearCaravanCell(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return;
  const node = nodeByPos[key];
  if (node) {
    restoreImportantNodeCell(key, cell);
    return;
  }
  setCellToInactive(x, y);
}

function removeCaravanAtIndex(index) {
  const caravan = caravans[index];
  if (!caravan) return;
  clearCaravanCell(caravan.x, caravan.y);
  caravans.splice(index, 1);
}

function isCaravanSpawnAvailable() {
  const cell = grid[CARAVAN_START_KEY];
  return Boolean(cell) && cell.classList.contains("inactive") && !caravans.some(entry => entry.key === CARAVAN_START_KEY);
}

function isCaravanStepAllowed(nx, ny, targetKey) {
  const key = `${nx},${ny}`;
  if (blockedCellKeys.has(key)) return false;
  if (key === targetKey) return true;
  const cell = grid[key];
  if (!cell || !cell.classList.contains("inactive")) return false;
  if (resourceByPos[key]) return false;
  if (specialByPos[key]) return false;
  if (barbarianCells.some(entry => entry.key === key)) return false;
  if (mercenaries.some(entry => entry.key === key)) return false;
  if (thieves.some(entry => entry.key === key)) return false;
  if (cutthroats.some(entry => entry.key === key)) return false;
  if (messengers.some(entry => entry.key === key)) return false;
  if (caravans.some(entry => entry.key === key)) return false;
  if (players.some(player => player.x === nx && player.y === ny)) return false;
  if (treasure?.key === key) return false;
  if (flowerArtifact?.key === key) return false;
  if (cloverArtifact?.key === key) return false;
  if (stoneByPos[key]) return false;
  if (rainbowByPos[key]) return false;
  if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) return false;
  if (typeof trollState !== "undefined" && trollState?.active && trollState.key === key) return false;
  return true;
}

function findCaravanPath(startKey, targetKey, maxDepth = 120) {
  const [sx, sy] = startKey.split(",").map(Number);
  const queue = [{ x: sx, y: sy }];
  const prev = new Map();
  const startId = `${sx},${sy}`;
  prev.set(startId, null);
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  // Shuffle directions so the caravan doesn't always take the same path
  for (let i = dirs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
  }
  let depth = 0;
  while (queue.length && depth <= maxDepth) {
    const nextQueue = [];
    for (const node of queue) {
      const key = `${node.x},${node.y}`;
      if (key === targetKey) {
        const path = [];
        let cur = key;
        while (cur && cur !== startId) {
          path.push(cur);
          cur = prev.get(cur);
        }
        path.reverse();
        return path;
      }
      for (const { dx, dy } of dirs) {
        const nx = node.x + dx;
        const ny = node.y + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const nkey = `${nx},${ny}`;
        if (prev.has(nkey)) continue;
        if (!isCaravanStepAllowed(nx, ny, targetKey)) continue;
        prev.set(nkey, key);
        nextQueue.push({ x: nx, y: ny });
      }
    }
    queue.splice(0, queue.length, ...nextQueue);
    depth += 1;
  }
  return null;
}

function moveCaravan(caravan) {
  if (!caravan?.targetKey || caravan.key === caravan.targetKey) return;
  const path = findCaravanPath(caravan.key, caravan.targetKey, 160);
  if (!path || !path.length) return;
  const steps = Math.min(randomIntRange(CARAVAN_SPEED_MIN, CARAVAN_SPEED_MAX), path.length);
  clearCaravanCell(caravan.x, caravan.y);
  for (let i = 0; i < steps; i += 1) {
    const [nx, ny] = path[i].split(",").map(Number);
    caravan.x = nx;
    caravan.y = ny;
    caravan.key = `${nx},${ny}`;
    if (caravan.key === caravan.targetKey) break;
  }
}

function resolveCaravanArrival(caravan) {
  if ((caravan.cargoGold || 0) > 0) {
    players.forEach((player, playerIndex) => {
      if (!player) return;
      player.resources.influence += CARAVAN_SUCCESS_INFLUENCE_REWARD;
      updatePlayerResources(playerIndex);
      showPrivatePickupToastForPlayer(
        playerIndex,
        `Караван добрался до стражи с золотом. Вы получаете ${CARAVAN_SUCCESS_INFLUENCE_REWARD} влияния.`
      );
    });
    return;
  }
  if (!Number.isInteger(caravan.robbedByPlayerIndex) || !players[caravan.robbedByPlayerIndex]) {
    return;
  }
  const robber = players[caravan.robbedByPlayerIndex];
  robber.resources.influence -= CARAVAN_EMPTY_INFLUENCE_LOSS;
  updatePlayerResources(caravan.robbedByPlayerIndex);
  showPrivatePickupToastForPlayer(
    caravan.robbedByPlayerIndex,
    `Пустой караван добрался до стражи. Вы теряете ${CARAVAN_EMPTY_INFLUENCE_LOSS} влияния.`
  );
}

function tryStartPendingCaravanEvent() {
  if (pendingCaravanEvents <= 0) return false;
  if (isCaravanEventActive() || !isCaravanSpawnAvailable()) return false;
  pendingCaravanEvents -= 1;
  announceCaravanEvent();
  const [x, y] = CARAVAN_START_KEY.split(",").map(Number);
  caravans.push({
    id: caravanIdCounter++,
    key: CARAVAN_START_KEY,
    x,
    y,
    targetKey: guardKey,
    cargoGold: randomIntRange(CARAVAN_GOLD_MIN, CARAVAN_GOLD_MAX),
    robbedByPlayerIndex: null
  });
  setCellToCaravan(x, y);
  return true;
}

function advanceCaravans() {
  for (let i = caravans.length - 1; i >= 0; i -= 1) {
    const caravan = caravans[i];
    if (!caravan.targetKey) {
      removeCaravanAtIndex(i);
      continue;
    }
    moveCaravan(caravan);
    if (caravan.key === caravan.targetKey) {
      resolveCaravanArrival(caravan);
      removeCaravanAtIndex(i);
      continue;
    }
    setCellToCaravan(caravan.x, caravan.y);
  }
  if (!isCaravanEventActive()) {
    tryStartPendingCaravanEvent();
  }
}

function activateScheduledCaravanEvents() {
  if (!scheduledCaravanTurns.length) return;
  const activating = scheduledCaravanTurns.filter(turn => turn === turnCounter);
  if (!activating.length) return;
  scheduledCaravanTurns = scheduledCaravanTurns.filter(turn => turn !== turnCounter);
  activating.forEach(() => {
    pendingCaravanEvents += 1;
  });
  tryStartPendingCaravanEvent();
}

function robCaravan(playerIndex, caravan) {
  const attacker = players[playerIndex];
  if (!attacker || !caravan) return false;
  const stolenGold = Math.max(0, caravan.cargoGold || 0);
  attacker.x = caravan.x;
  attacker.y = caravan.y;
  movesRemaining = 0;
  clearReachable();
  updatePawns();
  if (stolenGold > 0) {
    attacker.pocket.gold += stolenGold;
    caravan.cargoGold = 0;
    caravan.robbedByPlayerIndex = playerIndex;
    updatePlayerResources(playerIndex);
    showPrivateWorldEventModalForPlayer(playerIndex, "Грабёж каравана", `Вы забрали ${stolenGold} золота.`);
  } else {
    showPrivateWorldEventModalForPlayer(playerIndex, "Грабёж каравана", "Караван пуст.");
  }
  endTurn();
  return true;
}

function getWerewolfAtKey(key) {
  return werewolfState && werewolfState.key === key ? werewolfState : null;
}

function setCellToWerewolf(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("important", "werewolf");
  cell.textContent = "";
  setCellIcon(cell, "werewolf.png", "Оборотень");
  return true;
}

function clearWerewolfCell(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return;
  const node = nodeByPos[key];
  if (node) {
    restoreImportantNodeCell(key, cell);
    return;
  }
  setCellToInactive(x, y);
}

function getFullMoonSpawnEligibleKeys() {
  const playerPositions = new Set(
    players
      .filter(player => (player?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER)
      .map(player => `${player.x},${player.y}`)
  );
  return Object.keys(grid).filter(key => {
    const [x, y] = key.split(",").map(Number);
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) return false;
    if (treasure?.key === key) return false;
    if (flowerArtifact?.key === key) return false;
    if (cloverArtifact?.key === key) return false;
    if (playerPositions.has(key)) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (mercenaries.some(entry => entry.key === key)) return false;
    if (thieves.some(entry => entry.key === key)) return false;
    if (cutthroats.some(entry => entry.key === key)) return false;
    if (messengers.some(entry => entry.key === key)) return false;
    if (caravans.some(entry => entry.key === key)) return false;
    if (werewolfState?.key === key) return false;
    if (typeof trollState !== "undefined" && trollState?.active && trollState.key === key) return false;
    if (isSpawnBlocked(x, y)) return false;
    if (blockedCellKeys.has(key)) return false;
    const cell = grid[key];
    return Boolean(cell) && cell.classList.contains("inactive");
  });
}

function isPlayerProtectedFromWerewolf(playerIndex) {
  const player = players[playerIndex];
  if (!player || (player.layer || WORLD_LAYER_UPPER) !== WORLD_LAYER_UPPER) return true;
  if ((player.werewolfAmuletCount || 0) > 0) return true;
  const playerKey = `${player.x},${player.y}`;
  if (guardKey && playerKey === guardKey) return true;
  return isWerewolfCastleProtectedKey(playerKey, playerIndex);
}

function getWerewolfCastleProtectionKeys(playerIndex) {
  const castleKey = getFirstOwnedCastleKey(playerIndex);
  if (!castleKey) return new Set();
  const [castleX, castleY] = castleKey.split(",").map(Number);
  const protectedKeys = new Set();
  for (let y = castleY - 1; y <= castleY + 2; y += 1) {
    for (let x = castleX - 1; x <= castleX + 2; x += 1) {
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      protectedKeys.add(`${x},${y}`);
    }
  }
  return protectedKeys;
}

function isWerewolfCastleProtectedKey(key, ownerPlayerIndex = null) {
  if (typeof key !== "string") return false;
  if (Number.isInteger(ownerPlayerIndex)) {
    return getWerewolfCastleProtectionKeys(ownerPlayerIndex).has(key);
  }
  return players.some((player, playerIndex) => {
    if (!player) return false;
    return getWerewolfCastleProtectionKeys(playerIndex).has(key);
  });
}

function isWerewolfStepAllowed(nx, ny, targetKey) {
  const key = `${nx},${ny}`;
  if (blockedCellKeys.has(key)) return false;
  if (isWerewolfCastleProtectedKey(key)) return false;
  if (key === targetKey) return true;
  const cell = grid[key];
  if (!cell || !cell.classList.contains("inactive")) return false;
  if (resourceByPos[key]) return false;
  if (specialByPos[key]) return false;
  if (barbarianCells.some(entry => entry.key === key)) return false;
  if (mercenaries.some(entry => entry.key === key)) return false;
  if (thieves.some(entry => entry.key === key)) return false;
  if (cutthroats.some(entry => entry.key === key)) return false;
  if (messengers.some(entry => entry.key === key)) return false;
  if (caravans.some(entry => entry.key === key)) return false;
  if (players.some(player => (player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER && player.x === nx && player.y === ny)) return false;
  if (treasure?.key === key) return false;
  if (flowerArtifact?.key === key) return false;
  if (cloverArtifact?.key === key) return false;
  if (stoneByPos[key]) return false;
  if (rainbowByPos[key]) return false;
  if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) return false;
  if (typeof trollState !== "undefined" && trollState?.active && trollState.key === key) return false;
  return true;
}

function isWerewolfApproachCellAvailable(key) {
  const [x, y] = key.split(",").map(Number);
  const cell = grid[key];
  if (!cell || !cell.classList.contains("inactive")) return false;
  if (blockedCellKeys.has(key)) return false;
  if (resourceByPos[key]) return false;
  if (specialByPos[key]) return false;
  if (barbarianCells.some(entry => entry.key === key)) return false;
  if (mercenaries.some(entry => entry.key === key)) return false;
  if (thieves.some(entry => entry.key === key)) return false;
  if (cutthroats.some(entry => entry.key === key)) return false;
  if (messengers.some(entry => entry.key === key)) return false;
  if (caravans.some(entry => entry.key === key)) return false;
  if (players.some(player => (player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER && `${player.x},${player.y}` === key)) return false;
  if (treasure?.key === key) return false;
  if (flowerArtifact?.key === key) return false;
  if (cloverArtifact?.key === key) return false;
  if (stoneByPos[key]) return false;
  if (rainbowByPos[key]) return false;
  if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) return false;
  if (typeof trollState !== "undefined" && trollState?.active && trollState.key === key) return false;
  return true;
}

function findWerewolfPath(startKey, targetKey, maxDepth = 160) {
  const [sx, sy] = startKey.split(",").map(Number);
  const queue = [{ x: sx, y: sy }];
  const prev = new Map();
  const startId = `${sx},${sy}`;
  prev.set(startId, null);
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  let depth = 0;
  while (queue.length && depth <= maxDepth) {
    const nextQueue = [];
    for (const node of queue) {
      const key = `${node.x},${node.y}`;
      if (key === targetKey) {
        const path = [];
        let cur = key;
        while (cur && cur !== startId) {
          path.push(cur);
          cur = prev.get(cur);
        }
        path.reverse();
        return path;
      }
      for (const { dx, dy } of dirs) {
        const nx = node.x + dx;
        const ny = node.y + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const nkey = `${nx},${ny}`;
        if (prev.has(nkey)) continue;
        if (!isWerewolfStepAllowed(nx, ny, targetKey)) continue;
        prev.set(nkey, key);
        nextQueue.push({ x: nx, y: ny });
      }
    }
    queue.splice(0, queue.length, ...nextQueue);
    depth += 1;
  }
  return null;
}

function chooseRandomWerewolfTarget(excludedPlayerIndex = null, requireAttackable = false) {
  const available = players
    .map((player, playerIndex) => ({ player, playerIndex }))
    .filter(({ player, playerIndex }) => {
      if (!player || playerIndex === excludedPlayerIndex) return false;
      if ((player.layer || WORLD_LAYER_UPPER) !== WORLD_LAYER_UPPER) return false;
      if (requireAttackable && isPlayerProtectedFromWerewolf(playerIndex)) return false;
      return true;
    })
    .map(({ playerIndex }) => playerIndex);
  if (!available.length) return null;
  return available[Math.floor(Math.random() * available.length)];
}

function getWerewolfApproachKey(playerIndex) {
  const player = players[playerIndex];
  if (!player || (player.layer || WORLD_LAYER_UPPER) !== WORLD_LAYER_UPPER) return null;
  if (!isPlayerProtectedFromWerewolf(playerIndex)) {
    return `${player.x},${player.y}`;
  }
  const candidates = [
    { x: player.x + 1, y: player.y },
    { x: player.x - 1, y: player.y },
    { x: player.x, y: player.y + 1 },
    { x: player.x, y: player.y - 1 }
  ]
    .filter(({ x, y }) => x >= 0 && x < COLS && y >= 0 && y < ROWS)
    .map(({ x, y }) => `${x},${y}`)
    .filter(key => {
      const [x, y] = key.split(",").map(Number);
      if (werewolfState && werewolfState.key === key) return true;
      return isWerewolfApproachCellAvailable(`${x},${y}`);
    })
    .sort((left, right) => {
      if (!werewolfState) return 0;
      const [lx, ly] = left.split(",").map(Number);
      const [rx, ry] = right.split(",").map(Number);
      const leftDist = Math.abs(lx - werewolfState.x) + Math.abs(ly - werewolfState.y);
      const rightDist = Math.abs(rx - werewolfState.x) + Math.abs(ry - werewolfState.y);
      return leftDist - rightDist;
    });
  return candidates[0] || null;
}

function showWerewolfBattleResult(result) {
  if (!result) return;
  showBattleModal(result);
  const inMultiplayer =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  if (!inMultiplayer) return;
  if (!Number.isInteger(result.defenderIndex)) return;
  if (typeof shouldDelegatePrivateUiToPlayer === "function" && shouldDelegatePrivateUiToPlayer(result.defenderIndex)) {
    emitPrivateUiToPlayer(result.defenderIndex, "showBattleModal", { result });
  }
}

function pickWerewolfTarget(werewolf) {
  if (!werewolf) return;
  if (Number.isInteger(werewolf.targetPlayerIndex) && isPlayerProtectedFromWerewolf(werewolf.targetPlayerIndex)) {
    const alternativeTarget = chooseRandomWerewolfTarget(werewolf.targetPlayerIndex, true);
    if (alternativeTarget !== null) {
      werewolf.targetPlayerIndex = alternativeTarget;
      werewolf.forcedTargetPlayerIndex = alternativeTarget;
      werewolf.forcedTargetTurnsRemaining = 0;
      werewolf.retargetTurnsRemaining = WEREWOLF_RETARGET_INTERVAL;
      return;
    }
  }
  if (werewolf.forcedTargetTurnsRemaining > 0 && Number.isInteger(werewolf.forcedTargetPlayerIndex) && players[werewolf.forcedTargetPlayerIndex]) {
    werewolf.targetPlayerIndex = werewolf.forcedTargetPlayerIndex;
    return;
  }
  if (!Number.isInteger(werewolf.targetPlayerIndex) || werewolf.retargetTurnsRemaining <= 0 || !players[werewolf.targetPlayerIndex]) {
    const attackableTarget = chooseRandomWerewolfTarget(null, true);
    werewolf.targetPlayerIndex = attackableTarget ?? chooseRandomWerewolfTarget();
    werewolf.retargetTurnsRemaining = WEREWOLF_RETARGET_INTERVAL;
  }
}

function advanceWerewolfTargetTimers(werewolf) {
  if (!werewolf) return;
  if (werewolf.forcedTargetTurnsRemaining > 0) {
    werewolf.forcedTargetTurnsRemaining = Math.max(0, werewolf.forcedTargetTurnsRemaining - 1);
    if (werewolf.forcedTargetTurnsRemaining <= 0) {
      werewolf.forcedTargetPlayerIndex = null;
      werewolf.targetPlayerIndex = null;
      werewolf.retargetTurnsRemaining = 0;
    }
    return;
  }
  if (werewolf.retargetTurnsRemaining > 0) {
    werewolf.retargetTurnsRemaining = Math.max(0, werewolf.retargetTurnsRemaining - 1);
  }
}

function endFullMoonEvent() {
  if (werewolfState) {
    clearWerewolfCell(werewolfState.x, werewolfState.y);
  }
  werewolfState = null;
  fullMoonEventState = null;
}

function tryStartPendingFullMoonEvent() {
  if (pendingFullMoonEvents <= 0) return false;
  if (isFullMoonEventActive()) return false;
  pendingFullMoonEvents -= 1;
  announceFullMoonEvent();
  const duration = randomIntRange(FULL_MOON_MIN_DURATION, FULL_MOON_MAX_DURATION);
  fullMoonEventState = {
    duration,
    spawnAtTurn: turnCounter + FULL_MOON_WEREWOLF_SPAWN_DELAY,
    expiresAtTurn: turnCounter + duration - 1
  };
  return true;
}

function trySpawnWerewolfForFullMoon() {
  if (!fullMoonEventState || werewolfState) return false;
  if (turnCounter < (fullMoonEventState.spawnAtTurn || 0)) return false;
  const eligibleKeys = getFullMoonSpawnEligibleKeys();
  if (!eligibleKeys.length) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [x, y] = key.split(",").map(Number);
  werewolfState = {
    key,
    x,
    y,
    health: WEREWOLF_MAX_HEALTH,
    targetPlayerIndex: null,
    retargetTurnsRemaining: 0,
    forcedTargetPlayerIndex: null,
    forcedTargetTurnsRemaining: 0,
    moveCooldownTurnsRemaining: 0
  };
  setCellToWerewolf(x, y);
  return true;
}

function tryStartPendingFogOfWarEvent() {
  if (!FOG_OF_WAR_EVENT_ENABLED) return false;
  if (pendingFogOfWarEvents <= 0) return false;
  if (isFogOfWarActive()) return false;
  pendingFogOfWarEvents -= 1;
  announceFogOfWarEvent();
  const duration = randomIntRange(FOG_OF_WAR_MIN_DURATION, FOG_OF_WAR_MAX_DURATION);
  fogOfWarState = {
    duration,
    expiresAtTurn: turnCounter + duration - 1
  };
  return true;
}

function activateScheduledFogOfWarEvents() {
  if (!FOG_OF_WAR_EVENT_ENABLED) {
    scheduledFogOfWarTurns = [];
    pendingFogOfWarEvents = 0;
    return;
  }
  if (!scheduledFogOfWarTurns.length) return;
  const activating = scheduledFogOfWarTurns.filter(turn => turn === turnCounter);
  if (!activating.length) return;
  scheduledFogOfWarTurns = scheduledFogOfWarTurns.filter(turn => turn !== turnCounter);
  activating.forEach(() => {
    pendingFogOfWarEvents += 1;
  });
  tryStartPendingFogOfWarEvent();
}

function advanceFogOfWarState() {
  if (fogOfWarState && turnCounter >= fogOfWarState.expiresAtTurn) {
    fogOfWarState = null;
  }
  if (!fogOfWarState) {
    tryStartPendingFogOfWarEvent();
  }
}

function activateScheduledFullMoonEvents() {
  if (!scheduledFullMoonTurns.length) return;
  const activating = scheduledFullMoonTurns.filter(turn => turn === turnCounter);
  if (!activating.length) return;
  scheduledFullMoonTurns = scheduledFullMoonTurns.filter(turn => turn !== turnCounter);
  activating.forEach(() => {
    pendingFullMoonEvents += 1;
  });
  tryStartPendingFullMoonEvent();
}

function buildWerewolfBattleResult(playerIndex, options = {}) {
  const player = players[playerIndex];
  const werewolf = werewolfState;
  if (!player || !werewolf) return null;
  const initialHealth = Math.max(0, Number(werewolf.health) || 0);
  const initialArmy = Math.max(0, player.pocket.army || 0);
  const initialAttack = Math.max(0, player.attack || 0);
  const werewolfDamage = randomIntRange(WEREWOLF_ATTACK_MIN, WEREWOLF_ATTACK_MAX);
  const playerArmyLost = Math.min(initialArmy, werewolfDamage);
  player.pocket.army = Math.max(0, initialArmy - playerArmyLost);
  let playerAttackPenalty = 0;
  if (options.initiatedByWerewolf && initialArmy <= 0 && initialAttack > 0) {
    playerAttackPenalty = 1;
    player.attack = Math.max(0, initialAttack - 1);
  }
  const playerAttackDamage = 0;
  let playerArmyDamage = 0;
  if (werewolf.health > 0) {
    playerArmyDamage = Math.min(werewolf.health, Math.max(0, player.pocket.army || 0));
    werewolf.health = Math.max(0, werewolf.health - playerArmyDamage);
  }
  updatePlayerResources(playerIndex);
  return {
    type: "werewolf",
    defenderIndex: playerIndex,
    playerIndex,
    playerName: player.name || `Игрок ${playerIndex + 1}`,
    playerArmyBefore: initialArmy,
    playerArmyLost,
    playerArmyAfter: Math.max(0, player.pocket.army || 0),
    werewolfHealthBefore: initialHealth,
    werewolfHealthAfter: Math.max(0, werewolf.health || 0),
    werewolfDamage,
    playerAttackBefore: initialAttack,
    playerAttackDamage,
    playerAttackPenalty,
    playerAttackAfter: Math.max(0, player.attack || 0),
    playerArmyDamage,
    initiatedByWerewolf: Boolean(options.initiatedByWerewolf),
    fangAwarded: false
  };
}

function updateWerewolfTargetAfterAttack(attackedPlayerIndex) {
  if (!werewolfState || werewolfState.health <= 0) return;
  const nextTarget = chooseRandomWerewolfTarget(attackedPlayerIndex);
  werewolfState.forcedTargetPlayerIndex = nextTarget;
  werewolfState.forcedTargetTurnsRemaining = nextTarget === null ? 0 : WEREWOLF_FORCED_TARGET_TURNS;
  werewolfState.targetPlayerIndex = nextTarget;
  werewolfState.retargetTurnsRemaining = WEREWOLF_RETARGET_INTERVAL;
  werewolfState.skipTargetTimerTick = true;
}

function finalizeWerewolfBattle(playerIndex, options = {}) {
  const result = buildWerewolfBattleResult(playerIndex, options);
  if (!result) return null;
  if (werewolfState && werewolfState.health <= 0) {
    const player = players[playerIndex];
    if (player) {
      player.werewolfFangCount = (player.werewolfFangCount || 0) + 1;
      player.attack = Math.max(0, (player.attack || 0) + 12);
      result.fangAwarded = true;
      result.playerAttackAfter = Math.max(0, player.attack || 0);
      updatePlayerResources(playerIndex);
    }
    endFullMoonEvent();
    tryStartPendingFullMoonEvent();
    return result;
  }
  if (options.initiatedByWerewolf) {
    updateWerewolfTargetAfterAttack(playerIndex);
  }
  return result;
}

function moveWerewolfTowardTarget() {
  const werewolf = werewolfState;
  if (!werewolf) return null;
  pickWerewolfTarget(werewolf);
  if (!Number.isInteger(werewolf.targetPlayerIndex)) return null;
  const targetPlayer = players[werewolf.targetPlayerIndex];
  if (!targetPlayer || (targetPlayer.layer || WORLD_LAYER_UPPER) !== WORLD_LAYER_UPPER) return null;
  const targetKey = getWerewolfApproachKey(werewolf.targetPlayerIndex);
  if (!targetKey) return null;
  const path = findWerewolfPath(werewolf.key, targetKey, 180);
  if (!path || !path.length) return null;
  const steps = Math.min(randomIntRange(WEREWOLF_SPEED_MIN, WEREWOLF_SPEED_MAX), path.length);
  clearWerewolfCell(werewolf.x, werewolf.y);
  for (let i = 0; i < steps; i += 1) {
    const [nx, ny] = path[i].split(",").map(Number);
    werewolf.x = nx;
    werewolf.y = ny;
    werewolf.key = `${nx},${ny}`;
    if (werewolf.key === targetKey) break;
  }
  return targetPlayer;
}

function advanceWerewolf() {
  if (!fullMoonEventState) {
    tryStartPendingFullMoonEvent();
    return;
  }
  if (!werewolfState) {
    trySpawnWerewolfForFullMoon();
    if (!werewolfState) {
      if (fullMoonEventState && turnCounter >= fullMoonEventState.expiresAtTurn) {
        endFullMoonEvent();
      }
      if (!fullMoonEventState) {
        tryStartPendingFullMoonEvent();
      }
      return;
    }
  }
  if ((werewolfState.moveCooldownTurnsRemaining || 0) > 0) {
    werewolfState.moveCooldownTurnsRemaining = Math.max(0, (werewolfState.moveCooldownTurnsRemaining || 0) - 1);
    if (fullMoonEventState && turnCounter >= fullMoonEventState.expiresAtTurn) {
      endFullMoonEvent();
    }
    if (!fullMoonEventState) {
      tryStartPendingFullMoonEvent();
    }
    return;
  }
  const targetPlayer = moveWerewolfTowardTarget();
  let battleResult = null;
  if (werewolfState && targetPlayer) {
    const targetKey = `${targetPlayer.x},${targetPlayer.y}`;
    const targetIsReachable = !isPlayerProtectedFromWerewolf(werewolfState.targetPlayerIndex);
    if (targetIsReachable && werewolfState.key === targetKey) {
      battleResult = finalizeWerewolfBattle(werewolfState.targetPlayerIndex, { initiatedByWerewolf: true });
      if (battleResult) {
        showWerewolfBattleResult(battleResult);
      }
    }
  }
  if (werewolfState) {
    setCellToWerewolf(werewolfState.x, werewolfState.y);
    werewolfState.moveCooldownTurnsRemaining = WEREWOLF_MOVE_INTERVAL - 1;
    if (werewolfState.skipTargetTimerTick) {
      werewolfState.skipTargetTimerTick = false;
    } else {
      advanceWerewolfTargetTimers(werewolfState);
    }
    if (fullMoonEventState && turnCounter >= fullMoonEventState.expiresAtTurn) {
      endFullMoonEvent();
    }
  }
  if (!werewolfState) {
    tryStartPendingFullMoonEvent();
  }
}

function tickWorldEvents() {
  let shouldSyncBarbarianStrengths = false;
  Object.keys(activeWorldEvents).forEach(eventKey => {
    const state = activeWorldEvents[eventKey];
    if (!state) return;
    if ((state.turnsUntilActive || 0) > 0) {
      state.turnsUntilActive = Math.max(0, state.turnsUntilActive - 1);
      return;
    }
    state.remainingTurns = Math.max(0, (state.remainingTurns || 0) - 1);
    if (state.remainingTurns <= 0) {
      delete activeWorldEvents[eventKey];
      if (eventKey === WORLD_EVENTS.barbarianFury.key) {
        shouldSyncBarbarianStrengths = true;
      }
    }
  });
  if (shouldSyncBarbarianStrengths && typeof syncBarbarianStrengths === "function") {
    syncBarbarianStrengths();
  }
}

function activateScheduledWorldEvents() {
  if (!scheduledWorldEvents.length) return;
  const activating = scheduledWorldEvents.filter(event => event.startTurn === turnCounter);
  if (!activating.length) return;
  scheduledWorldEvents = scheduledWorldEvents.filter(event => event.startTurn !== turnCounter);
  activating.forEach(event => {
    if (event.key === WORLD_EVENTS.wealthTax.key) {
      applyWealthTaxWorldEvent();
      return;
    }
    if (event.key === WORLD_EVENTS.mercenaryRiot.key) {
      applyMercenaryRiotWorldEvent();
      return;
    }
    if (event.key === WORLD_EVENTS.royalTax.key) {
      if (!ROYAL_TAX_EVENT_ENABLED) return;
      applyRoyalTaxWorldEvent();
      return;
    }
    if (event.key === WORLD_EVENTS.kingAuction.key) {
      startKingAuctionWorldEvent();
      return;
    }
    if (event.key === WORLD_EVENTS.kingGenerosity.key) {
      startKingGenerosityWorldEvent();
      return;
    }
    if (event.key === WORLD_EVENTS.kingConcern.key) {
      applyKingConcernWorldEvent(event);
      return;
    }
    if (event.key === WORLD_EVENTS.trollsLeaveCaves.key) {
      if (typeof startTrollsLeaveCaves === "function") startTrollsLeaveCaves(event.duration);
      announceWorldEvent(event.key, event.duration);
      return;
    }
    activeWorldEvents[event.key] = {
      startTurn: turnCounter,
      duration: event.duration,
      remainingTurns: event.duration,
      turnsUntilActive: Math.max(0, event.turnsUntilActive || 0)
    };
    if (event.key === WORLD_EVENTS.mageJourney.key) {
      if (typeof mageSlot !== "undefined" && mageSlot?.active && typeof removeMageCell === "function") {
        removeMageCell(mageSlot);
      }
    }
    if (event.key === WORLD_EVENTS.masterJourney.key) {
      if (typeof masterActive !== "undefined" && masterActive && typeof clearMasterCell === "function") {
        clearMasterCell();
      }
    }
    if (event.key === WORLD_EVENTS.barbarianFury.key && typeof syncBarbarianStrengths === "function") {
      syncBarbarianStrengths();
    }
    announceWorldEvent(event.key, event.duration);
  });
}

function getViewerWorldPlayerIndex() {
  if (
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted &&
    typeof localPlayerIndex === "number"
  ) {
    return localPlayerIndex;
  }
  try {
    return typeof currentPlayerIndex === "number" ? currentPlayerIndex : 0;
  } catch (error) {
    return 0;
  }
}

function getVisibleWorldLayer() {
  const viewerIndex = getViewerWorldPlayerIndex();
  return players[viewerIndex]?.layer || WORLD_LAYER_UPPER;
}

function getTimeOfDay() {
  const position = turnCounter % TIME_OF_DAY_CYCLE_LENGTH;
  let accumulated = 0;
  for (let i = 0; i < TIME_OF_DAY_CYCLE.length; i += 1) {
    accumulated += TIME_OF_DAY_CYCLE[i].duration;
    if (position < accumulated) return TIME_OF_DAY_CYCLE[i];
  }
  return TIME_OF_DAY_CYCLE[0];
}

function getTurnsUntilTimeChange() {
  const position = turnCounter % TIME_OF_DAY_CYCLE_LENGTH;
  let accumulated = 0;
  for (let i = 0; i < TIME_OF_DAY_CYCLE.length; i += 1) {
    accumulated += TIME_OF_DAY_CYCLE[i].duration;
    if (position < accumulated) return accumulated - position;
  }
  return TIME_OF_DAY_CYCLE_LENGTH - position;
}

function isDayBuffActive(buffKey) {
  return activeDayBuffs.includes(buffKey);
}

function applyCastleArmorDayBuff() {
  castleArmorDayBuffReductions = {};
  Object.keys(castleOwnersByKey).forEach(key => {
    const owner = castleOwnersByKey[key];
    if (typeof owner !== "number") return;
    const stats = ensureCastleStats(key);
    if (!stats) return;
    const reduction = Math.min(stats.armorCurrent - 1, 30);
    if (reduction > 0) {
      stats.armorCurrent -= reduction;
      castleArmorDayBuffReductions[key] = reduction;
      if (typeof updateCastleBars === "function") updateCastleBars(key);
    }
  });
}

function restoreCastleArmorFromDayBuff() {
  Object.keys(castleArmorDayBuffReductions).forEach(key => {
    const stats = typeof ensureCastleStats === "function" ? ensureCastleStats(key) : null;
    if (stats) {
      stats.armorCurrent = (stats.armorCurrent || 0) + (castleArmorDayBuffReductions[key] || 0);
      if (typeof updateCastleBars === "function") updateCastleBars(key);
    }
  });
  castleArmorDayBuffReductions = {};
}

function rollDayBuffs() {
  const pool = DAY_BUFF_POOL.slice();
  const result = [];
  for (let i = 0; i < 2 && pool.length > 0; i += 1) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx].key);
    pool.splice(idx, 1);
  }
  activeDayBuffs = result;
}

function getUpperWorldBackground() {
  if (isFullMoonEventActive()) return FULL_MOON_UPPER_WORLD_BG;
  return getTimeOfDay().bg;
}

function isWithinVisionRadius(originX, originY, targetX, targetY, radius, diagonalAllowed = true) {
  if (diagonalAllowed) {
    return Math.max(Math.abs(originX - targetX), Math.abs(originY - targetY)) <= radius;
  }
  return Math.abs(originX - targetX) + Math.abs(originY - targetY) <= radius;
}

function getFogOfWarVisibleKeysForPlayer(playerIndex) {
  const visible = new Set();
  const player = players[playerIndex];
  if (!player || (player.layer || WORLD_LAYER_UPPER) !== WORLD_LAYER_UPPER) {
    return visible;
  }
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (isWithinVisionRadius(player.x, player.y, x, y, FOG_OF_WAR_PLAYER_RADIUS, false)) {
        visible.add(`${x},${y}`);
      }
    }
  }
  const castleKey = getFirstOwnedCastleKey(playerIndex);
  if (castleKey) {
    const [cx, cy] = castleKey.split(",").map(Number);
    for (let y = cy - 2; y <= cy + 3; y += 1) {
      for (let x = cx - 2; x <= cx + 3; x += 1) {
        if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
          visible.add(`${x},${y}`);
        }
      }
    }
  }
  return visible;
}

function isUpperWorldKeyVisibleToPlayer(key, playerIndex = getViewerWorldPlayerIndex()) {
  if (!isFogOfWarActive()) return true;
  const visibleLayer = getVisibleWorldLayer();
  if (visibleLayer !== WORLD_LAYER_UPPER) return true;
  return getFogOfWarVisibleKeysForPlayer(playerIndex).has(key);
}

function applyFogOfWarMask() {
  const viewerIndex = getViewerWorldPlayerIndex();
  const visibleKeys = isFogOfWarActive() && getVisibleWorldLayer() === WORLD_LAYER_UPPER
    ? getFogOfWarVisibleKeysForPlayer(viewerIndex)
    : null;
  Object.keys(grid).forEach(key => {
    const cell = grid[key];
    if (!cell) return;
    const hidden = Boolean(visibleKeys) && !visibleKeys.has(key);
    cell.classList.toggle("fogged", hidden);
    if (hidden) {
      const variant = fogOfWarVariantsByKey[key] || 1;
      cell.dataset.fogVariant = String(variant);
    } else {
      delete cell.dataset.fogVariant;
    }
    if (hidden) {
      cell.removeAttribute("title");
    }
  });
}

function getPlayerUnderworldState(playerIndex) {
  return players[playerIndex]?.underworldState || null;
}

function getVisibleWorldDimensions() {
  if (getVisibleWorldLayer() === WORLD_LAYER_TROLL_CAVE) {
    return { cols: TROLL_CAVE_INTERIOR_COLS, rows: TROLL_CAVE_INTERIOR_ROWS };
  }
  return { cols: COLS, rows: ROWS };
}

function isInsideTrollCaveBounds(x, y) {
  return x >= 0 && x < TROLL_CAVE_INTERIOR_COLS && y >= 0 && y < TROLL_CAVE_INTERIOR_ROWS;
}

function isTrollCaveCellBlocked(x, y) {
  if (!isInsideTrollCaveBounds(x, y)) return true;
  return TROLL_CAVE_BLOCKED_KEYS.has(`${x},${y}`);
}

function getTrollCaveEntranceKeys(caveIndex) {
  return (TROLL_CAVE_ENTRANCE_CELL_NUMBERS[caveIndex] || []).map(getTrollCaveCellKeyByNumber);
}

function getFreeTrollCaveEntryPosition(caveIndex, enteringPlayerIndex) {
  const entranceKeys = getTrollCaveEntranceKeys(caveIndex);
  const fallbackKey = entranceKeys[0] || "0,0";
  const [fallbackX, fallbackY] = fallbackKey.split(",").map(Number);
  const occupied = new Set(players
    .map((player, index) => ({ player, index }))
    .filter(({ player, index }) => index !== enteringPlayerIndex && (player?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE)
    .map(({ player }) => `${player.x},${player.y}`));
  if (typeof isTrollInCave === "function" && isTrollInCave() && trollState?.interiorKey) {
    occupied.add(trollState.interiorKey);
  }
  const queue = entranceKeys.map(key => {
    const [x, y] = key.split(",").map(Number);
    return { x, y };
  });
  const visited = new Set(entranceKeys);
  while (queue.length) {
    const current = queue.shift();
    const key = `${current.x},${current.y}`;
    if (!isTrollCaveCellBlocked(current.x, current.y) && !occupied.has(key)) {
      return current;
    }
    for (const { dx, dy } of MOVES_DIRS) {
      const x = current.x + dx;
      const y = current.y + dy;
      const nextKey = `${x},${y}`;
      if (!isInsideTrollCaveBounds(x, y) || visited.has(nextKey)) continue;
      visited.add(nextKey);
      queue.push({ x, y });
    }
  }
  return { x: fallbackX, y: fallbackY };
}

function enterTrollCave(playerIndex, caveIndex) {
  const player = players[playerIndex];
  if (!player || caveIndex < 0 || caveIndex >= TROLL_CAVES.length) return false;
  const entry = getFreeTrollCaveEntryPosition(caveIndex, playerIndex);
  player.layer = WORLD_LAYER_TROLL_CAVE;
  player.underworldState = null;
  player.trollCaveEntranceIndex = caveIndex;
  player.x = entry.x;
  player.y = entry.y;
  refreshVisibleWorld();
  if (typeof emitStateNow === "function") emitStateNow(true);
  showPrivatePickupToastForPlayer(playerIndex, `Вы вошли в общую пещеру через вход ${caveIndex + 1}.`);
  return true;
}

function exitTrollCave(playerIndex, exitIndex) {
  const player = players[playerIndex];
  const cave = TROLL_CAVES[exitIndex];
  if (!player || !cave) return false;
  player.layer = WORLD_LAYER_UPPER;
  player.underworldState = null;
  player.trollCaveEntranceIndex = null;
  player.x = cave.x;
  player.y = cave.y;
  refreshVisibleWorld();
  if (typeof emitStateNow === "function") emitStateNow(true);
  showPrivatePickupToastForPlayer(playerIndex, `Вы вышли из пещеры через выход ${exitIndex + 1}.`);
  return true;
}

const TROLL_CAVE_LOOT_DEFS = {
  gold: { icon: "gold.png", label: "золото" },
  resources: { icon: "resources.png", label: "ресурсы" },
  army: { icon: "army.png", label: "войска" },
  rainbow: { icon: "rainbow_stone.png", label: "радужный камень" },
  flower: { icon: "mystic_flower.png", label: "таинственный цветок" }
};
const TROLL_CAVE_RESOURCE_LOOT_TYPES = new Set(["gold", "resources", "army"]);

function getTrollCaveLootEffectiveAmount(loot) {
  const baseAmount = Math.max(0, Number(loot?.amount) || 0);
  if (!TROLL_CAVE_RESOURCE_LOOT_TYPES.has(loot?.typeKey)) return baseAmount;
  return getTimeOfDay().key === "evening"
    ? Math.floor(baseAmount * 1.25)
    : baseAmount;
}

function getAvailableTrollCaveLootKeys() {
  const unavailable = new Set(TROLL_CAVE_ENTRANCE_CELL_NUMBERS.flat().map(getTrollCaveCellKeyByNumber));
  unavailable.add(getTrollCaveCellKeyByNumber(TROLL_CAVE_PIT_CELL_NUMBER));
  Object.keys(trollCaveInteriorState?.lootByPos || {}).forEach(key => unavailable.add(key));
  if (trollState?.interiorKey) unavailable.add(trollState.interiorKey);
  players.forEach(player => {
    if ((player?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE) {
      unavailable.add(`${player.x},${player.y}`);
    }
  });
  const keys = [];
  for (let y = 0; y < TROLL_CAVE_INTERIOR_ROWS; y += 1) {
    for (let x = 0; x < TROLL_CAVE_INTERIOR_COLS; x += 1) {
      const key = `${x},${y}`;
      if (TROLL_CAVE_BLOCKED_KEYS.has(key) || unavailable.has(key)) continue;
      keys.push(key);
    }
  }
  for (let index = keys.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [keys[index], keys[swapIndex]] = [keys[swapIndex], keys[index]];
  }
  return keys;
}

function depositTrollCarriedLootInCave(caveIndex, options = {}) {
  const carriedLoot = Array.isArray(trollState.carriedCaveLootSlots)
    ? trollState.carriedCaveLootSlots.slice()
    : [];
  if (!options.skipArtifactRoll && Math.random() < TROLL_CAVE_ARTIFACT_CHANCE) {
    carriedLoot.push({ typeKey: "rainbow", amount: 1 });
  }
  if (!options.skipArtifactRoll && Math.random() < TROLL_CAVE_ARTIFACT_CHANCE) {
    carriedLoot.push({ typeKey: "flower", amount: 1 });
  }
  const availableKeys = getAvailableTrollCaveLootKeys();
  const existingResourceCellCount = Object.values(trollCaveInteriorState?.lootByPos || {})
    .filter(entry => TROLL_CAVE_RESOURCE_LOOT_TYPES.has(entry.typeKey))
    .length;
  let availableResourceCells = Math.max(0, TROLL_CAVE_RESOURCE_CELL_LIMIT - existingResourceCellCount);
  const placedLoot = [];
  const remainingCarriedLoot = [];
  carriedLoot.forEach(entry => {
    const isResource = TROLL_CAVE_RESOURCE_LOOT_TYPES.has(entry.typeKey);
    if (placedLoot.length >= availableKeys.length || (isResource && availableResourceCells <= 0)) {
      remainingCarriedLoot.push(entry);
      return;
    }
    placedLoot.push(entry);
    if (isResource) availableResourceCells -= 1;
  });
  const placedCount = placedLoot.length;
  const generation = (trollCaveInteriorState.generation || 0) + (placedCount > 0 ? 1 : 0);
  const lootByPos = { ...(trollCaveInteriorState?.lootByPos || {}) };
  placedLoot.forEach((entry, index) => {
    const key = availableKeys[index];
    const [x, y] = key.split(",").map(Number);
    lootByPos[key] = {
      ...entry,
      id: `troll-cave-${generation}-${index + 1}`,
      key,
      x,
      y
    };
  });
  trollState.carriedCaveLootSlots = remainingCarriedLoot;
  trollCaveInteriorState = {
    ...trollCaveInteriorState,
    generation,
    sourceCaveIndex: caveIndex,
    lootByPos
  };
  if (getVisibleWorldLayer() === WORLD_LAYER_TROLL_CAVE) refreshVisibleWorld();
  if (!options.silent && typeof emitStateNow === "function") emitStateNow(true);
  return placedCount;
}

function depositPendingInitialTrollCaveLoot() {
  if (!Array.isArray(trollState?.carriedCaveLootSlots) || !trollState.carriedCaveLootSlots.length) return 0;
  if (!Number.isInteger(trollState.currentCaveIndex)) return 0;
  return depositTrollCarriedLootInCave(trollState.currentCaveIndex, {
    silent: true,
    skipArtifactRoll: true
  });
}

// При первой загрузке 04-й скрипт создаёт стартовые слоты раньше, чем доступна
// функция раскладки внутренней пещеры. После инициализации UI раскладываем их здесь.
depositPendingInitialTrollCaveLoot();

function collectTrollCaveLoot(playerIndex, key) {
  const player = players[playerIndex];
  const loot = trollCaveInteriorState?.lootByPos?.[key];
  if (!player || !loot) return false;
  const amount = getTrollCaveLootEffectiveAmount(loot);
  const eveningBonus = amount > (loot.amount || 0) ? " (вечерний бонус ×1,25)" : "";
  let message = "";
  let collected = true;
  if (loot.typeKey === "gold") {
    player.pocket.gold += amount;
    message = `В пещере найдено ${amount} золота${eveningBonus}.`;
  } else if (loot.typeKey === "resources") {
    player.pocket.resources += amount;
    message = `В пещере найдено ${amount} ресурсов${eveningBonus}.`;
  } else if (loot.typeKey === "army") {
    player.pocket.army += amount;
    message = `В пещере найдено ${amount} войск${eveningBonus}.`;
  } else if (loot.typeKey === "rainbow") {
    collected = tryAddSpecialArtifactToInventory(player, "rainbow");
    message = collected ? "В пещере найден Радужный камень." : "Радужный камень не помещается: слоты заняты.";
  } else if (loot.typeKey === "flower") {
    collected = tryAddSpecialArtifactToInventory(player, "flower");
    message = collected ? "В пещере найден Таинственный цветок." : "Таинственный цветок не помещается: слоты заняты.";
  } else {
    collected = false;
  }
  if (collected) {
    delete trollCaveInteriorState.lootByPos[key];
  }
  updatePlayerResources(playerIndex);
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, message || "Добыча из пещеры подобрана.");
  refreshVisibleWorld();
  if (collected && typeof emitStateNow === "function") emitStateNow(true);
  return collected;
}

function clearTrollCaveResourceLootForMorning(options = {}) {
  const lootByPos = trollCaveInteriorState?.lootByPos || {};
  let removedCount = 0;
  Object.keys(lootByPos).forEach(key => {
    const entry = lootByPos[key];
    if (entry?.typeKey === "rainbow" || entry?.typeKey === "flower") return;
    delete lootByPos[key];
    removedCount += 1;
  });
  if (removedCount <= 0) return 0;
  if (options.refresh !== false && getVisibleWorldLayer() === WORLD_LAYER_TROLL_CAVE) {
    refreshVisibleWorld();
  }
  if (!options.silent && typeof emitStateNow === "function") emitStateNow(true);
  return removedCount;
}

const TROLL_CAVE_STUN_RANGE = 5;
const TROLL_CAVE_STUN_CHANCE = 0.5;

function getNearestTrollCaveEntranceIndex(x, y) {
  let nearestIndex = 0;
  let nearestDistance = Infinity;
  TROLL_CAVE_ENTRANCE_CELL_NUMBERS.forEach((numbers, caveIndex) => {
    numbers.forEach(number => {
      const key = getTrollCaveCellKeyByNumber(number);
      const [entranceX, entranceY] = key.split(",").map(Number);
      const distance = Math.abs(x - entranceX) + Math.abs(y - entranceY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = caveIndex;
      }
    });
  });
  return nearestIndex;
}

function buildTrollCaveChasePath(startX, startY, targetPlayerIndex) {
  const target = players[targetPlayerIndex];
  if (!target) return [];
  const startKey = `${startX},${startY}`;
  const targetKey = `${target.x},${target.y}`;
  if (startKey === targetKey) return [];
  const occupiedByOtherPlayers = new Set(players
    .map((player, index) => ({ player, index }))
    .filter(({ player, index }) =>
      index !== targetPlayerIndex &&
      (player?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE
    )
    .map(({ player }) => `${player.x},${player.y}`));
  const pitKey = getTrollCaveCellKeyByNumber(TROLL_CAVE_PIT_CELL_NUMBER);
  const queue = [startKey];
  const previous = new Map([[startKey, null]]);
  while (queue.length) {
    const currentKey = queue.shift();
    if (currentKey === targetKey) break;
    const [currentX, currentY] = currentKey.split(",").map(Number);
    for (const { dx, dy } of MOVES_DIRS) {
      const x = currentX + dx;
      const y = currentY + dy;
      const key = `${x},${y}`;
      if (previous.has(key) || isTrollCaveCellBlocked(x, y)) continue;
      if (key === pitKey || (occupiedByOtherPlayers.has(key) && key !== targetKey)) continue;
      previous.set(key, currentKey);
      queue.push(key);
    }
  }
  if (!previous.has(targetKey)) return [];
  const reversed = [];
  let cursor = targetKey;
  while (cursor && cursor !== startKey) {
    reversed.push(cursor);
    cursor = previous.get(cursor);
  }
  return reversed.reverse();
}

function expelPlayerFromTrollCave(playerIndex) {
  const player = players[playerIndex];
  if (!player) return false;
  const exitIndex = getNearestTrollCaveEntranceIndex(player.x, player.y);
  const exteriorCave = TROLL_CAVES[exitIndex];
  if (!exteriorCave) return false;
  player.layer = WORLD_LAYER_UPPER;
  player.underworldState = null;
  player.trollCaveEntranceIndex = null;
  player.x = exteriorCave.x;
  player.y = exteriorCave.y;
  player.stunnedTurnsRemaining = TROLL_STUN_DURATION;
  player.stunSource = "troll";
  updatePlayerResources(playerIndex);
  showPrivatePickupToastForPlayer(
    playerIndex,
    `Тролль оглушил вас и выбросил через ближайший выход. Оглушение: ${TROLL_STUN_DURATION} общих ходов.`
  );
  return true;
}

function handleTrollInsideCaveTurn() {
  if (!trollState?.active || typeof isTrollInCave !== "function" || !isTrollInCave()) return false;
  const cavePlayers = players
    .map((player, index) => ({ player, index }))
    .filter(({ player }) => (player?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE);
  if (!cavePlayers.length) return false;
  if (!trollState.interiorKey) {
    placeTrollInsideCave(trollState.currentCaveIndex);
  }
  const trollX = Number(trollState.interiorX);
  const trollY = Number(trollState.interiorY);
  if (!Number.isInteger(trollX) || !Number.isInteger(trollY)) return true;
  cavePlayers.forEach(entry => {
    entry.distance = Math.abs(entry.player.x - trollX) + Math.abs(entry.player.y - trollY);
  });
  cavePlayers.sort((a, b) => a.distance - b.distance || a.index - b.index);
  const targetEntry = cavePlayers[0];

  if (targetEntry.distance <= TROLL_CAVE_STUN_RANGE && Math.random() < TROLL_CAVE_STUN_CHANCE) {
    expelPlayerFromTrollCave(targetEntry.index);
    refreshVisibleWorld();
    return true;
  }

  const path = buildTrollCaveChasePath(trollX, trollY, targetEntry.index);
  // Последняя клетка занята игроком: тролль останавливается рядом, не накладываясь на пешку.
  const maxSteps = Math.min(TROLL_SPEED, Math.max(0, path.length - 1));
  if (maxSteps > 0) {
    const destinationKey = path[maxSteps - 1];
    const [x, y] = destinationKey.split(",").map(Number);
    trollState.interiorX = x;
    trollState.interiorY = y;
    trollState.interiorKey = destinationKey;
  }
  refreshVisibleWorld();
  return true;
}

function isUpperLevelPositionOccupied(x, y) {
  return players.some(player => (player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER && player.x === x && player.y === y);
}

function getUpperWormholeEligibleKeys() {
  const keys = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const key = `${x},${y}`;
      if (blockedCellKeys.has(key)) continue;
      if (nodeByPos[key]) continue;
      if (resourceByPos[key]) continue;
      if (specialByPos[key]) continue;
      if (stoneByPos[key]) continue;
      if (rainbowByPos[key]) continue;
      if (treasure && treasure.key === key) continue;
      if (flowerArtifact && flowerArtifact.key === key) continue;
      if (cloverArtifact && cloverArtifact.key === key) continue;
      if (barbarianCells.some(cell => cell.key === key)) continue;
      if (isUpperLevelPositionOccupied(x, y)) continue;
      keys.push(key);
    }
  }
  return keys;
}

function spawnUpperWormhole() {
  if (upperWormhole) return true;
  const eligibleKeys = getUpperWormholeEligibleKeys();
  if (!eligibleKeys.length) return false;
  const key = eligibleKeys[Math.floor(Math.random() * eligibleKeys.length)];
  const [x, y] = key.split(",").map(Number);
  upperWormhole = { key, x, y };
  return true;
}

function handleWormholeSpawns() {
  if (turnCounter > WORMHOLE_MAX_SPAWN_TURN) return;
  if (upperWormhole) return;
  if (wormholeSpawnIndex >= wormholeSpawnTurns.length) return;
  if (turnCounter < wormholeSpawnTurns[wormholeSpawnIndex]) return;
  if (spawnUpperWormhole()) {
    wormholeSpawnIndex += 1;
  }
}

function createUnderworldStateForPlayer(playerIndex) {
  const player = players[playerIndex];
  if (!player) return null;
  const reserved = new Set([`${player.x},${player.y}`]);
  const resourceAvailable = [];
  const stairsAvailable = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const key = `${x},${y}`;
      if (reserved.has(key)) continue;
      resourceAvailable.push(key);
      if (
        !blockedCellKeys.has(key) &&
        (typeof isSpawnBlocked !== "function" || !isSpawnBlocked(x, y))
      ) {
        stairsAvailable.push(key);
      }
    }
  }
  for (let i = resourceAvailable.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [resourceAvailable[i], resourceAvailable[j]] = [resourceAvailable[j], resourceAvailable[i]];
  }
  for (let i = stairsAvailable.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [stairsAvailable[i], stairsAvailable[j]] = [stairsAvailable[j], stairsAvailable[i]];
  }
  const resources = {};
  let cursor = 0;
  for (let i = 0; i < UNDERWORLD_GOLD_COUNT && cursor < resourceAvailable.length; i += 1, cursor += 1) {
    const key = resourceAvailable[cursor];
    const [x, y] = key.split(",").map(Number);
    resources[key] = { key, x, y, typeKey: "gold" };
  }
  for (let i = 0; i < UNDERWORLD_RESOURCES_COUNT && cursor < resourceAvailable.length; i += 1, cursor += 1) {
    const key = resourceAvailable[cursor];
    const [x, y] = key.split(",").map(Number);
    resources[key] = { key, x, y, typeKey: "resources" };
  }
  const stairsKey = stairsAvailable.find(key => !resources[key]) || `${player.x},${player.y}`;
  const [stairsX, stairsY] = stairsKey.split(",").map(Number);
  return {
    resourcesByPos: resources,
    stairs: { key: stairsKey, x: stairsX, y: stairsY },
    bridgeExitKey: null
  };
}

function resetCellForVisibleRender(key) {
  const cell = grid[key];
  if (!cell) return;
  cell.classList.remove(
    "resource", "important", "owned", "reachable", "barbarian", "special", "forest",
    "resource-disabled", "mercenary", "thief", "cutthroat", "messenger", "caravan", "werewolf", "mage", "portal", "wormhole",
    "stairs", "flower", "clover", "stone", "rainbow-stone", "void-shard", "master", "troll", "troll-cave", "tavern", "tavern-node", "treasure",
    "troll-cave-numbered", "troll-cave-entrance", "troll-cave-pit", "troll-cave-loot", "troll-cave-troll",
    "world-cell-hidden"
  );
  cell.classList.add("inactive");
  cell.textContent = "";
  clearCellIcon(cell);
  if (typeof clearBrokenResourceSmoke === "function") {
    clearBrokenResourceSmoke(cell);
  }
  const trollToken = cell.querySelector(".troll-token");
  if (trollToken) trollToken.remove();
  cell.style.background = "";
  cell.style.borderColor = "";
  cell.style.color = "";
  cell.removeAttribute("data-barbarian");
  cell.removeAttribute("title");
}

function renderStandardResourceCell(entry) {
  const key = entry.key || `${entry.x},${entry.y}`;
  const cell = grid[key];
  if (!cell) return;
  const typeKey = entry.typeKey || entry.type?.key;
  const iconDef = RESOURCE_ICONS[typeKey];
  cell.classList.remove("inactive");
  cell.classList.add("resource", "important");
  cell.textContent = "";
  if (iconDef) {
    const icon = setCellIcon(cell, iconDef.file, iconDef.alt);
    if (icon) icon.classList.add("resource-icon");
  }
}

function renderUpperSpecialCell(entry) {
  const cell = grid[entry.key];
  if (!cell) return;
  cell.classList.remove("inactive");
  cell.classList.add("important", "special");
  if (entry.extraClass) cell.classList.add(entry.extraClass);
  cell.textContent = entry.label || "";
  clearCellIcon(cell);
  cell.classList.remove("resource-disabled");
  if (entry.disabled) {
    cell.classList.add("resource-disabled");
  }
  if (entry.extraClass === "mage") {
    setCellIcon(cell, "mage.png", "Маг");
  }
  if (entry.extraClass === "portal") {
    cell.textContent = "";
    setCellIcon(cell, "portal.png", "Портал");
  }
  if (entry.extraClass === "troll-cave") {
    cell.textContent = "";
    setCellIcon(cell, "troll_cave.png", "Пещера троллей");
  }
  if (
    entry.featureKey &&
    typeof applySpecialFeatureIcon === "function" &&
    (entry.featureKey === "lumber" || entry.featureKey === "mine" || entry.featureKey === "clay")
  ) {
    applySpecialFeatureIcon(entry.x, entry.y, entry.featureKey);
  }
  if (typeof syncBrokenResourceSmoke === "function") {
    syncBrokenResourceSmoke(
      cell,
      Boolean(entry.disabled && ["lumber", "mine", "clay"].includes(entry.featureKey))
    );
  }
}

function renderUpperWorldView() {
  Object.keys(grid).forEach(key => {
    if (nodeByPos[key]) {
      restoreImportantNodeCell(key, grid[key]);
    } else {
      resetCellForVisibleRender(key);
      if (isMovementBlockedKey(key)) {
        grid[key].classList.add("blocked");
      } else {
        grid[key].classList.remove("blocked");
      }
    }
  });
  Object.values(resourceByPos).forEach(renderStandardResourceCell);
  Object.values(specialByPos).forEach(renderUpperSpecialCell);
  if (upperWormhole) {
    const cell = grid[upperWormhole.key];
    if (cell) {
      cell.classList.remove("inactive");
      cell.classList.add("important", "special", "wormhole");
      cell.textContent = "";
      setCellIcon(cell, WORMHOLE_ICON.file, WORMHOLE_ICON.alt);
    }
  }
  if (treasure?.key) {
    const cell = grid[treasure.key];
    if (cell) {
      cell.classList.remove("inactive");
      cell.classList.add("treasure", "important");
      cell.textContent = "";
      setCellIcon(cell, "treasure.png", "Сокровище");
    }
  }
  if (flowerArtifact?.key) {
    const cell = grid[flowerArtifact.key];
    if (cell) {
      cell.classList.remove("inactive");
      cell.classList.add("flower", "important");
      cell.textContent = "";
      setCellIcon(cell, FLOWER_ICON.file, FLOWER_ICON.alt);
    }
  }
  if (cloverArtifact?.key) {
    const cell = grid[cloverArtifact.key];
    if (cell) {
      cell.classList.remove("inactive");
      cell.classList.add("clover", "important");
      cell.textContent = "";
      setCellIcon(cell, "clover.png", "Клевер");
    }
  }
  Object.values(stoneByPos).forEach(entry => {
    const cell = grid[entry.key];
    if (!cell) return;
    cell.classList.remove("inactive");
    cell.classList.add("stone", "important");
    cell.textContent = "";
    setCellIcon(cell, "stone.png", "Камень");
  });
  Object.values(rainbowByPos).forEach(entry => {
    const cell = grid[entry.key];
    if (!cell) return;
    cell.classList.remove("inactive");
    cell.classList.add("rainbow-stone", "important");
    cell.textContent = "";
    setCellIcon(cell, "rainbow_stone.png", "Радужный камень");
  });
  if (typeof voidShardByPos !== "undefined") {
    Object.values(voidShardByPos).forEach(entry => {
      const cell = grid[entry.key];
      if (!cell) return;
      cell.classList.remove("inactive");
      cell.classList.add("void-shard", "important");
      cell.textContent = "";
      setCellIcon(cell, "void_shard.png", "Осколок пустоты");
    });
  }
  if (masterActive) {
    const cell = grid[MASTER_CELL.key];
    if (cell) {
      cell.classList.remove("inactive");
      cell.classList.add("master", "important");
      cell.textContent = "";
      setCellIcon(cell, "grand_master.png", "Великий мастер");
    }
  }
  barbarianCells.forEach(entry => {
    const cell = grid[entry.key];
    if (!cell) return;
    cell.classList.remove("inactive");
    cell.classList.add("important", "barbarian");
    cell.textContent = "";
    let displayArmy = entry.army;
    if (getTimeOfDay().key === "night") displayArmy = Math.ceil(entry.army * 1.5);
    else if (getTimeOfDay().key === "morning") displayArmy = Math.ceil(entry.army * 0.7);
    cell.title = `ВАРВАРЫ: ${displayArmy} войск`;
    cell.setAttribute("data-barbarian", "true");
    setCellIcon(cell, "barbarian_village.png", "Варвары");
  });
  mercenaries.forEach(entry => setCellToMercenary(entry.x, entry.y));
  thieves.forEach(entry => setCellToThief(entry.x, entry.y));
  cutthroats.forEach(entry => setCellToCutthroat(entry.x, entry.y));
  messengers.forEach(entry => setCellToMessenger(entry.x, entry.y));
  caravans.forEach(entry => setCellToCaravan(entry.x, entry.y));
  if (werewolfState) {
    setCellToWerewolf(werewolfState.x, werewolfState.y);
  }
  if (typeof updateTrollVisual === "function") {
    trollState.prevKey = null;
    updateTrollVisual();
  }
  if (typeof renderTrapStunFields === "function") {
    renderTrapStunFields();
  }
  bridgeOpenedKeys.forEach(key => {
    const cell = grid[key];
    if (!cell) return;
    cell.classList.remove("inactive", "blocked");
    cell.classList.add("stairs");
    cell.textContent = "";
    setCellIcon(cell, STAIRS_ICON.file, STAIRS_ICON.alt);
  });
}

function renderUnderworldView(playerIndex) {
  Object.keys(grid).forEach(key => {
    resetCellForVisibleRender(key);
    grid[key].classList.remove("blocked");
  });
  const state = getPlayerUnderworldState(playerIndex);
  if (!state) return;
  Object.values(state.resourcesByPos || {}).forEach(renderStandardResourceCell);
  if (state.stairs?.key) {
    const cell = grid[state.stairs.key];
    if (cell) {
      cell.classList.remove("inactive");
      cell.classList.add("important", "special", "stairs");
      cell.textContent = "";
      setCellIcon(cell, STAIRS_ICON.file, STAIRS_ICON.alt);
    }
  }
  if (state.bridgeExitKey) {
    const cell = grid[state.bridgeExitKey];
    if (cell) {
      cell.classList.remove("inactive");
      cell.classList.add("important", "special", "stairs");
      cell.textContent = "";
      setCellIcon(cell, STAIRS_ICON.file, STAIRS_ICON.alt);
    }
  }
}

function renderTrollCaveView() {
  Object.entries(grid).forEach(([key, cell]) => {
    const [x, y] = key.split(",").map(Number);
    resetCellForVisibleRender(key);
    if (!isInsideTrollCaveBounds(x, y)) {
      cell.classList.add("world-cell-hidden");
      return;
    }
    cell.classList.remove("inactive");
    cell.classList.add("troll-cave-numbered");
    cell.classList.toggle("blocked", TROLL_CAVE_BLOCKED_KEYS.has(key));
    cell.removeAttribute("title");
  });

  TROLL_CAVE_ENTRANCE_CELL_NUMBERS.forEach((numbers, caveIndex) => {
    numbers.forEach(number => {
      const key = getTrollCaveCellKeyByNumber(number);
      const cell = grid[key];
      if (!cell) return;
      cell.classList.remove("blocked");
      cell.classList.add("important", "special", "troll-cave-entrance");
      cell.title = `Клетка №${number} · вход ${caveIndex + 1}`;
    });
  });

  const pitKey = getTrollCaveCellKeyByNumber(TROLL_CAVE_PIT_CELL_NUMBER);
  const pitCell = grid[pitKey];
  if (pitCell && isTrollCavePitActive()) {
    pitCell.classList.remove("blocked");
    pitCell.classList.add("important", "special", "troll-cave-pit");
    setCellIcon(pitCell, "wormhole.png", "Яма в нижний мир");
    pitCell.title = `Клетка №${TROLL_CAVE_PIT_CELL_NUMBER} · яма в нижний мир`;
  }

  Object.values(trollCaveInteriorState?.lootByPos || {}).forEach(entry => {
    const cell = grid[entry.key];
    const definition = TROLL_CAVE_LOOT_DEFS[entry.typeKey];
    if (!cell || !definition) return;
    const isResource = TROLL_CAVE_RESOURCE_LOOT_TYPES.has(entry.typeKey);
    cell.classList.add("important", "troll-cave-loot");
    if (isResource) cell.classList.add("resource");
    if (entry.typeKey === "rainbow") cell.classList.add("rainbow-stone");
    if (entry.typeKey === "flower") cell.classList.add("flower");
    const icon = setCellIcon(cell, definition.icon, definition.label);
    if (isResource && icon) icon.classList.add("resource-icon");
    if (isResource) {
      const amountLabel = document.createElement("span");
      amountLabel.className = "troll-cave-loot-amount";
      amountLabel.textContent = `+${getTrollCaveLootEffectiveAmount(entry)}`;
      cell.appendChild(amountLabel);
    }
    cell.removeAttribute("title");
  });

  if (trollState?.active && typeof isTrollInCave === "function" && isTrollInCave() && trollState.interiorKey) {
    const trollCell = grid[trollState.interiorKey];
    if (trollCell) {
      trollCell.classList.add("important", "troll-cave-troll");
      const token = document.createElement("img");
      token.className = "troll-token troll-cave-token";
      token.src = "assets/icons/troll.png";
      token.alt = "Тролль";
      trollCell.appendChild(token);
      trollCell.title = `Тролль · клетка ${getTrollCaveCellNumber(trollState.interiorX, trollState.interiorY)}`;
    }
  }
}

function clearRenderedWormholes() {
  Object.values(grid).forEach(cell => {
    if (!cell || !cell.classList.contains("wormhole")) return;
    cell.classList.remove("wormhole", "special", "important");
    clearCellIcon(cell);
    if (!cell.classList.contains("inactive") && !nodeByPos[cell.dataset.key || ""]) {
      cell.classList.add("inactive");
    }
  });
}

function refreshVisibleWorld() {
  if (!game) return;
  clearRenderedWormholes();
  const viewerIndex = getViewerWorldPlayerIndex();
  const visibleLayer = getVisibleWorldLayer();
  const layerChanged = lastVisibleWorldLayoutLayer !== visibleLayer;
  lastVisibleWorldLayoutLayer = visibleLayer;
  game.classList.toggle("troll-cave-world", visibleLayer === WORLD_LAYER_TROLL_CAVE);
  if (layerChanged && typeof relayout === "function") {
    relayout();
  } else {
    applyCellSize(cellSize);
  }
  if (visibleLayer === WORLD_LAYER_UNDER && players[viewerIndex]?.layer === WORLD_LAYER_UNDER) {
    game.style.backgroundImage = UNDERWORLD_BG;
    renderUnderworldView(viewerIndex);
  } else if (visibleLayer === WORLD_LAYER_TROLL_CAVE) {
    game.style.backgroundImage = TROLL_CAVE_INTERIOR_BG;
    renderTrollCaveView();
  } else {
    game.style.backgroundImage = getUpperWorldBackground();
    renderUpperWorldView();
  }
  applyFogOfWarMask();
  clearReachable();
  if (ballistaModePlayerIndex === currentPlayerIndex) {
    showBallistaRange(ballistaModePlayerIndex);
  } else if (harpoonModePlayerIndex === currentPlayerIndex) {
    showHarpoonTargets(harpoonModePlayerIndex);
  } else if (voidShardModePlayerIndex === currentPlayerIndex) {
    showVoidShardTargets(voidShardModePlayerIndex);
  } else if (movesRemaining > 0) {
    showReachable();
  }
  updatePawns();
}

function enterUnderworld(playerIndex, options = {}) {
  const player = players[playerIndex];
  if (!player) return false;
  if (options.consumeUpperWormhole !== false) {
    upperWormhole = null;
  }
  player.layer = WORLD_LAYER_UNDER;
  player.underworldState = createUnderworldStateForPlayer(playerIndex);
  refreshVisibleWorld();
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  if (
    options.consumeUpperWormhole !== false &&
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted &&
    typeof isHost !== "undefined" &&
    isHost &&
    typeof emitPrivateUiToPlayer === "function"
  ) {
    players.forEach((_, index) => {
      if (index === playerIndex) return;
      emitPrivateUiToPlayer(index, "clearWormholeVisual", {});
    });
  }
  showPrivatePickupToastForPlayer(
    playerIndex,
    options.sourceLabel || "Червоточина утащила вас на нижний уровень."
  );
  return true;
}

function exitUnderworld(playerIndex) {
  const player = players[playerIndex];
  if (!player) return false;
  player.layer = WORLD_LAYER_UPPER;
  player.underworldState = null;
  refreshVisibleWorld();
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  showPrivatePickupToastForPlayer(playerIndex, "Вы поднялись по лестнице.");
  return true;
}

function applyPotion(playerIndex, type) {
  const player = players[playerIndex];
  if (!player) return;
  if (type === "ballista") {
    if (playerIndex !== currentPlayerIndex) return;
    if (ballistaShotInFlight) return;
    if ((player.ballistaCount || 0) <= 0) return;
    const allowedShots = getPlayerBallistaLevel(player) >= 2 ? 2 : 1;
    if ((player.ballistaShotsThisTurn || 0) >= allowedShots) return;
    if ((player.boltCount || 0) <= 0) {
      showPrivatePickupToastForPlayer(playerIndex, "Нет болтов для баллисты.");
      return;
    }
    ballistaModePlayerIndex = playerIndex;
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "activateBallistaMode", { playerIndex });
    } else {
      showBallistaRange(playerIndex);
    }
    showPrivatePickupToastForPlayer(playerIndex, "Режим баллисты активирован. Выберите цель.");
    updateInventory(playerIndex);
    return;
  }
  if (type === "harpoon") {
    if (playerIndex !== currentPlayerIndex || harpoonAnimationInFlight) return;
    if ((player.harpoonCount || 0) <= 0) return;
    if (movesRemaining <= 0) {
      showPrivatePickupToastForPlayer(playerIndex, "Сначала бросьте кубики: горпун применяется во время перемещения.");
      return;
    }
    if (getHarpoonTargetKeys(playerIndex).length === 0) {
      showPrivatePickupToastForPlayer(playerIndex, "В радиусе 12 клеток нет доступной добычи для горпуна.");
      return;
    }
    harpoonModePlayerIndex = playerIndex;
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "activateHarpoonMode", { playerIndex });
    } else {
      showHarpoonTargets(playerIndex);
    }
    showPrivatePickupToastForPlayer(playerIndex, "Горпун готов. Выберите подсвеченную добычу в радиусе 12 клеток.");
    updateInventory(playerIndex);
    return;
  }
  if (type === "potion-invis") {
    if ((player.invisPotionCount || 0) <= 0) return;
    if ((player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE) {
      showPrivatePickupToastForPlayer(playerIndex, "Зелье невидимости не действует в пещере троллей.");
      return;
    }
    player.invisPotionCount -= 1;
    player.invisTurnsRemaining = Math.max(player.invisTurnsRemaining || 0, POTION_INVIS_TURNS);
    showPickupToast("Зелье невидимости: тролли не атакуют 25 ходов.");
  }
  if (type === "potion-luck") {
    if ((player.luckPotionCount || 0) <= 0) return;
    player.luckPotionCount -= 1;
    player.luckTurnsRemaining = Math.max(player.luckTurnsRemaining || 0, POTION_LUCK_TURNS);
    showPickupToast("Зелье удачи: +1.6 к ресурсам на 25 ходов.");
  }
  if (type === "potion-invuln") {
    if ((player.invulnPotionCount || 0) <= 0) return;
    player.invulnPotionCount -= 1;
    player.invulnTurnsRemaining = 15;
    showPickupToast("Зелье неприкосновенности: противник и головорезы не атакуют 15 ходов.");
  }
  if (type === "clover") {
    if ((player.cloverCount || 0) <= 0) return;
    player.cloverCount -= 1;
    player.luckTurnsRemaining = Math.max(player.luckTurnsRemaining || 0, CLOVER_LUCK_TURNS);
    showPrivatePickupToastForPlayer(playerIndex, "Клевер применён: Удача +1.6 к ресурсам на 18 ходов.");
  }
  if (type === "void-shard") {
    activateVoidShardMode(playerIndex);
    return;
  }
  if (type === "trap-stun") {
    placeTrapStun(playerIndex);
    return;
  }
  if (type === "bridge") {
    activateBridgeMode(playerIndex);
    return;
  }
  if (type === "fog-of-war") {
    if (isFogOfWarActive()) {
      showPrivatePickupToastForPlayer(playerIndex, "Туман войны уже активен.");
      return;
    }
    player.fogOfWarCount = Math.max(0, (player.fogOfWarCount || 0) - 1);
    announceFogOfWarEvent();
    fogOfWarState = { duration: 20, expiresAtTurn: turnCounter + 19 };
    applyFogOfWarMask();
    showPrivatePickupToastForPlayer(playerIndex, "Туман войны активирован на 20 ходов.");
    updatePlayerResources(playerIndex);
    updateInventory(playerIndex);
    return;
  }
  updatePlayerResources(playerIndex);
  updateInventory(playerIndex);
}

function isMovementBlockedKey(key) {
  return blockedCellKeys.has(key) && !bridgeOpenedKeys.has(key);
}

function updateBlockedCellVisual(key) {
  const cell = grid[key];
  if (!cell) return;
  if (isMovementBlockedKey(key)) {
    cell.classList.add("blocked");
  } else {
    cell.classList.remove("blocked");
  }
}

function getBridgeEligibleKeys(playerIndex) {
  const player = players[playerIndex];
  if (!player) return [];
  const keys = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) continue;
      const x = player.x + dx;
      const y = player.y + dy;
      if (x < 0 || x >= COLS || y < 0 || y >= ROWS) continue;
      const key = `${x},${y}`;
      if ((player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER) {
        const occupiedByPlayer = players.some((other, index) => {
          if (!other || index === playerIndex) return false;
          return (other.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER && other.x === x && other.y === y;
        });
        if (occupiedByPlayer) continue;
        keys.push(key);
        continue;
      }
      if (!blockedCellKeys.has(key) || bridgeOpenedKeys.has(key)) continue;
      keys.push(key);
    }
  }
  return keys;
}

function showBridgeTargets(playerIndex) {
  const revealCells = shouldRevealReachableCells();
  getBridgeEligibleKeys(playerIndex).forEach(key => {
    reachableKeys.add(key);
    if (revealCells) {
      const cell = grid[key];
      if (cell) cell.classList.add("reachable");
    }
  });
}

function getVoidShardEligibleKeys(playerIndex) {
  const player = players[playerIndex];
  if (!player) return [];
  const layer = player.layer || WORLD_LAYER_UPPER;
  if (layer === WORLD_LAYER_UNDER) {
    const state = player.underworldState;
    if (!state) return [];
    const occupiedByPlayers = new Set(
      players
        .filter(Boolean)
        .filter(other => (other.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER)
        .map(other => `${other.x},${other.y}`)
    );
    const blockedKeys = new Set();
    if (state.stairs?.key) blockedKeys.add(state.stairs.key);
    if (state.bridgeExitKey) blockedKeys.add(state.bridgeExitKey);
    Object.keys(state.resourcesByPos || {}).forEach(key => blockedKeys.add(key));
    return Object.keys(grid).filter(key => {
      if (occupiedByPlayers.has(key)) return false;
      if (blockedKeys.has(key)) return false;
      const cell = grid[key];
      return Boolean(cell) && cell.classList.contains("inactive");
    });
  }

  const occupiedByPlayers = new Set(
    players
      .filter(Boolean)
      .filter(other => (other.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER)
      .map(other => `${other.x},${other.y}`)
  );
  return Object.keys(grid).filter(key => {
    if (nodeByPos[key]) return false;
    if (resourceByPos[key]) return false;
    if (specialByPos[key]) return false;
    if (stoneByPos[key]) return false;
    if (rainbowByPos[key]) return false;
    if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) return false;
    if (treasure?.key === key) return false;
    if (flowerArtifact?.key === key) return false;
    if (cloverArtifact?.key === key) return false;
    if (masterActive && key === MASTER_CELL.key) return false;
    if (barbarianCells.some(cell => cell.key === key)) return false;
    if (typeof mercenaries !== "undefined" && mercenaries.some(entry => entry.key === key)) return false;
    if (typeof thieves !== "undefined" && thieves.some(entry => entry.key === key)) return false;
    if (typeof cutthroats !== "undefined" && cutthroats.some(entry => entry.key === key)) return false;
    if (typeof trollState !== "undefined" && trollState?.active && trollState.key === key) return false;
    if (bridgeOpenedKeys.has(key)) return false;
    if (occupiedByPlayers.has(key)) return false;
    if (isMovementBlockedKey(key)) return false;
    if (isFogOfWarActive() && !isUpperWorldKeyVisibleToPlayer(key, playerIndex)) return false;
    const cell = grid[key];
    return Boolean(cell) && cell.classList.contains("inactive");
  });
}

function showVoidShardTargets(playerIndex) {
  const revealCells = shouldRevealReachableCells();
  getVoidShardEligibleKeys(playerIndex).forEach(key => {
    reachableKeys.add(key);
    if (revealCells) {
      const cell = grid[key];
      if (cell) cell.classList.add("reachable");
    }
  });
}

function activateVoidShardMode(playerIndex) {
  const player = players[playerIndex];
  if (!player || playerIndex !== currentPlayerIndex) return false;
  if ((player.voidShardCount || 0) <= 0) return false;
  if (!getVoidShardEligibleKeys(playerIndex).length) {
    showPrivatePickupToastForPlayer(playerIndex, "Нет пустых клеток для прыжка осколком пустоты.");
    return false;
  }
  voidShardModePlayerIndex = playerIndex;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "activateVoidShardMode", { playerIndex });
  } else {
    clearReachable();
    showVoidShardTargets(playerIndex);
  }
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Осколок пустоты активирован. Выберите пустую клетку для перемещения.");
  return true;
}

function cancelVoidShardMode(playerIndex) {
  if (voidShardModePlayerIndex !== playerIndex) return;
  voidShardModePlayerIndex = null;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "clearVoidShardMode", { playerIndex });
  } else {
    clearReachable();
    showReachable();
  }
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Осколок пустоты отменён.");
}

function tryApplyVoidShardToCell(playerIndex, key) {
  const player = players[playerIndex];
  if (!player || voidShardModePlayerIndex !== playerIndex) return false;
  if ((player.voidShardCount || 0) <= 0) {
    cancelVoidShardMode(playerIndex);
    return true;
  }
  if (!getVoidShardEligibleKeys(playerIndex).includes(key)) {
    showPrivatePickupToastForPlayer(playerIndex, "Можно выбрать только пустую клетку без событий и модалок.");
    return true;
  }
  const [x, y] = key.split(",").map(Number);
  player.voidShardCount -= 1;
  voidShardModePlayerIndex = null;
  player.x = x;
  player.y = y;
  movesRemaining = 0;
  clearReachable();
  refreshVisibleWorld();
  updatePawns();
  updatePlayerResources(playerIndex);
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Осколок пустоты перенёс вас в выбранную клетку. Ход завершён.");
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "clearVoidShardMode", { playerIndex });
  }
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  endTurn();
  return true;
}

function activateBridgeMode(playerIndex) {
  const player = players[playerIndex];
  if (!player || playerIndex !== currentPlayerIndex) return false;
  if ((player.bridgeCount || 0) <= 0) return false;
  if (!getBridgeEligibleKeys(playerIndex).length) {
    showPrivatePickupToastForPlayer(playerIndex, "Рядом нет заблокированной клетки для моста.");
    return false;
  }
  bridgeModePlayerIndex = playerIndex;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "activateBridgeMode", { playerIndex });
  } else {
    clearReachable();
    showReachable();
  }
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Режим моста активирован. Выберите соседнюю заблокированную клетку.");
  return true;
}

function cancelBridgeMode(playerIndex) {
  if (bridgeModePlayerIndex !== playerIndex) return;
  bridgeModePlayerIndex = null;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "clearBridgeMode", { playerIndex });
  } else {
    clearReachable();
    showReachable();
  }
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Режим моста отменен.");
}

function tryApplyBridgeToCell(playerIndex, key) {
  const player = players[playerIndex];
  if (!player || bridgeModePlayerIndex !== playerIndex) return false;
  if ((player.bridgeCount || 0) <= 0) {
    cancelBridgeMode(playerIndex);
    return true;
  }
  if (!getBridgeEligibleKeys(playerIndex).includes(key)) {
    showPrivatePickupToastForPlayer(playerIndex, "Можно открыть только соседнюю заблокированную клетку.");
    return true;
  }
  player.bridgeCount -= 1;
  if ((player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER) {
    player.underworldState = player.underworldState || createUnderworldStateForPlayer(playerIndex);
    player.underworldState.bridgeExitKey = key;
  } else {
    bridgeOpenedKeys.add(key);
  }
  bridgeModePlayerIndex = null;
  updatePlayerResources(playerIndex);
  updateInventory(playerIndex);
  refreshVisibleWorld();
  updateBlockedCellVisual(key);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "clearBridgeMode", { playerIndex });
  }
  showPrivatePickupToastForPlayer(playerIndex, "Мост установлен. Проход открыт для обоих игроков.");
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  return true;
}

function getSpecialArtifactSlotUsage(player) {
  if (!player) return 0;
  return (player.rainbowStoneCount || 0) + (player.flowerCount || 0) + (player.voidShardCount || 0);
}

function hasFreeSpecialArtifactSlot(player) {
  return getSpecialArtifactSlotUsage(player) < SPECIAL_ARTIFACT_SLOT_LIMIT;
}

function isVoidShardModeActive() {
  return typeof voidShardModePlayerIndex === "number";
}

function tryAddSpecialArtifactToInventory(player, type) {
  if (!player || !hasFreeSpecialArtifactSlot(player)) return false;
  if (type === "rainbow") {
    player.rainbowStoneCount = (player.rainbowStoneCount || 0) + 1;
    return true;
  }
  if (type === "flower") {
    player.flowerCount = (player.flowerCount || 0) + 1;
    return true;
  }
  if (type === "void-shard") {
    player.voidShardCount = (player.voidShardCount || 0) + 1;
    return true;
  }
  return false;
}

function getTrapStunKeysForPlayer(playerIndex) {
  const player = players[playerIndex];
  if (!player) return [];
  const anchorX = player.x;
  const anchorY = player.y;
  return [
    `${anchorX},${anchorY}`,
    `${anchorX - 1},${anchorY}`,
    `${anchorX},${anchorY - 1}`,
    `${anchorX - 1},${anchorY - 1}`
  ];
}

function isTrapStunPlacementForbidden(key) {
  const [x, y] = key.split(",").map(Number);
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
  if (blockedCellKeys.has(key)) return true;
  if (nodeByPos[key]) return true;
  if (typeof getCastleBaseKeyForPos === "function" && getCastleBaseKeyForPos(x, y)) return true;
  if (typeof getDragonBaseKeyForPos === "function" && getDragonBaseKeyForPos(x, y)) return true;
  if (typeof MASTER_CELL !== "undefined" && key === MASTER_CELL.key) return true;
  if (typeof MAGE_POSITIONS !== "undefined" && Array.isArray(MAGE_POSITIONS) && MAGE_POSITIONS.some(pos => `${pos.x},${pos.y}` === key)) return true;
  return false;
}

function placeTrapStun(playerIndex) {
  const player = players[playerIndex];
  if (!player) return false;
  if ((player.trapStunCount || 0) <= 0) return false;
  const trapKeys = getTrapStunKeysForPlayer(playerIndex);
  if (trapKeys.some(isTrapStunPlacementForbidden)) {
    showPickupToast("Здесь нельзя поставить ловушку-стан.");
    return false;
  }
  const occupiedByEnemy = players.some((other, index) => {
    if (!other || index === playerIndex) return false;
    return trapKeys.includes(`${other.x},${other.y}`);
  });
  if (occupiedByEnemy) {
    showPickupToast("Рядом слишком близко враг для установки ловушки.");
    return false;
  }
  const duplicate = trapStunFields.some(field => field.ownerIndex === playerIndex && trapKeys.some(key => field.keys.includes(key)));
  if (duplicate) {
    showPickupToast("Здесь уже стоит ваша ловушка.");
    return false;
  }
  player.trapStunCount -= 1;
  trapStunFields.push({
    id: trapStunIdCounter++,
    ownerIndex: playerIndex,
    anchorKey: `${player.x},${player.y}`,
    keys: trapKeys.slice()
  });
  renderTrapStunFields();
  updatePlayerResources(playerIndex);
  updateInventory(playerIndex);
  showPickupToast("Ловушка-стан установлена.");
  return true;
}

function cancelBallistaMode(playerIndex) {
  if (ballistaModePlayerIndex !== playerIndex) return;
  ballistaModePlayerIndex = null;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "clearBallistaMode", { playerIndex });
  } else {
    clearReachable();
    showReachable();
  }
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Режим баллисты отменен.");
}

function tryBallistaShot(gridX, gridY) {
  if (ballistaShotInFlight) return true;
  if (ballistaModePlayerIndex === null) return false;
  if (ballistaModePlayerIndex !== currentPlayerIndex) return false;
  const attacker = players[ballistaModePlayerIndex];
  if (!attacker) return true;
  const targetIndex = players.findIndex(
    (p, idx) => idx !== ballistaModePlayerIndex && p.x === gridX && p.y === gridY
  );
  if (targetIndex === -1) {
    showPrivatePickupToastForPlayer(ballistaModePlayerIndex, "Выберите игрока для выстрела.");
    return true;
  }
  const dist = Math.abs(attacker.x - gridX) + Math.abs(attacker.y - gridY);
  if (dist > BALLISTA_RANGE) {
    showPrivatePickupToastForPlayer(ballistaModePlayerIndex, "Цель слишком далеко для баллисты.");
    return true;
  }
  if ((attacker.boltCount || 0) <= 0) {
    showPrivatePickupToastForPlayer(ballistaModePlayerIndex, "Нет болтов для баллисты.");
    cancelBallistaMode(ballistaModePlayerIndex);
    return true;
  }
  const target = players[targetIndex];
  if ((target.invulnTurnsRemaining || 0) > 0) {
    showPrivatePickupToastForPlayer(ballistaModePlayerIndex, "На игрока действует неприкосновенность — выстрел невозможен.");
    return true;
  }
  if (isTavernSafeCell(`${target.x},${target.y}`, target.layer || WORLD_LAYER_UPPER)) {
    showPrivatePickupToastForPlayer(ballistaModePlayerIndex, "Таверна — безопасная зона. Стрелять по игрокам внутри нельзя.");
    return true;
  }
  const shooterIndex = ballistaModePlayerIndex;
  const ballistaLevel = getPlayerBallistaLevel(attacker);
  const damage = Math.floor(Math.random() * (BALLISTA_DAMAGE_MAX - BALLISTA_DAMAGE_MIN + 1)) + BALLISTA_DAMAGE_MIN;
  const beforeArmy = Math.max(0, target.pocket.army || 0);
  const killed = Math.min(beforeArmy, damage);

  ballistaModePlayerIndex = null;
  if (shouldDelegatePrivateUiToPlayer(shooterIndex)) {
    emitPrivateUiToPlayer(shooterIndex, "clearBallistaMode", { playerIndex: shooterIndex });
  } else {
    clearReachable();
    showReachable();
  }

  const fromCX = attacker.x * cellSize + cellSize / 2;
  const fromCY = attacker.y * cellSize + cellSize / 2;
  const toCX = target.x * cellSize + cellSize / 2;
  const toCY = target.y * cellSize + cellSize / 2;

  if (typeof socket !== "undefined" && socket && typeof onlineMatchStarted !== "undefined" && onlineMatchStarted) {
    const nonHostIndex = typeof localPlayerIndex === "number" ? (localPlayerIndex === 0 ? 1 : 0) : 1;
    if (players[nonHostIndex] && typeof emitPrivateUiToPlayer === "function") {
      emitPrivateUiToPlayer(nonHostIndex, "animateBallistaBolt", {
        fromX: fromCX, fromY: fromCY, toX: toCX, toY: toCY
      });
    }
  }

  ballistaShotInFlight = true;
  animateBallistaBolt(fromCX, fromCY, toCX, toCY, () => {
    ballistaShotInFlight = false;
    target.pocket.army = beforeArmy - killed;
    attacker.boltCount -= 1;
    attacker.ballistaShotsThisTurn = Math.max(0, Number(attacker.ballistaShotsThisTurn) || 0) + 1;
    const keepsTurn = ballistaLevel >= 2 && attacker.ballistaShotsThisTurn < 2;
    updatePlayerResources(shooterIndex);
    updatePlayerResources(targetIndex);
    updateInventory(shooterIndex);
    showPrivatePickupToastForPlayer(
      shooterIndex,
      keepsTurn
        ? `Баллиста II: -${killed} войск. Ход сохранён: переместитесь или выстрелите ещё раз.`
        : `${ballistaLevel >= 2 ? "Баллиста II" : "Баллиста"}: -${killed} войск в кармане противника.`
    );
    showDamageToast(`-${killed}`);
    if (keepsTurn) {
      refreshTurnControls();
      if (typeof emitStateNow === "function") emitStateNow(true);
    } else {
      endTurn();
    }
  });

  return true;
}

function animateBallistaBolt(fromX, fromY, toX, toY, onComplete) {
  const bolt = document.createElement("img");
  bolt.src = "assets/icons/ballista_bolt.png";
  bolt.className = "ballista-bolt-projectile";

  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  bolt.style.left = fromX + "px";
  bolt.style.top = fromY + "px";
  bolt.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;

  game.appendChild(bolt);

  bolt.offsetWidth;

  bolt.style.left = toX + "px";
  bolt.style.top = toY + "px";

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    bolt.removeEventListener("transitionend", onEnd);
    if (bolt.parentNode) bolt.remove();
    if (onComplete) onComplete();
  };

  const onEnd = () => finish();
  bolt.addEventListener("transitionend", onEnd);
  setTimeout(finish, 500);
}

function getHarpoonTargetAtKey(key) {
  const resourceNode = resourceByPos[key];
  const resourceTypeKey = resourceNode?.type?.key || resourceNode?.typeKey;
  if (resourceNode && ["gold", "army", "resources"].includes(resourceTypeKey)) {
    const iconDef = RESOURCE_ICONS[resourceTypeKey];
    return {
      key,
      kind: "resource",
      iconSrc: `assets/icons/${iconDef?.file || "resources.png"}`
    };
  }
  const caveLoot = trollCaveInteriorState?.lootByPos?.[key];
  if (caveLoot) {
    const def = TROLL_CAVE_LOOT_DEFS[caveLoot.typeKey];
    if (def) {
      return { key, kind: caveLoot.typeKey, iconSrc: `assets/icons/${def.icon}` };
    }
  }
  if (flowerArtifact?.key === key) {
    return { key, kind: "flower", iconSrc: "assets/icons/mystic_flower.png" };
  }
  if (cloverArtifact?.key === key) {
    return { key, kind: "clover", iconSrc: "assets/icons/clover.png" };
  }
  if (rainbowByPos[key]) {
    return { key, kind: "rainbow", iconSrc: "assets/icons/rainbow_stone.png" };
  }
  if (stoneByPos[key]) {
    return { key, kind: "stone", iconSrc: "assets/icons/stone.png" };
  }
  return null;
}

function isHarpoonTargetInRange(playerIndex, key) {
  const player = players[playerIndex];
  if (!player) return false;
  const [x, y] = String(key).split(",").map(Number);
  if (!Number.isInteger(x) || !Number.isInteger(y)) return false;
  const distance = Math.abs(player.x - x) + Math.abs(player.y - y);
  if (distance === 0 || distance > HARPOON_RANGE) return false;
  if (typeof isUpperWorldKeyVisibleToPlayer === "function" && !isUpperWorldKeyVisibleToPlayer(key, playerIndex)) {
    return false;
  }
  return Boolean(getHarpoonTargetAtKey(key));
}

function getHarpoonTargetKeys(playerIndex) {
  return Object.keys(grid).filter(key => isHarpoonTargetInRange(playerIndex, key));
}

function showHarpoonTargets(playerIndex = currentPlayerIndex) {
  clearReachable();
  if (harpoonModePlayerIndex !== playerIndex) return;
  getHarpoonTargetKeys(playerIndex).forEach(key => {
    const cell = grid[key];
    if (!cell) return;
    cell.classList.add("reachable", "harpoon-target");
    reachableKeys.add(key);
  });
}

function cancelHarpoonMode(playerIndex) {
  if (harpoonModePlayerIndex !== playerIndex || harpoonAnimationInFlight) return;
  harpoonModePlayerIndex = null;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "clearHarpoonMode", { playerIndex });
  } else {
    clearReachable();
    showReachable();
  }
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, "Режим горпуна отменён.");
}

function collectHarpoonTarget(playerIndex, target) {
  const player = players[playerIndex];
  if (!player || !target || !getHarpoonTargetAtKey(target.key)) {
    showPrivatePickupToastForPlayer(playerIndex, "Добыча для горпуна уже исчезла.");
    return false;
  }
  const key = target.key;
  let message = "";

  if (target.kind === "resource") {
    const resourceNode = resourceByPos[key];
    if (!resourceNode) return false;
    const { type, x, y } = resourceNode;
    if (isDayBuffActive("pickupFail") && Math.random() < 0.3) {
      delete resourceByPos[key];
      setCellToInactive(x, y);
      message = "Выскользнуло из рук";
    } else {
      let pickupMinimum = type.min;
      let pickupMaximum = type.max;
      if (type.key === "army") {
        if (turnCounter >= 225) {
          [pickupMinimum, pickupMaximum] = ARMY_RESOURCE_LATE_GAME_RANGE;
        } else if (turnCounter >= 150) {
          [pickupMinimum, pickupMaximum] = ARMY_RESOURCE_MID_GAME_RANGE;
        }
      }
      let amount = Math.floor(Math.random() * (pickupMaximum - pickupMinimum + 1)) + pickupMinimum;
      if (type.key !== "army") {
        if (turnCounter >= 225) {
          amount = Math.floor(amount * 2.5);
        } else if (turnCounter >= 150) {
          amount = Math.floor(amount * 1.75);
        }
      }
      if (player.luckTurnsRemaining > 0) {
        amount = Math.floor(amount * 1.6);
      } else if ((player.luckAmuletCount || 0) > 0 && Math.random() < 0.25) {
        amount = Math.floor(amount * 1.7);
      }
      player.pocket[type.key] += amount;
      delete resourceByPos[key];
      setCellToInactive(x, y);
      const label = type.key === "gold" ? "золота" : type.key === "army" ? "войск" : "ресурсов";
      message = `Горпун: +${amount} ${label} в карман`;
    }
  } else if (target.kind === "flower") {
    if (!tryAddSpecialArtifactToInventory(player, "flower")) {
      showPrivatePickupToastForPlayer(playerIndex, "Нет свободного слота для таинственного цветка.");
      return false;
    }
    clearFlower();
    message = "Горпун притянул таинственный цветок в инвентарь.";
  } else if (target.kind === "clover") {
    player.cloverCount = (player.cloverCount || 0) + 1;
    clearClover();
    message = "Горпун притянул клевер в инвентарь.";
  } else if (target.kind === "rainbow") {
    if (!tryAddSpecialArtifactToInventory(player, "rainbow")) {
      showPrivatePickupToastForPlayer(playerIndex, "Нет свободного слота для радужного камня.");
      return false;
    }
    clearRainbowStone(key);
    message = "Горпун притянул радужный камень в инвентарь.";
  } else if (target.kind === "stone") {
    player.mysticStoneCount = (player.mysticStoneCount || 0) + 1;
    clearStone(key);
    message = "Горпун притянул необычный камень в инвентарь.";
  } else if (target.kind === "gold" || target.kind === "resources" || target.kind === "army") {
    const caveLoot = trollCaveInteriorState?.lootByPos?.[key];
    if (!caveLoot) return false;
    const amount = typeof getTrollCaveLootEffectiveAmount === "function"
      ? getTrollCaveLootEffectiveAmount(caveLoot)
      : (caveLoot.amount || 0);
    if (caveLoot.typeKey === "gold") {
      player.pocket.gold += amount;
      message = `Горпун: +${amount} золота из пещеры`;
    } else if (caveLoot.typeKey === "resources") {
      player.pocket.resources += amount;
      message = `Горпун: +${amount} ресурсов из пещеры`;
    } else if (caveLoot.typeKey === "army") {
      player.pocket.army += amount;
      message = `Горпун: +${amount} войск из пещеры`;
    }
    delete trollCaveInteriorState.lootByPos[key];
    refreshVisibleWorld();
  } else {
    return false;
  }

  updatePlayerResources(playerIndex);
  updateInventory(playerIndex);
  showPrivatePickupToastForPlayer(playerIndex, message);
  return true;
}

function animateHarpoonPickup(fromX, fromY, toX, toY, iconSrc, onComplete) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const rope = document.createElement("div");
  const hook = document.createElement("img");
  const loot = document.createElement("img");
  rope.className = "harpoon-rope";
  hook.className = "harpoon-projectile";
  loot.className = "harpoon-pulled-loot";
  hook.src = "assets/icons/harpoon.png";
  loot.src = iconSrc || "assets/icons/resources.png";
  rope.style.left = `${fromX}px`;
  rope.style.top = `${fromY}px`;
  rope.style.width = `${distance}px`;
  rope.style.transform = `translateY(-50%) rotate(${angle}deg) scaleX(0)`;
  hook.style.left = `${fromX}px`;
  hook.style.top = `${fromY}px`;
  hook.style.transform = `translate(-50%, -50%) rotate(${angle + 45}deg)`;
  loot.style.left = `${toX}px`;
  loot.style.top = `${toY}px`;
  loot.style.opacity = "0";
  game.append(rope, hook, loot);

  const targetKey = `${Math.floor(toX / cellSize)},${Math.floor(toY / cellSize)}`;
  const targetCell = grid[targetKey];
  const originalIcon = targetCell?.querySelector(".icon");
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (originalIcon) originalIcon.style.visibility = "";
    if (targetCell) targetCell.classList.remove("harpoon-being-pulled");
    rope.remove();
    hook.remove();
    loot.remove();
    if (onComplete) onComplete();
  };

  requestAnimationFrame(() => {
    rope.style.transform = `translateY(-50%) rotate(${angle}deg) scaleX(1)`;
    hook.style.left = `${toX}px`;
    hook.style.top = `${toY}px`;
  });

  setTimeout(() => {
    if (targetCell) targetCell.classList.add("harpoon-being-pulled");
    if (originalIcon) originalIcon.style.visibility = "hidden";
    hook.style.opacity = "0";
    rope.classList.add("retracting");
    rope.style.transform = `translateY(-50%) rotate(${angle}deg) scaleX(0)`;
    loot.style.opacity = "1";
    loot.style.left = `${fromX}px`;
    loot.style.top = `${fromY}px`;
  }, 380);

  setTimeout(finish, 880);
}

function tryUseHarpoonAtCell(playerIndex, gridX, gridY) {
  if (harpoonAnimationInFlight) return true;
  if (harpoonModePlayerIndex !== playerIndex || playerIndex !== currentPlayerIndex) return false;
  const player = players[playerIndex];
  const key = `${gridX},${gridY}`;
  const target = getHarpoonTargetAtKey(key);
  if (!player || (player.harpoonCount || 0) <= 0) {
    cancelHarpoonMode(playerIndex);
    return true;
  }
  if (!target || !isHarpoonTargetInRange(playerIndex, key)) {
    showPrivatePickupToastForPlayer(playerIndex, "Выберите подсвеченную добычу не дальше 12 клеток.");
    return true;
  }
  if ((target.kind === "flower" || target.kind === "rainbow") && !hasFreeSpecialArtifactSlot(player)) {
    showPrivatePickupToastForPlayer(playerIndex, "Для этой добычи нет свободного слота редких артефактов.");
    return true;
  }

  harpoonModePlayerIndex = null;
  harpoonAnimationInFlight = true;
  clearReachable();
  updateInventory(playerIndex);
  refreshTurnControls();
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "clearHarpoonMode", { playerIndex });
  }

  const fromX = player.x * cellSize + cellSize / 2;
  const fromY = player.y * cellSize + cellSize / 2;
  const toX = gridX * cellSize + cellSize / 2;
  const toY = gridY * cellSize + cellSize / 2;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "animateHarpoonPickup", {
      fromGridX: player.x,
      fromGridY: player.y,
      toGridX: gridX,
      toGridY: gridY,
      iconSrc: target.iconSrc
    });
  }
  animateHarpoonPickup(fromX, fromY, toX, toY, target.iconSrc, () => {
    harpoonAnimationInFlight = false;
    collectHarpoonTarget(playerIndex, target);
    showReachable();
    refreshTurnControls();
    if (typeof emitStateNow === "function") emitStateNow(true);
  });
  return true;
}

const ENEMY_POCKET_VISIBILITY_RANGE = 5;
const ENEMY_CASTLE_VISIBILITY_RANGE = 6;
const HIDDEN_STAT_VALUE = "???";

function isMultiplayerVisionMode() {
  return typeof socket !== "undefined" &&
    Boolean(socket) &&
    typeof onlineMatchStarted !== "undefined" &&
    Boolean(onlineMatchStarted) &&
    typeof localPlayerIndex === "number" &&
    localPlayerIndex >= 0;
}

function getViewerPlayerIndex() {
  return isMultiplayerVisionMode() ? localPlayerIndex : null;
}

function getManhattanDistance(ax, ay, bx, by) {
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

function isPlayerBattleValueRevealed(playerIndex) {
  if (!playerBattleRevealState || !Number.isInteger(playerIndex)) return false;
  const viewerIndex = getViewerPlayerIndex();
  if (viewerIndex === null) return true;
  const participants = [
    playerBattleRevealState.attackerIndex,
    playerBattleRevealState.defenderIndex
  ];
  return participants.includes(viewerIndex) && participants.includes(playerIndex);
}

function canSeeEnemyPocket(playerIndex) {
  const viewerIndex = getViewerPlayerIndex();
  if (viewerIndex === null || viewerIndex === playerIndex) return true;
  if (isPlayerBattleValueRevealed(playerIndex)) return true;
  const viewer = players[viewerIndex];
  const target = players[playerIndex];
  if (!viewer || !target) return false;
  if ((viewer.layer || WORLD_LAYER_UPPER) !== (target.layer || WORLD_LAYER_UPPER)) return false;
  return getManhattanDistance(viewer.x, viewer.y, target.x, target.y) <= ENEMY_POCKET_VISIBILITY_RANGE;
}

function canSeeEnemyCastleResources(playerIndex) {
  const viewerIndex = getViewerPlayerIndex();
  if (viewerIndex === null || viewerIndex === playerIndex) return true;
  if (isPlayerBattleValueRevealed(playerIndex)) return true;
  const viewer = players[viewerIndex];
  if ((viewer.layer || WORLD_LAYER_UPPER) !== WORLD_LAYER_UPPER) return false;
  if ((players[playerIndex]?.layer || WORLD_LAYER_UPPER) !== WORLD_LAYER_UPPER) return false;
  const castleKey = getFirstOwnedCastleKey(playerIndex);
  if (!viewer || !castleKey) return false;
  const [castleX, castleY] = castleKey.split(",").map(Number);
  return getManhattanDistance(viewer.x, viewer.y, castleX, castleY) <= ENEMY_CASTLE_VISIBILITY_RANGE;
}

function setPanelStat(panel, selector, value, visible = true) {
  const elem = panel?.querySelector(selector);
  if (!elem) return;
  elem.textContent = visible ? String(value) : HIDDEN_STAT_VALUE;
}

function shouldBroadcastSharedPickupToast(text, actorPlayerIndex = null) {
  if (!text) return false;
  const sharedPatterns = [
    "В карман: +",
    "Сокровище:",
    "Таинственный цветок",
    "Радужный камень",
    "Тролли оглушили игрока",
    "не может атаковать: в кармане нет войск",
    "Без меча героя нельзя вступить в бой с драконом.",
    "Ловушка-стан оглушила игрока"
  ];
  const matchesSharedPattern = sharedPatterns.some(pattern => text.includes(pattern));
  if (!matchesSharedPattern) return false;
  if (!Number.isInteger(actorPlayerIndex)) return true;
  const actor = players[actorPlayerIndex];
  if (!actor) return true;
  return players.every((player, index) => {
    if (index === actorPlayerIndex || !player) return true;
    return (player.layer || WORLD_LAYER_UPPER) === (actor.layer || WORLD_LAYER_UPPER);
  });
}

function shouldDelegatePrivateUiToPlayer(playerIndex) {
  return typeof socket !== "undefined" &&
    Boolean(socket) &&
    typeof onlineMatchStarted !== "undefined" &&
    Boolean(onlineMatchStarted) &&
    typeof isHost !== "undefined" &&
    Boolean(isHost) &&
    typeof localPlayerIndex === "number" &&
    typeof playerIndex === "number" &&
    playerIndex !== localPlayerIndex &&
    typeof emitPrivateUiToPlayer === "function";
}

function shouldRoutePrivateUiActionToHost(playerIndex) {
  return typeof socket !== "undefined" &&
    Boolean(socket) &&
    typeof onlineMatchStarted !== "undefined" &&
    Boolean(onlineMatchStarted) &&
    typeof isHost !== "undefined" &&
    !isHost &&
    typeof localPlayerIndex === "number" &&
    typeof playerIndex === "number" &&
    playerIndex === localPlayerIndex &&
    typeof emitPrivateUiActionToHost === "function";
}

function showPrivatePickupToastForPlayer(playerIndex, text) {
  if (!text) return;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showPickupToast", { text });
    return;
  }
  showPickupToast(text, {
    skipBroadcast: true,
    privatePlayerIndex: playerIndex,
    actorPlayerIndex: playerIndex
  });
}

function shouldKeepPickupToastPrivate(playerIndex) {
  const actor = players[playerIndex];
  if (!actor) return false;
  return players.some((player, index) => {
    if (index === playerIndex || !player) return false;
    return (player.layer || WORLD_LAYER_UPPER) !== (actor.layer || WORLD_LAYER_UPPER);
  });
}

function showLayerAwarePickupToast(playerIndex, text) {
  if (!text) return;
  if (shouldKeepPickupToastPrivate(playerIndex)) {
    showPrivatePickupToastForPlayer(playerIndex, text);
    return;
  }
  showPickupToast(text, { actorPlayerIndex: playerIndex });
}

function updateInventory(playerIndex) {
  const panel = inventoryPanels[playerIndex];
  const player = players[playerIndex];
  if (!panel || !player) return;
  const itemsRoot = panel.querySelector(".inventory-items");
  if (!itemsRoot) return;
  const inventoryVisible = canSeeEnemyPocket(playerIndex);
  itemsRoot.innerHTML = "";
  if (!inventoryVisible) {
    const hidden = document.createElement("div");
    hidden.className = "inventory-item";
    hidden.textContent = "Скрыто";
    itemsRoot.appendChild(hidden);
    return;
  }
  const canUseInventoryItems =
    !(typeof socket !== "undefined" && socket && typeof onlineMatchStarted !== "undefined" && onlineMatchStarted) ||
    typeof localPlayerIndex !== "number" ||
    localPlayerIndex === playerIndex;
  INVENTORY_ITEMS.forEach(item => {
    const count = item.count ? item.count(player) : 0;
    const alwaysShow = item.alwaysShow ? item.alwaysShow(player) : false;
    if (!count && !alwaysShow) return;
    const itemLabel = item.key === "ballista" && getPlayerBallistaLevel(player) >= 2
      ? "Баллиста II"
      : item.label;
    const entry = document.createElement("div");
    entry.className = "inventory-item";
    const icon = document.createElement("img");
    icon.className = "inventory-icon";
    icon.src = `assets/icons/${item.icon}`;
    icon.alt = itemLabel;
    const label = document.createElement("span");
    label.textContent = count > 1 ? `${itemLabel} ×${count}` : itemLabel;
    entry.appendChild(icon);
    entry.appendChild(label);
    if (item.useAction && canUseInventoryItems) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "inventory-use";
    if (item.useAction === "ballista" && ballistaModePlayerIndex === playerIndex) {
      btn.textContent = "Отменить";
        btn.addEventListener("click", () => {
          if (shouldRoutePrivateUiActionToHost(playerIndex)) {
            emitPrivateUiActionToHost({
              modalType: "inventory",
              actionType: "cancelBallista",
              playerIndex
            });
            return;
          }
          cancelBallistaMode(playerIndex);
        });
    } else if (item.useAction === "harpoon" && harpoonModePlayerIndex === playerIndex) {
      btn.textContent = "Отменить";
      btn.addEventListener("click", () => {
        if (shouldRoutePrivateUiActionToHost(playerIndex)) {
          emitPrivateUiActionToHost({
            modalType: "inventory",
            actionType: "cancelHarpoon",
            playerIndex
          });
          return;
        }
        cancelHarpoonMode(playerIndex);
      });
    } else if (item.useAction === "bridge" && bridgeModePlayerIndex === playerIndex) {
      btn.textContent = "Отменить";
      btn.addEventListener("click", () => {
          if (shouldRoutePrivateUiActionToHost(playerIndex)) {
            emitPrivateUiActionToHost({
              modalType: "inventory",
              actionType: "cancelBridge",
              playerIndex
            });
            return;
          }
          cancelBridgeMode(playerIndex);
        });
      } else if (item.useAction === "void-shard" && voidShardModePlayerIndex === playerIndex) {
        btn.textContent = "Отменить";
        btn.addEventListener("click", () => {
          if (shouldRoutePrivateUiActionToHost(playerIndex)) {
            emitPrivateUiActionToHost({
              modalType: "inventory",
              actionType: "cancelVoidShard",
              playerIndex
            });
            return;
          }
          cancelVoidShardMode(playerIndex);
        });
      } else {
        btn.textContent = "Применить";
        btn.addEventListener("click", () => {
          if (shouldRoutePrivateUiActionToHost(playerIndex)) {
            emitPrivateUiActionToHost({
              modalType: "inventory",
              actionType: "use",
              playerIndex,
              payload: { useAction: item.useAction }
            });
            return;
          }
          applyPotion(playerIndex, item.useAction);
        });
      }
      entry.appendChild(btn);
    }
    itemsRoot.appendChild(entry);
  });
}

function updatePlayerResources(playerIndex) {
  const player = players[playerIndex];
  const panel = playerPanels[playerIndex];
  if (!player || !panel) return;
  const pocketVisible = canSeeEnemyPocket(playerIndex);
  const castleVisible = canSeeEnemyCastleResources(playerIndex);
  setPanelStat(panel, '[data-stat="gold"]', player.resources.gold, castleVisible);
  setPanelStat(panel, '[data-stat="influence"]', player.resources.influence, castleVisible);
  setPanelStat(panel, '[data-stat="resources"]', player.resources.resources, castleVisible);
  setPanelStat(panel, '[data-stat="pocket-gold"]', player.pocket.gold, pocketVisible);
  setPanelStat(panel, '[data-stat="pocket-army"]', player.pocket.army, pocketVisible);
  setPanelStat(panel, '[data-stat="pocket-resources"]', player.pocket.resources, pocketVisible);
  const incomeSpan = panel.querySelector('[data-income="resources"]');
  if (incomeSpan) {
    incomeSpan.textContent = castleVisible ? `+${player.income.resources}` : HIDDEN_STAT_VALUE;
  }
  const attackSpan = panel.querySelector('[data-stat="attack"]');
  if (attackSpan) {
    attackSpan.textContent = player.attack;
  }
  const killsSpan = panel.querySelector('[data-stat="barbarian-kills"]');
  if (killsSpan) {
    killsSpan.textContent = player.barbarianKills || 0;
  }
  const negativeSpan = panel.querySelector('[data-stat="negative-buffs"]');
  if (negativeSpan) {
    const parts = [];
    if ((player.slowTurnsRemaining || 0) > 0) parts.push(`Замедление ${player.slowTurnsRemaining}`);
    if ((player.noDoubleTurnsRemaining || 0) > 0) parts.push(`Без дубля ${player.noDoubleTurnsRemaining}`);
    if ((player.stunnedTurnsRemaining || 0) > 0) parts.push(`Оглушение ${player.stunnedTurnsRemaining}`);
    if ((player.beerSlowTurnsRemaining || 0) > 0) {
      parts.push(`Пивное замедление -${TAVERN_BEER_SLOW_PENALTY} (${player.beerSlowTurnsRemaining})`);
    }
    const kingConcernState = getKingConcernState();
    if (
      isWorldEventActive(WORLD_EVENTS.kingConcern.key) &&
      kingConcernState &&
      kingConcernState.targetPlayerIndex === playerIndex &&
      (kingConcernState.remainingTurns || 0) > 0
    ) {
      parts.push(`Опасение короля ${kingConcernState.remainingTurns}`);
    }
    negativeSpan.textContent = parts.length ? parts.join(", ") : "нет";
  }
  const positiveSpan = panel.querySelector('[data-stat="positive-buffs"]');
  if (positiveSpan) {
    const parts = [];
    if ((player.royalBlessingTurnsRemaining || 0) > 0) parts.push(`Благославление ${player.royalBlessingTurnsRemaining}`);
    if ((player.invisTurnsRemaining || 0) > 0) parts.push(`Невидимость ${player.invisTurnsRemaining}`);
    if ((player.luckTurnsRemaining || 0) > 0) parts.push(`Удача ${player.luckTurnsRemaining}`);
    const beerProtectionTurns = Math.max(0, player.beerProtectionTurnsRemaining || 0);
    const invulnTurns = Math.max(0, player.invulnTurnsRemaining || 0);
    if (beerProtectionTurns > 0) parts.push(`Пиво: неприкосновенность ${beerProtectionTurns}`);
    if (invulnTurns > beerProtectionTurns) parts.push(`Неприкосновенность ${invulnTurns}`);
    if ((player.stoneBonusRollsRemaining || 0) > 0) parts.push(`Ходы подряд ${player.stoneBonusRollsRemaining}`);
    if ((player.stoneSpeedTurnsRemaining || 0) > 0) parts.push(`Скорость ${player.stoneSpeedTurnsRemaining}`);
    positiveSpan.textContent = parts.length ? parts.join(", ") : "нет";
  }
  const castleKey = getFirstOwnedCastleKey(playerIndex);
  const stats = castleKey ? ensureCastleStats(castleKey) : null;
  const storedArmy = stats ? (stats.storageArmy || 0) : 0;
  setPanelStat(panel, '[data-stat="army"]', storedArmy, castleVisible);
  updateInventory(playerIndex);
  renderWorldEventStatus(playerIndex);
}

function depositPocketCurrencyToPlayer(playerIndex) {
  const player = players[playerIndex];
  if (!player) return;
  const parts = [];
  if (player.pocket.gold > 0) {
    player.resources.gold += player.pocket.gold;
    parts.push(`+${player.pocket.gold} золота`);
    player.pocket.gold = 0;
  }
  if (player.pocket.resources > 0) {
    player.resources.resources += player.pocket.resources;
    parts.push(`+${player.pocket.resources} ресурсов`);
    player.pocket.resources = 0;
  }
  if (parts.length) {
    updatePlayerResources(playerIndex);
    showPickupToast(`В замок: ${parts.join(", ")}`);
  }
}
players.forEach((_, index) => {
  recalcPlayerResourceIncome(index);
  updatePlayerResources(index);
});

function showPickupToast(text, options = {}) {
  const inOnlineMatch =
    typeof socket !== "undefined" &&
    socket &&
    typeof onlineMatchStarted !== "undefined" &&
    onlineMatchStarted;
  let actorPlayerIndex = null;
  let privateToastPlayerIndex = null;
  if (Number.isInteger(options.actorPlayerIndex)) {
    actorPlayerIndex = options.actorPlayerIndex;
  } else if (Number.isInteger(options.privatePlayerIndex)) {
    actorPlayerIndex = options.privatePlayerIndex;
  } else if (
    inOnlineMatch &&
    typeof isHost !== "undefined" &&
    isHost &&
    typeof currentPrivateUiPlayerIndex === "number"
  ) {
    actorPlayerIndex = currentPrivateUiPlayerIndex;
  } else if (
    inOnlineMatch &&
    typeof isHost !== "undefined" &&
    isHost &&
    typeof performingRemoteAction !== "undefined" &&
    performingRemoteAction &&
    typeof currentPlayerIndex === "number"
  ) {
    actorPlayerIndex = currentPlayerIndex;
  } else if (typeof currentPlayerIndex === "number") {
    actorPlayerIndex = currentPlayerIndex;
  }
  const isSharedToast = shouldBroadcastSharedPickupToast(text, actorPlayerIndex);
  if (Number.isInteger(options.privatePlayerIndex)) {
    privateToastPlayerIndex = options.privatePlayerIndex;
  } else if (
    inOnlineMatch &&
    typeof isHost !== "undefined" &&
    isHost &&
    typeof currentPrivateUiPlayerIndex === "number"
  ) {
    privateToastPlayerIndex = currentPrivateUiPlayerIndex;
  } else if (
    inOnlineMatch &&
    typeof isHost !== "undefined" &&
    isHost &&
    typeof performingRemoteAction !== "undefined" &&
    performingRemoteAction &&
    typeof currentPlayerIndex === "number"
  ) {
    privateToastPlayerIndex = currentPlayerIndex;
  }
  if (
    !options.skipBroadcast &&
    !isSharedToast &&
    inOnlineMatch &&
    typeof isHost !== "undefined" &&
    isHost &&
    typeof localPlayerIndex === "number" &&
    Number.isInteger(privateToastPlayerIndex) &&
    privateToastPlayerIndex !== localPlayerIndex &&
    typeof emitPrivateUiToPlayer === "function"
  ) {
    emitPrivateUiToPlayer(privateToastPlayerIndex, "showPickupToast", { text });
    return;
  }
  pickupText.textContent = text;
  pickupToast.style.display = "flex";
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    pickupToast.style.display = "none";
  }, 2000);
  if (!options.skipBroadcast &&
      isSharedToast &&
      inOnlineMatch &&
      typeof isHost !== "undefined" &&
      isHost) {
    socket.emit("sharedToast", { text });
  }
}

function showDamageToast(damageText) {
  if (!damageToast) return;
  const text = damageToast.querySelector(".damage-toast-text");
  if (text) text.textContent = damageText;
  damageToast.style.display = "flex";
  if (text) {
    text.classList.remove("animate");
    void text.offsetWidth;
    text.classList.add("animate");
  }
  setTimeout(() => {
    damageToast.style.display = "none";
    if (text) text.classList.remove("animate");
  }, 2200);
}

function showDoubleToast() {
  if (!doubleToast) return;
  const text = doubleToast.querySelector(".double-toast-text");
  doubleToast.style.display = "flex";
  if (text) {
    text.classList.remove("animate");
    void text.offsetWidth;
    text.classList.add("animate");
  }
  setTimeout(() => {
    doubleToast.style.display = "none";
    if (text) text.classList.remove("animate");
  }, 2700);
  if (!doubleSound) {
    doubleSound = document.getElementById("doubleSound") || new Audio("assets/sfx/double.mp3");
  }
  doubleSound.currentTime = 0;
  doubleSound.play().catch(() => {});
}

function simulateArmyExchange(attackerCurrent, defenderCurrent, attackerInitial, defenderInitial) {
  const attackerThreshold = Math.max(1, Math.round(attackerInitial * 0.07));
  const defenderThreshold = Math.max(1, Math.round(defenderInitial * 0.07));
  let attackerRemaining = attackerCurrent;
  let defenderRemaining = defenderCurrent;
  while (attackerRemaining > attackerThreshold && defenderRemaining > defenderThreshold &&
    attackerRemaining > 0 && defenderRemaining > 0) {
    const attackerLossCap = Math.max(1, attackerRemaining - attackerThreshold);
    const defenderLossCap = Math.max(1, defenderRemaining - defenderThreshold);
    const attackerLoss = Math.min(attackerLossCap, Math.floor(Math.random() * 3) + 1);
    const defenderLoss = Math.min(defenderLossCap, Math.floor(Math.random() * 3) + 1);
    attackerRemaining = Math.max(attackerThreshold, attackerRemaining - attackerLoss);
    defenderRemaining = Math.max(defenderThreshold, defenderRemaining - defenderLoss);
    if (attackerRemaining === attackerThreshold && defenderRemaining === defenderThreshold) {
      break;
    }
  }
  return {attackerRemaining, defenderRemaining, attackerThreshold, defenderThreshold};
}

const worldDangerModal = document.getElementById("worldDangerModal");
const worldDangerClose = document.getElementById("worldDangerClose");
let worldDangerShown = false;
const devTurnInput = document.getElementById("devTurnInput");
const devTurnApply = document.getElementById("devTurnApply");
const devSkipInput = document.getElementById("devSkipInput");
const devSkipApply = document.getElementById("devSkipApply");
const testModeBtn = document.getElementById("testModeBtn");
const disableTestModeBtn = document.getElementById("disableTestModeBtn");
const disableRobbersBtn = document.getElementById("disableRobbersBtn");
const enableRobbersBtn = document.getElementById("enableRobbersBtn");
let robbersEnabled = false;

function showWorldDangerModal() {
  if (!worldDangerModal) return;
  worldDangerModal.style.display = "flex";
}

function hideWorldDangerModal() {
  if (!worldDangerModal) return;
  worldDangerModal.style.display = "none";
}

if (worldDangerClose) {
  worldDangerClose.addEventListener("click", hideWorldDangerModal);
}
if (worldDangerModal) {
  worldDangerModal.addEventListener("click", event => {
    if (event.target === worldDangerModal) {
      hideWorldDangerModal();
    }
  });
}
if (worldEventClose) {
  worldEventClose.addEventListener("click", closeWorldEventModal);
}
if (worldEventModal) {
  worldEventModal.addEventListener("click", event => {
    if (event.target === worldEventModal) {
      closeWorldEventModal();
    }
  });
}
if (kingAuctionInputElems.length) {
  kingAuctionInputElems.forEach(input => {
    input.addEventListener("input", () => {
      const playerIndex = Number(input.dataset.kingAuctionInput);
      if (!Number.isInteger(playerIndex)) return;
      const sanitized = String(input.value || "").replace(/[^\d]/g, "");
      kingAuctionDraftBids[playerIndex] = sanitized;
      if (input.value !== sanitized) {
        input.value = sanitized;
      }
    });
  });
}
if (kingAuctionSubmitButtons.length) {
  kingAuctionSubmitButtons.forEach(button => {
    button.addEventListener("click", () => {
      const playerIndex = Number(button.dataset.kingAuctionSubmit);
      const player = players[playerIndex];
      if (!Number.isInteger(playerIndex) || !player) return;
      const amount = sanitizeKingAuctionBidAmount(kingAuctionDraftBids[playerIndex]);
      if (amount > getTotalGold(player)) {
        showPrivatePickupToastForPlayer(playerIndex, "У вас недостаточно золота для такой ставки.");
        return;
      }
      if (shouldRoutePrivateUiActionToHost(playerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "kingAuction",
          actionType: "submit",
          playerIndex,
          payload: { amount }
        });
        closeKingAuctionModal();
        return;
      }
      submitKingAuctionBid(playerIndex, amount);
    });
  });
}
if (kingGenerosityChoiceButtons.length) {
  kingGenerosityChoiceButtons.forEach(button => {
    button.addEventListener("click", () => {
      const playerIndex = Number(button.dataset.kingGenerosityPlayerChoice);
      const giftKey = String(button.dataset.giftKey || "").trim();
      const player = players[playerIndex];
      if (!Number.isInteger(playerIndex) || !player || !giftKey) return;
      if (shouldRoutePrivateUiActionToHost(playerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "kingGenerosity",
          actionType: "claim",
          playerIndex,
          payload: { giftKey }
        });
        closeKingGenerosityModal();
        return;
      }
      selectKingGenerosityGift(playerIndex, giftKey);
    });
  });
}

const mageModal = document.getElementById("mageModal");
const mageCancelBtn = document.getElementById("mageCancelBtn");
const mageActionButtons = mageModal ? Array.from(mageModal.querySelectorAll("[data-mage-action]")) : [];
let pendingMageSlot = null;
let pendingMagePlayerIndex = null;
let pendingStoneKey = null;
let pendingStonePlayerIndex = null;
let pendingMasterPlayerIndex = null;
const cellHoverTooltip = document.createElement("div");
cellHoverTooltip.className = "cell-hover-tooltip";
document.body.appendChild(cellHoverTooltip);

function getMageActionCost(action) {
  if (action === "slow") return MAGE_SLOW_COST;
  if (action === "no-double") return MAGE_NO_DOUBLE_COST;
  if (action === "poison") return MAGE_POISON_COST;
  if (action === "fog") return 1000;
  if (action === "flower-gold") return 1000;
  return null;
}

function updateMageActionButtons(playerIndex) {
  if (!mageActionButtons.length) return;
  const player = players[playerIndex];
  mageActionButtons.forEach(btn => {
    const action = btn.dataset.mageAction;
    const baseCost = getMageActionCost(action);
    if (!player || (baseCost === null && action !== "flower-infl" && action !== "clover-luck")) {
      btn.disabled = true;
      return;
    }
    if (action === "flower-infl") {
      btn.disabled = (player.flowerCount || 0) <= 0;
      return;
    }
    if (action === "flower-gold") {
      btn.disabled = (player.flowerCount || 0) <= 0;
      return;
    }
    if (action === "clover-luck") {
      btn.disabled = (player.cloverCount || 0) <= 0;
      return;
    }
    const scope = action === "poison" ? "poison" : "general";
    const cost = getDiscountedGoldCostForScope(player, baseCost, scope);
    if (action === "slow" || action === "no-double") {
      setTradePrice(btn, goldPriceHtml(cost));
    }
    if (action === "poison") {
      setTradePrice(
        btn,
        `<img class="price-icon" src="assets/icons/icon-gold.png" alt="Золото" />Цена: ${cost} золота + ` +
          `<img class="price-icon" src="assets/icons/mystic_flower.png" alt="Таинственный цветок" />Таинственный цветок`
      );
    }
    const needsFlower = action === "poison";
    const hasFlower = (player.flowerCount || 0) > 0;
    btn.disabled = getTotalGold(player) < cost || (needsFlower && !hasFlower);
  });
}

function getOpponentIndex(playerIndex) {
  return (playerIndex + 1) % players.length;
}

function hideCellHoverTooltip() {
  cellHoverTooltip.classList.remove("is-visible");
}

function getHoverInfoPlayer() {
  if (typeof getViewerWorldPlayerIndex === "function") {
    return players[getViewerWorldPlayerIndex()] || players[0] || null;
  }
  return players[typeof currentPlayerIndex === "number" ? currentPlayerIndex : 0] || null;
}

function getCellHoverTooltipData(key) {
  if (!isUpperWorldKeyVisibleToPlayer(key)) return null;
  const player = getHoverInfoPlayer();
  if (typeof MASTER_CELL !== "undefined" && typeof masterActive !== "undefined" && masterActive && key === MASTER_CELL.key) {
    return {
      title: "Великий мастер",
      lines: [
        "Рукоять меча героя — 800 ресурсов",
        "1500 золота — 800 ресурсов",
        "Жетон — 1000 золота",
        "1000 золота — радужный камень",
        "Кольцо ужаса — кольцо убеждения"
      ]
    };
  }

  const mageSlot = typeof getMageSlotByKey === "function" ? getMageSlotByKey(key) : null;
  if (mageSlot && mageSlot.active) {
    const slowCost = getDiscountedGoldCost(player, MAGE_SLOW_COST);
    const noDoubleCost = getDiscountedGoldCost(player, MAGE_NO_DOUBLE_COST);
    const poisonCost = getDiscountedGoldCostForScope(player, MAGE_POISON_COST, "poison");
    return {
      title: "Маг",
      lines: [
        `Замедление врага на ${MAGE_SLOW_DURATION} ходов — ${slowCost} золота`,
        `Отмена дубля на ${MAGE_NO_DOUBLE_DURATION} ходов — ${noDoubleCost} золота`,
        `Яд — ${poisonCost} золота + таинственный цветок`,
        "300 влияния — таинственный цветок",
        "1000 золота — таинственный цветок",
        "Зелье удачи — клевер"
      ]
    };
  }

  const node = nodeByPos[key];
  if (!node) return null;

  if (node.id === 2) {
    return {
      title: "Казарма",
      lines: [
        `50 войск — ${getDiscountedGoldCostForScope(player, 2000, "barracks")} золота`,
        `130 войск — ${getDiscountedGoldCostForScope(player, 4000, "barracks")} золота`,
        "300 влияния — 100 войск"
      ]
    };
  }

  if (node.id === 9) {
    return {
      title: "Лавка",
      lines: [
        "300 влияния — 1000 ресурсов",
        `Сапоги — ${getDiscountedGoldCostForScope(player, 1500, "lavka")} золота + радужный камень`,
        `Зелье невидимости — ${getDiscountedGoldCostForScope(player, 250, "lavka")} золота`,
        `Зелье удачи — ${getDiscountedGoldCostForScope(player, 250, "lavka")} золота`
      ]
    };
  }

  if (node.id === 19) {
    return {
      title: "Мастерская",
      lines: [
        `Доспехи (+7 атаки) — ${getDiscountedGoldCostForScope(player, 1500, "workshop")} золота`,
        `Меч (+12 атаки) — ${getDiscountedGoldCostForScope(player, 2500, "workshop")} золота`,
        `Меч героя — ${getDiscountedGoldCostForScope(player, 6000, "workshop")} золота + радужный камень + рукоять`,
        "300 влияния — радужный камень"
      ]
    };
  }

  if (node.id === 15) {
    return {
      title: "Король",
      lines: [
        "1500 золота — 5 лагерей варваров",
        "3000 золота — 10 лагерей варваров",
        "5000 золота — 20 лагерей варваров",
        `100 влияния — ${getDiscountedGoldCost(player, 1000)} золота`,
        `300 влияния — ${getDiscountedGoldCost(player, 2500)} золота`,
        `Яд по королю — от ${POISON_INFLUENCE_THRESHOLD} влияния`
      ]
    };
  }

  if (node.id === 6) {
    return {
      title: "Наемники",
      lines: [
        `Атака лесопилки — ${getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.lumber)} золота`,
        `Атака шахты — ${getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.mine)} золота`,
        `Атака глиняного карьера — ${getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.clay)} золота`,
        "Вор — 1 жетон",
        `Головорезы — ${getDiscountedGoldCost(player, CUTTHROAT_COST)} золота`
      ]
    };
  }

  return null;
}

function renderCellHoverTooltip(data) {
  if (!data) {
    cellHoverTooltip.innerHTML = "";
    return;
  }
  const linesHtml = data.lines
    .map(line => `<div class="cell-hover-tooltip-line">${line}</div>`)
    .join("");
  cellHoverTooltip.innerHTML = `<div class="cell-hover-tooltip-title">${data.title}</div>${linesHtml}`;
}

function positionCellHoverTooltip(clientX, clientY) {
  const offset = 14;
  const margin = 8;
  const width = cellHoverTooltip.offsetWidth;
  const height = cellHoverTooltip.offsetHeight;
  const left = Math.min(clientX + offset, window.innerWidth - width - margin);
  const top = Math.min(clientY + offset, window.innerHeight - height - margin);
  cellHoverTooltip.style.left = `${Math.max(margin, left)}px`;
  cellHoverTooltip.style.top = `${Math.max(margin, top)}px`;
}

function handleGameHoverInfo(event) {
  const cell = event.target.closest(".cell");
  if (!cell || !game.contains(cell)) {
    hideCellHoverTooltip();
    return;
  }
  const key = cell.dataset.key;
  if (!key) {
    hideCellHoverTooltip();
    return;
  }
  if (cell.classList.contains("fogged")) {
    hideCellHoverTooltip();
    return;
  }
  const tooltipData = getCellHoverTooltipData(key);
  if (!tooltipData) {
    hideCellHoverTooltip();
    return;
  }
  renderCellHoverTooltip(tooltipData);
  cellHoverTooltip.classList.add("is-visible");
  positionCellHoverTooltip(event.clientX, event.clientY);
}

game.addEventListener("mousemove", handleGameHoverInfo);
game.addEventListener("mouseleave", hideCellHoverTooltip);
game.addEventListener("mousedown", hideCellHoverTooltip);

function openMageModal(slot, playerIndex) {
  if (!mageModal || !slot) return;
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showMageModal", { mageId: slot.id, playerIndex });
    return;
  }
  pendingMageSlot = slot;
  pendingMagePlayerIndex = playerIndex;
  updateMageActionButtons(playerIndex);
  mageModal.style.display = "flex";
}

function closeMageModal() {
  if (!mageModal) return;
  pendingMageSlot = null;
  pendingMagePlayerIndex = null;
  mageModal.style.display = "none";
  resumeTurnFlowAfterModalChange();
}

function handleMageAction(action) {
  if (!pendingMageSlot || pendingMagePlayerIndex === null) return;
  const player = players[pendingMagePlayerIndex];
  if (!player) return;
  const opponent = players[getOpponentIndex(pendingMagePlayerIndex)];
  const showMageToast = text => showPrivatePickupToastForPlayer(pendingMagePlayerIndex, text);
  if (action === "flower-infl") {
    if ((player.flowerCount || 0) <= 0) {
      showMageToast("Нужен таинственный цветок.");
      return;
    }
    player.flowerCount -= 1;
    player.resources.influence += 300;
    updatePlayerResources(pendingMagePlayerIndex);
    showMageToast("Таинственный цветок обменян на 300 влияния.");
    const btn = mageActionButtons.find(b => b.dataset.mageAction === "flower-infl");
    flashPrice(btn, 1, "assets/icons/mystic_flower.png", "Таинственный цветок");
    return;
  }
  if (action === "flower-gold") {
    if ((player.flowerCount || 0) <= 0) {
      showMageToast("Нужен таинственный цветок.");
      return;
    }
    player.flowerCount -= 1;
    player.pocket.gold += 1000;
    updatePlayerResources(pendingMagePlayerIndex);
    showMageToast("Таинственный цветок обменян на 1000 золота.");
    const btn = mageActionButtons.find(b => b.dataset.mageAction === "flower-gold");
    flashPrice(btn, 1, "assets/icons/mystic_flower.png", "Таинственный цветок");
    return;
  }
  if (action === "clover-luck") {
    if ((player.cloverCount || 0) <= 0) {
      showMageToast("Нужен клевер.");
      return;
    }
    player.cloverCount -= 1;
    player.luckPotionCount = (player.luckPotionCount || 0) + 1;
    updatePlayerResources(pendingMagePlayerIndex);
    showMageToast("Зелье удачи добавлено в инвентарь.");
    const btn = mageActionButtons.find(b => b.dataset.mageAction === "clover-luck");
    flashPrice(btn, 1, "assets/icons/clover.png", "Клевер");
    return;
  }
  const baseCost = getMageActionCost(action);
  const scope = action === "poison" ? "poison" : "general";
  const cost = baseCost === null ? null : getDiscountedGoldCostForScope(player, baseCost, scope);
  if (cost === null || getTotalGold(player) < cost) {
    showMageToast("Не хватает золота.");
    return;
  }
  if (action === "poison" && (player.flowerCount || 0) <= 0) {
    showMageToast("Нужен таинственный цветок.");
    return;
  }
  spendGold(player, cost);
  if (action === "slow") {
    if (opponent) opponent.slowTurnsRemaining = MAGE_SLOW_DURATION;
    showMageToast("Противник замедлен на 25 ходов.");
    const btn = mageActionButtons.find(b => b.dataset.mageAction === "slow");
    flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
  } else if (action === "no-double") {
    if (opponent) opponent.noDoubleTurnsRemaining = MAGE_NO_DOUBLE_DURATION;
    showMageToast("Двойной ход отменен на 25 ходов.");
    const btn = mageActionButtons.find(b => b.dataset.mageAction === "no-double");
    flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
  } else if (action === "poison") {
    player.flowerCount = Math.max(0, (player.flowerCount || 0) - 1);
    player.poisonCount = (player.poisonCount || 0) + 1;
    showMageToast("Яд добавлен в инвентарь.");
    const btn = mageActionButtons.find(b => b.dataset.mageAction === "poison");
    flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    flashPrice(btn, 1, "assets/icons/mystic_flower.png", "Таинственный цветок");
  } else if (action === "fog") {
    player.fogOfWarCount = (player.fogOfWarCount || 0) + 1;
    showMageToast("Туман войны добавлен в инвентарь.");
    const btn = mageActionButtons.find(b => b.dataset.mageAction === "fog");
    flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
  }
  updatePlayerResources(pendingMagePlayerIndex);
}

mageActionButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingMagePlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "mage",
        actionType: "act",
        playerIndex: pendingMagePlayerIndex,
        payload: { action: btn.dataset.mageAction, mageId: pendingMageSlot?.id ?? null }
      });
      return;
    }
    handleMageAction(btn.dataset.mageAction);
  });
});

if (mageCancelBtn) {
  mageCancelBtn.addEventListener("click", closeMageModal);
}

if (mageModal) {
  mageModal.addEventListener("click", event => {
    if (event.target === mageModal) {
      closeMageModal();
    }
  });
}

function openStoneModal(key, playerIndex) {
  if (!stoneModal) return;
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showStoneModal", { key, playerIndex });
    return;
  }
  pendingStoneKey = key;
  pendingStonePlayerIndex = playerIndex;
  stoneModal.style.display = "flex";
}

function closeStoneModal() {
  if (!stoneModal) return;
  pendingStoneKey = null;
  pendingStonePlayerIndex = null;
  stoneModal.style.display = "none";
  resumeTurnFlowAfterModalChange();
}

function openStoneResultModal(text, playerIndex = currentPlayerIndex) {
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showStoneResultModal", { text, playerIndex });
    return;
  }
  if (!stoneResultModal || !stoneResultText) return;
  stoneResultText.textContent = text;
  stoneResultModal.style.display = "flex";
}

function closeStoneResultModal() {
  if (!stoneResultModal) return;
  stoneResultModal.style.display = "none";
  resumeTurnFlowAfterModalChange();
}

function openTrollCaveModal(text, playerIndex = currentPlayerIndex) {
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showTrollCaveModal", { text, playerIndex });
    return;
  }
  if (typeof socket !== "undefined" &&
      socket &&
      typeof onlineMatchStarted !== "undefined" &&
      onlineMatchStarted &&
      typeof localPlayerIndex === "number" &&
      playerIndex !== localPlayerIndex) {
    return;
  }
  if (!trollCaveModal || !trollCaveText) return;
  trollCaveText.textContent = text;
  trollCaveModal.style.display = "flex";
}

function closeTrollCaveModal() {
  if (!trollCaveModal) return;
  trollCaveModal.style.display = "none";
  resumeTurnFlowAfterModalChange();
}

function applyStoneEffect(playerIndex) {
  const player = players[playerIndex];
  if (!player) return;
  const effects = ["gold", "influence", "army", "ring", "bonus-rolls", "bridge", "bolts", "bonus-moves"];
  const choice = effects[Math.floor(Math.random() * effects.length)];
  if (choice === "gold") {
    player.pocket.gold += 500;
    updatePlayerResources(playerIndex);
    openStoneResultModal("Вы получили 500 золота в карман.", playerIndex);
    return;
  }
  if (choice === "influence") {
    player.resources.influence += 150;
    updatePlayerResources(playerIndex);
    openStoneResultModal("Вы получили 150 влияния.", playerIndex);
    return;
  }
  if (choice === "army") {
    player.pocket.army += 15;
    updatePlayerResources(playerIndex);
    openStoneResultModal("Люди тянутся к вам: вы получили 15 войск в карман.", playerIndex);
    return;
  }
  if (choice === "ring") {
    player.ringCount = (player.ringCount || 0) + 1;
    updatePlayerResources(playerIndex);
    openStoneResultModal("Камень раскалывается, и вы находите Кольцо убеждения.", playerIndex);
    return;
  }
  if (choice === "bridge") {
    player.bridgeCount = (player.bridgeCount || 0) + 1;
    updateInventory(playerIndex);
    openStoneResultModal("Вы получили 1 мост в инвентарь.", playerIndex);
    return;
  }
  if (choice === "bolts") {
    player.boltCount = (player.boltCount || 0) + 3;
    updateInventory(playerIndex);
    openStoneResultModal("Вы получили 3 болта в инвентарь.", playerIndex);
    return;
  }
  if (choice === "bonus-moves") {
    player.stoneSpeedTurnsRemaining = Math.max(player.stoneSpeedTurnsRemaining || 0, 15);
    updatePlayerResources(playerIndex);
    openStoneResultModal("Вы чувствуете прилив сил: +3 к броску на 15 ходов.", playerIndex);
    return;
  }
  player.stoneBonusRollsRemaining = 5;
  updatePlayerResources(playerIndex);
  openStoneResultModal("Вы ходите 5 раз подряд.", playerIndex);
}

if (stoneTouchBtn) {
  stoneTouchBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingStonePlayerIndex)) {
      const stoneKey = pendingStoneKey;
      const stonePlayerIndex = pendingStonePlayerIndex;
      closeStoneModal();
      emitPrivateUiActionToHost({
        modalType: "stone",
        actionType: "touch",
        playerIndex: stonePlayerIndex,
        payload: { key: stoneKey }
      });
      return;
    }
    if (pendingStoneKey) {
      clearStone(pendingStoneKey);
    }
    if (pendingStoneKey && pendingStonePlayerIndex !== null) {
      applyStoneEffect(pendingStonePlayerIndex);
    }
    closeStoneModal();
  });
}

if (stonePickupBtn) {
  stonePickupBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingStonePlayerIndex)) {
      const stoneKey = pendingStoneKey;
      const stonePlayerIndex = pendingStonePlayerIndex;
      closeStoneModal();
      emitPrivateUiActionToHost({
        modalType: "stone",
        actionType: "pickup",
        playerIndex: stonePlayerIndex,
        payload: { key: stoneKey }
      });
      return;
    }
    if (pendingStoneKey) {
      clearStone(pendingStoneKey);
    }
    if (pendingStoneKey && pendingStonePlayerIndex !== null) {
      const player = players[pendingStonePlayerIndex];
      if (player) {
        player.mysticStoneCount = (player.mysticStoneCount || 0) + 1;
        updateInventory(pendingStonePlayerIndex);
        showPrivatePickupToastForPlayer(pendingStonePlayerIndex, "Необычный камень добавлен в инвентарь.");
      }
    }
    closeStoneModal();
  });
}

if (stoneModal) {
  stoneModal.addEventListener("click", event => {
    if (event.target === stoneModal) {
      closeStoneModal();
    }
  });
}

if (stoneResultClose) {
  stoneResultClose.addEventListener("click", closeStoneResultModal);
}

if (stoneResultModal) {
  stoneResultModal.addEventListener("click", event => {
    if (event.target === stoneResultModal) {
      closeStoneResultModal();
    }
  });
}

if (trollCaveClose) {
  trollCaveClose.addEventListener("click", closeTrollCaveModal);
}

function getTimeOfDayInfoHtml() {
  const effects = {
    day: function() {
      if (!activeDayBuffs.length) return ["Без особенностей.", "Бафы выбираются случайно каждый день."];
      return activeDayBuffs.map(key => {
        const def = DAY_BUFF_POOL.find(d => d.key === key);
        return def ? def.label : key;
      });
    },
    evening: [
      "Тролли имеют 20 войск (вместо 25).",
      "Золото, ресурсы и войска в пещере при подборе увеличиваются в 1,25 раза.",
      "Скидка 13% в лавке, мастерской и казарме (не суммируется с другими скидками)."
    ],
    night: [
      "Варвары сильнее на 50%.",
      "Цены в лавке, мастерской и казарме дороже на 15%.",
      "Замедление хода на 2 единицы от броска."
    ],
    morning: [
      "Ресурсы, золото и войска появляются в 2 раза больше.",
      "Дополнительные +3 к броску кубиков.",
      "В начале утра из пещеры исчезают золото, ресурсы и войска; Радужные камни и Таинственные цветки остаются.",
      "Варвары слабее на 30%."
    ]
  };
  const tod = getTimeOfDay();
  const raw = effects[tod.key] || ["Без особенностей."];
  const lines = typeof raw === "function" ? raw() : raw;
  const itemsHtml = lines.map(line => `— ${line}`).join("<br>");
  return `<div style="margin-bottom:8px;"><strong>${tod.label}</strong> (${tod.duration} ходов)<br>${itemsHtml}</div>`;
}

function openTimeOfDayModal() {
  if (!timeOfDayModal || !timeOfDayModalContent || !timeOfDayModalTitle) return;
  const tod = getTimeOfDay();
  timeOfDayModalTitle.textContent = `ВРЕМЯ СУТОК: ${tod.label}`;
  timeOfDayModalContent.innerHTML = getTimeOfDayInfoHtml();
  timeOfDayModal.style.display = "flex";
}

function closeTimeOfDayModal() {
  if (timeOfDayModal) timeOfDayModal.style.display = "none";
}

if (timeOfDayModalClose) {
  timeOfDayModalClose.addEventListener("click", event => {
    event.stopPropagation();
    closeTimeOfDayModal();
  });
}

if (timeOfDayModal) {
  timeOfDayModal.addEventListener("click", event => {
    if (event.target === timeOfDayModal) closeTimeOfDayModal();
  });
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && timeOfDayModal && timeOfDayModal.style.display === "flex") {
    closeTimeOfDayModal();
  }
});

if (typeof timeOfDayDisplay !== "undefined" && timeOfDayDisplay) {
  timeOfDayDisplay.style.cursor = "pointer";
  timeOfDayDisplay.addEventListener("click", event => {
    event.stopPropagation();
    openTimeOfDayModal();
  });
}

if (trollCaveModal) {
  trollCaveModal.addEventListener("click", event => {
    if (event.target === trollCaveModal) {
      closeTrollCaveModal();
    }
  });
}

function syncMasterModalState(playerIndex) {
  if (!masterModal || !masterBuyHilt) return;
  const player = players[playerIndex];
  const totalResources = getTotalResources(player);
  masterBuyHilt.disabled = !player || totalResources < 800;
  if (masterBuyGold) {
    masterBuyGold.disabled = !player || totalResources < 800;
  }
  if (masterBuyToken) {
    masterBuyToken.disabled = !player || getTotalGold(player) < 1000;
  }
  if (masterBuyGoldRainbow) {
    masterBuyGoldRainbow.disabled = !player || (player.rainbowStoneCount || 0) <= 0;
  }
  if (masterBuyTerrorRing) {
    masterBuyTerrorRing.disabled = !player || (player.ringCount || 0) <= 0;
  }
  pendingMasterPlayerIndex = playerIndex;
}

function openMasterModal(playerIndex) {
  if (!masterModal || !masterBuyHilt) return;
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showMasterModal", { playerIndex });
    return;
  }
  syncMasterModalState(playerIndex);
  masterModal.style.display = "flex";
}

function closeMasterModal() {
  if (!masterModal) return;
  masterModal.style.display = "none";
  pendingMasterPlayerIndex = null;
  resumeTurnFlowAfterModalChange();
}

if (masterBuyHilt) {
  masterBuyHilt.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingMasterPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "master", actionType: "buyHilt", playerIndex: pendingMasterPlayerIndex });
      return;
    }
    if (pendingMasterPlayerIndex === null) return;
    const player = players[pendingMasterPlayerIndex];
    if (!player) return;
    const totalResources = getTotalResources(player);
    if (totalResources < 800) return;
    spendResources(player, 800);
    player.heroHiltCount = (player.heroHiltCount || 0) + 1;
    updatePlayerResources(pendingMasterPlayerIndex);
    showPickupToast("Рукоять меча героя получена.");
    flashPrice(masterBuyHilt, 800, "assets/icons/icon-resources.png", "Ресурсы");
  });
}

if (masterBuyGold) {
  masterBuyGold.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingMasterPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "master", actionType: "buyGold", playerIndex: pendingMasterPlayerIndex });
      return;
    }
    if (pendingMasterPlayerIndex === null) return;
    const player = players[pendingMasterPlayerIndex];
    if (!player) return;
    const totalResources = getTotalResources(player);
    if (totalResources < 800) return;
    spendResources(player, 800);
    player.pocket.gold += 1500;
    updatePlayerResources(pendingMasterPlayerIndex);
    showPickupToast("Получено 1500 золота.");
    flashPrice(masterBuyGold, 800, "assets/icons/icon-resources.png", "Ресурсы");
  });
}

if (masterBuyToken) {
  masterBuyToken.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingMasterPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "master", actionType: "buyToken", playerIndex: pendingMasterPlayerIndex });
      return;
    }
    if (pendingMasterPlayerIndex === null) return;
    const player = players[pendingMasterPlayerIndex];
    if (!player) return;
    if (getTotalGold(player) < 1000) return;
    spendGold(player, 1000);
    player.tokenCount = (player.tokenCount || 0) + 1;
    updatePlayerResources(pendingMasterPlayerIndex);
    showPickupToast("Жетон получен.");
    flashPrice(masterBuyToken, 1000, "assets/icons/icon-gold.png", "Золото");
  });
}

if (masterBuyGoldRainbow) {
  masterBuyGoldRainbow.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingMasterPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "master", actionType: "buyGoldRainbow", playerIndex: pendingMasterPlayerIndex });
      return;
    }
    if (pendingMasterPlayerIndex === null) return;
    const player = players[pendingMasterPlayerIndex];
    if (!player || (player.rainbowStoneCount || 0) <= 0) return;
    player.rainbowStoneCount -= 1;
    player.pocket.gold += 1000;
    updatePlayerResources(pendingMasterPlayerIndex);
    showPickupToast("Получено 1000 золота.");
    flashPrice(masterBuyGoldRainbow, 1, "assets/icons/rainbow_stone.png", "Радужный камень");
  });
}

if (masterBuyTerrorRing) {
  masterBuyTerrorRing.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingMasterPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "master", actionType: "buyTerrorRing", playerIndex: pendingMasterPlayerIndex });
      return;
    }
    if (pendingMasterPlayerIndex === null) return;
    const player = players[pendingMasterPlayerIndex];
    if (!player || (player.ringCount || 0) <= 0) return;
    player.ringCount -= 1;
    player.terrorRingCount = (player.terrorRingCount || 0) + 1;
    player.attack += 8;
    updatePlayerResources(pendingMasterPlayerIndex);
    showPickupToast("Кольцо ужаса получено.");
    flashPrice(masterBuyTerrorRing, 1, "assets/icons/ring_persuasion.png", "Кольцо убеждения");
  });
}

if (masterCloseBtn) {
  masterCloseBtn.addEventListener("click", closeMasterModal);
}

if (masterModal) {
  masterModal.addEventListener("click", event => {
    if (event.target === masterModal) {
      closeMasterModal();
    }
  });
}

let pendingTavernPlayerIndex = null;
let tavernWheelSelectedColor = null;
let tavernWheelRound = null;
let tavernWheelResolveTimer = null;
let tavernWheelVisualInProgress = false;
let tavernDragonRound = null;
let tavernDragonResolveTimer = null;
let tavernDragonVisualFrame = null;
let tavernDragonVisualStartedAt = 0;
let tavernDragonVisualInProgress = false;
let tavernGameSequenceId = 0;

function isTavernSafeCell(key, layer = WORLD_LAYER_UPPER) {
  return layer === WORLD_LAYER_UPPER && key === TAVERN_CELL_KEY;
}

function isPlayerAtTavern(playerIndex) {
  const player = players[playerIndex];
  return Boolean(player) &&
    (player.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER &&
    `${player.x},${player.y}` === TAVERN_CELL_KEY;
}

function getTavernRandomUnit() {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }
  return Math.random();
}

function normalizeTavernBet(rawValue) {
  const value = Math.floor(Number(rawValue));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function syncTavernModalState(playerIndex = pendingTavernPlayerIndex) {
  const player = players[playerIndex];
  if (!player) return;
  const totalGold = getTotalGold(player);
  if (tavernGoldValue) tavernGoldValue.textContent = String(totalGold);
  if (tavernDrinkBeerBtn) tavernDrinkBeerBtn.disabled = totalGold < TAVERN_BEER_COST;
  if (tavernWheelBtn) {
    tavernWheelBtn.disabled = (player.tavernWheelPlaysThisTurn || 0) >= TAVERN_WHEEL_MAX_PLAYS_PER_TURN;
  }
  if (tavernDragonBtn) {
    tavernDragonBtn.disabled = (player.tavernDragonPlaysThisTurn || 0) >= TAVERN_DRAGON_MAX_PLAYS_PER_TURN;
  }
}

function syncTavernWheelModalState(playerIndex = pendingTavernPlayerIndex) {
  const player = players[playerIndex];
  if (!player) return;
  const totalGold = getTotalGold(player);
  const plays = Math.max(0, player.tavernWheelPlaysThisTurn || 0);
  if (tavernWheelGoldValue) tavernWheelGoldValue.textContent = String(totalGold);
  if (tavernWheelPlaysValue) tavernWheelPlaysValue.textContent = `${plays} / ${TAVERN_WHEEL_MAX_PLAYS_PER_TURN}`;
  const bet = normalizeTavernBet(tavernWheelBetInput?.value);
  if (tavernWheelSpinBtn) {
    tavernWheelSpinBtn.disabled = tavernWheelVisualInProgress ||
      Boolean(tavernWheelRound) ||
      plays >= TAVERN_WHEEL_MAX_PLAYS_PER_TURN ||
      !tavernWheelSelectedColor ||
      bet <= 0 ||
      bet > totalGold;
  }
  tavernWheelColorButtons.forEach(button => {
    button.disabled = tavernWheelVisualInProgress || Boolean(tavernWheelRound);
    button.classList.toggle("is-selected", button.dataset.tavernWheelColor === tavernWheelSelectedColor);
  });
  if (tavernWheelBetInput) tavernWheelBetInput.disabled = tavernWheelVisualInProgress || Boolean(tavernWheelRound);
  if (tavernWheelBackBtn) tavernWheelBackBtn.disabled = tavernWheelVisualInProgress || Boolean(tavernWheelRound);
}

function syncTavernDragonModalState(playerIndex = pendingTavernPlayerIndex) {
  const player = players[playerIndex];
  if (!player) return;
  const totalGold = getTotalGold(player);
  const plays = Math.max(0, player.tavernDragonPlaysThisTurn || 0);
  const bet = normalizeTavernBet(tavernDragonBetInput?.value);
  const roundActive = tavernDragonVisualInProgress || Boolean(tavernDragonRound);
  if (tavernDragonGoldValue) tavernDragonGoldValue.textContent = String(totalGold);
  if (tavernDragonPlaysValue) tavernDragonPlaysValue.textContent = `${plays} / ${TAVERN_DRAGON_MAX_PLAYS_PER_TURN}`;
  if (tavernDragonBetInput) tavernDragonBetInput.disabled = roundActive;
  if (tavernDragonStartBtn) {
    tavernDragonStartBtn.disabled = roundActive ||
      plays >= TAVERN_DRAGON_MAX_PLAYS_PER_TURN ||
      bet <= 0 ||
      bet > totalGold;
  }
  if (tavernDragonCashoutBtn) tavernDragonCashoutBtn.disabled = !roundActive;
  if (tavernDragonBackBtn) tavernDragonBackBtn.disabled = roundActive;
}

function openTavernModal(playerIndex) {
  if (!tavernModal || !isPlayerAtTavern(playerIndex)) return;
  pendingTavernPlayerIndex = playerIndex;
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showTavernModal", { playerIndex });
    return;
  }
  if (tavernStatus) tavernStatus.textContent = "";
  syncTavernModalState(playerIndex);
  tavernWheelModal.style.display = "none";
  tavernDragonModal.style.display = "none";
  tavernModal.style.display = "flex";
}

function closeTavernModal() {
  if (tavernWheelVisualInProgress || tavernDragonVisualInProgress || tavernWheelRound || tavernDragonRound) return;
  if (tavernModal) tavernModal.style.display = "none";
  if (tavernWheelModal) tavernWheelModal.style.display = "none";
  if (tavernDragonModal) tavernDragonModal.style.display = "none";
  pendingTavernPlayerIndex = null;
  resumeTurnFlowAfterModalChange();
}

function openTavernWheelModal() {
  if (pendingTavernPlayerIndex === null || !isPlayerAtTavern(pendingTavernPlayerIndex)) return;
  tavernWheelSelectedColor = null;
  if (tavernWheelBetInput) tavernWheelBetInput.value = "";
  if (tavernWheelStatus) tavernWheelStatus.textContent = "Выберите цвет и укажите ставку.";
  if (tavernModal) tavernModal.style.display = "none";
  if (tavernWheelModal) tavernWheelModal.style.display = "flex";
  syncTavernWheelModalState();
}

function returnFromTavernWheel() {
  if (tavernWheelVisualInProgress || tavernWheelRound) return;
  if (tavernWheelModal) tavernWheelModal.style.display = "none";
  if (tavernModal) tavernModal.style.display = "flex";
  syncTavernModalState();
}

function openTavernDragonModal() {
  if (pendingTavernPlayerIndex === null || !isPlayerAtTavern(pendingTavernPlayerIndex)) return;
  if (tavernDragonBetInput) tavernDragonBetInput.value = "";
  if (tavernDragonStatus) tavernDragonStatus.textContent = "Сделайте ставку и следите за коэффициентом.";
  if (dragonCrashMultiplier) dragonCrashMultiplier.textContent = "1.00×";
  if (dragonCrashStage) dragonCrashStage.classList.remove("is-running", "is-crashed", "is-cashed-out");
  if (tavernModal) tavernModal.style.display = "none";
  if (tavernDragonModal) tavernDragonModal.style.display = "flex";
  syncTavernDragonModalState();
}

function returnFromTavernDragon() {
  if (tavernDragonVisualInProgress || tavernDragonRound) return;
  if (tavernDragonModal) tavernDragonModal.style.display = "none";
  if (tavernModal) tavernModal.style.display = "flex";
  syncTavernModalState();
}

function drinkTavernBeer(playerIndex = pendingTavernPlayerIndex) {
  const player = players[playerIndex];
  if (!player || playerIndex !== currentPlayerIndex || !isPlayerAtTavern(playerIndex)) return false;
  if (getTotalGold(player) < TAVERN_BEER_COST) return false;
  spendGold(player, TAVERN_BEER_COST);
  player.beerProtectionTurnsRemaining = TAVERN_BEER_PROTECTION_TURNS;
  player.beerSlowTurnsRemaining = 0;
  player.beerEffectStartedTurn = turnCounter;
  player.invulnTurnsRemaining = Math.max(
    player.invulnTurnsRemaining || 0,
    TAVERN_BEER_PROTECTION_TURNS
  );
  updatePlayerResources(playerIndex);
  syncTavernModalState(playerIndex);
  showPrivatePickupToastForPlayer(
    playerIndex,
    `Пиво выпито: ${TAVERN_BEER_PROTECTION_TURNS} ходов неприкосновенности. Затем ${TAVERN_BEER_SLOW_TURNS} ходов −${TAVERN_BEER_SLOW_PENALTY} к броску.`
  );
  if (typeof emitStateNow === "function") emitStateNow(true);
  return true;
}

function beginTavernWheelSpinVisual(payload = {}) {
  tavernWheelVisualInProgress = true;
  if (tavernModal) tavernModal.style.display = "none";
  if (tavernWheelModal) tavernWheelModal.style.display = "flex";
  if (tavernWheelStatus) tavernWheelStatus.textContent = "Колесо вращается...";
  const landingIndex = Math.max(0, Math.min(11, Number(payload.landingIndex) || 0));
  if (tavernFortuneWheel) {
    tavernFortuneWheel.style.transition = "none";
    tavernFortuneWheel.style.transform = "rotate(0deg)";
    void tavernFortuneWheel.offsetWidth;
    const landingAngle = landingIndex * 30 + 15;
    tavernFortuneWheel.style.transition = `transform ${TAVERN_WHEEL_SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.72, 0.12, 1)`;
    tavernFortuneWheel.style.transform = `rotate(${1440 + 360 - landingAngle}deg)`;
  }
  syncTavernWheelModalState();
}

function finishTavernWheelSpinVisual(payload = {}) {
  tavernWheelVisualInProgress = false;
  const colorLabel = payload.outcomeColor === "red" ? "красное" : "чёрное";
  if (tavernWheelStatus) {
    tavernWheelStatus.textContent = payload.won
      ? `Выпало ${colorLabel}. Победа: +${payload.payout || 0} золота.`
      : `Выпало ${colorLabel}. Ставка проиграна.`;
  }
  syncTavernWheelModalState();
}

function startTavernWheelSpin(playerIndex, rawBet, chosenColor) {
  const player = players[playerIndex];
  const bet = normalizeTavernBet(rawBet);
  const color = chosenColor === "red" || chosenColor === "black" ? chosenColor : null;
  if (!player || playerIndex !== currentPlayerIndex || !isPlayerAtTavern(playerIndex)) return false;
  if (tavernWheelRound || (player.tavernWheelPlaysThisTurn || 0) >= TAVERN_WHEEL_MAX_PLAYS_PER_TURN) return false;
  if (!color || bet <= 0 || getTotalGold(player) < bet) return false;

  spendGold(player, bet);
  player.tavernWheelPlaysThisTurn = (player.tavernWheelPlaysThisTurn || 0) + 1;
  const outcomeColor = getTavernRandomUnit() < 0.5 ? "red" : "black";
  const matchingIndexes = outcomeColor === "red" ? [0, 2, 4, 6, 8, 10] : [1, 3, 5, 7, 9, 11];
  const landingIndex = matchingIndexes[Math.floor(getTavernRandomUnit() * matchingIndexes.length)];
  const round = {
    id: ++tavernGameSequenceId,
    playerIndex,
    bet,
    chosenColor: color,
    outcomeColor,
    landingIndex
  };
  tavernWheelRound = round;
  updatePlayerResources(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "startTavernWheelSpin", { landingIndex, chosenColor: color });
  } else {
    beginTavernWheelSpinVisual({ landingIndex, chosenColor: color });
  }
  if (typeof emitStateNow === "function") emitStateNow(true);

  if (tavernWheelResolveTimer) clearTimeout(tavernWheelResolveTimer);
  tavernWheelResolveTimer = setTimeout(() => {
    tavernWheelResolveTimer = null;
    if (!tavernWheelRound || tavernWheelRound.id !== round.id) return;
    const won = round.chosenColor === round.outcomeColor;
    const payout = won ? round.bet * 2 : 0;
    if (payout > 0) player.pocket.gold += payout;
    tavernWheelRound = null;
    updatePlayerResources(playerIndex);
    const resultPayload = { won, payout, outcomeColor: round.outcomeColor };
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "finishTavernWheelSpin", resultPayload);
    } else {
      finishTavernWheelSpinVisual(resultPayload);
    }
    if (typeof emitStateNow === "function") emitStateNow(true);
  }, TAVERN_WHEEL_SPIN_DURATION_MS);
  return true;
}

function createTavernDragonCrashMultiplier() {
  const unit = Math.min(0.999999, Math.max(0, getTavernRandomUnit()));
  const rawMultiplier = 1 / (1 - unit);
  return Math.min(
    TAVERN_DRAGON_MAX_MULTIPLIER,
    Math.max(1, Math.floor(rawMultiplier * 100) / 100)
  );
}

function getTavernDragonMultiplier(round, now = Date.now()) {
  if (!round) return 1;
  const elapsed = Math.max(0, now - round.startedAt);
  return Math.max(1, Math.min(round.crashMultiplier, Math.exp(elapsed / TAVERN_DRAGON_GROWTH_MS)));
}

function beginTavernDragonVisual() {
  tavernDragonVisualInProgress = true;
  tavernDragonVisualStartedAt = performance.now();
  if (tavernModal) tavernModal.style.display = "none";
  if (tavernDragonModal) tavernDragonModal.style.display = "flex";
  if (dragonCrashStage) dragonCrashStage.classList.remove("is-crashed", "is-cashed-out");
  if (dragonCrashStage) dragonCrashStage.classList.add("is-running");
  if (tavernDragonStatus) tavernDragonStatus.textContent = "Дракончик набирает высоту — снимайте вовремя!";
  const animate = timestamp => {
    if (!tavernDragonVisualInProgress) return;
    const elapsed = Math.max(0, timestamp - tavernDragonVisualStartedAt);
    const multiplier = Math.exp(elapsed / TAVERN_DRAGON_GROWTH_MS);
    if (dragonCrashMultiplier) dragonCrashMultiplier.textContent = `${multiplier.toFixed(2)}×`;
    if (dragonCrashSprite) {
      const progress = Math.min(1, Math.log(Math.max(1, multiplier)) / Math.log(12));
      dragonCrashSprite.style.transform = `translate(${progress * 145}px, ${-progress * 74}px) rotate(${-progress * 8}deg)`;
    }
    tavernDragonVisualFrame = requestAnimationFrame(animate);
  };
  if (tavernDragonVisualFrame) cancelAnimationFrame(tavernDragonVisualFrame);
  tavernDragonVisualFrame = requestAnimationFrame(animate);
  syncTavernDragonModalState();
}

function finishTavernDragonVisual(payload = {}) {
  tavernDragonVisualInProgress = false;
  if (tavernDragonVisualFrame) cancelAnimationFrame(tavernDragonVisualFrame);
  tavernDragonVisualFrame = null;
  const multiplier = Math.max(1, Number(payload.multiplier) || 1);
  if (dragonCrashMultiplier) dragonCrashMultiplier.textContent = `${multiplier.toFixed(2)}×`;
  if (dragonCrashStage) {
    dragonCrashStage.classList.remove("is-running", "is-crashed", "is-cashed-out");
    dragonCrashStage.classList.add(payload.won ? "is-cashed-out" : "is-crashed");
  }
  if (dragonCrashSprite) dragonCrashSprite.style.transform = "";
  if (tavernDragonStatus) {
    tavernDragonStatus.textContent = payload.won
      ? `Вы сняли на ${multiplier.toFixed(2)}× и получили ${payload.payout || 0} золота.`
      : `КРАШ на ${multiplier.toFixed(2)}×. Ставка потеряна.`;
  }
  syncTavernDragonModalState();
}

function finishTavernDragonRound(round, cashoutMultiplier = null) {
  if (!round || !tavernDragonRound || tavernDragonRound.id !== round.id) return false;
  if (tavernDragonResolveTimer) clearTimeout(tavernDragonResolveTimer);
  tavernDragonResolveTimer = null;
  const player = players[round.playerIndex];
  const won = Number.isFinite(cashoutMultiplier);
  const resultMultiplier = won ? Math.max(1, cashoutMultiplier) : round.crashMultiplier;
  const payout = won ? Math.max(0, Math.floor(round.bet * resultMultiplier)) : 0;
  if (won && player) player.pocket.gold += payout;
  tavernDragonRound = null;
  if (player) updatePlayerResources(round.playerIndex);
  const resultPayload = { won, payout, multiplier: resultMultiplier };
  if (shouldDelegatePrivateUiToPlayer(round.playerIndex)) {
    emitPrivateUiToPlayer(round.playerIndex, "finishTavernDragon", resultPayload);
  } else {
    finishTavernDragonVisual(resultPayload);
  }
  if (typeof emitStateNow === "function") emitStateNow(true);
  return true;
}

function startTavernDragonGame(playerIndex, rawBet) {
  const player = players[playerIndex];
  const bet = normalizeTavernBet(rawBet);
  if (!player || playerIndex !== currentPlayerIndex || !isPlayerAtTavern(playerIndex)) return false;
  if (tavernDragonRound || (player.tavernDragonPlaysThisTurn || 0) >= TAVERN_DRAGON_MAX_PLAYS_PER_TURN) return false;
  if (bet <= 0 || getTotalGold(player) < bet) return false;

  spendGold(player, bet);
  player.tavernDragonPlaysThisTurn = (player.tavernDragonPlaysThisTurn || 0) + 1;
  const crashMultiplier = createTavernDragonCrashMultiplier();
  const startedAt = Date.now();
  const crashDelay = Math.max(0, Math.log(crashMultiplier) * TAVERN_DRAGON_GROWTH_MS);
  const round = {
    id: ++tavernGameSequenceId,
    playerIndex,
    bet,
    crashMultiplier,
    startedAt,
    crashAt: startedAt + crashDelay
  };
  tavernDragonRound = round;
  updatePlayerResources(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "startTavernDragon", {});
  } else {
    beginTavernDragonVisual();
  }
  if (typeof emitStateNow === "function") emitStateNow(true);
  tavernDragonResolveTimer = setTimeout(() => {
    finishTavernDragonRound(round, null);
  }, Math.max(0, crashDelay));
  return true;
}

function cashOutTavernDragon(playerIndex) {
  const round = tavernDragonRound;
  if (!round || round.playerIndex !== playerIndex || playerIndex !== currentPlayerIndex) return false;
  const now = Date.now();
  if (now >= round.crashAt) {
    return finishTavernDragonRound(round, null);
  }
  const multiplier = getTavernDragonMultiplier(round, now);
  return finishTavernDragonRound(round, multiplier);
}

function resetTavernRuntimeState() {
  if (tavernWheelResolveTimer) clearTimeout(tavernWheelResolveTimer);
  if (tavernDragonResolveTimer) clearTimeout(tavernDragonResolveTimer);
  if (tavernDragonVisualFrame) cancelAnimationFrame(tavernDragonVisualFrame);
  tavernWheelResolveTimer = null;
  tavernDragonResolveTimer = null;
  tavernDragonVisualFrame = null;
  tavernWheelRound = null;
  tavernDragonRound = null;
  tavernWheelVisualInProgress = false;
  tavernDragonVisualInProgress = false;
  tavernWheelSelectedColor = null;
  pendingTavernPlayerIndex = null;
  if (tavernModal) tavernModal.style.display = "none";
  if (tavernWheelModal) tavernWheelModal.style.display = "none";
  if (tavernDragonModal) tavernDragonModal.style.display = "none";
}

if (tavernDrinkBeerBtn) {
  tavernDrinkBeerBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingTavernPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "tavern", actionType: "drinkBeer", playerIndex: pendingTavernPlayerIndex });
      return;
    }
    drinkTavernBeer();
  });
}
if (tavernWheelBtn) tavernWheelBtn.addEventListener("click", openTavernWheelModal);
if (tavernDragonBtn) tavernDragonBtn.addEventListener("click", openTavernDragonModal);
if (tavernCloseBtn) tavernCloseBtn.addEventListener("click", closeTavernModal);
if (tavernWheelBackBtn) tavernWheelBackBtn.addEventListener("click", returnFromTavernWheel);
if (tavernDragonBackBtn) tavernDragonBackBtn.addEventListener("click", returnFromTavernDragon);

tavernWheelColorButtons.forEach(button => {
  button.addEventListener("click", () => {
    if (tavernWheelVisualInProgress) return;
    tavernWheelSelectedColor = button.dataset.tavernWheelColor;
    syncTavernWheelModalState();
  });
});
if (tavernWheelBetInput) tavernWheelBetInput.addEventListener("input", () => syncTavernWheelModalState());
if (tavernDragonBetInput) tavernDragonBetInput.addEventListener("input", () => syncTavernDragonModalState());

if (tavernWheelSpinBtn) {
  tavernWheelSpinBtn.addEventListener("click", () => {
    const bet = normalizeTavernBet(tavernWheelBetInput?.value);
    if (shouldRoutePrivateUiActionToHost(pendingTavernPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "tavern",
        actionType: "spinWheel",
        playerIndex: pendingTavernPlayerIndex,
        payload: { bet, color: tavernWheelSelectedColor }
      });
      return;
    }
    startTavernWheelSpin(pendingTavernPlayerIndex, bet, tavernWheelSelectedColor);
  });
}

if (tavernDragonStartBtn) {
  tavernDragonStartBtn.addEventListener("click", () => {
    const bet = normalizeTavernBet(tavernDragonBetInput?.value);
    if (shouldRoutePrivateUiActionToHost(pendingTavernPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "tavern",
        actionType: "startDragon",
        playerIndex: pendingTavernPlayerIndex,
        payload: { bet }
      });
      return;
    }
    startTavernDragonGame(pendingTavernPlayerIndex, bet);
  });
}

if (tavernDragonCashoutBtn) {
  tavernDragonCashoutBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingTavernPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "tavern", actionType: "cashoutDragon", playerIndex: pendingTavernPlayerIndex });
      return;
    }
    cashOutTavernDragon(pendingTavernPlayerIndex);
  });
}

[tavernModal, tavernWheelModal, tavernDragonModal].forEach(modal => {
  if (!modal) return;
  modal.addEventListener("click", event => {
    if (event.target === modal) closeTavernModal();
  });
});

const cityPoisonBtn = document.querySelector('[data-city-poison="apply-poison"]');

function applyDevTurnValue() {
  if (!devTurnInput) return;
  const raw = Number(devTurnInput.value);
  if (!Number.isFinite(raw)) return;
  turnCounter = Math.max(0, Math.floor(raw));
  updateTurnUI();
}

function skipDevTurns() {
  if (!devSkipInput) return;
  const raw = Number(devSkipInput.value);
  if (!Number.isFinite(raw)) return;
  const count = Math.max(0, Math.floor(raw));
  for (let i = 0; i < count; i += 1) {
    if (gameEnded) break;
    endTurn();
  }
}

if (devTurnApply) {
  devTurnApply.addEventListener("click", applyDevTurnValue);
}
if (devSkipApply) {
  devSkipApply.addEventListener("click", skipDevTurns);
}

function enableTestMode() {
  testModeEnabled = true;
  players.forEach((player, index) => {
    player.resources.gold = 0;
    player.resources.army = 0;
    player.resources.influence = 0;
    player.resources.resources = 0;
    player.pocket.gold = 20000;
    player.pocket.army = 200;
    player.pocket.resources = 5000;
    updatePlayerResources(index);
  });
  showPickupToast("Тестовый режим включен.");
}

function disableTestMode() {
  testModeEnabled = false;
  players.forEach((player, index) => {
    player.resources.gold = 0;
    player.resources.army = 0;
    player.resources.influence = 0;
    player.resources.resources = 0;
    player.pocket.gold = 0;
    player.pocket.army = 0;
    player.pocket.resources = 0;
    updatePlayerResources(index);
  });
  showPickupToast("???????? ????? ????????. ??????? ????????.");
}

function updateRobberToggleButtons() {
  if (disableRobbersBtn) disableRobbersBtn.disabled = true;
  if (enableRobbersBtn) enableRobbersBtn.disabled = true;
}

function setRobbersEnabled(nextValue) {
  robbersEnabled = false;
  if (!robbersEnabled) {
    robberEvent = null;
    robberAmbushThisSession = false;
    hideRobberModal();
  }
  updateRobberToggleButtons();
  showPickupToast("Разбойники отключены.");
  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
}


if (testModeBtn) {
  testModeBtn.addEventListener("click", enableTestMode);
}
if (disableTestModeBtn) {
  disableTestModeBtn.addEventListener("click", disableTestMode);
}
if (disableRobbersBtn) {
  disableRobbersBtn.addEventListener("click", () => setRobbersEnabled(false));
}
if (enableRobbersBtn) {
  enableRobbersBtn.addEventListener("click", () => setRobbersEnabled(true));
}
updateRobberToggleButtons();

function recalcPlayerResourceIncome(playerIndex) {
  const player = players[playerIndex];
  if (!player) return 0;
  let total = 0;
  Object.entries(castleOwnersByKey).forEach(([key, owner]) => {
    if (owner === playerIndex) {
      const stats = ensureCastleStats(key);
      if (stats.lumber && !isSpecialFeatureDisabled(playerIndex, "lumber", key)) {
        total += CASTLE_FEATURES.lumber.income;
      }
      if ((stats.mineLevel || 0) >= 1 && !isSpecialFeatureDisabled(playerIndex, "mine", key)) {
        total += CASTLE_FEATURES.mine.income;
      }
      if ((stats.mineLevel || 0) >= 2 && !isSpecialFeatureDisabled(playerIndex, "mine", key)) {
        total += CASTLE_MINE_LEVEL_2_INCOME;
      }
      if (stats.clay && !isSpecialFeatureDisabled(playerIndex, "clay", key)) {
        total += CASTLE_FEATURES.clay.income;
      }
    }
  });
  player.income.resources = total;
  const panel = playerPanels[playerIndex];
  if (panel) {
    const incomeSpan = panel.querySelector('[data-income="resources"]');
    if (incomeSpan) {
      incomeSpan.textContent = `+${total}`;
    }
  }
  return total;
}

function collectCastleIncomes(playerIndex) {
  const player = players[playerIndex];
  if (!player) return 0;
  const income = recalcPlayerResourceIncome(playerIndex);
  if (income > 0) {
    player.resources.resources += income;
    updatePlayerResources(playerIndex);
  }
  return income;
}

let barracksPlayerIndex = null;
let lavkaPlayerIndex = null;
let workshopPlayerIndex = null;
let hirePlayerIndex = null;

const mercenaries = [];
let mercenaryIdCounter = 1;
const HIRE_ATTACK_COSTS = {
  lumber: 250,
  mine: 500,
  clay: 750
};
const MERCENARY_ATTACK_STRENGTHS = {
  lumber: 8,
  mine: 13,
  clay: 18
};
const thieves = [];
let thiefIdCounter = 1;
const cutthroats = [];
let cutthroatIdCounter = 1;
const THIEF_SPEED = 7;
const THIEF_CASTLE_GOLD_LOSS = 1000;
const CUTTHROAT_SPEED = 5;
const CUTTHROAT_KILL_MIN = 13;
const CUTTHROAT_KILL_MAX = 16;
const CUTTHROAT_COST = 750;
let repairPending = null;
let gameEnded = false;

function showGameOver(winnerIndex) {
  gameEnded = true;
  gameWinnerIndex = typeof winnerIndex === "number" ? winnerIndex : null;
  if (rollBtn) rollBtn.disabled = true;
  const winnerLabel = typeof winnerIndex === "number" ? `Победил Игрок ${winnerIndex + 1}` : "Игра окончена";
  if (gameOverText) gameOverText.textContent = winnerLabel;
  if (gameOverModal) gameOverModal.style.display = "flex";
}

function hideGameOver() {
  if (gameOverModal) gameOverModal.style.display = "none";
}

function getCastleBaseKeyForPos(x, y) {
  const castles = importantNodes.filter(node => node.type === "castle");
  for (const castle of castles) {
    if (x >= castle.x && x <= castle.x + 1 && y >= castle.y && y <= castle.y + 1) {
      return `${castle.x},${castle.y}`;
    }
  }
  return null;
}

function getDragonBaseKeyForPos(x, y) {
  const dragons = importantNodes.filter(node => node.type === "dragon");
  for (const dragon of dragons) {
    if (x >= dragon.x && x <= dragon.x + 1 && y >= dragon.y && y <= dragon.y + 1) {
      return `${dragon.x},${dragon.y}`;
    }
  }
  return null;
}

let gameTimerSeconds = 0;
const GAME_TIMER_LABEL = "ВРЕМЯ";
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

if (gameTimerDisplay) {
  gameTimerDisplay.textContent = `${GAME_TIMER_LABEL}: ${formatTime(gameTimerSeconds)}`;
  setInterval(() => {
    if (gameEnded) return;
    gameTimerSeconds += 1;
    gameTimerDisplay.textContent = `${GAME_TIMER_LABEL}: ${formatTime(gameTimerSeconds)}`;
  }, 1000);
}

function getTotalGold(player) {
  return (player.resources.gold || 0) + (player.pocket.gold || 0);
}

function getDiscountedGoldCost(player, baseCost) {
  return getDiscountedGoldCostForScope(player, baseCost);
}

function getDiscountedGoldCostForScope(player, baseCost, scope = "general") {
  let cost = Number(baseCost) || 0;
  const discountRate = getPlayerGoldDiscountRate(player, scope);
  if (discountRate > 0) {
    cost = Math.round(cost * (1 - discountRate));
  }
  if (isWorldEventActive(WORLD_EVENTS.goldTax.key)) {
    cost = Math.round(cost * WORLD_EVENT_GOLD_TAX_MULTIPLIER);
  }
  if (getTimeOfDay().key === "night" && (scope === "barracks" || scope === "lavka" || scope === "workshop")) {
    cost = Math.round(cost * 1.15);
  }
  return Math.max(0, cost);
}

function setTradePrice(btn, html) {
  if (!btn) return;
  const price = btn.querySelector(".trade-price");
  if (price) {
    price.innerHTML = html;
  }
}

function goldPriceHtml(cost) {
  return `<img class="price-icon" src="assets/icons/icon-gold.png" alt="Золото" />Цена: ${cost} золота`;
}

function getFlashPriceSelector(btn) {
  if (!btn) return null;
  if (btn.id) return `#${btn.id}`;

  const dataKeys = [
    "buy",
    "lavkaBuy",
    "workshopBuy",
    "hire",
    "cityReward",
    "cityExchange",
    "castleFeature"
  ];
  for (const key of dataKeys) {
    const value = btn.dataset?.[key];
    if (!value) continue;
    const attr = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
    return `[data-${attr}="${value}"]`;
  }
  return null;
}

function flashPrice(btn, amountText, iconSrc, iconAlt) {
  if (!btn) return;
  const privatePlayerIndex =
    typeof currentPrivateUiPlayerIndex === "number" ? currentPrivateUiPlayerIndex : null;
  if (
    privatePlayerIndex !== null &&
    typeof shouldDelegatePrivateUiToPlayer === "function" &&
    shouldDelegatePrivateUiToPlayer(privatePlayerIndex) &&
    typeof emitPrivateUiToPlayer === "function"
  ) {
    const selector = getFlashPriceSelector(btn);
    if (selector) {
      setTimeout(() => {
        emitPrivateUiToPlayer(privatePlayerIndex, "flashPrice", {
          selector,
          amountText,
          iconSrc,
          iconAlt
        });
      }, 0);
      return;
    }
  }
  const flash = document.createElement("span");
  flash.className = "price-flash";
  flash.innerHTML =
    `<span class="price-minus">-${amountText}</span>` +
    `<img class="price-icon" src="${iconSrc}" alt="${iconAlt || ""}" />`;
  const attachFlash = () => {
    const target = btn.querySelector(".trade-price") || btn;
    if (!target || !btn.isConnected) return;
    target.appendChild(flash);
    setTimeout(() => {
      flash.remove();
    }, 900);
  };
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => requestAnimationFrame(attachFlash));
  } else {
    setTimeout(attachFlash, 0);
  }
}

function spendGold(player, amount) {
  let remaining = Math.max(0, amount);
  const fromPocket = Math.min(player.pocket.gold || 0, remaining);
  player.pocket.gold -= fromPocket;
  remaining -= fromPocket;
  if (remaining > 0) {
    player.resources.gold = Math.max(0, (player.resources.gold || 0) - remaining);
  }
}

function getTotalResources(player) {
  return (player.resources.resources || 0) + (player.pocket.resources || 0);
}

function spendResources(player, amount) {
  let remaining = Math.max(0, amount);
  const fromPocket = Math.min(player.pocket.resources || 0, remaining);
  player.pocket.resources -= fromPocket;
  remaining -= fromPocket;
  if (remaining > 0) {
    player.resources.resources = Math.max(0, (player.resources.resources || 0) - remaining);
  }
}

function getFirstOwnedCastleKey(playerIndex) {
  return Object.keys(castleOwnersByKey).find(key => castleOwnersByKey[key] === playerIndex) || null;
}

function addArmyToOwnedCastle(playerIndex, amount) {
  const castleKey = getFirstOwnedCastleKey(playerIndex);
  if (!castleKey) return false;
  const stats = ensureCastleStats(castleKey);
  stats.storageArmy = (stats.storageArmy || 0) + amount;
  if (castleModalKey === castleKey && castleModalPlayerIndex === playerIndex) {
    refreshCastleModal(castleKey, playerIndex);
  }
  return true;
}

function grantPurchasedArmy(playerIndex, amount) {
  const player = players[playerIndex];
  if (player) {
    player.pocket.army += amount;
    showPrivatePickupToastForPlayer(playerIndex, `В карман: +${amount} войск`);
  }
  return "pocket";
}

function ensureSwordIconOnCastle(playerIndex) {
  const key = getFirstOwnedCastleKey(playerIndex);
  if (!key) return false;
  const cell = grid[key];
  if (!cell) return false;
  if (cell.querySelector(".castle-sword")) return true;
  const icon = document.createElement("div");
  icon.className = "castle-sword";
  icon.textContent = "М";
  cell.appendChild(icon);
  return true;
}

function syncBarracksModalState(playerIndex) {
  barracksPlayerIndex = playerIndex;
  const player = players[playerIndex];
  if (!player) return;
  const gold = getTotalGold(player);
  const cost50 = getDiscountedGoldCostForScope(player, 2000, "barracks");
  const cost130 = getDiscountedGoldCostForScope(player, 4000, "barracks");
  barracksButtons.forEach(btn => {
    const type = btn.getAttribute("data-buy");
    if (type === "army-50") btn.disabled = gold < cost50;
    if (type === "army-130") btn.disabled = gold < cost130;
    if (type === "army-100-infl") btn.disabled = player.pocket.army < 100;
    if (type === "army-50") setTradePrice(btn, goldPriceHtml(cost50));
    if (type === "army-130") setTradePrice(btn, goldPriceHtml(cost130));
  });
}

function openBarracks(playerIndex) {
  if (isMerchantsStrikeActive()) {
    showPrivatePickupToastForPlayer(playerIndex, "Торговцы бастуют и не продают товары.");
    return;
  }
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showBarracksModal", { playerIndex });
    return;
  }
  syncBarracksModalState(playerIndex);
  barracksModal.style.display = "flex";
}

function closeBarracks() {
  barracksModal.style.display = "none";
  barracksPlayerIndex = null;
  resumeTurnFlowAfterModalChange();
}

barracksClose.addEventListener("click", closeBarracks);
barracksModal.addEventListener("click", (e) => {
  if (e.target === barracksModal) closeBarracks();
});

barracksButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(barracksPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "barracks",
        actionType: "buy",
        playerIndex: barracksPlayerIndex,
        payload: { buyType: btn.getAttribute("data-buy") }
      });
      return;
    }
    if (barracksPlayerIndex === null) return;
    const player = players[barracksPlayerIndex];
    const type = btn.getAttribute("data-buy");
    if (type === "army-50") {
      const cost = getDiscountedGoldCostForScope(player, 2000, "barracks");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      grantPurchasedArmy(barracksPlayerIndex, 50);
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    if (type === "army-130") {
      const cost = getDiscountedGoldCostForScope(player, 4000, "barracks");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      grantPurchasedArmy(barracksPlayerIndex, 130);
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    if (type === "army-100-infl") {
      if (player.pocket.army < 100) return;
      player.pocket.army -= 100;
      player.resources.influence += 300;
      showPickupToast("Получено 300 влияния.");
      flashPrice(btn, 100, "assets/icons/icon-army.png", "Войска");
    }
    updatePlayerResources(barracksPlayerIndex);
    openBarracks(barracksPlayerIndex);
  });
});

function syncLavkaModalState(playerIndex) {
  lavkaPlayerIndex = playerIndex;
  const player = players[playerIndex];
  if (!player) return;
  const gold = getTotalGold(player);
  const costPotion = getDiscountedGoldCostForScope(player, 250, "lavka");
  const costBoots = getDiscountedGoldCostForScope(player, 1500, "lavka");
  lavkaButtons.forEach(btn => {
    const type = btn.getAttribute("data-lavka-buy");
    if (type === "res-1000-infl") btn.disabled = getTotalResources(player) < 1000;
    if (type === "boots") btn.disabled = gold < costBoots || (player.rainbowStoneCount || 0) <= 0;
    if (type === "potion-invis") btn.disabled = gold < costPotion;
    if (type === "potion-luck") btn.disabled = gold < costPotion;
    if (type === "boots") {
      setTradePrice(
        btn,
        `${goldPriceHtml(costBoots)} + <img class="price-icon" src="assets/icons/rainbow_stone.png" alt="Радужный камень" />Радужный камень`
      );
    }
    if (type === "potion-invis") setTradePrice(btn, goldPriceHtml(costPotion));
    if (type === "potion-luck") setTradePrice(btn, goldPriceHtml(costPotion));
    if (type === "potion-invuln") {
      btn.parentElement.style.display = isDayBuffActive("invulnPotion") ? "" : "none";
      if (isDayBuffActive("invulnPotion")) {
        const costInvuln = getDiscountedGoldCostForScope(player, 750, "lavka");
        setTradePrice(btn, goldPriceHtml(costInvuln));
        btn.disabled = gold < costInvuln;
      }
    }
  });
}

function openLavka(playerIndex) {
  if (isMerchantsStrikeActive()) {
    showPrivatePickupToastForPlayer(playerIndex, "Торговцы бастуют и не продают товары.");
    return;
  }
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showLavkaModal", { playerIndex });
    return;
  }
  syncLavkaModalState(playerIndex);
  lavkaModal.style.display = "flex";
}

function closeLavka() {
  lavkaModal.style.display = "none";
  lavkaPlayerIndex = null;
  resumeTurnFlowAfterModalChange();
}

lavkaClose.addEventListener("click", closeLavka);
lavkaModal.addEventListener("click", (e) => {
  if (e.target === lavkaModal) closeLavka();
});

lavkaButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(lavkaPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "lavka",
        actionType: "buy",
        playerIndex: lavkaPlayerIndex,
        payload: { buyType: btn.getAttribute("data-lavka-buy") }
      });
      return;
    }
    if (lavkaPlayerIndex === null) return;
    const player = players[lavkaPlayerIndex];
    const type = btn.getAttribute("data-lavka-buy");
    if (type === "res-1000-infl") {
      if (getTotalResources(player) < 1000) return;
      spendResources(player, 1000);
      player.resources.influence += 300;
      showPickupToast("Получено 300 влияния.");
      flashPrice(btn, 1000, "assets/icons/icon-resources.png", "Ресурсы");
    }
    if (type === "boots") {
      const cost = getDiscountedGoldCostForScope(player, 1500, "lavka");
      if (getTotalGold(player) < cost || (player.rainbowStoneCount || 0) <= 0) return;
      spendGold(player, cost);
      player.rainbowStoneCount -= 1;
      player.bootsCount = (player.bootsCount || 0) + 1;
      showPickupToast("Сапоги добавлены в инвентарь.");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
      flashPrice(btn, 1, "assets/icons/rainbow_stone.png", "Радужный камень");
    }
    if (type === "potion-invis") {
      const cost = getDiscountedGoldCostForScope(player, 250, "lavka");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      player.invisPotionCount = (player.invisPotionCount || 0) + 1;
      showPickupToast("Зелье невидимости добавлено в инвентарь.");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    if (type === "potion-luck") {
      const cost = getDiscountedGoldCostForScope(player, 250, "lavka");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      player.luckPotionCount = (player.luckPotionCount || 0) + 1;
      showPickupToast("Зелье удачи добавлено в инвентарь.");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    if (type === "potion-invuln") {
      const cost = getDiscountedGoldCostForScope(player, 750, "lavka");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      player.invulnPotionCount = (player.invulnPotionCount || 0) + 1;
      showPickupToast("Зелье неприкосновенности добавлено в инвентарь.");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    updatePlayerResources(lavkaPlayerIndex);
    openLavka(lavkaPlayerIndex);
  });
});

function syncWorkshopModalState(playerIndex) {
  const player = players[playerIndex];
  if (!player) return;
  workshopPlayerIndex = playerIndex;
  const gold = getTotalGold(player);
  const resources = getTotalResources(player);
  const costArmor = getDiscountedGoldCostForScope(player, 1500, "workshop");
  const costSword = getDiscountedGoldCostForScope(player, 2500, "workshop");
  const costHeroSword = getDiscountedGoldCostForScope(player, 6000, "workshop");
  const costHarpoonGold = getDiscountedGoldCostForScope(player, HARPOON_GOLD_COST, "workshop");
  workshopButtons.forEach(btn => {
    const type = btn.getAttribute("data-workshop-buy");
    if (type === "armor") btn.disabled = gold < costArmor || player.hasArmor === true;
    if (type === "sword") btn.disabled = gold < costSword || player.hasWorkshopSword === true;
    if (type === "hero-sword") btn.disabled = gold < costHeroSword || player.hasSword === true || (player.rainbowStoneCount || 0) <= 0 || (player.heroHiltCount || 0) <= 0;
    if (type === "harpoon") btn.disabled = gold < costHarpoonGold || resources < HARPOON_RESOURCE_COST || (player.harpoonCount || 0) > 0;
    if (type === "rainbow-infl") btn.disabled = (player.rainbowStoneCount || 0) <= 0;
    if (type === "castle-armor") {
      btn.parentElement.style.display = isDayBuffActive("carpenter") ? "" : "none";
      if (isDayBuffActive("carpenter")) {
        const costCastleArmor = getDiscountedGoldCostForScope(player, 1500, "workshop");
        setTradePrice(btn, goldPriceHtml(costCastleArmor));
        btn.disabled = gold < costCastleArmor;
      }
    }
    if (type === "armor") setTradePrice(btn, goldPriceHtml(costArmor));
    if (type === "sword") setTradePrice(btn, goldPriceHtml(costSword));
    if (type === "hero-sword") {
      setTradePrice(
        btn,
        `${goldPriceHtml(costHeroSword)} + <img class="price-icon" src="assets/icons/rainbow_stone.png" alt="Радужный камень" />Радужный камень + <img class="price-icon" src="assets/icons/hero_hilt.png" alt="Рукоять" />Рукоять`
      );
    }
    if (type === "harpoon") {
      setTradePrice(
        btn,
        `<img class="price-icon" src="assets/icons/icon-gold.png" alt="Золото" />Цена: ${costHarpoonGold} золота + <img class="price-icon" src="assets/icons/icon-resources.png" alt="Ресурсы" />${HARPOON_RESOURCE_COST} ресурсов`
      );
    }
  });
}

function openWorkshop(playerIndex) {
  if (isMerchantsStrikeActive()) {
    showPrivatePickupToastForPlayer(playerIndex, "Торговцы бастуют и не продают товары.");
    return;
  }
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showWorkshopModal", { playerIndex });
    return;
  }
  syncWorkshopModalState(playerIndex);
  workshopModal.style.display = "flex";
}

function closeWorkshop() {
  workshopModal.style.display = "none";
  workshopPlayerIndex = null;
  resumeTurnFlowAfterModalChange();
}

workshopClose.addEventListener("click", closeWorkshop);
workshopModal.addEventListener("click", (e) => {
  if (e.target === workshopModal) closeWorkshop();
});

workshopButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(workshopPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "workshop",
        actionType: "buy",
        playerIndex: workshopPlayerIndex,
        payload: { buyType: btn.getAttribute("data-workshop-buy") }
      });
      return;
    }
    if (workshopPlayerIndex === null) return;
    const player = players[workshopPlayerIndex];
    const type = btn.getAttribute("data-workshop-buy");
    if (type === "armor" && !player.hasArmor) {
      const cost = getDiscountedGoldCostForScope(player, 1500, "workshop");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      player.hasArmor = true;
      player.attack += 7;
      showPickupToast("Доспехи: +7 атаки");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    if (type === "sword" && !player.hasWorkshopSword) {
      const cost = getDiscountedGoldCostForScope(player, 2500, "workshop");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      player.hasWorkshopSword = true;
      player.attack += 12;
      showPickupToast("Меч: +12 атаки");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    if (type === "hero-sword" && !player.hasSword) {
      const cost = getDiscountedGoldCostForScope(player, 6000, "workshop");
      if (getTotalGold(player) < cost || (player.rainbowStoneCount || 0) <= 0 || (player.heroHiltCount || 0) <= 0) return;
      spendGold(player, cost);
      player.rainbowStoneCount -= 1;
      player.heroHiltCount -= 1;
      player.hasSword = true;
      ensureSwordIconOnCastle(workshopPlayerIndex);
      showPickupToast("Меч героя приобретен");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
      flashPrice(btn, 1, "assets/icons/rainbow_stone.png", "Радужный камень");
      flashPrice(btn, 1, "assets/icons/hero_hilt.png", "Рукоять");
    }
    if (type === "harpoon") {
      const goldCost = getDiscountedGoldCostForScope(player, HARPOON_GOLD_COST, "workshop");
      if (getTotalGold(player) < goldCost || getTotalResources(player) < HARPOON_RESOURCE_COST) return;
      spendGold(player, goldCost);
      spendResources(player, HARPOON_RESOURCE_COST);
      player.harpoonCount = 1;
      updateInventory(workshopPlayerIndex);
      showPickupToast("Горпун добавлен в инвентарь.");
      flashPrice(btn, goldCost, "assets/icons/icon-gold.png", "Золото");
      flashPrice(btn, HARPOON_RESOURCE_COST, "assets/icons/icon-resources.png", "Ресурсы");
    }
    if (type === "rainbow-infl") {
      if ((player.rainbowStoneCount || 0) <= 0) return;
      player.rainbowStoneCount -= 1;
      player.resources.influence += 300;
      showPickupToast("Получено 300 влияния.");
      flashPrice(btn, 1, "assets/icons/rainbow_stone.png", "Радужный камень");
    }
    if (type === "castle-armor") {
      const castleKey = getFirstOwnedCastleKey(workshopPlayerIndex);
      if (!castleKey) return;
      const cost = getDiscountedGoldCostForScope(player, 1500, "workshop");
      if (getTotalGold(player) < cost) return;
      spendGold(player, cost);
      const stats = ensureCastleStats(castleKey);
      stats.armorCurrent = (stats.armorCurrent || 0) + 50;
      if (typeof updateCastleBars === "function") updateCastleBars(castleKey);
      showPickupToast("Замок укреплен: +50 брони.");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
      if (typeof updateCastleBadge === "function") updateCastleBadge(castleKey);
    }
    updatePlayerResources(workshopPlayerIndex);
    openWorkshop(workshopPlayerIndex);
  });
});

function getHireBasePosition() {
  const hireNode = importantNodes.find(n => n.id === 6);
  if (!hireNode) return null;
  return { x: hireNode.x, y: hireNode.y };
}

function getMercenaryAtKey(key) {
  return mercenaries.find(entry => entry.key === key) || null;
}

function setCellToMercenary(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("important", "mercenary");
  cell.textContent = "";
  setCellIcon(cell, "mercenary_unit.png", "Наёмники");
  return true;
}

function clearMercenaryCell(x, y) {
  setCellToInactive(x, y);
}

function getCutthroatAtKey(key) {
  return cutthroats.find(entry => entry.key === key) || null;
}

function setCellToCutthroat(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("important", "cutthroat");
  cell.textContent = "";
  setCellIcon(cell, "cutthroat.png", "Головорезы");
  return true;
}

function clearCutthroatCell(x, y) {
  setCellToInactive(x, y);
}

function getThiefAtKey(key) {
  return thieves.find(entry => entry.key === key) || null;
}

function setCellToThief(x, y) {
  const key = `${x},${y}`;
  const cell = grid[key];
  if (!cell) return false;
  cell.classList.remove("inactive");
  cell.classList.add("important", "thief");
  cell.textContent = "";
  setCellIcon(cell, "thief.png", "Вор");
  return true;
}

function clearThiefCell(x, y) {
  setCellToInactive(x, y);
}

function findHireSpawnCell() {
  const base = getHireBasePosition();
  if (!base) return null;
  const candidates = [
    { x: base.x + 1, y: base.y },
    { x: base.x - 1, y: base.y },
    { x: base.x, y: base.y + 1 },
    { x: base.x, y: base.y - 1 }
  ];
  for (const pos of candidates) {
    if (pos.x < 0 || pos.x >= COLS || pos.y < 0 || pos.y >= ROWS) continue;
    const key = `${pos.x},${pos.y}`;
    const cell = grid[key];
    if (!cell) continue;
    if (!cell.classList.contains("inactive")) continue;
    if (blockedCellKeys.has(key)) continue;
    return pos;
  }
  return null;
}

function findEnemySpecialCell(playerIndex, featureKey) {
  const candidates = Object.entries(specialByPos)
    .map(([key, entry]) => ({ key, entry }))
    .filter(({ entry }) => entry.ownerIndex !== null && entry.ownerIndex !== playerIndex)
    .filter(({ entry }) => entry.featureKey === featureKey)
    .filter(({ entry }) => entry.disabled !== true);
  if (candidates.length === 0) return null;
  return candidates[0];
}

function findEnemyCastleKey(playerIndex) {
  const opponentIndex = getOpponentIndex(playerIndex);
  return getFirstOwnedCastleKey(opponentIndex);
}

function getMercenaryStrength(featureKey) {
  return Math.max(1, Number(MERCENARY_ATTACK_STRENGTHS[featureKey]) || 1);
}

function findRandomOwnedResourceTarget(playerIndex) {
  const candidates = Object.entries(specialByPos)
    .map(([key, entry]) => ({ key, entry }))
    .filter(({ entry }) => entry.ownerIndex === playerIndex)
    .filter(({ entry }) => ["lumber", "mine", "clay"].includes(entry.featureKey))
    .filter(({ entry }) => entry.disabled !== true);
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function spawnWorldEventMercenary(target, strength) {
  if (!target) return false;
  const spawnPos = findHireSpawnCell();
  if (!spawnPos) return false;
  const key = `${spawnPos.x},${spawnPos.y}`;
  setCellToMercenary(spawnPos.x, spawnPos.y);
  mercenaries.push({
    id: mercenaryIdCounter++,
    key,
    x: spawnPos.x,
    y: spawnPos.y,
    ownerIndex: null,
    targetKey: target.key,
    featureKey: target.entry?.featureKey || null,
    strength: Math.max(1, Number(strength) || 1)
  });
  return true;
}

function spawnMercenary(playerIndex, featureKey, strength, baseCost) {
  const target = findEnemySpecialCell(playerIndex, featureKey);
  if (!target) {
    showPickupToast("Нет доступной вражеской клетки для атаки.");
    return false;
  }
  const spawnPos = findHireSpawnCell();
  if (!spawnPos) {
    showPickupToast("Нет места рядом для наёмников.");
    return false;
  }
  const player = players[playerIndex];
  const cost = getDiscountedGoldCost(player, baseCost);
  if (getTotalGold(player) < cost) {
    showPickupToast("Не хватает золота.");
    return false;
  }
  spendGold(player, cost);
  updatePlayerResources(playerIndex);

  const key = `${spawnPos.x},${spawnPos.y}`;
  setCellToMercenary(spawnPos.x, spawnPos.y);
  mercenaries.push({
    id: mercenaryIdCounter++,
    key,
    x: spawnPos.x,
    y: spawnPos.y,
    ownerIndex: playerIndex,
    targetKey: target.key,
    featureKey,
    strength
  });
  showPickupToast("Наёмники отправлены.");
  return true;
}

function spawnThief(playerIndex) {
  const targetKey = findEnemyCastleKey(playerIndex);
  if (!targetKey) {
    showPickupToast("РќРµС‚ РІСЂР°Р¶РµСЃРєРѕРіРѕ Р·Р°РјРєР° РґР»СЏ РІРѕСЂР°.");
    return false;
  }
  const spawnPos = findHireSpawnCell();
  if (!spawnPos) {
    showPickupToast("РќРµС‚ РјРµСЃС‚Р° СЂСЏРґРѕРј РґР»СЏ РІРѕСЂР°.");
    return false;
  }
  const player = players[playerIndex];
  if ((player.tokenCount || 0) < 1) {
    showPickupToast("РќСѓР¶РµРЅ 1 Р¶РµС‚РѕРЅ.");
    return false;
  }
  player.tokenCount -= 1;
  updatePlayerResources(playerIndex);

  const key = `${spawnPos.x},${spawnPos.y}`;
  setCellToThief(spawnPos.x, spawnPos.y);
  thieves.push({
    id: thiefIdCounter++,
    key,
    x: spawnPos.x,
    y: spawnPos.y,
    ownerIndex: playerIndex,
    targetKey
  });
  showPickupToast("Р’РѕСЂ РѕС‚РїСЂР°РІР»РµРЅ.");
  return true;
}

function spawnCutthroat(playerIndex) {
  const spawnPos = findHireSpawnCell();
  if (!spawnPos) {
    showPickupToast("Нет места рядом для наемников.");
    return false;
  }
  const player = players[playerIndex];
  const cost = getDiscountedGoldCost(player, CUTTHROAT_COST);
  if (getTotalGold(player) < cost) {
    showPickupToast("Не хватает золота.");
    return false;
  }
  spendGold(player, cost);
  updatePlayerResources(playerIndex);
  const key = `${spawnPos.x},${spawnPos.y}`;
  setCellToCutthroat(spawnPos.x, spawnPos.y);
  cutthroats.push({
    id: cutthroatIdCounter++,
    key,
    x: spawnPos.x,
    y: spawnPos.y,
    ownerIndex: playerIndex,
    targetPlayerIndex: getOpponentIndex(playerIndex)
  });
  showPickupToast("Головорезы отправлены.");
  return true;
}

function openHire(playerIndex) {
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    hirePlayerIndex = playerIndex;
    emitPrivateUiToPlayer(playerIndex, "showHireModal", { playerIndex });
    return;
  }
  if (typeof socket !== "undefined" &&
      socket &&
      typeof onlineMatchStarted !== "undefined" &&
      onlineMatchStarted &&
      typeof localPlayerIndex === "number" &&
      playerIndex !== localPlayerIndex) {
    return;
  }
  hirePlayerIndex = playerIndex;
  const player = players[playerIndex];
  const gold = getTotalGold(player);
  const costLumber = getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.lumber);
  const costMine = getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.mine);
  const costClay = getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.clay);
  const costCutthroat = getDiscountedGoldCost(player, CUTTHROAT_COST);
  const hasEnemyCastle = Boolean(findEnemyCastleKey(playerIndex));
  hireButtons.forEach(btn => {
    const type = btn.getAttribute("data-hire");
    const hasTarget = Boolean(findEnemySpecialCell(playerIndex, type));
    if (type === "lumber") btn.disabled = gold < costLumber || !hasTarget;
    if (type === "mine") btn.disabled = gold < costMine || !hasTarget;
    if (type === "clay") btn.disabled = gold < costClay || !hasTarget;
    if (type === "thief") btn.disabled = (player.tokenCount || 0) < 1 || !hasEnemyCastle;
    if (type === "cutthroat") btn.disabled = gold < costCutthroat;
    if (type === "werewolf-amulet") btn.disabled = (player.mysticStoneCount || 0) < 1;
    if (type === "luck-amulet") btn.disabled = (player.mysticStoneCount || 0) < 1 || (player.cloverCount || 0) < 1;
    if (type === "builder-amulet") btn.disabled = (player.mysticStoneCount || 0) < 1 || (player.rainbowStoneCount || 0) < 1;
    if (type === "crystal-sword") btn.disabled = (player.mysticStoneCount || 0) < 2 || gold < 1000 || player.hasCrystalSword;
    if (type === "lumber") setTradePrice(btn, goldPriceHtml(costLumber));
    if (type === "mine") setTradePrice(btn, goldPriceHtml(costMine));
    if (type === "clay") setTradePrice(btn, goldPriceHtml(costClay));
    if (type === "thief") {
      setTradePrice(
        btn,
        '<img class="price-icon" src="assets/icons/token.png" alt="Жетон" />Цена: 1 жетон'
      );
    }
    if (type === "cutthroat") setTradePrice(btn, goldPriceHtml(costCutthroat));
    if (type === "werewolf-amulet") {
      setTradePrice(btn, '<img class="price-icon" src="assets/icons/stone.png" alt="Камень" />Цена: 1 необычный камень');
    }
    if (type === "luck-amulet") {
      setTradePrice(btn, '<img class="price-icon" src="assets/icons/stone.png" alt="Камень" />Цена: 1 необычный камень + <img class="price-icon" src="assets/icons/clover.png" alt="Клевер" />1 клевер');
    }
    if (type === "builder-amulet") {
      setTradePrice(btn, '<img class="price-icon" src="assets/icons/stone.png" alt="Камень" />Цена: 1 необычный камень + <img class="price-icon" src="assets/icons/rainbow_stone.png" alt="Радужный камень" />1 радужный камень');
    }
    if (type === "crystal-sword") {
      setTradePrice(btn, '<img class="price-icon" src="assets/icons/stone.png" alt="Камень" />Цена: 2 необычных камня + <img class="price-icon" src="assets/icons/icon-gold.png" alt="Золото" />1000 золота');
    }
  });
  hireModal.style.display = "flex";
}

function buyHireOption(type) {
  if (hirePlayerIndex === null) return false;
  const player = players[hirePlayerIndex];
  if (!player) return false;
  const button = hireButtons.find(entry => entry.getAttribute("data-hire") === type);
  const costLumber = getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.lumber);
  const costMine = getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.mine);
  const costClay = getDiscountedGoldCost(player, HIRE_ATTACK_COSTS.clay);
  const costCutthroat = getDiscountedGoldCost(player, CUTTHROAT_COST);
  if (type === "lumber") {
    const ok = spawnMercenary(hirePlayerIndex, "lumber", getMercenaryStrength("lumber"), HIRE_ATTACK_COSTS.lumber);
    if (ok) flashPrice(button, costLumber, "assets/icons/icon-gold.png", "Р—РѕР»РѕС‚Рѕ");
    return ok;
  }
  if (type === "mine") {
    const ok = spawnMercenary(hirePlayerIndex, "mine", getMercenaryStrength("mine"), HIRE_ATTACK_COSTS.mine);
    if (ok) flashPrice(button, costMine, "assets/icons/icon-gold.png", "Р—РѕР»РѕС‚Рѕ");
    return ok;
  }
  if (type === "clay") {
    const ok = spawnMercenary(hirePlayerIndex, "clay", getMercenaryStrength("clay"), HIRE_ATTACK_COSTS.clay);
    if (ok) flashPrice(button, costClay, "assets/icons/icon-gold.png", "Р—РѕР»РѕС‚Рѕ");
    return ok;
  }
  if (type === "thief") {
    const ok = spawnThief(hirePlayerIndex);
    if (ok) flashPrice(button, 1, "assets/icons/token.png", "Р–РµС‚РѕРЅ");
    return ok;
  }
  if (type === "cutthroat") {
    const ok = spawnCutthroat(hirePlayerIndex);
    if (ok) flashPrice(button, costCutthroat, "assets/icons/icon-gold.png", "Р—РѕР»РѕС‚Рѕ");
    return ok;
  }
  if (type === "werewolf-amulet") {
    if ((player.mysticStoneCount || 0) < 1) return false;
    player.mysticStoneCount -= 1;
    player.werewolfAmuletCount = (player.werewolfAmuletCount || 0) + 1;
    updateInventory(hirePlayerIndex);
    flashPrice(button, 1, "assets/icons/werewolf_amulet.png", "Амулет оборотня");
    return true;
  }
  if (type === "luck-amulet") {
    if ((player.mysticStoneCount || 0) < 1 || (player.cloverCount || 0) < 1) return false;
    player.mysticStoneCount -= 1;
    player.cloverCount -= 1;
    player.luckAmuletCount = (player.luckAmuletCount || 0) + 1;
    updateInventory(hirePlayerIndex);
    flashPrice(button, 1, "assets/icons/luck_amulet.png", "Амулет удачи");
    return true;
  }
  if (type === "builder-amulet") {
    if ((player.mysticStoneCount || 0) < 1 || (player.rainbowStoneCount || 0) < 1) return false;
    player.mysticStoneCount -= 1;
    player.rainbowStoneCount -= 1;
    player.builderAmuletCount = (player.builderAmuletCount || 0) + 1;
    player.builderAmuletChargeCount = (player.builderAmuletChargeCount || 0) + 1;
    updateInventory(hirePlayerIndex);
    flashPrice(button, 1, "assets/icons/builder_amulet.png", "Амулет строителя");
    return true;
  }
  if (type === "crystal-sword") {
    if ((player.mysticStoneCount || 0) < 2 || getTotalGold(player) < 1000 || player.hasCrystalSword) return false;
    player.mysticStoneCount -= 2;
    spendGold(player, 1000);
    player.hasCrystalSword = true;
    player.attack = (player.attack || 0) + 10;
    updateInventory(hirePlayerIndex);
    updatePlayerResources(hirePlayerIndex);
    flashPrice(button, 1000, "assets/icons/icon-gold.png", "Р—РѕР»РѕС‚Рѕ");
    return true;
  }
  return false;
}

function closeHire() {
  hireModal.style.display = "none";
  hirePlayerIndex = null;
  resumeTurnFlowAfterModalChange();
}

hireClose.addEventListener("click", closeHire);
hireModal.addEventListener("click", (e) => {
  if (e.target === hireModal) closeHire();
});

hireButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (hirePlayerIndex === null) return;
    const type = btn.getAttribute("data-hire");
    if (shouldRoutePrivateUiActionToHost(hirePlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "hire",
        actionType: "buy",
        playerIndex: hirePlayerIndex,
        payload: { hireType: type }
      });
      return;
    }
    buyHireOption(type);
    openHire(hirePlayerIndex);
  });
});

function openRepairModal(entry, playerIndex) {
  if (!entry || !repairModal || !repairConfirm) return;
  prepareBlockingModalTurn(playerIndex);
  let cost = 0;
  let label = "ресурс";
  if (!isDayBuffActive("freeRepair")) {
    if (entry.featureKey === "lumber") {
      cost = 25;
      label = "лесопилку";
    }
    if (entry.featureKey === "mine") {
      cost = 50;
      label = "шахту";
    }
    if (entry.featureKey === "clay") {
      cost = 75;
      label = "глиняный карьер";
    }
  } else {
    if (entry.featureKey === "lumber") label = "лесопилку";
    else if (entry.featureKey === "mine") label = "шахту";
    else if (entry.featureKey === "clay") label = "глиняный карьер";
  }
  repairPending = { key: entry.key || `${entry.x},${entry.y}`, cost, playerIndex, entry };
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showRepairModal", {
      playerIndex,
      entry: { ...entry, key: entry.key || `${entry.x},${entry.y}` }
    });
    return;
  }
  const player = players[playerIndex];
  const total = getTotalResources(player);
  if (repairText) {
    repairText.textContent = `Починить ${label} за ${cost} ресурсов?`;
  }
  setTradePrice(repairConfirm, `<img class="price-icon" src="assets/icons/icon-resources.png" alt="Ресурсы" />Цена: ${cost} ресурсов`);
  repairConfirm.disabled = total < cost;
  repairModal.style.display = "flex";
}

function closeRepairModal() {
  if (repairModal) repairModal.style.display = "none";
  repairPending = null;
  resumeTurnFlowAfterModalChange();
}

if (repairCancel) {
  repairCancel.addEventListener("click", closeRepairModal);
}
if (repairModal) {
  repairModal.addEventListener("click", (e) => {
    if (e.target === repairModal) closeRepairModal();
  });
}
if (messengerCancel) {
  messengerCancel.addEventListener("click", closeMessengerModal);
}
if (messengerModal) {
  messengerModal.addEventListener("click", event => {
    if (event.target === messengerModal) {
      closeMessengerModal();
    }
  });
}
if (messengerConfirm) {
  messengerConfirm.addEventListener("click", () => {
    if (!pendingMessengerInteraction) return;
    const { playerIndex, messengerId } = pendingMessengerInteraction;
    if (shouldRoutePrivateUiActionToHost(playerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "messenger",
        actionType: "confirm",
        playerIndex,
        payload: { messengerId }
      });
      closeMessengerModal();
      return;
    }
    fillMessengerWithGold(playerIndex, messengerId);
  });
}
  if (repairConfirm) {
  repairConfirm.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(repairPending?.playerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "repair",
        actionType: "confirm",
        playerIndex: repairPending?.playerIndex,
        payload: { key: repairPending?.key || null }
      });
      return;
    }
    if (!repairPending) return;
    const player = players[repairPending.playerIndex];
    if (!player) return;
    if (getTotalResources(player) < repairPending.cost) return;
    spendResources(player, repairPending.cost);
    setSpecialCellDisabled(repairPending.key, false);
    if (repairPending.entry && repairPending.entry.featureKey) {
      applySpecialFeatureIcon(repairPending.entry.x, repairPending.entry.y, repairPending.entry.featureKey);
    }
    recalcPlayerResourceIncome(repairPending.playerIndex);
    updatePlayerResources(repairPending.playerIndex);
    showPickupToast("Ресурс восстановлен.");
    closeRepairModal();
    flashPrice(repairConfirm, repairPending.cost, "assets/icons/icon-resources.png", "Ресурсы");
  });
}

function openContextForKey(key, playerIndex) {
  if ((players[playerIndex]?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER) {
    return;
  }
  const messenger = getMessengerAtKey(key);
  if (messenger && messenger.targetPlayerIndex === playerIndex) {
    openMessengerModal(messenger.id, playerIndex);
    return;
  }
  const [x, y] = key.split(",").map(Number);
  const castleKey = getCastleBaseKeyForPos(x, y) || key;
  const node = nodeByPos[castleKey];
  if (masterActive && key === MASTER_CELL.key) {
    openMasterModal(playerIndex);
    return;
  }
  const mageSlot = getMageSlotByKey(key);
  if (mageSlot && mageSlot.active) {
    openMageModal(mageSlot, playerIndex);
    return;
  }
  if (node && node.type === "castle") {
    const owner = castleOwnersByKey[castleKey];
    if (typeof owner === "number" && owner !== playerIndex) {
      const player = players[playerIndex];
      if (!player || player.pocket.army <= 0) {
        showPickupToast("В кармане нет войск для боя.");
        return;
      }
      const result = resolveCastleBattle(playerIndex, castleKey);
      showBattleModal(result);
      if (result.healthRemaining <= 0) {
        showGameOver(playerIndex);
      } else if (result.winnerIndex === playerIndex) {
        const ownedKey = getFirstOwnedCastleKey(playerIndex);
        if (ownedKey && ownedKey !== castleKey) {
          showPickupToast("Нельзя захватить второй замок.");
        } else {
          castleOwnersByKey[castleKey] = playerIndex;
          node.elem.classList.add("owned");
          node.elem.style.background = player.color;
          node.elem.style.borderColor = player.color;
          if (typeof updateCastleBars === "function") updateCastleBars(castleKey);
          recalcPlayerResourceIncome(playerIndex);
        }
      }
      if (typeof owner === "number") {
        recalcPlayerResourceIncome(owner);
      }
      endTurn();
      return;
    }
  }
  if (node && node.type === "castle" && castleOwnersByKey[castleKey] === playerIndex) {
    showCastleModal(castleKey, playerIndex);
    return;
  }
  const specialEntry = specialByPos[key];
  if (specialEntry && specialEntry.disabled && specialEntry.ownerIndex === playerIndex) {
    openRepairModal({ ...specialEntry, key }, playerIndex);
    return;
  }
  if (node && node.id === 2) return openBarracks(playerIndex);
  if (node && node.id === 9) return openLavka(playerIndex);
  if (node && node.id === 19) return openWorkshop(playerIndex);
  if (node && node.id === 15) return openCity(playerIndex);
  if (node && node.id === 6) return openHire(playerIndex);
  if (node && node.type === "tavern") return openTavernModal(playerIndex);
}

function isMercenaryStepAllowed(nx, ny, targetKey) {
  const key = `${nx},${ny}`;
  if (blockedCellKeys.has(key)) return false;
  if (key === targetKey) return true;
  const cell = grid[key];
  if (!cell || !cell.classList.contains("inactive")) return false;
  if (resourceByPos[key]) return false;
  if (specialByPos[key]) return false;
  if (players.some(p => p.x === nx && p.y === ny)) return false;
  if (mercenaries.some(m => m.key === key)) return false;
  return true;
}

function findMercenaryPath(startKey, targetKey, maxDepth = 25) {
  const [sx, sy] = startKey.split(",").map(Number);
  const [tx, ty] = targetKey.split(",").map(Number);
  const queue = [{ x: sx, y: sy }];
  const prev = new Map();
  const startId = `${sx},${sy}`;
  prev.set(startId, null);
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  let depth = 0;
  while (queue.length && depth <= maxDepth) {
    const nextQueue = [];
    for (const node of queue) {
      const key = `${node.x},${node.y}`;
      if (key === targetKey) {
        const path = [];
        let cur = key;
        while (cur && cur !== startId) {
          path.push(cur);
          cur = prev.get(cur);
        }
        path.reverse();
        return path;
      }
      for (const { dx, dy } of dirs) {
        const nx = node.x + dx;
        const ny = node.y + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const nkey = `${nx},${ny}`;
        if (prev.has(nkey)) continue;
        if (!isMercenaryStepAllowed(nx, ny, targetKey)) continue;
        prev.set(nkey, key);
        nextQueue.push({ x: nx, y: ny });
      }
    }
    queue.splice(0, queue.length, ...nextQueue);
    depth += 1;
  }
  return null;
}

function moveMercenary(mercenary) {
  const target = mercenary.targetKey;
  if (mercenary.key === target) return;
  const path = findMercenaryPath(mercenary.key, target, 80);
  if (!path || path.length === 0) return;
  const steps = Math.min(5, path.length);
  for (let i = 0; i < steps; i += 1) {
    const [nx, ny] = path[i].split(",").map(Number);
    clearMercenaryCell(mercenary.x, mercenary.y);
    mercenary.x = nx;
    mercenary.y = ny;
    mercenary.key = `${nx},${ny}`;
    if (mercenary.key === target) break;
    setCellToMercenary(nx, ny);
  }
}

function disableTargetResource(targetKey) {
  const entry = specialByPos[targetKey];
  if (!entry) return;
  setSpecialCellDisabled(targetKey, true);
  const cell = grid[targetKey];
  if (cell) {
    cell.classList.remove("mercenary", "inactive");
    cell.classList.add("important", "special");
    if (entry.extraClass) cell.classList.add(entry.extraClass);
    cell.textContent = entry.label;
    if (
      entry.featureKey &&
      typeof applySpecialFeatureIcon === "function" &&
      ["lumber", "mine", "clay"].includes(entry.featureKey)
    ) {
      applySpecialFeatureIcon(entry.x, entry.y, entry.featureKey);
    }
    if (typeof syncBrokenResourceSmoke === "function") {
      syncBrokenResourceSmoke(cell, true);
    }
  }
  if (typeof entry.ownerIndex === "number") {
    recalcPlayerResourceIncome(entry.ownerIndex);
  }
}

function advanceMercenaries() {
  for (let i = mercenaries.length - 1; i >= 0; i--) {
    const mercenary = mercenaries[i];
    if (!specialByPos[mercenary.targetKey] || specialByPos[mercenary.targetKey].disabled) {
      clearMercenaryCell(mercenary.x, mercenary.y);
      mercenaries.splice(i, 1);
      continue;
    }
    moveMercenary(mercenary);
    if (mercenary.key === mercenary.targetKey) {
      disableTargetResource(mercenary.targetKey);
      showPickupToast("Наёмники вывели ресурс из строя.");
      mercenaries.splice(i, 1);
    }
  }
}

function isThiefStepAllowed(nx, ny, targetKey) {
  const key = `${nx},${ny}`;
  if (blockedCellKeys.has(key)) return false;
  if (key === targetKey) return true;
  const cell = grid[key];
  if (!cell || !cell.classList.contains("inactive")) return false;
  if (resourceByPos[key]) return false;
  if (specialByPos[key]) return false;
  if (players.some(p => p.x === nx && p.y === ny)) return false;
  if (mercenaries.some(m => m.key === key)) return false;
  if (thieves.some(t => t.key === key)) return false;
  if (cutthroats.some(c => c.key === key)) return false;
  return true;
}

function isCutthroatStepAllowed(nx, ny, targetKey) {
  const key = `${nx},${ny}`;
  if (blockedCellKeys.has(key)) return false;
  if (key === targetKey) return true;
  const cell = grid[key];
  if (!cell || !cell.classList.contains("inactive")) return false;
  if (resourceByPos[key]) return false;
  if (specialByPos[key]) return false;
  if (players.some(p => p.x === nx && p.y === ny)) return false;
  if (mercenaries.some(m => m.key === key)) return false;
  if (thieves.some(t => t.key === key)) return false;
  if (cutthroats.some(c => c.key === key)) return false;
  return true;
}

function findCutthroatPath(startKey, targetKey, maxDepth = 25) {
  const [sx, sy] = startKey.split(",").map(Number);
  const queue = [{ x: sx, y: sy }];
  const prev = new Map();
  const startId = `${sx},${sy}`;
  prev.set(startId, null);
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  let depth = 0;
  while (queue.length && depth <= maxDepth) {
    const nextQueue = [];
    for (const node of queue) {
      const key = `${node.x},${node.y}`;
      if (key === targetKey) {
        const path = [];
        let cur = key;
        while (cur && cur !== startId) {
          path.push(cur);
          cur = prev.get(cur);
        }
        path.reverse();
        return path;
      }
      for (const { dx, dy } of dirs) {
        const nx = node.x + dx;
        const ny = node.y + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const nkey = `${nx},${ny}`;
        if (prev.has(nkey)) continue;
        if (!isCutthroatStepAllowed(nx, ny, targetKey)) continue;
        prev.set(nkey, key);
        nextQueue.push({ x: nx, y: ny });
      }
    }
    queue.splice(0, queue.length, ...nextQueue);
    depth += 1;
  }
  return null;
}

function findThiefPath(startKey, targetKey, maxDepth = 25) {
  const [sx, sy] = startKey.split(",").map(Number);
  const queue = [{ x: sx, y: sy }];
  const prev = new Map();
  const startId = `${sx},${sy}`;
  prev.set(startId, null);
  const dirs = [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 }
  ];
  let depth = 0;
  while (queue.length && depth <= maxDepth) {
    const nextQueue = [];
    for (const node of queue) {
      const key = `${node.x},${node.y}`;
      if (key === targetKey) {
        const path = [];
        let cur = key;
        while (cur && cur !== startId) {
          path.push(cur);
          cur = prev.get(cur);
        }
        path.reverse();
        return path;
      }
      for (const { dx, dy } of dirs) {
        const nx = node.x + dx;
        const ny = node.y + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const nkey = `${nx},${ny}`;
        if (prev.has(nkey)) continue;
    if (!isThiefStepAllowed(nx, ny, targetKey)) continue;
        prev.set(nkey, key);
        nextQueue.push({ x: nx, y: ny });
      }
    }
    queue.splice(0, queue.length, ...nextQueue);
    depth += 1;
  }
  return null;
}

function removeThiefAtIndex(index) {
  const thief = thieves[index];
  if (!thief) return;
  const node = nodeByPos[thief.key];
  if (!node || node.type !== "castle") {
    clearThiefCell(thief.x, thief.y);
  }
  thieves.splice(index, 1);
}

function moveThief(thief) {
  const target = thief.targetKey;
  if (!target || thief.key === target) return;
  const path = findThiefPath(thief.key, target, 80);
  if (!path || path.length === 0) return;
  const steps = Math.min(THIEF_SPEED, path.length);
  const targetNode = nodeByPos[target];
  const targetIsCastle = targetNode && targetNode.type === "castle";
  for (let i = 0; i < steps; i += 1) {
    const [nx, ny] = path[i].split(",").map(Number);
    clearThiefCell(thief.x, thief.y);
    thief.x = nx;
    thief.y = ny;
    thief.key = `${nx},${ny}`;
    const reachedTarget = thief.key === target;
    if (reachedTarget && targetIsCastle) break;
    setCellToThief(nx, ny);
    if (reachedTarget) break;
  }
}

function moveCutthroat(cutthroat) {
  const targetPlayer = players[cutthroat.targetPlayerIndex];
  if (!targetPlayer) return;
  const targetKey = `${targetPlayer.x},${targetPlayer.y}`;
  if (cutthroat.key === targetKey) return;
  const path = findCutthroatPath(cutthroat.key, targetKey, 80);
  if (!path || path.length === 0) return;
  const steps = Math.min(CUTTHROAT_SPEED, path.length);
  clearCutthroatCell(cutthroat.x, cutthroat.y);
  for (let i = 0; i < steps; i++) {
    const [nx, ny] = path[i].split(",").map(Number);
    cutthroat.x = nx;
    cutthroat.y = ny;
    cutthroat.key = `${nx},${ny}`;
    if (cutthroat.key === targetKey) break;
  }
  if (cutthroat.key !== targetKey) {
    setCellToCutthroat(cutthroat.x, cutthroat.y);
  }
}

function advanceCutthroats() {
  for (let i = cutthroats.length - 1; i >= 0; i--) {
    const cutthroat = cutthroats[i];
    const targetPlayer = players[cutthroat.targetPlayerIndex];
    if (!targetPlayer) {
      clearCutthroatCell(cutthroat.x, cutthroat.y);
      cutthroats.splice(i, 1);
      continue;
    }
    const targetKey = `${targetPlayer.x},${targetPlayer.y}`;
    moveCutthroat(cutthroat);
    if (cutthroat.key === targetKey) {
      if ((targetPlayer.invulnTurnsRemaining || 0) > 0) {
        clearCutthroatCell(cutthroat.x, cutthroat.y);
        cutthroats.splice(i, 1);
        continue;
      }
      const beforeArmy = Math.max(0, targetPlayer.pocket.army || 0);
      const rawDamage = Math.floor(Math.random() * (CUTTHROAT_KILL_MAX - CUTTHROAT_KILL_MIN + 1)) + CUTTHROAT_KILL_MIN;
      const killed = Math.min(beforeArmy, rawDamage);
      targetPlayer.pocket.army = beforeArmy - killed;
      updatePlayerResources(cutthroat.targetPlayerIndex);
      showPickupToast(`Головорезы убили ${killed} войск игрока ${targetPlayer.id + 1}`);
      clearCutthroatCell(cutthroat.x, cutthroat.y);
      cutthroats.splice(i, 1);
    }
  }
}

function advanceThieves() {
  for (let i = thieves.length - 1; i >= 0; i--) {
    const thief = thieves[i];
    if (!thief.targetKey) {
      removeThiefAtIndex(i);
      continue;
    }
    moveThief(thief);
    if (thief.key === thief.targetKey) {
      const ownerIndex = castleOwnersByKey[thief.targetKey];
      if (typeof ownerIndex === "number" && ownerIndex !== thief.ownerIndex) {
        const targetPlayer = players[ownerIndex];
        targetPlayer.resources.gold = Math.max(
          0,
          (targetPlayer.resources.gold || 0) - THIEF_CASTLE_GOLD_LOSS
        );
        updatePlayerResources(ownerIndex);
        showPickupToast(`Вор украл ${THIEF_CASTLE_GOLD_LOSS} золота из замка.`);
      }
      removeThiefAtIndex(i);
    }
  }
}

function syncCityModalState(playerIndex) {
  const player = players[playerIndex];
  if (!player) return;
  const totalGold = (player.resources.gold || 0) + (player.pocket.gold || 0);
  const kills = player.barbarianKills || 0;
  if (cityKillsInfo) {
    cityKillsInfo.textContent = `Убито лагерей варваров: ${kills}`;
  }
  cityRewardButtons.forEach(btn => {
    const amount = btn.getAttribute("data-city-reward");
    if (amount === "5") {
      btn.disabled = kills < 5 || player.barbarianRewards.r5 === true;
    }
    if (amount === "10") {
      btn.disabled = kills < 10 || player.barbarianRewards.r10 === true;
    }
    if (amount === "20") {
      btn.disabled = kills < 20 || player.barbarianRewards.r20 === true;
    }
  });
  cityExchangeButtons.forEach(btn => {
    const amount = btn.getAttribute("data-city-exchange");
    if (amount === "100") {
      const cost = getDiscountedGoldCost(player, 1000);
      btn.disabled = totalGold < cost;
      setTradePrice(btn, goldPriceHtml(cost));
    }
    if (amount === "300") {
      const cost = getDiscountedGoldCost(player, 2500);
      btn.disabled = totalGold < cost;
      setTradePrice(btn, goldPriceHtml(cost));
    }
  });
  if (cityPoisonBtn) {
    cityPoisonBtn.disabled = (player.poisonCount || 0) <= 0;
  }
}

function openCity(playerIndex) {
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showCityModal", { playerIndex });
    return;
  }
  syncCityModalState(playerIndex);
  cityModal.style.display = "flex";
  cityPlayerIndex = playerIndex;
}

function closeCity() {
  cityModal.style.display = "none";
  cityPlayerIndex = null;
  resumeTurnFlowAfterModalChange();
}

let cityPlayerIndex = null;
cityClose.addEventListener("click", closeCity);
cityModal.addEventListener("click", (e) => {
  if (e.target === cityModal) closeCity();
});

cityRewardButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(cityPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "city",
        actionType: "reward",
        playerIndex: cityPlayerIndex,
        payload: { rewardType: btn.getAttribute("data-city-reward") }
      });
      return;
    }
    if (cityPlayerIndex === null) return;
    const player = players[cityPlayerIndex];
    const amount = btn.getAttribute("data-city-reward");
    if (amount === "5" && player.barbarianKills >= 5 && !player.barbarianRewards.r5) {
      player.barbarianRewards.r5 = true;
      player.resources.gold += 1500;
      showPickupToast("Награда: +1500 золота");
      flashPrice(btn, 5, "assets/icons/barbarian_village.png", "Лагеря варваров");
    }
    if (amount === "10" && player.barbarianKills >= 10 && !player.barbarianRewards.r10) {
      player.barbarianRewards.r10 = true;
      player.resources.gold += 3000;
      showPickupToast("Награда: +3000 золота");
      flashPrice(btn, 10, "assets/icons/barbarian_village.png", "Лагеря варваров");
    }
    if (amount === "20" && player.barbarianKills >= 20 && !player.barbarianRewards.r20) {
      player.barbarianRewards.r20 = true;
      player.resources.gold += 5000;
      showPickupToast("Награда: +5000 золота");
      flashPrice(btn, 20, "assets/icons/barbarian_village.png", "Лагеря варваров");
    }
    updatePlayerResources(cityPlayerIndex);
    openCity(cityPlayerIndex);
  });
});

cityExchangeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(cityPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "city",
        actionType: "exchange",
        playerIndex: cityPlayerIndex,
        payload: { exchangeType: btn.getAttribute("data-city-exchange") }
      });
      return;
    }
    if (cityPlayerIndex === null) return;
    const player = players[cityPlayerIndex];
    const amount = btn.getAttribute("data-city-exchange");
    if (amount === "100") {
      const cost = getDiscountedGoldCost(player, 1000);
      if ((player.resources.gold + player.pocket.gold) < cost) return;
      spendGold(player, cost);
      player.resources.influence += 100;
      showPickupToast("+100 влияния");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    if (amount === "300") {
      const cost = getDiscountedGoldCost(player, 2500);
      if ((player.resources.gold + player.pocket.gold) < cost) return;
      spendGold(player, cost);
      player.resources.influence += 300;
      showPickupToast("+300 влияния");
      flashPrice(btn, cost, "assets/icons/icon-gold.png", "Золото");
    }
    updatePlayerResources(cityPlayerIndex);
    openCity(cityPlayerIndex);
  });
});

function handleCityPoisonUse() {
  if (cityPlayerIndex === null) return;
  const player = players[cityPlayerIndex];
  if (!player || !player.poisonCount) {
    showPickupToast("У вас нет яда.");
    return;
  }
  if (player.resources.influence >= POISON_INFLUENCE_THRESHOLD) {
    player.poisonCount = Math.max(0, (player.poisonCount || 0) - 1);
    updatePlayerResources(cityPlayerIndex);
    closeCity();
    showPickupToast("Яд отравил короля.");
    if (cityPoisonBtn) {
      flashPrice(cityPoisonBtn, 1, "assets/icons/poison.png", "Яд");
    }
    showGameOver(cityPlayerIndex);
  } else {
    showPickupToast(`Нужно ${POISON_INFLUENCE_THRESHOLD} влияния, чтобы яд сработал.`);
  }
}

if (cityPoisonBtn) {
  cityPoisonBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(cityPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "city", actionType: "poison", playerIndex: cityPlayerIndex });
      return;
    }
    handleCityPoisonUse();
  });
}

function updateGuardModalButtons(playerIndex, unlocked) {
  const player = players[playerIndex];
  if (!player) return;
  guardBribeBtn.disabled = unlocked || getTotalGold(player) < 500;
  guardInfluenceBtn.disabled = unlocked || player.resources.influence < 300;
  guardPassBtn.disabled = !unlocked;
}

function showGuardModalFor(playerIndex, x, y, unlocked) {
  prepareBlockingModalTurn(playerIndex);
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showGuardModal", { playerIndex, x, y, unlocked: Boolean(unlocked) });
    return;
  }
  pendingGuardMove = {x, y};
  pendingGuardPlayerIndex = playerIndex;
  updateGuardModalButtons(playerIndex, Boolean(unlocked));
  guardModal.style.display = "flex";
}

function hideGuardModal() {
  const wasVisible = guardModal && window.getComputedStyle(guardModal).display !== "none";
  guardModal.style.display = "none";
  pendingGuardMove = null;
  pendingGuardPlayerIndex = null;
  if (!wasVisible) return;
  resumeTurnFlowAfterModalChange();
}

function handleGuardDecision(type) {
    if (!pendingGuardMove || pendingGuardPlayerIndex === null) return;
    const player = players[pendingGuardPlayerIndex];
    if (!player) return;
    let success = false;
    if (type === "gold" && getTotalGold(player) >= 500) {
      spendGold(player, 500);
      success = true;
      flashPrice(guardBribeBtn, 500, "assets/icons/icon-gold.png", "Золото");
    }
    if (type === "influence" && player.resources.influence >= 300) {
      success = true;
    }
    if (!success) return;
    guardAccess[pendingGuardPlayerIndex] = true;
    updatePlayerResources(pendingGuardPlayerIndex);
    const move = pendingGuardMove;
    hideGuardModal();
    finalizeMove(move.x, move.y);
}

function handleGuardPass() {
  if (!pendingGuardMove || pendingGuardPlayerIndex === null) return;
  const move = pendingGuardMove;
  hideGuardModal();
  finalizeMove(move.x, move.y);
}

  guardBribeBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingGuardPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "guard", actionType: "gold", playerIndex: pendingGuardPlayerIndex, payload: { move: pendingGuardMove } });
      return;
    }
    handleGuardDecision("gold");
  });
  guardInfluenceBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingGuardPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "guard", actionType: "influence", playerIndex: pendingGuardPlayerIndex, payload: { move: pendingGuardMove } });
      return;
    }
    handleGuardDecision("influence");
  });
  guardPassBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(pendingGuardPlayerIndex)) {
      emitPrivateUiActionToHost({ modalType: "guard", actionType: "pass", playerIndex: pendingGuardPlayerIndex, payload: { move: pendingGuardMove } });
      return;
    }
    handleGuardPass();
  });
  guardModalCancel.addEventListener("click", hideGuardModal);
  guardModal.addEventListener("click", (event) => {
    if (event.target === guardModal) {
      hideGuardModal();
    }
  });

  function showRobberModal() {
    if (!robberModal) return;
    updateRobberModalContent();
    robberModal.style.display = "flex";
  }

  function hideRobberModal() {
    if (!robberModal) return;
    robberModal.style.display = "none";
    if (robberBribeBtn) {
      robberBribeBtn.disabled = true;
    }
  }

  function handleRobberFight() {
    if (!robberEvent) return;
    const fighterIndex = robberEvent.playerIndex ?? currentPlayerIndex;
    const result = resolveRobberBattle(fighterIndex, robberEvent.army);
    hideRobberModal();
    robberEvent = null;
    currentPlayerIndex = fighterIndex;
    updateTurnUI();
    showBattleModal(result);
    scheduleAutoRoll();
  }

function handleRobberBribe() {
  if (!robberEvent) return;
  const playerIndex = robberEvent.playerIndex ?? currentPlayerIndex;
  const player = players[playerIndex];
  const cost = robberEvent.bribeCost || 0;
  if (!player || getTotalGold(player) < cost) return;
  spendGold(player, cost);
  updatePlayerResources(playerIndex);
  showPickupToast(`Разбойникам отдано ${cost} золота, бой отменён`);
  flashPrice(robberBribeBtn, cost, "assets/icons/icon-gold.png", "Золото");
  robberEvent = null;
  hideRobberModal();
  updateTurnUI();
  scheduleAutoRoll();
}

  function updateRobberModalContent() {
    if (!robberEvent) return;
    if (robberCount) {
      robberCount.textContent = robberEvent.army;
    }
    if (robberBribeInfo) {
      robberBribeInfo.textContent = robberEvent.bribeCost;
    }
    if (robberBribeBtn) {
      const playerIndex = robberEvent.playerIndex ?? currentPlayerIndex;
      const player = players[playerIndex];
      robberBribeBtn.disabled = !player || getTotalGold(player) < robberEvent.bribeCost;
    }
  }

function shouldShowRobberModal() {
  if (!robberEvent) return false;
  if (!robbersEnabled) return false;
  const hasLocalIndex = typeof localPlayerIndex !== "undefined" && localPlayerIndex !== null;
  const compareIndex = hasLocalIndex ? localPlayerIndex : currentPlayerIndex;
  return robberEvent.playerIndex === compareIndex;
}

function updateRobberModalVisibility() {
  if (!robberModal) return;
  if (shouldShowRobberModal()) {
    updateRobberModalContent();
    robberModal.style.display = "flex";
  } else {
    hideRobberModal();
  }
}

function processRobberAmbushChance() {
  if (typeof socket !== "undefined" && socket && !isHost) return false;
  if (!robbersEnabled) return false;
  if (robberAmbushThisSession) return false;
  if (robberEvent || movesRemaining > 0) return false;
  if (turnCounter < 10) return false;
  const currentPlayer = players[currentPlayerIndex];
  if (currentPlayer) {
    const castleKey = getCastleBaseKeyForPos(currentPlayer.x, currentPlayer.y);
    if (castleKey && castleOwnersByKey[castleKey] === currentPlayerIndex) {
      return false;
    }
  }
  if (Math.random() >= ROBBER_CHANCE) return false;
  const baseArmy = Math.floor(Math.random() * 26) + 10;
  const strengthMultiplier = turnCounter >= 150 ? 1.5 : 1;
  const army = Math.max(1, Math.ceil(baseArmy * strengthMultiplier));
  const bribeCost =
      150 + Math.round(((army - 5) / 10) * (250 - 150));
  robberEvent = {playerIndex: currentPlayerIndex, army, bribeCost};
  robberAmbushThisSession = true;
    if (rollBtn) rollBtn.disabled = true;
    updateRobberModalVisibility();
    return true;
  }

  if (robberFightBtn) {
    robberFightBtn.addEventListener("click", handleRobberFight);
  }
  if (robberBribeBtn) {
    robberBribeBtn.addEventListener("click", handleRobberBribe);
  }

function resolveRobberBattle(playerIndex, armySize) {
  const player = players[playerIndex];
  if (!player) return null;
  const initialAttArmy = Math.max(0, player.pocket.army);
  const initialDefArmy = armySize;
  let defenderRemaining = initialDefArmy;
  const heroStrike = Math.max(0, player.attack || 0);
  if (heroStrike > 0 && defenderRemaining > 0) {
    defenderRemaining = Math.max(0, defenderRemaining - heroStrike);
  }
  const exchange = simulateArmyExchange(initialAttArmy, defenderRemaining, initialAttArmy, initialDefArmy);
  const attackerRemaining = exchange.attackerRemaining;
  defenderRemaining = exchange.defenderRemaining;
  const attackerThreshold = exchange.attackerThreshold;
  const defenderThreshold = exchange.defenderThreshold;
  player.pocket.army = attackerRemaining;
  let winnerName = player.name;
  let winnerIndex = playerIndex;
  if (attackerRemaining <= attackerThreshold && defenderRemaining > defenderThreshold) {
    winnerName = "Разбойники";
    winnerIndex = null;
  } else if (attackerRemaining > attackerThreshold && defenderRemaining <= defenderThreshold) {
    winnerName = player.name;
    winnerIndex = playerIndex;
  } else if (defenderRemaining > attackerRemaining) {
    winnerName = "Разбойники";
    winnerIndex = null;
  }
  const playerWon = winnerIndex === playerIndex;
  const rewardMultiplier = turnCounter >= 150 ? 1.7 : 1;
  const goldReward = playerWon
    ? Math.floor(Math.random() * (ROBBER_GOLD_REWARD_MAX - ROBBER_GOLD_REWARD_MIN + 1)) + ROBBER_GOLD_REWARD_MIN
    : 0;
  const resourceReward = playerWon
    ? Math.floor(Math.random() * (ROBBER_RESOURCE_REWARD_MAX - ROBBER_RESOURCE_REWARD_MIN + 1)) +
      ROBBER_RESOURCE_REWARD_MIN
    : 0;
  const scaledGoldReward = Math.floor(goldReward * rewardMultiplier);
  const scaledResourceReward = Math.floor(resourceReward * rewardMultiplier);
  let penaltyGold = 0;
  let penaltyResources = 0;
  if (playerWon) {
    player.pocket.gold += scaledGoldReward;
    player.pocket.resources += scaledResourceReward;
    updatePlayerResources(playerIndex);
  } else {
    penaltyGold = Math.floor(player.pocket.gold * ROBBER_LOSS_PENALTY);
    penaltyResources = Math.floor(player.pocket.resources * ROBBER_LOSS_PENALTY);
    player.pocket.gold = Math.max(0, player.pocket.gold - penaltyGold);
    player.pocket.resources = Math.max(0, player.pocket.resources - penaltyResources);
    player.resources.influence -= ROBBER_INFLUENCE_LOSS;
    showPickupToast(
      `Разбойники: -${penaltyGold} золота, -${penaltyResources} ресурсов, влияние -${ROBBER_INFLUENCE_LOSS}`
    );
    updatePlayerResources(playerIndex);
  }
  return {
    type: "robber",
    attackerIndex: playerIndex,
    attackerName: player.name,
    attackerLost: initialAttArmy - attackerRemaining,
    defenderLost: initialDefArmy - defenderRemaining,
    attackerRemaining,
    defenderRemaining,
    winnerName,
    winnerIndex,
    goldReward: scaledGoldReward,
    resourceReward: scaledResourceReward,
    penaltyGold,
    penaltyResources,
    influenceLoss: playerWon ? 0 : ROBBER_INFLUENCE_LOSS
  };
}

function resolveTrollBattle(playerIndex, trollArmy) {
  const player = players[playerIndex];
  if (!player) return null;
  const initialAttArmy = Math.max(0, player.pocket.army);
  const initialDefArmy = Math.max(0, trollArmy);
  let defenderRemaining = initialDefArmy;
  const heroStrike = Math.max(0, player.attack || 0);
  if (heroStrike > 0 && defenderRemaining > 0) {
    defenderRemaining = Math.max(0, defenderRemaining - heroStrike);
  }
  const exchange = simulateArmyExchange(initialAttArmy, defenderRemaining, initialAttArmy, initialDefArmy);
  const attackerRemaining = exchange.attackerRemaining;
  defenderRemaining = exchange.defenderRemaining;
  const attackerThreshold = exchange.attackerThreshold;
  const defenderThreshold = exchange.defenderThreshold;
  player.pocket.army = attackerRemaining;
  let winnerName = player.name;
  let winnerIndex = playerIndex;
  if (attackerRemaining <= attackerThreshold && defenderRemaining > defenderThreshold) {
    winnerName = "\u0422\u0440\u043e\u043b\u043b\u0438";
    winnerIndex = null;
  } else if (attackerRemaining > attackerThreshold && defenderRemaining <= defenderThreshold) {
    winnerName = player.name;
    winnerIndex = playerIndex;
  } else if (defenderRemaining > attackerRemaining) {
    winnerName = "\u0422\u0440\u043e\u043b\u043b\u0438";
    winnerIndex = null;
  }
  const playerWon = winnerIndex === playerIndex;
  let eventGoldReward = 0;
  if (playerWon) {
    const hadTrollClub = (player.trollClubCount || 0) > 0;
    player.trollClubCount = (player.trollClubCount || 0) + 1;
    const gotToken = Math.random() < 0.5;
    if (gotToken) {
      player.tokenCount = (player.tokenCount || 0) + 1;
    }
    if (isTrollHuntActive()) {
      eventGoldReward = WORLD_EVENT_TROLL_HUNT_GOLD_REWARD;
      player.pocket.gold += eventGoldReward;
    }
    if (isDayBuffActive("trollGold")) {
      player.pocket.gold += 700;
      eventGoldReward += 700;
    }
    if (!hadTrollClub) {
      player.attack += 8;
      showPickupToast("Вы получили Дубинку троллей: +8 атаки.");
    } else {
      showPickupToast("Вы получили Дубинку троллей.");
    }
    if (gotToken) {
      showPickupToast("Вы получили Жетон.");
    }
    if (eventGoldReward > 0) {
      showLayerAwarePickupToast(playerIndex, `Охота на троллей: +${eventGoldReward} золота в карман.`);
    }
  }
  updatePlayerResources(playerIndex);
  updateInventory(playerIndex);
  return {
    type: "troll",
    attackerIndex: playerIndex,
    attackerName: player.name,
    attackerLost: initialAttArmy - attackerRemaining,
    defenderLost: initialDefArmy - defenderRemaining,
    attackerRemaining,
    defenderRemaining,
    winnerName,
    winnerIndex,
    defenderInitial: initialDefArmy,
    goldReward: eventGoldReward
  };
}

function stealResources(winnerIndex, loserIndex, options = {}) {
  const winner = players[winnerIndex];
  const loser = players[loserIndex];
    const stealRatio = Math.max(0, Math.min(1, Number(options.stealRatio ?? 0.8)));
    const stolen = {gold: 0, army: 0, resources: 0};
    ["gold", "army", "resources"].forEach(type => {
      const protectedAmount = type === "army"
        ? Math.min(loser.pocket.army || 0, Math.max(0, options.protectedArmy || 0))
        : 0;
      const availableAmount = Math.max(0, (loser.pocket[type] || 0) - protectedAmount);
      const amount = Math.floor(availableAmount * stealRatio);
      if (amount <= 0) return;
      loser.pocket[type] -= amount;
      winner.pocket[type] += amount;
      stolen[type] = amount;
    });
    updatePlayerResources(loserIndex);
    updatePlayerResources(winnerIndex);
  return stolen;
}

function resolveBarbarianBattle(playerIndex, barbarian) {
  const player = players[playerIndex];
  if (!player) return null;
  const initialAttArmy = Math.max(0, player.pocket.army);
  let initialDefArmy = barbarian.army;
  if (getTimeOfDay().key === "night") {
    initialDefArmy = Math.ceil(initialDefArmy * 1.5);
  } else if (getTimeOfDay().key === "morning") {
    initialDefArmy = Math.ceil(initialDefArmy * 0.7);
  }
  let defenderRemaining = initialDefArmy;
  const heroStrike = Math.max(0, player.attack || 0);
  if (heroStrike > 0 && defenderRemaining > 0) {
    defenderRemaining = Math.max(0, defenderRemaining - heroStrike);
  }
  const exchange = simulateArmyExchange(initialAttArmy, defenderRemaining, initialAttArmy, initialDefArmy);
  const attackerRemaining = exchange.attackerRemaining;
  defenderRemaining = exchange.defenderRemaining;
  const attackerThreshold = exchange.attackerThreshold;
  const defenderThreshold = exchange.defenderThreshold;
  player.pocket.army = attackerRemaining;
  let winnerName = player.name;
  let winnerIndex = playerIndex;
  if (attackerRemaining <= attackerThreshold && defenderRemaining > defenderThreshold) {
    winnerName = "Варвары";
    winnerIndex = null;
  } else if (attackerRemaining > attackerThreshold && defenderRemaining <= defenderThreshold) {
    winnerName = player.name;
    winnerIndex = playerIndex;
  } else if (defenderRemaining > attackerRemaining) {
    winnerName = "Варвары";
    winnerIndex = null;
  }
  const playerWon = winnerIndex === playerIndex;
  const rewardMultiplier = turnCounter >= 150 ? 1.7 : 1;
  const influenceReward = playerWon ? Math.floor(scaleBarbarianReward(initialDefArmy, 35, 60) * rewardMultiplier) : 0;
  const goldReward = playerWon ? Math.floor(scaleBarbarianReward(initialDefArmy, 100, 175) * rewardMultiplier) : 0;
  const resourceReward = playerWon ? Math.floor(scaleBarbarianReward(initialDefArmy, 10, 17) * rewardMultiplier) : 0;
  let penaltyGold = 0;
  let penaltyResources = 0;
  if (playerWon) {
    player.resources.influence += influenceReward;
    player.pocket.gold += goldReward;
    player.pocket.resources += resourceReward;
    updatePlayerResources(playerIndex);
  } else {
    penaltyGold = Math.floor(player.pocket.gold * 0.5);
    penaltyResources = Math.floor(player.pocket.resources * 0.5);
    player.pocket.gold = Math.max(0, player.pocket.gold - penaltyGold);
    player.pocket.resources = Math.max(0, player.pocket.resources - penaltyResources);
    showPickupToast(`В карман: потери ${penaltyGold} золота, ${penaltyResources} ресурсов`);
    updatePlayerResources(playerIndex);
  }
  return {
    type: "barbarian",
    attackerIndex: playerIndex,
    attackerName: player.name,
    attackerLost: initialAttArmy - attackerRemaining,
    defenderLost: initialDefArmy - defenderRemaining,
    attackerRemaining,
    defenderRemaining,
    winnerName,
    winnerIndex,
    influenceReward,
    goldReward,
    resourceReward,
    penaltyGold,
    penaltyResources,
    defenderInitial: initialDefArmy
  };
}

function resolveDragonBattle(playerIndex, dragonArmy = 75) {
  const player = players[playerIndex];
  if (!player) return null;
  const initialAttArmy = Math.max(0, player.pocket.army);
  const initialDefArmy = Math.max(0, dragonArmy);
  let defenderRemaining = initialDefArmy;
  const heroStrike = Math.max(0, player.attack || 0);
  if (heroStrike > 0 && defenderRemaining > 0) {
    defenderRemaining = Math.max(0, defenderRemaining - heroStrike);
  }
  const exchange = simulateArmyExchange(initialAttArmy, defenderRemaining, initialAttArmy, initialDefArmy);
  const attackerRemaining = exchange.attackerRemaining;
  defenderRemaining = exchange.defenderRemaining;
  const attackerThreshold = exchange.attackerThreshold;
  const defenderThreshold = exchange.defenderThreshold;
  player.pocket.army = attackerRemaining;
  let winnerName = player.name;
  let winnerIndex = playerIndex;
  if (attackerRemaining <= attackerThreshold && defenderRemaining > defenderThreshold) {
    winnerName = "Дракон";
    winnerIndex = null;
  } else if (attackerRemaining > attackerThreshold && defenderRemaining <= defenderThreshold) {
    winnerName = player.name;
    winnerIndex = playerIndex;
  } else if (defenderRemaining > attackerRemaining) {
    winnerName = "Дракон";
    winnerIndex = null;
  }
  updatePlayerResources(playerIndex);
  return {
    type: "dragon",
    attackerIndex: playerIndex,
    attackerName: player.name,
    attackerLost: initialAttArmy - attackerRemaining,
    defenderLost: initialDefArmy - defenderRemaining,
    attackerRemaining,
    defenderRemaining,
    winnerName,
    winnerIndex,
    defenderInitial: initialDefArmy
  };
}

function getPlayerBattleCardWinnerIndex(attackerIndex, defenderIndex, attackerCard, defenderCard) {
  if (!PLAYER_BATTLE_CARD_RULES[attackerCard] || !PLAYER_BATTLE_CARD_RULES[defenderCard]) return null;
  if (attackerCard === defenderCard) return null;
  return PLAYER_BATTLE_CARD_RULES[attackerCard].beats === defenderCard
    ? attackerIndex
    : defenderIndex;
}

function getPlayerBattleDroppableItems(player) {
  const items = [];
  const addCountItem = (property, label, onRemove = null) => {
    const count = Math.max(0, player[property] || 0);
    if (count <= 0) return;
    items.push({
      label,
      remove() {
        const before = Math.max(0, player[property] || 0);
        player[property] = Math.max(0, before - 1);
        if (onRemove) onRemove(before);
      }
    });
  };
  const addBooleanItem = (property, label, attackLoss = 0) => {
    if (!player[property]) return;
    items.push({
      label,
      remove() {
        player[property] = false;
        if (attackLoss > 0) {
          player.attack = Math.max(0, (player.attack || 0) - attackLoss);
        }
      }
    });
  };

  addCountItem("poisonCount", "Яд");
  addCountItem("invisPotionCount", "Зелье невидимости");
  addCountItem("luckPotionCount", "Зелье удачи");
  addCountItem("invulnPotionCount", "Зелье неприкосновенности");
  addCountItem("cloverCount", "Клевер");
  addCountItem("flowerCount", "Таинственный цветок");
  addCountItem("voidShardCount", "Осколок пустоты");
  addCountItem("tokenCount", "Жетон");
  addCountItem("bootsCount", "Сапоги");
  addCountItem(
    "ballistaCount",
    getPlayerBallistaLevel(player) >= 2 ? "Баллиста II" : "Баллиста",
    before => {
      if (before <= 1) {
        player.ballistaLevel = 0;
        player.ballistaShotsThisTurn = 0;
      }
    }
  );
  addCountItem("boltCount", "Болт");
  addCountItem("harpoonCount", "Горпун");
  addCountItem("trapStunCount", "Ловушка-стан");
  addCountItem("bridgeCount", "Мост");
  addCountItem("ringCount", "Кольцо убеждения");
  addCountItem("terrorRingCount", "Кольцо ужаса", () => {
    player.attack = Math.max(0, (player.attack || 0) - 8);
  });
  addCountItem("rainbowStoneCount", "Радужный камень");
  addCountItem("mysticStoneCount", "Необычный камень");
  addCountItem("trollClubCount", "Дубинка троллей", before => {
    if (before === 1) player.attack = Math.max(0, (player.attack || 0) - 8);
  });
  addCountItem("heroHiltCount", "Рукоять меча героя");
  addCountItem("werewolfFangCount", "Клык оборотня", () => {
    player.attack = Math.max(0, (player.attack || 0) - 12);
  });
  addCountItem("werewolfAmuletCount", "Амулет оборотня");
  addCountItem("luckAmuletCount", "Амулет удачи");
  if ((player.builderAmuletCount || 0) > 0) {
    items.push({
      label: "Амулет строителя",
      remove() {
        player.builderAmuletCount = Math.max(0, (player.builderAmuletCount || 0) - 1);
        if (player.builderAmuletCount <= 0) {
          player.builderAmuletChargeCount = 0;
          player.builderAmuletTurnCounter = 0;
        }
      }
    });
  }
  addBooleanItem("hasCrystalSword", "Кристальный меч", 10);
  addBooleanItem("hasSword", "Меч героя");
  addCountItem("fogOfWarCount", "Туман войны");
  return items;
}

function tryKnockRandomPlayerBattleItem(targetPlayerIndex) {
  const target = players[targetPlayerIndex];
  if (!target) return { success: false, reason: "no-target" };
  const items = getPlayerBattleDroppableItems(target);
  if (!items.length) return { success: false, reason: "empty" };
  if (Math.random() >= 0.5) return { success: false, reason: "chance" };
  const item = items[Math.floor(Math.random() * items.length)];
  item.remove();
  updatePlayerResources(targetPlayerIndex);
  updateInventory(targetPlayerIndex);
  return { success: true, label: item.label };
}

function getPlayerBattlePersonalStrike(player, ownCard, enemyCard) {
  let strike = Math.max(0, player?.attack || 0);
  if (ownCard === "attack") strike *= 2.25;
  if (enemyCard === "feint") strike *= 0.25;
  return Math.max(0, Math.floor(strike));
}

function getPlayerBattleArmyAllocation(initialArmy, cardKey) {
  const reserve = cardKey === "defense" ? Math.floor(initialArmy * 0.75) : 0;
  return {
    reserve,
    fighting: Math.max(0, initialArmy - reserve)
  };
}

function resolveBattle(attackerIndex, defenderIndex, options = {}) {
  const attacker = players[attackerIndex];
  const defender = players[defenderIndex];
  if (!attacker || !defender) return null;
  if ((defender.invulnTurnsRemaining || 0) > 0) {
    showPickupToast("На противника действует неприкосновенность — атака невозможна.");
    return null;
  }

  const attackerCard = PLAYER_BATTLE_CARD_RULES[options.attackerCard] ? options.attackerCard : "attack";
  const defenderCard = PLAYER_BATTLE_CARD_RULES[options.defenderCard] ? options.defenderCard : "attack";
  const initialAttArmy = Math.max(0, attacker.pocket.army || 0);
  const initialDefArmy = Math.max(0, defender.pocket.army || 0);
  const attackerAllocation = getPlayerBattleArmyAllocation(initialAttArmy, attackerCard);
  const defenderAllocation = getPlayerBattleArmyAllocation(initialDefArmy, defenderCard);
  let attackerFighting = attackerAllocation.fighting;
  let defenderFighting = defenderAllocation.fighting;
  const cardWinnerIndex = getPlayerBattleCardWinnerIndex(
    attackerIndex,
    defenderIndex,
    attackerCard,
    defenderCard
  );

  let attackerCardBonusDamage = 0;
  let defenderCardBonusDamage = 0;
  let knockedItem = null;
  if (cardWinnerIndex === attackerIndex) {
    if (attackerCard === "attack") {
      attackerCardBonusDamage = Math.min(defenderFighting, Math.floor(initialAttArmy * 0.2));
      defenderFighting = Math.max(0, defenderFighting - attackerCardBonusDamage);
    } else if (attackerCard === "feint") {
      knockedItem = {
        sourcePlayerIndex: attackerIndex,
        targetPlayerIndex: defenderIndex,
        ...tryKnockRandomPlayerBattleItem(defenderIndex)
      };
    }
  } else if (cardWinnerIndex === defenderIndex) {
    if (defenderCard === "attack") {
      defenderCardBonusDamage = Math.min(attackerFighting, Math.floor(initialDefArmy * 0.2));
      attackerFighting = Math.max(0, attackerFighting - defenderCardBonusDamage);
    } else if (defenderCard === "feint") {
      knockedItem = {
        sourcePlayerIndex: defenderIndex,
        targetPlayerIndex: attackerIndex,
        ...tryKnockRandomPlayerBattleItem(attackerIndex)
      };
    }
  }

  // Сохраняем прежний порядок личных атак: первым бьёт защищающийся герой.
  const defenderStrike = getPlayerBattlePersonalStrike(defender, defenderCard, attackerCard);
  const defenderPersonalDamage = Math.min(attackerFighting, defenderStrike);
  attackerFighting = Math.max(0, attackerFighting - defenderPersonalDamage);

  const attackerStrike = getPlayerBattlePersonalStrike(attacker, attackerCard, defenderCard);
  const attackerPersonalDamage = Math.min(defenderFighting, attackerStrike);
  defenderFighting = Math.max(0, defenderFighting - attackerPersonalDamage);

  // Основной обмен армий одновременный и строго 1 к 1.
  const armyExchangeLoss = Math.min(attackerFighting, defenderFighting);
  attackerFighting = Math.max(0, attackerFighting - armyExchangeLoss);
  defenderFighting = Math.max(0, defenderFighting - armyExchangeLoss);

  const attackerRemaining = attackerFighting + attackerAllocation.reserve;
  const defenderRemaining = defenderFighting + defenderAllocation.reserve;
  attacker.pocket.army = attackerRemaining;
  defender.pocket.army = defenderRemaining;

  const winnerIndex = defenderRemaining > attackerRemaining ? defenderIndex : attackerIndex;
  const loserIndex = winnerIndex === attackerIndex ? defenderIndex : attackerIndex;
  const loser = players[loserIndex];
  let influenceLoss = 0;
  if (loser) {
    influenceLoss = Math.min(HERO_BATTLE_INFLUENCE_LOSS, Math.max(0, loser.resources.influence || 0));
    loser.resources.influence = Math.max(0, (loser.resources.influence || 0) - HERO_BATTLE_INFLUENCE_LOSS);
  }

  const loserProtectedArmy = loserIndex === attackerIndex
    ? attackerAllocation.reserve
    : defenderAllocation.reserve;
  const loserCard = loserIndex === attackerIndex ? attackerCard : defenderCard;
  const defenseCardProtectedLoot = loserCard === "defense" && cardWinnerIndex === loserIndex;
  const stolenRatio = defenseCardProtectedLoot ? 0.25 : 0.8;
  let stolen = null;
  if (!options.noSteal) {
    stolen = stealResources(winnerIndex, loserIndex, {
      protectedArmy: loserProtectedArmy,
      stealRatio: stolenRatio
    });
  }
  updatePlayerResources(attackerIndex);
  updatePlayerResources(defenderIndex);

  return {
    attackerName: attacker.name,
    defenderName: defender.name,
    attackerLost: initialAttArmy - attackerRemaining,
    defenderLost: initialDefArmy - defenderRemaining,
    attackerRemaining,
    defenderRemaining,
    winnerName: players[winnerIndex].name,
    winnerIndex,
    defenderIndex,
    attackerIndex,
    influenceLoss,
    stolen,
    playerBattleCards: { attacker: attackerCard, defender: defenderCard },
    cardWinnerIndex,
    attackerReserve: attackerAllocation.reserve,
    defenderReserve: defenderAllocation.reserve,
    attackerCardBonusDamage,
    defenderCardBonusDamage,
    attackerPersonalDamage,
    defenderPersonalDamage,
    armyExchangeLoss,
    knockedItem,
    stolenRatio,
    defenseCardProtectedLoot
  };
}

function isOnlinePlayerBattleMode() {
  return typeof socket !== "undefined" &&
    Boolean(socket) &&
    typeof onlineMatchStarted !== "undefined" &&
    Boolean(onlineMatchStarted);
}

function clonePendingPlayerBattleForSync() {
  if (!pendingPlayerBattle) return null;
  const submitted = players.map((_, index) => Boolean(pendingPlayerBattle.choices?.[index]));
  return {
    id: pendingPlayerBattle.id,
    attackerIndex: pendingPlayerBattle.attackerIndex,
    defenderIndex: pendingPlayerBattle.defenderIndex,
    targetX: pendingPlayerBattle.targetX,
    targetY: pendingPlayerBattle.targetY,
    noSteal: Boolean(pendingPlayerBattle.noSteal),
    defenderOwnsCastle: Boolean(pendingPlayerBattle.defenderOwnsCastle),
    phase: pendingPlayerBattle.phase || "choosing",
    choicesSubmitted: submitted
  };
}

function getPlayerBattleCardMarkup(cardKey, options = {}) {
  const card = PLAYER_BATTLE_CARD_RULES[cardKey];
  if (!card) return "";
  const tag = options.button ? "button" : "article";
  const attributes = options.button
    ? `type="button" data-player-battle-card="${card.key}"`
    : "";
  const classes = ["player-battle-tactic"];
  if (options.selected) classes.push("is-selected");
  if (options.winner) classes.push("is-card-winner");
  if (options.loser) classes.push("is-card-loser");
  return `<${tag} ${attributes} class="${classes.join(" ")}">
    ${options.sideLabel ? `<span class="player-battle-reveal-side">${options.sideLabel}</span>` : ""}
    <span class="player-battle-tactic-mark" aria-hidden="true">${card.mark}</span>
    <span class="player-battle-tactic-name">${card.name}</span>
    <span class="player-battle-tactic-effect"><strong>Гарантированно</strong>${card.always}</span>
    <span class="player-battle-tactic-effect"><strong>Если карта победила</strong>${card.victory}</span>
  </${tag}>`;
}

function openPlayerBattleCardModal(playerIndex, battle = pendingPlayerBattle) {
  if (!playerBattleCardModal || !playerBattleCards || !battle) return false;
  if (isOnlinePlayerBattleMode() && typeof localPlayerIndex === "number" && localPlayerIndex !== playerIndex) {
    return false;
  }
  playerBattleCardModal.dataset.battleId = String(battle.id);
  playerBattleCardModal.dataset.playerIndex = String(playerIndex);
  playerBattleCardModal.dataset.phase = "choosing";
  if (playerBattleCardTitle) {
    playerBattleCardTitle.textContent = `${players[playerIndex]?.name || `Игрок ${playerIndex + 1}`}, выберите карту`;
  }
  if (playerBattleCardStatus) {
    playerBattleCardStatus.textContent = "Соперник не увидит ваш выбор до одновременного раскрытия.";
  }
  playerBattleCards.className = "player-battle-card-grid";
  playerBattleCards.innerHTML = Object.keys(PLAYER_BATTLE_CARD_RULES)
    .map(cardKey => getPlayerBattleCardMarkup(cardKey, { button: true }))
    .join("");
  playerBattleCardModal.style.display = "flex";
  return true;
}

function showPlayerBattleCardWaiting(playerIndex, cardKey, battleId) {
  if (!playerBattleCardModal || !playerBattleCards) return;
  if (String(playerBattleCardModal.dataset.battleId || "") !== String(battleId)) return;
  if (Number(playerBattleCardModal.dataset.playerIndex) !== playerIndex) return;
  playerBattleCardModal.dataset.phase = "waiting";
  if (playerBattleCardTitle) playerBattleCardTitle.textContent = "Выбор зафиксирован";
  if (playerBattleCardStatus) playerBattleCardStatus.textContent = "Ожидаем выбор соперника…";
  playerBattleCards.className = "player-battle-card-grid is-waiting";
  playerBattleCards.querySelectorAll("[data-player-battle-card]").forEach(button => {
    button.disabled = true;
    button.classList.toggle("is-selected", button.dataset.playerBattleCard === cardKey);
  });
}

function showPlayerBattleCardReveal(payload) {
  if (!payload || !playerBattleCardModal || !playerBattleCards) return;
  const attackerCard = PLAYER_BATTLE_CARD_RULES[payload.attackerCard];
  const defenderCard = PLAYER_BATTLE_CARD_RULES[payload.defenderCard];
  if (!attackerCard || !defenderCard) return;
  const attackerIndex = Number(payload.attackerIndex);
  const defenderIndex = Number(payload.defenderIndex);
  const winnerIndex = Number.isInteger(payload.cardWinnerIndex) ? payload.cardWinnerIndex : null;
  playerBattleCardModal.dataset.battleId = String(payload.battleId);
  playerBattleCardModal.dataset.phase = "reveal";
  if (playerBattleCardTitle) playerBattleCardTitle.textContent = "Карты раскрыты";
  if (playerBattleCardStatus) {
    playerBattleCardStatus.textContent = winnerIndex === null
      ? `Оба игрока выбрали «${attackerCard.name}». Бонус победы не срабатывает.`
      : `${players[winnerIndex]?.name || `Игрок ${winnerIndex + 1}`} выигрывает карточный розыгрыш.`;
  }
  playerBattleCards.className = "player-battle-reveal-grid";
  playerBattleCards.innerHTML = [
    getPlayerBattleCardMarkup(attackerCard.key, {
      sideLabel: `${players[attackerIndex]?.name || `Игрок ${attackerIndex + 1}`} · нападающий`,
      winner: winnerIndex === attackerIndex,
      loser: winnerIndex === defenderIndex
    }),
    '<div class="player-battle-reveal-vs">VS</div>',
    getPlayerBattleCardMarkup(defenderCard.key, {
      sideLabel: `${players[defenderIndex]?.name || `Игрок ${defenderIndex + 1}`} · защищающийся`,
      winner: winnerIndex === defenderIndex,
      loser: winnerIndex === attackerIndex
    })
  ].join("");
  playerBattleCardModal.style.display = "flex";
}

function closePlayerBattleCardModal() {
  if (!playerBattleCardModal) return;
  playerBattleCardModal.style.display = "none";
  delete playerBattleCardModal.dataset.battleId;
  delete playerBattleCardModal.dataset.playerIndex;
  delete playerBattleCardModal.dataset.phase;
  if (playerBattleCards) playerBattleCards.innerHTML = "";
}

function presentPlayerBattleChoiceToPlayer(playerIndex) {
  if (!pendingPlayerBattle) return;
  if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
    emitPrivateUiToPlayer(playerIndex, "showPlayerBattleCards", {
      battle: clonePendingPlayerBattleForSync(),
      playerIndex
    });
    return;
  }
  openPlayerBattleCardModal(playerIndex, pendingPlayerBattle);
}

function presentPlayerBattleRevealToParticipants(payload) {
  [payload.attackerIndex, payload.defenderIndex].forEach(playerIndex => {
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "revealPlayerBattleCards", payload);
    } else if (!isOnlinePlayerBattleMode() || localPlayerIndex === playerIndex) {
      showPlayerBattleCardReveal(payload);
    }
  });
}

function hidePlayerBattleCardsForParticipants(attackerIndex, defenderIndex) {
  [attackerIndex, defenderIndex].forEach(playerIndex => {
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "hidePlayerBattleCards", {});
    }
  });
  closePlayerBattleCardModal();
}

function beginPlayerBattleCardSelection(attackerIndex, defenderIndex, options = {}) {
  if (pendingPlayerBattle) return false;
  const attacker = players[attackerIndex];
  const defender = players[defenderIndex];
  if (!attacker || !defender) return false;
  const attackerLayer = attacker.layer || WORLD_LAYER_UPPER;
  const defenderLayer = defender.layer || WORLD_LAYER_UPPER;
  const targetX = Number(options.targetX);
  const targetY = Number(options.targetY);
  const targetKey = Number.isFinite(targetX) && Number.isFinite(targetY)
    ? `${targetX},${targetY}`
    : `${defender.x},${defender.y}`;
  if (
    attackerLayer === WORLD_LAYER_UPPER &&
    defenderLayer === WORLD_LAYER_UPPER &&
    isTavernSafeCell(targetKey, WORLD_LAYER_UPPER)
  ) {
    showPrivatePickupToastForPlayer(attackerIndex, "В таверне действует перемирие — нападать здесь нельзя.");
    return false;
  }
  playerBattleSequenceId += 1;
  pendingPlayerBattle = {
    id: playerBattleSequenceId,
    attackerIndex,
    defenderIndex,
    targetX: Number(options.targetX),
    targetY: Number(options.targetY),
    noSteal: Boolean(options.noSteal),
    defenderOwnsCastle: Boolean(options.defenderOwnsCastle),
    phase: "choosing",
    choices: players.map(() => null)
  };
  playerBattleRevealState = { attackerIndex, defenderIndex, battleId: pendingPlayerBattle.id };
  localPlayerBattleSelection = null;
  players.forEach((_, index) => updatePlayerResources(index));

  if (isOnlinePlayerBattleMode()) {
    presentPlayerBattleChoiceToPlayer(attackerIndex);
    presentPlayerBattleChoiceToPlayer(defenderIndex);
  } else {
    presentPlayerBattleChoiceToPlayer(attackerIndex);
  }
  if (typeof emitStateNow === "function") emitStateNow(true);
  return true;
}

function finishPendingPlayerBattle(battleId) {
  if (!pendingPlayerBattle || pendingPlayerBattle.id !== battleId) return false;
  if (pendingPlayerBattle.phase !== "reveal") return false;
  const battle = pendingPlayerBattle;
  const attackerCard = battle.choices[battle.attackerIndex];
  const defenderCard = battle.choices[battle.defenderIndex];
  pendingPlayerBattle = null;
  playerBattleResolveTimer = null;
  hidePlayerBattleCardsForParticipants(battle.attackerIndex, battle.defenderIndex);

  const result = resolveBattle(battle.attackerIndex, battle.defenderIndex, {
    noSteal: battle.noSteal,
    attackerCard,
    defenderCard
  });
  if (!result) {
    endTurn();
    if (typeof emitStateNow === "function") emitStateNow(true);
    return false;
  }

  const attackerWon = result.winnerIndex === battle.attackerIndex;
  if (battle.defenderOwnsCastle && attackerWon) {
    showPickupToast("Победа над игроком. Начинается штурм замка.");
    finalizeMove(battle.targetX, battle.targetY);
  } else {
    showBattleModal(result);
    if (attackerWon) {
      finalizeMove(battle.targetX, battle.targetY);
    } else {
      endTurn();
    }
  }
  if (typeof emitStateNow === "function") emitStateNow(true);
  return true;
}

function submitPlayerBattleCard(playerIndex, cardKey, battleId) {
  if (!pendingPlayerBattle || pendingPlayerBattle.id !== Number(battleId)) return false;
  if (pendingPlayerBattle.phase !== "choosing") return false;
  if (!PLAYER_BATTLE_CARD_RULES[cardKey]) return false;
  if (![pendingPlayerBattle.attackerIndex, pendingPlayerBattle.defenderIndex].includes(playerIndex)) return false;
  if (pendingPlayerBattle.choices[playerIndex]) return false;

  pendingPlayerBattle.choices[playerIndex] = cardKey;
  if (!isOnlinePlayerBattleMode() || localPlayerIndex === playerIndex) {
    showPlayerBattleCardWaiting(playerIndex, cardKey, pendingPlayerBattle.id);
  }
  const attackerChoice = pendingPlayerBattle.choices[pendingPlayerBattle.attackerIndex];
  const defenderChoice = pendingPlayerBattle.choices[pendingPlayerBattle.defenderIndex];
  if (!attackerChoice || !defenderChoice) {
    if (!isOnlinePlayerBattleMode()) {
      const nextPlayerIndex = playerIndex === pendingPlayerBattle.attackerIndex
        ? pendingPlayerBattle.defenderIndex
        : pendingPlayerBattle.attackerIndex;
      setTimeout(() => openPlayerBattleCardModal(nextPlayerIndex, pendingPlayerBattle), 250);
    }
    if (typeof emitStateNow === "function") emitStateNow(true);
    return true;
  }

  pendingPlayerBattle.phase = "reveal";
  const cardWinnerIndex = getPlayerBattleCardWinnerIndex(
    pendingPlayerBattle.attackerIndex,
    pendingPlayerBattle.defenderIndex,
    attackerChoice,
    defenderChoice
  );
  const revealPayload = {
    battleId: pendingPlayerBattle.id,
    attackerIndex: pendingPlayerBattle.attackerIndex,
    defenderIndex: pendingPlayerBattle.defenderIndex,
    attackerCard: attackerChoice,
    defenderCard: defenderChoice,
    cardWinnerIndex
  };
  presentPlayerBattleRevealToParticipants(revealPayload);
  if (typeof emitStateNow === "function") emitStateNow(true);
  if (playerBattleResolveTimer) clearTimeout(playerBattleResolveTimer);
  playerBattleResolveTimer = setTimeout(
    () => finishPendingPlayerBattle(revealPayload.battleId),
    PLAYER_BATTLE_CARD_REVEAL_DELAY
  );
  return true;
}

function syncPlayerBattleCardModalFromState() {
  if (!pendingPlayerBattle) {
    closePlayerBattleCardModal();
    return;
  }
  if (!isOnlinePlayerBattleMode() || typeof localPlayerIndex !== "number") return;
  const viewerIndex = localPlayerIndex;
  if (![pendingPlayerBattle.attackerIndex, pendingPlayerBattle.defenderIndex].includes(viewerIndex)) return;
  const currentBattleId = String(playerBattleCardModal?.dataset.battleId || "");
  const currentPhase = playerBattleCardModal?.dataset.phase || "";
  if (pendingPlayerBattle.phase === "reveal" && currentBattleId === String(pendingPlayerBattle.id) && currentPhase === "reveal") {
    return;
  }
  const submitted = Boolean(pendingPlayerBattle.choicesSubmitted?.[viewerIndex]);
  if (currentBattleId !== String(pendingPlayerBattle.id)) {
    openPlayerBattleCardModal(viewerIndex, pendingPlayerBattle);
  }
  if (submitted) {
    const selectedCard = localPlayerBattleSelection?.battleId === pendingPlayerBattle.id
      ? localPlayerBattleSelection.cardKey
      : null;
    showPlayerBattleCardWaiting(viewerIndex, selectedCard, pendingPlayerBattle.id);
  }
}

if (playerBattleCards) {
  playerBattleCards.addEventListener("click", event => {
    const button = event.target.closest("[data-player-battle-card]");
    if (!button || button.disabled) return;
    const cardKey = button.dataset.playerBattleCard;
    const playerIndex = Number(playerBattleCardModal?.dataset.playerIndex);
    const battleId = Number(playerBattleCardModal?.dataset.battleId);
    if (!Number.isInteger(playerIndex) || !Number.isInteger(battleId)) return;
    localPlayerBattleSelection = { battleId, cardKey };
    if (shouldRoutePrivateUiActionToHost(playerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "playerBattle",
        actionType: "chooseCard",
        playerIndex,
        payload: { battleId, cardKey }
      });
      showPlayerBattleCardWaiting(playerIndex, cardKey, battleId);
      return;
    }
    submitPlayerBattleCard(playerIndex, cardKey, battleId);
  });
}

function resolveMercenaryBattle(playerIndex, mercenary) {
  const player = players[playerIndex];
  if (!player || !mercenary) return null;
  const initialAttArmy = Math.max(0, player.pocket.army);
  const initialDefArmy = Math.max(0, mercenary.strength);
  const attackerThreshold = Math.max(1, Math.round(initialAttArmy * 0.1));
  const defenderThreshold = Math.max(1, Math.round(initialDefArmy * 0.1));
  let defenderRemaining = initialDefArmy;
  let attackersUsed = 0;
  const availableAttackers = initialAttArmy;
  while (attackersUsed < availableAttackers && defenderRemaining > defenderThreshold) {
    const maxKillAllowed = Math.max(1, defenderRemaining - defenderThreshold);
    const kills = Math.min(Math.floor(Math.random() * 3) + 1, maxKillAllowed);
    defenderRemaining = Math.max(defenderThreshold, defenderRemaining - kills);
    attackersUsed += 1;
  }
  const attackerRemaining = Math.max(0, availableAttackers - attackersUsed);
  player.pocket.army = attackerRemaining;

  let winnerName = player.name;
  let winnerIndex = playerIndex;
  if (attackerRemaining <= attackerThreshold && defenderRemaining > defenderThreshold) {
    winnerName = "Наёмники";
    winnerIndex = null;
  } else if (attackerRemaining > attackerThreshold && defenderRemaining <= defenderThreshold) {
    winnerName = player.name;
    winnerIndex = playerIndex;
  } else if (defenderRemaining > attackerRemaining) {
    winnerName = "Наёмники";
    winnerIndex = null;
  }
  mercenary.strength = Math.max(0, defenderRemaining);
  updatePlayerResources(playerIndex);
  return {
    type: "mercenary",
    attackerIndex: playerIndex,
    attackerName: player.name,
    attackerLost: initialAttArmy - attackerRemaining,
    defenderLost: initialDefArmy - defenderRemaining,
    attackerRemaining,
    defenderRemaining,
    winnerName,
    winnerIndex
  };
}

function resolveCastleBattle(attackerIndex, castleKey) {
  const attacker = players[attackerIndex];
  const stats = ensureCastleStats(castleKey);
  const defenderOwner = castleOwnersByKey[castleKey];
  const initialDefArmy = Math.max(0, stats.storageArmy || 0);
  const initialAttArmy = Math.max(0, attacker.pocket.army || 0);
  let defenderRemaining = initialDefArmy;
  let attackerRemaining = initialAttArmy;
  const defenderThreshold = initialDefArmy > 0 ? Math.ceil(initialDefArmy * 0.25) : 0;

  const attackerStrike = Math.max(0, attacker.attack || 0);
  if (attackerStrike > 0 && defenderRemaining > 0) {
    defenderRemaining = Math.max(defenderThreshold, defenderRemaining - attackerStrike);
  }

  while (attackerRemaining > 3 && defenderRemaining > defenderThreshold) {
    const defHit = Math.floor(Math.random() * 3) + 1;
    attackerRemaining = Math.max(0, attackerRemaining - defHit);
    if (attackerRemaining <= 3) break;
    const attHit = Math.floor(Math.random() * 3) + 1;
    defenderRemaining = Math.max(defenderThreshold, defenderRemaining - attHit);
  }

  let armorRemaining = stats.armorCurrent;
  let healthRemaining = stats.healthCurrent;
  const shouldFightArmor =
    (initialDefArmy === 0 || defenderRemaining <= defenderThreshold) &&
    attackerRemaining > 0 &&
    armorRemaining > 0;
  if (shouldFightArmor) {
    while (attackerRemaining > 0 && armorRemaining > 0) {
      const armorHit = Math.floor(Math.random() * 3) + 1;
      armorRemaining = Math.max(0, armorRemaining - armorHit);
      if (armorRemaining <= 0) break;
      const defHit = Math.floor(Math.random() * 3) + 1;
      attackerRemaining = Math.max(0, attackerRemaining - defHit);
    }
  }

  if (armorRemaining <= 0 && attackerRemaining > 0 && healthRemaining > 0) {
    const perUnit = 0.4 + Math.random() * 0.2;
    const damage = attackerRemaining * perUnit;
    healthRemaining = Math.max(0, Math.round((healthRemaining - damage) * 10) / 10);
  }

  attacker.pocket.army = Math.max(0, attackerRemaining);
  stats.storageArmy = Math.max(0, defenderRemaining);
  stats.armorCurrent = Math.max(0, armorRemaining);
  stats.healthCurrent = Math.max(0, healthRemaining);
  if (typeof updateCastleBars === "function") updateCastleBars(castleKey);

  let winner = "Замок";
  let winnerIndex = null;
  if (stats.storageArmy <= 0 && stats.armorCurrent <= 0 && stats.healthCurrent <= 0) {
    winner = attacker.name;
    winnerIndex = attackerIndex;
  } else if (attackerRemaining <= 3) {
    winner = "Замок";
    winnerIndex = null;
  }

  updatePlayerResources(attackerIndex);
  return {
    type: "castle",
    attackerIndex,
    attackerName: attacker.name,
    defenderOwner,
    castleKey,
    attackerLost: initialAttArmy - attackerRemaining,
    defenderLost: initialDefArmy - defenderRemaining,
    attackerRemaining,
    defenderRemaining,
    armorRemaining: stats.armorCurrent,
    healthRemaining: stats.healthCurrent,
    winnerName: winner,
    winnerIndex
  };
}

function buildBattleSummaryLines(result) {
    if (result.type === "barbarian") {
      const rewardLine =
        result.winnerIndex === result.attackerIndex && result.influenceReward
          ? `Награда: +${result.influenceReward} влияние, +${result.goldReward} золота, +${result.resourceReward} ресурсов`
          : null;
      const penaltyLine =
        result.penaltyGold || result.penaltyResources
          ? `Проигравший потерял ${result.penaltyGold || 0} золота и ${result.penaltyResources || 0} ресурсов`
          : null;
      return [
        "<strong>ИТОГИ БОЯ</strong>",
        `${result.attackerName}: Потерял ${result.attackerLost} войск`,
        `Варвары: Потеряли ${result.defenderLost} войск`,
        `Варвары: Изначально ${result.defenderInitial} войск`,
        " ",
        `Победитель : ${result.winnerName}`,
        rewardLine,
        penaltyLine
      ].filter(Boolean);
    }
    if (result.type === "troll") {
      const rewardLine =
        result.winnerIndex === result.attackerIndex && result.goldReward
          ? `Награда: +${result.goldReward} золота`
          : null;
      return [
        "<strong>\u0411\u041e\u0419 \u0421 \u0422\u0420\u041e\u041b\u041b\u042f\u041c\u0418</strong>",
        `${result.attackerName}: \u041f\u043e\u0442\u0435\u0440\u044f\u043b ${result.attackerLost} \u0432\u043e\u0439\u0441\u043a`,
        `\u0422\u0440\u043e\u043b\u043b\u0438: \u041f\u043e\u0442\u0435\u0440\u044f\u043b\u0438 ${result.defenderLost} \u0432\u043e\u0439\u0441\u043a`,
        `\u0422\u0440\u043e\u043b\u043b\u0438: \u0418\u0437\u043d\u0430\u0447\u0430\u043b\u044c\u043d\u043e ${result.defenderInitial} \u0432\u043e\u0439\u0441\u043a`,
        "\u00A0",
        `\u041f\u043e\u0431\u0435\u0434\u0438\u0442\u0435\u043b\u044c : ${result.winnerName}`,
        rewardLine
      ].filter(Boolean);
    }
    if (result.type === "dragon") {
      return [
        "<strong>БОЙ С ДРАКОНОМ</strong>",
        `${result.attackerName}: Потерял ${result.attackerLost} войск`,
        `Дракон: Потерял ${result.defenderLost} войск`,
        `Дракон: Изначально ${result.defenderInitial} войск`,
        "\u00A0",
        `Победитель : ${result.winnerName}`
      ].filter(Boolean);
    }
    if (result.type === "robber") {
      const penaltyLine =
        result.penaltyGold || result.penaltyResources
          ? `Проигравший потерял ${result.penaltyGold || 0} золота, ${result.penaltyResources || 0} ресурсов и влияние -${result.influenceLoss || 0}`
          : null;
      const rewardLine =
        result.goldReward || result.resourceReward
          ? `Награда: +${result.goldReward} золота, +${result.resourceReward} ресурсов`
          : null;
      return [
        "<strong>НА ВАС НАПАЛИ РАЗБОЙНИКИ</strong>",
        "<strong>ИТОГИ БОЯ</strong>",
        `${result.attackerName}: Потерял ${result.attackerLost} войск`,
        `Разбойники: Потеряли ${result.defenderLost} войск`,
        "\u00A0",
        `Победитель : ${result.winnerName}`,
        rewardLine,
        penaltyLine
      ].filter(Boolean);
    }
    if (result.type === "mercenary") {
      return [
        "<strong>БОЙ С НАЁМНИКАМИ</strong>",
        `${result.attackerName}: Потерял ${result.attackerLost} войск`,
        `Наёмники: Потеряли ${result.defenderLost} войск`,
        "\u00A0",
        `Победитель : ${result.winnerName}`
      ].filter(Boolean);
    }
    if (result.type === "castle") {
      return [
        "<strong>БОЙ ЗА ЗАМОК</strong>",
        `${result.attackerName}: Потерял ${result.attackerLost} войск`,
        `Гарнизон: Потерял ${result.defenderLost} войск`,
        `Броня замка: ${result.armorRemaining}`,
        `Здоровье замка: ${result.healthRemaining}`,
        "\u00A0",
        `Победитель : ${result.winnerName}`
      ].filter(Boolean);
    }
    if (result.type === "werewolf") {
      return [
        `<strong>${result.initiatedByWerewolf ? "НАПАДЕНИЕ ОБОРОТНЯ" : "БОЙ С ОБОРОТНЕМ"}</strong>`,
        `${result.playerName}: Потерял ${result.playerArmyLost} войск`,
        `Оборотень нанёс ${result.werewolfDamage} урона по войскам`,
        result.playerAttackPenalty > 0 ? `${result.playerName}: Потерял ${result.playerAttackPenalty} атаку навсегда` : null,
        `Атака героя: -${result.playerAttackDamage} здоровья оборотня`,
        `Войска героя: -${result.playerArmyDamage} здоровья оборотня`,
        `Здоровье оборотня: было ${result.werewolfHealthBefore}, осталось ${result.werewolfHealthAfter}`,
        `Войск в кармане осталось: ${result.playerArmyAfter}`,
        result.fangAwarded ? `${result.playerName} получает артефакт "Клык оборотня" (+12 атаки, +2 к броску хода).` : null,
        result.werewolfHealthAfter <= 0 ? "Оборотень погиб." : "Оборотень выжил и продолжает охоту."
      ].filter(Boolean);
    }
    const lines = [];
    if (result.playerBattleCards) {
      const attackerCard = PLAYER_BATTLE_CARD_RULES[result.playerBattleCards.attacker];
      const defenderCard = PLAYER_BATTLE_CARD_RULES[result.playerBattleCards.defender];
      lines.push(
        "<strong>КАРТОЧНЫЙ РОЗЫГРЫШ</strong>",
        `Игрок ${result.attackerIndex + 1}: ${attackerCard?.name || "—"}`,
        `Игрок ${result.defenderIndex + 1}: ${defenderCard?.name || "—"}`,
        result.cardWinnerIndex === null
          ? "Карты равны — бонус победы не сработал."
          : `Победила карта игрока ${result.cardWinnerIndex + 1}.`
      );
      if (result.attackerReserve > 0) {
        lines.push(`Игрок ${result.attackerIndex + 1}: ${result.attackerReserve} войск сохранено в резерве.`);
      }
      if (result.defenderReserve > 0) {
        lines.push(`Игрок ${result.defenderIndex + 1}: ${result.defenderReserve} войск сохранено в резерве.`);
      }
      if (result.attackerCardBonusDamage > 0) {
        lines.push(`Бонус карты игрока ${result.attackerIndex + 1}: уничтожено ${result.attackerCardBonusDamage} войск без ответа.`);
      }
      if (result.defenderCardBonusDamage > 0) {
        lines.push(`Бонус карты игрока ${result.defenderIndex + 1}: уничтожено ${result.defenderCardBonusDamage} войск без ответа.`);
      }
      if (result.knockedItem) {
        if (result.knockedItem.success) {
          lines.push(`Финт игрока ${result.knockedItem.sourcePlayerIndex + 1}: выбит предмет «${result.knockedItem.label}».`);
        } else if (result.knockedItem.reason === "empty") {
          lines.push("Финт сработал, но в инвентаре противника нечего выбивать.");
        } else {
          lines.push("Финт: попытка выбить предмет не удалась.");
        }
      }
      if (result.defenseCardProtectedLoot) {
        lines.push("Победа «Обороны»: с проигравшего забрано только 25% доступной добычи.");
      }
      lines.push(
        "\u00A0",
        "<strong>ЛИЧНЫЕ АТАКИ</strong>",
        `Защищающийся герой уничтожил ${result.defenderPersonalDamage} войск.`,
        `Нападающий герой уничтожил ${result.attackerPersonalDamage} войск.`,
        `Обмен армий 1 к 1: каждая сторона потеряла ${result.armyExchangeLoss} войск.`,
        "\u00A0"
      );
    }
    lines.push(
      `Игрок ${result.attackerIndex + 1}: Потерял ${result.attackerLost} войск`,
      `Игрок ${result.defenderIndex + 1}: Потерял ${result.defenderLost} войск`,
      "\u00A0",
      `Победитель : ${result.winnerName}`
    );
    const stolenParts = [];
    if (result.stolen) {
      if (result.stolen.gold) stolenParts.push(`${result.stolen.gold} золота`);
      if (result.stolen.army) stolenParts.push(`${result.stolen.army} войск`);
      if (result.stolen.resources) stolenParts.push(`${result.stolen.resources} ресурсов`);
    }
    if (stolenParts.length) {
      lines.push(`Победитель забрал ${stolenParts.join(", ")} из кармана проигравшего.`);
    }
    if (result.influenceLoss > 0) {
      lines.push(`Проигравший также потерял ${result.influenceLoss} влияния.`);
    }
    return lines;
  }

function isSharedPlayerBattle(result) {
  return Boolean(
    result &&
    typeof result.attackerIndex === "number" &&
    typeof result.defenderIndex === "number" &&
    !result.type
  );
}

function shouldLocalPlayerSeeBattleResult(result) {
  if (!result) return false;
  if (!(typeof socket !== "undefined" && socket && typeof onlineMatchStarted !== "undefined" && onlineMatchStarted)) {
    return true;
  }
  if (isSharedPlayerBattle(result)) return true;
  if (typeof localPlayerIndex !== "number") return false;
  return result.attackerIndex === localPlayerIndex || result.defenderIndex === localPlayerIndex;
}

function showBattleModal(result, force = false) {
  if (!battleModal || !battleSummary || !result) return;
  const inMultiplayer = typeof socket !== "undefined" && socket;
  const sharedBattle = isSharedPlayerBattle(result);
  const canLocalSee = shouldLocalPlayerSeeBattleResult(result);
  if (!force) {
    const snapshot = JSON.parse(JSON.stringify(result));
    lastBattleResult = snapshot;
    lastBattleId += 1;
  }
  if (inMultiplayer && !canLocalSee) return;
  if (inMultiplayer && performingRemoteAction && !sharedBattle && !force) return;
  if (inMultiplayer && !force && !isHost) return;
  const lines = buildBattleSummaryLines(result);
  battleSummary.innerHTML = lines.map(line => `<p>${line}</p>`).join("");
  battleModal.style.display = "flex";
}

  function hideBattleModal() {
    if (battleModal) battleModal.style.display = "none";
    resumeTurnFlowAfterModalChange();
  }

  battleClose.addEventListener("click", hideBattleModal);
  battleModal.addEventListener("click", (event) => {
    if (event.target === battleModal) {
      hideBattleModal();
    }
  });

  if (gameOverClose) {
  gameOverClose.addEventListener("click", hideGameOver);
}
if (gameOverModal) {
  gameOverModal.addEventListener("click", (event) => {
    if (event.target === gameOverModal) {
      hideGameOver();
    }
  });
}

function refreshCastleModal(key, playerIndex) {
  if (!castleModal) return;
  const stats = ensureCastleStats(key);
  const player = players[playerIndex];
  castleLevelValue.textContent = stats.level;
  castleArmorValue.textContent = `Броня: ${stats.armorCurrent}`;
  castleHealthValue.textContent = `Здоровье: ${stats.healthCurrent}`;
  const wallBadge = typeof castleWallBadge !== "undefined"
    ? castleWallBadge
    : document.getElementById("castleWallBadge");
  if (wallBadge) {
    wallBadge.style.display = "inline-flex";
    wallBadge.style.visibility = stats.wall ? "visible" : "hidden";
  }
  if (castleNextBonus) {
    const nextLevel = Math.min(3, stats.level + 1);
    if (stats.level >= 3) {
      castleNextBonus.textContent = "Следующий уровень: максимум";
    } else {
      const nextInfo = CASTLE_LEVELS[nextLevel] || CASTLE_LEVELS[stats.level];
      const curInfo = CASTLE_LEVELS[stats.level] || CASTLE_LEVELS[1];
      const armorDelta = Math.max(0, (nextInfo.armor || 0) - (curInfo.armor || 0));
      const healthDelta = Math.max(0, (nextInfo.health || 0) - (curInfo.health || 0));
      castleNextBonus.textContent = `Следующий уровень: +${armorDelta} брони, +${healthDelta} здоровья`;
    }
  }
  const playerResources = player ? player.resources.resources : 0;
  const upgradeCost = stats.level >= 2 ? 750 : 500;
  castleUpgradeBtn.disabled = stats.level >= 3 || playerResources < upgradeCost;
  if (castleUpgradeCostLabel) {
    castleUpgradeCostLabel.textContent = String(upgradeCost);
  }
  if (ballistaBuyBtn) {
    const hasBallista = player ? (player.ballistaCount || 0) > 0 : false;
    ballistaBuyBtn.disabled = !player || hasBallista || playerResources < BALLISTA_COST;
  }
  if (ballistaUpgradeBtn) {
    const ballistaLevel = getPlayerBallistaLevel(player);
    ballistaUpgradeBtn.disabled = !player || ballistaLevel !== 1 || playerResources < BALLISTA_LEVEL_2_COST;
  }
  if (boltBuyBtn) {
    boltBuyBtn.disabled = !player || playerResources < BOLT_COST;
  }
  if (trapStunBuyBtn) {
    trapStunBuyBtn.disabled = !player || playerResources < TRAP_STUN_COST;
  }
  if (bridgeBuyBtn) {
    bridgeBuyBtn.disabled = !player || playerResources < BRIDGE_COST;
  }
    castleFeatureButtons.forEach(btn => {
      const feature = btn.dataset.castleFeature;
      const def = CASTLE_FEATURES[feature];
      if (!def) return;
      let buttonCost = def.cost;
      let purchased = stats[feature];
      if (feature === "mine") {
        const mineLevel = stats.mineLevel || 0;
        const canUpgradeMine = mineLevel === 1 && stats.lumber === true && stats.clay === true;
        const mineLevel2AvailableForPlayer = canPlayerBuildMineLevel2(playerIndex);
        const isBuyingMineLevel2 = canUpgradeMine && mineLevel < 2;
        if (mineLevel >= 2) {
          purchased = true;
        } else if (canUpgradeMine) {
          purchased = false;
          buttonCost = CASTLE_MINE_LEVEL_2_COST;
        } else {
          purchased = mineLevel >= 1;
        }
        const costLabel = btn.querySelector("span");
        if (costLabel) {
          costLabel.textContent = String(buttonCost);
        }
        btn.disabled = isBuyingMineLevel2
          ? (!mineLevel2AvailableForPlayer || playerResources < buttonCost)
          : (purchased || playerResources < buttonCost);
      } else {
        btn.disabled = purchased || playerResources < buttonCost;
      }
      const statusElem = castleFeatureStatusElems[feature];
      if (statusElem) {
        if (feature === "mine") {
          const mineLevel = stats.mineLevel || 0;
          statusElem.textContent = mineLevel >= 2
            ? "Ур. 2"
            : mineLevel === 1
              ? (canPlayerBuildMineLevel2(playerIndex) ? "Ур. 1" : "Ур. 2 занят")
              : "";
        } else {
          statusElem.textContent = purchased ? "Куплено" : "";
        }
      }
    });
    if (castleWithdrawArmy) {
      const storage = stats.storageArmy || 0;
      castleWithdrawArmy.textContent = storage;
      if (castleWithdrawBtn) {
        castleWithdrawBtn.disabled = storage <= 0;
      }
      if (castleWithdrawInput) {
        const isEditingWithdraw = document.activeElement === castleWithdrawInput;
        if (!isEditingWithdraw) {
          castleWithdrawInput.value = "0";
        }
        castleWithdrawInput.max = storage;
      }
    }
    if (castleDepositInput && castleDepositBtn) {
      const pocketArmy = player ? player.pocket.army : 0;
      const isEditingDeposit = document.activeElement === castleDepositInput;
      if (!isEditingDeposit) {
        castleDepositInput.value = "0";
      }
      castleDepositInput.max = pocketArmy;
      castleDepositBtn.disabled = pocketArmy <= 0;
    }
    if (castleStorageDisplay) {
      castleStorageDisplay.textContent = stats.storageArmy || 0;
    }
    if (castleBuilderChargeRow) {
      const charges = (player && player.builderAmuletChargeCount) || 0;
      const hasAmulet = (player && player.builderAmuletCount) || 0;
      if (charges > 0 && hasAmulet > 0) {
        castleBuilderChargeRow.style.display = "";
        if (castleBuilderChargeBtn) {
          const span = castleBuilderChargeBtn.querySelector("span");
          if (span) span.textContent = String(charges);
          castleBuilderChargeBtn.disabled = false;
        }
      } else {
        castleBuilderChargeRow.style.display = "none";
      }
    }
  }

  function showCastleModal(key, playerIndex) {
    if (!castleModal) return;
    prepareBlockingModalTurn(playerIndex);
    castleModalKey = key;
    castleModalPlayerIndex = playerIndex;
    refreshCastleModal(key, playerIndex);
    if (shouldDelegatePrivateUiToPlayer(playerIndex)) {
      emitPrivateUiToPlayer(playerIndex, "showCastleModal", { key, playerIndex });
      return;
    }
    if (typeof socket !== "undefined" &&
        socket &&
        typeof onlineMatchStarted !== "undefined" &&
        onlineMatchStarted &&
        typeof localPlayerIndex === "number" &&
        playerIndex !== localPlayerIndex) {
      return;
    }
    castleModal.style.display = "flex";
  }

  function hideCastleModal() {
    const wasVisible = castleModal && window.getComputedStyle(castleModal).display !== "none";
    if (castleModal) castleModal.style.display = "none";
    castleModalKey = null;
    castleModalPlayerIndex = null;
    if (!wasVisible) return;
    resumeTurnFlowAfterModalChange();
  }

function buyCastleFeature(featureKey) {
  if (!castleModalKey || castleModalPlayerIndex === null) return;
  const stats = ensureCastleStats(castleModalKey);
  const player = players[castleModalPlayerIndex];
  let featureDef = CASTLE_FEATURES[featureKey];
  if (!featureDef) return;
  let shouldPlaceSpecialCell = false;
  if (featureKey === "mine") {
    const mineLevel = stats.mineLevel || 0;
    if (mineLevel <= 0) {
      featureDef = CASTLE_FEATURES.mine;
      shouldPlaceSpecialCell = true;
    } else {
      const canUpgradeMine = stats.lumber === true && stats.clay === true;
      if (!canUpgradeMine || mineLevel >= 2) return;
      if (!canPlayerBuildMineLevel2(castleModalPlayerIndex)) return;
      featureDef = { cost: CASTLE_MINE_LEVEL_2_COST, label: "Шахта ур. 2" };
    }
  } else {
    if (stats[featureKey]) return;
    shouldPlaceSpecialCell = true;
  }
  if (!player || player.resources.resources < featureDef.cost) return;
  player.resources.resources -= featureDef.cost;
  if (featureKey === "mine") {
    stats.mineLevel = Math.min(2, (stats.mineLevel || 0) + 1);
    stats.mine = true;
    if (stats.mineLevel >= 2 && mineLevel2OwnerPlayerIndex === null) {
      mineLevel2OwnerPlayerIndex = castleModalPlayerIndex;
    }
  } else {
    stats[featureKey] = true;
  }
  ensureCastleStats(castleModalKey);
  updatePlayerResources(castleModalPlayerIndex);
  updateCastleBadge(castleModalKey);
  if (shouldPlaceSpecialCell) {
    applyCastleFeatureSpecialCell(castleModalKey, featureKey);
  }
  showPickupToast(`Покупка: ${featureDef.label}`);
  recalcPlayerResourceIncome(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  const btn = castleFeatureButtons.find(b => b.dataset.castleFeature === featureKey);
  flashPrice(btn, featureDef.cost, "assets/icons/icon-resources.png", "Ресурсы");
}

  const CASTLE_FEATURE_SPECIALS = {
    11: {
      lumber: { x: 0, y: 22, label: "ЛЕС", extraClass: "forest" }, // E661
      mine: { x: 0, y: 24, label: "ШАХ", extraClass: "resource" }, // E721
      clay: { x: 2, y: 24, label: "ГЛИН", extraClass: "resource" } // E723
    },
    17: {
      lumber: { x: 29, y: 2, label: "ЛЕС", extraClass: "forest" }, // E90
      mine: { x: 29, y: 0, label: "ШАХ", extraClass: "resource" }, // E30
      clay: { x: 27, y: 0, label: "ГЛИН", extraClass: "resource" } // E28
    }
  };

function applyCastleFeatureSpecialCell(castleKey, featureKey) {
  const node = nodeByPos[castleKey];
  if (!node || node.type !== "castle") return;
  const cfg = CASTLE_FEATURE_SPECIALS[node.id]?.[featureKey];
  if (!cfg) return;
  if (typeof setSpecialCell !== "function") return;
  const placed = setSpecialCell(cfg.x, cfg.y, cfg.label, cfg.extraClass, castleModalPlayerIndex, featureKey, castleKey);
  if (!placed) return;
  applySpecialFeatureIcon(cfg.x, cfg.y, featureKey);
}

function applySpecialFeatureIcon(x, y, featureKey) {
  const cell = grid[`${x},${y}`];
  const iconByFeature = {
    lumber: { file: "lumber.png", alt: "Лесопилка" },
    mine: { file: "mine.png", alt: "Шахта" },
    clay: { file: "clay.png", alt: "Глиняный карьер" }
  };
  const iconDef = iconByFeature[featureKey];
  if (cell && iconDef && typeof setCellIcon === "function") {
    if (typeof clearCellTextNodes === "function") {
      clearCellTextNodes(cell);
    } else {
      cell.textContent = "";
    }
    setCellIcon(cell, iconDef.file, iconDef.alt);
  }
}

function buyCastleBallista() {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const player = players[castleModalPlayerIndex];
  if (!player) return false;
  if ((player.ballistaCount || 0) >= 1) return false;
  if (player.resources.resources < BALLISTA_COST) return false;
  player.resources.resources -= BALLISTA_COST;
  player.ballistaCount = 1;
  player.ballistaLevel = 1;
  player.ballistaShotsThisTurn = 0;
  updatePlayerResources(castleModalPlayerIndex);
  updateInventory(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  showPickupToast("РљСѓРїР»РµРЅР° Р‘Р°Р»Р»РёСЃС‚Р°.");
  flashPrice(ballistaBuyBtn, BALLISTA_COST, "assets/icons/icon-resources.png", "Р РµСЃСѓСЂСЃС‹");
  return true;
}

function upgradeCastleBallista() {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const player = players[castleModalPlayerIndex];
  if (!player || getPlayerBallistaLevel(player) !== 1) return false;
  if (player.resources.resources < BALLISTA_LEVEL_2_COST) return false;
  player.resources.resources -= BALLISTA_LEVEL_2_COST;
  player.ballistaLevel = 2;
  player.ballistaCount = 1;
  updatePlayerResources(castleModalPlayerIndex);
  updateInventory(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  showPickupToast("Баллиста улучшена до II уровня.");
  flashPrice(ballistaUpgradeBtn, BALLISTA_LEVEL_2_COST, "assets/icons/icon-resources.png", "Ресурсы");
  return true;
}

function buyCastleBolt() {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const player = players[castleModalPlayerIndex];
  if (!player) return false;
  if (player.resources.resources < BOLT_COST) return false;
  player.resources.resources -= BOLT_COST;
  player.boltCount = (player.boltCount || 0) + 1;
  updatePlayerResources(castleModalPlayerIndex);
  updateInventory(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  showPickupToast("РљСѓРїР»РµРЅ Р‘РѕР»С‚ РґР»СЏ Р±Р°Р»Р»РёСЃС‚С‹.");
  flashPrice(boltBuyBtn, BOLT_COST, "assets/icons/icon-resources.png", "Р РµСЃСѓСЂСЃС‹");
  return true;
}

function buyCastleTrapStun() {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const player = players[castleModalPlayerIndex];
  if (!player || player.resources.resources < TRAP_STUN_COST) return false;
  player.resources.resources -= TRAP_STUN_COST;
  player.trapStunCount = (player.trapStunCount || 0) + 1;
  updatePlayerResources(castleModalPlayerIndex);
  updateInventory(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  showPickupToast("Куплена ловушка-стан.");
  flashPrice(trapStunBuyBtn, TRAP_STUN_COST, "assets/icons/icon-resources.png", "Ресурсы");
  return true;
}

function buyCastleBridge() {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const player = players[castleModalPlayerIndex];
  if (!player || player.resources.resources < BRIDGE_COST) return false;
  player.resources.resources -= BRIDGE_COST;
  player.bridgeCount = (player.bridgeCount || 0) + 1;
  updatePlayerResources(castleModalPlayerIndex);
  updateInventory(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  showPickupToast("Куплен мост.");
  flashPrice(bridgeBuyBtn, BRIDGE_COST, "assets/icons/icon-resources.png", "Ресурсы");
  return true;
}

function depositCastleArmy(amount) {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const player = players[castleModalPlayerIndex];
  const stats = ensureCastleStats(castleModalKey);
  amount = Math.floor(Math.max(0, Number(amount) || 0));
  const available = player ? player.pocket.army : 0;
  amount = Math.min(amount, available);
  if (amount <= 0 || !player) return false;
  player.pocket.army -= amount;
  stats.storageArmy = (stats.storageArmy || 0) + amount;
  updatePlayerResources(castleModalPlayerIndex);
  recalcPlayerResourceIncome(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  return true;
}

function withdrawCastleArmy(amount) {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const player = players[castleModalPlayerIndex];
  const stats = ensureCastleStats(castleModalKey);
  const available = stats.storageArmy || 0;
  amount = Math.floor(Math.max(0, Number(amount) || 0));
  amount = Math.min(amount, available);
  if (amount <= 0 || !player) return false;
  stats.storageArmy = available - amount;
  player.pocket.army += amount;
  updatePlayerResources(castleModalPlayerIndex);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  return true;
}

function upgradeCastleLevel() {
  if (!castleModalKey || castleModalPlayerIndex === null) return false;
  const stats = castleStatsByKey[castleModalKey];
  const player = players[castleModalPlayerIndex];
  const upgradeCost = stats && stats.level >= 2 ? 750 : 500;
  if (!stats || stats.level >= 3 || player.resources.resources < upgradeCost) return false;
  player.resources.resources -= upgradeCost;
  stats.level += 1;
  ensureCastleStats(castleModalKey);
  updatePlayerResources(castleModalPlayerIndex);
  updateCastleBadge(castleModalKey);
  refreshCastleModal(castleModalKey, castleModalPlayerIndex);
  recalcPlayerResourceIncome(castleModalPlayerIndex);
  flashPrice(castleUpgradeBtn, upgradeCost, "assets/icons/icon-resources.png", "Р РµСЃСѓСЂСЃС‹");
  return true;
}

  castleFeatureButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const feature = btn.dataset.castleFeature;
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "buyFeature",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey, featureKey: feature }
        });
        return;
      }
      buyCastleFeature(feature);
    });
  });
  if (ballistaBuyBtn) {
    ballistaBuyBtn.addEventListener("click", () => {
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "buyBallista",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey }
        });
        return;
      }
      buyCastleBallista();
    });
  }
  if (ballistaUpgradeBtn) {
    ballistaUpgradeBtn.addEventListener("click", () => {
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "upgradeBallista",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey }
        });
        return;
      }
      upgradeCastleBallista();
    });
  }
  if (boltBuyBtn) {
    boltBuyBtn.addEventListener("click", () => {
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "buyBolt",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey }
        });
        return;
      }
      buyCastleBolt();
    });
  }
  if (trapStunBuyBtn) {
    trapStunBuyBtn.addEventListener("click", () => {
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "buyTrapStun",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey }
        });
        return;
      }
      buyCastleTrapStun();
    });
  }
  if (bridgeBuyBtn) {
    bridgeBuyBtn.addEventListener("click", () => {
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "buyBridge",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey }
        });
        return;
      }
      buyCastleBridge();
    });
  }

  if (castleDepositBtn) {
    castleDepositBtn.addEventListener("click", () => {
      const amount = castleDepositInput ? castleDepositInput.value : 0;
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "depositArmy",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey, amount }
        });
        return;
      }
      depositCastleArmy(amount);
    });
  }
  if (castleWithdrawBtn) {
    castleWithdrawBtn.addEventListener("click", () => {
      const amount = castleWithdrawInput ? castleWithdrawInput.value : 0;
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "withdrawArmy",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey, amount }
        });
        return;
      }
      withdrawCastleArmy(amount);
    });
  }

  castleUpgradeBtn.addEventListener("click", () => {
    if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
      emitPrivateUiActionToHost({
        modalType: "castle",
        actionType: "upgrade",
        playerIndex: castleModalPlayerIndex,
        payload: { key: castleModalKey }
      });
      return;
    }
    upgradeCastleLevel();
  });

  if (castleBuilderChargeBtn) {
    castleBuilderChargeBtn.addEventListener("click", () => {
      if (!castleModalKey || castleModalPlayerIndex === null) return;
      if (shouldRoutePrivateUiActionToHost(castleModalPlayerIndex)) {
        emitPrivateUiActionToHost({
          modalType: "castle",
          actionType: "builderCharge",
          playerIndex: castleModalPlayerIndex,
          payload: { key: castleModalKey }
        });
        return;
      }
      const player = players[castleModalPlayerIndex];
      if (!player || (player.builderAmuletChargeCount || 0) <= 0) return;
      const stats = ensureCastleStats(castleModalKey);
      if (!stats) return;
      player.builderAmuletChargeCount -= 1;
      stats.armorCurrent = (stats.armorCurrent || 0) + 10;
      updateInventory(castleModalPlayerIndex);
      if (typeof updateCastleBars === "function") updateCastleBars(castleModalKey);
      refreshCastleModal(castleModalKey, castleModalPlayerIndex);
      showPickupToast(`Замок укреплен: +10 брони (зарядов: ${player.builderAmuletChargeCount})`);
    });
  }

  castleModalClose.addEventListener("click", hideCastleModal);
  castleModal.addEventListener("click", (event) => {
    if (event.target === castleModal) {
      hideCastleModal();
    }
  });

function updatePawn(player, index) {
  const pawn = pawns[index];
  const viewerIndex = getViewerWorldPlayerIndex();
  const visibleLayer = getVisibleWorldLayer();
  const playerLayer = player.layer || WORLD_LAYER_UPPER;
  let shouldShow = false;
  if (visibleLayer === WORLD_LAYER_UPPER) {
    shouldShow = playerLayer === WORLD_LAYER_UPPER;
  } else if (visibleLayer === WORLD_LAYER_TROLL_CAVE) {
    shouldShow = playerLayer === WORLD_LAYER_TROLL_CAVE;
  } else {
    shouldShow = index === viewerIndex && playerLayer === WORLD_LAYER_UNDER;
  }
  const isVisibleToViewer =
    visibleLayer !== WORLD_LAYER_UPPER ||
    playerLayer !== WORLD_LAYER_UPPER ||
    isUpperWorldKeyVisibleToPlayer(`${player.x},${player.y}`, viewerIndex);
  pawn.style.display = shouldShow && isVisibleToViewer ? "block" : "none";
  if (!shouldShow || !isVisibleToViewer) return;
  const pawnSize = Math.max(40, Math.round(cellSize * 1.12));
  pawn.style.width = pawnSize + "px";
  pawn.style.height = pawnSize + "px";
  pawn.style.borderWidth = Math.max(2, Math.round(pawnSize * 0.06)) + "px";
  pawn.style.fontSize = Math.max(14, Math.round(pawnSize * 0.45)) + "px";
  let tavernPawnOffsetX = 0;
  if (isTavernSafeCell(`${player.x},${player.y}`, playerLayer)) {
    const tavernOccupants = players
      .map((candidate, candidateIndex) => ({ candidate, candidateIndex }))
      .filter(({ candidate }) =>
        candidate &&
        (candidate.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UPPER &&
        `${candidate.x},${candidate.y}` === TAVERN_CELL_KEY
      );
    if (tavernOccupants.length > 1) {
      const occupantPosition = tavernOccupants.findIndex(entry => entry.candidateIndex === index);
      tavernPawnOffsetX = (occupantPosition - (tavernOccupants.length - 1) / 2) * cellSize * 0.38;
    }
  }
  const centerX = player.x * cellSize + cellSize / 2 + tavernPawnOffsetX;
  const centerY = player.y * cellSize + cellSize / 2;
  pawn.style.left = centerX + "px";
  pawn.style.top  = centerY + "px";
  pawn.style.transform = "translate3d(-50%, -50%, 0)";
  pawn.style.zIndex = 10 + index;
}
function updatePawns() {
  players.forEach(updatePawn);
}
updatePawns();

let currentPlayerIndex = 0;
let movesRemaining = 0;
let lastRoll = null;
let lastRollText = "-";
let lastDie1 = null;
let lastDie2 = null;
let extraTurnPending = false;
let extraTurnReason = null;
let justRolledDouble = false;
let robberAmbushThisSession = false;
let reachableKeys = new Set();
let reachableOutlineSvg = null;
let autoRollTimer = null;
let doubleSound = null;
let audioUnlocked = false;
let testModeEnabled = false;
let lastBattleResult = null;
let lastBattleId = 0;
let gameWinnerIndex = null;
let pendingTurnAdvance = false;
let pendingTurnManualOnly = false;
let pendingTurnRequiresManualConfirm = false;
let blockingModalTurnPlayerIndex = null;

const TURN_BLOCKING_MODALS = [
  () => barracksModal,
  () => lavkaModal,
  () => workshopModal,
  () => kingAuctionModal,
  () => kingGenerosityModal,
  () => hireModal,
  () => repairModal,
  () => messengerModal,
  () => guardModal,
  () => robberModal,
  () => playerBattleCardModal,
  () => battleModal,
  () => cityModal,
  () => mageModal,
  () => stoneModal,
  () => stoneResultModal,
  () => trollCaveModal,
  () => masterModal,
  () => tavernModal,
  () => tavernWheelModal,
  () => tavernDragonModal,
  () => castleModal
];

function isElementShown(elem) {
  return Boolean(elem) && window.getComputedStyle(elem).display !== "none";
}

function canLocalPlayerAct() {
  if (typeof onlineGamePaused !== "undefined" && onlineGamePaused) return false;
  if (isKingAuctionBlockingGameplay()) return false;
  if (isKingGenerosityBlockingGameplay()) return false;
  const inMultiplayer = typeof socket !== "undefined" && socket;
  if (!inMultiplayer) return true;
  if (typeof localPlayerIndex === "undefined" || localPlayerIndex === null) return true;
  return localPlayerIndex === currentPlayerIndex;
}

function shouldRevealReachableCells() {
  const inMultiplayer = typeof socket !== "undefined" && socket;
  if (!inMultiplayer) return true;
  if (typeof localPlayerIndex === "undefined" || localPlayerIndex === null) return true;
  return localPlayerIndex === currentPlayerIndex;
}

function hasBlockingTurnModalOpen() {
  return TURN_BLOCKING_MODALS.some(getModal => isElementShown(getModal()));
}

function hasDeferredPrivateTurnBlock() {
  return typeof deferredPrivateTurnPlayerIndex === "number" &&
    deferredPrivateTurnPlayerIndex === currentPlayerIndex;
}

function hasPreparedBlockingModalTurn() {
  if (!Number.isInteger(blockingModalTurnPlayerIndex)) return false;
  if (blockingModalTurnPlayerIndex !== currentPlayerIndex) return false;
  const inMultiplayer = typeof socket !== "undefined" && socket;
  if (!inMultiplayer) return true;
  if (typeof isHost !== "undefined" && isHost) return true;
  return typeof localPlayerIndex === "number" &&
    blockingModalTurnPlayerIndex === localPlayerIndex;
}

function syncPreparedBlockingModalTurn(turnPlayerIndex) {
  if (!Number.isInteger(blockingModalTurnPlayerIndex)) return;
  if (blockingModalTurnPlayerIndex !== turnPlayerIndex) {
    blockingModalTurnPlayerIndex = null;
  }
}

function prepareBlockingModalTurn(playerIndex) {
  if (!Number.isInteger(playerIndex)) return;
  if (playerIndex !== currentPlayerIndex) return;
  if (autoRollTimer) {
    clearTimeout(autoRollTimer);
    autoRollTimer = null;
  }
  blockingModalTurnPlayerIndex = playerIndex;
  pendingTurnAdvance = true;
  pendingTurnManualOnly = true;
  pendingTurnRequiresManualConfirm = false;
  if (typeof pushDebugLog === "function") {
    const trace = new Error().stack;
    const callerLine = trace ? trace.split("\n")[2]?.trim() : "unknown";
    pushDebugLog(`modalPrepared:p${playerIndex}:caller=${callerLine}`);
  }
  refreshTurnControls();
  if (typeof emitStateNow === "function" && typeof isHost !== "undefined" && isHost) {
    emitStateNow(true);
  }
}

function updateEndTurnButton() {
  if (!endTurnBtn) return;
  const hasDeferredRemoteModal = hasDeferredPrivateTurnBlock();
  const hasPreparedModalTurn = hasPreparedBlockingModalTurn();
  const showButton = pendingTurnAdvance || hasPreparedModalTurn || movesRemaining > 0 || hasDeferredRemoteModal;
  endTurnBtn.style.display = showButton ? "block" : "none";
  endTurnBtn.disabled =
    (!pendingTurnAdvance && !hasDeferredRemoteModal && !hasPreparedModalTurn) ||
    !canLocalPlayerAct() ||
    hasBlockingTurnModalOpen() ||
    harpoonAnimationInFlight ||
    gameEnded;
  endTurnBtn.classList.toggle("turn-ready", (pendingTurnAdvance || hasPreparedModalTurn) && !endTurnBtn.disabled);
}

function refreshTurnControls() {
  updateEndTurnButton();
}

function resumeTurnFlowAfterModalChange() {
  const delegatedBlockPlayer =
    typeof delegatedTurnBlockPlayerIndex !== "undefined" &&
    Number.isInteger(delegatedTurnBlockPlayerIndex)
      ? delegatedTurnBlockPlayerIndex
      : null;
  if (
    delegatedBlockPlayer !== null &&
    typeof shouldRoutePrivateUiActionToHost === "function" &&
    shouldRoutePrivateUiActionToHost(delegatedBlockPlayer) &&
    !hasBlockingTurnModalOpen()
  ) {
    delegatedTurnBlockPlayerIndex = null;
    if (typeof pushDebugLog === "function") {
      pushDebugLog(`turnBlockClose:p${delegatedBlockPlayer}`);
    }
    emitPrivateUiActionToHost({
      modalType: "turnBlock",
      actionType: "close",
      playerIndex: delegatedBlockPlayer
    });
  }
  if (typeof pushDebugLog === "function") {
    pushDebugLog(
      `modalResume:p${currentPlayerIndex}:pending=${pendingTurnAdvance}:prepared=${hasPreparedBlockingModalTurn()}:defer=${hasDeferredPrivateTurnBlock()}:blocking=${hasBlockingTurnModalOpen()}`
    );
  }
  refreshTurnControls();
  if (gameEnded) return;
  if (typeof socket !== "undefined" && socket && !isHost) return;
  if (
    hasBlockingTurnModalOpen() ||
    hasDeferredPrivateTurnBlock() ||
    isKingAuctionBlockingGameplay() ||
    isKingGenerosityBlockingGameplay()
  ) {
    return;
  }
  if (pendingTurnAdvance || hasPreparedBlockingModalTurn()) {
    refreshTurnControls();
    return;
  }
  scheduleAutoRoll();
}

function completeTurnAdvance() {
  if (typeof pushDebugLog === "function") {
    pushDebugLog(`completeTurnAdvance:p${currentPlayerIndex}:bti=${blockingModalTurnPlayerIndex}:pta=${pendingTurnAdvance}:ptmo=${pendingTurnManualOnly}`);
  }
  blockingModalTurnPlayerIndex = null;
  playerBattleRevealState = null;
  pendingTurnAdvance = false;
  pendingTurnManualOnly = false;
  pendingTurnRequiresManualConfirm = false;
  if (typeof deferredPrivateTurnPlayerIndex !== "undefined") {
    deferredPrivateTurnPlayerIndex = null;
  }
  // Существа верхнего мира используют DOM-клетки при поиске пути.
  // На время общего тика восстанавливаем верхний слой; в конце хода refresh вернёт нужную локацию.
  if (getVisibleWorldLayer() !== WORLD_LAYER_UPPER) {
    renderUpperWorldView();
  }
  ballistaModePlayerIndex = null;
  ballistaShotInFlight = false;
  harpoonModePlayerIndex = null;
  harpoonAnimationInFlight = false;
  if (players[currentPlayerIndex]) {
    players[currentPlayerIndex].ballistaShotsThisTurn = 0;
    players[currentPlayerIndex].tavernWheelPlaysThisTurn = 0;
    players[currentPlayerIndex].tavernDragonPlaysThisTurn = 0;
  }
  voidShardModePlayerIndex = null;
  tickAllTimedBuffs();
  collectCastleIncomes(currentPlayerIndex);
  turnCounter += 1;
  if (typeof handleTrollCavePitSpawn === "function") {
    handleTrollCavePitSpawn();
  }
  const currentTOD = getTimeOfDay().key;
  if (currentTOD !== prevTimeOfDayKey && currentTOD === "morning") {
    clearTrollCaveResourceLootForMorning({ refresh: false });
  }
  if (currentTOD !== prevTimeOfDayKey && currentTOD === "day") {
    rollDayBuffs();
  }
  if (currentTOD !== prevTimeOfDayKey && currentTOD !== "day") {
    restoreCastleArmorFromDayBuff();
    activeDayBuffs = [];
  }
  if (currentTOD !== prevTimeOfDayKey && currentTOD === "day" && isDayBuffActive("castleArmor")) {
    applyCastleArmorDayBuff();
  }
  prevTimeOfDayKey = currentTOD;
  if (isDayBuffActive("randomRes10")) {
    const luckyIndex = Math.floor(Math.random() * players.length);
    const luckyPlayer = players[luckyIndex];
    if (luckyPlayer) {
      luckyPlayer.pocket.resources = (luckyPlayer.pocket.resources || 0) + 10;
      updatePlayerResources(luckyIndex);
    }
  }
  tickWorldEvents();
  activateScheduledWorldEvents();
  activateScheduledRoyalMessengerEvents();
  activateScheduledCaravanEvents();
  activateScheduledFullMoonEvents();
  activateScheduledFogOfWarEvents();
  handleMageCellTimers();
  if (turnCounter === 150 && !worldDangerShown) {
    showWorldDangerModal();
    worldDangerShown = true;
  }
  if (!barbarianPhaseStarted && turnCounter >= BARBARIAN_START_TURN) {
    spawnInitialBarbarianCells();
    barbarianPhaseStarted = true;
  }
  if (
    barbarianPhaseStarted &&
    typeof getBarbarianCellLimit === "function" &&
    typeof spawnBarbarianCell === "function"
  ) {
    const totalTrackedBarbarians =
      (Array.isArray(barbarianCells) ? barbarianCells.length : 0) +
      (Array.isArray(barbarianRespawnTimers) ? barbarianRespawnTimers.length : 0);
    if (
      turnCounter >= BARBARIAN_LATE_GAME_TURN &&
      totalTrackedBarbarians < getBarbarianCellLimit()
    ) {
      spawnBarbarianCell();
    }
  }
  handleBarbarianRespawns();
  advanceMercenaries();
  advanceThieves();
  advanceCutthroats();
  advanceMessengers();
  advanceCaravans();
  advanceWerewolf();
  advanceFogOfWarState();
  movesRemaining = 0;
  lastRoll = null;
  lastRollText = "-";
  clearReachable();

  turnsUntilResources = Math.max(0, turnsUntilResources - 1);
  if (turnsUntilResources === 0) {
    spawnResources();
  }

  let spawnedTreasureThisTurn = false;
  turnsUntilTreasure -= 1;
  if (turnsUntilTreasure <= 0) {
    spawnTreasure();
    turnsUntilTreasure = TREASURE_INTERVAL;
    spawnedTreasureThisTurn = true;
  }
  if (treasure && !spawnedTreasureThisTurn) {
    treasureTurnsRemaining -= 1;
    if (treasureTurnsRemaining <= 0) {
      clearTreasure();
    }
  }
  handleFlowerTimers();
  if (typeof handleCloverTimers === "function") {
    handleCloverTimers();
  }
  if (typeof handleVoidShardTimers === "function") {
    handleVoidShardTimers();
  }
  handleStoneTimers();
  if (typeof handlePortalTimers === "function") {
    handlePortalTimers();
  }
  handleStoneSpawns();
  if (typeof handleVoidShardSpawns === "function") {
    handleVoidShardSpawns();
  }
  if (typeof handlePortalSpawns === "function") {
    handlePortalSpawns();
  }
  if (typeof handleCloverSpawns === "function") {
    handleCloverSpawns();
  }
  handleRainbowTimers();
  handleRainbowSpawns();
  handleMasterCell();
  handleWormholeSpawns();
  if (typeof handleTrollsTurn === "function") {
    handleTrollsTurn();
  }

  const keepCurrentPlayer = extraTurnPending;
  extraTurnPending = false;
  if (keepCurrentPlayer) {
    justRolledDouble = extraTurnReason === "double";
  } else {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    justRolledDouble = false;
    robberAmbushThisSession = false;
  }
  extraTurnReason = null;

  refreshVisibleWorld();
  updateTurnUI();
  players.forEach((_, idx) => updatePlayerResources(idx));
  scheduleAutoRoll();
}

function tryFinishPendingTurn(manual = false) {
  if (!pendingTurnAdvance) return false;
  if (harpoonAnimationInFlight) return false;
  if (pendingTurnRequiresManualConfirm && !manual) return false;
  if (!manual && pendingTurnManualOnly) return false;
  if (hasBlockingTurnModalOpen() || hasDeferredPrivateTurnBlock() || isKingAuctionBlockingGameplay() || isKingGenerosityBlockingGameplay()) {
    if (typeof pushDebugLog === "function") {
      pushDebugLog(
        `turnAdvanceBlocked:p${currentPlayerIndex}:manual=${manual}:defer=${hasDeferredPrivateTurnBlock()}:blocking=${hasBlockingTurnModalOpen()}`
      );
    }
    refreshTurnControls();
    return false;
  }
  if (typeof pushDebugLog === "function") {
    pushDebugLog(`turnAdvanceCommit:p${currentPlayerIndex}:manual=${manual}`);
  }
  completeTurnAdvance();
  return true;
}

function requestTurnAdvance(options = {}) {
  const requiresManualConfirm = Boolean(options.manualOnly);
  blockingModalTurnPlayerIndex = currentPlayerIndex;
  pendingTurnAdvance = true;
  pendingTurnRequiresManualConfirm = requiresManualConfirm;
  pendingTurnManualOnly =
    requiresManualConfirm ||
    hasBlockingTurnModalOpen() ||
    hasDeferredPrivateTurnBlock() ||
    isKingAuctionBlockingGameplay() ||
    isKingGenerosityBlockingGameplay();
  if (typeof pushDebugLog === "function") {
    pushDebugLog(
      `turnAdvanceRequested:p${currentPlayerIndex}:manualOnly=${requiresManualConfirm}:pendingManualOnly=${pendingTurnManualOnly}:bti=${blockingModalTurnPlayerIndex}:moves=${movesRemaining}`
    );
  }
  refreshTurnControls();
  if (!pendingTurnManualOnly) {
    tryFinishPendingTurn(false);
  }
}

function tickAllTimedBuffs() {
  players.forEach(player => {
    if (!player) return;
    const beerEffectStartedThisTurn = player.beerEffectStartedTurn === turnCounter;
    if (player.slowTurnsRemaining > 0) {
      player.slowTurnsRemaining = Math.max(0, player.slowTurnsRemaining - 1);
    }
    if (player.noDoubleTurnsRemaining > 0) {
      player.noDoubleTurnsRemaining = Math.max(0, player.noDoubleTurnsRemaining - 1);
    }
    if (player.royalBlessingTurnsRemaining > 0) {
      player.royalBlessingTurnsRemaining = Math.max(0, player.royalBlessingTurnsRemaining - 1);
    }
    if (player.invisTurnsRemaining > 0) {
      player.invisTurnsRemaining = Math.max(0, player.invisTurnsRemaining - 1);
    }
    if (player.luckTurnsRemaining > 0) {
      player.luckTurnsRemaining = Math.max(0, player.luckTurnsRemaining - 1);
    }
    // Оглушение тролля считается по всем завершённым ходам, включая дубли соперника
    // и пропущенный ход самого оглушённого игрока.
    if (player.stunSource === "troll" && (player.stunnedTurnsRemaining || 0) > 0) {
      player.stunnedTurnsRemaining = Math.max(0, player.stunnedTurnsRemaining - 1);
      if (player.stunnedTurnsRemaining === 0) {
        player.stunSource = null;
      }
    }
    if ((player.builderAmuletCount || 0) > 0) {
      player.builderAmuletTurnCounter = (player.builderAmuletTurnCounter || 0) + 1;
      if (player.builderAmuletTurnCounter >= 25) {
        player.builderAmuletTurnCounter = 0;
        player.builderAmuletChargeCount = (player.builderAmuletChargeCount || 0) + 1;
        const pi = players.indexOf(player);
        if (typeof updateInventory === "function") updateInventory(pi);
        if (pi === localPlayerIndex) {
          showPrivatePickupToastForPlayer(pi, `Амулет строителя: +1 заряд (всего ${player.builderAmuletChargeCount})`);
        }
      }
    }
    if (player.invulnTurnsRemaining > 0 && !beerEffectStartedThisTurn) {
      player.invulnTurnsRemaining = Math.max(0, player.invulnTurnsRemaining - 1);
    }
    if (player.stoneSpeedTurnsRemaining > 0) {
      player.stoneSpeedTurnsRemaining = Math.max(0, player.stoneSpeedTurnsRemaining - 1);
    }
    if (beerEffectStartedThisTurn) {
      player.beerEffectStartedTurn = null;
    } else if ((player.beerProtectionTurnsRemaining || 0) > 0) {
      player.beerProtectionTurnsRemaining = Math.max(0, player.beerProtectionTurnsRemaining - 1);
      if (player.beerProtectionTurnsRemaining === 0) {
        player.beerSlowTurnsRemaining = TAVERN_BEER_SLOW_TURNS;
        const playerIndex = players.indexOf(player);
        if (playerIndex >= 0) {
          showPrivatePickupToastForPlayer(
            playerIndex,
            `Неприкосновенность от пива закончилась: −${TAVERN_BEER_SLOW_PENALTY} к броску на ${TAVERN_BEER_SLOW_TURNS} ходов.`
          );
        }
      }
    } else if ((player.beerSlowTurnsRemaining || 0) > 0) {
      player.beerSlowTurnsRemaining = Math.max(0, player.beerSlowTurnsRemaining - 1);
    }
  });
}

function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  if (!doubleSound) {
    doubleSound = document.getElementById("doubleSound") || new Audio("assets/sfx/double.mp3");
  }
  doubleSound.play().then(() => {
    doubleSound.pause();
    doubleSound.currentTime = 0;
  }).catch(() => {});
}
document.addEventListener("pointerdown", unlockAudio, { once: true });
document.addEventListener("keydown", unlockAudio, { once: true });

function getReachableOutlineSvg() {
  if (reachableOutlineSvg) return reachableOutlineSvg;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "reachableOutlineSvg";
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = "3";
  svg.style.overflow = "visible";
  game.appendChild(svg);
  reachableOutlineSvg = svg;
  return svg;
}

function clearReachableOutline() {
  if (!reachableOutlineSvg) return;
  while (reachableOutlineSvg.firstChild) {
    reachableOutlineSvg.removeChild(reachableOutlineSvg.firstChild);
  }
}

function drawReachableOutline() {
  clearReachableOutline();
  if (!isFogOfWarActive()) return;
  if (currentPlayerIndex !== getViewerWorldPlayerIndex()) return;
  if (reachableKeys.size === 0) return;
  if (movesRemaining <= 0) return;
  const svg = getReachableOutlineSvg();
  const dimensions = getVisibleWorldDimensions();
  svg.setAttribute("width", dimensions.cols * cellSize);
  svg.setAttribute("height", dimensions.rows * cellSize);
  const player = players[currentPlayerIndex];
  if (!player) return;
  const color = player.color || "#ffffff";
  const sw = Math.max(1, Math.round(cellSize * 0.04));
  const keysWithPlayer = new Set(reachableKeys);
  keysWithPlayer.add(`${player.x},${player.y}`);
  keysWithPlayer.forEach(key => {
    const [x, y] = key.split(",").map(Number);
    const checks = [
      { nx: x + 1, ny: y, x1: x + 1, y1: y, x2: x + 1, y2: y + 1 },
      { nx: x - 1, ny: y, x1: x, y1: y, x2: x, y2: y + 1 },
      { nx: x, ny: y + 1, x1: x, y1: y + 1, x2: x + 1, y2: y + 1 },
      { nx: x, ny: y - 1, x1: x, y1: y, x2: x + 1, y2: y }
    ];
    for (let i = 0; i < 4; i += 1) {
      const { nx, ny, x1, y1, x2, y2 } = checks[i];
      if (!keysWithPlayer.has(`${nx},${ny}`)) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1 * cellSize);
        line.setAttribute("y1", y1 * cellSize);
        line.setAttribute("x2", x2 * cellSize);
        line.setAttribute("y2", y2 * cellSize);
        line.setAttribute("stroke", color);
        line.setAttribute("stroke-width", sw);
        line.setAttribute("stroke-linecap", "round");
        svg.appendChild(line);
      }
    }
  });
}

function clearReachable() {
  document.querySelectorAll(".cell.reachable, .cell.harpoon-target").forEach(cell => {
    cell.classList.remove("reachable", "harpoon-target");
  });
  reachableKeys.forEach(key => {
    const cell = grid[key];
    if (cell) cell.classList.remove("reachable");
  });
  reachableKeys.clear();
  clearReachableOutline();
}

const MOVES_DIRS = [
  {dx: 1, dy: 0},
  {dx: -1, dy: 0},
  {dx: 0, dy: 1},
  {dx: 0, dy: -1}
];

function showReachable() {
  clearReachable();
  if (ballistaModePlayerIndex === currentPlayerIndex) return;
  if (harpoonModePlayerIndex === currentPlayerIndex) {
    showHarpoonTargets(currentPlayerIndex);
    return;
  }
  if (bridgeModePlayerIndex === currentPlayerIndex) {
    showBridgeTargets(currentPlayerIndex);
    return;
  }
  if (movesRemaining <= 0) return;
  const revealCells = shouldRevealReachableCells();
  const currentPlayer = players[currentPlayerIndex];
  if ((currentPlayer?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE) {
    const trollInteriorKey =
      typeof isTrollInCave === "function" && isTrollInCave()
        ? trollState?.interiorKey
        : null;
    const queue = [{ x: currentPlayer.x, y: currentPlayer.y, steps: 0 }];
    const visited = new Set([`${currentPlayer.x},${currentPlayer.y}`]);
    while (queue.length) {
      const { x, y, steps } = queue.shift();
      const key = `${x},${y}`;
      if (steps > 0) {
        const cell = grid[key];
        if (cell) {
          reachableKeys.add(key);
          if (revealCells) cell.classList.add("reachable");
        }
      }
      if (steps === movesRemaining) continue;
      for (const { dx, dy } of MOVES_DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        const nextKey = `${nx},${ny}`;
        if (visited.has(nextKey) || isTrollCaveCellBlocked(nx, ny) || nextKey === trollInteriorKey) continue;
        visited.add(nextKey);
        queue.push({ x: nx, y: ny, steps: steps + 1 });
      }
    }
    drawReachableOutline();
    return;
  }
  if ((currentPlayer?.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER) {
    const queue = [{x: currentPlayer.x, y: currentPlayer.y, steps: 0}];
    const visited = new Set([`${currentPlayer.x},${currentPlayer.y}`]);
    while (queue.length) {
      const {x, y, steps} = queue.shift();
      const key = `${x},${y}`;
      if (steps > 0) {
        const cell = grid[key];
        if (cell) {
          reachableKeys.add(key);
          if (revealCells) {
            cell.classList.add("reachable");
          }
        }
      }
      if (steps === movesRemaining) continue;
      for (const {dx, dy} of MOVES_DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
        const nkey = `${nx},${ny}`;
        if (visited.has(nkey)) continue;
        visited.add(nkey);
        queue.push({x: nx, y: ny, steps: steps + 1});
      }
    }
    drawReachableOutline();
    return;
  }
  const queue = [{x: currentPlayer.x, y: currentPlayer.y, steps: 0}];
  const visited = new Set([`${currentPlayer.x},${currentPlayer.y}`]);

  while (queue.length) {
    const {x, y, steps} = queue.shift();
    const key = `${x},${y}`;
    const isGuardCell = guardKey && key === guardKey;
    if (steps > 0) {
      const cell = grid[key];
      if (cell) {
        reachableKeys.add(key);
        if (revealCells) {
          cell.classList.add("reachable");
        }
      }
    }
    if (steps === movesRemaining) continue;
    const player = players[currentPlayerIndex];
    const canAttemptGuard = guardAccess[currentPlayerIndex];
    if (isGuardCell && (isQuarantineActive() || !canAttemptGuard)) continue;
    for (const {dx, dy} of MOVES_DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) continue;
      const key = `${nx},${ny}`;
      if (visited.has(key)) continue;
      const node = nodeByPos[key];
      if (node && node.id === 15 && player.resources.influence < 500) continue;
      if (isMovementBlockedKey(key)) continue;
      visited.add(key);
      queue.push({x: nx, y: ny, steps: steps + 1});
    }
  }
  drawReachableOutline();
}

function finalizeMove(gridX, gridY) {
  const key = `${gridX},${gridY}`;
  const currentPlayer = players[currentPlayerIndex];
  currentPlayer.x = gridX;
  currentPlayer.y = gridY;
  movesRemaining = 0;
  clearReachable();
  updatePawns();

  if ((currentPlayer.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_TROLL_CAVE) {
    if (
      getTrollCaveCellNumber(gridX, gridY) === TROLL_CAVE_PIT_CELL_NUMBER &&
      isTrollCavePitActive() &&
      consumeTrollCavePit({ refresh: false, emit: false })
    ) {
      enterUnderworld(currentPlayerIndex, {
        consumeUpperWormhole: false,
        sourceLabel: "Яма в пещере троллей утащила вас на нижний уровень."
      });
      endTurn();
      return;
    }
    const entranceIndex = getTrollCaveEntranceIndexByKey(key);
    if (entranceIndex >= 0) {
      exitTrollCave(currentPlayerIndex, entranceIndex);
      endTurn();
      return;
    }
    collectTrollCaveLoot(currentPlayerIndex, key);
    refreshVisibleWorld();
    endTurn();
    return;
  }

  if ((currentPlayer.layer || WORLD_LAYER_UPPER) === WORLD_LAYER_UNDER) {
    const underworldState = getPlayerUnderworldState(currentPlayerIndex);
    if (underworldState?.stairs?.key === key || underworldState?.bridgeExitKey === key) {
      exitUnderworld(currentPlayerIndex);
      endTurn();
      return;
    }
    const underworldResource = underworldState?.resourcesByPos?.[key];
    if (underworldResource) {
      const typeKey = underworldResource.typeKey;
      let amount = 0;
      if (typeKey === "gold") {
        amount = Math.floor(Math.random() * (UNDERWORLD_GOLD_MAX - UNDERWORLD_GOLD_MIN + 1)) + UNDERWORLD_GOLD_MIN;
      } else if (typeKey === "resources") {
        amount = Math.floor(Math.random() * (UNDERWORLD_RESOURCES_MAX - UNDERWORLD_RESOURCES_MIN + 1)) + UNDERWORLD_RESOURCES_MIN;
      }
      if (turnCounter >= UNDERWORLD_REWARD_LATE_TURN) {
        amount = Math.max(1, Math.floor(amount * UNDERWORLD_REWARD_LATE_MULTIPLIER));
      }
      if (currentPlayer.luckTurnsRemaining > 0) {
        amount = Math.max(1, Math.floor(amount * 1.6));
      } else if ((currentPlayer.luckAmuletCount || 0) > 0 && Math.random() < 0.25) {
        amount = Math.max(1, Math.floor(amount * 1.7));
      }
      currentPlayer.pocket[typeKey] += amount;
      delete underworldState.resourcesByPos[key];
      updatePlayerResources(currentPlayerIndex);
      const label = typeKey === "gold" ? "золота" : "ресурсов";
      showPrivatePickupToastForPlayer(currentPlayerIndex, `В карман: +${amount} ${label}`);
    }
    refreshVisibleWorld();
    endTurn();
    return;
  }

  const triggeredTrap = trapStunFields.find(field => field.ownerIndex !== currentPlayerIndex && field.keys.includes(key));
  if (triggeredTrap) {
    currentPlayer.stunnedTurnsRemaining = Math.max(currentPlayer.stunnedTurnsRemaining || 0, TRAP_STUN_DURATION);
    currentPlayer.stunSource = "trap-stun";
    removeTrapStunFieldById(triggeredTrap.id);
    updatePlayerResources(currentPlayerIndex);
    const trappedPlayerLabel = typeof currentPlayer.id === "number"
      ? `игрока ${currentPlayer.id + 1}`
      : `игрока ${currentPlayerIndex + 1}`;
    showPickupToast(`Ловушка-стан оглушила ${trappedPlayerLabel} — пропуск 3 ходов.`);
  }

  const castleKey = getCastleBaseKeyForPos(gridX, gridY) || key;
  const node = nodeByPos[castleKey];
  if (node && node.type === "castle") {
    const previousOwner = castleOwnersByKey[castleKey];
    if (typeof previousOwner === "number" && previousOwner !== currentPlayerIndex) {
      const battleResult = resolveCastleBattle(currentPlayerIndex, castleKey);
      showBattleModal(battleResult);
      if (battleResult.healthRemaining <= 0) {
        showGameOver(currentPlayerIndex);
      }
      if (battleResult && battleResult.winnerIndex === currentPlayerIndex) {
        const ownedKey = getFirstOwnedCastleKey(currentPlayerIndex);
        if (ownedKey && ownedKey !== castleKey) {
          showPickupToast("Нельзя захватить второй замок.");
          castleOwnersByKey[castleKey] = undefined;
          node.elem.classList.remove("owned");
          node.elem.style.background = "";
          node.elem.style.borderColor = "";
          updateCastleBadge(castleKey);
          if (typeof updateCastleBars === "function") updateCastleBars(castleKey);
        } else {
          castleOwnersByKey[castleKey] = currentPlayerIndex;
          node.elem.classList.add("owned");
          node.elem.style.background = currentPlayer.color;
          node.elem.style.borderColor = currentPlayer.color;
          if (typeof updateCastleBars === "function") updateCastleBars(castleKey);
          recalcPlayerResourceIncome(currentPlayerIndex);
        }
      }
      if (typeof previousOwner === "number") {
        recalcPlayerResourceIncome(previousOwner);
      }
      endTurn();
      return;
    }
    if (previousOwner !== currentPlayerIndex) {
      const ownedKey = getFirstOwnedCastleKey(currentPlayerIndex);
      if (ownedKey && ownedKey !== castleKey) {
        showPickupToast("Нельзя захватить второй замок.");
      } else {
        castleOwnersByKey[castleKey] = currentPlayerIndex;
        node.elem.classList.add("owned");
        node.elem.style.background = currentPlayer.color;
        node.elem.style.borderColor = currentPlayer.color;
        if (typeof updateCastleBars === "function") updateCastleBars(castleKey);
        if (typeof previousOwner === "number") {
          recalcPlayerResourceIncome(previousOwner);
        }
      }
    }
    if (castleOwnersByKey[castleKey] === currentPlayerIndex) {
      depositPocketCurrencyToPlayer(currentPlayerIndex);
      recalcPlayerResourceIncome(currentPlayerIndex);
      showCastleModal(castleKey, currentPlayerIndex);
    }
  }
  if (node && node.type === "tavern") {
    openTavernModal(currentPlayerIndex);
    endTurn();
    return;
  }
  const dragonKey = getDragonBaseKeyForPos(gridX, gridY);
  if (dragonKey) {
    if (!currentPlayer.hasSword) {
      showPickupToast("Без меча героя нельзя вступить в бой с драконом.");
      endTurn();
      return;
    }
    const battleResult = resolveDragonBattle(currentPlayerIndex, 75);
    showBattleModal(battleResult);
    if (battleResult && battleResult.winnerIndex === currentPlayerIndex) {
      showGameOver(currentPlayerIndex);
    }
    endTurn();
    return;
  }
  const barbarianCell = barbarianCells.find(cell => cell.key === key);
  if (barbarianCell) {
    const battleResult = resolveBarbarianBattle(currentPlayerIndex, barbarianCell);
    if (battleResult && battleResult.winnerIndex === currentPlayerIndex) {
      currentPlayer.barbarianKills = (currentPlayer.barbarianKills || 0) + 1;
    }
    removeBarbarianCell(key);
    scheduleBarbarianRespawn();
    showBattleModal(battleResult);
    endTurn();
    return;
  }
  const trollHere =
    specialByPos[key]?.type !== "troll-cave" &&
    typeof isTrollAtKey === "function" &&
    isTrollAtKey(key);
  if (trollHere) {
    if (currentPlayer.invisTurnsRemaining > 0) {
      showPickupToast("Невидимость: тролли вас не атакуют.");
    } else {
      const trollArmy = getTimeOfDay().key === "evening" ? 20 : 25;
      const battleResult = resolveTrollBattle(currentPlayerIndex, trollArmy);
      const playerWon = battleResult && battleResult.winnerIndex === currentPlayerIndex;
      if (playerWon) {
        if (typeof handleTrollDefeat === "function") {
          handleTrollDefeat();
        }
      }
      showBattleModal(battleResult);
      endTurn();
      return;
    }
  }
  const specialEntry = specialByPos[key];
  if (specialEntry && specialEntry.disabled && specialEntry.ownerIndex === currentPlayerIndex) {
    openRepairModal({ ...specialEntry, key }, currentPlayerIndex);
  }
  if (specialEntry && specialEntry.type === "portal") {
    const otherKey = typeof getOtherPortalKey === "function" ? getOtherPortalKey(key) : null;
    if (otherKey) {
      const [tx, ty] = otherKey.split(",").map(Number);
      if (typeof clearPortalPair === "function") {
        clearPortalPair();
      }
      currentPlayer.x = tx;
      currentPlayer.y = ty;
      updatePawns();
      showPickupToast("Портал перенес вас.");
      endTurn();
      return;
    }
  }
  if (upperWormhole && upperWormhole.key === key) {
    enterUnderworld(currentPlayerIndex);
    endTurn();
    return;
  }
  if (specialEntry && specialEntry.type === "troll-cave") {
    const caveIndex = typeof getTrollCaveIndexByKey === "function" ? getTrollCaveIndexByKey(key) : -1;
    enterTrollCave(currentPlayerIndex, caveIndex);
    endTurn();
    return;
  }
  if (specialEntry && specialEntry.type === "mage") {
    const mageSlot = getMageSlotById(specialEntry.mageId);
    if (mageSlot && mageSlot.active) {
      openMageModal(mageSlot, currentPlayerIndex);
    }
  }
  if (node && node.id === 2) {
    openBarracks(currentPlayerIndex);
  }
  if (node && node.id === 9) {
    openLavka(currentPlayerIndex);
  }
  if (node && node.id === 19) {
    openWorkshop(currentPlayerIndex);
  }
  if (node && node.id === 15) {
    openCity(currentPlayerIndex);
  }
  if (node && node.id === 6) {
    openHire(currentPlayerIndex);
  }

  if (stoneByPos[key]) {
    openStoneModal(key, currentPlayerIndex);
  }
  if (typeof voidShardByPos !== "undefined" && voidShardByPos[key]) {
    if (tryAddSpecialArtifactToInventory(currentPlayer, "void-shard")) {
      updatePlayerResources(currentPlayerIndex);
      updateInventory(currentPlayerIndex);
      showLayerAwarePickupToast(currentPlayerIndex, "Осколок пустоты добавлен в инвентарь.");
      if (typeof clearVoidShard === "function") {
        clearVoidShard(key);
      }
    } else {
      showLayerAwarePickupToast(currentPlayerIndex, "Нет свободного слота для осколка пустоты.");
    }
  }
  if (rainbowByPos[key]) {
    if (tryAddSpecialArtifactToInventory(currentPlayer, "rainbow")) {
      updatePlayerResources(currentPlayerIndex);
      updateInventory(currentPlayerIndex);
      showLayerAwarePickupToast(currentPlayerIndex, "Радужный камень добавлен в инвентарь.");
      clearRainbowStone(key);
    } else {
      showLayerAwarePickupToast(currentPlayerIndex, "Нет свободного слота для радужного камня.");
    }
  }
  if (masterActive && key === MASTER_CELL.key) {
    openMasterModal(currentPlayerIndex);
  }

  const resourceNode = resourceByPos[key];
  if (resourceNode) {
    const {type, x, y} = resourceNode;
    if (isDayBuffActive("pickupFail") && Math.random() < 0.3) {
      delete resourceByPos[key];
      setCellToInactive(x, y);
      showLayerAwarePickupToast(currentPlayerIndex, "Выскользнуло из рук");
      endTurn();
      return;
    }
    let pickupMinimum = type.min;
    let pickupMaximum = type.max;
    if (type.key === "army") {
      if (turnCounter >= 225) {
        [pickupMinimum, pickupMaximum] = ARMY_RESOURCE_LATE_GAME_RANGE;
      } else if (turnCounter >= 150) {
        [pickupMinimum, pickupMaximum] = ARMY_RESOURCE_MID_GAME_RANGE;
      }
    }
    let amount = Math.floor(Math.random() * (pickupMaximum - pickupMinimum + 1)) + pickupMinimum;
    if (type.key !== "army") {
      if (turnCounter >= 225) {
        amount = Math.floor(amount * 2.5);
      } else if (turnCounter >= 150) {
        amount = Math.floor(amount * 1.75);
      }
    }
    if (currentPlayer.luckTurnsRemaining > 0) {
      amount = Math.floor(amount * 1.6);
    } else if ((currentPlayer.luckAmuletCount || 0) > 0 && Math.random() < 0.25) {
      amount = Math.floor(amount * 1.7);
    }
    currentPlayer.pocket[type.key] += amount;
    updatePlayerResources(currentPlayerIndex);
    delete resourceByPos[key];
    setCellToInactive(x, y);
    const label = type.key === "gold" ? "золота" : type.key === "army" ? "войск" : "ресурсов";
    showLayerAwarePickupToast(currentPlayerIndex, `В карман: +${amount} ${label}`);
  }

  if (treasure && treasure.key === key) {
    const goldReward = Math.floor(Math.random() * (1200 - 700 + 1)) + 700;
    currentPlayer.pocket.gold += goldReward;
    updatePlayerResources(currentPlayerIndex);
    showLayerAwarePickupToast(currentPlayerIndex, `Сокровище: +${goldReward} золота в карман`);
    clearTreasure();
  }
  if (flowerArtifact && flowerArtifact.key === key) {
    if (tryAddSpecialArtifactToInventory(currentPlayer, "flower")) {
      updatePlayerResources(currentPlayerIndex);
      updateInventory(currentPlayerIndex);
      showLayerAwarePickupToast(currentPlayerIndex, "Таинственный цветок добавлен в инвентарь.");
      clearFlower();
    } else {
      showLayerAwarePickupToast(currentPlayerIndex, "Нет свободного слота для таинственного цветка.");
    }
  }
  if (cloverArtifact && cloverArtifact.key === key) {
    currentPlayer.cloverCount = (currentPlayer.cloverCount || 0) + 1;
    updatePlayerResources(currentPlayerIndex);
    updateInventory(currentPlayerIndex);
    showLayerAwarePickupToast(currentPlayerIndex, "Клевер добавлен в инвентарь.");
    if (typeof clearClover === "function") {
      clearClover();
    }
  }
  endTurn();
}

function updateTurnUI() {
  const currentPlayer = players[currentPlayerIndex];
  if (turnInfo) {
    turnInfo.textContent = "";
    turnInfo.style.display = "none";
  }
  if (movesInfo) {
    movesInfo.textContent = "";
    movesInfo.style.display = "none";
  }
  if (rollInfo) {
    if (lastDie1 === null || lastDie2 === null) {
      rollInfo.innerHTML = 'БРОСОК <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
      rollInfo.classList.add("rolling");
    } else {
      rollInfo.textContent = `БРОСОК ${lastDie1} + ${lastDie2}`;
      rollInfo.classList.remove("rolling");
    }
  }
  if (rollBtn) {
    rollBtn.disabled = true;
    rollBtn.style.display = "none";
  }
  doubleMsg.style.visibility = justRolledDouble ? "visible" : "hidden";
  if (currentPlayerName) {
    currentPlayerName.textContent = `ИГРОК ${currentPlayer.id + 1}`;
    currentPlayerName.style.color = currentPlayer.color;
  }
  playerPanels.forEach((panel, index) => {
    panel.classList.toggle("active", index === currentPlayerIndex);
  });
  pawns.forEach((pawn, index) => {
    pawn.classList.toggle("active-turn", index === currentPlayerIndex);
  });
  if (turnCounterDisplay) {
    turnCounterDisplay.textContent = `СЧЁТЧИК ХОДОВ: ${turnCounter}`;
  }
  if (typeof timeOfDayDisplay !== "undefined" && timeOfDayDisplay) {
    const tod = getTimeOfDay();
    timeOfDayDisplay.textContent = `ВРЕМЯ СУТОК: ${tod.label}`;
  }
  if (typeof turnsUntilTimeChangeDisplay !== "undefined" && turnsUntilTimeChangeDisplay) {
    const remaining = getTurnsUntilTimeChange();
    turnsUntilTimeChangeDisplay.textContent = `СМЕНА ЧЕРЕЗ: ${remaining}`;
  }
  if (devTurnInput) {
    devTurnInput.value = String(turnCounter);
  }
  updateStatusPanel();
  if (typeof updateRobberModalVisibility === "function") {
    updateRobberModalVisibility();
  }
  refreshTurnControls();
}

function showBallistaRange(playerIndex = currentPlayerIndex) {
  clearReachable();
  const player = players[playerIndex];
  if (!player) return;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const dist = Math.abs(x - player.x) + Math.abs(y - player.y);
      if (dist === 0 || dist > BALLISTA_RANGE) continue;
      const key = `${x},${y}`;
      const cell = grid[key];
      if (!cell) continue;
      cell.classList.add("reachable");
      reachableKeys.add(key);
    }
  }
}

function endTurn() {
  requestTurnAdvance();
}

function scheduleAutoRoll() {
  if (autoRollTimer) {
    clearTimeout(autoRollTimer);
  }
  if (typeof socket !== "undefined" && socket && !isHost) return;
  if (gameEnded) return;
  if (movesRemaining > 0) return;
  if (isKingAuctionBlockingGameplay()) return;
  if (isKingGenerosityBlockingGameplay()) return;
  if (isVoidShardModeActive()) return;
  if (rollInfo) {
    rollInfo.innerHTML = 'БРОСОК <span class="dots"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
    rollInfo.classList.add("rolling");
  }
  lastDie1 = null;
  lastDie2 = null;
  if (typeof pushDebugLog === "function") {
    pushDebugLog(`autoRollScheduled:p${currentPlayerIndex}`);
  }
  autoRollTimer = setTimeout(() => {
    autoRollTimer = null;
    tryAutoRoll();
  }, 1500);
}

function tryAutoRoll() {
  if (typeof socket !== "undefined" && socket && !isHost) return;
  if (gameEnded) return;
  if (movesRemaining > 0) return;
  if (isVoidShardModeActive()) {
    if (typeof pushDebugLog === "function") pushDebugLog(`autoRollBlocked:p${currentPlayerIndex}:voidShard`);
    return;
  }
  const blockReasons = [];
  if (hasBlockingTurnModalOpen()) blockReasons.push("modal");
  if (hasDeferredPrivateTurnBlock()) blockReasons.push("defer");
  if (isKingAuctionBlockingGameplay()) blockReasons.push("auction");
  if (isKingGenerosityBlockingGameplay()) blockReasons.push("generosity");
  if (blockReasons.length > 0) {
    if (typeof pushDebugLog === "function") {
      pushDebugLog(`autoRollBlocked:p${currentPlayerIndex}:${blockReasons.join(",")}:bti=${blockingModalTurnPlayerIndex}:pta=${pendingTurnAdvance}:ptmo=${pendingTurnManualOnly}:m=${movesRemaining}`);
    }
    return;
  }
  if (processRobberAmbushChance()) return;
  if (typeof pushDebugLog === "function") {
    pushDebugLog(`autoRollStart:p${currentPlayerIndex}`);
  }
  doRoll();
}

function doRoll() {
  const die1 = testModeEnabled ? 12 : Math.floor(Math.random() * 6) + 1;
  const die2 = testModeEnabled ? 13 : Math.floor(Math.random() * 6) + 1;
  lastDie1 = die1;
  lastDie2 = die2;
  const currentPlayer = players[currentPlayerIndex];
  if (currentPlayer && currentPlayer.stunnedTurnsRemaining > 0) {
    const stunnedPlayerLabel = typeof currentPlayer.id === "number"
      ? `игрока ${currentPlayer.id + 1}`
      : `игрока ${currentPlayerIndex + 1}`;
    const stunText = currentPlayer.stunSource === "trap-stun"
      ? `Ловушка-стан оглушила ${stunnedPlayerLabel} — пропуск хода.`
      : `Тролли оглушили ${stunnedPlayerLabel} — пропуск хода.`;
    showPickupToast(stunText);
    movesRemaining = 0;
    lastRoll = null;
    lastRollText = "-";
    clearReachable();
    extraTurnPending = false;
    extraTurnReason = null;
    justRolledDouble = false;
    currentPlayer.ballistaShotsThisTurn = 0;
    currentPlayer.tavernWheelPlaysThisTurn = 0;
    currentPlayer.tavernDragonPlaysThisTurn = 0;
    // Ловушка по-прежнему считает личные пропуски. Троллье оглушение уменьшится
    // ниже в общем тике, как и после любого обычного или дополнительного хода.
    if (currentPlayer.stunSource !== "troll") {
      currentPlayer.stunnedTurnsRemaining = Math.max(0, (currentPlayer.stunnedTurnsRemaining || 0) - 1);
      if (currentPlayer.stunnedTurnsRemaining <= 0) {
        currentPlayer.stunSource = null;
      }
    }
    tickAllTimedBuffs();
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    refreshVisibleWorld();
    updateTurnUI();
    players.forEach((_, idx) => updatePlayerResources(idx));
    if (typeof emitStateNow === "function") emitStateNow(true);
    scheduleAutoRoll();
    return;
  }
  const stoneBonusActive = currentPlayer && currentPlayer.stoneBonusRollsRemaining > 0;
  const stoneBonus = stoneBonusActive ? 1 : 0;
  const bootsBonus = currentPlayer && (currentPlayer.bootsCount || 0) > 0 ? 3 : 0;
  const werewolfFangBonus = currentPlayer ? (currentPlayer.werewolfFangCount || 0) * 2 : 0;
  const morningBonus = getTimeOfDay().key === "morning" ? 3 : 0;
  const stoneSpeedBonus = currentPlayer && currentPlayer.stoneSpeedTurnsRemaining > 0 ? 3 : 0;
  const bonus = stoneBonus + bootsBonus + werewolfFangBonus + morningBonus + stoneSpeedBonus;
  const roll = die1 + die2 + bonus;
  if (typeof pushDebugLog === "function") {
    pushDebugLog(`rollResult:p${currentPlayerIndex}:${die1}+${die2}+${bonus}=${roll}`);
  }
  lastRoll = roll;
  const bonusParts = [];
  if (stoneBonus > 0) bonusParts.push("1");
  if (bootsBonus > 0) bonusParts.push("3");
  if (werewolfFangBonus > 0) bonusParts.push(String(werewolfFangBonus));
  if (morningBonus > 0) bonusParts.push("3");
  if (stoneSpeedBonus > 0) bonusParts.push("3");
  lastRollText = bonusParts.length
    ? `${die1} + ${die2} + ${bonusParts.join(" + ")} = ${roll}`
    : `${die1} + ${die2} = ${roll}`;
  if (stoneBonusActive && currentPlayer) {
    currentPlayer.stoneBonusRollsRemaining = Math.max(0, currentPlayer.stoneBonusRollsRemaining - 1);
  }
  const slowPenalty = currentPlayer && currentPlayer.slowTurnsRemaining > 0 ? MAGE_SLOW_PENALTY : 0;
  const kingConcernPenalty = getKingConcernPenalty(currentPlayerIndex);
  const nightPenalty = getTimeOfDay().key === "night" ? 2 : 0;
  const beerSlowPenalty = currentPlayer && currentPlayer.beerSlowTurnsRemaining > 0
    ? TAVERN_BEER_SLOW_PENALTY
    : 0;
  const penalty = slowPenalty + kingConcernPenalty + nightPenalty + beerSlowPenalty;
  let effectiveMoves = roll;
  if (penalty > 0 && currentPlayer) {
    effectiveMoves = Math.max(0, roll - penalty);
  }
  const rolledDouble = die1 === die2;
  const allowDouble = !stoneBonusActive;
  const effectiveDouble = rolledDouble && allowDouble;
  justRolledDouble = false;
  let extraTurn = stoneBonusActive || effectiveDouble;
  extraTurnReason = stoneBonusActive ? "stone" : (effectiveDouble ? "double" : null);
  if (effectiveDouble) {
    robberAmbushThisSession = true;
  }
  if (!stoneBonusActive && currentPlayer && currentPlayer.noDoubleTurnsRemaining > 0 && effectiveDouble) {
    extraTurn = false;
    extraTurnReason = null;
  }
  extraTurnPending = extraTurn;
  if (effectiveDouble) {
    showDoubleToast();
  }
  if (effectiveMoves <= 0) {
    movesRemaining = 0;
    if (beerSlowPenalty > 0) {
      showPickupToast("Пивное замедление лишило вас очков движения — ход пропущен.");
    } else if (slowPenalty > 0 && kingConcernPenalty > 0) {
      showPickupToast("Маг и опасение короля замедлили вас — ход пропущен.");
    } else if (kingConcernPenalty > 0) {
      showPickupToast("Опасение короля замедлило вас — ход пропущен.");
    } else {
      showPickupToast("Маг замедлил вас — ход пропущен.");
    }
    endTurn();
    return;
  }
  movesRemaining = effectiveMoves;
  showReachable();
  updateTurnUI();
}

if (rollBtn) {
  rollBtn.addEventListener("click", () => {
    tryAutoRoll();
  });
}
if (endTurnBtn) {
  endTurnBtn.addEventListener("click", () => {
    tryFinishPendingTurn(true);
  });
}
function resetGameState() {
  gameEnded = false;
  resetTavernRuntimeState();
  ballistaModePlayerIndex = null;
  ballistaShotInFlight = false;
  harpoonModePlayerIndex = null;
  harpoonAnimationInFlight = false;
  gameWinnerIndex = null;
  worldDangerShown = false;
  robberEvent = null;
  mineLevel2OwnerPlayerIndex = null;
  robberAmbushThisSession = false;
  robbersEnabled = false;
  lastBattleResult = null;
  lastBattleId = 0;
  pendingPlayerBattle = null;
  playerBattleSequenceId = 0;
  playerBattleRevealState = null;
  localPlayerBattleSelection = null;
  if (playerBattleResolveTimer) {
    clearTimeout(playerBattleResolveTimer);
    playerBattleResolveTimer = null;
  }
  closePlayerBattleCardModal();
  testModeEnabled = false;
  scheduledWorldEvents = [];
  scheduledRoyalMessengerTurns = [];
  pendingRoyalMessengerEvents = 0;
  scheduledCaravanTurns = [];
  pendingCaravanEvents = 0;
  scheduledFullMoonTurns = [];
  pendingFullMoonEvents = 0;
  fullMoonEventState = null;
  scheduledFogOfWarTurns = [];
  pendingFogOfWarEvents = 0;
  fogOfWarState = null;
  activeDayBuffs = [];
  prevTimeOfDayKey = null;
  activeWorldEvents = {};
  worldEventModalQueue = [];
  closeWorldEventModal();
  closeMessengerModal();
  kingAuctionState = normalizeKingAuctionState();
  kingAuctionDraftBids.fill("");
  closeKingAuctionModal();
  kingGenerosityState = normalizeKingGenerosityState();
  closeKingGenerosityModal();
  clearReachable();
  if (autoRollTimer) {
    clearTimeout(autoRollTimer);
    autoRollTimer = null;
  }

  const startX = startNode.x;
  const startY = startNode.y;
  players.forEach((player, index) => {
    player.x = startX;
    player.y = startY;
    player.layer = WORLD_LAYER_UPPER;
    player.underworldState = null;
    player.trollCaveEntranceIndex = null;
    player.resources.gold = 0;
    player.resources.army = 0;
    player.resources.influence = 0;
    player.resources.resources = 0;
    player.pocket.gold = 0;
    player.pocket.army = 0;
    player.pocket.resources = 0;
    player.income.resources = 0;
    player.attack = 6;
    player.hasSword = false;
    player.hasArmor = false;
    player.hasWorkshopSword = false;
    player.barbarianKills = 0;
    player.slowTurnsRemaining = 0;
    player.noDoubleTurnsRemaining = 0;
    player.royalBlessingTurnsRemaining = 0;
    player.poisonCount = 0;
    player.fogOfWarCount = 0;
    player.invisPotionCount = 0;
    player.luckPotionCount = 0;
    player.invulnPotionCount = 0;
    player.invisTurnsRemaining = 0;
    player.luckTurnsRemaining = 0;
    player.invulnTurnsRemaining = 0;
    player.cloverCount = 0;
    player.trollClubCount = 0;
    player.flowerCount = 0;
    player.voidShardCount = 0;
    player.tokenCount = 0;
    player.bootsCount = 0;
    player.ballistaCount = 0;
    player.ballistaLevel = 0;
    player.ballistaShotsThisTurn = 0;
    player.boltCount = 0;
    player.harpoonCount = 0;
    player.ringCount = 0;
    player.terrorRingCount = 0;
    player.rainbowStoneCount = 0;
    player.mysticStoneCount = 0;
    player.werewolfAmuletCount = 0;
    player.luckAmuletCount = 0;
    player.builderAmuletCount = 0;
    player.builderAmuletChargeCount = 0;
    player.builderAmuletTurnCounter = 0;
    player.hasCrystalSword = false;
    player.heroHiltCount = 0;
    player.werewolfFangCount = 0;
    player.trapStunCount = 0;
    player.bridgeCount = 0;
    player.beerProtectionTurnsRemaining = 0;
    player.beerSlowTurnsRemaining = 0;
    player.beerEffectStartedTurn = null;
    player.tavernWheelPlaysThisTurn = 0;
    player.tavernDragonPlaysThisTurn = 0;
    player.stoneBonusRollsRemaining = 0;
    player.stoneSpeedTurnsRemaining = 0;
    player.stunnedTurnsRemaining = 0;
    player.stunSource = null;
    player.barbarianRewards = { r5: false, r10: false, r20: false };
    updatePlayerResources(index);
  });

  if (typeof trapStunFields !== "undefined") {
    trapStunFields.length = 0;
  }
  bridgeOpenedKeys.clear();
  bridgeModePlayerIndex = null;
  voidShardModePlayerIndex = null;
  harpoonModePlayerIndex = null;
  if (typeof trapStunIdCounter !== "undefined") {
    trapStunIdCounter = 1;
  }
  if (typeof renderTrapStunFields === "function") {
    renderTrapStunFields();
  }

  guardAccess.forEach((_, index) => {
    guardAccess[index] = false;
  });
  pendingGuardMove = null;
  pendingGuardPlayerIndex = null;

  currentPlayerIndex = 0;
  movesRemaining = 0;
  lastRoll = null;
  lastRollText = "-";
  lastDie1 = null;
  lastDie2 = null;
  extraTurnPending = false;
  extraTurnReason = null;
  justRolledDouble = false;
  blockingModalTurnPlayerIndex = null;
  pendingTurnAdvance = false;
  pendingTurnManualOnly = false;
  pendingTurnRequiresManualConfirm = false;
  if (typeof deferredPrivateTurnPlayerIndex !== "undefined") {
    deferredPrivateTurnPlayerIndex = null;
  }
  if (typeof delegatedTurnBlockPlayerIndex !== "undefined") {
    delegatedTurnBlockPlayerIndex = null;
  }
  if (typeof currentPrivateUiPlayerIndex !== "undefined") {
    currentPrivateUiPlayerIndex = null;
  }
  reachableKeys = new Set();
  reachableOutlineSvg = null;

  turnCounter = 0;
  if (typeof turnsUntilResources !== "undefined") {
    turnsUntilResources = RESOURCE_INTERVAL;
  }
  if (typeof turnsUntilTreasure !== "undefined") {
    turnsUntilTreasure = TREASURE_INTERVAL;
  }
  if (typeof treasureTurnsRemaining !== "undefined") {
    treasureTurnsRemaining = 0;
  }
  if (typeof flowerTurnsRemaining !== "undefined") {
    flowerTurnsRemaining = 0;
  }
  if (typeof masterTurnsRemaining !== "undefined") {
    masterTurnsRemaining = 0;
  }
  if (typeof masterActive !== "undefined") {
    masterActive = false;
  }
  if (typeof masterNextSpawnTurn !== "undefined") {
    masterNextSpawnTurn = MASTER_SPAWN_INTERVAL;
  }
  if (typeof cloverTurnsRemaining !== "undefined") {
    cloverTurnsRemaining = 0;
  }
  if (typeof voidShardSpawnTurn !== "undefined") {
    voidShardSpawnTurn = null;
  }

  if (typeof treasure !== "undefined") treasure = null;
  if (typeof flowerArtifact !== "undefined") flowerArtifact = null;
  if (typeof cloverArtifact !== "undefined") cloverArtifact = null;

  if (typeof resetDynamicCells === "function") {
    resetDynamicCells();
  } else {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const key = `${x},${y}`;
        if (nodeByPos[key]) continue;
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
    barbarianCells.length = 0;
    barbarianRespawnTimers.length = 0;
    mercenaries.length = 0;
    thieves.length = 0;
    cutthroats.length = 0;
    messengers.length = 0;
    caravans.length = 0;
    werewolfState = null;
  }
  thieves.length = 0;
  cutthroats.length = 0;
  messengers.length = 0;
  caravans.length = 0;
  werewolfState = null;
  cutthroatIdCounter = 1;

  Object.keys(castleOwnersByKey).forEach(key => {
    castleOwnersByKey[key] = undefined;
    const node = nodeByPos[key];
    if (node && node.elem) {
      node.elem.classList.remove("owned");
      node.elem.style.background = "";
      node.elem.style.borderColor = "";
    }
  });
  Object.keys(castleStatsByKey).forEach(key => delete castleStatsByKey[key]);
  importantNodes.forEach(node => {
    if (node.type !== "castle") return;
    const key = `${node.x},${node.y}`;
    castleOwnersByKey[key] = undefined;
    ensureCastleStats(key);
    updateCastleBadge(key);
  });

  mercenaryIdCounter = 1;
  thiefIdCounter = 1;
  messengerIdCounter = 1;
  caravanIdCounter = 1;
  barbarianPhaseStarted = false;
  robberEvent = null;

  if (typeof initFlowerSpawns === "function") initFlowerSpawns();
  if (typeof initStoneSpawns === "function") initStoneSpawns();
  if (typeof initCloverSpawns === "function") initCloverSpawns();
  if (typeof initRainbowSpawns === "function") initRainbowSpawns();
  if (typeof initPortalState === "function") initPortalState();
  initWorldEventSchedule();
  initRoyalMessengerSchedule();
  initCaravanSchedule();
  initFullMoonSchedule();
  initFogOfWarSchedule();
  initFogOfWarVariants();
  initWormholeSpawns();

  if (typeof mageSlot !== "undefined") {
    mageSlot.active = false;
    mageSlot.turnsRemaining = 0;
    mageSlot.cell = null;
    mageSlot.key = null;
    mageSlot.x = null;
    mageSlot.y = null;
    mageSlot.nextSpawnTurn = 20;
    mageSlot.nextSpawnIndex = null;
    if (mageSlot.timerElem) {
      mageSlot.timerElem.remove();
      mageSlot.timerElem = null;
    }
  }

  if (typeof TROLL_CAVES !== "undefined") {
    TROLL_CAVES.forEach(cave => (cave.looted = false));
  }
  trollCaveInteriorState = {
    generation: 0,
    sourceCaveIndex: null,
    lootByPos: {},
    pitActive: false,
    pitNextSpawnTurn: randomIntRange(
      TROLL_CAVE_PIT_FIRST_SPAWN_MIN_TURN,
      TROLL_CAVE_PIT_FIRST_SPAWN_MAX_TURN
    )
  };
  if (typeof initTrollState === "function") initTrollState();

  gameTimerSeconds = 0;
  if (gameTimerDisplay) {
    gameTimerDisplay.textContent = `${GAME_TIMER_LABEL}: ${formatTime(gameTimerSeconds)}`;
  }

  refreshVisibleWorld();
  players.forEach((_, index) => {
    recalcPlayerResourceIncome(index);
    updatePlayerResources(index);
  });
  updateTurnUI();
  updateStatusPanel();

  if (typeof emitStateNow === "function") {
    emitStateNow(true);
  }
  scheduleAutoRoll();
}

if (newGameBtn) {
  newGameBtn.addEventListener("click", () => {
    resetGameState();
  });
}
function relayout() {
  const bodyPadding = 16;
  const gap = 32;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const leftWidth = playerSlotLeft?.offsetWidth || 260;
  const rightWidth = playerSlotRight?.offsetWidth || 260;
  let controlsBeside = true;
  if (playerSlotLeft && playerSlotRight) {
    const leftRect = playerSlotLeft.getBoundingClientRect();
    const rightRect = playerSlotRight.getBoundingClientRect();
    controlsBeside = Math.abs(leftRect.top - rightRect.top) < Math.max(leftRect.height, rightRect.height) * 0.5;
  }
  const controlsWidth = controlsBeside ? leftWidth + rightWidth : leftWidth;
  const gapCount = controlsBeside ? 2 : 1;
  const availableW = Math.max(0, viewportW - bodyPadding * 2 - controlsWidth - gap * gapCount);
  const summaryHeight = summaryBar ? summaryBar.getBoundingClientRect().height : 0;
  const availableH = Math.max(0, viewportH - bodyPadding * 2 - summaryHeight - gap * 2);

  const dimensions = getVisibleWorldDimensions();
  const sizeByWidth = availableW > 0 ? availableW / dimensions.cols : MIN_CELL;
  const sizeByHeight = availableH > 0 ? availableH / dimensions.rows : MIN_CELL;
  const viewZoom = getVisibleWorldLayer() === WORLD_LAYER_TROLL_CAVE ? TROLL_CAVE_VIEW_ZOOM : 1;
  const nextSize = Math.floor(Math.min(Math.min(sizeByWidth, sizeByHeight) * viewZoom, MAX_CELL));
  const clamped = Math.max(MIN_CELL, nextSize);

  applyCellSize(clamped);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = grid[`${x},${y}`];
      cell.style.left = (x * cellSize) + "px";
      cell.style.top  = (y * cellSize) + "px";
    }
  }

  updatePawns();
}

applyCellSize(BASE_CELL);
initWorldEventSchedule();
initRoyalMessengerSchedule();
initCaravanSchedule();
initFullMoonSchedule();
initFogOfWarSchedule();
initFogOfWarVariants();
initWormholeSpawns();
relayout();
refreshVisibleWorld();
updateTurnUI();
window.addEventListener("resize", relayout);
scheduleAutoRoll();
