// ==========================================================================
// GOLF PERFORMANCE TRACKER - HISTORIQUE AVANCÉ
// ==========================================================================

// Variables globales pour les graphiques
let radarHistoryChart = null;
let evolutionHistoryChart = null;
let currentFilter = {
    quality: 'all',
    test: 'all'
};

// Couleurs par qualité
const QUALITY_COLORS = {
    force: '#e74c3c',
    vitesse: '#f39c12',
    endurance: '#e74c3c',
    explosivite: '#9b59b6',
    core: '#1abc9c',
    mobilite: '#f39c12',
    equilibre: '#95a5a6',
    tpi: '#e67e22'
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

// Fonction principale pour afficher l'historique avancé
function displayHistoryAdvanced() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const container = document.querySelector('.history-container');
    
    if (!container) return;
    
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
    
    // Trier par date (plus récent en premier)
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
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
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; font-size: 14px; color: #333;">Test spécifique</label>
                    <select id="filterTest" onchange="applyFilters()" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
                        <option value="all">Tous les tests</option>
                    </select>
                </div>
                
                <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 5px;">Total tests</div>
                    <div id="totalTestsCount" style="font-size: 24px; font-weight: 700; color: #1a4d2e;">${history.length}</div>
                </div>
            </div>
        </div>
        
        <!-- Graphique d'évolution (affiché quand test spécifique sélectionné) -->
        <div id="evolutionSection" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 30px; display: none;">
            <h4 id="evolutionTitle" style="margin: 0 0 15px 0; color: #1a4d2e; font-size: 18px;">📈 Évolution du test</h4>
            <canvas id="evolutionHistoryChart" style="max-height: 250px;"></canvas>
        </div>
        
        <!-- Timeline des tests -->
        <div id="testsTimeline">
            <!-- Sera rempli dynamiquement -->
        </div>
    `;
    
    container.innerHTML = html;
    
    // Attendre que le DOM soit mis à jour avant d'initialiser les graphiques
    setTimeout(() => {
        initRadarChart(sortedHistory);
        populateTestFilter();
        displayTimeline(sortedHistory);
    }, 100);
}

// Fusionner tous les tests pour obtenir le test le plus récent de chaque qualité
function mergeAllTests(history) {
    const merged = {
        tests: {}
    };
    
    // Pour chaque qualité, prendre le test le plus récent
    const qualitiesSeen = {};
    
    history.forEach(test => {
        if (!qualitiesSeen[test.quality]) {
            qualitiesSeen[test.quality] = true;
            
            // Copier tous les tests de cette qualité
            Object.keys(test.tests).forEach(testKey => {
                merged.tests[testKey] = test.tests[testKey];
            });
        }
    });
    
    return merged;
}

// Initialiser le graphique radar
function initRadarChart(history) {
    const canvas = document.getElementById('radarHistoryChart');
    if (!canvas) {
        console.error('Canvas radarHistoryChart introuvable');
        return;
    }
    
    // Vérifier que Chart.js est chargé
    if (typeof Chart === 'undefined') {
        console.error('Chart.js n\'est pas chargé !');
        return;
    }
    
    // Vérifier que QUALITY_TESTS existe
    if (typeof QUALITY_TESTS === 'undefined') {
        console.error('QUALITY_TESTS n\'est pas défini ! Vérifier l\'ordre de chargement des scripts.');
        return;
    }
    
    // Détruire l'ancien graphique s'il existe
    if (radarHistoryChart) {
        radarHistoryChart.destroy();
    }
    
    // Fusionner tous les tests pour obtenir les données les plus récentes de chaque qualité
    const mergedTest = mergeAllTests(history);
    const scores = calculateQualityScoresForHistory(mergedTest);
    
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
}

// Calculer les scores par qualité pour un test
function calculateQualityScoresForHistory(test) {
    const scores = {};
    
    // Vérifier que QUALITY_TESTS existe
    if (typeof QUALITY_TESTS === 'undefined') {
        console.error('QUALITY_TESTS non défini dans calculateQualityScores');
        return scores;
    }
    
    // Vérifier que test existe et a la propriété tests
    if (!test || !test.tests) {
        console.error('Test invalide ou test.tests non défini:', test);
        return scores;
    }
    
    // Pour chaque qualité
    Object.keys(QUALITY_TESTS).forEach(qualityKey => {
        const quality = QUALITY_TESTS[qualityKey];
        let totalScore = 0;
        let count = 0;
        
        quality.tests.forEach(testDef => {
            const testResult = test.tests[testDef.key];
            if (!testResult) return;
            
            if (testDef.bilateral) {
                // Test bilatéral
                const left = testResult.left;
                const right = testResult.right;
                
                if (left !== null) {
                    const score = calculateScore20(testDef.key, left, 'left');
                    if (score !== null) {
                        totalScore += score;
                        count++;
                    }
                }
                if (right !== null) {
                    const score = calculateScore20(testDef.key, right, 'right');
                    if (score !== null) {
                        totalScore += score;
                        count++;
                    }
                }
            } else {
                // Test normal
                const score = calculateScore20(testDef.key, testResult);
                if (score !== null) {
                    totalScore += score;
                    count++;
                }
            }
        });
        
        scores[qualityKey] = count > 0 ? (totalScore / count).toFixed(1) : 0;
    });
    
    return scores;
}

// Peupler le filtre des tests
function populateTestFilter() {
    const select = document.getElementById('filterTest');
    if (!select) return;
    
    select.innerHTML = '<option value="all">Tous les tests</option>';
    
    // Ajouter tous les tests possibles
    Object.keys(QUALITY_TESTS).forEach(qualityKey => {
        const quality = QUALITY_TESTS[qualityKey];
        
        quality.tests.forEach(testDef => {
            if (!testDef.bilateral) {
                const option = document.createElement('option');
                option.value = testDef.key;
                option.textContent = testDef.name;
                option.dataset.quality = qualityKey;
                select.appendChild(option);
            }
        });
    });
}

// Afficher la timeline des tests
function displayTimeline(history) {
    const timeline = document.getElementById('testsTimeline');
    if (!timeline) return;
    
    let html = '';
    
    // Grouper les tests par qualité et date
    const groupedTests = groupTestsByQualityAndDate(history);
    
    groupedTests.forEach(group => {
        const quality = QUALITY_TESTS[group.quality];
        if (!quality) return;
        
        const color = QUALITY_COLORS[group.quality] || '#999';
        const icon = QUALITY_ICONS[group.quality] || '📊';
        const name = QUALITY_NAMES[group.quality] || group.quality;
        
        html += `
            <div class="test-card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px; border-left: 4px solid ${color};">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            <span style="font-size: 24px;">${icon}</span>
                            <h4 style="margin: 0; color: ${color}; font-size: 18px;">${name}</h4>
                        </div>
                        <div style="color: #666; font-size: 14px;">📅 ${formatDate(group.date)}</div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editTest(${group.testId})" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            ✏️ Modifier
                        </button>
                        <button onclick="deleteTest(${group.testId})" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
                    ${renderTestResults(group, history)}
                </div>
            </div>
        `;
    });
    
    timeline.innerHTML = html;
}

// Grouper les tests par qualité et date
function groupTestsByQualityAndDate(history) {
    const groups = [];
    
    history.forEach(test => {
        if (currentFilter.quality !== 'all' && test.quality !== currentFilter.quality) {
            return;
        }
        
        groups.push({
            quality: test.quality,
            date: test.date,
            testId: test.id,
            tests: test.tests,
            coachNotes: test.coachNotes  // Ajouter les notes
        });
    });
    
    return groups;
}

// Rendre les résultats d'un test
function renderTestResults(group, history) {
    const quality = QUALITY_TESTS[group.quality];
    if (!quality) return '';
    
    let html = '';
    
    // Trouver le test précédent pour la progression
    const currentIndex = history.findIndex(t => t.id === group.testId);
    const previousTest = currentIndex < history.length - 1 ? history[currentIndex + 1] : null;
    
    quality.tests.forEach(testDef => {
        // Filtrer par test spécifique si nécessaire
        if (currentFilter.test !== 'all' && testDef.key !== currentFilter.test) {
            return;
        }
        
        const testResult = group.tests[testDef.key];
        if (!testResult) return;
        
        if (testDef.bilateral) {
            // Test bilatéral
            const left = testResult.left;
            const right = testResult.right;
            
            if (left !== null || right !== null) {
                html += renderBilateralTest(testDef, left, right, previousTest);
            }
        } else {
            // Test normal
            html += renderNormalTest(testDef, testResult, previousTest, group.quality);
        }
    });
    
    // Ajouter les notes du coach si elles existent
    if (group.coachNotes && typeof renderCoachNotes !== 'undefined') {
        html += renderCoachNotes(group.coachNotes);
    }
    
    return html;
}

// Rendre un test bilatéral
function renderBilateralTest(testDef, left, right, previousTest) {
    let html = `
        <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
            <div style="font-weight: 600; font-size: 13px; color: #666; margin-bottom: 8px;">${testDef.name}</div>
    `;
    
    if (left !== null && right !== null) {
        html += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span style="font-size: 14px;">G: <strong>${left}${testDef.unit}</strong></span>
                <span style="font-size: 14px;">D: <strong>${right}${testDef.unit}</strong></span>
            </div>
        `;
        
        // Calculer LSI
        const lsi = ((Math.min(left, right) / Math.max(left, right)) * 100).toFixed(1);
        const lsiColor = lsi >= 90 ? '#27ae60' : lsi >= 85 ? '#f39c12' : '#e74c3c';
        
        html += `
            <div style="font-size: 12px; margin-top: 5px; color: ${lsiColor}; font-weight: 600;">
                LSI: ${lsi}%
            </div>
        `;
        
        // Progression
        if (previousTest && previousTest.tests[testDef.key]) {
            const prevLeft = previousTest.tests[testDef.key].left;
            const prevRight = previousTest.tests[testDef.key].right;
            
            if (prevLeft !== null && prevRight !== null) {
                const avgCurrent = (left + right) / 2;
                const avgPrev = (prevLeft + prevRight) / 2;
                const diff = avgCurrent - avgPrev;
                
                if (Math.abs(diff) > 0.1) {
                    const isImprovement = testDef.higherIsBetter ? diff > 0 : diff < 0;
                    html += `
                        <div style="margin-top: 8px; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: 600; background: ${isImprovement ? '#e8f5e9' : '#ffebee'}; color: ${isImprovement ? '#27ae60' : '#e74c3c'};">
                            ${isImprovement ? '🔺' : '🔻'} ${Math.abs(diff).toFixed(1)}${testDef.unit} (moyenne)
                        </div>
                    `;
                }
            }
        }
    } else if (left !== null) {
        html += `<div style="font-size: 20px; font-weight: 700; color: #1a4d2e; margin-bottom: 5px;">G: ${left}${testDef.unit}</div>`;
    } else if (right !== null) {
        html += `<div style="font-size: 20px; font-weight: 700; color: #1a4d2e; margin-bottom: 5px;">D: ${right}${testDef.unit}</div>`;
    }
    
    html += `</div>`;
    return html;
}

