document.addEventListener('DOMContentLoaded', () => {
  // Éléments d'affichage
  const display = document.getElementById('display');
  const operationDisplay = document.getElementById('operation-display');

  // Variables de calcul
  let currentInput = '0';
  let previousInput = '';
  let operation = null;
  let resetScreen = false;

  // Sélecteurs des boutons
  const numberButtons = document.querySelectorAll('[data-number]');
  const operationButtons = document.querySelectorAll('[data-operation]');
  const equalsButton = document.getElementById('equals');
  const clearButton = document.getElementById('clear');
  const deleteButton = document.getElementById('delete');

  // Fonctions utilitaires
  const updateDisplay = () => {
    display.textContent = currentInput;
  };

  const updateOperationDisplay = () => {
    if (previousInput && operation) {
      operationDisplay.textContent = `${previousInput}${operation}`;
    } else {
      operationDisplay.textContent = '';
    }
  };

  // Gestionnaires d'événements
  numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const number = button.getAttribute('data-number');
      inputNumber(number);
    });
  });

  operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const op = button.getAttribute('data-operation');
      handleOperation(op);
    });
  });

  equalsButton.addEventListener('click', calculate);
  clearButton.addEventListener('click', clear);
  deleteButton.addEventListener('click', deleteNumber);

  // Logique de la calculatrice
  function inputNumber(number) {
    if (currentInput === '0' && number !== '.') {
      currentInput = number;
    } else if (resetScreen) {
      currentInput = number;
      resetScreen = false;
    } else {
      // Empêche d'ajouter plusieurs points décimaux
      if (number === '.' && currentInput.includes('.')) return;
      currentInput += number;
    }
    updateDisplay();
  }

  function handleOperation(op) {
    if (currentInput === '0' && !previousInput) return;

    if (operation !== null) {
      calculate();
    }

    previousInput = currentInput;
    operation = op;
    resetScreen = true;
    updateOperationDisplay();
  }

  function calculate() {
    if (!operation || !previousInput) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          result = 'Erreur';
        } else {
          result = prev / current;
        }
        break;
      case '%':
        result = (prev * current) / 100;
        break;
      default:
        return;
    }

    currentInput = result.toString();
    operation = null;
    previousInput = '';
    resetScreen = true;
    updateDisplay();
    updateOperationDisplay();
  }

  function clear() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    resetScreen = false;
    updateDisplay();
    updateOperationDisplay();
  }

  function deleteNumber() {
    if (currentInput.length === 1 || currentInput === 'Erreur') {
      currentInput = '0';
    } else {
      currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
  }

  // Initialisation de l'affichage
  updateDisplay();
  updateOperationDisplay();
});
