import { Injectable, inject } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Task, TaskFormData, Priority, Status, Category } from '../models/task.model';
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
      createdAt: new Date('2023-07-10T10:00:00Z'),
      category: Category.Workshop,
      location: 'Conference Room A',
      attendees: 25
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: 'Review documentation',
      description: 'Go through the technical documentation and provide feedback.',
      priority: Priority.Medium,
      status: Status.InProgress,
      dueDate: new Date('2024-01-15'),
      createdAt: new Date('2023-07-01T09:00:00Z'),
      category: Category.Seminar,
      location: 'Main Auditorium',
      attendees: 150
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174002',
      title: 'Team meeting preparation',
      description: 'Prepare agenda and materials for the weekly team meeting.',
      priority: Priority.Low,
      status: Status.Completed,
      dueDate: new Date('2023-12-20'),
      createdAt: new Date('2023-06-28T14:00:00Z'),
      category: Category.ClubMeetings,
      location: 'Team Room 3',
      attendees: 12
    }
  ];


    getTasks(): Observable<Task[]> {
    return of(this.tasks).pipe(delay(500));
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
      this.tasks[index] = { 
        ...this.tasks[index], 
        ...taskData 
      };
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


  getHighAttendanceTasks(minAttendees: number = 50): Observable<Task[]> {
    const filteredTasks = this.tasks.filter(task => task.attendees >= minAttendees);
    return of(filteredTasks).pipe(delay(300));
  }

  getTotalAttendeesByCategory(): Observable<{category: Category, total: number}[]> {
    const categoryTotals = this.tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + task.attendees;
      return acc;
    }, {} as Record<Category, number>);

    const result = Object.entries(categoryTotals).map(([category, total]) => ({
      category: category as Category,
      total
    }));

    return of(result).pipe(delay(200));
  }

  cloneTask(id: string): Observable<Task> {
    const originalTask = this.tasks.find(t => t.id === id);
    if (!originalTask) {
      throw new Error('Task not found');
    }

    const clonedTask: Task = {
      ...originalTask,
      id: uuidv4(),
      title: `${originalTask.title} (Copy)`,
      status: Status.Draft,
      dueDate: new Date(originalTask.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };

    this.tasks.push(clonedTask);
    return of(clonedTask).pipe(delay(300));
  }


  cloneTaskWithModifications(id: string, modifications: Partial<TaskFormData>): Observable<Task> {
    const originalTask = this.tasks.find(t => t.id === id);
    if (!originalTask) {
      throw new Error('Task not found');
    }

    const clonedTask: Task = {
      ...originalTask,
      id: uuidv4(),
      status: Status.Draft,
      createdAt: new Date(),
      ...modifications
    };

    this.tasks.push(clonedTask);
    return of(clonedTask).pipe(delay(300));
  }
}