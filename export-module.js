// ==========================================================================
// MODULE D'EXPORT - CSV & EXCEL
// ==========================================================================

// Export CSV complet de tous les tests
function exportToCSV() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    if (history.length === 0) {
        alert('Aucun test à exporter !');
        return;
    }
    
    // En-têtes CSV
    let csv = 'Date,Heure,Qualité,Test,Valeur,Unité,Score/20,Niveau,Observations,Objectifs,Remarques\n';
    
    // Parcourir l'historique
    history.forEach(test => {
        const date = new Date(test.date);
        const dateStr = date.toLocaleDateString('fr-FR');
        const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        const quality = QUALITY_TESTS[test.quality];
        
        if (!quality) return;
        
        const qualityName = quality.name;
        const notes = test.coachNotes || {};
        const observations = (notes.observations || '').replace(/,/g, ';').replace(/\n/g, ' ');
        const objectifs = (notes.objectifs || '').replace(/,/g, ';').replace(/\n/g, ' ');
        const remarques = (notes.remarques || '').replace(/,/g, ';').replace(/\n/g, ' ');
        
        // Parcourir les tests de cette qualité
        quality.tests.forEach(testDef => {
            const testResult = test.tests[testDef.key];
            if (!testResult) return;
            
            if (testDef.bilateral) {
                // Test bilatéral
                const left = testResult.left;
                const right = testResult.right;
                
                if (left !== null && left !== undefined) {
                    const score = calculateScore20(testDef.key + '-left', left);
                    const badge = getBadgeLabel(score);
                    csv += `${dateStr},${timeStr},${qualityName},${testDef.name} (Gauche),${left},${testDef.unit},${score ? score.toFixed(1) : 'N/A'},${badge ? badge.label : 'N/A'},"${observations}","${objectifs}","${remarques}"\n`;
                }
                
                if (right !== null && right !== undefined) {
                    const score = calculateScore20(testDef.key + '-right', right);
                    const badge = getBadgeLabel(score);
                    csv += `${dateStr},${timeStr},${qualityName},${testDef.name} (Droite),${right},${testDef.unit},${score ? score.toFixed(1) : 'N/A'},${badge ? badge.label : 'N/A'},"${observations}","${objectifs}","${remarques}"\n`;
                }
                
                // Ajouter LSI
                if (left && right) {
                    const lsi = Math.min(left, right) / Math.max(left, right) * 100;
                    csv += `${dateStr},${timeStr},${qualityName},${testDef.name} (LSI),${lsi.toFixed(1)},%,N/A,${lsi >= 90 ? 'BON' : lsi >= 85 ? 'MOYEN' : 'FAIBLE'},"${observations}","${objectifs}","${remarques}"\n`;
                }
            } else {
                // Test normal
                const score = calculateScore20(testDef.key, testResult);
                const badge = getBadgeLabel(score);
                csv += `${dateStr},${timeStr},${qualityName},${testDef.name},${testResult},${testDef.unit},${score ? score.toFixed(1) : 'N/A'},${badge ? badge.label : 'N/A'},"${observations}","${objectifs}","${remarques}"\n`;
            }
        });
    });
    
    // Télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `Golf_Tracker_${currentPlayer.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Export CSV terminé:', fileName);
    alert(`✅ Export CSV terminé !\n\nFichier: ${fileName}`);
}

