// ==========================================================================
// GOLF PERFORMANCE TRACKER - APPLICATION PRINCIPALE
// ==========================================================================

// ==================== VARIABLES GLOBALES ====================
let currentPlayer = null;
let allTests = [];
let radarChart = null;
let historyChart = null;

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadPlayerData();
    setupMobileMenu();
});

function initializeApp() {
    // Définir la date actuelle pour les tests
    document.getElementById('currentTestDate').textContent = new Date().toLocaleDateString('fr-FR');
    
    // Charger les données sauvegardées
    loadFromLocalStorage();
    
    // Initialiser les accordéons
    setupAccordions();
    
    // Populate history select
    populateHistorySelect();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navigation entre onglets
    document.querySelectorAll('.tracker-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Sauvegarde du profil
    document.getElementById('saveProfile')?.addEventListener('click', saveProfile);
    
    // Sauvegarde des tests
    document.getElementById('saveTests')?.addEventListener('click', saveTests);
    document.getElementById('clearTests')?.addEventListener('click', clearTestInputs);
    
    // Gestion des données
    document.getElementById('exportBtn')?.addEventListener('click', exportData);
    document.getElementById('importBtn')?.addEventListener('click', () => document.getElementById('importFile').click());
    document.getElementById('importFile')?.addEventListener('change', importData);
    document.getElementById('generateReport')?.addEventListener('click', generateReport);
    
    // Historique
    document.getElementById('historyTestSelect')?.addEventListener('change', updateHistoryChart);
    document.getElementById('clearHistory')?.addEventListener('click', clearHistory);
    
    // Boutons d'aide
    document.querySelectorAll('.help-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showProtocol(this.dataset.test);
        });
    });
    
    // Modal
    const modal = document.getElementById('helpModal');
    const closeBtn = modal?.querySelector('.close');
    closeBtn?.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// ==================== MENU MOBILE ====================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ==================== ACCORDÉONS ====================
function setupAccordions() {
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            // Fermer tous les accordéons
            document.querySelectorAll('.category-header').forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.classList.remove('active');
            });
            
            // Ouvrir celui cliqué si il n'était pas actif
            if (!isActive) {
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });
}

// ==================== NAVIGATION ====================
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tracker-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Charger le contenu spécifique de l'onglet
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'history') {
        updateHistoryChart();
    }
}

// ==================== PROFIL JOUEUR ====================
function saveProfile() {
    const name = document.getElementById('playerName').value;
    const gender = document.getElementById('playerGender').value;
    const age = document.getElementById('playerAge').value;
    const weight = parseFloat(document.getElementById('playerWeight').value);
    
    if (!name || !weight || weight <= 0) {
        alert('Veuillez remplir tous les champs du profil avec des valeurs valides.');
        return;
    }
    
    currentPlayer = { name, gender, age, weight };
    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    
    alert(`Profil de ${name} enregistré !`);
    updatePlayerDisplay();
}

function loadPlayerData() {
    const saved = localStorage.getItem('currentPlayer');
    if (saved) {
        currentPlayer = JSON.parse(saved);
        document.getElementById('playerName').value = currentPlayer.name;
        document.getElementById('playerGender').value = currentPlayer.gender;
        document.getElementById('playerAge').value = currentPlayer.age;
        document.getElementById('playerWeight').value = currentPlayer.weight;
        updatePlayerDisplay();
    }
}

function updatePlayerDisplay() {
    const display = document.getElementById('playerInfoDisplay');
    if (currentPlayer && display) {
        display.innerHTML = `
            <strong>${currentPlayer.name}</strong> - 
            ${currentPlayer.gender === 'M' ? 'Homme' : 'Femme'}, 
            ${currentPlayer.age}, 
            ${currentPlayer.weight}kg
        `;
    }
}

