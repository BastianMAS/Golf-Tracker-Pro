// ==========================================================================
// MODULE ALERTES & ZONES D'ATTENTION
// ==========================================================================

// Analyser les progressions et régressions
function analyzeProgressions(history) {
    if (!history || history.length < 2) return null;
    
    const analysis = {
        progressions: [],
        regressions: [],
        asymmetries: [],
        weakPoints: [],
        alerts: []
    };
    
    // Parcourir l'historique pour détecter les changements
    for (let i = 0; i < history.length - 1; i++) {
        const current = history[i];
        const previous = history[i + 1];
        
        // Comparer seulement les tests de même qualité
        if (current.quality !== previous.quality) continue;
        
        const quality = QUALITY_TESTS[current.quality];
        if (!quality) continue;
        
        quality.tests.forEach(testDef => {
            const currentValue = current.tests[testDef.key];
            const previousValue = previous.tests[testDef.key];
            
            if (!currentValue || !previousValue) return;
            
            // Tests bilatéraux
            if (testDef.bilateral) {
                // Comparer gauche
                if (currentValue.left && previousValue.left) {
                    const change = ((currentValue.left - previousValue.left) / previousValue.left) * 100;
                    
                    // Tenir compte de higherIsBetter (par défaut true si non défini)
                    const higherIsBetter = testDef.higherIsBetter !== undefined ? testDef.higherIsBetter : true;
                    const isActuallyRegression = higherIsBetter ? (change < -10) : (change > 10);
                    const isActuallyProgression = higherIsBetter ? (change > 10) : (change < -10);
                    
                    if (isActuallyRegression) {
                        analysis.regressions.push({
                            test: `${testDef.name} (Gauche)`,
                            quality: quality.name,
                            current: currentValue.left,
                            previous: previousValue.left,
                            change: change,
                            date: current.date,
                            unit: testDef.unit
                        });
                        
                        analysis.alerts.push({
                            type: 'regression',
                            severity: 'high',
                            message: `⚠️ Régression importante : ${testDef.name} (Gauche) ${Math.abs(change).toFixed(1)}%`
                        });
                    } else if (isActuallyProgression) {
                        analysis.progressions.push({
                            test: `${testDef.name} (Gauche)`,
                            quality: quality.name,
                            current: currentValue.left,
                            previous: previousValue.left,
                            change: change,
                            date: current.date,
                            unit: testDef.unit
                        });
                    }
                }
                
                // Comparer droite
                if (currentValue.right && previousValue.right) {
                    const change = ((currentValue.right - previousValue.right) / previousValue.right) * 100;
                    
                    // Tenir compte de higherIsBetter (par défaut true si non défini)
                    const higherIsBetter = testDef.higherIsBetter !== undefined ? testDef.higherIsBetter : true;
                    const isActuallyRegression = higherIsBetter ? (change < -10) : (change > 10);
                    const isActuallyProgression = higherIsBetter ? (change > 10) : (change < -10);
                    
                    if (isActuallyRegression) {
                        analysis.regressions.push({
                            test: `${testDef.name} (Droite)`,
                            quality: quality.name,
                            current: currentValue.right,
                            previous: previousValue.right,
                            change: change,
                            date: current.date,
                            unit: testDef.unit
                        });
                        
                        analysis.alerts.push({
                            type: 'regression',
                            severity: 'high',
                            message: `⚠️ Régression importante : ${testDef.name} (Droite) ${Math.abs(change).toFixed(1)}%`
                        });
                    } else if (isActuallyProgression) {
                        analysis.progressions.push({
                            test: `${testDef.name} (Droite)`,
                            quality: quality.name,
                            current: currentValue.right,
                            previous: previousValue.right,
                            change: change,
                            date: current.date,
                            unit: testDef.unit
                        });
                    }
                }
                
                // Vérifier asymétrie
                if (currentValue.left && currentValue.right) {
                    const lsi = (Math.min(currentValue.left, currentValue.right) / Math.max(currentValue.left, currentValue.right)) * 100;
                    
                    if (lsi < 90) {
                        const weaker = currentValue.left < currentValue.right ? 'Gauche' : 'Droite';
                        const stronger = currentValue.left < currentValue.right ? 'Droite' : 'Gauche';
                        
                        analysis.asymmetries.push({
                            test: testDef.name,
                            quality: quality.name,
                            lsi: lsi,
                            weaker: weaker,
                            stronger: stronger,
                            leftValue: currentValue.left,
                            rightValue: currentValue.right,
                            unit: testDef.unit,
                            date: current.date
                        });
                        
                        const severity = lsi < 85 ? 'high' : 'medium';
                        analysis.alerts.push({
                            type: 'asymmetry',
                            severity: severity,
                            message: `⚠️ Asymétrie ${testDef.name} : ${weaker} plus faible (LSI: ${lsi.toFixed(1)}%)`
                        });
                    }
                }
            } else {
                // Tests normaux
                if (typeof currentValue === 'number' && typeof previousValue === 'number') {
                    const change = ((currentValue - previousValue) / previousValue) * 100;
                    
                    // Tenir compte de higherIsBetter (par défaut true si non défini)
                    const higherIsBetter = testDef.higherIsBetter !== undefined ? testDef.higherIsBetter : true;
                    const isActuallyRegression = higherIsBetter ? (change < -10) : (change > 10);
                    const isActuallyProgression = higherIsBetter ? (change > 10) : (change < -10);
                    
                    if (isActuallyRegression) {
                        analysis.regressions.push({
                            test: testDef.name,
                            quality: quality.name,
                            current: currentValue,
                            previous: previousValue,
                            change: change,
                            date: current.date,
                            unit: testDef.unit
                        });
                        
                        analysis.alerts.push({
                            type: 'regression',
                            severity: 'high',
                            message: `⚠️ Régression importante : ${testDef.name} ${Math.abs(change).toFixed(1)}%`
                        });
                    } else if (isActuallyProgression) {
                        analysis.progressions.push({
                            test: testDef.name,
                            quality: quality.name,
                            current: currentValue,
                            previous: previousValue,
                            change: change,
                            date: current.date,
                            unit: testDef.unit
                        });
                    }
                }
            }
        });
    }
    
    // Identifier les points faibles (scores < 12.5)
    if (history.length > 0) {
        const latestTest = history[0];
        const quality = QUALITY_TESTS[latestTest.quality];
        
        if (quality) {
            quality.tests.forEach(testDef => {
                const testValue = latestTest.tests[testDef.key];
                if (!testValue) return;
                
                if (testDef.bilateral) {
                    // Pour bilatéraux, vérifier gauche et droite
                    if (testValue.left) {
                        const score = calculateScore20(testDef.key + '-left', testValue.left);
                        if (score && score < 12.5) {
                            analysis.weakPoints.push({
                                test: `${testDef.name} (Gauche)`,
                                quality: quality.name,
                                score: score,
                                value: testValue.left,
                                unit: testDef.unit,
                                priority: score < 7.5 ? 'high' : 'medium'
                            });
                        }
                    }
                    
                    if (testValue.right) {
                        const score = calculateScore20(testDef.key + '-right', testValue.right);
                        if (score && score < 12.5) {
                            analysis.weakPoints.push({
                                test: `${testDef.name} (Droite)`,
                                quality: quality.name,
                                score: score,
                                value: testValue.right,
                                unit: testDef.unit,
                                priority: score < 7.5 ? 'high' : 'medium'
                            });
                        }
                    }
                } else {
                    const score = calculateScore20(testDef.key, testValue);
                    if (score && score < 12.5) {
                        analysis.weakPoints.push({
                            test: testDef.name,
                            quality: quality.name,
                            score: score,
                            value: testValue,
                            unit: testDef.unit,
                            priority: score < 7.5 ? 'high' : 'medium'
                        });
                    }
                }
            });
        }
    }
    
    // Trier les points faibles par score (les plus faibles en premier)
    analysis.weakPoints.sort((a, b) => a.score - b.score);
    
    return analysis;
}

