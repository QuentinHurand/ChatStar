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

// API Hugging Face
const HF_API_KEY = "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";
const HF_ENDPOINT = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

// Fonction pour afficher un message
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'celeb-message');
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

async function sendMessage() {
    const message = chatInput.value.trim();
    if(message.length === 0) return;
    addMessage(message, 'user');
    chatInput.value = '';

    try {
        const prompt = `Tu es ${currentCeleb}, une célébrité. Réponds de manière réaliste et engageante à ce message : "${message}"`;
        const response = await fetch(HF_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });

        const data = await response.json();

        if (data.error) {
            addMessage("Erreur de l'IA : " + data.error, 'celeb');
        } else {
            const reply = typeof data[0] === 'string' ? data[0] : data[0]?.generated_text || "Je n'ai pas compris, réessaie.";
            addMessage(reply, 'celeb');
        }
    } catch (error) {
        addMessage("Erreur de connexion à l'IA.", 'celeb');
    }
}
