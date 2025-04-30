<?php
    require("database/account.php");
    session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Admin Account</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>

<body>
    <form class="login-container" onsubmit="return check()" method="get" action="handle/login.php">
        <div class="background-image">
            <div class="login-form">
                <h2>Login</h2>
                <input type="text" id="username" name="username" placeholder="Username">
                <input type="password" id="password" name="password" placeholder="Password">
                <button type="submit">Submit</button>
            </div>
        </div>
    </form>

    <div class="admin-panel">
        <div class="header">
            <div class="logo">🌇 SUNSET</div>
            <button class="logout-btn" onclick="logout()">Logout</button>
        </div>
        <hr class="gradient-line">
        <button class="add-btn" id="addEmployeeBtn">Thêm nhân viên</button>
        <button class="add-btn" id="addCustomerBtn">Thêm khách hàng</button>
        <h2 id="welcomeRole">Bảng nhân viên</h2>
        <table>
            <thead>
                <tr>
                    <th>Mã nhân viên</th>
                    <th>Tên nhân viên</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Chức vụ</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Tình trạng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <?php
            $account = new account();
            $account->get_employee();
            $account->close();
            ?>
        </table>

        <h2 id="welecomeRole">Bảng khách hàng</h2>
        <table>
            <thead>
                <tr>
                    <th>CCCD</th>
                    <th>Tên nhân viên</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Email</th>
                    <th>Hành động</th>
                </tr>
            </thead>

        </table>

        <form class="add-form" id="addEform" method="get" action="handle/handle_employee.php" onsubmit="return check1()">
            <h3>Thêm người dùng</h3>
            <button type="button" id="closeFormBtn">&times;</button>
            <input type="text" id="id" name="id" placeholder="Mã nhân viên">
            <input type="text" id="fullname" name="fullname" placeholder="Họ và tên">
            <input type="text" id="phone" name="phone" placeholder="Số điện thoại">
            <input type="text" id="address" name="address" placeholder="Địa chỉ">
            <input type="text" id="username1" name="username" placeholder="Username">
            <input type="password" id="password1" name="password" placeholder="Password">
            <input type="text" id="email" name="email" placeholder="Email">
            <label for="role">Chức vụ</label>
            <select id="role" name="role">
                <option value="Nhân viên">Nhân viên</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Admin">Admin</option>
                <option value="Chủ doanh nghiệp">Chủ doanh nghiệp</option>
            </select>
            <input type="hidden" name="op" value="add">
            <button type="submit">Submit</button>
        </form>

        <form class="add-form" id="updateEform" method="get" action="handle/handle_employee.php">
            <h3>Thêm người dùng</h3>
            <button type="button" id="closeFormBtn2">&times;</button>
            <input type="text" id="id2" name="id" placeholder="Mã nhân viên" readonly>
            <input type="text" id="fullname2" name="fullname" placeholder="Họ và tên">
            <input type="text" id="phone2" name="phone" placeholder="Số điện thoại">
            <input type="text" id="address2" name="address" placeholder="Địa chỉ">
            <!-- <input type="text" id="email2" name="email" placeholder="Email"> -->
            <input type="hidden" name="op" value="update">
            <button type="submit">Submit</button>
        </form>
    </div>

    <!-- Giao diện chung sau khi đăng nhập -->
    <!-- <div class="admin-panel hidden">
        <div class="header">
            <div class="logo">🌇 SUNSET</div>
            <button class="logout-btn" onclick="logout()">Logout</button> -->
    <!-- <button class="logout-btn" onclick="changePassword()">Đổi mật khẩu</button> -->
    <!-- </div>
        <hr class="gradient-line"> -->

    <!-- Chào mừng người dùng -->
    <!-- <h2 id="welcomeRole">Chào mừng</h2> -->

    <!-- Chỉ người có vai trò QUẢN LÝ mới thấy nút này -->
    <!-- <button class="add-btn hidden" id="addUserBtn" onclick="toggleAddForm()">Thêm</button> -->

    <!-- Bảng người dùng -->
    <!-- <table> -->
    <!-- <thead>
                <tr>
                    <th>Họ và tên</th>
                    <th>CCCD</th>
                    <th>Chức vụ</th>
                    <th>Tính năng</th>
                </tr>
            </thead> -->
    <!-- <tbody id="userTable"></tbody>
        </table> -->

    <!-- Form thêm người dùng - chỉ quản lý mới thấy -->
    <!-- <div class="add-form hidden" id="addForm">
            <h3>Thêm người dùng</h3>
            <input type="text" id="fullName" placeholder="Họ và tên">
            <input type="text" id="cccd" placeholder="CCCD">
            <input type="text" id="usernameUser" placeholder="Username">
            <input type="password" id="passwordUser" placeholder="Password">
            <select id="role">
                <option value="Quản lý">Quản lý</option>
                <option value="Khách hàng">Khách hàng</option>
                <option value="Nhân viên">Nhân viên</option>
            </select>
            <button onclick="addUser()">Submit</button>
        </div>
    </div> -->

    <!-- Thư viện thông báo + mã hóa -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js"></script>

    <!-- File JS chính -->
    <!-- <script src="../js/admin.js"></script> -->
    <?php
    if ($_SESSION['user']) {
        echo "<script>
                document.getElementsByClassName('login-container')[0].style.display = 'none';
                document.getElementsByClassName('admin-panel')[0].style.display = 'block';
            </script>";
    } else {
        echo "<script>
                document.getElementsByClassName('login-container')[0].style.display = 'flex';
                document.getElementsByClassName('admin-panel')[0].style.display = 'none';
            </script>";
    }
    $account = new account();
    $acc = array();
    $pass = array();
    $job = array();
    $sql = "SELECT account.Username, account.Password, nhan_vien.Chuc_vu FROM account, nhan_vien WHERE account.Username = nhan_vien.Account";
    $res = mysqli_query($account->getConnect(), $sql);
    while ($row = mysqli_fetch_array($res)) {
        $acc[] = $row[0];
        $pass[] = $row[1];
        $job[] = $row[2];
    }
    $account->close();
    ?>
    <?php
    $account1 = new account();
    $id = array();
    $sql1 = "SELECT Ma_nhan_vien FROM nhan_vien";
    $res1 = mysqli_query($account1->getConnect(), $sql1);
    // print_r($res1);
    while ($row1 = mysqli_fetch_array($res1)) {
        // print_r($row1);
        $id[] = $row1[0];
    }
    $acc1 = array();
    $sql2 = "SELECT Username FROM account";
    $res2 = mysqli_query($account1->getConnect(), $sql2);
    while ($row2 = mysqli_fetch_array($res2)) {
        $acc1[] = $row2[0];
    }
    $account1->close();
    ?>
    <script>
        addEform.style.display = "none";
        updateEform.style.display = "none";

        function check() {
            var username = document.getElementById("username");
            var password = document.getElementById("password");
            var users = <?php echo json_encode($acc) ?>;
            var passes = <?php echo json_encode($pass) ?>;
            var job = <?php echo json_encode($job) ?>;
            if (!username.value || !password.value) {
                alert("Vui lòng nhập đầy đủ!");
                return false;
            }
            for (var i = 0; i < users.length; i++) {
                if (username.value == users[i] && password.value == passes[i] && (job[i] == "Chủ doanh nghiệp" || job[i] == "Admin")) {
                    return true;
                }
            }
            alert("Đang sai tài khoản hoặc mật khẩu hoặc bạn không phải là chủ doanh nghiệp hoặc admin");
            return false;
        }

        function logout() {
            alert("Bạn đang đăng xuất");
            window.location.href = "handle/logout.php";
        }
        addEmployeeBtn.addEventListener("click", function() {
            addEform.style.display = "block";
        })
        closeFormBtn.addEventListener("click", function() {
            addEform.style.display = "none";
        })
        closeFormBtn2.addEventListener("click", function() {
            updateEform.style.display = "none";
        })

        function check1() {
            alert("Hello World");
            var id = document.getElementById("id");
            var ids = <?php echo json_encode($id) ?>;
            var username = document.getElementById("username1");
            var acc = <?php echo json_encode($acc1) ?>;
            var email = document.getElementById("email");
            var name = document.getElementById("fullname");
            var phone = document.getElementById("phone");
            var address = document.getElementById("address");
            var pass = document.getElementById("password1");
            if (!id.value || !username.value || !email.value || !name.value || !phone.value || !address.value || !pass.value) {
                alert("Vui lòng điền đầy đủ thông tin");
            }
            const regex = /^NV[0-9]{3}$/;
            if (!regex.test(id.value)) {
                alert("Mã nhân viên bắt đầu từ NV và đằng sau phải có 3 số");
                id.focus();
                return false;
            }
            for (var i = 0; i < ids.length; i++) {
                if (id.value == ids[i]) {
                    alert("Đã có mã nhân viên!");
                    id.focus();
                    return false;
                }
            }
            for (var i = 0; i < acc.length; i++) {
                if (username.value == acc[i]) {
                    alert("Đã có tài khoản này rồi");
                    username.focus();
                    return false;
                }
            }
            const regex1 = /@gmail.com$/;
            if (!regex1.test(email.value)) {
                alert("Email phải có @gmail.com đằng sau");
                email.focus();
                return false;
            }
            return true;
        }

        function update(element) {
            updateEform.style.display = "block";
            let tmp = element.parentNode.parentNode;
            let td = tmp.querySelectorAll('td');
            console.log(td);
            document.getElementById("id2").value = td[0].innerHTML;
            document.getElementById("fullname2").value = td[1].innerHTML;
            document.getElementById("phone2").value = td[2].innerHTML;
            document.getElementById("address2").value = td[3].innerHTML;
        }
    </script>
</body>

</html>