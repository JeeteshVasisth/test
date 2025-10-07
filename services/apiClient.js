const API_BASE = location.hostname === 'localhost' || location.hostname.includes('.replit.dev')
  ? '/.netlify/functions'
  : '/.netlify/functions';

export const callGeminiAPI = async (action, data) => {
  try {
    const response = await fetch(`${API_BASE}/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, data }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

export const sendChatMessage = async (message, isNewSession = false) => {
  try {
    const result = await callGeminiAPI('chat', { message, isNewSession });
    return result.text;
  } catch (error) {
    return "I'm sorry, but I encountered an error. Please try again in a moment.";
  }
};

export const identifyScrap = async (base64Image, mimeType) => {
  try {
    const result = await callGeminiAPI('identify', { imageBase64: base64Image, mimeType });
    return result.text;
  } catch (error) {
    throw new Error("Could not identify the item. Please try a clearer image.");
  }
};

export const calculateValue = async (scrapType, weight, unit) => {
  try {
    const result = await callGeminiAPI('calculate', { scrapType, weight, unit });
    return result.text;
  } catch (error) {
    throw new Error("Could not calculate value. Please try again.");
  }
};

export const generateContactResponse = async (name) => {
  try {
    const result = await callGeminiAPI('contact', { name });
    return result.text;
  } catch (error) {
    return `Thank you, ${name}! Your pickup request has been received. A local kabaadiwala will contact you shortly.`;
  }
};
