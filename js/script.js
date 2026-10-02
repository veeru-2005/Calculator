// DOM Elements
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const signButton = document.querySelector('[data-action="sign"]');
const percentButton = document.querySelector('[data-action="percent"]');
const themeToggleBtn = document.getElementById('theme-toggle');
const historyListElement = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Calculator State
let currentOperand = '0';
let previousOperand = '';
let operator = undefined;
let shouldResetDisplay = false;
let history = [];

// Initialization
function init() {
    loadTheme();
    loadHistory();
    updateDisplay();
}

// Format numbers for display (adding commas)
function getDisplayNumber(number) {
    const stringNumber = number.toString();
    if (stringNumber === 'Error') return stringNumber;
    if (stringNumber === 'NaN') return 'Error';

    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

// Update the DOM display
function updateDisplay() {
    currentOperandTextElement.innerText = getDisplayNumber(currentOperand);
    if (operator != null) {
        previousOperandTextElement.innerText = `${getDisplayNumber(previousOperand)} ${operator}`;
    } else {
        previousOperandTextElement.innerText = '';
    }
    
    // Auto-scale font size if number gets too large
    if (currentOperandTextElement.innerText.length > 10) {
        currentOperandTextElement.style.fontSize = '1.75rem';
    } else {
        currentOperandTextElement.style.fontSize = '2.5rem';
    }
}

// Clear calculator
function clear() {
    currentOperand = '0';
    previousOperand = '';
    operator = undefined;
    shouldResetDisplay = false;
}

// Delete last digit
function deleteNumber() {
    if (currentOperand === 'Error') {
        clear();
        return;
    }
    if (shouldResetDisplay) return;
    
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// Append number or decimal
function appendNumber(number) {
    if (currentOperand === 'Error') clear();
    if (shouldResetDisplay) {
        currentOperand = '';
        shouldResetDisplay = false;
    }
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand = currentOperand.toString() + number.toString();
    }
}

// Choose operator
function chooseOperator(op) {
    if (currentOperand === 'Error') return;
    if (currentOperand === '') return;
    if (previousOperand !== '') {
        calculate();
    }
    operator = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

// Perform calculation
function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    // Use internal symbols if needed (we map UI signs to standard JS math)
    switch (operator) {
        case '+':
            computation = prev + current;
            break;
        case '−': // UI uses minus symbol
        case '-': // Keyboard uses hyphen
            computation = prev - current;
            break;
        case '×':
        case '*':
            computation = prev * current;
            break;
        case '÷':
        case '/':
            if (current === 0) {
                currentOperand = 'Error';
                previousOperand = '';
                operator = undefined;
                shouldResetDisplay = true;
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }

    // Fix floating point issues
    computation = Math.round(computation * 100000000) / 100000000;
    
    // Save to history
    addHistoryItem(`${getDisplayNumber(prev)} ${operator} ${getDisplayNumber(current)}`, getDisplayNumber(computation));
    
    currentOperand = computation.toString();
    operator = undefined;
    previousOperand = '';
    shouldResetDisplay = true;
}

// Toggle positive/negative
function toggleSign() {
    if (currentOperand === 'Error' || currentOperand === '0' || currentOperand === '') return;
    currentOperand = (parseFloat(currentOperand) * -1).toString();
}

// Calculate percentage
function calculatePercent() {
    if (currentOperand === 'Error' || currentOperand === '') return;
    currentOperand = (parseFloat(currentOperand) / 100).toString();
    shouldResetDisplay = true;
}

// --- Event Listeners ---

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.dataset.number);
        updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperator(button.dataset.operator);
        updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculate();
    updateDisplay();
});

clearButton.addEventListener('click', () => {
    clear();
    updateDisplay();
});

deleteButton.addEventListener('click', () => {
    deleteNumber();
    updateDisplay();
});

signButton.addEventListener('click', () => {
    toggleSign();
    updateDisplay();
});

percentButton.addEventListener('click', () => {
    calculatePercent();
    updateDisplay();
});

// --- Keyboard Support ---

const keyMap = {
    'Enter': 'equals',
    '=': 'equals',
    'Escape': 'clear',
    'Backspace': 'delete',
    'Delete': 'delete',
    '%': 'percent',
    '+': '+',
    '-': '−',
    '*': '×',
    '/': '÷'
};

document.addEventListener('keydown', (e) => {
    let key = e.key;
    let buttonToAnimate = null;

    if (/[0-9\.]/.test(key)) {
        e.preventDefault();
        appendNumber(key);
        updateDisplay();
        buttonToAnimate = document.querySelector(`[data-number="${key}"]`);
    } else if (keyMap[key]) {
        e.preventDefault();
        const action = keyMap[key];
        
        if (action === 'equals') {
            calculate();
            updateDisplay();
            buttonToAnimate = equalsButton;
        } else if (action === 'clear') {
            clear();
            updateDisplay();
            buttonToAnimate = clearButton;
        } else if (action === 'delete') {
            deleteNumber();
            updateDisplay();
            buttonToAnimate = deleteButton;
        } else if (action === 'percent') {
            calculatePercent();
            updateDisplay();
            buttonToAnimate = percentButton;
        } else {
            chooseOperator(action);
            updateDisplay();
            buttonToAnimate = document.querySelector(`[data-operator="${action}"]`);
        }
    }

    if (buttonToAnimate) {
        buttonToAnimate.classList.add('keyboard-active');
        setTimeout(() => buttonToAnimate.classList.remove('keyboard-active'), 100);
    }
});

// --- Theme Management ---

function loadTheme() {
    const savedTheme = localStorage.getItem('calculator_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

themeToggleBtn.addEventListener('click', () => {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('calculator_theme', newTheme);
});

// --- History Management ---

function loadHistory() {
    const saved = localStorage.getItem('calculator_history');
    if (saved) {
        history = JSON.parse(saved);
        renderHistory();
    }
}

function saveHistory() {
    localStorage.setItem('calculator_history', JSON.stringify(history));
}

function addHistoryItem(expression, result) {
    history.unshift({ expression, result });
    if (history.length > 20) history.pop(); // Keep last 20 items
    saveHistory();
    renderHistory();
}

function renderHistory() {
    historyListElement.innerHTML = '';
    
    if (history.length === 0) {
        historyListElement.innerHTML = '<div class="empty-history">No history yet</div>';
        return;
    }

    history.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('history-item');
        div.innerHTML = `
            <div class="history-expr">${item.expression} =</div>
            <div class="history-res">${item.result}</div>
        `;
        historyListElement.appendChild(div);
    });
}

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    saveHistory();
    renderHistory();
});

// Run initialization
init();
