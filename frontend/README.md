# EduCore LMS - Frontend

A modern Learning Management System built with Angular 21 and Tailwind CSS. This is the frontend application for EduCore, providing an intuitive interface for students to browse courses, take quizzes, and for instructors to create and manage educational content.

## 🚀 Features

### For Students (Users)
- Browse available courses in the course catalog
- Enroll in courses
- View enrolled courses with progress tracking
- Take quizzes and view results
- Secure authentication with JWT tokens

### For Instructors
- Comprehensive instructor dashboard with course statistics
- Create and publish courses
- Manage course content and quizzes
- Question bank management for quizzes
- Track course enrollment and status

### General
- Role-based access control (Student/Instructor)
- Responsive design with Tailwind CSS
- Secure authentication and authorization
- Real-time form validation
- Protected routes with guards
- Clean and intuitive user interface

## 🛠️ Tech Stack

- **Framework**: Angular 21.1.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: RxJS with Angular HttpClient
- **Forms**: Reactive Forms
- **Routing**: Angular Router with Guards
- **Authentication**: JWT Token-based

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Angular CLI**: v21.1.2 or higher

```bash
npm install -g @angular/cli@21.1.2
```

## 🔧 Installation & Setup

1. **Clone the repository** (if not already done)
   ```bash
   git clone <repository-url>
   cd EduCore/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   
   The API configuration is located in `src/app/api/api.config.ts`:
   ```typescript
   export const API_BASE_URL = 'http://localhost:5099';
   ```

4. **Start the development server**
   ```bash
   ng serve
   ```
   
   The application will be available at `http://localhost:4200/`

## 🎯 Development

### Development Server

To start a local development server with different port:

```bash
ng serve --port 4200
```

The application will automatically reload when you modify source files.

### Code Scaffolding

Generate new components:
```bash
ng generate component components/component-name
```

Generate new services:
```bash
ng generate service api/service-name
```

For all available schematics:
```bash
ng generate --help
```

### Building

#### Development Build
```bash
ng build --configuration development
```

#### Production Build
```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/                    # API services and models
│   │   │   ├── auth.service.ts     # Authentication service
│   │   │   ├── course.service.ts   # Course API service
│   │   │   ├── quiz.service.ts     # Quiz API service
│   │   │   ├── models/             # TypeScript models/interfaces
│   │   │   └── api.config.ts       # API configuration
│   │   ├── components/             # Reusable components
│   │   │   └── shared-navbar/      # Navigation bar component
│   │   ├── guards/                 # Route guards
│   │   │   ├── auth.guard.ts       # Authentication guard
│   │   │   ├── instructor.guard.ts # Instructor role guard
│   │   │   └── user.guard.ts       # User role guard
│   │   ├── pages/                  # Page components
│   │   │   ├── home-page/          # Landing page
│   │   │   ├── sign-in-page/       # Login page
│   │   │   ├── sign-up-page/       # Registration page
│   │   │   ├── course-catalog/     # Browse courses
│   │   │   ├── my-courses/         # Enrolled courses
│   │   │   ├── take-quiz/          # Quiz taking interface
│   │   │   └── instructor/         # Instructor-only pages
│   │   │       ├── dashboard/      # Instructor dashboard
│   │   │       ├── create-course/  # Course creation
│   │   │       ├── manage-courses/ # Course management
│   │   │       └── question-bank/  # Quiz questions
│   │   ├── interceptors/           # HTTP interceptors
│   │   ├── app.routes.ts           # Application routes
│   │   └── app.config.ts           # App configuration
│   ├── environments/               # Environment configs
│   └── styles.css                  # Global styles
├── public/                         # Static assets
└── angular.json                    # Angular configuration
```

## 🔑 User Roles

The application supports two user roles:

1. **User (Student)**: Can browse courses, enroll, and take quizzes
2. **Instructor**: Can create courses, manage content, and add quizzes

Role-based access is enforced through route guards.

## 🛣️ Available Routes

### Public Routes
- `/` - Home page
- `/signin` - Sign in page
- `/signup` - Sign up page

### User Routes (Authenticated)
- `/courses` - Browse available courses
- `/my-courses` - View enrolled courses
- `/quiz/:quizId` - Take a specific quiz

### Instructor Routes (Instructor Role Required)
- `/instructor/dashboard` - Instructor dashboard
- `/instructor/create-course` - Create new course
- `/instructor/manage-course/:id` - Manage specific course
- `/instructor/question-bank/:quizId` - Manage quiz questions

## 🔐 Authentication

The application uses JWT token-based authentication:
- Tokens are stored in `localStorage`
- Auth tokens are automatically attached to API requests via interceptors
- Token expiration is validated on each request
- Protected routes require valid authentication

## 🎨 Styling

The project uses Tailwind CSS for styling. The configuration is in `tailwind.config.js`.

Key design features:
- Responsive design (mobile-first approach)
- Consistent color scheme
- Modern UI components
- Smooth transitions and hover effects

## 🔗 Backend Integration

The frontend connects to a .NET backend API:
- **Backend URL**: `http://localhost:5099`
- **API Base Path**: `/api`

Ensure the backend server is running before starting the frontend application.

## 📝 Environment Variables

Configuration can be managed through environment files:
- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment (if needed)

## 🧪 Testing

### Unit Tests
```bash
ng test
```

Tests are executed using [Vitest](https://vitest.dev/).

### End-to-End Tests
```bash
ng e2e
```

## 🚀 Deployment

1. Build the production application:
   ```bash
   ng build --configuration production
   ```

2. Deploy the contents of `dist/frontend/browser` to your web server or hosting platform.

## 🐛 Common Issues

### Backend Connection Error
If you see API connection errors:
- Ensure the backend is running on `http://localhost:5099`
- Check the `api.config.ts` file for correct API URL
- Verify CORS is properly configured on the backend

### Port Already in Use
If port 4200 is already in use:
```bash
ng serve --port 4300
```

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI Command Reference](https://angular.dev/tools/cli)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev)

## 👥 Contributing

When contributing to this project:
1. Follow Angular style guide
2. Use TypeScript strict mode
3. Write meaningful commit messages
4. Test your changes before committing
5. Update documentation as needed

## 📄 License

<!-- Add your license information here -->

---

**EduCore LMS** - A modern learning management system for the digital age.
