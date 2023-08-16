from flask import Blueprint, jsonify, request, Response
from flask_pymongo import MongoClient 
from bson import json_util, ObjectId 
from werkzeug.security import generate_password_hash


connection_str = "mongodb://localhost:27017/"
client = MongoClient(connection_str)
db= client.naruto.users
user_routes = Blueprint('user_routes', __name__, url_prefix="/user")

@user_routes.route("/", methods=["GET"])
def listUsers():
    # Obtener todos los usuarios de la base de datos
    users = db.find()

    # Convertir los usuarios a formato JSON
    response = json_util.dumps(users)

    # Devolver la lista de usuarios en formato JSON
    return Response(response, mimetype="application/json")


@user_routes.route("/<id>", methods=["PUT"])
def putUser(id):
    username = request.json["username"]
    mail = request.json["mail"]
    password = request.json["password"]

    # Actualizar los campos modificables del usuario
    if username and mail and password:
        hash_password = generate_password_hash(password)
        update = db.update_one({"_id": ObjectId(id)}, {"$set": {
            "username": username,
            "password": password,
            "mail": mail
        }})
        response = jsonify({"message": f"EL USUARIO CON EL ID: {id} fue actualizado exitosamente"})
        return response

@user_routes.route("/create", methods=["POST"])
def createUser():
    # Obtener los datos enviados en la solicitud
    data = request.json
    mail = data.get("mail")
    username = data.get("username")
    password = data.get("password")

    # Verificar que se hayan proporcionado todos los datos requeridos
    if username and mail and password:
        # Generar el hash de la contraseña
        hash_password = generate_password_hash(password)

        # Insertar el nuevo usuario en la base de datos
        result = db.insert_one({
            "username": username,
            "mail": mail,
            "password": hash_password
        })

        # Obtener el ID del usuario insertado
        id = result.inserted_id

        # Construir la respuesta con el ID, username y mail del nuevo usuario
        response = {
            "id": str(id),
            "username": username,
            "mail": mail,
            "password": hash_password,
            "creted": True
        }

        # Devolver la respuesta con el nuevo usuario en formato JSON
        return jsonify(response), 201
    else:
        # Devolver un mensaje de error si no se proporcionaron todos los datos requeridos
        return jsonify({"message": "Faltan datos requeridos"}), 400


@user_routes.route("/<id>", methods=["DELETE"])
def deleteUser(id):
    db.delete_one({"_id": ObjectId(id)})
    response= jsonify({"message": f"el usuario de id: {id} fue eliminado exitosamente"})
    return response

   



