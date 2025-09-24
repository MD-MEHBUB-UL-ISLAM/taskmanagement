// src/app/core/services/task.service.ts
import { Injectable, inject } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Task, TaskFormData, Priority, Status } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Complete project proposal',
      description: 'Draft and finalize the project proposal for client review.',
      priority: Priority.High,
      status: Status.Todo,
      dueDate: new Date('2025-12-01'),
      createdAt: new Date('2023-07-10T10:00:00Z')
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Review documentation',
      description: 'Go through the technical documentation and provide feedback.',
      priority: Priority.Medium,
      status: Status.InProgress,
      dueDate: new Date('2024-01-15'),
      createdAt: new Date('2023-07-01T09:00:00Z')
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      title: 'Team meeting preparation',
      description: 'Prepare agenda and materials for the weekly team meeting.',
      priority: Priority.Low,
      status: Status.Completed,
      dueDate: new Date('2023-12-20'),
      createdAt: new Date('2023-06-28T14:00:00Z')
    }
  ];

  getTasks(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(500)); // Simulate API delay
  }

  getTask(id: string): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === id);
    return of(task).pipe(delay(200));
  }

  createTask(taskData: TaskFormData): Observable<Task> {
    const newTask: Task = {
      id: uuidv4(),
      createdAt: new Date(),
      ...taskData
    };
    this.tasks.push(newTask);
    return of(newTask).pipe(delay(300));
  }

  updateTask(id: string, taskData: TaskFormData): Observable<Task> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...taskData };
      return of(this.tasks[index]).pipe(delay(300));
    }
    throw new Error('Task not found');
  }

  deleteTask(id: string): Observable<void> {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    throw new Error('Task not found');
  }
}