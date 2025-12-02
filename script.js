// ===============================
// QUESTION DEFINITIONS
// ===============================
const QUESTIONS = [
    { 
        key: "luster", 
        label: "What is the sample's luster?",
        options: ["metallic","sub-metallic","vitreous","adamantine","dull","earthy","waxy","resinous","pearly","silky"] 
    },
    { 
        key: "color", 
        label: "What is the sample's color?",
        options: ["red","orange","yellow","green","teal","blue","purple","pink","brown","black","gray","white","clear"] 
    },
    { 
        key: "transparency", 
        label: "What is the transparency of the sample?",
        options: ["transparent","translucent","opaque"] 
    },
    { 
        key: "streak", 
        label: "What is the sample's streak?",
        options: ["red","orange","yellow","green","blue","brown","black","gray","white","none"] 
    },
    { 
        key: "shape", 
        label: "What is the sample's crystal shape?",
        options: ["cubic","rhombohedral","platy","tabular","tetragonal","hexagonal","dodecahedral","octahedral","botryoidal","prism","radiating","grainy","none"] 
    },
    { 
        key: "fracture", 
        label: "What type of fracture does the sample have?",
        options: ["conchoidal","hackly","splintery","irregular","fibrous","micaceous"] 
    },
    { 
        key: "hardness", 
        label: "What is the sample's hardness range?",
        options: ["1-2","2-4","4-6","6-8","8-10"] 
    },
    { 
        key: "other", 
        label: "Does the mineral have any of these special characteristics?",
        options: ["magnetic","reactive","pleochlorism","irridescence","none"] 
    }
];


let minerals = [];
let answers = {};
let qIndex = 0;

// ===============================
// LOAD MINERAL DATA
// ===============================
fetch("minerals.json")
    .then(r => r.json())
    .then(data => {
        minerals = data;
        showQuestion();
    });

// ===============================
// DISPLAY QUESTIONS
// ===============================
function showQuestion() {
    const box = document.getElementById("question-box");
    if (qIndex >= QUESTIONS.length) {
        showResults();
        return;
    }

    const q = QUESTIONS[qIndex];
    
    let html = `<h2>${q.label}</h2>`;
    q.options.forEach(opt => {
        html += `<button class="option-btn" onclick="answer('${q.key}','${opt}')">${opt}</button>`;
    });

    html += `<br><button onclick="skip()">Skip</button>`;
    box.innerHTML = html;
}

function answer(key, value) {
    answers[key] = value;
    qIndex++;
    showQuestion();
}

function skip() {
    qIndex++;
    showQuestion();
}

// ===============================
// MATCHING LOGIC
// ===============================
function showResults() {
    const box = document.getElementById("question-box");

    const results = minerals.map(m => {
        let score = 0;
        let total = 0;

        for (let q of QUESTIONS) {
            const key = q.key;
            if (!answers[key]) continue;
            total++;

            const userVal = answers[key];
            const mineralVals = m[key] || [];

            // Hardness uses a range, mineral file has numbers
            if (key === "hardness") {
                let [low, high] = userVal.split("-").map(n => parseInt(n));
                if (m.hardness.some(h => h >= low && h <= high)) score++;
            } else {
                if (mineralVals.includes(userVal)) score++;
            }
        }

        return {
            name: m.name,
            match: total === 0 ? 0 : Math.round((score / total) * 100)
        };
    });

    results.sort((a, b) => b.match - a.match);
    const top3 = results.slice(0, 3);

    let html = `<h2>Top Matches</h2>`;
    top3.forEach(r => {
        html += `<p><strong>${r.name}</strong>: ${r.match}% match</p>`;
    });

    box.innerHTML = html;
}

// ===============================
// RESTART
// ===============================
function restart() {
    answers = {};
    qIndex = 0;
    showQuestion();
}
