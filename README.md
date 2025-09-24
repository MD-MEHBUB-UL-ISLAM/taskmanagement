📋 Task Management App
A modern, feature-rich task management application built with Angular 19 that helps you organize your tasks efficiently with beautiful UI and powerful functionality.

https://img.shields.io/badge/Angular-19-DD0031?style=for-the-badge&logo=angular
https://img.shields.io/badge/TypeScript-5.5-blue?style=for-the-badge&logo=typescript
https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css

https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80

✨ Features
🎯 Core Functionality
✅ Complete CRUD Operations - Create, Read, Update, and Delete tasks seamlessly

🎯 Smart Prioritization - High, Medium, Low priority levels with visual indicators

📊 Status Management - To Do, In Progress, Completed with proper workflow rules

⏰ Due Date Tracking - Future date validation and overdue task highlighting

🎨 User Experience
📱 Fully Responsive - Beautiful on desktop, tablet, and mobile devices

🎨 Modern UI - Clean, intuitive interface built with Tailwind CSS

⚡ Real-time Updates - Instant feedback with reactive forms and state management

🔍 Smart Filtering - Filter by status, priority, and search across titles/descriptions

📈 Advanced Features
📊 Priority Sorting - Automatic sorting: High > Medium > Low, then by due date

🚦 Status Transition Rules - Enforced workflow: To Do → In Progress → Completed

🔴 Overdue Alerts - Visual warnings for overdue incomplete tasks

📤 CSV Export - Export your task list for external use

🎭 Smooth Animations - Enhanced user experience with Angular animations

🚀 Quick Start
Prerequisites
Node.js 18+

npm or yarn

Installation
Clone the repository

bash
git clone https://github.com/your-username/task-management-app.git
cd task-management-app
Install dependencies

bash
npm install
Start the development server

bash
npm start
Open your browser
Navigate to http://localhost:4200

🏗️ Project Structure
text
src/
├── app/
│   ├── components/          # UI Components
│   │   ├── header/         # App header with branding
│   │   ├── task-form/      # Create/Edit task form
│   │   └── task-list/      # Task table with filters
│   ├── core/
│   │   ├── models/         # TypeScript interfaces
│   │   └── services/       # Business logic & state management
│   ├── app.config.ts       # Application configuration
│   ├── app.routes.ts       # Routing configuration
│   └── app.component.ts    # Root component
💡 Usage Guide
Creating a Task
Click "Create New Task" button

Fill in the required fields:

Title (required, max 100 characters)

Description (optional, max 500 characters)

Priority (High, Medium, Low)

Status (To Do, In Progress, Completed)

Due Date (must be a future date)

Click "Save Task"

Managing Tasks
Edit: Click the Edit button on any task (disabled for completed tasks)

Delete: Click Delete with confirmation (disabled for completed tasks)

Filter: Use the status and priority filters

Search: Type to search task titles and descriptions

Status Workflow
✅ To Do → Can be moved to "In Progress"

🔄 In Progress → Can be moved to "Completed"

✅ Completed → Tasks are read-only (cannot be edited/deleted)

🎯 Task Properties
Each task includes:

typescript
{
  id: string;           // Unique identifier (UUID)
  title: string;        // Required, max 100 chars
  description?: string; // Optional, max 500 chars
  priority: Priority;   // High, Medium, Low
  status: Status;       // To Do, In Progress, Completed
  dueDate: Date;        // Required, future date
  createdAt: Date;      // Auto-generated timestamp
}
🛠️ Technology Stack
Framework: Angular 19 (Standalone Components)

Language: TypeScript 5.5

Styling: Tailwind CSS

State Management: NgRx Component Store

Forms: Reactive Forms with Validation

Icons: Heroicons (via Tailwind CSS)

Build Tool: Angular CLI

📱 Responsive Design
The app is fully responsive and optimized for:

Desktop: Full-featured table view with side-by-side filters

Tablet: Adaptive layout with collapsible sections

Mobile: Single-column design with touch-friendly controls

🔧 Development
Build for production
bash
npm run build
Run tests
bash
npm test
Code scaffolding
bash
ng generate component component-name
🌟 Key Features in Detail
Smart Sorting Algorithm
Tasks are automatically sorted by:

Priority (High → Medium → Low)

Due Date (Earliest first for same priority)

Validation Rules
Title: Required, maximum 100 characters

Description: Optional, maximum 500 characters

Due Date: Required, must be future date

Status Transitions: Enforced business rules

Visual Indicators
Priority Badges: Red (High), Orange (Medium), Green (Low)

Overdue Tasks: Red background with warning badge

Completed Tasks: Read-only with disabled actions

🤝 Contributing
We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

Development workflow:
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Angular team for the amazing framework

Tailwind CSS for the utility-first CSS framework

Unsplash for the beautiful placeholder images

Contributors and testers

Built with ❤️ using Angular 19 and modern web technologies

<div align="center">
⭐ Star this repo if you find it helpful!
Report Bug · Request Feature

</div>