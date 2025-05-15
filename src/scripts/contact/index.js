/* Sélectionne un élément existant dans le DOM ou en crée un nouveau si nécessaire */
export function selectOrCreate(selector, tag = 'div', props = {}) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    Object.assign(el, props);
    document.body.appendChild(el);
  }
  return el;
}

/* Génère le HTML pour un message de chat avec question et réponse optionnelle */
export function renderChatMessage(question, answer = null) {
  return `
    <div class="chat chat-start">
      <div class="chat-bubble chat-bubble-primary">${question}</div>
    </div>
    ${
      answer !== null && answer !== ''
        ? `
    <div class="chat chat-end">
      <div class="chat-bubble chat-bubble-success">${answer}</div>
    </div>
    `
        : ''
    }
  `;
}

/* Met à jour la barre de progression selon l'étape actuelle du formulaire */
export function updateProgress(step) {
  const steps = [
    'contact-name',
    'contact-email',
    'contact-message',
    'contact-submit',
  ];

  steps.forEach((id, index) => {
    const stepElement = document.getElementById(id);
    if (stepElement) {
      stepElement.classList.remove('step-primary');

      if (steps.indexOf(step) >= index) {
        stepElement.classList.add('step-primary');
      }
    }
  });
}
