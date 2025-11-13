# Chemical Equipment Parameter Visualizer

A hybrid application built for a screening task, demonstrating the ability to create a cohesive user experience across both a **Web (React)** and a **Desktop (PyQt5)** interface, powered by a single **Django REST API** backend.
This project allows users to upload CSV files containing chemical equipment data, receive an instant analysis, and visualize the results through various charts and a detailed data table.

---

### Live Demo (Web App)

https://s7.ezgif.com/tmp/ezgif-718a6e2dfa40e686.gif

## Key Features

*   **Seamless CSV Upload:** Both web and desktop clients feature a user-friendly interface for uploading equipment data files.
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
| **Backend**        | Python, Django, Django REST Framework    | REST API, Authentication, PDF Generation     |
| **Data Handling**  | Pandas                                   | Reading CSV & analytics                      |
| **Database**       | SQLite                                   | Store last 5 uploaded datasets               |
| **Version Control**| Git & GitHub                             | Collaboration & submission                   |
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
### 2. Backend Setup
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

### 3. Frontend (Web) Setup
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
4. Frontend (Desktop) Setup
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
│       ├── App.js
│       └── index.js
└── .gitignore       # Specifies files and folders for Git to ignore
└── README.md        
```
