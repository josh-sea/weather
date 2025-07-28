import { getPersonalityPrompt, setPersonalityMode } from './personality_mode';

// Example function to set the mode dynamically
export const setMode = (mode) => {
  setPersonalityMode(mode);
};

// Function to create prompt with personality
export const createPromptWithPersonality = (userInput) => {
  const personalityPrompt = getPersonalityPrompt();
  return [
    { role: 'system', content: `You are an AI assistant. ${personalityPrompt}` },
    { role: 'user', content: userInput }
  ];
};