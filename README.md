# 🍱 LeftOverLove (MERN)

**LeftOverLove** is a full-stack platform that connects **food donors** with **NGOs**, helping ensure surplus food reaches those who need it instead of going to waste.
Built with the **MERN stack**, it features real-time tracking, secure authentication, and role-based dashboards.

---

## 🚀 Features

* 🥗 Donors can post surplus food details
* 🏢 NGOs can browse, accept, and track donations
* 🔐 Secure authentication with **JWT** and **bcryptjs**
* 🗺️ Live map tracking using **OpenStreetMap + Leaflet.js**
* ⚡ Real-time donation flow: *Pending → Accepted → Delivered*
* 📊 Role-based dashboards for Donors and NGOs

---

## 🧩 Tech Stack

**Frontend:** React, Vite, React Router, Axios
**Backend:** Node.js, Express.js, JWT, bcryptjs
**Database:** MongoDB (Mongoose)

---

## ⚙️ Setup & Quick Start

### 1️⃣ Configure environment variables

Create `backend/.env` from `backend/.env.example` and set:

```env
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_secret_key>
```

### 2️⃣ Install dependencies

From the project root:

```bash
npm run install:all
```

### 3️⃣ Run in development mode

```bash
npm run dev
```

**Servers:**

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend → [http://localhost:5000](http://localhost:5000)

---

## 📡 API Summary

| Method   | Endpoint                        | Description                                                  | Role  |
| :------- | :------------------------------ | :----------------------------------------------------------- | :---- |
| **POST** | `/api/auth/register`            | Register new user `{ name, email, password, role, contact }` | All   |
| **POST** | `/api/auth/login`               | Login user `{ email, password }`                             | All   |
| **POST** | `/api/donations/new`            | Create a new donation                                        | Donor |
| **GET**  | `/api/donations`                | View all pending donations                                   | NGO   |
| **GET**  | `/api/donations/my`             | View donor’s own donations                                   | Donor |
| **PUT**  | `/api/donations/:id`            | Accept or update donation                                    | NGO   |
| **PUT**  | `/api/donations/:id/status`     | Update delivery status                                       | NGO   |
| **GET**  | `/api/donations/status/:userId` | Get all donation statuses for a user                         | All   |

---

## 👥 Team

Developed collaboratively by
**Simret M Kotian**, **Sia Simran A** and **Shriya K**
as part of the **Web Technology Mini Project**.

## 🌿 Acknowledgements

* [OpenStreetMap](https://www.openstreetmap.org/) – Mapping data
* [Leaflet.js](https://leafletjs.com/) – Interactive maps
* [Vite](https://vitejs.dev/) – Frontend tooling

---

