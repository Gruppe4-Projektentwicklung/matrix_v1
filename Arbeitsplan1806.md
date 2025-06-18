# Arbeitsplan: Multiseitentool – Implementierung React Router

Dieser Plan fasst die notwendigen Schritte zusammen, um die bestehende React-App
in ein mehrseitiges Tool umzubauen. Abgeschlossene Punkte können wir im Verlauf
ausklammern oder abhaken.

1. [ ] **React Router installieren und Grundsetup einrichten**
   - `npm install react-router-dom`
   - `<BrowserRouter>` in `main.tsx` bzw. `App.tsx` einbinden

2. [ ] **Seitenstruktur anlegen**
   - Ordner `src/pages/` erstellen
   - Einzelseiten: `Home.tsx`, `Upload.tsx`, `Bewertung.tsx`, `Ranking.tsx`, evtl. `Statistik.tsx`

3. [ ] **Routen konfigurieren**
   - In `App.tsx` die `<Routes>` definieren
   - Jede neue Seite als `<Route path=\"...\" element={<.../>} />` einbinden

4. [ ] **Navigation implementieren**
   - Ein Menü oder Header mit Links (`<NavLink>`) zu den Seiten erstellen

5. [ ] **Bestehende Komponenten in die jeweiligen Seiten verschieben**
   - Upload‑Komponenten auf `Upload.tsx`
   - Gewichtungs- und Ranking-Komponenten auf `Bewertung` bzw. `Ranking`

6. [ ] **Gemeinsamen Zustand teilen**
   - React Context oder andere State‑Management‑Lösung, um Daten (z. B. Upload-Ergebnisse) zwischen den Seiten zu verwenden

7. [ ] **Fehler- und 404-Seite hinzufügen**

8. [ ] **Optional: Lazy Loading/Code-Splitting**
   - Für größere Seiten `React.lazy` einsetzen, um die Startzeit zu verkürzen

9. [ ] **Schrittweise abhaken und bei Abschluss hier ausklammern**
   - Beispiel: `[x] React Router installieren`

10. [ ] **Finaler End-to-End-Test aller Routen und Funktionen**