// Export Excel (HTML table qui s'ouvre dans Excel)
function exportToExcel() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    if (history.length === 0) {
        alert('Aucun test à exporter !');
        return;
    }
    
    // Créer un workbook HTML (compatible Excel)
    let html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
            <meta charset="UTF-8">
            <style>
                table { border-collapse: collapse; width: 100%; }
                th { background-color: #1a4d2e; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; }
                .header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
                .elite { background-color: #e3f2fd; }
                .bon { background-color: #e8f5e9; }
                .moyen { background-color: #fff3e0; }
                .faible { background-color: #ffebee; }
            </style>
        </head>
        <body>
            <div class="header">Golf Performance Tracker - ${currentPlayer.name}</div>
            <div style="margin-bottom: 20px;">Exporté le ${new Date().toLocaleString('fr-FR')}</div>
    `;
    
    // Créer un onglet par qualité
    const qualityKeys = ['force', 'vitesse', 'endurance', 'explosivite', 'core', 'mobilite', 'equilibre', 'tpi'];
    
    qualityKeys.forEach(qualityKey => {
        const quality = QUALITY_TESTS[qualityKey];
        if (!quality) return;
        
        // Filtrer les tests de cette qualité
        const testsForQuality = history.filter(t => t.quality === qualityKey);
        
        if (testsForQuality.length === 0) return;
        
        html += `
            <h2 style="color: ${quality.color}; margin-top: 30px;">${quality.icon} ${quality.name}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Test</th>
                        <th>Valeur</th>
                        <th>Unité</th>
                        <th>Score/20</th>
                        <th>Niveau</th>
                        <th>Observations</th>
                        <th>Objectifs</th>
                        <th>Remarques</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        testsForQuality.forEach(test => {
            const date = new Date(test.date).toLocaleString('fr-FR');
            const notes = test.coachNotes || {};
            
            quality.tests.forEach(testDef => {
                const testResult = test.tests[testDef.key];
                if (!testResult) return;
                
                if (testDef.bilateral) {
                    // Test bilatéral
                    const left = testResult.left;
                    const right = testResult.right;
                    
                    if (left !== null && left !== undefined) {
                        const score = calculateScore20(testDef.key + '-left', left);
                        const badge = getBadgeLabel(score);
                        const className = badge ? badge.class : '';
                        
                        html += `
                            <tr class="${className}">
                                <td>${date}</td>
                                <td>${testDef.name} (G)</td>
                                <td>${left}</td>
                                <td>${testDef.unit}</td>
                                <td>${score ? score.toFixed(1) : 'N/A'}</td>
                                <td>${badge ? badge.label : 'N/A'}</td>
                                <td>${notes.observations || ''}</td>
                                <td>${notes.objectifs || ''}</td>
                                <td>${notes.remarques || ''}</td>
                            </tr>
                        `;
                    }
                    
                    if (right !== null && right !== undefined) {
                        const score = calculateScore20(testDef.key + '-right', right);
                        const badge = getBadgeLabel(score);
                        const className = badge ? badge.class : '';
                        
                        html += `
                            <tr class="${className}">
                                <td>${date}</td>
                                <td>${testDef.name} (D)</td>
                                <td>${right}</td>
                                <td>${testDef.unit}</td>
                                <td>${score ? score.toFixed(1) : 'N/A'}</td>
                                <td>${badge ? badge.label : 'N/A'}</td>
                                <td>${notes.observations || ''}</td>
                                <td>${notes.objectifs || ''}</td>
                                <td>${notes.remarques || ''}</td>
                            </tr>
                        `;
                    }
                    
                    if (left && right) {
                        const lsi = Math.min(left, right) / Math.max(left, right) * 100;
                        const lsiClass = lsi >= 90 ? 'bon' : lsi >= 85 ? 'moyen' : 'faible';
                        
                        html += `
                            <tr class="${lsiClass}">
                                <td>${date}</td>
                                <td>${testDef.name} (LSI)</td>
                                <td>${lsi.toFixed(1)}</td>
                                <td>%</td>
                                <td>N/A</td>
                                <td>${lsi >= 90 ? 'BON' : lsi >= 85 ? 'MOYEN' : 'FAIBLE'}</td>
                                <td>${notes.observations || ''}</td>
                                <td>${notes.objectifs || ''}</td>
                                <td>${notes.remarques || ''}</td>
                            </tr>
                        `;
                    }
                } else {
                    // Test normal
                    const score = calculateScore20(testDef.key, testResult);
                    const badge = getBadgeLabel(score);
                    const className = badge ? badge.class : '';
                    
                    html += `
                        <tr class="${className}">
                            <td>${date}</td>
                            <td>${testDef.name}</td>
                            <td>${testResult}</td>
                            <td>${testDef.unit}</td>
                            <td>${score ? score.toFixed(1) : 'N/A'}</td>
                            <td>${badge ? badge.label : 'N/A'}</td>
                            <td>${notes.observations || ''}</td>
                            <td>${notes.objectifs || ''}</td>
                            <td>${notes.remarques || ''}</td>
                        </tr>
                    `;
                }
            });
        });
        
        html += `
                </tbody>
            </table>
        `;
    });
    
    html += `
        </body>
        </html>
    `;
    
    // Télécharger le fichier
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = `Golf_Tracker_${currentPlayer.name.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.xls`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Export Excel terminé:', fileName);
    alert(`✅ Export Excel terminé !\n\nFichier: ${fileName}\n\nOuvrez-le avec Excel ou Google Sheets`);
}

// Export pour les fonctions globales
window.exportToCSV = exportToCSV;
window.exportToExcel = exportToExcel;

console.log('📥 Module Export chargé');
