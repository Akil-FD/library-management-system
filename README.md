# Library Management System

A modern, front end web application for managing library operations, built with Next.js, TypeScript, and Tailwind CSS. This system allows users to browse books, borrow and return books, and administrators to manage the library inventory and track activities.

## Features

### User Features
- **Authentication**: Secure login and signup with role-based access (User/Admin)
- **Book Browsing**: View available books with detailed information
- **Book Borrowing**: Borrow books from the library collection
- **My Books**: Track borrowed books and due dates
- **Activity Logs**: View personal borrowing history

### Admin Features
- **Book Management**: Add to the inventory
- **User Management**: Oversee user accounts and activities
- **Activity Monitoring**: Track all library activities and transactions

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API and Localstore
- **Icons**: Lucide React, Tabler Icons
- **Tables**: TanStack Table
- **Notifications**: Sonner for toast messages
- **Themes**: next-themes for dark/light mode support

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Akil-FD/library-management-system.git
cd library-management-system
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Default Credentials

The application comes with mock data for testing:

**User Account:**
- Email: `user@gmail.com`
- Password: (any password works with mock auth)

**Admin Account:**
- Email: `admin@gmail.com`
- Password: (any password works with mock auth)

### Project Structure

```
src/
├── api/                 # API functions and types
├── app/                 # Next.js app router pages
│   ├── auth/           # Authentication pages (login/signup)
│   └── (protected)/    # Protected dashboard routes
├── components/         # Reusable UI components
│   ├── ui/            # Radix UI components
│   └── common/        # Shared components
├── constants/         # App constants and messages
├── guards/            # Route protection guards
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── providers/         # Context providers
├── store/             # State management
└── types/             # TypeScript type definitions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is private and proprietary.
