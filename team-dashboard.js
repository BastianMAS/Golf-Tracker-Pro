// ==========================================================================
// MODULE DASHBOARD ÉQUIPE
// ==========================================================================

// Afficher le dashboard équipe
function showTeamDashboard() {
    const modal = document.getElementById('teamDashboardModal');
    if (!modal) {
        console.error('❌ Modal dashboard équipe non trouvé');
        return;
    }
    
    loadPlayers();
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #1a4d2e; font-size: 20px;">📊 Dashboard Équipe</h3>
            
            <!-- Statistiques globales -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; font-weight: 700; color: #1976d2;">${players.length}</div>
                    <div style="font-size: 12px; color: #666;">Joueurs</div>
                </div>
                <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; font-weight: 700; color: #27ae60;">${players.filter(p => p.status === 'pro').length}</div>
                    <div style="font-size: 12px; color: #666;">Pros</div>
                </div>
                <div style="background: #f3e5f5; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; font-weight: 700; color: #9c27b0;">${players.filter(p => p.status === 'amateur').length}</div>
                    <div style="font-size: 12px; color: #666;">Amateurs</div>
                </div>
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 28px; font-weight: 700; color: #f57c00;">${history.length}</div>
                    <div style="font-size: 12px; color: #666;">Tests totaux</div>
                </div>
            </div>
            
            <!-- Filtres -->
            <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                <select id="dashboardStatusFilter" onchange="filterDashboard()" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px;">
                    <option value="all">Tous les statuts</option>
                    <option value="pro">Pro uniquement</option>
                    <option value="amateur">Amateur uniquement</option>
                </select>
                
                <select id="dashboardTestFilter" onchange="filterDashboard()" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px; font-size: 13px;">
                    <option value="all">Tous</option>
                    <option value="tested">Testés uniquement</option>
                    <option value="notTested">Non testés</option>
                </select>
                
                <button onclick="exportTeamDashboard()" style="margin-left: auto; background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600;">
                    📥 Export Excel
                </button>
            </div>
        </div>
        
        <!-- Tableau -->
        <div style="overflow-x: auto;">
            <table id="teamDashboardTable" style="width: 100%; border-collapse: collapse; font-size: 13px; background: white; border-radius: 8px; overflow: hidden;">
                <thead>
                    <tr style="background: #1a4d2e; color: white;">
                        <th style="padding: 12px; text-align: left; font-weight: 600; cursor: pointer;" onclick="sortDashboard('name')">
                            Nom ↕️
                        </th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; cursor: pointer;" onclick="sortDashboard('age')">
                            Âge ↕️
                        </th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">
                            Sexe
                        </th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; cursor: pointer;" onclick="sortDashboard('handicap')">
                            H'cap ↕️
                        </th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">
                            Statut
                        </th>
                        <th style="padding: 12px; text-align: left; font-weight: 600;">
                            Club
                        </th>
                        <th style="padding: 12px; text-align: center; font-weight: 600; cursor: pointer;" onclick="sortDashboard('lastTest')">
                            Dernier test ↕️
                        </th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">
                            Tests
                        </th>
                        <th style="padding: 12px; text-align: center; font-weight: 600;">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody id="teamDashboardTableBody">
    `;
    
    // Générer les lignes
    players.forEach(player => {
        const playerTests = history.filter(t => t.playerId === player.id);
        const lastTest = playerTests.length > 0 
            ? new Date(Math.max(...playerTests.map(t => new Date(t.date))))
            : null;
        
        const lastTestFormatted = lastTest 
            ? lastTest.toLocaleDateString('fr-FR')
            : '-';
        
        const daysSinceTest = lastTest 
            ? Math.floor((new Date() - lastTest) / (1000 * 60 * 60 * 24))
            : null;
        
        const testStatus = !lastTest 
            ? '❌' 
            : daysSinceTest > 90 
                ? '⚠️' 
                : '✅';
        
        html += `
            <tr class="dashboard-row" 
                data-status="${player.status}" 
                data-tested="${lastTest ? 'yes' : 'no'}"
                style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${player.photo ? `<img src="${player.photo}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover;">` : ''}
                        <div>
                            <div style="font-weight: 600;">${player.firstName} ${player.lastName}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 12px; text-align: center;">${player.age || '-'}</td>
                <td style="padding: 12px; text-align: center;">${player.gender === 'M' ? '♂️' : '♀️'}</td>
                <td style="padding: 12px; text-align: center;">${player.handicap !== null ? player.handicap : '-'}</td>
                <td style="padding: 12px; text-align: center;">
                    <span style="background: ${player.status === 'pro' ? '#3498db' : '#95a5a6'}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                        ${player.status === 'pro' ? 'PRO' : 'AMATEUR'}
                    </span>
                </td>
                <td style="padding: 12px; font-size: 12px; color: #666;">${player.club || '-'}</td>
                <td style="padding: 12px; text-align: center;">
                    <div>${testStatus} ${lastTestFormatted}</div>
                    ${daysSinceTest !== null ? `<div style="font-size: 11px; color: #999;">Il y a ${daysSinceTest}j</div>` : ''}
                </td>
                <td style="padding: 12px; text-align: center; font-weight: 600;">${playerTests.length}</td>
                <td style="padding: 12px; text-align: center;">
                    <button onclick="viewPlayerHistory(${player.id}); closeTeamDashboard();" style="background: #3498db; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: 600;">
                        📊 Voir
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    const content = document.getElementById('teamDashboardContent');
    if (content) {
        content.innerHTML = html;
        modal.style.display = 'flex';
    }
}