// ==================== SAUVEGARDE DES TESTS ====================
function saveTests() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer un profil joueur.');
        switchTab('profile');
        return;
    }
    
    const testData = {
        date: new Date().toISOString(),
        player: currentPlayer,
        results: {}
    };
    
    // Collecter tous les tests
    Object.keys(BAREMES).forEach(testKey => {
        const bareme = BAREMES[testKey];
        
        if (bareme.bilateral) {
            // Tests bilatéraux
            const leftValue = parseFloat(document.getElementById(`test-${testKey}-left`)?.value);
            const rightValue = parseFloat(document.getElementById(`test-${testKey}-right`)?.value);
            
            if (!isNaN(leftValue) && !isNaN(rightValue)) {
                testData.results[testKey] = {
                    left: leftValue,
                    right: rightValue
                };
            }
        } else {
            // Tests unilatéraux
            const value = parseFloat(document.getElementById(`test-${testKey}`)?.value);
            if (!isNaN(value)) {
                testData.results[testKey] = value;
            }
        }
    });
    
    // Collecter les tests TPI
    const tpiTests = {};
    document.querySelectorAll('[id^="tpi-"]').forEach(select => {
        if (select.value) {
            const testName = select.id.replace('tpi-', '');
            tpiTests[testName] = select.value;
        }
    });
    if (Object.keys(tpiTests).length > 0) {
        testData.tpi = tpiTests;
    }
    
    // Vérifier qu'au moins un test a été saisi
    if (Object.keys(testData.results).length === 0 && !testData.tpi) {
        alert('Veuillez saisir au moins un test.');
        return;
    }
    
    // Sauvegarder
    allTests.push(testData);
    localStorage.setItem('allTests', JSON.stringify(allTests));
    
    alert(`Tests enregistrés ! ${Object.keys(testData.results).length} tests physiques + ${Object.keys(testData.tpi || {}).length} tests TPI`);
    
    // Mettre à jour le dashboard
    switchTab('dashboard');
}

function clearTestInputs() {
    if (confirm('Êtes-vous sûr de vouloir effacer tous les champs de saisie ?')) {
        document.querySelectorAll('#tests-tab input').forEach(input => {
            input.value = '';
        });
        document.querySelectorAll('#tests-tab select').forEach(select => {
            select.selectedIndex = 0;
        });
    }
}

// ==================== CALCULS ET ÉVALUATIONS ====================
function calculateLevel(testKey, value, gender, age) {
    const bareme = BAREMES[testKey];
    if (!bareme) return null;
    
    const levels = bareme.levels[gender][age];
    if (!levels) return null;
    
    // Gérer le cas "higherIsBetter: false" (ex: navette 5x10m)
    const higherIsBetter = bareme.higherIsBetter !== false;
    
    if (higherIsBetter) {
        if (value < levels[0]) return 1;
        if (value < levels[1]) return 2;
        if (value < levels[2]) return 3;
        return 4;
    } else {
        // Pour les tests où un temps plus bas est meilleur
        if (value > levels[0]) return 1;
        if (value > levels[1]) return 2;
        if (value > levels[2]) return 3;
        return 4;
    }
}

function calculateRatio(weight, load) {
    return load / weight;
}

function calculateAsymmetry(left, right) {
    if (!left || !right) return null;
    const avg = (left + right) / 2;
    const diff = Math.abs(left - right);
    return (diff / avg) * 100;
}

function evaluateTest(testKey, testData) {
    if (!currentPlayer) return null;
    
    const bareme = BAREMES[testKey];
    if (!bareme) return null;
    
    const { gender, age, weight } = currentPlayer;
    
    if (bareme.bilateral) {
        // Test bilatéral
        const { left, right } = testData;
        const asymmetry = calculateAsymmetry(left, right);
        
        // Calculer les valeurs à évaluer
        let leftValue = left;
        let rightValue = right;
        
        if (bareme.unit === 'ratio') {
            leftValue = calculateRatio(weight, left);
            rightValue = calculateRatio(weight, right);
        }
        
        const leftLevel = calculateLevel(testKey, leftValue, gender, age);
        const rightLevel = calculateLevel(testKey, rightValue, gender, age);
        const avgLevel = Math.round((leftLevel + rightLevel) / 2);
        
        // Alerte asymétrie si > 15%
        const hasAsymmetryAlert = asymmetry > 15;
        
        return {
            left,
            right,
            leftValue,
            rightValue,
            leftLevel,
            rightLevel,
            avgLevel: hasAsymmetryAlert ? 1 : avgLevel,
            asymmetry,
            hasAsymmetryAlert,
            unit: bareme.unit
        };
    } else {
        // Test unilatéral
        let value = testData;
        
        if (bareme.unit === 'ratio') {
            value = calculateRatio(weight, testData);
        }
        
        const level = calculateLevel(testKey, value, gender, age);
        
        return {
            raw: testData,
            value,
            level,
            unit: bareme.unit
        };
    }
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    if (!currentPlayer) {
        document.querySelector('.dashboard-container').innerHTML = `
            <div class="alert warning">
                <div class="alert-title">⚠️ Aucun profil</div>
                <p>Veuillez d'abord créer un profil joueur dans l'onglet "Profil".</p>
            </div>
        `;
        return;
    }
    
    const latestTest = allTests[allTests.length - 1];
    if (!latestTest) {
        document.querySelector('.dashboard-container').innerHTML = `
            <div class="alert warning">
                <div class="alert-title">⚠️ Aucun test</div>
                <p>Aucun test enregistré. Allez dans l'onglet "Saisie Tests" pour commencer.</p>
            </div>
        `;
        return;
    }
    
    updatePlayerDisplay();
    displayAsymmetryAlerts(latestTest);
    displayRadarChart(latestTest);
    displayDetailedScores(latestTest);
}

