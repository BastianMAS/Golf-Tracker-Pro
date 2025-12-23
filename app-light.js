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
    console.log('🚀 Initialisation de l\'application...');
    initializeApp();
    setupEventListeners();
    loadPlayerData();
    setupMobileMenu();
    setupRMCalculators();
});

function initializeApp() {
    // Initialiser la date à aujourd'hui
    const testDateInput = document.getElementById('testDate');
    if (testDateInput) {
        testDateInput.valueAsDate = new Date();
    }
    
    // Charger les données sauvegardées
    loadFromLocalStorage();
    
    // Initialiser les accordéons
    setupAccordions();
    
    // Populate history select
    populateHistorySelect();
    
    console.log('✅ Application initialisée');
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navigation entre onglets
    document.querySelectorAll('.tracker-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Bouton "Aujourd'hui"
    document.getElementById('setToday')?.addEventListener('click', function() {
        const testDateInput = document.getElementById('testDate');
        if (testDateInput) {
            testDateInput.valueAsDate = new Date();
        }
    });
    
    // Sauvegarde du profil
    document.getElementById('saveProfile')?.addEventListener('click', saveProfile);
    document.getElementById('clearProfile')?.addEventListener('click', clearProfile);
    
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
            const testType = this.dataset.test;
            if (testType === 'mirwald') {
                showMirwaldInfo();
            } else {
                showProtocol(testType);
            }
        });
    });
    
    // Modal
    const modal = document.getElementById('helpModal');
    const closeBtn = modal?.querySelector('.close');
    closeBtn?.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // Photo de profil
    document.getElementById('profilePhoto')?.addEventListener('change', handlePhotoUpload);
    document.getElementById('removePhoto')?.addEventListener('click', removePhoto);
    
    // Couleur de personnalisation
    document.getElementById('profileColor')?.addEventListener('change', handleColorChange);
    
    // Niveau de jeu
    document.getElementById('playerLevel')?.addEventListener('change', handleLevelChange);
    
    // Calcul Mirwald
    ['playerGender', 'playerAge', 'playerHeight', 'playerSittingHeight', 'playerWeight'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateMirwald);
        document.getElementById(id)?.addEventListener('change', calculateMirwald);
    });
}

// ==================== MENU MOBILE ====================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
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
    console.log('Switching to tab:', tabName);
    
    // Update tab buttons
    document.querySelectorAll('.tracker-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeContent = document.getElementById(`${tabName}-tab`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
    
    // Charger le contenu spécifique de l'onglet
    if (tabName === 'dashboard') {
        updateDashboard();
    } else if (tabName === 'history') {
        updateHistoryChart();
    }
}

// ==================== CALCULATEUR 1RM (BRZYCKI) ====================
function calculateBrzycki(weight, reps) {
    if (!weight || !reps || reps < 1 || reps > 12) return null;
    if (reps === 1) return weight;
    
    const oneRM = weight * (36 / (37 - reps));
    return Math.round(oneRM * 10) / 10;
}

function setupRMCalculators() {
    ['squat', 'deadlift', 'benchpress', 'pullup'].forEach(exercise => {
        const rmInput = document.getElementById(`test-${exercise}-1rm`);
        const weightInput = document.getElementById(`test-${exercise}-weight`);
        const repsInput = document.getElementById(`test-${exercise}-reps`);
        const calculatedDisplay = document.getElementById(`${exercise}-calculated`);
        
        if (!rmInput || !weightInput || !repsInput || !calculatedDisplay) return;
        
        // Quand on entre un 1RM direct
        rmInput.addEventListener('input', function() {
            if (this.value) {
                weightInput.value = '';
                repsInput.value = '';
                calculatedDisplay.textContent = this.value + ' kg';
            } else {
                calculatedDisplay.textContent = '-';
            }
        });
        
        // Quand on entre poids + reps
        function updateCalculated() {
            const weight = parseFloat(weightInput.value);
            const reps = parseInt(repsInput.value);
            
            if (weight && reps) {
                rmInput.value = '';
                const calculated = calculateBrzycki(weight, reps);
                if (calculated) {
                    calculatedDisplay.textContent = calculated + ' kg';
                } else {
                    calculatedDisplay.textContent = 'Erreur';
                }
            } else {
                calculatedDisplay.textContent = '-';
            }
        }
        
        weightInput.addEventListener('input', updateCalculated);
        repsInput.addEventListener('input', updateCalculated);
    });
}

// ==================== PROFIL JOUEUR ====================
function saveProfile() {
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
        name, gender, age, weight, height, sittingHeight,
        level, handicap, circuit, color, photo
    };
    
    if (sittingHeight) {
        currentPlayer.mirwald = calculateMirwald();
    }
    
    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    document.documentElement.style.setProperty('--primary-color', color);
    
    alert(`Profil de ${name} enregistré !`);
    updatePlayerDisplay();
}

function clearProfile() {
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
}

