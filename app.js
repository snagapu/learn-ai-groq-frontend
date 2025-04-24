// Store the messages in an array
let messages = [];

// Elements
const chatContainer = document.getElementById("chat-container");
const promptInput = document.getElementById("prompt");
const sendButton = document.getElementById("send-btn");

// Display messages in the chat
function displayMessages() {
  chatContainer.innerHTML = ''; // Clear previous chat
  messages.forEach((msg, index) => {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", msg.role);
    
    // Display message content
    if (msg.role === 'user') {
      msgDiv.textContent = `You: ${msg.content}`;
    } else {
      msgDiv.innerHTML = `<strong>Shri-AI:</strong> ${marked.parse(msg.content)}`;
    }

    chatContainer.appendChild(msgDiv);

    // Add buttons for each bot response
    if (msg.role === 'assistant') {
      addSpeechButtons(msgDiv, msg, index);  // Pass msg to addSpeechButtons
    }
  });
}

// Add speak, pause, and resume buttons for each response
function addSpeechButtons(msgDiv, msg, index) {
  const speakButton = document.createElement("button");
  speakButton.textContent = "Speak";
  speakButton.classList.add("speak-btn");
  msgDiv.appendChild(speakButton);

  const pauseButton = document.createElement("button");
  pauseButton.textContent = "Pause";
  pauseButton.classList.add("pause-btn", "hidden");
  msgDiv.appendChild(pauseButton);

  const resumeButton = document.createElement("button");
  resumeButton.textContent = "Resume";
  resumeButton.classList.add("resume-btn", "hidden");
  msgDiv.appendChild(resumeButton);

  let utterance = null;

  // Function to speak the answer with the default voice
  speakButton.addEventListener("click", () => {
    if (msg.content) {
      utterance = new SpeechSynthesisUtterance(msg.content);

      // Get available voices
      const voices = speechSynthesis.getVoices();
      utterance.voice = voices[0]; // Default voice (neutral)

      // Make the speech more natural
      utterance.rate = 1; // Speed of speech
      utterance.pitch = 1; // Pitch of the voice
      utterance.volume = 1; // Volume level

      // Speak the text
      speechSynthesis.speak(utterance);

      // Show pause and resume buttons
      pauseButton.classList.remove("hidden");
      resumeButton.classList.add("hidden");

      // Pause and Resume functionality
      pauseButton.addEventListener("click", () => {
        speechSynthesis.pause();
        pauseButton.classList.add("hidden");
        resumeButton.classList.remove("hidden");
      });

      resumeButton.addEventListener("click", () => {
        speechSynthesis.resume();
        pauseButton.classList.remove("hidden");
        resumeButton.classList.add("hidden");
      });
    }
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
  } catch (err) {
    console.error(err);
  }
});
