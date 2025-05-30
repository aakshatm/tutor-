# Student-Teacher Connecting System API

A backend API for connecting students with teachers. Teachers can purchase coins to view student contact details, and students can post their tutoring requirements.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `src/config/config.env` and add your configuration:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   COINS_PRICE=10
   ```
4. Run the server:
   - Development: `npm run dev`
   - Production: `npm start`

## API Endpoints

### Health Check
- GET `/health`
  - Check if the API server is running
  - No authentication required
  - Response includes:
    - Server status
    - Current timestamp
    - Server uptime

### Authentication
- POST `/api/v1/auth/register`
  - Register a new user (teacher or student)
  - Body: `{ name, email, password, role, phone }`

- POST `/api/v1/auth/login`
  - Login user
  - Body: `{ email, password }`

### Requirements
- POST `/api/v1/requirements`
  - Create a new requirement (students only)
  - Body: `{ title, description, subject, gradeLevel, budget, location, preferredMode }`
  - Auth required

- GET `/api/v1/requirements`
  - Get all requirements
  - Query params: `subject`, `gradeLevel`, `location`, `preferredMode`
  - Auth required

- GET `/api/v1/requirements/:id`
  - Get requirement details
  - Requires 1 coin for teachers to view contact details
  - Auth required

### Coins
- POST `/api/v1/coins/create-payment-intent`
  - Create payment intent for coin purchase (teachers only)
  - Body: `{ coinAmount }`
  - Auth required

- POST `/api/v1/coins/confirm-purchase`
  - Confirm coin purchase and add coins to account (teachers only)
  - Body: `{ paymentIntentId }`
  - Auth required

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses
```json
{
  "success": false,
  "message": "Error message"
}
```

## Success Responses
```json
{
  "success": true,
  "data": {}
}
``` # tutor-
