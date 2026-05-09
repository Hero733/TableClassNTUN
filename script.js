// ==========================================
// ส่วนที่ 1: จัดการ UI ใหม่ สไตล์ PREMIUM CLEAN (เล่นได้เลย)
// ==========================================

const UI = {
    loginScreen: document.getElementById('login-screen'),
    mainApp: document.getElementById('main-app'),
    studentView: document.getElementById('student-view'),
    teacherView: document.getElementById('teacher-view'),
    qrSection: document.getElementById('join-section'),
    seatMapSection: document.getElementById('seat-map-section'),
    modal: document.getElementById('confirm-modal'),
    classroomGrid: document.getElementById('classroom-grid')
};

// ข้อมูลจำลองนักเรียน (เอาไว้เทส)
let currentUser = null; 

// จำลองที่นั่ง 20 ที่นั่ง
let seatsData = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    status: (i === 4 || i === 9) ? 'booked' : 'available', 
    bookedBy: (i === 4) ? 'ด.ช. สมพล' : (i === 9) ? 'ด.ญ. สมใจ' : ''
}));

let selectedSeatId = null;

// --- ฟังก์ชันเปลี่ยนหน้าจอ ---
function showMainApp(user) {
    currentUser = user;
    UI.loginScreen.classList.add('hidden');
    UI.loginScreen.classList.remove('active');
    UI.mainApp.classList.remove('hidden');

    document.getElementById('user-name').innerText = user.name;
    document.getElementById('user-email').innerText = user.email;

    // เช็กว่าเป็นครูหรือไม่ (สมมติให้อีเมลนี้เป็นครู)
    if (user.email === 'ntun21933@ntun.ac.th') {
        UI.studentView.classList.add('hidden');
        UI.teacherView.classList.remove('hidden');
        UI.teacherView.classList.add('active');
    } else {
        UI.studentView.classList.remove('hidden');
        UI.teacherView.classList.add('hidden');
    }
}

function logoutApp() {
    currentUser = null;
    UI.mainApp.classList.add('hidden');
    UI.loginScreen.classList.add('active');
    UI.loginScreen.classList.remove('hidden');
    
    // กลับไปหน้าสแกน QR ใหม่
    UI.qrSection.classList.remove('hidden');
    UI.seatMapSection.classList.add('hidden');
}

// --- ฟังก์ชันสร้างเก้าอี้ (อัปเดตสำหรับ CSS Chair Shape) ---
window.showSeatMap = function() {
    UI.qrSection.classList.add('hidden');
    UI.seatMapSection.classList.remove('hidden');
    renderSeats();
}

function renderSeats() {
    UI.classroomGrid.innerHTML = '';
    seatsData.forEach(seat => {
        const seatDiv = document.createElement('div');
        // ใช้คลาสใหม่ seat-ios และ status
        seatDiv.className = `seat-ios ${seat.status}`;
        
        let icon = seat.status === 'booked' ? '👤' : '🪑';
        // ถ้านั่งแล้วโชว์ชื่อย่อ ถ้าว่างโชว์เบอร์โต๊ะ
        let seatNumText = `T-${seat.id}`;
        let seatNameText = seat.status === 'booked' ? seat.bookedBy : 'ว่าง';

        // วาดโครงสร้างเก้าอี้ใหม่
        seatDiv.innerHTML = `
            <span class="seat-icon">${icon}</span>
            <span class="seat-num-text">${seatNumText}</span>
            <span class="seat-name-text">${seatNameText}</span>
        `;

        // ถ้าที่นั่งว่าง ให้กดจองได้
        if (seat.status === 'available') {
            seatDiv.onclick = () => openConfirmModal(seat.id);
        } else if (seat.status === 'booked' && seat.bookedBy === currentUser.name) {
             // ถ้านั่งของเราเอง
             seatDiv.className += " my-seat";
             seatDiv.innerHTML = `
                <span class="seat-icon">✅</span>
                <span class="seat-num-text">${seatNumText}</span>
                <span class="seat-name-text">ที่นั่งของคุณ</span>
             `;
        } else if (seat.status === 'booked') {
             // ถ้าคนอื่นนั่ง
             seatDiv.onclick = () => alert(`${seatNumText} จองโดย ${seat.bookedBy}`);
        }

        UI.classroomGrid.appendChild(seatDiv);
    });
}

// --- ระบบยืนยันการจองแบบ Major (Double Confirm) ---
function openConfirmModal(seatId) {
    selectedSeatId = seatId;
    document.getElementById('modal-seat-id').innerText = `T-${seatId}`;
    UI.modal.classList.remove('hidden');
}

document.getElementById('cancel-book-btn').onclick = () => {
    UI.modal.classList.add('hidden');
    selectedSeatId = null;
};

document.getElementById('confirm-book-btn').onclick = () => {
    // อัปเดตข้อมูล (จำลอง)
    const seatIndex = seatsData.findIndex(s => s.id === selectedSeatId);
    if (seatIndex > -1) {
        seatsData[seatIndex].status = 'booked';
        // ใส่ชื่อเรา
        seatsData[seatIndex].bookedBy = currentUser.name; 
    }
    
    UI.modal.classList.add('hidden');
    renderSeats(); // วาดเก้าอี้ใหม่
    alert('TableClassNTUN ยืนยันการจองสำเร็จ!');
};

// ==========================================
// ส่วนที่ 2: ระบบ Login ดักอีเมลโรงเรียน (จำลอง)
// ==========================================
document.getElementById('login-btn').onclick = () => {
    const mockEmail = prompt("จำลองการ Login Google:\nกรุณาใส่อีเมลโรงเรียน TCNTUN ของคุณ:", "ntun21934@ntun.ac.th");
    
    if (mockEmail) {
        if (mockEmail.endsWith("@ntun.ac.th")) {
            // ดึงรหัสประจำตัวจากอีเมลมาเป็นชื่อ
            const studentId = mockEmail.split('@')[0];
            const mockUser = {
                name: `นักเรียน ${studentId}`,
                email: mockEmail
            };
            showMainApp(mockUser);
        } else {
            alert("❌ TCNTUN Access Denied\nกรุณาใช่อีเมลของโรงเรียน (@ntun.ac.th) เท่านั้น!");
        }
    }
};

document.getElementById('logout-btn').onclick = logoutApp;
