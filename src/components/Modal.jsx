import { useContext } from 'react'
import { useGlobalContext } from '../context'

const Modal = () => {
  const { selectedMeal, closeModal } = useGlobalContext()
  const {
    strMealThumb: image,
    strMeal: title,
    strInstructions: text,
    strSource: source,
  } = selectedMeal
  return (
    <aside className='modal-overlay'>
      <div className='modal-container'>
        <img src={image} alt={title} className='img modal-img' />
        <h4>{title}</h4>
        <p>Cooking Instructions</p>
        <p>{text}</p>
        <a href={source} target='_blank'>
          origin source
        </a>
        <button onClick={closeModal}>close</button>
        <div className='modal-content'></div>
      </div>
    </aside>
  )
}

export default Modal
