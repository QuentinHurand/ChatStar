// Variables globales (ton code actuel)

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

// Afficher un message dans le chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    if (sender === 'user') messageDiv.classList.add('user-message');
    else messageDiv.classList.add('celeb-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Démarrer une conversation
function startChat(celeb) {
    currentCeleb = celeb;
    chatCelebName.textContent = celeb;
    selectionDiv.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    chatMessages.innerHTML = "";
    addMessage(`Tu as commencé la conversation avec ${celeb}.`, 'celeb');
}

// Clic sur boutons célébrités
celebButtons.forEach(btn => {
    btn.addEventListener('click', () => startChat(btn.dataset.celeb));
});

// Bouton conversation perso
startCustomChatBtn.addEventListener('click', () => {
    const customName = customCelebInput.value.trim();
    if(customName.length > 0) startChat(customName);
    else alert('Merci de taper le nom d\'une célébrité.');
});

// Bouton retour
backBtn.addEventListener('click', () => {
    chatContainer.classList.add('hidden');
    selectionDiv.classList.remove('hidden');
});

// Envoyer message
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') sendMessage();
});

// Fonction pour envoyer message à Hugging Face API
async function sendMessage() {
    const message = chatInput.value.trim();
    if(message.length === 0) return;

    addMessage(message, 'user');
    chatInput.value = '';

    try {
        const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer TON_TOKEN_HUGGINGFACE',  // <<--- Remplace ici
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputs: message })
        });

        const data = await response.json();
        if(data && data.generated_text) {
            addMessage(data.generated_text, 'celeb');
        } else {
            addMessage("Je n'ai pas compris, réessaie.", 'celeb');
        }
    } catch (error) {
        addMessage("Erreur serveur, réessaie plus tard.", 'celeb');
    }
}
