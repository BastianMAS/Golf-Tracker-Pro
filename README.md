# Golf Performance Tracker - Bastian MAS

Application web complète de suivi de performance physique pour golfeurs, développée par Bastian MAS, Préparateur Physique spécialisé Golf et certifié TPI.

## 🎯 Fonctionnalités

### 📋 Page de Présentation
- Présentation professionnelle avec CV et expertise
- Méthode en 4 étapes clairement détaillée
- Section contact avec liens cliquables (email, téléphone, réseaux sociaux)
- Certifications TPI affichées

### 📊 Application Tracker
**Sans système de login - Accès direct**

#### 1. Profil Joueur
- Nom, sexe, tranche d'âge (<12, 12-14, 14-16, 17+)
- Poids de corps (pour calcul des ratios)

#### 2. Saisie des Tests
Tests organisés par catégories avec protocoles détaillés :

**🟢 Force & Asymétrie**
- Squat, Deadlift, Développé Couché, Tirage Vertical (ratio poids de corps)
- Tests unilatéraux : Leg Extension, Presse

**🟡 Vitesse**
- Navette 5x10m
- Driver Speed (mph)

**🔴 Endurance**
- VMA, Max Pompes 1min, Max Squats 1min
- Chaise Unilatérale (G/D)

**🟣 Explosivité**
- Détente Verticale/Horizontale
- MedBall Throw 3kg
- CMJ Unilatéral (G/D)

**🔵 Core & Stabilité**
- RKC Plank, Side Plank (G/D)
- Bird Dog (qualité 0-3)
- McGill Flexor/Extensor

**🟠 Mobilité & Souplesse**
- Seat & Reach, Rotation Thoracique
- Hip Rotation Int/Ext (G/D)
- Dorsiflexion Cheville (G/D)
- Test Épaules (Apley)

**⚪ Équilibre**
- Yeux Ouverts/Fermés (G/D)

**🏌️ Tests TPI**
- 16 tests Pass/Fail selon protocole TPI

#### 3. Dashboard Performance
- **Graphique Radar** : Vue d'ensemble des 7 catégories de performance
- **Alertes Asymétries** : Détection automatique des déséquilibres >15%
- **Scores Détaillés** : Niveau 1-4 pour chaque test avec code couleur
- **Jauges visuelles** pour les tests bilatéraux

#### 4. Historique
- Graphiques d'évolution par test
- Tableaux de données historiques
- Comparaison des performances

#### 5. Gestion des Données
- **Import/Export JSON** : Sauvegarde et transfert des données
- **Génération de Rapport** : PDF imprimable pour partage avec le pro de golf
- Stockage local (localStorage)

## 📐 Barèmes de Performance

### Système de Notation
Chaque test est évalué sur 4 niveaux :
- **Niveau 1** (🔴) : Faible
- **Niveau 2** (🟠) : Moyen
- **Niveau 3** (🟢) : Bon
- **Niveau 4** (🔵) : Élite/Pro

### Adaptation par Profil
Les barèmes s'adaptent automatiquement selon :
- **Sexe** : Homme / Femme
- **Âge** : <12 ans, 12-14 ans, 14-16 ans, 17+ ans
- **Poids** : Pour les tests en ratio

### Détection des Asymétries
**Règle Critique** : Si l'écart Gauche/Droite > 15%, le niveau passe automatiquement à **Niveau 1** (Alerte risque de blessure), même si la performance absolue est élevée.

## 🎨 Design

- **Couleurs** : Vert golf (#1a4d2e), blanc, gris
- **Interface** : Moderne, professionnelle, intuitive
- **Responsive** : Optimisé mobile et desktop
- **PWA** : Installable comme application

## 🚀 Installation

### Option 1 : Utilisation Directe
1. Ouvrir `index.html` dans un navigateur moderne
2. Commencer à utiliser immédiatement

### Option 2 : Serveur Web Local
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Accéder à http://localhost:8000
```

### Option 3 : PWA (Progressive Web App)
1. Ouvrir l'application dans Chrome/Edge/Safari
2. Menu → "Installer l'application"
3. Utiliser comme app native

## 📱 Utilisation

1. **Créer un Profil** : Onglet "Profil" → Renseigner les informations
2. **Saisir les Tests** : Onglet "Saisie Tests" → Remplir les valeurs
3. **Analyser** : Onglet "Dashboard" → Visualiser les résultats
4. **Suivre** : Onglet "Historique" → Comparer l'évolution
5. **Partager** : Onglet "Données" → Générer un rapport

## 🔧 Structure des Fichiers

```
golf-tracker/
├── index.html              # Page principale
├── styles.css              # Styles CSS
├── app-light.js            # Application JavaScript
├── baremes.js              # Barèmes et protocoles
├── manifest.json           # Configuration PWA
├── logo_bastian.png        # Logo
├── tpi_certifie.png        # Certification TPI
└── cf3ec629...jpg          # Photo de profil
```

## 📊 Technologies

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec variables CSS
- **JavaScript Vanilla** : Aucune dépendance externe
- **LocalStorage API** : Persistance des données
- **Canvas API** : Graphiques radar et évolution
- **PWA** : Manifest et Service Worker ready

## 📞 Contact

**Bastian MAS**
- Email: [bastianmas@gmail.com](mailto:bastianmas@gmail.com)
- Téléphone: [06 18 77 85 82](tel:+33618778582)
- Instagram: [@babas.prepa.physique](https://www.instagram.com/babas.prepa.physique)
- Facebook: [facebook.com/bastianmas](https://www.facebook.com/bastianmas)

## 🏌️ Expertise

- **Préparateur Physique** : École de Golf Mont Griffon (95)
- **C.R.E Ligue Paris-IDF** : FFGolf interligue U12
- **Certifié TPI Level 1** : Titleist Performance Institute
- **15+ ans d'expérience** : EPS et Préparation Physique
- **Speedgolf** : Niveau mondial

## ⚖️ Licence

© 2024 Bastian MAS - Tous droits réservés

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024
