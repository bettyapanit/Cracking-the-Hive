// נתוני המשחק
// שימי לב: משושי התשובות (answers/) צריכים להיות 12 קבצי PNG נפרדים שחתכת בפוטושופ
// כל קובץ צריך להיקרא בדיוק כמו התשובה (עם קו תחתון במקום רווחים)
const gameData = [
    { question: "כמה פרחים בממוצע צריכה דבורה לבקר כדי לייצר קילוגרם אחד של דבש?", answer: "4,000,000", letterImage: "letters/4000000.png", answerImage: "answers/4000000.png" },
    { question: "כמה עיניים יש לדבורה בסך הכל?", answer: "5", letterImage: "letters/5.png", answerImage: "answers/5.png" },
    { question: "מהו הגורם היחיד שקובע אם זחל נקבה יתפתח לפועלת או למלכה?", answer: "סוג המזון (מזון מלכות)", letterImage: "letters/סוג_המזון__מזון_מלכות_.png", answerImage: "answers/סוג_המזון__מזון_מלכות_.png" },
    { question: "מהי המהירות הממוצעת (בק\"מ לשעה) שבה עפה דבורה עמוסה בצוף?", answer: "25", letterImage: "letters/25.png", answerImage: "answers/25.png" },
    { question: "מהו שמו של ה\"דבק\" הטבעי שהדבורים מייצרות לאיטום סדקים בכוורת?", answer: "פרופוליס", letterImage: "letters/פרופוליס.png", answerImage: "answers/פרופוליס.png" },
    { question: "כמה רגליים יש לדבורה?", answer: "6", letterImage: "letters/6.png", answerImage: "answers/6.png" },
    { question: "כמה פעמים בממוצע מנפנפת דבורה בכנפיה בשנייה אחת בזמן מעוף?", answer: "200", letterImage: "letters/200.png", answerImage: "answers/200.png" },
    { question: "מה תפקידו של \"ריקוד הדבורה\"?", answer: "לסמן לדבורים אחרות את כיוון הפרחים ביחס למיקום השמש", letterImage: "letters/לסמן_לדבורים_אחרות_את_כיוון_הפרחים_ביחס_למיקום_השמש.png", answerImage: "answers/לסמן_לדבורים_אחרות_את_כיוון_הפרחים_ביחס_למיקום_השמש.png" },
    { question: "מהו החומר אותו מפרישות הדבורים מגופן כדי לבנות את תאי הכוורת?", answer: "דונג", letterImage: "letters/דונג.png", answerImage: "answers/דונג.png" },
    { question: "כמה כפיות דבש מייצרת דבורה פועלת אחת במהלך כל תקופת חייה?", answer: "1/2", letterImage: "letters/0_5.png", answerImage: "answers/0_5.png" },
    { question: "מהי הטמפרטורה (במעלות צלזיוס) שעליה שומרות הדבורים בתוך הכוורת?", answer: "35", letterImage: "letters/35.png", answerImage: "answers/35.png" },
    { question: "לאיזה גובה מקסימלי (במטרים) מסוגלת דבורה להגיע?", answer: "9000", letterImage: "letters/9000.png", answerImage: "answers/9000.png" }
];

const correctSentence = "משהו מתוק מגיע";
const hexPositions = [
    {x: 80, y: 50}, {x: 235, y: 50}, {x: 380, y: 50}, {x: 540, y: 50},
    {x: 155, y: 160}, {x: 305, y: 160}, {x: 455, y: 160}, {x: 605, y: 160},
    {x: 80, y: 270}, {x: 235, y: 270}, {x: 380, y: 270}, {x: 540, y: 270}
];

let matched = Array(12).fill(false);
let usedAnswers = Array(12).fill(false);
let currentDraggedAnswer = null;
let currentDraggedIndex = null;

function initGame() {
    matched = Array(12).fill(false);
    usedAnswers = Array(12).fill(false);
    
    createQuestionsOverlay();
    createAnswersGrid();
    
    document.getElementById('finalSection').style.display = 'none';
    document.getElementById('finalInput').value = '';
}