// Rendre un test normal
function renderNormalTest(testDef, testResult, previousTest, qualityKey) {
    const score = calculateScore20(testDef.key, testResult);
    const badge = score !== null ? getBadgeLabel(score) : null;
    
    let html = `
        <div style="background: #f8f9fa; padding: 12px; border-radius: 8px;">
            <div style="font-weight: 600; font-size: 13px; color: #666; margin-bottom: 8px;">${testDef.name}</div>
            <div style="font-size: 20px; font-weight: 700; color: #1a4d2e; margin-bottom: 5px;">${testResult}${testDef.unit}</div>
    `;
    
    // Badge
    if (badge) {
        const badgeColors = {
            'FAIBLE': { bg: '#e74c3c', text: 'white' },
            'MOYEN': { bg: '#f39c12', text: 'white' },
            'BON': { bg: '#27ae60', text: 'white' },
            'ELITE': { bg: '#3498db', text: 'white' }
        };
        
        const colors = badgeColors[badge.label] || { bg: '#999', text: 'white' };
        
        html += `
            <span style="display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; background: ${colors.bg}; color: ${colors.text};">
                ${badge.label} ${badge.emoji}
            </span>
        `;
        
        html += `<div style="font-size: 12px; color: #666; margin-top: 5px;">${score.toFixed(1)}/20</div>`;
    }
    
    // Progression
    if (previousTest && previousTest.tests[testDef.key] !== undefined) {
        const prev = previousTest.tests[testDef.key];
        const diff = testResult - prev;
        
        if (Math.abs(diff) > 0.01) {
            const isImprovement = testDef.higherIsBetter ? diff > 0 : diff < 0;
            html += `
                <div style="margin-top: 8px; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: 600; background: ${isImprovement ? '#e8f5e9' : '#ffebee'}; color: ${isImprovement ? '#27ae60' : '#e74c3c'};">
                    ${isImprovement ? '🔺' : '🔻'} ${Math.abs(diff).toFixed(1)}${testDef.unit}
                </div>
            `;
        }
    }
    
    html += `</div>`;
    return html;
}

