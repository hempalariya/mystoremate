# 🛒 MyStoreMate - Grocery Management System

MyStoreMate is a full-stack Grocery Management System designed for local shopkeepers in India. It helps manage inventory, track sales, identify near-expiry or out-of-stock items, and list surplus stock for resale or discount. Built with **Node.js**, **Express**, **MongoDB**, and **Vanilla JavaScript**, the system provides real-time updates and user-specific dashboards.

---

## 🚀 Features

### 🧾 Product Management
- Add, update, and delete grocery products
- Auto-flag products as near expiry (within 30 days) or expired
- Detect and update stock levels (out of stock, restocked)

### 🔁 Resale & Discounts
- List extra stock for resale to nearby shopkeepers at custom prices
- Offer public discounts on near-expiry items
- View nearby resale listings from other shopkeepers

### 📉 Sales & Analytics
- Register sold items
- View:
  - **Aggregate stats** (Total Sale, Purchase, Profit/Loss)
  - **Salewise reports**
  - **Productwise reports** (which items are selling frequently)

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | HTML, CSS, JavaScript          |
| Backend      | Node.js, Express.js            |
| Database     | MongoDB + Mongoose             |
| Auth         | JWT Authentication             |
| Styling      | Bootstrap (custom classes)     |

---

## 📁 Project Structure



---

## 🔐 Authentication

- JWT is used for route protection.
- After login/register, the token is saved in `localStorage` and used for API calls.

---

## ⚙️ Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/mystoremate.git
cd mystoremate

### 2. Install Dependencies
npm install

### 3. create .env file
PORT=8000
MONGOURI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=3d

### 4. start the server
npm run dev