function createQuestionsOverlay() {
    const overlay = document.getElementById('questionsOverlay');
    overlay.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        const hex = document.createElement('div');
        hex.className = 'hexagon';
        hex.dataset.index = i;
        hex.style.left = `${hexPositions[i].x}px`;
        hex.style.top = `${hexPositions[i].y}px`;
        
        hex.innerHTML = `
            <div class="hex-inner">
                <div class="hex-front"></div>
                <div class="hex-back">
                    <img src="${gameData[i].letterImage}" alt="אות" class="letter-image">
                </div>
            </div>
        `;
        
        hex.addEventListener('dragover', handleDragOver);
        hex.addEventListener('drop', handleDrop);
        
        overlay.appendChild(hex);
    }
    
    const firstHex = overlay.querySelector('[data-index="0"]');
    const beeContainer = document.createElement('div');
    beeContainer.className = 'bee-container';
    beeContainer.innerHTML = `
        <div class="bee-emoji">🐝</div>
        <div class="bee-bubble">
            <p class="bee-text">מסלול מעוף הדבורה<br>מתחיל כאן. עקבי אחריו...</p>
        </div>
    `;
    firstHex.appendChild(beeContainer);
}

function createAnswersGrid() {
    const grid = document.getElementById('answersGrid');
    grid.innerHTML = '';
    
    const shuffled = [...gameData].sort(() => Math.random() - 0.5);
    
    shuffled.forEach((data, i) => {
        const item = document.createElement('div');
        item.className = 'answer-item';
        item.dataset.answerIndex = i;
        item.dataset.answer = data.answer;
        item.draggable = true;
        
        item.innerHTML = `<img src="${data.answerImage}" alt="${data.answer}">`;
        
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        
        grid.appendChild(item);
    });
}

function handleDragStart(e) {
    currentDraggedAnswer = e.currentTarget.dataset.answer;
    currentDraggedIndex = parseInt(e.currentTarget.dataset.answerIndex);
    e.currentTarget.classList.add('dragging');
}

function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    
    const hexagon = e.currentTarget;
    const questionIndex = parseInt(hexagon.dataset.index);
    
    if (matched[questionIndex]) return;
    
    const correctAnswer = gameData[questionIndex].answer;
    
    if (currentDraggedAnswer === correctAnswer) {
        matched[questionIndex] = true;
        hexagon.classList.add('flipped');
        
        const answerItem = document.querySelector(`[data-answer-index="${currentDraggedIndex}"]`);
        if (answerItem) {
            answerItem.classList.add('used');
            usedAnswers[currentDraggedIndex] = true;
        }
        
        if (matched.every(m => m)) {
            setTimeout(() => {
                showFinalSection();
            }, 1000);
        }
    } else {
        hexagon.classList.add('shake');
        setTimeout(() => hexagon.classList.remove('shake'), 400);
    }
}

function showFinalSection() {
    const beeContainer = document.querySelector('.bee-container');
    if (beeContainer) {
        beeContainer.classList.add('visible');
    }
    
    setTimeout(() => {
        document.getElementById('finalSection').style.display = 'block';
        document.getElementById('finalInput').focus();
    }, 800);
}

function checkAnswer() {
    const input = document.getElementById('finalInput');
    const userAnswer = input.value.trim();
    
    if (userAnswer === correctSentence) {
        showVictory();
    } else {
        input.classList.add('shake');
        input.style.borderColor = 'red';
        setTimeout(() => {
            input.classList.remove('shake');
            input.style.borderColor = '#d4a017';
        }, 400);
    }
}

function showVictory() {
    document.getElementById('victoryOverlay').style.display = 'flex';
}

function playAgain() {
    document.getElementById('victoryOverlay').style.display = 'none';
    initGame();
}

document.getElementById('submitBtn').addEventListener('click', checkAnswer);
document.getElementById('finalInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});
document.getElementById('playAgainBtn').addEventListener('click', playAgain);

window.addEventListener('load', initGame);
