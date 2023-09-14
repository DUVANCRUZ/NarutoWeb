import os
from dotenv import load_dotenv
import requests
from flask import Blueprint, jsonify, request, Response
from flask_pymongo import MongoClient 
from bson import json_util
from bson import ObjectId

# Carga las variables de entorno desde el archivo .env
load_dotenv()

# Obtiene las variables de entorno
MONGO_USER = os.getenv("MONGO_USER")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")


# Crear un Blueprint para las rutas relacionadas con los personajes
connection_str = f"mongodb+srv://{MONGO_USER}:{MONGO_PASSWORD}@cluster0.vscntvr.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(connection_str)
db= client.naruto.char
char_routes = Blueprint('char_routes', __name__, url_prefix="/char")

@char_routes.route("/app", methods=["GET"])
def getAppChars():
    url = "https://www.narutodb.xyz/api/character?page=1&limit=1500"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        characters = data.get("characters", [])

        result = []
        for character in characters:
            id=character.get("id")
            name = character.get("name")
            rank = character.get("rank", {})

            if isinstance(rank, list):
                rankI = "undefined"
                rankII = "undefined"
            else:
                ninjaRank = rank.get("ninjaRank", {})
                rankI = ninjaRank.get("Part I")
                rankII = ninjaRank.get("Part II")

            personal = character.get("personal", {})
            
            if isinstance(personal, list):
                occupation = "undefined"
                status = "undefined"
                sex= "undefined"
                clan= "undefined"
            else:
                occupation = personal.get("occupation")
                status = personal.get("status")
                sex= personal.get("sex")
                clan= personal.get("clan")
            
            images = character.get("images", [])

            obj = {
                "id": id,
                "sex": sex,
                "name": name,
                "occupation": occupation,
                "rankI": rankI,
                "rankII": rankII,
                "status": status,
                "images": images,
                "clan": clan
            }

            result.append(obj)

        return jsonify(result)
    else:
        return []

@char_routes.route("/create", methods=["POST"])
def createUser():
    data = request.json
    name = data.get("name")
    images = data.get("images")
    occupation = data.get("occupation")
    rankI = data.get("rankI")
    rankII = data.get("rankII")
    sex = data.get("sex")
    status = data.get("status")
    clan = data.get("clan")
    jutsu = data.get("jutsu")
    
    if clan and jutsu and name and images and occupation and rankI and rankII and sex and status:
        # Insertar el documento en la base de datos
        res = db.insert_one({
            "images": [images],
            "name": name,
            "occupation": occupation,
            "rank I": rankI,
            "rank II": rankII,
            "sex": sex,
            "status": status,
            "clan": clan,
            "jutsu": [jutsu],
        })

        db.update_one({"_id": res.inserted_id}, {"$set": {"id": str(res.inserted_id)}})

        
        # Construir la respuesta con el ID, etc.
        response = {
            "id": str(res.inserted_id),
            "images": images,
            "name": name,
            "occupation": occupation,
            "rank I": rankI,
            "rank II": rankII,
            "sex": sex,
            "status": status,
            "jutsu": jutsu,
            "clan": clan
        }
        return jsonify(response)
    else:
        # Devolver un mensaje de error si no se proporcionaron todos los datos requeridos
        return jsonify({"message": "Faltan datos requeridos"}), 400

@char_routes.route("/", methods=["GET"])
def listChars():

    # Obtener todos los personajes de la base de datos
    chars = db.find()

    # Convertir los personajes a formato JSON
    response = json_util.dumps(chars)

    # Devolver la lista de personajes en formato JSON
    return Response(response, mimetype="application/json")



#id character
@char_routes.route("/<id>", methods=["GET"])
def characterId(id):
    # Buscar primero en la base de datos local de MongoDB
    character_from_db = db.find_one({"id": id})

    if character_from_db:
        # Convertir el ObjectId a una cadena
        character_from_db["_id"] = str(character_from_db["_id"])
        return character_from_db
    
    # Si no se encuentra en la base de datos local, obtenerlo desde la API externa
    url = f"https://www.narutodb.xyz/api/character/{id}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        id = data.get("id")
        name = data.get("name")
        rank = data.get("rank", {})
        jutsu = data.get("jutsu") 

        if isinstance(rank, list):
            rankI = "undefined"
            rankII = "undefined"
        else:
            ninjaRank = rank.get("ninjaRank", {})
            rankI = ninjaRank.get("Part I")
            rankII = ninjaRank.get("Part II")

        personal = data.get("personal", {})
            
        if isinstance(personal, list):
            occupation = "undefined"
            status = "undefined"
            sex = "undefined"
            clan = "undefined"
        else:
            occupation = personal.get("occupation")
            status = personal.get("status")
            sex = personal.get("sex")
            clan = personal.get("clan")
            
        images = data.get("images", [])

        obj = {
            "id": id,
            "sex": sex,
            "name": name,
            "occupation": occupation,
            "rankI": rankI,
            "rankII": rankII,
            "status": status,
            "images": images,
            "clan": clan,
            "jutsu": jutsu
            
        }
        return obj
    else:
        return {}

#search Bar nombre
@char_routes.route("/name/<name>", methods=["GET"])
def filterName(name):
    result = getAppChars().json  # Obtener el contenido JSON de la respuesta
    response = []

    for personaje in result:
        if name.lower() in personaje["name"].lower():
            response.append(personaje)

    return jsonify(response)

@char_routes.route("/filter", methods=["GET"])
def filterAndOrder():
    result = getAppChars().json

    ranks = request.args.get("ranks")
    sex = request.args.get("sex")
    clan = request.args.get("clan")
    order = request.args.get("order")

    filtered_result = result  # Inicializar con todos los personajes y aplicar los filtros según corresponda

    if ranks:
        filtered_result = [personaje for personaje in filtered_result if personaje.get("rankI") == ranks or personaje.get("rankII") == ranks]
   
    if sex:
        filtered_result = [personaje for personaje in filtered_result if personaje.get("sex") == sex]

    if clan:
        filtered_result = [personaje for personaje in filtered_result if personaje.get("clan") in [clan]]

    if order == "asc":
        filtered_result = sorted(filtered_result, key=lambda x: x["name"].lower())
    elif order == "desc":
        filtered_result = sorted(filtered_result, key=lambda x: x["name"].lower(), reverse=True)

    return jsonify(filtered_result)




