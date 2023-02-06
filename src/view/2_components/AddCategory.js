import './AddCategory.scss'
import { useContext, useEffect, useRef, useState } from 'react';
import EditCategoryView from './EditCategoryView';
import { TodolistContext } from '../3_molecules/TodoList';

const initialInput = {
  name: '',
  color: '#add8e6',
}

const AddCategory = () => {
  const {addCategory} = useContext(TodolistContext)
  const [isEdit, setIsEdit] = useState(false)
  const [inputs, setInputs] = useState(initialInput)
  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setInputs(initialInput)
        setIsEdit(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref])

  if(isEdit){
    return <div ref={ref} className={`add-category-view`} style={{borderColor: inputs.color}}>
      <EditCategoryView inputs={inputs} setInputs={setInputs}/>    
      <button className='add-task-view-button' 
        onClick={() => {addCategory(inputs); setIsEdit(false); setInputs(initialInput)}}
        disabled={!inputs.name}
      >
        Create
      </button>
    </div>
  }else{
    return <div>
      <button className='add-category-button' onClick={() => setIsEdit(true)}>
        Add category
      </button>
    </div>
  }
}

export default AddCategory
