from flask import Flask
from flask_cors import CORS
from routes.character_routes import char_routes


app = Flask(__name__)

# Configurar la conexión con MongoDB utilizando la función initialize_mongo
CORS(app)

# Registrar los Blueprints de las rutas
app.register_blueprint(char_routes)# Registra el blueprint de personajes


if __name__ == "__main__":
    app.run(debug=True)
