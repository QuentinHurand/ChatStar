// Variables globales
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

// Fonction pour afficher un message
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('celeb-message');
    }
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fonction pour démarrer la conversation
function startChat(celeb) {
    currentCeleb = celeb;
    chatCelebName.textContent = celeb;
    selectionDiv.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    chatMessages.innerHTML = "";
    addMessage(`Tu as commencé la conversation avec ${celeb}.`, 'celeb');
}

// Gestion des clics sur les boutons célébrités
celebButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        startChat(btn.dataset.celeb);
    });
});

// Gestion du bouton pour custom celeb
startCustomChatBtn.addEventListener('click', () => {
    const customName = customCelebInput.value.trim();
    if(customName.length > 0) {
        startChat(customName);
    } else {
        alert('Merci de taper le nom d'une célébrité.');
    }
});

// Gestion du bouton retour
backBtn.addEventListener('click', () => {
    chatContainer.classList.add('hidden');
    selectionDiv.classList.remove('hidden');
});

// Envoi d'un message utilisateur
sendBtn.addEventListener('click', () => {
    sendMessage();
});

chatInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if(message.length === 0) return;
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Ici on simule la réponse IA avec un timeout (à remplacer par appel API OpenAI)
    setTimeout(() => {
        // Réponse simple pour la demo
        const response = `(${currentCeleb}) Je réponds à : "${message}"`;
        addMessage(response, 'celeb');
    }, 1200);
}