import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./components/task-list/task-list.component').then(c => c.TaskListComponent),
    title: 'Task Management - All Tasks'
  },
  { 
    path: 'create', 
    loadComponent: () => import('./components/task-form/task-form.component').then(c => c.TaskFormComponent),
    title: 'Create New Task'
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./components/task-form/task-form.component').then(c => c.TaskFormComponent),
    title: 'Edit Task'
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];