function displayAsymmetryAlerts(testData) {
    const container = document.getElementById('asymmetryAlerts');
    if (!container) return;
    
    container.innerHTML = '<h4 style="color: var(--primary-color); margin-bottom: 1rem;">Alertes Asymétries</h4>';
    
    let hasAlerts = false;
    
    Object.keys(testData.results).forEach(testKey => {
        const bareme = BAREMES[testKey];
        if (!bareme || !bareme.bilateral) return;
        
        const evaluation = evaluateTest(testKey, testData.results[testKey]);
        if (!evaluation) return;
        
        if (evaluation.hasAsymmetryAlert) {
            hasAlerts = true;
            const stronger = evaluation.left > evaluation.right ? 'gauche' : 'droite';
            const alertHTML = `
                <div class="alert warning">
                    <div class="alert-title">⚠️ ${TEST_NAMES[testKey]}</div>
                    <p>Asymétrie de ${evaluation.asymmetry.toFixed(1)}% (côté ${stronger} plus fort)</p>
                    <div class="gauge-container">
                        <span style="min-width: 60px;">Gauche</span>
                        <div class="gauge">
                            <div class="gauge-fill" style="width: 50%;"></div>
                            <div class="gauge-marker" style="left: ${50 - (evaluation.left / (evaluation.left + evaluation.right)) * 100}%;"></div>
                        </div>
                        <span style="min-width: 60px; text-align: right;">Droite</span>
                    </div>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">
                        Gauche: ${evaluation.left}${evaluation.unit} | Droite: ${evaluation.right}${evaluation.unit}
                    </p>
                </div>
            `;
            container.innerHTML += alertHTML;
        }
    });
    
    if (!hasAlerts) {
        container.innerHTML += `
            <div class="alert success">
                <div class="alert-title">✅ Pas d'asymétrie détectée</div>
                <p>Tous les tests bilatéraux montrent un écart inférieur à 15%.</p>
            </div>
        `;
    }
}

function displayRadarChart(testData) {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    // Calculer les scores moyens par catégorie
    const categoryScores = {};
    
    Object.entries(TEST_CATEGORIES).forEach(([catKey, catData]) => {
        const scores = [];
        
        catData.tests.forEach(testKey => {
            if (testData.results[testKey]) {
                const evaluation = evaluateTest(testKey, testData.results[testKey]);
                if (evaluation) {
                    const level = evaluation.avgLevel || evaluation.level;
                    scores.push(level);
                }
            }
        });
        
        if (scores.length > 0) {
            categoryScores[catData.name] = scores.reduce((a, b) => a + b, 0) / scores.length;
        }
    });
    
    // Créer le graphique avec Chart.js (version simplifiée sans dépendance)
    createSimpleRadar(canvas, categoryScores);
}

