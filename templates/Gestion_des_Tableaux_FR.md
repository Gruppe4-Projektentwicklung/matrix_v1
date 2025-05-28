# Utilisation des tableaux

Ce document explique la structure des fichiers Excel utilisés pour l’évaluation matricielle des idées.

## 🧠 Collection d'idées (`ideen_template.xlsx`)

| Ligne | Signification |
|-------|----------------|
| 1     | ID de colonne (non gras, ex. `#t_fr#1`, `#-#1`, `#1#1`) |
| 2     | Étiquettes (gras + ligne en bas) |
| 3+    | Lignes de données à remplir ou remplacer

### Formats d’ID :
- `#t_fr#1` → Champ texte en français (ex. nom de l’idée)
- `#t_en#1`, `#t_de#1` → Équivalents en anglais et allemand
- `#-#1` → Attribut numéro 1 (ex. émissions de CO2)
- `#+#1` → Unité associée (ex. `[kg]`)
- `#1#1` → Critère 1 de l’évaluation ronde 1 (Oui/Non)
- `#1#0` → Moyenne de la ronde 1
- `#2#1` → Critère 1 de la ronde 2 (échelle 1–10)
- `#2#0` → Moyenne de la ronde 2

---

## 🧮 Tableau de combinaisons (`kombis_template.xlsx`)

| Ligne | Description |
|-------|-------------|
| 1     | ID (non gras) |
| 2     | Étiquettes (gras + ligne) |
| 3+  | Data rows with examples and formulas (Example entries are for illustration only and should be replaced with your own data) |


### Colonnes :
- `#t_fr#1`, `#t_en#1`, `#t_de#1` → Titre
- `#t_fr#2`, `#t_en#2`, `#t_de#2` → Description
- `#t_fr#3`, `#t_en#3`, `#t_de#3` → Texte explicatif de la formule
- `Formel_ID` → Formule mathématique avec ID d’attribut (ex. `#-#2 + (#-#1 * #-#3)`)
- `Richtung` → Direction d’évaluation :
  - `high` = plus c’est élevé, mieux c’est
  - `low` = plus c’est bas, mieux c’est
- `Kombi_ID` → ID interne, non affichée

