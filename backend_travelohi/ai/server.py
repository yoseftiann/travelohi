from flask import Flask, request, jsonify
from predict import *
#Allow CORS
from flask_cors import CORS

#jangan lupa di jalanin servernya
#cd ke ai - python3 server.py

app = Flask(__name__)
CORS(app)

#Members API Route
@app.route("/members")
def members():
    return({"members" : ["Member1","Member2"]})

#Geo Guesser AI API Route
@app.route("/geoguesser", methods=['POST'])
def geo_guesser():
    if request.method == 'POST':
        image_file = request.files['image'] #Corresponds ke name file input field di HTML

        predict_category = guess_location('./geoguesser_model.h5',image_file)

        if predict_category is not None:
            return jsonify({'predicted_category' : predict_category})
        else:
            return jsonify({'error' : 'Image processing failed'}), 500

if __name__ == "__main__":
    app.run(debug=True)