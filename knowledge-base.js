/* ================================================
   AcroBot — Knowledge Base
   All data about Acropolis Institute of Technology & Research
   ================================================ */

const KNOWLEDGE_BASE = {

  // ---- Cutoff Ranks (Latest Reference, based on MP DTE counseling / JEE Main trends) ----
  cutoffs: {
    "CSE":             { closing: 250000, label: "Computer Science & Engineering" },
    "AI & ML":         { closing: 330000, label: "Artificial Intelligence & Machine Learning" },
    "Data Science":    { closing: 380000, label: "Data Science" },
    "CSIT":            { closing: 380000, label: "Computer Science & Information Technology" },
    "Cyber Security":  { closing: 410000, label: "Cyber Security" },
    "IT":              { closing: 480000, label: "Information Technology" },
    "ECE":             { closing: 540000, label: "Electronics & Communication Engineering" },
    "VLSI":            { closing: 600000, label: "Electronics Engineering (VLSI Design)" },
    "Civil":           { closing: 1300000, label: "Civil Engineering" },
    "Mechanical":      { closing: 1400000, label: "Mechanical Engineering" },
  },

  // ---- Multi-Year Cutoff History ----
  cutoffHistory: {
    years: [2022, 2023, 2024, 2025],
    data: {
      "CSE":            [210000, 225000, 240000, 250000],
      "AI & ML":        [280000, 300000, 315000, 330000],
      "Data Science":   [340000, 355000, 370000, 380000],
      "CSIT":           [320000, 340000, 360000, 380000],
      "Cyber Security": [360000, 380000, 395000, 410000],
      "IT":             [420000, 445000, 460000, 480000],
      "ECE":            [480000, 500000, 520000, 540000],
      "VLSI":           [520000, 540000, 570000, 600000],
      "Civil":          [1100000, 1150000, 1250000, 1300000],
      "Mechanical":     [1200000, 1250000, 1350000, 1400000],
    }
  },

  // ---- Round-wise Cutoff Data (MP DTE Official Reference) ----
  roundWiseCutoffs: {
    "Round 1": {
      "CSE": 230000,
      "AI & ML": 285000,
      "Data Science": 330000,
      "CSIT": 350000,
      "Cyber Security": 350000,
      "IT": 410000,
      "ECE": 480000,
      "VLSI": 560000,
      "Civil": 1100000,
      "Mechanical": 1150000
    },
    "Round 2": {
      "CSE": 250000,
      "AI & ML": 330000,
      "Data Science": 380000,
      "CSIT": 380000,
      "Cyber Security": 410000,
      "IT": 480000,
      "ECE": 540000,
      "VLSI": 600000,
      "Civil": 1300000,
      "Mechanical": 1400000
    }
  },

  // Category multipliers — how much relaxation a category generally gets
  categoryRelaxation: {
    "GEN":  1.0,
    "EWS":  1.15,
    "OBC":  1.25,
    "SC":   1.5,
    "ST":   1.7,
  },

  // ---- Fees Structure ----
  fees: {
    tuition: "₹85,000 – ₹1,10,000 per year (varies by branch)",
    other: "₹15,000 – ₹20,000 per year (development, exam, library fees)",
    total_approx: "₹1,00,000 – ₹1,30,000 per year (approx.)",
    total_4year: "₹4,00,000 – ₹5,20,000 for complete 4-year B.Tech (approx.)",
    note: "Fees are subject to revision. Exact figures are updated on the official AITR website and MP DTE portal."
  },

  // ---- Placement Statistics ----
  placements: {
    highest_package: "₹44 LPA (2024 batch)",
    average_package: "₹4.5 – ₹6 LPA",
    median_package: "₹4.2 LPA",
    placement_rate: "~85%+ (for CS/IT branches)",
    top_recruiters: [
      "TCS", "Infosys", "Wipro", "Cognizant", "Capgemini",
      "Accenture", "HCL", "Tech Mahindra", "Persistent Systems",
      "IBM", "Deloitte", "L&T Infotech", "Mphasis", "Hexaware"
    ],
    skills_needed: [
      "Data Structures & Algorithms",
      "Object-Oriented Programming",
      "DBMS & SQL",
      "Web Development (HTML/CSS/JS, React)",
      "Communication & Soft Skills",
      "Aptitude & Logical Reasoning",
      "Problem Solving on LeetCode/HackerRank"
    ],
    note: "CSE, AI & ML, and IT branches typically see the best placement numbers."
  },

  // ---- Required Documents ----
  documents: [
    "JEE Main 2025 Scorecard / Rank Card",
    "Class 10th Marksheet & Certificate",
    "Class 12th Marksheet & Certificate",
    "MP DTE Counseling Allotment Letter",
    "Category Certificate (if applicable: OBC/SC/ST/EWS)",
    "Domicile Certificate (MP students)",
    "Transfer Certificate (TC) from previous school",
    "Migration Certificate",
    "Character Certificate",
    "Aadhar Card (photocopy)",
    "Passport-size Photographs (8-10)",
    "Income Certificate (for fee concession/scholarship)",
    "Gap Certificate (if applicable)",
    "Anti-ragging Affidavit (online from AICTE portal)"
  ],

  // ---- MP DTE Counseling Process ----
  counseling: {
    steps: [
      "Register on the MP DTE online portal (dte.mponline.gov.in)",
      "Fill in personal, academic, and JEE Main details",
      "Pay the counseling registration fee (~₹1,200 for General, ₹800 for SC/ST)",
      "Choose and lock preferred colleges & branches (choice filling)",
      "Seat allotment is done based on JEE Main rank, category, and choices",
      "Report to the allotted college with all original documents",
      "Pay the college fees to confirm admission",
      "Participate in subsequent rounds if you want upgradation"
    ],
    rounds: "Usually 3-4 rounds + a special/mop-up round",
    note: "MP domicile students get preference in state quota seats. All-India quota seats are filled via JoSAA counseling."
  },

  // ---- Scholarships ----
  scholarships: [
    {
      name: "Madhya Pradesh Govt. Scholarship (SC/ST/OBC)",
      details: "Full or partial fee waiver for economically weaker sections. Apply via MP Scholarship Portal.",
      eligibility: "SC/ST/OBC category students with family income below specified limit"
    },
    {
      name: "Central Sector Scholarship (MHRD)",
      details: "For students scoring above 80th percentile in Class 12 with family income < ₹8 LPA.",
      eligibility: "80th+ percentile in 12th, family income < ₹8 LPA"
    },
    {
      name: "AICTE Pragati Scholarship (for girls)",
      details: "₹50,000/year for girl students in AICTE-approved institutions.",
      eligibility: "Girl students in AICTE-approved colleges, family income < ₹8 LPA"
    },
    {
      name: "Institute Merit Scholarship",
      details: "Acropolis offers merit-based fee concessions for students with high JEE Main percentiles.",
      eligibility: "High JEE Main rank/percentile (varies year to year)"
    },
    {
      name: "Post Matric Scholarship",
      details: "Available for SC/ST students via state and central govt. portals.",
      eligibility: "SC/ST category students"
    },
    {
      name: "EWS Scholarship",
      details: "For Economically Weaker Section students with family income < ₹8 LPA.",
      eligibility: "EWS certificate, family income < ₹8 LPA"
    }
  ],

  // ---- College Info ----
  college: {
    name: "Acropolis Institute of Technology and Research",
    short: "AITR",
    location: "Bypass Road, Mangliya Square, Indore, Madhya Pradesh 453771",
    established: "2004",
    accreditation: "NAAC A+ accredited, AICTE Approved",
    affiliation: "Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal",
    website: "https://acropolis.in",
    campus: "45+ acre green campus with modern infrastructure",
    facilities: [
      "Smart classrooms", "High-speed Wi-Fi campus", "Central Library",
      "Sports complex", "Auditorium", "Cafeteria",
      "Labs for AI/ML, IoT, Robotics", "Industry-connected incubation center"
    ]
  },

  // ---- Branch Details (for recommendations & career guidance) ----
  branchDetails: {
    "CSE": {
      fullName: "Computer Science & Engineering",
      description: "The most sought-after branch covering software development, algorithms, OS, databases, networking, and more.",
      futureScope: "Excellent — Software Engineers, Full Stack Developers, System Architects, Cloud Engineers",
      careerPaths: ["Software Developer", "Full Stack Engineer", "DevOps Engineer", "Cloud Architect", "System Designer"],
      skills: ["C/C++", "Java", "Python", "Data Structures", "Algorithms", "DBMS", "Web Development", "Cloud Computing"],
      codingIntensity: "Very High",
      avgPackage: "₹5-7 LPA",
      demandLevel: "Very High"
    },
    "AI & ML": {
      fullName: "Artificial Intelligence & Machine Learning",
      description: "Specialized branch focusing on AI, deep learning, NLP, computer vision and intelligent systems.",
      futureScope: "Excellent — AI/ML is the fastest-growing field globally. Huge demand in all industries.",
      careerPaths: ["ML Engineer", "Data Scientist", "AI Researcher", "NLP Engineer", "Computer Vision Engineer"],
      skills: ["Python", "TensorFlow/PyTorch", "Mathematics", "Statistics", "Linear Algebra", "Deep Learning", "NLP"],
      codingIntensity: "High",
      avgPackage: "₹5-8 LPA",
      demandLevel: "Very High"
    },
    "Data Science": {
      fullName: "Data Science",
      description: "Focused on extracting insights from data using statistics, ML, and visualization techniques.",
      futureScope: "Excellent — Every company needs data-driven decision making.",
      careerPaths: ["Data Analyst", "Data Scientist", "Business Analyst", "Data Engineer", "BI Developer"],
      skills: ["Python", "R", "SQL", "Statistics", "Tableau/Power BI", "Machine Learning", "Excel"],
      codingIntensity: "High",
      avgPackage: "₹4.5-7 LPA",
      demandLevel: "High"
    },
    "Cyber Security": {
      fullName: "Cyber Security",
      description: "Deals with protecting systems, networks, and data from cyber attacks and threats.",
      futureScope: "Excellent — Cybersecurity professionals are in extreme demand as digital threats grow.",
      careerPaths: ["Security Analyst", "Ethical Hacker", "SOC Analyst", "Penetration Tester", "Security Architect"],
      skills: ["Networking", "Linux", "Python", "Ethical Hacking", "Cryptography", "SIEM Tools", "Firewalls"],
      codingIntensity: "Medium-High",
      avgPackage: "₹4-6 LPA",
      demandLevel: "High"
    },
    "IT": {
      fullName: "Information Technology",
      description: "Application-oriented branch covering web technologies, cloud, networking, and software systems.",
      futureScope: "Very Good — Similar to CSE with focus on applications and IT infrastructure.",
      careerPaths: ["Software Developer", "Web Developer", "IT Consultant", "Cloud Engineer", "Network Engineer"],
      skills: ["Java", "Python", "Web Dev", "Cloud", "Networking", "DBMS", "Mobile Development"],
      codingIntensity: "High",
      avgPackage: "₹4.5-6 LPA",
      demandLevel: "High"
    },
    "ECE": {
      fullName: "Electronics & Communication Engineering",
      description: "Covers electronic circuits, communication systems, VLSI, embedded systems, and signal processing.",
      futureScope: "Good — Growing demand in IoT, embedded systems, telecom, and semiconductor industry.",
      careerPaths: ["Embedded Engineer", "VLSI Designer", "IoT Developer", "Telecom Engineer", "Hardware Designer"],
      skills: ["Circuit Design", "Embedded C", "MATLAB", "VLSI", "Signal Processing", "IoT", "PCB Design"],
      codingIntensity: "Medium",
      avgPackage: "₹3.5-5 LPA",
      demandLevel: "Medium-High"
    },
    "Mechanical": {
      fullName: "Mechanical Engineering",
      description: "Core engineering branch covering thermodynamics, manufacturing, design, and automotive engineering.",
      futureScope: "Stable — Good in manufacturing, automotive, aerospace, and with Industry 4.0 integration.",
      careerPaths: ["Design Engineer", "Manufacturing Engineer", "Automotive Engineer", "Project Manager", "Quality Engineer"],
      skills: ["AutoCAD", "SolidWorks", "Thermodynamics", "Manufacturing", "Material Science", "FEA"],
      codingIntensity: "Low-Medium",
      avgPackage: "₹3-4.5 LPA",
      demandLevel: "Medium"
    },
    "Civil": {
      fullName: "Civil Engineering",
      description: "Deals with construction, structural design, infrastructure, environmental engineering, and urban planning.",
      futureScope: "Stable — Infrastructure development, smart cities, and green building are growing areas.",
      careerPaths: ["Structural Engineer", "Site Engineer", "Urban Planner", "Construction Manager", "Environmental Engineer"],
      skills: ["AutoCAD", "STAAD Pro", "Surveying", "Structural Analysis", "Concrete Technology", "Project Management"],
      codingIntensity: "Low",
      avgPackage: "₹3-4 LPA",
      demandLevel: "Medium"
    },
    "CSIT": {
      fullName: "Computer Science & Information Technology",
      description: "A hybrid branch combining core CSE principles with modern IT applications.",
      futureScope: "Very Good — Opens doors to both software engineering and IT infrastructure roles.",
      careerPaths: ["Software Developer", "System Administrator", "IT Analyst", "Cloud Engineer"],
      skills: ["Java", "Python", "Networking", "Database Management", "Web Technologies"],
      codingIntensity: "High",
      avgPackage: "₹4.5-6 LPA",
      demandLevel: "High"
    },
    "VLSI": {
      fullName: "Electronics Engineering (VLSI Design)",
      description: "A specialized electronics branch focused on designing integrated circuits and microchips.",
      futureScope: "Excellent — Growing demand in semiconductor manufacturing and electronics industries.",
      careerPaths: ["VLSI Design Engineer", "Verification Engineer", "Embedded Systems Engineer", "Hardware Architect"],
      skills: ["Verilog/VHDL", "Digital Design", "Circuit Simulation", "CMOS Technology", "C/C++"],
      codingIntensity: "Medium",
      avgPackage: "₹4-6 LPA",
      demandLevel: "Medium-High"
    },
    "BCA": {
      fullName: "Bachelor of Computer Applications (BCA)",
      description: "A 3-year undergraduate degree focusing on computer applications, software development, and programming.",
      futureScope: "Good — Perfect for students wanting to enter the IT industry without a B.Tech degree.",
      careerPaths: ["Software Tester", "Web Developer", "Junior Programmer", "System Analyst"],
      skills: ["C/C++", "Java", "Web Development", "Database Management", "Communication"],
      codingIntensity: "High",
      avgPackage: "₹2.5-4 LPA",
      demandLevel: "High"
    },
    "IMCA": {
      fullName: "Integrated MCA (IMCA)",
      description: "A 5-year integrated program combining BCA and MCA into a single cohesive degree.",
      futureScope: "Very Good — Provides a master's level understanding of computer applications.",
      careerPaths: ["Software Engineer", "Systems Analyst", "Database Administrator", "IT Consultant"],
      skills: ["Advanced Java", "Python", "Cloud Computing", "Software Engineering", "Project Management"],
      codingIntensity: "High",
      avgPackage: "₹3.5-5.5 LPA",
      demandLevel: "High"
    }
  },

  // ---- Interest to Branch Mapping ----
  interestMapping: {
    "coding": ["CSE", "IT", "AI & ML", "Data Science"],
    "programming": ["CSE", "IT", "AI & ML", "Data Science"],
    "software": ["CSE", "IT"],
    "ai": ["AI & ML", "Data Science"],
    "artificial intelligence": ["AI & ML"],
    "machine learning": ["AI & ML", "Data Science"],
    "data": ["Data Science", "AI & ML"],
    "hacking": ["Cyber Security"],
    "security": ["Cyber Security"],
    "electronics": ["ECE"],
    "iot": ["ECE", "CSE"],
    "robotics": ["ECE", "AI & ML", "Mechanical"],
    "web development": ["CSE", "IT"],
    "app development": ["CSE", "IT"],
    "hardware": ["ECE"],
    "construction": ["Civil"],
    "building": ["Civil"],
    "automobile": ["Mechanical"],
    "manufacturing": ["Mechanical"],
    "design": ["Mechanical", "Civil"],
    "cloud": ["CSE", "IT"],
    "networking": ["IT", "ECE", "Cyber Security"],
    "game development": ["CSE", "IT"],
    "blockchain": ["CSE", "IT", "Cyber Security"]
  },

  // ---- Branch Comparisons ----
  branchComparisons: {
    "CSE vs AI&ML": {
      headers: ["Aspect", "CSE", "AI & ML"],
      rows: [
        ["Focus", "Broad CS fundamentals — OS, DBMS, Networks, Software Engg.", "Specialized in ML, Deep Learning, NLP, Computer Vision"],
        ["Coding Intensity", "Very High", "High"],
        ["Mathematics", "Moderate", "Very High (Linear Algebra, Stats)"],
        ["Placement Scope", "Excellent — widest range of roles", "Excellent — AI/ML specific + general SDE roles"],
        ["Avg Package", "₹5-7 LPA", "₹5-8 LPA"],
        ["Future Scope", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
        ["Closing Rank", "~2,50,000", "~3,30,000"]
      ],
      verdict: "If you want a versatile career in software → CSE. If you're passionate about AI/data → AI & ML. Both have excellent demand."
    },
    "CSE vs IT": {
      headers: ["Aspect", "CSE", "IT"],
      rows: [
        ["Focus", "Theory-heavy: Compilers, Architecture, OS", "Application-oriented: Web, Cloud, Networking"],
        ["Coding Intensity", "Very High", "High"],
        ["Cutoff", "Tougher (lower closing rank)", "Easier to get"],
        ["Placement Scope", "Excellent", "Excellent (almost equal to CSE)"],
        ["Avg Package", "₹5-7 LPA", "₹4.5-6 LPA"],
        ["Future Scope", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
        ["Closing Rank", "~2,50,000", "~4,80,000"]
      ],
      verdict: "Placement-wise both are almost equal. CSE has slightly higher brand value, IT is easier to get with a higher closing rank."
    },
    "AI&ML vs Data Science": {
      headers: ["Aspect", "AI & ML", "Data Science"],
      rows: [
        ["Focus", "Building intelligent systems — neural nets, CV, NLP", "Extracting insights from data — stats, viz, analytics"],
        ["Coding Intensity", "High", "High"],
        ["Mathematics", "Very High", "Very High"],
        ["Placement Scope", "Excellent", "Very Good"],
        ["Avg Package", "₹5-8 LPA", "₹4.5-7 LPA"],
        ["Future Scope", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
        ["Closing Rank", "~3,30,000", "~3,80,000"]
      ],
      verdict: "AI & ML for building models and intelligent products, Data Science for analyzing data and business insights. Both are future-proof."
    },
    "CSE vs Cyber Security": {
      headers: ["Aspect", "CSE", "Cyber Security"],
      rows: [
        ["Focus", "Broad software & systems", "Security, hacking, network defense"],
        ["Coding Intensity", "Very High", "Medium-High"],
        ["Niche Factor", "General purpose", "Highly specialized"],
        ["Placement Scope", "Excellent — many roles", "Good — specialized security roles"],
        ["Avg Package", "₹5-7 LPA", "₹4-6 LPA"],
        ["Future Scope", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
        ["Closing Rank", "~2,50,000", "~4,10,000"]
      ],
      verdict: "CSE gives a broader foundation and more placement options. Cyber Security is great if you're passionate about security and ethical hacking."
    }
  },

  // ---- FAQs ----
  faqs: {
    attendance: "Yes, attendance is compulsory at AITR. A minimum of **75% attendance** is required in each subject as per RGPV university rules. Below 75% may lead to being debarred from exams. Regular attendance also helps in understanding concepts and performing well in placements.",
    bestBranch: "The 'best' branch depends on your interests! **CSE** and **AI & ML** are currently the most popular with best placements. However, choose based on what excites you — coding → CSE/IT, AI → AI&ML, Security → Cyber Security, Hardware → ECE.",
    codingLanguage: "Here's what we recommend based on your year:\n\n**1st Year:** Start with **C** (basics) → then **Python** (versatile)\n**2nd Year:** Learn **Java** or **C++** (for DSA & placements)\n**3rd Year:** **JavaScript** (web dev), **SQL** (databases)\n**4th Year:** Specialize — **Python** (AI/ML), **Go/Rust** (systems)\n\n**For placements:** Focus on **C++** or **Java** for DSA, and **Python** for everything else.\n\n**Pro Tip:** Practice on LeetCode, HackerRank, and CodeForces daily!",
    internship: "Internships are extremely important! AITR encourages students to do internships from 2nd year onwards.\n\n**How to get internships:**\n• Apply on LinkedIn, Internshala, and AngelList\n• Build projects and a strong GitHub profile\n• Participate in hackathons\n• College placement cell also facilitates internships\n\n**Tip:** A good internship can convert into a full-time PPO (Pre-Placement Offer)!",
    transport: "AITR does not provide its own transport facility. However, being located on the Bypass Road near Mangliya Square, the campus is well-connected. Many students use private vehicles, public transport, or shared auto services."
  },

  // ---- Percentile ↔ Rank Rough Mapping ----
  percentileMap: [
    { percentile: 99,    rank: 10000 },
    { percentile: 98,    rank: 20000 },
    { percentile: 97,    rank: 30000 },
    { percentile: 96,    rank: 40000 },
    { percentile: 95,    rank: 55000 },
    { percentile: 93,    rank: 75000 },
    { percentile: 90,    rank: 110000 },
    { percentile: 87,    rank: 150000 },
    { percentile: 85,    rank: 175000 },
    { percentile: 80,    rank: 250000 },
    { percentile: 75,    rank: 330000 },
    { percentile: 70,    rank: 420000 },
    { percentile: 65,    rank: 520000 },
    { percentile: 60,    rank: 640000 },
    { percentile: 50,    rank: 900000 },
    { percentile: 40,    rank: 1200000 },
  ]
};
