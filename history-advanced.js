// ==========================================================================
// HISTORIQUE AVANCÉ - VERSION COMPLÈTE ET FONCTIONNELLE
// ==========================================================================

// Variables globales
let radarHistoryChart = null;
let currentFilter = {
    quality: 'all',
    test: 'all'
};

// Couleurs et icônes par qualité
const QUALITY_COLORS = {
    force: '#e74c3c',
    vitesse: '#f39c12',
    endurance: '#3498db',
    explosivite: '#9b59b6',
    core: '#e67e22',
    mobilite: '#1abc9c',
    equilibre: '#34495e',
    tpi: '#16a085'
};

const QUALITY_ICONS = {
    force: '💪',
    vitesse: '⚡',
    endurance: '🏃',
    explosivite: '🚀',
    core: '🎯',
    mobilite: '🤸',
    equilibre: '⚖️',
    tpi: '🏌️'
};

const QUALITY_NAMES = {
    force: 'Force',
    vitesse: 'Vitesse',
    endurance: 'Endurance',
    explosivite: 'Explosivité',
    core: 'Core & Stabilité',
    mobilite: 'Mobilité',
    equilibre: 'Équilibre',
    tpi: 'Tests TPI'
};

// ==========================================================================
// FONCTION PRINCIPALE D'AFFICHAGE
// ==========================================================================

