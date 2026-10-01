# KES CRM Frontend

Welcome to the frontend repository for KES CRM. This project is built using modern web technologies to provide a fast, responsive, and robust customer relationship management interface.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State/Data Management**: [TanStack React Query](https://tanstack.com/query/latest)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: `v22.18.0` or higher (matching your local environment)
- **npm**: Included with Node.js

## 🛠️ Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd kes-crm-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the port specified by Vite in your terminal).

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev`: Starts the Vite development server with Hot Module Replacement (HMR).
- `npm run build`: Builds the app for production to the `dist` folder.
- `npm run lint`: Lints the codebase using ESLint to ensure code quality.
- `npm run preview`: Bootstraps a local static web server that serves the production build from the `dist` folder.

## 📁 Project Structure

This project follows a modular structure. Some of the key directories include:
- `src/` - The core application source code.
  - `features/` - Feature-based modules (e.g., leads).
  - `app/` - App-wide configurations like routes.
  - `components/` - Reusable UI components.
- `public/` - Static assets.
- `package.json` - Project metadata, dependencies, and npm scripts.
- `vite.config.ts` - Configuration file for the Vite bundler.

## ⚙️ Linting and Formatting

The project uses ESLint with TypeScript plugins to maintain code quality. Run `npm run lint` before committing to catch any potential issues.
