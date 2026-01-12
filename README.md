# Work Order Schedule Timeline  
Frontend Technical Test

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


## @upgrade – Future Improvements

The following items were identified as improvements that would be implemented with additional time:

1. Show the actual selected dates in the date picker when initially opening the create/edit panel
2. Correct bar positioning so work orders align exactly with their actual start dates (currently shifted by one day)
3. Refine bar width and position calculations for more accurate date-to-pixel mapping
4. Code cleanup and architecture improvements:
   - Add unit tests
   - Introduce a central service to handle all work-order-related logic
5. Remove unused and redundant SCSS
6. Add tooltips on work order bars to display full details
7. Improve text wrapping and truncation for long work order names
8. Enhance hover states for rows and work order bars
9. Add current time styling in addition to the current day indicator

### Install Dependencies
```bash
npm install
