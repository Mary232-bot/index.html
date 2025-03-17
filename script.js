// LOGIN FUNCTIONALITY
document.getElementById("loginForm")?.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // List of allowed guest names
    const allowedGuests = [
        "Mr Jean-Claude Van Damme",
        "Harald Link",
        "Franka Potente",
        "Ms Ricardo Darín",
        "Mr Ulrich Thomsen",
        "Mr Dhanin Chearavanont"
    ];

    // Get input values
    const username = document.getElementById("username").value.trim();
    const checkinDate = document.getElementById("checkin-date").value;
    const errorMessage = document.getElementById("error-message");

    // Required check-in date (March 27, 2025)
    const requiredDate = "2025-03-27";

    // Fixing Date Format: Ensuring it matches "YYYY-MM-DD"
    const inputDate = new Date(checkinDate);
    const formattedCheckinDate = inputDate.getFullYear() + "-" + 
                                 String(inputDate.getMonth() + 1).padStart(2, '0') + "-" + 
                                 String(inputDate.getDate()).padStart(2, '0');

    // Validation: Check if username is correct and date is correct
    if (allowedGuests.includes(username) && formattedCheckinDate === requiredDate) {
        // Store session data
        sessionStorage.setItem("loggedInUser", username);
        sessionStorage.setItem("checkinDate", formattedCheckinDate);

        // Redirect to rooms.html
        window.location.href = "rooms.html";
    } else {
        errorMessage.textContent = "Wrong username or check-in date.";
        errorMessage.style.color = "red";
    }
});

// PAYMENT PAGE FUNCTIONALITY
document.getElementById("paymentForm")?.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get input values from the form
    const passport = document.getElementById("passport-upload").files[0];
    const selfie = document.getElementById("selfie-upload").files[0];
    const creditCard = document.getElementById("credit-card").value.trim();
    const roomingList = document.getElementById("rooming-list").value.trim();

    // Validate required fields
    if (!passport || !selfie || !creditCard || !roomingList) {
        alert("Please fill in all required fields.");
        return;
    }

    // Simulate booking status change to Active
    alert("Check-In Successful! Booking status is now Active.");

    // Redirect to rooms.html after clicking OK
    window.location.href = "rooms.html";

    // Log data to the console for simulation
    console.log("Passport uploaded:", passport.name);
    console.log("Selfie uploaded:", selfie.name);
    console.log("Credit Card Number:", creditCard);
    console.log("Rooming List:", roomingList);
});

// FAQ Database (Predefined Hotel Answers)
const hotelFAQs = {
    "Hello": "How can I help you today?",
    "What time is check-in?": "Check-in time is from 2:00 PM onwards.",
    "What time is check-out?": "Check-out time is at 12:00 PM.",
    "Do you have free Wi-Fi?": "Yes, we provide free high-speed Wi-Fi in all rooms and public areas.",
    "Is breakfast included?": "Yes, complimentary breakfast is included with all bookings.",
    "Can I cancel my booking?": "Cancellation policies vary depending on your booking type. Please check your confirmation email.",
    "Do you have a swimming pool?": "Yes, our hotel has an outdoor swimming pool available for all guests.",
    "How do I modify my reservation?": "You can modify your reservation by contacting our front desk or using the booking portal."
};

// Chatbox Elements
const chatbox = document.getElementById("chatbox");
const openChatButton = document.getElementById("open-chat");
const closeChatButton = document.getElementById("close-chat");
const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");

// Open Chatbox
openChatButton.addEventListener("click", () => {
    chatbox.style.display = "flex";
    openChatButton.style.display = "none";
});

// Close Chatbox
closeChatButton.addEventListener("click", () => {
    chatbox.style.display = "none";
    openChatButton.style.display = "block";
});

// Handle Chat Submission
chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get User Message
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Display User Message
    displayUserMessage(userMessage);

    // Clear Input
    chatInput.value = "";

    // Scroll to Latest Message
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Check FAQ Database First
    const response = getFAQResponse(userMessage);
    if (response) {
        displayBotResponse(response);
    } else {
        // If not found in FAQs, return a default message
        displayBotResponse("Thank you for reaching out! We assist with hotel and booking inquiries. Let us know how we can help.");
    }
});

// Function to Check FAQs Before Calling Gemini API
function getFAQResponse(message) {
    const userMessage = message.toLowerCase();
    for (let question in hotelFAQs) {
        if (userMessage.includes(question.toLowerCase())) {
            return hotelFAQs[question]; // Return predefined response
        }
    }
    return null; // If no match, return null
}
// Function to Display User Message
function displayUserMessage(message) {
    const userDiv = document.createElement("div");
    userDiv.textContent = `You: ${message}`;
    userDiv.style.textAlign = "right";
    userDiv.style.background = "#007bff";
    userDiv.style.color = "white";
    userDiv.style.padding = "8px";
    userDiv.style.borderRadius = "10px";
    userDiv.style.margin = "5px";
    userDiv.style.maxWidth = "75%";
    userDiv.style.alignSelf = "flex-end";
    chatMessages.appendChild(userDiv);
}
// Function to Display AI Response
function displayBotResponse(response) {
    const botDiv = document.createElement("div");
    botDiv.textContent = `Gemini AI: ${response}`;
    botDiv.style.textAlign = "left";
    chatMessages.appendChild(botDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to Get Bot Response from Google Gemini API
async function getBotResponse(message) {
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyAxIzK9YhfUilfXsdYQ-7dGteAz6Ef4Ulo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();
        
        // Extract response from API
        if (data && data.candidates && data.candidates.length > 0) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "Sorry, I couldn't process your request.";
        }
    } catch (error) {
        console.error("Error communicating with Gemini AI:", error);
        return "There was an error connecting to Gemini AI.";
    }
}
