import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'categorys',//home
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'tasks',
    loadComponent: () => import('./pages/task/tasks/tasks.page').then( m => m.TasksPage)
  },
  {
    path: 'categorys',
    loadComponent: () => import('./pages/category/categorys/categorys.page').then( m => m.CategorysPage)
  }
]