function createSimpleRadar(canvas, scores) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;
    
    ctx.clearRect(0, 0, width, height);
    
    const categories = Object.keys(scores);
    const values = Object.values(scores);
    const angleStep = (Math.PI * 2) / categories.length;
    
    // Dessiner les cercles de fond
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Dessiner les axes
    ctx.strokeStyle = '#cbd5e0';
    categories.forEach((cat, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#2d3748';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelX = centerX + Math.cos(angle) * (radius + 25);
        const labelY = centerY + Math.sin(angle) * (radius + 25);
        ctx.fillText(cat, labelX, labelY);
    });
    
    // Dessiner la zone de performance
    ctx.beginPath();
    ctx.fillStyle = 'rgba(26, 77, 46, 0.2)';
    ctx.strokeStyle = '#1a4d2e';
    ctx.lineWidth = 2;
    
    values.forEach((value, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const distance = (value / 4) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Dessiner les points
    values.forEach((value, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const distance = (value / 4) * radius;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1a4d2e';
        ctx.fill();
    });
}

function displayDetailedScores(testData) {
    const container = document.getElementById('detailedScores');
    if (!container) return;
    
    container.innerHTML = '<h4 style="color: var(--primary-color); margin-bottom: 1.5rem; text-align: center;">Scores Détaillés</h4>';
    
    Object.entries(TEST_CATEGORIES).forEach(([catKey, catData]) => {
        const categoryHTML = [];
        let hasTests = false;
        
        catData.tests.forEach(testKey => {
            if (testData.results[testKey]) {
                hasTests = true;
                const evaluation = evaluateTest(testKey, testData.results[testKey]);
                if (!evaluation) return;
                
                const level = evaluation.avgLevel || evaluation.level;
                let displayValue;
                
                if (evaluation.left !== undefined) {
                    displayValue = `G: ${evaluation.left}${evaluation.unit} / D: ${evaluation.right}${evaluation.unit}`;
                } else {
                    displayValue = `${evaluation.raw || evaluation.value}${evaluation.unit === 'ratio' ? 'x PDC' : evaluation.unit}`;
                }
                
                categoryHTML.push(`
                    <div class="score-item">
                        <div class="score-name">${TEST_NAMES[testKey]}</div>
                        <div class="score-value">${displayValue}</div>
                        <div class="score-level">
                            <span class="level-badge level-${level}">Niveau ${level}</span>
                        </div>
                    </div>
                `);
            }
        });
        
        if (hasTests) {
            container.innerHTML += `
                <div class="score-category">
                    <h4>${catData.icon} ${catData.name}</h4>
                    ${categoryHTML.join('')}
                </div>
            `;
        }
    });
}

// ==================== HISTORIQUE ====================
function populateHistorySelect() {
    const select = document.getElementById('historyTestSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Sélectionner un test...</option>';
    
    Object.entries(TEST_NAMES).forEach(([key, name]) => {
        select.innerHTML += `<option value="${key}">${name}</option>`;
    });
}

function updateHistoryChart() {
    const testKey = document.getElementById('historyTestSelect').value;
    if (!testKey) return;
    
    const canvas = document.getElementById('historyChart');
    const tableContainer = document.getElementById('historyTable');
    
    if (!canvas || !tableContainer) return;
    
    // Collecter les données historiques
    const historicalData = allTests
        .filter(test => test.results[testKey])
        .map(test => ({
            date: new Date(test.date),
            value: test.results[testKey],
            player: test.player
        }));
    
    if (historicalData.length === 0) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        tableContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Aucune donnée disponible pour ce test.</p>';
        return;
    }
    
    // Créer le graphique
    createLineChart(canvas, historicalData, testKey);
    
    // Créer le tableau
    createHistoryTable(tableContainer, historicalData, testKey);
}

function createLineChart(canvas, data, testKey) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 400;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 60;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Calculer les valeurs min/max
    const bareme = BAREMES[testKey];
    const values = data.map(d => {
        if (bareme.bilateral) {
            return Math.max(d.value.left, d.value.right);
        }
        return d.value;
    });
    
    const minValue = Math.min(...values) * 0.9;
    const maxValue = Math.max(...values) * 1.1;
    
    // Dessiner les axes
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Dessiner la ligne
    ctx.strokeStyle = '#1a4d2e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, i) => {
        const value = bareme.bilateral ? (point.value.left + point.value.right) / 2 : point.value;
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Dessiner les points
    data.forEach((point, i) => {
        const value = bareme.bilateral ? (point.value.left + point.value.right) / 2 : point.value;
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = height - padding - ((value - minValue) / (maxValue - minValue)) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#1a4d2e';
        ctx.fill();
        
        // Label de date
        ctx.fillStyle = '#2d3748';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(point.date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }), x, height - padding + 20);
    });
    
    // Titre
    ctx.fillStyle = '#1a4d2e';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Évolution - ${TEST_NAMES[testKey]}`, width / 2, 30);
}

function createHistoryTable(container, data, testKey) {
    const bareme = BAREMES[testKey];
    
    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    ${bareme.bilateral ? '<th>Gauche</th><th>Droite</th><th>Asymétrie</th>' : '<th>Valeur</th>'}
                    <th>Niveau</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.reverse().forEach(point => {
        const evaluation = evaluateTest(testKey, point.value);
        const level = evaluation.avgLevel || evaluation.level;
        const date = point.date.toLocaleDateString('fr-FR');
        
        if (bareme.bilateral) {
            tableHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${point.value.left}${bareme.unit}</td>
                    <td>${point.value.right}${bareme.unit}</td>
                    <td>${evaluation.asymmetry.toFixed(1)}%</td>
                    <td><span class="level-badge level-${level}">Niveau ${level}</span></td>
                </tr>
            `;
        } else {
            tableHTML += `
                <tr>
                    <td>${date}</td>
                    <td>${point.value}${bareme.unit}</td>
                    <td><span class="level-badge level-${level}">Niveau ${level}</span></td>
                </tr>
            `;
        }
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