function loadPlayerData() {
    const saved = localStorage.getItem('currentPlayer');
    if (saved) {
        currentPlayer = JSON.parse(saved);
        document.getElementById('playerName').value = currentPlayer.name;
        document.getElementById('playerGender').value = currentPlayer.gender;
        document.getElementById('playerAge').value = currentPlayer.age || '<12';
        document.getElementById('playerWeight').value = currentPlayer.weight;
        document.getElementById('playerHeight').value = currentPlayer.height || '';
        document.getElementById('playerSittingHeight').value = currentPlayer.sittingHeight || '';
        document.getElementById('playerLevel').value = currentPlayer.level || 'amateur';
        document.getElementById('playerHandicap').value = currentPlayer.handicap || '';
        document.getElementById('playerCircuit').value = currentPlayer.circuit || '';
        document.getElementById('profileColor').value = currentPlayer.color || '#1a4d2e';
        
        if (currentPlayer.color) {
            document.documentElement.style.setProperty('--primary-color', currentPlayer.color);
            document.getElementById('colorPreview').textContent = currentPlayer.color;
        }
        
        if (currentPlayer.photo) {
            const preview = document.getElementById('profilePhotoPreview');
            preview.src = currentPlayer.photo;
            preview.style.display = 'block';
            document.getElementById('removePhoto').style.display = 'inline-block';
        }
        
        if (currentPlayer.level === 'playing-pro') {
            document.getElementById('handicapGroup').style.display = 'none';
            document.getElementById('circuitGroup').style.display = 'block';
        }
        
        updatePlayerDisplay();
        calculateMirwald();
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

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('profilePhotoPreview');
            preview.src = event.target.result;
            preview.style.display = 'block';
            document.getElementById('removePhoto').style.display = 'inline-block';
            
            if (currentPlayer) {
                currentPlayer.photo = event.target.result;
                localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
            }
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto() {
    document.getElementById('profilePhotoPreview').style.display = 'none';
    document.getElementById('profilePhoto').value = '';
    document.getElementById('removePhoto').style.display = 'none';
    if (currentPlayer) {
        delete currentPlayer.photo;
        localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    }
}

function handleColorChange() {
    const color = document.getElementById('profileColor').value;
    document.documentElement.style.setProperty('--primary-color', color);
    document.getElementById('colorPreview').textContent = color;
    
    if (currentPlayer) {
        currentPlayer.color = color;
        localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    }
}

function handleLevelChange() {
    const level = document.getElementById('playerLevel').value;
    const handicapGroup = document.getElementById('handicapGroup');
    const circuitGroup = document.getElementById('circuitGroup');
    
    if (level === 'playing-pro') {
        handicapGroup.style.display = 'none';
        circuitGroup.style.display = 'block';
    } else {
        handicapGroup.style.display = 'block';
        circuitGroup.style.display = 'none';
    }
}

function calculateMirwald() {
    const gender = document.getElementById('playerGender').value;
    const age = document.getElementById('playerAge').value;
    const height = parseFloat(document.getElementById('playerHeight').value);
    const sittingHeight = parseFloat(document.getElementById('playerSittingHeight').value);
    const weight = parseFloat(document.getElementById('playerWeight').value);
    
    if (!age || age === '17-25' || age === '25-40' || age === '40-50' || age === '50+') {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    if (!height || !sittingHeight || !weight) {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    const legLength = height - sittingHeight;
    let maturityOffset;
    
    if (gender === 'M') {
        maturityOffset = -9.236 + 
                        (0.0002708 * legLength * sittingHeight) + 
                        (-0.001663 * 14 * legLength) + 
                        (0.007216 * 14 * sittingHeight) + 
                        (0.02292 * weight / height * 100);
    } else {
        maturityOffset = -9.376 + 
                        (0.0001882 * legLength * sittingHeight) + 
                        (0.0022 * 14 * legLength) + 
                        (0.005841 * 14 * sittingHeight) + 
                        (-0.002658 * 14 * weight) + 
                        (0.07693 * weight / height * 100);
    }
    
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

function showMirwaldInfo() {
    const modal = document.getElementById('helpModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    title.textContent = "Équation de Mirwald - Maturité Biologique";
    body.innerHTML = `
        <h4>Qu'est-ce que l'équation de Mirwald ?</h4>
        <p>L'équation de Mirwald (2002) permet d'estimer l'âge de maturité d'un jeune athlète.</p>
        
        <h4>Pourquoi c'est important ?</h4>
        <ul>
            <li>Individualisation de l'entraînement</li>
            <li>Prévention des blessures</li>
            <li>Détection de talents</li>
        </ul>
        
        <h4>Comment mesurer ?</h4>
        <ol>
            <li><strong>Taille debout :</strong> Se tenir droit contre un mur</li>
            <li><strong>Taille assise :</strong> Assis sur un banc, mesurer du sommet au banc</li>
        </ol>
    `;
    
    modal.style.display = 'block';
}

// ==================== SAUVEGARDE DES TESTS ====================
function saveTests() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer un profil joueur.');
        switchTab('profile');
        return;
    }
    
    const testDate = document.getElementById('testDate')?.value || new Date().toISOString().split('T')[0];
    
    const testData = {
        date: new Date(testDate).toISOString(),
        player: currentPlayer,
        results: {}
    };
    
    // Tests de force avec 1RM calculé
    ['squat', 'deadlift', 'benchpress', 'pullup'].forEach(exerciseName => {
        const rmDirect = parseFloat(document.getElementById(`test-${exerciseName}-1rm`)?.value);
        const weight = parseFloat(document.getElementById(`test-${exerciseName}-weight`)?.value);
        const reps = parseInt(document.getElementById(`test-${exerciseName}-reps`)?.value);
        
        let finalRM = null;
        
        if (rmDirect) {
            finalRM = rmDirect;
        } else if (weight && reps) {
            finalRM = calculateBrzycki(weight, reps);
        }
        
        if (finalRM) {
            testData.results[exerciseName] = finalRM;
        }
    });
    
    // Tous les autres tests
    Object.keys(BAREMES).forEach(testKey => {
        if (['squat', 'deadlift', 'benchpress', 'pullup'].includes(testKey)) return;
        
        const bareme = BAREMES[testKey];
        
        if (bareme.bilateral) {
            const leftValue = parseFloat(document.getElementById(`test-${testKey}-left`)?.value);
            const rightValue = parseFloat(document.getElementById(`test-${testKey}-right`)?.value);
            
            if (!isNaN(leftValue) && !isNaN(rightValue)) {
                testData.results[testKey] = { left: leftValue, right: rightValue };
            }
        } else {
            const value = parseFloat(document.getElementById(`test-${testKey}`)?.value);
            if (!isNaN(value)) {
                testData.results[testKey] = value;
            }
        }
    });
    
    // Poids du medball
    const medballWeight = document.getElementById('test-medball-weight')?.value;
    if (testData.results.medball) {
        testData.medballWeight = medballWeight;
    }
    
    // Tests TPI
    const tpiTests = {};
    document.querySelectorAll('[id^="tpi-"]').forEach(select => {
        if (select.value) {
            tpiTests[select.id.replace('tpi-', '')] = select.value;
        }
    });
    if (Object.keys(tpiTests).length > 0) {
        testData.tpi = tpiTests;
    }
    
    if (Object.keys(testData.results).length === 0 && !testData.tpi) {
        alert('Veuillez saisir au moins un test.');
        return;
    }
    
    allTests.push(testData);
    localStorage.setItem('allTests', JSON.stringify(allTests));
    
    alert(`Tests du ${new Date(testDate).toLocaleDateString('fr-FR')} enregistrés !`);
    switchTab('dashboard');
}

function clearTestInputs() {
    if (confirm('Êtes-vous sûr de vouloir effacer tous les champs de saisie ?')) {
        document.querySelectorAll('#tests-tab input').forEach(input => input.value = '');
        document.querySelectorAll('#tests-tab select').forEach(select => select.selectedIndex = 0);
    }
}

// ==================== DASHBOARD (Version simplifiée) ====================
function updateDashboard() {
    if (!currentPlayer) {
        document.querySelector('.dashboard-container').innerHTML = `
            <div class="alert warning">
                <div class="alert-title">⚠️ Aucun profil</div>
                <p>Veuillez d'abord créer un profil joueur.</p>
            </div>
        `;
        return;
    }
    
    const latestTest = allTests[allTests.length - 1];
    if (!latestTest) {
        document.querySelector('.dashboard-container').innerHTML = `
            <div class="alert warning">
                <div class="alert-title">⚠️ Aucun test</div>
                <p>Aucun test enregistré.</p>
            </div>
        `;
        return;
    }
    
    updatePlayerDisplay();
    alert('Dashboard chargé !');
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
    alert('Fonction historique en cours de développement');
}

function clearHistory() {
    if (confirm('Effacer tout l\'historique ?')) {
        allTests = [];
        localStorage.removeItem('allTests');
        alert('Historique effacé.');
    }
}

// ==================== IMPORT/EXPORT ====================
function exportData() {
    const data = {
        player: currentPlayer,
        tests: allTests,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `golf-tracker-${currentPlayer?.name || 'data'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('Données exportées !');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.player) {
                currentPlayer = data.player;
                localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
                loadPlayerData();
            }
            
            if (data.tests) {
                allTests = data.tests;
                localStorage.setItem('allTests', JSON.stringify(allTests));
            }
            
            alert('Données importées !');
            switchTab('dashboard');
        } catch (error) {
            alert('Erreur lors de l\'import');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function generateReport() {
    alert('Fonction rapport en cours de développement');
}

// ==================== LOCAL STORAGE ====================
function loadFromLocalStorage() {
    const savedTests = localStorage.getItem('allTests');
    if (savedTests) {
        try {
            allTests = JSON.parse(savedTests);
        } catch (e) {
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

console.log('✅ Application chargée et prête');
