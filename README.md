# 🎓 AcroBot AI

**AcroBot AI** is an intelligent, AI-powered admission counselor built for the **Acropolis Institute of Technology and Research (AITR), Indore**. It helps prospective students instantly find information about cutoff ranks, fees, placements, scholarships, and admission procedures.

![AcroBot AI Banner](https://via.placeholder.com/1000x400.png?text=AcroBot+AI+-+Admission+Counselor)

## ✨ Features

- **🧠 Smart AI Chat:** Powered by the Google Gemini API, capable of answering complex queries about engineering branches and college life.
- **🎯 Admission Predictor:** Step-by-step form wizard that predicts your chances of admission based on your JEE Main rank and category.
- **📊 Cutoff Trends:** View year-wise cutoff graphs for all branches (CSE, AI&ML, IT, ECE, etc.) powered by Chart.js.
- **📱 Mobile-First UI:** A stunning, premium "glassmorphism" design with horizontal swipeable quick-action menus optimized for smartphones.
- **🎙️ Voice & TTS:** Speak your questions using the microphone, and let AcroBot read the answers back to you.
- **💾 Save & Export:** Save chat sessions locally, or download them as beautifully formatted PDF documents.

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Real-time Engine:** Socket.io
- **AI Integration:** Google Gemini API
- **Libraries:** Chart.js (Data Visualization), HTML2PDF (PDF Export), Marked.js (Markdown parsing)
- **Deployment:** Render.com

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/acrobot.git
   cd acrobot
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   OPENAI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Server:**
   ```bash
   npm start
   ```

5. **Open in Browser:**
   Navigate to `http://localhost:3000`

## 🌍 Deployment

This project is configured to be easily deployed on [Render](https://render.com/). 
1. Create a Web Service on Render and connect your GitHub repository.
2. Set the Build Command to: `npm install`
3. Set the Start Command to: `node server.js`
4. Add the `OPENAI_API_KEY` to the Render Environment Variables.

## 📂 Project Structure

```text
acrobot/
├── public/               # Frontend assets
│   ├── index.html        # Main chat interface
│   ├── style.css         # UI Styling (Mobile-first, Glassmorphism)
│   ├── script.js         # Chat logic, API handling, UI updates
│   └── knowledge-base.js # Hardcoded AITR data (Cutoffs, Fees, etc.)
├── server.js             # Node/Express backend & API routing
├── package.json          # Project dependencies
└── .env                  # Secrets (Not pushed to GitHub)
```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is for educational purposes. Data regarding Acropolis Institute of Technology and Research is based on historical counseling trends and is subject to change.
