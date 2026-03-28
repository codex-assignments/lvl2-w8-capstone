# lvl2-w8-capstone

This is a capstone project for Level 2

This website uses Gemini API to wire an interactive AI chat bot with system instructions to perform as a rule book or game master for a popular board game. In this case, the 2nd edition of Betrayal at the House on the Hill. The API key is stored off-site and fetched to be added to the callGemini fetch function in the header.

The oracle works by creating a variable array which contains all user input and past responses, as well as new commands. This "chat history" is added to the POST request each time the user sends something in the input field. The AI model will have this to refer to for each response.

The system instructions were built using Google Gemini to trim down the game rules pdf, and to give instructions to stay on topic, and remain in character. 

There is haunt selector logic, which fetches the JSON file (/assets/haunts.json) which contains all 50 haunt scenarios as objects. The user must select both a room and an omen before clicking a button to trigger the filter that brings up the associated haunt object. The information from that object is passed to the chat history to inform the AI model in the next user prompt.

The input form is artificially slowed by a disable cooldown before being enabled again to prevent spamming or double-clicking, and hitting the AI's rate limit faster.

The site is a single page with a splash screen overlay that disappears with overlay-hidden css upon clicking through, which triggers a wake up function to the proxy server hosting the API key and then the initial messages to the user as though the AI chatbot is prompting their questions. 

The chatwindow scrolls, renders user input and ai responses, and changes effects when the "haunt" state is activated.

With the free tier, the AI is rate limited to 20 RPM or 1500 RPD and a fairly high ceiling on tokens. But through testing, the limits may translate to one response per minute once the 20 responses have been reached in a short time period.

REPO:
https://github.com/codex-assignments/lvl2-w8-capstone.git

LIVE SITE:
https://codex-assignments.github.io/lvl2-w8-capstone/