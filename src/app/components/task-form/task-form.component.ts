// src/app/components/task-form/task-form.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task, TaskFormData, Priority, Status } from '../../core/models/task.model';
import { TaskStore } from '../../core/services/task.store';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskStore = inject(TaskStore);
  private taskService = inject(TaskService);

  taskForm: FormGroup;
  priorities = Object.values(Priority);
  statuses = Object.values(Status);
  isEditMode = signal(false);
  currentTaskId = signal<string | null>(null);

  constructor() {
    this.taskForm = this.createForm();
  }

  ngOnInit() {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.isEditMode.set(true);
      this.currentTaskId.set(taskId);
      this.loadTaskForEditing(taskId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      priority: [Priority.Medium, Validators.required],
      status: [Status.Todo, Validators.required],
      dueDate: ['', [Validators.required, this.futureDateValidator]]
    });
  }

  private futureDateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { pastDate: true };
  }

  private loadTaskForEditing(taskId: string) {
    this.taskService.getTask(taskId).subscribe(task => {
      if (task) {
        this.taskForm.patchValue({
          ...task,
          dueDate: this.formatDate(task.dueDate)
        });

        // Apply status transition rules
        if (task.status === Status.Completed) {
          this.taskForm.get('status')?.disable();
        }
      }
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData: TaskFormData = {
        ...formValue,
        dueDate: new Date(formValue.dueDate)
      };

      if (this.isEditMode() && this.currentTaskId()) {
        this.taskStore.updateTaskEffect({
          id: this.currentTaskId()!,
          taskData
        });
      } else {
        this.taskStore.createTask(taskData);
      }

      this.router.navigate(['/']);
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['maxlength']) return `Maximum ${field.errors['maxlength'].requiredLength} characters allowed`;
      if (field.errors['pastDate']) return 'Due date must be in the future';
    }
    return '';
  }

  // Status transition validation
  onStatusChange(newStatus: Status) {
    if (this.isEditMode() && this.currentTaskId()) {
      // Add your status transition logic here if needed
    }
  }
}