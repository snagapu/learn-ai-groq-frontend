// Store the messages in an array
let messages = [];

// Elements
const chatContainer = document.getElementById("chat-container");
const promptInput = document.getElementById("prompt");
const sendButton = document.getElementById("send-btn");
const speakButton = document.getElementById("speak-btn");

// Display messages in the chat
function displayMessages() {
  chatContainer.innerHTML = ''; // Clear previous chat
  messages.forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", msg.role);
    msgDiv.textContent = `${msg.role === 'user' ? 'You: ' : 'Bot: '} ${msg.content}`;
    chatContainer.appendChild(msgDiv);
  });
}

// Send a message to the backend and get the response
sendButton.addEventListener("click", async () => {
  const input = promptInput.value.trim();
  if (!input) return;

  // Display user message
  const userMessage = { role: "user", content: input };
  messages.push(userMessage);
  displayMessages();
  promptInput.value = "";

  // Call backend API
  try {
    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ messages: [...messages, userMessage] })
    });
    const data = await response.json();

    // Display bot response
    const botMessage = { role: "assistant", content: data.answer };
    messages.push(botMessage);
    displayMessages();

    // Show the speak button once the answer is received
    speakButton.style.display = 'block';

    // Save the answer for speech synthesis
    window.latestAnswer = botMessage.content;
  } catch (err) {
    console.error(err);
  }
});

// Function to speak the answer with Indian accent
speakButton.addEventListener("click", () => {
  if (window.latestAnswer) {
    speak(window.latestAnswer);
  }
});

// Function to speak using the Indian accent
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);

  // Get available voices
  const voices = speechSynthesis.getVoices();

  // Try to find an Indian accent voice
  const indianVoice = voices.find(voice => voice.name.toLowerCase().includes("indian"));
  if (indianVoice) {
    utterance.voice = indianVoice;
  } else {
    // If no Indian accent is found, use a neutral voice
    utterance.voice = voices[0]; // Default voice (neutral)
  }

  // Make the speech more natural
  utterance.rate = 1; // Speed of speech
  utterance.pitch = 1; // Pitch of the voice
  utterance.volume = 1; // Volume level

  // Speak the text
  speechSynthesis.speak(utterance);
}
