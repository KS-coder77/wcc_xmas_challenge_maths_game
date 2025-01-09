import { useState, useEffect } from 'react';
import './App.css';


const Game = () => {
  const gameStyle = {
    background: '#FFA500',
    // height: '100vh',
    // width: '100vw',
    backgroundSize: 'cover'
  };
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  //const [round, setRound] = useState(1);
  const MAX_QUESTIONS = 10;
    
  // start game
  const start = async () => {
    const response = await fetch("http://127.0.0.1:5000/start");
    const data = await response.json();
    // setGameOver(data.gameOver); // set gameover flag 
    setMessage(data.message); 
  };

  // Fetch a new question from the backend
  const fetchQuestion = async () => {
    if (questionCount >= MAX_QUESTIONS)
      setGameOver(true);
      // return; // Stop fetching if limit reached 
    const response = await fetch("http://127.0.0.1:5000/get_question");
    const data = await response.json();
    if (data.gameOver) {
      setGameOver(true); // set gameover flag 
      setMessage(data.message); //display 'end of round'
      return;
    } else { 
      setQuestionCount(questionCount + 1);
      setQuestion(data.question);
      setCorrectAnswer(data.answer);
      setFeedback(""); // Reset feedback
      setUserAnswer(""); // Clear input 
      setIsAnswered(false);
    }
  };

  const resetRound = async () => {
    const response = await fetch("http://127.0.0.1:5000/reset_round");
    const data = await response.json();
    setMessage(data.message)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // handle if empty string submitted by user 
    if (userAnswer.trim() === "") {
      setFeedback("Please enter a valid number");
      return;
  }
    const response = await fetch("http://127.0.0.1:5000/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_answer: userAnswer,
        correct_answer: correctAnswer,
      }),
    });

    const data = await response.json();

    if (data.correct) {
        setScore(score+1) // keep track of score 
        setFeedback("Correct! 🎉")
    } else {
        setFeedback("Incorrect! Try Again")
    }

    setIsAnswered(true); 
    setUserAnswer(""); // Clear input
    }; 

    const nextQuestion = () => {    
      if (isAnswered) {
        fetchQuestion();
      } else {
          setFeedback("Please submit an answer before moving to the next question.")
      }
    };


    const playAgain = () => {
      resetRound();
    }

    useEffect(() => {
      if (!gameOver) {
      start();
      fetchQuestion();
        }  
    }, [gameOver]);

   return (
    <div style={{...gameStyle, textAlign: "center", padding: "20px"}}> 
      {/* <button onClick={start} style={{ marginTop: "20px" }}>Let's Begin</button> */}
      <h1>Welcome to Maths Masters!</h1>
      {gameOver ? (
        <>
        <h3>Game Over! Would you like to play again? </h3>
        <button onClick={playAgain} style={{ marginTop: "20px" }}>Yes</button>
        </>
      ) : ( 
        <> 
          <h2>Question {questionCount} out of {MAX_QUESTIONS}: </h2> 
          <h2>{question}</h2>  
          <h4>Score: {score}</h4>
          <h5>{message}</h5>
          <form onSubmit={handleSubmit}>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter answer"
            />
            <button type="submit">Submit</button>
          </form>
          <button onClick={nextQuestion} style={{ marginTop: "20px" }}>Next Question</button>
          {feedback && <h3>{feedback}</h3>}
        </>
      )}
    </div>
  );
};

export default Game;