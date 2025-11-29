# Driver Tickets - Georgian Driving Test Practice App

**Driver Tickets** is a full-stack application designed to help users prepare for the Georgian theoretical driving exam. It provides access to all driving test tickets with **voice-assisted audio explanations** in Georgian, allowing users to study effectively, save difficult questions, and focus on improving their knowledge. The backend is built with **Node.js/Express** and MySQL, while the frontend uses **React + Vite**.

---


The app is deployed on Vercel/Railway, and you can access it directly from your browser: https://driver-tickets.vercel.app/


---

## 🌟 Features

- Access **all 1000 Georgian driving test tickets**.
- Each ticket includes:
  - Question text
  - Answer options
  - **Audio support** for questions and explanations in Georgian.
- **Save tickets** for focused practice.
- Review and practice **saved tickets separately**.
- User authentication with **JWT tokens** for secure access.
- Protected API endpoints to ensure data security.

---

## 🖼 Screenshots

![Main Page](/frontend/src/design/Screenshot%202025-11-26%20174306.png)
![Exam Page](/frontend/src/design/Screenshot%202025-11-26%20174331.png)
![Mobile Version](/frontend/src/design/Screenshot%202025-11-26%20174442.png)
![Mobile Version](/frontend/src/design/Screenshot%202025-11-26%20174500.png)

---

## 🛠 Technologies Used

- **Frontend:** React + Vite, Bootstrap, CSS
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Version Control:** Git

---

## Live Demo

Check out the live app in your browser:  
[![Live Demo](https://driver-tickets.vercel.app/)](https://driver-tickets.vercel.app/)


## Installation

1. **Clone the repository**

    git clone https://github.com/Apridonidze/driver-tickets

2. **Install dependencies**

    cd frontend npm install
    cd backend npm install

3. **Create Enviromental Variabels**

cd backend
create .env file and add following vairables to it :

        JWT_SECRET_KEY="$fc59A636a27CBo5=sZ27o=Mc]WG76B"

        DB_HOST=localhost
        DB_USER=root
        DB_PASSWORD=your_db_password
        DB_DB=driver_tickets_db
        DB_PORT=1234

        PORT=8080
        ORIGIN_URL=http://localhost:5173
        BACKEND_URL=http://localhost:8080
---

4. **Database Setup**

    create database driver_tickets_db

    import ./database/schema.sql content into MySql Editor

---

5. **Run Server**

    cd frontend npm run dev

    cd backend nodemon server.js

---

- Backend runs on http://localhost:8080 by default.
- Frontend runs on http://localhost:5173 by default.




