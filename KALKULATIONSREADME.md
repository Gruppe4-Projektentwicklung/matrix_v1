# Berechnung des Rankings

Dieses Dokument beschreibt, wie das Backend die Rangfolge der Ideen ermittelt.

1. **Dateien laden**
   - Die Ideensammlung und die Kombinationsliste werden aus den gewählten Excel-Dateien geladen. Eigene Uploads werden zuerst in der Session gesucht, danach im globalen Ordner.
2. **Ideen filtern**
   - Nur die vom Nutzer aktivierten Ideen fließen in die Berechnung ein.
3. **Kombinationen auswerten**
   - Für jede Kombination wird die Formel aus der Excel-Tabelle ausgewertet. Fehlt ein Wert, wird `NaN` verwendet.
   - Steht bei einer Kombination die Richtung auf „low“, gilt ein niedriger Wert als besser und das Ergebnis wird invertiert.
4. **Gewichtung**
   - Jede Kombination erhält eine Gewichtung zwischen 0 und 5. Werte von 0 bedeuten, dass die Kombination ignoriert wird.
   - Die berechneten Kombinationswerte werden mit ihrer Gewichtung multipliziert.
5. **Score berechnen**
   - Alle gewichteten Werte einer Idee werden aufsummiert und durch die Summe der verwendeten Gewichte geteilt.
   - Das ergibt den endgültigen **Matrixscore**.
6. **Ranking erstellen**
   - Die Ideen werden nach ihrem Score absteigend sortiert. Daraus entsteht das Ranking.

Das Backend stellt die Ergebnisse als Liste von Objekten bereit:
```json
{
  "id": "ID der Idee",
  "name": "Titel",
  "beschreibung": "Beschreibung",
  "score": 12.3,
  "details": { "Kombi_1": 5.5, ... }
}
```
Diese Daten nutzt das Frontend, um die Rangliste anzuzeigen und als CSV zu exportieren.
