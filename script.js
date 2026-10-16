// --- DỮ LIỆU VÀ TRẠNG THÁI ỨNG DỤNG ---
let currentTab = 1;
let currentQuestion = null; 
let challengeScore = 0;
let targetScore = 5;
let currentTriangleBBox = { minX: 0, minY: 0, maxX: 500, maxY: 400 };

// --- KHỞI TẠO KHI TẢI TRANG ---
document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    loadTabContent(currentTab);
    
    // Tự động vẽ lại hình khi thay đổi kích thước cửa sổ trình duyệt
    window.addEventListener("resize", () => {
        if (currentQuestion && currentQuestion.a && currentQuestion.b && currentQuestion.c) {
            drawTriangleThreeSidesSVG(currentQuestion.a, currentQuestion.b, currentQuestion.c);
        }
    });
});

// --- QUẢN LÝ CHUYỂN THẺ (TABS) ---
function initTabs() {
    const tabs = document.querySelectorAll(".function-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = parseInt(tab.getAttribute("data-tab"));
            loadTabContent(currentTab);
        });
    });
}

function loadTabContent(tabId) {
    const container = document.getElementById("tabContent");
    
    if (tabId === 1) {
        renderCosineTab(container);
    } else if (tabId === 2) {
        renderSineTab(container);
    } else if (tabId === 3) {
        renderAreaTab(container);
    } else if (tabId === 4) {
        renderChallengeTab(container);
    }
}

// Hàm hỗ trợ gọi KaTeX an toàn sau khi đổi nội dung HTML
function triggerMathRender() {
    setTimeout(() => {
        if (typeof renderMathInElement === "function") {
            renderMathInElement(document.body, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ],
                throwOnError: false
            });
        }
    }, 50);
}

// Hàm xáo trộn mảng ngẫu nhiên (Fisher-Yates Shuffle)
function shuffleArray(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


// ==========================================
// THẺ 1: LUYỆN TẬP ĐỊNH LÝ COSIN (3 BƯỚC)
// ==========================================
function renderCosineTab(container) {
    container.innerHTML = `
        <h3>📐 Thẻ 1: Luyện Tập Định Lý Cosin</h3>
        <p class="hint">Lựa chọn mức độ khó và giải quyết bài toán tuần tự theo từng bước.</p>
        
        <!-- Thanh chọn phân bậc -->
        <div class="input-group" style="margin: 8px 0;">
            <label><b>Chọn mức độ luyện tập:</b></label>
            <select id="cosineLevel" class="input-group" style="margin-top: 4px;">
                <option value="1">Mức 1: Tìm cạnh a hoặc góc A cơ bản</option>
                <option value="2">Mức 2: Tính ngẫu nhiên cạnh bất kỳ (a, b, hoặc c)</option>
                <option value="3" selected>Mức 3: Tổng hợp (Tính cạnh bất kỳ & tính Cos các góc)</option>
            </select>
        </div>
        
        <button class="btn btn-primary" onclick="startCosineQuestion()">Tạo câu hỏi mới</button>
        <div id="cosineQuizArea"></div>
    `;
    startCosineQuestion();
}

function startCosineQuestion() {
    let level = document.getElementById("cosineLevel") ? parseInt(document.getElementById("cosineLevel").value) : 3;
    let chosenType = 'side_a';
    let rand = Math.random(); 

    // Cấu hình tỷ lệ xác suất cho từng mức độ
    if (level === 1) {
        if (rand < 0.70) chosenType = 'side_a';   
        else chosenType = 'angle_a';  
    } else if (level === 2) {
        if (rand < 0.33) chosenType = 'side_a';   
        else if (rand < 0.66) chosenType = 'side_b';   
        else chosenType = 'side_c';   
    } else if (level === 3) {
        if (rand < 0.20) chosenType = 'side_a';   
        else if (rand < 0.40) chosenType = 'side_b';   
        else if (rand < 0.60) chosenType = 'side_c';   
        else if (rand < 0.73) chosenType = 'cos_a';    
        else if (rand < 0.86) chosenType = 'cos_b';    
        else chosenType = 'cos_c';    
    }

    // --- TRƯỜNG HỢP 1: TÍNH CẠNH (a, b hoặc c) ---
    if (chosenType.startsWith('side')) {
        let targetSide = chosenType.split('_')[1].toUpperCase(); 
        
        let a, b, c;
        let angles = [30, 45, 60, 120, 135, 150];
        let angleVal = angles[Math.floor(Math.random() * angles.length)];
        let rad = angleVal * Math.PI / 180;

        // Mở rộng khoảng giá trị ngẫu nhiên từ 5 đến 12 (thay vì chỉ 5 đến 8)
        if (targetSide === 'A') {
            b = Math.floor(Math.random() * 10) + 3; 
            c = Math.floor(Math.random() * 10) + 3;
            a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));
        } else if (targetSide === 'B') {
            a = Math.floor(Math.random() * 10) + 3;
            c = Math.floor(Math.random() * 10) + 3;
            b = Math.sqrt(a*a + c*c - 2*a*c*Math.cos(rad));
        } else { // 'C'
            a = Math.floor(Math.random() * 10) + 3;
            b = Math.floor(Math.random() * 10) + 3;
            c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(rad));
        }

        currentQuestion = {
            type: 'cosine_side',
            target: targetSide,
            ansSide: Math.round((targetSide === 'A' ? a : targetSide === 'B' ? b : c) * 10) / 10,
            a: a, b: b, c: c,
            targetAngleVal: angleVal
        };

        drawTriangleThreeSidesSVG(a, b, c);

        let givenText = "";
        if (targetSide === 'A') givenText = `Cho $\\Delta ABC$ có $b = ${b}$, $c = ${c}$, $\\widehat{A} = ${angleVal}^{\\circ}$. Tính $a$?`;
        else if (targetSide === 'B') givenText = `Cho $\\Delta ABC$ có $a = ${Math.round(a*10)/10}$, $c = ${c}$, $\\widehat{B} = ${angleVal}^{\\circ}$. Tính $b$?`;
        else givenText = `Cho $\\Delta ABC$ có $a = ${Math.round(a*10)/10}$, $b = ${b}$, $\\widehat{C} = ${angleVal}^{\\circ}$. Tính $c$?`;

        const quizArea = document.getElementById("cosineQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header"><span><b>Đề bài:</b> ${givenText}</span></div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn công thức cần dùng</b></label>
                    <div id="step1Buttons" style="display:flex; flex-direction:column; gap:6px;">
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineSideStep1(this, 'A')">
                            <span>$a^2 = b^2 + c^2 - 2bc \\cos A$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineSideStep1(this, 'B')">
                            <span>$b^2 = a^2 + c^2 - 2ac \\cos B$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineSideStep1(this, 'C')">
                            <span>$c^2 = a^2 + b^2 - 2ab \\cos C$</span>
                        </button>
                    </div>
                </div>
                
                <div id="step2Container" style="display:none; margin-top: 10px;"></div>
                <div id="step3Container" style="display:none; margin-top: 10px;"></div>
                <div id="feedbackArea" style="margin-top: 8px; font-weight:600;"></div>
            </div>
        `;
    } 
    // --- TRƯỜNG HỢP 2: TÍNH GIÁ TRỊ COSIN (cosA, cosB, hoặc cosC) ---
    else {
        let targetCos = chosenType.split('_')[1].toUpperCase(); // 'A', 'B', hoặc 'C'
        
        // Thay vì cố định 6, 7, 8, ta sinh ngẫu nhiên 3 cạnh thỏa mãn bất đẳng thức tam giác
        let a, b, c;
        do {
            a = Math.floor(Math.random() * 10) + 3; // Từ 3 đến 11
            b = Math.floor(Math.random() * 10) + 3;
            c = Math.floor(Math.random() * 10) + 3;
        } while (!(a + b > c && a + c > b && b + c > a)); // Đảm bảo tạo thành tam giác hợp lệ

        let cosVal = 0;
        if (targetCos === 'A') {
            cosVal = (b*b + c*c - a*a) / (2 * b * c);
        } else if (targetCos === 'B') {
            cosVal = (a*a + c*c - b*b) / (2 * a * c);
        } else {
            cosVal = (a*a + b*b - c*c) / (2 * a * b);
        }

        currentQuestion = {
            type: 'cosine_angle',
            target: targetCos,
            ansCos: Math.round(cosVal * 10000) / 10000,
            a: a, b: b, c: c
        };

        drawTriangleThreeSidesSVG(a, b, c);

        const quizArea = document.getElementById("cosineQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header"><span><b>Đề bài:</b> Cho $\\Delta ABC$ có $a = ${a}$, $b = ${b}$, $c = ${c}$. Tính giá trị $\\cos ${targetCos}$?</span></div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn công thức cần dùng</b></label>
                    <div id="step1AngleButtons" style="display:flex; flex-direction:column; gap:6px;">
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineAngleStep1(this, 'A')">
                            <span>$a^2 = b^2 + c^2 - 2bc \\cos A$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineAngleStep1(this, 'B')">
                            <span>$b^2 = a^2 + c^2 - 2ac \\cos B$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineAngleStep1(this, 'C')">
                            <span>$c^2 = a^2 + b^2 - 2ab \\cos C$</span>
                        </button>
                    </div>
                </div>
                
                <div id="step2Container" style="display:none; margin-top: 10px;"></div>
                <div id="step3Container" style="display:none; margin-top: 10px;"></div>
                <div id="feedbackArea" style="margin-top: 8px; font-weight:600;"></div>
            </div>
        `;
    }
    triggerMathRender();
}

