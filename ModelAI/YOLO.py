from ultralytics import YOLO
import cv2
model = YOLO(r"C:\Users\Administrateur\vsc-prj\skin\ModelAI\best.pt")
cv2.imread(r"C:\Users\Administrateur\vsc-prj\skin\skinAI\app\eczema.png")
results = model.predict(source=r"C:\Users\Administrateur\vsc-prj\skin\skinAI\app\eczema.png", conf=0.5, save=True, show=True)