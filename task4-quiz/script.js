// 1. The quiz data (10 questions)
const allQuestions = [
  {
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "High Tech Modern Language",
      "HyperText Making Links",
      "Home Tool Markup Language"
    ],
    answer: 0
  },
  {
    question: "Which CSS property changes the text colour?",
    options: ["font-style", "color", "text-size", "background"],
    answer: 1
  },
  {
    question: "Which symbol is used for an id selector in CSS?",
    options: [".", "#", "*", "&"],
    answer: 1
  },
  {
    question: "Which keyword declares a variable that cannot be reassigned in JavaScript?",
    options: ["var", "let", "const", "define"],
    answer: 2
  },
  {
    question: "Which HTML tag creates the largest heading?",
    options: ["<h1>", "<head>", "<header>", "<heading>"],
    answer: 0
  },
  {
    question: "Which CSS layout system is built for rows AND columns?",
    options: ["Float", "Grid", "Position", "Inline"],
    answer: 1
  },
  {
    question: "What does the alt attribute of an image provide?",
    options: [
      "A link to the image",
      "A text description of the image",
      "The size of the image",
      "A border for the image"
    ],
    answer: 1
  },
  {
    question: "Which method finds an HTML element by its id?",
    options: [
      "document.getElementById()",
      "document.findId()",
      "document.selectById()",
      "document.getId()"
    ],
    answer: 0
  },
  {
    question: "Which symbol starts a single-line comment in JavaScript?",
    options: ["//", "<!-- -->", "#", "**"],
    answer: 0
  },
  {
    question: "Which media query applies to screens up to 768px wide?",
    options: [
      "@media (min-height: 768px)",
      "@media (max-width: 768px)",
      "@screen (768px)",
      "@responsive (768px)"
    ],
    answer: 1
  }
];

// Shuffle helper: returns a new list in random order
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// The list the quiz actually uses (starts in the original order)
let questions = [...allQuestions];

// 2. Messages shown after a correct answer
const praise = [
  "Correct! Nice work!",
  "Spot on!",
  "Well done, keep it up!",
  "Yes! You're on a roll."
];

// 3. The quiz state
let currentIndex = 0;
let score = 0;
let answered = false;

// 4. Grab the HTML elements
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");
const progressEl = document.getElementById("progress");
const liveScoreEl = document.getElementById("live-score");
const barFill = document.getElementById("bar-fill");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const messageEl = document.getElementById("message");
const nextBtn = document.getElementById("next-btn");
const resultTitle = document.getElementById("result-title");
const scoreEl = document.getElementById("score");
const resultText = document.getElementById("result-text");
const restartBtn = document.getElementById("restart-btn");

// 5. Helper: show a message with a style (error, good or bad)
function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = "message " + type;
}

// 6. Show the current question
function showQuestion() {
  const q = questions[currentIndex];
  answered = false;
  showMessage("", "");

  progressEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  liveScoreEl.textContent = `Score: ${score}`;
  barFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";

  q.options.forEach((text, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.textContent = text;
    button.addEventListener("click", () => selectOption(index));
    optionsEl.appendChild(button);
  });

  nextBtn.textContent =
    currentIndex === questions.length - 1 ? "Finish" : "Next";
}

// 7. When an answer is clicked: lock the options and give feedback
function selectOption(index) {
  if (answered) return;
  answered = true;

  const correct = questions[currentIndex].answer;
  const buttons = document.querySelectorAll(".option");

  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === correct) {
      button.classList.add("correct");
    } else if (i === index) {
      button.classList.add("wrong");
    }
  });

  if (index === correct) {
    score++;
    const randomPraise = praise[Math.floor(Math.random() * praise.length)];
    showMessage(randomPraise, "good");
  } else {
    const rightText = questions[currentIndex].options[correct];
    showMessage(`Not quite. The answer is "${rightText}". Keep going!`, "bad");
  }

  liveScoreEl.textContent = `Score: ${score}`;
}

// 8. Next / Finish button, with validation
function handleNext() {
  if (!answered) {
    showMessage("Please select an answer before continuing.", "error");
    return;
  }

  currentIndex++;

  if (currentIndex < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// 9. Pick a message depending on the final score
function getFeedback(percent) {
  if (percent === 100) {
    return { title: "Perfect score! 🏆", text: "You nailed every question. Amazing work!" };
  }
  if (percent >= 70) {
    return { title: "Great job! 🎉", text: "You know your stuff. A bit more practice and you'll be perfect." };
  }
  if (percent >= 50) {
    return { title: "Good effort! 👍", text: "You're getting there. Keep practising and try again." };
  }
  return { title: "Keep practising 💪", text: "Everyone starts somewhere. Review the basics and give it another go!" };
}

// 10. Show the final result
function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  const percent = Math.round((score / questions.length) * 100);
  const feedback = getFeedback(percent);

  resultTitle.textContent = feedback.title;
  scoreEl.textContent = `${score} / ${questions.length} (${percent}%)`;
  resultText.textContent = feedback.text;
}

// 11. Start again
function restart() {
  currentIndex = 0;
  score = 0;
  questions = shuffle(allQuestions);
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
  showQuestion();
}

// 12. Connect the buttons and start
nextBtn.addEventListener("click", handleNext);
restartBtn.addEventListener("click", restart);
showQuestion();