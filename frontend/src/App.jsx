import { useState, useEffect } from 'react';
// import StudentList from './StudentList';
// import StudentForm from './StudentForm';
import './App.css';

const App = () => {
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  // Fetch a new question from the backend
  const fetchQuestion = async () => {
    const response = await fetch("http://127.0.0.1:5000/question");
    const data = await response.json();
    setQuestion(data.question);
    setCorrectAnswer(data.answer);
    setFeedback(""); // Reset feedback
    setUserAnswer(""); // Clear input
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://127.0.0.1:5000/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_answer: userAnswer,
        correct_answer: correctAnswer,
      }),
    });
    const data = await response.json();
    setFeedback(data.correct ? "Correct! 🎉" : "Wrong! Try again.");
  };

  useEffect(() => {
    fetchQuestion(); // Fetch question on component mount
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Maths Game</h1>
      <h2>Question: {question}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your answer"
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={fetchQuestion} style={{ marginTop: "20px" }}>
        Next Question
      </button>
      {feedback && <h3>{feedback}</h3>}
    </div>
  );
};

export default App;
