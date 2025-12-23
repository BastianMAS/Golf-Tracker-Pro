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

// Catégories de tests pour l'affichage
const TEST_CATEGORIES = {
    force: {
        name: "Force",
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

