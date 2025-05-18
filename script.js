// --- Globale Variabelen & Constanten ---
let currentScreen = 'intro';
let selectedTrainerData = null;
let tempSelectedStarter = null;
let isNewGameSetup = false;

let battleState = {
    playerTeam: [],
    opponentTeam: [],
    playerActiveIndex: 0, opponentActiveIndex: 0,
    playerTurn: true,
    currentActingPokemonIsPlayer: true,
    attackerUsedMoveFirstThisTurn: false,
    messageQueue: [], isProcessingMessage: false, onMessageComplete: null,
    switchingAfterFaint: false,
    isWildBattle: false,
    isGymBattle: false,
    currentGymLeaderKey: null,
    isEliteFourBattle: false,
    currentEliteFourMemberKey: null,
    pendingBattleStartFunction: null,
    selectedBattleTeamIndexes: []
};

const GAME_LEVEL = 50;
const SHINY_CHANCE = 0.1;
const CRITICAL_HIT_CHANCE_BASE = 1 / 24;
const CRITICAL_HIT_MULTIPLIER = 1.5;
const PARALYSIS_CHANCE_NO_MOVE = 0.25;
const FREEZE_THAW_CHANCE = 0.2;
const MAX_TEAM_SIZE = 6;
const MAX_PC_BOX_SIZE = 30;
const TCG_CARDS_PER_PACK = 7; // --- AANGEPAST NAAR 7 ---

// Definities voor speciale TCG kaarten (voor highlighting)
const TCG_SPECIAL_RARITIES = [
    "Rare Holo", "Rare Holo EX", "Rare Holo GX", "Rare Holo V", "Rare Holo VMAX", "Rare Holo VSTAR",
    "Amazing Rare", "Double Rare", "Illustration Rare", "LEGEND", "Promo",
    "Radiant Rare", "Rare ACE", "Rare BREAK", "Rare Prism Star", "Rare Prime",
    "Rare Rainbow", "Rare Secret", "Rare Shining", "Rare Shiny", "Rare Shiny GX",
    "Special Illustration Rare", "Trainer Gallery Holo", "Ultra Rare", "Hyper Rare"
];
const TCG_SPECIAL_SUBTYPES = ["V", "VMAX", "VSTAR", "EX", "GX", "BREAK", "Prime", "LEGEND", "MEGA", "Radiant"];


const gameBody = document.getElementById('gameBody');
const screens = {
    intro: document.getElementById('introScreen'),
    characterSelect: document.getElementById('characterSelectScreen'),
    starterSelect: document.getElementById('starterSelectScreen'),
    confirmStarterDialog: document.getElementById('confirmStarterDialog'),
    confirmDialog: document.getElementById('confirmDialog'),
    resetConfirmDialog: document.getElementById('resetConfirmDialog'),
    mainMenu: document.getElementById('mainMenuScreen'),
    playMenu: document.getElementById('playMenuScreen'),
    optionsMenu: document.getElementById('optionsMenuScreen'),
    market: document.getElementById('marketScreen'),
    inventory: document.getElementById('inventoryScreen'),
    team: document.getElementById('teamScreen'),
    pcBox: document.getElementById('pcBoxScreen'),
    teamSelect: document.getElementById('teamSelectScreen'),
    gymLeaderSelect: document.getElementById('gymLeaderSelectScreen'),
    gymLeaderDetail: document.getElementById('gymLeaderDetailScreen'),
    eliteFourSelect: document.getElementById('eliteFourSelectScreen'),
    eliteFourDetail: document.getElementById('eliteFourDetailScreen'),
    myCards: document.getElementById('myCardsScreen'),
    tcgCards: document.getElementById('tcgCardsScreen'),
    tcgPackOpeningOverlay: document.getElementById('tcgPackOpeningOverlay'),
    battle: document.getElementById('battleScreen'),
    switchPokemon: document.getElementById('switchPokemonScreen')
};
const chosenTrainerNameSpan = document.getElementById('chosenTrainerName'); const confirmYesButton = document.getElementById('confirmYes'); const confirmNoButton = document.getElementById('confirmNo'); const trainerCards = document.querySelectorAll('.trainer-card'); const chosenTrainerImageMainMenu = document.getElementById('chosenTrainerImageMainMenu'); const playerCoinsDisplayMainMenuEl = document.getElementById('playerCoinsDisplayMainMenu');
const btnPlay = document.getElementById('btnPlay');
const btnQuickBattlePlay = document.getElementById('btnQuickBattlePlay');
const btnGymBattlePlay = document.getElementById('btnGymBattlePlay');
const btnEliteBattlesPlay = document.getElementById('btnEliteBattlesPlay');
const btnWildModePlay = document.getElementById('btnWildModePlay');
const btnBackToMainFromPlay = document.getElementById('btnBackToMainFromPlay');
const btnOptions = document.getElementById('btnOptions'); const btnSaveGameOpt = document.getElementById('btnSaveGameOpt'); const btnResetGameOpt = document.getElementById('btnResetGameOpt'); const btnDarkModeOpt = document.getElementById('btnDarkModeOpt'); const btnBackToMainOpts = document.getElementById('btnBackToMainOpts'); const resetConfirmYesButton = document.getElementById('resetConfirmYes'); const resetConfirmNoButton = document.getElementById('resetConfirmNo'); const opponentPokemonNameEl = document.getElementById('opponentPokemonName'); const opponentHpFillEl = document.getElementById('opponentHpFill'); const opponentHpNumbersEl = document.getElementById('opponentHpNumbers'); const opponentTeamStatusEl = document.getElementById('opponentTeamStatus'); const opponentPokemonSpriteEl = document.getElementById('opponentPokemonSprite'); const opponentStatusTagEl = document.getElementById('opponentStatusTag'); const playerPokemonNameEl = document.getElementById('playerPokemonName'); const playerHpFillEl = document.getElementById('playerHpFill'); const playerHpNumbersEl = document.getElementById('playerHpNumbers'); const playerTeamStatusEl = document.getElementById('playerTeamStatus'); const playerPokemonSpriteEl = document.getElementById('playerPokemonSprite'); const playerStatusTagEl = document.getElementById('playerStatusTag'); const battleTextboxEl = document.getElementById('battleTextbox'); const battleMessageEl = document.getElementById('battleMessage'); const actionMenuEl = document.getElementById('actionMenu'); const moveMenuEl = document.getElementById('moveMenu'); const itemMenuEl = document.getElementById('itemMenu'); const attackAnimationLayer = document.getElementById('attackAnimationLayer'); const switchGridEl = document.getElementById('switchGrid'); const switchCancelButton = document.getElementById('switchCancelButton');
const tabMarket = document.getElementById('tabMarket'); const tabInventory = document.getElementById('tabInventory'); const tabTeam = document.getElementById('tabTeam'); const tabMyCards = document.getElementById('tabMyCards');
const tabTcgCards = document.getElementById('tabTcgCards');
const tabMyPc = document.getElementById('tabMyPc');
const marketCoinDisplayEl = document.getElementById('marketCoinDisplay'); const marketItemsGridEl = document.querySelector('#marketScreen .market-items-grid'); const btnBackToMainFromMarket = document.getElementById('btnBackToMainFromMarket'); const inventoryGridEl = document.getElementById('inventoryGrid'); const btnBackToMainFromInventory = document.getElementById('btnBackToMainFromInventory'); const teamGridEl = document.getElementById('teamGrid'); const btnBackToMainFromTeam = document.getElementById('btnBackToMainFromTeam');
const noInventoryItemsMsg = document.querySelector('#inventoryGrid .no-items');
const noTeamPokemonMsg = document.querySelector('#teamGrid .no-pokemon');
const teamSelectGridEl = document.getElementById('teamSelectGrid');
const teamSelectConfirmButton = document.getElementById('teamSelectConfirmButton');
const teamSelectTitleEl = document.getElementById('teamSelectTitle');
const gymLeaderGridEl = document.getElementById('gymLeaderGrid');
const btnBackToPlayMenuFromGymSelect = document.getElementById('btnBackToPlayMenuFromGymSelect');
const gymLeaderDetailNameEl = document.getElementById('gymLeaderDetailName');
const gymLeaderCardImageEl = document.getElementById('gymLeaderCardImage');
const gymLeaderDialogEl = document.getElementById('gymLeaderDialog');
const btnStartGymBattle = document.getElementById('btnStartGymBattle');
const btnBackToGymSelectFromDetail = document.getElementById('btnBackToGymSelectFromDetail');

const eliteFourGridEl = document.getElementById('eliteFourGrid');
const btnBackToPlayMenuFromEliteFourSelect = document.getElementById('btnBackToPlayMenuFromEliteFourSelect');
const eliteFourDetailNameEl = document.getElementById('eliteFourDetailName');
const eliteFourCardImageEl = document.getElementById('eliteFourCardImage');
const eliteFourDialogEl = document.getElementById('eliteFourDialog');
const btnStartEliteFourBattle = document.getElementById('btnStartEliteFourBattle');
const btnBackToEliteFourSelectFromDetail = document.getElementById('btnBackToEliteFourSelectFromDetail');

const collectedCardsGridEl = document.getElementById('collectedCardsGrid');
const noCollectedCardsMsgEl = document.getElementById('noCollectedCardsMsg');
const collectedEliteFourCardsGridEl = document.getElementById('collectedEliteFourCardsGrid');
const noCollectedEliteFourCardsMsgEl = document.getElementById('noCollectedEliteFourCardsMsg');
const collectedBadgesGridEl = document.getElementById('collectedBadgesGrid');
const noCollectedBadgesMsgEl = document.getElementById('noCollectedBadgesMsg');
const btnBackToMainFromMyCards = document.getElementById('btnBackToMainFromMyCards');
const startersGridEl = document.querySelector('#starterSelectScreen .starters-grid');
const chosenStarterNameDialogSpan = document.getElementById('chosenStarterNameDialog');
const confirmStarterYesButton = document.getElementById('confirmStarterYes');
const confirmStarterNoButton = document.getElementById('confirmStarterNo');
const pcTeamGridEl = document.getElementById('pcTeamGrid');
const pcBoxGridEl = document.getElementById('pcBoxGrid');
const btnBackToMainFromPcBox = document.getElementById('btnBackToMainFromPcBox');
const pcTeamCountEl = document.getElementById('pcTeamCount');
const pcBoxCountEl = document.getElementById('pcBoxCount');
const pcBoxCapacityEl = document.getElementById('pcBoxCapacity');
const noPokemonPcTeamMsg = document.querySelector('#pcTeamGrid .no-pokemon-pc-team');
const noPokemonPcBoxMsg = document.querySelector('#pcBoxGrid .no-pokemon-pc-box');

const tcgCardsGridEl = document.getElementById('tcgCardsGrid');
const noTcgCardsMsgEl = document.getElementById('noTcgCardsMsg');
const btnBackToMainFromTcgCards = document.getElementById('btnBackToMainFromTcgCards');

const tcgPackAnimationContainer = screens.tcgPackOpeningOverlay.querySelector('.tcg-pack-animation-container');
// Verwijder of hergebruik revealedTcgCardContainer, revealedTcgCardImageEl, revealedTcgCardNameEl als je nu een grid gebruikt
// const revealedTcgCardContainer = screens.tcgPackOpeningOverlay.querySelector('#revealedTcgCardContainer');
// const revealedTcgCardImageEl = document.getElementById('revealedTcgCardImage');
// const revealedTcgCardNameEl = document.getElementById('revealedTcgCardName');
const closeTcgRevealButton = document.getElementById('closeTcgRevealButton');

const btnBackFromMoves = document.getElementById('btnBackFromMoves');

document.addEventListener('DOMContentLoaded', () => {
    const marketPokeballIcon = document.querySelector('.market-item[data-item-id="pokeball"] .item-icon');
    if (marketPokeballIcon) marketPokeballIcon.style.backgroundImage = 'var(--item-icon-pokeball)';
    const marketGreatballIcon = document.querySelector('.market-item[data-item-id="greatball"] .item-icon');
    if (marketGreatballIcon) marketGreatballIcon.style.backgroundImage = 'var(--item-icon-greatball)';
    const marketEvoStoneIcon = document.querySelector('.market-item[data-item-id="evolutionstone"] .item-icon');
    if (marketEvoStoneIcon) marketEvoStoneIcon.style.backgroundImage = 'var(--item-icon-evolutionstone)';
    const marketPermaEvoStoneIcon = document.querySelector('.market-item[data-item-id="permaevolutionstone"] .item-icon');
    if (marketPermaEvoStoneIcon) marketPermaEvoStoneIcon.style.backgroundImage = 'var(--item-icon-evolutionstone)';
    const marketTcgPackIcon = document.querySelector('.market-item[data-item-id="tcgpack"] .item-icon');
    if (marketTcgPackIcon) marketTcgPackIcon.style.backgroundImage = 'var(--item-icon-tcgpack)';
});