function displayHistoryAdvanced() {
    console.log('🔄 displayHistoryAdvanced() appelé');
    
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const container = document.querySelector('.history-container');
    
    if (!container) {
        console.error('❌ Conteneur .history-container non trouvé');
        return;
    }
    
    console.log(`📊 ${history.length} tests dans l'historique`);
    
    // Si pas de tests
    if (history.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">📊</div>
                <h3 style="color: #666; margin-bottom: 10px;">Aucun test enregistré</h3>
                <p style="color: #999;">Commencez par saisir vos premiers tests dans l'onglet "Saisie Tests"</p>
            </div>
        `;
        return;
    }
    
    // TRIER PAR DATE (PLUS RÉCENT EN PREMIER)
    const sortedHistory = [...history].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Décroissant
    });
    
    console.log('📅 Tests triés:', sortedHistory.slice(0, 3).map(t => ({
        date: new Date(t.date).toLocaleString('fr-FR'),
        quality: t.quality
    })));
    
    // Construire le HTML
    let html = `
        <h3>📈 Historique & Progression</h3>
        
        <!-- Section supérieure: Radar + Filtres -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px;">
            <!-- Radar Chart -->
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; color: #1a4d2e; font-size: 18px;">📊 Vue d'ensemble des 7 Qualités</h4>
                <canvas id="radarHistoryChart" style="max-height: 300px;"></canvas>
            </div>
            
            <!-- Filtres -->
            <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h4 style="margin: 0 0 15px 0; color: #1a4d2e; font-size: 18px;">🔍 Filtres</h4>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 14px; color: #333;">Qualité</label>
                    <select id="filterQuality" onchange="applyFilters()" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
                        <option value="all">Toutes les qualités</option>
                        <option value="force">💪 Force</option>
                        <option value="vitesse">⚡ Vitesse</option>
                        <option value="endurance">🏃 Endurance</option>
                        <option value="explosivite">🚀 Explosivité</option>
                        <option value="core">🎯 Core & Stabilité</option>
                        <option value="mobilite">🤸 Mobilité</option>
                        <option value="equilibre">⚖️ Équilibre</option>
                        <option value="tpi">🏌️ Tests TPI</option>
                    </select>
                </div>
            </div>
        </div>
        
        <!-- Timeline des tests -->
        <div id="testsTimeline"></div>
    `;
    
    container.innerHTML = html;
    
    // Attendre que le DOM soit mis à jour
    setTimeout(() => {
        console.log('⏱️ Initialisation des graphiques...');
        initRadarChart(sortedHistory);
        displayTimeline(sortedHistory);
        
        // Afficher les alertes
        if (typeof displayAlerts === 'function') {
            console.log('🚨 Appel displayAlerts()');
            displayAlerts();
        } else {
            console.warn('⚠️ displayAlerts() non disponible');
        }
    }, 100);
}

// ==========================================================================
// RADAR CHART
// ==========================================================================

function initRadarChart(history) {
    console.log('📊 Initialisation radar chart...');
    
    const canvas = document.getElementById('radarHistoryChart');
    if (!canvas) {
        console.error('❌ Canvas radarHistoryChart introuvable');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js non chargé');
        return;
    }
    
    if (typeof QUALITY_TESTS === 'undefined') {
        console.error('❌ QUALITY_TESTS non défini');
        return;
    }
    
    // Détruire l'ancien graphique
    if (radarHistoryChart) {
        radarHistoryChart.destroy();
    }
    
    // Calculer les scores moyens par qualité
    const scores = calculateAverageScores(history);
    
    console.log('📈 Scores calculés:', scores);
    
    const ctx = canvas.getContext('2d');
    radarHistoryChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Force', 'Vitesse', 'Endurance', 'Explosivité', 'Core', 'Mobilité', 'Équilibre'],
            datasets: [{
                label: 'Performance /20',
                data: [
                    scores.force || 0,
                    scores.vitesse || 0,
                    scores.endurance || 0,
                    scores.explosivite || 0,
                    scores.core || 0,
                    scores.mobilite || 0,
                    scores.equilibre || 0
                ],
                backgroundColor: 'rgba(26, 77, 46, 0.2)',
                borderColor: 'rgba(26, 77, 46, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(26, 77, 46, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(26, 77, 46, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 20,
                    ticks: { 
                        stepSize: 5,
                        backdropColor: 'transparent'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            plugins: {
                legend: { 
                    display: false 
                }
            }
        }
    });
    
    console.log('✅ Radar chart créé');
}

// Calculer les scores moyens par qualité
function calculateAverageScores(history) {
    const scores = {};
    const qualityKeys = ['force', 'vitesse', 'endurance', 'explosivite', 'core', 'mobilite', 'equilibre'];
    
    qualityKeys.forEach(qualityKey => {
        const testsForQuality = history.filter(t => t.quality === qualityKey);
        if (testsForQuality.length === 0) {
            scores[qualityKey] = 0;
            return;
        }
        
        // Prendre le test le plus récent
        const latestTest = testsForQuality[0];
        const quality = QUALITY_TESTS[qualityKey];
        if (!quality) return;
        
        let totalScore = 0;
        let count = 0;
        
        quality.tests.forEach(testDef => {
            const testResult = latestTest.tests[testDef.key];
            if (!testResult) return;
            
            if (testDef.bilateral) {
                if (testResult.left !== null && testResult.left !== undefined) {
                    const score = calculateScore20(testDef.key + '-left', testResult.left);
                    if (score) {
                        totalScore += score;
                        count++;
                    }
                }
                if (testResult.right !== null && testResult.right !== undefined) {
                    const score = calculateScore20(testDef.key + '-right', testResult.right);
                    if (score) {
                        totalScore += score;
                        count++;
                    }
                }
            } else {
                const score = calculateScore20(testDef.key, testResult);
                if (score) {
                    totalScore += score;
                    count++;
                }
            }
        });
        
        scores[qualityKey] = count > 0 ? totalScore / count : 0;
    });
    
    return scores;
}

// ==========================================================================
// TIMELINE DES TESTS
// ==========================================================================

function displayTimeline(history) {
    console.log('📅 Affichage timeline...');
    
    const timeline = document.getElementById('testsTimeline');
    if (!timeline) {
        console.error('❌ testsTimeline non trouvé');
        return;
    }
    
    let html = '';
    
    // Regrouper les tests par qualité
    const testsByQuality = {};
    history.forEach((test, index) => {
        // Appliquer les filtres
        if (currentFilter.quality !== 'all' && test.quality !== currentFilter.quality) {
            return;
        }
        
        if (!testsByQuality[test.quality]) {
            testsByQuality[test.quality] = [];
        }
        testsByQuality[test.quality].push({test, index});
    });
    
    // Afficher les tests regroupés par qualité
    const qualityOrder = ['force', 'vitesse', 'endurance', 'explosivite', 'core', 'mobilite', 'equilibre', 'tpi'];
    
    qualityOrder.forEach(qualityKey => {
        if (!testsByQuality[qualityKey]) return;
        
        const quality = QUALITY_TESTS[qualityKey];
        if (!quality) return;
        
        const color = QUALITY_COLORS[qualityKey] || '#999';
        const icon = QUALITY_ICONS[qualityKey] || '📊';
        const name = QUALITY_NAMES[qualityKey] || qualityKey;
        
        // En-tête de la qualité
        html += `
            <div style="margin: 30px 0 15px 0;">
                <h3 style="display: flex; align-items: center; gap: 10px; color: ${color}; margin: 0;">
                    <span style="font-size: 32px;">${icon}</span>
                    <span style="text-transform: uppercase;">${name}</span>
                    <span style="font-size: 14px; color: #999; font-weight: normal;">(${testsByQuality[qualityKey].length} enregistrement${testsByQuality[qualityKey].length > 1 ? 's' : ''})</span>
                </h3>
            </div>
        `;
        
        // Afficher tous les tests de cette qualité
        testsByQuality[qualityKey].forEach(({test, index}) => {
            // Trouver le test précédent de la MÊME qualité
            let previousTest = null;
            for (let i = index + 1; i < history.length; i++) {
                if (history[i].quality === test.quality) {
                    previousTest = history[i];
                    break;
                }
            }
            
            html += `
                <div class="test-card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px; border-left: 4px solid ${color};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                                <span style="font-size: 24px;">${icon}</span>
                                <h4 style="margin: 0; color: ${color}; font-size: 18px;">${name}</h4>
                                <span style="font-size: 12px; color: #999;">(${countTests(test)} tests complétés)</span>
                            </div>
                            <div style="color: #666; font-size: 14px;">📅 ${formatDate(test.date)}</div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="editTest(${test.id})" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                ✏️ Modifier
                            </button>
                            <button onclick="deleteTest(${test.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                        ${renderTestResults(test, previousTest, quality)}
                    </div>
                    
                    ${test.coachNotes ? renderCoachNotes(test.coachNotes) : ''}
                </div>
            `;
        });
    });
    
    if (html === '') {
        html = '<div style="text-align: center; padding: 40px; color: #999;">Aucun test ne correspond aux filtres sélectionnés</div>';
    }
    
    timeline.innerHTML = html;
    console.log('✅ Timeline affichée');
}
// Rendre les résultats des tests
function renderTestResults(test, previousTest, quality) {
    let html = '';
    
    quality.tests.forEach(testDef => {
        const testResult = test.tests[testDef.key];
        if (!testResult) return;
        
        html += '<div style="padding: 10px; background: #f8f9fa; border-radius: 8px;">';
        html += `<div style="font-weight: 600; color: #333; margin-bottom: 8px;">${testDef.name}</div>`;
        
        if (testDef.bilateral) {
            // Tests bilatéraux
            const left = testResult.left;
            const right = testResult.right;
            
            if (left !== null && right !== null) {
                html += `<div style="font-size: 16px; font-weight: 700; color: #1a4d2e;">G: ${left}${testDef.unit} | D: ${right}${testDef.unit}</div>`;
                
                // LSI
                const lsi = (Math.min(left, right) / Math.max(left, right)) * 100;
                const lsiColor = lsi >= 90 ? '#27ae60' : lsi >= 85 ? '#f39c12' : '#e74c3c';
                html += `<div style="font-size: 12px; margin-top: 5px; color: ${lsiColor}; font-weight: 600;">LSI: ${lsi.toFixed(1)}%</div>`;
                
                // Progression
                if (previousTest && previousTest.tests[testDef.key]) {
                    const prevLeft = previousTest.tests[testDef.key].left;
                    const prevRight = previousTest.tests[testDef.key].right;
                    
                    if (prevLeft && prevRight) {
                        const avgCurrent = (left + right) / 2;
                        const avgPrev = (prevLeft + prevRight) / 2;
                        const diff = avgCurrent - avgPrev;
                        
                        if (Math.abs(diff) > 0.1) {
                            // Fallback : si higherIsBetter non défini, on assume true (Force, etc.)
                            const higherIsBetter = testDef.higherIsBetter !== undefined ? testDef.higherIsBetter : true;
                            const isImprovement = higherIsBetter ? diff > 0 : diff < 0;
                            html += `
                                <div style="margin-top: 8px; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: 600; background: ${isImprovement ? '#e8f5e9' : '#ffebee'}; color: ${isImprovement ? '#27ae60' : '#e74c3c'};">
                                    ${isImprovement ? '🔺' : '🔻'} ${diff > 0 ? '+' : ''}${diff.toFixed(1)}${testDef.unit}
                                </div>
                            `;
                        }
                    }
                }
                
                // Bouton pour voir l'évolution
                html += `
                    <button onclick="showEvolutionChart('${testDef.key}', '${testDef.name}', '${test.quality}', '${testDef.unit}', true)" 
                            style="margin-top: 8px; width: 100%; background: #3498db; color: white; border: none; padding: 4px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; font-weight: 600;">
                        📊 Voir évolution (moyenne)
                    </button>
                `;
            }
        } else {
            // Tests normaux
            html += `<div style="font-size: 16px; font-weight: 700; color: #1a4d2e;">${testResult}${testDef.unit}</div>`;
            
            // Score
            const score = calculateScore20(testDef.key, testResult);
            if (score) {
                const badge = getBadgeLabel(score);
                html += `<div style="margin-top: 5px;"><span style="padding: 3px 8px; background: ${badge.class === 'elite' ? '#3498db' : badge.class === 'bon' ? '#27ae60' : badge.class === 'moyen' ? '#f39c12' : '#e74c3c'}; color: white; border-radius: 4px; font-size: 11px; font-weight: 600;">${badge.label} ${badge.emoji}</span></div>`;
            }
            
            // Progression
            if (previousTest && previousTest.tests[testDef.key] !== undefined) {
                const prev = previousTest.tests[testDef.key];
                const diff = testResult - prev;
                
                if (Math.abs(diff) > 0.01) {
                    // Fallback : si higherIsBetter non défini, on assume true
                    const higherIsBetter = testDef.higherIsBetter !== undefined ? testDef.higherIsBetter : true;
                    const isImprovement = higherIsBetter ? diff > 0 : diff < 0;
                    html += `
                        <div style="margin-top: 8px; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: 600; background: ${isImprovement ? '#e8f5e9' : '#ffebee'}; color: ${isImprovement ? '#27ae60' : '#e74c3c'};">
                            ${isImprovement ? '🔺' : '🔻'} ${diff > 0 ? '+' : ''}${diff.toFixed(1)}${testDef.unit}
                        </div>
                    `;
                }
            }
            
            // Bouton pour voir l'évolution
            html += `
                <button onclick="showEvolutionChart('${testDef.key}', '${testDef.name}', '${test.quality}', '${testDef.unit}', false)" 
                        style="margin-top: 8px; width: 100%; background: #3498db; color: white; border: none; padding: 4px 8px; border-radius: 5px; cursor: pointer; font-size: 11px; font-weight: 600;">
                    📊 Voir évolution
                </button>
            `;
        }
        
        html += '</div>';
    });
    
    return html;
}

// ==========================================================================
// FONCTIONS UTILITAIRES
// ==========================================================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function countTests(test) {
    let count = 0;
    Object.keys(test.tests).forEach(key => {
        if (test.tests[key]) count++;
    });
    return count;
}

function renderCoachNotes(notes) {
    if (!notes || (!notes.observations && !notes.objectifs && !notes.remarques)) return '';
    
    return `
        <div style="margin-top: 20px; padding: 15px; background: #e8f5e9; border-left: 4px solid #27ae60; border-radius: 8px;">
            <h5 style="margin: 0 0 10px 0; color: #27ae60;">📝 Notes du Coach</h5>
            ${notes.observations ? `<div style="margin-bottom: 8px;"><strong>Observations:</strong> ${notes.observations}</div>` : ''}
            ${notes.objectifs ? `<div style="margin-bottom: 8px;"><strong>Objectifs:</strong> ${notes.objectifs}</div>` : ''}
            ${notes.remarques ? `<div><strong>Remarques:</strong> ${notes.remarques}</div>` : ''}
        </div>
    `;
}

function applyFilters() {
    currentFilter.quality = document.getElementById('filterQuality')?.value || 'all';
    displayHistoryAdvanced();
}

function getBadgeLabel(score) {
    if (score === null) return {label: 'N/A', emoji: '⚪', class: 'faible'};
    if (score >= 17.5) return {label: 'ELITE', emoji: '🔵', class: 'elite'};
    if (score >= 12.5) return {label: 'BON', emoji: '🟢', class: 'bon'};
    if (score >= 7.5) return {label: 'MOYEN', emoji: '🟠', class: 'moyen'};
    return {label: 'FAIBLE', emoji: '🔴', class: 'faible'};
}

console.log('✅ history-advanced.js chargé');
