const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "castello_bot_token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = "1123498650854122";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = "Sei Lorenzo, il gestore del B&B Il Castello, in Via Aldo Moro 9 a Tivoli. Rispondi in prima persona con tono formale ma amichevole. Non rivelare mai di essere un sistema AI. Non presentarti spontaneamente. Al primo messaggio saluta con Buongiorno dalle 05:00 alle 13:00 o Buonasera dalle 13:00 alle 24:00. Nei messaggi successivi rispondi direttamente. Rileva la lingua e rispondi nella stessa lingua. Usa sempre il Lei. Evita le emoji. WiFi: roccapia1461. Elettricita: chiavetta nel muro accanto alla porta. Aria condizionata: telecomando in camera tasto rosa, attivare prima elettricita. Buzzer doccia: interruttore accanto alla chiavetta. Acqua potabile. Voucher parcheggio: valido un mese dalla grattatura, strisce blu Tivoli, riconsegnare al check-out. Ristoranti: trattoria Alfredo Alla Scaletta, pizzeria Da Sandrina a 200m, elegante La Sibilla. Se non sai rispondere di che ti farai sentire a breve. Non inventare informazioni.";

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
const message = req.body && req.body.entry && req.body.entry[0] && req.body.entry[0].changes && req.body.entry[0].changes[0] && req.body.entry[0].changes[0].value && req.body.entry[0].changes[0].value.messages && req.body.entry[0].changes[0].value.messages[0];
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

await axios.post('https://graph.facebook.com/v18.0/' + PHONE_NUMBER_ID + '/messages', {
messaging_product: 'whatsapp',
to: from,
text: { body: reply }
}, {
headers: { Authorization: 'Bearer ' + WHATSAPP_TOKEN }
});
} catch (err) {
console.error(err && err.response && err.response.data || err.message);
}
});

app.listen(3000, () => console.log('Bot attivo sulla porta 3000'));
