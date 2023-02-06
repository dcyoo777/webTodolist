import moment from "moment"
import { Category, Task } from "./type"

export const parseTask = (task: Task) => {
    return {
        ...task, 
        order: Number(task.order),
        ...(task.startDate && {startDate: moment(task.startDate).format("YYYY-MM-DDTHH:mm")}),
        ...(task.endDate && {endDate: moment(task.endDate).format("YYYY-MM-DDTHH:mm")}),
    }
}

export const parseCategory = (category: Category) => {
    return {
        ...category, 
        order: Number(category.order),
    }
}