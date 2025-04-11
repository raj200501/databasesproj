# Deployment Instructions for Campus Club Event Management System

u guys needa do these steps
---

## 1. Local Setup: What to Edit and Test

### 1.1. Configure the Backend Connection

**File:** `campus-club-management/backend/.env`

**What to Change:**  
- **DATABASE_URL**: Replace the placeholder with your Supabase PostgreSQL connection string (include username, password, host, port, and database name).  
- **PORT (optional)**: Change it if needed; default is `5000`.

Example contents:

```env
PORT=5000
DATABASE_URL="postgres://<your_username>:<your_password>@<host>:<port>/<your_database>"
```

---

### 1.2. Verify the Database Connection Code

**File:** `campus-club-management/backend/db/db.js`

**What to Check:**  
- Ensure the file uses `process.env.DATABASE_URL` as the connection string.  
- Confirm that the Pool options include SSL if needed, for example:

```js
ssl: { rejectUnauthorized: false }
```

---

### 1.3. Confirm API Routes Match Your Schema

Check each file in `campus-club-management/backend/routes/` to ensure the table names and column names match those in your Supabase database. Adjust if necessary:

- `students.js`
- `clubs.js`
- `events.js`
- `attendance.js`
- `notifications.js`
- `membershipTrends.js`
- (any additional files like `clubOfficers.js`, `eventOrganizers.js`, etc.)

For instance, if your table is called `STUDENTS` in the database, make sure your `SELECT * FROM STUDENTS` query matches.

---

### 1.4. Update the Frontend to Connect to the Correct Backend

**File:** `campus-club-management/frontend/src/components/Dashboard.js`

- Locate the Axios GET request. By default, it may look like this:

```js
axios.get('http://localhost:5000/api/events')
```

- For local testing, leave this as `http://localhost:5000` (if your backend runs on port 5000).
- Once you deploy the backend, you will replace this URL with your production URL (e.g., `https://<heroku-app-name>.herokuapp.com/api/events`).

---

### 1.5. Install Dependencies and Run Locally

#### 1.5.1. Backend

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd campus-club-management/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```
4. The backend will be accessible at [http://localhost:5000](http://localhost:5000).  

#### 1.5.2. Frontend

1. Open another terminal and navigate to the frontend directory:
   ```bash
   cd campus-club-management/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React app:
   ```bash
   npm start
   ```
4. The frontend will run at [http://localhost:3000](http://localhost:3000).

---

## 2. Deployment Instructions

This section covers deploying the backend (e.g., Heroku) and the frontend (e.g., Netlify). You can use other platforms, but these steps outline the typical process.

### 2.1. Deploying the Backend (Example: Heroku)

1. **Create a `Procfile`**  
   **File:** `campus-club-management/backend/Procfile`  
   **Contents:**
   ```bash
   web: node server.js
   ```

2. **Commit Your Changes**  
   From your project root (or specifically the backend folder if separate repos):
   ```bash
   git add .
   git commit -m "Prepare backend for Heroku deployment"
   ```

3. **Create a Heroku App**  
   Make sure you have the Heroku CLI installed and you are logged in:
   ```bash
   cd campus-club-management/backend
   heroku create <your-heroku-backend-app-name>
   ```

4. **Set Environment Variables on Heroku**  
   Set the `DATABASE_URL` (and any other variables) on Heroku:
   ```bash
   heroku config:set DATABASE_URL="postgres://<your_username>:<your_password>@<host>:<port>/<your_database>" --app <your-heroku-backend-app-name>
   heroku config:set PORT=5000 --app <your-heroku-backend-app-name>
   ```

5. **Deploy to Heroku**  
   From the backend folder, push to Heroku:
   ```bash
   git push heroku master
   ```
   or if your main branch is named `main`:
   ```bash
   git push heroku main
   ```

6. **Verify the Deployment**  
   Open the app in the browser:
   ```bash
   heroku open --app <your-heroku-backend-app-name>
   ```
   You should see your backend’s root response.  
   Example of an API endpoint check:
   ```
   https://<your-heroku-backend-app-name>.herokuapp.com/api/events
   ```

---

### 2.2. Deploying the Frontend (Example: Netlify)

1. **Update the Production API Endpoint**  
   In your React files (e.g., `campus-club-management/frontend/src/components/Dashboard.js`), update Axios calls to use your Heroku URL instead of `http://localhost:5000`. For example:
   ```js
   axios.get('https://<your-heroku-backend-app-name>.herokuapp.com/api/events')
   ```
   Then commit the change:
   ```bash
   git add src/components/Dashboard.js
   git commit -m "Update API endpoint for production"
   ```

2. **Build the Production Version of the React App**  
   ```bash
   cd campus-club-management/frontend
   npm run build
   ```
   This creates an optimized production build in the `build` directory.

3. **Deploy to Netlify**
   - Go to [Netlify](https://www.netlify.com) and log in or sign up.
   - Click “New site from Git” and connect your repository.
   - For build settings:
     - **Build Command:** `npm run build`
     - **Publish Directory:** `build`
   - Netlify will automatically run the build and deploy your site.

4. **Verify the Deployment**  
   - Once completed, Netlify will give you a URL (e.g., `https://my-project-name.netlify.app`).
   - Visit the site to confirm the frontend loads and can communicate with your Heroku backend.

---

## 3. Summary of Required Edits & Steps

1. **Backend**  
   - **Edit `.env`:** Set `PORT=5000` and `DATABASE_URL` to match your Supabase connection.  
   - **Check `db.js`:** Confirm it uses `process.env.DATABASE_URL`.  
   - **Check Route Files:** Ensure table names and columns match your actual schema.  
   - **Run Locally:** `npm install` & `npm run dev` in `backend`.

2. **Frontend**  
   - **Check Axios URLs:** For local development, use `http://localhost:5000`; for production, use your deployed Heroku URL.  
   - **Run Locally:** `npm install` & `npm start` in `frontend`.

3. **Deploy**  
   - **Backend (Heroku):**  
     1. Create a `Procfile` with `web: node server.js`.  
     2. Create a Heroku app, set config vars, and push code.  
     3. Verify the deployed API endpoints.  
   - **Frontend (Netlify):**  
     1. Update any API URLs to point to the Heroku app.  
     2. `npm run build`.  
     3. Deploy via Netlify, specifying `build` as the output folder.  
     4. Verify that your site fetches data from the live backend.

