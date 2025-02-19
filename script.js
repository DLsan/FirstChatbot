document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox")
  const chatForm = document.getElementById("chatForm")
  const userInput = document.getElementById("userInput")

  // Add a welcome message
  addMessage("bot", "Hello! How can I assist you today?")

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const message = userInput.value.trim()
    if (message) {
      addMessage("user", message)
      userInput.value = ""
      await getBotResponse(message)
    }
  })

  function addMessage(sender, message) {
    const messageElement = document.createElement("div")
    messageElement.classList.add("message", `${sender}-message`)
    messageElement.textContent = message
    chatBox.appendChild(messageElement)
    chatBox.scrollTop = chatBox.scrollHeight
  }

  async function getBotResponse(message) {
    const API_KEY = "AIzaSyCVQlHNpslmBaaQUXdDWQQ-6lB3HlXIujk" // Replace with your actual Gemini API key
    const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

    addMessage("bot", "Thinking...") // Add a temporary "thinking" message

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: message,
                },
              ],
            },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const data = await response.json()
      const botReply = data.candidates[0].content.parts[0].text

      // Remove the "thinking" message
      chatBox.removeChild(chatBox.lastChild)

      addMessage("bot", botReply)
    } catch (error) {
      console.error("Error:", error)
      // Remove the "thinking" message
      chatBox.removeChild(chatBox.lastChild)
      addMessage("bot", "Sorry, I encountered an error. Please try again.")
    }
  }
})

