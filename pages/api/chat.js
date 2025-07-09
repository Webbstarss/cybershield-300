export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Endast POST tillåts.' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: 'Fel: `messages` saknas eller är felaktigt format.' });
  }

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    // Lägg till denna logg för att se exakt vad vi får från OpenAI
    console.log("Svar från OpenAI API:", JSON.stringify(data, null, 2));

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      return res.status(500).json({ reply: 'OpenAI gav inget svar. Kontrollera API-nyckel och model.' });
    }

    const reply = data.choices[0].message?.content || 'Inget svar från AI:n.';
    res.status(200).json({ reply });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ reply: 'Ett fel uppstod vid kontakt med OpenAI.' });
  }
}

