import './CategoryView.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { MdMode, MdOutlineDelete, MdSave } from "react-icons/md";
import EditCategoryView from '../2_components/EditCategoryView';
import { TodolistContext } from './TodoList';
import { useDrag, useDrop } from 'react-dnd';
import TaskView from '../2_components/TaskView';
import AddTaskView from '../2_components/AddTaskView';

const CategoryView = function ({category, tasks}) {
  const {deleteCategory, editCategory, moveCategory, reorderCategory} = useContext(TodolistContext)

  const [isEdit, setIsEdit] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [inputs, setInputs] = useState(category)

  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setInputs(category)
        setIsEdit(false)
        setIsHover(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, category])

  const [{ handlerId }, drop] = useDrop({
    accept: 'category',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if(item.categoryId === category.categoryId){
        return
      }
      moveCategory(item, category)
    },
    drop(item){
      // setMovingcategoryId(0)
      reorderCategory(category.categoryId)
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'category',
    item: () => ({...category}),
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })

  drag(drop(ref))

  return <div ref={ref} 
      className='category-view' 
      style={{...(category.color && {borderColor: category.color, backgroundColor: `rgba($color: ${category.color}, $alpha: 0.5)`})}}
      data-handler-id={handlerId}
    >
    {
      isEdit ? 
        <>
          <EditCategoryView inputs={inputs} setInputs={setInputs}/> 
          <div>
            <button className='category-view-save-button' onClick={() => {editCategory(inputs); setIsEdit(false); setIsHover(false)}}><MdSave/></button>
            <button className='category-view-delete-button' onClick={() => deleteCategory(category.categoryId)}><MdOutlineDelete/></button>
          </div>
        </>
      :
        <>
          <h1 className='category-view-name'>{category.name}</h1>
          {tasks.map(task => <TaskView key={task.taskId} task={task}/>)}
          <AddTaskView categoryId={category.categoryId}/>
        </>
    }
    {!isEdit && <div className='category-view-button-wrapper' 
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}>
      {isHover && 
        <button className='category-view-edit-button' onClick={() => setIsEdit(true)}><MdMode/></button>
      }
    </div>}
  </div>    
};

export default CategoryView;

