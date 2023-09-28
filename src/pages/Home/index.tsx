import { useEffect, useState } from 'react'

import styles from './styles.module.css'
import { Photo } from '../../models/Photo'
import { searchPhotos } from '../../services/PhotoService'
import { PacmanLoader } from 'react-spinners'
import ResultCard from '../../components/ResultCard'
import { useContext } from 'react'
import { Result } from '../../models/Result'
import searchIcon from '../../assets/img/search.png'
import { UserContext } from '../../context/UserContext'

const Home = () => {
  const [loading, isLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [newSearch, isNewSearch] = useState(false)
  const {lastResult, setLastResult, query, setQuery} = useContext(UserContext)
  const [menuOrientationOpen, setMenuOrientatioOpen] = useState(false)
  const [menuRelevanceOpen, setMenuRelevanceOpen] = useState(false)
  const [orientation, setOrientation] = useState('landscape')
  const [relevance, setRelevance] = useState('relevance')

  const toggleMenuOrientation = () =>{
    setMenuOrientatioOpen(!menuOrientationOpen)
  }

  const toggleMenuRelevance = () =>{
    setMenuRelevanceOpen(!menuRelevanceOpen)
  }

  const setValueOrientation = (orientationValue: string) => {
    setOrientation(orientationValue)
  }

  const setValueRelevance = (relevanceValue: string) => {
    setRelevance(relevanceValue)
  }

  const searchResults = async () => {
    if (query.trim()) {
      console.log('Entrou')
      isLoading(true)
      setLastResult({
        photos: [],
        totalPages: 0,
      })
      const searchResult = await searchPhotos(query, relevance, page, orientation)
      console.log(searchResult)
      setLastResult(searchResult)
      isLoading(false)
    }
  }

  useEffect(() => {
    console.log('Entrou no useEffect 1')
    searchResults()
  }, [page])

  useEffect(() => {
    if(newSearch) {
      console.log('Entrou no useEffect 2')
      setPage(1)
      searchResults()
      isNewSearch(false)
    }
  }, [newSearch])

  return (
    <div className={styles.container}>
      <div className={styles.searchArea}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type='text'
          className={styles.searchInput}
        />
        <button onClick={() => isNewSearch(true)} className={styles.searchButton}>
          Pesquisar
        </button>

        <button onClick={() => isNewSearch(true)} className={styles.responsiveSearchButton}>
          <img src={searchIcon} alt="Pesquisar" />
        </button>
        
        <div className={styles.dropDownContainer}>
          <button onClick={toggleMenuOrientation} className={styles.dropDownButton}>
            Orientação
          </button>
          {menuOrientationOpen && (
            <>
            <ul className={styles.dropDownMenu}>
            <li onClick={ async () => {
               setValueOrientation('landscape')
               toggleMenuOrientation()
               isNewSearch(true)
              }}>Paisagem</li>
            <li onClick={async () => {
              setValueOrientation('portrait')
              toggleMenuOrientation()
              isNewSearch(true)
              }}>Retrato</li>
          </ul>
          </>
          )}
        </div>

        <div className={styles.dropDownContainer}>
          <button onClick={toggleMenuRelevance} className={styles.dropDownButton}>
            Ordenar por
          </button>
          {menuRelevanceOpen && (
            <>
            <ul className={styles.dropDownMenu}>
              <li onClick={async () => {
              setValueRelevance('relevance')
              toggleMenuRelevance()
              isNewSearch(true)
          }
            }>Relevância</li>
              <li onClick={async () => {
              setValueRelevance('latest')
              toggleMenuRelevance()
              isNewSearch(true)
              }}>Mais recente</li>
            </ul>
            </>
            
          )}
        </div>
      </div>

      <PacmanLoader color='#fff' loading={loading} />

      {!loading && lastResult.photos.length > 0 && (
        <>
          <div className={styles.resultsArea}>
            {lastResult.photos.map((p: Photo) => (
              <ResultCard key={p.id} photo={p} />
            ))}
          </div>

          <div>
            {page > 1 && (
              <button className={styles.pageButton} onClick={() => setPage(page - 1)}>Anterior</button>
            )}
            <span className={styles.currentPageLabel} >Página {page}</span>
            {page < lastResult.totalPages && (
              <button className={styles.pageButton}  onClick={() => setPage(page + 1)}>Próxima</button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Home
