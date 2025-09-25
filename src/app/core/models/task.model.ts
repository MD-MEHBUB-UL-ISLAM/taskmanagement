export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export enum Status {
  Draft = 'Draft',
  Todo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

export enum Category {
  Workshop = 'Workshop',
  Seminar = 'Seminar',
  Social = 'Social',
  ClubMeetings = 'Club Meetings'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
  createdAt: Date;
  category: Category;
  location: string;
  attendees: number;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
  category: Category;
  location: string;
  attendees: number;
}