# 📸 PICT Nakshatra - Event Management & Voting Platform

## 🚀 Introduction  
PICT Nakshatra's **Event Website** is a comprehensive platform for **event registration, photo submission, and voting**.  
- Users can register for events and make payments via **Razorpay**.  
- Non-registered users can **vote** for submissions.  
- Admins have full control over **event creation & leaderboard management**.  
- The system integrates **Cloudinary for image storage**, with automatic account switching when storage is full.  
- **Google Sheets Integration** is used to collect and manage registration data efficiently.  

---

## 🔥 Features  
### 🎟️ **Event Registration with Payment**  
- Users can register for events via **Razorpay**.  
- Payment validation and confirmation emails are sent automatically.  
- Registration data is stored in the database and synced with **Google Sheets**.  

### 📸 **Photo Upload & Cloudinary Storage**  
- Participants can upload their **photo submissions**.  
- The platform supports **multiple Cloudinary accounts**, ensuring seamless storage when an account limit is reached.  

### 🗳️ **Voting System for Non-Registered Users**  
- Anyone can **vote** for their favorite submissions.  
- Voting is limited per user/IP to prevent spam.  

### 📊 **Leaderboard & Admin Panel**  
- Admins can **create and manage events**.  
- The **leaderboard** displays top submissions based on votes.  

### 📜 **Google Sheets Integration**  
- Registration data is automatically stored in **Google Sheets** for easy management.  

---

## 🏗️ Tech Stack  
### 💻 **Frontend**  
- **React.js** (UI Framework)  
- **Axios** (API Calls)  
- **Razorpay SDK** (Payment Processing)  
- **Tailwind CSS** (Styling)  

### 🛠️ **Backend**  
- **Node.js & Express.js** (Server)  
- **Prisma ORM** (Database Management)  
- **PostgreSQL** (Database)  
- **Cloudinary SDK** (Image Storage)  
- **Google Sheets API** (Data Collection)  

### 🔐 **Security & Authentication**  
- **JWT Authentication** for Admin Access  
- **CORS & Rate Limiting** for secure API requests  

---

## 🛠️ Installation & Setup  
### 🔹 **1. Clone the Repository**  
```sh
git clone https://github.com/Shriniwas27/Nakshtra_event_website.git
cd event-website
npm install
npm run dev
