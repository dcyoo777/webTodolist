import './TaskView.scss'
import { MdMode, MdOutlineDelete, MdSave, MdTitle, MdTextFields, MdCalendarToday } from "react-icons/md";
import { useContext, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { TodolistContext } from '../3_molecules/TodoList';
import EditTaskView from './EditTaskView';
import moment from 'moment';

const TaskView = ({task}) => {
  const {
    movingTaskId, 
    setMovingTaskId, 
    deleteTask, 
    editTask, 
    moveTask, 
    reorderTask
  } = useContext(TodolistContext)

  const [isEdit, setIsEdit] = useState(false)
  const [isHover, setIsHover] = useState(false)
  const [inputs, setInputs] = useState(task)

  const ref = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setInputs(task)
        setIsEdit(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, task])

  const [{ handlerId }, drop] = useDrop({
    accept: 'task',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if(item.taskId === task.taskId){
        return
      }
      moveTask(item, task)
    },
    drop(item){
      setMovingTaskId(0)
      reorderTask(task.taskId)
    }
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: () => ({...task}),
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      }
    },
  })
  
  const opacity = movingTaskId === task.taskId ? 0.5 : 1

  drag(drop(ref))

  useEffect(() => {
    if(isDragging){
      setMovingTaskId(task.taskId)
    }else{
      setMovingTaskId(0)
    }
  }, [task, isDragging, setMovingTaskId])

  return <div className={`task-view${isEdit ? ' edit' : ''}`} 
    ref={ref}
    style={{...(task.color && {borderColor: task?.color}), opacity}}
    onMouseEnter={() => setIsHover(true)}
    onMouseLeave={() => setIsHover(false)}
    data-handler-id={handlerId}
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
        <button className='task-view-edit-button' onClick={() => setIsEdit(true)}><MdMode/></button>
        
      </div>
    }
    {isEdit && 
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button className='task-view-save-button' 
          onClick={() => {editTask(inputs); setIsEdit(false);}}
          disabled={!inputs.title || !inputs.content}
        ><MdSave/></button>
        <button className='task-view-delete-button' onClick={() => deleteTask(task.taskId)}><MdOutlineDelete/></button>
      </div>
    }
    
    
  </div>
}

TaskView.defaultProps = {};

export default TaskView
