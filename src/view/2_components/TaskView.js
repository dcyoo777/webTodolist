import './TaskView.scss'
import { MdMode, MdOutlineDelete, MdSave, MdTitle, MdTextFields, MdCalendarToday } from "react-icons/md";
import { useContext, useState } from 'react';
import { TodolistContext } from '../3_molecules/TodoList';
import EditTaskView from './EditTaskView';
import moment from 'moment';
import {Draggable} from 'react-beautiful-dnd'

const TaskView = ({task, index}) => {
  const {
    deleteTask, 
    editTask, 
  } = useContext(TodolistContext)

  const [isEdit, setIsEdit] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [inputs, setInputs] = useState(task)
  
  return <Draggable key={task.taskId} draggableId={`task_${task.taskId}`} index={index} type={'task'}>
    {(provided) => {
      return <div className={`task-view${isEdit ? ' edit' : ''}`} 
      ref={provided.innerRef}
      {...provided.draggableProps} 
      {...provided.dragHandleProps}
      style={{...(task.color && {borderColor: task?.color}), ...provided.draggableProps.style}}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {
        isEdit ?
        <EditTaskView inputs={inputs} setInputs={setInputs}/>
        :
        <>
          <div className='task-view-row'>
            <div className='task-view-icon'><MdTitle /></div>
            <div className='task-view-title'>{task.title}</div>
          </div>
          <div className='task-view-row'>
            <div className='task-view-icon'><MdTextFields /></div>
            <div className='task-view-content'>{task.content}</div>
          </div>
          {task.startDate && task.endDate && <div className='task-view-row'>
            <div className='task-view-icon'><MdCalendarToday /></div>
            <div className='task-view-date'>{moment(task.startDate).format("YYYY.MM.DD.HH:mm")} ~ {moment(task.endDate).format("YYYY.MM.DD.HH:mm")}</div>
          </div>}
        </>
      }
      {
        isHover && !isEdit &&
        <div className='task-view-button-wrapper'>
          <button className='task-view-edit-button' onClick={() => {setIsEdit(true)}}><MdMode/></button>
          
        </div>
      }
      {isEdit && 
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <button className='task-view-save-button' 
            onClick={() => {editTask(inputs); setIsEdit(false); setIsHover(false)}}
            disabled={!inputs.title || !inputs.content}
          ><MdSave/></button>
          <button className='task-view-delete-button' onClick={() => deleteTask(task.taskId)}><MdOutlineDelete/></button>
        </div>
      }
    </div>}}
  </Draggable>
}

TaskView.defaultProps = {};

export default TaskView
