import anime from 'animejs/lib/anime.es.js';
import { quizQuestions } from './questions.js';
import { selectOrCreate, renderChatMessage, updateProgress } from './index.js';

class ContactForm {
  constructor() {
    this.currentStep = 0;
    this.answers = {
      name: '',
      email: '',
      message: '',
    };

    this.contentContainer = selectOrCreate('#contact-content');
    this.inputField = selectOrCreate('input[type="text"]');
    this.sendButton = selectOrCreate('button.btn-primary');

    /* Initialisation des écouteurs d'événements pour gérer les interactions utilisateur
       et animation du bouton d'envoi au chargement de la page */
    this.sendButton.addEventListener('click', () => this.handleInput());
    this.inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleInput();
      }
    });

    this.initForm();
    this.animateButton();
  }

  /* Initialise le formulaire en réinitialisant le contenu, la progression
     et en affichant la première question */
  initForm() {
    this.contentContainer.innerHTML = '';
    this.currentStep = 0;
    this.updateProgressBar();
    this.showNextQuestion();
  }

  /* Met à jour la barre de progression en fonction de l'étape actuelle du formulaire */
  updateProgressBar() {
    const currentStepId = `contact-${quizQuestions[
      this.currentStep
    ].question.toLowerCase()}`;
    updateProgress(currentStepId);
  }

  /* Gère la saisie de l'utilisateur, valide les entrées spécifiques comme l'email,
     enregistre les réponses, affiche les messages et passe à l'étape suivante */
  handleInput() {
    const userInput = this.inputField.value.trim();

    if (!userInput) return;

    const currentQuestion = quizQuestions[this.currentStep];

    if (currentQuestion.question.toLowerCase() === 'email') {
      if (!this.isValidEmail(userInput)) {
        this.showEmailError();
        return;
      }
    }

    switch (currentQuestion.question.toLowerCase()) {
      case 'name':
        this.answers.name = userInput;
        break;
      case 'email':
        this.answers.email = userInput;
        break;
      case 'message':
        this.answers.message = userInput;
        break;
    }

    const userMessageContainer = document.createElement('div');
    userMessageContainer.className = 'chat chat-end opacity-0';
    userMessageContainer.innerHTML = `<div class="chat-bubble chat-bubble-success">${userInput}</div>`;
    this.contentContainer.appendChild(userMessageContainer);

    this.contentContainer.scrollTop = this.contentContainer.scrollHeight;

    anime({
      targets: userMessageContainer,
      opacity: [0, 1],
      translateX: [20, 0],
      duration: 600,
      easing: 'easeOutQuad',
    });

    this.inputField.value = '';
    this.currentStep++;

    if (this.currentStep < quizQuestions.length - 1) {
      const delay = Math.random() * (500 - 250) + 250;
      setTimeout(() => {
        this.showNextQuestion();
        this.updateProgressBar();
      }, delay);
    } else {
      const delay = Math.random() * (500 - 250) + 250;
      setTimeout(() => {
        this.showSummary();
        updateProgress('contact-submit');
      }, delay);
    }
  }

  /* Valide le format d'une adresse email à l'aide d'une expression régulière */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  }

  /* Affiche un message d'erreur temporaire lorsque l'email est invalide
     et le retire automatiquement après 3 secondes */
  showEmailError() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'text-error text-sm mt-2';
    errorMessage.textContent = 'Veuillez entrer une adresse email valide.';

    const sendSection = selectOrCreate('#contact-send');

    const existingError = sendSection.querySelector('.text-error');
    if (existingError) {
      existingError.remove();
    }

    sendSection.appendChild(errorMessage);
    this.inputField.classList.add('input-error');

    setTimeout(() => {
      errorMessage.remove();
      this.inputField.classList.remove('input-error');
    }, 3000);
  }

  /* Affiche la question suivante avec un texte personnalisé 
     qui peut inclure le nom de l'utilisateur s'il est disponible */
  showNextQuestion() {
    const nextQuestion = quizQuestions[this.currentStep];
    let questionText = nextQuestion.displayText;

    if (nextQuestion.question.toLowerCase() === 'email' && this.answers.name) {
      questionText = `Enchanté, ${this.answers.name} ! ${nextQuestion.displayText}`;
    } else if (
      nextQuestion.question.toLowerCase() === 'message' &&
      this.answers.name
    ) {
      questionText = `Merci ${this.answers.name}. ${nextQuestion.displayText}`;
    }

    this.addQuestionOnly(questionText);
  }

  /* Ajoute seulement une question sans bulle de réponse dans l'interface de chat
     et applique une animation d'apparition */
  addQuestionOnly(question) {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'chat chat-start opacity-0';
    questionContainer.innerHTML = `<div class="chat-bubble chat-bubble-primary">${question}</div>`;

    this.contentContainer.appendChild(questionContainer);
    this.contentContainer.scrollTop = this.contentContainer.scrollHeight;

    anime({
      targets: questionContainer,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 800,
      easing: 'easeOutQuad',
    });
  }

  /* Affiche un récapitulatif des informations saisies par l'utilisateur
     et convertit le bouton d'envoi en bouton de confirmation */
  showSummary() {
    this.addChatMessage(
      `Récapitulatif de vos informations,<br>
      Nom: ${this.answers.name}<br>
      Email: ${this.answers.email}<br>
      Message: ${this.answers.message}`,''
    );

    this.sendButton.textContent = 'Confirmer et envoyer';
    this.sendButton.removeEventListener('click', () => this.handleInput());
    this.sendButton.addEventListener('click', () => this.submitForm());

    this.inputField.style.display = 'none';
    this.animateButton();
  }

  /* Simule l'envoi du formulaire avec un message de confirmation
     et réinitialise le bouton pour permettre un nouveau message */
  submitForm() {
    this.addQuestionOnly('Envoi en cours...');

    setTimeout(() => {
      const delay = Math.random() * (500 - 250) + 250;
      setTimeout(() => {
        this.addChatMessage(
          'Formulaire envoyé!',
          'Merci pour votre message. Nous vous répondrons dès que possible.'
        );
        this.sendButton.textContent = 'Nouveau message';
        this.sendButton.removeEventListener('click', () => this.submitForm());
        this.sendButton.addEventListener('click', () => this.initForm());

        this.inputField.style.display = 'block';
        this.animateButton();
      }, delay);
    }, 1500);
  }

  /* Ajoute un message de chat complet avec une question et éventuellement une réponse,
     puis anime leur apparition séquentiellement */
  addChatMessage(question, answer) {
    const questionContainer = document.createElement('div');
    questionContainer.className = 'chat chat-start opacity-0';
    questionContainer.innerHTML = `<div class="chat-bubble chat-bubble-primary">${question}</div>`;

    this.contentContainer.appendChild(questionContainer);

    let answerContainer = null;
    if (answer !== null && answer !== '') {
      answerContainer = document.createElement('div');
      answerContainer.className = 'chat chat-end opacity-0';
      answerContainer.innerHTML = `<div class="chat-bubble chat-bubble-success">${answer}</div>`;
      this.contentContainer.appendChild(answerContainer);
    }

    this.contentContainer.scrollTop = this.contentContainer.scrollHeight;

    anime({
      targets: questionContainer,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      easing: 'easeOutExpo',
      complete: () => {
        if (answerContainer) {
          anime({
            targets: answerContainer,
            opacity: [0, 1],
            translateX: [20, 0],
            duration: 600,
            easing: 'easeOutExpo',
          });
        }
      },
    });
  }

  /* Anime le bouton d'envoi avec un effet de rebond élastique */
  animateButton() {
    anime({
      targets: this.sendButton,
      scale: [0.9, 1],
      opacity: [0.5, 1],
      duration: 400,
      easing: 'easeOutElastic(1, .5)',
    });
  }
}

// Initialiser le formulaire quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = new ContactForm();
});

export { ContactForm };