function clearHistory() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique des tests ?')) {
        allTests = [];
        localStorage.removeItem('allTests');
        alert('Historique effacé.');
        document.getElementById('historyChart').getContext('2d').clearRect(0, 0, 1000, 1000);
        document.getElementById('historyTable').innerHTML = '';
    }
}

// ==================== IMPORT/EXPORT ====================
function exportData() {
    const dataToExport = {
        player: currentPlayer,
        tests: allTests,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `golf-tracker-${currentPlayer?.name || 'data'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Données exportées avec succès !');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (importedData.player) {
                currentPlayer = importedData.player;
                localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
                loadPlayerData();
            }
            
            if (importedData.tests && Array.isArray(importedData.tests)) {
                allTests = importedData.tests;
                localStorage.setItem('allTests', JSON.stringify(allTests));
            }
            
            alert('Données importées avec succès !');
            switchTab('dashboard');
        } catch (error) {
            alert('Erreur lors de l\'import : fichier invalide.');
            console.error(error);
        }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
}

// ==================== RAPPORT ====================
function generateReport() {
    if (!currentPlayer || allTests.length === 0) {
        alert('Veuillez d\'abord enregistrer un profil et des tests.');
        return;
    }
    
    const latestTest = allTests[allTests.length - 1];
    
    let reportHTML = `
        <html>
        <head>
            <title>Rapport Performance - ${currentPlayer.name}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #1a4d2e; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #1a4d2e; color: white; }
                .level-1 { background: #ff6b6b; color: white; padding: 4px 8px; border-radius: 4px; }
                .level-2 { background: #ffa94d; color: white; padding: 4px 8px; border-radius: 4px; }
                .level-3 { background: #95d5b2; color: white; padding: 4px 8px; border-radius: 4px; }
                .level-4 { background: #1a4d2e; color: white; padding: 4px 8px; border-radius: 4px; }
                .alert { background: #fff5f5; border-left: 4px solid #ff6b6b; padding: 10px; margin: 10px 0; }
            </style>
        </head>
        <body>
            <h1>Rapport de Performance Golf</h1>
            <h2>Joueur: ${currentPlayer.name}</h2>
            <p><strong>Profil:</strong> ${currentPlayer.gender === 'M' ? 'Homme' : 'Femme'}, ${currentPlayer.age}, ${currentPlayer.weight}kg</p>
            <p><strong>Date du test:</strong> ${new Date(latestTest.date).toLocaleDateString('fr-FR')}</p>
            
            <h3>Alertes Asymétries</h3>
    `;
    
    // Asymétries
    let hasAsymmetries = false;
    Object.keys(latestTest.results).forEach(testKey => {
        const bareme = BAREMES[testKey];
        if (!bareme || !bareme.bilateral) return;
        
        const evaluation = evaluateTest(testKey, latestTest.results[testKey]);
        if (evaluation && evaluation.hasAsymmetryAlert) {
            hasAsymmetries = true;
            reportHTML += `
                <div class="alert">
                    <strong>${TEST_NAMES[testKey]}:</strong> Asymétrie de ${evaluation.asymmetry.toFixed(1)}%
                    (Gauche: ${evaluation.left}${evaluation.unit}, Droite: ${evaluation.right}${evaluation.unit})
                </div>
            `;
        }
    });
    
    if (!hasAsymmetries) {
        reportHTML += '<p>✅ Aucune asymétrie significative détectée.</p>';
    }
    
    // Résultats par catégorie
    reportHTML += '<h3>Résultats Détaillés</h3>';
    
    Object.entries(TEST_CATEGORIES).forEach(([catKey, catData]) => {
        const categoryTests = [];
        
        catData.tests.forEach(testKey => {
            if (latestTest.results[testKey]) {
                const evaluation = evaluateTest(testKey, latestTest.results[testKey]);
                if (evaluation) {
                    const level = evaluation.avgLevel || evaluation.level;
                    let displayValue;
                    
                    if (evaluation.left !== undefined) {
                        displayValue = `G: ${evaluation.left}${evaluation.unit} / D: ${evaluation.right}${evaluation.unit}`;
                    } else {
                        displayValue = `${evaluation.raw || evaluation.value}${evaluation.unit === 'ratio' ? 'x PDC' : evaluation.unit}`;
                    }
                    
                    categoryTests.push({
                        name: TEST_NAMES[testKey],
                        value: displayValue,
                        level
                    });
                }
            }
        });
        
        if (categoryTests.length > 0) {
            reportHTML += `
                <h4>${catData.icon} ${catData.name}</h4>
                <table>
                    <tr><th>Test</th><th>Résultat</th><th>Niveau</th></tr>
            `;
            
            categoryTests.forEach(test => {
                reportHTML += `
                    <tr>
                        <td>${test.name}</td>
                        <td>${test.value}</td>
                        <td><span class="level-${test.level}">Niveau ${test.level}</span></td>
                    </tr>
                `;
            });
            
            reportHTML += '</table>';
        }
    });
    
    reportHTML += `
            <hr>
            <p style="text-align: center; color: #666;">
                Rapport généré par Golf Performance Tracker - Bastian MAS<br>
                Contact: bastianmas@gmail.com | 06 18 77 85 82
            </p>
        </body>
        </html>
    `;
    
    // Ouvrir dans une nouvelle fenêtre
    const printWindow = window.open('', '_blank');
    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

// ==================== PROTOCOLES ====================
function showProtocol(testKey) {
    const protocol = PROTOCOLS[testKey];
    if (!protocol) return;
    
    const modal = document.getElementById('helpModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.textContent = protocol.title;
    body.innerHTML = `
        <p><strong>Matériel:</strong> ${protocol.material}</p>
        <p><strong>Protocole:</strong></p>
        <pre style="white-space: pre-wrap; background: #f7fafc; padding: 1rem; border-radius: 8px;">${protocol.protocol}</pre>
        <p><strong>💡 Conseil:</strong> ${protocol.tips}</p>
    `;
    
    modal.style.display = 'block';
}

// ==================== LOCAL STORAGE ====================
function loadFromLocalStorage() {
    const savedTests = localStorage.getItem('allTests');
    if (savedTests) {
        try {
            allTests = JSON.parse(savedTests);
        } catch (e) {
            console.error('Error loading tests:', e);
            allTests = [];
        }
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== NOUVELLES FONCTIONNALITÉS PROFIL ====================

// Gestion de la photo de profil
document.getElementById('profilePhoto')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('profilePhotoPreview');
            preview.src = event.target.result;
            preview.style.display = 'block';
            document.getElementById('removePhoto').style.display = 'inline-block';
            
            // Sauvegarder la photo en base64
            if (currentPlayer) {
                currentPlayer.photo = event.target.result;
                localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
            }
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('removePhoto')?.addEventListener('click', function() {
    document.getElementById('profilePhotoPreview').style.display = 'none';
    document.getElementById('profilePhoto').value = '';
    this.style.display = 'none';
    if (currentPlayer) {
        delete currentPlayer.photo;
        localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    }
});

// Gestion de la couleur de personnalisation
document.getElementById('profileColor')?.addEventListener('change', function() {
    const color = this.value;
    document.documentElement.style.setProperty('--primary-color', color);
    document.getElementById('colorPreview').textContent = color;
    
    if (currentPlayer) {
        currentPlayer.color = color;
        localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    }
});

// Gestion du niveau de jeu
document.getElementById('playerLevel')?.addEventListener('change', function() {
    const handicapGroup = document.getElementById('handicapGroup');
    const circuitGroup = document.getElementById('circuitGroup');
    
    if (this.value === 'playing-pro') {
        handicapGroup.style.display = 'none';
        circuitGroup.style.display = 'block';
    } else {
        handicapGroup.style.display = 'block';
        circuitGroup.style.display = 'none';
    }
});

// Calcul de l'équation de Mirwald
function calculateMirwald() {
    const gender = document.getElementById('playerGender').value;
    const age = document.getElementById('playerAge').value;
    const height = parseFloat(document.getElementById('playerHeight').value);
    const sittingHeight = parseFloat(document.getElementById('playerSittingHeight').value);
    const weight = parseFloat(document.getElementById('playerWeight').value);
    
    // Seulement pour les jeunes < 17 ans
    if (!age || age === '17-25' || age === '25-40' || age === '40-50' || age === '50+') {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    if (!height || !sittingHeight || !weight) {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    // Calcul de l'âge depuis le pic de croissance (Mirwald et al., 2002)
    const legLength = height - sittingHeight;
    const sittingHeightRatio = (sittingHeight / height) * 100;
    
    let maturityOffset;
    
    if (gender === 'M') {
        // Garçons
        maturityOffset = -9.236 + 
                        (0.0002708 * legLength * sittingHeight) + 
                        (-0.001663 * age * legLength) + 
                        (0.007216 * age * sittingHeight) + 
                        (0.02292 * weight / height * 100);
    } else {
        // Filles
        maturityOffset = -9.376 + 
                        (0.0001882 * legLength * sittingHeight) + 
                        (0.0022 * age * legLength) + 
                        (0.005841 * age * sittingHeight) + 
                        (-0.002658 * age * weight) + 
                        (0.07693 * weight / height * 100);
    }
    
    // Afficher le résultat
    const resultDiv = document.getElementById('mirwaldResult');
    const displayDiv = resultDiv.querySelector('.mirwald-display');
    
    resultDiv.style.display = 'block';
    
    if (maturityOffset < -1) {
        displayDiv.innerHTML = `⏳ Pré-pubertaire<br><small>${Math.abs(maturityOffset).toFixed(1)} ans avant le pic de croissance</small>`;
        displayDiv.style.background = '#e3f2fd';
    } else if (maturityOffset >= -1 && maturityOffset <= 1) {
        displayDiv.innerHTML = `📈 En plein pic de croissance<br><small>Phase critique de développement</small>`;
        displayDiv.style.background = '#fff3e0';
    } else {
        displayDiv.innerHTML = `✅ Post-pubertaire<br><small>${maturityOffset.toFixed(1)} ans après le pic de croissance</small>`;
        displayDiv.style.background = '#e8f5e9';
    }
    
    return maturityOffset;
}

// Écouter les changements pour calculer Mirwald
['playerGender', 'playerAge', 'playerHeight', 'playerSittingHeight', 'playerWeight'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateMirwald);
    document.getElementById(id)?.addEventListener('change', calculateMirwald);
});

// Bouton d'aide Mirwald
document.getElementById('mirwaldHelp')?.addEventListener('click', function(e) {
    e.preventDefault();
    showMirwaldInfo();
});

function showMirwaldInfo() {
    const modal = document.getElementById('helpModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.textContent = "Équation de Mirwald - Maturité Biologique";
    body.innerHTML = `
        <h4>Qu'est-ce que l'équation de Mirwald ?</h4>
        <p>L'équation de Mirwald (2002) permet d'estimer l'âge de maturité d'un jeune athlète en calculant 
        son écart par rapport au pic de vitesse de croissance (PHV - Peak Height Velocity).</p>
        
        <h4>Pourquoi c'est important ?</h4>
        <ul>
            <li><strong>Individualisation :</strong> Deux joueurs de 14 ans peuvent avoir des niveaux de maturité très différents</li>
            <li><strong>Prévention des blessures :</strong> Les phases de croissance rapide augmentent les risques</li>
            <li><strong>Programmation adaptée :</strong> L'entraînement doit s'adapter au stade de développement</li>
            <li><strong>Détection de talents :</strong> Éviter de confondre maturité précoce et talent réel</li>
        </ul>
        
        <h4>Comment mesurer ?</h4>
        <ol>
            <li><strong>Taille debout :</strong> Se tenir droit contre un mur, pieds joints</li>
            <li><strong>Taille assise :</strong> Assis sur un banc dur, dos contre le mur, mesurer du sommet de la tête au banc</li>
            <li>L'équation calcule automatiquement l'écart au pic de croissance</li>
        </ol>
        
        <h4>Interprétation</h4>
        <ul>
            <li><strong>&lt; -1 an :</strong> Pré-pubertaire (avant le pic)</li>
            <li><strong>-1 à +1 an :</strong> En plein pic de croissance (phase critique)</li>
            <li><strong>&gt; +1 an :</strong> Post-pubertaire (après le pic)</li>
        </ul>
        
        <p style="margin-top: 1rem;"><strong>📚 Référence :</strong> Mirwald et al. (2002). 
        "An assessment of maturity from anthropometric measurements." 
        Medicine & Science in Sports & Exercise.</p>
    `;
    
    modal.style.display = 'block';
}

// Effacer le profil
document.getElementById('clearProfile')?.addEventListener('click', function() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les informations du profil ?')) {
        document.getElementById('playerName').value = '';
        document.getElementById('playerGender').value = 'M';
        document.getElementById('playerAge').value = '<12';
        document.getElementById('playerWeight').value = '';
        document.getElementById('playerHeight').value = '';
        document.getElementById('playerSittingHeight').value = '';
        document.getElementById('playerLevel').value = 'amateur';
        document.getElementById('playerHandicap').value = '';
        document.getElementById('profilePhoto').value = '';
        document.getElementById('profilePhotoPreview').style.display = 'none';
        document.getElementById('removePhoto').style.display = 'none';
        document.getElementById('profileColor').value = '#1a4d2e';
        document.getElementById('mirwaldResult').style.display = 'none';
    }
});

// Mettre à jour la fonction saveProfile
const originalSaveProfile = window.saveProfile;
window.saveProfile = function() {
    const name = document.getElementById('playerName').value;
    const gender = document.getElementById('playerGender').value;
    const age = document.getElementById('playerAge').value;
    const weight = parseFloat(document.getElementById('playerWeight').value);
    const height = parseFloat(document.getElementById('playerHeight').value);
    const sittingHeight = parseFloat(document.getElementById('playerSittingHeight').value) || null;
    const level = document.getElementById('playerLevel').value;
    const handicap = document.getElementById('playerHandicap').value || null;
    const circuit = document.getElementById('playerCircuit').value || null;
    const color = document.getElementById('profileColor').value;
    const photoPreview = document.getElementById('profilePhotoPreview');
    const photo = photoPreview.style.display !== 'none' ? photoPreview.src : null;
    
    if (!name || !weight || weight <= 0 || !height || height <= 0) {
        alert('Veuillez remplir tous les champs obligatoires (*) avec des valeurs valides.');
        return;
    }
    
    currentPlayer = { 
        name, 
        gender, 
        age, 
        weight, 
        height,
        sittingHeight,
        level,
        handicap,
        circuit,
        color,
        photo
    };
    
    // Calculer Mirwald si applicable
    if (sittingHeight) {
        currentPlayer.mirwald = calculateMirwald();
    }
    
    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    
    // Appliquer la couleur
    document.documentElement.style.setProperty('--primary-color', color);
    
    alert(`Profil de ${name} enregistré !`);
    updatePlayerDisplay();
};

// Mettre à jour la fonction loadPlayerData
const originalLoadPlayerData = window.loadPlayerData;
window.loadPlayerData = function() {
    const saved = localStorage.getItem('currentPlayer');
    if (saved) {
        currentPlayer = JSON.parse(saved);
        document.getElementById('playerName').value = currentPlayer.name;
        document.getElementById('playerGender').value = currentPlayer.gender;
        document.getElementById('playerAge').value = currentPlayer.age || '17+';
        document.getElementById('playerWeight').value = currentPlayer.weight;
        document.getElementById('playerHeight').value = currentPlayer.height || '';
        document.getElementById('playerSittingHeight').value = currentPlayer.sittingHeight || '';
        document.getElementById('playerLevel').value = currentPlayer.level || 'amateur';
        document.getElementById('playerHandicap').value = currentPlayer.handicap || '';
        document.getElementById('playerCircuit').value = currentPlayer.circuit || '';
        document.getElementById('profileColor').value = currentPlayer.color || '#1a4d2e';
        
        // Appliquer la couleur
        if (currentPlayer.color) {
            document.documentElement.style.setProperty('--primary-color', currentPlayer.color);
            document.getElementById('colorPreview').textContent = currentPlayer.color;
        }
        
        // Charger la photo
        if (currentPlayer.photo) {
            const preview = document.getElementById('profilePhotoPreview');
            preview.src = currentPlayer.photo;
            preview.style.display = 'block';
            document.getElementById('removePhoto').style.display = 'inline-block';
        }
        
        // Afficher le bon groupe (handicap ou circuit)
        if (currentPlayer.level === 'playing-pro') {
            document.getElementById('handicapGroup').style.display = 'none';
            document.getElementById('circuitGroup').style.display = 'block';
        }
        
        updatePlayerDisplay();
        calculateMirwald();
    }
};

// Initialiser au chargement
loadPlayerData();

