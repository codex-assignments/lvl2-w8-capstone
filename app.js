"use strict";

const splashScreen = document.getElementById("splashScreen")
const enterBtn = document.getElementById("enterBtn")
const chatWindow = document.getElementById("chatWindow");
const output = document.getElementById("output");
const chatForm = document.getElementById("chatForm");
const inputField = document.getElementById("inputField");
const sendBtn = document.getElementById("sendBtn");
const hauntWrapper = document.getElementById("hauntWrapper");
const hauntToggle = document.getElementById("hauntToggle");
const triggerHauntBtn = document.getElementById("triggerHauntBtn");
let hauntDatabase = [];
const hauntMessages = [
    "A sudden, heavy silence falls over the house. <strong>The Haunt has begun:</strong> You are no longer alone in these halls.",
    "The air grows cold and the shadows begin to stretch. <strong>The Haunt has begun:</strong> The rules of survival have changed.",
    "A chilling realization takes hold of your mind. <strong>The Haunt has begun:</strong> The true nature of this nightmare is revealed.",
    "The exits vanish and the walls seem to close in. <strong>The Haunt has begun:</strong> There is no escape until the task is complete.",
    "Trust evaporates like mist in the wind. <strong>The Haunt has begun:</strong> Dark intentions have finally come to light.",
];

//Message history array: create empty array to build message history in, this will be what is posted to chatbot with each form-submit or send-button click
const contents = [];

// *** HELPER FUNCTIONS

async function enterTheHouse() {
    splashScreen.classList.add("splash-hidden");
    setTimeout(() => {
        splashScreen.style.display = "none";
    }, 1000);
    //render initial message, like a loading message
    renderLoading();
    // load the json file of haunt objects to make available as an array variable, hauntDatabase
    loadHauntData();
    // wake up proxy server for API key
    await wakeUp();
    //clear text content after proxy key server is woken up
    clearChat();
    //render hardcoded initial greeting "from" AI chat bot prompting input from the user
    triggerGreeting();
}

//Speeds up the initial response time from fetching the key from render.com
async function wakeUp() {
  try {
    fetch("https://proxy-key-0udy.onrender.com");
  } catch (error) {
    console.log("Didn't wake up");
  }
}

//gets the API key hosted on a proxy server, called by callGemini function
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
    return key;
  } catch (error) {
    console.log("Didn't get the key.");
  }
}

