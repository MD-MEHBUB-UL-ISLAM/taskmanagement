import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Task, Priority, Status } from '../../core/models/task.model';
import { TaskStore } from '../../core/services/task.store';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent {
  private taskStore = inject(TaskStore);

  // convert store observables into signals
  tasks = toSignal(this.taskStore.tasks$, { initialValue: [] });
  loading = toSignal(this.taskStore.loading$, { initialValue: false });

  filterStatus = signal<Status | 'all'>('all');
  filterPriority = signal<Priority | 'all'>('all');
  searchTerm = signal('');

  priorities = Object.values(Priority);
  statuses = Object.values(Status);

  // now filters react to signals + tasks
  filteredTasks = computed(() => {
    let tasks = this.sortTasks(this.tasks());

    if (this.filterStatus() !== 'all') {
      tasks = tasks.filter(task => task.status === this.filterStatus());
    }

    if (this.filterPriority() !== 'all') {
      tasks = tasks.filter(task => task.priority === this.filterPriority());
    }

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description?.toLowerCase().includes(term) || false)
      );
    }

    return tasks;
  });

  isOverdue(task: Task): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today && task.status !== Status.Completed;
  }

  getPriorityColor(priority: Priority): string {
    switch (priority) {
      case Priority.High: return 'bg-red-100 text-red-800';
      case Priority.Medium: return 'bg-orange-100 text-orange-800';
      case Priority.Low: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  onDeleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskStore.deleteTask(id);
    }
  }

  exportToCSV() {
    const tasks = this.tasks();
    const headers = ['Title', 'Description', 'Priority', 'Status', 'Due Date', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.priority,
        task.status,
        task.dueDate.toISOString().split('T')[0],
        task.createdAt.toISOString().split('T')[0]
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tasks.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private sortTasks(tasks: Task[]): Task[] {
    const priorityOrder = { [Priority.High]: 3, [Priority.Medium]: 2, [Priority.Low]: 1 };
    return [...tasks].sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }
}
