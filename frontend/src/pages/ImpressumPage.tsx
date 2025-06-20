import React from 'react';
import { PageContainer } from '../components/PageContainer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export const ImpressumPage: React.FC = () => (
  <PageContainer>
    <Typography variant="h5" component="h1" mb={4} textAlign="center">
      Impressum
    </Typography>
    <Box className="space-y-4">
      <Typography>
        <strong>Angaben gemäß § 5 TMG:</strong>
      </Typography>
      <Typography>
        Verantwortlich für den Inhalt dieser Webseite und der Ideen-Bewertungs-Matrix:<br/>
        Gregor Kordowich<br/>
        c/o Technische Hochschule Würzburg-Schweinfurt (THWS)<br/>
        Röntgenring 8<br/>
        97070 Würzburg
      </Typography>
      <Typography>
        E-Mail: <a href="mailto:gregor.kordowich@study.thws.de" className="text-blue-600 underline">gregor.kordowich@study.thws.de</a>
      </Typography>
      <Typography>
        <strong>Gruppenzugehörigkeit:</strong><br/>
        Team Sustainabuild (ehemals Gruppe4-Projektentwicklung)<br/>
        Gruppe 4 der Projektarbeit im B6-B7 zur Entwicklung eines Produktes der Nachhaltigkeit<br/>
        Sommersemester 2025 und Wintersemester 2026<br/>
        Studiengang Bauingenieurwesen
      </Typography>
      <Typography>
        <strong>Verantwortlich gemäß § 55 Abs. 2 RStV:</strong><br/>
        Gregor Kordowich, c/o THWS, Röntgenring 8, 97070 Würzburg
      </Typography>
      <Typography>
        <strong>Hinweis:</strong><br/>
        Dies ist eine studentische Projektwebsite im Rahmen einer Pflichtarbeit an der THWS. Für den Inhalt der „Ideen-Bewertungs-Matrix“ ist der oben genannte Verantwortliche zuständig.
      </Typography>
      <Typography>
        Alle Angaben und Ergebnisse, die durch die Nutzung der Ideen-Bewertungs-Matrix erzeugt werden, dienen ausschließlich zu Studien- und Demonstrationszwecken. Es wird keine Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen und Berechnungsergebnisse übernommen.
      </Typography>
      <Typography>
        Für Schäden materieller oder ideeller Art, die durch die Nutzung oder Nichtnutzung der angebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen oder durch die Eingabe eigener Daten verursacht werden, wird keine Haftung übernommen.
      </Typography>
      <Typography>
        Bitte beachten Sie, dass die eingegebenen Daten und die daraus resultierenden Ergebnisse ausschließlich im Rahmen des Projekts verwendet werden und keine rechtlich verbindlichen Empfehlungen oder Bewertungen darstellen.
      </Typography>
    </Box>
  </PageContainer>
);

export default ImpressumPage;
