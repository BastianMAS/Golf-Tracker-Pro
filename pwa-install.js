// ==========================================================================
// PWA INSTALLATION & SERVICE WORKER REGISTRATION
// ==========================================================================

let deferredPrompt;
let isInstalled = false;

// Vérifier si l'app est déjà installée
window.addEventListener('DOMContentLoaded', () => {
    // Détecter si l'app est lancée en mode standalone (installée)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        isInstalled = true;
        console.log('✅ App déjà installée et lancée en mode standalone');
    }
});

// Enregistrer le Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('✅ Service Worker enregistré:', registration.scope);
                
                // Vérifier les mises à jour toutes les heures
                setInterval(() => {
                    registration.update();
                }, 3600000); // 1 heure
                
                // Écouter les mises à jour
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Nouvelle version du Service Worker détectée');
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nouvelle version disponible
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error);
            });
    });
    
    // Écouter les messages du Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_CLEARED') {
            console.log('✅ Cache vidé par le Service Worker');
            alert('Cache de l\'application vidé ! Rechargement...');
            window.location.reload();
        }
    });
}

// Capturer l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📱 beforeinstallprompt déclenché');
    
    // Empêcher le mini-infobar par défaut de Chrome
    e.preventDefault();
    
    // Sauvegarder l'événement pour l'utiliser plus tard
    deferredPrompt = e;
    
    // Afficher le bouton d'installation personnalisé
    showInstallButton();
});

// Afficher le bouton d'installation
function showInstallButton() {
    if (isInstalled) return; // Ne pas afficher si déjà installé
    
    const installContainer = document.getElementById('pwa-install-container');
    if (!installContainer) {
        // Créer le bouton s'il n'existe pas
        createInstallButton();
    } else {
        installContainer.style.display = 'block';
    }
}

// Créer le bouton d'installation
function createInstallButton() {
    const container = document.createElement('div');
    container.id = 'pwa-install-container';
    container.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideInUp 0.5s ease-out;
    `;
    
    container.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a4d2e 0%, #27ae60 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 350px;
        ">
            <div style="font-size: 32px;">📱</div>
            <div style="flex: 1;">
                <div style="font-weight: 600; margin-bottom: 5px;">Installer l'application</div>
                <div style="font-size: 13px; opacity: 0.9;">Accédez rapidement depuis votre écran d'accueil</div>
            </div>
            <button id="pwa-install-btn" style="
                background: white;
                color: #1a4d2e;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                font-size: 14px;
            ">
                Installer
            </button>
            <button id="pwa-dismiss-btn" style="
                background: transparent;
                color: white;
                border: none;
                font-size: 20px;
                cursor: pointer;
                padding: 5px;
                opacity: 0.8;
            ">
                ✕
            </button>
        </div>
    `;
    
    document.body.appendChild(container);
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Event listeners
    document.getElementById('pwa-install-btn').addEventListener('click', installApp);
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
        container.style.display = 'none';
    });
}

// Installer l'application
async function installApp() {
    if (!deferredPrompt) {
        console.log('❌ Prompt d\'installation non disponible');
        return;
    }
    
    // Afficher le prompt d'installation
    deferredPrompt.prompt();
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`👤 Résultat de l'installation: ${outcome}`);
    
    if (outcome === 'accepted') {
        console.log('✅ Installation acceptée');
    } else {
        console.log('❌ Installation refusée');
    }
    
    // Réinitialiser le prompt
    deferredPrompt = null;
    
    // Cacher le bouton
    const installContainer = document.getElementById('pwa-install-container');
    if (installContainer) {
        installContainer.style.display = 'none';
    }
}

// Détecter quand l'app est installée
window.addEventListener('appinstalled', () => {
    console.log('✅ Application installée avec succès !');
    isInstalled = true;
    
    // Cacher le bouton d'installation
    const installContainer = document.getElementById('pwa-install-container');
    if (installContainer) {
        installContainer.style.display = 'none';
    }
    
    // Afficher une notification de succès
    alert('🎉 Application installée avec succès !\n\nVous pouvez maintenant y accéder depuis votre écran d\'accueil.');
});

// Afficher notification de mise à jour
function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff9800;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 90%;
    `;
    
    updateBanner.innerHTML = `
        <div style="font-size: 24px;">🔄</div>
        <div style="flex: 1;">
            <div style="font-weight: 600;">Mise à jour disponible</div>
            <div style="font-size: 13px; opacity: 0.9;">Une nouvelle version est prête</div>
        </div>
        <button id="update-btn" style="
            background: white;
            color: #ff9800;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
        ">
            Mettre à jour
        </button>
    `;
    
    document.body.appendChild(updateBanner);
    
    document.getElementById('update-btn').addEventListener('click', () => {
        // Dire au Service Worker de skip waiting
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
    });
}

// Status de connexion
window.addEventListener('online', () => {
    console.log('🌐 Connexion rétablie');
    showConnectionStatus('online');
});

window.addEventListener('offline', () => {
    console.log('📵 Hors ligne - Mode offline activé');
    showConnectionStatus('offline');
});

function showConnectionStatus(status) {
    const existingBanner = document.getElementById('connection-status');
    if (existingBanner) {
        existingBanner.remove();
    }
    
    if (status === 'offline') {
        const banner = document.createElement('div');
        banner.id = 'connection-status';
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #f44336;
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: 600;
            z-index: 10002;
        `;
        banner.textContent = '📵 Mode hors ligne - Vos données sont sauvegardées localement';
        document.body.appendChild(banner);
    }
}

console.log('🚀 PWA Installation script chargé');
