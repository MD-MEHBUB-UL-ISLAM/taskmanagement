import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Task, TaskFormData } from '../models/task.model';
import { TaskService } from './task.service';
import { tap, switchMap, catchError, EMPTY } from 'rxjs';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class TaskStore extends ComponentStore<TaskState> {
  private taskService = inject(TaskService);

  readonly tasks$ = this.select(state => state.tasks);
  readonly loading$ = this.select(state => state.loading);
  readonly error$ = this.select(state => state.error);

  constructor() {
    super({ tasks: [], loading: false, error: null });
    this.loadTasks();
  }

  readonly loadTasks = this.effect<void>((trigger$) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          tap({
            next: (tasks) => this.patchState({ tasks, loading: false }),
            error: (error) => this.patchState({ error: error.message, loading: false })
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly createTask = this.effect<TaskFormData>((task$) =>
    task$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap((taskData) =>
        this.taskService.createTask(taskData).pipe(
          tap({
            next: (newTask) => this.patchState(state => ({
              tasks: [...state.tasks, newTask],
              loading: false
            })),
            error: (error) => this.patchState({ error: error.message, loading: false })
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly updateTaskEffect = this.effect<{ id: string; taskData: TaskFormData }>((updates$) =>
    updates$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(({ id, taskData }) =>
        this.taskService.updateTask(id, taskData).pipe(
          tap({
            next: (updatedTask) => this.patchState(state => ({
              tasks: state.tasks.map(task => task.id === id ? updatedTask : task),
              loading: false
            })),
            error: (error) => this.patchState({ error: error.message, loading: false })
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  readonly deleteTask = this.effect<string>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap((id) =>
        this.taskService.deleteTask(id).pipe(
          tap({
            next: () => this.patchState(state => ({
              tasks: state.tasks.filter(task => task.id !== id),
              loading: false
            })),
            error: (error) => this.patchState({ error: error.message, loading: false })
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );


  readonly cloneTask = this.effect<string>((id$) =>
    id$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap((id) =>
        this.taskService.cloneTask(id).pipe(
          tap({
            next: (clonedTask) => this.patchState(state => ({
              tasks: [...state.tasks, clonedTask],
              loading: false
            })),
            error: (error) => this.patchState({ error: error.message, loading: false })
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );

  // Optional: Clone with modifications
  readonly cloneTaskWithModifications = this.effect<{ id: string; modifications: Partial<TaskFormData> }>((data$) =>
    data$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(({ id, modifications }) =>
        this.taskService.cloneTaskWithModifications(id, modifications).pipe(
          tap({
            next: (clonedTask) => this.patchState(state => ({
              tasks: [...state.tasks, clonedTask],
              loading: false
            })),
            error: (error) => this.patchState({ error: error.message, loading: false })
          }),
          catchError(() => EMPTY)
        )
      )
    )
  );
}