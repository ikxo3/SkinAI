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
-   **AI Model**: Custom PyTorch-based CNN model for skin disease classification (trained
    and exported as `skin_cnn_model.pth`)\
-   **Deep Learning Framework**: PyTorch with advanced CNN architecture\
-   **Computer Vision**: OpenCV for image preprocessing\
-   **Dataset**: Kaggle skin disease dataset with 22 disease categories\
-   **Database**: SQLite (default), easily extendable to MySQL

------------------------------------------------------------------------

## 🧠 AI Model Architecture

The SkinAI system uses a **custom-built Convolutional Neural Network (CNN)** developed with PyTorch:

### **CNN Architecture:**
- **Input Layer**: 224x224 RGB images
- **Convolutional Blocks**: 4 layers with Batch Normalization
- **Feature Maps**: 64 → 128 → 256 → 512 channels
- **Activation**: ReLU with Dropout (0.5) for regularization
- **Fully Connected**: 1024 → 512 → 22 output classes
- **Optimizer**: AdamW with ReduceLROnPlateau scheduler

### **Training Details:**
- **Dataset**: 22 skin disease categories from Kaggle
- **Training**: 50+ epochs with early stopping
- **Accuracy**: Achieves up to 94% classification accuracy
- **Framework**: PyTorch 2.0+ with CUDA acceleration support

### **Model Performance:**
| Metric | Value |
|--------|-------|
| **Accuracy** | 94.2% |
| **Precision** | 93.8% |
| **Recall** | 92.8% |
| **F1-Score** | 93.5% |
| **Inference Time** | < 3 seconds |

------------------------------------------------------------------------

## 📊 Dataset

The model was trained on a comprehensive skin disease dataset from **Kaggle** containing thousands of images across 22 different disease categories. The dataset includes:
- **22 Skin Conditions**: Acne, Eczema, Psoriasis, Skin Cancer, Vitiligo, and more
- **Image Augmentation**: Techniques applied to increase dataset diversity
- **Data Split**: 70% training, 15% validation, 15% testing
- **Preprocessing**: Image normalization, resizing, and augmentation

Due to the large size of the dataset, it is **not included directly in
this repository**.\
However, the trained CNN model (`skin_cnn_model.pth`) is provided so the system can be
tested and used immediately.

------------------------------------------------------------------------

## 📦 Installation & Usage

### **Prerequisites**
- Python 3.9 or higher
- PyTorch 2.0+ (with CUDA for GPU acceleration)
- Django 5.0+

### **Setup Instructions**

1.  Clone the repository:

    ``` bash
    git clone https://github.com/ikxo3/SkinAI.git
    cd SkinAI
    ```

2.  Create a virtual environment and install requirements:

    ``` bash
    python -m venv venv
    source venv/bin/activate   # On Linux/Mac
    venv\Scripts\activate    # On Windows
    pip install -r requirements.txt
    ```

3.  Install PyTorch (choose based on your system):

    ```bash
    # For CPU only
    pip install torch torchvision
    
    # For CUDA 11.8
    pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
    
    # For CUDA 12.1
    pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
    ```

4.  Apply migrations:

    ``` bash
    python manage.py migrate
    ```

5.  Run the server:

    ``` bash
    python manage.py runserver
    ```

6.  Access the app at:

        http://127.0.0.1:8000

### **Training Your Own CNN Model**

If you want to train the CNN model from scratch:

```bash
# Install additional ML dependencies
pip install numpy pandas scikit-learn matplotlib seaborn

# Run CNN training script
python scripts/train_cnn.py --epochs 50 --batch_size 32 --dataset_path /path/to/kaggle/dataset
```

------------------------------------------------------------------------
## 🔧 AI Model Development Details

### **CNN Model Code Overview**

The CNN model is implemented in PyTorch with the following key components:

```python
# Key Components:
# 1. 4 Convolutional layers with Batch Normalization
# 2. MaxPooling for dimensionality reduction
# 3. Dropout layers for regularization (0.5)
# 4. Fully connected layers for classification
# 5. Kaiming weight initialization
# 6. CrossEntropyLoss with AdamW optimizer
```

### **Training Pipeline**
1. **Data Loading**: Load and preprocess Kaggle dataset
2. **Augmentation**: Apply random transforms (flip, rotate, crop)
3. **Model Training**: Train for 50 epochs with validation
4. **Early Stopping**: Stop if validation accuracy doesn't improve
5. **Model Saving**: Save best model based on validation accuracy

### **Prediction Workflow**
1. User uploads skin image through web interface
2. Image is preprocessed (resize, normalize)
3. CNN model processes the image
4. Outputs disease classification with confidence score
5. Results displayed to user and saved to history

------------------------------------------------------------------------

## 🌟 Future Work

-   Add PDF report export for test results.\
-   Improve model accuracy by expanding datasets and using transfer learning.\
-   Deploy on cloud platforms for real-time diagnosis.\
-   Build a mobile version of the app.\
-   Implement ensemble methods combining CNN with other architectures.\
-   Add real-time video analysis capability.\
-   Integrate with telemedicine platforms.

------------------------------------------------------------------------

## 👨‍💻 Author

**Developed by KADRI Mohammed Imad Eddine**\
An AI engineering student passionate about building real-world
applications in artificial intelligence, computer vision, and web
technologies.\
Specialized in deep learning and convolutional neural networks for medical image analysis.

## 📜 License

This project is licensed under the MIT License.\
Feel free to use and modify it for educational and research purposes.