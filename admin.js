const encryptionKey = "my_secret_key_123";

// ====== MÃ HÓA & GIẢI MÃ CCCD ======
function encryptCCCD(cccd) {
    return CryptoJS.AES.encrypt(cccd, encryptionKey).toString();
}

function decryptCCCD(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// ====== MÃ HÓA MẬT KHẨU SHA-256 ======
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ====== KHỞI TẠO ADMIN MẶC ĐỊNH ======
async function initializeApp() {
    if (!localStorage.getItem('adminUser')) {
        const hashedPass = await hashPassword("123456");
        const defaultUser = {
            username: "admin",
            password: hashedPass,
            role: "Quản lý",
            fullName: "Đăng nhập"
        };
        localStorage.setItem('adminUser', JSON.stringify(defaultUser));
    }

    loadUsers();

    const loggedInUserStr = localStorage.getItem('loggedInUser');
    if (loggedInUserStr) {
        const loggedInUser = JSON.parse(loggedInUserStr);
        showAdminPanel(loggedInUser);
    }
}

// ====== ĐĂNG NHẬP ======
async function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;
    const adminData = JSON.parse(localStorage.getItem('adminUser'));
    const users = JSON.parse(localStorage.getItem('users') || "[]");
    const hashedInputPass = await hashPassword(pass);

    if (user === adminData.username && hashedInputPass === adminData.password) {
        const loggedInUser = {
            username: user,
            role: adminData.role,
            fullName: adminData.fullName
        };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        showAdminPanel(loggedInUser);
        return;
    }

    const matchedUser = users.find(u => u.username === user && u.password === hashedInputPass);
    if (matchedUser) {
        const loggedInUser = {
            username: user,
            role: matchedUser.role,
            fullName: matchedUser.name
        };
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        showAdminPanel(loggedInUser);
        return;
    }

    Swal.fire({
        icon: 'error',
        title: 'Lỗi đăng nhập',
        text: 'Sai tài khoản hoặc mật khẩu!',
        confirmButtonText: 'OK'
    });
}

// ====== HIỂN THỊ GIAO DIỆN SAU LOGIN ======
function showAdminPanel(user) {
    document.querySelector(".login-container").classList.add("hidden");
    document.querySelector(".admin-panel").classList.remove("hidden");

    document.getElementById("welcomeRole").textContent = `Chào mừng ${user.role} ${user.fullName}`;

    if (user.role === "Quản lý") {
        document.getElementById("addUserBtn").classList.remove("hidden");
    }

    loadUsers();
}

// ====== ĐĂNG XUẤT ======
function logout() {
    localStorage.removeItem('loggedInUser');
    location.reload();
}

// ====== THÊM NGƯỜI DÙNG MỚI ======
async function addUser() {
    const name = document.getElementById("fullName").value.trim();
    const cccd = document.getElementById("cccd").value.trim();
    const role = document.getElementById("role").value;
    const username = document.getElementById("usernameUser").value.trim();
    const password = document.getElementById("passwordUser").value.trim();

    if (!name || !cccd || !username || !password) {
        Swal.fire({
            icon: 'warning',
            title: 'Thiếu thông tin',
            text: 'Vui lòng nhập đầy đủ thông tin.'
        });
        return;
    }

    const encryptedCCCD = encryptCCCD(cccd);
    const hashedPassword = await hashPassword(password);

    const users = JSON.parse(localStorage.getItem('users') || "[]");
    users.push({ name, cccd: encryptedCCCD, role, username, password: hashedPassword, passwordRaw: password });
    localStorage.setItem('users', JSON.stringify(users));

    document.getElementById("fullName").value = "";
    document.getElementById("cccd").value = "";
    document.getElementById("role").value = "Khách hàng";
    document.getElementById("usernameUser").value = "";
    document.getElementById("passwordUser").value = "";
    toggleAddForm();
    loadUsers();
}

// ====== HIỂN DANH SÁCH NGƯỜI DÙNG ======
function loadUsers() {
    const table = document.getElementById("userTable");
    table.innerHTML = "";
    const users = JSON.parse(localStorage.getItem('users') || "[]");
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const isManager = loggedInUser && loggedInUser.role === "Quản lý";

    table.innerHTML += `
        <tr>
            <th>Họ và tên</th>
            <th>CCCD</th>
            <th>Chức vụ</th>
            <th>Username</th>
            <th>Password</th>
            <th>Tính năng</th>
        </tr>
    `;

    users.forEach((user, index) => {
        const decryptedCCCD = decryptCCCD(user.cccd);
        const row = table.insertRow();
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${decryptedCCCD}</td>
            <td>${user.role}</td>
            <td>${user.username}</td>
            <td>${isManager ? user.passwordRaw : '••••••'}</td>
            <td>
                ${isManager ? `
                    <button onclick="deleteRow(${index})">Xóa</button>
                    <button onclick="editRow(${index})">Sửa</button>
                ` : 'Không có quyền'}
            </td>
        `;
    });
}

// ====== XÓA NGƯỜI DÙNG ======
function deleteRow(index) {
    const users = JSON.parse(localStorage.getItem('users') || "[]");

    Swal.fire({
        title: 'Xác nhận xóa?',
        text: "Bạn có chắc chắn muốn xóa?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            Swal.fire('Đã xóa!', '', 'success');
        }
    });
}

// ====== SỬA NGƯỜI DÙNG ======
async function editRow(index) {
    const users = JSON.parse(localStorage.getItem('users') || "[]");
    const user = users[index];
    const decryptedCCCD = decryptCCCD(user.cccd);

    Swal.fire({
        title: 'Sửa thông tin',
        html:
            `<input id="swal-name" class="swal2-input" placeholder="Họ tên" value="${user.name}">
             <input id="swal-cccd" class="swal2-input" placeholder="CCCD" value="${decryptedCCCD}">
             <input id="swal-role" class="swal2-input" placeholder="Vai trò" value="${user.role}">
             <input id="swal-username" class="swal2-input" placeholder="Username" value="${user.username}">
             <input id="swal-password" class="swal2-input" placeholder="Password mới">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Lưu',
        cancelButtonText: 'Hủy',
        preConfirm: () => {
            const newName = document.getElementById('swal-name').value.trim();
            const newCccd = document.getElementById('swal-cccd').value.trim();
            const newRole = document.getElementById('swal-role').value.trim();
            const newUsername = document.getElementById('swal-username').value.trim();
            const newPassword = document.getElementById('swal-password').value.trim();

            if (!newName || !newCccd || !newRole || !newUsername || !newPassword) {
                Swal.showValidationMessage('Vui lòng nhập đầy đủ thông tin.');
                return false;
            }

            return { newName, newCccd, newRole, newUsername, newPassword };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            const { newName, newCccd, newRole, newUsername, newPassword } = result.value;
            const encryptedNewCCCD = encryptCCCD(newCccd);
            const hashedNewPass = await hashPassword(newPassword);
            users[index] = {
                name: newName,
                cccd: encryptedNewCCCD,
                role: newRole,
                username: newUsername,
                password: hashedNewPass,
                passwordRaw: newPassword
            };
            localStorage.setItem('users', JSON.stringify(users));
            loadUsers();
            Swal.fire('Đã lưu!', '', 'success');
        }
    });
}

// ====== ẨN / HIỆN FORM THÊM ======
function toggleAddForm() {
    const form = document.getElementById("addForm");
    form.classList.toggle("hidden");
}
