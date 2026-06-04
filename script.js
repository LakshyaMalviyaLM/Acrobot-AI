/* ================================================
   AcroBot — Chat Logic & UI Controller
   Enhanced with Charts, Form Wizard, Graphs & More
   ================================================ */

(function () {
  "use strict";

  // --- DOM References ---
  const messagesContainer = document.getElementById("messages-container");
  const messagesEl = document.getElementById("messages");
  const welcomeScreen = document.getElementById("welcome-screen");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menu-btn");
  const voiceBtn = document.getElementById("voice-btn");
  const sidebarClose = document.getElementById("sidebar-close");
  const newChatBtn = document.getElementById("new-chat-btn");

  // Chat state
  let chatStarted = false;
  
  // Restore saved chat history
  const savedHistory = localStorage.getItem('chatHistory');
  if (savedHistory && savedHistory.trim().length > 10) {
    // Hide welcome screen first
    if (welcomeScreen) welcomeScreen.style.display = "none";
    
    // Create a temp container to parse saved messages, then append them
    const temp = document.createElement('div');
    temp.innerHTML = savedHistory;
    // Move all saved message nodes into the messages container
    while (temp.firstChild) {
      messagesEl.appendChild(temp.firstChild);
    }
    
    chatStarted = true;
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
  }

  // Form wizard state
  let formWizardActive = false;
  let formWizardStep = 0;
  let formWizardData = { name: null, phone: null, rank: null, category: null, state: null, branch: null };

  // --- Overlay for mobile sidebar ---
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  document.body.appendChild(overlay);


  // ===========================
  //  Color Palette for Charts
  // ===========================
  const CHART_COLORS = {
    green: "#4caf50",
    cyan: "#26c6da",
    orange: "#ffb74d",
    red: "#ef5350",
    purple: "#9575cd",
    pink: "#f06292",
    teal: "#26a69a",
    indigo: "#7986cb",
    branches: [
      "#6c3fc7", "#26c6da", "#4caf50", "#ffb74d",
      "#ef5350", "#9575cd", "#f06292", "#26a69a"
    ]
  };


  // ===========================
  //  UI Helpers
  // ===========================

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  function getTimeString() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Auto-resize textarea
  userInput.addEventListener("input", () => {
    userInput.style.height = "auto";
    userInput.style.height = Math.min(userInput.scrollHeight, 150) + "px";
    sendBtn.disabled = !userInput.value.trim();
  });


  // ===========================
  //  Sidebar Controls
  // ===========================

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("active");
  });

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  }

  sidebarClose.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);


  // ===========================
  //  New Chat
  // ===========================

  newChatBtn.addEventListener("click", () => {
    localStorage.removeItem('chatHistory');
    chatStarted = false;
    formWizardActive = false;
    formWizardStep = 0;
    formWizardData = { name: null, phone: null, rank: null, category: null, state: null, branch: null };
    messagesEl.innerHTML = "";
    messagesEl.appendChild(welcomeScreen);
    welcomeScreen.style.display = "flex";
    userInput.value = "";
    userInput.style.height = "auto";
    sendBtn.disabled = true;
  });


  // ===========================
  //  Quick Actions & Welcome Cards
  // ===========================

  document.querySelectorAll(".quick-btn, .welcome-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const query = btn.dataset.query;
      if (query === "__FORM_HELPER__") {
        startFormWizard();
        closeSidebar();
        return;
      }
      if (query) {
        userInput.value = query;
        sendBtn.disabled = false;
        handleSend();
        closeSidebar();
      }
    });
  });


  // ===========================
  //  Message Rendering
  // ===========================

  function addMessage(role, html) {
    if (!chatStarted) {
      chatStarted = true;
      welcomeScreen.style.display = "none";
    }

    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${role}`;

    const avatarDiv = document.createElement("div");
    if (role === "bot") {
      avatarDiv.className = "bot-avatar-3d";
    } else {
      avatarDiv.className = "message-avatar";
      avatarDiv.textContent = "Y";
    }

    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";

    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = "message-bubble";
    bubbleDiv.innerHTML = html;

    const metaDiv = document.createElement("div");
    metaDiv.className = "message-meta";

    const timeDiv = document.createElement("span");
    timeDiv.className = "message-time";
    timeDiv.textContent = getTimeString();
    metaDiv.appendChild(timeDiv);

    // Add read receipt for user messages
    if (role === "user") {
      const receipt = document.createElement("span");
      receipt.className = "read-receipt";
      receipt.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      metaDiv.appendChild(receipt);
    }

    contentDiv.appendChild(bubbleDiv);
    contentDiv.appendChild(metaDiv);
    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(contentDiv);
    messagesEl.appendChild(msgDiv);

    // Attach chip event listeners if any
    setTimeout(() => {
      bubbleDiv.querySelectorAll(".form-chip").forEach(chip => {
        chip.addEventListener("click", () => handleChipClick(chip));
      });
    }, 50);

    scrollToBottom();
    return msgDiv;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "typing-indicator";
    div.id = "typing";
    div.innerHTML = `
      <div class="message-avatar" style="background: linear-gradient(135deg, var(--primary-500), var(--accent-500)); color: #fff; width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">A</div>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    `;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    const t = document.getElementById("typing");
    if (t) t.remove();
  }


  // ===========================
  //  Send / Receive
  // ===========================

  function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage("user", `<p>${escapeHtml(text)}</p>`);
    userInput.value = "";
    userInput.style.height = "auto";
    sendBtn.disabled = true;

    showTyping();

    // Simulate "thinking" delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      hideTyping();

      // If form wizard is active, process the step
      if (formWizardActive) {
        processFormWizardInput(text);
        return;
      }

      const response = generateResponse(text);
      if (response === "__LLM_FALLBACK__") {
        fetch('/api/ask-llm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: text })
        })
        .then(res => res.json())
        .then(data => {
          const agentName = data.agent || 'General';
          const agentBadge = `<div style="margin-bottom:8px;"><span class="chance-badge chance-high">🤖 ${agentName} Agent</span></div>`;
          let llmRes = agentBadge + (data.response || "<p>Sorry, I couldn't reach the AI brain right now.</p>");
          llmRes += `<div style="margin-top:10px;"><button class="quick-btn" onclick="requestHuman(this)">👨‍💼 Talk to a Human Counselor</button></div>`;
          const msgEl = addMessage("bot", llmRes);
          setTimeout(() => renderPendingCharts(msgEl), 100);
          logChat(text, llmRes);
          saveChatHistory();
          updatePredictiveSuggestions(text, agentName);
        })
        .catch(err => {
          const msgEl = addMessage("bot", "<p>⚠️ Error connecting to the AI server. Please try again.</p>");
          setTimeout(() => renderPendingCharts(msgEl), 100);
          logChat(text, "Error connecting to AI server");
          saveChatHistory();
        });
      } else {
        const msgEl = addMessage("bot", response);
        setTimeout(() => renderPendingCharts(msgEl), 100);
        logChat(text, response);
        saveChatHistory();
      }
    }, delay);
  }

  function saveChatHistory() {
    // Only save actual chat messages, not the welcome screen
    const messages = messagesEl.querySelectorAll('.message');
    let html = '';
    messages.forEach(msg => { html += msg.outerHTML; });
    localStorage.setItem('chatHistory', html);
  }

  function logChat(userMsg, botRes) {
    fetch('/api/chat-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_message: userMsg, bot_response: botRes })
    }).catch(err => console.error("Error logging chat:", err));
  }

  sendBtn.addEventListener("click", handleSend);

  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (userInput.value.trim()) handleSend();
    }
  });


  // ===========================
  //  Chart Rendering System
  // ===========================

  // Store pending chart data
  let pendingCharts = [];

  function renderPendingCharts(msgEl) {
    if (pendingCharts.length === 0) return;

    const charts = [...pendingCharts];
    pendingCharts = [];

    charts.forEach(chartData => {
      const canvas = msgEl.querySelector(`#${chartData.canvasId}`);
      if (!canvas) return;

      // Set actual pixel dimensions for sharp rendering
      const container = canvas.parentElement;
      const width = container.clientWidth - 32; // padding
      const dpr = window.devicePixelRatio || 1;

      if (chartData.type === "probability-bar") {
        canvas.width = Math.min(width, 500) * dpr;
        canvas.height = 280 * dpr;
        canvas.style.width = Math.min(width, 500) + "px";
        canvas.style.height = "280px";
        drawProbabilityBarChart(canvas, chartData.predictions, dpr);
      } else if (chartData.type === "gauge") {
        canvas.width = 160 * dpr;
        canvas.height = 100 * dpr;
        canvas.style.width = "160px";
        canvas.style.height = "100px";
        drawGaugeChart(canvas, chartData.percentage, chartData.color, dpr);
      } else if (chartData.type === "cutoff-trend") {
        canvas.width = Math.min(width, 600) * dpr;
        canvas.height = 320 * dpr;
        canvas.style.width = Math.min(width, 600) + "px";
        canvas.style.height = "320px";
        drawCutoffTrendChart(canvas, chartData.branches, chartData.years, chartData.data, dpr);
      }
    });
  }

  // --- Probability Bar Chart ---
  function drawProbabilityBarChart(canvas, predictions, dpr) {
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const barHeight = 22;
    const gap = 8;
    const labelWidth = 110;
    const rightPad = 60;
    const topPad = 10;
    const barAreaWidth = w - labelWidth - rightPad;

    predictions.forEach((p, i) => {
      const y = topPad + i * (barHeight + gap);

      // Label
      ctx.fillStyle = "#a0a0c0";
      ctx.font = "500 12px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(p.branch, labelWidth - 10, y + barHeight / 2);

      // Background bar
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      roundRect(ctx, labelWidth, y, barAreaWidth, barHeight, 4);
      ctx.fill();

      // Filled bar
      const pct = p.percentage / 100;
      const fillWidth = barAreaWidth * pct;
      const color = getChanceColor(p.chance);

      const gradient = ctx.createLinearGradient(labelWidth, 0, labelWidth + fillWidth, 0);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, adjustAlpha(color, 0.7));
      ctx.fillStyle = gradient;
      roundRect(ctx, labelWidth, y, Math.max(fillWidth, 4), barHeight, 4);
      ctx.fill();

      // Percentage text
      ctx.fillStyle = "#f0f0f8";
      ctx.font = "600 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${p.percentage}%`, labelWidth + barAreaWidth + 8, y + barHeight / 2);
    });
  }

  // --- Gauge Chart ---
  function drawGaugeChart(canvas, percentage, color, dpr) {
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const cx = w / 2;
    const cy = h - 8;
    const radius = 65;
    const lineWidth = 12;

    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 0, false);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Filled arc
    const angle = Math.PI + (percentage / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, angle, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // Glow effect
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, angle, false);
    ctx.strokeStyle = adjustAlpha(color, 0.3);
    ctx.lineWidth = lineWidth + 8;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // --- Cutoff Trend Line Chart ---
  function drawCutoffTrendChart(canvas, branches, years, data, dpr) {
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const padLeft = 80;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 40;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Find min/max rank across all branches
    let allValues = [];
    branches.forEach(b => { allValues = allValues.concat(data[b]); });
    const minVal = Math.min(...allValues) * 0.85;
    const maxVal = Math.max(...allValues) * 1.05;

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padTop + (i / gridLines) * chartH;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      // Y-axis labels (ranks)
      const val = maxVal - (i / gridLines) * (maxVal - minVal);
      ctx.fillStyle = "#6c6c90";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      if (val >= 100000) {
        ctx.fillText((val / 100000).toFixed(1) + "L", padLeft - 10, y);
      } else {
        ctx.fillText(Math.round(val / 1000) + "K", padLeft - 10, y);
      }
    }

    // X-axis labels (years)
    years.forEach((year, i) => {
      const x = padLeft + (i / (years.length - 1)) * chartW;
      ctx.fillStyle = "#a0a0c0";
      ctx.font = "500 12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(year.toString(), x, h - padBottom + 12);
    });

    // Draw lines for each branch
    branches.forEach((branch, bi) => {
      const color = CHART_COLORS.branches[bi % CHART_COLORS.branches.length];
      const values = data[branch];
      if (!values) return;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";

      values.forEach((val, i) => {
        const x = padLeft + (i / (years.length - 1)) * chartW;
        const y = padTop + ((maxVal - val) / (maxVal - minVal)) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw dots
      values.forEach((val, i) => {
        const x = padLeft + (i / (years.length - 1)) * chartW;
        const y = padTop + ((maxVal - val) / (maxVal - minVal)) * chartH;

        // Glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = adjustAlpha(color, 0.2);
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });
    });
  }

  // --- Chart Helpers ---
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function getChanceColor(chance) {
    switch (chance) {
      case "Very High": return CHART_COLORS.green;
      case "High": return CHART_COLORS.cyan;
      case "Moderate": return CHART_COLORS.orange;
      default: return CHART_COLORS.red;
    }
  }

  function adjustAlpha(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getChancePercentage(ratio) {
    if (ratio <= 0.4) return 98;
    if (ratio <= 0.6) return 90;
    if (ratio <= 0.75) return 80;
    if (ratio <= 0.85) return 72;
    if (ratio <= 0.95) return 55;
    if (ratio <= 1.05) return 45;
    if (ratio <= 1.15) return 30;
    if (ratio <= 1.3) return 18;
    return 8;
  }


  // ===========================
  //  Form Wizard (Admission Helper)
  // ===========================

  function startFormWizard() {
    formWizardActive = true;
    formWizardStep = 1;
    
    const progressHtml = buildProgress(1, 4);
    addMessage("bot", `
      ${progressHtml}
      <p>🎯 <strong>Admission Prediction Wizard</strong></p>
      <p>Let's check your admission chances step by step!</p>
      <p><strong>Step 1/4:</strong> What is your <strong>JEE Main Rank (CRL)?</strong></p>
      <p style="font-size:0.78rem; color:var(--text-tertiary)">Type your rank number below (e.g., 280000)</p>
    `);
  }

  function buildProgress(current, total) {
    let html = '<div class="form-progress">';
    for (let i = 1; i <= total; i++) {
      if (i < current) html += '<div class="form-progress-step done"></div>';
      else if (i === current) html += '<div class="form-progress-step active"></div>';
      else html += '<div class="form-progress-step"></div>';
    }
    html += '</div>';
    return html;
  }

  function processFormWizardInput(text) {
    const q = text.toLowerCase().trim();

    if (formWizardStep === 1) {
      // Parse rank
      const num = text.replace(/,/g, "").match(/\d+/);
      if (!num || parseInt(num[0]) < 1000) {
        addMessage("bot", `<p>⚠️ Please enter a valid JEE Main rank (e.g., 150000 or 280000).</p>`);
        return;
      }
      formWizardData.rank = parseInt(num[0]);
      formWizardStep = 2;

      const progressHtml = buildProgress(2, 4);
      addMessage("bot", `
        ${progressHtml}
        <p>✅ Rank: <strong>${formWizardData.rank.toLocaleString()}</strong></p>
        <p><strong>Step 2/4:</strong> What is your <strong>Category?</strong></p>
        <div class="form-chip-group">
          <button class="form-chip" data-value="GEN"><span class="form-chip-emoji">👤</span> General</button>
          <button class="form-chip" data-value="EWS"><span class="form-chip-emoji">📋</span> EWS</button>
          <button class="form-chip" data-value="OBC"><span class="form-chip-emoji">📋</span> OBC</button>
          <button class="form-chip" data-value="SC"><span class="form-chip-emoji">📋</span> SC</button>
          <button class="form-chip" data-value="ST"><span class="form-chip-emoji">📋</span> ST</button>
        </div>
      `);
      return;
    }

    if (formWizardStep === 2) {
      // Parse category
      let cat = "GEN";
      if (/ews/i.test(q)) cat = "EWS";
      else if (/obc/i.test(q)) cat = "OBC";
      else if (/\bsc\b/i.test(q)) cat = "SC";
      else if (/\bst\b/i.test(q)) cat = "ST";
      else if (/gen/i.test(q)) cat = "GEN";

      formWizardData.category = cat;
      formWizardStep = 3;

      const progressHtml = buildProgress(3, 4);
      addMessage("bot", `
        ${progressHtml}
        <p>✅ Category: <strong>${cat}</strong></p>
        <p><strong>Step 3/4:</strong> What is your <strong>Home State?</strong></p>
        <div class="form-chip-group">
          <button class="form-chip" data-value="MP"><span class="form-chip-emoji">🏠</span> Madhya Pradesh</button>
          <button class="form-chip" data-value="Other"><span class="form-chip-emoji">🌍</span> Other State</button>
        </div>
      `);
      return;
    }

    if (formWizardStep === 3) {
      // Parse state
      formWizardData.state = /mp|madhya\s*pradesh/i.test(q) ? "MP" : text.trim();
      formWizardStep = 4;

      const progressHtml = buildProgress(4, 4);
      addMessage("bot", `
        ${progressHtml}
        <p>✅ Home State: <strong>${formWizardData.state}</strong></p>
        <p><strong>Step 4/4:</strong> What is your <strong>Preferred Branch?</strong></p>
        <div class="form-chip-group">
          <button class="form-chip" data-value="CSE"><span class="form-chip-emoji">💻</span> CSE</button>
          <button class="form-chip" data-value="AI & ML"><span class="form-chip-emoji">🤖</span> AI & ML</button>
          <button class="form-chip" data-value="Data Science"><span class="form-chip-emoji">📊</span> Data Science</button>
          <button class="form-chip" data-value="IT"><span class="form-chip-emoji">🌐</span> IT</button>
          <button class="form-chip" data-value="Cyber Security"><span class="form-chip-emoji">🔒</span> Cyber Security</button>
          <button class="form-chip" data-value="ECE"><span class="form-chip-emoji">📡</span> ECE</button>
          <button class="form-chip" data-value="Mechanical"><span class="form-chip-emoji">⚙️</span> Mechanical</button>
          <button class="form-chip" data-value="Civil"><span class="form-chip-emoji">🏗️</span> Civil</button>
        </div>
      `);
      return;
    }

    if (formWizardStep === 4) {
      // Parse branch
      const branchMap = {
        "cse": "CSE", "computer": "CSE", "cs": "CSE",
        "ai": "AI & ML", "ml": "AI & ML", "aiml": "AI & ML", "artificial": "AI & ML",
        "data": "Data Science", "ds": "Data Science",
        "cyber": "Cyber Security", "security": "Cyber Security",
        "it": "IT", "information": "IT",
        "ece": "ECE", "electronics": "ECE", "ec": "ECE",
        "mech": "Mechanical", "mechanical": "Mechanical",
        "civil": "Civil",
        "csit": "CSIT", "cs-it": "CSIT", "cs it": "CSIT",
        "vlsi": "VLSI",
        "bca": "BCA",
        "imca": "IMCA", "mca": "IMCA"
      };

      let branch = null;
      for (const [key, val] of Object.entries(branchMap)) {
        if (q.includes(key)) { branch = val; break; }
      }
      if (!branch) branch = text.trim();

      // Check if it's a known branch
      if (!KNOWLEDGE_BASE.cutoffs[branch]) {
        // Try to find closest
        for (const b of Object.keys(KNOWLEDGE_BASE.cutoffs)) {
          if (b.toLowerCase().includes(q) || q.includes(b.toLowerCase())) {
            branch = b;
            break;
          }
        }
      }

      formWizardData.branch = branch;
      formWizardActive = false;
      formWizardStep = 0;

      // Generate full prediction
      showTyping();
      setTimeout(() => {
        hideTyping();
        const query = `My rank is ${formWizardData.rank}, ${formWizardData.category} category, from ${formWizardData.state}. What are my chances for ${formWizardData.branch}?`;
        let response = handleAdmissionPrediction(query.toLowerCase(), formWizardData.rank, formWizardData.category, formWizardData.branch);
        
        // Add PDF download button to the response
        response += `
          <div style="margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 12px;">
            <button class="quick-btn" onclick="downloadPDFReport(this)" style="background:var(--primary-color); color:#fff; border:none; margin:0 auto; display:flex;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF Report
            </button>
          </div>
        `;
        
        const msgEl = addMessage("bot", response);
        setTimeout(() => renderPendingCharts(msgEl), 100);
      }, 800);
      return;
    }
  }

  function handleChipClick(chip) {
    const value = chip.dataset.value;
    if (!value) return;

    // Visual feedback
    chip.classList.add("selected");

    // Disable all chips in the group
    const group = chip.closest(".form-chip-group");
    if (group) {
      group.querySelectorAll(".form-chip").forEach(c => {
        c.style.pointerEvents = "none";
        if (c !== chip) c.style.opacity = "0.4";
      });
    }

    // Process as input
    userInput.value = value;
    sendBtn.disabled = false;
    setTimeout(() => handleSend(), 200);
  }


  // ===========================
  //  Response Generation Engine
  // ===========================

  function generateResponse(query) {
    const q = query.toLowerCase();

    // --- Form Wizard Trigger ---
    if (q.includes("form helper") || q.includes("step by step") || q.includes("wizard") || q.includes("guide me")) {
      startFormWizard();
      return null; // wizard handles its own messages
    }

    // --- Admission Prediction ---
    const rankMatch = q.match(/(?:rank|ranked?)\s*(?:is|:)?\s*(\d[\d,]*)/i) ||
                      q.match(/(\d[\d,]*)\s*(?:rank)/i) ||
                      q.match(/(?:my rank|jee rank|crl rank|jee main rank)\s*(?:is|:)?\s*(\d[\d,]*)/i);

    if (rankMatch || (q.match(/\d{4,}/) && (q.includes("chance") || q.includes("get") || q.includes("admission") || q.includes("branch") || q.includes("cse") || q.includes("predict")))) {
      return handleAdmissionPrediction(q);
    }

    // --- Cutoff Graph/Trends ---
    if ((q.includes("graph") || q.includes("trend") || q.includes("chart")) && (q.includes("cutoff") || q.includes("cut off") || q.includes("rank"))) {
      return handleCutoffGraph(q);
    }

    // --- Search specific year cutoff ---
    const yearMatch = q.match(/\b(2022|2023|2024|2025)\b/);
    if (yearMatch && (q.includes("cutoff") || q.includes("cut off") || q.includes("closing"))) {
      return handleCutoffSearch(q, parseInt(yearMatch[1]));
    }

    // --- Round Wise Cutoff ---
    const roundMatch = q.match(/\bround\s*(1|2|wise)\b/i);
    if (roundMatch && (q.includes("cutoff") || q.includes("cut off") || q.includes("closing") || q.includes("rank") || q.includes("counsel"))) {
      return handleRoundWiseCutoffs(q, roundMatch[1]);
    }

    // --- Cutoff Ranks ---
    if (q.includes("cutoff") || q.includes("cut off") || q.includes("closing rank") || q.includes("cutoffs")) {
      return handleCutoffs(q);
    }

    // --- Branch Comparison ---
    if (q.includes("compare") || q.includes("vs") || q.includes("versus") || q.includes("difference between") || q.includes("which is better")) {
      return handleBranchComparison(q);
    }

    // --- Branch Details / Recommendation ---
    if (q.includes("career") || q.includes("scope") || q.includes("future") || q.includes("about cse") || q.includes("about it") || q.includes("about ai") || q.includes("about ece") || q.includes("about mech") || q.includes("about civil") || q.match(/tell me about (cse|cs|it|ai|ml|data|cyber|ece|mech|civil)/i)) {
      return handleBranchDetails(q);
    }

    // --- Interest-based recommendation ---
    if (q.includes("interested in") || q.includes("i like") || q.includes("i love") || q.includes("passion") || q.includes("recommend branch") || q.includes("suggest branch")) {
      return handleInterestRecommendation(q);
    }

    // --- Fees ---
    if (q.includes("fee") || q.includes("cost") || q.includes("tuition") || q.includes("expense")) {
      return handleFees();
    }

    // --- Placements ---
    if (q.includes("placement") || q.includes("package") || q.includes("salary") || q.includes("recruiter") || q.includes("company") || q.includes("skill")) {
      return handlePlacements();
    }

    // --- Hostel ---
    if (q.includes("hostel") || q.includes("accommodation") || q.includes("mess") || q.includes("room")) {
      return handleHostel();
    }

    // --- Documents ---
    if (q.includes("document") || q.includes("paperwork") || (q.includes("required") && q.includes("admission"))) {
      return handleDocuments();
    }

    // --- Counseling ---
    if (q.includes("counseling") || q.includes("counselling") || q.includes("dte") || q.includes("mp dte") || q.includes("admission process")) {
      return handleCounseling();
    }

    // --- Scholarship ---
    if (q.includes("scholarship") || q.includes("fee waiver") || q.includes("concession") || q.includes("financial aid")) {
      return handleScholarships();
    }

    // --- Percentile / Rank conversion ---
    if (q.includes("percentile") || (q.includes("convert") && q.includes("rank"))) {
      return handlePercentile(q);
    }

    // --- FAQ: Attendance ---
    if (q.includes("attendance")) {
      return handleFAQ("attendance");
    }

    // --- FAQ: Coding Language ---
    if (q.includes("coding language") || q.includes("programming language") || q.includes("which language") || q.includes("learn coding") || q.includes("start coding")) {
      return handleFAQ("codingLanguage");
    }

    // --- FAQ: Internship ---
    if (q.includes("internship") || q.includes("intern")) {
      return handleFAQ("internship");
    }

    // --- FAQ: Transport ---
    if (q.includes("transport") || q.includes("bus") || q.includes("travel")) {
      return handleFAQ("transport");
    }

    // --- FAQ: Best Branch ---
    if (q.includes("best branch") || q.includes("which branch is best") || q.includes("top branch")) {
      return handleFAQ("bestBranch");
    }

    // --- Which branch can I get ---
    if (q.includes("which branch") || q.includes("what branch") || q.includes("can i get")) {
      return handleAdmissionPrediction(q);
    }

    // --- College info ---
    if (q.includes("about") && (q.includes("acropolis") || q.includes("college") || q.includes("aitr"))) {
      return handleCollegeInfo();
    }

    // --- Greetings ---
    if (/^(hi|hello|hey|howdy|namaste|good morning|good evening)/i.test(q)) {
      return handleGreeting();
    }

    // --- Thank you ---
    if (/thank|thanks|dhanyawad|shukriya/i.test(q)) {
      return `<p>You're welcome! 😊 I'm always here to help with your admission queries.</p>
              <p>Feel free to ask anything else about <strong>Acropolis Institute</strong> — cutoffs, fees, placements, or counseling process!</p>`;
    }

    // --- Default / Fallback ---
    return handleDefault();
  }


  // ===========================
  //  Handler Functions
  // ===========================

  function handleGreeting() {
    return `<p>Hi there! I'm <strong>AcroBot AI</strong> 🤖 — your AI admission counselor for <strong>Acropolis Institute of Technology and Research, Indore</strong>.</p>
            <p>I can help you with:</p>
            <ul>
              <li>🎯 <strong>Admission Prediction</strong> with visual charts</li>
              <li>📈 <strong>Cutoff Trend Graphs</strong> (2022-2025)</li>
              <li>📝 <strong>Step-by-step Admission Form Helper</strong></li>
              <li>🔍 <strong>Branch Comparison & Career Guidance</strong></li>
              <li>💰 Fees, Placements, Scholarships & more</li>
            </ul>
            <p>To get started quickly, try the <strong>Admission Form Helper</strong>:</p>
            <div class="form-chip-group">
              <button class="form-chip" data-value="__START_WIZARD__"><span class="form-chip-emoji">🎯</span> Start Prediction Wizard</button>
            </div>
            <p style="margin-top:8px">Or just type your question!</p>`;
  }

  function handleAdmissionPrediction(q, overrideRank, overrideCategory, overrideBranch) {
    // Extract rank
    let rank = overrideRank || null;
    if (!rank) {
      const numbers = q.match(/\d[\d,]*/g);
      if (numbers) {
        for (const n of numbers) {
          const val = parseInt(n.replace(/,/g, ""));
          if (val > 1000 && val < 2000000) {
            rank = val;
            break;
          }
        }
      }
    }

    if (!rank) {
      return `<p>I'd love to predict your chances! Please share your <strong>JEE Main Rank (CRL)</strong> along with:</p>
              <ul>
                <li>📋 Category (GEN / EWS / OBC / SC / ST)</li>
                <li>🏠 Home State</li>
                <li>🎯 Preferred Branch</li>
              </ul>
              <p>Or try our <strong>step-by-step wizard</strong>:</p>
              <div class="form-chip-group">
                <button class="form-chip" data-value="__START_WIZARD__"><span class="form-chip-emoji">📝</span> Start Admission Helper</button>
              </div>`;
    }

    // Extract category
    let category = overrideCategory || "GEN";
    if (!overrideCategory) {
      if (/\bews\b/i.test(q)) category = "EWS";
      else if (/\bobc\b/i.test(q)) category = "OBC";
      else if (/\bsc\b/i.test(q) && !/data sc/i.test(q)) category = "SC";
      else if (/\bst\b/i.test(q)) category = "ST";
    }

    // Extract preferred branch
    let preferredBranch = overrideBranch || null;
    if (!preferredBranch) {
          const branchKeywords = {
      "CSE": /\bcse\b|\bcs\b|\bcomputer science\b|\bcomputer\b/i,
      "AI & ML": /\bai\b|\bml\b|\baiml\b|\bai\s*&\s*ml\b|\bartificial\b/i,
      "Data Science": /\bdata science\b|\bdata\b|\bds\b/i,
      "Cyber Security": /\bcyber\b|\bsecurity\b/i,
      "IT": /\bit\b|\binformation tech/i,
      "ECE": /\bece\b|\bec\b|\belectronics\b/i,
      "Mechanical": /\bmech/i,
      "Civil": /\bcivil\b/i,
      "CSIT": /\bcsit\b|\bcs-it\b|\bcs\s*it\b/i,
      "VLSI": /\bvlsi\b/i,
      "BCA": /\bbca\b|\bbachelor of computer/i,
      "IMCA": /\bimca\b|\bintegrated mca\b|\bmca\b/i
    };
      for (const [branch, regex] of Object.entries(branchKeywords)) {
        if (regex.test(q)) { preferredBranch = branch; break; }
      }
    }

    if (preferredBranch === "BCA" || preferredBranch === "IMCA") {
      return `<p>🎓 <strong>${preferredBranch} Admissions</strong></p>
              <p>Admissions to <strong>${preferredBranch}</strong> at Acropolis are <strong>not based on JEE Main ranks</strong>. They are typically based on 12th-grade merit or specialized entrance exams.</p>
              <p>Please contact the admission cell or visit the official portal for direct counseling regarding ${preferredBranch}!</p>`;
    }

    const relaxation = KNOWLEDGE_BASE.categoryRelaxation[category] || 1.0;

    // Build prediction for all branches
    const predictions = [];
    for (const [branch, data] of Object.entries(KNOWLEDGE_BASE.cutoffs)) {
      const effectiveCutoff = Math.round(data.closing * relaxation);
      const ratio = rank / effectiveCutoff;
      let chance, chanceClass;

      if (ratio <= 0.6) { chance = "Very High"; chanceClass = "chance-very-high"; }
      else if (ratio <= 0.85) { chance = "High"; chanceClass = "chance-high"; }
      else if (ratio <= 1.1) { chance = "Moderate"; chanceClass = "chance-moderate"; }
      else { chance = "Low"; chanceClass = "chance-low"; }

      const percentage = getChancePercentage(ratio);

      predictions.push({
        branch, label: data.label, closing: data.closing,
        effectiveCutoff, chance, chanceClass, percentage, ratio
      });
    }

    // Sort: prioritize preferred branch, then by chance level
    const chanceOrder = { "Very High": 0, "High": 1, "Moderate": 2, "Low": 3 };
    predictions.sort((a, b) => {
      if (preferredBranch && a.branch === preferredBranch) return -1;
      if (preferredBranch && b.branch === preferredBranch) return 1;
      return chanceOrder[a.chance] - chanceOrder[b.chance];
    });

    // Percentile estimate
    let percentileEst = estimatePercentile(rank);

    let html = `<p>📊 <strong>Admission Prediction for AITR, Indore</strong></p>`;
    html += `<p>Rank: <strong>${rank.toLocaleString()}</strong> | Category: <strong>${category}</strong>${percentileEst ? ` | Est. Percentile: <strong>~${percentileEst}%</strong>` : ""}</p>`;

    // Gauge chart for preferred branch
    if (preferredBranch && KNOWLEDGE_BASE.cutoffs[preferredBranch]) {
      const pref = predictions.find(p => p.branch === preferredBranch);
      if (pref) {
        const gaugeId = "gauge-" + Date.now();
        const gaugeColor = getChanceColor(pref.chance);

        pendingCharts.push({ type: "gauge", canvasId: gaugeId, percentage: pref.percentage, color: gaugeColor });

        html += `<div class="chart-container">
          <div class="chart-title">Your chances for ${pref.branch}</div>
          <div class="gauge-wrapper">
            <div>
              <div class="gauge-chart"><canvas id="${gaugeId}"></canvas></div>
              <div class="gauge-label">
                <span class="gauge-value" style="color:${gaugeColor}">${pref.percentage}%</span>
                <span class="gauge-text">${pref.chance} Chance</span>
              </div>
            </div>
            <div style="flex:1; min-width:200px;">
              <p>Closing Rank: <strong>~${pref.closing.toLocaleString()}</strong></p>
              ${category !== "GEN" ? `<p>${category} Effective: <strong>~${pref.effectiveCutoff.toLocaleString()}</strong></p>` : ""}
              <p><span class="chance-badge ${pref.chanceClass}">● ${pref.chance} Chance</span></p>
            </div>
          </div>
        </div>`;
      }
    }

    // Probability bar chart
    const barChartId = "bar-" + Date.now();
    const topPredictions = predictions.slice(0, 6);
    pendingCharts.push({ type: "probability-bar", canvasId: barChartId, predictions: topPredictions });

    html += `<div class="chart-container">
      <div class="chart-title">Branch-wise Admission Probability</div>
      <canvas id="${barChartId}"></canvas>
    </div>`;

    // Table
    html += `<table class="branch-table">
      <thead><tr><th>Branch</th><th>Closing Rank</th><th>Your Chance</th></tr></thead><tbody>`;

    for (const p of predictions) {
      html += `<tr>
        <td><strong>${p.branch}</strong></td>
        <td>~${p.closing.toLocaleString()}${category !== "GEN" ? `<br><small style="color:var(--text-muted)">${category}: ~${p.effectiveCutoff.toLocaleString()}</small>` : ""}</td>
        <td><span class="chance-badge ${p.chanceClass}">● ${p.chance} (${p.percentage}%)</span></td>
      </tr>`;
    }

    html += `</tbody></table>`;

    // Recommendations
    const highChanceBranches = predictions.filter(p => p.chance === "Very High" || p.chance === "High");
    if (highChanceBranches.length > 0) {
      html += `<p>💡 <strong>Recommended Branches:</strong> ${highChanceBranches.slice(0, 3).map(b => b.branch).join(", ")}</p>`;
    }

    const lowChanceBranches = predictions.filter(p => p.chance === "Low");
    if (preferredBranch && lowChanceBranches.some(p => p.branch === preferredBranch)) {
      html += `<p>🔄 <strong>Tip:</strong> Since ${preferredBranch} chances are low, consider <strong>${highChanceBranches.length > 0 ? highChanceBranches[0].branch : "other branches"}</strong> as a backup option.</p>`;
    }

    html += `<p style="margin-top:8px; font-size:0.8rem; color:var(--text-tertiary)">⚠️ <em>Admission depends on seat availability, counseling round, category and current year cutoff trends. These are estimates based on previous trends and may vary.</em></p>`;

    return html;
  }


  function handleCutoffGraph(q) {
    // Determine which branches to show
    let branches = Object.keys(KNOWLEDGE_BASE.cutoffHistory.data);

    // Check for specific branches mentioned
        const branchKeywords = {
      "CSE": /\bcse\b|\bcs\b|\bcomputer science\b|\bcomputer\b/i,
      "AI & ML": /\bai\b|\bml\b|\baiml\b|\bai\s*&\s*ml\b|\bartificial\b/i,
      "Data Science": /\bdata science\b|\bdata\b|\bds\b/i,
      "Cyber Security": /\bcyber\b|\bsecurity\b/i,
      "IT": /\bit\b|\binformation tech/i,
      "ECE": /\bece\b|\bec\b|\belectronics\b/i,
      "Mechanical": /\bmech/i,
      "Civil": /\bcivil\b/i,
      "CSIT": /\bcsit\b|\bcs-it\b|\bcs\s*it\b/i,
      "VLSI": /\bvlsi\b/i,
      "BCA": /\bbca\b|\bbachelor of computer/i,
      "IMCA": /\bimca\b|\bintegrated mca\b|\bmca\b/i
    };

    let specificBranches = [];
    for (const [branch, regex] of Object.entries(branchKeywords)) {
      if (regex.test(q)) specificBranches.push(branch);
    }

    if (specificBranches.length > 0) branches = specificBranches;

    // Only show top 6 for readability if showing all
    if (branches.length > 6) {
      branches = ["CSE", "AI & ML", "Data Science", "Cyber Security", "IT", "ECE"];
    }

    const years = KNOWLEDGE_BASE.cutoffHistory.years;
    const data = KNOWLEDGE_BASE.cutoffHistory.data;

    const chartId = "trend-" + Date.now();
    pendingCharts.push({
      type: "cutoff-trend", canvasId: chartId,
      branches, years, data
    });

    let html = `<p>📈 <strong>Cutoff Trend Graph (${years[0]}–${years[years.length - 1]})</strong></p>`;
    html += `<div class="chart-container">
      <div class="chart-title">Year-wise Closing Ranks</div>
      <canvas id="${chartId}"></canvas>
      <div class="chart-legend">`;

    branches.forEach((b, i) => {
      const color = CHART_COLORS.branches[i % CHART_COLORS.branches.length];
      html += `<div class="chart-legend-item"><div class="chart-legend-dot" style="background:${color}"></div>${b}</div>`;
    });

    html += `</div></div>`;

    // Also show data table
    html += `<table class="branch-table"><thead><tr><th>Branch</th>`;
    years.forEach(y => html += `<th>${y}</th>`);
    html += `</tr></thead><tbody>`;

    branches.forEach(b => {
      html += `<tr><td><strong>${b}</strong></td>`;
      data[b].forEach(v => html += `<td>~${v.toLocaleString()}</td>`);
      html += `</tr>`;
    });

    html += `</tbody></table>`;
    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Note: Cutoff ranks generally increase over the years as more students appear for JEE Main. Reserved categories get additional relaxation.</em></p>`;

    return html;
  }


  function handleCutoffSearch(q, year) {
    const years = KNOWLEDGE_BASE.cutoffHistory.years;
    const yearIndex = years.indexOf(year);
    const data = KNOWLEDGE_BASE.cutoffHistory.data;

    if (yearIndex === -1) {
      return `<p>Sorry, I only have cutoff data for years: <strong>${years.join(", ")}</strong>.</p>`;
    }

    // Check for specific branch
        const branchKeywords = {
      "CSE": /\bcse\b|\bcs\b|\bcomputer science\b|\bcomputer\b/i,
      "AI & ML": /\bai\b|\bml\b|\baiml\b|\bai\s*&\s*ml\b|\bartificial\b/i,
      "Data Science": /\bdata science\b|\bdata\b|\bds\b/i,
      "Cyber Security": /\bcyber\b|\bsecurity\b/i,
      "IT": /\bit\b|\binformation tech/i,
      "ECE": /\bece\b|\bec\b|\belectronics\b/i,
      "Mechanical": /\bmech/i,
      "Civil": /\bcivil\b/i,
      "CSIT": /\bcsit\b|\bcs-it\b|\bcs\s*it\b/i,
      "VLSI": /\bvlsi\b/i,
      "BCA": /\bbca\b|\bbachelor of computer/i,
      "IMCA": /\bimca\b|\bintegrated mca\b|\bmca\b/i
    };

    let specificBranch = null;
    for (const [branch, regex] of Object.entries(branchKeywords)) {
      if (regex.test(q)) { specificBranch = branch; break; }
    }

    if (specificBranch && data[specificBranch]) {
      const rank = data[specificBranch][yearIndex];
      return `<p>🔍 <strong>Cutoff for ${specificBranch} in ${year}</strong></p>
              <p>Closing Rank: <strong>~${rank.toLocaleString()}</strong> (General category)</p>
              <p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Based on MP DTE counseling data. Reserved categories have relaxation.</em></p>
              <p>Want to see the <strong>full trend graph</strong>? Just ask!</p>`;
    }

    // Show all branches for that year
    let html = `<p>🔍 <strong>Cutoff Ranks for ${year} — AITR, Indore</strong></p>`;
    html += `<table class="branch-table"><thead><tr><th>Branch</th><th>Closing Rank (${year})</th></tr></thead><tbody>`;

    for (const [branch, values] of Object.entries(data)) {
      html += `<tr><td><strong>${branch}</strong></td><td>~${values[yearIndex].toLocaleString()}</td></tr>`;
    }

    html += `</tbody></table>`;
    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>These are General category closing ranks based on MP DTE counseling trends.</em></p>`;

    return html;
  }

  function handleRoundWiseCutoffs(q, roundKey) {
    const data = KNOWLEDGE_BASE.roundWiseCutoffs;
    if (!data) return handleDefault();

    let targetRound = null;
    if (roundKey.includes("1")) targetRound = "Round 1";
    else if (roundKey.includes("2")) targetRound = "Round 2";

    if (targetRound) {
      let html = `<p>🔍 <strong>Official MP DTE Cutoffs — ${targetRound}</strong></p>`;
      html += `<table class="branch-table"><thead><tr><th>Branch</th><th>Closing Rank</th></tr></thead><tbody>`;
      for (const [branch, rank] of Object.entries(data[targetRound])) {
        html += `<tr><td><strong>${branch}</strong></td><td>~${rank.toLocaleString()}</td></tr>`;
      }
      html += `</tbody></table>`;
      html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Based on official MP DTE general category closing ranks.</em></p>`;
      return html;
    }

    // If just "round wise", show both rounds for comparison
    let html = `<p>🔍 <strong>MP DTE Round-wise Cutoff Comparison</strong></p>`;
    html += `<table class="branch-table"><thead><tr><th>Branch</th><th>Round 1</th><th>Round 2</th></tr></thead><tbody>`;
    for (const branch of Object.keys(data["Round 1"])) {
      html += `<tr><td><strong>${branch}</strong></td><td>~${data["Round 1"][branch].toLocaleString()}</td><td>~${data["Round 2"][branch].toLocaleString()}</td></tr>`;
    }
    html += `</tbody></table>`;
    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Cutoffs generally become more relaxed (higher closing rank) in Round 2 as seats are allocated.</em></p>`;
    return html;
  }


  function handleCutoffs(q) {
        const branchKeywords = {
      "CSE": /\bcse\b|\bcs\b|\bcomputer science\b|\bcomputer\b/i,
      "AI & ML": /\bai\b|\bml\b|\baiml\b|\bai\s*&\s*ml\b|\bartificial\b/i,
      "Data Science": /\bdata science\b|\bdata\b|\bds\b/i,
      "Cyber Security": /\bcyber\b|\bsecurity\b/i,
      "IT": /\bit\b|\binformation tech/i,
      "ECE": /\bece\b|\bec\b|\belectronics\b/i,
      "Mechanical": /\bmech/i,
      "Civil": /\bcivil\b/i,
      "CSIT": /\bcsit\b|\bcs-it\b|\bcs\s*it\b/i,
      "VLSI": /\bvlsi\b/i,
      "BCA": /\bbca\b|\bbachelor of computer/i,
      "IMCA": /\bimca\b|\bintegrated mca\b|\bmca\b/i
    };

    let specific = null;
    for (const [branch, regex] of Object.entries(branchKeywords)) {
      if (regex.test(q)) { specific = branch; break; }
    }

    let html = `<p>📋 <strong>Approximate Closing Ranks — AITR, Indore (2025 Reference)</strong></p>`;
    html += `<table class="branch-table">
      <thead><tr><th>Branch</th><th>Approx. Closing Rank</th></tr></thead><tbody>`;

    for (const [branch, data] of Object.entries(KNOWLEDGE_BASE.cutoffs)) {
      const highlight = (specific && branch === specific) ? ' style="background:rgba(108,63,199,0.1)"' : "";
      html += `<tr${highlight}><td><strong>${branch}</strong></td><td>~${data.closing.toLocaleString()}</td></tr>`;
    }

    html += `</tbody></table>`;
    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Based on recent MP DTE counseling and JEE Main cutoff trends. Reserved category students get relaxation.</em></p>`;
    html += `<p>Want to see the <strong>year-wise cutoff trend graph</strong>? Just ask "show cutoff trends"!</p>`;
    html += `<p>Want me to <strong>predict your chances</strong>? Share your JEE Main rank and category!</p>`;

    return html;
  }


  function handleBranchComparison(q) {
        const branchKeywords = {
      "CSE": /\bcse\b|\bcs\b|\bcomputer science\b|\bcomputer\b/i,
      "AI & ML": /\bai\b|\bml\b|\baiml\b|\bai\s*&\s*ml\b|\bartificial\b/i,
      "Data Science": /\bdata science\b|\bdata\b|\bds\b/i,
      "Cyber Security": /\bcyber\b|\bsecurity\b/i,
      "IT": /\bit\b|\binformation tech/i,
      "ECE": /\bece\b|\bec\b|\belectronics\b/i,
      "Mechanical": /\bmech/i,
      "Civil": /\bcivil\b/i,
      "CSIT": /\bcsit\b|\bcs-it\b|\bcs\s*it\b/i,
      "VLSI": /\bvlsi\b/i,
      "BCA": /\bbca\b|\bbachelor of computer/i,
      "IMCA": /\bimca\b|\bintegrated mca\b|\bmca\b/i
    };

    let mentionedBranches = [];
    for (const [branch, regex] of Object.entries(branchKeywords)) {
      if (regex.test(q)) {
        mentionedBranches.push(branch);
      }
    }

    if (mentionedBranches.length === 2) {
      const b1 = mentionedBranches[0];
      const b2 = mentionedBranches[1];
      
      // Check if we have a hardcoded comparison first (like CSE vs AI&ML)
      let compKey1 = `${b1} vs ${b2}`.replace("AI & ML", "AI&ML");
      let compKey2 = `${b2} vs ${b1}`.replace("AI & ML", "AI&ML");

      let comp = KNOWLEDGE_BASE.branchComparisons[compKey1];
      let activeKey = compKey1;
      if (!comp && KNOWLEDGE_BASE.branchComparisons[compKey2]) {
        comp = KNOWLEDGE_BASE.branchComparisons[compKey2];
        activeKey = compKey2;
      }

      if (comp) {
        let html = `<p>🔍 <strong>${activeKey} — Detailed Comparison</strong></p>`;
        html += `<table class="branch-table"><thead><tr>`;
        comp.headers.forEach(h => html += `<th>${h}</th>`);
        html += `</tr></thead><tbody>`;
        comp.rows.forEach(row => {
          html += `<tr>`;
          row.forEach((cell, i) => html += i === 0 ? `<td><strong>${cell}</strong></td>` : `<td>${cell}</td>`);
          html += `</tr>`;
        });
        html += `</tbody></table>`;
        if (comp.verdict) html += `<p>💡 <strong>Verdict:</strong> ${comp.verdict}</p>`;
        html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Both branches offer great career prospects. Your choice should align with your interests.</em></p>`;
        return html;
      }

      // Generate dynamic comparison if no hardcoded one exists
      const d1 = KNOWLEDGE_BASE.branchDetails[b1];
      const d2 = KNOWLEDGE_BASE.branchDetails[b2];
      const c1 = KNOWLEDGE_BASE.cutoffs[b1] ? KNOWLEDGE_BASE.cutoffs[b1].closing : "N/A";
      const c2 = KNOWLEDGE_BASE.cutoffs[b2] ? KNOWLEDGE_BASE.cutoffs[b2].closing : "N/A";

      let html = `<p>🔍 <strong>${b1} vs ${b2} — Dynamic Comparison</strong></p>`;
      html += `<table class="branch-table"><thead><tr><th>Aspect</th><th>${b1}</th><th>${b2}</th></tr></thead><tbody>`;
      html += `<tr><td><strong>Focus</strong></td><td>${d1.description.split(".")[0]}</td><td>${d2.description.split(".")[0]}</td></tr>`;
      html += `<tr><td><strong>Coding Intensity</strong></td><td>${d1.codingIntensity}</td><td>${d2.codingIntensity}</td></tr>`;
      html += `<tr><td><strong>Avg Package</strong></td><td>${d1.avgPackage}</td><td>${d2.avgPackage}</td></tr>`;
      html += `<tr><td><strong>Demand Level</strong></td><td>${d1.demandLevel}</td><td>${d2.demandLevel}</td></tr>`;
      html += `<tr><td><strong>Closing Rank</strong></td><td>~${c1.toLocaleString()}</td><td>~${c2.toLocaleString()}</td></tr>`;
      html += `</tbody></table>`;
      html += `<p>💡 <strong>Key Skills:</strong></p>`;
      html += `<ul><li style="margin-bottom:4px"><strong>${b1}:</strong> ${d1.skills.slice(0, 4).join(", ")}</li>`;
      html += `<li><strong>${b2}:</strong> ${d2.skills.slice(0, 4).join(", ")}</li></ul>`;
      html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Both branches offer great career prospects. Your choice should align with your interests.</em></p>`;
      
      return html;
    }

    // Generic comparison fallback
    return `<p>🔍 <strong>Branch Comparison</strong></p>
            <p>I can compare any two branches for you! (e.g. <em>"compare ECE and Mechanical"</em> or <em>"IT vs Civil"</em>)</p>
            <p>Here are some popular comparisons:</p>
            <div class="form-chip-group">
              <button class="form-chip" data-value="Compare CSE vs AI&ML">CSE vs AI&ML</button>
              <button class="form-chip" data-value="Compare CSE vs IT">CSE vs IT</button>
              <button class="form-chip" data-value="Compare ECE vs Mechanical">ECE vs Mechanical</button>
              <button class="form-chip" data-value="Compare Civil vs Mechanical">Civil vs Mech</button>
            </div>
            <p style="margin-top:8px">Click one or type your own comparison!</p>`;
  }


  function handleBranchDetails(q) {
    let targetBranch = null;
        const branchKeywords = {
      "CSE": /\bcse\b|\bcs\b|\bcomputer science\b|\bcomputer\b/i,
      "AI & ML": /\bai\b|\bml\b|\baiml\b|\bai\s*&\s*ml\b|\bartificial\b/i,
      "Data Science": /\bdata science\b|\bdata\b|\bds\b/i,
      "Cyber Security": /\bcyber\b|\bsecurity\b/i,
      "IT": /\bit\b|\binformation tech/i,
      "ECE": /\bece\b|\bec\b|\belectronics\b/i,
      "Mechanical": /\bmech/i,
      "Civil": /\bcivil\b/i,
      "CSIT": /\bcsit\b|\bcs-it\b|\bcs\s*it\b/i,
      "VLSI": /\bvlsi\b/i,
      "BCA": /\bbca\b|\bbachelor of computer/i,
      "IMCA": /\bimca\b|\bintegrated mca\b|\bmca\b/i
    };

    for (const [branch, regex] of Object.entries(branchKeywords)) {
      if (regex.test(q)) { targetBranch = branch; break; }
    }

    if (!targetBranch) {
      return `<p>Which branch would you like to know about?</p>
              <div class="form-chip-group">
                <button class="form-chip" data-value="Tell me about CSE career scope">💻 CSE</button>
                <button class="form-chip" data-value="Tell me about AI & ML career scope">🤖 AI & ML</button>
                <button class="form-chip" data-value="Tell me about Data Science career scope">📊 Data Science</button>
                <button class="form-chip" data-value="Tell me about IT career scope">🌐 IT</button>
                <button class="form-chip" data-value="Tell me about Cyber Security career scope">🔒 Cyber Security</button>
                <button class="form-chip" data-value="Tell me about ECE career scope">📡 ECE</button>
              </div>`;
    }

    const details = KNOWLEDGE_BASE.branchDetails[targetBranch];
    if (!details) return handleDefault();

    return `<p>🎓 <strong>${details.fullName} (${targetBranch})</strong></p>
            <p>${details.description}</p>
            <table class="branch-table">
              <tbody>
                <tr><td><strong>🚀 Future Scope</strong></td><td>${details.futureScope}</td></tr>
                <tr><td><strong>💰 Avg Package</strong></td><td>${details.avgPackage}</td></tr>
                <tr><td><strong>💻 Coding Intensity</strong></td><td>${details.codingIntensity}</td></tr>
                <tr><td><strong>📈 Demand Level</strong></td><td>${details.demandLevel}</td></tr>
              </tbody>
            </table>
            <p>🛤️ <strong>Career Paths:</strong></p>
            <p>${details.careerPaths.map(c => `<span class="chance-badge chance-high">${c}</span>`).join(" ")}</p>
            <p>🔧 <strong>Key Skills:</strong></p>
            <p>${details.skills.map(s => `<span class="chance-badge chance-moderate">${s}</span>`).join(" ")}</p>
            <p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Closing rank for ${targetBranch}: ~${KNOWLEDGE_BASE.cutoffs[targetBranch] ? KNOWLEDGE_BASE.cutoffs[targetBranch].closing.toLocaleString() : "N/A"}</em></p>`;
  }


  function handleInterestRecommendation(q) {
    const mapping = KNOWLEDGE_BASE.interestMapping;
    let matchedBranches = new Set();
    let matchedInterests = [];

    for (const [interest, branches] of Object.entries(mapping)) {
      if (q.includes(interest)) {
        matchedInterests.push(interest);
        branches.forEach(b => matchedBranches.add(b));
      }
    }

    if (matchedBranches.size === 0) {
      return `<p>Tell me what interests you! For example:</p>
              <div class="form-chip-group">
                <button class="form-chip" data-value="I'm interested in coding and software development">💻 Coding</button>
                <button class="form-chip" data-value="I'm interested in AI and machine learning">🤖 AI / ML</button>
                <button class="form-chip" data-value="I'm interested in hacking and security">🔒 Security</button>
                <button class="form-chip" data-value="I'm interested in data and analytics">📊 Data</button>
                <button class="form-chip" data-value="I'm interested in electronics and IoT">📡 Electronics</button>
                <button class="form-chip" data-value="I'm interested in robotics">🤖 Robotics</button>
              </div>`;
    }

    const branchList = [...matchedBranches];
    let html = `<p>🎯 <strong>Branch Recommendations Based on Your Interests</strong></p>`;
    html += `<p>You mentioned: <strong>${matchedInterests.join(", ")}</strong></p>`;
    html += `<p>Here are the best branches for you:</p>`;

    branchList.forEach((branch, i) => {
      const details = KNOWLEDGE_BASE.branchDetails[branch];
      if (details) {
        const emoji = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";
        html += `<p>${emoji} <strong>${branch}</strong> — ${details.description.split(".")[0]}.</p>`;
      }
    });

    html += `<p>Want me to <strong>compare</strong> any of these branches in detail?</p>`;

    return html;
  }


  function handleFees() {
    const f = KNOWLEDGE_BASE.fees;
    return `<p>💰 <strong>Fee Structure — AITR, Indore (Approximate)</strong></p>
            <table class="branch-table">
              <thead><tr><th>Component</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td><strong>Tuition Fee</strong></td><td>${f.tuition}</td></tr>
                <tr><td><strong>Other Fees</strong></td><td>${f.other}</td></tr>
                <tr><td><strong>Total Per Year</strong></td><td><strong>${f.total_approx}</strong></td></tr>
                <tr><td><strong>Total 4-Year B.Tech</strong></td><td><strong>${f.total_4year}</strong></td></tr>
              </tbody>
            </table>
            <p style="font-size:0.82rem; color:var(--text-tertiary)"><em>${f.note}</em></p>
            <p>Need info about <strong>scholarships</strong> or <strong>fee concessions</strong>? Just ask!</p>`;
  }


  function handlePlacements() {
    const p = KNOWLEDGE_BASE.placements;
    let html = `<p>💼 <strong>Placement Statistics — AITR, Indore</strong></p>
            <table class="branch-table">
              <thead><tr><th>Metric</th><th>Details</th></tr></thead>
              <tbody>
                <tr><td><strong>🏆 Highest Package</strong></td><td>${p.highest_package}</td></tr>
                <tr><td><strong>📊 Average Package</strong></td><td>${p.average_package}</td></tr>
                <tr><td><strong>📈 Median Package</strong></td><td>${p.median_package}</td></tr>
                <tr><td><strong>✅ Placement Rate</strong></td><td>${p.placement_rate}</td></tr>
              </tbody>
            </table>
            <p>🏢 <strong>Top Recruiters:</strong></p>
            <p>${p.top_recruiters.map(r => `<span class="chance-badge chance-high">${r}</span>`).join(" ")}</p>`;

    html += `<p>🔧 <strong>Skills Needed for Good Placements:</strong></p>
             <p>${p.skills_needed.map(s => `<span class="chance-badge chance-moderate">${s}</span>`).join(" ")}</p>`;

    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>${p.note} Numbers may vary each year.</em></p>`;

    return html;
  }


  function handleHostel() {
    return `<p>🏠 <strong>Hostel Facility</strong></p>
            <p>Acropolis Institute of Technology and Research <strong>does not have an on-campus hostel facility</strong>.</p>
            <p>However, there are many <strong>PG accommodations and private hostels</strong> available near the campus at affordable rates (₹4,000–₹8,000/month). You can find options near Mangliya Square area.</p>
            <p><strong>Tips:</strong></p>
            <ul>
              <li>📍 Look for PGs near Bypass Road, Mangliya</li>
              <li>💡 Visit before booking — check amenities</li>
              <li>🤝 Many students share apartments to reduce cost</li>
            </ul>
            <p>Need info about anything else — cutoffs, fees, placements, or counseling?</p>`;
  }


  function handleDocuments() {
    const docs = KNOWLEDGE_BASE.documents;
    let html = `<p>📄 <strong>Documents Required for Admission at AITR</strong></p><ul>`;
    for (const doc of docs) {
      html += `<li>✅ ${doc}</li>`;
    }
    html += `</ul>`;
    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Carry both original and photocopies (2 sets) of all documents. Self-attested copies are recommended.</em></p>`;
    return html;
  }


  function handleCounseling() {
    const c = KNOWLEDGE_BASE.counseling;
    let html = `<p>🎓 <strong>MP DTE Counseling Process — Step by Step</strong></p><ol>`;
    for (const step of c.steps) {
      html += `<li>${step}</li>`;
    }
    html += `</ol>`;
    html += `<p>📅 <strong>Number of Rounds:</strong> ${c.rounds}</p>`;
    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>${c.note}</em></p>`;
    html += `<p>Need help with <strong>choice filling strategy</strong>? Tell me your rank and preferences!</p>`;
    return html;
  }


  function handleScholarships() {
    const schols = KNOWLEDGE_BASE.scholarships;
    let html = `<p>🌟 <strong>Scholarship Options for AITR Students</strong></p>`;
    html += `<table class="branch-table"><thead><tr><th>Scholarship</th><th>Details</th><th>Eligibility</th></tr></thead><tbody>`;

    for (const s of schols) {
      html += `<tr><td><strong>${s.name}</strong></td><td>${s.details}</td><td style="font-size:0.78rem">${s.eligibility || "Check official portal"}</td></tr>`;
    }

    html += `</tbody></table>`;
    html += `<p style="font-size:0.82rem; color:var(--text-tertiary)"><em>Apply early! Most scholarships have deadlines. Check the MP Scholarship Portal and AICTE website for latest updates.</em></p>`;
    return html;
  }


  function handleFAQ(topic) {
    const faqData = KNOWLEDGE_BASE.faqs[topic];
    if (!faqData) return handleDefault();

    // Format newlines and bold
    const formatted = faqData
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\\n/g, '<br>')
      .replace(/•/g, '<br>•');

    const icons = {
      attendance: "📋",
      codingLanguage: "💻",
      internship: "🎯",
      transport: "🚌",
      bestBranch: "🏆"
    };

    const titles = {
      attendance: "Attendance Policy",
      codingLanguage: "Which Coding Language to Learn?",
      internship: "Internship Guide",
      transport: "Transport Facility",
      bestBranch: "Best Branch to Choose"
    };

    return `<p>${icons[topic] || "❓"} <strong>${titles[topic] || "FAQ"}</strong></p>
            <p>${formatted}</p>`;
  }


  function handlePercentile(q) {
    const nums = q.match(/\d[\d.]*/g);
    if (!nums) {
      return `<p>I can help convert between <strong>percentile and rank</strong>!</p>
              <p>Please provide either your <strong>JEE Main percentile</strong> or <strong>rank</strong>. For example:</p>
              <ul><li><em>"What rank does 85 percentile correspond to?"</em></li>
              <li><em>"What percentile is rank 200000?"</em></li></ul>`;
    }

    const val = parseFloat(nums[0]);
    const map = KNOWLEDGE_BASE.percentileMap;

    if (val <= 100 && (q.includes("percentile") || val < 100)) {
      let rank = null;
      for (let i = 0; i < map.length; i++) {
        if (val >= map[i].percentile) {
          rank = map[i].rank;
          break;
        }
      }
      if (!rank) rank = 1500000;
      return `<p>📊 <strong>Percentile to Rank Estimate</strong></p>
              <p><strong>${val}%ile</strong> ≈ Rank <strong>~${rank.toLocaleString()}</strong> (approximate)</p>
              <p style="font-size:0.82rem; color:var(--text-tertiary)"><em>This varies by session. January & April sessions have different conversion rates.</em></p>
              <p>Want me to predict your admission chances at AITR with this rank?</p>`;
    } else if (val > 100) {
      const pct = estimatePercentile(val);
      return `<p>📊 <strong>Rank to Percentile Estimate</strong></p>
              <p>Rank <strong>${val.toLocaleString()}</strong> ≈ <strong>~${pct || "< 40"}%ile</strong> (approximate)</p>
              <p style="font-size:0.82rem; color:var(--text-tertiary)"><em>This varies by session and total number of candidates.</em></p>
              <p>Want me to predict your admission chances at AITR?</p>`;
    }

    return handleDefault();
  }


  function estimatePercentile(rank) {
    const map = KNOWLEDGE_BASE.percentileMap;
    for (let i = 0; i < map.length; i++) {
      if (rank <= map[i].rank) {
        return map[i].percentile;
      }
    }
    return null;
  }


  function handleCollegeInfo() {
    const c = KNOWLEDGE_BASE.college;
    return `<p>🏛️ <strong>${c.name}</strong></p>
            <ul>
              <li>📍 <strong>Location:</strong> ${c.location}</li>
              <li>📅 <strong>Established:</strong> ${c.established}</li>
              <li>🏅 <strong>Accreditation:</strong> ${c.accreditation}</li>
              <li>🎓 <strong>Affiliated to:</strong> ${c.affiliation}</li>
              <li>🌐 <strong>Website:</strong> <a href="${c.website}" target="_blank" style="color:var(--accent-400)">${c.website}</a></li>
              <li>🌳 <strong>Campus:</strong> ${c.campus}</li>
            </ul>
            <p>🔧 <strong>Key Facilities:</strong></p>
            <p>${c.facilities.map(f => `<span class="chance-badge chance-high">${f}</span>`).join(" ")}</p>
            <div style="margin-top: 16px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
              <iframe width="100%" height="200" src="https://www.youtube.com/embed/5F_C8m1u6A8?autoplay=0&mute=0" title="Acropolis Campus Tour" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`;
  }


  function handleDefault(q) {
    return "__LLM_FALLBACK__";
  }


  // ===========================
  //  Special Chip Handler
  // ===========================

  // Handle chips that trigger special actions
  document.addEventListener("click", (e) => {
    const chip = e.target.closest(".form-chip");
    if (!chip) return;

    const value = chip.dataset.value;
    if (value === "__START_WIZARD__") {
      // Visual feedback
      chip.classList.add("selected");
      const group = chip.closest(".form-chip-group");
      if (group) {
        group.querySelectorAll(".form-chip").forEach(c => {
          c.style.pointerEvents = "none";
          if (c !== chip) c.style.opacity = "0.4";
        });
      }
      startFormWizard();
      return;
    }

    // For non-form-wizard chips that aren't in the wizard flow
    if (!formWizardActive && value && !chip.dataset.handled) {
      chip.dataset.handled = "true";
      chip.classList.add("selected");
      const group = chip.closest(".form-chip-group");
      if (group) {
        group.querySelectorAll(".form-chip").forEach(c => {
          c.style.pointerEvents = "none";
          if (c !== chip) c.style.opacity = "0.4";
        });
      }

      userInput.value = value;
      sendBtn.disabled = false;
      setTimeout(() => handleSend(), 200);
    }
  });

  // --- PDF EXPORT ---
  window.downloadPDFReport = function(btn) {
    if (typeof html2pdf === 'undefined') {
      alert('PDF library is loading. Please try again in a moment.');
      return;
    }
    const element = btn.closest('.message-content').cloneNode(true);
    
    // Remove the download button container from the PDF
    const btnDiv = element.querySelector('div[style*="margin-top: 16px"]');
    if(btnDiv) btnDiv.remove();

    const opt = {
      margin: 10,
      filename: 'AcroBot_Admission_Report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  // --- VOICE I/O ---
  // voiceBtn is declared at the top of the file
  const ttsBtn = document.getElementById('tts-btn');
  let recognition;
  let isRecording = false;
  let isTTSActive = false;

  // TTS Toggle
  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      isTTSActive = !isTTSActive;
      ttsBtn.classList.toggle('active', isTTSActive);
      ttsBtn.title = isTTSActive ? 'Read Aloud: ON' : 'Read Aloud: OFF';
      if (!isTTSActive) window.speechSynthesis.cancel();
    });
  }

  // Hook into original addMessage for TTS
  const originalAddMessage = addMessage;
  addMessage = function(role, html) {
    const el = originalAddMessage(role, html);
    if (role === 'bot' && isTTSActive) {
      const temp = document.createElement('div');
      temp.innerHTML = html;
      let cleanText = temp.textContent || temp.innerText;
      
      // Limit TTS text length so it doesn't read massive tables forever
      if (cleanText.length > 250) {
        cleanText = cleanText.substring(0, 150) + "... I have displayed the detailed information on the screen.";
      }
      
      const msg = new SpeechSynthesisUtterance(cleanText);
      msg.lang = 'en-IN';
      window.speechSynthesis.speak(msg);
    }
    return el;
  };

  // Speech Input
  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      document.getElementById('user-input').value = text;
      document.getElementById('send-btn').disabled = false;
      handleSend();
    };

    recognition.onend = () => {
      isRecording = false;
      if (voiceBtn) voiceBtn.classList.remove('recording');
    };

    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if (isRecording) {
          recognition.stop();
        } else {
          recognition.start();
          isRecording = true;
          voiceBtn.classList.add('recording');
        }
      });
    }
  } else {
    if (voiceBtn) voiceBtn.style.display = 'none';
  }

  // --- LIVE HUMAN HANDOFF ---
  const socket = io();
  let humanMode = false;

  socket.on('human_reply', (data) => {
    addMessage('bot', `<div style="background:rgba(255,165,0,0.1); border-left:3px solid orange; padding-left:8px;"><strong>👨‍💼 Human Counselor:</strong><br/>${data.message}</div>`);
  });

  window.requestHuman = function(btn) {
    humanMode = true;
    btn.disabled = true;
    btn.textContent = "Connecting to human...";
    addMessage('bot', '<p>Connecting you to a human counselor...</p>');
    
    // Collect recent chat history to send to admin
    const msgs = Array.from(document.querySelectorAll('.message-content')).slice(-10).map(el => el.textContent);
    socket.emit('request_human', { history: msgs });
  };

  // We need to update handleSend to check humanMode
  const originalHandleSend = handleSend;
  handleSend = function() {
    if (humanMode) {
      const text = userInput.value.trim();
      if (!text) return;
      addMessage("user", `<p>${escapeHtml(text)}</p>`);
      userInput.value = "";
      socket.emit('user_message', { message: text });
    } else {
      originalHandleSend();
    }
  };

  // --- MEGA UI FEATURES ---
  
  // Theme Toggle
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    if(localStorage.getItem('theme') === 'light') {
      document.documentElement.classList.add('light-mode');
    }
    themeBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-mode');
      const isLight = document.documentElement.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      // Switch icon
      themeBtn.innerHTML = isLight
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      playSound('click');
    });
  }

  // Image Upload (Computer Vision) - FIXED
  const attachBtn = document.getElementById('attach-btn');
  const fileUpload = document.getElementById('file-upload');
  if(attachBtn && fileUpload) {
    attachBtn.addEventListener('click', () => {
      fileUpload.value = ''; // Reset so same file can be uploaded again
      fileUpload.click();
    });
    fileUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if(!file) return;
      
      // Check file size (max 10MB)
      if(file.size > 10 * 1024 * 1024) {
        addMessage('bot', '<p>⚠️ Image is too large. Please upload an image under 10MB.</p>');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(event) {
        const base64Str = event.target.result;
        
        if (!chatStarted) {
          chatStarted = true;
          welcomeScreen.style.display = "none";
        }
        
        // Show user they uploaded an image
        addMessage('user', `<p>📎 Uploaded Scorecard</p><img src="${base64Str}" style="max-width:200px; border-radius:8px; margin-top:8px;"/>`);
        showTyping();
        
        // Send to backend LLM with Vision
        fetch('/api/ask-llm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            question: "I have uploaded my JEE scorecard. Please extract my CRL rank, category, and name from this image, and tell me my admission chances at Acropolis Institute.", 
            imageBase64: base64Str 
          })
        })
        .then(res => res.json())
        .then(data => {
          hideTyping();
          const agentBadge = `<div style="margin-bottom:8px;"><span class="chance-badge chance-high">📎 Vision Agent</span></div>`;
          addMessage("bot", agentBadge + (data.response || "Failed to analyze image."));
          saveChatHistory();
        })
        .catch(err => {
          hideTyping();
          addMessage("bot", "<p>⚠️ Error analyzing image. Please try again.</p>");
        });
      };
      reader.readAsDataURL(file);
    });
  }

  // Download Chat Transcript
  const downloadBtn = document.getElementById('download-chat-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const msgs = document.querySelectorAll('.message');
      if (msgs.length === 0) {
        alert('No chat history to download!');
        return;
      }
      let text = "═══════════════════════════════════\n";
      text += "   AcroBot AI Chat Transcript\n";
      text += "   Downloaded: " + new Date().toLocaleString() + "\n";
      text += "═══════════════════════════════════\n\n";
      
      msgs.forEach(msg => {
        const bubble = msg.querySelector('.message-bubble');
        const time = msg.querySelector('.message-time');
        if (!bubble) return;
        const role = msg.classList.contains('user') ? "👤 You" : "🤖 AcroBot";
        const timeStr = time ? ` [${time.textContent}]` : '';
        text += `${role}${timeStr}:\n${bubble.innerText}\n\n---\n\n`;
      });
      
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "AcroBot_Chat_Transcript.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      playSound('click');
    });
  }

  // --- Smart Predictive Suggestions ---
  const suggestionsMap = {
    'Finance': [
      { emoji: '🎓', text: 'Are there scholarships?', query: 'What scholarships are available at Acropolis?' },
      { emoji: '💳', text: 'Can I pay in installments?', query: 'Can I pay fees in installments at AITR?' },
      { emoji: '🏠', text: 'Hostel costs?', query: 'How much do PG/hostels cost near Acropolis?' },
    ],
    'Placement': [
      { emoji: '💻', text: 'Which skills to learn?', query: 'What skills should I learn for placements at AITR?' },
      { emoji: '🏢', text: 'Which companies visit?', query: 'What companies visit Acropolis for placements?' },
      { emoji: '📊', text: 'CSE vs IT placements', query: 'Compare CSE and IT placement stats at Acropolis' },
    ],
    'Academic': [
      { emoji: '🆚', text: 'CSE vs AI&ML?', query: 'Compare CSE and AI&ML at Acropolis' },
      { emoji: '🔮', text: 'Future scope?', query: 'Which branch has the best future scope?' },
      { emoji: '💼', text: 'Best for placements?', query: 'Which branch is best for placements at AITR?' },
    ],
    'Admissions': [
      { emoji: '📋', text: 'Documents needed?', query: 'What documents do I need for AITR admission?' },
      { emoji: '📝', text: 'MP DTE process?', query: 'Explain MP DTE counseling process step by step' },
      { emoji: '🎯', text: 'Predict my chances', query: '__FORM_HELPER__' },
    ],
    'Documentation': [
      { emoji: '🏫', text: 'About Acropolis', query: 'Tell me about Acropolis Institute campus and facilities' },
      { emoji: '💰', text: 'Fee structure?', query: 'What is the fee structure at Acropolis?' },
      { emoji: '📈', text: 'Cutoff trends', query: 'Show me cutoff trends graph for all branches' },
    ],
    'General': [
      { emoji: '🎯', text: 'Predict my chances', query: '__FORM_HELPER__' },
      { emoji: '📊', text: 'Cutoff ranks', query: 'Show me the latest cutoff ranks for all branches' },
      { emoji: '💼', text: 'Placement stats', query: 'Tell me about placements at Acropolis' },
      { emoji: '💰', text: 'Fee structure', query: 'What is the fee structure at AITR?' },
    ],
  };

  function updatePredictiveSuggestions(lastQuery, agentName) {
    const container = document.getElementById('predictive-suggestions');
    if (!container) return;
    
    const suggestions = suggestionsMap[agentName] || suggestionsMap['General'];
    container.innerHTML = '';
    
    suggestions.forEach(s => {
      const chip = document.createElement('button');
      chip.className = 'predictive-chip';
      chip.innerHTML = `${s.emoji} ${s.text}`;
      chip.addEventListener('click', () => {
        if (s.query === '__FORM_HELPER__') {
          startFormWizard();
        } else {
          userInput.value = s.query;
          sendBtn.disabled = false;
          handleSend();
        }
        container.innerHTML = '';
      });
      container.appendChild(chip);
    });
  }

  // Show default suggestions on page load
  setTimeout(() => updatePredictiveSuggestions('', 'General'), 500);

  // --- Saved Chats (Sessions) Logic ---
  const saveCurrentChatBtn = document.getElementById('save-current-chat-btn');
  const savedChatsList = document.getElementById('saved-chats-list');

  function getSavedSessions() {
    try {
      return JSON.parse(localStorage.getItem('chatSessions')) || [];
    } catch (e) {
      return [];
    }
  }

  function renderSavedSessions() {
    if (!savedChatsList) return;
    const sessions = getSavedSessions();
    if (sessions.length === 0) {
      savedChatsList.innerHTML = '<p class="no-saved-chats" style="font-size:0.78rem; color:var(--text-muted); padding:8px 0;">No saved chats yet.</p>';
      return;
    }

    savedChatsList.innerHTML = '';
    sessions.forEach(session => {
      const item = document.createElement('div');
      item.className = 'saved-chat-item';
      
      const title = document.createElement('div');
      title.className = 'saved-chat-item-title';
      title.textContent = session.title || 'Untitled Chat';
      title.title = new Date(session.id).toLocaleString();
      
      const delBtn = document.createElement('button');
      delBtn.className = 'saved-chat-item-delete';
      delBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>`;
      
      // Load session
      item.addEventListener('click', (e) => {
        if (e.target.closest('.saved-chat-item-delete')) return;
        loadSession(session);
        closeSidebar();
      });

      // Delete session
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSession(session.id);
      });

      item.appendChild(title);
      item.appendChild(delBtn);
      savedChatsList.appendChild(item);
    });
  }

  function saveCurrentSession() {
    const messages = messagesEl.querySelectorAll('.message');
    if (messages.length === 0) {
      alert("No messages to save yet!");
      return;
    }

    // Try to get a title from the first user message
    let title = 'Saved Chat';
    const firstUserMsg = messagesEl.querySelector('.message.user .message-bubble');
    if (firstUserMsg) {
      const text = firstUserMsg.textContent.trim();
      title = text.length > 25 ? text.substring(0, 25) + '...' : text;
    }

    let html = '';
    messages.forEach(msg => { html += msg.outerHTML; });

    const sessions = getSavedSessions();
    sessions.unshift({
      id: Date.now(),
      title: title,
      html: html
    });

    localStorage.setItem('chatSessions', JSON.stringify(sessions));
    renderSavedSessions();
    playSound('click');
    
    const btn = document.getElementById('save-current-chat-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Saved!';
    setTimeout(() => { btn.innerHTML = originalText; }, 2000);
  }

  function loadSession(session) {
    if (welcomeScreen) welcomeScreen.style.display = "none";
    messagesEl.innerHTML = '';
    
    const temp = document.createElement('div');
    temp.innerHTML = session.html;
    while (temp.firstChild) {
      messagesEl.appendChild(temp.firstChild);
    }
    
    chatStarted = true;
    // Overwrite the auto-save current history with this loaded one
    saveChatHistory(); 
    scrollToBottom();
    playSound('click');
  }

  function deleteSession(id) {
    if(!confirm("Delete this saved chat?")) return;
    let sessions = getSavedSessions();
    sessions = sessions.filter(s => s.id !== id);
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
    renderSavedSessions();
  }

  if (saveCurrentChatBtn) {
    saveCurrentChatBtn.addEventListener('click', saveCurrentSession);
  }

  // Initial render of saved chats
  renderSavedSessions();

  // Override New Chat Button to clear everything
  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      messagesEl.innerHTML = "";
      localStorage.removeItem("chatHistory");
      chatStarted = false;
      if (welcomeScreen) welcomeScreen.style.display = "block";
      closeSidebar();
      playSound('click');
    });
  }

  // --- Sound Effects ---
  function playSound(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.value = 0.05;
      
      if (type === 'send') {
        osc.frequency.value = 600;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'receive') {
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.frequency.value = 500;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch(e) { /* silent fail */ }
  }

  // Hook sound and speech into addMessage
  const _origAddMsg = addMessage;
  addMessage = function(role, html) {
    playSound(role === 'user' ? 'send' : 'receive');
    if (role === 'bot' && window.speakText) {
      window.speakText(html);
    }
    return _origAddMsg(role, html);
  };

})();
