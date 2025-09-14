# NatoureBackend  

This is the backend API of the **Natours** application, a modern travel booking platform.  
It provides secure REST APIs for authentication, tours, and reviews, and integrates with the frontend for a seamless travel booking experience.  

---

## 🌐 Live API  

You can access the live backend here:  
**[https://natours-i6gl.onrender.com/api/v1](https://natours-i6gl.onrender.com/api/v1)**  

> ⚠️ **Note on Performance**  
>  
> The backend is hosted on **Render (free tier)**.  
> As a result, the server goes into **sleep mode** if not used for around 15 minutes.  
> This means the **first API request may take longer** after inactivity.  
> Subsequent requests will be fast once the server is awake.  

---

## 🚀 Tech Stack  

- **Node.js** with **Express.js**  
- **MongoDB** (with Mongoose for ODM)  
- **JWT Authentication**  
- **bcrypt.js** (for password hashing & salting)  
- **CORS** (for frontend integration)  

---

## 📝 Features  

- User authentication (sign up, login, logout)  
- Secure password storage (bcrypt with salt)  
- JWT-based authentication & route protection  
- Role-based access control (Admin / User)  
- CRUD APIs for:  
  - **Users**  
  - **Tours**  
  - **Reviews**  
- Centralized error handling  

---

## 🚦 Example Routes  

### Auth  
- `POST   /api/v1/users/signup` → Register a new user  
- `POST   /api/v1/users/login` → Login user  
- `GET    /api/v1/users/me` → Get logged-in user profile  

### Tours  
- `GET    /api/v1/tours` → Get all tours  
- `GET    /api/v1/tours/:id` → Get single tour  
- `POST   /api/v1/tours` → Create tour (Admin only)  

### Reviews  
- `GET    /api/v1/reviews` → Get all reviews  
- `POST   /api/v1/tours/:tourId/reviews` → Create review (Logged-in users)  

---

## ⚡️ Getting Started  

1. **Clone this repository:**  
   git clone https://github.com/PrashantRajput7372/NatoureBackend.git
   ```bash

## Install Dependencies 

  --npm install

--------
## Configure environment variables:
- Create a .env file in the root with:
PORT=5000
DATABASE=mongodb+srv://<your_mongo_uri>
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

----------

## Run the server:
npm start

The app will run on http://localhost:5000 by default.

--------

## 🛠️ Project Status
This project is still in progress. More features will be added and improvements are ongoing.

------

## 📬 Feedback & Contributions

Feel free to open issues or pull requests for suggestions, bug fixes, or new features!


   git clone https://github.com/PrashantRajput7372/NatoureBackend.git
   cd NatoureBackend
