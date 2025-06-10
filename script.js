let currentCeleb = "";
const chatContainer = document.getElementById('chat-container');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatCelebName = document.getElementById('chat-celeb-name');
const backBtn = document.getElementById('back-btn');
const celebButtons = document.querySelectorAll('.celeb-btn');
const customCelebInput = document.getElementById('custom-celeb-name');
const startCustomChatBtn = document.getElementById('start-custom-chat');
const selectionDiv = document.querySelector('.selection');

function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageDiv.classList.add(sender === 'user' ? 'user-message' : 'celeb-message');
  messageDiv.textContent = text;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startChat(celeb) {
  currentCeleb = celeb;
  chatCelebName.textContent = celeb;
  selectionDiv.classList.add('hidden');
  chatContainer.classList.remove('hidden');
  chatMessages.innerHTML = "";
  addMessage(`Tu as commencé la conversation avec ${celeb}.`, 'celeb');
}

celebButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    startChat(btn.dataset.celeb);
  });
});

startCustomChatBtn.addEventListener('click', () => {
  const customName = customCelebInput.value.trim();
  if (customName.length > 0) {
    startChat(customName);
  } else {
    alert("Merci de taper le nom d'une célébrité.");
  }
});

backBtn.addEventListener('click', () => {
  chatContainer.classList.add('hidden');
  selectionDiv.classList.remove('hidden');
});

sendBtn.addEventListener('click', () => {
  sendMessage();
});

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const message = chatInput.value.trim();
  if (message.length === 0) return;
  addMessage(message, 'user');
  chatInput.value = '';

  // Réponse simulée (à remplacer par appel API plus tard)
  setTimeout(() => {
    const response = `(${currentCeleb}) Je réponds à : "${message}"`;
    addMessage(response, 'celeb');
  }, 1200);
}