// --- CÁC HÀM XỬ LÝ TƯƠNG TÁC TƯỜNG BƯỚC CHO CẠNH ---
function checkCosineSideStep1(btnElement, selectedSide) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step1Buttons");
    const allButtons = container.querySelectorAll("button");
    const targetSide = currentQuestion.target; // 'A', 'B', hoặc 'C'

    if (selectedSide === targetSide) {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Chính xác!</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) {
                btn.style.display = "none";
            } else {
                btn.className = "btn btn-success";
                btn.disabled = true;
            }
        });

        let targetLower = targetSide.toLowerCase();
        let formulaCorrect = "";
        let formulaWrong = "";

        if (targetSide === 'A') {
            formulaCorrect = "$a = \\sqrt{b^2 + c^2 - 2bc \\cos A}$";
            formulaWrong = "$a = \\sqrt{b^2 + c^2 + 2bc \\cos A}$";
        } else if (targetSide === 'B') {
            formulaCorrect = "$b = \\sqrt{a^2 + c^2 - 2ac \\cos B}$";
            formulaWrong = "$b = \\sqrt{a^2 + c^2 + 2ac \\cos B}$";
        } else {
            formulaCorrect = "$c = \\sqrt{a^2 + b^2 - 2ab \\cos C}$";
            formulaWrong = "$c = \\sqrt{a^2 + b^2 + 2ab \\cos C}$";
        }

        const step2 = document.getElementById("step2Container");
        step2.style.display = "block";
        step2.innerHTML = `
            <label style="display:block; margin-bottom:6px;"><b>Bước 2: Chọn công thức suy ra để tính cạnh $${targetLower}$</b></label>
            <div id="step2Buttons" style="display:flex; flex-direction:column; gap:6px;">
                <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineSideStep2(this, 'wrong')">
                    <span>${formulaWrong}</span>
                </button>
                <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineSideStep2(this, 'correct')">
                    <span>${formulaCorrect}</span>
                </button>
            </div>
        `;
        triggerMathRender();
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa đúng, đề bài yêu cầu tính cạnh $${targetSide.toLowerCase()}$, hãy chọn công thức bắt đầu bằng $${targetSide.toLowerCase()}^2$.</span>`;
        btnElement.style.display = "none";
    }
}

function checkCosineSideStep2(btnElement, status) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step2Buttons");
    const allButtons = container.querySelectorAll("button");
    const targetLower = currentQuestion.target.toLowerCase();

    if (status === "correct") {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Rất tốt! Giờ hãy thực hiện tính toán.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) {
                btn.style.display = "none";
            } else {
                btn.className = "btn btn-success";
                btn.disabled = true;
            }
        });

        const step3 = document.getElementById("step3Container");
        step3.style.display = "block";
        step3.innerHTML = `
            <label><b>Bước 3: Điền độ dài cạnh $${targetLower}$ (làm tròn đến 2 chữ số thập phân)</b></label>
            <div class="input-row" style="margin-top:6px;">
                <input type="text" id="txtStep3" placeholder="Nhập số (VD: 8.54)">
                <button class="btn btn-primary" onclick="checkCosineSideStep3()">Nộp bài</button>
            </div>
        `;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Sai dấu trong biểu thức dưới dấu căn (phải là dấu trừ '-').</span>`;
        btnElement.style.display = "none";
    }
}

function checkCosineSideStep3() {
    let studentVal = parseFloat(document.getElementById("txtStep3").value.trim().replace(',', '.'));
    let trueVal = currentQuestion.ansSide;
    let targetLower = currentQuestion.target.toLowerCase();
    let feedback = document.getElementById("feedbackArea");

    if (!isNaN(studentVal) && Math.abs(studentVal - trueVal) <= 0.05) {
        feedback.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">🎉 Chính xác tuyệt đối! Đáp án: $${targetLower} \\approx ${trueVal}$</span>`;
        document.getElementById("txtStep3").disabled = true;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa chính xác. Đáp án đúng là $${targetLower} \\approx ${trueVal}$.</span>`;
    }
    triggerMathRender();
}

// --- XỬ LÝ BƯỚC CHO DẠNG TÌM GÓC ---
function checkCosineAngleStep1(btnElement, selectedAngle) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step1AngleButtons");
    const allButtons = container.querySelectorAll("button");
    const targetAngle = currentQuestion.target; // 'A', 'B', hoặc 'C'

    if (selectedAngle === targetAngle) {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Chính xác!</span>`;
        
        allButtons.forEach(btn => {
            if (btn !== btnElement) {
                btn.style.display = "none";
            } else {
                btn.className = "btn btn-success";
                btn.disabled = true;
            }
        });

        let formulaCorrect = "";
        let formulaWrong = "";

        if (targetAngle === 'A') {
            formulaCorrect = "$\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$";
            formulaWrong = "$\\cos A = \\frac{a^2 + b^2 - c^2}{2ab}$";
        } else if (targetAngle === 'B') {
            formulaCorrect = "$\\cos B = \\frac{a^2 + c^2 - b^2}{2ac}$";
            formulaWrong = "$\\cos B = \\frac{a^2 + b^2 - c^2}{2ab}$";
        } else {
            formulaCorrect = "$\\cos C = \\frac{a^2 + b^2 - c^2}{2ab}$";
            formulaWrong = "$\\cos C = \\frac{a^2 + c^2 - b^2}{2ac}$";
        }

        const step2 = document.getElementById("step2Container");
        step2.style.display = "block";
        step2.innerHTML = `
            <label style="display:block; margin-bottom:6px;"><b>Bước 2: Chọn công thức tính $\\cos ${targetAngle}$ suy ra</b></label>
            <div id="step2AngleButtons" style="display:flex; flex-direction:column; gap:6px;">
                <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineAngleStep2(this, 'wrong')">
                    <span>${formulaWrong}</span>
                </button>
                <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkCosineAngleStep2(this, 'correct')">
                    <span>${formulaCorrect}</span>
                </button>
            </div>
        `;
        triggerMathRender();
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa chính xác. Đề bài yêu cầu tính $\\cos ${targetAngle}$, hãy chọn công thức có $\\cos ${targetAngle}$.</span>`;
        btnElement.style.display = "none";
    }
}

function checkCosineAngleStep2(btnElement, status) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step2AngleButtons");
    const allButtons = container.querySelectorAll("button");
    const targetAngle = currentQuestion.target;

    if (status === "correct") {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Rất chuẩn xác! Giờ hãy tính giá trị lượng giác.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) btn.style.display = "none";
            else { btn.className = "btn btn-success"; btn.disabled = true; }
        });

        const step3 = document.getElementById("step3Container");
        step3.style.display = "block";
        step3.innerHTML = `
            <label style="display:block; margin-bottom:6px;"><b>Bước 3: Điền giá trị $\\cos ${targetAngle}$ (làm tròn đến 4 chữ số thập phân, VD: 0.5234)</b></label>
            <div class="input-row" style="margin-top:6px;">
                <input type="text" id="txtStep3Angle" placeholder="Nhập giá trị cos...">
                <button class="btn btn-primary" onclick="checkCosineAngleStep3()">Nộp bài</button>
            </div>
        `;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Sai công thức biến đổi. Tử số phải trừ bình phương cạnh đối diện góc cần tính.</span>`;
        btnElement.style.display = "none";
    }
}

