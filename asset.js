// ==========================================
// REGISTRO ASSETS GRAFICI IN SVG NATIVO (100% LEGALE & SICURO)
// ==========================================

const SVG_ICONS = {
    hero: `<svg viewBox="0 0 100 100" class="asset-svg"><path d="M50 10 L65 25 L55 25 L55 60 L65 65 L50 85 L35 65 L45 60 L45 25 L35 25 Z" fill="#60a5fa" stroke="#3b82f6" stroke-width="2"/><circle cx="50" cy="85" r="5" fill="#facc15"/></svg>`,
    enemy: `<svg viewBox="0 0 100 100" class="asset-svg"><path d="M20 30 Q50 10 80 30 Q90 60 50 90 Q10 60 20 30 Z" fill="#ef4444"/><circle cx="35" cy="40" r="6" fill="#000"/><circle cx="65" cy="40" r="6" fill="#000"/><path d="M30 65 Q50 85 70 65" stroke="#fff" stroke-width="4" fill="none"/></svg>`,
    
    // Slot Equipaggiamento
    weapon: `<svg viewBox="0 0 100 100" class="asset-svg-slot"><path d="M20 80 L70 30 L80 40 L30 90 Z" fill="#cbd5e1"/><path d="M65 25 L85 15 L85 35 Z" fill="#f59e0b"/></svg>`,
    helmet: `<svg viewBox="0 0 100 100" class="asset-svg-slot"><path d="M20 50 Q50 10 80 50 L80 75 L20 75 Z" fill="#94a3b8"/><rect x="30" y="55" width="40" height="8" fill="#1e293b"/></svg>`,
    chest: `<svg viewBox="0 0 100 100" class="asset-svg-slot"><path d="M25 20 L40 10 L60 10 L75 20 L85 50 L70 85 L30 85 L15 50 Z" fill="#64748b"/></svg>`,
    boots: `<svg viewBox="0 0 100 100" class="asset-svg-slot"><path d="M30 20 L55 20 L55 60 L80 60 L80 80 L30 80 Z" fill="#78350f"/></svg>`,
    ring: `<svg viewBox="0 0 100 100" class="asset-svg-slot"><circle cx="50" cy="55" r="25" fill="none" stroke="#f59e0b" stroke-width="10"/><path d="M50 15 L60 30 L40 30 Z" fill="#38bdf8"/></svg>`,
    amulet: `<svg viewBox="0 0 100 100" class="asset-svg-slot"><path d="M20 20 Q50 60 80 20" stroke="#f59e0b" stroke-width="5" fill="none"/><circle cx="50" cy="60" r="12" fill="#a855f7"/></svg>`,

    // Forgia
    anvil: `<svg viewBox="0 0 100 100" class="asset-svg-anvil"><path d="M10 40 L90 40 L75 65 L85 85 L15 85 L25 65 Z" fill="#475569"/></svg>`,
    hammer: `<svg viewBox="0 0 100 100" class="asset-svg-hammer"><rect x="20" y="20" width="40" height="25" rx="4" fill="#64748b"/><rect x="35" y="45" width="10" height="45" fill="#78350f"/></svg>`
};

function loadGameAssets() {
    // 1. Sfondo
    const battleStage = document.querySelector('.battle-stage');
    if (battleStage) {
        battleStage.style.background = 'radial-gradient(circle, #1e1b4b 0%, #0f172a 100%)';
    }

    // 2. Personaggi
    applySvg('hero-character', SVG_ICONS.hero);
    applySvg('enemy-character', SVG_ICONS.enemy);

    // 3. Equipaggiamento
    const slotTypes = ['weapon', 'helmet', 'chest', 'boots', 'ring', 'amulet'];
    slotTypes.forEach(slot => {
        const slotEl = document.querySelector(`.equip-slot[data-slot="${slot}"]`);
        if (slotEl && SVG_ICONS[slot]) {
            slotEl.innerHTML = SVG_ICONS[slot];
        }
    });

    // 4. Forgia
    const anvilEl = document.querySelector('.anvil-display');
    if (anvilEl) {
        anvilEl.innerHTML = `<div class="anvil-wrapper">${SVG_ICONS.anvil}</div><div id="forge-hammer" class="hammer-wrapper">${SVG_ICONS.hammer}</div>`;
    }
}

function applySvg(elementId, svgCode) {
    const el = document.getElementById(elementId);
    if (!el) return;
    let container = el.querySelector('.character-sprite') || el;
    container.innerHTML = svgCode;
}

document.addEventListener('DOMContentLoaded', loadGameAssets);
