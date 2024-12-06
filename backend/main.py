from flask import request, jsonify
from config import app, db
# from models import Student
import random


# Endpoint to get a random math question
@app.route('/question', methods=['GET'])
def get_question():
    operations = ['+', '-', '*']
    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)
    operation = random.choice(operations)

    # Ensure no division by zero for division operation
    if operation == '/' and num2 == 0:
        num2 = 1

    question = f"{num1} {operation} {num2}"
    answer = eval(question)

    return jsonify({'question': question, 'answer': answer})


# Endpoint to check the user's answer
@app.route('/check', methods=['POST'])
def check_answer():
    data = request.get_json()
    user_answer = int(data['user_answer'])
    correct_answer = int(data['correct_answer'])

    result = user_answer == correct_answer
    return jsonify({'correct': result})


# check file directly
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # only create models if not already created
    app.run(debug=True)
