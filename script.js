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

// 🔐 INSERT YOUR OPENAI API KEY HERE:
const apiKey = "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";

// Fonction pour afficher un message
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'celeb-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fonction pour démarrer une conversation
function startChat(celeb) {
    currentCeleb = celeb;
    chatCelebName.textContent = celeb;
    selectionDiv.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    chatMessages.innerHTML = "";
    addMessage(`Tu as commencé la conversation avec ${celeb}.`, 'celeb');
}

// Gestion des clics sur les célébrités
celebButtons.forEach(btn => {
    btn.addEventListener('click', () => startChat(btn.dataset.celeb));
});

// Chat personnalisé
startCustomChatBtn.addEventListener('click', () => {
    const customName = customCelebInput.value.trim();
    if (customName.length > 0) {
        startChat(customName);
    } else {
        alert("Merci de taper le nom d'une célébrité.");
    }
});

// Bouton retour
backBtn.addEventListener('click', () => {
    chatContainer.classList.add('hidden');
    selectionDiv.classList.remove('hidden');
});

// Envoi message utilisateur
sendBtn.addEventListener('click', () => sendMessage());
chatInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') sendMessage();
});

// Envoi message et appel à OpenAI
async function sendMessage() {
    const message = chatInput.value.trim();
    if (message.length === 0) return;

    addMessage(message, 'user');
    chatInput.value = '';

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: `Tu es ${currentCeleb}. Réponds comme si tu étais cette personne célèbre. Incarne son ton, sa personnalité et son style de communication.` },
                    { role: "user", content: message }
                ],
                temperature: 0.85
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Je n'ai pas compris, réessaie.";
        addMessage(reply, 'celeb');

    } catch (error) {
        console.error(error);
        addMessage("Erreur de communication avec le serveur. Réessaie plus tard.", 'celeb');
    }
}
