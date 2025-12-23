// ==========================================================================
// GOLF PERFORMANCE TRACKER - BARÈMES DE RÉFÉRENCE
// ==========================================================================

const BAREMES = {
    // FORCE - Ratio poids de corps
    squat: {
        unit: 'ratio',
        bilateral: false,
        levels: {
            'M': {
                '<12': [0.8, 1.0, 1.2, 1.5],
                '12-14': [1.0, 1.3, 1.6, 1.9],
                '14-16': [1.2, 1.5, 1.8, 2.1],
                '17+': [1.5, 1.8, 2.1, 2.5]
            },
            'F': {
                '<12': [0.6, 0.8, 1.0, 1.2],
                '12-14': [0.8, 1.0, 1.3, 1.6],
                '14-16': [1.0, 1.2, 1.5, 1.8],
                '17+': [1.2, 1.5, 1.8, 2.1]
            }
        }
    },
    deadlift: {
        unit: 'ratio',
        bilateral: false,
        levels: {
            'M': {
                '<12': [1.0, 1.2, 1.5, 1.8],
                '12-14': [1.2, 1.5, 1.8, 2.2],
                '14-16': [1.5, 1.8, 2.2, 2.6],
                '17+': [1.8, 2.2, 2.6, 3.0]
            },
            'F': {
                '<12': [0.7, 0.9, 1.2, 1.5],
                '12-14': [0.9, 1.2, 1.5, 1.8],
                '14-16': [1.2, 1.5, 1.8, 2.2],
                '17+': [1.5, 1.8, 2.2, 2.6]
            }
        }
    },
    benchpress: {
        unit: 'ratio',
        bilateral: false,
        levels: {
            'M': {
                '<12': [0.5, 0.7, 0.9, 1.1],
                '12-14': [0.7, 0.9, 1.1, 1.4],
                '14-16': [0.9, 1.1, 1.3, 1.6],
                '17+': [1.0, 1.3, 1.5, 1.8]
            },
            'F': {
                '<12': [0.3, 0.5, 0.6, 0.8],
                '12-14': [0.4, 0.6, 0.8, 1.0],
                '14-16': [0.5, 0.7, 0.9, 1.2],
                '17+': [0.6, 0.8, 1.0, 1.3]
            }
        }
    },
    pullup: {
        unit: 'ratio',
        bilateral: false,
        levels: {
            'M': {
                '<12': [0.4, 0.6, 0.8, 1.0],
                '12-14': [0.6, 0.8, 1.0, 1.2],
                '14-16': [0.8, 1.0, 1.2, 1.5],
                '17+': [1.0, 1.2, 1.5, 1.8]
            },
            'F': {
                '<12': [0.2, 0.4, 0.6, 0.8],
                '12-14': [0.3, 0.5, 0.7, 0.9],
                '14-16': [0.4, 0.6, 0.8, 1.1],
                '17+': [0.5, 0.7, 1.0, 1.3]
            }
        }
    },

    // ASYMÉTRIE FORCE
    legext: {
        unit: 'ratio',
        bilateral: true,
        levels: {
            'M': {
                '<12': [0.3, 0.4, 0.5, 0.6],
                '12-14': [0.4, 0.5, 0.6, 0.8],
                '14-16': [0.5, 0.6, 0.8, 1.0],
                '17+': [0.6, 0.8, 1.0, 1.2]
            },
            'F': {
                '<12': [0.2, 0.3, 0.4, 0.5],
                '12-14': [0.3, 0.4, 0.5, 0.7],
                '14-16': [0.4, 0.5, 0.7, 0.9],
                '17+': [0.5, 0.6, 0.8, 1.0]
            }
        }
    },
    press: {
        unit: 'ratio',
        bilateral: true,
        levels: {
            'M': {
                '<12': [0.8, 1.0, 1.2, 1.5],
                '12-14': [1.0, 1.3, 1.6, 2.0],
                '14-16': [1.2, 1.5, 1.8, 2.2],
                '17+': [1.5, 1.8, 2.2, 2.6]
            },
            'F': {
                '<12': [0.6, 0.8, 1.0, 1.3],
                '12-14': [0.8, 1.0, 1.3, 1.6],
                '14-16': [1.0, 1.2, 1.5, 1.9],
                '17+': [1.2, 1.5, 1.8, 2.2]
            }
        }
    },

    // VITESSE
    shuttle: {
        unit: 's',
        bilateral: false,
        higherIsBetter: false,
        levels: {
            'M': {
                '<12': [22, 20, 18, 16],
                '12-14': [20, 18, 16, 14],
                '14-16': [18, 16, 14, 12],
                '17+': [16, 14, 12, 10]
            },
            'F': {
                '<12': [24, 22, 20, 18],
                '12-14': [22, 20, 18, 16],
                '14-16': [20, 18, 16, 14],
                '17+': [18, 16, 14, 12]
            }
        }
    },
    driverspeed: {
        unit: 'mph',
        bilateral: false,
        levels: {
            'M': {
                '<12': [60, 70, 80, 90],
                '12-14': [75, 85, 95, 105],
                '14-16': [90, 100, 110, 120],
                '17+': [100, 110, 120, 130]
            },
            'F': {
                '<12': [50, 60, 70, 80],
                '12-14': [65, 75, 85, 95],
                '14-16': [80, 90, 100, 110],
                '17+': [90, 100, 110, 120]
            }
        }
    },

    // ENDURANCE
    vma: {
        unit: 'km/h',
        bilateral: false,
        levels: {
            'M': {
                '<12': [10, 12, 14, 16],
                '12-14': [12, 14, 16, 18],
                '14-16': [14, 16, 18, 20],
                '17+': [15, 17, 19, 21]
            },
            'F': {
                '<12': [9, 11, 13, 15],
                '12-14': [11, 13, 15, 17],
                '14-16': [12, 14, 16, 18],
                '17+': [13, 15, 17, 19]
            }
        }
    },
    pushups: {
        unit: 'reps',
        bilateral: false,
        levels: {
            'M': {
                '<12': [15, 25, 35, 45],
                '12-14': [20, 30, 40, 50],
                '14-16': [25, 35, 45, 60],
                '17+': [30, 40, 55, 70]
            },
            'F': {
                '<12': [10, 15, 20, 30],
                '12-14': [12, 20, 28, 38],
                '14-16': [15, 25, 35, 45],
                '17+': [18, 28, 40, 52]
            }
        }
    },
    squats60: {
        unit: 'reps',
        bilateral: false,
        levels: {
            'M': {
                '<12': [20, 30, 40, 50],
                '12-14': [25, 35, 45, 60],
                '14-16': [30, 40, 55, 70],
                '17+': [35, 50, 65, 80]
            },
            'F': {
                '<12': [15, 25, 35, 45],
                '12-14': [20, 30, 42, 55],
                '14-16': [25, 38, 50, 65],
                '17+': [30, 42, 58, 75]
            }
        }
    },
    wallsit: {
        unit: 's',
        bilateral: true,
        levels: {
            'M': {
                '<12': [20, 35, 50, 70],
                '12-14': [30, 45, 65, 90],
                '14-16': [40, 60, 80, 110],
                '17+': [50, 75, 100, 130]
            },
            'F': {
                '<12': [15, 30, 45, 60],
                '12-14': [25, 40, 60, 80],
                '14-16': [35, 55, 75, 100],
                '17+': [45, 65, 90, 120]
            }
        }
    },

    // EXPLOSIVITÉ
    vertjump: {
        unit: 'cm',
        bilateral: false,
        levels: {
            'M': {
                '<12': [20, 30, 40, 50],
                '12-14': [30, 40, 50, 60],
                '14-16': [40, 50, 60, 70],
                '17+': [50, 60, 70, 80]
            },
            'F': {
                '<12': [15, 25, 35, 45],
                '12-14': [25, 35, 45, 55],
                '14-16': [30, 40, 50, 60],
                '17+': [35, 45, 55, 65]
            }
        }
    },
    horizjump: {
        unit: 'cm',
        bilateral: false,
        levels: {
            'M': {
                '<12': [120, 150, 180, 210],
                '12-14': [150, 180, 210, 240],
                '14-16': [180, 210, 240, 270],
                '17+': [210, 240, 270, 300]
            },
            'F': {
                '<12': [100, 130, 160, 190],
                '12-14': [130, 160, 190, 220],
                '14-16': [150, 180, 210, 240],
                '17+': [170, 200, 230, 260]
            }
        }
    },
    medball: {
        unit: 'm',
        bilateral: false,
        levels: {
            'M': {
                '<12': [3, 4, 5, 6],
                '12-14': [4, 5, 6, 8],
                '14-16': [5, 6.5, 8, 10],
                '17+': [6, 8, 10, 12]
            },
            'F': {
                '<12': [2, 3, 4, 5],
                '12-14': [3, 4, 5, 6],
                '14-16': [4, 5, 6, 7.5],
                '17+': [5, 6, 7.5, 9]
            }
        }
    },
    cmj: {
        unit: 'cm',
        bilateral: true,
        levels: {
            'M': {
                '<12': [15, 25, 35, 45],
                '12-14': [25, 35, 45, 55],
                '14-16': [35, 45, 55, 65],
                '17+': [45, 55, 65, 75]
            },
            'F': {
                '<12': [12, 20, 30, 40],
                '12-14': [20, 30, 40, 50],
                '14-16': [25, 35, 45, 55],
                '17+': [30, 40, 50, 60]
            }
        }
    },

    // CORE & STABILITÉ
    rkcplank: {
        unit: 's',
        bilateral: false,
        levels: {
            'M': {
                '<12': [30, 45, 60, 90],
                '12-14': [45, 60, 90, 120],
                '14-16': [60, 90, 120, 150],
                '17+': [75, 105, 135, 180]
            },
            'F': {
                '<12': [25, 40, 55, 75],
                '12-14': [40, 55, 75, 100],
                '14-16': [50, 70, 95, 125],
                '17+': [60, 85, 115, 150]
            }
        }
    },
    sideplank: {
        unit: 's',
        bilateral: true,
        levels: {
            'M': {
                '<12': [20, 35, 50, 70],
                '12-14': [30, 50, 70, 90],
                '14-16': [40, 60, 80, 110],
                '17+': [50, 75, 100, 130]
            },
            'F': {
                '<12': [15, 30, 45, 65],
                '12-14': [25, 40, 60, 85],
                '14-16': [35, 55, 75, 100],
                '17+': [45, 65, 90, 120]
            }
        }
    },
    birddog: {
        unit: 'quality',
        bilateral: false,
        levels: {
            'M': {
                '<12': [0, 1, 2, 3],
                '12-14': [0, 1, 2, 3],
                '14-16': [0, 1, 2, 3],
                '17+': [0, 1, 2, 3]
            },
            'F': {
                '<12': [0, 1, 2, 3],
                '12-14': [0, 1, 2, 3],
                '14-16': [0, 1, 2, 3],
                '17+': [0, 1, 2, 3]
            }
        }
    },
    mcgillflexor: {
        unit: 's',
        bilateral: false,
        levels: {
            'M': {
                '<12': [30, 50, 70, 100],
                '12-14': [50, 70, 100, 130],
                '14-16': [70, 100, 130, 160],
                '17+': [90, 120, 150, 180]
            },
            'F': {
                '<12': [25, 40, 60, 85],
                '12-14': [40, 60, 85, 115],
                '14-16': [55, 80, 110, 145],
                '17+': [70, 100, 130, 170]
            }
        }
    },
    mcgillextensor: {
        unit: 's',
        bilateral: false,
        levels: {
            'M': {
                '<12': [40, 60, 85, 120],
                '12-14': [60, 85, 120, 160],
                '14-16': [80, 110, 150, 190],
                '17+': [100, 140, 180, 220]
            },
            'F': {
                '<12': [30, 50, 75, 105],
                '12-14': [50, 75, 105, 140],
                '14-16': [70, 95, 130, 170],
                '17+': [85, 120, 160, 200]
            }
        }
    },

    // MOBILITÉ & SOUPLESSE
    sitreach: {
        unit: 'cm',
        bilateral: false,
        levels: {
            'M': {
                '<12': [0, 5, 10, 15],
                '12-14': [0, 5, 10, 15],
                '14-16': [0, 5, 10, 15],
                '17+': [0, 5, 12, 18]
            },
            'F': {
                '<12': [5, 10, 15, 20],
                '12-14': [5, 10, 15, 20],
                '14-16': [5, 10, 15, 22],
                '17+': [5, 12, 18, 25]
            }
        }
    },
    thoracic: {
        unit: '°',
        bilateral: false,
        levels: {
            'M': {
                '<12': [30, 40, 50, 60],
                '12-14': [30, 40, 50, 60],
                '14-16': [35, 45, 55, 65],
                '17+': [40, 50, 60, 70]
            },
            'F': {
                '<12': [35, 45, 55, 65],
                '12-14': [35, 45, 55, 65],
                '14-16': [40, 50, 60, 70],
                '17+': [45, 55, 65, 75]
            }
        }
    },
    hipint: {
        unit: '°',
        bilateral: true,
        levels: {
            'M': {
                '<12': [20, 30, 40, 50],
                '12-14': [25, 35, 45, 55],
                '14-16': [30, 40, 50, 60],
                '17+': [35, 45, 55, 65]
            },
            'F': {
                '<12': [25, 35, 45, 55],
                '12-14': [30, 40, 50, 60],
                '14-16': [35, 45, 55, 65],
                '17+': [40, 50, 60, 70]
            }
        }
    },
    hipext: {
        unit: '°',
        bilateral: true,
        levels: {
            'M': {
                '<12': [20, 30, 40, 50],
                '12-14': [25, 35, 45, 55],
                '14-16': [30, 40, 50, 60],
                '17+': [35, 45, 55, 65]
            },
            'F': {
                '<12': [25, 35, 45, 55],
                '12-14': [30, 40, 50, 60],
                '14-16': [35, 45, 55, 65],
                '17+': [40, 50, 60, 70]
            }
        }
    },
    ankle: {
        unit: 'cm',
        bilateral: true,
        levels: {
            'M': {
                '<12': [5, 8, 11, 14],
                '12-14': [6, 9, 12, 15],
                '14-16': [7, 10, 13, 16],
                '17+': [8, 11, 14, 17]
            },
            'F': {
                '<12': [6, 9, 12, 15],
                '12-14': [7, 10, 13, 16],
                '14-16': [8, 11, 14, 17],
                '17+': [9, 12, 15, 18]
            }
        }
    },
    shoulder: {
        unit: 'cm',
        bilateral: true,
        levels: {
            'M': {
                '<12': [-10, -5, 0, 5],
                '12-14': [-10, -5, 0, 5],
                '14-16': [-8, -3, 0, 5],
                '17+': [-5, 0, 5, 10]
            },
            'F': {
                '<12': [-5, 0, 5, 10],
                '12-14': [-5, 0, 5, 10],
                '14-16': [-3, 0, 5, 12],
                '17+': [0, 5, 10, 15]
            }
        }
    },

    // ÉQUILIBRE
    balanceopen: {
        unit: 's',
        bilateral: true,
        levels: {
            'M': {
                '<12': [15, 30, 45, 60],
                '12-14': [20, 40, 50, 60],
                '14-16': [30, 45, 55, 60],
                '17+': [40, 50, 58, 60]
            },
            'F': {
                '<12': [15, 30, 45, 60],
                '12-14': [20, 40, 50, 60],
                '14-16': [30, 45, 55, 60],
                '17+': [40, 50, 58, 60]
            }
        }
    },
    balanceclosed: {
        unit: 's',
        bilateral: true,
        levels: {
            'M': {
                '<12': [8, 15, 25, 40],
                '12-14': [10, 20, 30, 45],
                '14-16': [15, 25, 35, 50],
                '17+': [20, 30, 40, 55]
            },
            'F': {
                '<12': [8, 15, 25, 40],
                '12-14': [10, 20, 30, 45],
                '14-16': [15, 25, 35, 50],
                '17+': [20, 30, 40, 55]
            }
        }
    }
};

