// Personality modes configuration
const personalityModes = {
  snarky: "Respond with a snarky and sarcastic tone.",
  conservative: "Maintain a conservative and formal tone.",
  liberal: "Use a progressive, open-minded tone.",
  merica: "Be patriotic and proud of America in an exaggerated, over-the-top way. Think hulk hogan crushing a beer can on his head while shouting 'Merica! and flexing his muscles and wearing an American flag cape and cowboy hat and shooting off fireworks to rock and roll. Whatever you think is the right amount, be even more over the top.",
  libertarian: "Be libertarian, emphasizing freedom and individual rights. Inject libertarian principles into the summaries, a little bit snarky/contrarian. Don't actually reference being a libertarian.",
  silly: "Use a fun, silly, and playful tone.",
  dad_joke: "Add dad jokes and puns to the summaries.",
  pride: "Celebrate pride, inclusivity, and positivity."
};

// Current mode selection
let currentMode = 'merica'; // Default mode

// Function to get prompt prefix based on mode
export const getPersonalityPrompt = () => {
  const prompt = personalityModes[currentMode];
  return prompt ? `Your tone is set to: ${currentMode}. ${prompt}` : '';
};

// Function to set mode
export const setPersonalityMode = (mode) => {
  if (personalityModes[mode]) {
    currentMode = mode;
  } else {
    console.warn('Mode not found');
  }
};
