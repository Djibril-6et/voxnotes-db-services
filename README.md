# 🗄️ Database API Service

Database microservice for the voice transcription platform. RESTful API handling transcription storage, user management, and data persistence with secure endpoints.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **File Storage:** GridFS (gridfs-stream)
- **File Upload:** Multer
- **Security:** bcryptjs for password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/Djibril-6et/voxnotes-db-services.git
cd voxnotes-db-services
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb://localhost:27017/speech-to-text
PORT=9090
```

4. **Start MongoDB**
Make sure MongoDB is running on your system or configure MongoDB Atlas connection string.

## 🚀 Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The service will be available at `http://localhost:9090`

## 🤝 Integration with Other Services

This service integrates with:
- **[Frontend Application](https://github.com/Djibril-6et/voxnotes):** User interface on port 9010
- **OAuth Service:** Validates JWT tokens
- **AI Service:** Stores transcription results  
- **Payment Service:** Updates user subscription status

## 📡 API Endpoints

### Users
```
GET    /api/users                    - Get all users
GET    /api/users/:id                - Get user by ID
POST   /api/users/register           - User registration
POST   /api/users/login              - User login
POST   /api/users/check              - Check if user exists
POST   /api/users/forgot-password    - Request password reset
PUT    /api/users/reset-password     - Reset password
DELETE /api/users/:id               - Delete user
```

### Audio Files
```
POST   /api/audioFiles               - Upload file (basic)
POST   /api/audioFiles/uploadfile    - Upload audio file with multer
GET    /api/audioFiles/file/:fileId  - Download audio file
GET    /api/audioFiles/user/:userId  - Get user's audio files
GET    /api/audioFiles/:id           - Get file by ID
GET    /api/audioFiles/:id/metadata  - Get file metadata by ID
DELETE /api/audioFiles/file/:fileId  - Delete audio file
```

### Transcriptions
```
POST   /api/transcriptions           - Create new transcription
GET    /api/transcriptions/user/:userId - Get user transcriptions
GET    /api/transcriptions/:id       - Get transcription by ID
```

### Subscriptions
```
POST   /api/subscriptions            - Create subscription
GET    /api/subscriptions/user/:userId - Get subscription by user ID
PUT    /api/subscriptions/:id        - Update subscription status
PUT    /api/subscriptions/:stripeSessionId/cancel - Cancel subscription
DELETE /api/subscriptions/:stripeSessionId - Delete subscription
```

## 📊 Data Models

### User Schema
```javascript
{
  username: String, // required, unique
  email: String, // required, unique
  passwordHash: String, // required, bcrypt hashed
  provider: String, // 'email', 'github', 'google', 'discord' - default: 'email'
  role: String, // 'student', 'employee', 'disabled', 'admin' - default: 'student'
  createdAt: Date, // default: Date.now
  updatedAt: Date // default: Date.now
}
```

### AudioFile Schema
```javascript
{
  userId: ObjectId, // ref: 'User', required
  filePath: String, // required
  fileType: String, // 'audio' or 'video', required
  fileName: String, // required
  fileSize: Number, // required
  uploadDate: Date, // default: Date.now
  status: String, // 'pending', 'processing', 'completed', 'failed' - default: 'pending'
  transcriptionId: ObjectId // ref: 'Transcription'
}
```

### Transcription Schema
```javascript
{
  audioFileId: ObjectId, // ref: 'AudioFile', required
  userId: ObjectId, // ref: 'User', required
  transcriptionText: String, // required
  language: String, // default: 'en'
  createdAt: Date, // default: Date.now
  updatedAt: Date, // default: Date.now
  status: String, // 'completed', 'in-review', 'error' - default: 'completed'
  errorDetails: String
}
```

### Subscription Schema
```javascript
{
  userId: ObjectId, // ref: 'User', required
  stripeSessionId: String, // required
  startDate: Date, // default: Date.now
  endDate: Date, // default: null
  status: String, // 'active', 'cancelled', 'expired' - default: 'active'
  paymentMethod: String, // 'Stripe', 'Paypal' - default: 'Stripe', required
  amountPaid: Number, // required
  createdAt: Date, // timestamps: true
  updatedAt: Date // timestamps: true
}
```

## 🔐 Authentication

The API uses standard authentication methods. JWT tokens can be generated via the login endpoint:

```
POST /api/users/login
```

For password reset functionality:
```
POST /api/users/forgot-password
PUT /api/users/reset-password
```

## 🐳 Docker Support

### Build Docker Image
```bash
docker build -t database-service .
```

### Run with Docker Compose
```yaml
version: '3.8'
services:
  database-service:
    build: .
    ports:
      - "9090:9090"
    environment:
      - MONGO_URI=mongodb://mongo:27017/speech-to-text
      - PORT=9090
    depends_on:
      - mongo
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📁 Project Structure

```
database-service/
├── config/
│   └── db.config.js
├── models/
│   ├── user.model.js
│   ├── audioFile.model.js
│   ├── transcription.model.js
│   └── subscription.model.js
├── routes/
│   ├── index.routes.js
│   ├── user.routes.js
│   ├── audioFile.routes.js
│   ├── transcription.routes.js
│   └── subscription.routes.js
├── controllers/
│   ├── user.controller.js
│   ├── audioFile.controller.js
│   ├── transcription.controller.js
│   └── subscription.controller.js
├── server.js
├── package.json
└── .env
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/speech-to-text` |
| `PORT` | Server port | `9090` |

## 🤝 Integration with Other Services

This service communicates with:
- **Auth Service**: Validates JWT tokens
- **AI Service**: Stores transcription results
- **Payment Service**: Updates user subscription status

## 🚨 Error Handling

The API returns standardized error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## 📈 Health Check

Check service health:
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": 1234.567
}
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation and sanitization
- File upload restrictions

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.