from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import PIL.Image
import io
import os
import requests
import base64

# Replace with your actual API token
replicate_api_token = "74d10746edb960a0164c9c8fc73ef7f23769e7f7"

# Specify the image path



app = FastAPI()
templates = Jinja2Templates(directory="templates")
@app.get("/", response_class=HTMLResponse)
async def read_item(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    content = await file.read()
    image = PIL.Image.open(io.BytesIO(content))
    # Read the image and encode it in Base64
    image_file = io.BytesIO()
    encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

    # Save the Base64-encoded image to a text file
    with open("image_base64.txt", "w") as text_file:
        text_file.write(encoded_image)

    prompt = '''
        Generate a detailed caption describing any dark patterns in the given image of a web/mobile UI.
        A dark pattern (also known as a "deceptive design pattern") is "a user interface that has been
        carefully crafted to trick users into doing things,
        such as buying overpriced insurance with their purchase or signing up for recurring bills".
        The image may or may not contain any dark patterns. If there are no dark patterns detected,
        then just reply with "No dark patterns".
        Only provide the caption in your response and no additional text.
        Remember, use your knowledge to check if a dark pattern actually exists in the image.
        If there are no dark patterns then just reply with "No dark patterns"
    '''
    # Define the request data, using the Base64-encoded image
    data = {
        "version": "e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358",
        "input": {
            "image": encoded_image,
            "prompt":prompt

        }
    }

    # Set up the headers
    headers = {
        "Authorization": f"Token {replicate_api_token}",
        "Content-Type": "application/json"
    }

    # Send the POST request
    response = requests.post(
        "https://api.replicate.com/v1/predictions",
        json=data,
        headers=headers
    )
    # Check for successful response
    if response.status_code == 200:
        print("Prediction successful!")
        prediction_data = response.json()
        print(prediction_data)
    else:
        print("Request failed with status code:", response.status_code)
        print("Response text:", response.text)


    return {"text_output": response.text}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
