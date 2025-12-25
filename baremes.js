// ==========================================================================
// GOLF PERFORMANCE TRACKER - BARÈMES DE RÉFÉRENCE
// Version validée avec Bastian MAS (TPI Certified, C.R.E Ligue Paris-IDF)
// Date: 25 décembre 2024
// ==========================================================================

const BAREMES = {
  
  // =====================================================================
  // FORCE - Ratio poids de corps (1RM / Poids)
  // =====================================================================
  
  squat: {
    unit: 'ratio',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [1.5, 1.8, 2.1, 2.4],
        'amateur_negatif': [0.9, 1.1, 1.3, 1.6],
        'amateur_0to7': [0.7, 0.9, 1.1, 1.4],
        'amateur_8plus': [0.5, 0.7, 0.9, 1.2],
      },
      F: {
        'professionnel': [1.2, 1.5, 1.8, 2.1],
        'amateur_negatif': [0.7, 0.9, 1.1, 1.4],
        'amateur_0to7': [0.5, 0.7, 0.9, 1.2],
        'amateur_8plus': [0.4, 0.6, 0.8, 1.0],
      }
    }
  },
  
  deadlift: {
    unit: 'ratio',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [2.0, 2.4, 2.8, 3.2],
        'amateur_negatif': [1.2, 1.5, 1.8, 2.2],
        'amateur_0to7': [0.9, 1.2, 1.5, 1.9],
        'amateur_8plus': [0.7, 1.0, 1.3, 1.7],
      },
      F: {
        'professionnel': [1.6, 2.0, 2.4, 2.8],
        'amateur_negatif': [0.9, 1.2, 1.5, 1.9],
        'amateur_0to7': [0.7, 1.0, 1.3, 1.7],
        'amateur_8plus': [0.6, 0.9, 1.2, 1.5],
      }
    }
  },
  
  bench: {
    unit: 'ratio',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [1.2, 1.5, 1.7, 2.0],
        'amateur_negatif': [0.7, 0.9, 1.1, 1.4],
        'amateur_0to7': [0.5, 0.7, 0.9, 1.2],
        'amateur_8plus': [0.4, 0.6, 0.8, 1.0],
      },
      F: {
        'professionnel': [0.8, 1.0, 1.2, 1.4],
        'amateur_negatif': [0.5, 0.7, 0.9, 1.1],
        'amateur_0to7': [0.4, 0.6, 0.8, 1.0],
        'amateur_8plus': [0.3, 0.5, 0.7, 0.9],
      }
    }
  },
  
  pullup: {
    unit: 'ratio',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [1.2, 1.5, 1.9, 2.3],
        'amateur_negatif': [0.8, 1.1, 1.4, 1.8],
        'amateur_0to7': [0.5, 0.8, 1.1, 1.4],
        'amateur_8plus': [0.4, 0.7, 1.0, 1.3],
      },
      F: {
        'professionnel': [0.8, 1.1, 1.4, 1.7],
        'amateur_negatif': [0.5, 0.8, 1.1, 1.4],
        'amateur_0to7': [0.4, 0.7, 1.0, 1.3],
        'amateur_8plus': [0.3, 0.6, 0.9, 1.2],
      }
    }
  },
  
  // =====================================================================
  // VITESSE
  // =====================================================================
  
  driver_speed: {
    unit: 'mph',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [112, 120, 125, 132],
        'amateur_negatif': [102, 110, 115, 122],
        'amateur_0to7': [95, 103, 108, 115],
        'amateur_8plus': [88, 96, 101, 108],
      },
      F: {
        'professionnel': [95, 102, 108, 115],
        'amateur_negatif': [85, 92, 98, 105],
        'amateur_0to7': [80, 87, 93, 100],
        'amateur_8plus': [75, 82, 88, 95],
      }
    }
  },
  
  navette_5x10: {
    unit: 's',
    higherIsBetter: false, // Plus bas = meilleur
    levels: {
      M: {
        'professionnel': [10.5, 9.8, 9.2, 8.5],
        'amateur_negatif': [11.5, 10.8, 10.2, 9.5],
        'amateur_0to7': [12.5, 11.8, 11.2, 10.5],
        'amateur_8plus': [13.5, 12.8, 12.2, 11.5],
      },
      F: {
        'professionnel': [11.5, 10.8, 10.2, 9.5],
        'amateur_negatif': [12.5, 11.8, 11.2, 10.5],
        'amateur_0to7': [13.5, 12.8, 12.2, 11.5],
        'amateur_8plus': [14.5, 13.8, 13.2, 12.5],
      }
    }
  },
  
  // =====================================================================
  // ENDURANCE
  // =====================================================================
  
  vma: {
    unit: 'km/h',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [12, 14, 15, 16],
        'amateur_negatif': [10, 12, 13, 14],
        'amateur_0to7': [9, 11, 12, 13],
        'amateur_8plus': [8, 10, 11, 12],
      },
      F: {
        'professionnel': [11, 12, 14, 15],
        'amateur_negatif': [9, 10, 12, 13],
        'amateur_0to7': [8, 9, 11, 12],
        'amateur_8plus': [7, 8, 10, 11],
      }
    }
  },
  
  pompes_max: {
    unit: 'reps',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [30, 40, 50, 58],
        'amateur_negatif': [22, 30, 38, 46],
        'amateur_0to7': [18, 25, 32, 40],
        'amateur_8plus': [14, 20, 26, 34],
      },
      F: {
        'professionnel': [22, 30, 38, 46],
        'amateur_negatif': [16, 22, 28, 34],
        'amateur_0to7': [12, 18, 24, 30],
        'amateur_8plus': [10, 15, 20, 26],
      }
    }
  },
  
  squats_max: {
    unit: 'reps',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [35, 45, 55, 62],
        'amateur_negatif': [28, 36, 44, 52],
        'amateur_0to7': [24, 32, 40, 48],
        'amateur_8plus': [20, 28, 36, 44],
      },
      F: {
        'professionnel': [30, 40, 50, 60],
        'amateur_negatif': [24, 32, 40, 48],
        'amateur_0to7': [20, 28, 36, 44],
        'amateur_8plus': [18, 25, 32, 40],
      }
    }
  },
  
  wall_sit_uni: {
    unit: 's',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [25, 50, 75, 100],
        'amateur_negatif': [18, 38, 58, 78],
        'amateur_0to7': [15, 32, 48, 65],
        'amateur_8plus': [12, 26, 40, 54],
      },
      F: {
        'professionnel': [20, 35, 50, 60],
        'amateur_negatif': [15, 28, 40, 48],
        'amateur_0to7': [12, 24, 35, 42],
        'amateur_8plus': [10, 20, 30, 36],
      }
    }
  },
  
  // =====================================================================
  // EXPLOSIVITÉ
  // =====================================================================
  
  detente_verticale: {
    unit: 'cm',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [40, 48, 55, 62],
        'amateur_negatif': [32, 40, 47, 54],
        'amateur_0to7': [28, 36, 43, 50],
        'amateur_8plus': [24, 32, 39, 46],
      },
      F: {
        'professionnel': [30, 38, 45, 52],
        'amateur_negatif': [24, 32, 39, 46],
        'amateur_0to7': [20, 28, 35, 42],
        'amateur_8plus': [18, 26, 33, 40],
      }
    }
  },
  
  detente_horizontale: {
    unit: 'cm',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [220, 245, 265, 290],
        'amateur_negatif': [195, 220, 240, 265],
        'amateur_0to7': [180, 205, 225, 250],
        'amateur_8plus': [165, 190, 210, 235],
      },
      F: {
        'professionnel': [190, 215, 235, 260],
        'amateur_negatif': [170, 195, 215, 240],
        'amateur_0to7': [160, 185, 205, 230],
        'amateur_8plus': [150, 175, 195, 220],
      }
    }
  },
  
  cmj_unilateral: {
    unit: 'cm',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [24, 29, 33, 37],
        'amateur_negatif': [19, 24, 28, 32],
        'amateur_0to7': [17, 22, 26, 30],
        'amateur_8plus': [14, 19, 23, 27],
      },
      F: {
        'professionnel': [18, 23, 27, 31],
        'amateur_negatif': [14, 19, 23, 27],
        'amateur_0to7': [12, 17, 21, 25],
        'amateur_8plus': [11, 16, 20, 24],
      }
    }
  },
  
  medball_rotation: {
    unit: 'm',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [7.5, 8.5, 9.5, 10.5],
        'amateur_negatif': [6.0, 7.0, 8.0, 9.0],
        'amateur_0to7': [5.5, 6.5, 7.5, 8.5],
        'amateur_8plus': [5.0, 6.0, 7.0, 8.0],
      },
      F: {
        'professionnel': [6.5, 7.5, 8.5, 9.5],
        'amateur_negatif': [5.0, 6.0, 7.0, 8.0],
        'amateur_0to7': [4.5, 5.5, 6.5, 7.5],
        'amateur_8plus': [4.0, 5.0, 6.0, 7.0],
      }
    }
  },
  
  medball_chest: {
    unit: 'm',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [5.0, 6.0, 7.0, 8.5],
        'amateur_negatif': [4.0, 5.0, 6.0, 7.0],
        'amateur_0to7': [3.5, 4.5, 5.5, 6.5],
        'amateur_8plus': [3.0, 4.0, 5.0, 6.0],
      },
      F: {
        'professionnel': [3.5, 4.5, 5.5, 6.5],
        'amateur_negatif': [3.0, 4.0, 5.0, 6.0],
        'amateur_0to7': [2.5, 3.5, 4.5, 5.5],
        'amateur_8plus': [2.0, 3.0, 4.0, 5.0],
      }
    }
  },
  
  // =====================================================================
  // CORE
  // =====================================================================
  
  rkc_plank: {
    unit: 's',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [30, 45, 60, 90],
        'amateur_negatif': [22, 35, 48, 70],
        'amateur_0to7': [18, 28, 38, 56],
        'amateur_8plus': [14, 22, 30, 44],
      },
      F: {
        'professionnel': [25, 40, 55, 75],
        'amateur_negatif': [18, 30, 42, 58],
        'amateur_0to7': [15, 24, 33, 46],
        'amateur_8plus': [12, 19, 26, 36],
      }
    }
  },
  
  side_plank: {
    unit: 's',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [48, 70, 92, 120],
        'amateur_negatif': [38, 56, 74, 96],
        'amateur_0to7': [32, 48, 64, 84],
        'amateur_8plus': [26, 40, 54, 72],
      },
      F: {
        'professionnel': [40, 62, 85, 113],
        'amateur_negatif': [32, 50, 68, 90],
        'amateur_0to7': [27, 43, 59, 79],
        'amateur_8plus': [22, 36, 50, 68],
      }
    }
  },
  
  mcgill_flexor: {
    unit: 's',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [47, 68, 90, 118],
        'amateur_negatif': [38, 54, 72, 94],
        'amateur_0to7': [32, 46, 62, 82],
        'amateur_8plus': [26, 39, 52, 70],
      },
      F: {
        'professionnel': [42, 64, 88, 117],
        'amateur_negatif': [34, 51, 70, 94],
        'amateur_0to7': [28, 44, 61, 82],
        'amateur_8plus': [23, 38, 53, 72],
      }
    }
  },
  
  mcgill_extensor: {
    unit: 's',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [82, 117, 155, 198],
        'amateur_negatif': [66, 94, 124, 158],
        'amateur_0to7': [57, 82, 109, 139],
        'amateur_8plus': [48, 70, 93, 119],
      },
      F: {
        'professionnel': [72, 107, 145, 190],
        'amateur_negatif': [58, 86, 116, 152],
        'amateur_0to7': [50, 75, 101, 133],
        'amateur_8plus': [42, 64, 87, 114],
      }
    }
  },
  
  bird_dog: {
    unit: 'score',
    higherIsBetter: true,
    qualitative: true,
    description: "Score qualitatif 0-3 (maintien 10s)",
    levels: {
      ALL: {
        'tous': [0, 1, 2, 3] // 0=échec, 1=instable, 2=compensations, 3=parfait
      }
    }
  },
  
  // =====================================================================
  // MOBILITÉ
  // =====================================================================
  
  stand_reach: {
    unit: 'cm',
    higherIsBetter: true,
    description: "Debout sur marche, mesure sous orteils (positif = dépasse)",
    levels: {
      M: {
        'professionnel': [-5, 0, 8, 15],
        'amateur_negatif': [-8, -3, 5, 12],
        'amateur_0to7': [-10, -5, 3, 10],
        'amateur_8plus': [-12, -7, 1, 8],
      },
      F: {
        'professionnel': [0, 5, 12, 20],
        'amateur_negatif': [-3, 2, 9, 16],
        'amateur_0to7': [-5, 0, 7, 14],
        'amateur_8plus': [-7, -2, 5, 12],
      }
    }
  },
  
  rotation_thoracique: {
    unit: '°',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [53, 63, 73, 84],
        'amateur_negatif': [48, 58, 68, 79],
        'amateur_0to7': [45, 55, 65, 76],
        'amateur_8plus': [42, 52, 62, 73],
      },
      F: {
        'professionnel': [58, 68, 78, 89],
        'amateur_negatif': [53, 63, 73, 84],
        'amateur_0to7': [50, 60, 70, 81],
        'amateur_8plus': [47, 57, 67, 78],
      }
    }
  },
  
  hip_rotation_interne: {
    unit: '°',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [20, 30, 35, 45],
        'amateur_negatif': [16, 24, 28, 36],
        'amateur_0to7': [14, 21, 25, 32],
        'amateur_8plus': [12, 18, 22, 28],
      },
      F: {
        'professionnel': [25, 35, 40, 50],
        'amateur_negatif': [20, 28, 32, 40],
        'amateur_0to7': [18, 25, 29, 36],
        'amateur_8plus': [16, 22, 26, 32],
      }
    }
  },
  
  hip_rotation_externe: {
    unit: '°',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [30, 40, 45, 55],
        'amateur_negatif': [24, 32, 36, 44],
        'amateur_0to7': [21, 28, 32, 39],
        'amateur_8plus': [18, 24, 28, 34],
      },
      F: {
        'professionnel': [35, 45, 50, 60],
        'amateur_negatif': [28, 36, 40, 48],
        'amateur_0to7': [25, 32, 36, 43],
        'amateur_8plus': [22, 28, 32, 38],
      }
    }
  },
  
  dorsiflexion_cheville: {
    unit: 'cm',
    higherIsBetter: true,
    levels: {
      M: {
        'professionnel': [9, 12, 14, 15],
        'amateur_negatif': [7, 10, 12, 13],
        'amateur_0to7': [6, 8, 10, 11],
        'amateur_8plus': [5, 7, 8, 9],
      },
      F: {
        'professionnel': [10, 13, 15, 17],
        'amateur_negatif': [8, 10, 12, 14],
        'amateur_0to7': [7, 9, 11, 12],
        'amateur_8plus': [6, 8, 9, 10],
      }
    }
  },
  
  apley_scratch: {
    unit: 'cm',
    higherIsBetter: false, // Plus bas (négatif) = meilleur
    description: "Négatif = mains se chevauchent (mieux)",
    levels: {
      M: {
        'professionnel': [7, 3, -2, -8],
        'amateur_negatif': [10, 5, 0, -5],
        'amateur_0to7': [12, 7, 2, -3],
        'amateur_8plus': [14, 9, 4, -1],
      },
      F: {
        'professionnel': [3, -2, -7, -13],
        'amateur_negatif': [6, 0, -5, -10],
        'amateur_0to7': [8, 2, -3, -8],
        'amateur_8plus': [10, 4, -1, -6],
      }
    }
  },
  
  // =====================================================================
  // ÉQUILIBRE (pas de distinction sexe)
  // =====================================================================
  
  equilibre_yeux_ouverts: {
    unit: 's',
    higherIsBetter: true,
    description: "Maximum 60 secondes",
    maxDuration: 60,
    levels: {
      ALL: {
        'professionnel': [30, 40, 50, 60],
        'amateur_negatif': [24, 32, 40, 48],
        'amateur_0to7': [20, 28, 36, 44],
        'amateur_8plus': [16, 24, 32, 40],
      }
    }
  },
  
  equilibre_yeux_fermes: {
    unit: 's',
    higherIsBetter: true,
    description: "Maximum 30 secondes",
    maxDuration: 30,
    levels: {
      ALL: {
        'professionnel': [10, 15, 22, 30],
        'amateur_negatif': [8, 12, 18, 24],
        'amateur_0to7': [6, 10, 15, 20],
        'amateur_8plus': [5, 8, 12, 16],
      }
    }
  }
};

