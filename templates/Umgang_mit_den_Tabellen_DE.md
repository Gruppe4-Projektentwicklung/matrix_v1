# Umgang mit den Tabellen

Diese Datei erklärt die Struktur der Excel-Tabellen zur Bewertung der Ideen in der Matrix.

## 🧠 Ideensammlung (`ideen_template.xlsx`)

| Zeile | Bedeutung |
|-------|-----------|
| 1     | IDs zur internen Zuordnung (nicht fett, z. B. `#t_de#1`, `#-#1`, `#1#1`) |
| 2     | Sichtbare Spaltennamen (fett + Trennlinie) |
| 3+    | Datenzeilen: Beginnen mit Beispielwerten, können überschrieben werden |

### ID-Formate:
- `#t_de#1` → Textfeld auf Deutsch (z. B. Name der Idee)
- `#t_en#1`, `#t_fr#1` → Entsprechende Texte auf Englisch und Französisch
- `#-#1` → Attribut mit ID 1 (z. B. CO2-Ausstoß)
- `#+#1` → Zugehörige Einheit des Attributs `#-#1` (z. B. `[kg]`)
- `#1#1` → Kriterium 1 aus Runde 1 (Ja/Nein)
- `#1#0` → Durchschnitt aus Runde 1
- `#2#1` → Kriterium 1 aus Runde 2 (Skala 1–10)
- `#2#0` → Durchschnitt aus Runde 2

---

## 🧮 Kombinationstabelle (`kombis_template.xlsx`)

| Zeile | Bedeutung |
|-------|-----------|
| 1     | IDs zur internen Zuordnung (nicht fett) |
| 2     | Sichtbare Spaltennamen (fett + Trennlinie) |
| 3+    | Datenzeilen mit Beispielen und Formeln |

### Spalten:
- `#t_de#1`, `#t_en#1`, `#t_fr#1` → Titel der Kombination
- `#t_de#2`, `#t_en#2`, `#t_fr#2` → Beschreibung
- `#t_de#3`, `#t_en#3`, `#t_fr#3` → Formeltext zur Erklärung
- `Formel_ID` → Mathematische Formel mit Attribut-IDs (z. B. `#-#2 + (#-#1 * #-#3)`)
- `Richtung` → Bewertungsausrichtung:
  - `high` = ein hoher Wert ist gut
  - `low` = ein niedriger Wert ist gut
- `Kombi_ID` → Interne ID (nicht sichtbar im Frontend)
