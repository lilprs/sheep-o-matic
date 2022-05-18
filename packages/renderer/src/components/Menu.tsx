import clsx from 'clsx'
import { useStore } from '../database'

type Props = {
  animal_type: 'sheep' | 'goat'
  onAnimalTypeChange: (
    animal_type: 'sheep' | 'goat'
  ) => void
  switchScreen: (screen: string) => void
}

export function Menu(props: Props) {
  const store = useStore()
  const toggleAnimalType = () => {
    if (props.animal_type === 'sheep') {
      props.onAnimalTypeChange('goat')
    } else {
      props.onAnimalTypeChange('sheep')
    }
  }
  return (
    <div className="sh-menu">
      <button
        className={clsx({
          'sh-menu__animal-switcher': true,
          'sh-menu__animal-switcher--sheep':
            props.animal_type === 'sheep',
          'sh-menu__animal-switcher--goat':
            props.animal_type === 'goat',
        })}
        onClick={toggleAnimalType}
      >
        <img src="./../assets/sheep.png" />
        <div>
          <div></div>
        </div>
        <img src="./../assets/goat.png" />
      </button>
      <div
        className={clsx({
          'sh-menu__items': true,
          'sh-menu__items--sheep':
            props.animal_type === 'sheep',
          'sh-menu__items--goat':
            props.animal_type === 'goat',
        })}
      >
        <div className="sh-menu__item sh-menu__item--birth">
          <button
            className="sh-menu__item__button"
            onClick={() => props.switchScreen('birth')}
          >
            <img src="./../assets/sheep.png" />
            <img src="./../assets/goat.png" />
            <img src="./../assets/birth.png" />
          </button>
          Urodzenie
        </div>
        <div className="sh-menu__item sh-menu__item--purchase">
          <button
            className="sh-menu__item__button"
            onClick={() => props.switchScreen('purchase')}
          >
            <img src="./../assets/sheep.png" />
            <img src="./../assets/goat.png" />

            <svg
              className="sh-buy-arrow"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 172 172"
            >
              <g transform="">
                <g
                  fill="none"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  style={{
                    mixBlendMode: 'normal',
                  }}
                >
                  <path
                    d="M0,172v-172h172v172z"
                    fill="none"
                  ></path>
                  <g fill="currentColor">
                    <path d="M144.66275,66.67688c-0.86101,1.94379 -2.7868,3.19745 -4.91275,3.19813h-26.875v96.75c0,2.96853 -2.40647,5.375 -5.375,5.375h-43c-2.96853,0 -5.375,-2.40647 -5.375,-5.375v-96.75h-26.875c-2.1283,0.00076 -4.0566,-1.25434 -4.91753,-3.20073c-0.86093,-1.9464 -0.49232,-4.21746 0.94003,-5.79164l53.75,-59.125c1.04442,-1.07444 2.47909,-1.68064 3.9775,-1.68064c1.49841,0 2.93308,0.6062 3.9775,1.68064l53.75,59.125c1.43181,1.57572 1.79859,3.84806 0.93525,5.79425z"></path>
                  </g>
                  <path d="" fill="none"></path>
                </g>
              </g>
            </svg>
          </button>
          Kupno
        </div>
        <div className="sh-menu__item sh-menu__item--sell">
          <button
            className="sh-menu__item__button"
            onClick={() => props.switchScreen('sell')}
          >
            <img src="./../assets/sheep.png" />
            <img src="./../assets/goat.png" />

            <svg
              className="sh-sell-arrow"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 172 172"
            >
              <g transform="">
                <g
                  fill="none"
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  strokeLinecap="butt"
                  strokeLinejoin="miter"
                  strokeMiterlimit="10"
                  strokeDasharray=""
                  strokeDashoffset="0"
                  fontFamily="none"
                  fontWeight="none"
                  fontSize="none"
                  textAnchor="none"
                  style={{
                    mixBlendMode: 'normal',
                  }}
                >
                  <path
                    d="M0,172v-172h172v172z"
                    fill="none"
                  ></path>
                  <g fill="currentColor">
                    <path d="M144.66275,66.67688c-0.86101,1.94379 -2.7868,3.19745 -4.91275,3.19813h-26.875v96.75c0,2.96853 -2.40647,5.375 -5.375,5.375h-43c-2.96853,0 -5.375,-2.40647 -5.375,-5.375v-96.75h-26.875c-2.1283,0.00076 -4.0566,-1.25434 -4.91753,-3.20073c-0.86093,-1.9464 -0.49232,-4.21746 0.94003,-5.79164l53.75,-59.125c1.04442,-1.07444 2.47909,-1.68064 3.9775,-1.68064c1.49841,0 2.93308,0.6062 3.9775,1.68064l53.75,59.125c1.43181,1.57572 1.79859,3.84806 0.93525,5.79425z"></path>
                  </g>
                  <path d="" fill="none"></path>
                </g>
              </g>
            </svg>
          </button>
          Sprzedaż
        </div>
        <div className="sh-menu__item sh-menu__item--death">
          <button
            className="sh-menu__item__button"
            onClick={() => props.switchScreen('death')}
          >
            <img src="./../assets/sheep.png" />
            <img src="./../assets/goat.png" />
            <img src="./../assets/death.png" />
          </button>
          Zgon
        </div>
        <div className="sh-menu__item sh-menu__item--search">
          <button
            className="sh-menu__item__button"
            onClick={() => props.switchScreen('search')}
          >
            <img src="./../assets/sheep.png" />
            <img src="./../assets/goat.png" />
            <img src="./../assets/search.png" />
          </button>
          Baza
        </div>
        <div className="sh-menu__item sh-menu__item--settings">
          <button
            className="sh-menu__item__button"
            onClick={() => props.switchScreen('settings')}
          >
            <img src="./../assets/settings.png" />
          </button>
          Ustawienia
        </div>
      </div>
      <p className="sh-menu__stats">
        Zwierząt w bazie: {store.animals.length} / Owiec:{' '}
        {
          store.animals.filter((a) => a.species === 'sheep')
            .length
        }{' '}
        / Kóz:{' '}
        {
          store.animals.filter((a) => a.species === 'goat')
            .length
        }
      </p>
      <div className="authors">
        <p>Sheep-O-Matic v1.0 made with ❤️ by:</p>
        <div>
          <div className="adam-zajac">
            <img src="./../assets/adam_zajac.png" />
            <img src="./../assets/hare.png" />
          </div>
          <div className="lilian-prus">
            <img src="./../assets/black_moomin_transparent.png" />
            <div>
              <b>Lilian</b>
              <br />
              <span>Prus</span>
              <i>Moomin Hippo</i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
