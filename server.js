const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { OpenAI } = require('openai');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY 
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// FALLBACK: If GitHub failed to upload the "public" folder, serve files directly from the root directory
const fs = require('fs');
app.get('/', (req, res) => {
    if (fs.existsSync(path.join(__dirname, 'public', 'index.html'))) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(__dirname, 'script.js')));
app.get('/knowledge-base.js', (req, res) => res.sendFile(path.join(__dirname, 'knowledge-base.js')));
app.get('/admin.html', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/admin.css', (req, res) => res.sendFile(path.join(__dirname, 'admin.css')));
app.get('/admin.js', (req, res) => res.sendFile(path.join(__dirname, 'admin.js')));

// Stateless Mode - No local database setup required

// API Routes

// 1. Health Check
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', version: '1.0' });
});

// 2. Save Chat Log (Stateless dummy route)
app.post('/api/chat-logs', (req, res) => {
    // We removed the SQLite database for easy public hosting.
    // Real deployments would save this to MongoDB here.
    res.status(201).json({ message: 'Chat log accepted (stateless mode)' });
});

// 3. Get Recent Chat Logs (for future admin panel)
app.get('/api/chat-logs', (req, res) => {
    res.json([]);
});



// 3. Admin Panel route
app.get('/admin', (req, res) => {
    if (fs.existsSync(path.join(__dirname, 'public', 'admin.html'))) {
        res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    } else {
        res.sendFile(path.join(__dirname, 'admin.html'));
    }
});

// 5. OpenAI LLM Fallback & Vision Route
app.post('/api/ask-llm', async (req, res) => {
    try {
        const { question, imageBase64 } = req.body;
        
        const baseInstruction = `Format your response in simple HTML (using <p>, <ul>, <strong>, etc.) so it renders nicely in a chat window. Use emojis. If the user asks in Hindi or Hinglish, reply in the same language.`;

        let systemPrompt = `You are AcroBot, the official AI admission counselor for Acropolis Institute of Technology & Research (AITR), Indore. Be helpful, polite, and knowledgeable about all aspects of AITR. ${baseInstruction}`;
        let agentName = 'General';

        // Multi-Agent Router Logic
        const qLower = (question || '').toLowerCase();
        if (qLower.match(/fee|money|scholarship|cost|expense|payment|hostel.*fee|tuition/)) {
            agentName = 'Finance';
            systemPrompt = `You are the AcroBot Finance Agent 💰. You specialize in fees and scholarships for Acropolis Institute (AITR), Indore. Key facts: Tuition is ~₹85K-1.1L/year, total ~₹1-1.3L/year. 4-year total ~₹4-5.2L. Scholarships: MP Govt SC/ST/OBC, AICTE Pragati (girls ₹50K/yr), Institute Merit, Central Sector, EWS. No on-campus hostel; nearby PGs ₹5-8K/month. ${baseInstruction}`;
        } else if (qLower.match(/placement|job|package|salary|recruit|hire|company|intern/)) {
            agentName = 'Placement';
            systemPrompt = `You are the AcroBot Placement Agent 💼. Key facts for AITR: Highest package ₹44 LPA (2024). Average ₹4.5-6 LPA. Median ₹4.2 LPA. Placement rate ~85%+ for CS/IT. Top recruiters: TCS, Infosys, Wipro, Cognizant, Capgemini, Accenture, HCL, IBM, Deloitte. Skills needed: DSA, OOP, DBMS, Web Dev, Aptitude. CSE/AIML/IT get best numbers. Emphasize that skills matter more than just the branch name. ${baseInstruction}`;
        } else if (qLower.match(/branch|cse|aiml|ai.*ml|ece|mechanical|civil|it\b|data science|cyber|career|scope|compare|vs|better|which/)) {
            agentName = 'Academic';
            systemPrompt = `You are the AcroBot Academic Advisor Agent 🎓. You help students choose the right branch at AITR. Branches offered: CSE, AI&ML, Data Science, Cyber Security, IT, ECE, Mechanical, Civil. CSE has best placements & toughest cutoff (~2.5L). AI&ML is fastest growing. IT is almost equal to CSE with easier cutoff. Provide detailed comparisons when asked. ${baseInstruction}`;
        } else if (qLower.match(/cutoff|rank|admission|chance|predict|counsel|jee|mp.*dte|seat/)) {
            agentName = 'Admissions';
            systemPrompt = `You are the AcroBot Admissions Agent 🎯. You help with admission predictions for AITR. Cutoffs (JEE Main CRL): CSE ~2.5L, AI&ML ~3.3L, Data Science ~3.8L, Cyber Security ~4.1L, IT ~4.8L, ECE ~5.4L. Categories get relaxation: EWS 15%, OBC 25%, SC 50%, ST 70%. Counseling via MP DTE: Register, fill choices, pay ₹1200, wait for allotment, report with documents. 3-4 rounds + mop-up. ${baseInstruction}`;
        } else if (qLower.match(/document|paper|certificate|marksheet|aadhar|photo|tc|migration/)) {
            agentName = 'Documentation';
            systemPrompt = `You are the AcroBot Documentation Agent 📄. Required documents for AITR admission: JEE Main Scorecard, 10th & 12th Marksheets, MP DTE Allotment Letter, Category Certificate (if applicable), Domicile Certificate (MP), TC, Migration Certificate, Character Certificate, Aadhar Card, 8-10 Passport Photos, Income Certificate, Gap Certificate (if applicable), Anti-Ragging Affidavit from AICTE portal. ${baseInstruction}`;
        }

        const messages = [
            { role: "system", content: systemPrompt }
        ];

        if (imageBase64) {
            messages.push({
                role: "user",
                content: [
                    { type: "text", text: question },
                    { type: "image_url", image_url: { url: imageBase64 } }
                ]
            });
        } else {
            messages.push({ role: "user", content: question });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            max_tokens: 600,
            temperature: 0.7
        });

        const reply = completion.choices[0].message.content;
        res.json({ response: reply, agent: agentName });
    } catch (err) {
        console.error("OpenAI API Error:", err.message || err);
        res.status(500).json({ error: "Failed to generate LLM response.", details: err.message });
    }
});

// Dummy route for lead capture (Stateless mode)
app.post('/api/lead', (req, res) => {
    const { name, phone } = req.body;
    if(!name || !phone) return res.status(400).json({error: "Missing data"});
    
    // In a real deployment, send this to MongoDB or an email service
    console.log(`[Lead Captured] Name: ${name}, Phone: ${phone}`);
    res.json({ success: true, message: "Lead captured (stateless mode)" });
});

// Fallback middleware to serve index.html for unknown routes (SPA support)
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io for Human Handoff
io.on('connection', (socket) => {
    socket.on('join_admin', () => {
        socket.join('admins');
        console.log('Admin connected to socket');
    });

    socket.on('request_human', (data) => {
        // notify admins
        io.to('admins').emit('user_needs_human', { 
            socketId: socket.id, 
            history: data.history 
        });
    });

    socket.on('admin_reply', (data) => {
        // send message to specific user
        io.to(data.userId).emit('human_reply', { message: data.message });
    });
    
    socket.on('user_message', (data) => {
        // forward user message to admin
        io.to('admins').emit('user_message_to_admin', { 
            socketId: socket.id, 
            message: data.message 
        });
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
