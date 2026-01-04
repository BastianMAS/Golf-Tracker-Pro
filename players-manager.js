// ==========================================================================
// MODULE GESTION DES JOUEURS
// ==========================================================================

let players = [];
let currentPlayerId = null;

// Charger les joueurs depuis localStorage
function loadPlayers() {
    const stored = localStorage.getItem('players');
    players = stored ? JSON.parse(stored) : [];
    
    // Charger le joueur actuel
    const currentId = localStorage.getItem('currentPlayerId');
    if (currentId) {
        currentPlayerId = parseInt(currentId);
    }
    
    console.log(`📋 ${players.length} joueurs chargés`);
    return players;
}

// Sauvegarder les joueurs
function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
    console.log('💾 Joueurs sauvegardés');
}

// Ajouter un nouveau joueur
function addPlayer(playerData) {
    const newPlayer = {
        id: Date.now(),
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        age: playerData.age || null,
        gender: playerData.gender || 'M',
        handicap: playerData.handicap || null,
        status: playerData.status || 'amateur', // 'pro' ou 'amateur'
        club: playerData.club || null,
        photo: playerData.photo || null,
        createdAt: new Date().toISOString(),
        lastTestDate: null
    };
    
    players.push(newPlayer);
    savePlayers();
    
    console.log(`✅ Joueur ajouté: ${newPlayer.firstName} ${newPlayer.lastName}`);
    return newPlayer;
}

// Supprimer un joueur
function deletePlayer(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) {
        alert('Joueur non trouvé');
        return;
    }
    
    if (confirm(`Supprimer ${player.firstName} ${player.lastName} et tous ses tests ?`)) {
        // Supprimer tous les tests du joueur
        const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
        const filteredHistory = history.filter(test => test.playerId !== playerId);
        localStorage.setItem('testsHistory', JSON.stringify(filteredHistory));
        
        // Supprimer le joueur
        players = players.filter(p => p.id !== playerId);
        savePlayers();
        
        // Si c'était le joueur actuel, le désélectionner
        if (currentPlayerId === playerId) {
            currentPlayerId = null;
            localStorage.removeItem('currentPlayerId');
        }
        
        console.log(`🗑️ Joueur supprimé: ${player.firstName} ${player.lastName}`);
        displayPlayersList();
    }
}

// Sélectionner un joueur
function selectPlayer(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player) {
        alert('Joueur non trouvé');
        return;
    }
    
    currentPlayerId = playerId;
    localStorage.setItem('currentPlayerId', playerId.toString());
    
    // Mettre à jour l'affichage
    updateCurrentPlayerDisplay();
    
    console.log(`👤 Joueur sélectionné: ${player.firstName} ${player.lastName}`);
}

// Obtenir le joueur actuel
function getCurrentPlayer() {
    if (!currentPlayerId) return null;
    return players.find(p => p.id === currentPlayerId);
}

