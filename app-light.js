// ==========================================================================
// GOLF PERFORMANCE TRACKER - APPLICATION PRINCIPALE
// ==========================================================================

// ==================== VARIABLES GLOBALES ====================
let currentPlayer = null;
let allTests = [];
let radarChart = null;
let historyChart = null;

// ==================== PROTOCOLES DES TESTS ====================
const PROTOCOLS = {
    // FORCE
    squat: {
        title: "Squat - 1RM",
        material: "Barre, cage à squat, disques",
        protocol: `1. Échauffement articulaire et musculaire progressif
2. Commencer avec la barre seule pour vérifier la technique
3. Monter progressivement la charge (par paliers de 5-10kg)
4. Trouver le 1RM (charge maximale pour 1 répétition) ou 3RM
5. Si 3RM, calculer le 1RM estimé avec la formule de Brzycki

Position :
- Pieds largeur épaules, pointes légèrement vers l'extérieur
- Barre sur les trapèzes (position haute)
- Descendre jusqu'à ce que les cuisses soient parallèles au sol (90°)
- Remonter en poussant fort sur les talons

L'application calculera automatiquement le ratio poids de corps.`,
        tips: "Garder le dos droit, regarder devant soi. Ne pas décoller les talons. Contrôler la descente."
    },
    
    deadlift: {
        title: "Deadlift (Soulevé de terre) - 1RM",
        material: "Barre, disques",
        protocol: `1. Échauffement progressif
2. Monter en charge jusqu'au 1RM ou 3RM
3. Si 3RM, calculer le 1RM estimé

Position :
- Pieds largeur hanches, sous la barre
- Saisir la barre en pronation (ou mixte si lourd)
- Dos plat, poitrine sortie
- Tirer la barre en gardant le dos droit
- Extension complète en haut (épaules en arrière)

Attention : Ne jamais arrondir le dos !`,
        tips: "Engager les abdos et les fessiers. La barre doit rester proche du corps tout au long du mouvement."
    },
    
    benchpress: {
        title: "Développé Couché - 1RM",
        material: "Banc, barre, disques",
        protocol: `1. Échauffement progressif
2. Monter en charge jusqu'au 1RM ou 3RM
3. Si 3RM, calculer le 1RM estimé

Position :
- Allongé sur le banc, pieds au sol
- Saisir la barre légèrement plus large que les épaules
- Descendre la barre vers le milieu de la poitrine
- Remonter en contrôle jusqu'à extension complète des bras

Important : Avoir un pareur pour la sécurité !`,
        tips: "Contracter les omoplates, garder les fesses sur le banc. Ne pas rebondir sur la poitrine."
    },
    
    pullup: {
        title: "Tirage Vertical - 1RM",
        material: "Barre de traction ou machine guidée, lest éventuel",
        protocol: `1. Échauffement progressif
2. Si traction au poids de corps facile, ajouter du lest
3. Trouver le 1RM (ou 3RM puis calculer)

Position :
- Saisir la barre en pronation, mains légèrement plus larges que les épaules
- Tirer jusqu'à ce que le menton dépasse la barre
- Descendre en contrôle jusqu'à extension complète

Pour le ratio : poids de corps + lest = charge totale`,
        tips: "Ne pas se balancer. Contrôler la descente. Engager les dorsaux."
    },
    
    legextension: {
        title: "Leg Extension Unilatéral",
        material: "Machine de leg extension",
        protocol: `1. Échauffement léger
2. Tester JAMBE PAR JAMBE séparément
3. Trouver le 1RM ou 3RM de chaque jambe

Position :
- Assis, dos contre le dossier
- Une seule jambe active à la fois
- Extension complète du genou
- Descente contrôlée

L'application calculera :
- Le ratio charge/poids de corps pour chaque jambe
- L'asymétrie gauche/droite (ALERTE si >15%)`,
        tips: "Ne pas donner d'élan. Contracter le quadriceps en haut du mouvement."
    },
    
    legpress: {
        title: "Presse Unilatérale",
        material: "Machine de presse à cuisses",
        protocol: `1. Échauffement progressif
2. Tester JAMBE PAR JAMBE séparément
3. Trouver le 1RM ou 3RM de chaque jambe

Position :
- Une seule jambe sur le plateau
- Pied au centre, l'autre jambe au repos
- Descendre jusqu'à 90° de flexion de genou
- Pousser jusqu'à extension presque complète

L'application détectera les déséquilibres G/D`,
        tips: "Ne pas décoller les lombaires du siège. Garder le dos plaqué."
    },
    
    // VITESSE
    shuttle: {
        title: "Navette 5x10m",
        material: "2 plots, chronomètre ou cellules photoélectriques",
        protocol: `1. Placer 2 lignes à 10 mètres l'une de l'autre
2. Le joueur doit faire 5 allers-retours (= 10 passages de ligne)
3. TOTAL = 50 mètres parcourus
4. Il DOIT toucher la ligne avec la main à chaque virage
5. Chronomètre du départ jusqu'au 5ème retour

Important : Si le joueur ne touche pas la ligne = test invalide

Consigne : "Sprint maximal, touche la ligne à chaque fois !"`,
        tips: "S'échauffer 10 minutes avant. Faire 2 essais, garder le meilleur temps."
    },
    
    driverspeed: {
        title: "Driver Speed (Vitesse de club)",
        material: "Radar (Trackman, Flightscope, etc.), driver du joueur",
        protocol: `1. Échauffement complet avec le driver
2. Effectuer 5 drives MAXIMUM
3. Le joueur doit swinguer à vitesse maximale (pas de précision)
4. Noter la vitesse de club (clubhead speed) pour chaque essai
5. Garder la vitesse MAXIMALE (pas la moyenne !)

Mesure : Vitesse en mph (miles par heure)

Note : Ce test mesure la capacité de transfert de puissance au golf`,
        tips: "Swinguer à fond sans se soucier de la direction. C'est un test de VITESSE pure."
    },
    
    // ENDURANCE
    vma: {
        title: "VMA (Vitesse Maximale Aérobie)",
        material: "Piste ou terrain plat, chronomètre",
        protocol: `Option 1 - Test Luc Léger :
- Navettes de 20m avec bips sonores
- Vitesse augmente chaque minute
- S'arrêter à épuisement
- Convertir le palier en km/h

Option 2 - Demi-Cooper (6 minutes) :
- Courir la plus grande distance en 6 minutes
- Formule : Distance (m) ÷ 100 = VMA (km/h)
- Exemple : 1200m en 6min = VMA 12 km/h`,
        tips: "Bien s'échauffer. C'est un effort maximal. Le test doit se terminer en épuisement."
    },
    
    maxpushups: {
        title: "Maximum Pompes en 1 minute",
        material: "Chronomètre, tapis",
        protocol: `1. Position de départ : planche haute, mains largeur épaules
2. Au signal, effectuer le MAXIMUM de pompes en 60 secondes
3. Amplitude complète obligatoire :
   - Descente : poitrine à 5cm du sol
   - Montée : bras tendus
4. Compter uniquement les pompes techniquement correctes

Fautes éliminatoires :
- Bassin qui s'affaisse
- Amplitude incomplète
- Arrêt de plus de 3 secondes`,
        tips: "Rester gainé. Mieux vaut ralentir que de tricher sur l'amplitude."
    },
    
    maxsquats: {
        title: "Maximum Squats en 1 minute",
        material: "Chronomètre",
        protocol: `1. Position : pieds largeur épaules, poids de corps uniquement
2. Au signal, effectuer le MAXIMUM de squats en 60 secondes
3. Amplitude : cuisses parallèles au sol (90° au genou)
4. Remonter jusqu'à extension complète

Consigne technique :
- Dos droit
- Talons au sol
- Genoux dans l'axe des pieds

Fautes : amplitude insuffisante, talons décollés`,
        tips: "Trouver son rythme. Respirer régulièrement."
    },
    
    wallsit: {
        title: "Chaise Unilatérale (Asymétrie)",
        material: "Mur, chronomètre",
        protocol: `1. Se placer dos au mur
2. Descendre jusqu'à 90° (cuisses parallèles au sol)
3. LEVER UNE JAMBE (tendue devant)
4. Tenir le plus longtemps possible
5. Chronomètre jusqu'à :
   - La jambe d'appui tremble trop
   - Le dos décolle du mur
   - L'autre pied touche le sol

Tester GAUCHE et DROITE séparément.
L'application calculera l'asymétrie.`,
        tips: "Tester la jambe la plus faible en premier. Récupérer 2-3 minutes entre les jambes."
    },
    
    // EXPLOSIVITÉ
    vertjump: {
        title: "Détente Verticale (CMJ)",
        material: "Toise murale ou tapis de mesure, craie",
        protocol: `1. Se placer debout, mains sur les hanches (pour isoler les jambes)
2. Fléchir les genoux et sauter LE PLUS HAUT possible
3. Pas d'élan, départ pieds joints
4. Mesurer la hauteur maximale atteinte

Mesure :
- Marquer avec la craie le point le plus haut atteint
- Ou utiliser un tapis de détente (Vertec, MyJump, etc.)

Faire 3 essais, garder le meilleur.`,
        tips: "Explosivité maximale. Utiliser les bras pour s'équilibrer à la réception."
    },
    
    horizjump: {
        title: "Détente Horizontale",
        material: "Décamètre, ligne de départ",
        protocol: `1. Se placer pieds joints sur la ligne de départ
2. Balancer les bras et sauter LE PLUS LOIN possible
3. Pas d'élan, départ statique
4. Mesurer du talon le plus proche de la ligne de départ

Consigne :
- Réception équilibrée (ne pas tomber en arrière)
- Distance mesurée au talon le plus proche

Faire 3 essais, garder le meilleur.`,
        tips: "Bien fléchir les genoux avant le saut. Projeter les bras vers l'avant."
    },
    
    medballchest: {
        title: "MedBall Chest Pass (assis)",
        material: "Medicine ball 2-3kg, décamètre",
        protocol: `PROTOCOLE CHEST PASS ASSIS :

1. S'asseoir au sol en tailleur, DOS CONTRE MUR
2. Tenir le medicine ball à 2 mains devant la poitrine
3. Lancer le plus loin possible devant soi (chest pass)
4. Le dos doit RESTER contre le mur (pas d'élan du tronc)
5. Mesurer la distance d'impact au sol

Poids du medicine ball :
- 2kg pour les jeunes/femmes
- 3kg pour les hommes adultes

⚠️ Ce test isole le haut du corps (pas de jambes)

Faire 3 essais, garder le meilleur.`,
        tips: "Explosion maximale des bras et pectoraux. Aucun mouvement du tronc autorisé."
    },
    
    medballrotation: {
        title: "MedBall Rotation Throw (debout)",
        material: "Medicine ball 2-3kg, décamètre",
        protocol: `PROTOCOLE ROTATION THROW :

1. DEBOUT, perpendiculaire à la cible
2. Pieds largeur d'épaules, genoux légèrement fléchis  
3. Tenir le medicine ball à 2 mains
4. Rotation explosive du tronc (comme un swing de golf)
5. Lancer LATÉRAL le plus loin possible
6. Mesurer la distance d'impact au sol

Poids du medicine ball :
- 2kg pour les jeunes/femmes
- 3kg pour les hommes adultes

⚠️ Ce test évalue la puissance rotationnelle (golf-spécifique)

Tester les 2 CÔTÉS (gauche et droite).
Faire 3 essais par côté, garder le meilleur.`,
        tips: "Utiliser tout le corps : jambes, hanches, tronc, bras. Mouvement explosif et coordonné."
    },
    
    cmjunilateral: {
        title: "CMJ Unilatéral (Asymétrie)",
        material: "Toise ou tapis de détente",
        protocol: `1. Même protocole que la détente verticale
2. MAIS sur une seule jambe
3. L'autre jambe reste fléchie en l'air
4. Mains sur les hanches

Tester GAUCHE et DROITE séparément.

Important : Ce test révèle les déséquilibres de puissance.
Au golf, la jambe d'appui est cruciale.`,
        tips: "S'équilibrer avant de sauter. Réception sur la même jambe."
    },
    
    // CORE
    rkcplank: {
        title: "RKC Plank (Gainage intensif)",
        material: "Chronomètre, tapis",
        protocol: `1. Position planche (coudes au sol)
2. DIFFÉRENCE avec planche classique :
   - Contraction MAXIMALE volontaire
   - Fessiers serrés à fond
   - Abdos contractés à fond
   - Quadriceps contractés
   - Coudes qui "tirent" vers les pieds (sans bouger)

3. Tenir le plus longtemps possible en maintenant cette tension

Arrêt quand :
- Le bassin s'affaisse
- Impossible de maintenir la contraction maximale`,
        tips: "C'est un gainage de QUALITÉ, pas de durée. 20-30 secondes en RKC = excellent !"
    },
    
    sideplank: {
        title: "Side Plank (Gainage latéral)",
        material: "Chronomètre, tapis",
        protocol: `1. Position latérale, appui sur un coude
2. Corps aligné (tête-tronc-bassin-jambes)
3. Bassin relevé, corps droit
4. Tenir le plus longtemps possible

Tester GAUCHE et DROITE.

Arrêt quand :
- Le bassin descend
- Le corps pivote`,
        tips: "Regarder devant. Contracter les obliques. L'application détectera les asymétries."
    },
    
    birddog: {
        title: "Bird Dog - Score Qualitatif (0-3)",
        material: "Tapis, bâton (optionnel pour validation)",
        protocol: `PROTOCOLE BIRD DOG TPI :

Position de départ :
1. Position quadrupède (4 pattes au sol)
2. Mains sous les épaules, genoux sous les hanches
3. Colonne neutre (ni cambrée, ni arrondie)

Exécution :
1. Lever BRAS OPPOSÉ + JAMBE OPPOSÉE simultanément
   (ex: bras droit + jambe gauche)
2. Extension complète bras et jambe (ligne droite épaule-hanche-cheville)
3. MAINTENIR 10 SECONDES en position
4. Répéter de l'autre côté (bras gauche + jambe droite)

⚠️ NOTATION QUALITATIVE (0 à 3) :

0️⃣ = ÉCHEC
   - Ne peut pas réaliser le mouvement
   - Perd l'équilibre immédiatement

1️⃣ = INSTABLE  
   - Peut lever bras + jambe mais perd l'équilibre rapidement
   - Compensations majeures (rotation bassin, affaissement)

2️⃣ = COMPENSATIONS VISIBLES
   - Tient 10s mais avec compensations :
     * Rotation du bassin
     * Cambrure lombaire
     * Affaissement des épaules
     * Tremblement excessif

3️⃣ = PARFAIT ✅
   - Tient 10s avec contrôle total
   - Alignement parfait (ligne droite)
   - Aucune compensation
   - Bassin stable, pas de rotation

Test de validation (optionnel) :
- Placer un bâton sur les lombaires
- Il ne doit PAS bouger/tomber pendant les 10s`,
        tips: "Ce n'est PAS un test de temps mais de QUALITÉ du contrôle moteur. La stabilité du bassin et l'alignement sont primordiaux."
    },
    
    mcgillflexor: {
        title: "McGill Flexor Test",
        material: "Banc ou support incliné à 60°, chronomètre",
        protocol: `1. S'asseoir sur un banc incliné à 60°
2. Genoux et hanches à 90°
3. Croiser les bras sur la poitrine
4. Retirer le support dorsal
5. Tenir la position le plus longtemps possible

Position :
- Dos à 60° par rapport à l'horizontal
- Pas de support
- Immobile

Arrêt quand :
- Le dos descend
- Douleur lombaire`,
        tips: "Test crucial pour la santé du dos du golfeur. Contracter les abdos profonds."
    },
    
    mcgillextensor: {
        title: "McGill Extensor Test",
        material: "Banc, chronomètre",
        protocol: `1. S'allonger à plat ventre sur le bord d'un banc
2. Le haut du corps dépasse dans le vide (à partir de la crête iliaque)
3. Un partenaire tient les jambes
4. Maintenir le tronc à l'horizontale
5. Bras croisés sur la poitrine
6. Tenir le plus longtemps possible

Arrêt quand :
- Le buste descend
- Douleur lombaire`,
        tips: "Serrer les fessiers. Ne pas cambrer. Test essentiel pour les extenseurs du dos."
    },
    
    
    // MOBILITÉ
    standreach: {
        title: "Stand & Reach (Souplesse chaîne postérieure)",
        material: "Marche ou step (20-30cm), règle ou mètre",
        protocol: `PROTOCOLE STAND & REACH :

1. DEBOUT sur une marche ou un step
2. Pieds joints, genoux TENDUS
3. Se pencher en avant, bras tendus
4. Descendre les mains le PLUS BAS possible le long des jambes
5. Mesurer la distance SOUS le niveau des orteils

Mesure :
- Point 0 = niveau des orteils
- POSITIF (+) = les mains dépassent SOUS les orteils ✅
- NÉGATIF (-) = les mains n'atteignent PAS les orteils ❌

Exemple : 
- +10 cm = mains 10 cm sous les orteils (BIEN)
- -5 cm = mains 5 cm AU-DESSUS des orteils (raide)

Consignes :
- Garder les genoux TENDUS
- Pas de rebond, mouvement fluide
- Maintenir 2 secondes à la position maximale`,
        tips: "S'échauffer avant. Expirer en descendant. Ce test évalue TOUTE la chaîne postérieure (mollets + ischio + dos)."
    },
    
    thoracic: {
        title: "Rotation Thoracique",
        material: "Bâton, goniomètre ou application smartphone",
        protocol: `1. S'asseoir sur une chaise ou un banc
2. Placer un bâton sur les épaules (derrière la nuque)
3. Bloquer le bassin (ne doit PAS bouger)
4. Tourner le buste au maximum À GAUCHE
5. Mesurer l'angle de rotation (en degrés)
6. Répéter À DROITE

Mesure :
- Utiliser un goniomètre
- Ou application smartphone (inclinomètre)
- Angle entre la ligne des épaules et l'axe initial

Important : TESTER LES DEUX CÔTÉS
L'application détectera les asymétries.`,
        tips: "Le bassin ne doit ABSOLUMENT PAS bouger. Seul le tronc tourne."
    },
    
    hiprotation: {
        title: "Rotation de Hanche Interne/Externe",
        material: "Table/banc, goniomètre",
        protocol: `Position de départ :
1. Allongé sur le dos
2. Jambe testée : hanche et genou fléchis à 90°
3. L'autre jambe tendue au sol

ROTATION INTERNE :
- Laisser tomber le pied VERS L'EXTÉRIEUR
- La cuisse pivote vers l'intérieur
- Mesurer l'angle

ROTATION EXTERNE :
- Laisser tomber le pied VERS L'INTÉRIEUR
- La cuisse pivote vers l'extérieur
- Mesurer l'angle

Tester GAUCHE et DROITE pour chaque rotation.

Mesure : angle en degrés (goniomètre ou app)`,
        tips: "Bassin bien plaqué au sol. Ne pas tricher en soulevant la hanche."
    },
    
    ankle: {
        title: "Dorsiflexion Cheville (Test du mur)",
        material: "Mur, mètre ruban",
        protocol: `1. Se placer face à un mur
2. Avancer le genou vers le mur
3. Le TALON ne doit PAS décoller du sol
4. Mesurer la distance maximale entre les ORTEILS et le mur
5. Répéter pour l'autre pied

Position :
- Un pied à la fois
- Genou dans l'axe du pied
- Talon cloué au sol

Tester GAUCHE et DROITE.

Important : Mobilité cruciale pour le swing de golf.`,
        tips: "Plus la distance orteils-mur est grande, meilleure est la mobilité."
    },
    
    shoulder: {
        title: "Test Épaules - Apley Scratch Test",
        material: "Mètre ruban ou règle",
        protocol: `PRINCIPE (selon littérature) :
Évaluer la mobilité de l'épaule en rotation interne et externe.
Une main vient PAR LE HAUT (abduction + rotation externe),
l'autre PAR LE BAS (adduction + rotation interne).

PROTOCOLE :
1. Position debout, dos droit contre un mur
2. Demander au patient de joindre ses mains dans le dos
3. Main dominante en HAUT derrière la nuque
4. Main non-dominante en BAS depuis la taille
5. Mesurer la DISTANCE entre les doigts du milieu (majeurs)

MESURE (en centimètres) :
- DISTANCE POSITIVE (+) = Les mains NE SE TOUCHENT PAS
  • Exemple : +15 cm = 15 cm d'écart entre les doigts
- DISTANCE ZÉRO (0) = Les doigts se touchent exactement
- DISTANCE NÉGATIVE (-) = Les mains SE CHEVAUCHENT
  • Exemple : -5 cm = 5 cm de chevauchement

ÉPAULE TESTÉE :
L'épaule testée est celle du bras qui vient PAR LE HAUT.

Tester LES DEUX CÔTÉS :
- Test 1 : Bras DROIT en haut → épaule droite
- Test 2 : Bras GAUCHE en haut → épaule gauche

VALEURS DE RÉFÉRENCE (littérature) :
• Excellente mobilité : -5 à -10 cm (chevauchement)
• Bonne mobilité : 0 cm (doigts se touchent)
• Mobilité modérée : +5 à +10 cm
• Mobilité limitée : > +15 cm

IMPORTANT :
Comparer gauche vs droite pour détecter les asymétries.
Un écart >5cm entre les deux côtés est significatif.`,
        tips: "Bien se tenir droit contre le mur. Ne pas pencher le tronc ou cambrer le dos. Respirer normalement, ne pas forcer en apnée."
    },
    
    // ÉQUILIBRE
    balanceopen: {
        title: "Équilibre Yeux Ouverts",
        material: "Chronomètre",
        protocol: `1. Se tenir sur une jambe
2. Mains sur les hanches
3. Regard fixe devant soi
4. Tenir 60 secondes maximum

Tester GAUCHE et DROITE.

Arrêt quand :
- Le pied d'appui bouge (même légèrement)
- L'autre pied touche le sol
- Les mains quittent les hanches
- Perte d'équilibre

Objectif : 60 secondes sans bouger`,
        tips: "Fixer un point devant soi. Contracter le core."
    },
    
    balanceclosed: {
        title: "Équilibre Yeux Fermés",
        material: "Chronomètre",
        protocol: `1. Même protocole que yeux ouverts
2. MAIS les yeux sont FERMÉS
3. Tenir le plus longtemps possible

Tester GAUCHE et DROITE.

Arrêt quand :
- Le pied d'appui bouge
- L'autre pied touche le sol
- Les mains quittent les hanches
- Perte d'équilibre

Ce test est BEAUCOUP plus difficile !`,
        tips: "Bien s'équilibrer avant de fermer les yeux. Concentration maximale."
    }
};

