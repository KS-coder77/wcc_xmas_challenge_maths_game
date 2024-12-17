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
  const [questionCount, setQuestionCount] = useState(1);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  //const [round, setRound] = useState(1);
  const MAX_QUESTIONS = 3;

    
  // start round
  const startRound = async () => {
    try{
      const response = await fetch("http://127.0.0.1:5000/start", {method: "POST"});
      const data = await response.json();
      setMessage(data.message); 
      setQuestionCount(data.question_count);
      setQuestion(data.question);
      setCorrectAnswer(data.answer);
      setScore(data.score)
      // setGameOver(false)
      setFeedback(""); // Reset feedback
      fetchQuestion(); // fetch first question 
      setUserAnswer(""); // Clear input 
      setIsAnswered(false);
    } catch (error) {
      console.error("Error starting round: ", error)
    }

  };

  // function to get a question from the backend
  const fetchQuestion = async () => {
    try{ 
      const response = await fetch("http://127.0.0.1:5000/get_question");
      const data = await response.json();
      
      if (data.gameOver) {
        setGameOver(true); // set gameover flag 
        setMessage(data.message); //display 'end of round'
    } else {
      // setQuestionCount(data.questionCount + 1);
      setQuestion(data.question);
      setCorrectAnswer(data.answer);
      setFeedback(""); // Reset feedback
      setUserAnswer(""); // Clear input 
      setIsAnswered(false);
    } 
  } catch (error) {
      console.error("Error fetching question: ", error);
    }
  //   if (questionCount >= MAX_QUESTIONS)
  //       return; // Stop fetching if limit reached 
  // };
};

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // handle if empty string submitted by user 
    if (userAnswer.trim() === "") {
      setFeedback("Please enter a valid number");
      return;
    }
    try { 
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
  } catch (error){
    console.error("Error checking answer: ", error);
  }
}; 


// function to play a new round 
const playNewRound = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/restart_round", { method: "POST"});
    const data = await response.json();
    setMessage(data.message);
    setQuestionCount(0);
    setScore(0);
    setGameOver(false);
    fetchQuestion();
  } catch (error) {
    console.error("Error starting a new round: ", error);
  }
}

// handle unanswered questions with error msg 
  const nextQuestion = () => {
    if (isAnswered) {
      fetchQuestion();
    } else {
      setFeedback("Please submit an answer before moving to the next question.")
    }
  };

  // fetch the next question when the round is in session 
  // (i.e. when the game is not over)
  // useEffect(() => {
  //   if (!gameOver) {
  //     fetchQuestion();
  //     }  
  // }, [gameOver]);

  //useEffect to start the game on first render
  useEffect(() => {
    startRound();
    fetchQuestion();
  },[]);

  // display output 
  return (
  <div style={{...gameStyle, textAlign: "center", padding: "20px"}}> 
    {/* <button onClick={start} style={{ marginTop: "20px" }}>Let's Begin</button> */}
    <h1>Welcome to Maths Masters!</h1>
    {gameOver ? (
      <div> 
        <h2>Game Over!</h2>
        <h3>Your Score: {score}</h3>
        <button onClick={playNewRound} style={{ marginTop: "20px" }}>
        Play Again
        </button>
      </div>
    ) : ( 
      <div>
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
    </div>
    )} 
  </div>
);
};

export default Game;
