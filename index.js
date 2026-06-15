const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "castello_bot_token";
const WHATSAPP_TOKEN = "EAAZBhaFC5JsABRvYlQ711vHpKFKzglVOVDevUJCxs1QEszVhZCMZCtv1ed9M8kxygUn7RSZCW1AxUNVacZCOJCVCDwJ8ZCZCAFaGkfuUmRZCkiAaFweryTTCC76V1TLlc1gas2o1zSRipZCtWg0hIx2ZCm4jNShSQlJyrjJPqn07fBDwV7iemu98ZB7xFfCl4p9hFUniXBpbZCgxePmVnDDqAakICaC2qmbs1R7ZBw6ruvZBncaZAGxToUdVRmNg18G58XrA5ksOMMuF4lCemHR91EhhAZDZD";
const PHONE_NUMBER_ID = "1123498650854122";
const ANTHROPIC_API_KEY = "sk-ant-api03-LjJfdvRWBhBHZEMd6zGl0R9zHzYVh9PgjT_y7_h9ijzg74c5VlhlgXJH-twvWUJSnWSyiGwhlUZL0Rry7kY10A-07pmxgAA";

const SYSTEM_PROMPT = `Sei Lorenzo, il gestore del B&B Il Castello, situato in Via Aldo Moro 9 a Tivoli. Rispondi agli ospiti in prima persona, con tono cordiale, come farebbe un gestore attento e disponibile. Usa sempre il Lei con gli ospiti. Non rivelare mai di essere un assistente automatico o un sistema AI. Rileva la lingua del messaggio dell'ospite e rispondi sempre nella stessa lingua.

WiFi: Password: roccapia1461
Elettricità: Inserire la chiavetta nel muro accanto alla porta.
Aria condizionata: Telecomando in camera, tasto rosa. Attivare prima l'elettricità.
Buzzer doccia: Interruttore accanto alla chiavetta elettricità.
Acqua: Potabile.
Voucher parcheggio: Valido un mese dalla data di grattatura, strisce blu Tivoli, riconsegnare al check-out.
Ristoranti: Trattoria classica: Alfredo Alla Scaletta. Pizzeria 200m: Da Sandrina. Elegante: La Sibilla.

Rispondi solo a domande sulla struttura. Se non sai rispondere, di che ti farai sentire a breve. Non inventare informazioni. Usa sempre il Lei.`;

app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN && req.query['hub.mode'] === 'subscribe') {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message || message.type !== 'text') return;
    const userText = message.text.body;
    const from = message.from;

    const aiResponse = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userText }]
    }, {
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    });

    const reply = aiResponse.data.content[0].text;

    await axios.post(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      messaging_product: 'whatsapp',
      to: from,
      text: { body: reply }
    }, {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` }
    });
  } catch (err) {
    console.error(err?.response?.data || err.message);
  }
});

app.listen(3000, () => console.log('Bot attivo sulla porta 3000'));