const TEST_NAMES = {
    squat: "Squat 1RM",
    deadlift: "Deadlift 1RM",
    benchpress: "Développé Couché 1RM",
    pullup: "Tirage Vertical 1RM",
    legextension: "Leg Extension (G/D)",
    legpress: "Presse (G/D)",
    shuttle: "Navette 5x10m",
    driverspeed: "Driver Speed",
    vma: "VMA",
    maxpushups: "Max Pompes 1min",
    maxsquats: "Max Squats 1min",
    wallsit: "Chaise Unilatérale (G/D)",
    vertjump: "Détente Verticale",
    horizjump: "Détente Horizontale",
    medballchest: "MedBall Chest Pass",
    medballrotation: "MedBall Rotation Throw (G/D)",
    cmjunilateral: "CMJ Unilatéral (G/D)",
    rkcplank: "RKC Plank",
    sideplank: "Side Plank (G/D)",
    birddog: "Bird Dog",
    mcgillflexor: "McGill Flexor",
    mcgillextensor: "McGill Extensor",
    standreach: "Stand & Reach",
    thoracic: "Rotation Thoracique (G/D)",
    hiprotation: "Hip Rotation",
    ankle: "Dorsiflexion (G/D)",
    shoulder: "Test Épaules (G/D)",
    balanceopen: "Équilibre Yeux Ouverts (G/D)",
    balanceclosed: "Équilibre Yeux Fermés (G/D)"
};


// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de l\'application...');
    initializeApp();
    setupEventListeners();
    loadPlayerData();
    setupMobileMenu();
    setupRMCalculators();
    setupLivePerformanceIndicators();
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
    
    // Mise à jour des barèmes quand le profil change
    document.getElementById('playerGender')?.addEventListener('change', () => {
        if (typeof displayCategoryBaremes === 'function') {
            displayCategoryBaremes();
        }
    });
    document.getElementById('playerAge')?.addEventListener('change', () => {
        if (typeof displayCategoryBaremes === 'function') {
            displayCategoryBaremes();
        }
    });
    document.getElementById('playerLevel')?.addEventListener('change', () => {
        if (typeof displayCategoryBaremes === 'function') {
            displayCategoryBaremes();
        }
    });
    document.getElementById('playerHandicap')?.addEventListener('change', () => {
        if (typeof displayCategoryBaremes === 'function') {
            displayCategoryBaremes();
        }
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
    
    // Poids des medballs
    const medballChestWeight = document.getElementById('test-medballchest-weight')?.value;
    const medballRotationWeight = document.getElementById('test-medballrotation-weight')?.value;
    if (testData.results.medballchest) {
        testData.medballChestWeight = medballChestWeight;
    }
    if (testData.results.medballrotation) {
        testData.medballRotationWeight = medballRotationWeight;
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

// ==================== DÉTERMINATION DE LA CATÉGORIE JOUEUR ====================
function getPlayerCategory() {
    const age = parseInt(document.getElementById('playerAge')?.value) || 18;
    const playerLevel = document.getElementById('playerLevel')?.value || 'amateur';
    const handicap = parseFloat(document.getElementById('playerHandicap')?.value);
    
    // JEUNES (jusqu'à 18 ans) : catégorie par ÂGE
    if (age < 12) return '<12';
    if (age < 14) return '12-14';
    if (age < 16) return '14-16';
    if (age < 18) return '16-18';
    
    // ADULTES (18+ ans) : catégorie par NIVEAU DE JEU
    if (playerLevel === 'pro_joueur') {
        return 'professionnel';
    }
    
    if (playerLevel === 'pro_enseignant') {
        return 'amateur_negatif'; // Enseignants = catégorie négatif
    }
    
    // Amateur : selon handicap
    if (!isNaN(handicap)) {
        if (handicap < 0) return 'amateur_negatif';  // Handicap négatif
        if (handicap <= 7) return 'amateur_0to7';     // 0-7
        return 'amateur_8plus';                        // 8+
    }
    
    // Par défaut : amateur 8+
    return 'amateur_8plus';
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

// ==================== INDICATEURS DE PERFORMANCE EN TEMPS RÉEL ====================
function setupLivePerformanceIndicators() {
    // Afficher les barèmes généraux pour chaque catégorie (avec délai pour que le DOM soit prêt)
    setTimeout(() => {
        displayCategoryBaremes();
    }, 500);
    
    // Liste de tous les tests avec leurs inputs
    const testInputs = {
        // Force
        'squat': { input: 'test-squat-1rm', type: 'ratio', needsWeight: true },
        'deadlift': { input: 'test-deadlift-1rm', type: 'ratio', needsWeight: true },
        'benchpress': { input: 'test-benchpress-1rm', type: 'ratio', needsWeight: true },
        'pullup': { input: 'test-pullup-1rm', type: 'ratio', needsWeight: true },
        
        // Vitesse
        'shuttle': { input: 'test-shuttle', type: 'direct' },
        'driverspeed': { input: 'test-driverspeed', type: 'direct' },
        
        // Endurance
        'vma': { input: 'test-vma', type: 'direct' },
        'maxpushups': { input: 'test-pushups', type: 'direct' },
        'maxsquats': { input: 'test-squats60', type: 'direct' },
        'wallsit-left': { input: 'test-wallsit-left', type: 'direct', testKey: 'wallsit' },
        'wallsit-right': { input: 'test-wallsit-right', type: 'direct', testKey: 'wallsit' },
        
        // Explosivité
        'vertjump': { input: 'test-vertjump', type: 'direct' },
        'horizjump': { input: 'test-horizjump', type: 'direct' },
        'medballchest': { input: 'test-medballchest', type: 'direct' },
        'medballrotation-left': { input: 'test-medballrotation-left', type: 'direct', testKey: 'medballrotation' },
        'medballrotation-right': { input: 'test-medballrotation-right', type: 'direct', testKey: 'medballrotation' },
        'cmjunilateral-left': { input: 'test-cmj-left', type: 'direct', testKey: 'cmjunilateral' },
        'cmjunilateral-right': { input: 'test-cmj-right', type: 'direct', testKey: 'cmjunilateral' },
        
        // Core
        'rkcplank': { input: 'test-rkcplank', type: 'direct' },
        'sideplank-left': { input: 'test-sideplank-left', type: 'direct', testKey: 'sideplank' },
        'sideplank-right': { input: 'test-sideplank-right', type: 'direct', testKey: 'sideplank' },
        'mcgillflexor': { input: 'test-mcgillflexor', type: 'direct' },
        'mcgillextensor': { input: 'test-mcgillextensor', type: 'direct' },
        'birddog': { input: 'test-birddog', type: 'direct' },
        
        // Mobilité
        'standreach': { input: 'test-standreach', type: 'direct' },
        'thoracic-left': { input: 'test-thoracic-left', type: 'direct', testKey: 'thoracic' },
        'thoracic-right': { input: 'test-thoracic-right', type: 'direct', testKey: 'thoracic' },
        'hipint-left': { input: 'test-hipint-left', type: 'direct', testKey: 'hipint' },
        'hipint-right': { input: 'test-hipint-right', type: 'direct', testKey: 'hipint' },
        'hipext-left': { input: 'test-hipext-left', type: 'direct', testKey: 'hipext' },
        'hipext-right': { input: 'test-hipext-right', type: 'direct', testKey: 'hipext' },
        'ankle-left': { input: 'test-ankle-left', type: 'direct', testKey: 'ankle' },
        'ankle-right': { input: 'test-ankle-right', type: 'direct', testKey: 'ankle' },
        'shoulder-left': { input: 'test-shoulder-left', type: 'direct', testKey: 'shoulder' },
        'shoulder-right': { input: 'test-shoulder-right', type: 'direct', testKey: 'shoulder' },
        
        // Équilibre
        'balanceopen-left': { input: 'test-balanceopen-left', type: 'direct', testKey: 'balanceopen' },
        'balanceopen-right': { input: 'test-balanceopen-right', type: 'direct', testKey: 'balanceopen' },
        'balanceclosed-left': { input: 'test-balanceclosed-left', type: 'direct', testKey: 'balanceclosed' },
        'balanceclosed-right': { input: 'test-balanceclosed-right', type: 'direct', testKey: 'balanceclosed' }
    };
    
    // Ajouter des listeners sur chaque input
    Object.keys(testInputs).forEach(testKey => {
        const config = testInputs[testKey];
        const input = document.getElementById(config.input);
        
        if (input) {
            // Créer l'indicateur de niveau
            createPerformanceIndicator(input, testKey, config);
            
            // Écouter les changements
            input.addEventListener('input', () => {
                updatePerformanceIndicator(input, testKey, config);
            });
            
            // Mise à jour si le profil change
            document.getElementById('playerGender')?.addEventListener('change', () => {
                updatePerformanceIndicator(input, testKey, config);
            });
            document.getElementById('playerAge')?.addEventListener('change', () => {
                updatePerformanceIndicator(input, testKey, config);
            });
            document.getElementById('playerWeight')?.addEventListener('input', () => {
                if (config.needsWeight) {
                    updatePerformanceIndicator(input, testKey, config);
                }
            });
        }
    });
}

function createPerformanceIndicator(inputElement, testKey, config) {
    // Créer l'élément indicateur
    const indicator = document.createElement('div');
    indicator.className = 'performance-indicator';
    indicator.id = `indicator-${config.input}`;
    indicator.innerHTML = '<span class="level-badge"></span>';
    
    // Insérer après l'input
    inputElement.parentNode.insertBefore(indicator, inputElement.nextSibling);
}

function updatePerformanceIndicator(inputElement, testKey, config) {
    const indicator = document.getElementById(`indicator-${config.input}`);
    if (!indicator) return;
    
    const value = parseFloat(inputElement.value);
    if (!value || value <= 0) {
        indicator.innerHTML = '';
        return;
    }
    
    // Récupérer les infos du profil
    const gender = document.getElementById('playerGender')?.value || 'M';
    const category = getPlayerCategory(); // Nouvelle fonction
    const weight = parseFloat(document.getElementById('playerWeight')?.value) || 70;
    
    // Utiliser testKey optionnel pour les tests bilatéraux
    const baremeKey = config.testKey || testKey;
    
    // Récupérer le barème
    const bareme = BAREMES[baremeKey];
    if (!bareme || !bareme.levels || !bareme.levels[gender] || !bareme.levels[gender][category]) {
        return;
    }
    
    const levels = bareme.levels[gender][category];
    
    // Calculer la valeur à comparer
    let compareValue = value;
    if (config.needsWeight && weight > 0) {
        // Pour les tests de force, calculer le ratio
        compareValue = value / weight;
    }
    
    // Déterminer le niveau
    const level = getPerformanceLevel(compareValue, levels, bareme.higherIsBetter);
    const levelInfo = getLevelInfo(level);
    
    // Afficher l'indicateur
    indicator.innerHTML = `
        <span class="level-badge level-${level}" style="
            display: inline-block;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            background: ${levelInfo.color};
            color: white;
            margin-top: 0.3rem;
        ">
            ${levelInfo.icon} ${levelInfo.label}
        </span>
    `;
}

function getPerformanceLevel(value, levels, higherIsBetter = true) {
    // levels = [niveau1, niveau2, niveau3, niveau4]
    // Retourne 1, 2, 3 ou 4
    
    if (higherIsBetter) {
        // Plus c'est haut, mieux c'est (ex: détente, force)
        if (value >= levels[3]) return 4; // Élite
        if (value >= levels[2]) return 3; // Bon
        if (value >= levels[1]) return 2; // Moyen
        return 1; // Faible
    } else {
        // Moins c'est haut, mieux c'est (ex: navette, temps)
        if (value <= levels[3]) return 4; // Élite
        if (value <= levels[2]) return 3; // Bon
        if (value <= levels[1]) return 2; // Moyen
        return 1; // Faible
    }
}

function getLevelInfo(level) {
    const levels = {
        1: { label: 'Faible', icon: '🔴', color: '#e74c3c' },
        2: { label: 'Moyen', icon: '🟡', color: '#f39c12' },
        3: { label: 'Bon', icon: '🟢', color: '#27ae60' },
        4: { label: 'Élite', icon: '🏆', color: '#8e44ad' }
    };
    return levels[level] || levels[1];
}

function displayCategoryBaremes() {
    console.log('🔍 displayCategoryBaremes appelée');
    
    // Récupérer les infos du profil
    const gender = document.getElementById('playerGender')?.value || 'M';
    const category = getPlayerCategory();
    
    console.log('👤 Profil:', { gender, category });
    
    // Catégories de tests
    const categories = {
        'force': ['squat', 'deadlift', 'benchpress', 'pullup'],
        'vitesse': ['shuttle', 'driverspeed'],
        'endurance': ['vma', 'maxpushups', 'maxsquats', 'wallsit'],
        'explosivite': ['vertjump', 'horizjump', 'medballchest', 'medballrotation', 'cmjunilateral'],
        'core': ['rkcplank', 'sideplank', 'mcgillflexor', 'mcgillextensor', 'birddog'],
        'mobilite': ['standreach', 'thoracic', 'hipint', 'hipext', 'ankle', 'shoulder'],
        'equilibre': ['balanceopen', 'balanceclosed']
    };
    
    // Insérer les tableaux de barèmes
    Object.keys(categories).forEach(categoryKey => {
        const tests = categories[categoryKey];
        const container = createBaremeTable(tests, gender, category);
        
        // Insérer dans la page
        insertBaremeIntoCategory(categoryKey, container);
    });
    
    console.log('✅ Barèmes affichés');
}

function createBaremeTable(tests, gender, category) {
    const genderLabel = gender === 'M' ? 'Homme' : 'Femme';
    
    // Libellés des catégories
    const categoryLabels = {
        '<12': '<12 ans',
        '12-14': '12-14 ans',
        '14-16': '14-16 ans',
        '16-18': '16-18 ans',
        'amateur_8plus': 'Amateur HCP 8+',
        'amateur_0to7': 'Amateur HCP 0-7',
        'amateur_negatif': 'Amateur HCP négatif / Enseignant',
        'professionnel': 'Professionnel'
    };
    
    const categoryLabel = categoryLabels[category] || category;
    
    let html = `
        <div class="baremes-info" style="
            display: block !important;
            visibility: visible !important;
            background: #f7fafc;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border-left: 4px solid #1a4d2e;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #1a4d2e; font-size: 1rem;">
                    📊 Barèmes de référence
                </h4>
                <span style="font-size: 0.9rem; color: #666;">
                    ${genderLabel}, ${categoryLabel}
                </span>
            </div>
            <table style="width: 100%; font-size: 0.85rem; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid #ddd;">
                        <th style="text-align: left; padding: 0.5rem;">Test</th>
                        <th style="padding: 0.5rem; text-align: center;">🔴 Faible</th>
                        <th style="padding: 0.5rem; text-align: center;">🟡 Moyen</th>
                        <th style="padding: 0.5rem; text-align: center;">🟢 Bon</th>
                        <th style="padding: 0.5rem; text-align: center;">🏆 Élite</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    tests.forEach(testKey => {
        const bareme = BAREMES[testKey];
        if (!bareme || !bareme.levels || !bareme.levels[gender] || !bareme.levels[gender][category]) {
            return;
        }
        
        const levels = bareme.levels[gender][category];
        const testName = TEST_NAMES[testKey] || testKey;
        const unit = bareme.unit || '';
        
        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 0.5rem; font-weight: 500;">${testName}</td>
                <td style="padding: 0.5rem; text-align: center; background: #ffe6e6;">< ${levels[0]}${unit}</td>
                <td style="padding: 0.5rem; text-align: center; background: #fff9e6;">${levels[0]}-${levels[1]}${unit}</td>
                <td style="padding: 0.5rem; text-align: center; background: #e6ffe6;">${levels[1]}-${levels[2]}${unit}</td>
                <td style="padding: 0.5rem; text-align: center; background: #f3e6ff;">≥ ${levels[2]}${unit}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
    `;
    
    return html;
}

function insertBaremeIntoCategory(categoryKey, htmlContent) {
    // Trouver la catégorie correspondante
    const categoryMap = {
        'force': 'FORCE',
        'vitesse': 'VITESSE',
        'endurance': 'ENDURANCE',
        'explosivite': 'EXPLOSIVITÉ',
        'core': 'CORE',
        'mobilite': 'MOBILITÉ',
        'equilibre': 'ÉQUILIBRE'
    };
    
    const categoryName = categoryMap[categoryKey];
    if (!categoryName) {
        console.warn(`⚠️ Catégorie inconnue: ${categoryKey}`);
        return;
    }
    
    console.log(`🔍 Recherche de la catégorie: ${categoryName}`);
    
    // Trouver le header de la catégorie
    const headers = document.querySelectorAll('.category-header');
    let found = false;
    
    headers.forEach(header => {
        if (header.textContent.includes(categoryName)) {
            found = true;
            console.log(`✅ Catégorie ${categoryName} trouvée`);
            const content = header.nextElementSibling;
            if (content) {
                // Vérifier s'il n'y a pas déjà un barème
                const existing = content.querySelector('.baremes-info');
                if (existing) {
                    existing.remove();
                    console.log(`🗑️ Ancien barème supprimé pour ${categoryName}`);
                }
                
                // Insérer au début du contenu
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = htmlContent;
                content.insertBefore(tempDiv.firstChild, content.firstChild);
                console.log(`📊 Barème inséré pour ${categoryName}`);
            }
        }
    });
    
    if (!found) {
        console.warn(`❌ Catégorie ${categoryName} NON trouvée dans le DOM`);
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
