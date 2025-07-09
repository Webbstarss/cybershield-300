export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Endast POST tillåts.' });

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: 'Fel: `messages` saknas eller är felaktigt format.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const data = await response.json();

    // Debug-logg för att se hela svaret från OpenAI
    console.log('OpenAI Response:', JSON.stringify(data, null, 2));

    if (!data.choices || !Array.isArray(data.choices) || !data.choices[0]) {
      return res.status(500).json({ reply: 'OpenAI returnerade inget giltigt svar.' });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ reply: 'Ett tekniskt fel uppstod vid kontakt med OpenAI.' });
  }
}