// Afficher la liste des joueurs
function displayPlayersList() {
    const container = document.getElementById('playersListContainer');
    if (!container) return;
    
    loadPlayers();
    
    if (players.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">👥</div>
                <h3 style="color: #666; margin-bottom: 10px;">Aucun joueur enregistré</h3>
                <p style="color: #999; margin-bottom: 20px;">Commencez par ajouter votre premier joueur</p>
                <button onclick="showAddPlayerModal()" style="background: #1a4d2e; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px;">
                    ➕ Ajouter un joueur
                </button>
            </div>
        `;
        return;
    }
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="margin: 0;">👥 Mes Joueurs (${players.length})</h3>
            <button onclick="showAddPlayerModal()" style="background: #1a4d2e; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px;">
                ➕ Ajouter
            </button>
        </div>
        
        <div style="margin-bottom: 20px;">
            <input type="text" id="playerSearchInput" placeholder="🔍 Rechercher par nom..." onkeyup="filterPlayers()" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px;">
        </div>
        
        <div id="playersListItems">
    `;
    
    // Trier par nom
    const sortedPlayers = [...players].sort((a, b) => a.lastName.localeCompare(b.lastName));
    
    sortedPlayers.forEach(player => {
        const isSelected = player.id === currentPlayerId;
        const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
        const playerTests = history.filter(t => t.playerId === player.id);
        const lastTest = playerTests.length > 0 ? new Date(Math.max(...playerTests.map(t => new Date(t.date)))).toLocaleDateString('fr-FR') : 'Aucun test';
        
        html += `
            <div style="background: ${isSelected ? '#e8f5e9' : 'white'}; padding: 15px; border-radius: 12px; margin-bottom: 12px; border: 2px solid ${isSelected ? '#27ae60' : '#ddd'}; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 5px;">
                            ${isSelected ? '<span style="color: #27ae60; font-size: 18px;">✅</span>' : ''}
                            <h4 style="margin: 0; font-size: 16px;">${player.firstName} ${player.lastName}</h4>
                            <span style="background: ${player.status === 'pro' ? '#3498db' : '#95a5a6'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                                ${player.status === 'pro' ? 'PRO' : 'AMATEUR'}
                            </span>
                        </div>
                        <div style="font-size: 13px; color: #666;">
                            ${player.age ? player.age + ' ans' : ''} 
                            ${player.gender ? '• ' + (player.gender === 'M' ? '♂️ Homme' : '♀️ Femme') : ''}
                            ${player.handicap !== null ? '• H' + player.handicap : ''}
                        </div>
                        ${player.club ? `<div style="font-size: 12px; color: #999;">🏌️ ${player.club}</div>` : ''}
                        <div style="font-size: 12px; color: #999; margin-top: 5px;">
                            📅 Dernier test: ${lastTest}
                        </div>
                    </div>
                    ${player.photo ? `<img src="${player.photo}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-left: 10px;">` : ''}
                </div>
                <div style="display: flex; gap: 8px; margin-top: 12px;">
                    ${!isSelected ? `<button onclick="selectPlayer(${player.id}); switchTab('tests');" style="flex: 1; background: #27ae60; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">✅ Sélectionner</button>` : ''}
                    <button onclick="viewPlayerHistory(${player.id})" style="flex: 1; background: #3498db; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">📊 Historique</button>
                    <button onclick="deletePlayer(${player.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600;">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div style="margin-top: 30px; text-align: center;">
            <button onclick="showTeamDashboard()" style="background: #9b59b6; color: white; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 16px;">
                📊 Dashboard Équipe
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

// Filtrer les joueurs
function filterPlayers() {
    const input = document.getElementById('playerSearchInput');
    const filter = input.value.toLowerCase();
    const container = document.getElementById('playersListItems');
    const items = container.getElementsByTagName('div');
    
    Array.from(items).forEach(item => {
        const text = item.textContent || item.innerText;
        if (text.toLowerCase().indexOf(filter) > -1) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Afficher le modal d'ajout
function showAddPlayerModal() {
    const modal = document.getElementById('addPlayerModal');
    if (modal) {
        // Réinitialiser le formulaire
        document.getElementById('newPlayerForm').reset();
        document.getElementById('newPlayerPhotoPreview').style.display = 'none';
        modal.style.display = 'flex';
    }
}

// Fermer le modal
function closeAddPlayerModal() {
    const modal = document.getElementById('addPlayerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Sauvegarder le nouveau joueur
function saveNewPlayer() {
    const firstName = document.getElementById('newPlayerFirstName').value.trim();
    const lastName = document.getElementById('newPlayerLastName').value.trim();
    const age = parseInt(document.getElementById('newPlayerAge').value) || null;
    const gender = document.querySelector('input[name="newPlayerGender"]:checked')?.value || 'M';
    const handicap = parseFloat(document.getElementById('newPlayerHandicap').value) || null;
    const status = document.querySelector('input[name="newPlayerStatus"]:checked')?.value || 'amateur';
    const club = document.getElementById('newPlayerClub').value.trim() || null;
    const photoPreview = document.getElementById('newPlayerPhotoPreview');
    const photo = photoPreview.style.display !== 'none' ? photoPreview.src : null;
    
    if (!firstName || !lastName) {
        alert('⚠️ Le prénom et le nom sont obligatoires');
        return;
    }
    
    const newPlayer = addPlayer({
        firstName,
        lastName,
        age,
        gender,
        handicap,
        status,
        club,
        photo
    });
    
    closeAddPlayerModal();
    displayPlayersList();
    
    // Sélectionner automatiquement le nouveau joueur
    selectPlayer(newPlayer.id);
}

// Gérer l'upload de photo
function handleNewPlayerPhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) {
            alert('⚠️ La photo est trop volumineuse (max 5MB)');
            e.target.value = '';
            return;
        }
        
        compressImage(file, 400, 0.7)
            .then(compressedBase64 => {
                const preview = document.getElementById('newPlayerPhotoPreview');
                preview.src = compressedBase64;
                preview.style.display = 'block';
            })
            .catch(error => {
                console.error('❌ Erreur compression photo:', error);
                alert('⚠️ Erreur lors du traitement de la photo');
                e.target.value = '';
            });
    }
}

// Voir l'historique d'un joueur
function viewPlayerHistory(playerId) {
    selectPlayer(playerId);
    switchTab('history');
}

// Mettre à jour l'affichage du joueur actuel (en haut de l'app)
function updateCurrentPlayerDisplay() {
    const player = getCurrentPlayer();
    const display = document.getElementById('currentPlayerDisplay');
    
    if (!display) return;
    
    if (!player) {
        display.innerHTML = `
            <div style="background: #fff3cd; padding: 10px; border-radius: 8px; text-align: center;">
                <span style="color: #856404;">⚠️ Aucun joueur sélectionné</span>
                <button onclick="switchTab('players')" style="margin-left: 10px; background: #1a4d2e; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    Sélectionner
                </button>
            </div>
        `;
    } else {
        display.innerHTML = `
            <div style="background: #e8f5e9; padding: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${player.photo ? `<img src="${player.photo}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">` : '<span style="font-size: 24px;">👤</span>'}
                    <div>
                        <div style="font-weight: 600; color: #1a4d2e;">${player.firstName} ${player.lastName}</div>
                        <div style="font-size: 11px; color: #666;">${player.status === 'pro' ? 'PRO' : 'AMATEUR'}${player.handicap !== null ? ' • H' + player.handicap : ''}</div>
                    </div>
                </div>
                <button onclick="switchTab('players')" style="background: #27ae60; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600;">
                    Changer
                </button>
            </div>
        `;
    }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
    loadPlayers();
    updateCurrentPlayerDisplay();
});

console.log('✅ Module gestion joueurs chargé');
