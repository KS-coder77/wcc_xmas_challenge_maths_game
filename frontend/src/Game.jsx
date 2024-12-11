import { useState, useEffect } from 'react';
import './App.css';

const Game = () => {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const MAX_QUESTIONS = 10;
    
  // start game
  const start = async () => {
    const response = await fetch("http://127.0.0.1:5000/start");
    const data = await response.json();
    setMessage(data.message); 
  };

  // Fetch a new question from the backend
  const fetchQuestion = async () => {
    const response = await fetch("http://127.0.0.1:5000/get_question");
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
    //setFeedback(data.correct ? "Correct! 🎉" : "Wrong! Try again.");
    if (data.correct) {
        setScore(score+1) // keep track of score 
        setFeedback("Correct! 🎉")
        setQuestionNumber(questionNumber+1)
    } else {
        setFeedback("Incorrect! Try Again")
    }
    };

    useEffect(() => {
    fetchQuestion(); // Fetch question on component mount
  }, []);

   return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Welcome! {message} </h1>  
      <button onClick={start} style={{ marginTop: "20px" }}>Let's Begin</button>
      <h1>Maths Game</h1>
      <h2>Question Number {questionNumber}:    {question}</h2>   
      <h4>Score: {score}</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter answer"
        />
        <button type="submit">Submit</button>
      </form>
      <button onClick={fetchQuestion} style={{ marginTop: "20px" }}>Next Question</button>
      {feedback && <h3>{feedback}</h3>}
    </div>
  );
};

export default Game;