//  *** Render functions ***
//Renders Oracle messages to DOM
function renderLoading() {
  const p = document.createElement("p");
  p.className =
    "max-w-[85%] md:max-w-[70%] lg:max-w-[60%] self-start bg-stone-900 mb-5 border-l-2 border-red-900 p-4 shadow-xl text-sm md:text-base lg:text-lg leading-relaxed text-stone-400 animate-oracle-appear";
  p.textContent = "Approaching the threshold...";
  output.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

function renderOracle(AIResponse) {
  const p = document.createElement("p");
  p.className =
    "max-w-[85%] md:max-w-[70%] lg:max-w-[60%] self-start bg-stone-900 mb-5 border-l-2 border-red-900 p-4 shadow-xl text-sm md:text-base lg:text-lg leading-relaxed text-stone-400 animate-oracle-appear oracle-bubble";
  p.innerHTML = AIResponse;
  output.appendChild(p);
  const audio = new Audio("/assets/pageflip.wav");
  audio.play().catch((error) => console.error("Audio playback failed:", error));
  output.scrollTop = output.scrollHeight;
}

//Renders User messages to DOM
function renderUser(userInput) {
  const p = document.createElement("p");
  const div = document.createElement("div");
  div.className = "chat chat-end";
  p.className =
    "chat-bubble text-stone-900 bg-stone-300 ml-auto self-end font-sans mb-5 p-4 text-sm md:text-base lg:text-lg font-semibold";
  p.textContent = userInput;
  output.appendChild(div);
  div.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

//clear chat function
function clearChat() {
  output.innerHTML = "";
}

// the initial message upon page load from the oracle, prompting user to ask it questions

function triggerGreeting() {
  const oracleGreeting = [
    "Step into the light, mortal. You have entered the Rulebook Oracle.",
    "The shifting layout of these halls and all fifty grisly fates are etched into my memory.",
    "Consult me on any rule—but flip the Haunt Toggle only when the true nightmare begins. What knowledge do you seek?",
  ];
  oracleGreeting.forEach((text, index) => {
    // Delay each message by 1.5 seconds * its position in the array
    setTimeout(() => {
      renderOracle(text);
    }, index * 1500);
  });
}

//render active haunt to DOM
function renderHaunt(haunt) {
  const hauntMessage = `
        <h2 class="text-red-600 font-serif text-xl uppercase tracking-widest text-center border-b border-red-900 pb-2 mb-3">
            Haunt #${haunt.id}: ${haunt.name}
        </h2>
        <div class="space-y-3 font-serif text-sm text-stone-300">
            <p><span class="text-red-700 uppercase font-bold">The Traitor:</span> ${haunt.traitor}</p>
            <p><span class="text-red-700 uppercase font-bold">The Omen:</span> ${haunt.trigger_omen} in the ${haunt.trigger_room}</p>
            <div class="bg-stone-900/50 p-2 italic border-l-2 border-red-900">Haunt Setup:
                ${haunt.setup}
            </div>
            <div class="grid grid-cols-2 gap-4 pt-2">
                <div>
                    <span class="text-stone-500 uppercase text-[10px] block">Heroes' Goal</span>
                    <p class="text-xs">${haunt.goal_heroes}</p>
                </div>
                <div>
                    <span class="text-stone-500 uppercase text-[10px] block">Traitor's Goal</span>
                    <p class="text-xs">Reveal yourself as the traitor to discover your purpose.</p>
                </div>
            </div>
        </div>
    `;
  renderOracle(hauntMessage);
}

// *** pull haunt objects from json file and assigns it to array variable, hauntDatabase***

async function loadHauntData() {
  try {
    const res = await fetch("/assets/haunts.json");
    if (!res.ok) {
      throw new Error("Failed to load haunt data.");
    }
    const data = await res.json();
    hauntDatabase = data.haunts;
    console.log("Haunts database loaded successfully.");
  } catch (error) {
    console.log("Failed to load JSON:", error);
  }
}

// ** filter database for what is selected in the dropdown menus***
function getHaunt(room, omen) {
  return hauntDatabase.find(
    (h) => h.trigger_room === room && h.trigger_omen === omen,
  );
}

// *** toggle overlay About/Credits

function toggleAbout() {
  const overlay = document.getElementById("aboutOverlay");
  const drawer = document.getElementById("aboutDrawer");

  if (overlay.classList.contains("hidden")) {
    overlay.classList.remove("hidden");
    setTimeout(() => {
      drawer.classList.remove("translate-x-full");
    }, 10);
  } else {
    drawer.classList.add("translate-x-full");
    setTimeout(() => {
      overlay.classList.add("hidden");
    }, 300);
  }
}

// *** Call Gemini API function ***
// Returns AI response. Calls and inserts the API key to a POST request to Gemini AI API containing array of information from user input and saved message/response history created in main function
async function callGemini(contents) {
  let apiKey = await getKey();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      system_instruction: {
        // *** System instructions are passed through a variable located at the bottom of this file ***
        parts: [
          {
            text: systemInstructions,
          },
        ],
      },
      // In main function, this is an array that is built from user input and previous AI responses, structured to how Gemini reads these messages. This is not stored in local storage and so will not carry over to page refresh or navigate away from page.
      contents: contents,
    }),
  });

  if (response.ok) {
    //convert to json and navigate API data to the response
    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    return aiResponse;
  } else if (response.status === 429) {
    const errorBody = await response.text();
    console.error("Final Debug - Status:", response.status, "Body:", errorBody);
    return "The oracle is silent and may need time to recover.";
  } else {
    const errorBody = await response.text();
    console.error("Final Debug - Status:", response.status, "Body:", errorBody);
    //If the AI fails to respond for whatever reason, generate a friendly message.
    return "The spirits are quiet.";
  }
}

async function callFakeGemini() {
    return await new Promise((resolve) => {
        setTimeout(() => resolve(
                '<em class="text-stone-500 italic block mb-2 border-b border-stone-800 pb-1"> A chill winds through the corridor... </em> You have encountered an <strong class="text-red-600 font-bold">Omen</strong>. You must immediately: <ul class="list-disc ml-5 mt-2 space-y-1 text-stone-400"> <li>End your movement phase.</li> <li>Draw one card from the <span class="underline decoration-red-900">Omen Deck</span>.</li> <li>Perform a <strong class="text-white bg-red-900 px-1">Haunt Roll</strong>.</li> </ul>',
            ), 5000);
    })
}

