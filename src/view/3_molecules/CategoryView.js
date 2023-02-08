import './CategoryView.scss';
import { useContext, useState } from 'react';
import { MdMode, MdOutlineDelete, MdSave } from "react-icons/md";
import EditCategoryView from '../2_components/EditCategoryView';
import { TodolistContext } from './TodoList';
import TaskView from '../2_components/TaskView';
import AddTaskView from '../2_components/AddTaskView';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const CategoryView = function ({category, tasks, index}) {
  const {deleteCategory, editCategory} = useContext(TodolistContext)

  const [isEdit, setIsEdit] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [inputs, setInputs] = useState(category)

  return <Draggable key={category.categoryId} draggableId={`category_${category.categoryId}`} index={index} type={'category'}>
    {(provided) => <div ref={provided.innerRef}
      {...provided.draggableProps} 
      {...provided.dragHandleProps}
      style={{...provided.draggableProps.style}}>
      <Droppable droppableId={`category_${category.categoryId}`} type={'task'}>
        {(provided) => <div className='category-view' 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            style={{...(category.color && {borderColor: category.color, backgroundColor: `rgba($color: ${category.color}, $alpha: 0.5)`})}}
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
                {tasks.map((task, index) => <TaskView key={task.taskId} task={task} index={index}/>)}
                {provided.placeholder}
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
        </div>}
      </Droppable>
    </div>}
  </Draggable>
};

export default CategoryView;