// Protocoles des tests
const PROTOCOLS = {
    squat: {
        title: "Squat (1RM)",
        material: "Barre, cage à squat",
        protocol: `
            1. Échauffement progressif avec charges croissantes
            2. Monter progressivement jusqu'au 1RM (ou 3RM pour estimer)
            3. Descendre jusqu'à ce que les cuisses soient parallèles au sol
            4. Dos plat, regard droit devant
            5. Noter le poids maximal soulevé
        `,
        tips: "La technique est primordiale. Ne sacrifiez jamais la forme pour la charge."
    },
    deadlift: {
        title: "Soulevé de Terre (1RM)",
        material: "Barre, disques",
        protocol: `
            1. Échauffement progressif
            2. Position de départ : barre au-dessus des orteils, dos plat
            3. Soulever en poussant dans le sol avec les jambes
            4. Extension complète en haut
            5. Noter le poids maximal
        `,
        tips: "Gardez le dos neutre tout au long du mouvement."
    },
    benchpress: {
        title: "Développé Couché (1RM)",
        material: "Banc, barre, assureur",
        protocol: `
            1. Échauffement progressif
            2. Allongé sur le banc, pieds au sol
            3. Descendre la barre jusqu'à la poitrine
            4. Remonter en extension complète
            5. Noter le poids maximal
        `,
        tips: "Toujours avoir un pareur pour la sécurité."
    },
    pullup: {
        title: "Tirage Vertical (1RM)",
        material: "Poulie haute ou barre de traction",
        protocol: `
            1. Si poulie : position assise, buste droit
            2. Tirer la barre vers la poitrine
            3. Contrôler la remontée
            4. Pour la barre de traction : ajouter du poids si nécessaire
            5. Noter le poids maximal (+ poids de corps si traction)
        `,
        tips: "Évitez de vous balancer ou d'utiliser l'élan."
    },
    shuttle: {
        title: "Navette 5x10m",
        material: "Plots, chronomètre",
        protocol: `
            1. Placer 2 lignes à 10m de distance
            2. Au signal, faire 5 allers-retours le plus vite possible
            3. Toucher la ligne avec la main à chaque virage
            4. Chronométrer le temps total
            5. Faire 2 essais et garder le meilleur
        `,
        tips: "Travaillez vos appuis pour minimiser le temps de freinage/relance."
    },
    driverspeed: {
        title: "Vitesse de Driver",
        material: "Driver, radar (Trackman/Flightscope)",
        protocol: `
            1. Échauffement complet de golf
            2. Prendre 5 drives avec votre driver habituel
            3. Rechercher la vitesse maximale (pas la précision)
            4. Noter la vitesse de club la plus élevée (mph)
        `,
        tips: "La vitesse de club est différente de la vitesse de balle."
    },
    vma: {
        title: "VMA (Vitesse Maximale Aérobie)",
        material: "Piste ou terrain plat",
        protocol: `
            1. Test Luc Léger ou Demi-Cooper (6 minutes)
            2. Courir la plus grande distance possible
            3. Convertir la distance en vitesse (km/h)
            4. Formule Demi-Cooper : VMA = (Distance en m / 100) - 5
        `,
        tips: "Gérez votre effort pour tenir les 6 minutes."
    },
    pushups: {
        title: "Pompes Max en 1 minute",
        material: "Chronomètre, tapis",
        protocol: `
            1. Position de planche, mains largeur d'épaules
            2. Au signal, faire le maximum de pompes en 60 secondes
            3. Descendre jusqu'à ce que les coudes atteignent 90°
            4. Technique stricte : corps aligné
            5. Compter les répétitions valides
        `,
        tips: "Mieux vaut moins de répétitions bien faites que beaucoup mal faites."
    },
    squats60: {
        title: "Squats Max en 1 minute",
        material: "Chronomètre",
        protocol: `
            1. Pieds largeur d'épaules
            2. Au signal, faire le maximum de squats en 60 secondes
            3. Descendre jusqu'à cuisses parallèles au sol
            4. Extension complète en haut
            5. Compter les répétitions valides
        `,
        tips: "Maintenez le dos droit et contrôlez la descente."
    },
    vertjump: {
        title: "Détente Verticale (CMJ)",
        material: "Mur gradué ou toise",
        protocol: `
            1. Debout contre le mur, marquer la hauteur de main levée
            2. Sauter le plus haut possible (contre-mouvement autorisé)
            3. Mains sur les hanches pour isoler les jambes
            4. Marquer la hauteur atteinte
            5. Faire 3 essais, garder le meilleur
        `,
        tips: "Utilisez vos bras pour gagner en hauteur lors du saut."
    },
    horizjump: {
        title: "Détente Horizontale",
        material: "Décamètre, ligne de départ",
        protocol: `
            1. Pieds joints derrière la ligne
            2. Sauter le plus loin possible (contre-mouvement autorisé)
            3. Utiliser les bras pour prendre de l'élan
            4. Mesurer du talon le plus proche de la ligne
            5. Faire 3 essais, garder le meilleur
        `,
        tips: "Propulsez-vous en avant et vers le haut, pas seulement en avant."
    },
    medball: {
        title: "Lancer de Medecine Ball 3kg",
        material: "Medecine Ball 3kg, décamètre",
        protocol: `
            1. Lancer de face (type touche de foot) ou de profil (rotation golf)
            2. Position de départ : pieds écartés largeur hanches
            3. Lancer le plus loin possible avec force maximale
            4. Mesurer la distance d'impact au sol
            5. Faire 3 essais, garder le meilleur
        `,
        tips: "Engagez tout le corps dans le mouvement, pas seulement les bras."
    },
    rkcplank: {
        title: "RKC Plank",
        material: "Chronomètre, tapis",
        protocol: `
            1. Position de planche sur les avant-bras
            2. Contraction maximale : fessiers, abdos, quadriceps
            3. Coudes tirent mentalement vers les pieds
            4. Corps droit de la tête aux talons
            5. Chronométrer le temps de maintien
        `,
        tips: "La contraction intense est la clé : vous devez trembler !"
    },
    sideplank: {
        title: "Side Plank",
        material: "Chronomètre, tapis",
        protocol: `
            1. Position sur le côté, appui sur l'avant-bras
            2. Corps aligné, bassin en légère rétroversion
            3. Maintenir la position sans bouger
            4. Chronométrer chaque côté séparément
            5. Comparer gauche et droite
        `,
        tips: "Ne laissez pas les hanches descendre."
    },
    birddog: {
        title: "Bird Dog (Qualité)",
        material: "Bâton, tapis",
        protocol: `
            1. À quatre pattes, placer un bâton sur les lombaires
            2. Lever simultanément bras droit et jambe gauche
            3. Le dos doit rester immobile (le bâton ne doit pas tomber)
            4. Noter la qualité : 0 = instable, 3 = parfait
            5. Tester les deux côtés
        `,
        tips: "La qualité prime sur la durée. Concentrez-vous sur la stabilité."
    },
    mcgillflexor: {
        title: "McGill Flexor Test",
        material: "Banc, chronomètre",
        protocol: `
            1. Assis au bord d'un banc, jambes tendues
            2. S'incliner à 60° en arrière sans support
            3. Mains croisées sur la poitrine
            4. Maintenir la position
            5. Chronométrer jusqu'à rupture de la position
        `,
        tips: "Test crucial pour la santé du dos du golfeur."
    },
    mcgillextensor: {
        title: "McGill Extensor Test",
        material: "Banc, chronomètre",
        protocol: `
            1. Allongé face vers le sol, buste dans le vide
            2. Jambes maintenues sur le banc
            3. Maintenir le tronc à l'horizontale
            4. Bras croisés sur la poitrine
            5. Chronométrer jusqu'à rupture
        `,
        tips: "Ne compensez pas avec une cambrure excessive."
    },
    sitreach: {
        title: "Seat & Reach",
        material: "Boîte de test ou règle",
        protocol: `
            1. Assis, jambes tendues devant soi
            2. Pieds contre la boîte de test
            3. Tendre les bras et se pencher en avant
            4. Maintenir 2 secondes sans à-coups
            5. Mesurer la distance atteinte
        `,
        tips: "Échauffez-vous avant pour une mesure optimale."
    },
    thoracic: {
        title: "Rotation Thoracique",
        material: "Bâton, goniomètre",
        protocol: `
            1. Assis sur une chaise, bâton sur les épaules
            2. Bassin immobile contre le dossier
            3. Tourner le buste au maximum d'un côté
            4. Mesurer l'angle de rotation
            5. Tester les deux côtés
        `,
        tips: "Le golf nécessite au moins 50° de rotation thoracique."
    },
    birddog: {
        title: "Bird Dog",
        material: "Chronomètre, tapis",
        protocol: `
            1. Position quadrupédique (4 pattes)
            2. Tendre simultanément bras opposé et jambe opposée
            3. Maintenir l'équilibre sans bouger le bassin
            4. Score de 0 (instable) à 3 (parfait et stable)
        `,
        tips: "Placer un bâton sur le dos pour vérifier la stabilité."
    }
};

