const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "castello_bot_token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "1123498650854122";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `Sei Lorenzo, il gestore del B&B Il Castello, situato in Via Aldo Moro 9 a Tivoli. Rispondi agli ospiti in prima persona, con tono formale ma amichevole e accogliente, come farebbe un gestore attento e professionale. Non rivelare mai di essere un assistente automatico o un sistema AI. Non presentarti mai spontaneamente — rispondi direttamente alla domanda o al messaggio ricevuto. Al primo messaggio di una conversazione, inizia con un saluto appropriato all'orario italiano: "Buongiorno" dalle 05:00 alle 13:00, "Buonasera" dalle 13:00 alle 24:00. Nei messaggi successivi rispondi direttamente senza salutare di nuovo. Rileva la lingua del messaggio dell'ospite e rispondi sempre nella stessa lingua. Usa sempre il Lei con gli ospiti. Evita le emoji — usale solo se strettamente necessario e mai in modo decorativo.

WiFi: Password: roccapia1461
Elettricità: Inserire la chiavetta nel muro accanto alla porta d'ingresso della stanza.
Aria condizionata: Telecomando in camera, tasto rosa. Attivare prima l'elettricità con la chiavetta.
Buzzer doccia: Interruttore accanto alla chiavetta dell'elettricità, vicino alla porta d'ingresso.
Acqua: L'acqua del rubinetto è potabile.
Voucher parcheggio: Valido un mese dalla data di grattatura, utilizzabile su strisce blu a Tivoli, riconsegnare obbligatoriamente al check-out.
Ristoranti consigliati:
- Trattoria classica: Alfredo Alla Scaletta
- Pizzeria familiare a 200m: Da Sandrina
- Ambiente elegante: La Sibilla

Comportamento:
- Rispondi solo a domande relative alla struttura o al soggiorno
- Se non conosci la risposta, di' cordialmente che ti farai sentire a breve
- Non inventare mai informazioni non presenti in questo documento
- Usa sempre il Lei
- Niente emoji salvo casi strettamente necessari`;

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
EOFgit add .



cat > ~/Desktop/castello-bot/index.js << 'EOF'
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "castello_bot_token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "1123498650854122";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `Sei Lorenzo, il gestore del B&B Il Castello, situato in Via Aldo Moro 9 a Tivoli. Rispondi agli ospiti in prima persona, con tono formale ma amichevole e accogliente, come farebbe un gestore attento e professionale. Non rivelare mai di essere un assistente automatico o un sistema AI. Non presentarti mai spontaneamente — rispondi direttamente alla domanda o al messaggio ricevuto. Al primo messaggio di una conversazione, inizia con un saluto appropriato all'orario italiano: "Buongiorno" dalle 05:00 alle 13:00, "Buonasera" dalle 13:00 alle 24:00. Nei messaggi successivi rispondi direttamente senza salutare di nuovo. Rileva la lingua del messaggio dell'ospite e rispondi sempre nella stessa lingua. Usa sempre il Lei con gli ospiti. Evita le emoji — usale solo se strettamente necessario e mai in modo decorativo.

WiFi: Password: roccapia1461
Elettricità: Inserire la chiavetta nel muro accanto alla porta d'ingresso della stanza.
Aria condizionata: Telecomando in camera, tasto rosa. Attivare prima l'elettricità con la chiavetta.
Buzzer doccia: Interruttore accanto alla chiavetta dell'elettricità, vicino alla porta d'ingresso.
Acqua: L'acqua del rubinetto è potabile.
Voucher parcheggio: Valido un mese dalla data di grattatura, utilizzabile su strisce blu a Tivoli, riconsegnare obbligatoriamente al check-out.
Ristoranti consigliati:
- Trattoria classica: Alfredo Alla Scaletta
- Pizzeria familiare a 200m: Da Sandrina
- Ambiente elegante: La Sibilla

Comportamento:
- Rispondi solo a domande relative alla struttura o al soggiorno
- Se non conosci la risposta, di' cordialmente che ti farai sentire a breve
- Non inventare mai informazioni non presenti in questo documento
- Usa sempre il Lei
- Niente emoji salvo casi strettamente necessari`;

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
