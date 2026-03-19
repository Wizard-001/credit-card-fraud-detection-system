# Credit Card Fraud Detection App

This project is a full-stack application for detecting credit card fraud using machine learning.

## Project Structure

- **`credit_card_fraud/`**: The frontend of the application, built with React, Vite, and Tailwind CSS.
- **`credit_card/`**: The backend of the application, built with FastAPI. It includes the machine learning model (`fraud_model.pkl`) and the API logic.

## Getting Started

### Backend Setup
1. Navigate to the `credit_card/` directory.
2. Install dependencies: `pip install -r requirements.txt`.
3. Run the API: `uvicorn api:app --reload`.

### Frontend Setup
1. Navigate to the `credit_card_fraud/` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm run dev`.

## Deployment Tips

### 1. Backend Deployment (FastAPI)
- Use the **root folder** for your deployment.
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker credit_card.api:app --bind 0.0.0.0:$PORT`
    - *Note*: If your platform asks for a "WSGI" or "Start Command", use the one above. It tells Gunicorn to use Uvicorn as the worker for your FastAPI app.

### 2. Frontend Deployment (Vite/React)
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: You **must** set an environment variable named `VITE_API_URL` to your deployed backend URL.
    - Example: `VITE_API_URL=https://your-backend-api.onrender.com`

---

## Team/Author
- [Your Name/GitHub Profile]