// Catégories de tests pour l'affichage
const TEST_CATEGORIES = {
    force: {
        name: "Force & Asymétrie",
        icon: "🟢",
        tests: ['squat', 'deadlift', 'benchpress', 'pullup', 'legext', 'press']
    },
    speed: {
        name: "Vitesse",
        icon: "🟡",
        tests: ['shuttle', 'driverspeed']
    },
    endurance: {
        name: "Endurance",
        icon: "🔴",
        tests: ['vma', 'pushups', 'squats60', 'wallsit']
    },
    power: {
        name: "Explosivité",
        icon: "🟣",
        tests: ['vertjump', 'horizjump', 'medball', 'cmj']
    },
    core: {
        name: "Core & Stabilité",
        icon: "🔵",
        tests: ['rkcplank', 'sideplank', 'birddog', 'mcgillflexor', 'mcgillextensor']
    },
    mobility: {
        name: "Mobilité & Souplesse",
        icon: "🟠",
        tests: ['sitreach', 'thoracic', 'hipint', 'hipext', 'ankle', 'shoulder']
    },
    balance: {
        name: "Équilibre",
        icon: "⚪",
        tests: ['balanceopen', 'balanceclosed']
    }
};

// Noms affichés des tests
const TEST_NAMES = {
    squat: "Squat",
    deadlift: "Deadlift",
    benchpress: "Développé Couché",
    pullup: "Tirage Vertical",
    legext: "Leg Extension",
    press: "Presse",
    shuttle: "Navette 5x10m",
    driverspeed: "Driver Speed",
    vma: "VMA",
    pushups: "Pompes 1min",
    squats60: "Squats 1min",
    wallsit: "Chaise Unilatérale",
    vertjump: "Détente Verticale",
    horizjump: "Détente Horizontale",
    medball: "MedBall Throw 3kg",
    cmj: "CMJ Unilatéral",
    rkcplank: "RKC Plank",
    sideplank: "Side Plank",
    birddog: "Bird Dog",
    mcgillflexor: "McGill Flexor",
    mcgillextensor: "McGill Extensor",
    sitreach: "Seat & Reach",
    thoracic: "Rotation Thoracique",
    hipint: "Hip Rotation Interne",
    hipext: "Hip Rotation Externe",
    ankle: "Dorsiflexion Cheville",
    shoulder: "Test Épaules (Apley)",
    balanceopen: "Équilibre Yeux Ouverts",
    balanceclosed: "Équilibre Yeux Fermés"
};

