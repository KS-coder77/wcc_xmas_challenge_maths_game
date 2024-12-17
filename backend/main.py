from flask import request, jsonify, session
from config import app, db
import random

app.secret_key = 'hello'
MAX_QUESTIONS = 3


# function to generate questions
def generate_question():
    operations = ['+', '-', '*', '/']
    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)
    operation = random.choice(operations)

# Ensure no division by zero for division operation
    if operation == '/' and num2 == 0:
        num2 = 1

    # question_number += 1
    question = f"{num1} {operation} {num2}"

    # Safely compute the answer
    if operation == '+':
        answer = num1 + num2
    elif operation == '-':
        answer = num1 - num2
    elif operation == '*':
        answer = num1 * num2
    elif operation == '/':
        answer = round(num1 / num2, 2)
    # answer = eval(question)
    return question, answer


# Endpoint to start the first round of the game
@app.route('/start', methods=['POST'])
def start_round():
    # session.clear()
    # initialise session variable
    session['question_count'] = 0
    session['score'] = 0
    session['max_questions'] = MAX_QUESTIONS  # set limit for questions
    session['questions'] = []  # store q's for each round
    return jsonify({"message": "Round started!", "question_count": 0, "score": 0})


# Endpoint to get a question
@app.route('/get_question', methods=['GET'])
def get_question():
    # check if max. reached
    if session['question_count'] >= MAX_QUESTIONS:
        return jsonify({'message': 'End of round!', 'gameOver': True, 'final_score': session['score']})
    # generate a new question
    question, answer = generate_question()
    session['questions'].append({'question': question, 'answer': answer})
    session['question_count'] += 1
    return jsonify({'question_count': session['question_count'], 'question': question, 'answer': answer, 'gameOver': False})


# Endpoint to check the user's answer
@app.route('/check', methods=['POST'])
def check_answer():
    data = request.get_json()
    user_answer = int(data['user_answer'])
    correct_answer = int(data['correct_answer'])

    result = user_answer == correct_answer
    if result:
        session['score'] += 1
        feedback = "Correct! 🎉"
    else:
        feedback = "Incorrect! Try again!"

    return jsonify({'correct': result, 'feedback': feedback, 'current_score': session['score']})


@app.route('/restart_round', methods=['POST'])
def reset_round():
    session.clear()
    session['question_count'] = 0
    return start_round()  # call start round function
    # jsonify({'message': 'Round reset successfully'})


# check file directly
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # only create models if not already created
    app.run(debug=True)