function checkCosineAngleStep3() {
    let studentVal = parseFloat(document.getElementById("txtStep3Angle").value.trim().replace(',', '.'));
    let trueVal = currentQuestion.ansCos;
    let targetAngle = currentQuestion.target;
    let feedback = document.getElementById("feedbackArea");

    if (!isNaN(studentVal) && Math.abs(studentVal - trueVal) <= 0.005) {
        feedback.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">🎉 Hoàn thành xuất sắc! $\\cos ${targetAngle} \\approx ${trueVal}$</span>`;
        document.getElementById("txtStep3Angle").disabled = true;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa chính xác. Giá trị chuẩn là ${trueVal}.</span>`;
    }
    triggerMathRender();
}

// ==========================================
// THẺ 2, 3, 4: CÁC THẺ KHUNG SƯỜN
// ==========================================
function renderSineTab(container) {
    container.innerHTML = `
        <h3>📐 Thẻ 2: Luyện Tập Định Lý Sin</h3>
        <p class="hint">Thực hành mối liên hệ giữa các cạnh và góc thông qua bán kính đường tròn ngoại tiếp $R$.</p>
        <button class="btn btn-primary" onclick="alert('Tính năng đang phát triển tiếp tục cho Thẻ 2')">Tạo câu hỏi định lý Sin</button>
    `;
    updateViewportInfo("Định lý Sin: a / sinA = b / sinB = c / sinC = 2R");
}

function renderAreaTab(container) {
    container.innerHTML = `
        <h3>📐 Thẻ 3: Các Công Thức Diện Tích Tam Giác</h3>
        <p class="hint">Luyện tập tính diện tích tam giác qua công thức Sin, công thức Hê-rông và bán kính nội/ngoại tiếp.</p>
        <button class="btn btn-primary" onclick="alert('Tính năng đang phát triển tiếp tục cho Thẻ 3')">Tạo câu hỏi diện tích</button>
    `;
    updateViewportInfo("Công thức diện tích: S = 1/2 b c sinA = sqrt(p(p-a)(p-b)(p-c))");
}

function renderChallengeTab(container) {
    container.innerHTML = `
        <h3>⚡ Thẻ 4: Thử Thách Phản Xạ</h3>
        <p class="hint">Trả lời liên tục các câu hỏi ngẫu nhiên. Đúng cộng 1 điểm, sai trừ 1 điểm. Đạt điểm ngưỡng sẽ chiến thắng!</p>
        <div class="input-group" style="margin: 10px 0;">
            <label>Nhập điểm ngưỡng hoàn thành (tối thiểu 5):</label>
            <input type="number" id="inputTargetScore" value="5" min="5" max="20">
        </div>
        <button class="btn btn-warning" onclick="startChallengeSession()">Bắt đầu phiên thử thách</button>
        <div id="challengeBox" style="margin-top:12px;"></div>
    `;
    updateViewportInfo("Chế độ thử thách tốc độ phản xạ hệ thức lượng");
}

function startChallengeSession() {
    targetScore = parseInt(document.getElementById("inputTargetScore").value) || 5;
    challengeScore = 0;
    nextChallengeQuestion();
}

function nextChallengeQuestion() {
    let b = Math.floor(Math.random() * 10) + 3;
    let c = Math.floor(Math.random() * 10) + 3;
    let angleA = [30, 45, 60, 120, 135, 150][Math.floor(Math.random() * 6)];
    let rad = angleA * Math.PI / 180;
    let a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));

    let area = 0.5 * b * c * Math.sin(rad);
    let trueAns = Math.round(area * 100) / 100;

    // Gán type cho Thử thách để hàm vẽ nhận biết và chỉ ẩn cạnh a (BC) hoặc gán nhãn thích hợp
    currentQuestion = { 
        type: 'challenge_area', 
        ans: trueAns, 
        a: a, b: b, c: c 
    };

    drawTriangleThreeSidesSVG(a, b, c);

    const box = document.getElementById("challengeBox");
    box.innerHTML = `
        <div class="function-card" style="background:#fff; border-color:var(--warning-color);">
            <div style="font-weight:bold; color:var(--warning-color);">Điểm số hiện tại: ${challengeScore} / ${targetScore}</div>
            <p style="margin: 6px 0;">Tính diện tích tam giác biết $b = ${b}$, $c = ${c}$, $\\widehat{A} = ${angleA}^{\\circ}$ (Làm tròn đến 2 chữ số thập phân):</p>
            <div class="input-row">
                <input type="text" id="txtChallengeAns" placeholder="Nhập kết quả...">
                <button class="btn btn-primary" onclick="submitChallengeAnswer()">Trả lời</button>
            </div>
            <div id="challengeFeedback" style="margin-top:6px; font-size:0.85rem;"></div>
        </div>
    `;
    triggerMathRender();
}

function submitChallengeAnswer() {
    let userAns = parseFloat(document.getElementById("txtChallengeAns").value.trim().replace(',', '.'));
    let trueAns = currentQuestion.ans;
    let feedback = document.getElementById("challengeFeedback");

    if (!isNaN(userAns) && Math.abs(userAns - trueAns) <= 0.05) {
        challengeScore += 1;
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Chính xác! (+1 điểm)</span>`;
    } else {
        challengeScore -= 1;
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Sai rồi! Đáp án đúng là ${trueAns}. (-1 điểm)</span>`;
    }
    triggerMathRender();

    if (challengeScore >= targetScore) {
        setTimeout(() => {
            alert("🎉 Chúc mừng bạn đã hoàn thành xuất sắc thử thách hệ thức lượng!");
            loadTabContent(4);
        }, 500);
    } else {
        setTimeout(nextChallengeQuestion, 1200);
    }
}


// ==========================================
// HỆ THỐNG VẼ HÌNH SVG DỰA THEO ĐÚNG DẠNG GIẢ THIẾT
// ==========================================
function drawTriangleByScenario(a, b, c, scenario) {
    const svg = document.getElementById("coordinate-system");
    if (!svg) return;
    svg.innerHTML = "";

    const viewport = svg.parentElement;
    const viewWidth = viewport ? viewport.clientWidth : 500;
    const viewHeight = viewport ? viewport.clientHeight : 400;

    svg.setAttribute("viewBox", `0 0 ${viewWidth} ${viewHeight}`);

    let cosA = (b*b + c*c - a*a) / (2 * b * c);
    cosA = Math.max(-1, Math.min(1, cosA));
    let angleA_rad = Math.acos(cosA);
    let angleB_rad = Math.acos((a*a + c*c - b*b) / (2 * a * c));
    let angleC_rad = Math.acos((a*a + b*b - c*c) / (2 * a * b));

    let angleA_deg = Math.round(angleA_rad * 180 / Math.PI);
    let angleB_deg = Math.round(angleB_rad * 180 / Math.PI);
    let angleC_deg = Math.round(angleC_rad * 180 / Math.PI);

    let Ax = 0, Ay = 0;
    let Bx = c, By = 0;
    let Cx = b * Math.cos(angleA_rad), Cy = b * Math.sin(angleA_rad);

    let minX = Math.min(Ax, Bx, Cx);
    let maxX = Math.max(Ax, Bx, Cx);
    let minY = Math.min(Ay, By, Cy);
    let maxY = Math.max(Ay, By, Cy);

    let rawWidth = maxX - minX;
    let rawHeight = maxY - minY;

    const paddingX = 65;
    const paddingY = 65;

    let availWidth = Math.max(viewWidth - 2 * paddingX, 100);
    let availHeight = Math.max(viewHeight - 2 * paddingY, 100);

    let scaleX = availWidth / rawWidth;
    let scaleY = availHeight / rawHeight;
    let scale = Math.min(scaleX, scaleY);

    let scaledWidth = rawWidth * scale;
    let scaledHeight = rawHeight * scale;

    let offsetX = (viewWidth - scaledWidth) / 2 - minX * scale;
    let offsetY = (viewHeight - scaledHeight) / 2 + maxY * scale; 

    let screenAx = Ax * scale + offsetX;
    let screenAy = offsetY - Ay * scale;

    let screenBx = Bx * scale + offsetX;
    let screenBy = offsetY - By * scale;

    let screenCx = Cx * scale + offsetX;
    let screenCy = offsetY - Cy * scale;

    let polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", `${screenAx},${screenAy} ${screenBx},${screenBy} ${screenCx},${screenCy}`);
    polygon.setAttribute("fill", "rgba(37, 99, 235, 0.08)");
    polygon.setAttribute("stroke", "#2563eb");
    polygon.setAttribute("stroke-width", "2.5");
    svg.appendChild(polygon);

    let fontLabelSize = Math.max(Math.min(viewWidth * 0.035, 18), 16);

    createSvgText(svg, screenAx - 22, screenAy + 8, "A", `font-weight:bold; fill:#1e293b; font-size:${fontLabelSize}px;`);
    createSvgText(svg, screenBx + 8, screenBy + 8, "B", `font-weight:bold; fill:#1e293b; font-size:${fontLabelSize}px;`);
    createSvgText(svg, screenCx - 6, screenCy - 12, "C", `font-weight:bold; fill:#1e293b; font-size:${fontLabelSize}px;`);

    let dispA = Math.round(a * 100) / 100;
    let dispB = Math.round(b * 100) / 100;
    let dispC = Math.round(c * 100) / 100;

    let labelTextA = "a";
    let labelTextB = "b";
    let labelTextC = "c";

    let labelAngleA = "";
    let labelAngleB = "";
    let labelAngleC = "";

    if (!scenario && typeof currentQuestion !== 'undefined' && currentQuestion) {
        scenario = currentQuestion.type;
    }

    if (scenario === 'cosine_side' || scenario === 'SAS') {
        let target = (currentQuestion && currentQuestion.target) ? currentQuestion.target : 'A';
        if (target === 'A') {
            labelTextB = `b = ${dispB}`;
            labelTextC = `c = ${dispC}`;
            labelTextA = "a = ?";
            labelAngleA = `Â = ${currentQuestion.targetAngleVal || angleA_deg}°`;
        } else if (target === 'B') {
            labelTextA = `a = ${dispA}`;
            labelTextC = `c = ${dispC}`;
            labelTextB = "b = ?";
            labelAngleB = `B̂ = ${currentQuestion.targetAngleVal || angleB_deg}°`;
        } else if (target === 'C') {
            labelTextA = `a = ${dispA}`;
            labelTextB = `b = ${dispB}`;
            labelTextC = "c = ?";
            labelAngleC = `Ĉ = ${currentQuestion.targetAngleVal || angleC_deg}°`;
        }
    } else if (scenario === 'cosine_angle' || scenario === 'SSS' || scenario === 'area_heron') {
        labelTextA = `a = ${dispA}`;
        labelTextB = `b = ${dispB}`;
        labelTextC = `c = ${dispC}`;

        if (scenario === 'cosine_angle') {
            let targetCos = (currentQuestion && currentQuestion.target) ? currentQuestion.target : 'A';
            if (targetCos === 'A') labelAngleA = "cosA = ?";
            else if (targetCos === 'B') labelAngleB = "cosB = ?";
            else if (targetCos === 'C') labelAngleC = "cosC = ?";
        }
    } else if (scenario === 'sine_two_angles_one_side' || scenario === 'ASA') {
        let givenSide = (currentQuestion && currentQuestion.givenSide) ? currentQuestion.givenSide.toLowerCase() : 'a';
        let targetSide = (currentQuestion && currentQuestion.targetSide) ? currentQuestion.targetSide.toLowerCase() : 'b';

        labelTextA = (givenSide === 'a') ? `a = ${dispA}` : (targetSide === 'a' ? "a = ?" : "a");
        labelTextB = (givenSide === 'b') ? `b = ${dispB}` : (targetSide === 'b' ? "b = ?" : "b");
        labelTextC = (givenSide === 'c') ? `c = ${dispC}` : (targetSide === 'c' ? "c = ?" : "c");

        if (currentQuestion && currentQuestion.givenAngles) {
            let g = currentQuestion.givenAngles;
            if (g.A) labelAngleA = `Â = ${g.A}°`;
            if (g.B) labelAngleB = `B̂ = ${g.B}°`;
            if (g.C) labelAngleC = `Ĉ = ${g.C}°`;
        } else {
            labelAngleA = `Â = ${angleA_deg}°`;
            labelAngleB = `B̂ = ${angleB_deg}°`;
        }
    } else if (scenario === 'challenge_area' || scenario === 'area_sin') {
        let targetAng = (currentQuestion && currentQuestion.targetAngle) ? currentQuestion.targetAngle : 'A';
        if (targetAng === 'A') {
            labelTextB = `b = ${dispB}`;
            labelTextC = `c = ${dispC}`;
            labelTextA = "a";
            labelAngleA = `Â = ${currentQuestion.targetAngleVal || angleA_deg}°`;
        } else if (targetAng === 'B') {
            labelTextA = `a = ${dispA}`;
            labelTextC = `c = ${dispC}`;
            labelTextB = "b";
            labelAngleB = `B̂ = ${currentQuestion.targetAngleVal || angleB_deg}°`;
        } else {
            labelTextA = `a = ${dispA}`;
            labelTextB = `b = ${dispB}`;
            labelTextC = "c";
            labelAngleC = `Ĉ = ${currentQuestion.targetAngleVal || angleC_deg}°`;
        }
    }

    let fontSideSize = Math.max(Math.min(viewWidth * 0.03, 15), 16);

    createSvgText(svg, (screenAx + screenBx) / 2, screenAy + 22, labelTextC, `fill:${labelTextC.includes('?') ? '#dc2626' : '#64748b'}; font-weight:${labelTextC.includes('?') ? 'bold' : 'normal'}; font-size:${fontSideSize}px; text-anchor:middle;`);
    createSvgText(svg, (screenAx + screenCx) / 2 - 25, (screenAy + screenCy) / 2, labelTextB, `fill:${labelTextB.includes('?') ? '#dc2626' : '#64748b'}; font-weight:${labelTextB.includes('?') ? 'bold' : 'normal'}; font-size:${fontSideSize}px; text-anchor:middle;`);
    createSvgText(svg, (screenBx + screenCx) / 2 + 25, (screenBy + screenCy) / 2, labelTextA, `fill:${labelTextA.includes('?') ? '#dc2626' : (labelTextA.includes('=') ? '#10b981' : '#64748b')}; font-weight:bold; font-size:${fontSideSize}px; text-anchor:middle;`);

    let fontAngleSize = Math.max(Math.min(viewWidth * 0.028, 14), 14);
    if (labelAngleA) createSvgText(svg, screenAx + 18, screenAy - 8, labelAngleA, `fill:#b91c1c; font-weight:bold; font-size:${fontAngleSize}px;`);
    if (labelAngleB) createSvgText(svg, screenBx - 35, screenBy - 8, labelAngleB, `fill:#b91c1c; font-weight:bold; font-size:${fontAngleSize}px;`);
    if (labelAngleC) createSvgText(svg, screenCx + 10, screenCy + 15, labelAngleC, `fill:#b91c1c; font-weight:bold; font-size:${fontAngleSize}px;`);

    // --- CẬP NHẬT TỌA ĐỘ BOUNDING BOX CHÍNH XÁC KHI VẼ TAM GIÁC ---
    let allX = [screenAx, screenBx, screenCx];
    let allY = [screenAy, screenBy, screenCy];
    let rawMinX = Math.min(...allX);
    let rawMaxX = Math.max(...allX);
    let rawMinY = Math.min(...allY);
    let rawMaxY = Math.max(...allY);

    const labelPad = 40; // Lề cho các nhãn tên đỉnh (A, B, C), độ dài cạnh và góc
    currentTriangleBBox = {
        minX: Math.max(0, rawMinX - labelPad),
        minY: Math.max(0, rawMinY - labelPad),
        maxX: Math.min(viewWidth, rawMaxX + labelPad),
        maxY: Math.min(viewHeight, rawMaxY + labelPad)
    };

    updateViewportInfo(`Đang hiển thị tam giác ABC theo giả thiết`);
}


// Wrapper giữ tương thích với các lệnh gọi cũ
function drawTriangleThreeSidesSVG(a, b, c) {
    drawTriangleByScenario(a, b, c, null);
}


function createSvgText(svg, x, y, textContent, style) {
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("style", style);
    text.textContent = textContent;
    svg.appendChild(text);
}

function updateViewportInfo(text) {
    const coords = document.getElementById("cursorCoords");
    if (coords) coords.textContent = text;
}



// ==========================================
// THẺ 2: LUYỆN TẬP ĐỊNH LÝ SIN (CÓ PHÂN BẬC MỨC ĐỘ & TÙY CHỈNH XÁC SUẤT)
// ==========================================

function renderSineTab(container) {
    container.innerHTML = `
        <h3>📐 Thẻ 2: Luyện Tập Định Lý Sin</h3>
        <p class="hint">Thực hành mối liên hệ giữa các cạnh, góc và bán kính đường tròn ngoại tiếp $R$ qua định lý Sin:</p>
        <p class="hint" style="text-align:center; font-weight:bold; color:var(--primary-color);">
            $$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$
        </p>
        
        <!-- Thanh chọn phân bậc mức độ -->
        <div class="input-group" style="margin: 12px 0;">
            <label><b>Chọn mức độ luyện tập:</b></label>
            <select id="sineLevel" class="input-group" style="margin-top: 4px;">
                <option value="1">Mức 1: Cho 2 góc + 1 cạnh, tính cạnh còn lại (Cơ bản)</option>
                <option value="2">Mức 2: Cho 1 cạnh + 1 góc đối diện, tính bán kính R hoặc ngược lại</option>
                <option value="3" selected>Mức 3: Tổng hợp (2 góc 1 cạnh + Bán kính ngoại tiếp R + Tìm góc)</option>
            </select>
        </div>
        
        <button class="btn btn-primary" onclick="startSineQuestion()">Tạo câu hỏi mới</button>
        <div id="sineQuizArea"></div>
    `;
    updateViewportInfo("Định lý Sin: a / sinA = b / sinB = c / sinC = 2R");
    startSineQuestion();
}

function startSineQuestion() {
    let level = document.getElementById("sineLevel") ? parseInt(document.getElementById("sineLevel").value) : 3;
    let chosenType = 'two_angles_side';
    let rand = Math.random(); // Tỷ lệ xác suất từ 0.0 đến 1.0

    // Cấu hình tỷ lệ xác suất phân bổ dạng bài cho Thẻ 2
    if (level === 1) {
        // Mức 1: 100% dạng 2 góc + 1 cạnh (ASA/AAS)
        chosenType = 'two_angles_side';
    } else if (level === 2) {
        // Mức 2: 50% tính R, 50% tính cạnh từ R và góc
        if (rand < 0.50) {
            chosenType = 'find_R';
        } else {
            chosenType = 'side_from_R';
        }
    } else if (level === 3) {
        // Mức 3: Tổng hợp các dạng bài
        if (rand < 0.40) {
            chosenType = 'two_angles_side';  // 40% Tính cạnh từ 2 góc 1 cạnh
        } else if (rand < 0.70) {
            chosenType = 'find_R';           // 30% Tính bán kính R
        } else {
            chosenType = 'side_from_R';      // 30% Tính cạnh khi biết R và góc
        }
    }

    // --- DẠNG 1: CHO 2 GÓC VÀ 1 CẠNH -> TÍNH CẠNH CÒN LẠI ---
    if (chosenType === 'two_angles_side') {
        // 1. Góc A chọn ngẫu nhiên từ mảng
        let angles = [30, 45, 60, 120, 135, 150];
        let angleA_val = angles[Math.floor(Math.random() * angles.length)];
        
        // 2. Sinh góc B là bội của 5 sao cho B > 0 và C = 180 - A - B > 0
        let rem = 180 - angleA_val; // Tổng góc (B + C)
        let validB = [];
        for (let bDeg = 5; bDeg <= rem - 5; bDeg += 5) {
            validB.push(bDeg);
        }
        let angleB_val = validB[Math.floor(Math.random() * validB.length)];
        let angleC_val = 180 - angleA_val - angleB_val;

        let radA = angleA_val * Math.PI / 180;
        let radB = angleB_val * Math.PI / 180;

        let a = Math.floor(Math.random() * 8) + 4; // a từ 4 đến 11
        let b = a * Math.sin(radB) / Math.sin(radA);
        let c = a * Math.sin(angleC_val * Math.PI / 180) / Math.sin(radA);

        currentQuestion = {
            type: 'sine_two_angles_one_side',
            givenSide: 'a',
            targetSide: 'b',
            givenAngles: { A: angleA_val, B: angleB_val },
            ansSide: Math.round(b * 100) / 100,
            a: a, b: b, c: c
        };

        // Vẽ hình minh họa chuẩn giả thiết
        drawTriangleByScenario(a, b, c, 'sine_two_angles_one_side');

        const quizArea = document.getElementById("sineQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header">
                    <span><b>Đề bài:</b> Cho $\\Delta ABC$ có $a = ${a}$, $\\widehat{A} = ${angleA_val}^{\\circ}$, $\\widehat{B} = ${angleB_val}^{\\circ}$. Tính độ dài cạnh $b$?</span>
                </div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn đẳng thức cần dùng</b></label>
                    <div id="step1Buttons" style="display:flex; flex-direction:column; gap:6px;">
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineStep1(this, 'correct')">
                            <span>$\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineStep1(this, 'wrong1')">
                            <span>$\\frac{a}{\\sin B} = \\frac{b}{\\sin A}$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineStep1(this, 'wrong2')">
                            <span>$\\frac{a}{\\cos A} = \\frac{b}{\\cos B}$</span>
                        </button>
                    </div>
                </div>
                
                <div id="step2Container" style="display:none; margin-top: 10px;"></div>
                <div id="step3Container" style="display:none; margin-top: 10px;"></div>
                <div id="feedbackArea" style="margin-top: 8px; font-weight:600;"></div>
            </div>
        `;
    }
    // --- DẠNG 2: CHO CẠNH VÀ GÓC ĐỐI DIỆN -> TÍNH BÁN KÍNH R ---
    else if (chosenType === 'find_R') {
        let angles = [30, 45, 60, 120, 135, 150];
        let angleA_val = angles[Math.floor(Math.random() * angles.length)];
        let radA = angleA_val * Math.PI / 180;

        let a = Math.floor(Math.random() * 10) + 3;
        let R = a / (2 * Math.sin(radA));

        // Tạo 2 cạnh b, c hợp lệ để vẽ tam giác
        let b = R * 2 * Math.sin(45 * Math.PI / 180);
        let angleC_deg = 180 - angleA_val - 45;
        let c = R * 2 * Math.sin(angleC_deg * Math.PI / 180);

        currentQuestion = {
            type: 'sine_side_angle_R',
            givenSide: 'a',
            targetSide: 'none',
            ansR: Math.round(R * 100) / 100,
            a: a, b: b, c: c,
            angleA: angleA_val
        };

        drawTriangleByScenario(a, b, c, 'sine_side_angle_R');

        const quizArea = document.getElementById("sineQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header">
                    <span><b>Đề bài:</b> Cho $\\Delta ABC$ có cạnh $a = ${a}$ và góc $\\widehat{A} = ${angleA_val}^{\\circ}$. Tính bán kính đường tròn ngoại tiếp $R$ của tam giác?</span>
                </div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn công thức tính bán kính $R$ suy ra từ định lý Sin</b></label>
                    <div id="step1Buttons" style="display:flex; flex-direction:column; gap:6px;">
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineRStep1(this, 'correct')">
                            <span>$R = \\frac{a}{2 \\sin A}$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineRStep1(this, 'wrong')">
                            <span>$R = \\frac{a}{\\sin A}$</span>
                        </button>
                    </div>
                </div>
                
                <div id="step2Container" style="display:none; margin-top: 10px;"></div>
                <div id="feedbackArea" style="margin-top: 8px; font-weight:600;"></div>
            </div>
        `;
    }
    // --- DẠNG 3: CHO BÁN KÍNH R VÀ GÓC -> TÍNH CẠNH ĐỐI DIỆN ---
    else if (chosenType === 'side_from_R') {
        let angles = [30, 45, 60, 120, 135, 150];
        let angleA_val = angles[Math.floor(Math.random() * angles.length)];
        let radA = angleA_val * Math.PI / 180;

        let R = Math.floor(Math.random() * 10) + 3; // R từ 6 đến 10
        let a = 2 * R * Math.sin(radA);

        let b = R * 2 * Math.sin(45 * Math.PI / 180);
        let angleC_deg = 180 - angleA_val - 45;
        let c = R * 2 * Math.sin(angleC_deg * Math.PI / 180);

        currentQuestion = {
            type: 'sine_side_angle_R',
            givenSide: 'none',
            targetSide: 'a',
            ansSide: Math.round(a * 100) / 100,
            a: a, b: b, c: c,
            R: R, angleA: angleA_val
        };

        drawTriangleByScenario(a, b, c, 'sine_side_angle_R');

        const quizArea = document.getElementById("sineQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header">
                    <span><b>Đề bài:</b> Cho $\\Delta ABC$ nội tiếp đường tròn bán kính $R = ${R}$ và có $\\widehat{A} = ${angleA_val}^{\\circ}$. Tính độ dài cạnh $a$?</span>
                </div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn công thức tính cạnh $a$ theo $R$ và $\\sin A$</b></label>
                    <div id="step1Buttons" style="display:flex; flex-direction:column; gap:6px;">
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineFromRStep1(this, 'correct')">
                            <span>$a = 2R \\sin A$</span>
                        </button>
                        <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineFromRStep1(this, 'wrong')">
                            <span>$a = R \\sin A$</span>
                        </button>
                    </div>
                </div>
                
                <div id="step2Container" style="display:none; margin-top: 10px;"></div>
                <div id="feedbackArea" style="margin-top: 8px; font-weight:600;"></div>
            </div>
        `;
    }

    triggerMathRender();
}

// --- HÀM XỬ LÝ TƯƠNG TÁC TỪNG BƯỚC CHO THẺ 2 ---
function checkSineStep1(btnElement, status) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step1Buttons");
    const allButtons = container.querySelectorAll("button");

    if (status === 'correct') {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Chính xác! Mối liên hệ là $\\frac{a}{\\sin A} = \\frac{b}{\\sin B}$.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) btn.style.display = "none";
            else { btn.className = "btn btn-success"; btn.disabled = true; }
        });

        const step2 = document.getElementById("step2Container");
        step2.style.display = "block";
        step2.innerHTML = `
            <label style="display:block; margin-bottom:6px;"><b>Bước 2: Biến đổi suy ra công thức tính $b$</b></label>
            <div id="step2Buttons" style="display:flex; flex-direction:column; gap:6px;">
                <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineStep2(this, 'correct')">
                    <span>$b = \\frac{a \\cdot \\sin B}{\\sin A}$</span>
                </button>
                <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkSineStep2(this, 'wrong')">
                    <span>$b = \\frac{a \\cdot \\sin A}{\\sin B}$</span>
                </button>
            </div>
        `;
        triggerMathRender();
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa đúng, tỉ số định lý Sin là tỉ số giữa cạnh và sin của góc ĐỐI DIỆN cạnh đó.</span>`;
        btnElement.style.display = "none";
    }
}

function checkSineStep2(btnElement, status) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step2Buttons");
    const allButtons = container.querySelectorAll("button");

    if (status === 'correct') {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Rất tốt! Giờ hãy tính giá trị số.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) btn.style.display = "none";
            else { btn.className = "btn btn-success"; btn.disabled = true; }
        });

        const step3 = document.getElementById("step3Container");
        step3.style.display = "block";
        step3.innerHTML = `
            <label><b>Bước 3: Điền độ dài cạnh $b$ (làm tròn đến 2 chữ số thập phân)</b></label>
            <div class="input-row" style="margin-top:6px;">
                <input type="text" id="txtSineStep3" placeholder="Nhập độ dài b...">
                <button class="btn btn-primary" onclick="checkSineStep3()">Nộp bài</button>
            </div>
        `;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Biến đổi nhân chéo chia ngang chưa đúng!</span>`;
        btnElement.style.display = "none";
    }
}

function checkSineStep3() {
    let studentVal = parseFloat(document.getElementById("txtSineStep3").value.trim().replace(',', '.'));
    let trueVal = currentQuestion.ansSide;
    let feedback = document.getElementById("feedbackArea");

    if (!isNaN(studentVal) && Math.abs(studentVal - trueVal) <= 0.05) {
        feedback.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">🎉 Hoàn thành xuất sắc! Đáp án: $b \\approx ${trueVal}$</span>`;
        document.getElementById("txtSineStep3").disabled = true;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa chính xác. Đáp án đúng là $b \\approx ${trueVal}$.</span>`;
    }
    triggerMathRender();
}

function checkSineRStep1(btnElement, status) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step1Buttons");
    const allButtons = container.querySelectorAll("button");

    if (status === 'correct') {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Chính xác! $a / \\sin A = 2R \\Rightarrow R = a / (2 \\sin A)$.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) btn.style.display = "none";
            else { btn.className = "btn btn-success"; btn.disabled = true; }
        });

        const step2 = document.getElementById("step2Container");
        step2.style.display = "block";
        step2.innerHTML = `
            <label><b>Bước 2: Điền bán kính $R$ (làm tròn đến 2 chữ số thập phân)</b></label>
            <div class="input-row" style="margin-top:6px;">
                <input type="text" id="txtSineRStep2" placeholder="Nhập bán kính R...">
                <button class="btn btn-primary" onclick="checkSineRStep2()">Nộp bài</button>
            </div>
        `;
        triggerMathRender();
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Quên chia 2! Vì $a / \\sin A = 2R$.</span>`;
        btnElement.style.display = "none";
    }
}

