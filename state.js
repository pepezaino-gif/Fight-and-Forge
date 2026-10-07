// ==========================================
// CONFIGURAZIONE DELLE 10 RARITÀ
// ==========================================
const RARITIES = [
    { id: 1, name: 'Comune', color: '#94a3b8', minForgeLvl: 1, baseWeight: 600, mult: 1.0 },
    { id: 2, name: 'Non Comune', color: '#22c55e', minForgeLvl: 1, baseWeight: 300, mult: 1.5 },
    { id: 3, name: 'Raro', color: '#3b82f6', minForgeLvl: 1, baseWeight: 100, mult: 2.2 },
    { id: 4, name: 'Epico', color: '#a855f7', minForgeLvl: 5, baseWeight: 30, mult: 3.5 },
    { id: 5, name: 'Leggendario', color: '#f97316', minForgeLvl: 12, baseWeight: 10, mult: 5.5 },
    { id: 6, name: 'Mitico', color: '#ef4444', minForgeLvl: 25, baseWeight: 3, mult: 9.0 },
    { id: 7, name: 'Ancestrale', color: '#06b6d4', minForgeLvl: 40, baseWeight: 0.8, mult: 15.0 },
    { id: 8, name: 'Divino', color: '#eab308', minForgeLvl: 60, baseWeight: 0.2, mult: 25.0 },
    { id: 9, name: 'Cosmico', color: '#ec4899', minForgeLvl: 85, baseWeight: 0.04, mult: 45.0 },
    { id: 10, name: 'Trascendente', color: '#ffffff', minForgeLvl: 120, baseWeight: 0.005, mult: 100.0 }
];

// ==========================================
// STATO GLOBALE DI GIOCO
// ==========================================
let gameState = {
    // Valute
    gold: 100,
    gems: 10,

    // Progressioni Stage / Ondate
    stage: 1,
    subStage: 1, // da 1 a 5 per completare uno stage
    waveProgress: 0,

    // Dati Eroe e Forgia
    forgeLevel: 1,
    forgeCost: 50,
    autoForgeActive: false,

    // Equipaggiamento Attuale
    equipped: {
        weapon: null,
        helmet: null,
        chest: null,
        boots: null,
        ring: null,
        amulet: null
    },

    // Albero Tecnologico (Nodi sbloccati)
    techUnlocked: [],

    // Statistiche Eroe Calcolate
    stats: {
        attack: 10,
        maxHp: 100,
        currentHp: 100
    }
};

// ==========================================
// SALVATAGGIO E CARICAMENTO (localStorage)
// ==========================================
const SAVE_KEY = 'shadow_forge_rpg_save';

function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

function loadGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            // Fondiamo i dati salvati con la struttura di base per evitare bug se aggiungiamo nuove variabili in futuro
            gameState = { ...gameState, ...parsed };
        } catch (e) {
            console.error("Errore nel caricamento del salvataggio:", e);
        }
    }
}

// Salvataggio automatico ogni 10 secondi
setInterval(saveGame, 10000);

// Carica i dati all'avvio del file
loadGame();