// ==================== BARÈMES ADDITIONNELS POUR ADULTES ====================
// Ajouter les tranches d'âge 17-25, 25-40, 40-50, 50+ à tous les tests

// Fonction pour mettre à jour tous les barèmes avec les nouvelles tranches
(function updateBaremes() {
    Object.keys(BAREMES).forEach(testKey => {
        const test = BAREMES[testKey];
        ['M', 'F'].forEach(gender => {
            if (test.levels[gender]) {
                const base17 = test.levels[gender]['17+'];
                
                // 17-25 ans : identique à 17+
                test.levels[gender]['17-25'] = [...base17];
                
                // 25-40 ans : légère baisse (5%)
                test.levels[gender]['25-40'] = base17.map(v => {
                    if (test.higherIsBetter === false) {
                        // Pour les tests où moins est mieux (ex: navette)
                        return parseFloat((v * 1.05).toFixed(2));
                    } else {
                        return parseFloat((v * 0.95).toFixed(2));
                    }
                });
                
                // 40-50 ans : baisse modérée (15%)
                test.levels[gender]['40-50'] = base17.map(v => {
                    if (test.higherIsBetter === false) {
                        return parseFloat((v * 1.15).toFixed(2));
                    } else {
                        return parseFloat((v * 0.85).toFixed(2));
                    }
                });
                
                // 50+ ans : baisse importante (25%)
                test.levels[gender]['50+'] = base17.map(v => {
                    if (test.higherIsBetter === false) {
                        return parseFloat((v * 1.25).toFixed(2));
                    } else {
                        return parseFloat((v * 0.75).toFixed(2));
                    }
                });
            }
        });
    });
    
    console.log('✅ Barèmes mis à jour avec les tranches d\'âge adultes');
})();

