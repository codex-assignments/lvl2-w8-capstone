"use strict";

console.log("test");

const chatWindow = document.getElementById("chatWindow");
const inputField = document.getElementById("userInput");
const output = document.getElementById("output")
const userText = inputField.value;

// HELPER FUNCTIONS
//Speeds up the initial response time from fetching the key from render.com
async function wakeUp() {
  try {
    fetch("https://proxy-key-0udy.onrender.com");
  } catch (error) {
    console.log("Didn't wake up");
  }
}

//gets the API key hosted on a proxy server
async function getKey() {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    };
    const res = await fetch(
      "https://proxy-key-0udy.onrender.com/get-key4",
      options,
    );
    if (!res.ok) {
      throw new Error("Bad key fetch.");
    }

    const { key } = await res.json();
    console.log(key);
    return key;
  } catch (error) {
    console.log("Didn't get the key.");
  }
}

//Renders responses and messages to DOM
function render(response
    // ,isBot
) {
  const p = document.createElement("p");
//   if (isBot) {
//     p.className =
//       "max-w-[75%] mr-auto rounded-lg bg-gray-200 px-3 py-2 text-black";
//   } else {
//     p.className =
//       "max-w-[75%] ml-auto rounded-la bg-blue-600 px-3 py-2 text-white";
//   }
  p.textContent = response;
  output.appendChild(p);
}

// this function calls and inserts the API key to a POST request to Gemini AI API which contains information from user input and saved message/response history -- returns AI response.
async function callGemini(userMessage) {
    let apiKey = await getKey();
    
    //Template for how to send user input and message history to the API.
    // const temp = [
    //   {
    //     role: "user",
    //     parts: [{ text: "My name is Bob." }],
    //   },
    //   {
    //     role: "model",
    //     parts: [{ text: "Got it." }],
    //   },
    //   {
    //     role: "user",
    //     parts: [{ text: "What is my name?" }],
    //   },
    // ];

  const contents = []

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
        system_instruction: {
          // *** System instructions ***
        parts: [{ text: "You are a concise assistant." }],
        },
        // links to const contents which is an empty array that has messages "pushed" to it with each use input and api response, growing list of these messages, this is so the ai can read the message history and have context. This is not stored in local storage and so will not carry over to page refresh or navigate away from page.
      contents: contents
    }),
  });
  
  if (response.ok) {
      const data = await response.json();
      console.log(data.candidates[0].content.parts[0].text);
    return data.candidates[0].content.parts[0].text;
  } else {
    const errorBody = await response.text();
    console.error("Final Debug - Status:", response.status, "Body:", errorBody);
    return "The spirits are gone.";
  }
}


// MAIN function, coordinates and calls each helper function to work together 

async function main() {
    //render initial message, like a loading message
    //wake up function
    wakeUp()
    //clear text content
    //render initial message from AI chat bot prompting input from the user
    //try catch --> event listener for form submit or button click, .push method to push user input to 
}



