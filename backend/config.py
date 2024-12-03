from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# initialise flask app
app = Flask(__name__)
# wrap app in CORS
CORS(app)

# specify location of local SQL DB
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///maths_game.db"
app.config["SQL_ALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
