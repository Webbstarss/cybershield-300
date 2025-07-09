export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Endast POST-förfrågningar tillåts.' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: 'Fel: Meddelanden saknas eller är i fel format.' });
  }

  // 🔐 Kontrollera om API-nyckeln finns
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('Ingen OpenAI API-nyckel hittades i miljövariabler.');
    return res.status(500).json({ reply: 'Serverfel: API-nyckel saknas.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // 📋 Logga svaret från OpenAI för felsökning (visas i Vercel Logs)
    console.log("Svar från OpenAI:", JSON.stringify(data, null, 2));

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      return res.status(500).json({ reply: 'OpenAI returnerade inget giltigt svar.' });
    }

    const reply = data.choices[0].message?.content || 'Inget svar från AI:n.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('API-fel:', error);
    return res.status(500).json({ reply: 'Ett oväntat fel uppstod vid kontakt med OpenAI.' });
  }
}

