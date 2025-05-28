import './App.css'

import { BewertungsOptionen } from './components/BewertungsOptionen'
import { CollectionSelector } from './components/CollectionSelector'
import { ExportRankingButton } from './components/ExportRankingButton'
import { IdeenSelector } from './components/IdeenSelector'
import { KombiInfoModal } from './components/KombiInfoModal'
import { Ranking } from './components/Ranking'
import { SaveRunSuccess } from './components/SaveRunSuccess'
import { StatistikForm } from './components/StatistikForm'
import StatusToast from './components/StatusToast' // <-- Einziger default export!
import { WeightingSelector } from './components/WeightingSelector'

function App() {
  return (
    <div className="app-wrapper">
      <h1>Matrix Bewertungstool</h1>
      
      <CollectionSelector />
      <IdeenSelector />
      <BewertungsOptionen />
      <WeightingSelector />
      <Ranking />
      <ExportRankingButton />
      <StatistikForm />
      <SaveRunSuccess />
      <KombiInfoModal />
      <StatusToast />

      {/* Weitere Komponenten/Seiten kannst du hier einbauen */}
    </div>
  )
}

export default App
