import { useState } from 'react'
import { Birth } from './components/Birth'
import { Menu } from './components/Menu'
import { AnimalSpecies } from './database'
import { Toaster } from 'react-hot-toast'
import { Purchase } from './components/Purchase'
import { Sell } from './components/Sell'
import { Death } from './components/Death'

const App = () => {
  const [species, setSpecies] =
    useState<AnimalSpecies>('sheep')
  const [screen, setScreen] = useState<string>('menu')
  return (
    <div>
      <Menu
        animal_type={species}
        onAnimalTypeChange={setSpecies}
        switchScreen={(screen) => {
          setScreen(screen)
        }}
      />
      <Birth
        species={species}
        open={screen === 'birth'}
        onClose={() => setScreen('menu')}
      />
      <Purchase
        species={species}
        open={screen === 'purchase'}
        onClose={() => setScreen('menu')}
      />
      <Sell
        species={species}
        open={screen === 'sell'}
        onClose={() => setScreen('menu')}
      />
      <Death
        species={species}
        open={screen === 'death'}
        onClose={() => setScreen('menu')}
      />
      <Toaster />
    </div>
  )
}

export default App
