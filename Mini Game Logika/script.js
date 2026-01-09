document.addEventListener('DOMContentLoaded', () => {
    // State Game
    let score = 0;
    let timeLeft = 100;
    let gameInterval;
    let currentQuestion = {};
    let difficulty = 1;
    
    // Konstanta
    const SYMBOLS = {
        AND: '∧',
        OR: '∨',
        IMPLIES: '→',
        BIIMPLIES: '↔',
        NOT: '~'
    };

    // Elemen DOM
    const screens = {
        start: document.getElementById('start-screen'),
        game: document.getElementById('game-screen'),
        over: document.getElementById('game-over-screen')
    };

    const ui = {
        score: document.getElementById('score-display'),
        level: document.getElementById('level-display'),
        timer: document.getElementById('timer-bar'),
        expression: document.getElementById('expression-display'),
        vars: document.getElementById('var-values'),
        finalScore: document.getElementById('final-score'),
        cheatSheet: document.getElementById('cheat-sheet'),
        questionBox: document.querySelector('.question-box')
    };

    // Event Listeners
    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-cheat').addEventListener('click', toggleCheatSheet);
    document.getElementById('btn-close-cheat').addEventListener('click', toggleCheatSheet);
    document.getElementById('btn-true').addEventListener('click', () => checkAnswer(true));
    document.getElementById('btn-false').addEventListener('click', () => checkAnswer(false));
    document.getElementById('btn-replay').addEventListener('click', startGame);
    document.getElementById('btn-menu').addEventListener('click', goToMenu);

    // Fungsi Navigasi
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
    }

    function goToMenu() {
        showScreen('start');
    }

    function toggleCheatSheet() {
        ui.cheatSheet.classList.toggle('hidden');
    }

    // Logic Game
    function startGame() {
        score = 0;
        timeLeft = 100;
        difficulty = 1;
        updateUI();
        showScreen('game');
        generateQuestion();
        
        if (gameInterval) clearInterval(gameInterval);
        
        gameInterval = setInterval(() => {
            const drainRate = 0.5 + (difficulty * 0.1);
            timeLeft -= drainRate;
            
            ui.timer.style.width = Math.max(0, timeLeft) + '%';
            
            if(timeLeft < 30) ui.timer.style.backgroundColor = '#ef4444';
            else ui.timer.style.backgroundColor = '#ec4899';

            if (timeLeft <= 0) {
                gameOver();
            }
        }, 100);
    }

    function gameOver() {
        clearInterval(gameInterval);
        ui.finalScore.innerText = score;
        showScreen('over');
    }

    function generateQuestion() {
        const p = Math.random() < 0.5;
        const q = Math.random() < 0.5;
        
        const operators = ['AND', 'OR', 'IMPLIES', 'BIIMPLIES'];
        const useNot = difficulty > 3 && Math.random() < 0.4;

        const selectedOp = operators[Math.floor(Math.random() * operators.length)];

        let result;
        let textExpression = '';

        switch (selectedOp) {
            case 'AND':
                result = p && q;
                textExpression = `p ${SYMBOLS.AND} q`;
                break;
            case 'OR':
                result = p || q;
                textExpression = `p ${SYMBOLS.OR} q`;
                break;
            case 'IMPLIES':
                result = !p || q; 
                textExpression = `p ${SYMBOLS.IMPLIES} q`;
                break;
            case 'BIIMPLIES':
                result = p === q;
                textExpression = `p ${SYMBOLS.BIIMPLIES} q`;
                break;
        }

        if (useNot) {
            result = !result;
            textExpression = `${SYMBOLS.NOT}(${textExpression})`;
        }

        currentQuestion = {
            p: p,
            q: q,
            answer: result
        };

        const pText = p ? "B" : "S";
        const qText = q ? "B" : "S";

        ui.vars.innerText = `Jika p = ${pText} dan q = ${qText}`;
        ui.expression.innerText = textExpression;
    }

    function checkAnswer(userAnswer) {
        if (userAnswer === currentQuestion.answer) {
            score += 10;
            timeLeft += 10;
            if (timeLeft > 100) timeLeft = 100;
            
            if (score > 0 && score % 50 === 0) difficulty++;

            generateQuestion();
        } else {
            score = Math.max(0, score - 5);
            timeLeft -= 10;
            
            ui.questionBox.classList.remove('shake');
            void ui.questionBox.offsetWidth;
            ui.questionBox.classList.add('shake');
            
            generateQuestion();
        }
        updateUI();
    }

    function updateUI() {
        ui.score.innerText = `Skor: ${score}`;
        ui.level.innerText = `Level: ${difficulty}`;
    }
});