// ==========================================
// LOGICA DELLA FORGIA E PROBABILITÀ DINAMICHE
// ==========================================
const EQUIP_SLOTS = ['weapon', 'helmet', 'chest', 'boots', 'ring', 'amulet'];

function getForgeWeights() {
    const lvl = gameState.forgeLevel;
    let available = [];
    let totalWeight = 0;

    RARITIES.forEach(rarity => {
        if (lvl >= rarity.minForgeLvl) {
            let bonus = (lvl - rarity.minForgeLvl) * 0.2;
            let currentWeight = rarity.baseWeight + bonus;

            if (rarity.id === 1) currentWeight = Math.max(10, currentWeight - lvl * 3);
            if (rarity.id === 2) currentWeight = Math.max(15, currentWeight - lvl * 1.5);

            available.push({ ...rarity, currentWeight });
            totalWeight += currentWeight;
        }
    });

    return { available, totalWeight };
}

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

function forgeItem() {
    if (gameState.gold < gameState.forgeCost) return;

    gameState.gold -= gameState.forgeCost;
    
    // Animazione colpo di martello
    const hammer = document.getElementById('forge-hammer');
    if (hammer) {
        hammer.style.transform = 'rotate(-70deg) scale(1.2)';
        setTimeout(() => { hammer.style.transform = 'rotate(-20deg) scale(1)'; }, 150);
    }

    const slot = EQUIP_SLOTS[Math.floor(Math.random() * EQUIP_SLOTS.length)];
    const rarity = rollRarity();

    const itemLevel = gameState.forgeLevel;
    const power = Math.floor(itemLevel * 10 * rarity.mult);

    const newItem = {
        slot: slot,
        rarity: rarity,
        level: itemLevel,
        power: power
    };

    const currentEquipped = gameState.equipped[slot];
    if (!currentEquipped || newItem.power > currentEquipped.power) {
        gameState.equipped[slot] = newItem;
    } else {
        gameState.gold += Math.floor(gameState.forgeCost * 0.5);
    }

    gameState.forgeCost = Math.floor(50 * Math.pow(1.15, gameState.forgeLevel));
    
    recalculateStats();
    updateUI();
}

function recalculateStats() {
    let totalPower = 10;
    Object.values(gameState.equipped).forEach(item => {
        if (item) totalPower += item.power;
    });

    gameState.stats.attack = totalPower;
    gameState.stats.maxHp = totalPower * 10;
}

// ==========================================
// ANIMAZIONI E DANNI VOLANTI (FLOATING DAMAGE)
// ==========================================
let currentEnemyHp = 100;
let maxEnemyHp = 100;

function showFloatingDamage(text, isCrit = false) {
    const arena = document.querySelector('.battle-arena');
    if (!arena) return;

    const damageEl = document.createElement('div');
    damageEl.className = `damage-popup ${isCrit ? 'crit' : ''}`;
    damageEl.innerText = text;

    // Posizione vicino al nemico
    const enemy = document.getElementById('enemy-character');
    if (enemy) {
        const rect = enemy.getBoundingClientRect();
        damageEl.style.left = `${rect.left + 20}px`;
        damageEl.style.top = `${rect.top - 10}px`;
    }

    document.body.appendChild(damageEl);

    setTimeout(() => { damageEl.remove(); }, 800);
}

function combatLoop() {
    const heroEl = document.getElementById('hero-character');
    const enemyEl = document.getElementById('enemy-character');

    // Animazione di affondo dell'eroe
    if (heroEl) {
        heroEl.classList.add('attacking');
        setTimeout(() => heroEl.classList.remove('attacking'), 200);
    }

    // Calcolo Danno (con probabilità di Critico)
    const isCrit = Math.random() < 0.2;
    const damage = isCrit ? Math.floor(gameState.stats.attack * 1.8) : gameState.stats.attack;

    currentEnemyHp -= damage;

    // Mostra il popup del danno
    showFloatingDamage(isCrit ? `💥 ${damage}!` : `-${damage}`, isCrit);

    // Animazione di impatto sul nemico
    if (enemyEl) {
        enemyEl.classList.add('hit');
        setTimeout(() => enemyEl.classList.remove('hit'), 200);
    }

    if (currentEnemyHp <= 0) {
        // Nemico sconfitto
        const goldEarned = gameState.stage * 15 * gameState.subStage;
        gameState.gold += goldEarned;

        gameState.subStage++;
        if (gameState.subStage > 5) {
            gameState.subStage = 1;
            gameState.stage++;
        }

        maxEnemyHp = gameState.stage * 100 + gameState.subStage * 30;
        currentEnemyHp = maxEnemyHp;
    }

    updateUI();
}

setInterval(combatLoop, 1200);

// ==========================================
// AGGIORNAMENTO UI & TAB
// ==========================================
function updateUI() {
    document.getElementById('currency-gold').innerText = Math.floor(gameState.gold);
    document.getElementById('currency-gems').innerText = gameState.gems;
    document.getElementById('stat-power').innerText = gameState.stats.attack;
    document.getElementById('forge-level').innerText = gameState.forgeLevel;
    document.getElementById('forge-cost').innerText = gameState.forgeCost;

    document.getElementById('stage-name').innerText = `STAGE ${gameState.stage}-${gameState.subStage}`;
    
    const enemyHpBar = document.getElementById('enemy-hp');
    if (enemyHpBar) {
        const hpPercent = Math.max(0, (currentEnemyHp / maxEnemyHp) * 100);
        enemyHpBar.style.width = `${hpPercent}%`;
    }

    EQUIP_SLOTS.forEach(slot => {
        const slotEl = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
        if (slotEl) {
            const item = gameState.equipped[slot];
            if (item) {
                slotEl.classList.add('equipped');
                slotEl.style.borderColor = item.rarity.color;
                slotEl.style.boxShadow = `0 0 12px ${item.rarity.color}aa`;
            }
        }
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const activePanel = document.getElementById(`tab-${tabName}`);
    if (activePanel) activePanel.classList.add('active');

    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.getAttribute('onclick').includes(tabName));
    if (activeBtn) activeBtn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const btnForge = document.getElementById('btn-forge');
    if (btnForge) btnForge.addEventListener('click', forgeItem);
    recalculateStats();
    updateUI();
});
