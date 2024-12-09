from flask import request, jsonify, session
from config import app, db
# from models import Student
import random

app.secret_key = 'your_secret_key'
MAX_QUESTIONS = 10


# function to generate questions
def generate_question():
    operations = ['+', '-', '*']
    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)
    operation = random.choice(operations)

# Ensure no division by zero for division operation
    if operation == '/' and num2 == 0:
        num2 = 1
    question = f"{num1} {operation} {num2}"
    answer = eval(question)
    return question, answer


# Endpoint to start the first round of the game
@app.route('/start', methods=['POST'])
def start_round():
    # initialise session variable
    session['question_count'] = 0
    session['questions'] = []  # store q's for each round


# Endpoint to get a random math question
@app.route('/question', methods=['GET'])
def get_question():
    if 'question_count' not in session:
        return jsonify({'message': 'Round not started'})
    if session['question_count'] >= MAX_QUESTIONS:
        return jsonify({'message': 'End of Round'})
    # generate a new question
    question, answer = generate_question()
    session['question_count'] += 1
    session['questions'].append({'question': question, 'answer': answer})
    return jsonify({'question': question, 'answer': answer})


# Endpoint to check the user's answer
@app.route('/check', methods=['POST'])
def check_answer():
    data = request.get_json()
    user_answer = int(data['user_answer'])
    correct_answer = int(data['correct_answer'])

    result = user_answer == correct_answer
    return jsonify({'correct': result})


@app.route('/reset_round', methods=['POST'])
def reset_round():
    session['question_count'] = 0
    return jsonify({'message': 'Next round'})


# check file directly
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # only create models if not already created
    app.run(debug=True)