function checkSineRStep2() {
    let studentVal = parseFloat(document.getElementById("txtSineRStep2").value.trim().replace(',', '.'));
    let trueVal = currentQuestion.ansR;
    let feedback = document.getElementById("feedbackArea");

    if (!isNaN(studentVal) && Math.abs(studentVal - trueVal) <= 0.05) {
        feedback.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">🎉 Chính xác tuyệt đối! $R \\approx ${trueVal}$</span>`;
        document.getElementById("txtSineRStep2").disabled = true;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa chính xác. Đáp án chuẩn là $R \\approx ${trueVal}$.</span>`;
    }
    triggerMathRender();
}

function checkSineFromRStep1(btnElement, status) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step1Buttons");
    const allButtons = container.querySelectorAll("button");

    if (status === 'correct') {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Rất tốt! Công thức chuẩn là $a = 2R \\sin A$.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) btn.style.display = "none";
            else { btn.className = "btn btn-success"; btn.disabled = true; }
        });

        const step2 = document.getElementById("step2Container");
        step2.style.display = "block";
        step2.innerHTML = `
            <label><b>Bước 2: Điền độ dài cạnh $a$ (làm tròn đến 2 chữ số thập phân)</b></label>
            <div class="input-row" style="margin-top:6px;">
                <input type="text" id="txtSineFromRStep2" placeholder="Nhập độ dài a...">
                <button class="btn btn-primary" onclick="checkSineFromRStep2()">Nộp bài</button>
            </div>
        `;
        triggerMathRender();
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Thiếu hệ số 2! Công thức chuẩn là $a = 2R \\sin A$.</span>`;
        btnElement.style.display = "none";
    }
}