// ==========================================================================
// FONCTIONS UTILITAIRES
// ==========================================================================

/**
 * Récupère les barèmes pour un test donné
 * @param {string} testName - Nom du test
 * @param {string} gender - 'M', 'F', ou 'ALL' (pour équilibre)
 * @param {string} category - 'professionnel', 'amateur_negatif', etc.
 * @returns {Array} - Tableau [faible, moyen, bon, élite]
 */
function getBareme(testName, gender, category) {
  const test = BAREMES[testName];
  if (!test) return null;
  
  // Cas spécial pour les tests ALL (équilibre)
  if (test.levels.ALL) {
    return test.levels.ALL[category];
  }
  
  // Cas normal avec genre
  if (!test.levels[gender]) return null;
  return test.levels[gender][category];
}

/**
 * Évalue une performance
 * @param {number} value - Valeur mesurée
 * @param {Array} bareme - Barème [faible, moyen, bon, élite]
 * @param {boolean} higherIsBetter - true si plus haut = meilleur
 * @returns {string} - 'faible', 'moyen', 'bon', ou 'elite'
 */
function evaluatePerformance(value, bareme, higherIsBetter = true) {
  if (!bareme || bareme.length !== 4) return null;
  
  const [faible, moyen, bon, elite] = bareme;
  
  if (higherIsBetter) {
    if (value < faible) return 'très faible';
    if (value < moyen) return 'faible';
    if (value < bon) return 'moyen';
    if (value < elite) return 'bon';
    return 'élite';
  } else {
    if (value > faible) return 'très faible';
    if (value > moyen) return 'faible';
    if (value > bon) return 'moyen';
    if (value > elite) return 'bon';
    return 'élite';
  }
}

// Export pour utilisation dans l'app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BAREMES, getBareme, evaluatePerformance };
}