// Appliquer les filtres
function applyFilters() {
    const qualitySelect = document.getElementById('filterQuality');
    const testSelect = document.getElementById('filterTest');
    
    if (qualitySelect) {
        currentFilter.quality = qualitySelect.value;
    }
    
    if (testSelect) {
        currentFilter.test = testSelect.value;
    }
    
    // Recharger l'historique
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    displayTimeline(sortedHistory);
    
    // Afficher le graphique d'évolution si un test spécifique est sélectionné
    if (currentFilter.test !== 'all') {
        showEvolutionChart(sortedHistory, currentFilter.test);
    } else {
        const section = document.getElementById('evolutionSection');
        if (section) section.style.display = 'none';
        
        // Détruire le graphique
        if (evolutionHistoryChart) {
            evolutionHistoryChart.destroy();
            evolutionHistoryChart = null;
        }
    }
}

// Afficher le graphique d'évolution pour un test spécifique
function showEvolutionChart(history, testKey) {
    const section = document.getElementById('evolutionSection');
    const canvas = document.getElementById('evolutionHistoryChart');
    const title = document.getElementById('evolutionTitle');
    
    if (!section || !canvas || !title) return;
    
    // Trouver le nom du test
    let testName = '';
    let testUnit = '';
    let higherIsBetter = true;
    
    Object.keys(QUALITY_TESTS).forEach(qualityKey => {
        const quality = QUALITY_TESTS[qualityKey];
        const test = quality.tests.find(t => t.key === testKey);
        if (test) {
            testName = test.name;
            testUnit = test.unit;
            higherIsBetter = BAREMES[testKey]?.higherIsBetter !== false;
        }
    });
    
    if (!testName) return;
    
    // Filtrer l'historique pour ce test (inverser pour avoir chronologique)
    const testHistory = history
        .filter(t => t.tests[testKey] !== undefined)
        .reverse();
    
    if (testHistory.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    // Préparer les données
    const labels = testHistory.map(t => formatDateShort(t.date));
    const data = testHistory.map(t => t.tests[testKey]);
    
    // Afficher la section
    section.style.display = 'block';
    title.textContent = `📈 Évolution du test : ${testName}`;
    
    // Détruire l'ancien graphique
    if (evolutionHistoryChart) {
        evolutionHistoryChart.destroy();
    }
    
    // Créer le nouveau graphique
    const ctx = canvas.getContext('2d');
    evolutionHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${testName} (${testUnit})`,
                data: data,
                borderColor: QUALITY_COLORS[currentFilter.quality] || '#1a4d2e',
                backgroundColor: `${QUALITY_COLORS[currentFilter.quality] || '#1a4d2e'}33`,
                tension: 0.3,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: QUALITY_COLORS[currentFilter.quality] || '#1a4d2e',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { 
                    display: true, 
                    position: 'top' 
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${testName}: ${context.parsed.y}${testUnit}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: { 
                        display: true, 
                        text: `${testName} (${testUnit})` 
                    },
                    reverse: !higherIsBetter
                }
            }
        }
    });
}

// Formater une date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options).replace(',', ' à');
}

// Formater une date courte
function formatDateShort(dateStr) {
    const date = new Date(dateStr);
    const options = { 
        day: 'numeric', 
        month: 'short'
    };
    return date.toLocaleDateString('fr-FR', options);
}

// Exporter les fonctions pour utilisation globale
window.displayHistoryAdvanced = displayHistoryAdvanced;
window.applyFilters = applyFilters;
