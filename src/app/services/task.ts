import { Injectable } from '@angular/core';
import { TaskDto } from '../models/task.model';
import { CategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private STORAGE_KEY = 'tasks';
  private STORAGE_KEY_2 = 'categories';

  private tasks: TaskDto[] = [];
  private categories : CategoryDto [] = [];
  constructor() {
    this.load();
  }

  private load() {debugger
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.tasks = data ? JSON.parse(data) : [];

    const data2 = localStorage.getItem(this.STORAGE_KEY_2);//Para actualizar
    this.categories = data2 ? JSON.parse(data2) : [];
  }

  private save() {debugger
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
  }

  getTasks(): TaskDto[] {debugger
    return this.tasks;
  }

  addTask(title: string, categoryId?: number) {debugger
    const newTask: TaskDto = {
      id: Date.now(),
      title,
      completed: false,
      categoryId
    };

    this.tasks.push(newTask);
    this.save();
  }

  toggleTask(id: number) {debugger
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      this.save();
    }
  }

  editTask(id: number, title: string, categoryId : number) {debugger
    this.load();//actualizamos posibles nuevas categorias en la data

    const task = this.tasks.find(c => c.id === id);
    const category = this.categories.find(c => c.id === categoryId);

    if (task) {
      task.title = title;
      task.categoryId = category?.id;
      this.save();
    }
  }

  deleteTask(id: number) {debugger
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
  }
}
