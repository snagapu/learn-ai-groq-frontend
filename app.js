// Store the messages in an array
let messages = [];

// Elements
const chatContainer = document.getElementById("chat-container");
const promptInput = document.getElementById("prompt");
const sendButton = document.getElementById("send-btn");
const speakButton = document.getElementById("speak-btn");
const pauseButton = document.getElementById("pause-btn");
const resumeButton = document.getElementById("resume-btn");

let utterance = null;
let speechSynthesisActive = false;

// Display messages in the chat
function displayMessages() {
  chatContainer.innerHTML = ''; // Clear previous chat
  messages.forEach(msg => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", msg.role);
    if (msg.role === 'user') {
      msgDiv.textContent = `You: ${msg.content}`;
    } else {
      msgDiv.innerHTML = `<strong>Shri-AI:</strong> ${marked.parse(msg.content)}`;
    }
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
    const response = await fetch("https://learn-ai-groq-backend.onrender.com/api/tutor", {
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

    // Save the answer for future use
    window.latestAnswer = botMessage.content;
  } catch (err) {
    console.error(err);
  }
});

// Function to speak the answer with the default voice (no accent)
speakButton.addEventListener("click", () => {
  if (window.latestAnswer) {
    speak(window.latestAnswer);
  }
});

// Function to speak using the default voice
function speak(text) {
  utterance = new SpeechSynthesisUtterance(text);

  // Get available voices
  const voices = speechSynthesis.getVoices();
  
  // Use the first available voice (no Indian accent)
  utterance.voice = voices[0]; // Default voice (neutral or preferred system voice)
  
  // Make the speech more natural
  utterance.rate = 1; // Speed of speech
  utterance.pitch = 1; // Pitch of the voice
  utterance.volume = 1; // Volume level

  // Speak the text
  speechSynthesis.speak(utterance);
  speechSynthesisActive = true;

  // Show pause and resume buttons once speaking starts
  pauseButton.style.display = 'block';
  resumeButton.style.display = 'none';
}

// Pause speech
pauseButton.addEventListener("click", () => {
  if (speechSynthesisActive) {
    speechSynthesis.pause();
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'block';
  }
});

// Resume speech
resumeButton.addEventListener("click", () => {
  if (speechSynthesisActive) {
    speechSynthesis.resume();
    pauseButton.style.display = 'block';
    resumeButton.style.display = 'none';
  }
});
