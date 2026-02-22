// ==================== Golf Performance Tracker - Version Fixed ====================

// Variables globales
let currentPlayer = JSON.parse(localStorage.getItem('currentPlayer') || 'null');

// ==================== FONCTIONS DE NAVIGATION ====================
function switchPage(pageName) {
    console.log('Switching to page:', pageName);
    
    // Masquer toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Afficher la page demandée
    const targetPage = document.getElementById(pageName + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Mettre à jour navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="switchPage('${pageName}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Actions spécifiques par page
    if (pageName === 'tracker') {
        // Charger le tracker
        switchTab('profile');
    } else if (pageName === 'presentation') {
        // Page présentation
        console.log('Page présentation chargée');
    }
}

// ==================== FONCTIONS ONGLETS TRACKER ====================
function switchTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Masquer toutes les vues
    document.querySelectorAll('.analyse-view').forEach(view => {
        view.style.display = 'none';
    });
    
    // Afficher l'onglet demandé
    const targetTab = document.getElementById(tabName + '-tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Mettre à jour boutons navigation
    document.querySelectorAll('.tracker-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Charger le contenu spécifique de l'onglet
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'history') {
        switchHistoryView('evolution');
    } else if (tabName === 'analyse') {
        updateAnalysePro();
        setTimeout(() => switchAnalyseView('synthese'), 100);
    } else if (tabName === 'testsgolf') {
        loadGolfTestsForm();
    } else if (tabName === 'blessures') {
        loadBlessuresTab();
    }
}

// ==================== FONCTIONS BASIQUES ====================
function updateDashboard() {
    console.log('Dashboard mis à jour');
}

function switchHistoryView(view) {
    console.log('History view:', view);
}

function updateAnalysePro() {
    console.log('Analyse Pro mise à jour');
    
    // Affichage simple pour test
    const container = document.getElementById('impactPhysiqueSwing');
    if (container) {
        container.innerHTML = `
            <div style="background: #e8f5e9; padding: 2rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">⛳</div>
                <h4 style="color: #27ae60; margin-bottom: 0.5rem;">Impact Physique Test</h4>
                <p style="color: #666;">Version minimale fonctionnelle</p>
            </div>
        `;
    }
}

function switchAnalyseView(view) {
    console.log('Analyse view:', view);
    
    // Masquer toutes les vues
    document.querySelectorAll('.analyse-view').forEach(v => {
        v.style.display = 'none';
    });
    
    // Afficher la vue demandée
    const targetView = document.getElementById('analyse' + view.charAt(0).toUpperCase() + view.slice(1));
    if (targetView) {
        targetView.style.display = 'block';
    }
    
    // Mettre à jour boutons
    document.querySelectorAll('.analyse-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="switchAnalyseView('${view}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function loadGolfTestsForm() {
    console.log('Golf tests form chargé');
}

function loadBlessuresTab() {
    console.log('Blessures tab chargé');
}

// ==================== FONCTIONS BLESSURES SIMPLIFIÉES ====================
function saveInjury() {
    const zone = document.getElementById('injury-zone')?.value;
    const type = document.getElementById('injury-type')?.value;
    const intensity = parseInt(document.getElementById('injury-intensity')?.value) || 3;
    const comment = document.getElementById('injury-comment')?.value?.trim() || '';
    
    if (!zone) {
        alert('⚠️ Veuillez sélectionner une zone anatomique');
        return;
    }
    
    const injury = {
        id: Date.now(),
        date: new Date().toISOString(),
        zone: zone,
        type: type,
        intensity: intensity,
        comment: comment,
        active: intensity >= 3
    };
    
    // Sauvegarder
    let injuries = JSON.parse(localStorage.getItem('playerInjuries') || '[]');
    injuries.unshift(injury);
    localStorage.setItem('playerInjuries', JSON.stringify(injuries));
    
    // Reset formulaire
    if (document.getElementById('injury-zone')) document.getElementById('injury-zone').value = '';
    if (document.getElementById('injury-type')) document.getElementById('injury-type').value = 'articulaire';
    if (document.getElementById('injury-intensity')) document.getElementById('injury-intensity').value = '3';
    if (document.getElementById('intensity-value')) document.getElementById('intensity-value').textContent = '3';
    if (document.getElementById('injury-comment')) document.getElementById('injury-comment').value = '';
    
    alert('✅ Blessure enregistrée !');
    displayInjuryHistory();
}

function displayInjuryHistory() {
    const container = document.getElementById('injuryHistory');
    if (!container) return;
    
    const injuries = JSON.parse(localStorage.getItem('playerInjuries') || '[]');
    
    if (injuries.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">Aucune blessure enregistrée</p>';
        return;
    }
    
    let html = '';
    injuries.forEach((injury, index) => {
        const date = new Date(injury.date).toLocaleDateString('fr-FR');
        html += `
            <div style="background: white; border: 1px solid #e0e0e0; border-radius: 8px; padding: 1rem; margin-bottom: 0.8rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <strong style="color: #1a4d2e;">${injury.zone}</strong>
                    <span style="font-size: 0.8rem; color: #999;">${date}</span>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <span style="background: #f0f0f0; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; margin-right: 0.5rem;">
                        ${injury.type}
                    </span>
                    <span style="background: ${injury.intensity <= 3 ? '#e8f5e9' : injury.intensity <= 6 ? '#fff3e0' : '#ffebee'}; color: ${injury.intensity <= 3 ? '#27ae60' : injury.intensity <= 6 ? '#f39c12' : '#e74c3c'}; padding: 0.2rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">
                        ${injury.intensity}/10
                    </span>
                </div>
                ${injury.comment ? `<div style="font-size: 0.85rem; color: #666; font-style: italic;">"${injury.comment}"</div>` : ''}
                <button onclick="removeInjury(${index})" style="background: #e74c3c; color: white; border: none; padding: 0.4rem 0.8rem; border-radius: 4px; font-size: 0.8rem; cursor: pointer; margin-top: 0.8rem; float: right;">
                    🗑️ Supprimer
                </button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function removeInjury(index) {
    if (!confirm('Supprimer cette blessure ?')) return;
    
    let injuries = JSON.parse(localStorage.getItem('playerInjuries') || '[]');
    injuries.splice(index, 1);
    localStorage.setItem('playerInjuries', JSON.stringify(injuries));
    
    displayInjuryHistory();
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialisée');
    
    // Initialiser slider intensité
    const intensitySlider = document.getElementById('injury-intensity');
    const intensityValue = document.getElementById('intensity-value');
    
    if (intensitySlider && intensityValue) {
        intensitySlider.addEventListener('input', function() {
            const value = this.value;
            intensityValue.textContent = value;
            
            // Couleur dynamique
            if (value <= 3) {
                intensityValue.style.background = '#27ae60';
            } else if (value <= 6) {
                intensityValue.style.background = '#f39c12';
            } else {
                intensityValue.style.background = '#e74c3c';
            }
        });
    }
    
    // Afficher historique blessures si on est sur l'onglet
    if (document.getElementById('injuryHistory')) {
        displayInjuryHistory();
    }
    
    // Page par défaut
    switchPage('presentation');
});

console.log('✅ App-light-fixed.js chargé avec succès !');
