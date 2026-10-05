// --- DỮ LIỆU VÀ TRẠNG THÁI ỨNG DỤNG ---
let currentTab = 1;
let currentQuestion = null; 
let challengeScore = 0;
let targetScore = 5;

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
    let rand = Math.random(); // Sinh số ngẫu nhiên từ 0.0 đến 1.0

    // Cấu hình tỷ lệ xác suất cho từng mức độ
    if (level === 1) {
        // --- MỨC 1: Tìm cạnh a hoặc góc A cơ bản ---
        if (rand < 0.70) {
            chosenType = 'side_a';   // 70% Tỷ lệ tính cạnh a
        } else {
            chosenType = 'angle_a';  // 30% Tỷ lệ tính cosA
        }
    } else if (level === 2) {
        // --- MỨC 2: Tính ngẫu nhiên cạnh bất kỳ (a, b, hoặc c) ---
        if (rand < 0.20) {
            chosenType = 'side_a';   // 40% Tính cạnh a
        } else if (rand < 0.60) {
            chosenType = 'side_b';   // 30% Tính cạnh b
        } else {
            chosenType = 'side_c';   // 30% Tính cạnh c
        }
    } else if (level === 3) {
        // --- MỨC 3: Tổng hợp (Tính cạnh bất kỳ & tính Cos các góc) ---
        if (rand < 0.15) {
            chosenType = 'side_a';   // 20% Tính cạnh a
        } else if (rand < 0.35) {
            chosenType = 'side_b';   // 20% Tính cạnh b
        } else if (rand < 0.55) {
            chosenType = 'side_c';   // 20% Tính cạnh c
        } else if (rand < 0.70) {
            chosenType = 'cos_a';    // 13.3% Tính cosA
        } else if (rand < 0.85) {
            chosenType = 'cos_b';    // 13.3% Tính cosB
        } else {
            chosenType = 'cos_c';    // 13.4% Tính cosC
        }
    }

    // --- TRƯỜNG HỢP 1: TÍNH CẠNH (a, b hoặc c) ---
    if (chosenType.startsWith('side')) {
        let targetSide = chosenType.split('_')[1].toUpperCase(); // 'A', 'B', hoặc 'C'
        
        let a, b, c;
        let angles = [30, 45, 60, 120, 135, 150];
		let angleVal = angles[Math.floor(Math.random() * angles.length)];
        let rad = angleVal * Math.PI / 180;

        if (targetSide === 'A') {
            b = Math.floor(Math.random() * 4) + 5;
            c = Math.floor(Math.random() * 4) + 5;
            a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));
        } else if (targetSide === 'B') {
            a = Math.floor(Math.random() * 4) + 5;
            c = Math.floor(Math.random() * 4) + 5;
            b = Math.sqrt(a*a + c*c - 2*a*c*Math.cos(rad));
        } else { // 'C'
            a = Math.floor(Math.random() * 4) + 5;
            b = Math.floor(Math.random() * 4) + 5;
            c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(rad));
        }

        currentQuestion = {
            type: 'cosine_side',
            target: targetSide, // 'A', 'B', 'C'
            ansSide: Math.round((targetSide === 'A' ? a : targetSide === 'B' ? b : c) * 100) / 100,
            a: a, b: b, c: c,
            targetAngleVal: angleVal
        };

        drawTriangleThreeSidesSVG(a, b, c);

        let sideLower = targetSide.toLowerCase();
        let givenText = "";
        if (targetSide === 'A') givenText = `Cho $\\Delta ABC$ có $b = ${b}$, $c = ${c}$, $\\widehat{A} = ${angleVal}^{\\circ}$. Tính $a$?`;
        else if (targetSide === 'B') givenText = `Cho $\\Delta ABC$ có $a = ${a}$, $c = ${c}$, $\\widehat{B} = ${angleVal}^{\\circ}$. Tính $b$?`;
        else givenText = `Cho $\\Delta ABC$ có $a = ${a}$, $b = ${b}$, $\\widehat{C} = ${angleVal}^{\\circ}$. Tính $c$?`;

        const quizArea = document.getElementById("cosineQuizArea");
        quizArea.innerHTML = `
            <div class="function-card" style="margin-top: 12px;">
                <div class="card-header"><span><b>Đề bài:</b> ${givenText}</span></div>
                
                <div id="step1Container">
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn công thức định lý Cosin gốc xuất phát chứa cạnh $${sideLower}$</b></label>
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
        let a = 7, b = 6, c = 8;
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
                    <label style="display:block; margin-bottom:6px;"><b>Bước 1: Chọn định lý Cosin gốc xuất phát chứa góc $\\widehat{${targetCos}}$</b></label>
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
            <label><b>Bước 3: Điền giá trị $\\cos ${targetAngle}$ (làm tròn đến 4 chữ số thập phân, VD: 0.5234)</b></label>
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
    let b = Math.floor(Math.random() * 4) + 5;
    let c = Math.floor(Math.random() * 4) + 5;
    let angleA = [30, 45, 60][Math.floor(Math.random() * 3)];
    let rad = angleA * Math.PI / 180;
    let a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(rad));

    let area = 0.5 * b * c * Math.sin(rad);
    let trueAns = Math.round(area * 100) / 100;

    currentQuestion = { ans: trueAns, a: a, b: b, c: c };
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
// HỆ THỐNG VẼ HÌNH SVG TỰ ĐỘNG CÂN BẰNG TỶ LỆ (FIT VIEWPORT)
// ==========================================
// ==========================================
// HỆ THỐNG VẼ HÌNH SVG TỰ ĐỘNG CÂN BẰNG TỶ LỆ (LABEL HIỂN THỊ THEO ĐỀ BÀI)
// ==========================================
function drawTriangleThreeSidesSVG(a, b, c) {
    const svg = document.getElementById("coordinate-system");
    if (!svg) return;
    svg.innerHTML = "";

    // 1. Lấy kích thước thực tế của vùng chứa (Graph Viewport)
    const viewport = svg.parentElement;
    const viewWidth = viewport ? viewport.clientWidth : 500;
    const viewHeight = viewport ? viewport.clientHeight : 400;

    // Cập nhật thuộc tính viewBox linh hoạt khớp với chiều rộng / chiều cao thực tế
    svg.setAttribute("viewBox", `0 0 ${viewWidth} ${viewHeight}`);

    // 2. Tính tọa độ gốc toán học của các đỉnh (gốc A tại (0,0))
    let cosA = (b*b + c*c - a*a) / (2 * b * c);
    cosA = Math.max(-1, Math.min(1, cosA));
    let angleA_rad = Math.acos(cosA);

    let Ax = 0, Ay = 0;
    let Bx = c, By = 0;
    let Cx = b * Math.cos(angleA_rad), Cy = b * Math.sin(angleA_rad);

    // 3. Tìm Bounding Box nguyên bản của tam giác
    let minX = Math.min(Ax, Bx, Cx);
    let maxX = Math.max(Ax, Bx, Cx);
    let minY = Math.min(Ay, By, Cy);
    let maxY = Math.max(Ay, By, Cy);

    let rawWidth = maxX - minX;
    let rawHeight = maxY - minY;

    // 4. Tính toán tỷ lệ Scale tự động sao cho vừa khít màn hình và dành Margin cho Label
    const paddingX = 60;
    const paddingY = 60;

    let availWidth = Math.max(viewWidth - 2 * paddingX, 100);
    let availHeight = Math.max(viewHeight - 2 * paddingY, 100);

    let scaleX = availWidth / rawWidth;
    let scaleY = availHeight / rawHeight;
    let scale = Math.min(scaleX, scaleY);

    // 5. Căn giữa tam giác trong vùng vẽ SVG
    let scaledWidth = rawWidth * scale;
    let scaledHeight = rawHeight * scale;

    let offsetX = (viewWidth - scaledWidth) / 2 - minX * scale;
    let offsetY = (viewHeight - scaledHeight) / 2 + maxY * scale; 

    // Chuyển đổi tọa độ toán học sang tọa độ màn hình SVG
    let screenAx = Ax * scale + offsetX;
    let screenAy = offsetY - Ay * scale;

    let screenBx = Bx * scale + offsetX;
    let screenBy = offsetY - By * scale;

    let screenCx = Cx * scale + offsetX;
    let screenCy = offsetY - Cy * scale;

    // 6. Vẽ Đa giác Tam giác ABC
    let polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", `${screenAx},${screenAy} ${screenBx},${screenBy} ${screenCx},${screenCy}`);
    polygon.setAttribute("fill", "rgba(37, 99, 235, 0.08)");
    polygon.setAttribute("stroke", "#2563eb");
    polygon.setAttribute("stroke-width", "2.5");
    svg.appendChild(polygon);

    // 7. Định vị tên các đỉnh A, B, C
    let fontLabelSize = Math.max(Math.min(viewWidth * 0.035, 18), 14);

    createSvgText(svg, screenAx - 20, screenAy + 8, "A", `font-weight:bold; fill:#1e293b; font-size:${fontLabelSize}px;`);
    createSvgText(svg, screenBx + 8, screenBy + 8, "B", `font-weight:bold; fill:#1e293b; font-size:${fontLabelSize}px;`);
    createSvgText(svg, screenCx - 6, screenCy - 12, "C", `font-weight:bold; fill:#1e293b; font-size:${fontLabelSize}px;`);

    // 8. TÍNH TOÁN VÀ ẨN/HIỆN LABEL DỰA THEO ĐỀ BÀI (CURRENTQUESTION)
    let dispA = Math.round(a * 100) / 100;
    let dispB = Math.round(b * 100) / 100;
    let dispC = Math.round(c * 100) / 100;

    let labelTextA = `a = ${dispA}`;
    let labelTextB = `b = ${dispB}`;
    let labelTextC = `c = ${dispC}`;

    // Kiểm tra thông tin câu hỏi hiện tại để gán nhãn "?" cho phần tử cần tính
    if (typeof currentQuestion !== 'undefined' && currentQuestion) {
        if (currentQuestion.type === 'cosine_side') {
            // Câu hỏi tính cạnh
            let target = currentQuestion.target; // 'A', 'B', hoặc 'C'
            if (target === 'A') labelTextA = "a = ?";
            else if (target === 'B') labelTextB = "b = ?";
            else if (target === 'C') labelTextC = "c = ?";
        } else if (currentQuestion.type === 'cosine_angle') {
            // Câu hỏi tính góc/cosin: Hiển thị cả 3 cạnh vì đề cho biết 3 cạnh
            labelTextA = `a = ${dispA}`;
            labelTextB = `b = ${dispB}`;
            labelTextC = `c = ${dispC}`;
        }
    }

    let fontSideSize = Math.max(Math.min(viewWidth * 0.03, 15), 12);

    // Cạnh c (AB) - màu xám trung tính
    createSvgText(svg, (screenAx + screenBx) / 2, screenAy + 22, labelTextC, `fill:${labelTextC.includes('?') ? '#dc2626' : '#64748b'}; font-weight:${labelTextC.includes('?') ? 'bold' : 'normal'}; font-size:${fontSideSize}px; text-anchor:middle;`);
    
    // Cạnh b (AC)
    createSvgText(svg, (screenAx + screenCx) / 2 - 25, (screenAy + screenCy) / 2, labelTextB, `fill:${labelTextB.includes('?') ? '#dc2626' : '#64748b'}; font-weight:${labelTextB.includes('?') ? 'bold' : 'normal'}; font-size:${fontSideSize}px; text-anchor:middle;`);
    
    // Cạnh a (BC) - màu xanh lục hoặc đỏ nếu là cạnh cần tính
    createSvgText(svg, (screenBx + screenCx) / 2 + 25, (screenBy + screenCy) / 2, labelTextA, `fill:${labelTextA.includes('?') ? '#dc2626' : '#10b981'}; font-weight:bold; font-size:${fontSideSize}px; text-anchor:middle;`);

    updateViewportInfo(`Đang hiển thị tam giác ABC`);
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