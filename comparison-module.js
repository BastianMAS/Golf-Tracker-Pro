// ==========================================================================
// MODULE COMPARAISON DE SESSIONS
// ==========================================================================

let selectedTestsForComparison = [];

// Fonction appelée quand une checkbox est cochée/décochée
function toggleTestSelection(testId) {
    const checkbox = document.getElementById(`compare-checkbox-${testId}`);
    
    if (checkbox.checked) {
        // Ajouter le test à la sélection
        selectedTestsForComparison.push(testId);
        
        // Si on a plus de 2 tests sélectionnés, décocher le plus ancien
        if (selectedTestsForComparison.length > 2) {
            const oldestId = selectedTestsForComparison.shift();
            const oldCheckbox = document.getElementById(`compare-checkbox-${oldestId}`);
            if (oldCheckbox) {
                oldCheckbox.checked = false;
            }
        }
    } else {
        // Retirer le test de la sélection
        selectedTestsForComparison = selectedTestsForComparison.filter(id => id !== testId);
    }
    
    updateCompareButton();
}

// Mettre à jour le bouton de comparaison
function updateCompareButton() {
    let compareButton = document.getElementById('compareButton');
    
    if (selectedTestsForComparison.length === 2) {
        // Vérifier que les 2 tests sont de la même qualité
        const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
        const test1 = history.find(t => t.id === selectedTestsForComparison[0]);
        const test2 = history.find(t => t.id === selectedTestsForComparison[1]);
        
        if (test1 && test2 && test1.quality === test2.quality) {
            // Créer le bouton s'il n'existe pas
            if (!compareButton) {
                const container = document.querySelector('.history-container');
                if (container) {
                    compareButton = document.createElement('div');
                    compareButton.id = 'compareButton';
                    compareButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 1000;';
                    compareButton.innerHTML = `
                        <button onclick="showComparison()" style="background: #27ae60; color: white; border: none; padding: 15px 25px; border-radius: 50px; cursor: pointer; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                            ⚖️ Comparer les 2 tests
                        </button>
                    `;
                    container.appendChild(compareButton);
                }
            } else {
                compareButton.style.display = 'block';
            }
        } else if (test1 && test2 && test1.quality !== test2.quality) {
            // Qualités différentes - afficher erreur
            if (compareButton) {
                compareButton.style.display = 'none';
            }
            alert('⚠️ Les 2 tests doivent être de la même qualité physique pour être comparés.');
            // Décocher le dernier test sélectionné
            const lastId = selectedTestsForComparison.pop();
            const lastCheckbox = document.getElementById(`compare-checkbox-${lastId}`);
            if (lastCheckbox) {
                lastCheckbox.checked = false;
            }
        }
    } else {
        // Moins de 2 tests sélectionnés - cacher le bouton
        if (compareButton) {
            compareButton.style.display = 'none';
        }
    }
}

