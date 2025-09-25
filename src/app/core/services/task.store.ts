
import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, tap } from 'rxjs';
import { Task, TaskFormData, Priority, Status } from '../models/task.model';
import { TaskService } from './task.service';


interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class TaskStore extends ComponentStore<TaskState> {
  private taskService = inject(TaskService);

  constructor() {
    super(initialState);
    this.loadTasks();
  }

  readonly tasks$ = this.select(state => this.sortTasks(state.tasks));
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);
  readonly setLoading = this.updater((state, loading: boolean) => ({
    ...state,
    loading
  }));

  readonly setError = this.updater((state, error: string | null) => ({
    ...state,
    error
  }));

  readonly setTasks = this.updater((state, tasks: Task[]) => ({
    ...state,
    tasks,
    loading: false,
    error: null
  }));

  readonly addTask = this.updater((state, task: Task) => ({
    ...state,
    tasks: [...state.tasks, task]
  }));

  readonly updateTask = this.updater((state, updatedTask: Task) => ({
    ...state,
    tasks: state.tasks.map(task => task.id === updatedTask.id ? updatedTask : task)
  }));

  readonly removeTask = this.updater((state, taskId: string) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== taskId)
  }));


  readonly loadTasks = this.effect((trigger$: Observable<void>) => 
    trigger$.pipe(
      tap(() => {
        this.setLoading(true);
        this.setError(null);
      }),
      tap(() => {
        this.taskService.getTasks().subscribe({
          next: (tasks) => this.setTasks(tasks),
          error: (error) => this.setError('Failed to load tasks')
        });
      })
    )
  );

  readonly createTask = this.effect((taskData$: Observable<TaskFormData>) =>
    taskData$.pipe(
      tap(() => this.setLoading(true)),
      tap((taskData) => {
        this.taskService.createTask(taskData).subscribe({
          next: (task) => this.addTask(task),
          error: (error) => this.setError('Failed to create task'),
          complete: () => this.setLoading(false)
        });
      })
    )
  );

  readonly updateTaskEffect = this.effect((data$: Observable<{id: string, taskData: TaskFormData}>) =>
    data$.pipe(
      tap(() => this.setLoading(true)),
      tap(({id, taskData}) => {
        this.taskService.updateTask(id, taskData).subscribe({
          next: (task) => this.updateTask(task),
          error: (error) => this.setError('Failed to update task'),
          complete: () => this.setLoading(false)
        });
      })
    )
  );

  readonly deleteTask = this.effect((taskId$: Observable<string>) =>
    taskId$.pipe(
      tap((taskId) => {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => this.removeTask(taskId),
          error: (error) => this.setError('Failed to delete task')
        });
      })
    )
  );


  private sortTasks(tasks: Task[]): Task[] {
    const priorityOrder = { [Priority.High]: 3, [Priority.Medium]: 2, [Priority.Low]: 1 };
    
    return [...tasks].sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }
}