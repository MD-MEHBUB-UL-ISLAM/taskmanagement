// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskFormComponent } from './components/task-form/task-form.component';

export const routes: Routes = [
  { 
    path: '', 
    component: TaskListComponent,
    title: 'Task Management - All Tasks'
  },
  { 
    path: 'create', 
    component: TaskFormComponent,
    title: 'Create New Task'
  },
  { 
    path: 'edit/:id', 
    component: TaskFormComponent,
    title: 'Edit Task'
  },
  { 
    path: '**', 
    redirectTo: '',
    pathMatch: 'full'
  }
];