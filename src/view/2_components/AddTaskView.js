import './AddTaskView.scss'
import { MdAdd } from "react-icons/md";
import { useContext, useEffect, useRef, useState } from 'react';
import { TodolistContext } from '../3_molecules/TodoList';
import EditTaskView from './EditTaskView';

const initialInput = {
  title: '',
  content: '',
  color: '#add8e6',
}

const AddTaskView = ({categoryId}) => {
  const {addTask} = useContext(TodolistContext)
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

  const addRef = useRef(null)

  if(isEdit){
    return <div ref={ref} className={`add-task-view`}>
      <EditTaskView inputs={inputs} setInputs={setInputs}/>    
      <button className='add-task-view-button' 
        onClick={() => {addTask(categoryId, inputs); setIsEdit(false); setInputs({})}}
        disabled={!inputs.title || !inputs.content}
      >
        Create
      </button>
    </div>
  }else{
    return <div ref={addRef} className={'add-task-view-button-wrapper'} >
      <button className={'add-task-view-add-button'} onClick={() => setIsEdit(true)}>
        <MdAdd/>
      </button>
    </div>
  }
}

export default AddTaskView
