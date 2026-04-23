import { Injectable } from '@angular/core';
import { CategoryDto } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private STORAGE_KEY = 'categories';
  private categories: CategoryDto[] = [];

  constructor() {
    this.load();
  }

  private load() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    this.categories = data ? JSON.parse(data) : [];
  }

  private save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.categories));
  }

  getCategories(): CategoryDto[] {
    return this.categories;
  }

  addCategory(name: string) {
    const newCategory: CategoryDto = {
      id: Date.now(),
      name
    };

    this.categories.push(newCategory);
    this.save();
  }

  editCategory(id: number, name: string) {
    const category = this.categories.find(c => c.id === id);
    if (category) {
      category.name = name;
      this.save();
    }
  }

  deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
    this.save();
  }
}
