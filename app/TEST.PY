from  tretement import process_image
import cv2
def main ():
    img =cv2.imread(r"C:\Users\Administrateur\vsc-prj\skin\skinAI\app\eczema.png")
    output_path , diagnosis = process_image(r"C:\Users\Administrateur\vsc-prj\skin\skinAI\app\eczema.png",
                                            r"C:\Users\Administrateur\vsc-prj\skin\ModelAI\best.pt",
                                            conf_threshold=0.5,
                                            save_path="output.jpg")
    print(diagnosis)
    print(output_path)
if __name__ == "__main__":
    main()