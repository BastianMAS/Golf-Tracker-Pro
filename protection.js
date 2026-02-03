// ==================== SYSTÈME DE PROTECTION ====================
// Code d'accès temporaire pour version de test
// Par Bastian MAS

(function() {
    'use strict';
    
    // ========== CONFIGURATION ==========
    const ACCESS_CODE = 'TESTBASTIAN26';
    const ADMIN_CODE = 'Babas007admin';  // Code admin - jamais d'expiration
    const EXPIRATION_DATE = new Date('2026-02-09T23:59:59'); // 09/02/2026
    const EXPIRATION_MESSAGE = 'Période de test terminée';
    const STORAGE_KEY = 'golfTrackerAccessGranted';
    const ADMIN_STORAGE_KEY = 'golfTrackerAdminMode';
    
    // ========== MODE ADMIN (BYPASS PROTECTION) ==========
    function isAdminMode() {
        // Vérifier si URL contient ?admin=Babas007admin
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('admin') === 'Babas007admin';
    }
    
    // ========== VÉRIFICATION EXPIRATION ==========
    function isExpired() {
        const now = new Date();
        return now > EXPIRATION_DATE;
    }
    
    // ========== VÉRIFICATION ACCÈS ==========
    function checkAccess() {
        // MODE ADMIN : Bypass via URL (garde pour compatibilité)
        if (isAdminMode()) {
            console.log('🔓 Mode Administrateur activé via URL');
            sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
            return true;
        }
        
        // Vérifier si mode admin déjà activé
        if (sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true') {
            console.log('🔓 Mode Administrateur - Accès illimité');
            return true;
        }
        
        // Vérifier si déjà authentifié dans cette session
        const accessGranted = sessionStorage.getItem(STORAGE_KEY);
        
        if (accessGranted === 'true') {
            // Vérifier quand même si pas expiré
            if (isExpired()) {
                showExpirationMessage();
                return false;
            }
            return true;
        }
        
        // Vérifier expiration
        if (isExpired()) {
            showExpirationMessage();
            return false;
        }
        
        // Demander le code
        return promptForCode();
    }
    
    // ========== DEMANDER CODE ==========
    function promptForCode() {
        // Créer overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(26, 77, 46, 0.95);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        
        const box = document.createElement('div');
        box.style.cssText = `
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;
        
        box.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
            <h2 style="color: #1a4d2e; margin-bottom: 10px; font-size: 24px;">Accès Protégé</h2>
            <p style="color: #666; margin-bottom: 25px; font-size: 14px;">
                Version de test - Golf Performance Tracker<br>
                <small>Valide jusqu'au 09/02/2026</small>
            </p>
            <input 
                type="text" 
                id="accessCodeInput" 
                placeholder="Entrez le code d'accès"
                style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    font-size: 16px;
                    text-align: center;
                    margin-bottom: 15px;
                "
            >
            <div id="errorMessage" style="color: #e74c3c; margin-bottom: 15px; font-size: 14px; min-height: 20px;"></div>
            <button 
                id="submitCode"
                style="
                    width: 100%;
                    padding: 12px;
                    background: #1a4d2e;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.3s;
                "
                onmouseover="this.style.background='#27ae60'"
                onmouseout="this.style.background='#1a4d2e'"
            >
                Valider
            </button>
            <p style="color: #999; margin-top: 20px; font-size: 12px;">
                © ${new Date().getFullYear()} Bastian MAS - Préparateur Physique TPI
            </p>
        `;
        
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        
        // Focus sur l'input
        const input = document.getElementById('accessCodeInput');
        const submitBtn = document.getElementById('submitCode');
        const errorMsg = document.getElementById('errorMessage');
        
        setTimeout(() => input.focus(), 100);
        
        // Fonction de validation
        const validateCode = () => {
            const enteredCode = input.value.trim();
            
            // Vérifier code admin (AVEC respect de la casse)
            if (enteredCode === ADMIN_CODE) {
                // Mode admin activé
                sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
                overlay.remove();
                console.log('🔓 Mode Administrateur activé - Accès illimité sans expiration');
                return;
            }
            
            // Vérifier code testeur (SANS casse)
            if (enteredCode.toUpperCase() === ACCESS_CODE) {
                // Code testeur correct
                sessionStorage.setItem(STORAGE_KEY, 'true');
                overlay.remove();
                console.log('✅ Accès accordé - Version test valide jusqu\'au', EXPIRATION_DATE.toLocaleDateString('fr-FR'));
                return;
            }
            
            // Code incorrect
            errorMsg.textContent = '❌ Code incorrect';
            input.value = '';
            input.style.borderColor = '#e74c3c';
            setTimeout(() => {
                errorMsg.textContent = '';
                input.style.borderColor = '#e0e0e0';
            }, 2000);
        };
        
        // Événements
        submitBtn.addEventListener('click', validateCode);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') validateCode();
        });
        
        // Empêcher fermeture accidentelle
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                box.style.animation = 'shake 0.5s';
            }
        });
        
        return false; // Bloque le chargement en attendant
    }
    
    // ========== MESSAGE EXPIRATION ==========
    function showExpirationMessage() {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #1a4d2e 0%, #27ae60 100%);
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
            ">
                <div style="
                    background: white;
                    padding: 60px 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    text-align: center;
                    max-width: 500px;
                ">
                    <div style="font-size: 64px; margin-bottom: 20px;">⏰</div>
                    <h1 style="color: #1a4d2e; font-size: 28px; margin-bottom: 15px;">
                        ${EXPIRATION_MESSAGE}
                    </h1>
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        La version de test du Golf Performance Tracker a expiré le 
                        <strong>${EXPIRATION_DATE.toLocaleDateString('fr-FR')}</strong>.
                    </p>
                    <div style="
                        background: #f8f9fa;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    ">
                        <p style="color: #333; font-size: 14px; margin: 0;">
                            Pour continuer à utiliser l'application, contactez :
                        </p>
                        <a href="mailto:bastian.mas@gmail.com" style="
                            color: #1a4d2e;
                            font-size: 18px;
                            font-weight: 600;
                            text-decoration: none;
                            display: block;
                            margin-top: 10px;
                        ">
                            bastian.mas@gmail.com
                        </a>
                    </div>
                    <p style="color: #999; font-size: 12px;">
                        © ${new Date().getFullYear()} Bastian MAS - Préparateur Physique TPI
                    </p>
                </div>
            </div>
        `;
    }
    
    // ========== DÉMARRAGE ==========
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            checkAccess();
        });
    } else {
        checkAccess();
    }
    
    // Message console
    console.log('🔒 Golf Performance Tracker - Version Test Protégée');
    console.log('📅 Valide jusqu\'au:', EXPIRATION_DATE.toLocaleDateString('fr-FR'));
})();
