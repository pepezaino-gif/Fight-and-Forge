// ==========================================
// LOGICA DELLA FORGIA E PROBABILITÀ DINAMICHE
// ==========================================

// Tipi di slot per l'equipaggiamento
const EQUIP_SLOTS = ['weapon', 'helmet', 'chest', 'boots', 'ring', 'amulet'];

// Calcola il peso (weight) per ogni rarità in base al livello della forgia
function getForgeWeights() {
    const lvl = gameState.forgeLevel;
    let available = [];
    let totalWeight = 0;

    RARITIES.forEach(rarity => {
        if (lvl >= rarity.minForgeLvl) {
            // Aumento progressivo per le rarità sbloccate
            let bonus = (lvl - rarity.minForgeLvl) * 0.2;
            let currentWeight = rarity.baseWeight + bonus;

            // Riduciamo gradualmente la frequenza di Comune e Non Comune ai livelli alti
            if (rarity.id === 1) currentWeight = Math.max(10, currentWeight - lvl * 3);
            if (rarity.id === 2) currentWeight = Math.max(15, currentWeight - lvl * 1.5);

            available.push({ ...rarity, currentWeight });
            totalWeight += currentWeight;
        }
    });

    return { available, totalWeight };
}

// Estrazione casuale della rarità
function rollRarity() {
    const { available, totalWeight } = getForgeWeights();
    let roll = Math.random() * totalWeight;

    for (let rarity of available) {
        if (roll < rarity.currentWeight) {
            return rarity;
        }
        roll -= rarity.currentWeight;
    }
    return RARITIES[0];
}

// Azione di Forgiatura
function forgeItem() {
    if (gameState.gold < gameState.forgeCost) {
        return; // Oro insufficiente
    }

    // Scala l'oro e aumenta il costo per la prossima forgia
    gameState.gold -= gameState.forgeCost;
    
    // Seleziona uno slot casuale
    const slot = EQUIP_SLOTS[Math.floor(Math.random() * EQUIP_SLOTS.length)];
    const rarity = rollRarity();

    // Calcolo potenza dell'oggetto
    const itemLevel = gameState.forgeLevel;
    const power = Math.floor(itemLevel * 10 * rarity.mult);

    const newItem = {
        slot: slot,
        rarity: rarity,
        level: itemLevel,
        power: power
    };

    // Confronta con l'oggetto attualmente equipaggiato nello slot
    const currentEquipped = gameState.equipped[slot];
    if (!currentEquipped || newItem.power > currentEquipped.power) {
        gameState.equipped[slot] = newItem;
    } else {
        // Se è meno forte, lo vendiamo automaticamente ridando il 50% del valore in oro
        gameState.gold += Math.floor(gameState.forgeCost * 0.5);
    }

    // Aumenta leggermente il livello forgia / costo
    gameState.forgeCost = Math.floor(50 * Math.pow(1.15, gameState.forgeLevel));
    
    recalculateStats();
    updateUI();
}

// Potenzia il livello della forgia
function upgradeForge() {
    gameState.forgeLevel++;
    gameState.forgeCost = Math.floor(50 * Math.pow(1.15, gameState.forgeLevel));
    updateUI();
}

// ==========================================
// CALCOLO STATISTICHE ED EROE
// ==========================================
function recalculateStats() {
    let totalPower = 10;

    // Somma la potenza di tutti gli oggetti equipaggiati
    Object.values(gameState.equipped).forEach(item => {
        if (item) {
            totalPower += item.power;
        }
    });

    gameState.stats.attack = totalPower;
    gameState.stats.maxHp = totalPower * 10;
}

// ==========================================
// CICLO DI COMBATTIMENTO AUTOMATICO
// ==========================================
let currentEnemyHp = 100;
let maxEnemyHp = 100;

function combatLoop() {
    // Calcola il danno dell'eroe sul nemico
    const damage = gameState.stats.attack;
    currentEnemyHp -= damage;

    if (currentEnemyHp <= 0) {
        // Nemico sconfitto: ricompensa in oro
        const goldEarned = gameState.stage * 15 * gameState.subStage;
        gameState.gold += goldEarned;

        // Progressione ondate
        gameState.subStage++;
        if (gameState.subStage > 5) {
            gameState.subStage = 1;
            gameState.stage++;
        }

        // Genera nuovo nemico
        maxEnemyHp = gameState.stage * 100 + gameState.subStage * 30;
        currentEnemyHp = maxEnemyHp;
    }

    updateUI();
}

// Avvia il loop di combattimento ogni secondo
setInterval(combatLoop, 1000);

// ==========================================
// AGGIORNAMENTO INTERFACCIA E TAB
// ==========================================
function updateUI() {
    // Valute e livello forgia
    document.getElementById('currency-gold').innerText = Math.floor(gameState.gold);
    document.getElementById('currency-gems').innerText = gameState.gems;
    document.getElementById('stat-power').innerText = gameState.stats.attack;
    document.getElementById('forge-level').innerText = gameState.forgeLevel;
    document.getElementById('forge-cost').innerText = gameState.forgeCost;

    // Stage e Nemici
    document.getElementById('stage-name').innerText = `Stage ${gameState.stage}-${gameState.subStage}`;
    
    const enemyHpBar = document.getElementById('enemy-hp');
    if (enemyHpBar) {
        const hpPercent = Math.max(0, (currentEnemyHp / maxEnemyHp) * 100);
        enemyHpBar.style.width = `${hpPercent}%`;
    }

    // Visualizzazione slot equipaggiamento
    EQUIP_SLOTS.forEach(slot => {
        const slotEl = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
        if (slotEl) {
            const item = gameState.equipped[slot];
            if (item) {
                slotEl.classList.add('equipped');
                slotEl.style.borderColor = item.rarity.color;
                slotEl.style.boxShadow = `0 0 10px ${item.rarity.color}88`;
            }
        }
    });
}

// Cambio Tab per Navigazione
function switchTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const activePanel = document.getElementById(`tab-${tabName}`);
    if (activePanel) activePanel.classList.add('active');

    // Trova e attiva il pulsante
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.getAttribute('onclick').includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');
}

// EVENT LISTENERS PULSANTI
document.addEventListener('DOMContentLoaded', () => {
    const btnForge = document.getElementById('btn-forge');
    if (btnForge) {
        btnForge.addEventListener('click', forgeItem);
    }
    recalculateStats();
    updateUI();
});
