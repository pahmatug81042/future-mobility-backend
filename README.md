# Future Mobility Manager - Backend

The backend of **Future Mobility Manager** powers secure fleet and transport management using a RESTful API built with Node.js, Express, and MongoDB. It provides authentication, CRUD operations, and analytics support for the frontend.

## Features
- User authentication with **JWT** (register/login)
- **Fleet management** (create, update, delete, list)
- **Transport management** with fleet assignment
- Real-time validation and error handling
- MongoDB models for scalable data persistence
- Middleware for authentication and request validation
- CORS enabled for frontend integration

## Built With
- **Node.js** & **Express.js** – backend framework
- **MongoDB Atlas** & **Mongoose** – NoSQL database
- **JWT** & **bcrypt** – authentication & security
- **dotenv** – environment variables
- **Nodemon** – dev server auto-reload

## Installation
1. Navigate to the backend folder:
   ```bash
   git clone
   cd into the folder after doing git clone
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run server
   ```

## Environment Variables
* Create a .env file inside backend/ with the following values:
  ```bash
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_secret_key
  ```

## API Endpoints
### Auth
* POST /api/auth/register → Register a new user
* POST /api/auth/login → Authenticate user

### Fleets
* GET /api/fleets → Get all fleets
* POST /api/fleets → Create a new fleet
* PUT /api/fleets/:id → Update fleet details
* DELETE /api/fleets/:id → Remove fleet

### Transports
* GET /api/transports → Get all transports
* POST /api/transports → Add a new transport
* PUT /api/transports/:id → Update transport
* DELETE /api/transports/:id → Remove transport

## Accomplishments
* Built a scalable and secure REST API
* Integrated JWT authentication and middleware
* Designed clear MongoDB schemas for fleets and transports

## Future Enhancements
* Role-based access control (admin, fleet manager)
* Pagination & advanced filtering for lists
* Analytics API endpoints (utilization, sustainability metrics)