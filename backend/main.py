from flask import request, jsonify
from config import app, db
from models import Student


@app.route("/students", methods=["GET"])
def get_students():
    students = Student.query.all()
    json_students = list(map(lambda x: x.to_json(), students))
    return jsonify({"students": json_students})  # convert python obj to json


@app.route("/register_user", methods=["POST"])
def register_user():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")

    if not first_name or not last_name:
        return (
            jsonify({"message": "You must include a first name and last name"}),
            400
            )
    new_student = Student(first_name=first_name, last_name=last_name)  # add new student
    try:
        db.session.add(new_student)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    return jsonify({"message": "User created!"}), 201  # new user created


# check file directly
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # only create models if not already created
    app.run(debug=True)
