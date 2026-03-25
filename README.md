# 🎬 CINEVERSE — Production-Grade Movie Booking Platform

> Real-time movie ticket booking system inspired by BookMyShow  
> Built with MERN + TypeScript + Stripe + Socket.io

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- OTP email verification (signup)
- Only **verified users** can access system
- Role-based access:
  - **Admin**
  - **Client (Theatre Owner)**
  - **Customer**

---

### 👤 User Features
- Profile management (avatar, phone, password)
- Browse movies with filters
- View theatres & shows
- Book tickets
- View booking history
- QR-based ticket system

---

### 🎬 Movies Module
- Full CRUD (Admin only)
- Search & filters:
  - Genre
  - Language
  - Release status
- Ratings & reviews system
- Cloudinary:
  - Poster upload
  - Trailer video

---

### 🏛 Theatre Module
- CRUD theatres
- Gallery/images support
- City-based filtering
- Assign movies to theatres
- ⚠️ Client must be **approved by Admin**

---

### 🎟 Shows Module
- Create/update/delete shows
- Filters:
  - Movie
  - Theatre
  - City
  - Format (2D / 3D / IMAX / 4DX)
  - Language
- Only approved theatre owners can create shows

---

### 💺 Booking System (Core)
- Real-time seat selection (Socket.io)
- Seat locking mechanism (no double booking)
- Concurrent booking safe
- Booking states:
  - Processing
  - Successful
  - Cancelled

---

### 💳 Payments
- Stripe integration
- PaymentIntent flow
- Payment verification before confirmation
- Refund handling on cancellation

---

### ⚡ Real-Time System
- Socket.io integration
- Live seat blocking
- Instant updates across users
- Prevents seat conflicts

---

### 📧 Email Notifications
- OTP verification email
- Booking confirmation
- Booking cancellation
- New movie alerts

---

### ☁️ Cloudinary Integration
- Movie posters
- Trailer videos
- User avatars
- Theatre images

---

### 🛠 Error Handling
- Global backend error handling
- Zod validation
- React Error Boundaries

---

## 🏗 System Architecture

```
Client (React + TS)
        │
        ▼
API Layer (Axios)
        │
        ▼
Backend (Node.js + Express)
        │
 ┌──────┼────────┬──────────┐
 │      │        │          │
Auth   Movies   Booking   Reviews
 │      │        │          │
 └──────┴────────┴──────────┘
        │
        ▼
MongoDB (Database)

+ Socket.io (Real-time)
+ Stripe (Payments)
+ Cloudinary (Media)
+ Nodemailer (Emails)
```

---

## 🔄 Booking Flow

```
User selects show
        ↓
Fetch available seats
        ↓
Socket.io → seats locked (temporary)
        ↓
POST /bookings
        ↓
Stripe PaymentIntent created
        ↓
Payment Success
        ↓
Booking Confirmed
        ↓
QR Ticket Generated + Email Sent
```

---

## 🔐 Auth Flow

```
Signup → OTP Email → Verify OTP → Login → JWT Token
```

- Only verified users allowed
- Role-based redirect:
  - Admin → Dashboard
  - Client → Dashboard
  - User → Movies

---

## 🗄 Database Schema

### User
```js
{
  name: String,
  email: String,
  password: String,
  role: "USER" | "ADMIN" | "CLIENT",
  status: "PENDING" | "APPROVED",
  isVerified: Boolean,
  avatar: String
}
```

### Movie
```js
{
  name: String,
  genre: [String],
  languages: [String],
  duration: Number,
  releaseDate: Date,
  releaseStatus: "RELEASED" | "UPCOMING",
  rating: Number,
  posterUrl: String,
  trailerUrl: String,
  director: String,
  casts: [String]
}
```

### Theatre
```js
{
  name: String,
  city: String,
  address: String,
  ownerId: ObjectId,
  images: [String],
  movies: [ObjectId]
}
```

### Show
```js
{
  movieId: ObjectId,
  theatreId: ObjectId,
  showTime: Date,
  price: Number,
  totalSeats: Number,
  bookedSeats: [String],
  format: String,
  language: String
}
```

### Booking
```js
{
  userId: ObjectId,
  showId: ObjectId,
  seats: [String],
  status: "PROCESSING" | "SUCCESSFUL" | "CANCELLED",
  totalAmount: Number,
  paymentId: String
}
```

---

## 📡 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /auth/signup | Register user |
| POST | /auth/verify-otp | Verify email |
| POST | /auth/signin | Login |
| PATCH | /auth/reset-password | Change password |

---

### 🎬 Movies
| Method | Endpoint | Description |
|--------|---------|------------|
| GET | /movies | Get all movies |
| GET | /movies/:id | Get movie |
| POST | /movies | Create movie |
| PATCH | /movies/:id | Update movie |
| DELETE | /movies/:id | Delete movie |

---

### 🏛 Theatres
| Method | Endpoint | Description |
|--------|---------|------------|
| GET | /theatres | Get all theatres |
| POST | /theatres | Create theatre |
| PATCH | /theatres/:id | Update theatre |
| DELETE | /theatres/:id | Delete theatre |

---

### 🎟 Shows
| Method | Endpoint | Description |
|--------|---------|------------|
| GET | /shows | Get shows |
| POST | /shows | Create show |
| PATCH | /shows/:id | Update show |
| DELETE | /shows/:id | Delete show |

---

### 💺 Bookings
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /bookings | Create booking |
| GET | /bookings/my | User bookings |
| PATCH | /bookings/cancel | Cancel booking |

---

## ⚙️ Tech Stack

### Frontend
- React 18
- TypeScript
- React Router
- Context API
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Zod Validation

### Integrations
- Stripe (Payments)
- Cloudinary (Media)
- Nodemailer (Emails)
- Socket.io (Realtime)

---

## ⚡ Key Highlights

- ✅ Real-time seat locking (no double booking)
- ✅ Concurrent booking safe
- ✅ Role-based dashboards
- ✅ Only approved theatre owners can create shows
- ✅ Email + OTP verification
- ✅ Stripe payment flow
- ✅ QR-based ticket system

---

## 🧪 Test Cards (Stripe)

| Type | Card Number |
|------|------------|
| Success | 4242 4242 4242 4242 |
| Decline | 4000 0000 0000 0002 |

---

## 📦 Setup

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 👨‍💻 Author

**Aman Bhaskar**

- GitHub: https://github.com/amanbhaskar16
- LinkedIn: https://linkedin.com

---

⭐ If you like this project, give it a star!
