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
2. Le joueur fait 5 courses de 10m (2,5 allers/retours)
3. TOTAL = 50 mètres parcourus
4. Il DOIT toucher la ligne avec la main à chaque virage
5. Chronomètre du départ jusqu'à la 5ème arrivée

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
3. LEVER UNE JAMBE
4. Tenir le plus longtemps possible
5. Chronomètre jusqu'à :
   - La jambe d'appui tremble trop
   - Le dos décolle du mur
   - L'autre pied touche le sol

Tester GAUCHE et DROITE séparément.`,
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
        title: "Bird Dog (Qualité 0-3)",
        material: "Tapis, bâton (optionnel)",
        protocol: `1. Position à 4 pattes
2. Lever bras droit ET jambe gauche simultanément
3. Maintenir 10 secondes
4. Répéter de l'autre côté

NOTATION (0 à 3) :
0 = Impossible de lever bras + jambe
1 = Peut lever mais mouvement du dos/bassin
2 = Stable mais léger mouvement
3 = Parfait, aucun mouvement du dos/bassin

Test de référence :
- Placer un bâton sur les lombaires
- Il ne doit PAS tomber pendant l'exercice`,
        tips: "Pas un test de temps mais de QUALITÉ. La stabilité du bassin est primordiale."
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

ROTATION EXTERNE :
- Laisser tomber le pied VERS L'EXTÉRIEUR
- La cuisse pivote vers l'extérieur
- Mesurer l'angle

ROTATION INTERNE :
- Laisser tomber le pied VERS L'INTÉRIEUR
- La cuisse pivote vers l'intérieur
- Mesurer l'angle

