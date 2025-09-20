# Library Management System - Project Documentation

## Overview

This project is a library management web application built with React and React Router. The system enables the management of books, users, and borrowings with different access levels based on user roles.

## Technologies Used

- **React**: Main framework for user interface development
- **React Router DOM**: Route management and navigation in the application
- **Context API**: Global authentication state management
- **Tailwind CSS**: Styling framework (evidenced by CSS classes)
- **Local Storage**: Local storage for tokens and user data

## Project Architecture

### Route Structure

The system is organized with the following main routes:

- `/login` - Login page
- `/register` - User registration page
- `/dashboard` - Main dashboard (requires authentication)
- `/books` - Book catalog (public)
- `/books/:id` - Specific book details
- `/books/new` - Form to create new book (librarians only)
- `/books/:id/edit` - Form to edit book (librarians only)
- `/borrowings` - Borrowing management (requires authentication)

### Authentication and Authorization System

#### Types of Protected Routes

1. **Public Routes (PublicRoute)**
   - Accessible only to non-authenticated users
   - Redirect to dashboard if user is already logged in
   - Apply to: Login and Register

2. **Protected Routes (ProtectedRoute)**
   - Require authentication
   - Redirect to login if no valid token exists
   - Apply to: Dashboard and Borrowings

3. **Librarian Routes (LibrarianRoute)**
   - Require authentication AND "Librarian" role
   - Redirect to catalog if requirements not met
   - Apply to: Book creation and editing

#### Authentication Context

The `AuthContext` provides:
- `isAuthenticated()`: Function to verify if user is authenticated
- `user`: Object with current user information
- `loading`: Loading state to show appropriate indicators

## Core Functionalities

### 1. User Management
- **New user registration**: Publicly accessible registration form
- **Login**: Authentication with locally stored token
- **Differentiated roles**: System with User and Librarian roles

### 2. Book Management
- **Public catalog**: Book viewing available without authentication
- **Book details**: Complete information for each book
- **CRUD for librarians**: 
  - Create new books
  - Edit existing books
  - (Presumably delete, though not visible in routes)

### 3. Borrowing System
- **Borrowing management**: Dedicated page for authenticated users
- **Access control**: Only registered users can access

### 4. Dashboard
- **Main panel**: Personalized area for authenticated users
- **Entry point**: Automatic redirection after successful login

## Implemented Improvements

### Original Version vs. Enhanced Version

**Main changes in the second version:**

1. **Better Context API integration**:
   - Elimination of direct localStorage access
   - Use of custom hooks from auth context

2. **Improved loading states**:
   - Loading indicators during authentication verification
   - Better user experience

3. **Smart public routes**:
   - Prevention of access to login/register if already authenticated
   - Automatic redirection to dashboard

4. **Cleaner structure**:
   - Separation of route components
   - Better code organization

5. **Enhanced role verification**:
   - Use of `user.roles[0]` structure instead of direct localStorage
   - Greater security in permission verification

## Configuration and Usage

### File Structure

```
src/
├── contexts/
│   └── AuthContext.js      # Authentication context
├── pages/
│   ├── LoginPage.js        # Login page
│   ├── RegisterPage.js     # Registration page
│   ├── DashboardPage.js    # Main dashboard
│   ├── BooksPage.js        # Book catalog
│   ├── BookShowPage.js     # Book details
│   ├── BookFormPage.js     # Book form
│   └── BorrowingsPage.js   # Borrowing management
└── App.js                  # Main component with routes
```

### Navigation Flow

1. **Non-authenticated user**: Accesses public catalog or registers/logs in
2. **Authenticated user**: Accesses dashboard, can view borrowings and complete catalog
3. **Librarian**: All previous functionalities + book CRUD management

## Security Considerations

- Tokens stored in localStorage for session persistence
- Role verification both in frontend and (presumably) backend
- Protection of sensitive routes with wrapper components
- Automatic redirections to prevent unauthorized access

## License

This project is licensed under the MIT License - see the LICENSE file for details.