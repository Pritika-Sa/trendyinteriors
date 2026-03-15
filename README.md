# TrendyInterios MERN Stack Application

A full-stack web application built with MongoDB, Express, React, and Node.js that replicates the TrendyInterios interior design website with complete e-commerce and customer engagement features.

## 🎯 Project Overview

This is a complete MERN stack clone of the TrendyInterios website featuring:
- Responsive design matching the original website
- Product catalog with categories
- Customer testimonial system
- Contact form management
- Admin dashboard capabilities
- Modern UI with smooth animations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **MongoDB** (v4.0 or higher) - [Download Community Edition](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)


## Features

✅ Complete responsive design matching original website
✅ Product catalog with categories (Kitchen, Accessories)
✅ Project showcase (Commercial, Residential, Art & Craft)
✅ Customer testimonial system
✅ Contact form management
✅ Modern UI with smooth animations
✅ RESTful API backend
✅ MongoDB database integration

## Technology Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- CSS3 with responsive design

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS & Body Parser

**Tools:**
- npm
- Nodemon (development)

# Complete Step-by-Step Setup Instructions

## Installation Requirements

1. **Node.js & npm**
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Verify: `mongod --version`

3. **Git (Optional)**
   - Download: https://git-scm.com/

## Step 1: Clone or Create Project

Clone from GitHub
git clone https://github.com/yourusername/trendyinterios-mern.git
cd trendyinterios-mern

OR create new
mkdir trendyinterios-mern
cd trendyinterios-mern

text

## Step 2: Setup Backend (Server)

cd server

Install dependencies
npm install

Create .env file with:
MONGODB_URI=mongodb://localhost:27017/trendyinterios
PORT=5000
NODE_ENV=development

Start MongoDB (in separate terminal)
mongod

Start backend server
npm run dev

or: npm start
text

Expected output:
MongoDB connected successfully
Server running on port 5000

text

## Step 3: Setup Frontend (Client)

cd ../client

Install dependencies
npm install

Start development server
npm start

text

The app will open at: http://localhost:3000

## Step 4: Test the Application

1. Visit http://localhost:3000 in your browser
2. Test all navigation links
3. Try submitting a contact form
4. Try submitting a testimonial
5. Check browser console for errors
6. Check terminal for server logs
