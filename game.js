let score = 0;
let correctAnswer = '';

function decodeHtmlEntities(text) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
}

async function generateQuestion() {
    const apiUrl = 'https://opentdb.com/api.php?amount=1&type=multiple';
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results.length > 0) {
            const questionData = data.results[0];
            correctAnswer = decodeHtmlEntities(questionData.correct_answer); // Decode correct answer
            displayQuestion(questionData);
        } else {
            document.getElementById('question').innerText = 'No questions available at the moment. Please try again later.';
        }
    } catch (error) {
        console.error('Error fetching the question:', error);
        document.getElementById('question').innerText = 'Error fetching the question. Please try again later.';
    }
}

function displayQuestion(questionData) {
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    const question = decodeHtmlEntities(questionData.question); // Decode question
    const answers = [...questionData.incorrect_answers, correctAnswer];
    answers.sort(() => Math.random() - 0.5); // Shuffle answers

    questionElement.innerHTML = `<p>${question}</p>`;
    answersElement.innerHTML = '';
    answers.forEach(answer => {
        const answerDiv = document.createElement('div');
        answerDiv.className = 'answer';
        answerDiv.innerText = decodeHtmlEntities(answer); // Decode answer
        answerDiv.onclick = () => checkAnswer(answer);
        answersElement.appendChild(answerDiv);
    });
}

function checkAnswer(selectedAnswer) {
    const answers = document.querySelectorAll('.answer');
    answers.forEach(answerElement => {
        if (answerElement.innerText === selectedAnswer) {
            if (selectedAnswer === correctAnswer) {
                answerElement.classList.add('correct');
                score++;
            } else {
                answerElement.classList.add('incorrect');
            }
        } else if (answerElement.innerText === correctAnswer) {
            answerElement.classList.add('correct'); // Show the correct answer
        }
        answerElement.onclick = null; // Disable further clicks
    });

    updateScore();
    setTimeout(generateQuestion, 3000); // Move to the next question after 3 seconds
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.innerText = `Score: ${score}`;
}

// Initialize the score and generate an initial question when the page loads
window.onload = () => {
    score = 0;
    updateScore();
    generateQuestion();
};