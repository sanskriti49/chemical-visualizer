# Chemical Equipment Parameter Visualizer

A full-stack, multi-user application designed to provide instant analysis and visualization of chemical equipment data. This project features a cohesive user experience across a React web app and a PyQt5 desktop app, both powered by a single Django REST API backend.

This project allows users to upload CSV files containing chemical equipment data, receive an instant analysis, and visualize the results through various charts and a detailed data table.

---

**Deployed Links**
This application is live and ready for you to test. The backend is hosted on Render and the frontend on Vercel.
		Status

| Service            | Link                                    |
| ------------------ | ----------------------------------------|
| **Live Web App (Vercel)** | [chemical-visualizer.vercel.app](https://chemical-visualizer.vercel.app/)   |
| **Live API (Render)** | [chemical-visualizer.onrender.com](https://chemical-visualizer.onrender.com/)     |

Want to test it quickly? Feel free to register your own account, or use these demo credentials on the live web app:
Username: demo
Password: demo123
(Note: To enable these credentials, you'll need to create this user on your own deployed backend via the create_admin script or the registration page.)


### Live Demo (Web App)
A short video walkthrough of the web application:
https://jumpshare.com/share/BUABdbfM5ppqQ0Tiopza

<img width="1913" height="950" alt="Screenshot 2025-11-13 222434" src="https://github.com/user-attachments/assets/942f04da-2a45-49cf-b692-3dddb91ab19b" />
<img width="1919" height="917" alt="Screenshot 2025-11-13 222419" src="https://github.com/user-attachments/assets/65b9bc49-5a68-4a66-bc68-35b4886bdf5f" />
<img width="1919" height="924" alt="Screenshot 2025-11-13 222410" src="https://github.com/user-attachments/assets/b446463d-72bd-4592-bb44-373399f8e76e" />
<img width="1917" height="947" alt="Screenshot 2025-11-13 222512" src="https://github.com/user-attachments/assets/619d3637-3e13-4049-a681-981a9c5aeb31" />
<img width="1912" height="617" alt="Screenshot 2025-11-13 222524" src="https://github.com/user-attachments/assets/7a0c6eff-126f-494a-aa25-a92e495637fd" />
<img width="1911" height="966" alt="Screenshot 2025-11-13 222546" src="https://github.com/user-attachments/assets/113c35e0-de14-42f2-b435-9f4dee577755" />


### Live Demo (Desktop App)
<img width="348" height="374" alt="Screenshot 2025-11-13 175841" src="https://github.com/user-attachments/assets/3e6b386e-1848-40c7-8852-2cfcc3bcdc82" />
<img width="1919" height="992" alt="Screenshot 2025-11-13 222808" src="https://github.com/user-attachments/assets/ca04b773-b61d-450b-9002-6d56766ac530" />
<img width="1915" height="1003" alt="Screenshot 2025-11-13 175916" src="https://github.com/user-attachments/assets/210cf67f-20e2-4894-9da8-0a666b127b28" />
<img width="1919" height="1047" alt="Screenshot 2025-11-13 175924" src="https://github.com/user-attachments/assets/f7f22902-4dac-44c8-a681-e94de0123ef9" />
<img width="1919" height="1005" alt="Screenshot 2025-11-13 175933" src="https://github.com/user-attachments/assets/a0241d7e-af4f-42e2-bce7-e193fef9e663" />
<img width="1912" height="987" alt="Screenshot 2025-11-13 175941" src="https://github.com/user-attachments/assets/2b0d67e7-0730-4800-a041-7f730203c06f" />

## Key Features

*   **Seamless CSV Upload:** Both web and desktop clients feature a user-friendly interface for uploading equipment data files.
*   **User-Specific Data:** All uploaded datasets are tied to the user's account, ensuring data privacy in a multi-tenant environment.
*   **Secure Authentication:** A token-based authentication system protects all data-related API endpoints.
*   **In-Depth Data Analysis:** The Django backend uses Pandas to instantly calculate summary statistics, including total counts, averages (flowrate, pressure, temperature), and equipment type distribution.
*   **Rich Data Visualization:**
    *   **Web:** Interactive charts powered by `Chart.js`.
    *   **Desktop:** High-quality plots rendered with `Matplotlib`.
*   **Session History:** The 5 most recent uploads are saved and can be revisited at any time from either client.
*   **PDF Report Generation:** Users can download a clean, printable PDF summary of the current dataset.
*   **Hybrid Architecture:** A single source of truth (the Django API) serves two distinct frontend experiences, ensuring data consistency.

---

## Tech Stack

| Layer              | Technology                               | Purpose                                      |
| ------------------ | ---------------------------------------- | -------------------------------------------- |
| **Frontend (Web)** | React.js, Chart.js, Axios, TailwindCSS   | Interactive web dashboard & visualizations   |
| **Frontend (Desktop)** | Python, PyQt5, Matplotlib, Requests  | Native desktop dashboard & visualizations    |
| **Backend**        | Python, Django, Django REST Framework    | REST API, User Authentication, PDF Generation|
| **Data Handling**  | Pandas                                   | Reading CSV & analytics                      |
| **Database**       | SQLite                                   | Store last 5 uploaded datasets               |
| **Version Control**| Git & GitHub                             | Collaboration & submission                   |
| **Deployment**| Vercel (Frontend), Render (Backend & DB)      | Hosting, CI/CD, and scalability              |
| **Sample Data**|     sample_equipment_data.csv                | Sample CSV file provided for testing & demo  |

---

## Getting Started: Setup and Installation

Follow these steps to get the entire hybrid application running on your local machine.

### Prerequisites

*   **Git:** To clone the repository.
*   **Python 3.9.x:** The backend and desktop app are built on this version.
*   **Node.js and npm:** For running the React web application.

### 1. Clone the Repository

```bash
git clone https://github.com/sanskriti49/chemical-visualizer.git
cd chemical-visualizer
```
### 2. Backend Setup (Terminal 1)
The backend server is the heart of the application and must be running for either frontend to work.
You will need two separate terminals running simultaneously for the full experience: one for the backend and one for the frontend.

```
# 1) Navigate to the project root and create a Python 3.9 virtual environment
#    (Replace the path with your actual path to python3.9)
/path/to/your/python3.9 -m venv venv

# 2) Activate the environment
#    On Windows (Git Bash/MINGW64):
source venv/scripts/activate
#    On macOS/Linux:
#    source venv/bin/activate

# 3) Install all required Python packages
pip install -r requirements.txt

# 4) Navigate into the backend directory
cd backend

# 5) Apply database migrations
python manage.py migrate

# 6) Create a superuser account to log in with
python manage.py createsuperuser

# 7. Run the backend server!
python manage.py runserver
```
Your Django API is now live at http://localhost:8000. Leave this terminal running.

### 3. Frontend (Web) Setup (Terminal 2)
In your second terminal:

```
# 1. Navigate into the frontend directory
cd frontend

# 2. Install all Node.js dependencies
npm install

# 3. Run the React development server
npm start
```
Your React web application is now live at http://localhost:3000. You can log in using the superuser credentials you created.

### 4. Frontend (Desktop) Setup (Terminal 3)
The desktop app uses the same Python environment as the backend.
In a new (third) terminal, or after stopping the Django server:

```
# 1. Make sure your Python 3.9 virtual environment is active
source venv/scripts/activate

# 2. Navigate into the desktop directory
cd desktop

# 3. Run the PyQt5 application
python main.py
```
The desktop application will launch, and you can log in using the same superuser credentials.

### How to Use
Login: Use the credentials you created during the createsuperuser step to log in on either the web or desktop app.
Upload Data: Click the "Upload CSV" button and select one of the provided sample .csv files.
View Analysis: The dashboard will instantly populate with summary statistics, charts, and the raw data table.
Explore History: Click on a file in the "Analysis History" panel to load a previous dataset.
Download Report: Once a dataset is loaded, click the "Download PDF Report" button to save a summary of the analysis.

```
chem-visualiser/
├── backend/         # Contains the Django project
│   ├── api/         # The Django app handling all API logic
│   ├── backend/     # Main project settings
│   └── manage.py
├── desktop/         # Contains the PyQt5 desktop application
│   ├── main.py      # Main application logic
│   ├── main_window.ui # Qt Designer layout file
│   └── style.qss    # Stylesheet for the desktop app
├── frontend/        # Contains the React web application
│   ├── public/
│   └── src/
│       ├── components/ 
│       ├── pages/
│       ├── api.js
│       ├── App.jsx
│       └── .env.production.local
└── .gitignore       # Specifies files and folders for Git to ignore
└── README.md        
```
