from PIL import Image
import pytesseract

# Path to the Tesseract OCR executable (update this path accordingly)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_coordinates(image_path):
    # Open the image using Pillow
    img = Image.open(image_path)

    # Use Tesseract OCR to get the text and bounding boxes
    boxes_data = pytesseract.image_to_boxes(img)

    # Extract XY coordinates for each line
    coordinates_list = []
    for box_data in boxes_data.splitlines():
        box_info = box_data.split()
        coordinates = {
            'character': box_info[0],
            'x_min': int(box_info[1]),
            'y_min': int(box_info[2]),
            'x_max': int(box_info[3]),
            'y_max': int(box_info[4])
        }
        coordinates_list.append(coordinates)

    return coordinates_list

# Example usage
image_path = 'images/icon.png'
coordinates = extract_coordinates(image_path)

# Print the coordinates for each line
for coord in coordinates:
    print(f"Character: {coord['character']}, Coordinates: ({coord['x_min']}, {coord['y_min']}, {coord['x_max']}, {coord['y_max']})")

