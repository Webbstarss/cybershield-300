export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  // Kontrollera att messages finns och är en array
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: 'Fel: Meddelandeformatet är ogiltigt.' });
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

    // Om det inte finns några svar från OpenAI
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('OpenAI svarade utan choices:', data);
      return res.status(500).json({ reply: 'OpenAI returnerade inget giltigt svar.' });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ reply: 'Ett tekniskt fel uppstod vid kontakt med OpenAI.' });
  }
}