const trainersData = { "Bea": { name: "Bea", imageUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Bea-TG25-Astral-Radiance.png" }, "Brock": { name: "Brock", imageUrl: "https://www.pokemonkaart.nl/wp-content/uploads/brocks-scouting-179-sv9-eng.png" }, "Giovanni": { name: "Giovanni", imageUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Giovannis-Charisma-204-151.jpg" } };
const SAVE_KEY = 'blazingThunder_savedData_v1_2_2_tcg_expansion'; // Versie update

const typeChart = { "Normal": {"Rock": 0.5, "Ghost": 0, "Steel": 0.5}, "Fire": {"Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 2, "Bug": 2, "Rock": 0.5, "Dragon": 0.5, "Steel": 2}, "Water": {"Fire": 2, "Water": 0.5, "Grass": 0.5, "Ground": 2, "Rock": 2, "Dragon": 0.5}, "Electric": {"Water": 2, "Electric": 0.5, "Grass": 0.5, "Ground": 0, "Flying": 2, "Dragon": 0.5}, "Grass": {"Fire": 0.5, "Water": 2, "Grass": 0.5, "Poison": 0.5, "Ground": 2, "Flying": 0.5, "Bug": 0.5, "Rock": 2, "Dragon": 0.5, "Steel": 0.5}, "Ice": {"Fire": 0.5, "Water": 0.5, "Grass": 2, "Ice": 0.5, "Ground": 2, "Flying": 2, "Dragon": 2, "Steel": 0.5}, "Fighting": {"Normal": 2, "Ice": 2, "Poison": 0.5, "Flying": 0.5, "Psychic": 0.5, "Bug": 0.5, "Rock": 2, "Ghost": 0, "Dark": 2, "Steel": 2, "Fairy": 0.5}, "Poison": {"Grass": 2, "Poison": 0.5, "Ground": 0.5, "Rock": 0.5, "Ghost": 0.5, "Steel": 0, "Fairy": 2}, "Ground": {"Fire": 2, "Electric": 2, "Grass": 0.5, "Poison": 2, "Flying": 0, "Bug": 0.5, "Rock": 2, "Steel": 2}, "Flying": {"Electric": 0.5, "Grass": 2, "Fighting": 2, "Bug": 2, "Rock": 0.5, "Steel": 0.5}, "Psychic": {"Fighting": 2, "Poison": 2, "Psychic": 0.5, "Dark": 0, "Steel": 0.5}, "Bug": {"Fire": 0.5, "Grass": 2, "Fighting": 0.5, "Poison": 0.5, "Flying": 0.5, "Psychic": 2, "Ghost": 0.5, "Dark": 2, "Steel": 0.5, "Fairy": 0.5}, "Rock": {"Fire": 2, "Ice": 2, "Fighting": 0.5, "Ground": 0.5, "Flying": 2, "Bug": 2, "Steel": 0.5}, "Ghost": {"Normal": 0, "Psychic": 2, "Ghost": 2, "Dark": 0.5}, "Dragon": {"Dragon": 2, "Steel": 0.5, "Fairy": 0}, "Steel": {"Fire": 0.5, "Water": 0.5, "Electric": 0.5, "Ice": 2, "Rock": 2, "Steel": 0.5, "Fairy": 2}, "Dark": {"Fighting": 0.5, "Psychic": 2, "Ghost": 2, "Dark": 0.5, "Fairy": 0.5}, "Fairy": {"Fire": 0.5, "Fighting": 2, "Poison": 0.5, "Dragon": 2, "Dark": 2, "Steel": 0.5} };
const statStageMultipliers = [1/4, 2/7, 1/3, 2/5, 1/2, 2/3, 1, 1.5, 2, 2.5, 3, 3.5, 4];
const accuracyStageMultipliers = [1/3, 3/8, 3/7, 1/2, 3/5, 3/4, 1, 4/3, 5/3, 2, 7/3, 8/3, 3];

const pokemonPool = [ 
    // First 3 Kanto Starters
    {
        pokedexId: 1, name: "BULBASAUR", types: ["Grass", "Poison"], hp: 120, baseStats: { attack: 49, defense: 49, speed: 45 },
        moves: [ { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 }, { name: "Vine Whip", type: "Grass", accuracy: 100, maxPp: 25, power: 45 }, { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } }, { name: "Growth", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack"], target: "self", stages: 1 }, alwaysHits: true } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png", evolvesToPokedexId: 2 
    },
    {
        pokedexId: 2, name: "IVYSAUR", types: ["Grass", "Poison"], hp: 135, baseStats: { attack: 62, defense: 63, speed: 60 },
        moves: [ { name: "Razor Leaf", type: "Grass", accuracy: 95, maxPp: 25, power: 55, highCritRatio: true }, { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } }, { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }, { name: "Take Down", type: "Normal", accuracy: 85, maxPp: 20, power: 90 } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png", evolvesToPokedexId: 3 
    },
    {
        pokedexId: 3, name: "VENUSAUR", types: ["Grass", "Poison"], hp: 155, baseStats: { attack: 82, defense: 83, speed: 80 },
        moves: [ { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 }, { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 }, { name: "Growth", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 1 }, alwaysHits: true } ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png", evolvesToPokedexId: null 
    },
{
        pokedexId: 4,
        name: "CHARMANDER",
        types: ["Fire"],
        hp: 115,
        baseStats: { attack: 52, defense: 43, speed: 65 },
        moves: [
            { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
            { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
            { name: "Growl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1 }, alwaysHits: true },
            { name: "Smokescreen", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true }
        ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
        spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png",
        evolvesToPokedexId: 5
    },
    {
        pokedexId: 5,
        name: "CHARMELEON",
        types: ["Fire"],
        hp: 130,
        baseStats: { attack: 64, defense: 58, speed: 80 },
        moves: [
            { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true },
            { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } },
            { name: "Scary Face", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "stat", stat: "speed", target: "opponent", stages: -2 }, alwaysHits: true },
            { name: "Fire Fang", type: "Fire", accuracy: 95, maxPp: 15, power: 65, effect: { type: "flinch_or_status", condition: "BRN", chance: 0.1, flinchChance: 0.1 } } // Aangepast effect
        ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png",
        spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/5.png",
        evolvesToPokedexId: 6
    },
    {
        pokedexId: 6,
        name: "CHARIZARD",
        types: ["Fire", "Flying"],
        hp: 150,
        baseStats: { attack: 84, defense: 78, speed: 100 },
        moves: [
            { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } },
            { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } },
            { name: "Dragon Claw", type: "Dragon", accuracy: 100, maxPp: 15, power: 80 },
            { name: "Heat Wave", type: "Fire", accuracy: 90, maxPp: 10, power: 95, effect: { type: "status", condition: "BRN", chance: 0.1 } } // Target: all opponents (niet geïmplementeerd in huidige engine)
        ],
        spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png",
        evolvesToPokedexId: null
    },
    {
                pokedexId: 7,
                name: "SQUIRTLE",
                types: ["Water"],
                hp: 120,
                baseStats: { attack: 48, defense: 65, speed: 43 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Withdraw", type: "Water", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png",
                evolvesToPokedexId: 8
            },
            {
                pokedexId: 8,
                name: "WARTORTLE",
                types: ["Water"],
                hp: 135,
                baseStats: { attack: 63, defense: 80, speed: 58 },
                moves: [
                    { name: "Water Pulse", type: "Water", accuracy: 100, maxPp: 20, power: 60, effect: { type: "confusion", chance: 0.2 } }, // Confusion niet geïmplementeerd
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Rapid Spin", type: "Normal", accuracy: 100, maxPp: 40, power: 50 }, // Effect: removes hazards (niet geïmplementeerd)
                    { name: "Protect", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "protect" }, priority: 4, alwaysHits: true } // Protect niet geïmplementeerd
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/8.png",
                evolvesToPokedexId: 9
            },
            {
                pokedexId: 9,
                name: "BLASTOISE",
                types: ["Water"],
                hp: 155,
                baseStats: { attack: 83, defense: 100, speed: 78 },
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 },
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } },
                    { name: "Flash Cannon", type: "Steel", accuracy: 100, maxPp: 10, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special Defense
                    { name: "Skull Bash", type: "Normal", accuracy: 100, maxPp: 10, power: 130 } // 2-turn move (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/9.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 10,
                name: "CATERPIE",
                types: ["Bug"],
                hp: 100,
                baseStats: { attack: 30, defense: 35, speed: 45 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "String Shot", type: "Bug", accuracy: 95, maxPp: 40, power: 0, effect: { type: "stat", stat: "speed", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Bug Bite", type: "Bug", accuracy: 100, maxPp: 20, power: 60 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/10.png",
                evolvesToPokedexId: 11
            },
            {
                pokedexId: 11,
                name: "METAPOD",
                types: ["Bug"],
                hp: 110,
                baseStats: { attack: 20, defense: 55, speed: 30 },
                moves: [
                    { name: "Harden", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/11.png",
                evolvesToPokedexId: 12
            },
            {
                pokedexId: 12,
                name: "BUTTERFREE",
                types: ["Bug", "Flying"],
                hp: 130,
                baseStats: { attack: 45, defense: 50, speed: 70 }, // Sp. Atk is 90, Sp. Def is 80
                moves: [
                    { name: "Gust", type: "Flying", accuracy: 100, maxPp: 35, power: 40 }, // Special
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Psybeam", type: "Psychic", accuracy: 100, maxPp: 20, power: 65, effect: { type: "confusion", chance: 0.1 } }, // Special, Confusion niet geïmplementeerd
                    { name: "Bug Buzz", type: "Bug", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } } // Special, Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/12.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 13,
                name: "WEEDLE",
                types: ["Bug", "Poison"],
                hp: 100,
                baseStats: { attack: 35, defense: 30, speed: 50 },
                moves: [
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "String Shot", type: "Bug", accuracy: 95, maxPp: 40, power: 0, effect: { type: "stat", stat: "speed", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Bug Bite", type: "Bug", accuracy: 100, maxPp: 20, power: 60 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/13.png",
                evolvesToPokedexId: 14
            },
            {
                pokedexId: 14,
                name: "KAKUNA",
                types: ["Bug", "Poison"],
                hp: 110,
                baseStats: { attack: 25, defense: 50, speed: 35 },
                moves: [
                    { name: "Harden", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/14.png",
                evolvesToPokedexId: 15
            },
            {
                pokedexId: 15,
                name: "BEEDRILL",
                types: ["Bug", "Poison"],
                hp: 135,
                baseStats: { attack: 90, defense: 40, speed: 75 }, // Sp. Def is 80
                moves: [
                    { name: "Twineedle", type: "Bug", accuracy: 100, maxPp: 20, power: 25 }, // Hits twice, poison chance (niet geïmplementeerd)
                    { name: "Poison Jab", type: "Poison", accuracy: 100, maxPp: 20, power: 80, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Pin Missile", type: "Bug", accuracy: 95, maxPp: 20, power: 25 } // Hits 2-5 times (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/15.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 16,
                name: "PIDGEY",
                types: ["Normal", "Flying"],
                hp: 110,
                baseStats: { attack: 45, defense: 40, speed: 56 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Gust", type: "Flying", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Sand Attack", type: "Ground", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/16.png",
                evolvesToPokedexId: 17
            },
            {
                pokedexId: 17,
                name: "PIDGEOTTO",
                types: ["Normal", "Flying"],
                hp: 130,
                baseStats: { attack: 60, defense: 55, speed: 71 },
                moves: [
                    { name: "Wing Attack", type: "Flying", accuracy: 100, maxPp: 35, power: 60 },
                    { name: "Twister", type: "Dragon", accuracy: 100, maxPp: 20, power: 40, effect: { type: "flinch", chance: 0.2 } }, // Special
                    { name: "Feather Dance", type: "Flying", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/17.png",
                evolvesToPokedexId: 18
            },
            {
                pokedexId: 18,
                name: "PIDGEOT",
                types: ["Normal", "Flying"],
                hp: 150,
                baseStats: { attack: 80, defense: 75, speed: 101 }, // Sp. Def is 70
                moves: [
                    { name: "Hurricane", type: "Flying", accuracy: 70, maxPp: 10, power: 110, effect: { type: "confusion", chance: 0.3 } }, // Special, Confusion niet geïmplementeerd
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Heat Wave", type: "Fire", accuracy: 90, maxPp: 10, power: 95, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/18.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 19,
                name: "RATTATA",
                types: ["Normal"],
                hp: 100,
                baseStats: { attack: 56, defense: 35, speed: 72 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Focus Energy", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "focus_energy" }, alwaysHits: true }, // Verhoogt crit kans (niet volledig geïmplementeerd)
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/19.png",
                evolvesToPokedexId: 20
            },
            {
                pokedexId: 20,
                name: "RATICATE",
                types: ["Normal"],
                hp: 125,
                baseStats: { attack: 81, defense: 60, speed: 97 },
                moves: [
                    { name: "Hyper Fang", type: "Normal", accuracy: 90, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.1 } },
                    { name: "Sucker Punch", type: "Dark", accuracy: 100, maxPp: 5, power: 70, priority: 1 }, // Werkt alleen als target aanvalt (niet geïmplementeerd)
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Scary Face", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "stat", stat: "speed", target: "opponent", stages: -2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/20.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 21,
                name: "SPEAROW",
                types: ["Normal", "Flying"],
                hp: 110,
                baseStats: { attack: 60, defense: 30, speed: 70 },
                moves: [
                    { name: "Peck", type: "Flying", accuracy: 100, maxPp: 35, power: 35 },
                    { name: "Growl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Fury Attack", type: "Normal", accuracy: 85, maxPp: 20, power: 15 } // Hits 2-5 times (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/21.png",
                evolvesToPokedexId: 22
            },
            {
                pokedexId: 22,
                name: "FEAROW",
                types: ["Normal", "Flying"],
                hp: 135,
                baseStats: { attack: 90, defense: 65, speed: 100 },
                moves: [
                    { name: "Drill Peck", type: "Flying", accuracy: 100, maxPp: 20, power: 80 },
                    { name: "Aerial Ace", type: "Flying", accuracy: 100, maxPp: 20, power: 60, alwaysHits: true }, // Kan niet missen
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Assurance", type: "Dark", accuracy: 100, maxPp: 10, power: 60 } // Power doubles if target took damage this turn (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/22.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/22.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 23,
                name: "EKANS",
                types: ["Poison"],
                hp: 110,
                baseStats: { attack: 60, defense: 44, speed: 55 },
                moves: [
                    { name: "Wrap", type: "Normal", accuracy: 90, maxPp: 20, power: 15 }, // Traps target (niet geïmplementeerd)
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Glare", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/23.png",
                evolvesToPokedexId: 24
            },
            {
                pokedexId: 24,
                name: "ARBOK",
                types: ["Poison"],
                hp: 130,
                baseStats: { attack: 95, defense: 69, speed: 80 },
                moves: [
                    { name: "Poison Jab", type: "Poison", accuracy: 100, maxPp: 20, power: 80, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Glare", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } },
                    { name: "Acid Spray", type: "Poison", accuracy: 100, maxPp: 20, power: 40, effect: {type: "stat", stat: "defense", target: "opponent", stages: -2 } } // Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/24.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/24.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 25,
                name: "PIKACHU",
                types: ["Electric"],
                hp: 110,
                baseStats: { attack: 55, defense: 40, speed: 90 },
                moves: [
                    { name: "Thunder Shock", type: "Electric", accuracy: 100, maxPp: 30, power: 40, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Nuzzle", type: "Electric", accuracy: 100, maxPp: 20, power: 20, effect: { type: "status", condition: "PAR", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png",
                evolvesToPokedexId: 26 // Evolueert met Thunder Stone (niet direct via level in dit spel)
            },
            {
                pokedexId: 26,
                name: "RAICHU",
                types: ["Electric"],
                hp: 130,
                baseStats: { attack: 90, defense: 55, speed: 110 },
                moves: [
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Volt Switch", type: "Electric", accuracy: 100, maxPp: 20, power: 70 }, // Switches out (niet geïmplementeerd)
                    { name: "Focus Blast", type: "Fighting", accuracy: 70, maxPp: 5, power: 120, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Sp. Def
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true } // Sp. Atk
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/26.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 27,
                name: "SANDSHREW",
                types: ["Ground"],
                hp: 120,
                baseStats: { attack: 75, defense: 85, speed: 40 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Sand Attack", type: "Ground", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Rollout", type: "Rock", accuracy: 90, maxPp: 20, power: 30 } // Power increases (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/27.png",
                evolvesToPokedexId: 28
            },
            {
                pokedexId: 28,
                name: "SANDSLASH",
                types: ["Ground"],
                hp: 145,
                baseStats: { attack: 100, defense: 110, speed: 65 },
                moves: [
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Crush Claw", type: "Normal", accuracy: 95, maxPp: 10, power: 75, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.5 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/28.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/28.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 29,
                name: "NIDORAN♀",
                types: ["Poison"],
                hp: 125,
                baseStats: { attack: 47, defense: 52, speed: 41 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Growl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/29.png",
                evolvesToPokedexId: 30
            },
            {
                pokedexId: 30,
                name: "NIDORINA",
                types: ["Poison"],
                hp: 140,
                baseStats: { attack: 62, defense: 67, speed: 56 },
                moves: [
                    { name: "Poison Fang", type: "Poison", accuracy: 100, maxPp: 15, power: 50, effect: { type: "status", condition: "PSN", chance: 0.5 } }, // Badly poisons
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Toxic Spikes", type: "Poison", accuracy: 100, maxPp: 20, power: 0 }, // Entry hazard (niet geïmplementeerd)
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/30.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/30.png",
                evolvesToPokedexId: 31 // Evolueert met Moon Stone
            },
            {
                pokedexId: 31,
                name: "NIDOQUEEN",
                types: ["Poison", "Ground"],
                hp: 160,
                baseStats: { attack: 92, defense: 87, speed: 76 },
                moves: [
                    { name: "Earth Power", type: "Ground", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Sp. Def, Special
                    { name: "Sludge Wave", type: "Poison", accuracy: 100, maxPp: 10, power: 95, effect: { type: "status", condition: "PSN", chance: 0.1 } }, // Special
                    { name: "Superpower", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: -1 } },
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/31.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/31.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 32,
                name: "NIDORAN♂",
                types: ["Poison"],
                hp: 115,
                baseStats: { attack: 57, defense: 40, speed: 50 },
                moves: [
                    { name: "Peck", type: "Flying", accuracy: 100, maxPp: 35, power: 35 },
                    { name: "Focus Energy", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "focus_energy" }, alwaysHits: true },
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/32.png",
                evolvesToPokedexId: 33
            },
            {
                pokedexId: 33,
                name: "NIDORINO",
                types: ["Poison"],
                hp: 130,
                baseStats: { attack: 72, defense: 57, speed: 65 },
                moves: [
                    { name: "Poison Jab", type: "Poison", accuracy: 100, maxPp: 20, power: 80, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Horn Attack", type: "Normal", accuracy: 100, maxPp: 25, power: 65 },
                    { name: "Fury Attack", type: "Normal", accuracy: 85, maxPp: 20, power: 15 }, // Hits 2-5 times
                    { name: "Toxic Spikes", type: "Poison", accuracy: 100, maxPp: 20, power: 0 } // Entry hazard
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/33.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/33.png",
                evolvesToPokedexId: 34 // Evolueert met Moon Stone
            },
            {
                pokedexId: 34,
                name: "NIDOKING",
                types: ["Poison", "Ground"],
                hp: 150,
                baseStats: { attack: 102, defense: 77, speed: 85 },
                moves: [
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Poison Jab", type: "Poison", accuracy: 100, maxPp: 20, power: 80, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Megahorn", type: "Bug", accuracy: 85, maxPp: 10, power: 120 },
                    { name: "Thrash", type: "Normal", accuracy: 100, maxPp: 10, power: 120 } // Locks user, confuses (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/34.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/34.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 35,
                name: "CLEFAIRY",
                types: ["Fairy"],
                hp: 140,
                baseStats: { attack: 45, defense: 48, speed: 35 },
                moves: [
                    { name: "Pound", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Growl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Sing", type: "Normal", accuracy: 55, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Moonlight", type: "Fairy", accuracy: 100, maxPp: 5, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true } // Heals more in sun (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/35.png",
                evolvesToPokedexId: 36 // Evolueert met Moon Stone
            },
            {
                pokedexId: 36,
                name: "CLEFABLE",
                types: ["Fairy"],
                hp: 165,
                baseStats: { attack: 70, defense: 73, speed: 60 },
                moves: [
                    { name: "Moonblast", type: "Fairy", accuracy: 100, maxPp: 15, power: 95, effect: {type: "stat", stat: "attack", target: "opponent", stages: -1, chance: 0.3 } }, // Sp. Atk
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special
                    { name: "Calm Mind", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true }, // Sp. Atk & Sp. Def
                    { name: "Soft-Boiled", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/36.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/36.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 37,
                name: "VULPIX",
                types: ["Fire"],
                hp: 110,
                baseStats: { attack: 41, defense: 40, speed: 65 },
                moves: [
                    { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Will-O-Wisp", type: "Fire", accuracy: 85, maxPp: 15, power: 0, effect: { type: "status", condition: "BRN", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/37.png",
                evolvesToPokedexId: 38 // Evolueert met Fire Stone
            },
            {
                pokedexId: 38,
                name: "NINETALES",
                types: ["Fire"],
                hp: 145,
                baseStats: { attack: 76, defense: 75, speed: 100 },
                moves: [
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 }, // Special
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }, // Sp. Atk
                    { name: "Extrasensory", type: "Psychic", accuracy: 100, maxPp: 20, power: 80, effect: { type: "flinch", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/38.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/38.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 39,
                name: "JIGGLYPUFF",
                types: ["Normal", "Fairy"],
                hp: 185, // Hoogste HP van de basisvormen
                baseStats: { attack: 45, defense: 20, speed: 20 },
                moves: [
                    { name: "Sing", type: "Normal", accuracy: 55, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Pound", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Defense Curl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Disarming Voice", type: "Fairy", accuracy: 100, maxPp: 15, power: 40, alwaysHits: true } // Special, kan niet missen
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/39.png",
                evolvesToPokedexId: 40 // Evolueert met Moon Stone
            },
            {
                pokedexId: 40,
                name: "WIGGLYTUFF",
                types: ["Normal", "Fairy"],
                hp: 210, // Zeer hoge HP
                baseStats: { attack: 70, defense: 45, speed: 45 },
                moves: [
                    { name: "Hyper Voice", type: "Normal", accuracy: 100, maxPp: 10, power: 90 }, // Special
                    { name: "Dazzling Gleam", type: "Fairy", accuracy: 100, maxPp: 10, power: 80 }, // Special
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Wish", type: "Normal", accuracy: 100, maxPp: 10, power: 0 } // Heals next turn (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/40.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/40.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 41,
                name: "ZUBAT",
                types: ["Poison", "Flying"],
                hp: 110,
                baseStats: { attack: 45, defense: 35, speed: 55 },
                moves: [
                    { name: "Leech Life", type: "Bug", accuracy: 100, maxPp: 10, power: 80, effect: { type: "heal", percentage: 0.5, target: "self"} }, // Was zwakker, nu sterk
                    { name: "Astonish", type: "Ghost", accuracy: 100, maxPp: 15, power: 30, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Wing Attack", type: "Flying", accuracy: 100, maxPp: 35, power: 60 },
                    { name: "Confuse Ray", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 } // Confuses (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/41.png",
                evolvesToPokedexId: 42
            },
            {
                pokedexId: 42,
                name: "GOLBAT",
                types: ["Poison", "Flying"],
                hp: 145,
                baseStats: { attack: 80, defense: 70, speed: 90 },
                moves: [
                    { name: "Air Cutter", type: "Flying", accuracy: 95, maxPp: 25, power: 60, highCritRatio: true }, // Special
                    { name: "Poison Fang", type: "Poison", accuracy: 100, maxPp: 15, power: 50, effect: { type: "status", condition: "PSN", chance: 0.5 } }, // Badly poisons
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Haze", type: "Ice", accuracy: 100, maxPp: 30, power: 0 } // Resets stats (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/42.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/42.png",
                evolvesToPokedexId: 169 // Crobat (Gen 2, evolueert via friendship) - voor nu null
            },
            {
                pokedexId: 43,
                name: "ODDISH",
                types: ["Grass", "Poison"],
                hp: 115,
                baseStats: { attack: 50, defense: 55, speed: 30 },
                moves: [
                    { name: "Absorb", type: "Grass", accuracy: 100, maxPp: 25, power: 20, effect: { type: "heal", percentage: 0.5, target: "self"} }, // Special
                    { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } },
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Acid", type: "Poison", accuracy: 100, maxPp: 30, power: 40, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } } // Special, Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/43.png",
                evolvesToPokedexId: 44
            },
            {
                pokedexId: 44,
                name: "GLOOM",
                types: ["Grass", "Poison"],
                hp: 130,
                baseStats: { attack: 65, defense: 70, speed: 40 },
                moves: [
                    { name: "Mega Drain", type: "Grass", accuracy: 100, maxPp: 15, power: 40, effect: { type: "heal", percentage: 0.5, target: "self"} }, // Special
                    { name: "Stun Spore", type: "Grass", accuracy: 75, maxPp: 30, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } },
                    { name: "Sludge", type: "Poison", accuracy: 100, maxPp: 20, power: 65, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Petal Dance", type: "Grass", accuracy: 100, maxPp: 10, power: 120 } // Special, locks user, confuses (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/44.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/44.png",
                evolvesToPokedexId: 45 // Kan ook naar Bellossom (182) met Sun Stone
            },
            {
                pokedexId: 45,
                name: "VILEPLUME",
                types: ["Grass", "Poison"],
                hp: 145,
                baseStats: { attack: 80, defense: 85, speed: 50 }, // Sp. Atk 110
                moves: [
                    { name: "Petal Blizzard", type: "Grass", accuracy: 100, maxPp: 15, power: 90 },
                    { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Aromatherapy", type: "Grass", accuracy: 100, maxPp: 5, power: 0 }, // Heals status (niet geïmplementeerd)
                    { name: "Moonblast", type: "Fairy", accuracy: 100, maxPp: 15, power: 95, effect: {type: "stat", stat: "attack", target: "opponent", stages: -1, chance: 0.3 } } // Special, Sp. Atk
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/45.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/45.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 46,
                name: "PARAS",
                types: ["Bug", "Grass"],
                hp: 110,
                baseStats: { attack: 70, defense: 55, speed: 25 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Stun Spore", type: "Grass", accuracy: 75, maxPp: 30, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } },
                    { name: "Leech Life", type: "Bug", accuracy: 100, maxPp: 10, power: 80, effect: { type: "heal", percentage: 0.5, target: "self"} },
                    { name: "Spore", type: "Grass", accuracy: 100, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/46.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/46.png",
                evolvesToPokedexId: 47
            },
            {
                pokedexId: 47,
                name: "PARASECT",
                types: ["Bug", "Grass"],
                hp: 130,
                baseStats: { attack: 95, defense: 80, speed: 30 },
                moves: [
                    { name: "X-Scissor", type: "Bug", accuracy: 100, maxPp: 15, power: 80 },
                    { name: "Seed Bomb", type: "Grass", accuracy: 100, maxPp: 15, power: 80 },
                    { name: "Spore", type: "Grass", accuracy: 100, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/47.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/47.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 48,
                name: "VENONAT",
                types: ["Bug", "Poison"],
                hp: 130,
                baseStats: { attack: 55, defense: 50, speed: 45 }, // Sp. Atk 40
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } },
                    { name: "Psybeam", type: "Psychic", accuracy: 100, maxPp: 20, power: 65, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Signal Beam", type: "Bug", accuracy: 100, maxPp: 15, power: 75, effect: { type: "confusion", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/48.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/48.png",
                evolvesToPokedexId: 49
            },
            {
                pokedexId: 49,
                name: "VENOMOTH",
                types: ["Bug", "Poison"],
                hp: 140,
                baseStats: { attack: 65, defense: 60, speed: 90 }, // Sp. Atk 90
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Bug Buzz", type: "Bug", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Quiver Dance", type: "Bug", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense", "speed"], target: "self", stages: 1 }, alwaysHits: true } // Sp.Atk, Sp.Def, Speed
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/49.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/49.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 50,
                name: "DIGLETT",
                types: ["Ground"],
                hp: 80, // Erg lage HP
                baseStats: { attack: 55, defense: 25, speed: 95 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Sand Attack", type: "Ground", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Magnitude", type: "Ground", accuracy: 100, maxPp: 30, power: 70 }, // Power varieert (niet geïmplementeerd)
                    { name: "Dig", type: "Ground", accuracy: 100, maxPp: 10, power: 80 } // 2-turn (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/50.png",
                evolvesToPokedexId: 51
            },
    {
                pokedexId: 51,
                name: "DUGTRIO",
                types: ["Ground"],
                hp: 105, // Nog steeds vrij laag HP
                baseStats: { attack: 100, defense: 50, speed: 120 },
                moves: [
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Sucker Punch", type: "Dark", accuracy: 100, maxPp: 5, power: 70, priority: 1 },
                    { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true },
                    { name: "Rock Slide", type: "Rock", accuracy: 90, maxPp: 10, power: 75, effect: { type: "flinch", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/51.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/51.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 52,
                name: "MEOWTH",
                types: ["Normal"],
                hp: 110,
                baseStats: { attack: 45, defense: 35, speed: 90 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Growl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Pay Day", type: "Normal", accuracy: 100, maxPp: 20, power: 40 } // Effect: scatters coins (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/52.png",
                evolvesToPokedexId: 53
            },
            {
                pokedexId: 53,
                name: "PERSIAN",
                types: ["Normal"],
                hp: 135,
                baseStats: { attack: 70, defense: 60, speed: 115 },
                moves: [
                    { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true },
                    { name: "Power Gem", type: "Rock", accuracy: 100, maxPp: 20, power: 80 }, // Special
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }, // Sp. Atk
                    { name: "Fake Out", type: "Normal", accuracy: 100, maxPp: 10, power: 40, priority: 3, effect: { type: "flinch", chance: 1 } } // Only on first turn (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/53.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/53.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 54,
                name: "PSYDUCK",
                types: ["Water"],
                hp: 120,
                baseStats: { attack: 52, defense: 48, speed: 55 }, // Sp. Atk 65
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 }, // Special
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Disable", type: "Normal", accuracy: 100, maxPp: 20, power: 0 } // Disables opponent's last move (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/54.png",
                evolvesToPokedexId: 55
            },
            {
                pokedexId: 55,
                name: "GOLDUCK",
                types: ["Water"],
                hp: 150,
                baseStats: { attack: 82, defense: 78, speed: 85 }, // Sp. Atk 95
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Calm Mind", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true } // Sp. Atk & Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/55.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/55.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 56,
                name: "MANKEY",
                types: ["Fighting"],
                hp: 110,
                baseStats: { attack: 80, defense: 35, speed: 70 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Low Kick", type: "Fighting", accuracy: 100, maxPp: 20, power: 60 }, // Power varies by weight (niet geïmplementeerd)
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Karate Chop", type: "Fighting", accuracy: 100, maxPp: 25, power: 50, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/56.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/56.png",
                evolvesToPokedexId: 57
            },
            {
                pokedexId: 57,
                name: "PRIMEAPE",
                types: ["Fighting"],
                hp: 135,
                baseStats: { attack: 105, defense: 60, speed: 95 },
                moves: [
                    { name: "Cross Chop", type: "Fighting", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Thrash", type: "Normal", accuracy: 100, maxPp: 10, power: 120 }, // Locks user, confuses
                    { name: "Close Combat", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["defense", "defense"], target: "self", stages: -1 } }, // Sp. Def
                    { name: "Rage", type: "Normal", accuracy: 100, maxPp: 20, power: 20 } // Attack raises if hit (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/57.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/57.png",
                evolvesToPokedexId: null // Annihilape is Gen 9
            },
            {
                pokedexId: 58,
                name: "GROWLITHE",
                types: ["Fire"],
                hp: 125,
                baseStats: { attack: 70, defense: 45, speed: 60 },
                moves: [
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Roar", type: "Normal", accuracy: 100, maxPp: 20, power: 0 }, // Forces switch (niet geïmplementeerd)
                    { name: "Flame Wheel", type: "Fire", accuracy: 100, maxPp: 25, power: 60, effect: { type: "status", condition: "BRN", chance: 0.1 } } // Thaw user
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/58.png",
                evolvesToPokedexId: 59 // Evolueert met Fire Stone
            },
            {
                pokedexId: 59,
                name: "ARCANINE",
                types: ["Fire"],
                hp: 160,
                baseStats: { attack: 110, defense: 80, speed: 95 },
                moves: [
                    { name: "Flare Blitz", type: "Fire", accuracy: 100, maxPp: 15, power: 120, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Recoil (niet geïmplementeerd)
                    { name: "Extreme Speed", type: "Normal", accuracy: 100, maxPp: 5, power: 80, priority: 2 },
                    { name: "Wild Charge", type: "Electric", accuracy: 100, maxPp: 15, power: 90 }, // Recoil
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/59.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/59.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 60,
                name: "POLIWAG",
                types: ["Water"],
                hp: 110,
                baseStats: { attack: 50, defense: 40, speed: 90 },
                moves: [
                    { name: "Bubble", type: "Water", accuracy: 100, maxPp: 30, power: 40, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Hypnosis", type: "Psychic", accuracy: 60, maxPp: 20, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 }, // Special
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/60.png",
                evolvesToPokedexId: 61
            },
            {
                pokedexId: 61,
                name: "POLIWHIRL",
                types: ["Water"],
                hp: 135,
                baseStats: { attack: 65, defense: 65, speed: 90 },
                moves: [
                    { name: "Water Pulse", type: "Water", accuracy: 100, maxPp: 20, power: 60, effect: { type: "confusion", chance: 0.2 } }, // Special
                    { name: "Mud Shot", type: "Ground", accuracy: 95, maxPp: 15, power: 55, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1 } }, // Special
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Bubble Beam", type: "Water", accuracy: 100, maxPp: 20, power: 65, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/61.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/61.png",
                evolvesToPokedexId: 62 // Evolueert naar Poliwrath met Water Stone, of Politoed (186) met King's Rock + trade
            },
            {
                pokedexId: 62,
                name: "POLIWRATH",
                types: ["Water", "Fighting"],
                hp: 160,
                baseStats: { attack: 95, defense: 95, speed: 70 },
                moves: [
                    { name: "Dynamic Punch", type: "Fighting", accuracy: 50, maxPp: 5, power: 100, effect: { type: "confusion", chance: 1 } },
                    { name: "Waterfall", type: "Water", accuracy: 100, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } },
                    { name: "Bulk Up", type: "Fighting", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Submission", type: "Fighting", accuracy: 80, maxPp: 20, power: 80 } // Recoil (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/62.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/62.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 63,
                name: "ABRA",
                types: ["Psychic"],
                hp: 95,
                baseStats: { attack: 20, defense: 15, speed: 90 }, // Sp. Atk 105
                moves: [
                    { name: "Teleport", type: "Psychic", accuracy: 100, maxPp: 20, power: 0 } // Flees (niet geïmplementeerd voor battle)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/63.png",
                evolvesToPokedexId: 64
            },
            {
                pokedexId: 64,
                name: "KADABRA",
                types: ["Psychic"],
                hp: 110,
                baseStats: { attack: 35, defense: 30, speed: 105 }, // Sp. Atk 120
                moves: [
                    { name: "Psybeam", type: "Psychic", accuracy: 100, maxPp: 20, power: 65, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Disable", type: "Normal", accuracy: 100, maxPp: 20, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/64.png",
                evolvesToPokedexId: 65 // Evolueert via trade
            },
            {
                pokedexId: 65,
                name: "ALAKAZAM",
                types: ["Psychic"],
                hp: 125,
                baseStats: { attack: 50, defense: 45, speed: 120 }, // Sp. Atk 135
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Focus Blast", type: "Fighting", accuracy: 70, maxPp: 5, power: 120, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }, // Special, Sp. Def
                    { name: "Calm Mind", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true } // Sp. Atk & Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/65.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 66,
                name: "MACHOP",
                types: ["Fighting"],
                hp: 140,
                baseStats: { attack: 80, defense: 50, speed: 35 },
                moves: [
                    { name: "Low Kick", type: "Fighting", accuracy: 100, maxPp: 20, power: 60 },
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Karate Chop", type: "Fighting", accuracy: 100, maxPp: 25, power: 50, highCritRatio: true },
                    { name: "Focus Energy", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "focus_energy" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/66.png",
                evolvesToPokedexId: 67
            },
            {
                pokedexId: 67,
                name: "MACHOKE",
                types: ["Fighting"],
                hp: 150,
                baseStats: { attack: 100, defense: 70, speed: 45 },
                moves: [
                    { name: "Submission", type: "Fighting", accuracy: 80, maxPp: 20, power: 80 }, // Recoil
                    { name: "Bulk Up", type: "Fighting", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Brick Break", type: "Fighting", accuracy: 100, maxPp: 15, power: 75 }, // Breaks screens (niet geïmplementeerd)
                    { name: "Strength", type: "Normal", accuracy: 100, maxPp: 15, power: 80 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/67.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/67.png",
                evolvesToPokedexId: 68 // Evolueert via trade
            },
            {
                pokedexId: 68,
                name: "MACHAMP",
                types: ["Fighting"],
                hp: 160,
                baseStats: { attack: 130, defense: 80, speed: 55 },
                moves: [
                    { name: "Dynamic Punch", type: "Fighting", accuracy: 50, maxPp: 5, power: 100, effect: { type: "confusion", chance: 1 } },
                    { name: "Close Combat", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["defense", "defense"], target: "self", stages: -1 } }, // Sp. Def
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Bullet Punch", type: "Steel", accuracy: 100, maxPp: 30, power: 40, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/68.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/68.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 69,
                name: "BELLSPROUT",
                types: ["Grass", "Poison"],
                hp: 120,
                baseStats: { attack: 75, defense: 35, speed: 40 },
                moves: [
                    { name: "Vine Whip", type: "Grass", accuracy: 100, maxPp: 25, power: 45 },
                    { name: "Growth", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 1 }, alwaysHits: true }, // Sp. Atk
                    { name: "Wrap", type: "Normal", accuracy: 90, maxPp: 20, power: 15 },
                    { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/69.png",
                evolvesToPokedexId: 70
            },
            {
                pokedexId: 70,
                name: "WEEPINBELL",
                types: ["Grass", "Poison"],
                hp: 135,
                baseStats: { attack: 90, defense: 50, speed: 55 },
                moves: [
                    { name: "Razor Leaf", type: "Grass", accuracy: 95, maxPp: 25, power: 55, highCritRatio: true },
                    { name: "Sludge", type: "Poison", accuracy: 100, maxPp: 20, power: 65, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Stun Spore", type: "Grass", accuracy: 75, maxPp: 30, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } },
                    { name: "Acid", type: "Poison", accuracy: 100, maxPp: 30, power: 40, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } } // Special, Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/70.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/70.png",
                evolvesToPokedexId: 71 // Evolueert met Leaf Stone
            },
            {
                pokedexId: 71,
                name: "VICTREEBEL",
                types: ["Grass", "Poison"],
                hp: 150,
                baseStats: { attack: 105, defense: 65, speed: 70 }, // Sp. Atk 100
                moves: [
                    { name: "Leaf Storm", type: "Grass", accuracy: 90, maxPp: 5, power: 130, effect: { type: "stat", stat: "attack", target: "self", stages: -2 } }, // Special, Sp. Atk
                    { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Power Whip", type: "Grass", accuracy: 85, maxPp: 10, power: 120 },
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/71.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/71.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 72,
                name: "TENTACOOL",
                types: ["Water", "Poison"],
                hp: 110,
                baseStats: { attack: 40, defense: 35, speed: 70 }, // Sp. Def 100
                moves: [
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Supersonic", type: "Normal", accuracy: 55, maxPp: 20, power: 0 }, // Confuses (niet geïmplementeerd)
                    { name: "Water Pulse", type: "Water", accuracy: 100, maxPp: 20, power: 60, effect: { type: "confusion", chance: 0.2 } }, // Special
                    { name: "Acid Armor", type: "Poison", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/72.png",
                evolvesToPokedexId: 73
            },
            {
                pokedexId: 73,
                name: "TENTACRUEL",
                types: ["Water", "Poison"],
                hp: 150,
                baseStats: { attack: 70, defense: 65, speed: 100 }, // Sp. Def 120
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Sludge Wave", type: "Poison", accuracy: 100, maxPp: 10, power: 95, effect: { type: "status", condition: "PSN", chance: 0.1 } }, // Special
                    { name: "Barrier", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Toxic Spikes", type: "Poison", accuracy: 100, maxPp: 20, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/73.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/73.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 74,
                name: "GEODUDE",
                types: ["Rock", "Ground"],
                hp: 110,
                baseStats: { attack: 80, defense: 100, speed: 20 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Defense Curl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Rock Throw", type: "Rock", accuracy: 90, maxPp: 15, power: 50 },
                    { name: "Magnitude", type: "Ground", accuracy: 100, maxPp: 30, power: 70 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/74.png",
                evolvesToPokedexId: 75
            },
            {
                pokedexId: 75,
                name: "GRAVELER",
                types: ["Rock", "Ground"],
                hp: 125,
                baseStats: { attack: 95, defense: 115, speed: 35 },
                moves: [
                    { name: "Rock Blast", type: "Rock", accuracy: 90, maxPp: 10, power: 25 }, // Hits 2-5 times
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Self-Destruct", type: "Normal", accuracy: 100, maxPp: 5, power: 200 }, // User faints (niet geïmplementeerd)
                    { name: "Rollout", type: "Rock", accuracy: 90, maxPp: 20, power: 30 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/75.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/75.png",
                evolvesToPokedexId: 76 // Evolueert via trade
            },
            {
                pokedexId: 76,
                name: "GOLEM",
                types: ["Rock", "Ground"],
                hp: 150,
                baseStats: { attack: 120, defense: 130, speed: 45 },
                moves: [
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Heavy Slam", type: "Steel", accuracy: 100, maxPp: 10, power: 80 }, // Power based on weight (niet geïmplementeerd)
                    { name: "Explosion", type: "Normal", accuracy: 100, maxPp: 5, power: 250 } // User faints
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/76.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/76.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 77,
                name: "PONYTA",
                types: ["Fire"],
                hp: 120,
                baseStats: { attack: 85, defense: 55, speed: 90 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Stomp", type: "Normal", accuracy: 100, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/77.png",
                evolvesToPokedexId: 78
            },
            {
                pokedexId: 78,
                name: "RAPIDASH",
                types: ["Fire"],
                hp: 135,
                baseStats: { attack: 100, defense: 70, speed: 105 },
                moves: [
                    { name: "Flare Blitz", type: "Fire", accuracy: 100, maxPp: 15, power: 120, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Recoil
                    { name: "Megahorn", type: "Bug", accuracy: 85, maxPp: 10, power: 120 },
                    { name: "Morning Sun", type: "Normal", accuracy: 100, maxPp: 5, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Drill Run", type: "Ground", accuracy: 95, maxPp: 10, power: 80, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/78.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/78.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 79,
                name: "SLOWPOKE",
                types: ["Water", "Psychic"],
                hp: 160,
                baseStats: { attack: 65, defense: 65, speed: 15 },
                moves: [
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 }, // Special
                    { name: "Disable", type: "Normal", accuracy: 100, maxPp: 20, power: 0 },
                    { name: "Yawn", type: "Normal", accuracy: 100, maxPp: 10, power: 0 } // Makes target sleepy (SLP next turn, niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/79.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/79.png",
                evolvesToPokedexId: 80 // Kan ook naar Slowking (199) met King's Rock + trade
            },
            {
                pokedexId: 80,
                name: "SLOWBRO",
                types: ["Water", "Psychic"],
                hp: 165,
                baseStats: { attack: 75, defense: 110, speed: 30 }, // Sp. Atk 100
                moves: [
                    { name: "Surf", type: "Water", accuracy: 100, maxPp: 15, power: 90 }, // Special
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Slack Off", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/80.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/80.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 81,
                name: "MAGNEMITE",
                types: ["Electric", "Steel"],
                hp: 95,
                baseStats: { attack: 35, defense: 70, speed: 45 }, // Sp. Atk 95
                moves: [
                    { name: "Thunder Shock", type: "Electric", accuracy: 100, maxPp: 30, power: 40, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Supersonic", type: "Normal", accuracy: 55, maxPp: 20, power: 0 },
                    { name: "Flash Cannon", type: "Steel", accuracy: 100, maxPp: 10, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Thunder Wave", type: "Electric", accuracy: 90, maxPp: 20, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/81.png",
                evolvesToPokedexId: 82
            },
            {
                pokedexId: 82,
                name: "MAGNETON",
                types: ["Electric", "Steel"],
                hp: 120,
                baseStats: { attack: 60, defense: 95, speed: 70 }, // Sp. Atk 120
                moves: [
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Tri Attack", type: "Normal", accuracy: 100, maxPp: 10, power: 80, effect: { type: "status_random", conditions: ["BRN", "PAR", "FRZ"], chance: 0.2 } }, // Special
                    { name: "Discharge", type: "Electric", accuracy: 100, maxPp: 15, power: 80, effect: { type: "status", condition: "PAR", chance: 0.3 } }, // Special
                    { name: "Metal Sound", type: "Steel", accuracy: 85, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -2 }, alwaysHits: true } // Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/82.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/82.png",
                evolvesToPokedexId: 462 // Magnezone (Gen 4), evolueert op speciale locaties / met item
            },
            {
                pokedexId: 83,
                name: "FARFETCHD",
                types: ["Normal", "Flying"],
                hp: 122,
                baseStats: { attack: 90, defense: 55, speed: 60 },
                moves: [
                    { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true },
                    { name: "Air Cutter", type: "Flying", accuracy: 95, maxPp: 25, power: 60, highCritRatio: true }, // Special
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Leaf Blade", type: "Grass", accuracy: 100, maxPp: 15, power: 90, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/83.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/83.png",
                evolvesToPokedexId: null // Sirfetch'd is Gen 8
            },
            {
                pokedexId: 84,
                name: "DODUO",
                types: ["Normal", "Flying"],
                hp: 105,
                baseStats: { attack: 85, defense: 45, speed: 75 },
                moves: [
                    { name: "Peck", type: "Flying", accuracy: 100, maxPp: 35, power: 35 },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Rage", type: "Normal", accuracy: 100, maxPp: 20, power: 20 },
                    { name: "Fury Attack", type: "Normal", accuracy: 85, maxPp: 20, power: 15 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/84.png",
                evolvesToPokedexId: 85
            },
            {
                pokedexId: 85,
                name: "DODRIO",
                types: ["Normal", "Flying"],
                hp: 130,
                baseStats: { attack: 110, defense: 70, speed: 110 },
                moves: [
                    { name: "Drill Peck", type: "Flying", accuracy: 100, maxPp: 20, power: 80 },
                    { name: "Tri Attack", type: "Normal", accuracy: 100, maxPp: 10, power: 80, effect: { type: "status_random", conditions: ["BRN", "PAR", "FRZ"], chance: 0.2 } }, // Special
                    { name: "Jump Kick", type: "Fighting", accuracy: 95, maxPp: 10, power: 100 }, // Crash damage if miss (niet geïmplementeerd)
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/85.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/85.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 86,
                name: "SEEL",
                types: ["Water"],
                hp: 135,
                baseStats: { attack: 45, defense: 55, speed: 45 }, // Sp. Def 70
                moves: [
                    { name: "Headbutt", type: "Normal", accuracy: 100, maxPp: 15, power: 70, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Icy Wind", type: "Ice", accuracy: 95, maxPp: 15, power: 55, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1 } }, // Special
                    { name: "Aurora Beam", type: "Ice", accuracy: 100, maxPp: 20, power: 65, effect: {type: "stat", stat: "attack", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Aqua Jet", type: "Water", accuracy: 100, maxPp: 20, power: 40, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/86.png",
                evolvesToPokedexId: 87
            },
            {
                pokedexId: 87,
                name: "DEWGONG",
                types: ["Water", "Ice"],
                hp: 160,
                baseStats: { attack: 70, defense: 80, speed: 70 }, // Sp. Def 95
                moves: [
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Surf", type: "Water", accuracy: 100, maxPp: 15, power: 90 }, // Special
                    { name: "Rest", type: "Psychic", accuracy: 100, maxPp: 10, power: 0 }, // Heals, SLP 2 turns (niet geïmplementeerd)
                    { name: "Signal Beam", type: "Bug", accuracy: 100, maxPp: 15, power: 75, effect: { type: "confusion", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/87.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/87.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 88,
                name: "GRIMER",
                types: ["Poison"],
                hp: 150,
                baseStats: { attack: 80, defense: 50, speed: 25 },
                moves: [
                    { name: "Pound", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Sludge", type: "Poison", accuracy: 100, maxPp: 20, power: 65, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Minimize", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "stat", stat: "evasion", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Disable", type: "Normal", accuracy: 100, maxPp: 20, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/88.png",
                evolvesToPokedexId: 89
            },
            {
                pokedexId: 89,
                name: "MUK",
                types: ["Poison"],
                hp: 175,
                baseStats: { attack: 105, defense: 75, speed: 50 }, // Sp. Def 100
                moves: [
                    { name: "Gunk Shot", type: "Poison", accuracy: 80, maxPp: 5, power: 120, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Shadow Sneak", type: "Ghost", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Acid Armor", type: "Poison", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/89.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/89.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 90,
                name: "SHELLDER",
                types: ["Water"],
                hp: 100,
                baseStats: { attack: 65, defense: 100, speed: 40 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 }, // Special
                    { name: "Withdraw", type: "Water", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Clamp", type: "Water", accuracy: 85, maxPp: 15, power: 35 } // Traps target (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/90.png",
                evolvesToPokedexId: 91 // Evolueert met Water Stone
            },
            {
                pokedexId: 91,
                name: "CLOYSTER",
                types: ["Water", "Ice"],
                hp: 120,
                baseStats: { attack: 95, defense: 180, speed: 70 },
                moves: [
                    { name: "Icicle Spear", type: "Ice", accuracy: 100, maxPp: 30, power: 25 }, // Hits 2-5 times
                    { name: "Shell Smash", type: "Normal", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: ["attack", "attack", "speed", "defense", "defense"], target: "self", stages: [2, 2, 2, -1, -1] }, alwaysHits: true }, // Atk, SpA, Spe up; Def, SpD down
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Spikes", type: "Ground", accuracy: 100, maxPp: 20, power: 0 } // Entry hazard (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/91.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/91.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 92,
                name: "GASTLY",
                types: ["Ghost", "Poison"],
                hp: 100,
                baseStats: { attack: 35, defense: 30, speed: 80 }, // Sp. Atk 100
                moves: [
                    { name: "Lick", type: "Ghost", accuracy: 100, maxPp: 30, power: 30, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Hypnosis", type: "Psychic", accuracy: 60, maxPp: 20, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Spite", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 }, // Reduces PP (niet geïmplementeerd)
                    { name: "Night Shade", type: "Ghost", accuracy: 100, maxPp: 15, power: GAME_LEVEL } // Damage = user's level (fixed for now)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/92.png",
                evolvesToPokedexId: 93
            },
            {
                pokedexId: 93,
                name: "HAUNTER",
                types: ["Ghost", "Poison"],
                hp: 115,
                baseStats: { attack: 50, defense: 45, speed: 95 }, // Sp. Atk 115
                moves: [
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }, // Special, Sp. Def
                    { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Confuse Ray", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 },
                    { name: "Dream Eater", type: "Psychic", accuracy: 100, maxPp: 15, power: 100, effect: { type: "heal", percentage: 0.5, target: "self"} } // Only if target SLP (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/93.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/93.png",
                evolvesToPokedexId: 94 // Evolueert via trade
            },
            {
                pokedexId: 94,
                name: "GENGAR",
                types: ["Ghost", "Poison"],
                hp: 130,
                baseStats: { attack: 65, defense: 60, speed: 110 }, // Sp. Atk 130
                moves: [
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }, // Special, Sp. Def
                    { name: "Sludge Wave", type: "Poison", accuracy: 100, maxPp: 10, power: 95, effect: { type: "status", condition: "PSN", chance: 0.1 } }, // Special
                    { name: "Focus Blast", type: "Fighting", accuracy: 70, maxPp: 5, power: 120, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Destiny Bond", type: "Ghost", accuracy: 100, maxPp: 5, power: 0 } // If user faints, target faints (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/94.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 95,
                name: "ONIX",
                types: ["Rock", "Ground"],
                hp: 105, // Relatief lage HP ondanks uiterlijk
                baseStats: { attack: 45, defense: 160, speed: 70 },
                moves: [
                    { name: "Rock Throw", type: "Rock", accuracy: 90, maxPp: 15, power: 50 },
                    { name: "Bind", type: "Normal", accuracy: 85, maxPp: 20, power: 15 }, // Traps
                    { name: "Screech", type: "Normal", accuracy: 85, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Iron Tail", type: "Steel", accuracy: 75, maxPp: 15, power: 100, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/95.png",
                evolvesToPokedexId: 208 // Steelix (Gen 2), evolueert via trade met Metal Coat
            },
            {
                pokedexId: 96,
                name: "DROWZEE",
                types: ["Psychic"],
                hp: 130,
                baseStats: { attack: 48, defense: 45, speed: 42 }, // Sp. Def 90
                moves: [
                    { name: "Pound", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Hypnosis", type: "Psychic", accuracy: 60, maxPp: 20, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Disable", type: "Normal", accuracy: 100, maxPp: 20, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/96.png",
                evolvesToPokedexId: 97
            },
            {
                pokedexId: 97,
                name: "HYPNO",
                types: ["Psychic"],
                hp: 155,
                baseStats: { attack: 73, defense: 70, speed: 67 }, // Sp. Def 115
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Dream Eater", type: "Psychic", accuracy: 100, maxPp: 15, power: 100, effect: { type: "heal", percentage: 0.5, target: "self"} }, // Special
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }, // Sp. Atk
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } } // Special, Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/97.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/97.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 98,
                name: "KRABBY",
                types: ["Water"],
                hp: 100,
                baseStats: { attack: 105, defense: 90, speed: 50 },
                moves: [
                    { name: "Bubble", type: "Water", accuracy: 100, maxPp: 30, power: 40, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Vice Grip", type: "Normal", accuracy: 100, maxPp: 30, power: 55 },
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Crabhammer", type: "Water", accuracy: 90, maxPp: 10, power: 100, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/98.png",
                evolvesToPokedexId: 99
            },
            {
                pokedexId: 99,
                name: "KINGLER",
                types: ["Water"],
                hp: 125,
                baseStats: { attack: 130, defense: 115, speed: 75 },
                moves: [
                    { name: "Crabhammer", type: "Water", accuracy: 90, maxPp: 10, power: 100, highCritRatio: true },
                    { name: "Guillotine", type: "Normal", accuracy: 30, maxPp: 5, power: 1000 }, // OHKO (niet geïmplementeerd als zodanig)
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Rock Smash", type: "Fighting", accuracy: 100, maxPp: 15, power: 40, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.5 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/99.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/99.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 100,
                name: "VOLTORB",
                types: ["Electric"],
                hp: 110,
                baseStats: { attack: 30, defense: 50, speed: 100 }, // Sp. Atk 55
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Thunder Shock", type: "Electric", accuracy: 100, maxPp: 30, power: 40, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Screech", type: "Normal", accuracy: 85, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Spark", type: "Electric", accuracy: 100, maxPp: 20, power: 65, effect: { type: "status", condition: "PAR", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/100.png",
                evolvesToPokedexId: 101
            },
 {
                pokedexId: 101,
                name: "ELECTRODE",
                types: ["Electric"],
                hp: 130,
                baseStats: { attack: 50, defense: 70, speed: 150 }, // Sp. Atk 80
                moves: [
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Explosion", type: "Normal", accuracy: 100, maxPp: 5, power: 250 }, // User faints
                    { name: "Light Screen", type: "Psychic", accuracy: 100, maxPp: 30, power: 0 }, // Halves Special damage (niet geïmplementeerd)
                    { name: "Mirror Coat", type: "Psychic", accuracy: 100, maxPp: 20, power: 1, priority: -5 } // Deals 2x Special damage taken (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/101.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/101.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 102,
                name: "EXEGGCUTE",
                types: ["Grass", "Psychic"],
                hp: 130,
                baseStats: { attack: 40, defense: 80, speed: 40 }, // Sp. Atk 60
                moves: [
                    { name: "Barrage", type: "Normal", accuracy: 85, maxPp: 20, power: 15 }, // Hits 2-5 times
                    { name: "Hypnosis", type: "Psychic", accuracy: 60, maxPp: 20, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Leech Seed", type: "Grass", accuracy: 90, maxPp: 10, power: 0 }, // Drains HP (niet geïmplementeerd)
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/102.png",
                evolvesToPokedexId: 103 // Evolueert met Leaf Stone
            },
            {
                pokedexId: 103,
                name: "EXEGGUTOR",
                types: ["Grass", "Psychic"],
                hp: 165,
                baseStats: { attack: 95, defense: 85, speed: 55 }, // Sp. Atk 125
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Leaf Storm", type: "Grass", accuracy: 90, maxPp: 5, power: 130, effect: { type: "stat", stat: "attack", target: "self", stages: -2 } }, // Special, Sp. Atk
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Egg Bomb", type: "Normal", accuracy: 75, maxPp: 10, power: 100 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/103.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/103.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 104,
                name: "CUBONE",
                types: ["Ground"],
                hp: 120,
                baseStats: { attack: 50, defense: 95, speed: 35 },
                moves: [
                    { name: "Bone Club", type: "Ground", accuracy: 85, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.1 } },
                    { name: "Headbutt", type: "Normal", accuracy: 100, maxPp: 15, power: 70, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Focus Energy", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "focus_energy" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/104.png",
                evolvesToPokedexId: 105
            },
            {
                pokedexId: 105,
                name: "MAROWAK",
                types: ["Ground"],
                hp: 130,
                baseStats: { attack: 80, defense: 110, speed: 45 },
                moves: [
                    { name: "Bonemerang", type: "Ground", accuracy: 90, maxPp: 10, power: 50 }, // Hits twice
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/105.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/105.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 106,
                name: "HITMONLEE",
                types: ["Fighting"],
                hp: 120,
                baseStats: { attack: 120, defense: 53, speed: 87 },
                moves: [
                    { name: "High Jump Kick", type: "Fighting", accuracy: 90, maxPp: 10, power: 130 }, // Crash damage
                    { name: "Blaze Kick", type: "Fire", accuracy: 90, maxPp: 10, power: 85, highCritRatio: true, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Meditate", type: "Psychic", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Brick Break", type: "Fighting", accuracy: 100, maxPp: 15, power: 75 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/106.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/106.png",
                evolvesToPokedexId: null // Tyrogue (236) is de pre-evolutie
            },
            {
                pokedexId: 107,
                name: "HITMONCHAN",
                types: ["Fighting"],
                hp: 120,
                baseStats: { attack: 105, defense: 79, speed: 76 },
                moves: [
                    { name: "Mach Punch", type: "Fighting", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Ice Punch", type: "Ice", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "FRZ", chance: 0.1 } },
                    { name: "Thunder Punch", type: "Electric", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Fire Punch", type: "Fire", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "BRN", chance: 0.1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/107.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/107.png",
                evolvesToPokedexId: null // Tyrogue (236) is de pre-evolutie
            },
            {
                pokedexId: 108,
                name: "LICKITUNG",
                types: ["Normal"],
                hp: 160,
                baseStats: { attack: 55, defense: 75, speed: 30 },
                moves: [
                    { name: "Lick", type: "Ghost", accuracy: 100, maxPp: 30, power: 30, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Stomp", type: "Normal", accuracy: 100, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Wrap", type: "Normal", accuracy: 90, maxPp: 20, power: 15 },
                    { name: "Slam", type: "Normal", accuracy: 75, maxPp: 20, power: 80 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/108.png",
                evolvesToPokedexId: 463 // Lickilicky (Gen 4)
            },
            {
                pokedexId: 109,
                name: "KOFFING",
                types: ["Poison"],
                hp: 110,
                baseStats: { attack: 65, defense: 95, speed: 35 },
                moves: [
                    { name: "Poison Gas", type: "Poison", accuracy: 90, maxPp: 40, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } },
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Sludge", type: "Poison", accuracy: 100, maxPp: 20, power: 65, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Smokescreen", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/109.png",
                evolvesToPokedexId: 110
            },
            {
                pokedexId: 110,
                name: "WEEZING",
                types: ["Poison"],
                hp: 135,
                baseStats: { attack: 90, defense: 120, speed: 60 },
                moves: [
                    { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special
                    { name: "Will-O-Wisp", type: "Fire", accuracy: 85, maxPp: 15, power: 0, effect: { type: "status", condition: "BRN", chance: 1 } },
                    { name: "Explosion", type: "Normal", accuracy: 100, maxPp: 5, power: 250 },
                    { name: "Toxic", type: "Poison", accuracy: 90, maxPp: 10, power: 0 } // Badly poisons (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/110.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/110.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 111,
                name: "RHYHORN",
                types: ["Rock", "Ground"],
                hp: 150,
                baseStats: { attack: 85, defense: 95, speed: 25 },
                moves: [
                    { name: "Horn Attack", type: "Normal", accuracy: 100, maxPp: 25, power: 65 },
                    { name: "Stomp", type: "Normal", accuracy: 100, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Rock Blast", type: "Rock", accuracy: 90, maxPp: 10, power: 25 },
                    { name: "Take Down", type: "Normal", accuracy: 85, maxPp: 20, power: 90 } // Recoil
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/111.png",
                evolvesToPokedexId: 112
            },
            {
                pokedexId: 112,
                name: "RHYDON",
                types: ["Rock", "Ground"],
                hp: 175,
                baseStats: { attack: 130, defense: 120, speed: 40 },
                moves: [
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Megahorn", type: "Bug", accuracy: 85, maxPp: 10, power: 120 },
                    { name: "Hammer Arm", type: "Fighting", accuracy: 90, maxPp: 10, power: 100, effect: { type: "stat", stat: "speed", target: "self", stages: -1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/112.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/112.png",
                evolvesToPokedexId: 464 // Rhyperior (Gen 4), evolueert via trade met Protector
            },
            {
                pokedexId: 113,
                name: "CHANSEY",
                types: ["Normal"],
                hp: 320, // Extreem hoge HP
                baseStats: { attack: 5, defense: 5, speed: 50 }, // Sp. Def 105
                moves: [
                    { name: "Soft-Boiled", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Egg Bomb", type: "Normal", accuracy: 75, maxPp: 10, power: 100 },
                    { name: "Minimize", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "stat", stat: "evasion", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Sing", type: "Normal", accuracy: 55, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/113.png",
                evolvesToPokedexId: 242 // Blissey (Gen 2), evolueert via friendship
            },
            {
                pokedexId: 114,
                name: "TANGELA",
                types: ["Grass"],
                hp: 135,
                baseStats: { attack: 55, defense: 115, speed: 60 }, // Sp. Atk 100
                moves: [
                    { name: "Vine Whip", type: "Grass", accuracy: 100, maxPp: 25, power: 45 },
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Giga Drain", type: "Grass", accuracy: 100, maxPp: 10, power: 75, effect: {type: "heal", percentage: 0.5, target: "self"} }, // Special
                    { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/114.png",
                evolvesToPokedexId: 465 // Tangrowth (Gen 4), evolueert na leren Ancient Power
            },
            {
                pokedexId: 115,
                name: "KANGASKHAN",
                types: ["Normal"],
                hp: 175,
                baseStats: { attack: 95, defense: 80, speed: 90 },
                moves: [
                    { name: "Dizzy Punch", type: "Normal", accuracy: 100, maxPp: 10, power: 70, effect: { type: "confusion", chance: 0.2 } },
                    { name: "Mega Punch", type: "Normal", accuracy: 85, maxPp: 20, power: 80 },
                    { name: "Fake Out", type: "Normal", accuracy: 100, maxPp: 10, power: 40, priority: 3, effect: { type: "flinch", chance: 1 } },
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/115.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/115.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 116,
                name: "HORSEA",
                types: ["Water"],
                hp: 100,
                baseStats: { attack: 40, defense: 70, speed: 60 }, // Sp. Atk 70
                moves: [
                    { name: "Bubble", type: "Water", accuracy: 100, maxPp: 30, power: 40, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Smokescreen", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 }, // Special
                    { name: "Twister", type: "Dragon", accuracy: 100, maxPp: 20, power: 40, effect: { type: "flinch", chance: 0.2 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/116.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/116.png",
                evolvesToPokedexId: 117
            },
            {
                pokedexId: 117,
                name: "SEADRA",
                types: ["Water"],
                hp: 125,
                baseStats: { attack: 65, defense: 95, speed: 85 }, // Sp. Atk 95
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Dragon Pulse", type: "Dragon", accuracy: 100, maxPp: 10, power: 85 }, // Special
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Brine", type: "Water", accuracy: 100, maxPp: 10, power: 65 } // Power doubles if target HP is half or less (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/117.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/117.png",
                evolvesToPokedexId: 230 // Kingdra (Gen 2), evolueert via trade met Dragon Scale
            },
            {
                pokedexId: 118,
                name: "GOLDEEN",
                types: ["Water"],
                hp: 115,
                baseStats: { attack: 67, defense: 60, speed: 63 },
                moves: [
                    { name: "Peck", type: "Flying", accuracy: 100, maxPp: 35, power: 35 },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Water Pulse", type: "Water", accuracy: 100, maxPp: 20, power: 60, effect: { type: "confusion", chance: 0.2 } }, // Special
                    { name: "Horn Attack", type: "Normal", accuracy: 100, maxPp: 25, power: 65 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/118.png",
                evolvesToPokedexId: 119
            },
            {
                pokedexId: 119,
                name: "SEAKING",
                types: ["Water"],
                hp: 150,
                baseStats: { attack: 92, defense: 65, speed: 68 },
                moves: [
                    { name: "Waterfall", type: "Water", accuracy: 100, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } },
                    { name: "Megahorn", type: "Bug", accuracy: 85, maxPp: 10, power: 120 },
                    { name: "Aqua Ring", type: "Water", accuracy: 100, maxPp: 20, power: 0 }, // Heals a bit each turn (niet geïmplementeerd)
                    { name: "Drill Run", type: "Ground", accuracy: 95, maxPp: 10, power: 80, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/119.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/119.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 120,
                name: "STARYU",
                types: ["Water"],
                hp: 100,
                baseStats: { attack: 45, defense: 55, speed: 85 }, // Sp. Atk 70
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 }, // Special
                    { name: "Harden", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Rapid Spin", type: "Normal", accuracy: 100, maxPp: 40, power: 50 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/120.png",
                evolvesToPokedexId: 121 // Evolueert met Water Stone
            },
            {
                pokedexId: 121,
                name: "STARMIE",
                types: ["Water", "Psychic"],
                hp: 130,
                baseStats: { attack: 75, defense: 85, speed: 115 }, // Sp. Atk 100
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/121.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/121.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 122,
                name: "MR. MIME",
                types: ["Psychic", "Fairy"],
                hp: 110,
                baseStats: { attack: 45, defense: 65, speed: 90 }, // Sp. Atk 100, Sp. Def 120
                moves: [
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Barrier", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Light Screen", type: "Psychic", accuracy: 100, maxPp: 30, power: 0 },
                    { name: "Reflect", type: "Psychic", accuracy: 100, maxPp: 20, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/122.png",
                evolvesToPokedexId: null // Mime Jr. (439) is pre-evolutie
            },
            {
                pokedexId: 123,
                name: "SCYTHER",
                types: ["Bug", "Flying"],
                hp: 140,
                baseStats: { attack: 110, defense: 80, speed: 105 },
                moves: [
                    { name: "Wing Attack", type: "Flying", accuracy: 100, maxPp: 35, power: 60 },
                    { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "X-Scissor", type: "Bug", accuracy: 100, maxPp: 15, power: 80 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/123.png",
                evolvesToPokedexId: 212 // Scizor (Gen 2), evolueert via trade met Metal Coat
            },
            {
                pokedexId: 124,
                name: "JYNX",
                types: ["Ice", "Psychic"],
                hp: 135,
                baseStats: { attack: 50, defense: 35, speed: 95 }, // Sp. Atk 115
                moves: [
                    { name: "Ice Punch", type: "Ice", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Lovely Kiss", type: "Normal", accuracy: 75, maxPp: 10, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Blizzard", type: "Ice", accuracy: 70, maxPp: 5, power: 110, effect: { type: "status", condition: "FRZ", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/124.png",
                evolvesToPokedexId: null // Smoochum (238) is pre-evolutie
            },
            {
                pokedexId: 125,
                name: "ELECTABUZZ",
                types: ["Electric"],
                hp: 135,
                baseStats: { attack: 83, defense: 57, speed: 105 }, // Sp. Atk 95
                moves: [
                    { name: "Thunder Punch", type: "Electric", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Light Screen", type: "Psychic", accuracy: 100, maxPp: 30, power: 0 },
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Low Kick", type: "Fighting", accuracy: 100, maxPp: 20, power: 60 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/125.png",
                evolvesToPokedexId: 466 // Electivire (Gen 4), evolueert via trade met Electirizer
            },
            {
                pokedexId: 126,
                name: "MAGMAR",
                types: ["Fire"],
                hp: 135,
                baseStats: { attack: 95, defense: 57, speed: 93 }, // Sp. Atk 100
                moves: [
                    { name: "Fire Punch", type: "Fire", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Confuse Ray", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 },
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special
                    { name: "Sunny Day", type: "Fire", accuracy: 100, maxPp: 5, power: 0 } // Weather (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/126.png",
                evolvesToPokedexId: 467 // Magmortar (Gen 4), evolueert via trade met Magmarizer
            },
            {
                pokedexId: 127,
                name: "PINSIR",
                types: ["Bug"],
                hp: 135,
                baseStats: { attack: 125, defense: 100, speed: 85 },
                moves: [
                    { name: "Vice Grip", type: "Normal", accuracy: 100, maxPp: 30, power: 55 },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "X-Scissor", type: "Bug", accuracy: 100, maxPp: 15, power: 80 },
                    { name: "Submission", type: "Fighting", accuracy: 80, maxPp: 20, power: 80 } // Recoil
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/127.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 128,
                name: "TAUROS",
                types: ["Normal"],
                hp: 145,
                baseStats: { attack: 100, defense: 95, speed: 110 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Stomp", type: "Normal", accuracy: 100, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Thrash", type: "Normal", accuracy: 100, maxPp: 10, power: 120 },
                    { name: "Zen Headbutt", type: "Psychic", accuracy: 90, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/128.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 129,
                name: "MAGIKARP",
                types: ["Water"],
                hp: 90,
                baseStats: { attack: 10, defense: 55, speed: 80 },
                moves: [
                    { name: "Splash", type: "Normal", accuracy: 100, maxPp: 40, power: 0 },
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 } // Leert Tackle via level up
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/129.png",
                evolvesToPokedexId: 130
            },
            {
                pokedexId: 130,
                name: "GYARADOS",
                types: ["Water", "Flying"],
                hp: 165,
                baseStats: { attack: 125, defense: 79, speed: 81 },
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Dragon Dance", type: "Dragon", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "speed"], target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Ice Fang", type: "Ice", accuracy: 95, maxPp: 15, power: 65, effect: { type: "flinch_or_status", condition: "FRZ", chance: 0.1, flinchChance: 0.1 } },
                    { name: "Thrash", type: "Normal", accuracy: 100, maxPp: 10, power: 120 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/130.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 131,
                name: "LAPRAS",
                types: ["Water", "Ice"],
                hp: 200, // Hoge HP
                baseStats: { attack: 85, defense: 80, speed: 60 }, // Sp. Atk 85, Sp. Def 95
                moves: [
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Surf", type: "Water", accuracy: 100, maxPp: 15, power: 90 }, // Special
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Sing", type: "Normal", accuracy: 55, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/131.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 132,
                name: "DITTO",
                types: ["Normal"],
                hp: 118,
                baseStats: { attack: 48, defense: 48, speed: 48 },
                moves: [
                    { name: "Transform", type: "Normal", accuracy: 100, maxPp: 10, power: 0 } // Transformeert (complex om te implementeren)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 133,
                name: "EEVEE",
                types: ["Normal"],
                hp: 125,
                baseStats: { attack: 55, defense: 50, speed: 55 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Sand Attack", type: "Ground", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/133.png",
                evolvesToPokedexId: null // Meerdere evoluties via stenen/condities
            },
            {
                pokedexId: 134,
                name: "VAPOREON",
                types: ["Water"],
                hp: 200,
                baseStats: { attack: 65, defense: 60, speed: 65 }, // Sp. Atk 110
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Acid Armor", type: "Poison", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Wish", type: "Normal", accuracy: 100, maxPp: 10, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/134.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 135,
                name: "JOLTEON",
                types: ["Electric"],
                hp: 135,
                baseStats: { attack: 65, defense: 60, speed: 130 }, // Sp. Atk 110
                moves: [
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }, // Special, Sp. Def
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Pin Missile", type: "Bug", accuracy: 95, maxPp: 20, power: 25 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/135.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 136,
                name: "FLAREON",
                types: ["Fire"],
                hp: 135,
                baseStats: { attack: 130, defense: 60, speed: 65 }, // Sp. Atk 95
                moves: [
                    { name: "Flare Blitz", type: "Fire", accuracy: 100, maxPp: 15, power: 120, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Recoil
                    { name: "Superpower", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: -1 } },
                    { name: "Fire Fang", type: "Fire", accuracy: 95, maxPp: 15, power: 65, effect: { type: "flinch_or_status", condition: "BRN", chance: 0.1, flinchChance: 0.1 } },
                    { name: "Will-O-Wisp", type: "Fire", accuracy: 85, maxPp: 15, power: 0, effect: { type: "status", condition: "BRN", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/136.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 137,
                name: "PORYGON",
                types: ["Normal"],
                hp: 135,
                baseStats: { attack: 60, defense: 70, speed: 40 }, // Sp. Atk 85
                moves: [
                    { name: "Tri Attack", type: "Normal", accuracy: 100, maxPp: 10, power: 80, effect: { type: "status_random", conditions: ["BRN", "PAR", "FRZ"], chance: 0.2 } }, // Special
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Conversion", type: "Normal", accuracy: 100, maxPp: 30, power: 0 } // Changes type (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/137.png",
                evolvesToPokedexId: 233 // Porygon2 (Gen 2), evolueert via trade met Up-Grade
            },
            {
                pokedexId: 138,
                name: "OMANYTE",
                types: ["Rock", "Water"],
                hp: 105,
                baseStats: { attack: 40, defense: 100, speed: 35 }, // Sp. Atk 90
                moves: [
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 }, // Special
                    { name: "Rock Throw", type: "Rock", accuracy: 90, maxPp: 15, power: 50 },
                    { name: "Withdraw", type: "Water", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/138.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/138.png",
                evolvesToPokedexId: 139
            },
            {
                pokedexId: 139,
                name: "OMASTAR",
                types: ["Rock", "Water"],
                hp: 140,
                baseStats: { attack: 60, defense: 125, speed: 55 }, // Sp. Atk 115
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } }, // Special
                    { name: "Shell Smash", type: "Normal", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: ["attack", "attack", "speed", "defense", "defense"], target: "self", stages: [2, 2, 2, -1, -1] }, alwaysHits: true },
                    { name: "Spike Cannon", type: "Normal", accuracy: 100, maxPp: 15, power: 20 } // Hits 2-5 times
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/139.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/139.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 140,
                name: "KABUTO",
                types: ["Rock", "Water"],
                hp: 100,
                baseStats: { attack: 80, defense: 90, speed: 55 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Harden", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Aqua Jet", type: "Water", accuracy: 100, maxPp: 20, power: 40, priority: 1 },
                    { name: "Rock Throw", type: "Rock", accuracy: 90, maxPp: 15, power: 50 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/140.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/140.png",
                evolvesToPokedexId: 141
            },
            {
                pokedexId: 141,
                name: "KABUTOPS",
                types: ["Rock", "Water"],
                hp: 130,
                baseStats: { attack: 115, defense: 105, speed: 80 },
                moves: [
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Aqua Jet", type: "Water", accuracy: 100, maxPp: 20, power: 40, priority: 1 },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Night Slash", type: "Dark", accuracy: 100, maxPp: 15, power: 70, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/141.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/141.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 142,
                name: "AERODACTYL",
                types: ["Rock", "Flying"],
                hp: 150,
                baseStats: { attack: 105, defense: 65, speed: 130 },
                moves: [
                    { name: "Wing Attack", type: "Flying", accuracy: 100, maxPp: 35, power: 60 },
                    { name: "Rock Slide", type: "Rock", accuracy: 90, maxPp: 10, power: 75, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/142.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 143,
                name: "SNORLAX",
                types: ["Normal"],
                hp: 230, // Zeer hoge HP
                baseStats: { attack: 110, defense: 65, speed: 30 }, // Sp. Def 110
                moves: [
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Rest", type: "Psychic", accuracy: 100, maxPp: 10, power: 0 },
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/143.png",
                evolvesToPokedexId: null // Munchlax (446) is pre-evolutie
            },
            {
                pokedexId: 144,
                name: "ARTICUNO",
                types: ["Ice", "Flying"],
                hp: 160,
                baseStats: { attack: 85, defense: 100, speed: 85 }, // Sp. Atk 95, Sp. Def 125
                moves: [
                    { name: "Blizzard", type: "Ice", accuracy: 70, maxPp: 5, power: 110, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Hurricane", type: "Flying", accuracy: 70, maxPp: 10, power: 110, effect: { type: "confusion", chance: 0.3 } }, // Special
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Ice Shard", type: "Ice", accuracy: 100, maxPp: 30, power: 40, priority: 1 } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/144.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 145,
                name: "ZAPDOS",
                types: ["Electric", "Flying"],
                hp: 160,
                baseStats: { attack: 90, defense: 85, speed: 100 }, // Sp. Atk 125
                moves: [
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Drill Peck", type: "Flying", accuracy: 100, maxPp: 20, power: 80 },
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Heat Wave", type: "Fire", accuracy: 90, maxPp: 10, power: 95, effect: { type: "status", condition: "BRN", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/145.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 146,
                name: "MOLTRES",
                types: ["Fire", "Flying"],
                hp: 160,
                baseStats: { attack: 100, defense: 90, speed: 90 }, // Sp. Atk 125
                moves: [
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/146.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 147,
                name: "DRATINI",
                types: ["Dragon"],
                hp: 111,
                baseStats: { attack: 64, defense: 45, speed: 50 },
                moves: [
                    { name: "Wrap", type: "Normal", accuracy: 90, maxPp: 20, power: 15 },
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Thunder Wave", type: "Electric", accuracy: 90, maxPp: 20, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } },
                    { name: "Dragon Rage", type: "Dragon", accuracy: 100, maxPp: 10, power: 40 } // Fixed damage (niet geïmplementeerd als zodanig)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/147.png",
                evolvesToPokedexId: 148
            },
            {
                pokedexId: 148,
                name: "DRAGONAIR",
                types: ["Dragon"],
                hp: 131,
                baseStats: { attack: 84, defense: 65, speed: 70 },
                moves: [
                    { name: "Dragon Tail", type: "Dragon", accuracy: 90, maxPp: 10, power: 60 }, // Forces switch
                    { name: "Slam", type: "Normal", accuracy: 75, maxPp: 20, power: 80 },
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Dragon Pulse", type: "Dragon", accuracy: 100, maxPp: 10, power: 85 } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/148.png",
                evolvesToPokedexId: 149
            },
            {
                pokedexId: 149,
                name: "DRAGONITE",
                types: ["Dragon", "Flying"],
                hp: 161,
                baseStats: { attack: 134, defense: 95, speed: 80 }, // Sp. Atk 100
                moves: [
                    { name: "Outrage", type: "Dragon", accuracy: 100, maxPp: 10, power: 120 }, // Locks user, confuses
                    { name: "Hurricane", type: "Flying", accuracy: 70, maxPp: 10, power: 110, effect: { type: "confusion", chance: 0.3 } }, // Special
                    { name: "Dragon Dance", type: "Dragon", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "speed"], target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Fire Punch", type: "Fire", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "BRN", chance: 0.1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/149.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 150,
                name: "MEWTWO",
                types: ["Psychic"],
                hp: 176, // Legendarisch
                baseStats: { attack: 110, defense: 90, speed: 130 }, // Sp. Atk 154
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Aura Sphere", type: "Fighting", accuracy: 100, maxPp: 20, power: 80, alwaysHits: true }, // Special
                    { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } } // Special, Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/150.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 151,
                name: "MEW",
                types: ["Psychic"],
                hp: 170, // Mythisch
                baseStats: { attack: 100, defense: 100, speed: 100 }, // All stats 100
                moves: [ // Mew kan veel leren, dit is een voorbeeld
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp. Def
                    { name: "Aura Sphere", type: "Fighting", accuracy: 100, maxPp: 20, power: 80, alwaysHits: true }, // Special
                    { name: "Transform", type: "Normal", accuracy: 100, maxPp: 10, power: 0 },
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true } // Sp. Atk
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/151.png",
                evolvesToPokedexId: null
            },
			// VOEG DEZE TOE AAN JE BESTAANDE pokemonPool ARRAY

// --- JOHTO POKEMON ---
            {
                pokedexId: 152, name: "CHIKORITA", types: ["Grass"], hp: 120, baseStats: { attack: 49, defense: 65, speed: 45 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Razor Leaf", type: "Grass", accuracy: 95, maxPp: 25, power: 55, highCritRatio: true },
                    { name: "Poison Powder", type: "Poison", accuracy: 75, maxPp: 35, power: 0, effect: { type: "status", condition: "PSN", chance: 1 } },
                    { name: "Synthesis", type: "Grass", accuracy: 100, maxPp: 5, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/152.png",
                evolvesToPokedexId: 153
            },
            {
                pokedexId: 153, name: "BAYLEEF", types: ["Grass"], hp: 135, baseStats: { attack: 62, defense: 80, speed: 60 },
                moves: [
                    { name: "Magical Leaf", type: "Grass", accuracy: 100, maxPp: 20, power: 60, alwaysHits: true }, // Special
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Light Screen", type: "Psychic", accuracy: 100, maxPp: 30, power: 0 }, // Vermindert Special Damage (niet volledig geïmplementeerd)
                    { name: "Reflect", type: "Psychic", accuracy: 100, maxPp: 20, power: 0 } // Vermindert Physical Damage (niet volledig geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/153.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/153.png",
                evolvesToPokedexId: 154
            },
            {
                pokedexId: 154, name: "MEGANIUM", types: ["Grass"], hp: 155, baseStats: { attack: 82, defense: 100, speed: 80 },
                moves: [
                    { name: "Petal Dance", type: "Grass", accuracy: 100, maxPp: 10, power: 120 }, // Special, locks user, confuses (niet volledig geïmplementeerd)
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Aromatherapy", type: "Grass", accuracy: 100, maxPp: 5, power: 0 }, // Heals status (niet volledig geïmplementeerd)
                    { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/154.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/154.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 155, name: "CYNDAQUIL", types: ["Fire"], hp: 115, baseStats: { attack: 52, defense: 43, speed: 65 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Smokescreen", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/155.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/155.png",
                evolvesToPokedexId: 156
            },
            {
                pokedexId: 156, name: "QUILAVA", types: ["Fire"], hp: 130, baseStats: { attack: 64, defense: 58, speed: 80 },
                moves: [
                    { name: "Flame Wheel", type: "Fire", accuracy: 100, maxPp: 25, power: 60, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Thaws user
                    { name: "Swift", type: "Normal", accuracy: 100, maxPp: 20, power: 60, alwaysHits: true }, // Special
                    { name: "Lava Plume", type: "Fire", accuracy: 100, maxPp: 15, power: 80, effect: { type: "status", condition: "BRN", chance: 0.3 } }, // Special
                    { name: "Defense Curl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/156.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/156.png",
                evolvesToPokedexId: 157
            },
            {
                pokedexId: 157, name: "TYPHLOSION", types: ["Fire"], hp: 150, baseStats: { attack: 84, defense: 78, speed: 100 },
                moves: [
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Eruption", type: "Fire", accuracy: 100, maxPp: 5, power: 150 }, // Special, power varies with HP (niet volledig geïmplementeerd)
                    { name: "Focus Blast", type: "Fighting", accuracy: 70, maxPp: 5, power: 120, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } } // Special, Sp. Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/157.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/157.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 158, name: "TOTODILE", types: ["Water"], hp: 120, baseStats: { attack: 65, defense: 64, speed: 43 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 },
                    { name: "Rage", type: "Normal", accuracy: 100, maxPp: 20, power: 20 }, // Attack raises if hit (niet geïmplementeerd)
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/158.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/158.png",
                evolvesToPokedexId: 159
            },
            {
                pokedexId: 159, name: "CROCONAW", types: ["Water"], hp: 135, baseStats: { attack: 80, defense: 80, speed: 58 },
                moves: [
                    { name: "Ice Fang", type: "Ice", accuracy: 95, maxPp: 15, power: 65, effect: { type: "flinch_or_status", condition: "FRZ", chance: 0.1, flinchChance: 0.1 } },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Aqua Jet", type: "Water", accuracy: 100, maxPp: 20, power: 40, priority: 1 },
                    { name: "Scary Face", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "stat", stat: "speed", target: "opponent", stages: -2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/159.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/159.png",
                evolvesToPokedexId: 160
            },
            {
                pokedexId: 160, name: "FERALIGATR", types: ["Water"], hp: 155, baseStats: { attack: 105, defense: 100, speed: 78 },
                moves: [
                    { name: "Waterfall", type: "Water", accuracy: 100, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } },
                    { name: "Dragon Dance", type: "Dragon", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "speed"], target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Superpower", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: -1 } },
                    { name: "Ice Punch", type: "Ice", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "FRZ", chance: 0.1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/160.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/160.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 161, name: "SENTRET", types: ["Normal"], hp: 105, baseStats: { attack: 46, defense: 34, speed: 20 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Defense Curl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Fury Swipes", type: "Normal", accuracy: 80, maxPp: 15, power: 18 } // Hits 2-5 times
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/161.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/161.png",
                evolvesToPokedexId: 162
            },
            {
                pokedexId: 162, name: "FURRET", types: ["Normal"], hp: 155, baseStats: { attack: 76, defense: 64, speed: 90 },
                moves: [
                    { name: "Slam", type: "Normal", accuracy: 75, maxPp: 20, power: 80 },
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Hyper Voice", type: "Normal", accuracy: 100, maxPp: 10, power: 90 }, // Special
                    { name: "Follow Me", type: "Normal", accuracy: 100, maxPp: 20, power: 0, priority: 2 } // Redirects attacks (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/162.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/162.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 163, name: "HOOTHOOT", types: ["Normal", "Flying"], hp: 130, baseStats: { attack: 30, defense: 30, speed: 50 }, // Sp.Atk 36, Sp.Def 56
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Peck", type: "Flying", accuracy: 100, maxPp: 35, power: 35 },
                    { name: "Hypnosis", type: "Psychic", accuracy: 60, maxPp: 20, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Reflect", type: "Psychic", accuracy: 100, maxPp: 20, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/163.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/163.png",
                evolvesToPokedexId: 164
            },
            {
                pokedexId: 164, name: "NOCTOWL", types: ["Normal", "Flying"], hp: 170, baseStats: { attack: 50, defense: 50, speed: 70 }, // Sp.Atk 86, Sp.Def 96
                moves: [
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Extrasensory", type: "Psychic", accuracy: 100, maxPp: 20, power: 80, effect: { type: "flinch", chance: 0.1 } }, // Special
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Moonblast", type: "Fairy", accuracy: 100, maxPp: 15, power: 95, effect: {type: "stat", stat: "attack", target: "opponent", stages: -1, chance: 0.3 } } // Special, Sp.Atk
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/164.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/164.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 165, name: "LEDYBA", types: ["Bug", "Flying"], hp: 110, baseStats: { attack: 20, defense: 30, speed: 55 }, // Sp.Def 80
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Supersonic", type: "Normal", accuracy: 55, maxPp: 20, power: 0 }, // Confuses (niet geïmplementeerd)
                    { name: "Comet Punch", type: "Normal", accuracy: 85, maxPp: 15, power: 18 }, // Hits 2-5 times
                    { name: "Light Screen", type: "Psychic", accuracy: 100, maxPp: 30, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/165.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/165.png",
                evolvesToPokedexId: 166
            },
            {
                pokedexId: 166, name: "LEDIAN", types: ["Bug", "Flying"], hp: 125, baseStats: { attack: 35, defense: 50, speed: 85 }, // Sp.Def 110
                moves: [
                    { name: "Bug Buzz", type: "Bug", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Mach Punch", type: "Fighting", accuracy: 100, maxPp: 30, power: 40, priority: 1 } // Geleerd via breeding/TM in main games
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/166.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/166.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 167, name: "SPINARAK", types: ["Bug", "Poison"], hp: 110, baseStats: { attack: 60, defense: 40, speed: 30 },
                moves: [
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "String Shot", type: "Bug", accuracy: 95, maxPp: 40, power: 0, effect: { type: "stat", stat: "speed", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Constrict", type: "Normal", accuracy: 100, maxPp: 35, power: 10, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } },
                    { name: "Leech Life", type: "Bug", accuracy: 100, maxPp: 10, power: 80, effect: { type: "heal", percentage: 0.5, target: "self"} }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/167.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/167.png",
                evolvesToPokedexId: 168
            },
            {
                pokedexId: 168, name: "ARIADOS", types: ["Bug", "Poison"], hp: 140, baseStats: { attack: 90, defense: 70, speed: 40 },
                moves: [
                    { name: "Poison Jab", type: "Poison", accuracy: 100, maxPp: 20, power: 80, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "X-Scissor", type: "Bug", accuracy: 100, maxPp: 15, power: 80 },
                    { name: "Sticky Web", type: "Bug", accuracy: 100, maxPp: 20, power: 0 }, // Entry hazard, lowers speed (niet geïmplementeerd)
                    { name: "Sucker Punch", type: "Dark", accuracy: 100, maxPp: 5, power: 70, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/168.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/168.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 169, name: "CROBAT", types: ["Poison", "Flying"], hp: 155, baseStats: { attack: 90, defense: 80, speed: 130 },
                moves: [
                    { name: "Cross Poison", type: "Poison", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true, effect: { type: "status", condition: "PSN", chance: 0.1 } },
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Brave Bird", type: "Flying", accuracy: 100, maxPp: 15, power: 120 }, // Recoil (niet geïmplementeerd)
                    { name: "Haze", type: "Ice", accuracy: 100, maxPp: 30, power: 0 } // Resets stats
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/169.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/169.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 170, name: "CHINCHOU", types: ["Water", "Electric"], hp: 145, baseStats: { attack: 38, defense: 38, speed: 67 }, // Sp.Atk 56, Sp.Def 56
                moves: [
                    { name: "Bubble", type: "Water", accuracy: 100, maxPp: 30, power: 40, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Thunder Wave", type: "Electric", accuracy: 90, maxPp: 20, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } },
                    { name: "Spark", type: "Electric", accuracy: 100, maxPp: 20, power: 65, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Confuse Ray", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/170.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/170.png",
                evolvesToPokedexId: 171
            },
            {
                pokedexId: 171, name: "LANTURN", types: ["Water", "Electric"], hp: 195, baseStats: { attack: 58, defense: 58, speed: 67 }, // Sp.Atk 76, Sp.Def 76
                moves: [
                    { name: "Discharge", type: "Electric", accuracy: 100, maxPp: 15, power: 80, effect: { type: "status", condition: "PAR", chance: 0.3 } }, // Special
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/171.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/171.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 172, name: "PICHU", types: ["Electric"], hp: 90, baseStats: { attack: 40, defense: 15, speed: 60 },
                moves: [
                    { name: "Thunder Shock", type: "Electric", accuracy: 100, maxPp: 30, power: 40, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Charm", type: "Fairy", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Nuzzle", type: "Electric", accuracy: 100, maxPp: 20, power: 20, effect: { type: "status", condition: "PAR", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/172.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/172.png",
                evolvesToPokedexId: 25 // Evolueert naar Pikachu (via friendship)
            },
            {
                pokedexId: 173, name: "CLEFFA", types: ["Fairy"], hp: 120, baseStats: { attack: 25, defense: 28, speed: 15 },
                moves: [
                    { name: "Pound", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Charm", type: "Fairy", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Sing", type: "Normal", accuracy: 55, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Magical Leaf", type: "Grass", accuracy: 100, maxPp: 20, power: 60, alwaysHits: true } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/173.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/173.png",
                evolvesToPokedexId: 35 // Evolueert naar Clefairy (via friendship)
            },
            {
                pokedexId: 174, name: "IGGLYBUFF", types: ["Normal", "Fairy"], hp: 160, baseStats: { attack: 30, defense: 15, speed: 15 },
                moves: [
                    { name: "Sing", type: "Normal", accuracy: 55, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Pound", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Defense Curl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Sweet Kiss", type: "Fairy", accuracy: 75, maxPp: 10, power: 0 } // Confuses (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/174.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/174.png",
                evolvesToPokedexId: 39 // Evolueert naar Jigglypuff (via friendship)
            },
            {
                pokedexId: 175, name: "TOGEPI", types: ["Fairy"], hp: 105, baseStats: { attack: 20, defense: 65, speed: 20 }, // Sp.Atk 40, Sp.Def 65
                moves: [
                    { name: "Growl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Charm", type: "Fairy", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Metronome", type: "Normal", accuracy: 100, maxPp: 10, power: 0 }, // Gebruikt random move (zeer complex)
                    { name: "Sweet Kiss", type: "Fairy", accuracy: 75, maxPp: 10, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/175.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/175.png",
                evolvesToPokedexId: 176 // Evolueert naar Togetic (via friendship)
            },
            {
                pokedexId: 176, name: "TOGETIC", types: ["Fairy", "Flying"], hp: 125, baseStats: { attack: 40, defense: 85, speed: 40 }, // Sp.Atk 80, Sp.Def 105
                moves: [
                    { name: "Dazzling Gleam", type: "Fairy", accuracy: 100, maxPp: 10, power: 80 }, // Special
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Wish", type: "Normal", accuracy: 100, maxPp: 10, power: 0 }, // Heals next turn
                    { name: "Yawn", type: "Normal", accuracy: 100, maxPp: 10, power: 0 } // Makes target sleepy
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/176.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/176.png",
                evolvesToPokedexId: 468 // Evolueert naar Togekiss (Gen 4, Shiny Stone)
            },
            {
                pokedexId: 177, name: "NATU", types: ["Psychic", "Flying"], hp: 110, baseStats: { attack: 50, defense: 45, speed: 70 },
                moves: [
                    { name: "Peck", type: "Flying", accuracy: 100, maxPp: 35, power: 35 },
                    { name: "Leer", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Night Shade", type: "Ghost", accuracy: 100, maxPp: 15, power: GAME_LEVEL },
                    { name: "Teleport", type: "Psychic", accuracy: 100, maxPp: 20, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/177.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/177.png",
                evolvesToPokedexId: 178
            },
            {
                pokedexId: 178, name: "XATU", types: ["Psychic", "Flying"], hp: 135, baseStats: { attack: 75, defense: 70, speed: 95 },
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Future Sight", type: "Psychic", accuracy: 100, maxPp: 10, power: 120 }, // Special, hits after 2 turns (niet geïmplementeerd)
                    { name: "Wish", type: "Normal", accuracy: 100, maxPp: 10, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/178.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/178.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 179, name: "MAREEP", types: ["Electric"], hp: 125, baseStats: { attack: 40, defense: 40, speed: 35 }, // Sp.Atk 65
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Thunder Shock", type: "Electric", accuracy: 100, maxPp: 30, power: 40, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Growl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Cotton Spore", type: "Grass", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "speed", target: "opponent", stages: -2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/179.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/179.png",
                evolvesToPokedexId: 180
            },
            {
                pokedexId: 180, name: "FLAAFFY", types: ["Electric"], hp: 140, baseStats: { attack: 55, defense: 55, speed: 45 }, // Sp.Atk 80
                moves: [
                    { name: "Thunder Punch", type: "Electric", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Discharge", type: "Electric", accuracy: 100, maxPp: 15, power: 80, effect: { type: "status", condition: "PAR", chance: 0.3 } }, // Special
                    { name: "Signal Beam", type: "Bug", accuracy: 100, maxPp: 15, power: 75, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Light Screen", type: "Psychic", accuracy: 100, maxPp: 30, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/180.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/180.png",
                evolvesToPokedexId: 181
            },
            {
                pokedexId: 181, name: "AMPHAROS", types: ["Electric"], hp: 160, baseStats: { attack: 75, defense: 85, speed: 55 }, // Sp.Atk 115
                moves: [
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Dragon Pulse", type: "Dragon", accuracy: 100, maxPp: 10, power: 85 }, // Special
                    { name: "Focus Blast", type: "Fighting", accuracy: 70, maxPp: 5, power: 120, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Power Gem", type: "Rock", accuracy: 100, maxPp: 20, power: 80 } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/181.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/181.png",
                evolvesToPokedexId: null // Mega Ampharos is Electric/Dragon
            },
            {
                pokedexId: 182, name: "BELLOSSOM", types: ["Grass"], hp: 145, baseStats: { attack: 80, defense: 95, speed: 50 }, // Sp.Atk 90
                moves: [
                    { name: "Petal Dance", type: "Grass", accuracy: 100, maxPp: 10, power: 120 }, // Special
                    { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special (geleerd via TM/TR)
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Giga Drain", type: "Grass", accuracy: 100, maxPp: 10, power: 75, effect: {type: "heal", percentage: 0.5, target: "self"} } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/182.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/182.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 183, name: "MARILL", types: ["Water", "Fairy"], hp: 140, baseStats: { attack: 20, defense: 50, speed: 40 }, // Sp.Atk 20
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 },
                    { name: "Rollout", type: "Rock", accuracy: 90, maxPp: 20, power: 30 }, // Power increases (niet geïmplementeerd)
                    { name: "Bubble Beam", type: "Water", accuracy: 100, maxPp: 20, power: 65, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/183.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/183.png",
                evolvesToPokedexId: 184
            },
            {
                pokedexId: 184, name: "AZUMARILL", types: ["Water", "Fairy"], hp: 170, baseStats: { attack: 50, defense: 80, speed: 50 }, // Sp.Atk 60, Huge Power verdubbelt Attack (niet geïmplementeerd)
                moves: [
                    { name: "Aqua Tail", type: "Water", accuracy: 90, maxPp: 10, power: 90 },
                    { name: "Play Rough", type: "Fairy", accuracy: 90, maxPp: 10, power: 90, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1, chance: 0.1 } },
                    { name: "Superpower", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: -1 } },
                    { name: "Ice Punch", type: "Ice", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "FRZ", chance: 0.1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/184.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/184.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 185, name: "SUDOWOODO", types: ["Rock"], hp: 140, baseStats: { attack: 100, defense: 115, speed: 30 },
                moves: [
                    { name: "Rock Throw", type: "Rock", accuracy: 90, maxPp: 15, power: 50 },
                    { name: "Low Kick", type: "Fighting", accuracy: 100, maxPp: 20, power: 60 },
                    { name: "Sucker Punch", type: "Dark", accuracy: 100, maxPp: 5, power: 70, priority: 1 },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/185.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/185.png",
                evolvesToPokedexId: null // Bonsly (438) is pre-evolutie
            },
            {
                pokedexId: 186, name: "POLITOED", types: ["Water"], hp: 160, baseStats: { attack: 75, defense: 75, speed: 70 }, // Sp.Atk 90
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Focus Blast", type: "Fighting", accuracy: 70, maxPp: 5, power: 120, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Hypnosis", type: "Psychic", accuracy: 60, maxPp: 20, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/186.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/186.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 187, name: "HOPPIP", types: ["Grass", "Flying"], hp: 105, baseStats: { attack: 35, defense: 40, speed: 50 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Synthesis", type: "Grass", accuracy: 100, maxPp: 5, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Stun Spore", type: "Grass", accuracy: 75, maxPp: 30, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/187.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/187.png",
                evolvesToPokedexId: 188
            },
            {
                pokedexId: 188, name: "SKIPLOOM", types: ["Grass", "Flying"], hp: 125, baseStats: { attack: 45, defense: 50, speed: 80 },
                moves: [
                    { name: "Bullet Seed", type: "Grass", accuracy: 100, maxPp: 30, power: 25 }, // Hits 2-5 times
                    { name: "Leech Seed", type: "Grass", accuracy: 90, maxPp: 10, power: 0 }, // Drains HP
                    { name: "U-turn", type: "Bug", accuracy: 100, maxPp: 20, power: 70 }, // Switches out (niet geïmplementeerd)
                    { name: "Acrobatics", type: "Flying", accuracy: 100, maxPp: 15, power: 55 } // Power doubles if no item (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/188.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/188.png",
                evolvesToPokedexId: 189
            },
            {
                pokedexId: 189, name: "JUMPLUFF", types: ["Grass", "Flying"], hp: 145, baseStats: { attack: 55, defense: 70, speed: 110 },
                moves: [
                    { name: "Seed Bomb", type: "Grass", accuracy: 100, maxPp: 15, power: 80 },
                    { name: "Acrobatics", type: "Flying", accuracy: 100, maxPp: 15, power: 55 },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Sleep Powder", type: "Grass", accuracy: 75, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/189.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/189.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 190, name: "AIPOM", types: ["Normal"], hp: 125, baseStats: { attack: 70, defense: 55, speed: 85 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Sand Attack", type: "Ground", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Fury Swipes", type: "Normal", accuracy: 80, maxPp: 15, power: 18 },
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true } // Sp.Atk
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/190.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/190.png",
                evolvesToPokedexId: 424 // Ambipom (Gen 4, na leren Double Hit)
            },
            {
                pokedexId: 191, name: "SUNKERN", types: ["Grass"], hp: 100, baseStats: { attack: 30, defense: 30, speed: 30 },
                moves: [
                    { name: "Absorb", type: "Grass", accuracy: 100, maxPp: 25, power: 20, effect: { type: "heal", percentage: 0.5, target: "self"} }, // Special
                    { name: "Growth", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 1 }, alwaysHits: true }, // Sp.Atk
                    { name: "Mega Drain", type: "Grass", accuracy: 100, maxPp: 15, power: 40, effect: { type: "heal", percentage: 0.5, target: "self"} }, // Special
                    { name: "Razor Leaf", type: "Grass", accuracy: 95, maxPp: 25, power: 55, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/191.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/191.png",
                evolvesToPokedexId: 192 // Evolueert met Sun Stone
            },
            {
                pokedexId: 192, name: "SUNFLORA", types: ["Grass"], hp: 145, baseStats: { attack: 75, defense: 55, speed: 30 }, // Sp.Atk 105
                moves: [
                    { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 }, // Special
                    { name: "Giga Drain", type: "Grass", accuracy: 100, maxPp: 10, power: 75, effect: {type: "heal", percentage: 0.5, target: "self"} }, // Special
                    { name: "Sludge Bomb", type: "Poison", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "PSN", chance: 0.3 } }, // Special (TM/TR)
                    { name: "Sunny Day", type: "Fire", accuracy: 100, maxPp: 5, power: 0 } // Weather
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/192.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/192.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 193, name: "YANMA", types: ["Bug", "Flying"], hp: 135, baseStats: { attack: 65, defense: 45, speed: 95 },
                moves: [
                    { name: "Wing Attack", type: "Flying", accuracy: 100, maxPp: 35, power: 60 },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Bug Buzz", type: "Bug", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/193.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/193.png",
                evolvesToPokedexId: 469 // Yanmega (Gen 4, na leren Ancient Power)
            },
            {
                pokedexId: 194, name: "WOOPER", types: ["Water", "Ground"], hp: 125, baseStats: { attack: 45, defense: 45, speed: 15 },
                moves: [
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Mud Shot", type: "Ground", accuracy: 95, maxPp: 15, power: 55, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1 } }, // Special
                    { name: "Slam", type: "Normal", accuracy: 75, maxPp: 20, power: 80 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/194.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/194.png",
                evolvesToPokedexId: 195
            },
            {
                pokedexId: 195, name: "QUAGSIRE", types: ["Water", "Ground"], hp: 165, baseStats: { attack: 85, defense: 85, speed: 35 },
                moves: [
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Waterfall", type: "Water", accuracy: 100, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } },
                    { name: "Amnesia", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true }, // Sp.Def
                    { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/195.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/195.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 196, name: "ESPEON", types: ["Psychic"], hp: 135, baseStats: { attack: 65, defense: 60, speed: 110 }, // Sp.Atk 130
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }, // Special, Sp.Def
                    { name: "Calm Mind", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true }, // Sp.Atk, Sp.Def
                    { name: "Morning Sun", type: "Normal", accuracy: 100, maxPp: 5, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/196.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 197, name: "UMBREON", types: ["Dark"], hp: 165, baseStats: { attack: 65, defense: 110, speed: 65 }, // Sp.Def 130
                moves: [
                    { name: "Foul Play", type: "Dark", accuracy: 100, maxPp: 15, power: 95 }, // Uses target's Attack stat (niet geïmplementeerd)
                    { name: "Toxic", type: "Poison", accuracy: 90, maxPp: 10, power: 0 }, // Badly poisons
                    { name: "Moonlight", type: "Fairy", accuracy: 100, maxPp: 5, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Protect", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "protect" }, priority: 4, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/197.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 198, name: "MURKROW", types: ["Dark", "Flying"], hp: 130, baseStats: { attack: 85, defense: 42, speed: 91 },
                moves: [
                    { name: "Peck", type: "Flying", accuracy: 100, maxPp: 35, power: 35 },
                    { name: "Pursuit", type: "Dark", accuracy: 100, maxPp: 20, power: 40 }, // Power doubles if target switches (niet geïmplementeerd)
                    { name: "Sucker Punch", type: "Dark", accuracy: 100, maxPp: 5, power: 70, priority: 1 },
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/198.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/198.png",
                evolvesToPokedexId: 430 // Honchkrow (Gen 4, Dusk Stone)
            },
            {
                pokedexId: 199, name: "SLOWKING", types: ["Water", "Psychic"], hp: 165, baseStats: { attack: 75, defense: 80, speed: 30 }, // Sp.Atk 100, Sp.Def 110
                moves: [
                    { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Surf", type: "Water", accuracy: 100, maxPp: 15, power: 90 }, // Special
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }, // Sp.Atk
                    { name: "Slack Off", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/199.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/199.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 200, name: "MISDREAVUS", types: ["Ghost"], hp: 130, baseStats: { attack: 60, defense: 60, speed: 85 }, // Sp.Atk 85, Sp.Def 85
                moves: [
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }, // Special, Sp.Def
                    { name: "Confuse Ray", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 },
                    { name: "Will-O-Wisp", type: "Fire", accuracy: 85, maxPp: 15, power: 0, effect: { type: "status", condition: "BRN", chance: 1 } },
                    { name: "Pain Split", type: "Normal", accuracy: 100, maxPp: 20, power: 0 } // Averages HP (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/200.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/200.png",
                evolvesToPokedexId: 429 // Mismagius (Gen 4, Dusk Stone)
            },
            {
                pokedexId: 201, name: "UNOWN", types: ["Psychic"], hp: 118, baseStats: { attack: 72, defense: 48, speed: 48 }, // Sp.Atk 72, Sp.Def 48 (Unown A)
                moves: [
                    { name: "Hidden Power", type: "Normal", accuracy: 100, maxPp: 15, power: 60 } // Type varies (niet geïmplementeerd)
                    // Unown kan alleen Hidden Power. Voor variatie kun je er 3 "lege" moves bijzetten,
                    // of 3 andere placeholder moves, maar dit is de meest accurate.
                    // Als je 4 moves wilt, kun je 3x Tackle of Psybeam toevoegen voor de show.
                    // Hier kies ik voor 1 move, en de engine moet er mee om kunnen gaan.
                    // Of we vullen het aan:
                    // { name: "Psybeam", type: "Psychic", accuracy:100, maxPp:20, power:65, effect: { type: "confusion", chance: 0.1} },
                    // { name: "Tackle", type: "Normal", accuracy:100, maxPp:35, power:40 },
                    // { name: "Confusion", type: "Psychic", accuracy:100, maxPp:25, power:50, effect: { type: "confusion", chance: 0.1} }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201.png", // Unown-A
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/201.png",
                evolvesToPokedexId: null
            },
			// VOEG DEZE TOE AAN JE BESTAANDE pokemonPool ARRAY, NA DE VORIGE JOHTO POKEMON

            {
                pokedexId: 202, name: "WOBBUFFET", types: ["Psychic"], hp: 260, // Zeer hoge HP, lage andere stats
                baseStats: { attack: 33, defense: 58, speed: 33 },
                moves: [
                    // Wobbuffet is lastig, Counter/Mirror Coat zijn reactief.
                    // Ik geef hier moves die het *kan* leren, al zijn ze niet typisch.
                    // Of vereenvoudigde "counter" moves met hoge power maar lage accuracy.
                    // Voor nu, een paar placeholder/status moves.
                    { name: "Counter", type: "Fighting", accuracy: 100, maxPp: 20, power: 1, effect: { type: "counter_physical"} }, // Vereenvoudigd, power wordt berekend
                    { name: "Mirror Coat", type: "Psychic", accuracy: 100, maxPp: 20, power: 1, effect: { type: "counter_special"} }, // Vereenvoudigd
                    { name: "Safeguard", type: "Normal", accuracy: 100, maxPp: 25, power: 0 }, // Beschermt tegen status (niet volledig geïmplementeerd)
                    { name: "Destiny Bond", type: "Ghost", accuracy: 100, maxPp: 5, power: 0 } // Als gebruiker K.O. gaat, gaat tegenstander ook K.O.
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/202.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/202.png",
                evolvesToPokedexId: null // Wynaut (360) is pre-evolutie
            },
            {
                pokedexId: 203, name: "GIRAFARIG", types: ["Normal", "Psychic"], hp: 140, baseStats: { attack: 80, defense: 65, speed: 85 }, // Sp.Atk 90
                moves: [
                    { name: "Stomp", type: "Normal", accuracy: 100, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/203.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/203.png",
                evolvesToPokedexId: null // Farigiraf (Gen 9)
            },
            {
                pokedexId: 204, name: "PINECO", types: ["Bug"], hp: 120, baseStats: { attack: 65, defense: 90, speed: 15 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Self-Destruct", type: "Normal", accuracy: 100, maxPp: 5, power: 200 }, // User faints
                    { name: "Rapid Spin", type: "Normal", accuracy: 100, maxPp: 40, power: 50 },
                    { name: "Spikes", type: "Ground", accuracy: 100, maxPp: 20, power: 0 } // Entry hazard (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/204.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/204.png",
                evolvesToPokedexId: 205
            },
            {
                pokedexId: 205, name: "FORRETRESS", types: ["Bug", "Steel"], hp: 145, baseStats: { attack: 90, defense: 140, speed: 40 },
                moves: [
                    { name: "Gyro Ball", type: "Steel", accuracy: 100, maxPp: 5, power: 70 }, // Power based on speed difference (niet geïmplementeerd)
                    { name: "Explosion", type: "Normal", accuracy: 100, maxPp: 5, power: 250 }, // User faints
                    { name: "Toxic Spikes", type: "Poison", accuracy: 100, maxPp: 20, power: 0 }, // Entry hazard
                    { name: "Zap Cannon", type: "Electric", accuracy: 50, maxPp: 5, power: 120, effect: { type: "status", condition: "PAR", chance: 1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/205.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/205.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 206, name: "DUNSPARCE", types: ["Normal"], hp: 170, baseStats: { attack: 70, defense: 70, speed: 45 },
                moves: [
                    { name: "Glare", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } },
                    { name: "Rollout", type: "Rock", accuracy: 90, maxPp: 20, power: 30 },
                    { name: "Headbutt", type: "Normal", accuracy: 100, maxPp: 15, power: 70, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/206.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/206.png",
                evolvesToPokedexId: null // Dudunsparce (Gen 9)
            },
            {
                pokedexId: 207, name: "GLIGAR", types: ["Ground", "Flying"], hp: 135, baseStats: { attack: 75, defense: 105, speed: 85 },
                moves: [
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true },
                    { name: "X-Scissor", type: "Bug", accuracy: 100, maxPp: 15, power: 80 },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/207.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/207.png",
                evolvesToPokedexId: 472 // Gliscor (Gen 4, Razor Fang at night)
            },
            {
                pokedexId: 208, name: "STEELIX", types: ["Steel", "Ground"], hp: 145, baseStats: { attack: 85, defense: 200, speed: 30 },
                moves: [
                    { name: "Iron Tail", type: "Steel", accuracy: 75, maxPp: 15, power: 100, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.3 } },
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/208.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/208.png",
                evolvesToPokedexId: null // Mega Steelix
            },
            {
                pokedexId: 209, name: "SNUBBULL", types: ["Fairy"], hp: 130, baseStats: { attack: 80, defense: 50, speed: 30 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Tail Whip", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -1 }, alwaysHits: true },
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Charm", type: "Fairy", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/209.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/209.png",
                evolvesToPokedexId: 210
            },
            {
                pokedexId: 210, name: "GRANBULL", types: ["Fairy"], hp: 160, baseStats: { attack: 120, defense: 75, speed: 45 },
                moves: [
                    { name: "Play Rough", type: "Fairy", accuracy: 90, maxPp: 10, power: 90, effect: { type: "stat", stat: "attack", target: "opponent", stages: -1, chance: 0.1 } },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Close Combat", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["defense", "defense"], target: "self", stages: -1 } }, // Sp.Def (TM/TR)
                    { name: "Bulk Up", type: "Fighting", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true } // (TM/TR)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/210.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/210.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 211, name: "QWILFISH", types: ["Water", "Poison"], hp: 135, baseStats: { attack: 95, defense: 85, speed: 85 },
                moves: [
                    { name: "Poison Sting", type: "Poison", accuracy: 100, maxPp: 35, power: 15, effect: { type: "status", condition: "PSN", chance: 0.3 } },
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 },
                    { name: "Spikes", type: "Ground", accuracy: 100, maxPp: 20, power: 0 },
                    { name: "Aqua Jet", type: "Water", accuracy: 100, maxPp: 20, power: 40, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/211.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/211.png",
                evolvesToPokedexId: null // Overqwil (Gen 9, Hisuian form evo)
            },
            {
                pokedexId: 212, name: "SCIZOR", types: ["Bug", "Steel"], hp: 140, baseStats: { attack: 130, defense: 100, speed: 65 },
                moves: [
                    { name: "Bullet Punch", type: "Steel", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "X-Scissor", type: "Bug", accuracy: 100, maxPp: 15, power: 80 },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Iron Head", type: "Steel", accuracy: 100, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/212.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/212.png",
                evolvesToPokedexId: null // Mega Scizor
            },
            {
                pokedexId: 213, name: "SHUCKLE", types: ["Bug", "Rock"], hp: 90, baseStats: { attack: 10, defense: 230, speed: 5 }, // Zeer hoge defenses
                moves: [
                    { name: "Wrap", type: "Normal", accuracy: 90, maxPp: 20, power: 15 }, // Traps
                    { name: "Toxic", type: "Poison", accuracy: 90, maxPp: 10, power: 0 }, // Badly poisons
                    { name: "Power Trick", type: "Psychic", accuracy: 100, maxPp: 10, power: 0 }, // Swaps Atk and Def (niet geïmplementeerd)
                    { name: "Sticky Web", type: "Bug", accuracy: 100, maxPp: 20, power: 0 } // Entry hazard
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/213.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/213.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 214, name: "HERACROSS", types: ["Bug", "Fighting"], hp: 150, baseStats: { attack: 125, defense: 75, speed: 85 },
                moves: [
                    { name: "Megahorn", type: "Bug", accuracy: 85, maxPp: 10, power: 120 },
                    { name: "Close Combat", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["defense", "defense"], target: "self", stages: -1 } }, // Sp.Def
                    { name: "Brick Break", type: "Fighting", accuracy: 100, maxPp: 15, power: 75 },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/214.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/214.png",
                evolvesToPokedexId: null // Mega Heracross
            },
            {
                pokedexId: 215, name: "SNEASEL", types: ["Dark", "Ice"], hp: 125, baseStats: { attack: 95, defense: 55, speed: 115 },
                moves: [
                    { name: "Ice Shard", type: "Ice", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Night Slash", type: "Dark", accuracy: 100, maxPp: 15, power: 70, highCritRatio: true },
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true },
                    { name: "Ice Punch", type: "Ice", accuracy: 100, maxPp: 15, power: 75, effect: { type: "status", condition: "FRZ", chance: 0.1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/215.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/215.png",
                evolvesToPokedexId: 461 // Weavile (Gen 4, Razor Claw at night)
            },
            {
                pokedexId: 216, name: "TEDDIURSA", types: ["Normal"], hp: 130, baseStats: { attack: 80, defense: 50, speed: 40 },
                moves: [
                    { name: "Scratch", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Lick", type: "Ghost", accuracy: 100, maxPp: 30, power: 30, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Fury Swipes", type: "Normal", accuracy: 80, maxPp: 15, power: 18 },
                    { name: "Charm", type: "Fairy", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "opponent", stages: -2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/216.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/216.png",
                evolvesToPokedexId: 217
            },
            {
                pokedexId: 217, name: "URSARING", types: ["Normal"], hp: 160, baseStats: { attack: 130, defense: 75, speed: 55 },
                moves: [
                    { name: "Slash", type: "Normal", accuracy: 100, maxPp: 20, power: 70, highCritRatio: true },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Close Combat", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["defense", "defense"], target: "self", stages: -1 } }, // Sp.Def (TM/TR)
                    { name: "Swords Dance", type: "Normal", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/217.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/217.png",
                evolvesToPokedexId: null // Ursaluna (Gen 9)
            },
            {
                pokedexId: 218, name: "SLUGMA", types: ["Fire"], hp: 110, baseStats: { attack: 40, defense: 40, speed: 20 }, // Sp.Atk 70
                moves: [
                    { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Rock Throw", type: "Rock", accuracy: 90, maxPp: 15, power: 50 },
                    { name: "Harden", type: "Normal", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Amnesia", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true } // Sp.Def
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/218.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/218.png",
                evolvesToPokedexId: 219
            },
            {
                pokedexId: 219, name: "MAGCARGO", types: ["Fire", "Rock"], hp: 130, baseStats: { attack: 50, defense: 120, speed: 30 }, // Sp.Atk 90
                moves: [
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special
                    { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } }, // Special
                    { name: "Earth Power", type: "Ground", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, // Special, Sp.Def
                    { name: "Shell Smash", type: "Normal", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: ["attack", "attack", "speed", "defense", "defense"], target: "self", stages: [2, 2, 2, -1, -1] }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/219.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/219.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 220, name: "SWINUB", types: ["Ice", "Ground"], hp: 120, baseStats: { attack: 50, defense: 40, speed: 50 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Powder Snow", type: "Ice", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Mud-Slap", type: "Ground", accuracy: 100, maxPp: 10, power: 20, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1 } }, // Special
                    { name: "Ice Shard", type: "Ice", accuracy: 100, maxPp: 30, power: 40, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/220.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/220.png",
                evolvesToPokedexId: 221
            },
            {
                pokedexId: 221, name: "PILOSWINE", types: ["Ice", "Ground"], hp: 170, baseStats: { attack: 100, defense: 80, speed: 50 },
                moves: [
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Ice Fang", type: "Ice", accuracy: 95, maxPp: 15, power: 65, effect: { type: "flinch_or_status", condition: "FRZ", chance: 0.1, flinchChance: 0.1 } },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true }, // (TM/TR)
                    { name: "Blizzard", type: "Ice", accuracy: 70, maxPp: 5, power: 110, effect: { type: "status", condition: "FRZ", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/221.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/221.png",
                evolvesToPokedexId: 473 // Mamoswine (Gen 4, na leren Ancient Power)
            },
            {
                pokedexId: 222, name: "CORSOLA", types: ["Water", "Rock"], hp: 135, baseStats: { attack: 55, defense: 95, speed: 35 }, // Sp.Atk 65, Sp.Def 95
                moves: [
                    { name: "Bubble Beam", type: "Water", accuracy: 100, maxPp: 20, power: 65, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } }, // Special
                    { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Mirror Coat", type: "Psychic", accuracy: 100, maxPp: 20, power: 1 } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/222.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/222.png",
                evolvesToPokedexId: null // Cursola (Gen 8, Galarian form evo)
            },
            {
                pokedexId: 223, name: "REMORAID", types: ["Water"], hp: 105, baseStats: { attack: 65, defense: 35, speed: 65 }, // Sp.Atk 65
                moves: [
                    { name: "Water Gun", type: "Water", accuracy: 100, maxPp: 25, power: 40 },
                    { name: "Psybeam", type: "Psychic", accuracy: 100, maxPp: 20, power: 65, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Aurora Beam", type: "Ice", accuracy: 100, maxPp: 20, power: 65, effect: {type: "stat", stat: "attack", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Bubble Beam", type: "Water", accuracy: 100, maxPp: 20, power: 65, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/223.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/223.png",
                evolvesToPokedexId: 224
            },
            {
                pokedexId: 224, name: "OCTILLERY", types: ["Water"], hp: 145, baseStats: { attack: 105, defense: 75, speed: 45 }, // Sp.Atk 105
                moves: [
                    { name: "Octazooka", type: "Water", accuracy: 85, maxPp: 10, power: 65, effect: { type: "stat", stat: "accuracy", target: "opponent", stages: -1, chance: 0.5 } }, // Special
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special (TM/TR)
                    { name: "Signal Beam", type: "Bug", accuracy: 100, maxPp: 15, power: 75, effect: { type: "confusion", chance: 0.1 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/224.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/224.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 225, name: "DELIBIRD", types: ["Ice", "Flying"], hp: 115, baseStats: { attack: 55, defense: 45, speed: 75 },
                moves: [
                    { name: "Present", type: "Normal", accuracy: 90, maxPp: 15, power: 60 }, // Kan schade doen of healen (hier vereenvoudigd tot alleen schade)
                    { name: "Ice Shard", type: "Ice", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Drill Peck", type: "Flying", accuracy: 100, maxPp: 20, power: 80 },
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/225.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/225.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 226, name: "MANTINE", types: ["Water", "Flying"], hp: 155, baseStats: { attack: 40, defense: 70, speed: 70 }, // Sp.Atk 80, Sp.Def 140
                moves: [
                    { name: "Bubble Beam", type: "Water", accuracy: 100, maxPp: 20, power: 65, effect: { type: "stat", stat: "speed", target: "opponent", stages: -1, chance: 0.1 } }, // Special
                    { name: "Wing Attack", type: "Flying", accuracy: 100, maxPp: 35, power: 60 },
                    { name: "Air Slash", type: "Flying", accuracy: 95, maxPp: 15, power: 75, effect: { type: "flinch", chance: 0.3 } }, // Special
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/226.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/226.png",
                evolvesToPokedexId: null // Mantyke (458) is pre-evolutie
            },
            {
                pokedexId: 227, name: "SKARMORY", types: ["Steel", "Flying"], hp: 135, baseStats: { attack: 80, defense: 140, speed: 70 },
                moves: [
                    { name: "Steel Wing", type: "Steel", accuracy: 90, maxPp: 25, power: 70, effect: { type: "stat", stat: "defense", target: "self", stages: 1, chance: 0.1 } },
                    { name: "Drill Peck", type: "Flying", accuracy: 100, maxPp: 20, power: 80 },
                    { name: "Spikes", type: "Ground", accuracy: 100, maxPp: 20, power: 0 },
                    { name: "Roost", type: "Flying", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/227.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/227.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 228, name: "HOUNDOUR", types: ["Dark", "Fire"], hp: 115, baseStats: { attack: 60, defense: 30, speed: 65 }, // Sp.Atk 80
                moves: [
                    { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Smog", type: "Poison", accuracy: 70, maxPp: 20, power: 30, effect: { type: "status", condition: "PSN", chance: 0.4 } }, // Special
                    { name: "Roar", type: "Normal", accuracy: 100, maxPp: 20, power: 0 } // Forces switch
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/228.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/228.png",
                evolvesToPokedexId: 229
            },
            {
                pokedexId: 229, name: "HOUNDOOM", types: ["Dark", "Fire"], hp: 145, baseStats: { attack: 90, defense: 50, speed: 95 }, // Sp.Atk 110
                moves: [
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } }, // Special
                    { name: "Dark Pulse", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } }, // Special
                    { name: "Nasty Plot", type: "Dark", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: "attack", target: "self", stages: 2 }, alwaysHits: true }, // Sp.Atk
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/229.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/229.png",
                evolvesToPokedexId: null // Mega Houndoom
            },
            {
                pokedexId: 230, name: "KINGDRA", types: ["Water", "Dragon"], hp: 145, baseStats: { attack: 95, defense: 95, speed: 85 }, // Sp.Atk 95
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Dragon Pulse", type: "Dragon", accuracy: 100, maxPp: 10, power: 85 }, // Special
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Agility", type: "Psychic", accuracy: 100, maxPp: 30, power: 0, effect: { type: "stat", stat: "speed", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/230.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/230.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 231, name: "PHANPY", types: ["Ground"], hp: 160, baseStats: { attack: 60, defense: 60, speed: 40 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Rollout", type: "Rock", accuracy: 90, maxPp: 20, power: 30 },
                    { name: "Defense Curl", type: "Normal", accuracy: 100, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 1 }, alwaysHits: true },
                    { name: "Take Down", type: "Normal", accuracy: 85, maxPp: 20, power: 90 } // Recoil
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/231.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/231.png",
                evolvesToPokedexId: 232
            },
            {
                pokedexId: 232, name: "DONPHAN", types: ["Ground"], hp: 160, baseStats: { attack: 120, defense: 120, speed: 50 },
                moves: [
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true }, // (TM/TR)
                    { name: "Rapid Spin", type: "Normal", accuracy: 100, maxPp: 40, power: 50 },
                    { name: "Heavy Slam", type: "Steel", accuracy: 100, maxPp: 10, power: 80 } // Power based on weight
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/232.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/232.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 233, name: "PORYGON2", types: ["Normal"], hp: 155, baseStats: { attack: 80, defense: 90, speed: 60 }, // Sp.Atk 105
                moves: [
                    { name: "Tri Attack", type: "Normal", accuracy: 100, maxPp: 10, power: 80, effect: { type: "status_random", conditions: ["BRN", "PAR", "FRZ"], chance: 0.2 } }, // Special
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/233.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/233.png",
                evolvesToPokedexId: 474 // Porygon-Z (Gen 4, Dubious Disc)
            },
            {
                pokedexId: 234, name: "STANTLER", types: ["Normal"], hp: 143, baseStats: { attack: 95, defense: 62, speed: 85 },
                moves: [
                    { name: "Stomp", type: "Normal", accuracy: 100, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Hypnosis", type: "Psychic", accuracy: 60, maxPp: 20, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } },
                    { name: "Confuse Ray", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 },
                    { name: "Zen Headbutt", type: "Psychic", accuracy: 90, maxPp: 15, power: 80, effect: { type: "flinch", chance: 0.2 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/234.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/234.png",
                evolvesToPokedexId: null // Wyrdeer (Gen 9)
            },
            {
                pokedexId: 235, name: "SMEARGLE", types: ["Normal"], hp: 125, baseStats: { attack: 20, defense: 35, speed: 75 },
                moves: [
                    // Sketch is uniek. We geven een paar generieke moves.
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Spore", type: "Grass", accuracy: 100, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }, // Placeholder voor een geschetste move
                    { name: "Dragon Dance", type: "Dragon", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "speed"], target: "self", stages: 1 }, alwaysHits: true }, // Placeholder
                    { name: "Extreme Speed", type: "Normal", accuracy: 100, maxPp: 5, power: 80, priority: 2 } // Placeholder
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/235.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/235.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 236, name: "TYROGUE", types: ["Fighting"], hp: 105, baseStats: { attack: 35, defense: 35, speed: 35 },
                moves: [
                    { name: "Tackle", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Fake Out", type: "Normal", accuracy: 100, maxPp: 10, power: 40, priority: 3, effect: { type: "flinch", chance: 1 } },
                    { name: "Low Kick", type: "Fighting", accuracy: 100, maxPp: 20, power: 60 },
                    { name: "Foresight", type: "Normal", accuracy: 100, maxPp: 40, power: 0 } // Negeert Evasion (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/236.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/236.png",
                evolvesToPokedexId: null // Evolueert naar 106, 107 of 237 gebaseerd op stats
            },
            {
                pokedexId: 237, name: "HITMONTOP", types: ["Fighting"], hp: 120, baseStats: { attack: 95, defense: 95, speed: 70 },
                moves: [
                    { name: "Triple Kick", type: "Fighting", accuracy: 90, maxPp: 10, power: 10 }, // Hits 1-3 times, power increases (vereenvoudigd)
                    { name: "Close Combat", type: "Fighting", accuracy: 100, maxPp: 5, power: 120, effect: { type: "stat", stat: ["defense", "defense"], target: "self", stages: -1 } }, // Sp.Def
                    { name: "Rapid Spin", type: "Normal", accuracy: 100, maxPp: 40, power: 50 },
                    { name: "Sucker Punch", type: "Dark", accuracy: 100, maxPp: 5, power: 70, priority: 1 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/237.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/237.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 238, name: "SMOOCHUM", types: ["Ice", "Psychic"], hp: 115, baseStats: { attack: 30, defense: 15, speed: 65 }, // Sp.Atk 85
                moves: [
                    { name: "Pound", type: "Normal", accuracy: 100, maxPp: 35, power: 40 },
                    { name: "Powder Snow", type: "Ice", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Confusion", type: "Psychic", accuracy: 100, maxPp: 25, power: 50, effect: { type: "confusion", chance: 0.1 } }, // Special
                    { name: "Sing", type: "Normal", accuracy: 55, maxPp: 15, power: 0, effect: { type: "status", condition: "SLP", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/238.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/238.png",
                evolvesToPokedexId: 124 // Jynx
            },
            {
                pokedexId: 239, name: "ELEKID", types: ["Electric"], hp: 115, baseStats: { attack: 63, defense: 37, speed: 95 }, // Sp.Atk 65
                moves: [
                    { name: "Quick Attack", type: "Normal", accuracy: 100, maxPp: 30, power: 40, priority: 1 },
                    { name: "Thunder Shock", type: "Electric", accuracy: 100, maxPp: 30, power: 40, effect: { type: "status", condition: "PAR", chance: 0.1 } },
                    { name: "Low Kick", type: "Fighting", accuracy: 100, maxPp: 20, power: 60 },
                    { name: "Thunder Wave", type: "Electric", accuracy: 90, maxPp: 20, power: 0, effect: { type: "status", condition: "PAR", chance: 1 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/239.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/239.png",
                evolvesToPokedexId: 125 // Electabuzz
            },
            {
                pokedexId: 240, name: "MAGBY", types: ["Fire"], hp: 115, baseStats: { attack: 75, defense: 37, speed: 83 }, // Sp.Atk 70
                moves: [
                    { name: "Ember", type: "Fire", accuracy: 100, maxPp: 25, power: 40, effect: { type: "status", condition: "BRN", chance: 0.1 } },
                    { name: "Smog", type: "Poison", accuracy: 70, maxPp: 20, power: 30, effect: { type: "status", condition: "PSN", chance: 0.4 } }, // Special
                    { name: "Fire Spin", type: "Fire", accuracy: 85, maxPp: 15, power: 35 }, // Special, Traps (niet geïmplementeerd)
                    { name: "Confuse Ray", type: "Ghost", accuracy: 100, maxPp: 10, power: 0 }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/240.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/240.png",
                evolvesToPokedexId: 126 // Magmar
            },
            {
                pokedexId: 241, name: "MILTANK", types: ["Normal"], hp: 165, baseStats: { attack: 80, defense: 105, speed: 100 },
                moves: [
                    { name: "Body Slam", type: "Normal", accuracy: 100, maxPp: 15, power: 85, effect: { type: "status", condition: "PAR", chance: 0.3 } },
                    { name: "Milk Drink", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Rollout", type: "Rock", accuracy: 90, maxPp: 20, power: 30 },
                    { name: "Stomp", type: "Normal", accuracy: 100, maxPp: 20, power: 65, effect: { type: "flinch", chance: 0.3 } }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/241.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/241.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 242, name: "BLISSEY", types: ["Normal"], hp: 325, // Nog hogere HP dan Chansey
                baseStats: { attack: 10, defense: 10, speed: 55 }, // Sp.Atk 75, Sp.Def 135
                moves: [
                    { name: "Egg Bomb", type: "Normal", accuracy: 75, maxPp: 10, power: 100 },
                    { name: "Soft-Boiled", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true },
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special (TM/TR)
                    { name: "Flamethrower", type: "Fire", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "BRN", chance: 0.1 } } // Special (TM/TR)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/242.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/242.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 243, name: "RAIKOU", types: ["Electric"], hp: 160, baseStats: { attack: 85, defense: 75, speed: 115 }, // Sp.Atk 115
                moves: [
                    { name: "Thunderbolt", type: "Electric", accuracy: 100, maxPp: 15, power: 90, effect: { type: "status", condition: "PAR", chance: 0.1 } }, // Special
                    { name: "Shadow Ball", type: "Ghost", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } }, // Special, Sp.Def
                    { name: "Calm Mind", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true }, // Sp.Atk, Sp.Def
                    { name: "Aura Sphere", type: "Fighting", accuracy: 100, maxPp: 20, power: 80, alwaysHits: true } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/243.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/243.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 244, name: "ENTEI", types: ["Fire"], hp: 185, baseStats: { attack: 115, defense: 85, speed: 100 },
                moves: [
                    { name: "Sacred Fire", type: "Fire", accuracy: 95, maxPp: 5, power: 100, effect: { type: "status", condition: "BRN", chance: 0.5 } },
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Extreme Speed", type: "Normal", accuracy: 100, maxPp: 5, power: 80, priority: 2 },
                    { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/244.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 245, name: "SUICUNE", types: ["Water"], hp: 170, baseStats: { attack: 75, defense: 115, speed: 85 }, // Sp.Atk 90, Sp.Def 115
                moves: [
                    { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, // Special
                    { name: "Ice Beam", type: "Ice", accuracy: 100, maxPp: 10, power: 90, effect: { type: "status", condition: "FRZ", chance: 0.1 } }, // Special
                    { name: "Calm Mind", type: "Psychic", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "defense"], target: "self", stages: 1 }, alwaysHits: true }, // Sp.Atk, Sp.Def
                    { name: "Scald", type: "Water", accuracy: 100, maxPp: 15, power: 80, effect: { type: "status", condition: "BRN", chance: 0.3 } } // Special
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/245.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/245.png",
                evolvesToPokedexId: null
            },
            {
                pokedexId: 246, name: "LARVITAR", types: ["Rock", "Ground"], hp: 120, baseStats: { attack: 64, defense: 50, speed: 41 },
                moves: [
                    { name: "Bite", type: "Dark", accuracy: 100, maxPp: 25, power: 60, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Rock Slide", type: "Rock", accuracy: 90, maxPp: 10, power: 75, effect: { type: "flinch", chance: 0.3 } },
                    { name: "Screech", type: "Normal", accuracy: 85, maxPp: 40, power: 0, effect: { type: "stat", stat: "defense", target: "opponent", stages: -2 }, alwaysHits: true },
                    { name: "Sandstorm", type: "Rock", accuracy: 100, maxPp: 10, power: 0 } // Weather (niet geïmplementeerd)
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/246.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/246.png",
                evolvesToPokedexId: 247
            },
            {
                pokedexId: 247, name: "PUPITAR", types: ["Rock", "Ground"], hp: 140, baseStats: { attack: 84, defense: 70, speed: 51 },
                moves: [
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Iron Defense", type: "Steel", accuracy: 100, maxPp: 15, power: 0, effect: { type: "stat", stat: "defense", target: "self", stages: 2 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/247.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/247.png",
                evolvesToPokedexId: 248
            },
            {
                pokedexId: 248, name: "TYRANITAR", types: ["Rock", "Dark"], hp: 170, baseStats: { attack: 134, defense: 110, speed: 61 },
                moves: [
                    { name: "Stone Edge", type: "Rock", accuracy: 80, maxPp: 5, power: 100, highCritRatio: true },
                    { name: "Crunch", type: "Dark", accuracy: 100, maxPp: 15, power: 80, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.2 } },
                    { name: "Earthquake", type: "Ground", accuracy: 100, maxPp: 10, power: 100 },
                    { name: "Dragon Dance", type: "Dragon", accuracy: 100, maxPp: 20, power: 0, effect: { type: "stat", stat: ["attack", "speed"], target: "self", stages: 1 }, alwaysHits: true }
                ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png",
                spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/248.png",
                evolvesToPokedexId: null // Mega Tyranitar
            },
			{ 
                pokedexId: 249, name: "LUGIA", types: ["Psychic", "Flying"], hp: 160, baseStats: { attack: 90, defense: 130, speed: 110 }, 
                moves: [ { name: "Aeroblast", type: "Flying", accuracy: 95, maxPp: 5, power: 100, highCritRatio: true }, { name: "Hydro Pump", type: "Water", accuracy: 80, maxPp: 5, power: 110 }, { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true } ], 
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/249.png", evolvesToPokedexId: null
            }, 
            { 
                pokedexId: 250, name: "HO-OH", types: ["Fire", "Flying"], hp: 160, baseStats: { attack: 130, defense: 90, speed: 90 }, 
                moves: [ { name: "Sacred Fire", type: "Fire", accuracy: 95, maxPp: 5, power: 100, effect: { type: "status", condition: "BRN", chance: 0.5 } }, { name: "Brave Bird", type: "Flying", accuracy: 100, maxPp: 15, power: 120 }, { name: "Solar Beam", type: "Grass", accuracy: 100, maxPp: 10, power: 120 }, { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true } ], 
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/250.png", evolvesToPokedexId: null
            },
            {
                pokedexId: 251, name: "CELEBI", types: ["Psychic", "Grass"], hp: 170, baseStats: { attack: 100, defense: 100, speed: 100 },
                moves: [ { name: "Psychic", type: "Psychic", accuracy: 100, maxPp: 10, power: 90, effect: {type: "stat", stat: "defense", target: "opponent", stages: -1, chance: 0.1 } }, { name: "Giga Drain", type: "Grass", accuracy: 100, maxPp: 10, power: 75, effect: {type: "heal", percentage: 0.5, target: "self"} }, { name: "Recover", type: "Normal", accuracy: 100, maxPp: 10, power: 0, effect: { type: "heal", percentage: 0.5, target: "self" }, alwaysHits: true }, { name: "Ancient Power", type: "Rock", accuracy: 100, maxPp: 5, power: 60, effect: { type: "stat_all_self", chance: 0.1, stages: 1 } } ],
                spriteFront: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/251.png", spriteBack: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/251.png", evolvesToPokedexId: null
            }
        ];

        const gymLeadersData = {
            "Misty": {
                name: "Misty",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Evolutions_Misty%E2%80%99s-Determination-1.jpg",
                badgeName: "Cascade Badge",
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/9/9c/Cascade_Badge.png/50px-Cascade_Badge.png",
                pokemonTeam: ["SEADRA", "GOLDUCK", "STARMIE"], // Assuming these are in pokemonPool
                dialog: "My water Pokémon are unbeatable!"
            },
            "Leon": {
                name: "Leon",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Vivid-Voltage_Leon-1.jpg",
                badgeName: "Champion Emblem",
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/d/d2/Champion_Ribbon_artwork.png/50px-Champion_Ribbon_artwork.png",
                pokemonTeam: ["MAGMAR", "ELECTABUZZ", "CHARIZARD"],
                dialog: "Time for a champion time!"
            },
            "Eri": {
                name: "Eri",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Eri-136-Prismatic-Evolutions.jpg",
                badgeName: "Caph Squad Star Badge",
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/5/5b/Caph_Squad_Badge.png/50px-Caph_Squad_Badge.png",
                pokemonTeam: ["MACHAMP", "HITMONLEE", "PRIMEAPE"],
                dialog: "Let's see your fighting spirit!"
            },
            "Mexican Razor": {
                name: "Mexican Razor",
                cardUrl: "https://scontent-ams4-1.xx.fbcdn.net/v/t39.30808-6/464328023_8842305605827627_655472334377530646_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=aa7094&_nc_ohc=tCnCp4mD0PkQ7kNvwH6QSSV&_nc_oc=Adna4oKF3d2pRJhuP6lo0MZSODfKQYt4gl9ymcV7isad4xj_AcSG81t5NePDjvoZqGA&_nc_zt=23&_nc_ht=scontent-ams4-1.xx&_nc_gid=zYlgIuLET4LtGTELtWbArQ&oh=00_AfKynOQbndmCgVnSGUnc1rtZW6RBuBPmTIpNX3m4esypkA&oe=68271956",
                badgeName: "Razor Claw Badge", 
                badgeUrl: "https://static.wikia.nocookie.net/pokemonfanon/images/e/e4/Razor_Badge.png/revision/latest/scale-to-width-down/50?cb=20130619012123", 
                pokemonTeam: ["HITMONCHAN", "KABUTOPS", "NIDOKING"],
                dialog: "¡Prepárate para la lucha!"
            },
            "Red&Blue": {
                name: "Red & Blue",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Cosmic-Eclipse_Red-Blue.jpg",
                badgeName: "Kanto Legacy Badge", 
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/1/19/Earth_Badge.png/50px-Earth_Badge.png", 
                pokemonTeam: ["VENUSAUR", "CHARIZARD", "BLASTOISE"],
                dialog: "A legendary challenge awaits!"
            },
            "Bird Master": {
                name: "Bird Master",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Hidden-Fates_Moltres-Zapdos-Articuno-GX.jpg",
                badgeName: "Sky High Badge", 
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/b/b5/Zephyr_Badge.png/50px-Zephyr_Badge.png", 
                pokemonTeam: ["ZAPDOS", "ARTICUNO", "MOLTRES"],
                dialog: "Can you conquer the skies?"
            },
            "Erika": {
                name: "Erika",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Erikas-Invitation-203-151.jpg",
                badgeName: "Rainbow Badge",
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/a/a6/Rainbow_Badge.png/50px-Rainbow_Badge.png",
                pokemonTeam: ["VILEPLUME", "VICTREEBEL", "TANGELA"],
                dialog: "My grass Pokémon will mesmerize you."
            },
            "Blaine": {
                name: "Blaine",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Dragon-Majesty_Blaine%E2%80%99s-Last-Stand.jpg",
                badgeName: "Volcano Badge",
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/1/12/Volcano_Badge.png/50px-Volcano_Badge.png",
                pokemonTeam: ["ARCANINE", "RAPIDASH", "MAGMAR"],
                dialog: "My fiery Pokémon will turn you to ash!"
            },
            "Sabrina": {
                name: "Sabrina",
                cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Team-Up_Sabrina%E2%80%99s-Suggestion.jpg",
                badgeName: "Marsh Badge",
                badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/6/6f/Marsh_Badge.png/50px-Marsh_Badge.png",
                pokemonTeam: ["MR. MIME", "HYPNO", "ALAKAZAM"], // Assuming MR. MIME is in pokemonPool
                dialog: "My psychic powers are unmatched!"
            },
			  "Falkner": {
        name: "Falkner",
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Falkner-251-paldea-evolved.jpg",
        badgeName: "Zephyr Badge", // Standaard Johto badge voor Falkner
        badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/b/b5/Zephyr_Badge.png/50px-Zephyr_Badge.png",
        pokemonTeam: ["PIDGEOT", "CROBAT", "MURKROW"], // Gebruik Murkrow ipv Honchkrow als Honchkrow (Gen4) niet in je pool is
                                                     // of Honchkrow als je die hebt toegevoegd.
                                                     // Ik ga uit van Murkrow voor nu, aangezien Honchkrow een Gen 4 evo is.
        dialog: "My magnificent Flying-type Pokémon will take you down!"
    },
    "Whitney": {
        name: "Whitney",
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Lost-Thunder_Whitney.jpg",
        badgeName: "Plain Badge", // Standaard Johto badge voor Whitney
        badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/5/53/Plain_Badge.png/50px-Plain_Badge.png",
        pokemonTeam: ["MILTANK", "CLEFABLE", "URSARING"],
        dialog: "You're not as weak as you look! But, I'm still not going to lose!"
    },
    "Jasmine": {
        name: "Jasmine",
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Team-Up_Jasmine.jpg",
        badgeName: "Mineral Badge", // Standaard Johto badge voor Jasmine
        badgeUrl: "https://archives.bulbagarden.net/media/upload/thumb/1/11/Mineral_Badge.png/50px-Mineral_Badge.png",
        pokemonTeam: ["SKARMORY", "MAGNETON", "STEELIX"],
        dialog: "...You're a kind person. ...Allow me to see your Pokémon's power."
    }
        };
const eliteFourData = {
    "Bruno": {
        name: "Bruno",
        cardUrl: "https://www.pokemonkaart.nl/wp-content/uploads/Battle-Styles_Bruno-1.jpg",
        pokemonTeam: ["MACHAMP", "HITMONLEE", "HITMONCHAN", "ONIX", "GOLEM", "HERACROSS"],
        dialog: "Hahaha! I am Bruno of the Elite Four! I've lived and trained with my Fighting Pokémon! And I'm ready to take you on! Bring it!"
    }
};


// --- Helper Functions ---
function createPokemon(name, types, hp, baseStats, moves, spriteFront, spriteBack, isShiny = false, pokedexIdInput = null) {
    const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    const idFromSprite = spriteFront.split('/').pop().split('.')[0];
    const effectivePokedexId = pokedexIdInput !== null ? pokedexIdInput : parseInt(idFromSprite);
    const basePokemonData = pokemonPool.find(p => p.pokedexId === effectivePokedexId) || {};

    return {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        pokedexId: effectivePokedexId,
        name: name.toUpperCase(), types: types, maxHP: hp, currentHP: hp,
        baseStats: JSON.parse(JSON.stringify(baseStats)),
        stats: { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 },
        moves: moves.map(m => ({ ...m, currentPp: m.maxPp })),
        spriteFrontUrl: isShiny ? `${shinyBaseUrl}/shiny/${effectivePokedexId}.png` : spriteFront,
        spriteBackUrl: isShiny ? `${shinyBaseUrl}/back/shiny/${effectivePokedexId}.png` : spriteBack,
        status: null, isShiny: isShiny,
        sleepTurns: 0,
        flinch: false,
        originalEvolutionData: null,
        evolvesToPokedexId: basePokemonData.evolvesToPokedexId || null
    };
}
function createPokemonFromData(data, isOpponent = false, forPlayerTeam = false) {
    let isShiny = false;
    if (data.isShiny) {
        isShiny = true;
    } else if ((isOpponent || battleState.isWildBattle) && !forPlayerTeam && Math.random() < SHINY_CHANCE) {
        isShiny = true;
    }
    const newPokemon = createPokemon(data.name, data.types, data.hp, data.baseStats, data.moves, data.spriteFront, data.spriteBack, isShiny, data.pokedexId);
    return newPokemon;
}
function calculateStatWithStage(baseStat, stage, statType) { const stageArray = (statType === 'accuracy' || statType === 'evasion') ? accuracyStageMultipliers : statStageMultipliers; const modifier = stageArray[stage + 6]; let finalStat = Math.floor(baseStat * modifier); if (statType === 'speed') { const pokemonToCheck = battleState.playerTurn ? (battleState.opponentTeam[battleState.opponentActiveIndex] || {}) : (battleState.playerTeam[battleState.playerActiveIndex] || {}); if (pokemonToCheck && pokemonToCheck.status === 'PAR' && baseStat === pokemonToCheck.baseStats?.speed) { finalStat = Math.floor(finalStat / 2); } } return finalStat; }
function calculateTypeEffectiveness(moveType, defenderTypes) { let totalEffectiveness = 1; if (!typeChart[moveType]) return 1; defenderTypes.forEach(defenderType => { if (typeChart[moveType][defenderType] !== undefined) { totalEffectiveness *= typeChart[moveType][defenderType]; }}); return totalEffectiveness; }
function getEffectivenessText(multiplier, defenderName) { if (multiplier >= 2) return "It's super effective!"; if (multiplier > 0 && multiplier < 1) return "It's not very effective..."; if (multiplier === 0) return `It doesn't affect foe ${defenderName.toUpperCase()}...`; return ""; }
function switchScreen(screenKey) { Object.keys(screens).forEach(key => { if (screens[key]) screens[key].style.display = 'none'; }); if (screens[screenKey]) { screens[screenKey].style.display = 'flex'; currentScreen = screenKey; } else { console.error(`Screen '${screenKey}' not found.`); } }
function typeMessage(message, callback) { if (battleState.isProcessingMessage && message) { battleState.messageQueue.push({ message, callback }); return; } battleState.isProcessingMessage = true; battleMessageEl.textContent = ''; actionMenuEl.style.display = 'none'; moveMenuEl.style.display = 'none'; itemMenuEl.style.display = 'none'; battleTextboxEl.style.display = 'block'; battleTextboxEl.style.visibility = 'visible'; let i = 0; const intervalId = setInterval(() => { if (i < message.length) { battleMessageEl.textContent += message.charAt(i); i++; } else { clearInterval(intervalId); battleState.isProcessingMessage = false; battleState.onMessageComplete = callback; processMessageQueue(); } }, 35); }
function processMessageQueue() { if (!battleState.isProcessingMessage && battleState.messageQueue.length > 0) { const next = battleState.messageQueue.shift(); typeMessage(next.message, next.callback); } }
if (battleTextboxEl && battleTextboxEl.parentElement) { battleTextboxEl.parentElement.addEventListener('click', (e) => { if (e.target.closest('.battle-menu') || e.target.closest('#switchPokemonScreen') || e.target.closest('#teamSelectScreen') || e.target.closest('.dialog-overlay')) return; if (!battleState.isProcessingMessage && battleState.onMessageComplete) { const callback = battleState.onMessageComplete; battleState.onMessageComplete = null; callback(); processMessageQueue(); } });}
function updateHpBar(hpFillElement, hpNumbersElement, currentHp, maxHp) { const p = Math.max(0, (currentHp / maxHp) * 100); hpFillElement.style.width = p + '%'; if (p > 50) hpFillElement.style.backgroundColor = 'var(--hp-high-color)'; else if (p > 20) hpFillElement.style.backgroundColor = 'var(--hp-medium-color)'; else hpFillElement.style.backgroundColor = 'var(--hp-low-color)'; if (hpNumbersElement) hpNumbersElement.textContent = `${Math.max(0, Math.floor(currentHp))}/${maxHp}`; }
function updateStatusTag(pokemon, tagElement) { if (pokemon.status) { tagElement.textContent = pokemon.status.toUpperCase(); tagElement.className = 'status-tag ' + pokemon.status.toUpperCase(); tagElement.style.display = 'inline-block'; } else { tagElement.style.display = 'none'; } }

function playShakeAnimation(spriteElementContainer) {
    if (spriteElementContainer && typeof anime === 'function') {
        const baseScale = spriteElementContainer.classList.contains('player-sprite') ? 2.1 : 1.4;
        anime({
            targets: spriteElementContainer,
            translateX: [ { value: -5, duration: 50, delay: 0 }, { value: 5, duration: 100, delay: 0 }, { value: -5, duration: 100, delay: 0 }, { value: 5, duration: 100, delay: 0 }, { value: 0, duration: 50, delay: 0 } ],
            scale: baseScale, easing: 'easeInOutSine', duration: 400
        });
    } else if (spriteElementContainer) {
         spriteElementContainer.classList.add('shake-anim');
         setTimeout(() => { spriteElementContainer.classList.remove('shake-anim'); }, 500);
    }
}

function playAttackAnimation(moveType, attackerSpriteEl, defenderSpriteEl, onComplete) {
    if (typeof anime !== 'function') { setTimeout(() => { if (onComplete) onComplete(); }, 500); return; }
    const animElement = document.createElement('div'); animElement.classList.add('attack-animation');
    const attackerRect = attackerSpriteEl.getBoundingClientRect(); const defenderRect = defenderSpriteEl.getBoundingClientRect();
    const layerRect = attackAnimationLayer.getBoundingClientRect();
    const startX = attackerRect.left + attackerRect.width / 2 - layerRect.left; const startY = attackerRect.top + attackerRect.height / 2 - layerRect.top;
    const endX = defenderRect.left + defenderRect.width / 2 - layerRect.left; const endY = defenderRect.top + defenderRect.height / 2 - layerRect.top;
    let animationProps = {};
    switch (moveType.toUpperCase()) {
        case 'FIRE': animElement.style.cssText = 'width:40px;height:40px;background-color:orangered;border-radius:50%;box-shadow:0 0 20px 10px darkorange, 0 0 30px 15px rgba(255,69,0,0.7);'; animationProps = { translateX: [startX - 20, endX - 20], translateY: [startY - 20, endY - 20], scale: [0.5, 1.8, 0.8], opacity: [0, 1, 0], duration: 600, easing: 'easeOutExpo' }; break;
        case 'WATER': animElement.style.cssText = 'width:50px;height:30px;background:radial-gradient(circle, rgba(173,216,230,1) 0%, rgba(0,119,182,1) 100%);border-radius:15px;border:3px solid cyan;box-shadow:0 0 15px 5px skyblue;'; animationProps = { translateX: [startX - 25, endX - 25], translateY: [startY - 15, endY - 15], scale: [0.8, 1.5, 0.7], opacity: [0, 1, 0], rotate: anime.random(300, 420), duration: 700, easing: 'easeInOutQuart' }; break;
        case 'ELECTRIC': animElement.style.cssText = `width:120px;height:120px;background-color:yellow;border-radius:50%;opacity:0;left:${endX - 60}px;top:${endY - 60}px;box-shadow:0 0 30px 20px gold, 0 0 40px 25px yellow, 0 0 60px 35px rgba(255,255,0,0.6);`; animationProps = { opacity: [0, 0.9, 0.6, 0.9, 0], scale: [1, 1.6, 1.2, 1.6, 1], duration: 350, easing: 'linear' }; break;
        case 'GRASS': animElement.style.cssText = `width:35px;height:70px;background-color:limegreen;border-radius:50% 50% 10px 10px / 80% 80% 20% 20%;left:${startX - 17}px;top:${startY - 35}px;box-shadow:0 0 10px 3px darkgreen;`; animationProps = { translateX: [0, endX - startX + anime.random(-10, 10)], translateY: [0, endY - startY + anime.random(-10, 10)], rotate: [0, anime.random(300, 420) + 'deg'], scale: [1, 0.3], opacity: [1, 0], duration: 600, easing: 'easeInSine' }; break;
        default: animElement.style.cssText = `width:70px;height:70px;background-color:rgba(220,220,220,0.9);border-radius:50%;left:${endX - 35}px;top:${endY - 35}px;box-shadow:0 0 10px 4px lightgrey;`; animationProps = { scale: [0.3, 1.3, 0.7], opacity: [0, 1, 0], duration: 450, easing: 'easeOutExpo' }; break;
    }
    attackAnimationLayer.appendChild(animElement);
    anime({ targets: animElement, ...animationProps, complete: () => { animElement.remove(); if (onComplete) onComplete(); }});
}

function updateBattleUI() {
    if(!battleState.playerTeam[battleState.playerActiveIndex] || (battleState.opponentTeam.length > 0 && !battleState.opponentTeam[battleState.opponentActiveIndex])) { return; }
    const pPok = battleState.playerTeam[battleState.playerActiveIndex];
    playerPokemonNameEl.textContent = pPok.name.toUpperCase(); playerPokemonSpriteEl.src = pPok.spriteBackUrl;
    updateHpBar(playerHpFillEl, playerHpNumbersEl, pPok.currentHP, pPok.maxHP); updateStatusTag(pPok, playerStatusTagEl);
    updateTeamStatus(playerTeamStatusEl, battleState.playerTeam, battleState.isEliteFourBattle ? 6 : 3);

    if (battleState.opponentTeam.length > 0 && battleState.opponentTeam[battleState.opponentActiveIndex]) {
        const oPok = battleState.opponentTeam[battleState.opponentActiveIndex];
        opponentPokemonNameEl.textContent = oPok.name.toUpperCase(); opponentPokemonSpriteEl.src = oPok.spriteFrontUrl;
        updateHpBar(opponentHpFillEl, opponentHpNumbersEl, oPok.currentHP, oPok.maxHP); updateStatusTag(oPok, opponentStatusTagEl);
        updateTeamStatus(opponentTeamStatusEl, battleState.opponentTeam, battleState.isEliteFourBattle ? 6 : 3);
    } else {
        opponentPokemonNameEl.textContent = ""; opponentPokemonSpriteEl.src = ""; opponentHpFillEl.style.width = '0%';
        opponentHpNumbersEl.textContent = ""; opponentStatusTagEl.style.display = 'none'; opponentTeamStatusEl.innerHTML = '';
    }
    if (actionMenuEl) {
        let visibleAndEnabledButtonsInActionMenu = 0; const buttons = actionMenuEl.querySelectorAll('button');
        buttons.forEach(b => { if (b.parentElement === actionMenuEl) { const style = window.getComputedStyle(b); if (style.display !== 'none' && !b.disabled) { visibleAndEnabledButtonsInActionMenu++; } } });
        actionMenuEl.classList.toggle('extended', visibleAndEnabledButtonsInActionMenu === 4);
    }
}
function updateTeamStatus(containerElement, team, totalSlots = 3) {
    containerElement.innerHTML = '';
    for (let i = 0; i < totalSlots; i++) {
        const ball = document.createElement('span'); ball.classList.add('status-ball');
        if (team[i]) { if (team[i].currentHP <= 0) { ball.classList.add('fainted'); } } else { ball.style.opacity = '0.3'; }
        containerElement.appendChild(ball);
    }
}
function updateCoinDisplay() { const coins = selectedTrainerData ? (selectedTrainerData.coins || 0) : 0; if (playerCoinsDisplayMainMenuEl) playerCoinsDisplayMainMenuEl.textContent = `Coins: ${coins}`; if (marketCoinDisplayEl) marketCoinDisplayEl.textContent = `Coins: ${coins}`; }
function showMarketScreen() { if (!selectedTrainerData) { alert("Please select a trainer first."); switchScreen('characterSelect'); return; } updateCoinDisplay(); switchScreen('market'); }
function showInventoryScreen() {
    if (!selectedTrainerData) { alert("Please select a trainer first."); switchScreen('characterSelect'); return; }
    inventoryGridEl.innerHTML = ''; const inventory = selectedTrainerData.inventory || {}; let hasItems = false;
    Object.keys(inventory).forEach(itemName => {
        if (inventory[itemName] > 0) {
            hasItems = true; const itemDiv = document.createElement('div'); itemDiv.classList.add('inventory-item');
            const itemIcon = document.createElement('img'); itemIcon.classList.add('item-icon');
            if (itemName.toLowerCase().includes("great")) { itemIcon.style.backgroundImage = 'var(--item-icon-greatball)'; itemIcon.alt = "Great Ball"; }
            else if (itemName.toLowerCase().includes("evolution")) { itemIcon.style.backgroundImage = 'var(--item-icon-evolutionstone)'; itemIcon.alt = "Evolution Stone"; }
            else if (itemName.toLowerCase().includes("tcg pack")) { itemIcon.style.backgroundImage = 'var(--item-icon-tcgpack)'; itemIcon.alt = "TCG Pack"; itemIcon.classList.add('tcgpack-icon'); }
            else { itemIcon.style.backgroundImage = 'var(--item-icon-pokeball)'; itemIcon.alt = "Poké Ball"; }
            itemIcon.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            const itemDetails = document.createElement('div'); itemDetails.classList.add('item-details');
            itemDetails.innerHTML = `<span class="item-name">${itemName}</span>: ${inventory[itemName]}`;
            itemDiv.appendChild(itemIcon); itemDiv.appendChild(itemDetails); inventoryGridEl.appendChild(itemDiv);
        }
    });
    if (!hasItems && noInventoryItemsMsg) { noInventoryItemsMsg.style.display = 'block'; } else if (noInventoryItemsMsg) { noInventoryItemsMsg.style.display = 'none'; }
    switchScreen('inventory');
}

function showTeamScreen() {
    if (!selectedTrainerData || !selectedTrainerData.team) { alert("Please select a trainer and have a team."); switchScreen('characterSelect'); return; }
    teamGridEl.innerHTML = ''; const currentTeam = selectedTrainerData.team.filter(p => p);
    if (currentTeam.length === 0 && noTeamPokemonMsg) { noTeamPokemonMsg.style.display = 'block'; }
    else {
        if(noTeamPokemonMsg) noTeamPokemonMsg.style.display = 'none';
        currentTeam.forEach((pokemon, index) => {
            const pCard = document.createElement('div'); pCard.classList.add('team-pokemon-card'); pCard.dataset.pokemonId = pokemon.id;
            const orderControls = document.createElement('div'); orderControls.classList.add('pokemon-order-controls');
            const upButton = document.createElement('button'); upButton.classList.add('order-btn'); upButton.innerHTML = '&#9650;'; upButton.disabled = index === 0;
            upButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonInTeam(index, index - 1); }); orderControls.appendChild(upButton);
            const downButton = document.createElement('button'); downButton.classList.add('order-btn'); downButton.innerHTML = '&#9660;'; downButton.disabled = index === currentTeam.length - 1;
            downButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonInTeam(index, index + 1); }); orderControls.appendChild(downButton);
            pCard.appendChild(orderControls);
            const pSprite = document.createElement('img'); pSprite.classList.add('pokemon-list-sprite'); pSprite.src = pokemon.spriteFrontUrl; pSprite.alt = pokemon.name.toUpperCase();
            const pDetails = document.createElement('div'); pDetails.classList.add('pokemon-details');
            pDetails.innerHTML = `<span class="pokemon-name">${pokemon.name.toUpperCase()}</span> <br>HP: ${Math.floor(pokemon.currentHP)}/${pokemon.maxHP} ${pokemon.status ? '('+pokemon.status.toUpperCase()+')' : ''}`;
            pCard.appendChild(pSprite); pCard.appendChild(pDetails); teamGridEl.appendChild(pCard);
        });
    }
    switchScreen('team');
}

function movePokemonInTeam(currentIndex, newIndex) {
    if (!selectedTrainerData || !selectedTrainerData.team) return; if (newIndex < 0 || newIndex >= selectedTrainerData.team.length) return;
    const team = selectedTrainerData.team; const pokemonToMove = team.splice(currentIndex, 1)[0]; team.splice(newIndex, 0, pokemonToMove);
    saveGame(); showTeamScreen();
}

function showPcBoxScreen() {
    if (!selectedTrainerData) { alert("Please select a trainer first."); switchScreen('characterSelect'); return; }
    pcTeamGridEl.innerHTML = ''; pcBoxGridEl.innerHTML = '';
    const team = selectedTrainerData.team.filter(p => p); const pcBox = selectedTrainerData.pcBox.filter(p => p);
    pcTeamCountEl.textContent = team.length; pcBoxCountEl.textContent = pcBox.length; pcBoxCapacityEl.textContent = MAX_PC_BOX_SIZE;
    if (team.length === 0 && noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'block'; else if (noPokemonPcTeamMsg) noPokemonPcTeamMsg.style.display = 'none';
    if (pcBox.length === 0 && noPokemonPcBoxMsg) noPokemonPcBoxMsg.style.display = 'block'; else if (noPokemonPcBoxMsg) noPokemonPcBoxMsg.style.display = 'none';
    team.forEach((pokemon, index) => { const pCard = createPcPokemonCard(pokemon, 'team', index); pcTeamGridEl.appendChild(pCard); });
    pcBox.forEach((pokemon, index) => { const pCard = createPcPokemonCard(pokemon, 'pc', index); pcBoxGridEl.appendChild(pCard); });
    switchScreen('pcBox');
}

function createPcPokemonCard(pokemon, location, index) {
    const pCard = document.createElement('div'); pCard.classList.add('pc-pokemon-card');
    pCard.dataset.pokemonId = pokemon.id; pCard.dataset.location = location; pCard.dataset.index = index;
    const pSprite = document.createElement('img'); pSprite.classList.add('pokemon-list-sprite'); pSprite.src = pokemon.spriteFrontUrl; pSprite.alt = pokemon.name.toUpperCase(); pCard.appendChild(pSprite);
    const pDetails = document.createElement('div'); pDetails.classList.add('pokemon-details');
    pDetails.innerHTML = `<span class="pokemon-name">${pokemon.name.toUpperCase()}</span> <br>HP: ${Math.floor(pokemon.currentHP)}/${pokemon.maxHP} ${pokemon.status ? '('+pokemon.status.toUpperCase()+')' : ''}`; pCard.appendChild(pDetails);
    const moveButton = document.createElement('button'); moveButton.classList.add('pc-move-button');
    if (location === 'team') {
        moveButton.textContent = 'To PC'; moveButton.disabled = selectedTrainerData.pcBox.length >= MAX_PC_BOX_SIZE;
        moveButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonToPc(index); });
    } else {
        moveButton.textContent = 'To Team'; moveButton.disabled = selectedTrainerData.team.length >= MAX_TEAM_SIZE;
        moveButton.addEventListener('click', (e) => { e.stopPropagation(); movePokemonToTeam(index); });
    }
    pCard.appendChild(moveButton); return pCard;
}

function movePokemonToPc(teamIndex) {
    if (!selectedTrainerData || !selectedTrainerData.team[teamIndex] || selectedTrainerData.pcBox.length >= MAX_PC_BOX_SIZE) { alert("Cannot move Pokémon to PC. PC might be full or Pokémon not found."); return; }
    if (selectedTrainerData.team.length <= 1 && selectedTrainerData.team[teamIndex]) { alert("You must keep at least one Pokémon in your team!"); return; }
    const pokemonToMove = selectedTrainerData.team.splice(teamIndex, 1)[0]; selectedTrainerData.pcBox.push(pokemonToMove);
    saveGame(); showPcBoxScreen();
}

function movePokemonToTeam(pcIndex) {
    if (!selectedTrainerData || !selectedTrainerData.pcBox[pcIndex] || selectedTrainerData.team.length >= MAX_TEAM_SIZE) { alert("Cannot move Pokémon to team. Team might be full or Pokémon not found."); return; }
    const pokemonToMove = selectedTrainerData.pcBox.splice(pcIndex, 1)[0]; selectedTrainerData.team.push(pokemonToMove);
    saveGame(); showPcBoxScreen();
}

function isSpecialTcgCard(cardData) {
    if (!cardData) return false;
    if (cardData.rarity && TCG_SPECIAL_RARITIES.includes(cardData.rarity)) {
        return true;
    }
    if (cardData.subtypes && cardData.subtypes.some(subtype => TCG_SPECIAL_SUBTYPES.includes(subtype))) {
        return true;
    }
    // Add more specific checks, e.g., for "Shiny" based on name or set convention if API doesn't directly label
    if (cardData.tcgCardName && cardData.tcgCardName.toLowerCase().includes("shiny")) return true;
    return false;
}

async function openTcgPackAnimation(pulledCards) {
    screens.tcgPackOpeningOverlay.style.display = 'flex';
    tcgPackAnimationContainer.innerHTML = ''; // Clear previous content
    closeTcgRevealButton.style.display = 'none'; // Hide close button initially

    // 1. Show Pack Visual (Placeholder for actual pack image)
    const packVisual = document.createElement('div');
    packVisual.classList.add('tcg-pack-visual');
    // Ideally, you'd have an image of a TCG pack here
    packVisual.innerHTML = `<img src="https://assets.pokemon.com/assets/cms2/img/trading-card-game/series/incrementals/scarlet-violet-151/booster/scarlet-violet-151-booster-169-en.png" alt="TCG Pack">`; // Placeholder pack image
    tcgPackAnimationContainer.appendChild(packVisual);

    // Basic "shake" animation using Anime.js (optional)
    if (typeof anime === 'function') {
        anime({
            targets: packVisual,
            translateX: [{value: -10, duration:50}, {value: 10, duration:100}, {value: -10, duration:100}, {value: 0, duration:50}],
            loop: 3,
            easing: 'easeInOutSine',
            delay: 500
        });
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for shake or just a delay

    // 2. "Tear open" pack (hide visual, show "opening" message or effect)
    packVisual.style.display = 'none';
    const openingMessage = document.createElement('p');
    openingMessage.textContent = "Revealing cards...";
    tcgPackAnimationContainer.appendChild(openingMessage);

    await new Promise(resolve => setTimeout(resolve, 1000));
    openingMessage.style.display = 'none';

    // 3. Reveal Cards in a Grid
    const revealedCardsGrid = document.createElement('div');
    revealedCardsGrid.classList.add('revealed-cards-grid');
    tcgPackAnimationContainer.appendChild(revealedCardsGrid);

    for (let i = 0; i < pulledCards.length; i++) {
        const cardData = pulledCards[i];
        const cardItem = document.createElement('div');
        cardItem.classList.add('revealed-card-item');

        const cardImg = document.createElement('img');
        cardImg.src = cardData.spriteUrl;
        cardImg.alt = cardData.tcgCardName || cardData.pokemonGameName;
        cardItem.appendChild(cardImg);

        const cardNameP = document.createElement('p');
        cardNameP.textContent = (cardData.tcgCardName || cardData.pokemonGameName).toUpperCase();
        cardItem.appendChild(cardNameP);

        if (isSpecialTcgCard(cardData)) {
            cardItem.classList.add('special-card-highlight');
        }

        revealedCardsGrid.appendChild(cardItem);

        // Animate card appearance (simple fade-in and slide-up)
        if (typeof anime === 'function') {
            anime({
                targets: cardItem,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 500,
                delay: i * 200, // Staggered reveal
                easing: 'easeOutExpo'
            });
        } else {
            cardItem.style.opacity = 1;
            cardItem.style.transform = 'translateY(0)';
        }
        await new Promise(resolve => setTimeout(resolve, 250)); // Delay between card reveals
    }

    // 4. Show Close Button
    closeTcgRevealButton.style.display = 'block';
    tcgPackAnimationContainer.appendChild(closeTcgRevealButton); // Append to ensure it's within scrollable area
}


function buyItem(itemName, price) {
    if (!selectedTrainerData) return;
    price = parseInt(price);

    if (selectedTrainerData.coins < price) {
        alert("Not enough coins!");
        return;
    }

    if (itemName === "TCG Pack") {
        selectedTrainerData.coins -= price;
        selectedTrainerData.inventory[itemName] = (selectedTrainerData.inventory[itemName] || 0) + 1;
        updateCoinDisplay();

        screens.tcgPackOpeningOverlay.style.display = 'flex';
        tcgPackAnimationContainer.innerHTML = '<p>Fetching cards from the Pokémon TCG database...</p>';
        closeTcgRevealButton.style.display = 'none';

        const fetchPromises = [];
        for (let i = 0; i < TCG_CARDS_PER_PACK; i++) {
            const randomPokemonForTcg = pokemonPool[Math.floor(Math.random() * pokemonPool.length)];
            if (randomPokemonForTcg) {
                // API Query: Use nationalPokedexNumbers for wider results across sets.
                // We could add more specific queries for the "2 special slots" later if needed.
                const query = `nationalPokedexNumbers:${randomPokemonForTcg.pokedexId}`;
                const promise = fetch(`https://api.pokemontcg.io/v2/cards?q=${query}&pageSize=50`) // Get up to 50 cards for this Pokedex ID
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`PokemonTCG API request failed for PokedexID ${randomPokemonForTcg.pokedexId}: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(apiData => {
                        if (apiData.data && apiData.data.length > 0) {
                            // Select a random card from the returned results for this Pokémon
                            const randomCardFromApi = apiData.data[Math.floor(Math.random() * apiData.data.length)];
                            return {
                                id: `tcg-${randomCardFromApi.id}-${Date.now()}-${i}`, // Use API card ID if unique
                                pokemonGameName: randomPokemonForTcg.name, // Original Pokémon name from our pool
                                pokedexId: randomPokemonForTcg.pokedexId,
                                spriteUrl: randomCardFromApi.images.large,
                                tcgCardName: randomCardFromApi.name,
                                set: randomCardFromApi.set, // { id, name, series, printedTotal, total, legalities, ptcgoCode, releaseDate, updatedAt, images: {symbol, logo} }
                                rarity: randomCardFromApi.rarity,
                                subtypes: randomCardFromApi.subtypes || [], // Ensure subtypes is always an array
                                number: randomCardFromApi.number, // Card number in set
                                artist: randomCardFromApi.artist,
                            };
                        } else {
                            console.warn(`No TCG card found for ${randomPokemonForTcg.name} (ID: ${randomPokemonForTcg.pokedexId}) via API. Using fallback.`);
                            return createFallbackTcgCard(randomPokemonForTcg, `fallback-${i}`);
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching TCG card:", error);
                        return createFallbackTcgCard(pokemonPool[Math.floor(Math.random() * pokemonPool.length)], `error-${i}`);
                    });
                fetchPromises.push(promise);
            } else {
                fetchPromises.push(Promise.resolve(createFallbackTcgCard(pokemonPool[0] || {name:"MISSINGNO", pokedexId:0}, `empty-pool-${i}`)));
            }
        }

        Promise.all(fetchPromises)
            .then(pulledCardsData => {
                const validPulledCards = pulledCardsData.filter(card => card);

                if (validPulledCards.length > 0) {
                    selectedTrainerData.collectedTcgCards = selectedTrainerData.collectedTcgCards || [];
                    validPulledCards.forEach(card => selectedTrainerData.collectedTcgCards.push(card));
                    openTcgPackAnimation(validPulledCards);
                } else {
                    tcgPackAnimationContainer.innerHTML = '<p>Could not retrieve any cards for this pack. Please try again.</p>';
                    closeTcgRevealButton.style.display = 'block'; // Allow closing
                }
                saveGame();
            })
            .catch(overallError => {
                console.error("Error in processing TCG pack promises:", overallError);
                tcgPackAnimationContainer.innerHTML = `<p>An error occurred while opening the TCG pack: ${overallError.message}. The pack has been consumed.</p>`;
                closeTcgRevealButton.style.display = 'block';
                saveGame();
            });

    } else {
        selectedTrainerData.coins -= price;
        selectedTrainerData.inventory[itemName] = (selectedTrainerData.inventory[itemName] || 0) + 1;
        alert(`Successfully bought 1 ${itemName}!`);
        updateCoinDisplay();
        saveGame();
    }
}

function createFallbackTcgCard(pokemonData, suffix = "") {
    return {
        id: `tcg-${pokemonData.pokedexId}-${Date.now()}-${suffix}`,
        pokemonGameName: pokemonData.name,
        pokedexId: pokemonData.pokedexId,
        spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonData.pokedexId}.png`, // Game sprite
        tcgCardName: pokemonData.name.toUpperCase() + " (Fallback Art)",
        set: { id: "fallback", name: "Fallback Set", series: "N/A", images: {logo: "", symbol: ""}},
        rarity: "Common",
        subtypes: [],
        number: "N/A",
        artist: "N/A"
    };
}


function getUniqueRandomPokemon(existingPokedexIds, fromPool) {
    const available = fromPool.filter(p => !existingPokedexIds.includes(p.pokedexId));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}

function startQuickBattle() {
    battleState.isWildBattle = false; battleState.isGymBattle = false; battleState.isEliteFourBattle = false;
    battleState.playerTeam = []; battleState.opponentTeam = [];
    let availableForPlayer = [...pokemonPool]; let playerPokedexIds = [];
    for (let i = 0; i < 3; i++) {
        if (availableForPlayer.length === 0) break;
        let poolIdx = Math.floor(Math.random() * availableForPlayer.length);
        let chosenData = availableForPlayer.splice(poolIdx, 1)[0];
        battleState.playerTeam.push(createPokemonFromData(chosenData, false, true)); playerPokedexIds.push(chosenData.pokedexId);
    }
    let availableForOpponent = pokemonPool.filter(p => !playerPokedexIds.includes(p.pokedexId));
    if (availableForOpponent.length < 3) { availableForOpponent = [...pokemonPool]; }
    for (let i = 0; i < 3; i++) {
        if (availableForOpponent.length === 0) {
             if (pokemonPool.length > 0) battleState.opponentTeam.push(createPokemonFromData(pokemonPool[Math.floor(Math.random()*pokemonPool.length)], true, false));
             else break;
        } else {
            let poolIdx = Math.floor(Math.random() * availableForOpponent.length);
            let chosenData = availableForOpponent.splice(poolIdx, 1)[0];
            battleState.opponentTeam.push(createPokemonFromData(chosenData, true, false));
        }
    }
    if (battleState.playerTeam.length === 0 || battleState.opponentTeam.length === 0) { alert("Error: Could not set up teams for Quick Battle."); switchScreen('mainMenu'); return; }
    battleState.playerActiveIndex = 0; battleState.opponentActiveIndex = 0;
    updateBattleUI(); switchScreen('battle');
    const opponent = battleState.opponentTeam[0]; const introMsg = opponent.isShiny ? `Opponent sent out SHINY ${opponent.name.toUpperCase()}!` : `Opponent sent out ${opponent.name.toUpperCase()}!`;
    typeMessage(introMsg, () => { battleState.onMessageComplete = () => { typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase); } });
}

function prepareBattle(battleFunction, isEliteFour = false) {
    if (!selectedTrainerData || !selectedTrainerData.team || selectedTrainerData.team.length === 0) { alert("You have no Pokémon!"); switchScreen('mainMenu'); return; }
    selectedTrainerData.team.forEach(p => {
        if(p) {
            p.currentHP = p.maxHP; p.status = null; p.sleepTurns = 0; p.flinch = false;
            p.stats = { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 };
            p.moves.forEach(m => m.currentPp = m.maxPp);
            if (p.originalEvolutionData) {
                const oldMaxHPBeforeRevert = p.maxHP; const currentHPRatio = (oldMaxHPBeforeRevert > 0) ? (p.currentHP / oldMaxHPBeforeRevert) : 1;
                p.pokedexId = p.originalEvolutionData.pokedexId; p.name = p.originalEvolutionData.name; p.types = [...p.originalEvolutionData.types];
                p.maxHP = p.originalEvolutionData.maxHP; p.currentHP = Math.max(0, Math.floor(currentHPRatio * p.maxHP));
                p.baseStats = JSON.parse(JSON.stringify(p.originalEvolutionData.baseStats)); p.moves = p.originalEvolutionData.moves.map(m => ({ ...m, currentPp: m.maxPp }));
                p.isShiny = p.originalEvolutionData.isShiny;
                const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
                const basePokemonForSprite = pokemonPool.find(baseP => baseP.pokedexId === p.pokedexId) || {};
                p.spriteFrontUrl = p.isShiny ? `${shinyBaseUrl}/shiny/${p.pokedexId}.png` : (basePokemonForSprite.spriteFront || `${shinyBaseUrl}/${p.pokedexId}.png`);
                p.spriteBackUrl = p.isShiny ? `${shinyBaseUrl}/back/shiny/${p.pokedexId}.png` : (basePokemonForSprite.spriteBack || `${shinyBaseUrl}/back/${p.pokedexId}.png`);
                p.originalEvolutionData = null;
            }
        }
    });
    const requiredTeamSize = isEliteFour ? 6 : 3;
    if (selectedTrainerData.team.length < requiredTeamSize && isEliteFour) { alert(`You need at least ${requiredTeamSize} Pokémon for an Elite Four battle!`); switchScreen('playMenu'); return; }
    if (selectedTrainerData.team.length > requiredTeamSize || (isEliteFour && selectedTrainerData.team.length > 0)) {
        battleState.pendingBattleStartFunction = battleFunction; showTeamSelectScreen(isEliteFour);
    } else {
        battleState.playerTeam = JSON.parse(JSON.stringify(selectedTrainerData.team.filter(p => p))); battleFunction();
    }
}

function showTeamSelectScreen(isEliteFour = false) {
    teamSelectGridEl.innerHTML = ''; battleState.selectedBattleTeamIndexes = []; teamSelectConfirmButton.disabled = true;
    const numToSelect = isEliteFour ? 6 : 3; if (teamSelectTitleEl) { teamSelectTitleEl.textContent = `SELECT YOUR BATTLE TEAM (CHOOSE ${numToSelect})`; }
    selectedTrainerData.team.forEach((pokemon, index) => {
        if (!pokemon) return; const opt = document.createElement('div'); opt.classList.add('team-select-option'); opt.dataset.index = index;
        const sp = document.createElement('img'); sp.src = pokemon.spriteFrontUrl; sp.alt = pokemon.name.toUpperCase(); opt.appendChild(sp);
        const nfo = document.createElement('div'); nfo.classList.add('team-select-info');
        nfo.innerHTML = `<span class="name">${pokemon.name.toUpperCase()}</span><div class="hp-bar-container"><div class="hp-bar-fill" style="width:${Math.max(0,(pokemon.currentHP/pokemon.maxHP)*100)}%; background-color:${pokemon.currentHP/pokemon.maxHP > 0.5 ? 'var(--hp-high-color)' : (pokemon.currentHP/pokemon.maxHP > 0.2 ? 'var(--hp-medium-color)' : 'var(--hp-low-color)')};"></div></div><div class="hp-numbers">${Math.max(0,Math.floor(pokemon.currentHP))}/${pokemon.maxHP}</div>`; opt.appendChild(nfo);
        if (pokemon.currentHP <= 0) { opt.classList.add('fainted', 'disabled'); } else { opt.addEventListener('click', () => toggleTeamSelectOption(opt, index, numToSelect)); }
        teamSelectGridEl.appendChild(opt);
    });
    switchScreen('teamSelect');
}

function toggleTeamSelectOption(optionElement, pokemonIndex, numToSelect) {
    if (optionElement.classList.contains('fainted')) return;
    const indexInSelection = battleState.selectedBattleTeamIndexes.indexOf(pokemonIndex);
    if (indexInSelection > -1) { battleState.selectedBattleTeamIndexes.splice(indexInSelection, 1); optionElement.classList.remove('selected'); }
    else { if (battleState.selectedBattleTeamIndexes.length < numToSelect) { battleState.selectedBattleTeamIndexes.push(pokemonIndex); optionElement.classList.add('selected'); } else { alert(`You can only select up to ${numToSelect} Pokémon.`); } }
    teamSelectConfirmButton.disabled = battleState.selectedBattleTeamIndexes.length !== numToSelect;
}

teamSelectConfirmButton.addEventListener('click', () => {
    const numRequired = battleState.isEliteFourBattle ? 6 : 3;
    if (battleState.selectedBattleTeamIndexes.length === numRequired) {
        battleState.playerTeam = battleState.selectedBattleTeamIndexes.map(index => JSON.parse(JSON.stringify(selectedTrainerData.team[index])));
        if (battleState.pendingBattleStartFunction) { battleState.pendingBattleStartFunction(); battleState.pendingBattleStartFunction = null; }
    } else { alert(`Please select exactly ${numRequired} Pokémon.`); }
});

function startWildBattleActual() {
    battleState.isWildBattle = true; battleState.isGymBattle = false; battleState.isEliteFourBattle = false; battleState.opponentTeam = [];
    const wildPokemonData = pokemonPool[Math.floor(Math.random() * pokemonPool.length)]; battleState.opponentTeam.push(createPokemonFromData(wildPokemonData, true, false));
    battleState.playerActiveIndex = 0; battleState.opponentActiveIndex = 0;
    updateBattleUI(); switchScreen('battle');
    const opponent = battleState.opponentTeam[0]; const introMsg = opponent.isShiny ? `A wild SHINY ${opponent.name.toUpperCase()} appeared!` : `A wild ${opponent.name.toUpperCase()} appeared!`;
    typeMessage(introMsg, () => { battleState.onMessageComplete = () => { typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase); } });
}

function startGymBattleActual() {
    battleState.isWildBattle = false; battleState.isGymBattle = true; battleState.isEliteFourBattle = false;
    const leaderData = gymLeadersData[battleState.currentGymLeaderKey]; if (!leaderData) { alert("Error: Gym Leader data not found!"); switchScreen('playMenu'); return; }
    battleState.opponentTeam = leaderData.pokemonTeam.map(pokemonName => {
        const pokemonBase = pokemonPool.find(p => p.name.toUpperCase() === pokemonName.toUpperCase());
        if (!pokemonBase) {
            console.error(`Pokemon ${pokemonName} not found in pool for Gym Leader ${leaderData.name}. Check data.`);
            const idMatch = pokemonPool.find(p => p.pokedexId === parseInt(pokemonName));
            if (!idMatch) { console.error(`Pokemon ${pokemonName} (ID) also not found for Gym Leader.`); return null; }
            return createPokemonFromData(idMatch, true, false);
        }
        return createPokemonFromData(pokemonBase, true, false);
    }).filter(p => p !== null);
    if (battleState.opponentTeam.length === 0) { alert(`Error: Could not set up Gym Leader ${leaderData.name}'s team.`); switchScreen('playMenu'); return; }
    battleState.playerActiveIndex = 0; battleState.opponentActiveIndex = 0;
    updateBattleUI(); switchScreen('battle');
    const opponent = battleState.opponentTeam[0]; const introMsg = `${leaderData.name} challenges you! ${leaderData.name} sent out ${opponent.name.toUpperCase()}!`;
    typeMessage(introMsg, () => { battleState.onMessageComplete = () => { typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase); } });
}

function startEliteFourBattleActual() {
    battleState.isWildBattle = false; battleState.isGymBattle = false; battleState.isEliteFourBattle = true;
    const memberData = eliteFourData[battleState.currentEliteFourMemberKey]; if (!memberData) { alert("Error: Elite Four Member data not found!"); switchScreen('playMenu'); return; }
    battleState.opponentTeam = memberData.pokemonTeam.map(pokemonName => {
        const pokemonBase = pokemonPool.find(p => p.name.toUpperCase() === pokemonName.toUpperCase());
        if (!pokemonBase) {
             console.error(`Pokemon ${pokemonName} not found in pool for Elite Four ${memberData.name}. Check data.`);
            const idMatch = pokemonPool.find(p => p.pokedexId === parseInt(pokemonName));
            if (!idMatch) { console.error(`Pokemon ${pokemonName} (ID) also not found for Elite Four.`); return null;}
            return createPokemonFromData(idMatch, true, false);
        }
        return createPokemonFromData(pokemonBase, true, false);
    }).filter(p => p !== null);
    if (battleState.opponentTeam.length === 0) { alert(`Error: Could not set up Elite Four ${memberData.name}'s team.`); switchScreen('playMenu'); return; }
    battleState.playerActiveIndex = 0; battleState.opponentActiveIndex = 0;
    updateBattleUI(); switchScreen('battle');
    const opponent = battleState.opponentTeam[0]; const introMsg = `Elite Four ${memberData.name} challenges you! ${memberData.name} sent out ${opponent.name.toUpperCase()}!`;
    typeMessage(introMsg, () => { battleState.onMessageComplete = () => { typeMessage(`Go ${battleState.playerTeam[0].name.toUpperCase()}!`, startTurnPhase); } });
}

function startTurnPhase() { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted startTurnPhase with undefined active Pokemon."); return;} battleState.playerTeam[battleState.playerActiveIndex].flinch = false; if (battleState.opponentTeam[battleState.opponentActiveIndex]) battleState.opponentTeam[battleState.opponentActiveIndex].flinch = false; battleState.attackerUsedMoveFirstThisTurn = false; determineMoveOrder(); }
function determineMoveOrder() { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted determineMoveOrder with undefined Pokemon."); return;} const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex]; const playerMoveCheck = checkCanMove(playerPokemon, true); if (playerMoveCheck.message) { typeMessage(playerMoveCheck.message, () => { if (!playerMoveCheck.canMove) { battleState.currentActingPokemonIsPlayer = false; opponentActionPhase(); } else { playerActionPhase(); } }); } else { playerActionPhase(); } }
function playerActionPhase() {
    if(!battleState.playerTeam[battleState.playerActiveIndex]) { console.warn("Attempted playerActionPhase with undefined active Pokemon."); return; }
    battleState.playerTurn = true; battleState.currentActingPokemonIsPlayer = true;
    const activePlayerPokemon = battleState.playerTeam[battleState.playerActiveIndex];
    actionMenuEl.style.display = 'none'; moveMenuEl.style.display = 'none'; itemMenuEl.style.display = 'none';
    const itemButtonInActionMenu = actionMenuEl.querySelector('button[data-action="item"]');
    if (itemButtonInActionMenu) {
        itemButtonInActionMenu.style.display = 'block'; let hasAnyUsableItem = false;
        if (selectedTrainerData && selectedTrainerData.inventory && activePlayerPokemon) {
            if ((selectedTrainerData.inventory["Evolution Stone"] > 0 || selectedTrainerData.inventory["Perma Evolution Stone"] > 0) && getEvolutionTarget(activePlayerPokemon.pokedexId)) { hasAnyUsableItem = true; }
            if (battleState.isWildBattle && (selectedTrainerData.inventory["Poke Ball"] > 0 || selectedTrainerData.inventory["Great Ball"] > 0)) { hasAnyUsableItem = true; }
        }
        itemButtonInActionMenu.disabled = !hasAnyUsableItem || battleState.isGymBattle || battleState.isEliteFourBattle; // Items disabled in Gym/E4
    }
    const runButtonInActionMenu = actionMenuEl.querySelector('button[data-action="run"]');
    if (runButtonInActionMenu) { runButtonInActionMenu.style.display = 'block'; runButtonInActionMenu.disabled = battleState.isGymBattle || battleState.isEliteFourBattle; }
    const pokemonButtonInActionMenu = actionMenuEl.querySelector('button[data-action="pokemon"]');
    if (pokemonButtonInActionMenu) { pokemonButtonInActionMenu.style.display = 'block'; const switchablePokemon = battleState.playerTeam.filter((p, i) => p.currentHP > 0 && i !== battleState.playerActiveIndex); pokemonButtonInActionMenu.disabled = switchablePokemon.length === 0; }
    const fightButtonInActionMenu = actionMenuEl.querySelector('button[data-action="fight"]');
    if (fightButtonInActionMenu) { fightButtonInActionMenu.style.display = 'block'; fightButtonInActionMenu.disabled = false; }
    typeMessage(`What will ${activePlayerPokemon.name.toUpperCase()} do?`, () => { actionMenuEl.style.display = 'grid'; updateBattleUI(); });
}
function opponentActionPhase() { if(!battleState.opponentTeam[battleState.opponentActiveIndex] || !battleState.playerTeam[battleState.playerActiveIndex]) {console.warn("Attempted opponentActionPhase with undefined Pokemon."); return;} battleState.playerTurn = false; battleState.currentActingPokemonIsPlayer = false; const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex]; const opponentMoveCheck = checkCanMove(opponentPokemon, false); if (opponentMoveCheck.message) { typeMessage(opponentMoveCheck.message, () => { if (!opponentMoveCheck.canMove) { handleEndOfTurnStatusEffects(); } else { opponentChooseAndExecuteMove(); } }); } else { opponentChooseAndExecuteMove(); } }
function opponentChooseAndExecuteMove() { if(!battleState.opponentTeam[battleState.opponentActiveIndex] || !battleState.playerTeam[battleState.playerActiveIndex]) {console.warn("Attempted opponentChooseAndExecuteMove with undefined Pokemon."); return;} const attacker = battleState.opponentTeam[battleState.opponentActiveIndex]; const defender = battleState.playerTeam[battleState.playerActiveIndex]; if (attacker.currentHP <= 0) { handleOpponentFaint(); return; } let availableMoves = attacker.moves.filter(m => m.currentPp > 0); if (availableMoves.length === 0) { typeMessage(`${attacker.name.toUpperCase()} has no moves left!`, () => handleEndOfTurnStatusEffects()); return; } const move = availableMoves[Math.floor(Math.random() * availableMoves.length)]; executeMove(attacker, defender, move, false); }
function checkCanMove(pokemon, isPlayer) { if (!pokemon) return { canMove: false, message: null}; const name = pokemon.name.toUpperCase(); if (pokemon.flinch) { pokemon.flinch = false; return { canMove: false, message: `${name} flinched and couldn't move!` }; } if (pokemon.status === "SLP") { if (pokemon.sleepTurns > 0) { pokemon.sleepTurns--; return { canMove: false, message: `${name} is fast asleep.` }; } else { pokemon.status = null; updateStatusTag(pokemon, isPlayer ? playerStatusTagEl : opponentStatusTagEl); return { canMove: true, message: `${name} woke up!` }; } } if (pokemon.status === "FRZ") { if (Math.random() < FREEZE_THAW_CHANCE) { pokemon.status = null; updateStatusTag(pokemon, isPlayer ? playerStatusTagEl : opponentStatusTagEl); return { canMove: true, message: `${name} thawed out!` }; } else { return { canMove: false, message: `${name} is frozen solid!` }; } } if (pokemon.status === "PAR") { if (Math.random() < PARALYSIS_CHANCE_NO_MOVE) { return { canMove: false, message: `${name} is fully paralyzed!` }; } } return { canMove: true, message: null }; }
function showMoveMenu() { if(!battleState.playerTeam[battleState.playerActiveIndex]) {console.warn("Attempted showMoveMenu with undefined Pokemon.");return;} actionMenuEl.style.display = 'none'; battleTextboxEl.style.display = 'none'; itemMenuEl.style.display = 'none'; const pPok = battleState.playerTeam[battleState.playerActiveIndex]; const moveBtns = moveMenuEl.querySelectorAll('button:not(.battle-menu-back-button)'); moveBtns.forEach(b => b.style.visibility = 'hidden'); pPok.moves.forEach((m, i) => { if (moveBtns[i]) { moveBtns[i].style.visibility = 'visible'; moveBtns[i].querySelector('.move-name').textContent = m.name.toUpperCase(); moveBtns[i].querySelector('.move-pp').textContent = `PP ${m.currentPp}/${m.maxPp}`; moveBtns[i].disabled = m.currentPp <= 0; } }); moveMenuEl.style.display = 'grid'; }
function applyStatChange(targetPokemon, stat, stages, targetName, isSelf) { const statNames = Array.isArray(stat) ? stat : [stat]; let messages = []; let anyChange = false; statNames.forEach(s => { const currentStage = targetPokemon.stats[s] || 0; let newStage = currentStage; if (stages > 0) newStage = Math.min(6, currentStage + stages); else if (stages < 0) newStage = Math.max(-6, currentStage + stages); if (newStage !== currentStage) { targetPokemon.stats[s] = newStage; anyChange = true; if (stages === 1) messages.push(`${targetName.toUpperCase()}'s ${s} rose!`); else if (stages > 1) messages.push(`${targetName.toUpperCase()}'s ${s} sharply rose!`); else if (stages === -1) messages.push(`${(isSelf ? targetName.toUpperCase() : "Foe " + targetName.toUpperCase())}'s ${s} fell!`); else if (stages < -1) messages.push(`${(isSelf ? targetName.toUpperCase() : "Foe " + targetName.toUpperCase())}'s ${s} harshly fell!`); } }); if (!anyChange) messages.push(`${targetName.toUpperCase()}'s ${statNames.join(' and ')} won't go any ${stages > 0 ? 'higher' : 'lower'}!`); return messages; }
function executeMove(attacker, defender, move, isPlayerAttacking) { battleState.currentActingPokemonIsPlayer = isPlayerAttacking; const attackerName = attacker.name.toUpperCase(); const defenderName = defender.name.toUpperCase(); let turnMessages = []; if (isPlayerAttacking) battleState.playerSelectedMove = move; else battleState.opponentSelectedMove = move; if (attacker.flinch) { attacker.flinch = false; typeMessage(`${attackerName} flinched!`, () => { if (isPlayerAttacking && battleState.opponentTeam[battleState.opponentActiveIndex]?.currentHP > 0) { opponentActionPhase(); } else if (!isPlayerAttacking && battleState.playerTeam[battleState.playerActiveIndex]?.currentHP > 0) { handleEndOfTurnStatusEffects(); } else { handleEndOfTurnStatusEffects(); } }); return; } move.currentPp--; if(isPlayerAttacking) updateBattleUI(); turnMessages.push({ message: `${attackerName} used ${move.name.toUpperCase()}!`, callback: () => { let hit = true; if (!move.alwaysHits) { const moveAccuracy = move.accuracy || 100; const attackerAccStage = attacker.stats.accuracy || 0; const defenderEvaStage = defender.stats.evasion || 0; const accModifier = calculateStatWithStage(100, attackerAccStage, 'accuracy') / 100; const evaModifier = calculateStatWithStage(100, defenderEvaStage, 'evasion') / 100; const finalAccuracy = moveAccuracy * (accModifier / evaModifier); if (Math.random() * 100 >= finalAccuracy) hit = false; } if (!hit) { turnMessages.push({ message: `${attackerName}'s attack missed!`, callback: () => { if (isPlayerAttacking && battleState.opponentTeam[battleState.opponentActiveIndex]?.currentHP > 0) { opponentActionPhase(); } else { handleEndOfTurnStatusEffects(); } }}); processTurnMessages(turnMessages); return; } playAttackAnimation(move.type, isPlayerAttacking ? playerPokemonSpriteEl.parentElement : opponentPokemonSpriteEl.parentElement, isPlayerAttacking ? opponentPokemonSpriteEl.parentElement : playerPokemonSpriteEl.parentElement, () => { playShakeAnimation(isPlayerAttacking ? opponentPokemonSpriteEl.parentElement : playerPokemonSpriteEl.parentElement); let effectivenessMultiplier = 1; let calculatedDamage = 0; let isCrit = false; if (move.power > 0) { effectivenessMultiplier = calculateTypeEffectiveness(move.type, defender.types); if (effectivenessMultiplier === 0) { calculatedDamage = 0; } else { let critChance = CRITICAL_HIT_CHANCE_BASE * (move.highCritRatio ? 2 : 1); if (Math.random() < critChance) isCrit = true; let effAttackerAttack = calculateStatWithStage(attacker.baseStats.attack, attacker.stats.attack, 'attack'); let effDefenderDefense = calculateStatWithStage(defender.baseStats.defense, defender.stats.defense, 'defense'); if (isCrit) { if (attacker.stats.attack < 0) effAttackerAttack = attacker.baseStats.attack; if (defender.stats.defense > 0) effDefenderDefense = defender.baseStats.defense; } calculatedDamage = Math.max(1, Math.floor((((((2 * GAME_LEVEL / 5 + 2) * effAttackerAttack * move.power) / effDefenderDefense) / 50) + 2) * effectivenessMultiplier * (isCrit ? CRITICAL_HIT_MULTIPLIER : 1))); } defender.currentHP -= calculatedDamage; } else if (move.effect && move.effect.type === "fixed_damage") { calculatedDamage = move.effect.damage; defender.currentHP -= calculatedDamage;} updateBattleUI(); if (isCrit) turnMessages.push({ message: "A critical hit!" }); const effText = getEffectivenessText(effectivenessMultiplier, defenderName); if (effText && move.power > 0) turnMessages.push({ message: effText }); if (move.effect) { const effect = move.effect; const canApplyEffect = effectivenessMultiplier > 0 || move.effect.type === "stat" || move.effect.type === "heal"; if (effect.type === "status" && defender.status === null && canApplyEffect && (!effect.chance || Math.random() < effect.chance)) { defender.status = effect.condition; if (effect.condition === "SLP") defender.sleepTurns = Math.floor(Math.random() * 3) + 2; else if (effect.condition === "FRZ" && defender.types.includes("Ice")) {} else turnMessages.push({ message: `${defenderName} was ${effect.condition === "BRN" ? "burned" : effect.condition === "PSN" ? "poisoned" : effect.condition === "PAR" ? "paralyzed" : effect.condition === "SLP" ? "put to sleep" : "frozen"}!` }); } else if (effect.type === "stat" && canApplyEffect && (!effect.chance || Math.random() < effect.chance)) { const target = effect.target === "self" ? attacker : defender; const targetN = effect.target === "self" ? attackerName : defenderName; const statMsgs = applyStatChange(target, effect.stat, effect.stages, targetN, effect.target === "self"); statMsgs.forEach(m => turnMessages.push({message: m})); } else if (effect.type === "heal" && effect.target === "self") { const healAmount = Math.floor(attacker.maxHP * effect.percentage); attacker.currentHP = Math.min(attacker.maxHP, attacker.currentHP + healAmount); turnMessages.push({ message: `${attackerName} recovered health!` }); } else if (effect.type === "switch" && effect.target === "opponent" && canApplyEffect) { const targetTeam = isPlayerAttacking ? battleState.opponentTeam : battleState.playerTeam; const currentActiveIdx = isPlayerAttacking ? battleState.opponentActiveIndex : battleState.playerActiveIndex; const availableSwitch = targetTeam.filter((p, i) => p.currentHP > 0 && i !== currentActiveIdx); if (availableSwitch.length > 0) { const oldTargetName = targetTeam[currentActiveIdx].name.toUpperCase(); const newTargetIdx = targetTeam.indexOf(availableSwitch[Math.floor(Math.random() * availableSwitch.length)]); if (isPlayerAttacking) battleState.opponentActiveIndex = newTargetIdx; else battleState.playerActiveIndex = newTargetIdx; turnMessages.push({ message: `${oldTargetName} was dragged out!` }); turnMessages.push({ message: `${(isPlayerAttacking ? "Opponent sent out " : "Go ")}${targetTeam[newTargetIdx].name.toUpperCase()}!`}); battleState.attackerUsedMoveFirstThisTurn = true; } else { turnMessages.push({ message: "But it failed!"}); } } else if (effect.type === "flinch" && canApplyEffect && (!effect.chance || Math.random() < effect.chance)) { if (battleState.attackerUsedMoveFirstThisTurn && !defender.flinch) { defender.flinch = true; } } updateBattleUI(); } processTurnMessages(turnMessages, isPlayerAttacking ? defender : attacker, isPlayerAttacking); }); }}); processTurnMessages(turnMessages, isPlayerAttacking ? defender : attacker, isPlayerAttacking); }
function processTurnMessages(messages, nextPokemonToActIfApplicable, isOriginalAttackerPlayer) { if (messages.length > 0) { const nextMsg = messages.shift(); typeMessage(nextMsg.message, nextMsg.callback || (() => processTurnMessages(messages, nextPokemonToActIfApplicable, isOriginalAttackerPlayer))); } else { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted processTurnMessages with undefined Pokemon."); return;} const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex]; const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex]; if (playerPokemon.currentHP <= 0) { handlePlayerFaint(); return; } if (opponentPokemon.currentHP <= 0) { handleOpponentFaint(); return; } if (isOriginalAttackerPlayer) { opponentActionPhase(); } else { handleEndOfTurnStatusEffects(); } } }
function playerAttack(moveIndex) { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted playerAttack with undefined Pokemon."); return;} moveMenuEl.style.display = 'none'; const attacker = battleState.playerTeam[battleState.playerActiveIndex]; const defender = battleState.opponentTeam[battleState.opponentActiveIndex]; const move = attacker.moves[moveIndex]; if (!move || move.currentPp <= 0) { playerActionPhase(); return; } battleState.attackerUsedMoveFirstThisTurn = true; executeMove(attacker, defender, move, true); }
function handleEndOfTurnStatusEffects() { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted handleEOT with undefined Pokemon."); return;} let turnEndMessages = []; let playerFaintedFromStatus = false; let opponentFaintedFromStatus = false; const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex]; const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex]; const applyEOT = (pokemon, isPlayer) => { if (pokemon.currentHP > 0 && pokemon.status) { if (pokemon.status === "BRN" || pokemon.status === "PSN") { const damage = Math.floor(pokemon.maxHP / (pokemon.status === "PSN" ? 8 : 16)); pokemon.currentHP -= damage; turnEndMessages.push({ message: `${pokemon.name.toUpperCase()} was hurt by its ${pokemon.status === "BRN" ? "burn" : "poison"}!` }); if (pokemon.currentHP <= 0) isPlayer ? playerFaintedFromStatus = true : opponentFaintedFromStatus = true; } } }; applyEOT(playerPokemon, true); if (playerFaintedFromStatus) turnEndMessages.push({ message: `${playerPokemon.name.toUpperCase()} fainted!` }); if (opponentPokemon.currentHP > 0) { applyEOT(opponentPokemon, false); if (opponentFaintedFromStatus) turnEndMessages.push({ message: `${opponentPokemon.name.toUpperCase()} fainted!` }); } updateBattleUI(); const showEOTMessages = () => { if (turnEndMessages.length > 0) { const msg = turnEndMessages.shift(); typeMessage(msg.message, showEOTMessages); } else { if (playerPokemon.currentHP <= 0) handlePlayerFaint(); else if (opponentPokemon.currentHP <= 0) handleOpponentFaint(); else setTimeout(startTurnPhase, 800); } }; showEOTMessages(); }
function showSwitchScreen(isForced = false) { battleState.switchingAfterFaint = isForced; actionMenuEl.style.display = 'none'; moveMenuEl.style.display = 'none'; itemMenuEl.style.display = 'none'; battleTextboxEl.style.display = 'none'; switchGridEl.innerHTML = ''; battleState.playerTeam.forEach((p, i) => { const opt = document.createElement('div'); opt.classList.add('switch-option'); opt.dataset.index = i; const sp = document.createElement('img'); sp.src = p.spriteFrontUrl; sp.alt = p.name.toUpperCase(); opt.appendChild(sp); const nfo = document.createElement('div'); nfo.classList.add('switch-info'); nfo.innerHTML = `<span class="name">${p.name.toUpperCase()} ${p.status ? '('+p.status.toUpperCase()+')' : ''}</span><div class="hp-bar-container"><div class="hp-bar-fill" style="width:${Math.max(0,(p.currentHP/p.maxHP)*100)}%; background-color:${p.currentHP/p.maxHP > 0.5 ? 'var(--hp-high-color)' : (p.currentHP/p.maxHP > 0.2 ? 'var(--hp-medium-color)' : 'var(--hp-low-color)')};"></div></div><div class="hp-numbers">${Math.max(0,Math.floor(p.currentHP))}/${p.maxHP}</div>`; opt.appendChild(nfo); if (p.currentHP <= 0) opt.classList.add('fainted'); else if (i === battleState.playerActiveIndex) opt.classList.add('active'); else opt.addEventListener('click', () => switchPokemonAction(i)); switchGridEl.appendChild(opt); }); switchCancelButton.style.display = isForced ? 'none' : 'block'; switchScreen('switchPokemon'); }
function switchPokemonAction(newIndex) { if(!battleState.playerTeam[battleState.playerActiveIndex] || !battleState.playerTeam[newIndex]) {console.warn("Attempted switchPokemonAction with undefined Pokemon."); return;} const oldPok = battleState.playerTeam[battleState.playerActiveIndex]; const newPok = battleState.playerTeam[newIndex]; if (newPok.currentHP <= 0 || newIndex === battleState.playerActiveIndex) return; battleState.playerActiveIndex = newIndex; updateBattleUI(); switchScreen('battle'); let msgs = []; if (!battleState.switchingAfterFaint) { msgs.push({ message: `Come back, ${oldPok.name.toUpperCase()}!`}); battleState.playerTurn = false; } msgs.push({ message: `Go, ${newPok.name.toUpperCase()}!`, callback: null }); const finalCb = () => { battleState.switchingAfterFaint = false; if (!battleState.playerTurn && battleState.opponentTeam[battleState.opponentActiveIndex] && battleState.opponentTeam[battleState.opponentActiveIndex].currentHP > 0) { opponentActionPhase(); } else { startTurnPhase(); } }; const showNxt = () => { if (msgs.length > 0) { const n = msgs.shift(); typeMessage(n.message, n.callback || showNxt); } else { setTimeout(finalCb, 500); } }; showNxt(); }

function finalizeBattleState() {
    if (!selectedTrainerData || !selectedTrainerData.team) return;
    battleState.playerTeam.forEach(battlePok => {
        if(!battlePok) return; const trainerPok = selectedTrainerData.team.find(p => p && p.id === battlePok.id);
        if (trainerPok) {
            trainerPok.currentHP = Math.max(0, battlePok.currentHP); trainerPok.status = battlePok.status;
            trainerPok.sleepTurns = battlePok.sleepTurns; trainerPok.flinch = false;
            trainerPok.stats = { attack: 0, defense: 0, speed: 0, accuracy: 0, evasion: 0 };
            trainerPok.moves.forEach(tpMove => { tpMove.currentPp = tpMove.maxPp; });
            if (battlePok.originalEvolutionData) {
                const oldMaxHPBeforeRevert = trainerPok.maxHP; const currentHPRatio = (oldMaxHPBeforeRevert > 0) ? (trainerPok.currentHP / oldMaxHPBeforeRevert) : 1;
                trainerPok.pokedexId = battlePok.originalEvolutionData.pokedexId; trainerPok.name = battlePok.originalEvolutionData.name;
                trainerPok.types = [...battlePok.originalEvolutionData.types]; trainerPok.maxHP = battlePok.originalEvolutionData.maxHP;
                trainerPok.currentHP = Math.max(0, Math.floor(currentHPRatio * trainerPok.maxHP)); if (battlePok.currentHP <= 0) trainerPok.currentHP = 0;
                trainerPok.baseStats = JSON.parse(JSON.stringify(battlePok.originalEvolutionData.baseStats));
                trainerPok.moves = battlePok.originalEvolutionData.moves.map(m => ({ ...m, currentPp: m.maxPp }));
                trainerPok.isShiny = battlePok.originalEvolutionData.isShiny;
                const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
                const basePokemonForSprite = pokemonPool.find(baseP => baseP.pokedexId === trainerPok.pokedexId) || {};
                trainerPok.spriteFrontUrl = trainerPok.isShiny ? `${shinyBaseUrl}/shiny/${trainerPok.pokedexId}.png` : (basePokemonForSprite.spriteFront || `${shinyBaseUrl}/${trainerPok.pokedexId}.png`);
                trainerPok.spriteBackUrl = trainerPok.isShiny ? `${shinyBaseUrl}/back/shiny/${trainerPok.pokedexId}.png` : (basePokemonForSprite.spriteBack || `${shinyBaseUrl}/back/${trainerPok.pokedexId}.png`);
                trainerPok.originalEvolutionData = null; battlePok.originalEvolutionData = null;
            }
        }
    });
    saveGame();
}

function handlePlayerFaint() {
    if(!battleState.playerTeam[battleState.playerActiveIndex]) {console.warn("Attempted handlePlayerFaint with undefined Pokemon."); return;}
    const p = battleState.playerTeam[battleState.playerActiveIndex];
    const cb = () => {
        const rem = battleState.playerTeam.filter(pk => pk.currentHP > 0);
        if (rem.length === 0) {
            let coinsEarned = 0; let lossMessage = "You have no more Pokémon! You lost the battle!";
            if (battleState.isGymBattle) { coinsEarned = 10; lossMessage = `You lost to Gym Leader ${gymLeadersData[battleState.currentGymLeaderKey].name}! You earned ${coinsEarned} coins.`; }
            else if (battleState.isEliteFourBattle) { coinsEarned = 20; lossMessage = `You lost to Elite Four ${eliteFourData[battleState.currentEliteFourMemberKey].name}! You earned ${coinsEarned} coins.`; }
            else if (!battleState.isWildBattle) { coinsEarned = 5; lossMessage = `You lost the Quick Battle! You earned ${coinsEarned} coins.`; }
            if (selectedTrainerData && coinsEarned > 0) { selectedTrainerData.coins = (selectedTrainerData.coins || 0) + coinsEarned; updateCoinDisplay(); }
            typeMessage(lossMessage, () => setTimeout(() => {
                finalizeBattleState();
                battleState.isWildBattle = false; battleState.isGymBattle = false; battleState.isEliteFourBattle = false;
                battleState.currentGymLeaderKey = null; battleState.currentEliteFourMemberKey = null;
                switchScreen('mainMenu');
            }, 1000));
        } else { showSwitchScreen(true); }
    };
    if (battleState.isProcessingMessage) battleState.messageQueue.push({message: `${p.name.toUpperCase()} fainted!`, callback: cb});
    else typeMessage(`${p.name.toUpperCase()} fainted!`, cb);
    updateBattleUI();
}

function handleOpponentFaint() {
    if(!battleState.opponentTeam[battleState.opponentActiveIndex]) {console.warn("Attempted handleOpponentFaint with undefined Pokemon."); return;}
    const o = battleState.opponentTeam[battleState.opponentActiveIndex];
    const cb = () => {
        let coinsEarned = 0; let winMessages = [];
        if (battleState.isWildBattle) { coinsEarned = 3; winMessages.push(`The wild ${o.name.toUpperCase()} fainted! You earned ${coinsEarned} coins!`); }
        else if (battleState.isGymBattle) {
            const remOpponent = battleState.opponentTeam.filter(pk => pk.currentHP > 0);
            if (remOpponent.length === 0) {
                coinsEarned = 30; const leaderData = gymLeadersData[battleState.currentGymLeaderKey];
                winMessages.push(`You defeated Gym Leader ${leaderData.name}!`);
                winMessages.push(`You earned the ${leaderData.badgeName} and ${coinsEarned} coins!`);
                if (selectedTrainerData && !selectedTrainerData.defeatedGymLeaders.includes(battleState.currentGymLeaderKey)) { selectedTrainerData.defeatedGymLeaders.push(battleState.currentGymLeaderKey); }
            }
        } else if (battleState.isEliteFourBattle) {
            const remOpponent = battleState.opponentTeam.filter(pk => pk.currentHP > 0);
            if (remOpponent.length === 0) {
                coinsEarned = 60; const memberData = eliteFourData[battleState.currentEliteFourMemberKey];
                winMessages.push(`You defeated Elite Four ${memberData.name}!`);
                winMessages.push(`You earned their Trainer Card and ${coinsEarned} coins!`);
                if (selectedTrainerData && !selectedTrainerData.defeatedEliteFourMembers.includes(battleState.currentEliteFourMemberKey)) { selectedTrainerData.defeatedEliteFourMembers.push(battleState.currentEliteFourMemberKey); }
            }
        } else { const remOpponent = battleState.opponentTeam.filter(pk => pk.currentHP > 0); if (remOpponent.length === 0) { coinsEarned = 15; winMessages.push(`You defeated the opponent and earned ${coinsEarned} coins!`); } }
        if (selectedTrainerData && coinsEarned > 0) { selectedTrainerData.coins = (selectedTrainerData.coins || 0) + coinsEarned; updateCoinDisplay(); }
        const processWinMessages = () => {
            if (winMessages.length > 0) { typeMessage(winMessages.shift(), processWinMessages); }
            else {
                const remOpponent = battleState.opponentTeam.filter(pk => pk.currentHP > 0);
                if (remOpponent.length === 0) {
                    setTimeout(() => {
                        finalizeBattleState();
                        battleState.isWildBattle = false; battleState.isGymBattle = false; battleState.isEliteFourBattle = false;
                        battleState.currentGymLeaderKey = null; battleState.currentEliteFourMemberKey = null;
                        switchScreen('mainMenu');
                    }, 1200);
                } else {
                    let nxtIdx = -1; for (let i=0; i<battleState.opponentTeam.length; i++) if (battleState.opponentTeam[i].currentHP > 0) { nxtIdx = i; break; }
                    if (nxtIdx !== -1) {
                        battleState.opponentActiveIndex = nxtIdx; const newOpp = battleState.opponentTeam[nxtIdx];
                        const opponentName = battleState.isGymBattle ? gymLeadersData[battleState.currentGymLeaderKey].name : battleState.isEliteFourBattle ? eliteFourData[battleState.currentEliteFourMemberKey].name : "Opponent";
                        typeMessage(`${opponentName} sent out ${newOpp.name.toUpperCase()}!`, () => { updateBattleUI(); setTimeout(startTurnPhase, 800); });
                    } else { typeMessage("Error: Opponent has no more Pokémon?", () => { finalizeBattleState(); switchScreen('mainMenu'); }); }
                }
            }
        };
        typeMessage(`Foe's ${o.name.toUpperCase()} fainted!`, processWinMessages);
    };
    cb(); updateBattleUI();
}

function getEvolutionTarget(currentPokedexId) {
    const currentPokemonData = pokemonPool.find(p => p.pokedexId === currentPokedexId);
    if (currentPokemonData && typeof currentPokemonData.evolvesToPokedexId === 'number') { return pokemonPool.find(p => p.pokedexId === currentPokemonData.evolvesToPokedexId); }
    return null;
}

function evolvePokemon(pokemonToEvolve, evolvedFormData, isPermanentEvolution = false) {
    const originalName = pokemonToEvolve.name.toUpperCase(); const originalPokedexId = pokemonToEvolve.pokedexId; const wasShiny = pokemonToEvolve.isShiny;
    if (!isPermanentEvolution && !pokemonToEvolve.originalEvolutionData) {
        pokemonToEvolve.originalEvolutionData = {
            pokedexId: originalPokedexId, name: pokemonToEvolve.name, types: [...pokemonToEvolve.types], maxHP: pokemonToEvolve.maxHP,
            baseStats: JSON.parse(JSON.stringify(pokemonToEvolve.baseStats)), moves: pokemonToEvolve.moves.map(m => ({ ...m })),
            isShiny: wasShiny, spriteFrontUrl: pokemonToEvolve.spriteFrontUrl, spriteBackUrl: pokemonToEvolve.spriteBackUrl,
            evolvesToPokedexId: pokemonToEvolve.evolvesToPokedexId
        };
    } else if (isPermanentEvolution) { pokemonToEvolve.originalEvolutionData = null; }
    pokemonToEvolve.pokedexId = evolvedFormData.pokedexId; pokemonToEvolve.name = evolvedFormData.name.toUpperCase();
    pokemonToEvolve.types = [...evolvedFormData.types]; const oldMaxHP = pokemonToEvolve.maxHP; pokemonToEvolve.maxHP = evolvedFormData.hp;
    pokemonToEvolve.currentHP = Math.max(1, Math.floor((pokemonToEvolve.currentHP / oldMaxHP) * pokemonToEvolve.maxHP));
    pokemonToEvolve.baseStats = JSON.parse(JSON.stringify(evolvedFormData.baseStats));
    pokemonToEvolve.moves = evolvedFormData.moves.map(m => ({ ...m, currentPp: m.maxPp }));
    pokemonToEvolve.evolvesToPokedexId = evolvedFormData.evolvesToPokedexId || null; pokemonToEvolve.isShiny = wasShiny;
    const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
    pokemonToEvolve.spriteFrontUrl = pokemonToEvolve.isShiny ? `${shinyBaseUrl}/shiny/${evolvedFormData.pokedexId}.png` : evolvedFormData.spriteFront;
    pokemonToEvolve.spriteBackUrl = pokemonToEvolve.isShiny ? `${shinyBaseUrl}/back/shiny/${evolvedFormData.pokedexId}.png` : evolvedFormData.spriteBack;
    if (isPermanentEvolution) {
        const teamPokemonInstance = selectedTrainerData.team.find(p => p && p.id === pokemonToEvolve.id);
        if (teamPokemonInstance) {
            Object.assign(teamPokemonInstance, {
                pokedexId: pokemonToEvolve.pokedexId, name: pokemonToEvolve.name.toUpperCase(), types: [...pokemonToEvolve.types],
                maxHP: pokemonToEvolve.maxHP, currentHP: pokemonToEvolve.currentHP, baseStats: JSON.parse(JSON.stringify(pokemonToEvolve.baseStats)),
                moves: pokemonToEvolve.moves.map(m => ({...m})), isShiny: pokemonToEvolve.isShiny,
                spriteFrontUrl: pokemonToEvolve.spriteFrontUrl, spriteBackUrl: pokemonToEvolve.spriteBackUrl,
                evolvesToPokedexId: pokemonToEvolve.evolvesToPokedexId, originalEvolutionData: null
            });
            saveGame();
        }
    }
    return originalName;
}

function useEvolutionItem(itemName) {
    const playerPokemon = battleState.playerTeam[battleState.playerActiveIndex];
    const evolutionTargetData = getEvolutionTarget(playerPokemon.pokedexId); const isPermanent = itemName === "Perma Evolution Stone";
    if (evolutionTargetData && selectedTrainerData.inventory[itemName] > 0) {
        selectedTrainerData.inventory[itemName]--; if (!isPermanent) saveGame();
        itemMenuEl.style.display = 'none';
        typeMessage(`${selectedTrainerData.name} used a ${itemName}!`, () => {
            typeMessage(`${playerPokemon.name.toUpperCase()} is evolving!`, () => {
                playerPokemonSpriteEl.parentElement.classList.add('flash-anim');
                setTimeout(() => {
                    playerPokemonSpriteEl.parentElement.classList.remove('flash-anim');
                    const originalName = evolvePokemon(playerPokemon, evolutionTargetData, isPermanent); updateBattleUI();
                    typeMessage(`Congratulations! Your ${originalName} evolved into ${playerPokemon.name.toUpperCase()}!${isPermanent ? " (Permanently)" : ""}`, () => {
                        if (isPermanent) saveGame(); opponentActionPhase();
                    });
                }, 1000);
            });
        });
    } else { typeMessage("It won't have any effect.", () => { playerActionPhase(); }); }
}

function throwPokeball(itemName) {
    if (!battleState.isWildBattle) { typeMessage("Can only use Poké Balls in wild battles!", playerActionPhase); return; }
    if (!selectedTrainerData || !selectedTrainerData.inventory || selectedTrainerData.inventory[itemName] <= 0) { typeMessage(`You don't have any ${itemName}s!`, playerActionPhase); return; }
    selectedTrainerData.inventory[itemName]--; saveGame();
    const opponentPokemon = battleState.opponentTeam[battleState.opponentActiveIndex];
    typeMessage(`${selectedTrainerData.name} used a ${itemName}!`, () => {
        const pokeballAnim = document.createElement('div'); pokeballAnim.classList.add('pokeball-throw-animation');
        const playerRect = playerPokemonSpriteEl.getBoundingClientRect(); const opponentRect = opponentPokemonSpriteEl.getBoundingClientRect();
        const arenaRect = screens.battle.querySelector('.battle-arena').getBoundingClientRect();
        pokeballAnim.style.left = `${playerRect.left + playerRect.width / 2 - arenaRect.left - 15}px`; pokeballAnim.style.top = `${playerRect.bottom - arenaRect.top - 30 - 15}px`;
        pokeballAnim.style.setProperty('--target-x', `${opponentRect.left + opponentRect.width / 2 - (playerRect.left + playerRect.width / 2)}px`);
        pokeballAnim.style.setProperty('--target-y', `${opponentRect.top + opponentRect.height / 2 - (playerRect.bottom - 30)}px`);
        if (itemName === "Great Ball") pokeballAnim.style.backgroundImage = 'var(--item-icon-greatball)';
        attackAnimationLayer.appendChild(pokeballAnim);
        setTimeout(() => {
            pokeballAnim.remove(); const catchRateBase = itemName === "Great Ball" ? 1.5 : 1;
            const maxHP = opponentPokemon.maxHP; const currentHP = opponentPokemon.currentHP;
            let catchChance = (((3 * maxHP - 2 * currentHP) * 45 * catchRateBase) / (3 * maxHP)) / 255;
            if (opponentPokemon.status && (opponentPokemon.status === "SLP" || opponentPokemon.status === "FRZ")) catchChance *= 2.5;
            else if (opponentPokemon.status && (opponentPokemon.status === "PAR" || opponentPokemon.status === "PSN" || opponentPokemon.status === "BRN")) catchChance *= 1.5;
            if (Math.random() < catchChance || opponentPokemon.currentHP <= 1) {
                typeMessage(`Gotcha! ${opponentPokemon.name.toUpperCase()} was caught!`, () => {
                    opponentPokemonSpriteEl.parentElement.classList.add('pokemon-caught-flash');
                    setTimeout(() => {
                        opponentPokemonSpriteEl.parentElement.classList.remove('pokemon-caught-flash');
                        const caughtPokemonData = pokemonPool.find(p => p.pokedexId === opponentPokemon.pokedexId);
                        const newPlayerPokemon = createPokemonFromData( {...caughtPokemonData, isShiny: opponentPokemon.isShiny}, false, true );
                        newPlayerPokemon.currentHP = Math.max(1, opponentPokemon.currentHP); newPlayerPokemon.status = opponentPokemon.status;
                        if (selectedTrainerData.team.length < MAX_TEAM_SIZE) { selectedTrainerData.team.push(newPlayerPokemon); alert(`${newPlayerPokemon.name.toUpperCase()}${newPlayerPokemon.isShiny ? " (Shiny)" : ""} was added to your team!`); }
                        else if (selectedTrainerData.pcBox.length < MAX_PC_BOX_SIZE) { selectedTrainerData.pcBox.push(newPlayerPokemon); alert(`${newPlayerPokemon.name.toUpperCase()}${newPlayerPokemon.isShiny ? " (Shiny)" : ""} was sent to the PC!`); }
                        else { alert(`Team and PC Box are full! Cannot catch ${newPlayerPokemon.name.toUpperCase()}.`); }
                        finalizeBattleState(); battleState.isWildBattle = false; switchScreen('mainMenu');
                    }, 600);
                });
            } else { typeMessage(`Oh no! The Pokémon broke free!`, opponentActionPhase); }
        }, 3500);
    });
}

function showItemMenu() {
    if (!selectedTrainerData || !selectedTrainerData.inventory) { typeMessage("No items in inventory.", playerActionPhase); return; }
    itemMenuEl.innerHTML = ''; const pPok = battleState.playerTeam[battleState.playerActiveIndex]; let usableItemsFound = false;
    const evoStones = ["Evolution Stone", "Perma Evolution Stone"];
    evoStones.forEach(stoneName => {
        if (selectedTrainerData.inventory[stoneName] > 0) {
            const evoTarget = getEvolutionTarget(pPok.pokedexId);
            if (evoTarget) {
                const btn = document.createElement('button'); btn.dataset.itemName = stoneName;
                btn.innerHTML = `<span class="item-icon-battle evolutionstone"></span><span class="item-name-battle">${stoneName}</span><span class="item-count-battle">x${selectedTrainerData.inventory[stoneName]}</span>`;
                itemMenuEl.appendChild(btn); usableItemsFound = true;
            }
        }
    });
    if (battleState.isWildBattle) {
        const balls = ["Poke Ball", "Great Ball"];
        balls.forEach(ballName => {
            if (selectedTrainerData.inventory[ballName] > 0) {
                const btn = document.createElement('button'); btn.dataset.itemName = ballName;
                const battleIconClass = ballName === "Poke Ball" ? "pokeball" : "greatball";
                btn.innerHTML = `<span class="item-icon-battle ${battleIconClass}"></span><span class="item-name-battle">${ballName}</span><span class="item-count-battle">x${selectedTrainerData.inventory[ballName]}</span>`;
                itemMenuEl.appendChild(btn); usableItemsFound = true;
            }
        });
    }
    if (!usableItemsFound) { typeMessage("No usable items for this situation.", playerActionPhase); return; }
    const backBtn = document.createElement('button'); backBtn.dataset.action = "back-to-actions"; backBtn.classList.add("battle-menu-back-button"); backBtn.innerHTML = 'BACK'; itemMenuEl.appendChild(backBtn);
    actionMenuEl.style.display = 'none'; moveMenuEl.style.display = 'none'; battleTextboxEl.style.display = 'none'; itemMenuEl.style.display = 'grid';
}

function showGymLeaderSelectScreen() {
    gymLeaderGridEl.innerHTML = '';
    Object.keys(gymLeadersData).forEach(key => {
        const leader = gymLeadersData[key]; const leaderButton = document.createElement('button');
        leaderButton.classList.add('gym-leader-button'); leaderButton.textContent = leader.name.toUpperCase(); leaderButton.dataset.leaderKey = key;
        leaderButton.addEventListener('click', () => showGymLeaderDetailScreen(key)); gymLeaderGridEl.appendChild(leaderButton);
    });
    switchScreen('gymLeaderSelect');
}

function showGymLeaderDetailScreen(leaderKey) {
    const leader = gymLeadersData[leaderKey]; if (!leader) { alert("Gym Leader not found!"); switchScreen('gymLeaderSelect'); return; }
    gymLeaderDetailNameEl.textContent = leader.name.toUpperCase(); gymLeaderCardImageEl.src = leader.cardUrl; gymLeaderCardImageEl.alt = leader.name + " Card";
    gymLeaderDialogEl.textContent = leader.dialog || `Prepare to battle ${leader.name.toUpperCase()}!`;
    btnStartGymBattle.onclick = () => { battleState.currentGymLeaderKey = leaderKey; battleState.isEliteFourBattle = false; prepareBattle(startGymBattleActual, false); };
    switchScreen('gymLeaderDetail');
}

function showEliteFourSelectScreen() {
    eliteFourGridEl.innerHTML = '';
    Object.keys(eliteFourData).forEach(key => {
        const member = eliteFourData[key]; const memberButton = document.createElement('button');
        memberButton.classList.add('elite-four-button'); memberButton.textContent = member.name.toUpperCase(); memberButton.dataset.memberKey = key;
        memberButton.addEventListener('click', () => showEliteFourDetailScreen(key)); eliteFourGridEl.appendChild(memberButton);
    });
    switchScreen('eliteFourSelect');
}

function showEliteFourDetailScreen(memberKey) {
    const member = eliteFourData[memberKey]; if (!member) { alert("Elite Four Member not found!"); switchScreen('eliteFourSelect'); return; }
    eliteFourDetailNameEl.textContent = `ELITE FOUR ${member.name.toUpperCase()}`; eliteFourCardImageEl.src = member.cardUrl; eliteFourCardImageEl.alt = member.name + " Card";
    eliteFourDialogEl.textContent = member.dialog || `Prepare to face Elite Four ${member.name.toUpperCase()}!`;
    btnStartEliteFourBattle.onclick = () => { battleState.currentEliteFourMemberKey = memberKey; battleState.isEliteFourBattle = true; prepareBattle(startEliteFourBattleActual, true); };
    switchScreen('eliteFourDetail');
}

function showMyCardsScreen() {
    if (!selectedTrainerData) { alert("No trainer data found."); switchScreen('mainMenu'); return; }
    collectedCardsGridEl.innerHTML = ''; collectedEliteFourCardsGridEl.innerHTML = ''; collectedBadgesGridEl.innerHTML = '';
    let hasGymCards = false; let hasEliteFourCards = false; let hasBadges = false;
    (selectedTrainerData.defeatedGymLeaders || []).forEach(leaderKey => {
        const leaderData = gymLeadersData[leaderKey];
        if (leaderData) {
            hasGymCards = true; const cardItem = document.createElement('div'); cardItem.classList.add('collected-card-item');
            const cardImg = document.createElement('img'); cardImg.src = leaderData.cardUrl; cardImg.alt = leaderData.name + " Card"; cardItem.appendChild(cardImg); collectedCardsGridEl.appendChild(cardItem);
            hasBadges = true; const badgeItem = document.createElement('div'); badgeItem.classList.add('collected-badge-item');
            const badgeImg = document.createElement('img'); badgeImg.src = leaderData.badgeUrl; badgeImg.alt = leaderData.badgeName;
            const badgeNameP = document.createElement('p'); badgeNameP.textContent = `${leaderData.badgeName} (${leaderData.name.toUpperCase()})`;
            badgeItem.appendChild(badgeImg); badgeItem.appendChild(badgeNameP); collectedBadgesGridEl.appendChild(badgeItem);
        }
    });
    (selectedTrainerData.defeatedEliteFourMembers || []).forEach(memberKey => {
        const memberData = eliteFourData[memberKey];
        if (memberData) {
            hasEliteFourCards = true; const cardItem = document.createElement('div'); cardItem.classList.add('collected-card-item');
            const cardImg = document.createElement('img'); cardImg.src = memberData.cardUrl; cardImg.alt = memberData.name + " Card"; cardItem.appendChild(cardImg); collectedEliteFourCardsGridEl.appendChild(cardItem);
        }
    });
    if (noCollectedCardsMsgEl) noCollectedCardsMsgEl.style.display = hasGymCards ? 'none' : 'block';
    if (noCollectedEliteFourCardsMsgEl) noCollectedEliteFourCardsMsgEl.style.display = hasEliteFourCards ? 'none' : 'block';
    if (noCollectedBadgesMsgEl) noCollectedBadgesMsgEl.style.display = hasBadges ? 'none' : 'block';
    switchScreen('myCards');
}

function showTcgCardsScreen() {
    if (!selectedTrainerData) { alert("No trainer data found."); switchScreen('mainMenu'); return; }
    tcgCardsGridEl.innerHTML = ''; // Clear previous content (important for set grouping)
    const collectedTcgCards = selectedTrainerData.collectedTcgCards || [];
    let hasAnyTcgCards = false;

    if (collectedTcgCards.length > 0) {
        hasAnyTcgCards = true;
        // Group cards by set
        const cardsBySet = collectedTcgCards.reduce((acc, card) => {
            const setId = card.set?.id || 'unknown_set'; // Handle cards that might miss set info
            if (!acc[setId]) {
                acc[setId] = {
                    setName: card.set?.name || "Unknown Set",
                    setSeries: card.set?.series || "N/A",
                    setLogo: card.set?.images?.logo || "",
                    cards: []
                };
            }
            acc[setId].cards.push(card);
            return acc;
        }, {});

        // Sort sets, e.g., by series then release date or name (optional, for consistent order)
        const sortedSetIds = Object.keys(cardsBySet).sort((a, b) => {
            const setA = cardsBySet[a];
            const setB = cardsBySet[b];
            if (setA.setSeries < setB.setSeries) return -1;
            if (setA.setSeries > setB.setSeries) return 1;
            // Could add secondary sort by releaseDate if available and parsed
            if (setA.setName < setB.setName) return -1;
            if (setA.setName > setB.setName) return 1;
            return 0;
        });

        sortedSetIds.forEach(setId => {
            const setData = cardsBySet[setId];

            const setContainer = document.createElement('div');
            setContainer.classList.add('tcg-set-container');

            const setNameH3 = document.createElement('h3');
            setNameH3.classList.add('tcg-set-name');
            if(setData.setLogo) {
                const setLogoImg = document.createElement('img');
                setLogoImg.src = setData.setLogo;
                setLogoImg.alt = setData.setName + " logo";
                setLogoImg.style.height = "1.2em"; // Adjust size as needed
                setLogoImg.style.marginRight = "10px";
                setLogoImg.style.verticalAlign = "middle";
                setNameH3.appendChild(setLogoImg);
            }
            setNameH3.appendChild(document.createTextNode(`${setData.setName} (${setData.setSeries})`));
            setContainer.appendChild(setNameH3);

            const setGrid = document.createElement('div');
            setGrid.classList.add('cards-collection-grid'); // Re-use existing grid class

            // Sort cards within the set (e.g., by card number)
            setData.cards.sort((a,b) => {
                const numA = parseInt(a.number) || 0;
                const numB = parseInt(b.number) || 0;
                return numA - numB;
            });

            setData.cards.forEach(tcgCard => {
                const cardItem = document.createElement('div');
                cardItem.classList.add('collected-card-item');

                const cardImg = document.createElement('img');
                cardImg.src = tcgCard.spriteUrl;
                cardImg.alt = (tcgCard.tcgCardName || tcgCard.pokemonGameName) + " TCG Card";
                if (isSpecialTcgCard(tcgCard)) { // Optional: Add highlight in collection view too
                    cardImg.classList.add('special-card-highlight'); // Use the same class or a less obtrusive one
                }
                cardItem.appendChild(cardImg);

                const nameP = document.createElement('p');
                nameP.textContent = (tcgCard.tcgCardName || tcgCard.pokemonGameName || "Unknown Card").toUpperCase();
                cardItem.appendChild(nameP);

                setGrid.appendChild(cardItem);
            });
            setContainer.appendChild(setGrid);
            tcgCardsGridEl.appendChild(setContainer);
        });
    }

    if (noTcgCardsMsgEl) noTcgCardsMsgEl.style.display = hasAnyTcgCards ? 'none' : 'block';
    switchScreen('tcgCards');
}


function showStarterSelectScreen() {
    startersGridEl.innerHTML = ''; const starterPokedexIds = [1, 4, 7, 152, 155, 158];
    starterPokedexIds.forEach(pokedexId => {
        const pokemonData = pokemonPool.find(p => p.pokedexId === pokedexId);
        if (pokemonData) {
            const card = document.createElement('div'); card.classList.add('starter-card'); card.dataset.starterId = pokedexId;
            const img = document.createElement('img'); img.src = pokemonData.spriteFront; img.alt = pokemonData.name.toUpperCase(); card.appendChild(img);
            const nameP = document.createElement('p'); nameP.textContent = pokemonData.name.toUpperCase(); card.appendChild(nameP);
            card.addEventListener('click', () => { tempSelectedStarter = pokemonData; chosenStarterNameDialogSpan.textContent = pokemonData.name.toUpperCase(); screens.confirmStarterDialog.style.display = 'flex'; });
            startersGridEl.appendChild(card);
        }
    });
    switchScreen('starterSelect');
}

function saveGame() { if (selectedTrainerData) { localStorage.setItem(SAVE_KEY, JSON.stringify(selectedTrainerData)); console.log("Game Saved!"); } else { console.warn("No trainer selected to save!"); } }
function loadGame() {
    const sd = localStorage.getItem(SAVE_KEY);
    if (sd) {
        try {
            selectedTrainerData = JSON.parse(sd);
            selectedTrainerData.coins = selectedTrainerData.coins || 0;
            selectedTrainerData.inventory = selectedTrainerData.inventory || {};
            const defaultItems = { "Poke Ball": 5, "Great Ball": 0, "Evolution Stone": 1, "Perma Evolution Stone": 0, "TCG Pack": 0 };
            for (const item in defaultItems) { if (typeof selectedTrainerData.inventory[item] === 'undefined') { selectedTrainerData.inventory[item] = defaultItems[item]; } }
            selectedTrainerData.team = selectedTrainerData.team || []; selectedTrainerData.pcBox = selectedTrainerData.pcBox || [];
            selectedTrainerData.defeatedGymLeaders = selectedTrainerData.defeatedGymLeaders || [];
            selectedTrainerData.defeatedEliteFourMembers = selectedTrainerData.defeatedEliteFourMembers || [];
            selectedTrainerData.collectedTcgCards = selectedTrainerData.collectedTcgCards || [];
            // Ensure new TCG card properties exist for older saves
            selectedTrainerData.collectedTcgCards.forEach(card => {
                card.pokemonGameName = card.pokemonGameName || card.name; // 'name' was old property for game pokemon name
                card.tcgCardName = card.tcgCardName || card.pokemonGameName;
                card.set = card.set || { id: "unknown", name: "Unknown Set", series: "N/A", images: {logo:"", symbol:""} };
                card.rarity = card.rarity || "Common";
                card.subtypes = card.subtypes || [];
                card.number = card.number || "N/A";
                card.artist = card.artist || "N/A";
            });
            selectedTrainerData.hasChosenStarter = typeof selectedTrainerData.hasChosenStarter !== 'undefined' ? selectedTrainerData.hasChosenStarter : false;
            [selectedTrainerData.team, selectedTrainerData.pcBox].forEach(list => {
                (list || []).forEach(p => {
                    if(p) {
                        p.originalEvolutionData = p.originalEvolutionData || null;
                        const shinyBaseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
                        const basePokemonData = pokemonPool.find(baseP => baseP.pokedexId === p.pokedexId) || {};
                        p.spriteFrontUrl = p.isShiny ? `${shinyBaseUrl}/shiny/${p.pokedexId}.png` : (basePokemonData.spriteFront || `${shinyBaseUrl}/${p.pokedexId}.png`);
                        p.spriteBackUrl = p.isShiny ? `${shinyBaseUrl}/back/shiny/${p.pokedexId}.png` : (basePokemonData.spriteBack || `${shinyBaseUrl}/back/${p.pokedexId}.png`);
                        p.moves.forEach(m => { if (typeof m.currentPp === 'undefined') m.currentPp = m.maxPp; });
                        p.name = p.name.toUpperCase();
                    }
                });
            });
            if (chosenTrainerImageMainMenu && selectedTrainerData.imageUrl) { chosenTrainerImageMainMenu.src = selectedTrainerData.imageUrl; chosenTrainerImageMainMenu.alt = selectedTrainerData.name; }
            updateCoinDisplay(); const dm = localStorage.getItem('blazingThunder_darkMode'); if (dm === 'true') gameBody.classList.add('dark-mode');
            console.log("Game Loaded"); return true;
        } catch (e) { console.error('Load error:', e); localStorage.removeItem(SAVE_KEY); return false; }
    }
    return false;
}
function resetGame() {
    localStorage.removeItem(SAVE_KEY); localStorage.removeItem('blazingThunder_darkMode');
    selectedTrainerData = null; tempSelectedStarter = null; isNewGameSetup = false;
    gameBody.classList.remove('dark-mode');
    if(playerCoinsDisplayMainMenuEl) playerCoinsDisplayMainMenuEl.textContent = "Coins: 0";
    if(marketCoinDisplayEl) marketCoinDisplayEl.textContent = "Coins: 0";
    alert("Game Reset! Select a new trainer."); switchScreen('intro');
}

document.addEventListener('DOMContentLoaded', () => {
    const cyEl = document.getElementById('currentYear'); if (cyEl) cyEl.textContent = new Date().getFullYear();
    const gsBtn = document.getElementById('gameStartButton');
    function setupEvtLstnrs() {
        const hS = (e) => { e.preventDefault(); if (loadGame() && selectedTrainerData.hasChosenStarter) { switchScreen('mainMenu'); } else { isNewGameSetup = true; switchScreen('characterSelect'); } };
        if (gsBtn) { gsBtn.addEventListener('click', hS); gsBtn.addEventListener('touchend', hS, {passive: false}); } else console.error("gsBtn not found!");
        trainerCards.forEach(c => { c.addEventListener('click', () => { const tn = c.dataset.trainer; selectedTrainerData = JSON.parse(JSON.stringify(trainersData[tn])); chosenTrainerNameSpan.textContent = selectedTrainerData.name; screens.confirmDialog.style.display = 'flex'; }); });
        if(confirmYesButton) confirmYesButton.addEventListener('click', () => {
            if (selectedTrainerData) {
                selectedTrainerData.coins = 0; selectedTrainerData.inventory = { "Poke Ball": 5, "Great Ball": 0, "Evolution Stone": 1, "Perma Evolution Stone": 0, "TCG Pack": 0 };
                selectedTrainerData.team = []; selectedTrainerData.pcBox = []; selectedTrainerData.defeatedGymLeaders = []; selectedTrainerData.defeatedEliteFourMembers = []; selectedTrainerData.collectedTcgCards = []; selectedTrainerData.hasChosenStarter = false;
                if (isNewGameSetup) { showStarterSelectScreen(); } else { saveGame(); switchScreen('mainMenu'); }
            } else switchScreen('characterSelect');
            screens.confirmDialog.style.display = 'none';
        });
        if(confirmNoButton) confirmNoButton.addEventListener('click', () => { selectedTrainerData = null; screens.confirmDialog.style.display = 'none'; switchScreen('characterSelect'); });
        if(confirmStarterYesButton) confirmStarterYesButton.addEventListener('click', () => {
            if (selectedTrainerData && tempSelectedStarter) {
                selectedTrainerData.team.push(createPokemonFromData(tempSelectedStarter, false, true)); selectedTrainerData.hasChosenStarter = true; tempSelectedStarter = null; isNewGameSetup = false;
                if (chosenTrainerImageMainMenu && selectedTrainerData.imageUrl) { chosenTrainerImageMainMenu.src = selectedTrainerData.imageUrl; chosenTrainerImageMainMenu.alt = selectedTrainerData.name; }
                updateCoinDisplay(); saveGame(); screens.confirmStarterDialog.style.display = 'none'; switchScreen('mainMenu');
            } else { screens.confirmStarterDialog.style.display = 'none'; switchScreen('starterSelect'); }
        });
        if(confirmStarterNoButton) confirmStarterNoButton.addEventListener('click', () => { tempSelectedStarter = null; screens.confirmStarterDialog.style.display = 'none'; switchScreen('starterSelect'); });
        if(btnPlay) btnPlay.addEventListener('click', () => switchScreen('playMenu'));
        if(btnQuickBattlePlay) btnQuickBattlePlay.addEventListener('click', () => prepareBattle(startQuickBattle, false));
        if(btnWildModePlay) btnWildModePlay.addEventListener('click', () => prepareBattle(startWildBattleActual, false));
        if(btnGymBattlePlay) btnGymBattlePlay.addEventListener('click', showGymLeaderSelectScreen);
        if(btnEliteBattlesPlay) btnEliteBattlesPlay.addEventListener('click', showEliteFourSelectScreen);
        if(btnBackToMainFromPlay) btnBackToMainFromPlay.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnOptions) btnOptions.addEventListener('click', () => switchScreen('optionsMenu'));
        if(tabMyCards) tabMyCards.addEventListener('click', showMyCardsScreen);
        if(tabTcgCards) tabTcgCards.addEventListener('click', showTcgCardsScreen);
        if(tabTeam) tabTeam.addEventListener('click', showTeamScreen);
        if(tabMyPc) tabMyPc.addEventListener('click', showPcBoxScreen);
        if(tabMarket) tabMarket.addEventListener('click', showMarketScreen);
        if(tabInventory) tabInventory.addEventListener('click', showInventoryScreen);
        if(marketItemsGridEl) { marketItemsGridEl.addEventListener('click', (e) => { if (e.target.classList.contains('buy-button')) { const itemName = e.target.dataset.itemName; const price = e.target.dataset.price; buyItem(itemName, price); } }); }
        if(btnBackToMainFromMarket) btnBackToMainFromMarket.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromInventory) btnBackToMainFromInventory.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromTeam) btnBackToMainFromTeam.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromPcBox) btnBackToMainFromPcBox.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnBackToMainFromTcgCards) btnBackToMainFromTcgCards.addEventListener('click', () => switchScreen('mainMenu'));
        if(btnSaveGameOpt) btnSaveGameOpt.addEventListener('click', saveGame);
        if(btnResetGameOpt) btnResetGameOpt.addEventListener('click', () => {screens.resetConfirmDialog.style.display = 'flex'});
        if(btnDarkModeOpt) btnDarkModeOpt.addEventListener('click', () => { gameBody.classList.toggle('dark-mode'); localStorage.setItem('blazingThunder_darkMode', gameBody.classList.contains('dark-mode')); });
        if(btnBackToMainOpts) btnBackToMainOpts.addEventListener('click', () => switchScreen('mainMenu'));
        if(resetConfirmYesButton) resetConfirmYesButton.addEventListener('click', () => {screens.resetConfirmDialog.style.display = 'none'; resetGame();});
        if(resetConfirmNoButton) resetConfirmNoButton.addEventListener('click', () => {screens.resetConfirmDialog.style.display = 'none'; switchScreen('optionsMenu');});
        if(btnBackToPlayMenuFromGymSelect) btnBackToPlayMenuFromGymSelect.addEventListener('click', () => switchScreen('playMenu'));
        if(btnBackToGymSelectFromDetail) btnBackToGymSelectFromDetail.addEventListener('click', showGymLeaderSelectScreen);
        if(btnBackToPlayMenuFromEliteFourSelect) btnBackToPlayMenuFromEliteFourSelect.addEventListener('click', () => switchScreen('playMenu'));
        if(btnBackToEliteFourSelectFromDetail) btnBackToEliteFourSelectFromDetail.addEventListener('click', showEliteFourSelectScreen);
        if(btnBackToMainFromMyCards) btnBackToMainFromMyCards.addEventListener('click', () => switchScreen('mainMenu'));
        if(actionMenuEl) actionMenuEl.addEventListener('click', (e) => {
            if (!battleState.playerTurn || battleState.isProcessingMessage) return; const buttonTarget = e.target.closest('button');
            if (buttonTarget && buttonTarget.parentElement === actionMenuEl) {
                const act = buttonTarget.dataset.action; actionMenuEl.style.display='none';
                switch(act){
                    case 'fight': showMoveMenu(); break; case 'item': showItemMenu(); break;
                    case 'pokemon': showSwitchScreen(false); break;
                    case 'run':
                        if (battleState.isWildBattle) { typeMessage("Got away safely!", () => { finalizeBattleState(); battleState = { ...battleState, playerTeam: [], opponentTeam:[], isWildBattle: false, isGymBattle: false, isEliteFourBattle: false, currentGymLeaderKey: null, currentEliteFourMemberKey: null, switchingAfterFaint: false }; switchScreen('mainMenu'); }); }
                        else if (battleState.isGymBattle || battleState.isEliteFourBattle) { typeMessage("You can't run from a Gym or Elite Four Battle!", playerActionPhase); }
                        else { typeMessage("You chose to forfeit the Quick Battle.", () => { finalizeBattleState(); selectedTrainerData.coins = Math.max(0, (selectedTrainerData.coins || 0) - 2); updateCoinDisplay(); saveGame(); battleState = { ...battleState, playerTeam: [], opponentTeam:[], isWildBattle: false, isGymBattle: false, isEliteFourBattle: false, currentGymLeaderKey: null, currentEliteFourMemberKey: null, switchingAfterFaint: false }; switchScreen('mainMenu'); }); }
                        break;
                }
            }
        });
        if(itemMenuEl) itemMenuEl.addEventListener('click', (e) => {
            if (!battleState.playerTurn || battleState.isProcessingMessage) return; const btn = e.target.closest('button');
            if (btn && btn.parentElement === itemMenuEl) {
                const itemName = btn.dataset.itemName; const action = btn.dataset.action; itemMenuEl.style.display = 'none';
                if (action === 'back-to-actions') { playerActionPhase(); return; }
                if (itemName === "Evolution Stone" || itemName === "Perma Evolution Stone") { useEvolutionItem(itemName); }
                else if (itemName === "Poke Ball" || itemName === "Great Ball") { if (battleState.isWildBattle) { throwPokeball(itemName); } else { typeMessage("Can only use Poke Balls in wild battles!", playerActionPhase); } }
            }
        });
        if(moveMenuEl) { moveMenuEl.addEventListener('click', (e) => { if (!battleState.playerTurn || battleState.isProcessingMessage) return; const btn = e.target.closest('button'); if (btn && btn.parentElement === moveMenuEl && !btn.disabled && !btn.classList.contains('battle-menu-back-button')) { const mIdx = parseInt(btn.dataset.moveIndex); playerAttack(mIdx); } }); }
        if(btnBackFromMoves) { btnBackFromMoves.addEventListener('click', () => { if (currentScreen === 'battle' && !battleState.isProcessingMessage && battleState.playerTurn) { moveMenuEl.style.display = 'none'; playerActionPhase(); } }); }
        if(switchCancelButton) switchCancelButton.addEventListener('click', () => { if (currentScreen === 'switchPokemon' && !battleState.switchingAfterFaint) { switchScreen('battle'); playerActionPhase(); }});
        if(closeTcgRevealButton) closeTcgRevealButton.addEventListener('click', () => { screens.tcgPackOpeningOverlay.style.display = 'none'; });
    }
    setupEvtLstnrs();
    if (loadGame()) { if (selectedTrainerData.hasChosenStarter) { switchScreen('mainMenu'); } else { isNewGameSetup = true; if (selectedTrainerData && selectedTrainerData.name) { showStarterSelectScreen(); } else { switchScreen('characterSelect'); } } }
    else { isNewGameSetup = true; switchScreen('intro'); }
    updateCoinDisplay();
    if (screens[currentScreen] && screens[currentScreen].style.display === 'none' && currentScreen === 'intro' && !isNewGameSetup && !selectedTrainerData) { screens.intro.style.display = 'flex'; }
});