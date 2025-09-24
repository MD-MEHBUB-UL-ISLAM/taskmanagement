// src/app/core/models/task.model.ts
export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum Status {
  Todo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
  createdAt: Date;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
}