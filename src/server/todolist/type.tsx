export type Category = {
  categoryId: number;
  name: string;
  order: string | number;
  color: string;
}

export type Task = {
  taskId: number;
  categoryId: number;
  title: string;
  content: string;
  order: string | number;
  color: string;
  startDate: string;
  endDate: string;
}