// Afficher les alertes dans l'historique
function displayAlerts() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    if (history.length === 0) return;
    
    const analysis = analyzeProgressions(history);
    
    if (!analysis) {
        console.log('⚠️ Pas assez de données pour l\'analyse (besoin de 2+ tests)');
        return;
    }
    
    console.log('📊 Analyse terminée:', analysis);
    
    // Trouver le conteneur d'alertes (ou le créer)
    let alertsContainer = document.getElementById('alerts-container');
    
    if (!alertsContainer) {
        // Essayer de trouver le conteneur historique de plusieurs façons
        const historySection = document.getElementById('historique-tab') || 
                               document.getElementById('historique') ||
                               document.querySelector('[id*="historique"]') ||
                               document.querySelector('.tab-content.active') ||
                               document.querySelector('#testsTimeline')?.parentElement;
        
        if (!historySection) {
            console.error('❌ Impossible de trouver le conteneur historique');
            console.log('Éléments disponibles:', document.querySelectorAll('[id]'));
            return;
        }
        
        console.log('✅ Conteneur historique trouvé:', historySection.id || historySection.className);
        
        alertsContainer = document.createElement('div');
        alertsContainer.id = 'alerts-container';
        alertsContainer.style.marginBottom = '30px';
        historySection.insertBefore(alertsContainer, historySection.firstChild);
    }
    
    let html = '';
    
    // Alertes critiques
    if (analysis.alerts.length > 0) {
        const highSeverity = analysis.alerts.filter(a => a.severity === 'high');
        const mediumSeverity = analysis.alerts.filter(a => a.severity === 'medium');
        
        if (highSeverity.length > 0) {
            html += `
                <div style="padding: 15px; background: #ffebee; border-left: 4px solid #f44336; border-radius: 8px; margin-bottom: 15px;">
                    <div style="font-weight: 600; color: #c62828; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">🚨</span>
                        <span>Alertes critiques (${highSeverity.length})</span>
                    </div>
                    <ul style="margin: 0; padding-left: 20px; color: #333;">
                        ${highSeverity.slice(0, 5).map(alert => `<li style="margin-bottom: 5px;">${alert.message}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (mediumSeverity.length > 0) {
            html += `
                <div style="padding: 15px; background: #fff3e0; border-left: 4px solid #ff9800; border-radius: 8px; margin-bottom: 15px;">
                    <div style="font-weight: 600; color: #ef6c00; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">⚠️</span>
                        <span>Points d'attention (${mediumSeverity.length})</span>
                    </div>
                    <ul style="margin: 0; padding-left: 20px; color: #333;">
                        ${mediumSeverity.slice(0, 5).map(alert => `<li style="margin-bottom: 5px;">${alert.message}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
    
    // Top 3 points faibles
    if (analysis.weakPoints.length > 0) {
        const top3 = analysis.weakPoints.slice(0, 3);
        
        html += `
            <div style="padding: 15px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #1a4d2e; border-radius: 8px; margin-bottom: 15px;">
                <div style="font-weight: 600; color: #1a4d2e; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">🎯</span>
                    <span>Top 3 points à travailler en priorité</span>
                </div>
                <div style="display: grid; gap: 10px;">
                    ${top3.map((point, index) => {
                        const badge = getBadgeLabel(point.score);
                        const badgeColor = point.score < 7.5 ? '#f44336' : '#ff9800';
                        return `
                            <div style="padding: 10px; background: white; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="font-size: 20px; font-weight: 600; color: ${badgeColor};">#${index + 1}</span>
                                    <div>
                                        <div style="font-weight: 600; color: #333;">${point.test}</div>
                                        <div style="font-size: 12px; color: #666;">${point.quality}</div>
                                    </div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 14px; color: #666;">${point.value}${point.unit}</div>
                                    <div style="display: inline-block; padding: 3px 8px; background: ${badgeColor}; color: white; border-radius: 4px; font-size: 11px; font-weight: 600;">
                                        ${badge ? badge.label : 'N/A'} - ${point.score.toFixed(1)}/20
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    // Progressions notables
    if (analysis.progressions.length > 0) {
        const topProgressions = analysis.progressions.slice(0, 3);
        
        html += `
            <div style="padding: 15px; background: #e8f5e9; border-left: 4px solid #27ae60; border-radius: 8px; margin-bottom: 15px;">
                <div style="font-weight: 600; color: #27ae60; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 20px;">📈</span>
                    <span>Progressions significatives (+10% ou plus)</span>
                </div>
                <ul style="margin: 0; padding-left: 20px; color: #333;">
                    ${topProgressions.map(prog => `
                        <li style="margin-bottom: 5px;">
                            <strong>${prog.test}</strong> : ${prog.previous}${prog.unit} → ${prog.current}${prog.unit} 
                            <span style="color: #27ae60; font-weight: 600;">(+${prog.change.toFixed(1)}%)</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    alertsContainer.innerHTML = html;
}

// Export des fonctions
window.analyzeProgressions = analyzeProgressions;
window.displayAlerts = displayAlerts;

console.log('🚨 Module Alertes chargé');
