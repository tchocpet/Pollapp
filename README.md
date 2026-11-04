# PollApp – Survey & Voting Application

A modern, responsive survey and voting application built with **Angular 21**, **TypeScript**, and **SCSS**.

PollApp allows users to create surveys, add multiple questions and answer options, participate in polls, and view live voting results. All survey data is stored locally in the browser using **Local Storage**.

## Features

- Create and manage surveys
- Add multiple questions to each survey
- Add multiple answer options per question
- Support for single-choice and multiple-choice questions
- Participate in surveys and submit votes
- View live voting results
- Display active and expired surveys
- Filter surveys by category
- Delete surveys
- Persistent data storage using Browser Local Storage
- Responsive design for desktop and mobile devices

## Technologies

- **Angular 21**
- **TypeScript**
- **SCSS**
- **HTML5**
- **CSS3**
- **Local Storage API**

## Requirements

Before running the application, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

Angular CLI is managed through the project's dependencies.

## Installation

Clone the repository:

```bash
git clone https://github.com/tchocpet/Pollapp.git
```

Navigate to the Angular project directory:

```bash
cd Pollapp/pollapp
```

Install the dependencies:

```bash
npm install
```

## Run the Application

Start the development server:

```bash
npm start
```

Open your browser:

```text
http://localhost:4200
```

**Important:** This is an Angular application. It cannot be started using the VS Code Live Server extension or by opening an HTML file directly.

## Build the Application

To verify that the application builds successfully, run:

```bash
npm run build
```

The production build will be generated in the `dist/` directory.

## Project Structure

```text
Pollapp/
├── public/
├── src/
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## Data Storage

PollApp uses the browser's Local Storage API to save survey data locally.

Data is stored in the user's browser and is not synchronized between different devices or users.

## Git Commit Convention

This project uses clear and descriptive commit messages.

Examples:

```text
docs: update project setup instructions
fix: improve create survey form behavior
style: adjust responsive layout
feat: add survey voting flow
```

## Notes for Submission

The following folders are generally excluded from source-code submissions:

- `node_modules/`
- `.angular/`
- `.vscode/`
- `dist/` (when submitting source code only)

## Author

**Thierno Diallo**

GitHub: [@tchocpet](https://github.com/tchocpet)

---

_Built with Angular and TypeScript._
