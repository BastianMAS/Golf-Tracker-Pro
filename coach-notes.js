// ==========================================================================
// NOTES DU COACH - GESTION
// ==========================================================================

// Fonction pour sauvegarder les notes du coach avec les tests
// À intégrer dans app-light.js dans la fonction saveQualityTests()

function getCoachNotes(quality) {
    const notes = {
        observations: document.getElementById(`notes-${quality}-observations`)?.value || '',
        objectifs: document.getElementById(`notes-${quality}-objectifs`)?.value || '',
        remarques: document.getElementById(`notes-${quality}-remarques`)?.value || ''
    };
    
    // Ne retourner que si au moins une note est remplie
    if (notes.observations || notes.objectifs || notes.remarques) {
        return notes;
    }
    
    return null;
}

// Fonction pour afficher les notes dans l'historique
// À utiliser dans history-advanced.js

function renderCoachNotes(notes) {
    if (!notes) return '';
    
    let html = `
        <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #1a4d2e;">
            <div style="font-weight: 600; color: #1a4d2e; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>📝</span>
                <span>Notes du Coach</span>
            </div>
    `;
    
    if (notes.observations) {
        html += `
            <div style="margin-bottom: 8px;">
                <div style="font-size: 12px; color: #666; font-weight: 600;">📋 Observations techniques</div>
                <div style="font-size: 14px; color: #333; margin-top: 3px; white-space: pre-wrap;">${escapeHtml(notes.observations)}</div>
            </div>
        `;
    }
    
    if (notes.objectifs) {
        html += `
            <div style="margin-bottom: 8px;">
                <div style="font-size: 12px; color: #666; font-weight: 600;">🎯 Objectifs prochaine session</div>
                <div style="font-size: 14px; color: #333; margin-top: 3px; white-space: pre-wrap;">${escapeHtml(notes.objectifs)}</div>
            </div>
        `;
    }
    
    if (notes.remarques) {
        html += `
            <div style="margin-bottom: 0;">
                <div style="font-size: 12px; color: #666; font-weight: 600;">💬 Remarques générales</div>
                <div style="font-size: 14px; color: #333; margin-top: 3px; white-space: pre-wrap;">${escapeHtml(notes.remarques)}</div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    return html;
}

// Fonction pour inclure les notes dans le rapport PDF
// À intégrer dans la fonction generateCompleteBilan() de app-light.js

function renderCoachNotesForReport(notes, quality) {
    if (!notes) return '';
    
    const qualityNames = {
        force: 'Force',
        vitesse: 'Vitesse',
        endurance: 'Endurance',
        explosivite: 'Explosivité',
        core: 'Core & Stabilité',
        mobilite: 'Mobilité & Souplesse',
        equilibre: 'Équilibre',
        tpi: 'Tests TPI'
    };
    
    let html = `
        <div style="margin-top: 15px; padding: 12px; background: #f8f9fa; border-left: 3px solid #1a4d2e;">
            <div style="font-weight: bold; color: #1a4d2e; margin-bottom: 8px;">
                📝 Notes du Coach - ${qualityNames[quality] || quality}
            </div>
    `;
    
    if (notes.observations) {
        html += `
            <div style="margin-bottom: 6px;">
                <span style="font-weight: 600; font-size: 13px;">Observations techniques:</span><br>
                <span style="font-size: 13px;">${escapeHtml(notes.observations)}</span>
            </div>
        `;
    }
    
    if (notes.objectifs) {
        html += `
            <div style="margin-bottom: 6px;">
                <span style="font-weight: 600; font-size: 13px;">Objectifs prochaine session:</span><br>
                <span style="font-size: 13px;">${escapeHtml(notes.objectifs)}</span>
            </div>
        `;
    }
    
    if (notes.remarques) {
        html += `
            <div>
                <span style="font-weight: 600; font-size: 13px;">Remarques générales:</span><br>
                <span style="font-size: 13px;">${escapeHtml(notes.remarques)}</span>
            </div>
        `;
    }
    
    html += `</div>`;
    
    return html;
}

// Fonction utilitaire pour échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Fonction pour pré-remplir les notes lors de l'édition d'un test
function loadCoachNotes(quality, notes) {
    if (!notes) return;
    
    const obsEl = document.getElementById(`notes-${quality}-observations`);
    const objEl = document.getElementById(`notes-${quality}-objectifs`);
    const remEl = document.getElementById(`notes-${quality}-remarques`);
    
    if (obsEl && notes.observations) obsEl.value = notes.observations;
    if (objEl && notes.objectifs) objEl.value = notes.objectifs;
    if (remEl && notes.remarques) remEl.value = notes.remarques;
}

// Export des fonctions
window.getCoachNotes = getCoachNotes;
window.renderCoachNotes = renderCoachNotes;
window.renderCoachNotesForReport = renderCoachNotesForReport;
window.loadCoachNotes = loadCoachNotes;
