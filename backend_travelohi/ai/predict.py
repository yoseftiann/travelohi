from tensorflow import keras
from PIL import Image
import numpy as np

#Categories
categories = ['Brazil', 'Canada', 'Finland', 'Japan', 'United_States', 'United-Kingdom']

#Pre process image 
def preprocess_image(image):
    image = image.resize((224, 224))

    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    img_array = np.array(image)
    img_array = img_array / 255.0
    return img_array

def guess_location(model_path, img_path):
    model = keras.models.load_model(model_path)
    
    #Pre process img_path 
    image = Image.open(img_path)
    img_array = preprocess_image(image)

    #Predict
    predictions = model.predict(np.expand_dims(img_array, axis=0))
    print(predictions)
    predicted_index = np.argmax(predictions, axis=1)[0]
    
    #Get the category name
    predicted_name = categories[predicted_index]
    return predicted_name