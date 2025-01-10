from flask import request, jsonify, session
from config import app, db
import random

app.secret_key = 'hello'
MAX_QUESTIONS = 3


# function to generate questions
def generate_question():
    operations = ['+', '-', '*', '/']
    operation = random.choice(operations)
    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)

# Ensure larger number is divided by smaller number for division operation
    if operation == '/' and num2 > num1:
        num1 = num2
        num2 = num1
# Ensure smaller number is subtracted from larger number
    elif operation == '-' and num2 > num1:
        num1 = num2
        num2 = num1
# Change * to X
    elif operation == '*':
        operation = 'x'
    question = f"{num1} {operation} {num2}"

    # Safely compute the answer
    if operation == '+':
        answer = num1 + num2
    elif operation == '-':
        answer = num1 - num2
    elif operation == 'x':
        answer = num1 * num2
    elif operation == '/':
        answer = round(num1 / num2, 2)

    return question, answer


# Endpoint to start the first round of the game
@app.route('/start', methods=['GET'])
def start():
    # session.clear()
    # initialise session variable
    session['question_count'] = 0
    session['max_questions'] = MAX_QUESTIONS  # set limit for questions
    session['score'] = 0
    session['questions'] = []  # store q's for each round
    return jsonify({'gameOver': False})


# Endpoint to get a question
@app.route('/get_question', methods=['GET'])
def get_question():
    # check and initialise session variables
    if 'question_count' not in session:
        session['question_count'] = 1
    if 'questions' not in session:
        session['questions'] = []

    # check if max. reached
    if session['question_count'] >= MAX_QUESTIONS:
        return jsonify({'message': 'End of round!', 'gameOver': True})

    # generate a new question
    question, answer = generate_question()

    # update session with question and answer
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


@app.route('/reset_round', methods=['GET'])
def reset_round():
    # session['question_count'] = 0
    session.clear()
    start()
    get_question()
    return jsonify({'message': 'Round reset successfully', 'gameOver': False})


@app.route('/exit', methods=['GET'])
def exit_game():
    return jsonify({'message': 'Thanks for playing!'})


# check file directly
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # only create models if not already created
    app.run(debug=True)
