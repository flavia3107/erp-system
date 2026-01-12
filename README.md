# Work Order Schedule Timeline  
Frontend Technical Test – Naologic

## Overview

This project is an Angular 17+ application implementing an interactive **Work Order Schedule Timeline** for a manufacturing ERP system. The application allows users to visualize, create, edit, and manage work orders across multiple work centers using a scalable timeline with multiple zoom levels.

The implementation focuses on pixel-accurate design, clear interaction patterns, and clean, maintainable Angular architecture.

---

## Tech Stack

- **Angular 17+** (standalone components)
- **TypeScript** (strict mode enabled)
- **SCSS** for styling
- **Reactive Forms**
- **ng-select** (dropdowns)
- **@ng-bootstrap/ng-bootstrap** (date pickers)

---

## Features

### Timeline
- Day / Week / Month zoom levels
- Horizontally scrollable timeline grid
- Fixed left column for work centers

### Work Orders
- Visual work order bars positioned by start/end date
- Status indicators:
  - Open
  - In Progress
  - Complete
  - Blocked
- Multiple work orders per work center 
- Three-dot action menu per bar (Edit / Delete)

### Create & Edit
- Slide-out panel from the right
- Shared component for create and edit modes
- Reactive form validation
- Cancel and outside-click to close

---

## Setup & Run

### Prerequisites
- Node.js 18+
- Angular CLI 17+

### Install Dependencies
```bash
npm install
