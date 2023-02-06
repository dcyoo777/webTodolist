import './TodoList.scss';
import {createContext, useCallback, useEffect, useState} from 'react';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CategoryView from './CategoryView';
import { createCategoryFromServer, createTaskFromServer, deleteCategoryFromServer, deleteTaskFromServer, getCategoriesFromServer, getTasksFromServer, reorderCategoryFromServer, reorderTaskFromServer, updateCategoryFromServer, updateTaskFromServer } from 'src/server/todolist/todolistAPI';
import _ from 'lodash'
import AddCategory from '../2_components/AddCategory';

const initialTodolistContextValue = {
  addCategory: () => {},
  deleteCategory: () => {},
  editCategory: () => {},
  moveCategory: () => {},
  reorderCategory: () => {},
  movingTaskId: 0,
  setMovingTaskId: () => {},  
  addTask: () => {},
  deleteTask: () => {},
  editTask: () => {},
  moveTask: () => {},
  reorderTask: () => {},
}

export const TodolistContext = createContext(initialTodolistContextValue)

const TodoList = function ({isReady}) {
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [movingTaskId, setMovingTaskId] = useState(0)

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

  const moveCategory = useCallback(async(fromCategory, toCategory) => {
    setCategories(categories => {
      const currentFromCategory = categories.find(category => category.categoryId === fromCategory.categoryId)
      const targetCategoryIndex = categories.findIndex(category => category.categoryId === toCategory.categoryId);
      const direction = currentFromCategory.order > toCategory.order ? -1 : 1
      let updateCategory;
      if(targetCategoryIndex === 0){
        updateCategory = {...fromCategory, order: toCategory.order / 2}
      }else if(targetCategoryIndex === categories.length - 1){
        updateCategory = {...fromCategory, order: toCategory.order + 60}
      }else{
        updateCategory = {...fromCategory, order: (categories[targetCategoryIndex + direction].order + toCategory.order) / 2}
      }
      return _.orderBy(categories.map(category => {
        if(category.categoryId === updateCategory.categoryId){
          return updateCategory;
        }
        return category;
      }), 'order')
    })
  }, [])

  const reorderCategory = useCallback(async(categoryId) => {
    const targetCategoryIndex = categories.findIndex(cagegory => cagegory.categoryId === categoryId)
    reorderCategoryFromServer({params: {categoryId}, body: {
        ...(targetCategoryIndex !== categories.length - 1 && {followingCategoryId: categories[targetCategoryIndex + 1].categoryId})
    }}).finally(() => {
      getCategoriesFromServer().then(res => setCategories(res))
    })
  }, [categories])

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
    console.log(inputs)
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

  const moveTask = useCallback(async(fromTask, toTask) => {
    setTasks(tasks => {
      const currentFromTask = tasks.find(task => task.taskId === fromTask.taskId)
      const targetCategoryTasks = tasks.filter(task => task.categoryId === toTask.categoryId);
      const targetTaskIndex = targetCategoryTasks.findIndex(task => task.taskId === toTask.taskId);
      let direction = 1
      if(toTask.categoryId === fromTask.categoryId){
        direction = currentFromTask.order > toTask.order ? -1 : 1
      } else {
        direction = 1 
      }
      let updateCategory;
      if(targetTaskIndex === 0){
        updateCategory = {...fromTask, categoryId: toTask.categoryId, order: toTask.order / 2}
      }else if(targetTaskIndex === targetCategoryTasks.length - 1){
        updateCategory = {...fromTask, categoryId: toTask.categoryId, order: toTask.order + 60}
      }else{
        updateCategory = {...fromTask, categoryId: toTask.categoryId, order: (targetCategoryTasks[targetTaskIndex + direction].order + toTask.order) / 2}
      }
      return _.orderBy(tasks.map(task => {
        if(task.taskId === updateCategory.taskId){
          return updateCategory;
        }
        return task;
      }), 'order')
    })
  }, [])

  const reorderTask = useCallback(async(taskId) => {
    const targetTask = tasks.find(task => task.taskId === taskId)
    const targetCategoryTasks = tasks.filter(task => task.categoryId === targetTask.categoryId)
    const targetCategoryIndex = targetCategoryTasks.findIndex(task => task.taskId === taskId)
    reorderTaskFromServer({params: {taskId}, body: {
        categoryId: targetTask.categoryId,
        ...(targetCategoryIndex !== targetCategoryTasks.length - 1 && {followingTaskId: targetCategoryTasks[targetCategoryIndex + 1].taskId})
    }}).finally(() => {
      getTasksFromServer().then(res => setTasks(res))
    })
  }, [tasks])

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
      moveCategory, reorderCategory,
      movingTaskId, setMovingTaskId,
      addTask, deleteTask, editTask,
      moveTask, reorderTask,
    }}>
      <DndProvider backend={HTML5Backend}>
        <div className='todo-list'>
          {categories.map(category => <CategoryView category={category} 
            key={category.categoryId} 
            tasks={tasks.filter(task => task.categoryId === category.categoryId)}
          />)}
          <AddCategory />
        </div>
      </DndProvider>
    </TodolistContext.Provider>
    
  );
};

export default TodoList;
