// ==========================================================================
// MODULE GRAPHIQUES D'ÉVOLUTION
// ==========================================================================

let evolutionChart = null;

// Afficher le graphique d'évolution d'un test spécifique
function showEvolutionChart(testKey, testName, quality, unit, bilateral = false, side = null) {
    console.log(`📊 Affichage évolution pour ${testName}${side ? ' (' + side + ')' : ''}`);
    
    // Récupérer l'historique complet
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Filtrer les tests de cette qualité uniquement
    const qualityTests = history.filter(t => t.quality === quality);
    
    // Trier par date (du plus ancien au plus récent pour le graphique)
    const sortedTests = qualityTests.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Extraire les données pour ce test spécifique
    const labels = [];
    const data = [];
    
    sortedTests.forEach(test => {
        const testValue = test.tests[testKey];
        if (!testValue) return;
        
        let value = null;
        
        if (bilateral) {
            if (side === 'Gauche' && testValue.left !== null && testValue.left !== undefined) {
                value = testValue.left;
            } else if (side === 'Droite' && testValue.right !== null && testValue.right !== undefined) {
                value = testValue.right;
            } else if (!side) {
                // Moyenne des deux côtés
                if (testValue.left !== null && testValue.right !== null) {
                    value = (testValue.left + testValue.right) / 2;
                }
            }
        } else {
            if (typeof testValue === 'number') {
                value = testValue;
            }
        }
        
        if (value !== null) {
            labels.push(new Date(test.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }));
            data.push(value);
        }
    });
    
    if (data.length === 0) {
        alert('Aucune donnée disponible pour ce test');
        return;
    }
    
    // Créer le modal
    const modal = document.getElementById('evolutionModal');
    const modalTitle = document.getElementById('evolutionModalTitle');
    const canvas = document.getElementById('evolutionChart');
    
    if (!modal || !modalTitle || !canvas) {
        console.error('❌ Éléments du modal non trouvés');
        return;
    }
    
    // Définir le titre
    modalTitle.textContent = `📊 Évolution: ${testName}${side ? ' (' + side + ')' : ''}`;
    
    // Détruire l'ancien graphique
    if (evolutionChart) {
        evolutionChart.destroy();
    }
    
    // Créer le nouveau graphique
    const ctx = canvas.getContext('2d');
    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${testName} (${unit})`,
                data: data,
                borderColor: '#1a4d2e',
                backgroundColor: 'rgba(26, 77, 46, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#1a4d2e',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + unit;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value + unit;
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                }
            }
        }
    });
    
    // Afficher le modal
    modal.style.display = 'flex';
    
    console.log(`✅ Graphique créé avec ${data.length} points de données`);
}

// Fermer le modal
function closeEvolutionModal() {
    const modal = document.getElementById('evolutionModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Détruire le graphique
    if (evolutionChart) {
        evolutionChart.destroy();
        evolutionChart = null;
    }
}

// Fermer le modal en cliquant en dehors
window.addEventListener('click', function(event) {
    const modal = document.getElementById('evolutionModal');
    if (event.target === modal) {
        closeEvolutionModal();
    }
});

console.log('✅ Module graphiques évolution chargé');