// Fermer le dashboard
function closeTeamDashboard() {
    const modal = document.getElementById('teamDashboardModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Filtrer le dashboard
function filterDashboard() {
    const statusFilter = document.getElementById('dashboardStatusFilter').value;
    const testFilter = document.getElementById('dashboardTestFilter').value;
    const rows = document.querySelectorAll('.dashboard-row');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Filtre statut
        if (statusFilter !== 'all' && row.dataset.status !== statusFilter) {
            showRow = false;
        }
        
        // Filtre tests
        if (testFilter === 'tested' && row.dataset.tested !== 'yes') {
            showRow = false;
        }
        if (testFilter === 'notTested' && row.dataset.tested !== 'no') {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

// Trier le dashboard
let dashboardSortColumn = 'name';
let dashboardSortAsc = true;

function sortDashboard(column) {
    if (dashboardSortColumn === column) {
        dashboardSortAsc = !dashboardSortAsc;
    } else {
        dashboardSortColumn = column;
        dashboardSortAsc = true;
    }
    
    const tbody = document.getElementById('teamDashboardTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    rows.sort((a, b) => {
        const indexA = rows.indexOf(a);
        const indexB = rows.indexOf(b);
        const playerA = players[indexA];
        const playerB = players[indexB];
        
        let valA, valB;
        
        switch(column) {
            case 'name':
                valA = playerA.lastName + playerA.firstName;
                valB = playerB.lastName + playerB.firstName;
                break;
            case 'age':
                valA = playerA.age || 0;
                valB = playerB.age || 0;
                break;
            case 'handicap':
                valA = playerA.handicap !== null ? playerA.handicap : 999;
                valB = playerB.handicap !== null ? playerB.handicap : 999;
                break;
            case 'lastTest':
                const testsA = history.filter(t => t.playerId === playerA.id);
                const testsB = history.filter(t => t.playerId === playerB.id);
                valA = testsA.length > 0 ? Math.max(...testsA.map(t => new Date(t.date))) : 0;
                valB = testsB.length > 0 ? Math.max(...testsB.map(t => new Date(t.date))) : 0;
                break;
            default:
                return 0;
        }
        
        if (valA < valB) return dashboardSortAsc ? -1 : 1;
        if (valA > valB) return dashboardSortAsc ? 1 : -1;
        return 0;
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// Export dashboard équipe
function exportTeamDashboard() {
    console.log('📥 Export dashboard équipe...');
    
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Préparer les données
    const data = players.map(player => {
        const playerTests = history.filter(t => t.playerId === player.id);
        const lastTest = playerTests.length > 0 
            ? new Date(Math.max(...playerTests.map(t => new Date(t.date))))
            : null;
        
        return {
            'Nom': player.lastName,
            'Prénom': player.firstName,
            'Âge': player.age || '',
            'Sexe': player.gender === 'M' ? 'Homme' : 'Femme',
            'Handicap': player.handicap !== null ? player.handicap : '',
            'Statut': player.status === 'pro' ? 'PRO' : 'AMATEUR',
            'Club': player.club || '',
            'Dernier test': lastTest ? lastTest.toLocaleDateString('fr-FR') : 'Aucun',
            'Nombre de tests': playerTests.length
        };
    });
    
    // Créer le CSV
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        csv += headers.map(header => {
            let value = row[header];
            // Échapper les virgules et guillemets
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = '"' + value.replace(/"/g, '""') + '"';
            }
            return value;
        }).join(',') + '\n';
    });
    
    // Télécharger
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `Dashboard_Equipe_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Dashboard exporté');
}

console.log('✅ Module dashboard équipe chargé');
