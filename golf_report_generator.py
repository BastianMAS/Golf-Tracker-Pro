#!/usr/bin/env python3
"""
GÉNÉRATEUR RAPPORT PDF PROFESSIONNEL
Par Bastian MAS - Préparateur Physique Golf
CRE Paris-IDF & École de Golf Mont Griffon

Structure rapport type fédération :
1. En-tête professionnel + logo
2. Profil joueur + photo  
3. Bilan physique détaillé
4. Analyse TPI + limitations
5. Impact golf chiffré
6. Axes prioritaires + objectifs
7. Recommandations prépa
8. Annexes techniques
"""

from reportlab.lib.pagesizes import A4, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor, black, white
from reportlab.lib.units import cm, inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
import json
from datetime import datetime
import os

class GolfReportGenerator:
    def __init__(self, player_data, tests_data, golf_data=None, injuries_data=None):
        self.player = player_data
        self.tests = tests_data
        self.golf = golf_data or {}
        self.injuries = injuries_data or []
        self.width, self.height = A4
        self.styles = self.create_styles()
        
    def create_styles(self):
        """Styles professionnels pour le rapport"""
        styles = getSampleStyleSheet()
        
        # Style en-tête
        styles.add(ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontSize=24,
            spaceAfter=30,
            textColor=HexColor('#1a4d2e'),
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Style section
        styles.add(ParagraphStyle(
            'SectionHeader',
            parent=styles['Heading1'],
            fontSize=16,
            spaceAfter=12,
            spaceBefore=20,
            textColor=HexColor('#1a4d2e'),
            borderWidth=2,
            borderColor=HexColor('#1a4d2e'),
            borderPadding=8,
            backColor=HexColor('#f0f8ff'),
            fontName='Helvetica-Bold'
        ))
        
        # Style résultats
        styles.add(ParagraphStyle(
            'Result',
            parent=styles['Normal'],
            fontSize=11,
            spaceAfter=6,
            leftIndent=20,
            fontName='Helvetica'
        ))
        
        # Style critique (rouge)
        styles.add(ParagraphStyle(
            'Critical',
            parent=styles['Normal'],
            fontSize=12,
            textColor=HexColor('#e74c3c'),
            fontName='Helvetica-Bold',
            spaceAfter=8
        ))
        
        # Style bon (vert)
        styles.add(ParagraphStyle(
            'Good',
            parent=styles['Normal'],
            fontSize=12,
            textColor=HexColor('#27ae60'),
            fontName='Helvetica-Bold',
            spaceAfter=8
        ))
        
        return styles
    
    def create_header_footer(self, canvas, doc):
        """En-tête et pied de page professionnel"""
        canvas.saveState()
        
        # En-tête
        canvas.setFont('Helvetica-Bold', 14)
        canvas.setFillColor(HexColor('#1a4d2e'))
        canvas.drawString(50, self.height - 40, 'RAPPORT D\'ÉVALUATION PHYSIQUE GOLF')
        
        canvas.setFont('Helvetica', 10)
        canvas.setFillColor(black)
        canvas.drawString(50, self.height - 55, 'Bastian MAS - Préparateur Physique Certifié TPI')
        canvas.drawString(50, self.height - 68, 'C.R.E Ligue Paris-IDF • École de Golf Mont Griffon')
        
        # Ligne de séparation
        canvas.setStrokeColor(HexColor('#1a4d2e'))
        canvas.setLineWidth(2)
        canvas.line(50, self.height - 80, self.width - 50, self.height - 80)
        
        # Pied de page
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(HexColor('#666666'))
        canvas.drawString(50, 30, f'Rapport généré le {datetime.now().strftime("%d/%m/%Y à %H:%M")}')
        canvas.drawRightString(self.width - 50, 30, f'Page {doc.page}')
        
        canvas.restoreState()
    
    def calculate_golf_impact(self, scores):
        """Calcule l'impact des limitations physiques sur le golf"""
        impacts = {
            'distance_loss': 0,
            'accuracy_loss': 0,
            'stroke_penalty': 0,
            'injury_risk': 0,
            'details': []
        }
        
        # Core
        if scores.get('core', 20) < 8:
            impacts['distance_loss'] += 8
            impacts['accuracy_loss'] += 15
            impacts['stroke_penalty'] += 1.8
            impacts['details'].append('Core défaillant → Early Extension + Loss of Posture')
        
        # Mobilité
        if scores.get('mobilite', 20) < 10:
            impacts['distance_loss'] += 15
            impacts['accuracy_loss'] += 10
            impacts['injury_risk'] += 25
            impacts['stroke_penalty'] += 2.1
            impacts['details'].append('Mobilité limitée → Backswing réduit + Compensations')
        
        # Force
        if scores.get('force', 20) < 8:
            impacts['distance_loss'] += 12
            impacts['stroke_penalty'] += 1.5
            impacts['details'].append('Force insuffisante → Manque de puissance')
        
        return impacts
    
    def generate_report(self, output_path):
        """Génère le rapport PDF complet"""
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=50,
            leftMargin=50,
            topMargin=100,
            bottomMargin=50
        )
        
        # Conteneur pour tous les éléments
        story = []
        
        # PAGE 1 - COUVERTURE & PROFIL
        story.extend(self._create_cover_page())
        story.append(PageBreak())
        
        # PAGE 2 - BILAN PHYSIQUE
        story.extend(self._create_physical_assessment())
        story.append(PageBreak())
        
        # PAGE 3 - ANALYSE TPI
        story.extend(self._create_tpi_analysis())
        story.append(PageBreak())
        
        # PAGE 4 - IMPACT GOLF
        story.extend(self._create_golf_impact())
        story.append(PageBreak())
        
        # PAGE 5 - RECOMMANDATIONS
        story.extend(self._create_recommendations())
        
        # Construire PDF
        doc.build(story, onFirstPage=self.create_header_footer, onLaterPages=self.create_header_footer)
        return output_path
    
    def _create_cover_page(self):
        """Page de couverture avec profil joueur"""
        elements = []
        
        # Titre principal
        elements.append(Paragraph('ÉVALUATION PHYSIQUE GOLF', self.styles['CustomTitle']))
        elements.append(Spacer(1, 30))
        
        # Profil joueur
        elements.append(Paragraph('PROFIL DU JOUEUR', self.styles['SectionHeader']))
        
        player_info = [
            ['Nom :', f"{self.player.get('name', 'N/A')}"],
            ['Âge :', f"{self.player.get('age', 'N/A')} ans"],
            ['Sexe :', 'Homme' if self.player.get('gender') == 'M' else 'Femme'],
            ['Handicap :', f"{self.player.get('handicap', 'N/A')}"],
            ['Taille :', f"{self.player.get('height', 'N/A')} cm"],
            ['Poids :', f"{self.player.get('weight', 'N/A')} kg"],
            ['Club :', f"{self.player.get('club', 'N/A')}"],
            ['Niveau :', f"{self.player.get('level', 'N/A')}"]
        ]
        
        table = Table(player_info, colWidths=[3*cm, 6*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), HexColor('#f8f9fa')),
            ('FONT', (0, 0), (-1, -1), 'Helvetica', 11),
            ('FONT', (0, 0), (0, -1), 'Helvetica-Bold', 11),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#ddd')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 10),
            ('RIGHTPADDING', (0, 0), (-1, -1), 10),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 30))
        
        # Date et contexte
        elements.append(Paragraph('CONTEXTE DE L\'ÉVALUATION', self.styles['SectionHeader']))
        elements.append(Paragraph(f"""
        <b>Date d'évaluation :</b> {datetime.now().strftime('%d/%m/%Y')}<br/>
        <b>Lieu :</b> C.R.E Ligue Paris Île-de-France / École de Golf Mont Griffon<br/>
        <b>Évaluateur :</b> Bastian MAS, Préparateur Physique Certifié TPI<br/>
        <b>Objectif :</b> Bilan physique complet orienté performance golf avec identification des axes d'amélioration prioritaires.
        """, self.styles['Normal']))
        
        return elements
    
    def _create_physical_assessment(self):
        """Bilan physique détaillé avec scores"""
        elements = []
        elements.append(Paragraph('BILAN PHYSIQUE DÉTAILLÉ', self.styles['CustomTitle']))
        
        # Calculer scores
        scores = self._calculate_scores()
        
        # Golf Fitness Index
        elements.append(Paragraph('1. GOLF FITNESS INDEX (GFI)', self.styles['SectionHeader']))
        gfi = scores.get('gfi', 0)
        gfi_color = '#27ae60' if gfi >= 75 else '#f39c12' if gfi >= 50 else '#e74c3c'
        
        elements.append(Paragraph(f"""
        <b>Score global : {gfi:.1f}/100</b><br/>
        Niveau : {"Excellent" if gfi >= 75 else "Moyen" if gfi >= 50 else "À améliorer"}
        """, self.styles['Good'] if gfi >= 75 else self.styles['Critical'] if gfi < 50 else self.styles['Normal']))
        
        # Détail par qualité
        elements.append(Paragraph('2. QUALITÉS PHYSIQUES', self.styles['SectionHeader']))
        
        qualities = [
            ('Force', scores.get('force', 0), 25),
            ('Explosivité', scores.get('explosivite', 0), 20),
            ('Mobilité', scores.get('mobilite', 0), 20),
            ('Core', scores.get('core', 0), 15),
            ('Endurance', scores.get('endurance', 0), 10),
            ('Vitesse', scores.get('vitesse', 0), 5),
            ('Équilibre', scores.get('equilibre', 0), 5)
        ]
        
        quality_data = [['Qualité', 'Score /20', 'Niveau', 'Pondération GFI']]
        
        for name, score, weight in qualities:
            if score is None:
                level = "Non testé"
                style = "Normal"
            elif score >= 16:
                level = "Excellent"
                style = "Good"
            elif score >= 12:
                level = "Bon"
                style = "Normal"
            elif score >= 8:
                level = "Moyen"
                style = "Normal"
            else:
                level = "Critique"
                style = "Critical"
                
            quality_data.append([name, f"{score:.1f}" if score else "N/A", level, f"{weight}%"])
        
        table = Table(quality_data, colWidths=[3*cm, 2*cm, 2.5*cm, 2*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#1a4d2e')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 11),
            ('FONT', (0, 1), (-1, -1), 'Helvetica', 10),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#ddd')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        
        elements.append(table)
        
        return elements
    
    def _create_tpi_analysis(self):
        """Analyse TPI avec corrélations swing faults"""
        elements = []
        elements.append(Paragraph('ANALYSE TPI (TITLEIST PERFORMANCE INSTITUTE)', self.styles['CustomTitle']))
        
        # Score TPI global
        tpi_data = self._get_tpi_data()
        total_tests = 16
        passed_tests = sum(1 for test in tpi_data.values() if test == 'pass')
        tpi_percentage = (passed_tests / total_tests) * 100
        
        elements.append(Paragraph('1. SCORE TPI GLOBAL', self.styles['SectionHeader']))
        elements.append(Paragraph(f"""
        <b>Tests réussis : {passed_tests}/{total_tests} ({tpi_percentage:.1f}%)</b><br/>
        Niveau TPI : {"Excellent" if tpi_percentage >= 90 else "Bon" if tpi_percentage >= 70 else "À améliorer"}
        """, self.styles['Good'] if tpi_percentage >= 70 else self.styles['Critical']))
        
        # Tests échoués avec impact swing
        failed_tests = [(test, result) for test, result in tpi_data.items() if result == 'fail']
        
        if failed_tests:
            elements.append(Paragraph('2. LIMITATIONS DÉTECTÉES', self.styles['SectionHeader']))
            
            swing_fault_map = {
                'pelvic-tilt': 'Loss of Posture (66% corrélation TPI)',
                'pelvic-rotation': 'Early Extension (71% corrélation TPI)',
                'torso-rotation': 'Flat Shoulder Plane (58% corrélation TPI)',
                'overhead-squat': 'Sway / Early Extension',
                'toe-touch': 'Early Extension / Loss of Posture',
                'bridge': 'Loss of Posture / Slide'
            }
            
            for test, result in failed_tests[:5]:  # Top 5
                swing_fault = swing_fault_map.get(test, 'Impact sur séquence swing')
                elements.append(Paragraph(f"""
                <b>• {test.replace('-', ' ').title()} : FAIL</b><br/>
                → Swing fault probable : {swing_fault}
                """, self.styles['Critical']))
        
        return elements
    
    def _create_golf_impact(self):
        """Impact chiffré sur le golf"""
        elements = []
        elements.append(Paragraph('IMPACT SUR LA PERFORMANCE GOLF', self.styles['CustomTitle']))
        
        scores = self._calculate_scores()
        impacts = self.calculate_golf_impact(scores)
        
        elements.append(Paragraph('1. IMPACT ESTIMÉ', self.styles['SectionHeader']))
        
        # Tableau récapitulatif impact
        impact_data = [
            ['Métrique', 'Perte estimée', 'Équivalent'],
            ['Distance drive', f"-{impacts['distance_loss']:.0f} mètres", f"≈ {impacts['distance_loss']/4:.1f} clubs"],
            ['Précision fairways', f"-{impacts['accuracy_loss']:.0f}%", f"≈ -{impacts['accuracy_loss']*14/100:.1f} fairways/tour"],
            ['Score', f"+{impacts['stroke_penalty']:.1f} coups/tour", f"≈ +{impacts['stroke_penalty']*18:.0f} coups/18 tours"],
            ['Risque blessure', f"+{impacts['injury_risk']:.0f}%", "Compensations articulaires"]
        ]
        
        table = Table(impact_data, colWidths=[4*cm, 3*cm, 4*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#e74c3c')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 11),
            ('FONT', (0, 1), (-1, -1), 'Helvetica', 10),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#ddd')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 20))
        
        # Détails par limitation
        if impacts['details']:
            elements.append(Paragraph('2. ANALYSE DÉTAILLÉE', self.styles['SectionHeader']))
            for detail in impacts['details']:
                elements.append(Paragraph(f"• {detail}", self.styles['Result']))
        
        return elements
    
    def _create_recommendations(self):
        """Recommandations et axes prioritaires"""
        elements = []
        elements.append(Paragraph('RECOMMANDATIONS & AXES PRIORITAIRES', self.styles['CustomTitle']))
        
        scores = self._calculate_scores()
        
        # Identifier axes prioritaires
        priorities = []
        if scores.get('core', 20) < 10:
            priorities.append(('Core / Stabilité', 'CRITIQUE', 'Risque Early Extension + Loss of Posture'))
        if scores.get('mobilite', 20) < 12:
            priorities.append(('Mobilité', 'HAUTE', 'Limitation amplitude + compensation'))
        if scores.get('force', 20) < 10:
            priorities.append(('Force', 'MOYENNE', 'Manque de puissance globale'))
        
        elements.append(Paragraph('1. AXES PRIORITAIRES (3 PROCHAINS MOIS)', self.styles['SectionHeader']))
        
        for i, (axis, priority, reason) in enumerate(priorities[:3], 1):
            color = '#e74c3c' if priority == 'CRITIQUE' else '#f39c12' if priority == 'HAUTE' else '#27ae60'
            elements.append(Paragraph(f"""
            <b>{i}. {axis} - Priorité {priority}</b><br/>
            Justification : {reason}
            """, self.styles['Critical'] if priority == 'CRITIQUE' else self.styles['Normal']))
        
        elements.append(Spacer(1, 20))
        
        # Objectifs chiffrés
        elements.append(Paragraph('2. OBJECTIFS CHIFFRÉS (12 SEMAINES)', self.styles['SectionHeader']))
        
        objectives = [
            ['Qualité', 'Score actuel', 'Objectif 12 sem', 'Impact golf'],
            ['Core', f"{scores.get('core', 0):.1f}/20", "≥ 14/20", "Réduction Early Extension"],
            ['Mobilité', f"{scores.get('mobilite', 0):.1f}/20", "≥ 16/20", "+5-8m distance drive"],
            ['GFI Global', f"{scores.get('gfi', 0):.1f}/100", "≥ 75/100", "-1.2 coups/tour estimé"]
        ]
        
        table = Table(objectives, colWidths=[3*cm, 2.5*cm, 2.5*cm, 3.5*cm])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), HexColor('#27ae60')),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold', 10),
            ('FONT', (0, 1), (-1, -1), 'Helvetica', 9),
            ('GRID', (0, 0), (-1, -1), 1, HexColor('#ddd')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(table)
        
        elements.append(Spacer(1, 20))
        
        # Signature
        elements.append(Paragraph('3. SUIVI & CONTACT', self.styles['SectionHeader']))
        elements.append(Paragraph("""
        <b>Réévaluation recommandée :</b> 8-12 semaines<br/>
        <b>Contact préparateur :</b> bastian.mas@golf-paris.fr<br/>
        <b>Suivi personnalisé :</b> Disponible sur rendez-vous
        """, self.styles['Normal']))
        
        elements.append(Spacer(1, 40))
        elements.append(Paragraph("""
        <b>Bastian MAS</b><br/>
        Préparateur Physique Certifié TPI<br/>
        C.R.E Ligue Paris Île-de-France<br/>
        École de Golf Mont Griffon
        """, self.styles['Normal']))
        
        return elements
    
    def _calculate_scores(self):
        """Calcule tous les scores à partir des données de tests"""
        # Simplifié pour l'exemple - à adapter selon structure réelle des données
        return {
            'gfi': 68.5,
            'force': 12.4,
            'explosivite': 8.2,
            'mobilite': 6.8,
            'core': 4.1,
            'endurance': 14.6,
            'vitesse': 11.2,
            'equilibre': 9.8
        }
    
    def _get_tpi_data(self):
        """Récupère données TPI - à adapter selon structure réelle"""
        return {
            'pelvic-tilt': 'fail',
            'pelvic-rotation': 'fail', 
            'torso-rotation': 'pass',
            'overhead-squat': 'fail',
            'toe-touch': 'pass',
            'bridge': 'fail'
        }

def generate_demo_report():
    """Génère un rapport de démonstration"""
    
    # Données exemple
    player_data = {
        'name': 'Jean Dupont',
        'age': 42,
        'gender': 'M',
        'handicap': 8.5,
        'height': 178,
        'weight': 82,
        'club': 'Golf de Villarceaux',
        'level': 'Compétiteur Série 1'
    }
    
    tests_data = {
        'force': {'bench': 75, 'squat': 95, 'deadlift': 110},
        'explosivite': {'cmj': 28, 'broad': 2.1},
        'mobilite': {'hip_rot': 35, 'thoracic': 45},
        'core': {'plank': 45, 'side_plank': {'left': 25, 'right': 30}}
    }
    
    golf_data = {
        'vmax_driver': 118,
        'ball_speed': 165,
        'smash_factor': 1.40
    }
    
    # Générer rapport
    generator = GolfReportGenerator(player_data, tests_data, golf_data)
    output_path = '/mnt/user-data/outputs/rapport_golf_professionnel_demo.pdf'
    
    try:
        generator.generate_report(output_path)
        print(f"✅ Rapport généré avec succès : {output_path}")
        return output_path
    except Exception as e:
        print(f"❌ Erreur génération rapport : {e}")
        return None

if __name__ == "__main__":
    generate_demo_report()
