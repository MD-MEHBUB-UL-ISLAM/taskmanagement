import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Task, Priority, Status, Category } from '../../core/models/task.model';
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

  tasks = toSignal(this.taskStore.tasks$, { initialValue: [] });
  loading = toSignal(this.taskStore.loading$, { initialValue: false });

  filterStatus = signal<Status | 'all'>('all');
  filterPriority = signal<Priority | 'all'>('all');
  filterCategory = signal<Category | 'all'>('all');
  searchTerm = signal('');

  priorities = Object.values(Priority);
  statuses = Object.values(Status);
  categories = Object.values(Category);

  filteredTasks = computed(() => {
    let tasks = this.sortTasks(this.tasks());

    if (this.filterStatus() !== 'all') {
      tasks = tasks.filter(task => task.status === this.filterStatus());
    }

    if (this.filterPriority() !== 'all') {
      tasks = tasks.filter(task => task.priority === this.filterPriority());
    }

    if (this.filterCategory() !== 'all') {
      tasks = tasks.filter(task => task.category === this.filterCategory());
    }

    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description?.toLowerCase().includes(term) || false) ||
        task.location.toLowerCase().includes(term)
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

  getCategoryColor(category: Category): string {
    switch (category) {
      case Category.Workshop: return 'bg-purple-100 text-purple-800';
      case Category.Seminar: return 'bg-indigo-100 text-indigo-800';
      case Category.Social: return 'bg-pink-100 text-pink-800';
      case Category.ClubMeetings: return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusColor(status: Status): string {
    switch (status) {
      case Status.Draft: return 'bg-gray-100 text-gray-800';
      case Status.Todo: return 'bg-blue-100 text-blue-800';
      case Status.InProgress: return 'bg-yellow-100 text-yellow-800';
      case Status.Completed: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  onDeleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskStore.deleteTask(id);
    }
  }

  onCloneTask(id: string) {
    if (confirm('Create a copy of this task? The copy will be set to Draft status.')) {
      this.taskStore.cloneTask(id);
    }
  }


  onQuickClone(task: Task) {
    this.taskStore.cloneTask(task.id);
  }

  exportToCSV() {
    const tasks = this.tasks();
    const headers = ['Title', 'Description', 'Priority', 'Status', 'Category', 'Location', 'Attendees', 'Due Date', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...tasks.map(task => [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        task.priority,
        task.status,
        task.category,
        `"${task.location.replace(/"/g, '""')}"`,
        task.attendees,
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