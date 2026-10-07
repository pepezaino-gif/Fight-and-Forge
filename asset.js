// ==========================================
// REGISTRO ASSETS GRAFICI E IMMAGINI HD
// ==========================================

const GAME_ASSETS = {
    // Sfondo Arena di Combattimento (Castello/Dungeon Dark Fantasy)
    background: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',

    // Personaggi HD
    characters: {
        hero: 'https://img.icons8.com/fantasy-monsters/512/paladin.png',
        enemy: 'https://img.icons8.com/fantasy-monsters/512/orc-head.png'
    },

    // Icone Equipaggiamento HD per i 6 Slot
    slots: {
        weapon: 'https://img.icons8.com/fantasy-monsters/512/longsword.png',
        helmet: 'https://img.icons8.com/fantasy-monsters/512/viking-helmet.png',
        chest: 'https://img.icons8.com/fantasy-monsters/512/body-armor.png',
        boots: 'https://img.icons8.com/fantasy-monsters/512/steel-boots.png',
        ring: 'https://img.icons8.com/fantasy-monsters/512/magic-ring.png',
        amulet: 'https://img.icons8.com/fantasy-monsters/512/pendant.png'
    },

    // Elementi Forgia HD
    forge: {
        anvil: 'https://img.icons8.com/fantasy-monsters/512/anvil.png',
        hammer: 'https://img.icons8.com/fantasy-monsters/512/blacksmith.png'
    }
};

// Funzione automatica per applicare tutte le immagini all'interfaccia
function loadGameAssets() {
    // 1. Applica Sfondo Arena
    const battleStage = document.querySelector('.battle-stage');
    if (battleStage && GAME_ASSETS.background) {
        battleStage.style.backgroundImage = `linear-gradient(180deg, rgba(15, 23, 42, 0.5) 0%, rgba(8, 11, 18, 0.95) 100%), url('${GAME_ASSETS.background}')`;
    }

    // 2. Carica Personaggi (Eroe e Nemico)
    applyAsset('hero-character', GAME_ASSETS.characters.hero, '🗡️');
    applyAsset('enemy-character', GAME_ASSETS.characters.enemy, '👹');

    // 3. Carica Icone Slot Equipaggiamento
    const slotTypes = ['weapon', 'helmet', 'chest', 'boots', 'ring', 'amulet'];
    const defaultSlotEmojis = { weapon: '⚔️', helmet: '🪖', chest: '🛡️', boots: '🥾', ring: '💍', amulet: '📿' };

    slotTypes.forEach(slot => {
        const slotEl = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
        if (slotEl) {
            const imgUrl = GAME_ASSETS.slots[slot];
            if (imgUrl) {
                slotEl.innerHTML = `<img src="${imgUrl}" class="asset-img-slot" alt="${slot}">`;
            } else {
                slotEl.innerHTML = `<span class="slot-icon">${defaultSlotEmojis[slot]}</span>`;
            }
        }
    });

    // 4. Carica Forgia
    const anvilEl = document.querySelector('.anvil-display');
    if (anvilEl && GAME_ASSETS.forge.anvil) {
        anvilEl.querySelector('.anvil-icon, .anvil-img')?.remove();
        const anvilImg = document.createElement('img');
        anvilImg.src = GAME_ASSETS.forge.anvil;
        anvilImg.className = 'anvil-img';
        anvilEl.insertBefore(anvilImg, anvilEl.firstChild);
    }
}

// Helper per inserire immagini o emoji di ripiego
function applyAsset(elementId, imgUrl, fallbackEmoji) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let targetContainer = el.querySelector('.character-sprite') || el;
    if (imgUrl) {
        targetContainer.innerHTML = `<img src="${imgUrl}" class="asset-img-char" alt="sprite">`;
    } else {
        targetContainer.innerHTML = `<span class="character-icon">${fallbackEmoji}</span>`;
    }
}

document.addEventListener('DOMContentLoaded', loadGameAssets);
