import './TodoList.scss';
import {createContext, useCallback, useEffect, useState} from 'react';
import CategoryView from './CategoryView';
import { createCategoryFromServer, createTaskFromServer, deleteCategoryFromServer, deleteTaskFromServer, getCategoriesFromServer, getTasksFromServer, reorderCategoryFromServer, reorderTaskFromServer, updateCategoryFromServer, updateTaskFromServer } from 'src/server/todolist/todolistAPI';
import _ from 'lodash'
import AddCategory from '../2_components/AddCategory';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

const initialTodolistContextValue = {
  addCategory: () => {},
  deleteCategory: () => {},
  editCategory: () => {},
  addTask: () => {},
  deleteTask: () => {},
  editTask: () => {},
}

export const TodolistContext = createContext(initialTodolistContextValue)

const TodoList = function ({isReady}) {
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [isShowAddCategory, setIsShowCategory] = useState(true);

  const addCategory = useCallback(async(inputs) => {
      const {name, color} = inputs;
      const result = await createCategoryFromServer({
          body: {name, color}
      })
      setCategories(prev => [...prev, result])
  }, [])
  
  const deleteCategory = useCallback(async(categoryId) => {
      try{
          await deleteCategoryFromServer({params: {categoryId}});
          setCategories(prev => prev.filter(Category => Category.categoryId !== categoryId))
      }catch(e){}
  }, [])
  
  const editCategory = useCallback(async(inputs) => {
    const {categoryId, name, color} = inputs
    const result = await updateCategoryFromServer({
        params: {categoryId},
        body: {name, color}
    })
    if(result){
        setCategories(prev => prev.map(item => {
        if(result.categoryId !== item.categoryId){
            return item
        }
        return result
        }))
    }
  }, [])

  const addTask = useCallback(async(categoryId, inputs) => {
    const result = await createTaskFromServer({
      query: {categoryId},
      body: inputs
    })
    setTasks(prev => [...prev, result])
  }, [])

  const deleteTask = useCallback(async(taskId) => {
    try{
      await deleteTaskFromServer({params: {taskId}});
      setTasks(prev => prev.filter(task => task.taskId !== taskId))
    }catch(e){}
  }, [])

  const editTask = useCallback(async(inputs) => {
    const {taskId, ...rest} = inputs
    const result = await updateTaskFromServer({
      params: {taskId},
      body: {...rest}
    })
    if(result){
      setTasks(prev => prev.map(item => {
        if(result.taskId !== item.taskId){
          return item
        }
        return result
      }))
    }
  }, [])

  const dropTask = (draggableId, droppableId, index) => {
    const taskId = Number(draggableId.split('_')[1]);
    const fromTask = tasks.find(task => task.taskId === taskId);
    const categoryId = Number(droppableId.split('_')[1]);
    const targetCategoryTasks = tasks.filter(task => task.categoryId === categoryId && task.taskId !== taskId);
    const followingTaskId = targetCategoryTasks.length > index ? targetCategoryTasks[index].taskId : undefined
    
    let updateTask;

    if(!followingTaskId){
      updateTask = {...fromTask, categoryId, order: (targetCategoryTasks[targetCategoryTasks.length - 1]?.order ?? 0) + 60}
    } else if (index === 0){
      updateTask = {...fromTask, categoryId, order: targetCategoryTasks[0].order / 2}
    } else {
      const targetIndex = targetCategoryTasks.findIndex(task => task.taskId === followingTaskId)
      updateTask = {...fromTask, categoryId, order: ((targetCategoryTasks[targetIndex - 1]?.order ?? 0) + targetCategoryTasks[targetIndex].order) / 2}
    }

    setTasks(prev => {
      return _.orderBy(prev.map(item => {
        if(updateTask.taskId !== item.taskId){
          return item
        }
        return updateTask
      }), 'order')
    })

    reorderTaskFromServer({params: {taskId}, body: {
      categoryId,
      followingTaskId
    }}).finally(() => {
      getTasksFromServer().then(res => setTasks(res))
    })
  }

  const dropCategory = (draggableId, index) => {
    const categoryId = Number(draggableId.split('_')[1]);
    const fromCategory = categories.find(category => category.categoryId === categoryId);
    const categoriesWithoutDrag = categories.filter(category => category.categoryId !== categoryId);
    const followingCategoryId = categoriesWithoutDrag.length > index ? categoriesWithoutDrag[index].categoryId : undefined
    
    let updateCategory;

    if(!followingCategoryId){
      updateCategory = {...fromCategory, order: (categoriesWithoutDrag[categoriesWithoutDrag.length - 1]?.order ?? 0) + 60}
    } else if (index === 0){
      updateCategory = {...fromCategory, order: categoriesWithoutDrag[0].order / 2}
    } else {
      const targetIndex = categoriesWithoutDrag.findIndex(category => category.categoryId === followingCategoryId)
      updateCategory = {...fromCategory, order: ((categoriesWithoutDrag[targetIndex - 1]?.order ?? 0) + categoriesWithoutDrag[targetIndex].order) / 2}
    }

    setCategories(prev => _.orderBy(prev.map(item => {
      if(updateCategory.categoryId !== item.categoryId){
        return item
      }
      return updateCategory
    }), 'order'))

    reorderCategoryFromServer({params: {categoryId}, body: {
      followingCategoryId
    }}).finally(() => {
      getCategoriesFromServer().then(res => setCategories(res))
    })
  }

  const onDragEnd = (result) => {
    setIsShowCategory(true)
    if (!result.destination) {
      return;
    }

    const {droppableId, index} = result.destination
    const {draggableId} = result

    if(draggableId.includes('task') && droppableId.includes('category')){
      dropTask(draggableId, droppableId, index)
    } else if (draggableId.includes('category') && droppableId === 'todolist'){
      dropCategory(draggableId, index)
    }
  }

  const onDragStart = (result) => {
    if(result.draggableId.includes('category')){
      setIsShowCategory(false)
    }
  }

  useEffect(() => {
    if(isReady){
      getCategoriesFromServer().then(res => setCategories(res))
    }
  }, [isReady])

  useEffect(() => {
    if(categories.length){
      getTasksFromServer().then(res => setTasks(res))
    }
  }, [categories])

  return (
    <TodolistContext.Provider value={{
      addCategory, deleteCategory, editCategory,
      addTask, deleteTask, editTask,
    }}>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId={`todolist`} type={'category'} direction={'horizontal'}>
          {(provided) => <div className='todo-list'             
            ref={provided.innerRef} 
            {...provided.droppableProps}
          >
            {categories.map((category, index) => <CategoryView category={category} 
              key={category.categoryId} 
              tasks={tasks.filter(task => task.categoryId === category.categoryId)}
              index={index}
            />)}
            {provided.placeholder}
            {isShowAddCategory && <AddCategory />}
          </div>}
        </Droppable>
      </DragDropContext>
    </TodolistContext.Provider>
    
  );
};

export default TodoList;