// Afficher la comparaison
function showComparison() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const test1 = history.find(t => t.id === selectedTestsForComparison[0]);
    const test2 = history.find(t => t.id === selectedTestsForComparison[1]);
    
    if (!test1 || !test2) {
        alert('❌ Erreur lors du chargement des tests');
        return;
    }
    
    // Trier par date (le plus ancien en premier)
    const [older, newer] = new Date(test1.date) < new Date(test2.date) ? [test1, test2] : [test2, test1];
    
    const quality = QUALITY_TESTS[test1.quality];
    if (!quality) {
        alert('❌ Qualité non trouvée');
        return;
    }
    
    // Construire le tableau comparatif
    let html = `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h4 style="margin: 0; color: #1a4d2e; font-size: 16px;">⚖️ Comparaison de sessions - ${QUALITY_NAMES[test1.quality]}</h4>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; border-left: 3px solid #3498db;">
                    <div style="font-weight: 600; color: #3498db; font-size: 13px;">📅 Session 1 (Ancienne)</div>
                    <div style="font-size: 12px; color: #666;">${formatDate(older.date)}</div>
                </div>
                <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; border-left: 3px solid #27ae60;">
                    <div style="font-weight: 600; color: #27ae60; font-size: 13px;">📅 Session 2 (Récente)</div>
                    <div style="font-size: 12px; color: #666;">${formatDate(newer.date)}</div>
                </div>
            </div>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <thead>
                <tr style="background: #1a4d2e; color: white;">
                    <th style="padding: 10px; text-align: left; font-weight: 600;">Test</th>
                    <th style="padding: 10px; text-align: center; font-weight: 600;">Session 1</th>
                    <th style="padding: 10px; text-align: center; font-weight: 600;">Session 2</th>
                    <th style="padding: 10px; text-align: center; font-weight: 600;">Évolution</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    // Pour chaque test de la qualité
    quality.tests.forEach(testDef => {
        const value1 = older.tests[testDef.key];
        const value2 = newer.tests[testDef.key];
        
        if (!value1 && !value2) return;
        
        if (testDef.bilateral) {
            // Tests bilatéraux - afficher Gauche et Droite séparément
            ['left', 'right'].forEach(side => {
                const sideLabel = side === 'left' ? 'G' : 'D';
                const v1 = value1 ? value1[side] : null;
                const v2 = value2 ? value2[side] : null;
                
                if (v1 !== null || v2 !== null) {
                    const diff = (v1 !== null && v2 !== null) ? v2 - v1 : null;
                    const diffPercent = (v1 !== null && v2 !== null && v1 !== 0) ? ((diff / v1) * 100) : null;
                    const higherIsBetter = testDef.higherIsBetter !== undefined ? testDef.higherIsBetter : true;
                    const isImprovement = diff !== null && ((higherIsBetter && diff > 0) || (!higherIsBetter && diff < 0));
                    
                    html += `
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 10px; font-weight: 600;">${testDef.name} (${sideLabel})</td>
                            <td style="padding: 10px; text-align: center;">${v1 !== null ? v1 + testDef.unit : '-'}</td>
                            <td style="padding: 10px; text-align: center;">${v2 !== null ? v2 + testDef.unit : '-'}</td>
                            <td style="padding: 10px; text-align: center;">
                                ${diff !== null ? `
                                    <span style="color: ${diff === 0 ? '#666' : isImprovement ? '#27ae60' : '#e74c3c'}; font-weight: 600;">
                                        ${diff > 0 ? '+' : ''}${diff.toFixed(1)}${testDef.unit}
                                        ${diffPercent !== null ? ` (${diffPercent > 0 ? '+' : ''}${diffPercent.toFixed(1)}%)` : ''}
                                        ${diff === 0 ? '=' : isImprovement ? '✅' : '❌'}
                                    </span>
                                ` : '-'}
                            </td>
                        </tr>
                    `;
                }
            });
        } else {
            // Tests normaux
            const v1 = typeof value1 === 'number' ? value1 : null;
            const v2 = typeof value2 === 'number' ? value2 : null;
            
            const diff = (v1 !== null && v2 !== null) ? v2 - v1 : null;
            const diffPercent = (v1 !== null && v2 !== null && v1 !== 0) ? ((diff / v1) * 100) : null;
            const higherIsBetter = testDef.higherIsBetter !== undefined ? testDef.higherIsBetter : true;
            const isImprovement = diff !== null && ((higherIsBetter && diff > 0) || (!higherIsBetter && diff < 0));
            
            html += `
                <tr style="border-bottom: 1px solid #ddd;">
                    <td style="padding: 10px; font-weight: 600;">${testDef.name}</td>
                    <td style="padding: 10px; text-align: center;">${v1 !== null ? v1 + testDef.unit : '-'}</td>
                    <td style="padding: 10px; text-align: center;">${v2 !== null ? v2 + testDef.unit : '-'}</td>
                    <td style="padding: 10px; text-align: center;">
                        ${diff !== null ? `
                            <span style="color: ${diff === 0 ? '#666' : isImprovement ? '#27ae60' : '#e74c3c'}; font-weight: 600;">
                                ${diff > 0 ? '+' : ''}${diff.toFixed(1)}${testDef.unit}
                                ${diffPercent !== null ? ` (${diffPercent > 0 ? '+' : ''}${diffPercent.toFixed(1)}%)` : ''}
                                ${diff === 0 ? '=' : isImprovement ? '✅' : '❌'}
                            </span>
                        ` : '-'}
                    </td>
                </tr>
            `;
        }
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    // Afficher dans le modal
    const modal = document.getElementById('comparisonModal');
    const content = document.getElementById('comparisonContent');
    
    if (modal && content) {
        content.innerHTML = html;
        modal.style.display = 'flex';
    }
}

// Fermer le modal de comparaison
function closeComparisonModal() {
    const modal = document.getElementById('comparisonModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fermer en cliquant en dehors
window.addEventListener('click', function(event) {
    const modal = document.getElementById('comparisonModal');
    if (event.target === modal) {
        closeComparisonModal();
    }
});

console.log('✅ Module comparaison sessions chargé');
