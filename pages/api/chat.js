export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ reply: 'Fel: Ogiltiga meddelanden.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const reply = data.choices?.[0]?.message?.content || 'OpenAI returnerade inget giltigt svar.';
    res.status(200).json({ reply });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ reply: 'Ett fel uppstod när svaret skulle hämtas.' });
  }
}

