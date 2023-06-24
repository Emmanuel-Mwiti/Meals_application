import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AppContext = React.createContext()

const allMealsUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php'

const getFavortiesFromLocalStorage = () => {
  let favorites = localStorage.getItem('favorites')
  if (favorites) {
    favorites = JSON.parse(localStorage.getItem('favorites'))
  } else {
    favorites = []
  }
  return favorites
}

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [meals, setMeals] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [favorites, setFavorites] = useState(getFavortiesFromLocalStorage())

  const fetchMeal = async (url) => {
    setLoading(true)
    try {
      const { data } = await axios(url)

      if (data.meals) {
        setMeals(data.meals)
      } else {
        setMeals([])
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  const fetchRandomMeal = () => {
    fetchMeal(randomMealUrl)
  }

  const selectMeal = (idMeal, favoriteMeal) => {
    let meal
    if (favoriteMeal) {
      meal = favorites.find((meal) => meal.idMeal === idMeal)
    } else {
      meal = meals.find((meal) => meal.idMeal === idMeal)
    }

    setSelectedMeal(meal)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }
  const addToFavorites = (idMeal) => {
    const alreadyFavorites = favorites.find((meal) => meal.idMeal === idMeal)
    if (alreadyFavorites) return
    const meal = meals.find((meal) => meal.idMeal === idMeal)
    const updateFavorites = [...favorites, meal]
    setFavorites(updateFavorites)
    localStorage.setItem('favorites', JSON.stringify(updateFavorites))
  }

  const removeFromFavorites = (idMeal) => {
    const updatedfavorites = favorites.filter((meal) => meal.idMeal !== idMeal)
    setFavorites(updatedfavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedfavorites))
  }
  useEffect(() => {
    fetchMeal(allMealsUrl)
  }, [])

  useEffect(() => {
    if (!searchTerm) return
    fetchMeal(`${allMealsUrl}${searchTerm}`)
  }, [searchTerm])

  return (
    <AppContext.Provider
      value={{
        meals,
        loading,
        setSearchTerm,
        fetchRandomMeal,
        showModal,
        selectedMeal,
        selectMeal,
        closeModal,
        addToFavorites,
        removeFromFavorites,
        favorites,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