// async function callFakeGemini(isResolved = true) {
//   return await new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (isResolved)
//         return resolve(
//           '<em class="text-stone-500 italic block mb-2 border-b border-stone-800 pb-1"> A chill winds through the corridor... </em> You have encountered an <strong class="text-red-600 font-bold">Omen</strong>. You must immediately: <ul class="list-disc ml-5 mt-2 space-y-1 text-stone-400"> <li>End your movement phase.</li> <li>Draw one card from the <span class="underline decoration-red-900">Omen Deck</span>.</li> <li>Perform a <strong class="text-white bg-red-900 px-1">Haunt Roll</strong>.</li> </ul>',
//         );
//       return (reject("error"), 5000);
//     });
//   });
// }

// ***************** MAIN function *******************

async function main() {

    enterBtn.addEventListener("click", () => {
        enterTheHouse();
    })
    
  // *** within main, event listener for the haunt toggle and effects, adds a message to chat history to notify Gemini that the haunt is active or inactive, renders a message to the user on the DOM

  hauntToggle.addEventListener("change", (e) => {
    if (e.target.checked) {
      //randomize haunt message
      const randomIndex = Math.floor(Math.random() * hauntMessages.length);
      // change to haunt mode
      const audio = new Audio("/assets/hauntbegin.mp3");
      audio.play();
      renderOracle(hauntMessages[randomIndex]);
      hauntWrapper.classList.remove("max-h-0", "opacity-0", "invisible");
      hauntWrapper.classList.add(
        "max-h-[500px]",
        "opacity-100",
        "visible",
        "my-4",
      );
      chatWindow.classList.add(
        "border-red-900",
        "shadow-[0_0_30px_rgba(153,27,27,0.3)]",
        "animate-haunt-breath","haunt-mist"
        );
    } else {
      // reset to exploration mode
      contents.push({
        role: "user",
        parts: [
          {
            text: "[SYSTEM UPDATE]: The Haunt has ended. You are no longer in a high-threat state. Resume exploration core rules logic and ignore previously stated Haunt rules and any haunt related-information such as goals, special rules, and haunt setup. Resume the standard, calmer tone.",
          },
        ],
      });
      hauntWrapper.classList.add("max-h-0", "opacity-0", "invisible");
      hauntWrapper.classList.remove(
        "max-h-[500px]",
        "opacity-100",
        "visible",
        "my-4",
      );
      chatWindow.classList.remove(
        "border-red-900",
        "shadow-[0_0_30px_rgba(153,27,27,0.3)]",
        "animate-haunt-breath","haunt-mist"
        );
      renderOracle(
        "The oppressive weight lifts and the air grows still. <strong>The House was merely testing your pulse.</strong> For now, the house remains silent.",
      );
    }
  });

  // *** within main, haunt selection button, ensures both options are selected, finds the object and information based on the selections, returns information to DOM and chat history, hides haunt triggers
  triggerHauntBtn.addEventListener("click", () => {
    const selectedRoom = document.getElementById("roomSelect").value;
    const selectedOmen = document.getElementById("omenSelect").value;
    if (selectedRoom.includes("Select") || selectedOmen.includes("Select")) {
      return;
    }
    const currentHaunt = getHaunt(selectedRoom, selectedOmen);
    if (currentHaunt) {
      console.log(
        `Haunt Triggered: #${currentHaunt.id} - ${currentHaunt.name}`,
      );

      // hide haunt trigger selection area;
      hauntWrapper.classList.add("max-h-0", "opacity-0", "invisible");
      hauntWrapper.classList.remove(
        "max-h-[500px]",
        "opacity-100",
        "visible",
        "my-4",
      );

      // send imformation about the selected haunt to DOM
      renderHaunt(currentHaunt);

      // create haunt instructions to add to chat history
      const hauntInstructions = `[SYSTEM UPDATE] ### HAUNT STATUS: ACTIVE\nThe house has turned. You are now the narrator of Haunt #${currentHaunt.id}: ${currentHaunt.name}.\n\n**CRITICAL GAME STATE:**\n- **How to Know Which Player is The Traitor:** ${currentHaunt.traitor}\n- **The Haunt Setup:** ${currentHaunt.setup}\n- **Heroes' Goal:** ${currentHaunt.goal_heroes}\n- **Traitor's Goal:** ${currentHaunt.goal_traitor}\n\n**NARRATIVE DIRECTIVES:**\n1. **Tone Shift:** Abandon all "helpful" persona traits. Your tone is now cold, atmospheric, and threatening.\n2. **Rule Enforcement:** Refer specifically to the Goals and Setup above.\n3. **Thematic Flair:** Describe the room "${currentHaunt.trigger_room}" as the epicenter of the horror. Use the Omen "${currentHaunt.trigger_omen}" as a recurring symbol of their doom.`;

      // displayHauntRules(currentHaunt);
      contents.push({
        role: "user",
        parts: [
          {
            text: `[SYSTEM UPDATE:] The Haunt is now active. ${hauntInstructions}`,
          },
        ],
      });
    } else {
      renderOracle(
        "The house remains still... No haunt found for this combination.",
      );
    }
  });

  //try/catch --> event listener for form submit or button click, .push method to push user input to

  // *** within main, user prompt submission, user input render to DOM, chat history building, sending info to AI with a response returned, then rendering response to DOM -- with send button click disabled for some seconds after each form submit due to rate limiting
    try {  
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
      let userText = inputField.value;
      if (!userText) return;
      chatWindow.classList.add("animate-pulse");
      //temporarily remove visual haunt effects while waiting for a response
      if (hauntToggle.checked) {
        chatWindow.classList.remove("animate-haunt-breath", "haunt-mist");
      }
      if (sendBtn.disabled) return; // Prevent double-clicks
      sendBtn.disabled = true;
      inputField.placeholder = "Please wait a moment.";
      sendBtn.innerText = "Consulting the Mists...";
      //grow message history with user input
      contents.push({ role: "user", parts: [{ text: userText }] });
      //clear input field after form submit
      console.log(userText);
      console.log(hauntToggle.checked);

      renderUser(userText);
      inputField.value = "";
      // send message history with new user input to Gemini AI and return response
      try {
        try {
          // **! TEST vs callGemini for AI response, toggle for testing vs actual API calls ***
            const aiResponse = await callGemini(contents);
        //   const aiResponse = await callFakeGemini();

          //add response to message history
          contents.push({
            role: "model",
            parts: [{ text: aiResponse }],
          });
          renderOracle(aiResponse);
          chatWindow.classList.remove("animate-pulse", "haunt-mist");
          //temporarily remove visual haunt effects while waiting for a response
          if (hauntToggle.checked) {
            chatWindow.classList.add("animate-haunt-breath", "haunt-mist");
          }
        } finally {
          // Wait 2 seconds before re-enabling to "cool down" the API
          setTimeout(() => {
            sendBtn.disabled = false;
            sendBtn.innerText = "Consult";
            inputField.focus();
          }, 5000);
        }
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

main();

//Template for how to send user input and message history to the API.~
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

// *** System instructions, I used Gemini and Google AI Studio to build the system instructions that wouldn't slow the response times too badly and would give the most concise and accurate responses. This block of text contains the core rules of the game, and how to behave. It also contains instructions on when to look up information from a file uploaded to Google AI studio, linked to this API key.***
const systemInstructions =
  "# ROLE You are the 'Oracle of the House,' a rules engine for Betrayal at House on the Hill (3rd Ed). Your tone is eerie, helpful, but ominous, and you refer to the rules as 'memories' or 'the house's will'. RULES DATA [Betrayal at House on the Hill (3rd Edition) 1. Core Components & Logic Dice: Eight 6-sided dice with faces showing 0, 1, or 2 dots. A 'Result' is the sum of dots. Traits: Each explorer has 4 traits: Might, Speed (Physical) and Knowledge, Sanity (Mental). Trait Tracks: Traits are tracked by clips on a numbered scale. Numbers in Green: Starting values. Skull Symbol: Death (only possible after the Haunt begins). Critical: The lowest value on a track before the Skull. Damage/Healing Logic: Spaces, Not Values: When taking damage or gaining traits, move the clip X spaces, regardless of the numbers printed on the track. Physical Damage: Lose Might and/or Speed. Mental Damage: Lose Knowledge and/or Sanity. General Damage: Player chooses any traits to lower. Healing: Return the clip to its starting green value. 2. Game Setup Select Scenario: Players choose 1 of 5 Scenario cards (determines the Haunt later). Starting Tiles: Place 'Entrance Hall/Hallway/Ground Floor Staircase' (triple tile), 'Basement Landing,' and 'Upper Landing' 8 to 10 inches apart. Explorers: Players choose characters, set clips to green values, and place figures on the Entrance Hall. Decks: Shuffle Event, Item, Omen, and Room Tile decks separately. Turn Order: The explorer with the next upcoming birthday goes first; play proceeds clockwise. 3. Phase 1: Before the Haunt Turn Actions (Any order): Movement: An explorer can move up to a number of tiles equal to their current Speed. Discovery: If at an unexplored doorway, move through it. Draw the top Room Tile from the stack. It must match your current region (Basement, Ground, or Upper). If not, 'Bury' it (put it at the bottom of the stack) until a match is found. Connect the tile. At least one doorway must connect to the door you just exited. Discovery ends your turn immediately after resolving the tile's symbols/effects. Card Resolution: If a tile has a symbol (Event, Item, Omen), draw the matching card. Event: Read, resolve, then 'Bury' the card. Item/Omen: Keep the card face-up. You now possess it. Trading: Once per turn, you may exchange Items/Omens with an explorer on your tile. Special Actions: Actions marked with a Special Action Icon can be used once per turn. 4. The Haunt Trigger Haunt Roll: Whenever an Omen is drawn, the player rolls dice equal to the total number of Omens discovered by all players. The Result: If the roll is 5 or higher, the Haunt begins. Automatic Trigger: If all Omen cards are drawn, the Haunt starts automatically. Identifying the Haunt: Use the Omen drawn and the chosen Scenario card to find the Haunt number in the Traitor's Tome and Secrets of Survival. 5. Phase 2: After the Haunt Begins Structural Changes: Teams: Players split into 'Heroes' and 'The Traitor' (based on the Haunt instructions). Setup: Both sides read their intro text aloud, then perform secret setup in separate rooms. Death: Explorers die if any trait reaches the Skull symbol. Corpses: When an explorer dies, they leave a figure on the tile. Others may move there to 'Trade' (loot) Items/Omens from the corpse. Combat (Attacking): Frequency: Once per turn, you may attack an opponent on your tile. The Roll: Both players roll dice equal to their Might (unless a card specifies another trait). The Outcome: The higher roller deals damage to the loser equal to the difference between the rolls. On a tie, no damage is dealt. Mental Combat: If attacking with Sanity or Knowledge, damage is Mental. Distance: You cannot attack someone at range unless you have a specific Item/Ability. Monsters: Movement: The Traitor rolls dice equal to the monster's Speed. This is the max tiles it can move. It always moves at least 1 tile. Stunning: Monsters usually cannot be killed. If they take damage, they are 'Stunned.' Flip their token. They skip their next turn to 'unstun.' Abilities: Monsters ignore all damaging tile effects and can move between the 'Basement Landing' and 'Ground Floor Staircase' as if they were adjacent. 6. Glossary of Terms Adjacency: Tiles are adjacent if they share a connected doorway. Bury: Place the tile or card at the bottom of its respective deck/stack. Line of Sight: Two tiles are in line of sight if they are in a straight line with no walls/doors blocking the path. Obstacles: Moving out of a tile containing an opponent (Explorer or Monster) costs 1 extra point of movement. Forced Movement: If an effect says move 'up to' X spaces, the person controlling the effect decides the distance.] # OPERATIONAL CONSTRAINTS - **Stay on Topic:** Only answer questions about the game rules. - **No Assumptions:** If the rules don't mention 'diagonal movement,' tell the user it is not allowed. - **Tone:** Be spooky, brief, and authoritative. - **If the Haunt Begins:** If the user indicates that the haunt has begun, there are secrets that must only be disclosed to the user that is 'the Traitor' if that haunt has one. Be sure to verify if the user is the traitor before revealing those secrets. Do not reveal the purpose of the traitor to anyone who has not revealed themselves as the traitor to you.**When responding,** use HTML tags with Tailwind CSS classes for emphasis. For dangerous or vital rules, use <strong class='text-red-600 font-bold tracking-widest uppercase'> For flavor text or whispers, use <em class='text-stone-500 italic opacity-80 block mb-2'> For lists, use <ul class='list-disc ml-4 space-y-1'> Never use Markdown (no ** or #). No highlighting.";
