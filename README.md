# Project Drive

A modern, full-stack file management application inspired by Google Drive. Built with a React frontend and Node.js/Express backend, featuring secure file storage, sharing capabilities, and a clean, intuitive interface.

![Project Drive](https://img.shields.io/badge/Project-Drive-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square)
![Node.js](https://img.shields.io/badge/Node.js-22.13.0-green?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-8.17.0-green?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-2.53.0-orange?style=flat-square)

## ✨ Features

### 🔐 Authentication & Security

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Protected routes and middleware
- Token-based session management

### 📁 File Management

- **Upload Files**: Secure file upload with Multer and Supabase Storage
- **Download Files**: Direct download with proper headers and authentication
- **Delete Files**: Remove files from both database and storage
- **File Preview**: Inline preview for images, PDFs, and text files
- **File Metadata**: Store and display file information (size, type, upload date)

### 🔗 File Sharing

- **Shareable Links**: Generate secure shareable links for files
- **Password Protection**: Optional password protection for shared files
- **Expiration Dates**: Set expiration times for shared links
- **Email Notifications**: Send share notifications via email
- **Access Control**: Granular permissions for shared content

### 🎨 User Interface

- **Modern Design**: Clean, responsive UI with Tailwind CSS
- **Dark Theme**: Beautiful dark theme optimized for file management
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth loading indicators throughout the app

### 🛠️ Technical Features

- **RESTful API**: Well-structured API endpoints
- **Error Handling**: Comprehensive error handling and validation
- **File Validation**: Size limits and type restrictions
- **Database Integration**: MongoDB with Mongoose ODM
- **Cloud Storage**: Supabase for scalable file storage

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Storage**: Supabase Storage
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Security**: bcrypt, CORS, Helmet

### Frontend

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons
- **State Management**: React Hooks

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Supabase account and project

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/project-drive.git
   cd project-drive
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables:**

   Create `.env` file in the `backend` directory:

   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/drive

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here

   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Email (optional, for sharing notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=your_email@gmail.com

   # Frontend URL (for share links)
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the backend server:**

   ```bash
   cd backend
   npm run dev
   ```

   Server will run on `http://localhost:5000`

6. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/api/user/register` | Register a new user             |
| POST   | `/api/user/login`    | Login user and return JWT token |

### File Management Endpoints

| Method | Endpoint                   | Description             | Auth Required |
| ------ | -------------------------- | ----------------------- | ------------- |
| GET    | `/api/file`                | Get all user files      | ✅            |
| GET    | `/api/file/:id`            | Get file metadata by ID | ✅            |
| GET    | `/api/file/download/:path` | Download file by path   | ✅            |
| DELETE | `/api/file/:id`            | Delete file by ID       | ✅            |
| POST   | `/api/upload`              | Upload new file         | ✅            |

### Request/Response Examples

**Upload File:**

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.pdf"
```

**Share File:**

```bash
curl -X POST http://localhost:5000/api/file/share/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "friend@example.com",
    "password": "optional_password",
    "expiresIn": 24
  }'
```

## 📁 Project Structure

```
project-drive/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database connection
│   │   ├── multer.config.js      # File upload configuration
│   │   └── supabaseClient.js     # Supabase client setup
│   ├── controllers/
│   │   ├── file.controller.js    # File operations logic
│   │   ├── upload.controller.js  # Upload handling
│   │   └── user.controller.js    # User authentication
│   ├── middlewares/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── files.models.js       # File schema
│   │   ├── sharedLink.model.js   # Shared link schema
│   │   └── user.model.js         # User schema
│   ├── routes/
│   │   ├── file.routes.js        # File-related routes
│   │   ├── upload.routes.js      # Upload routes
│   │   └── user.routes.js        # Authentication routes
│   ├── app.js                    # Express app setup
│   ├── package.json
│   └── .env                      # Environment variables
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── apiClient.js          # Axios configuration
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # App entry point
│   │   ├── toastContext.jsx      # Toast notifications
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Dashboard with file list
│   │   │   ├── FileView.jsx      # File preview page
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   └── Index.jsx         # Landing page
│   │   └── assets/               # Static assets
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Deployment

### Backend Deployment

1. Set up a MongoDB instance (MongoDB Atlas recommended)
2. Create a Supabase project and configure storage
3. Set environment variables on your hosting platform
4. Deploy to services like Heroku, Railway, or Vercel

### Frontend Deployment

1. Build the production bundle: `npm run build`
2. Deploy to services like Vercel, Netlify, or GitHub Pages
3. Configure the `VITE_API_URL` environment variable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for excellent storage solutions
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- [React](https://reactjs.org/) for the amazing frontend framework
- [Express.js](https://expressjs.com/) for the robust backend framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ for developers who love clean, functional file management**
