// נתוני המשחק
const gameData = [
    { question: "כמה פרחים בממוצע צריכה דבורה לבקר כדי לייצר קילוגרם אחד של דבש?", answer: "4,000,000", letterImage: "letters/L4000000.png", answerImage: "answers/A4000000.png" },
    { question: "כמה עיניים יש לדבורה בסך הכל?", answer: "5", letterImage: "letters/L5.png", answerImage: "answers/A5.png" },
    { question: "מהו הגורם היחיד שקובע אם זחל נקבה יתפתח לפועלת או למלכה?", answer: "סוג המזון (מזון מלכות)", letterImage: "letters/Lסוג_המזון__מזון_מלכות_.png", answerImage: "answers/Aסוג_המזון__מזון_מלכות_.png" },
    { question: "מהי המהירות הממוצעת (בק\"מ לשעה) שבה עפה דבורה עמוסה בצוף?", answer: "25", letterImage: "letters/L25.png", answerImage: "answers/A25.png" },
    { question: "מהו שמו של ה\"דבק\" הטבעי שהדבורים מייצרות לאיטום סדקים בכוורת?", answer: "פרופוליס", letterImage: "letters/Lפרופוליס.png", answerImage: "answers/Aפרופוליס.png" },
    { question: "כמה רגליים יש לדבורה?", answer: "6", letterImage: "letters/L6.png", answerImage: "answers/A6.png" },
    { question: "כמה פעמים בממוצע מנפנפת דבורה בכנפיה בשנייה אחת בזמן מעוף?", answer: "200", letterImage: "letters/L200.png", answerImage: "answers/A200.png" },
    { question: "מה תפקידו של \"ריקוד הדבורה\"?", answer: "לסמן לדבורים אחרות את כיוון הפרחים ביחס למיקום השמש", letterImage: "letters/Lלסמן_לדבורים_אחרות_את_כיוון_הפרחים_ביחס_למיקום_השמש.png", answerImage: "answers/Aלסמן_לדבורים_אחרות_את_כיוון_הפרחים_ביחס_למיקום_השמש.png" },
    { question: "מהו החומר אותו מפרישות הדבורים מגופן כדי לבנות את תאי הכוורת?", answer: "דונג", letterImage: "letters/Lדונג.png", answerImage: "answers/Aדונג.png" },
    { question: "כמה כפיות דבש מייצרת דבורה פועלת אחת במהלך כל תקופת חייה?", answer: "1/2", letterImage: "letters/L0_5.png", answerImage: "answers/A0_5.png" },
    { question: "מהי הטמפרטורה (במעלות צלזיוס) שעליה שומרות הדבורים בתוך הכוורת?", answer: "35", letterImage: "letters/L35.png", answerImage: "answers/A35.png" },
    { question: "לאיזה גובה מקסימלי (במטרים) מסוגלת דבורה להגיע?", answer: "9000", letterImage: "letters/L9000.png", answerImage: "answers/A9000.png" }
];

const correctSentence = "משהו מתוק מגיע";
const hexPositions = [
    {x: 30, y: 20}, {x: 175, y: 20}, {x: 320, y: 20}, {x: 465, y: 20},
    {x: 100, y: 185}, {x: 245, y: 185}, {x: 390, y: 185}, {x: 535, y: 185},
    {x: 30, y: 350}, {x: 175, y: 350}, {x: 320, y: 350}, {x: 465, y: 350}
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
    
    const positions = [
        {x: 3.8, y: 3.3}, {x: 21.9, y: 3.3}, {x: 40.0, y: 3.3}, {x: 58.1, y: 3.3},
        {x: 12.5, y: 30.8}, {x: 30.6, y: 30.8}, {x: 48.8, y: 30.8}, {x: 66.9, y: 30.8},
        {x: 3.8, y: 58.3}, {x: 21.9, y: 58.3}, {x: 40.0, y: 58.3}, {x: 58.1, y: 58.3}
    ];
    
    for (let i = 0; i < 12; i++) {
        const hex = document.createElement('div');
        hex.className = 'hexagon';
        hex.dataset.index = i;
        hex.style.position = 'absolute';
        hex.style.left = `${positions[i].x}%`;
        hex.style.top = `${positions[i].y}%`;
        hex.style.width = '17.5%';
        hex.style.height = '26.7%';
        
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
    
    // הוספת תמונת הרקע של לוח התשובות
    grid.style.backgroundImage = 'url(answers-board.png)';
    grid.style.backgroundSize = 'contain';
    grid.style.backgroundRepeat = 'no-repeat';
    grid.style.backgroundPosition = 'center';
    grid.style.position = 'relative';
    grid.style.width = '100%';
    grid.style.paddingTop = '75%'; // יחס גובה-רוחב של 600/800
    
    // ערבוב התשובות
    const shuffled = [...gameData].sort(() => Math.random() - 0.5);
    
    // מיקומים באחוזים (כמו בלוח השאלות)
    const positions = [
        {x: 3.8, y: 3.3}, {x: 21.9, y: 3.3}, {x: 40.0, y: 3.3}, {x: 58.1, y: 3.3},
        {x: 12.5, y: 30.8}, {x: 30.6, y: 30.8}, {x: 48.8, y: 30.8}, {x: 66.9, y: 30.8},
        {x: 3.8, y: 58.3}, {x: 21.9, y: 58.3}, {x: 40.0, y: 58.3}, {x: 58.1, y: 58.3}
    ];
    
    for (let i = 0; i < 12; i++) {
        const item = document.createElement('div');
        item.className = 'answer-item';
        item.dataset.answerIndex = i;
        item.dataset.answer = shuffled[i].answer;
        item.draggable = true;
        item.style.position = 'absolute';
        item.style.left = `${positions[i].x}%`;
        item.style.top = `${positions[i].y}%`;
        item.style.width = '17.5%';
        item.style.height = '26.7%';
        
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        
        grid.appendChild(item);
    }
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