Tester GAUCHE et DROITE pour chaque rotation.`,
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
// L'initialisation se fait à la fin du fichier pour gérer le cas où le DOM est déjà chargé

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
// ==================== EXPORT / IMPORT DONNÉES ====================
function exportData() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        currentPlayer: JSON.parse(localStorage.getItem('currentPlayer') || 'null'),
        testsHistory: JSON.parse(localStorage.getItem('testsHistory') || '[]')
    };
    
    if (!data.currentPlayer && data.testsHistory.length === 0) {
        alert('⚠️ Aucune donnée à exporter. Créez d\'abord un profil et enregistrez des tests.');
        return;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const today = new Date().toISOString().split('T')[0];
    const filename = `golf-tracker-backup-${today}.json`;
    
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(dataBlob);
    downloadLink.download = filename;
    downloadLink.click();
    
    alert(`✅ Données exportées avec succès !\n\nFichier: ${filename}\n\nProfil: ${data.currentPlayer ? data.currentPlayer.name : 'Aucun'}\nTests: ${data.testsHistory.length}`);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validation
            if (!data.version || (!data.currentPlayer && (!data.testsHistory || data.testsHistory.length === 0))) {
                throw new Error('Fichier invalide');
            }
            
            // Demander confirmation
            const playerInfo = data.currentPlayer ? `Profil: ${data.currentPlayer.name}` : 'Aucun profil';
            const testsInfo = `Tests: ${data.testsHistory ? data.testsHistory.length : 0}`;
            
            const confirmMsg = `⚠️ ATTENTION !\n\nCette action va REMPLACER toutes vos données actuelles par :\n\n${playerInfo}\n${testsInfo}\n\nÊtes-vous sûr ?`;
            
            if (!confirm(confirmMsg)) {
                event.target.value = ''; // Reset file input
                return;
            }
            
            // Sauvegarder les données
            if (data.currentPlayer) {
                localStorage.setItem('currentPlayer', JSON.stringify(data.currentPlayer));
                window.currentPlayer = data.currentPlayer;
            }
            
            if (data.testsHistory) {
                localStorage.setItem('testsHistory', JSON.stringify(data.testsHistory));
            }
            
            alert(`✅ Données importées avec succès !\n\n${playerInfo}\n${testsInfo}\n\nLa page va se recharger...`);
            
            // Recharger la page
            setTimeout(() => {
                location.reload();
            }, 1000);
            
        } catch (error) {
            alert('❌ Erreur lors de l\'import !\n\nLe fichier semble corrompu ou invalide.\n\nErreur: ' + error.message);
            event.target.value = ''; // Reset file input
        }
    };
    
    reader.onerror = function() {
        alert('❌ Erreur lors de la lecture du fichier !');
        event.target.value = '';
    };
    
    reader.readAsText(file);
}

// Sauvegarde automatique à chaque modification
function autoBackup() {
    const data = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        currentPlayer: JSON.parse(localStorage.getItem('currentPlayer') || 'null'),
        testsHistory: JSON.parse(localStorage.getItem('testsHistory') || '[]')
    };
    
    // Sauvegarder dans un localStorage séparé pour backup automatique
    localStorage.setItem('autoBackup', JSON.stringify(data));
    console.log('💾 Sauvegarde automatique effectuée');
}

// Appeler autoBackup après chaque sauvegarde
const originalSaveProfile = saveProfile;
const originalSaveQualityTests = saveQualityTests;

// ==================== SETUP EVENT LISTENERS ====================
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
    
    // Calcul Mirwald, IMC et Envergure
    ['playerGender', 'playerAge', 'playerHeight', 'playerSittingHeight', 'playerWeight'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateMirwald);
        document.getElementById(id)?.addEventListener('change', calculateMirwald);
        document.getElementById(id)?.addEventListener('input', calculateIMC);
        document.getElementById(id)?.addEventListener('change', calculateIMC);
    });
    
    ['playerHeight', 'playerWingspan'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateWingspan);
        document.getElementById(id)?.addEventListener('change', calculateWingspan);
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
// ==================== UPDATE DASHBOARD ====================
function updateDashboard() {
    console.log('📊 Dashboard chargé');
    
    // 1. CITATION ALÉATOIRE
    const quotes = [
        {en: "The talent without work is nothing.", fr: "Le talent sans travail n'est rien.", author: "Cristiano Ronaldo"},
        {en: "Champions are made when no one is watching.", fr: "Les champions se forgent quand personne ne regarde.", author: "Unknown"},
        {en: "Discipline is doing what needs to be done, even when you don't want to do it.", fr: "La discipline, c'est faire ce qui doit être fait, même quand on n'en a pas envie.", author: "Unknown"},
        {en: "Hard work beats talent when talent doesn't work hard.", fr: "Le travail acharné bat le talent quand le talent ne travaille pas dur.", author: "Tim Notke"},
        {en: "You miss 100% of the shots you don't take.", fr: "Vous ratez 100% des coups que vous ne tentez pas.", author: "Wayne Gretzky"},
        {en: "The difference between the impossible and the possible lies in determination.", fr: "La différence entre l'impossible et le possible réside dans la détermination.", author: "Tommy Lasorda"},
        {en: "Pain is temporary. Quitting lasts forever.", fr: "La douleur est temporaire. Abandonner dure toujours.", author: "Lance Armstrong"},
        {en: "It's not whether you get knocked down, it's whether you get up.", fr: "Ce n'est pas de savoir si vous tombez, mais si vous vous relevez.", author: "Vince Lombardi"},
        {en: "The more difficult the victory, the greater the happiness in winning.", fr: "Plus la victoire est difficile, plus grand est le bonheur de gagner.", author: "Pelé"}
    ];
    
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('dashQuote');
    if (quoteEl) {
        quoteEl.innerHTML = `
            <p style="font-size: 20px; font-style: italic; margin: 0 0 10px 0;">"${randomQuote.en}"</p>
            <p style="font-size: 16px; font-style: italic; margin: 0 0 10px 0; opacity: 0.9;">"${randomQuote.fr}"</p>
            <p style="font-size: 14px; text-align: right; margin: 0; opacity: 0.8;">— ${randomQuote.author}</p>
        `;
    }
    
    // 2. RÉCUPÉRER LES DONNÉES
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const scores = calculateQualityScores();
    
    // 3. NOTE GLOBALE
    if (scores) {
        const validScores = Object.values(scores).filter(s => s !== null && !isNaN(s));
        if (validScores.length > 0) {
            const moyenne = validScores.reduce((a, b) => a + b, 0) / validScores.length;
            document.getElementById('dashGlobalScore').textContent = moyenne.toFixed(1);
        } else {
            document.getElementById('dashGlobalScore').textContent = '--';
        }
    }
    
    // 4. DERNIER TEST
    if (history.length > 0) {
        const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastTest = sortedHistory[0];
        const quality = QUALITY_TESTS[lastTest.quality];
        const date = new Date(lastTest.date);
        const daysAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        document.getElementById('dashLastTest').textContent = quality?.name || lastTest.quality;
        document.getElementById('dashLastTestDate').textContent = daysAgo === 0 ? "Aujourd'hui" : `Il y a ${daysAgo} jour${daysAgo > 1 ? 's' : ''}`;
    } else {
        document.getElementById('dashLastTest').textContent = 'Aucun';
        document.getElementById('dashLastTestDate').textContent = '--';
    }
    
    // 5. TOTAL TESTS
    document.getElementById('dashTotalTests').textContent = history.length;
    
    // 6. MEILLEUR SCORE
    if (scores) {
        const qualites = [
            {name: 'Force', score: scores.force},
            {name: 'Vitesse', score: scores.vitesse},
            {name: 'Endurance', score: scores.endurance},
            {name: 'Explosivité', score: scores.explosivite},
            {name: 'Core', score: scores.core},
            {name: 'Mobilité', score: scores.mobilite},
            {name: 'Équilibre', score: scores.equilibre}
        ].filter(q => q.score !== null).sort((a, b) => b.score - a.score);
        
        if (qualites.length > 0) {
            const best = qualites[0];
            document.getElementById('dashBestScore').textContent = best.score.toFixed(1) + '/20';
            document.getElementById('dashBestQuality').textContent = best.name;
        } else {
            document.getElementById('dashBestScore').textContent = '--';
            document.getElementById('dashBestQuality').textContent = 'Aucune qualité testée';
        }
    }
    
    // 7. QUALITÉS NON TESTÉES
    const missingEl = document.getElementById('dashMissing');
    if (scores) {
        const missing = [
            {name: 'Force', score: scores.force},
            {name: 'Vitesse', score: scores.vitesse},
            {name: 'Endurance', score: scores.endurance},
            {name: 'Explosivité', score: scores.explosivite},
            {name: 'Core', score: scores.core},
            {name: 'Mobilité', score: scores.mobilite},
            {name: 'Équilibre', score: scores.equilibre}
        ].filter(q => q.score === null);
        
        if (missing.length === 0) {
            missingEl.innerHTML = '<p style="color: #27ae60; font-weight: 600; margin: 0;">✅ Toutes les qualités ont été testées !</p>';
        } else {
            missingEl.innerHTML = '<div style="display: flex; flex-wrap: wrap; gap: 10px;">' + 
                missing.map(q => `<span style="background: #ffebee; color: #c62828; padding: 8px 15px; border-radius: 20px; font-size: 14px; font-weight: 600;">❌ ${q.name}</span>`).join('') +
                '</div>';
        }
    } else {
        missingEl.innerHTML = '<p style="color: #999; margin: 0;">Complétez des tests pour voir cette section</p>';
    }
    
    // 8. CONSEIL DU JOUR
    const adviceEl = document.getElementById('dashAdvice');
    const advices = [];
    
    if (scores) {
        const missing = [
            {name: 'Force', score: scores.force, icon: '💪'},
            {name: 'Vitesse', score: scores.vitesse, icon: '⚡'},
            {name: 'Endurance', score: scores.endurance, icon: '🏃'},
            {name: 'Explosivité', score: scores.explosivite, icon: '🚀'},
            {name: 'Core', score: scores.core, icon: '🎯'},
            {name: 'Mobilité', score: scores.mobilite, icon: '🤸'},
            {name: 'Équilibre', score: scores.equilibre, icon: '⚖️'}
        ].filter(q => q.score === null);
        
        if (missing.length > 0) {
            const randomMissing = missing[Math.floor(Math.random() * missing.length)];
            advices.push(`${randomMissing.icon} <strong>Testez votre ${randomMissing.name} cette semaine !</strong> Vous n'avez pas encore évalué cette qualité.`);
        }
        
        const weak = [
            {name: 'Force', score: scores.force},
            {name: 'Vitesse', score: scores.vitesse},
            {name: 'Endurance', score: scores.endurance},
            {name: 'Explosivité', score: scores.explosivite},
            {name: 'Core', score: scores.core},
            {name: 'Mobilité', score: scores.mobilite},
            {name: 'Équilibre', score: scores.equilibre}
        ].filter(q => q.score !== null && q.score < 12).sort((a, b) => a.score - b.score);
        
        if (weak.length > 0) {
            advices.push(`⚠️ <strong>Votre ${weak[0].name} nécessite attention</strong> (${weak[0].score.toFixed(1)}/20). Consultez le rapport pour un plan d'action personnalisé.`);
        }
    }
    
    if (advices.length === 0) {
        advices.push('🎯 <strong>Complétez tous les tests</strong> pour obtenir un bilan complet et des recommandations personnalisées !');
    }
    
    const randomAdvice = advices[Math.floor(Math.random() * advices.length)];
    adviceEl.innerHTML = `<p style="margin: 0;">${randomAdvice}</p>`;
    
    // 9. RECORD PERSONNEL
    const recordEl = document.getElementById('dashRecord');
    
    if (history.length === 0) {
        recordEl.innerHTML = '<p style="color: #999; margin: 0;">Complétez des tests pour voir vos records !</p>';
    } else {
        const allTestResults = [];
        history.forEach(record => {
            Object.entries(record.tests).forEach(([testKey, value]) => {
                if (value !== null && value !== undefined) {
                    const numValue = typeof value === 'object' ? 
                        ((value.left || 0) + (value.right || 0)) / 2 : value;
                    
                    const testDef = Object.values(QUALITY_TESTS)
                        .flatMap(q => q.tests)
                        .find(t => t.key === testKey);
                    
                    if (testDef) {
                        const score = calculateScore20(testKey, numValue);
                        if (score !== null) {
                            allTestResults.push({
                                name: testDef.name,
                                value: numValue,
                                unit: testDef.unit,
                                score: score,
                                badge: getBadgeLabel(score)
                            });
                        }
                    }
                }
            });
        });
        
        if (allTestResults.length > 0) {
            allTestResults.sort((a, b) => b.score - a.score);
            const best = allTestResults[0];
            
            recordEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #27ae60;">
                    <div>
                        <div style="font-size: 18px; font-weight: 700; color: #1a4d2e; margin-bottom: 5px;">${best.name}</div>
                        <div style="font-size: 14px; color: #666;">${best.value.toFixed(1)} ${best.unit} — ${best.score.toFixed(1)}/20</div>
                    </div>
                    <span class="badge badge-${best.badge.class}">${best.badge.label}</span>
                </div>
            `;
        } else {
            recordEl.innerHTML = '<p style="color: #999; margin: 0;">Aucun test avec score calculé</p>';
        }
    }
}

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
        if (typeof displayHistoryAdvanced === 'function') {
            displayHistoryAdvanced();
        } else {
            displayHistory();
        }
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
    const wingspan = parseFloat(document.getElementById('playerWingspan').value) || null;
    const level = document.getElementById('playerLevel').value;
    const handicap = document.getElementById('playerHandicap').value || null;
    const circuit = document.getElementById('playerCircuit').value || null;
    const color = '#1a4d2e'; // Couleur par défaut
    const photoPreview = document.getElementById('profilePhotoPreview');
    const photo = photoPreview.style.display !== 'none' ? photoPreview.src : null;
    
    if (!name || !weight || weight <= 0 || !height || height <= 0) {
        alert('Veuillez remplir tous les champs obligatoires (*) avec des valeurs valides.');
        return;
    }
    
    currentPlayer = { 
        name, gender, age, weight, height, sittingHeight, wingspan,
        level, handicap, circuit, color, photo
    };
    
    if (sittingHeight) {
        currentPlayer.mirwald = calculateMirwald();
    }
    
    currentPlayer.imc = calculateIMC();
    
    if (wingspan) {
        currentPlayer.wingspanData = calculateWingspan();
    }
    
    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
    document.documentElement.style.setProperty('--primary-color', color);
    
    // Sauvegarde automatique
    autoBackup();
    
    alert(`Profil de ${name} enregistré !`);
    updatePlayerDisplay();
    
    // Afficher les barèmes après enregistrement du profil
    setTimeout(() => {
        if (typeof displayBaremes === 'function') {
            displayBaremes();
        }
    }, 200);
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
        if (document.getElementById('playerWingspan')) {
            document.getElementById('playerWingspan').value = currentPlayer.wingspan || '';
        }
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
        calculateIMC();
        calculateWingspan();
        
        // Afficher les barèmes après chargement du profil
        setTimeout(() => {
            if (typeof displayBaremes === 'function') {
                displayBaremes();
            }
        }, 300);
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

// Fonction de compression d'image
function compressImage(file, maxWidth = 800, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Réduire si trop grande
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convertir en base64 avec compression
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        // Vérifier la taille du fichier
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('⚠️ La photo est trop volumineuse (max 5MB)');
            e.target.value = '';
            return;
        }
        
        // Compresser l'image
        compressImage(file, 800, 0.7)
            .then(compressedBase64 => {
                const preview = document.getElementById('profilePhotoPreview');
                preview.src = compressedBase64;
                preview.style.display = 'block';
                document.getElementById('removePhoto').style.display = 'inline-block';
                
                if (currentPlayer) {
                    currentPlayer.photo = compressedBase64;
                    localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
                }
                
                console.log('✅ Photo compressée et enregistrée');
            })
            .catch(error => {
                console.error('❌ Erreur compression photo:', error);
                alert('⚠️ Erreur lors du traitement de la photo');
                e.target.value = '';
            });
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
    const ageValue = document.getElementById('playerAge').value;
    const height = parseFloat(document.getElementById('playerHeight').value);
    const sittingHeight = parseFloat(document.getElementById('playerSittingHeight').value);
    const weight = parseFloat(document.getElementById('playerWeight').value);
    
    // Mirwald n'est valable que pour les <18 ans
    if (!ageValue || ageValue === '17-25' || ageValue === '25-40' || ageValue === '40-50' || ageValue === '50+') {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    if (!height || !sittingHeight || !weight) {
        document.getElementById('mirwaldResult').style.display = 'none';
        return null;
    }
    
    // Convertir la catégorie d'âge en âge numérique (milieu de la fourchette)
    let age;
    if (ageValue === '<12') age = 10;
    else if (ageValue === '12-14') age = 13;
    else if (ageValue === '14-17') age = 15.5;
    else age = parseInt(ageValue) || 14;
    
    const legLength = height - sittingHeight;
    let maturityOffset;
    
    if (gender === 'M') {
        maturityOffset = -9.236 + 
                        (0.0002708 * legLength * sittingHeight) + 
                        (-0.001663 * age * legLength) + 
                        (0.007216 * age * sittingHeight) + 
                        (0.02292 * weight / height * 100);
    } else {
        maturityOffset = -9.376 + 
                        (0.0001882 * legLength * sittingHeight) + 
                        (0.0022 * age * legLength) + 
                        (0.005841 * age * sittingHeight) + 
                        (-0.002658 * age * weight) + 
                        (0.07693 * weight / height * 100);
    }
    
    const resultDiv = document.getElementById('mirwaldResult');
    const displayDiv = resultDiv.querySelector('.mirwald-display');
    
    resultDiv.style.display = 'block';
    
    if (maturityOffset < -1) {
        displayDiv.innerHTML = `⏳ Pré-pubertaire<br><small>${Math.abs(maturityOffset).toFixed(1)} ans avant le pic de croissance</small>`;
        displayDiv.style.background = '#e3f2fd';
        displayDiv.style.color = '#1565c0';
    } else if (maturityOffset >= -1 && maturityOffset <= 1) {
        displayDiv.innerHTML = `📈 En plein pic de croissance<br><small>Phase critique de développement</small>`;
        displayDiv.style.background = '#fff3e0';
        displayDiv.style.color = '#e65100';
    } else {
        displayDiv.innerHTML = `✅ Post-pubertaire<br><small>${maturityOffset.toFixed(1)} ans après le pic de croissance</small>`;
        displayDiv.style.background = '#e8f5e9';
        displayDiv.style.color = '#2e7d32';
    }
    
    return maturityOffset;
}

// ==================== CALCUL IMC ====================
function calculateIMC() {
    const height = parseFloat(document.getElementById('playerHeight').value);
    const weight = parseFloat(document.getElementById('playerWeight').value);
    
    const resultDiv = document.getElementById('imcResult');
    
    if (!height || !weight || height <= 0 || weight <= 0) {
        if (resultDiv) resultDiv.style.display = 'none';
        return null;
    }
    
    const imc = weight / Math.pow(height / 100, 2);
    
    let category = '';
    let color = '';
    
    if (imc < 18.5) {
        category = 'Maigreur';
        color = '#3498db';
    } else if (imc >= 18.5 && imc < 25) {
        category = 'Normal';
        color = '#27ae60';
    } else if (imc >= 25 && imc < 30) {
        category = 'Surpoids';
        color = '#f39c12';
    } else {
        category = 'Obésité';
        color = '#e74c3c';
    }
    
    if (resultDiv) {
        const displayDiv = resultDiv.querySelector('.imc-display');
        if (displayDiv) {
            displayDiv.innerHTML = `<strong>IMC: ${imc.toFixed(1)}</strong> - ${category}`;
            displayDiv.style.background = color + '20';
            displayDiv.style.color = color;
            displayDiv.style.padding = '0.5rem';
            displayDiv.style.borderRadius = '4px';
            displayDiv.style.fontWeight = '600';
        }
        resultDiv.style.display = 'block';
    }
    
    return imc;
}

// ==================== CONSEILS ENVERGURE ====================
function calculateWingspan() {
    const height = parseFloat(document.getElementById('playerHeight').value);
    const wingspan = parseFloat(document.getElementById('playerWingspan')?.value);
    
    const resultDiv = document.getElementById('wingspanResult');
    
    if (!height || !wingspan || height <= 0 || wingspan <= 0) {
        if (resultDiv) resultDiv.style.display = 'none';
        return null;
    }
    
    const diff = wingspan - height;
    const ratio = (wingspan / height).toFixed(3);
    
    let advice = '';
    let clubAdvice = '';
    let exerciseAdvice = '';
    
    if (diff > 5) {
        clubAdvice = '📏 <strong>Matériel:</strong> Envisager des clubs +0.5" à +1" plus longs';
        exerciseAdvice = '💪 <strong>Exos recommandés:</strong> Mobilité thoracique, rotation du tronc, étirements chaîne postérieure';
    } else if (diff < -5) {
        clubAdvice = '📏 <strong>Matériel:</strong> Envisager des clubs -0.5" à -1" plus courts';
        exerciseAdvice = '💪 <strong>Exos recommandés:</strong> Renforcement épaules, travail de la posture, stabilité du tronc';
    } else {
        clubAdvice = '📏 <strong>Matériel:</strong> Taille standard adaptée';
        exerciseAdvice = '💪 <strong>Exos recommandés:</strong> Équilibre musculaire, mobilité générale';
    }
    
    if (resultDiv) {
        const displayDiv = resultDiv.querySelector('.wingspan-display');
        if (displayDiv) {
            displayDiv.innerHTML = `
                <div style="margin-bottom: 0.5rem;">
                    <strong>Envergure:</strong> ${wingspan} cm (${diff >= 0 ? '+' : ''}${diff.toFixed(1)} cm vs taille)
                    <br><small>Ratio: ${ratio}</small>
                </div>
                <div style="font-size: 0.9rem; line-height: 1.6;">
                    ${clubAdvice}<br>
                    ${exerciseAdvice}
                </div>
            `;
            displayDiv.style.background = '#f8f9fa';
            displayDiv.style.padding = '0.75rem';
            displayDiv.style.borderRadius = '6px';
            displayDiv.style.border = '1px solid #dee2e6';
        }
        resultDiv.style.display = 'block';
    }
    
    return {wingspan, diff, ratio};
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
// ==================== BACKUP AUTOMATIQUE ====================
function autoBackup() {
    // Sauvegarder automatiquement toutes les 5 sauvegardes de tests
    const backupCount = parseInt(localStorage.getItem('backupCount') || '0');
    
    if (backupCount >= 5) {
        // Créer un backup silencieux
        const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
        const data = {
            player: currentPlayer,
            testsHistory: history,
            exportDate: new Date().toISOString(),
            version: '2.0',
            autoBackup: true
        };
        
        // Sauvegarder dans localStorage comme backup de secours
        localStorage.setItem('lastAutoBackup', JSON.stringify(data));
        localStorage.setItem('lastAutoBackupDate', new Date().toISOString());
        localStorage.setItem('backupCount', '0');
        
        console.log('💾 Backup automatique créé');
    } else {
        localStorage.setItem('backupCount', (backupCount + 1).toString());
    }
}

// ==================== EXPORT / IMPORT ====================
function exportData() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    const data = {
        player: currentPlayer,
        testsHistory: history,
        exportDate: new Date().toISOString(),
        version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const fileName = `golf-tracker-${currentPlayer?.name || 'backup'}-${new Date().toISOString().split('T')[0]}.json`;
    link.download = fileName;
    link.click();
    
    alert(`✅ Données exportées !\n\n📁 Fichier: ${fileName}\n👤 Profil: ${currentPlayer?.name || 'N/A'}\n📊 Tests: ${history.length}`);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Importer le profil
            if (data.player) {
                currentPlayer = data.player;
                localStorage.setItem('currentPlayer', JSON.stringify(currentPlayer));
                loadPlayerData();
            }
            
            // Importer l'historique des tests
            if (data.testsHistory) {
                localStorage.setItem('testsHistory', JSON.stringify(data.testsHistory));
            }
            // Support de l'ancien format (allTests)
            else if (data.tests) {
                // Convertir ancien format vers nouveau
                const convertedHistory = data.tests.map((test, index) => ({
                    id: Date.now() + index,
                    date: test.date || new Date().toISOString(),
                    quality: 'force', // Par défaut, à ajuster
                    player: data.player?.name || 'Unknown',
                    tests: test
                }));
                localStorage.setItem('testsHistory', JSON.stringify(convertedHistory));
            }
            
            const importedTests = data.testsHistory?.length || data.tests?.length || 0;
            
            alert(`✅ Données importées avec succès !\n\n👤 Profil: ${data.player?.name || 'N/A'}\n📊 Tests: ${importedTests}\n📅 Date export: ${data.exportDate ? new Date(data.exportDate).toLocaleDateString('fr-FR') : 'N/A'}`);
            
            // Rafraîchir l'affichage
            switchTab('dashboard');
            updateDashboard();
        } catch (error) {
            alert('Erreur lors de l\'import');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function generateReport() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    // Générer le bilan complet (toutes les pages dans une seule fenêtre)
    generateCompleteBilan();
}

// ==================== BILAN COMPLET - TOUTES LES PAGES ====================
function generateCompleteBilan() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const scores = calculateQualityScores();
    if (!scores) {
        alert('Erreur lors du calcul des scores');
        return;
    }
    
    // Calculer la moyenne générale
    const validScores = Object.values(scores).filter(s => s !== null && !isNaN(s));
    const moyenneGenerale = validScores.length > 0 
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
        : 0;
    
    // Identifier points forts et faibles
    const qualites = [
        {name: 'Force', score: scores.force},
        {name: 'Vitesse', score: scores.vitesse},
        {name: 'Endurance', score: scores.endurance},
        {name: 'Explosivité', score: scores.explosivite},
        {name: 'Core & Stabilité', score: scores.core},
        {name: 'Mobilité', score: scores.mobilite},
        {name: 'Équilibre', score: scores.equilibre}
    ].filter(q => q.score !== null);
    
    qualites.sort((a, b) => b.score - a.score);
    
    const pointsForts = qualites.slice(0, 2);
    const pointsFaibles = qualites.slice(-2).reverse();
    
    // Fonctions helper pour les recommandations
    const getExercisesForQuality = (quality) => {
        const exercises = {
            'Force': [
                'Squats (3x8-12 reps, 70-80% 1RM)',
                'Deadlifts roumains (3x8-10 reps)',
                'Développé couché (3x8-12 reps)',
                'Tractions assistées (3x max reps)'
            ],
            'Vitesse': [
                'Sprints 10-20m (6-8 reps)',
                'Navette 5x10m (4-6 séries)',
                'Drills vitesse driver (10-15 swings/séance)',
                'Pliométrie légère (box jumps 3x5)'
            ],
            'Endurance': [
                'Course continue 20-30min (70% FCmax)',
                'Interval training 30-30 (10-15 séries)',
                'Circuit training 3x (pompes/squats/burpees)',
                'VMA courte (8x30s à 90-95% VMA)'
            ],
            'Explosivité': [
                'Box jumps (4x5 reps)',
                'Med ball throws (4x6 reps)',
                'Broad jumps (5x3 reps)',
                'Kettlebell swings (3x15 reps)'
            ],
            'Core & Stabilité': [
                'Plank variations (3x30-60s)',
                'Dead bugs (3x12 reps/côté)',
                'Pallof press (3x10 reps/côté)',
                'Bird dogs (3x10 reps/côté)'
            ],
            'Mobilité': [
                'Yoga golf-spécifique (20-30 min)',
                'Foam rolling routine (10-15 min)',
                'Étirements dynamiques (10 min)',
                'Rotation thoracique (3x10 reps/côté)'
            ],
            'Équilibre': [
                'Single leg stance (3x30s/côté)',
                'BOSU exercises (3x45s)',
                'Proprioception drills (15 min)',
                'Yoga balance poses (10-15 min)'
            ]
        };
        return exercises[quality] || ['Consulter un préparateur physique'];
    };
    
    const getFrequencyForQuality = (quality) => {
        const frequencies = {
            'Force': '3-4x/semaine (jours non consécutifs)',
            'Vitesse': '2-3x/semaine (repos 48h entre séances)',
            'Endurance': '3-5x/semaine (varie intensité)',
            'Explosivité': '2-3x/semaine (haute récupération)',
            'Core & Stabilité': '4-6x/semaine (peut être quotidien)',
            'Mobilité': 'Quotidien (10-15 min minimum)',
            'Équilibre': '3-4x/semaine (intégrer dans routine)'
        };
        return frequencies[quality] || '3x/semaine';
    };
    
    const getCorrectionExercise = (testName, weakerSide) => {
        const exercises = {
            'Wall Sit': 'Wall sit unilatéral côté faible (3x20-30s) + progression bilatéral',
            'CMJ Unilatéral': 'Single leg jumps côté faible (4x5 reps) + Bulgarian squats',
            'Side Plank': 'Side plank progressif côté faible (3x30-45s)',
            'Rotation Thoracique': 'Open book stretch côté limité (3x10 reps) + Foam roller',
            'Hip Rotation Int': 'Pigeon pose + 90/90 stretch côté limité (3x30s)',
            'Hip Rotation Ext': 'Frog stretch + band distraction côté limité',
            'Dorsiflexion': 'Ankle mobilité wall drill côté limité (3x10 reps)',
            'Équilibre Y. Ouverts': 'Single leg stance yeux ouverts côté faible (4x30s)',
            'Équilibre Y. Fermés': 'Progression: ouverts → semi-fermés → fermés côté faible'
        };
        return exercises[testName] || 'Travail unilatéral côté faible (consulter coach)';
    };
    
    // Récupérer les derniers tests de l'historique
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Fonction pour récupérer la dernière valeur d'un test depuis l'historique
    const getTestValueFromHistory = (testKey, qualityKey) => {
        // Trouver les tests de cette qualité, triés du plus récent au plus ancien
        const qualityTests = history
            .filter(h => h.quality === qualityKey)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Chercher dans chaque test jusqu'à trouver une valeur
        for (const test of qualityTests) {
            if (test.tests && test.tests[testKey] !== undefined && test.tests[testKey] !== null) {
                const value = test.tests[testKey];
                // Si c'est un test bilatéral, prendre la moyenne
                if (typeof value === 'object' && (value.left !== null || value.right !== null)) {
                    const left = value.left || 0;
                    const right = value.right || 0;
                    const count = (value.left !== null ? 1 : 0) + (value.right !== null ? 1 : 0);
                    return count > 0 ? (left + right) / count : null;
                }
                return value;
            }
        }
        return null;
    };
    
    const allTestsData = [
        {key: 'squat', name: 'Squat 1RM', value: getTestValueFromHistory('squat', 'force'), unit: 'kg', category: 'Force'},
        {key: 'deadlift', name: 'Deadlift 1RM', value: getTestValueFromHistory('deadlift', 'force'), unit: 'kg', category: 'Force'},
        {key: 'bench', name: 'Développé Couché 1RM', value: getTestValueFromHistory('bench', 'force'), unit: 'kg', category: 'Force'},
        {key: 'pullup', name: 'Tractions 1RM', value: getTestValueFromHistory('pullup', 'force'), unit: 'kg', category: 'Force'},
        {key: 'shuttle', name: 'Navette 5x10m', value: getTestValueFromHistory('shuttle', 'vitesse'), unit: 's', category: 'Vitesse'},
        {key: 'driverspeed', name: 'Vitesse Driver', value: getTestValueFromHistory('driverspeed', 'vitesse'), unit: 'mph', category: 'Vitesse'},
        {key: 'vma', name: 'VMA', value: getTestValueFromHistory('vma', 'endurance'), unit: 'km/h', category: 'Endurance'},
        {key: 'maxpushups', name: 'Max Pompes 1min', value: getTestValueFromHistory('maxpushups', 'endurance'), unit: 'reps', category: 'Endurance'},
        {key: 'maxsquats', name: 'Max Squats 1min', value: getTestValueFromHistory('maxsquats', 'endurance'), unit: 'reps', category: 'Endurance'},
        {key: 'vertjump', name: 'Détente Verticale', value: getTestValueFromHistory('vertjump', 'explosivite'), unit: 'cm', category: 'Explosivité'},
        {key: 'horizjump', name: 'Détente Horizontale', value: getTestValueFromHistory('horizjump', 'explosivite'), unit: 'cm', category: 'Explosivité'},
        {key: 'medballchest', name: 'MedBall Chest', value: getTestValueFromHistory('medballchest', 'explosivite'), unit: 'm', category: 'Explosivité'},
        {key: 'rkcplank', name: 'RKC Plank', value: getTestValueFromHistory('rkcplank', 'core'), unit: 's', category: 'Core'},
        {key: 'mcgillflexor', name: 'McGill Flexor', value: getTestValueFromHistory('mcgillflexor', 'core'), unit: 's', category: 'Core'},
        {key: 'mcgillextensor', name: 'McGill Extensor', value: getTestValueFromHistory('mcgillextensor', 'core'), unit: 's', category: 'Core'},
        {key: 'standreach', name: 'Stand & Reach', value: getTestValueFromHistory('standreach', 'mobilite'), unit: 'cm', category: 'Mobilité'}
    ];
    
    const testsWithScores = allTestsData
        .filter(t => t.value !== null && !isNaN(t.value))
        .map(t => ({
            ...t,
            score: calculateScore20(t.key, t.value),
            badge: getBadgeLabel(calculateScore20(t.key, t.value))
        }))
        .filter(t => t.score !== null);
    
    testsWithScores.sort((a, b) => b.score - a.score);
    
    const top5 = testsWithScores.slice(0, 5);
    const bottom5 = testsWithScores.slice(-5).reverse();
    
    // Fonction pour récupérer valeurs bilatérales de l'historique
    const getBilateralFromHistory = (testKey, qualityKey) => {
        const qualityTests = history
            .filter(h => h.quality === qualityKey)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (const test of qualityTests) {
            if (test.tests && test.tests[testKey]) {
                const value = test.tests[testKey];
                if (typeof value === 'object') {
                    return {
                        left: value.left !== null && value.left !== undefined ? value.left : null,
                        right: value.right !== null && value.right !== undefined ? value.right : null
                    };
                }
            }
        }
        return {left: null, right: null};
    };
    
    // Calculer asymétries
    const bilateralTests = [
        {name: 'Wall Sit', ...getBilateralFromHistory('wallsit', 'endurance'), unit: 's'},
        {name: 'CMJ Unilatéral', ...getBilateralFromHistory('cmjunilateral', 'explosivite'), unit: 'cm'},
        {name: 'Side Plank', ...getBilateralFromHistory('sideplank', 'core'), unit: 's'},
        {name: 'Rotation Thoracique', ...getBilateralFromHistory('thoracic', 'mobilite'), unit: '°'},
        {name: 'Hip Rotation Int', ...getBilateralFromHistory('hipint', 'mobilite'), unit: '°'},
        {name: 'Hip Rotation Ext', ...getBilateralFromHistory('hipext', 'mobilite'), unit: '°'},
        {name: 'Dorsiflexion', ...getBilateralFromHistory('ankle', 'mobilite'), unit: 'cm'},
        {name: 'Équilibre Y. Ouverts', ...getBilateralFromHistory('balanceopen', 'equilibre'), unit: 's'},
        {name: 'Équilibre Y. Fermés', ...getBilateralFromHistory('balanceclosed', 'equilibre'), unit: 's'}
    ];
    
    const asymmetries = bilateralTests
        .filter(t => t.left && t.right && !isNaN(t.left) && !isNaN(t.right))
        .map(t => {
            const weaker = Math.min(t.left, t.right);
            const stronger = Math.max(t.left, t.right);
            const lsi = (weaker / stronger) * 100;
            const weakerSide = t.left < t.right ? 'G' : 'D';
            return {...t, lsi, weakerSide};
        })
        .filter(t => t.lsi < 90)
        .sort((a, b) => a.lsi - b.lsi);
    
    // Générer le document HTML complet
    const bilanWindow = window.open('', '_blank');
    bilanWindow.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilan Performance Golf Complet - ${currentPlayer.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
            .page { page-break-after: always; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .page {
            background: white;
            max-width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1a4d2e;
        }
        
        .header-left h1 {
            color: #1a4d2e;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header-left p {
            color: #666;
            font-size: 14px;
        }
        
        .header-right {
            text-align: right;
        }
        
        .profile-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        
        .info-label {
            font-weight: 600;
            color: #1a4d2e;
        }
        
        .radar-container {
            max-width: 500px;
            margin: 30px auto;
        }
        
        .summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
        }
        
        .summary-box {
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .summary-box.strong {
            background: #e8f5e9;
            border-color: #27ae60;
        }
        
        .summary-box.weak {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .summary-box h3 {
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .summary-box ul {
            list-style: none;
            padding-left: 0;
        }
        
        .summary-box li {
            padding: 5px 0;
            font-size: 14px;
        }
        
        .moyenne-generale {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #1a4d2e 0%, #27ae60 100%);
            color: white;
            border-radius: 10px;
        }
        
        .moyenne-generale h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .moyenne-generale .score {
            font-size: 48px;
            font-weight: 700;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            color: #1a4d2e;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        th {
            background: #1a4d2e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            display: inline-block;
        }
        
        .badge-elite { background: #3498db; }
        .badge-bon { background: #27ae60; }
        .badge-moyen { background: #f39c12; }
        .badge-faible { background: #e74c3c; }
        
        .lsi-box {
            padding: 10px;
            margin-bottom: 10px;
            border-left: 4px solid;
            border-radius: 4px;
        }
        
        .lsi-important {
            background: #ffebee;
            border-color: #e74c3c;
        }
        
        .lsi-modere {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .actions {
            margin-top: 30px;
            text-align: center;
            position: sticky;
            bottom: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        
        .btn {
            padding: 12px 24px;
            margin: 0 10px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #1a4d2e;
            color: white;
        }
        
        .btn-primary:hover {
            background: #27ae60;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
        
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #e8f5e9;
            border-left: 4px solid #27ae60;
            color: #2e7d32;
        }
        
        .alert-warning {
            background: #fff3e0;
            border-left: 4px solid #f39c12;
            color: #e65100;
        }
        
        .page-number {
            text-align: center;
            color: #999;
            font-size: 14px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <!-- PAGE 1: VUE D'ENSEMBLE -->
    <div class="page">
        <div class="header">
            <div class="header-left">
                <h1>BILAN PERFORMANCE GOLF</h1>
                <p>Évaluation Physique Complète - Page 1/2</p>
            </div>
            <div class="header-right">
                <p><strong>${new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}</strong></p>
            </div>
        </div>
        
        <div class="profile-info">
            <div>
                <div class="info-item">
                    <span class="info-label">Nom</span>
                    <span>${currentPlayer.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Sexe</span>
                    <span>${currentPlayer.gender === 'M' ? 'Homme' : 'Femme'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Âge</span>
                    <span>${currentPlayer.age}</span>
                </div>
            </div>
            <div>
                <div class="info-item">
                    <span class="info-label">Poids</span>
                    <span>${currentPlayer.weight} kg</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Taille</span>
                    <span>${currentPlayer.height} cm</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Niveau</span>
                    <span>Handicap ${currentPlayer.handicap || 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <div class="moyenne-generale">
            <h2>Note Globale</h2>
            <div class="score">${moyenneGenerale.toFixed(1)}<span style="font-size: 24px;">/20</span></div>
        </div>
        
        <div class="radar-container">
            <canvas id="radarChart"></canvas>
        </div>
        
        <div class="summary">
            <div class="summary-box strong">
                <h3>💪 Points Forts</h3>
                <ul>
                    ${pointsForts.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
            <div class="summary-box weak">
                <h3>📈 À Améliorer</h3>
                <ul>
                    ${pointsFaibles.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="page-number">Page 1/2</div>
    </div>
    
    <!-- PAGE 2: RÉSULTATS DÉTAILLÉS -->
    <div class="page">
        <div class="header">
            <h1>RÉSULTATS DÉTAILLÉS & ASYMÉTRIES</h1>
            <p>${currentPlayer.name} - Page 2/2</p>
        </div>
        
        <div class="section">
            <h2>🏆 Top 5 Performances</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${top5.length > 0 ? top5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="text-align: center; color: #999;">Aucun test complété</td></tr>'}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>📈 Top 5 À Améliorer</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${bottom5.length > 0 ? bottom5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('') : '<tr><td colspan="4" style="text-align: center; color: #999;">Aucun test complété</td></tr>'}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>⚖️ Bilan LSI - Asymétries Détectées</h2>
            ${asymmetries.length === 0 ? `
                <div class="alert alert-success">
                    <strong>✅ Excellent !</strong> Aucune asymétrie significative détectée (tous les LSI ≥ 90%)
                </div>
            ` : `
                <div class="alert alert-warning">
                    <strong>⚠️ ${asymmetries.length} asymétrie(s) détectée(s)</strong>
                </div>
                ${asymmetries.map(a => `
                    <div class="lsi-box ${a.lsi < 85 ? 'lsi-important' : 'lsi-modere'}">
                        <strong>${a.name}</strong>: 
                        G ${a.left.toFixed(1)}${a.unit} | D ${a.right.toFixed(1)}${a.unit} 
                        → LSI: <strong>${a.lsi.toFixed(1)}%</strong>
                        ${a.lsi < 85 ? '🔴 Asymétrie importante' : '⚠️ Asymétrie modérée'}
                        - Renforcer côté ${a.weakerSide}
                    </div>
                `).join('')}
            `}
        </div>
        
        <div class="page-number">Page 2/3</div>
    </div>
    
    <!-- PAGE 3: RECOMMANDATIONS & PLAN D'ACTION -->
    <div class="page">
        <div class="header">
            <h1>RECOMMANDATIONS & PLAN D'ACTION</h1>
            <p>${currentPlayer.name} - Page 3/3</p>
        </div>
        
        <div class="section">
            <h2>🎯 Priorités d'Entraînement</h2>
            ${pointsFaibles.length > 0 ? `
                <p style="margin-bottom: 20px; color: #666;">Basé sur votre évaluation, voici les qualités physiques à prioriser pour optimiser vos performances au golf :</p>
                ${pointsFaibles.map((q, idx) => `
                    <div style="background: ${idx === 0 ? '#ffebee' : '#fff3e0'}; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid ${idx === 0 ? '#e74c3c' : '#f39c12'};">
                        <h3 style="color: #333; margin-bottom: 10px;">
                            ${idx === 0 ? '🔴 PRIORITÉ HAUTE' : '⚠️ PRIORITÉ MOYENNE'} : ${q.name} (${q.score.toFixed(1)}/20)
                        </h3>
                        <p style="margin-bottom: 10px; color: #555;"><strong>Exercices recommandés :</strong></p>
                        <ul style="margin-left: 20px; color: #555;">
                            ${getExercisesForQuality(q.name).map(ex => `<li>${ex}</li>`).join('')}
                        </ul>
                        <p style="margin-top: 10px; color: #555;"><strong>Fréquence :</strong> ${getFrequencyForQuality(q.name)}</p>
                    </div>
                `).join('')}
            ` : '<p style="color: #27ae60;">✅ Excellent ! Toutes vos qualités physiques sont dans la moyenne ou au-dessus.</p>'}
        </div>
        
        ${asymmetries.length > 0 ? `
            <div class="section">
                <h2>⚖️ Correction des Asymétries</h2>
                <p style="margin-bottom: 20px; color: #666;">Les asymétries détectées doivent être corrigées pour réduire les risques de blessure et optimiser la performance :</p>
                ${asymmetries.slice(0, 3).map(a => `
                    <div style="background: #ffebee; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #e74c3c;">
                        <h4 style="color: #333; margin-bottom: 8px;">${a.name} - LSI ${a.lsi.toFixed(1)}%</h4>
                        <p style="margin: 5px 0; color: #555;"><strong>Déséquilibre :</strong> Gauche ${a.left.toFixed(1)}${a.unit} | Droite ${a.right.toFixed(1)}${a.unit}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Action :</strong> Renforcer prioritairement le côté ${a.weakerSide === 'G' ? 'GAUCHE' : 'DROIT'}</p>
                        <p style="margin: 5px 0; color: #555;"><strong>Exercice :</strong> ${getCorrectionExercise(a.name, a.weakerSide)}</p>
                    </div>
                `).join('')}
            </div>
        ` : ''}
        
        <div class="section">
            <h2>📅 Programme Structuré 4-8 Semaines</h2>
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #1a4d2e; margin-bottom: 15px;">Phase 1 : Fondations (Semaines 1-2)</h3>
                <ul style="margin-left: 20px; color: #555;">
                    <li><strong>Focus :</strong> Correction asymétries + Mobilité de base</li>
                    <li><strong>Volume :</strong> 3-4 séances/semaine (30-40 min)</li>
                    <li><strong>Intensité :</strong> Modérée (60-70% capacité max)</li>
                    ${pointsFaibles.length > 0 ? `<li><strong>Priorité :</strong> ${pointsFaibles[0].name} - exercices de base</li>` : ''}
                </ul>
            </div>
            
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <h3 style="color: #1565c0; margin-bottom: 15px;">Phase 2 : Progression (Semaines 3-4)</h3>
                <ul style="margin-left: 20px; color: #555;">
                    <li><strong>Focus :</strong> Augmentation intensité + Intégration gestes golf</li>
                    <li><strong>Volume :</strong> 4-5 séances/semaine (40-50 min)</li>
                    <li><strong>Intensité :</strong> Moyenne-Haute (70-80% capacité max)</li>
                    <li><strong>Tests :</strong> Réévaluation partielle fin semaine 4</li>
                </ul>
            </div>
            
            <div style="background: #fff3e0; padding: 20px; border-radius: 8px;">
                <h3 style="color: #e65100; margin-bottom: 15px;">Phase 3 : Performance (Semaines 5-8) - Optionnel</h3>
                <ul style="margin-left: 20px; color: #555;">
                    <li><strong>Focus :</strong> Optimisation + Spécificité golf</li>
                    <li><strong>Volume :</strong> 4 séances/semaine (45-60 min)</li>
                    <li><strong>Intensité :</strong> Haute (80-90% capacité max)</li>
                    <li><strong>Tests :</strong> Réévaluation complète fin semaine 8</li>
                </ul>
            </div>
        </div>
        
        <div class="section">
            <h2>🎯 Objectifs Chiffrés (8 semaines)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Qualité</th>
                        <th>Actuel</th>
                        <th>Objectif</th>
                        <th>Progression</th>
                    </tr>
                </thead>
                <tbody>
                    ${pointsFaibles.map(q => {
                        const current = q.score;
                        const target = Math.min(20, current + (current < 10 ? 3 : 2));
                        const progress = ((target - current) / current * 100).toFixed(0);
                        return `
                            <tr>
                                <td><strong>${q.name}</strong></td>
                                <td>${current.toFixed(1)}/20</td>
                                <td>${target.toFixed(1)}/20</td>
                                <td style="color: #27ae60;"><strong>+${progress}%</strong></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="color: #1a4d2e; margin-bottom: 10px;">💡 Conseils Généraux</h3>
            <ul style="margin-left: 20px; color: #555;">
                <li><strong>Échauffement :</strong> 10 min minimum avant chaque séance (mobilité dynamique)</li>
                <li><strong>Récupération :</strong> Au moins 1 jour de repos complet par semaine</li>
                <li><strong>Hydratation :</strong> 2-3L d'eau par jour, plus pendant l'effort</li>
                <li><strong>Sommeil :</strong> 7-9h par nuit pour optimiser la récupération</li>
                <li><strong>Nutrition :</strong> Protéines 1.6-2g/kg/jour pour la récupération musculaire</li>
                <li><strong>Suivi :</strong> Réévaluer tous les tests après 4 et 8 semaines</li>
            </ul>
        </div>
        
        <div class="page-number">Page 3/3</div>
    </div>
    
    <div class="actions no-print">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / Sauvegarder PDF</button>
        <button class="btn btn-secondary" onclick="window.close()">✖️ Fermer</button>
    </div>
    
    <script>
        const ctx = document.getElementById('radarChart');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Force', 'Vitesse', 'Endurance', 'Explosivité', 'Core', 'Mobilité', 'Équilibre'],
                datasets: [{
                    label: 'Performance /20',
                    data: [
                        ${scores.force?.toFixed(1) || 0},
                        ${scores.vitesse?.toFixed(1) || 0},
                        ${scores.endurance?.toFixed(1) || 0},
                        ${scores.explosivite?.toFixed(1) || 0},
                        ${scores.core?.toFixed(1) || 0},
                        ${scores.mobilite?.toFixed(1) || 0},
                        ${scores.equilibre?.toFixed(1) || 0}
                    ],
                    backgroundColor: 'rgba(26, 77, 46, 0.2)',
                    borderColor: 'rgba(26, 77, 46, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(26, 77, 46, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(26, 77, 46, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    </script>
</body>
</html>
    `);
    bilanWindow.document.close();
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

// ==================== AFFICHAGE DES BARÈMES ====================
function displayBaremes() {
    if (!currentPlayer) return;
    
    const sexe = currentPlayer.gender || currentPlayer.sexe; // 'M' ou 'F'
    const ageValue = currentPlayer.age;
    const niveau = currentPlayer.handicap || currentPlayer.niveau;
    
    // Gérer l'âge (peut être un nombre ou une string comme '40-50')
    let age;
    if (typeof ageValue === 'string') {
        // Si c'est une string genre '40-50', prendre le milieu
        if (ageValue.includes('-')) {
            const [min, max] = ageValue.split('-').map(n => parseInt(n));
            age = (min + max) / 2;
        } else if (ageValue === '<12') {
            age = 10;
        } else if (ageValue === '12-14') {
            age = 13;
        } else if (ageValue === '14-17') {
            age = 15.5;
        } else {
            age = parseInt(ageValue) || 25;
        }
    } else {
        age = ageValue;
    }
    
    // Déterminer la catégorie d'âge
    let ageCategory;
    if (age < 12) ageCategory = '<12';
    else if (age >= 12 && age < 14) ageCategory = '12-14';
    else if (age >= 14 && age < 18) ageCategory = '14-17';
    else ageCategory = '18+';
    
    // Déterminer le niveau pour les 18+
    let playerLevel = 'pro'; // Par défaut
    if (ageCategory === '18+' && niveau) {
        const handicap = parseInt(niveau);
        if (!isNaN(handicap)) {
            if (handicap >= 8) playerLevel = 'amateur_8+';
            else if (handicap >= 0 && handicap <= 7) playerLevel = 'amateur_0-7';
            else if (handicap < 0) playerLevel = 'amateur_negatif';
        }
    }
    
    console.log('📊 Affichage barèmes:', {sexe, age, ageCategory, niveau, playerLevel});
    
    // Liste des tests avec leurs IDs
    const testsToDisplay = [
        { testKey: 'squat', inputId: 'test-squat-1rm' },
        { testKey: 'deadlift', inputId: 'test-deadlift-1rm' },
        { testKey: 'bench', inputId: 'test-bench-1rm' },
        { testKey: 'pullup', inputId: 'test-pullup-1rm' },
        { testKey: 'shuttle', inputId: 'test-shuttle' },
        { testKey: 'driverspeed', inputId: 'test-driverspeed' },
        { testKey: 'vma', inputId: 'test-vma' },
        { testKey: 'maxpushups', inputId: 'test-maxpushups' },
        { testKey: 'maxsquats', inputId: 'test-maxsquats' },
        { testKey: 'wallsit', inputId: 'test-wallsit-left' },
        { testKey: 'vertjump', inputId: 'test-vertjump' },
        { testKey: 'horizjump', inputId: 'test-horizjump' },
        { testKey: 'medballchest', inputId: 'test-medballchest' },
        { testKey: 'medballrotation', inputId: 'test-medballrotation-left' },
        { testKey: 'cmjunilateral', inputId: 'test-cmj-left' },
        { testKey: 'rkcplank', inputId: 'test-rkcplank' },
        { testKey: 'sideplank', inputId: 'test-sideplank-left' },
        { testKey: 'birddog', inputId: 'test-birddog' },
        { testKey: 'mcgillflexor', inputId: 'test-mcgillflexor' },
        { testKey: 'mcgillextensor', inputId: 'test-mcgillextensor' },
        { testKey: 'standreach', inputId: 'test-standreach' },
        { testKey: 'thoracic', inputId: 'test-thoracic-left' },
        { testKey: 'hipint', inputId: 'test-hipint-left' },
        { testKey: 'hipext', inputId: 'test-hipext-left' },
        { testKey: 'ankle', inputId: 'test-ankle-left' },
        { testKey: 'shoulder', inputId: 'test-shoulder' },
        { testKey: 'balanceopen', inputId: 'test-balanceopen-left' },
        { testKey: 'balanceclosed', inputId: 'test-balanceclosed-left' }
    ];
    
    testsToDisplay.forEach(test => {
        const inputElement = document.getElementById(test.inputId);
        if (!inputElement) return;
        
        // Supprimer ancien barème s'il existe
        const parent = inputElement.closest('.test-item, .test-item-advanced, .bilateral-test');
        if (!parent) return;
        
        const oldBareme = parent.querySelector('.bareme-display');
        if (oldBareme) oldBareme.remove();
        
        // Récupérer les barèmes
        const baremeData = BAREMES[test.testKey];
        if (!baremeData) return;
        
        let baremeValues;
        try {
            const sexeData = baremeData.levels[sexe];
            if (!sexeData) return;
            
            if (ageCategory === '18+') {
                const levelData = sexeData[ageCategory];
                if (!levelData || !levelData[playerLevel]) return;
                baremeValues = levelData[playerLevel];
            } else {
                baremeValues = sexeData[ageCategory];
            }
            
            if (!baremeValues || baremeValues.length !== 4) return;
        } catch (e) {
            return;
        }
        
        // Créer l'affichage du barème
        const baremeDiv = document.createElement('div');
        baremeDiv.className = 'bareme-display';
        baremeDiv.style.cssText = 'font-size: 0.85rem; color: #666; margin-top: 0.3rem; padding: 0.3rem 0.5rem; background: #f8f9fa; border-radius: 4px;';
        
        const unit = baremeData.unit;
        const labels = ['Faible', 'Moyen', 'Bon', 'Élite'];
        const colors = ['#e74c3c', '#f39c12', '#27ae60', '#3498db'];
        
        let baremeHTML = '📊 <strong>Barèmes:</strong> ';
        baremeValues.forEach((val, idx) => {
            baremeHTML += `<span style="color: ${colors[idx]}; font-weight: 600;">${labels[idx]} ${val}${unit === 'ratio' ? '' : unit}</span>`;
            if (idx < 3) baremeHTML += ' | ';
        });
        
        baremeDiv.innerHTML = baremeHTML;
        parent.appendChild(baremeDiv);
        
        // Ajouter un écouteur pour afficher le badge quand l'utilisateur tape une valeur
        inputElement.addEventListener('input', function() {
            updateBadge(test.testKey, inputElement, baremeData, baremeValues, sexe, ageCategory, playerLevel);
        });
        
        // Si le champ a déjà une valeur, afficher le badge
        if (inputElement.value) {
            updateBadge(test.testKey, inputElement, baremeData, baremeValues, sexe, ageCategory, playerLevel);
        }
    });
}

// ==================== AFFICHAGE DES BADGES ====================
function updateBadge(testKey, inputElement, baremeData, baremeValues, sexe, ageCategory, playerLevel) {
    if (!currentPlayer) return;
    
    const value = parseFloat(inputElement.value);
    if (isNaN(value) || value <= 0) {
        // Supprimer le badge si pas de valeur
        const existingBadge = inputElement.parentElement.querySelector('.performance-badge');
        if (existingBadge) existingBadge.remove();
        return;
    }
    
    // Pour les tests de Force, calculer le ratio
    let finalValue = value;
    if (baremeData.unit === 'ratio' && currentPlayer.weight) {
        finalValue = value / currentPlayer.weight;
    }
    
    // Déterminer le niveau
    const higherIsBetter = baremeData.higherIsBetter;
    let level = 0;
    let levelLabel = 'Faible';
    let levelColor = '#e74c3c';
    
    if (higherIsBetter) {
        if (finalValue >= baremeValues[3]) {
            level = 3;
            levelLabel = 'Élite';
            levelColor = '#3498db';
        } else if (finalValue >= baremeValues[2]) {
            level = 2;
            levelLabel = 'Bon';
            levelColor = '#27ae60';
        } else if (finalValue >= baremeValues[1]) {
            level = 1;
            levelLabel = 'Moyen';
            levelColor = '#f39c12';
        }
    } else {
        // Pour les tests où plus bas = mieux (ex: navette)
        if (finalValue <= baremeValues[3]) {
            level = 3;
            levelLabel = 'Élite';
            levelColor = '#3498db';
        } else if (finalValue <= baremeValues[2]) {
            level = 2;
            levelLabel = 'Bon';
            levelColor = '#27ae60';
        } else if (finalValue <= baremeValues[1]) {
            level = 1;
            levelLabel = 'Moyen';
            levelColor = '#f39c12';
        }
    }
    
    // Créer ou mettre à jour le badge
    let badge = inputElement.parentElement.querySelector('.performance-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'performance-badge';
        badge.style.cssText = 'margin-left: 0.5rem; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: white;';
        inputElement.parentElement.appendChild(badge);
    }
    
    badge.style.backgroundColor = levelColor;
    
    // Afficher le ratio pour les tests de force
    if (baremeData.unit === 'ratio' && currentPlayer.weight) {
        badge.textContent = `${levelLabel} (${finalValue.toFixed(2)})`;
    } else {
        badge.textContent = levelLabel;
    }
}

// ==================== CALCUL LSI (LIMB SYMMETRY INDEX) ====================
function calculateLSI(leftInputId, rightInputId, testName, unit = '') {
    const leftInput = document.getElementById(leftInputId);
    const rightInput = document.getElementById(rightInputId);
    
    if (!leftInput || !rightInput) return;
    
    const leftValue = parseFloat(leftInput.value);
    const rightValue = parseFloat(rightInput.value);
    
    // Supprimer l'ancien LSI s'il existe
    const parent = leftInput.closest('.bilateral-test, .test-item');
    if (!parent) return;
    
    const oldLSI = parent.querySelector('.lsi-display');
    if (oldLSI) oldLSI.remove();
    
    // Si une des deux valeurs manque, ne rien afficher
    if (isNaN(leftValue) || isNaN(rightValue) || leftValue <= 0 || rightValue <= 0) {
        return;
    }
    
    // Calculer le LSI (côté faible / côté fort × 100)
    const weaker = Math.min(leftValue, rightValue);
    const stronger = Math.max(leftValue, rightValue);
    const lsi = (weaker / stronger) * 100;
    const difference = Math.abs(leftValue - rightValue);
    const percentDiff = ((difference / stronger) * 100).toFixed(1);
    
    // Déterminer quel côté est plus faible
    const weakerSide = leftValue < rightValue ? 'gauche' : 'droite';
    
    // Déterminer l'interprétation
    let interpretation = '';
    let color = '';
    let bgColor = '';
    let recommendation = '';
    
    if (lsi >= 90) {
        interpretation = '✅ Symétrique';
        color = '#27ae60';
        bgColor = '#e8f5e9';
        recommendation = 'Bon équilibre musculaire. Maintenir le travail bilatéral.';
    } else if (lsi >= 85) {
        interpretation = '⚠️ Asymétrie modérée';
        color = '#f39c12';
        bgColor = '#fff3e0';
        recommendation = `Renforcer le côté ${weakerSide}. Ajouter des exercices unilatéraux (2-3 séries supplémentaires côté faible).`;
    } else {
        interpretation = '🔴 Asymétrie importante';
        color = '#e74c3c';
        bgColor = '#ffebee';
        recommendation = `PRIORITÉ: Renforcement ${weakerSide}. Risque de blessure accru. Travail unilatéral intensif recommandé.`;
    }
    
    // Créer l'affichage du LSI
    const lsiDiv = document.createElement('div');
    lsiDiv.className = 'lsi-display';
    lsiDiv.style.cssText = `
        margin-top: 0.5rem;
        padding: 0.6rem;
        background: ${bgColor};
        border-left: 3px solid ${color};
        border-radius: 4px;
        font-size: 0.85rem;
        line-height: 1.5;
    `;
    
    lsiDiv.innerHTML = `
        <div style="font-weight: 700; color: ${color}; margin-bottom: 0.3rem;">
            ⚖️ LSI: ${lsi.toFixed(1)}% - ${interpretation} (${percentDiff}% de différence)
        </div>
        <div style="color: #555; font-size: 0.8rem;">
            💪 ${recommendation}
        </div>
    `;
    
    parent.appendChild(lsiDiv);
}

// Ajouter les écouteurs pour tous les tests bilatéraux
function setupLSICalculations() {
    const bilateralTests = [
        { left: 'test-legext-left', right: 'test-legext-right', name: 'Leg Extension Unilatéral', unit: 'kg' },
        { left: 'test-press-left', right: 'test-press-right', name: 'Leg Press Unilatéral', unit: 'kg' },
        { left: 'test-wallsit-left', right: 'test-wallsit-right', name: 'Wall Sit', unit: 's' },
        { left: 'test-cmj-left', right: 'test-cmj-right', name: 'CMJ Unilatéral', unit: 'cm' },
        { left: 'test-sideplank-left', right: 'test-sideplank-right', name: 'Side Plank', unit: 's' },
        { left: 'test-thoracic-left', right: 'test-thoracic-right', name: 'Rotation Thoracique', unit: '°' },
        { left: 'test-hipint-left', right: 'test-hipint-right', name: 'Hip Rotation Interne', unit: '°' },
        { left: 'test-hipext-left', right: 'test-hipext-right', name: 'Hip Rotation Externe', unit: '°' },
        { left: 'test-ankle-left', right: 'test-ankle-right', name: 'Dorsiflexion', unit: 'cm' },
        { left: 'test-shoulder-left', right: 'test-shoulder-right', name: 'Apley Scratch', unit: 'cm' },
        { left: 'test-balanceopen-left', right: 'test-balanceopen-right', name: 'Équilibre Yeux Ouverts', unit: 's' },
        { left: 'test-balanceclosed-left', right: 'test-balanceclosed-right', name: 'Équilibre Yeux Fermés', unit: 's' },
        { left: 'test-medballrotation-left', right: 'test-medballrotation-right', name: 'MedBall Rotation', unit: 'm' }
    ];
    
    bilateralTests.forEach(test => {
        const leftInput = document.getElementById(test.left);
        const rightInput = document.getElementById(test.right);
        
        if (leftInput && rightInput) {
            leftInput.addEventListener('input', () => calculateLSI(test.left, test.right, test.name, test.unit));
            rightInput.addEventListener('input', () => calculateLSI(test.left, test.right, test.name, test.unit));
            
            // Calculer immédiatement si les valeurs existent déjà
            if (leftInput.value && rightInput.value) {
                calculateLSI(test.left, test.right, test.name, test.unit);
            }
        }
    });
}

// Appeler displayBaremes au chargement si profil existe
if (currentPlayer) {
    setTimeout(displayBaremes, 500);
}

// Initialiser les calculs LSI
setTimeout(setupLSICalculations, 600);

// ==================== SYSTÈME DE BILAN - PAGE 1 ====================

// Calcul de la note /20 pour un test selon sa position dans les barèmes
function calculateScore20(testKey, value) {
    if (!currentPlayer || !value || value <= 0) return null;
    
    const baremeData = BAREMES[testKey];
    if (!baremeData) return null;
    
    const sexe = currentPlayer.gender || 'M';
    const ageValue = currentPlayer.age;
    
    // Convertir l'âge
    let age;
    if (typeof ageValue === 'string') {
        if (ageValue === '<12') age = 10;
        else if (ageValue === '12-14') age = 13;
        else if (ageValue === '14-17') age = 15.5;
        else if (ageValue.includes('-')) {
            const [min, max] = ageValue.split('-').map(n => parseInt(n));
            age = (min + max) / 2;
        } else {
            age = parseInt(ageValue) || 25;
        }
    } else {
        age = ageValue;
    }
    
    // Déterminer catégorie d'âge
    let ageCategory;
    if (age < 12) ageCategory = '<12';
    else if (age >= 12 && age < 14) ageCategory = '12-14';
    else if (age >= 14 && age < 18) ageCategory = '14-17';
    else ageCategory = '18+';
    
    // Déterminer niveau pour 18+
    let playerLevel = 'pro';
    if (ageCategory === '18+' && currentPlayer.handicap) {
        const handicap = parseInt(currentPlayer.handicap);
        if (!isNaN(handicap)) {
            if (handicap >= 8) playerLevel = 'amateur_8+';
            else if (handicap >= 0 && handicap <= 7) playerLevel = 'amateur_0-7';
            else if (handicap < 0) playerLevel = 'amateur_negatif';
        }
    }
    
    // Récupérer les barèmes
    let baremeValues;
    try {
        const sexeData = baremeData.levels[sexe];
        if (!sexeData) return null;
        
        if (ageCategory === '18+') {
            const levelData = sexeData[ageCategory];
            if (!levelData || !levelData[playerLevel]) return null;
            baremeValues = levelData[playerLevel];
        } else {
            baremeValues = sexeData[ageCategory];
        }
        
        if (!baremeValues || baremeValues.length !== 4) return null;
    } catch (e) {
        return null;
    }
    
    // Calculer la valeur finale (ratio si nécessaire)
    let finalValue = value;
    if (baremeData.unit === 'ratio' && currentPlayer.weight) {
        finalValue = value / currentPlayer.weight;
    }
    
    const [faible, moyen, bon, elite] = baremeValues;
    const higherIsBetter = baremeData.higherIsBetter;
    
    let score;
    
    if (higherIsBetter) {
        if (finalValue >= elite) {
            score = 20;
        } else if (finalValue >= bon) {
            score = 15 + 5 * ((finalValue - bon) / (elite - bon));
        } else if (finalValue >= moyen) {
            score = 10 + 5 * ((finalValue - moyen) / (bon - moyen));
        } else if (finalValue >= faible) {
            score = 5 + 5 * ((finalValue - faible) / (moyen - faible));
        } else {
            score = 5 * (finalValue / faible);
        }
    } else {
        // Pour les tests où plus bas = mieux (navette, etc.)
        if (finalValue <= elite) {
            score = 20;
        } else if (finalValue <= bon) {
            score = 15 + 5 * ((bon - finalValue) / (bon - elite));
        } else if (finalValue <= moyen) {
            score = 10 + 5 * ((moyen - finalValue) / (moyen - bon));
        } else if (finalValue <= faible) {
            score = 5 + 5 * ((faible - finalValue) / (faible - moyen));
        } else {
            score = Math.max(0, 5 * (1 - (finalValue - faible) / faible));
        }
    }
    
    return Math.max(0, Math.min(20, score));
}

// Calculer les moyennes par qualité physique
function calculateQualityScores() {
    if (!currentPlayer) return null;
    
    // Récupérer l'historique
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Fonction pour récupérer la dernière valeur d'un test depuis l'historique
    const getTestValue = (testKey, qualityKey) => {
        const qualityTests = history
            .filter(h => h.quality === qualityKey)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        for (const test of qualityTests) {
            if (test.tests && test.tests[testKey] !== undefined && test.tests[testKey] !== null) {
                const value = test.tests[testKey];
                // Si c'est un test bilatéral, prendre la moyenne
                if (typeof value === 'object' && (value.left !== null || value.right !== null)) {
                    const left = value.left || 0;
                    const right = value.right || 0;
                    const count = (value.left !== null ? 1 : 0) + (value.right !== null ? 1 : 0);
                    return count > 0 ? (left + right) / count : null;
                }
                return value;
            }
        }
        return null;
    };
    
    // Moyenne d'un tableau de scores (ignore les nulls)
    const average = (scores) => {
        const validScores = scores.filter(s => s !== null && !isNaN(s));
        return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : null;
    };
    
    // FORCE (4 tests)
    const forceScores = [
        calculateScore20('squat', getTestValue('squat', 'force')),
        calculateScore20('deadlift', getTestValue('deadlift', 'force')),
        calculateScore20('bench', getTestValue('bench', 'force')),
        calculateScore20('pullup', getTestValue('pullup', 'force'))
    ];
    
    // VITESSE (2 tests)
    const vitesseScores = [
        calculateScore20('shuttle', getTestValue('shuttle', 'vitesse')),
        calculateScore20('driverspeed', getTestValue('driverspeed', 'vitesse'))
    ];
    
    // ENDURANCE (4 tests)
    const enduranceScores = [
        calculateScore20('vma', getTestValue('vma', 'endurance')),
        calculateScore20('maxpushups', getTestValue('maxpushups', 'endurance')),
        calculateScore20('maxsquats', getTestValue('maxsquats', 'endurance')),
        calculateScore20('wallsit', getTestValue('wallsit', 'endurance'))
    ];
    
    // EXPLOSIVITÉ (4 tests)
    const explosiviteScores = [
        calculateScore20('vertjump', getTestValue('vertjump', 'explosivite')),
        calculateScore20('horizjump', getTestValue('horizjump', 'explosivite')),
        calculateScore20('medballchest', getTestValue('medballchest', 'explosivite')),
        calculateScore20('medballrotation', getTestValue('medballrotation', 'explosivite'))
    ];
    
    // CORE & STABILITÉ (4 tests)
    const coreScores = [
        calculateScore20('rkcplank', getTestValue('rkcplank', 'core')),
        calculateScore20('sideplank', getTestValue('sideplank', 'core')),
        calculateScore20('mcgillflexor', getTestValue('mcgillflexor', 'core')),
        calculateScore20('mcgillextensor', getTestValue('mcgillextensor', 'core'))
    ];
    
    // MOBILITÉ (5 tests)
    const mobiliteScores = [
        calculateScore20('standreach', getTestValue('standreach', 'mobilite')),
        calculateScore20('thoracic', getTestValue('thoracic', 'mobilite')),
        calculateScore20('hipint', getTestValue('hipint', 'mobilite')),
        calculateScore20('hipext', getTestValue('hipext', 'mobilite')),
        calculateScore20('ankle', getTestValue('ankle', 'mobilite'))
    ];
    
    // ÉQUILIBRE (2 tests)
    const equilibreScores = [
        calculateScore20('balanceopen', getTestValue('balanceopen', 'equilibre')),
        calculateScore20('balanceclosed', getTestValue('balanceclosed', 'equilibre'))
    ];
    
    return {
        force: average(forceScores),
        vitesse: average(vitesseScores),
        endurance: average(enduranceScores),
        explosivite: average(explosiviteScores),
        core: average(coreScores),
        mobilite: average(mobiliteScores),
        equilibre: average(equilibreScores)
    };
}

// Générer le bilan Page 1
function generateBilanPage1() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const scores = calculateQualityScores();
    if (!scores) {
        alert('Erreur lors du calcul des scores');
        return;
    }
    
    // Calculer la moyenne générale
    const validScores = Object.values(scores).filter(s => s !== null && !isNaN(s));
    const moyenneGenerale = validScores.length > 0 
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length 
        : 0;
    
    // Identifier points forts et faibles
    const qualites = [
        {name: 'Force', score: scores.force},
        {name: 'Vitesse', score: scores.vitesse},
        {name: 'Endurance', score: scores.endurance},
        {name: 'Explosivité', score: scores.explosivite},
        {name: 'Core & Stabilité', score: scores.core},
        {name: 'Mobilité', score: scores.mobilite},
        {name: 'Équilibre', score: scores.equilibre}
    ].filter(q => q.score !== null);
    
    qualites.sort((a, b) => b.score - a.score);
    
    const pointsForts = qualites.slice(0, 2);
    const pointsFaibles = qualites.slice(-2).reverse();
    
    // Créer la page HTML
    const bilanWindow = window.open('', '_blank');
    bilanWindow.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilan Performance Golf - ${currentPlayer.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .page {
            background: white;
            max-width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1a4d2e;
        }
        
        .header-left h1 {
            color: #1a4d2e;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .header-left p {
            color: #666;
            font-size: 14px;
        }
        
        .header-right {
            text-align: right;
        }
        
        .profile-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        
        .info-label {
            font-weight: 600;
            color: #1a4d2e;
        }
        
        .radar-container {
            max-width: 500px;
            margin: 30px auto;
        }
        
        .summary {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 30px;
        }
        
        .summary-box {
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .summary-box.strong {
            background: #e8f5e9;
            border-color: #27ae60;
        }
        
        .summary-box.weak {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .summary-box h3 {
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .summary-box ul {
            list-style: none;
            padding-left: 0;
        }
        
        .summary-box li {
            padding: 5px 0;
            font-size: 14px;
        }
        
        .moyenne-generale {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #1a4d2e 0%, #27ae60 100%);
            color: white;
            border-radius: 10px;
        }
        
        .moyenne-generale h2 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .moyenne-generale .score {
            font-size: 48px;
            font-weight: 700;
        }
        
        .actions {
            margin-top: 30px;
            text-align: center;
        }
        
        .btn {
            padding: 12px 24px;
            margin: 0 10px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-primary {
            background: #1a4d2e;
            color: white;
        }
        
        .btn-primary:hover {
            background: #27ae60;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .btn-secondary:hover {
            background: #5a6268;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="header-left">
                <h1>BILAN PERFORMANCE GOLF</h1>
                <p>Évaluation Physique Complète</p>
            </div>
            <div class="header-right">
                <p><strong>${new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'})}</strong></p>
            </div>
        </div>
        
        <div class="profile-info">
            <div>
                <div class="info-item">
                    <span class="info-label">Nom</span>
                    <span>${currentPlayer.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Sexe</span>
                    <span>${currentPlayer.gender === 'M' ? 'Homme' : 'Femme'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Âge</span>
                    <span>${currentPlayer.age}</span>
                </div>
            </div>
            <div>
                <div class="info-item">
                    <span class="info-label">Poids</span>
                    <span>${currentPlayer.weight} kg</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Taille</span>
                    <span>${currentPlayer.height} cm</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Niveau</span>
                    <span>Handicap ${currentPlayer.handicap || 'N/A'}</span>
                </div>
            </div>
        </div>
        
        <div class="moyenne-generale">
            <h2>Note Globale</h2>
            <div class="score">${moyenneGenerale.toFixed(1)}<span style="font-size: 24px;">/20</span></div>
        </div>
        
        <div class="radar-container">
            <canvas id="radarChart"></canvas>
        </div>
        
        <div class="summary">
            <div class="summary-box strong">
                <h3>💪 Points Forts</h3>
                <ul>
                    ${pointsForts.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
            <div class="summary-box weak">
                <h3>📈 À Améliorer</h3>
                <ul>
                    ${pointsFaibles.map(q => `<li><strong>${q.name}:</strong> ${q.score.toFixed(1)}/20</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="actions no-print">
            <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / PDF</button>
            <button class="btn btn-secondary" onclick="window.close()">✖️ Fermer</button>
        </div>
    </div>
    
    <script>
        const ctx = document.getElementById('radarChart');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Force', 'Vitesse', 'Endurance', 'Explosivité', 'Core', 'Mobilité', 'Équilibre'],
                datasets: [{
                    label: 'Performance /20',
                    data: [
                        ${scores.force?.toFixed(1) || 0},
                        ${scores.vitesse?.toFixed(1) || 0},
                        ${scores.endurance?.toFixed(1) || 0},
                        ${scores.explosivite?.toFixed(1) || 0},
                        ${scores.core?.toFixed(1) || 0},
                        ${scores.mobilite?.toFixed(1) || 0},
                        ${scores.equilibre?.toFixed(1) || 0}
                    ],
                    backgroundColor: 'rgba(26, 77, 46, 0.2)',
                    borderColor: 'rgba(26, 77, 46, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(26, 77, 46, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(26, 77, 46, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 20,
                        ticks: {
                            stepSize: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    </script>
</body>
</html>
    `);
    bilanWindow.document.close();
}

// ==================== BILAN PAGE 2 - RÉSULTATS & ASYMÉTRIES ====================
function generateBilanPage2() {
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    // Récupérer tous les tests avec leurs scores
    const getTestValue = (id) => {
        const input = document.getElementById(id);
        return input ? parseFloat(input.value) : null;
    };
    
    const allTestsData = [
        // FORCE
        {key: 'squat', name: 'Squat 1RM', value: getTestValue('test-squat-1rm'), unit: 'kg', category: 'Force'},
        {key: 'deadlift', name: 'Deadlift 1RM', value: getTestValue('test-deadlift-1rm'), unit: 'kg', category: 'Force'},
        {key: 'bench', name: 'Développé Couché 1RM', value: getTestValue('test-bench-1rm'), unit: 'kg', category: 'Force'},
        {key: 'pullup', name: 'Tractions 1RM', value: getTestValue('test-pullup-1rm'), unit: 'kg', category: 'Force'},
        
        // VITESSE
        {key: 'shuttle', name: 'Navette 5x10m', value: getTestValue('test-shuttle'), unit: 's', category: 'Vitesse'},
        {key: 'driverspeed', name: 'Vitesse Driver', value: getTestValue('test-driverspeed'), unit: 'mph', category: 'Vitesse'},
        
        // ENDURANCE
        {key: 'vma', name: 'VMA', value: getTestValue('test-vma'), unit: 'km/h', category: 'Endurance'},
        {key: 'maxpushups', name: 'Max Pompes 1min', value: getTestValue('test-maxpushups'), unit: 'reps', category: 'Endurance'},
        {key: 'maxsquats', name: 'Max Squats 1min', value: getTestValue('test-maxsquats'), unit: 'reps', category: 'Endurance'},
        
        // EXPLOSIVITÉ
        {key: 'vertjump', name: 'Détente Verticale', value: getTestValue('test-vertjump'), unit: 'cm', category: 'Explosivité'},
        {key: 'horizjump', name: 'Détente Horizontale', value: getTestValue('test-horizjump'), unit: 'cm', category: 'Explosivité'},
        {key: 'medballchest', name: 'MedBall Chest', value: getTestValue('test-medballchest'), unit: 'm', category: 'Explosivité'},
        
        // CORE
        {key: 'rkcplank', name: 'RKC Plank', value: getTestValue('test-rkcplank'), unit: 's', category: 'Core'},
        {key: 'mcgillflexor', name: 'McGill Flexor', value: getTestValue('test-mcgillflexor'), unit: 's', category: 'Core'},
        {key: 'mcgillextensor', name: 'McGill Extensor', value: getTestValue('test-mcgillextensor'), unit: 's', category: 'Core'},
        
        // MOBILITÉ
        {key: 'standreach', name: 'Stand & Reach', value: getTestValue('test-standreach'), unit: 'cm', category: 'Mobilité'},
        {key: 'ankle', name: 'Dorsiflexion', value: getTestValue('test-ankle-left'), unit: 'cm', category: 'Mobilité'}
    ];
    
    // Calculer les scores et filtrer les tests complétés
    const testsWithScores = allTestsData
        .filter(t => t.value !== null && !isNaN(t.value))
        .map(t => ({
            ...t,
            score: calculateScore20(t.key, t.value),
            badge: getBadgeLabel(calculateScore20(t.key, t.value))
        }))
        .filter(t => t.score !== null);
    
    // Trier par score
    testsWithScores.sort((a, b) => b.score - a.score);
    
    const top5 = testsWithScores.slice(0, 5);
    const bottom5 = testsWithScores.slice(-5).reverse();
    
    // Calculer les asymétries LSI
    const bilateralTests = [
        {name: 'Wall Sit', left: getTestValue('test-wallsit-left'), right: getTestValue('test-wallsit-right'), unit: 's'},
        {name: 'CMJ Unilatéral', left: getTestValue('test-cmj-left'), right: getTestValue('test-cmj-right'), unit: 'cm'},
        {name: 'Side Plank', left: getTestValue('test-sideplank-left'), right: getTestValue('test-sideplank-right'), unit: 's'},
        {name: 'Rotation Thoracique', left: getTestValue('test-thoracic-left'), right: getTestValue('test-thoracic-right'), unit: '°'},
        {name: 'Hip Rotation Int', left: getTestValue('test-hipint-left'), right: getTestValue('test-hipint-right'), unit: '°'},
        {name: 'Hip Rotation Ext', left: getTestValue('test-hipext-left'), right: getTestValue('test-hipext-right'), unit: '°'},
        {name: 'Dorsiflexion', left: getTestValue('test-ankle-left'), right: getTestValue('test-ankle-right'), unit: 'cm'},
        {name: 'Équilibre Y. Ouverts', left: getTestValue('test-balanceopen-left'), right: getTestValue('test-balanceopen-right'), unit: 's'},
        {name: 'Équilibre Y. Fermés', left: getTestValue('test-balanceclosed-left'), right: getTestValue('test-balanceclosed-right'), unit: 's'}
    ];
    
    const asymmetries = bilateralTests
        .filter(t => t.left && t.right && !isNaN(t.left) && !isNaN(t.right))
        .map(t => {
            const weaker = Math.min(t.left, t.right);
            const stronger = Math.max(t.left, t.right);
            const lsi = (weaker / stronger) * 100;
            const weakerSide = t.left < t.right ? 'G' : 'D';
            return {...t, lsi, weakerSide};
        })
        .filter(t => t.lsi < 90)
        .sort((a, b) => a.lsi - b.lsi);
    
    // Générer la page HTML
    const bilanWindow = window.open('', '_blank');
    bilanWindow.document.write(`
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bilan Performance - Page 2 - ${currentPlayer.name}</title>
    <style>
        @media print {
            .no-print { display: none !important; }
            body { margin: 0; }
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        
        .page {
            background: white;
            max-width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #1a4d2e;
        }
        
        .header h1 {
            color: #1a4d2e;
            font-size: 28px;
            margin-bottom: 5px;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            color: #1a4d2e;
            font-size: 20px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        
        th {
            background: #1a4d2e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        tr:hover {
            background: #f8f9fa;
        }
        
        .badge {
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 700;
            color: white;
            display: inline-block;
        }
        
        .badge-elite { background: #3498db; }
        .badge-bon { background: #27ae60; }
        .badge-moyen { background: #f39c12; }
        .badge-faible { background: #e74c3c; }
        
        .lsi-box {
            padding: 10px;
            margin-bottom: 10px;
            border-left: 4px solid;
            border-radius: 4px;
        }
        
        .lsi-important {
            background: #ffebee;
            border-color: #e74c3c;
        }
        
        .lsi-modere {
            background: #fff3e0;
            border-color: #f39c12;
        }
        
        .actions {
            margin-top: 30px;
            text-align: center;
        }
        
        .btn {
            padding: 12px 24px;
            margin: 0 10px;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            cursor: pointer;
            font-weight: 600;
        }
        
        .btn-primary {
            background: #1a4d2e;
            color: white;
        }
        
        .btn-secondary {
            background: #6c757d;
            color: white;
        }
        
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
        }
        
        .alert-success {
            background: #e8f5e9;
            border-left: 4px solid #27ae60;
            color: #2e7d32;
        }
        
        .alert-warning {
            background: #fff3e0;
            border-left: 4px solid #f39c12;
            color: #e65100;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>RÉSULTATS DÉTAILLÉS & ASYMÉTRIES</h1>
            <p>${currentPlayer.name} - ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div class="section">
            <h2>🏆 Top 5 Performances</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${top5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>📈 Top 5 À Améliorer</h2>
            <table>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Résultat</th>
                        <th>Note /20</th>
                        <th>Niveau</th>
                    </tr>
                </thead>
                <tbody>
                    ${bottom5.map(t => `
                        <tr>
                            <td><strong>${t.name}</strong></td>
                            <td>${t.value.toFixed(1)} ${t.unit}</td>
                            <td><strong>${t.score.toFixed(1)}/20</strong></td>
                            <td><span class="badge badge-${t.badge.class}">${t.badge.label}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>⚖️ Bilan LSI - Asymétries Détectées</h2>
            ${asymmetries.length === 0 ? `
                <div class="alert alert-success">
                    <strong>✅ Excellent !</strong> Aucune asymétrie significative détectée (tous les LSI ≥ 90%)
                </div>
            ` : `
                <div class="alert alert-warning">
                    <strong>⚠️ ${asymmetries.length} asymétrie(s) détectée(s)</strong>
                </div>
                ${asymmetries.map(a => `
                    <div class="lsi-box ${a.lsi < 85 ? 'lsi-important' : 'lsi-modere'}">
                        <strong>${a.name}</strong>: 
                        G ${a.left.toFixed(1)}${a.unit} | D ${a.right.toFixed(1)}${a.unit} 
                        → LSI: <strong>${a.lsi.toFixed(1)}%</strong>
                        ${a.lsi < 85 ? '🔴 Asymétrie importante' : '⚠️ Asymétrie modérée'}
                        - Renforcer côté ${a.weakerSide}
                    </div>
                `).join('')}
            `}
        </div>
        
        <div class="actions no-print">
            <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimer / PDF</button>
            <button class="btn btn-secondary" onclick="window.close()">✖️ Fermer</button>
        </div>
    </div>
</body>
</html>
    `);
    bilanWindow.document.close();
}

// Helper function pour les badges
function getBadgeLabel(score) {
    if (score === null) return {label: 'N/A', class: 'faible'};
    if (score >= 17.5) return {label: 'Élite', class: 'elite'};
    if (score >= 12.5) return {label: 'Bon', class: 'bon'};
    if (score >= 7.5) return {label: 'Moyen', class: 'moyen'};
    return {label: 'Faible', class: 'faible'};
}

// ==================== SYSTÈME D'HISTORIQUE PAR QUALITÉ ====================

// Structure des tests par qualité
const QUALITY_TESTS = {
    force: {
        name: 'Force',
        icon: '💪',
        color: '#e74c3c',
        tests: [
            {key: 'squat', name: 'Squat 1RM', input: 'test-squat-1rm', unit: 'kg'},
            {key: 'deadlift', name: 'Deadlift 1RM', input: 'test-deadlift-1rm', unit: 'kg'},
            {key: 'bench', name: 'Développé Couché 1RM', input: 'test-bench-1rm', unit: 'kg'},
            {key: 'pullup', name: 'Tractions 1RM', input: 'test-pullup-1rm', unit: 'kg'},
            {key: 'legext', name: 'Leg Extension', inputs: ['test-legext-left', 'test-legext-right'], unit: 'kg', bilateral: true},
            {key: 'press', name: 'Leg Press', inputs: ['test-press-left', 'test-press-right'], unit: 'kg', bilateral: true}
        ]
    },
    vitesse: {
        name: 'Vitesse',
        icon: '⚡',
        color: '#f39c12',
        tests: [
            {key: 'shuttle', name: 'Navette 5x10m', input: 'test-shuttle', unit: 's'},
            {key: 'driverspeed', name: 'Vitesse Driver', input: 'test-driverspeed', unit: 'mph'}
        ]
    },
    endurance: {
        name: 'Endurance',
        icon: '🏃',
        color: '#3498db',
        tests: [
            {key: 'vma', name: 'VMA', input: 'test-vma', unit: 'km/h'},
            {key: 'maxpushups', name: 'Max Pompes 1min', input: 'test-maxpushups', unit: 'reps'},
            {key: 'maxsquats', name: 'Max Squats 1min', input: 'test-maxsquats', unit: 'reps'},
            {key: 'wallsit', name: 'Wall Sit', inputs: ['test-wallsit-left', 'test-wallsit-right'], unit: 's', bilateral: true}
        ]
    },
    explosivite: {
        name: 'Explosivité',
        icon: '🚀',
        color: '#9b59b6',
        tests: [
            {key: 'vertjump', name: 'Détente Verticale', input: 'test-vertjump', unit: 'cm'},
            {key: 'horizjump', name: 'Détente Horizontale', input: 'test-horizjump', unit: 'cm'},
            {key: 'medballchest', name: 'MedBall Chest', input: 'test-medballchest', unit: 'm'},
            {key: 'medballrotation', name: 'MedBall Rotation', inputs: ['test-medballrotation-left', 'test-medballrotation-right'], unit: 'm', bilateral: true},
            {key: 'cmjunilateral', name: 'CMJ Unilatéral', inputs: ['test-cmj-left', 'test-cmj-right'], unit: 'cm', bilateral: true}
        ]
    },
    core: {
        name: 'Core & Stabilité',
        icon: '🎯',
        color: '#1abc9c',
        tests: [
            {key: 'rkcplank', name: 'RKC Plank', input: 'test-rkcplank', unit: 's'},
            {key: 'sideplank', name: 'Side Plank', inputs: ['test-sideplank-left', 'test-sideplank-right'], unit: 's', bilateral: true},
            {key: 'mcgillflexor', name: 'McGill Flexor', input: 'test-mcgillflexor', unit: 's'},
            {key: 'mcgillextensor', name: 'McGill Extensor', input: 'test-mcgillextensor', unit: 's'},
            {key: 'birddog', name: 'Bird Dog', input: 'test-birddog', unit: 'score'}
        ]
    },
    mobilite: {
        name: 'Mobilité',
        icon: '🤸',
        color: '#27ae60',
        tests: [
            {key: 'standreach', name: 'Stand & Reach', input: 'test-standreach', unit: 'cm'},
            {key: 'thoracic', name: 'Rotation Thoracique', inputs: ['test-thoracic-left', 'test-thoracic-right'], unit: '°', bilateral: true},
            {key: 'hipint', name: 'Hip Rotation Interne', inputs: ['test-hipint-left', 'test-hipint-right'], unit: '°', bilateral: true},
            {key: 'hipext', name: 'Hip Rotation Externe', inputs: ['test-hipext-left', 'test-hipext-right'], unit: '°', bilateral: true},
            {key: 'ankle', name: 'Dorsiflexion', inputs: ['test-ankle-left', 'test-ankle-right'], unit: 'cm', bilateral: true},
            {key: 'shoulder', name: 'Apley Scratch', inputs: ['test-shoulder-left', 'test-shoulder-right'], unit: 'cm', bilateral: true}
        ]
    },
    equilibre: {
        name: 'Équilibre',
        icon: '⚖️',
        color: '#34495e',
        tests: [
            {key: 'balanceopen', name: 'Équilibre Y. Ouverts', inputs: ['test-balanceopen-left', 'test-balanceopen-right'], unit: 's', bilateral: true},
            {key: 'balanceclosed', name: 'Équilibre Y. Fermés', inputs: ['test-balanceclosed-left', 'test-balanceclosed-right'], unit: 's', bilateral: true}
        ]
    },
    tpi: {
        name: 'TPI Screening',
        icon: '🏌️',
        color: '#e67e22',
        tests: [
            {key: 'pelvic-tilt', name: 'Pelvic Tilt', input: 'tpi-pelvic-tilt', unit: ''},
            {key: 'pelvic-rotation', name: 'Pelvic Rotation', input: 'tpi-pelvic-rotation', unit: ''},
            {key: 'torso-rotation', name: 'Torso Rotation', input: 'tpi-torso-rotation', unit: ''},
            {key: 'lower-lat', name: 'Lower Quarter Lat', inputs: ['tpi-lower-lat-left', 'tpi-lower-lat-right'], unit: '', bilateral: true},
            {key: 'overhead-squat', name: 'Overhead Deep Squat', input: 'tpi-overhead-squat', unit: ''},
            {key: 'toe-touch', name: 'Toe Touch', input: 'tpi-toe-touch', unit: ''},
            {key: 'single-balance', name: 'Single Leg Balance', inputs: ['tpi-single-balance-left', 'tpi-single-balance-right'], unit: '', bilateral: true},
            {key: 'cervical-rotation', name: 'Cervical Rotation', inputs: ['tpi-cervical-left', 'tpi-cervical-right'], unit: '', bilateral: true},
            {key: 'forearm-rotation', name: 'Forearm Rotation', inputs: ['tpi-forearm-left', 'tpi-forearm-right'], unit: '', bilateral: true},
            {key: 'wrist-hinge', name: 'Wrist Hinge', inputs: ['tpi-wrist-hinge-left', 'tpi-wrist-hinge-right'], unit: '', bilateral: true},
            {key: 'wrist-flex', name: 'Wrist Flex/Ext', inputs: ['tpi-wrist-flex-left', 'tpi-wrist-flex-right'], unit: '', bilateral: true},
            {key: 'shoulder', name: '90-90 Shoulder', input: 'tpi-shoulder', unit: ''},
            {key: 'lat', name: 'Lat Test', input: 'tpi-lat', unit: ''}
        ]
    }
};

// Sauvegarder les tests d'une qualité spécifique
function saveQualityTests(qualityKey) {
    // Vérifier qu'un joueur est sélectionné (système multi-joueurs)
    const currentPlayerId = localStorage.getItem('currentPlayerId');
    if (!currentPlayerId) {
        alert('⚠️ Veuillez d\'abord sélectionner un joueur dans l\'onglet "Joueurs"');
        return;
    }
    
    // Fallback pour compatibilité avec ancien système
    if (!currentPlayer) {
        alert('Veuillez d\'abord enregistrer votre profil !');
        return;
    }
    
    const quality = QUALITY_TESTS[qualityKey];
    if (!quality) return;
    
    const testData = {
        id: Date.now(),
        date: new Date().toISOString(),
        quality: qualityKey,
        playerId: parseInt(currentPlayerId),
        player: currentPlayer.name,
        tests: {}
    };
    
    let hasData = false;
    
    quality.tests.forEach(test => {
        if (test.bilateral) {
            const leftEl = document.getElementById(test.inputs[0]);
            const rightEl = document.getElementById(test.inputs[1]);
            
            // Pour TPI (selects) ou tests numériques
            const leftValue = leftEl?.tagName === 'SELECT' ? leftEl.value : parseFloat(leftEl?.value);
            const rightValue = rightEl?.tagName === 'SELECT' ? rightEl.value : parseFloat(rightEl?.value);
            
            const leftValid = leftEl?.tagName === 'SELECT' ? leftValue && leftValue !== '' : !isNaN(leftValue);
            const rightValid = rightEl?.tagName === 'SELECT' ? rightValue && rightValue !== '' : !isNaN(rightValue);
            
            if (leftValid || rightValid) {
                testData.tests[test.key] = {
                    left: leftValid ? leftValue : null,
                    right: rightValid ? rightValue : null
                };
                hasData = true;
            }
        } else {
            const el = document.getElementById(test.input);
            
            // Pour TPI (selects) ou tests numériques
            const value = el?.tagName === 'SELECT' ? el.value : parseFloat(el?.value);
            const isValid = el?.tagName === 'SELECT' ? value && value !== '' : !isNaN(value);
            
            if (isValid) {
                testData.tests[test.key] = value;
                hasData = true;
            }
        }
    });
    
    if (!hasData) {
        alert(`Aucun test de ${quality.name} n'a été saisi.`);
        return;
    }
    
    // Récupérer l'historique existant
    let history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    // Si on est en mode édition, remplacer le test existant
    if (window.editingTestId) {
        const index = history.findIndex(t => t.id === window.editingTestId);
        if (index !== -1) {
            // Garder l'ID et la date d'origine
            testData.id = window.editingTestId;
            testData.date = history[index].date;
            testData.modifiedDate = new Date().toISOString();
            
            history[index] = testData;
            alert(`✅ Test de ${quality.name} modifié !`);
        } else {
            history.push(testData);
            alert(`✅ Tests de ${quality.name} enregistrés !`);
        }
        
        // Réinitialiser le mode édition
        window.editingTestId = null;
    } else {
        // Mode création normal
        history.push(testData);
        alert(`✅ Tests de ${quality.name} enregistrés !`);
    }
    
    localStorage.setItem('testsHistory', JSON.stringify(history));
    
    // BACKUP AUTOMATIQUE (sauvegarde silencieuse en arrière-plan)
    autoBackup();
    
    // Vider les champs après sauvegarde
    quality.tests.forEach(test => {
        if (test.bilateral) {
            const leftEl = document.getElementById(test.inputs[0]);
            const rightEl = document.getElementById(test.inputs[1]);
            if (leftEl) leftEl.value = '';
            if (rightEl) rightEl.value = '';
        } else {
            const el = document.getElementById(test.input);
            if (el) {
                if (el.tagName === 'SELECT') {
                    el.value = '';
                } else {
                    el.value = '';
                }
            }
        }
    });
}

// Afficher l'historique
function displayHistory() {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    
    if (history.length === 0) {
        document.querySelector('.history-container').innerHTML = `
            <div class="alert warning">
                <div class="alert-title">📋 Aucun test enregistré</div>
                <p>Commencez par enregistrer vos premiers tests !</p>
            </div>
        `;
        return;
    }
    
    // Organiser par qualité
    const byQuality = {};
    Object.keys(QUALITY_TESTS).forEach(key => {
        byQuality[key] = history.filter(h => h.quality === key).reverse(); // Plus récent en premier
    });
    
    let html = '<div class="history-by-quality">';
    
    Object.keys(QUALITY_TESTS).forEach(qualityKey => {
        const quality = QUALITY_TESTS[qualityKey];
        const tests = byQuality[qualityKey];
        
        if (tests.length === 0) return;
        
        html += `
            <div class="quality-history-section" style="margin-bottom: 30px;">
                <h3 style="color: ${quality.color}; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">${quality.icon}</span>
                    ${quality.name}
                    <span style="font-size: 14px; color: #666;">(${tests.length} enregistrement${tests.length > 1 ? 's' : ''})</span>
                </h3>
                <div class="tests-list">
        `;
        
        tests.forEach((test, index) => {
            const date = new Date(test.date);
            const previousTest = tests[index + 1]; // Test précédent (plus ancien)
            
            html += `
                <div class="test-card" style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid ${quality.color};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <div>
                            <strong style="font-size: 16px;">📅 ${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</strong>
                            <div style="color: #666; font-size: 14px;">${Object.keys(test.tests).length} test${Object.keys(test.tests).length > 1 ? 's' : ''} complété${Object.keys(test.tests).length > 1 ? 's' : ''}</div>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="editTest(${test.id})" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                                ✏️ Modifier
                            </button>
                            <button onclick="deleteTest(${test.id})" style="background: #e74c3c; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                                🗑️ Supprimer
                            </button>
                        </div>
                    </div>
                    <div class="test-results">
            `;
            
            // Afficher les résultats
            quality.tests.forEach(testDef => {
                const testResult = test.tests[testDef.key];
                if (!testResult) return;
                
                if (testDef.bilateral) {
                    const left = testResult.left;
                    const right = testResult.right;
                    
                    if (left !== null || right !== null) {
                        html += `<div style="padding: 8px 0; border-bottom: 1px solid #eee;">`;
                        html += `<strong>${testDef.name}:</strong> `;
                        
                        if (left !== null) html += `G: ${left}${testDef.unit} `;
                        if (right !== null) html += `D: ${right}${testDef.unit}`;
                        
                        // LSI si les deux côtés
                        if (left !== null && right !== null) {
                            const lsi = ((Math.min(left, right) / Math.max(left, right)) * 100).toFixed(1);
                            const lsiColor = lsi >= 90 ? '#27ae60' : lsi >= 85 ? '#f39c12' : '#e74c3c';
                            html += ` | <span style="color: ${lsiColor}; font-weight: 600;">LSI: ${lsi}%</span>`;
                        }
                        
                        // Progression
                        if (previousTest && previousTest.tests[testDef.key]) {
                            const prevLeft = previousTest.tests[testDef.key].left;
                            const prevRight = previousTest.tests[testDef.key].right;
                            
                            if (left !== null && prevLeft !== null) {
                                const diff = left - prevLeft;
                                if (diff !== 0) {
                                    html += ` <span style="color: ${diff > 0 ? '#27ae60' : '#e74c3c'};">${diff > 0 ? '⬆️' : '⬇️'} ${Math.abs(diff).toFixed(1)}${testDef.unit} (G)</span>`;
                                }
                            }
                        }
                        
                        html += `</div>`;
                    }
                } else {
                    html += `<div style="padding: 8px 0; border-bottom: 1px solid #eee;">`;
                    html += `<strong>${testDef.name}:</strong> ${testResult}${testDef.unit}`;
                    
                    // Badge
                    const score = calculateScore20(testDef.key, testResult);
                    if (score !== null) {
                        const badge = getBadgeLabel(score);
                        html += ` <span style="background: ${quality.color}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px; font-weight: 600;">${badge.label}</span>`;
                    }
                    
                    // Progression
                    if (previousTest && previousTest.tests[testDef.key] !== undefined) {
                        const prev = previousTest.tests[testDef.key];
                        const diff = testResult - prev;
                        if (diff !== 0) {
                            html += ` <span style="color: ${diff > 0 ? '#27ae60' : '#e74c3c'};">${diff > 0 ? '⬆️' : '⬇️'} ${Math.abs(diff).toFixed(1)}${testDef.unit}</span>`;
                        }
                    }
                    
                    html += `</div>`;
                }
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    document.querySelector('.history-container').innerHTML = html;
}

// Supprimer un test
// Modifier un test
function editTest(testId) {
    const history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    const test = history.find(t => t.id === testId);
    
    if (!test) {
        alert('Test introuvable !');
        return;
    }
    
    const quality = QUALITY_TESTS[test.quality];
    if (!quality) return;
    
    // Charger les valeurs dans les champs
    quality.tests.forEach(testDef => {
        const testResult = test.tests[testDef.key];
        if (!testResult) return;
        
        if (testDef.bilateral) {
            const leftEl = document.getElementById(testDef.inputs[0]);
            const rightEl = document.getElementById(testDef.inputs[1]);
            
            if (leftEl) {
                if (leftEl.tagName === 'SELECT') {
                    leftEl.value = testResult.left || '';
                } else {
                    leftEl.value = testResult.left || '';
                }
            }
            
            if (rightEl) {
                if (rightEl.tagName === 'SELECT') {
                    rightEl.value = testResult.right || '';
                } else {
                    rightEl.value = testResult.right || '';
                }
            }
        } else {
            const el = document.getElementById(testDef.input);
            if (el) {
                if (el.tagName === 'SELECT') {
                    el.value = testResult || '';
                } else {
                    el.value = testResult || '';
                }
            }
        }
    });
    
    // Stocker l'ID du test en cours d'édition
    window.editingTestId = testId;
    
    // Aller à l'onglet Tests
    switchTab('tests');
    
    // Ouvrir l'accordéon correspondant
    const accordionMap = {
        'force': '🟢 FORCE',
        'vitesse': '🟡 VITESSE',
        'endurance': '🔴 ENDURANCE',
        'explosivite': '🟣 EXPLOSIVITÉ',
        'core': '🔵 CORE',
        'mobilite': '🟠 MOBILITÉ',
        'equilibre': '⚪ ÉQUILIBRE',
        'tpi': '🏌️ TESTS TPI'
    };
    
    const sectionTitle = accordionMap[test.quality];
    if (sectionTitle) {
        // Trouver et ouvrir l'accordéon
        const headers = document.querySelectorAll('.category-header');
        headers.forEach(header => {
            const span = header.querySelector('span');
            if (span && span.textContent.includes(sectionTitle)) {
                const content = header.nextElementSibling;
                if (content && !content.classList.contains('active')) {
                    header.click();
                }
                // Scroller jusqu'à la section
                setTimeout(() => {
                    header.scrollIntoView({behavior: 'smooth', block: 'center'});
                }, 300);
            }
        });
    }
    
    alert(`✏️ Les valeurs ont été chargées. Modifiez-les puis cliquez sur "${quality.icon} Enregistrer ${quality.name}" pour sauvegarder.`);
}

// Supprimer un test
function deleteTest(testId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce test ?')) return;
    
    let history = JSON.parse(localStorage.getItem('testsHistory') || '[]');
    history = history.filter(t => t.id !== testId);
    localStorage.setItem('testsHistory', JSON.stringify(history));
    
    alert('✅ Test supprimé !');
    displayHistory();
}

console.log('✅ Application chargée et prête');

// Appel immédiat au cas où DOMContentLoaded est déjà passé
if (document.readyState === 'loading') {
    // Le DOM n'est pas encore chargé, on attend
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 DOMContentLoaded - Initialisation...');
        initializeApp();
        setupEventListeners();
        loadPlayerData();
        setupMobileMenu();
        setupRMCalculators();
    });
} else {
    // Le DOM est déjà chargé (script defer), on exécute directement
    console.log('🚀 DOM déjà prêt - Initialisation immédiate...');
    initializeApp();
    setupEventListeners();
    loadPlayerData();
    setupMobileMenu();
    setupRMCalculators();
}
