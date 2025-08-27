const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const path=require('path');
const fs = require('fs');
const app = express()
app.use(cors())
app.use(bodyParser.json());
app.use(express.static('public'));

// ~~~~~~~~~~~~~~~~~~~~~~~~``for setting button logic~~~~~~~~~~~~~~~~~~~~~~~~
app.use(express.json()); // to parse JSON body
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

// ~~~~~~~~~~~~~~~~~~~~~~~~~one to one counseling~~~~~~~~~~~~~~~~~~`
// Endpoint to get counselors
app.get('/api/counselors', (req, res) => {
  const data = fs.readFileSync('counselors.json');
  res.json(JSON.parse(data));
});

// Booking route
app.post('/api/book', (req, res) => {
  const { counselor, user } = req.body;
  console.log(`🔔 Booking received from ${user} for counselor ${counselor}`);
  res.json({ message:` ✅ Booking confirmed with ${counselor}` });
});

// ~~~~~~~~~~~~~~~~~~~Virtual support group~~~~~~~~~~~~~
const sessions = require('./sessions.json');

// Get all sessions
app.get('/api/sessions', (req, res) => {
  res.json(sessions);
});

// Join a session
app.post('/api/sessions/join', (req, res) => {
  const { sessionId, name } = req.body;
  console.log(`📥 ${name} registered for session ${sessionId}`);
  res.json({ message:` You have joined the session successfully! `});
});
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Emergency route
app.post("/api/emergency", (req, res) => {
  const { name, phone, reason } = req.body;

  const newEntry = { name, phone, reason, timestamp: new Date().toISOString() };

  fs.readFile("emergency.json", "utf8", (err, data) => {
    let entries = [];
    if (!err && data) entries = JSON.parse(data);

    entries.push(newEntry);

    fs.writeFile("emergency.json", JSON.stringify(entries, null, 2), err => {
      if (err) {
        console.error("Error saving emergency data:", err);
        return res.status(500).json({ message: "Failed to save request" });
      }

      console.log("🚨 Emergency Request Received:");
      console.log("Name:", name);
      console.log("Phone:", phone);
      console.log("Reason:", reason);

      res.status(200).json({ message: "Emergency request submitted successfully!" });
    });
  });
});


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`Medication schedule~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
const medsFile = path.join(__dirname, 'medications.json');

if (!fs.existsSync(medsFile)) fs.writeFileSync(medsFile, '[]');

// GET all meds
app.get('/api/medications', (req, res) => {
  const meds = JSON.parse(fs.readFileSync(medsFile));
  res.json(meds);
});

// Add new med
app.post('/api/medications', (req, res) => {
  const { name, time } = req.body;
  const meds = JSON.parse(fs.readFileSync(medsFile));
  meds.push({ name, time });
  fs.writeFileSync(medsFile, JSON.stringify(meds, null, 2));
  res.json({ message: "Medication added", meds });
});

// DELETE med
app.delete('/api/medications/:index', (req, res) => {
  const meds = JSON.parse(fs.readFileSync(medsFile));
  meds.splice(req.params.index, 1);
  fs.writeFileSync(medsFile, JSON.stringify(meds, null, 2));
  res.json({ message: "Deleted", meds });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~my support group~~~~~~~~~~~~~~~~~~~
const server=require('http').createServer(app);
const io=require("socket.io")(server);
io.on("connection",function(socket){
  socket.on("newuser",function(username){
    socket.broadcast.emit("update",username+"Joined the conversation");
  });
  socket.on("exituser",function(username){
    socket.broadcast.emit("update",username+"left the conversation");
  });
  socket.on("chat",function(message){
    socket.broadcast.emit("chat",message);
  });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`contact care team~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// Route to handle contact message
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  const contactData = { name, email, message, timestamp: new Date().toISOString() };

  const filepath = path.join(__dirname, 'contact_messages.json');
  const existing = fs.existsSync(filepath) ? JSON.parse(fs.readFileSync(filepath)) : [];

  existing.push(contactData);
  fs.writeFileSync(filepath, JSON.stringify(existing, null, 2));

  res.json({ message: 'Your message has been sent to the care team. 💖' });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`Symptom-tracker~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const symptomFilePath = path.join(__dirname, 'symptoms.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/symptoms', (req, res) => {
  fs.readFile(symptomFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error reading file' });
    res.json(JSON.parse(data || '[]'));
  });
});

app.post('/api/symptoms', (req, res) => {
  const newSymptom = req.body;
  fs.readFile(symptomFilePath, 'utf8', (err, data) => {
    const symptoms = JSON.parse(data || '[]');
    symptoms.push(newSymptom);
    fs.writeFile(symptomFilePath, JSON.stringify(symptoms, null, 2), (err) => {
      if (err) return res.status(500).json({ error: 'Error writing file' });
      res.json({ message: 'Symptom added' });
    });
  });
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~Medication reminder~~~~~~~~~~~~~~~~~~~

// API endpoint to fetch medications.json
app.get("/api/medications", (req, res) => {
  const filePath = path.join(__dirname, "medications.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading medications.json:", err);
      return res.status(500).json({ error: "Failed to load medications" });
    }
    res.json(JSON.parse(data));
  });
});



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

server.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});




