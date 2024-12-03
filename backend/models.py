from config import db
import random


class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    last_name = db.Column(db.String(80), unique=False, nullable=False)


def generate_question():
    """Generates a simple math question and its answer."""
    num1 = random.randint(1, 100)
    num2 = random.randint(1, 100)
    operation = random.choice(['+', '-', '*', '/'])

    if operation == '/':
        # Ensure a clean division question
        num1 = num1 * num2

    question = f"{num1} {operation} {num2}"
    answer = eval(question)

    # Limit answer precision for division
    if operation == '/':
        answer = round(answer, 2)

        return {"question": question, "answer": answer}

# Function to send JSON back and forth
    def to_json(self):
        return {
            "id": self.id,
            "firstName": self.first_name,
            "lastName": self.last_name
        }
