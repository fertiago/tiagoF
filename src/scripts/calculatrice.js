document.addEventListener('DOMContentLoaded', () => {
  const display = document.getElementById('display');
  const operationDisplay = document.getElementById('operation-display');
  const historyDisplay = document.getElementById('history-display');
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.getElementById('equals');
  const clearButton = document.getElementById('clear');
  const plusMinusButton = document.getElementById('plusMinus');

  let currentInput = '0';
  let previousInput = '';
  let currentOperation = undefined;
  let resetScreen = false;
  let history = [];
  let lastEquationResult = null;

  const updateDisplay = () => {
    display.textContent = currentInput;
    updateOperationDisplay();
  };

  const updateOperationDisplay = () => {
    if (!currentOperation) {
      operationDisplay.textContent = previousInput ? previousInput : '';
    } else {
      let operationSymbol = currentOperation;
      if (currentOperation === '*') operationSymbol = '×';
      if (currentOperation === '/') operationSymbol = '÷';

      operationDisplay.textContent = `${previousInput} ${operationSymbol} ${
        currentInput === '0' && !resetScreen ? '' : currentInput
      }`;
    }
  };

  // Met a jour l'historique des calculs et assure le defilement
  const updateHistory = () => {
    historyDisplay.innerHTML = history
      .map((item) => {
        return `<div>${item}</div>`;
      })
      .join('');

    historyDisplay.scrollTop = historyDisplay.scrollHeight;
  };

  // Ajoute un chiffre ou point decimal a l'entree courante
  const appendNumber = (number) => {
    if (lastEquationResult !== null && !currentOperation) {
      clear();
      lastEquationResult = null;
    }

    if (currentInput === '0' || resetScreen) {
      currentInput = '';
      resetScreen = false;
    }

    if (number === '.' && currentInput.includes('.')) return;

    currentInput += number;
    updateDisplay();
  };

  // Gere le choix d'une operation mathematique
  const chooseOperation = (op) => {
    if (currentInput === '' && previousInput === '') return;

    // Gere le cas ou le user appuie sur une operation sans avoir fait de calcul
    if (lastEquationResult !== null) {
      previousInput = lastEquationResult;
      lastEquationResult = null;
    }

    // Gere le cas ou le user appuie sur une operation sans avoir fait de calcul
    if (currentInput === '' && previousInput !== '') {
      currentOperation = op;
      updateDisplay();
      return;
    }

    if (previousInput !== '') {
      compute(false);
    }

    currentOperation = op;
    previousInput = currentInput;
    currentInput = '0';
    updateDisplay();
  };

  const compute = (isEquals = true) => {
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (currentOperation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = prev / current;
        break;
      case '%':
        computation = prev % current;
        break;
      default:
        return;
    }

    let operationSymbol = currentOperation;
    if (currentOperation === '*') operationSymbol = '×';
    if (currentOperation === '/') operationSymbol = '÷';

    const equation = `${previousInput} ${operationSymbol} ${currentInput} = ${computation}`;

    // Ajout de l'equation a l'historique
    if (isEquals) {
      history.push(equation);
      updateHistory();
      operationDisplay.textContent = equation;
      lastEquationResult = computation.toString();
    } else {
      operationDisplay.textContent = `${equation} ${operationSymbol}`;
    }

    currentInput = computation.toString();

    // Gere le cas ou le user appuie sur "=" plusieurs fois
    if (isEquals) {
      currentOperation = undefined;
      previousInput = '';
      resetScreen = true;
    } else {
      previousInput = currentInput;
      currentInput = '0';
      resetScreen = false;
    }

    display.textContent = currentInput;
  };

  const clear = () => {
    currentInput = '0';
    previousInput = '';
    currentOperation = undefined;
    operationDisplay.textContent = '';
    updateDisplay();
  };

  const clearAll = () => {
    clear();
    history = [];
    lastEquationResult = null;
    historyDisplay.innerHTML = '';
  };

  const invertSign = () => {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
  };

  // Ajout d'un event listener pour les boutons de chiffres
  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      appendNumber(button.getAttribute('data-number'));
    });
  });

  // Ajout d'un event listener pour les boutons d'operation
  operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      chooseOperation(button.getAttribute('data-operation'));
    });
  });

  equalsButton.addEventListener('click', () => {
    compute(true);
  });

  clearButton.addEventListener('click', () => {
    if (currentInput !== '0' || currentOperation || previousInput) {
      clear();
    } else {
      clearAll();
    }
  });

  plusMinusButton.addEventListener('click', invertSign);

  // Ajout d'un event listener pour le clavier
  document.addEventListener('keydown', (e) => {
    if (/[0-9\.]/.test(e.key)) {
      appendNumber(e.key);
    } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
      chooseOperation(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      compute(true);
    } else if (e.key === 'Escape') {
      clear();
    } else if (e.key === 'Delete') {
      clearAll();
    }
  });

  updateDisplay();
});
