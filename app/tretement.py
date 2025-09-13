import cv2
from ultralytics import YOLO
CLASS_NAMES = {
    0: "Acne" ,
    1: "Actinic_Keratosis",
    2: "Benign_tumors",
    3: "Bullous",
    4: "Candidiasis",
    5: "DrugEruption",
    6: "Eczema",
    7: "Infestations_Bites" ,
    8: "Lichen",
    9: "Lupus",
    10: "Moles",
    11: "Psoriasis",
    12: "Rosacea",
    13: "Seborrh_Keratoses",
    14: "SkinCancer",
    15: "Sun_Sunlight_Damage",
    16: "Tinea",
    17: "Unknown_Normal",
    18: "Vascular_Tumors",
    19: "Vasculitis",
    20: "Vitiligo",
    21: "Warts",
}

def process_image(image_path, model_path, conf_threshold=0.5, save_path="output.jpg"):
    try:
        model = YOLO(model_path)
        results = model.predict(source=image_path)

        probs = results[0].probs
        class_id = int(probs.top1)
        confidence = float(probs.top1conf)

        if confidence < conf_threshold:
            return save_path, {"cls": None, "conf": confidence, "class_name": "Low Confidence"}

        diagnosis = {
            "cls": class_id,
            "conf": confidence,
            "class_name": CLASS_NAMES.get(class_id, " ")
        }

        return save_path, diagnosis
    except Exception as e:
        return None, "Error processing image: " + str(e)