function checkSineFromRStep2() {
    let studentVal = parseFloat(document.getElementById("txtSineFromRStep2").value.trim().replace(',', '.'));
    let trueVal = currentQuestion.ansSide;
    let feedback = document.getElementById("feedbackArea");

    if (!isNaN(studentVal) && Math.abs(studentVal - trueVal) <= 0.05) {
        feedback.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">🎉 Hoàn thành xuất sắc! $a \\approx ${trueVal}$</span>`;
        document.getElementById("txtSineFromRStep2").disabled = true;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa đúng. Kết quả chuẩn là $a \\approx ${trueVal}$.</span>`;
    }
    triggerMathRender();
}


// ==========================================
// THẺ 3: CÁC CÔNG THỨC DIỆN TÍCH TAM GIÁC (2 BƯỚC INTERACTIVE)
// ==========================================
function renderAreaTab(container) {
    container.innerHTML = `
        <h3>📐 Thẻ 3: Các Công Thức Diện Tích Tam Giác</h3>
        <p class="hint">Luyện tập tính diện tích tam giác qua công thức tích cạnh với Sin góc xen giữa và công thức Hê-rông.</p>
        
        <div class="input-group" style="margin: 12px 0;">
            <label><b>Chọn dạng bài tập diện tích:</b></label>
            <select id="areaTypeSelect" class="input-group" style="margin-top: 4px;">
                <option value="1">Dạng 1: Cho 2 cạnh và góc xen giữa (S = 1/2 b.c.sinA)</option>
                <option value="2">Dạng 2: Cho 3 cạnh tam giác (Công thức Hê-rông)</option>
                <option value="3" selected>Dạng 3: Ngẫu nhiên cả 2 dạng</option>
            </select>
        </div>
        
        <button class="btn btn-primary" onclick="startAreaQuestion()">Tạo câu hỏi mới</button>
        <div id="areaQuizArea"></div>
    `;
    updateViewportInfo("Công thức diện tích: S = 1/2 b.c.sinA | S = sqrt(p(p-a)(p-b)(p-c))");
    startAreaQuestion();
}

function startAreaQuestion() {
    let selectVal = document.getElementById("areaTypeSelect") ? document.getElementById("areaTypeSelect").value : "3";
    let chosenType = selectVal;
    
    if (selectVal === "3") {
        chosenType = Math.random() < 0.5 ? "1" : "2";
    }

    // --- DẠNG 1: TÍNH DIỆN TÍCH THEO CÔNG THỨC S = 1/2 TÍCH 2 CẠNH NỔI VỚI SIN GÓC XEN GIỮA ---
    if (chosenType === "1") {
        let angles = [30, 45, 60, 120, 135, 150];
        let angleVal = angles[Math.floor(Math.random() * angles.length)];
        let targetAngle = ['A', 'B', 'C'][Math.floor(Math.random() * 3)];
        let a, b, c, givenText = "", S = 0;
        let rad = angleVal * Math.PI / 180;

        if (targetAngle === 'A') {
            b = Math.floor(Math.random() * 8) + 4;
            c = Math.floor(Math.random() * 8) + 4;
            a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));
            S = 0.5 * b * c * Math.sin(rad);
            givenText = `Cho $\\Delta ABC$ có $b = ${b}$, $c = ${c}$, $\\widehat{A} = ${angleVal}^{\\circ}$. Tính diện tích $S$ của tam giác?`;
        } else if (targetAngle === 'B') {
            a = Math.floor(Math.random() * 8) + 4;
            c = Math.floor(Math.random() * 8) + 4;
            b = Math.sqrt(a*a + c*c - 2*a*c*Math.cos(rad));
            S = 0.5 * a * c * Math.sin(rad);
            givenText = `Cho $\\Delta ABC$ có $a = ${a}$, $c = ${c}$, $\\widehat{B} = ${angleVal}^{\\circ}$. Tính diện tích $S$ của tam giác?`;
        } else {
            a = Math.floor(Math.random() * 8) + 4;
            b = Math.floor(Math.random() * 8) + 4;
            c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(rad));
            S = 0.5 * a * b * Math.sin(rad);
            givenText = `Cho $\\Delta ABC$ có $a = ${a}$, $b = ${b}$, $\\widehat{C} = ${angleVal}^{\\circ}$. Tính diện tích $S$ của tam giác?`;
        }

        let ansArea = Math.round(S * 100) / 100;

        currentQuestion = {
            type: 'area_sin',
            targetAngle: targetAngle,
            targetAngleVal: angleVal,
            ansArea: ansArea,
            a: a, b: b, c: c
        };

        drawTriangleByScenario(a, b, c, 'challenge_area');

        let formulas = [
            { id: 'correct', tex: '$S = \\frac{1}{2}bc \\sin A$', angle: 'A' },
            { id: 'wrong1', tex: '$S = \\frac{1}{2}ac \\sin B$', angle: 'B' },
            { id: 'wrong2', tex: '$S = \\frac{1}{2}ab \\sin C$', angle: 'C' }
        ];

        let shuffledFormulas = shuffleArray(formulas);

        let optionsHtml = shuffledFormulas.map(item => `
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkAreaSinStep1(this, '${item.angle}')">
                <span>${item.tex}</span>
            </button>
        `).join('');

        const quizArea = document.getElementById("areaQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header"><span><b>Đề bài:</b> ${givenText}</span></div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn công thức tính diện tích cần dùng</b></label>
                    <div id="step1Buttons" style="display:flex; flex-direction:column; gap:6px;">
                        ${optionsHtml}
                    </div>
                </div>
                
                <div id="step2Container" style="display:none; margin-top: 10px;"></div>
                <div id="feedbackArea" style="margin-top: 8px; font-weight:600;"></div>
            </div>
        `;
    } 
    // --- DẠNG 2: TÍNH DIỆN TÍCH THEO CÔNG THỨC HÊ-RÔNG (CHO 3 CẠNH) ---
    else if (chosenType === "2") {
        let a, b, c;
        do {
            a = Math.floor(Math.random() * 8) + 4;
            b = Math.floor(Math.random() * 8) + 4;
            c = Math.floor(Math.random() * 8) + 4;
        } while (!(a + b > c && a + c > b && b + c > a));

        let p = (a + b + c) / 2;
        let S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
        let ansArea = Math.round(S * 100) / 100;

        currentQuestion = {
            type: 'area_heron',
            ansArea: ansArea,
            p: p,
            a: a, b: b, c: c
        };

        drawTriangleByScenario(a, b, c, 'SSS');

        let heronOptions = [
            { id: 'correct', tex: '$S = \\sqrt{p(p-a)(p-b)(p-c)}$' },
            { id: 'wrong1', tex: '$S = \\sqrt{(p-a)(p-b)(p-c)}$' },
            { id: 'wrong2', tex: '$S = p(p-a)(p-b)(p-c)$' },
            { id: 'wrong3', tex: '$S = \\sqrt{p(a+p)(b+p)(c+p)}$' }
        ];

        let shuffledHeron = shuffleArray(heronOptions);

        let optionsHtml = shuffledHeron.map(item => `
            <button class="btn btn-secondary" style="justify-content:flex-start;" onclick="checkAreaHeronStep1(this, '${item.id}')">
                <span>${item.tex}</span>
            </button>
        `).join('');

        const quizArea = document.getElementById("areaQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header">
                    <span><b>Đề bài:</b> Cho $\\Delta ABC$ có $a = ${a}$, $b = ${b}$, $c = ${c}$. Tính diện tích $S$ của tam giác?</span>
                </div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn công thức Hê-rông chuẩn để tính diện tích</b></label>
                    <div id="step1Buttons" style="display:flex; flex-direction:column; gap:6px;">
                        ${optionsHtml}
                    </div>
                </div>
                
                <div id="step2Container" style="display:none; margin-top: 10px;"></div>
                <div id="feedbackArea" style="margin-top: 8px; font-weight:600;"></div>
            </div>
        `;
    }

    triggerMathRender();
}

function checkAreaSinStep1(btnElement, selectedAngle) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step1Buttons");
    const allButtons = container.querySelectorAll("button");
    const targetAngle = currentQuestion.targetAngle;

    if (selectedAngle === targetAngle) {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Chính xác! Dùng góc $\\widehat{${targetAngle}}$ xen giữa hai cạnh.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) btn.style.display = "none";
            else { btn.className = "btn btn-success"; btn.disabled = true; }
        });

        const step2 = document.getElementById("step2Container");
        step2.style.display = "block";
        step2.innerHTML = `
            <label><b>Bước 2: Điền diện tích $S$ (làm tròn đến 2 chữ số thập phân)</b></label>
            <div class="input-row" style="margin-top:6px;">
                <input type="text" id="txtAreaSinStep2" placeholder="Nhập kết quả S...">
                <button class="btn btn-primary" onclick="checkAreaSinStep2()">Nộp bài</button>
            </div>
        `;
        triggerMathRender();
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa đúng, đề bài cho góc $\\widehat{${targetAngle}}$, cần chọn công thức chứa $\\sin ${targetAngle}$.</span>`;
        btnElement.style.display = "none";
    }
}

function checkAreaSinStep2() {
    let studentVal = parseFloat(document.getElementById("txtAreaSinStep2").value.trim().replace(',', '.'));
    let trueVal = currentQuestion.ansArea;
    let feedback = document.getElementById("feedbackArea");

    if (!isNaN(studentVal) && Math.abs(studentVal - trueVal) <= 0.05) {
        feedback.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">🎉 Hoàn thành xuất sắc! Đáp án: $S \\approx ${trueVal}$</span>`;
        document.getElementById("txtAreaSinStep2").disabled = true;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa chính xác. Đáp án đúng là $S \\approx ${trueVal}$.</span>`;
    }
    triggerMathRender();
}

function checkAreaHeronStep1(btnElement, statusId) {
    const feedback = document.getElementById("feedbackArea");
    const container = document.getElementById("step1Buttons");
    const allButtons = container.querySelectorAll("button");

    if (statusId === 'correct') {
        feedback.innerHTML = `<span style="color:var(--success-color);">✔ Rất chính xác! Công thức Hê-rông là $S = \\sqrt{p(p-a)(p-b)(p-c)}$.</span>`;
        allButtons.forEach(btn => {
            if (btn !== btnElement) btn.style.display = "none";
            else { btn.className = "btn btn-success"; btn.disabled = true; }
        });

        let p = currentQuestion.p;
        const step2 = document.getElementById("step2Container");
        step2.style.display = "block";
        step2.innerHTML = `
            <div style="background:#f1f5f9; padding:8px 12px; border-radius:6px; margin-bottom:8px; font-size:0.9rem;">
                💡 <i>Gợi ý: Nửa chu vi $p = \\frac{${currentQuestion.a} + ${currentQuestion.b} + ${currentQuestion.c}}{2} = ${p}$</i>
            </div>
            <label><b>Bước 2: Điền diện tích $S$ (làm tròn đến 2 chữ số thập phân)</b></label>
            <div class="input-row" style="margin-top:6px;">
                <input type="text" id="txtAreaHeronStep2" placeholder="Nhập kết quả S...">
                <button class="btn btn-primary" onclick="checkAreaHeronStep2()">Nộp bài</button>
            </div>
        `;
        triggerMathRender();
    } else {
        let msg = "✖ Sai công thức Hê-rông!";
        if (statusId === 'wrong1') msg = "✖ Chưa đúng, công thức Hê-rông thiếu nửa chu vi $p$ dưới dấu căn.";
        else if (statusId === 'wrong2') msg = "✖ Chưa đúng, công thức Hê-rông phải nằm trong dấu căn bậc hai.";
        else if (statusId === 'wrong3') msg = "✖ Chưa đúng, các thừa số phải là $(p-a)$, $(p-b)$, $(p-c)$.";

        feedback.innerHTML = `<span style="color:var(--danger-color);">${msg}</span>`;
        btnElement.style.display = "none";
    }
}

function checkAreaHeronStep2() {
    let studentVal = parseFloat(document.getElementById("txtAreaHeronStep2").value.trim().replace(',', '.'));
    let trueVal = currentQuestion.ansArea;
    let feedback = document.getElementById("feedbackArea");

    if (!isNaN(studentVal) && Math.abs(studentVal - trueVal) <= 0.05) {
        feedback.innerHTML = `<span style="color:var(--success-color); font-weight:bold;">🎉 Tuyệt vời! Đáp án đúng: $S \\approx ${trueVal}$</span>`;
        document.getElementById("txtAreaHeronStep2").disabled = true;
    } else {
        feedback.innerHTML = `<span style="color:var(--danger-color);">✖ Chưa đúng. Đáp án chuẩn là $S \\approx ${trueVal}$.</span>`;
    }
    triggerMathRender();
}


// ==========================================
// THẺ 4: THỬ THÁCH PHẢN XẠ TỔNG HỢP (KHÔNG GỢI Ý)
// ==========================================

let studentName = "";
let challengeTotalAttempts = 0; // Tổng số bài đã làm

function renderChallengeTab(container) {
    container.innerHTML = `
        <h3>⚡ Thẻ 4: Thử Thách Phản Xạ Tổng Hợp</h3>
        
        <div id="challengeSetupBox" class="function-card" style="margin-top: 12px; background: #fff;">
            <div class="card-header" style="color: var(--primary-color);">
                <span>📋 <b>ĐĂNG KÝ PHIÊN THỬ THÁCH</b></span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
                <div class="input-group">
                    <label><b>Họ và tên học sinh:</b></label>
                    <input type="text" id="inputStudentName" placeholder="Nhập họ và tên của bạn..." style="margin-top:4px;">
                </div>
                <div class="input-group">
                    <label><b>Nhập điểm ngưỡng hoàn thành (tối thiểu 5):</b></label>
                    <input type="number" id="inputTargetScore" value="5" min="5" max="20" style="margin-top:4px;">
                </div>
                
                <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 6px; font-size: 0.85rem; line-height: 1.4;">
                    <b style="color: var(--warning-color);">📜 LUẬT CHƠI:</b>
                    <ul style="margin-left: 18px; margin-top: 4px;">
                        <li>Đề bài tổng hợp ngẫu nhiên các bài toán Tính cạnh, Tính góc/Cos, Tính bán kính R, Tính diện tích S.</li>
                        <li>Trả lời <b>Chính xác</b>: <b>+1 điểm</b>. Trả lời <b>Chưa đúng</b>: <b>-1 điểm</b>.</li>
                        <li>Hệ thống lưu lại <b>Tổng số bài đã làm</b> để Giáo viên đánh giá mức độ phản xạ.</li>
                    </ul>
                </div>

                <button class="btn btn-warning" onclick="startChallengeSession()" style="margin-top: 4px; font-weight: bold;">🚀 Bắt đầu làm bài</button>
            </div>
        </div>
        <div id="challengeQuizArea"></div>
    `;
    updateViewportInfo("Chế độ thử thách tốc độ phản xạ hệ thức lượng");
}

function startChallengeSession() {
    let nameInput = document.getElementById("inputStudentName").value.trim();
    if (!nameInput) {
        alert("Vui lòng nhập Họ và tên trước khi bắt đầu thử thách!");
        return;
    }
    
    studentName = nameInput;
    targetScore = parseInt(document.getElementById("inputTargetScore").value) || 5;
    challengeScore = 0;
    challengeTotalAttempts = 0;

    // Ẩn form đăng ký
    const setupBox = document.getElementById("challengeSetupBox");
    if (setupBox) setupBox.style.display = "none";

    nextChallengeQuestion();
}

function nextChallengeQuestion() {
    // Ngẫu nhiên chọn 1 trong 5 dạng câu hỏi tổng hợp từ Thẻ 1, 2, 3
    let types = ['cosine_side', 'cosine_angle', 'sine_side', 'sine_R', 'area'];
    let chosenType = types[Math.floor(Math.random() * types.length)];

    let qText = "";
    let ansVal = 0;
    let scenario = "";

    // 1. DẠNG COSIN - TÍNH CẠNH
    if (chosenType === 'cosine_side') {
        let b = Math.floor(Math.random() * 8) + 4;
        let c = Math.floor(Math.random() * 8) + 4;
        let angles = [30, 45, 60, 120, 135, 150];
        let angleA = angles[Math.floor(Math.random() * angles.length)];
        let rad = angleA * Math.PI / 180;
        let a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));

        ansVal = Math.round(a * 100) / 100;
        qText = `Cho $\\Delta ABC$ có $b = ${b}$, $c = ${c}$, $\\widehat{A} = ${angleA}^{\\circ}$. Tính độ dài cạnh $a$?`;
        scenario = 'cosine_side';

        currentQuestion = { type: scenario, target: 'A', targetAngleVal: angleA, a: a, b: b, c: c, ans: ansVal };
    }
    // 2. DẠNG COSIN - TÍNH COS GÓC
    else if (chosenType === 'cosine_angle') {
        let a, b, c;
        do {
            a = Math.floor(Math.random() * 8) + 4;
            b = Math.floor(Math.random() * 8) + 4;
            c = Math.floor(Math.random() * 8) + 4;
        } while (!(a + b > c && a + c > b && b + c > a));

        let cosA = (b*b + c*c - a*a) / (2 * b * c);
        ansVal = Math.round(cosA * 10000) / 10000; // Làm tròn 4 chữ số thập phân
        qText = `Cho $\\Delta ABC$ có $a = ${a}$, $b = ${b}$, $c = ${c}$. Tính giá trị $\\cos A$ (làm tròn 4 chữ số thập phân)?`;
        scenario = 'cosine_angle';

        currentQuestion = { type: scenario, target: 'A', a: a, b: b, c: c, ans: ansVal };
    }
    // 3. DẠNG SIN - TÍNH CẠNH TỪ 2 GÓC 1 CẠNH
    else if (chosenType === 'sine_side') {
        let angles = [30, 45, 60, 120, 135, 150];
        let angleA = angles[Math.floor(Math.random() * angles.length)];
        let rem = 180 - angleA;
        let validB = [];
        for (let bDeg = 5; bDeg <= rem - 5; bDeg += 5) validB.push(bDeg);
        let angleB = validB[Math.floor(Math.random() * validB.length)];
        let angleC = 180 - angleA - angleB;

        let radA = angleA * Math.PI / 180;
        let radB = angleB * Math.PI / 180;

        let a = Math.floor(Math.random() * 8) + 4;
        let b = a * Math.sin(radB) / Math.sin(radA);
        let c = a * Math.sin(angleC * Math.PI / 180) / Math.sin(radA);

        ansVal = Math.round(b * 100) / 100;
        qText = `Cho $\\Delta ABC$ có $a = ${a}$, $\\widehat{A} = ${angleA}^{\\circ}$, $\\widehat{B} = ${angleB}^{\\circ}$. Tính độ dài cạnh $b$?`;
        scenario = 'sine_two_angles_one_side';

        currentQuestion = { type: scenario, givenSide: 'a', targetSide: 'b', givenAngles: { A: angleA, B: angleB }, a: a, b: b, c: c, ans: ansVal };
    }
    // 4. DẠNG SIN - TÍNH BÁN KÍNH R
    else if (chosenType === 'sine_R') {
        let angles = [30, 45, 60, 120, 135, 150];
        let angleA = angles[Math.floor(Math.random() * angles.length)];
        let radA = angleA * Math.PI / 180;

        let a = Math.floor(Math.random() * 8) + 4;
        let R = a / (2 * Math.sin(radA));

        let b = R * 2 * Math.sin(45 * Math.PI / 180);
        let angleC = 180 - angleA - 45;
        let c = R * 2 * Math.sin(angleC * Math.PI / 180);

        ansVal = Math.round(R * 100) / 100;
        qText = `Cho $\\Delta ABC$ có $a = ${a}$, $\\widehat{A} = ${angleA}^{\\circ}$. Tính bán kính đường tròn ngoại tiếp $R$?`;
        scenario = 'sine_side_angle_R';

        currentQuestion = { type: scenario, givenSide: 'a', targetSide: 'none', angleA: angleA, a: a, b: b, c: c, ans: ansVal };
    }
    // 5. DẠNG DIỆN TÍCH S (SIN HOẶC HERON)
    else {
        if (Math.random() < 0.5) {
            let b = Math.floor(Math.random() * 8) + 4;
            let c = Math.floor(Math.random() * 8) + 4;
            let angles = [30, 45, 60, 120, 135, 150];
            let angleA = angles[Math.floor(Math.random() * angles.length)];
            let rad = angleA * Math.PI / 180;
            let a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));
            let S = 0.5 * b * c * Math.sin(rad);

            ansVal = Math.round(S * 100) / 100;
            qText = `Cho $\\Delta ABC$ có $b = ${b}$, $c = ${c}$, $\\widehat{A} = ${angleA}^{\\circ}$. Tính diện tích $S$?`;
            scenario = 'area_sin';

            currentQuestion = { type: scenario, targetAngle: 'A', targetAngleVal: angleA, a: a, b: b, c: c, ans: ansVal };
        } else {
            let a, b, c;
            do {
                a = Math.floor(Math.random() * 8) + 4;
                b = Math.floor(Math.random() * 8) + 4;
                c = Math.floor(Math.random() * 8) + 4;
            } while (!(a + b > c && a + c > b && b + c > a));

            let p = (a + b + c) / 2;
            let S = Math.sqrt(p * (p - a) * (p - b) * (p - c));

            ansVal = Math.round(S * 100) / 100;
            qText = `Cho $\\Delta ABC$ có $a = ${a}$, $b = ${b}$, $c = ${c}$. Tính diện tích $S$?`;
            scenario = 'area_heron';

            currentQuestion = { type: scenario, a: a, b: b, c: c, ans: ansVal };
        }
    }

    // Vẽ hình trên panel bên phải theo kịch bản tương ứng
    drawTriangleByScenario(currentQuestion.a, currentQuestion.b, currentQuestion.c, scenario);

    // Giao diện câu hỏi & khung điểm số
    const quizArea = document.getElementById("challengeQuizArea");
    quizArea.innerHTML = `
        <div class="function-card" style="margin-top: 12px; border-color: var(--warning-color);">
            <!-- BẢNG THÔNG TIN HỌC SINH VÀ TIẾN TRÌNH LÀM BÀI -->
            <div style="background: #fef3c7; border: 1px solid #fde047; padding: 10px; border-radius: 6px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: #92400e;">👤 Học sinh: ${studentName}</span>
                    <span style="font-weight: bold; color: var(--primary-color);">📊 Bài đã làm: ${challengeTotalAttempts}</span>
                </div>
                <div style="font-size: 0.95rem; font-weight: bold; color: #b45309;">
                    🎯 Điểm hiện tại: <span style="font-size: 1.1rem; color: var(--danger-color);">${challengeScore}</span> / Ngưỡng: ${targetScore}
                </div>
            </div>

            <div class="card-header">
                <span><b>Câu hỏi:</b> ${qText}</span>
            </div>

            <div class="input-row" style="margin-top: 10px;">
                <input type="text" id="txtChallengeAns" placeholder="Nhập đáp số...">
                <button class="btn btn-primary" id="btnSubmitChallenge" onclick="submitChallengeAnswer()">Nộp bài</button>
            </div>

            <div id="challengeFeedback" style="margin-top: 8px; font-weight: 600;"></div>
            
            <div id="nextButtonBox" style="display: none; margin-top: 10px; text-align: right;">
                <button class="btn btn-warning" onclick="nextChallengeQuestion()">➡️ Câu tiếp theo</button>
            </div>
        </div>
    `;

    triggerMathRender();
}

function submitChallengeAnswer() {
    let userAns = parseFloat(document.getElementById("txtChallengeAns").value.trim().replace(',', '.'));
    let trueAns = currentQuestion.ans;
    let feedback = document.getElementById("challengeFeedback");

    if (isNaN(userAns)) {
        alert("Vui lòng nhập số hợp lệ!");
        return;
    }

    challengeTotalAttempts += 1; // Tăng tổng số bài đã làm
    let isCorrect = Math.abs(userAns - trueAns) <= 0.05;

    if (isCorrect) {
        challengeScore += 1;
        feedback.innerHTML = `<span style="color:var(--success-color); font-size:1rem;">✔ Chính xác! (+1 điểm)</span>`;
    } else {
        challengeScore -= 1;
        feedback.innerHTML = `<span style="color:var(--danger-color); font-size:1rem;">✖ Chưa chính xác. Đáp án đúng là: <b>${trueAns}</b> (-1 điểm)</span>`;
    }

    // Khóa nút Nộp bài và input sau khi làm
    document.getElementById("txtChallengeAns").disabled = true;
    document.getElementById("btnSubmitChallenge").disabled = true;

    // Hiển thị nút Câu tiếp theo
    document.getElementById("nextButtonBox").style.display = "block";

    triggerMathRender();

    // Kiểm tra ngưỡng điểm chiến thắng
    if (challengeScore >= targetScore) {
        setTimeout(() => {
            alert(`🎉 CHÚC MỪNG ${studentName.toUpperCase()}!\nBạn đã xuất sắc đạt ngưỡng ${targetScore} điểm sau ${challengeTotalAttempts} bài làm!`);
        }, 300);
    }
}

/**
 * Hàm chụp hình SVG, tự động CROP bo sát tam giác + nhãn, nâng độ phân giải 200 PPI
 * và chép trực tiếp vào bộ nhớ tạm Clipboard.
 */
async function copyGraphToClipboard() {
    const svg = document.getElementById("coordinate-system");
    if (!svg) {
        alert("Không tìm thấy vùng hình vẽ SVG!");
        return;
    }

    if (!navigator.clipboard || !window.ClipboardItem) {
        alert("Trình duyệt không hỗ trợ sao chép hình ảnh trực tiếp vào Clipboard. Vui lòng chạy trên Chrome/Edge.");
        return;
    }

    const btnCopy = document.getElementById("btnCopyClipboard");
    if (btnCopy) {
        btnCopy.disabled = true;
        btnCopy.innerHTML = "⏳ Đang crop...";
    }

    try {
        // Lấy tọa độ crop chính xác từ biến toàn cục
        const cropX = Math.round(currentTriangleBBox.minX);
        const cropY = Math.round(currentTriangleBBox.minY);
        const cropWidth = Math.round(currentTriangleBBox.maxX - currentTriangleBBox.minX);
        const cropHeight = Math.round(currentTriangleBBox.maxY - currentTriangleBBox.minY);

        const targetPPI = 200;
        const defaultPPI = 96;
        const scaleFactor = targetPPI / defaultPPI;

        const canvasWidth = Math.round(cropWidth * scaleFactor);
        const canvasHeight = Math.round(cropHeight * scaleFactor);

        // QUAN TRỌNG: Chỉ lấy nội dung BÊN TRONG thẻ SVG (polygon, text...), không lấy thẻ <svg> ngoài!
        const innerSVGContent = svg.innerHTML;

        const croppedSvgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${cropWidth}" height="${cropHeight}" viewBox="${cropX} ${cropY} ${cropWidth} ${cropHeight}">
            <rect x="${cropX}" y="${cropY}" width="${cropWidth}" height="${cropHeight}" fill="#ffffff"/>
            ${innerSVGContent}
        </svg>`;

        const svgBlob = new Blob([croppedSvgString], { type: "image/svg+xml;charset=utf-8" });
        const URLObj = window.URL || window.webkitURL || window;
        const blobURL = URLObj.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = async function() {
            const canvas = document.createElement("canvas");
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const ctx = canvas.getContext("2d");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

            canvas.toBlob(async function(blob) {
                URLObj.revokeObjectURL(blobURL);
                if (!blob) {
                    alert("Không thể tạo hình ảnh từ Canvas!");
                    resetCopyButton();
                    return;
                }

                try {
                    const item = new ClipboardItem({ "image/png": blob });
                    await navigator.clipboard.write([item]);

                    if (btnCopy) {
                        btnCopy.innerHTML = "✔";
                        btnCopy.style.backgroundColor = "#16a34a";
                        btnCopy.style.color = "#ffffff";
                    }

                    setTimeout(() => { resetCopyButton(); }, 2000);
                } catch (err) {
                    console.error("Lỗi clipboard:", err);
                    alert("Không thể sao chép vào Clipboard: " + err.message);
                    resetCopyButton();
                }
            }, "image/png");
        };

        img.onerror = function() {
            alert("Lỗi tải hình ảnh SVG!");
            URLObj.revokeObjectURL(blobURL);
            resetCopyButton();
        };

        img.src = blobURL;

    } catch (e) {
        console.error(e);
        resetCopyButton();
    }
}

function resetCopyButton() {
    const btnCopy = document.getElementById("btnCopyClipboard");
    if (btnCopy) {
        btnCopy.disabled = false;
        btnCopy.innerHTML = "📋";
        btnCopy.style.backgroundColor = "";
        btnCopy.style.color = "";
    }
}


// FULL SCREEN BUTTON
const fullscreenBtn = document.getElementById("fullscreen-btn");

if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    });
}