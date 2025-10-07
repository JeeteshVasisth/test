import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { action, data } = JSON.parse(event.body);

    switch (action) {
      case 'chat': {
        const { message, isNewSession } = data;
        
        const chatSystemInstruction = `You are "Kabaadi Assistant", a friendly, helpful AI guide for "Kabaadi and Co", a platform connecting users with local scrap dealers (kabaadiwalas).

Your responsibilities are:
1.  Answer questions about what scrap we buy (Paper, Plastic, Metals, E-waste etc.).
2.  Provide *estimated* prices for scrap items when asked, but always state that "prices may vary based on location, quality, and current market rates." Example: "Newspaper is currently around ₹12-15 per kg, but the final price is set by the kabaadiwala."
3.  Explain our simple process: Schedule Pickup -> Kabaadiwala Arrives -> Weigh & Pay -> Responsible Recycling.
4.  Encourage users to use the "Scrap Identifier" for unknown items or the "Scrap Value Calculator" for estimates.
5.  Gently guide users to schedule a pickup using the contact form for any serious inquiries.
6.  If you don't know an answer, politely say, "That's a great question! For the most accurate information, please fill out our contact form, and a local expert will get in touch."

Keep your tone helpful and local. Use Indian currency symbol (₹) for prices. Keep answers concise (2-3 sentences).`;

        const chat = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: chatSystemInstruction,
            thinkingConfig: { thinkingBudget: 0 }
          },
        });

        const response = await chat.sendMessage({ message });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ text: response.text.trim() })
        };
      }

      case 'identify': {
        const { imageBase64, mimeType } = data;
        
        const model = ai.models.get({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent({
          systemInstruction: `You are a scrap material identification expert. Analyze the image and identify the scrap material type. Provide: 1) Material name, 2) Estimated price per kg in INR (₹), 3) Brief description. Keep it concise.`,
          contents: [{
            parts: [
              { text: "Identify this scrap material and estimate its value:" },
              { inlineData: { mimeType, data: imageBase64 } }
            ]
          }]
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ text: result.text })
        };
      }

      case 'calculate': {
        const { scrapType, weight, unit } = data;
        
        const model = ai.models.get({ model: 'gemini-2.5-flash' });
        const prompt = `Calculate the estimated value of ${weight} ${unit} of ${scrapType} scrap. Provide:
1. Estimated value in INR (₹)
2. Environmental impact (CO2 saved, trees saved, etc.)
3. Brief explanation
Keep the response concise and use Indian rupee symbol (₹).`;

        const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ text: result.text })
        };
      }

      case 'contact': {
        const { name } = data;
        
        const model = ai.models.get({ model: 'gemini-2.5-flash' });
        const prompt = `Generate a friendly confirmation message for ${name} who just scheduled a scrap pickup with Kabaadi and Co. Keep it warm, brief (2-3 sentences), and reassuring. Mention that a local kabaadiwala will contact them soon.`;

        const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ text: result.text })
        };
      }

      default:
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to process request', details: error.message })
    };
  }
};
