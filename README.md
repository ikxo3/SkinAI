# SkinAI

SkinAI is an intelligent web-based application designed to assist
doctors and patients in the early diagnosis of skin diseases using
artificial intelligence.\
The project leverages state-of-the-art deep learning models combined
with modern backend and frontend technologies to deliver accurate,
reliable, and user-friendly results.

------------------------------------------------------------------------

## 🚀 Features

-   **Landing Page**: Elegant and welcoming interface for new users.\
-   **Authentication**: Secure login and registration system
    (JWT-based).\
-   **Skin Disease Detection**: Upload a skin image and get instant
    classification results with confidence scores.\
-   **Recommendations**: Provides links for further reading and
    encourages consulting dermatologists.\
-   **History**: Keeps a private log of all user tests and results.\
-   **Educational Cards**: Displays informative cards about various skin
    diseases, their symptoms, and details.\
-   **Privacy**: Each user's records are private and not accessible by
    others.\
-   **Future Enhancements**: Export results to PDF, expand dataset
    coverage, integrate with more advanced models.

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Programming Language**: Python\
-   **Backend**: Django REST Framework + JWT Authentication\
-   **Frontend**: HTML, CSS, JavaScript\
-   **AI Model**: YOLO-based skin disease classification model (trained
    and exported as `best.pt`)\
-   **Computer Vision**: OpenCV\
-   **Database**: SQLite (default), easily extendable to MySQL

------------------------------------------------------------------------

## 📊 Dataset

For training, a large set of skin disease images was collected.\
Due to the large size of the dataset, it is **not included directly in
this repository**.\
However, the trained model (`best.pt`) is provided so the system can be
tested and used immediately.

------------------------------------------------------------------------

## 📦 Installation & Usage

1.  Clone the repository:

    ``` bash
    git clone https://github.com/ikxo3/SkinAI.git
    cd skinai
    ```

2.  Create a virtual environment and install requirements:

    ``` bash
    python -m venv venv
    source venv/bin/activate   # On Linux/Mac
    venv\Scripts\activate    # On Windows
    pip install -r requirements.txt
    ```

3.  Apply migrations:

    ``` bash
    python manage.py migrate
    ```

4.  Run the server:

    ``` bash
    python manage.py runserver
    ```

5.  Access the app at:

        http://127.0.0.1:8000

------------------------------------------------------------------------

## 📂 Project Structure

    SkinAI/
    │── backend/        # Django project & APIs
    │── frontend/       # HTML, CSS, JS files
    │── models/         # Trained YOLO model (best.pt)
    │── static/         # Static assets (CSS, JS, images)
    │── templates/      # Frontend templates
    │── requirements.txt
    │── manage.py
    │── README.md

------------------------------------------------------------------------

## 🌟 Future Work

-   Add PDF report export for test results.\
-   Improve model accuracy by expanding datasets.\
-   Deploy on cloud platforms for real-time diagnosis.\
-   Build a mobile version of the app.

------------------------------------------------------------------------

## 👨‍💻 Author

Developed by **\[Your Name\]**\
An AI engineering student passionate about building real-world
applications in artificial intelligence, computer vision, and web
technologies.

------------------------------------------------------------------------

## 📜 License

This project is licensed under the MIT License.\
Feel free to use and modify it for educational and research purposes.
