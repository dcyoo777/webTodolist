import { Category, Task } from './type';
import { todolistServer } from './todolistServer';
import { camelCase } from 'src/utils/objectUtil';
import { parseCategory, parseTask } from './util';

// Category
const getCategories = async (): Promise<Category[]> => {
  const response = await todolistServer.get(`/api/v1/categories`);
  return camelCase(response.data).map((item: Category) => parseCategory(item));
}

const getCategoryById = async (request: {
  params: {
    categoryId: number;
  }
}): Promise<Category> => {
  const response = await todolistServer.get(`/api/v1/categories/${request.params.categoryId}`);
  return parseCategory(camelCase(response.data));
}

const createCategory = async (request: {
  body: {
    name: string;
    color?: string;
  }
}): Promise<Category> => {
  const response = await todolistServer.post(`/api/v1/categories`, request.body);
  return parseCategory(camelCase(response.data));
}

const reorderCategory = async (request: {
  params: {
    categoryId: number;
  },
  body: {
    followingCategoryId?: number;
  }
}): Promise<Category> => {
  const response = await todolistServer.post(`/api/v1/categories/${request.params.categoryId}/reorder`, request.body);
  return parseCategory(camelCase(response.data));
}

const updateCategory = async (request: {
  params: {
    categoryId: number;
  },
  body: {
    name: string;
    color?: string;
  }
}): Promise<Category> => {
  const response = await todolistServer.put(`/api/v1/categories/${request.params.categoryId}`, request.body);
  return parseCategory(camelCase(response.data));
}

const deleteCategory = async (request: {
  params: {
    categoryId: number;
  }
}): Promise<Category> => {
  const response = await todolistServer.delete(`/api/v1/categories/${request.params.categoryId}`);
  return parseCategory(camelCase(response.data));
}

// Task
const getTasks = async (): Promise<Task[]> => {
  const response = await todolistServer.get(`/api/v1/tasks`);
  return camelCase(response.data).map((item: Task) => parseTask(item));
}

const getTaskById = async (request: {
  params: {
    taskId: number;
  }
}): Promise<Task> => {
  const response = await todolistServer.get(`/api/v1/tasks/${request.params.taskId}`);
  const result = camelCase(response.data);
  return parseTask(result);
}

const createTask = async (request: {
  query: {
    categoryId: number;
  };
  body: {
    title: string;
    content: string;
    color?: string;
    startDate?: string;
    endDate?: string;
  };
}): Promise<Task> => {
  const response = await todolistServer.post(`/api/v1/tasks?categoryId=${request.query.categoryId}`, request.body);
  const result = camelCase(response.data);
  return parseTask(result);
}

const reorderTask = async (request: {
  params: {
    taskId: number;
  },
  body: {
    categoryId: number;
    followingTaskId?: number;
  }
}): Promise<Task> => {
  const response = await todolistServer.post(`/api/v1/tasks/${request.params.taskId}/reorder`, request.body);
  const result = camelCase(response.data);
  return parseTask(result);
}

const updateTask = async (request: {
  params: {
    taskId: number;
  },
  body: {
    title: string;
    content: string;
    color?: string;
    startDate?: string;
    endDate?: string;
  }
}): Promise<Task> => {
  const allows = ['title', 'content', 'color', 'startDate', 'endDate']
  type Obj = {
    [key: string]: any;
  };
  const obj = request.body as Obj
  const keys: string[] = Object.keys(request.body).filter(key => allows.includes(key));
  const body = keys.reduce((acc, cur: string) => {
    const newObj = {...acc, ...(obj[cur] && {[cur]: obj[cur]})}
    return newObj
  }, {})
  const response = await todolistServer.put(`/api/v1/tasks/${request.params.taskId}`, body);
  const result = camelCase(response.data);
  return parseTask(result);
}

const deleteTask = async (request: {
  params: {
    taskId: number;
  }
}): Promise<void> => {
  const response = await todolistServer.delete(`/api/v1/tasks/${request.params.taskId}`);
  return;
}

export { 
  getCategories as getCategoriesFromServer,
  getCategoryById as getCategoryByIdFromServer,
  createCategory as createCategoryFromServer,
  reorderCategory as reorderCategoryFromServer,
  updateCategory as updateCategoryFromServer,
  deleteCategory as deleteCategoryFromServer,
  getTasks as getTasksFromServer,
  getTaskById as getTaskByIdFromServer,
  createTask as createTaskFromServer,
  reorderTask as reorderTaskFromServer,
  updateTask as updateTaskFromServer,
  deleteTask as deleteTaskFromServer,
};
