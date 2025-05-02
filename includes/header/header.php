<!-- -------------------------------- Header ---------------------------------------- -->
<div id="header">
    <!-- ------------------------- Logo ----------------------------------------- -->
    <div id="logo-container">
        <a href="#top"><img id="logo" src="imgs/logo.png"></a>
    </div>
    <!-- ----------------------- Head Menu -------------------------------------- -->
    <div id="head-menu-container">
        <ul id="head-menu">
            <li id="home" class="head-menu-item active">Home</li>
            <li id="room" class="head-menu-item">Room</li>
            <li id="about-us" class="head-menu-item">About us</li>
            <li id="contact" class="head-menu-item">Contact</li>
        </ul>
    </div>
    <!-- ---------------------- Login Button ------------------------------------ -->
    <div id="login-button-container">
        <div id="login-button">
            Login
        </div>
        <div id="signin-button" class="signin-button">
            Signin
        </div>
        <div id="account-ctn" class="hidden">
            <div id="account"> 

            </div>
            <div id="account-menu">
                <div id="account-info-btn" class="account-menu-btn">
                    Thông tin cá nhân
                </div>
                <div id="account-history-btn" class="account-menu-btn">
                    Lịch sử đặt phòng
                </div>
                <div id="logout-button" class="account-menu-btn">
                    Đăng xuất
                </div>
            </div>
        </div> 
        <form id="account-info-ctn">
            <div id="account-info-x" class="x-ctn"><i class='fa-regular fa-circle-xmark x'></i></div>
            <div class="account-info-mini-container">
                <h1>Account Information</h1>
            </div>
            <div class="account-info-mini-container">
                <label for="account-info-username" id="login-form-label">Username:</label>
                <input id="account-info-username" name="account-info-username" type="text" disabled readonly>
            </div>
            <div class="account-info-mini-container">
                <label for="account-info-password" id="login-form-label">Password:</label>
                <input id="account-info-password" name="account-info-password" type="password" disabled>
            </div>
            <div class="account-info-mini-container">
                <label for="account-info-fullname" id="login-form-label">Fullname:</label>
                <input id="account-info-fullname" name="account-info-fullname" type="text" disabled>
            </div>
            <div class="account-info-mini-container">
                <label for="account-info-id-card" id="login-form-label">ID card:</label>
                <input id="account-info-id-card" name="account-info-id-card" type="text" disabled readonly>
            </div>
            <div class="account-info-mini-container">
                <label for="account-info-email" id="login-form-label">Email:</label>
                <input id="account-info-email" name="account-info-email" type="email" disabled>
            </div>
            <div class="account-info-mini-container">
                <label for="account-info-phone" id="login-form-label">Phone:</label>
                <input id="account-info-phone" name="account-info-phone" type="tel" disabled>
            </div>
            <div class="account-info-mini-container">
                <label for="account-info-address" id="login-form-label">Address:</label>
                <input id="account-info-address" name="account-info-address" type="text" disabled>
            </div>
            <div class="account-info-mini-container form-signin-button">
                <input id="account-info-edit-button" type="button" value="Change">
            </div>
        </form>
    </div>
</div>
<!-- ------------------------ Login/Signin Form ------------------------------------ -->
<div id="login-form-container" class="">
    <?php
        require_once 'login_form.php';
        require_once 'signin_form.php';
        require_once 'forgot_password_form.php';
    ?>
</div>

<!-- ------------------------ Booking Form ------------------------------------ -->
<div id="auth-required-message" class="hidden">
    <div id="auth-required-message-x" class="x-ctn"><i class='fa-regular fa-circle-xmark x'></i></div>
    Bạn cần đăng nhập để đặt phòng!
    <input type="button" value="Đến đăng nhập">
</div>

<form id="booking-form" class="hidden">
    <div id="booking-form-ctn">
        <div id="booking-form-x" class="x-ctn"><i class='fa-regular fa-circle-xmark x'></i></div>
        <h2><strong>Booking</strong></h2>
        <div class="booking-form-input-ctn">
            <h4>Thông tin đặt phòng</h4><br>
            <label>Room Type:</label>
            <div> 
                <div>
                    <input type="radio" name="roomtype" value="Standard" checked>Standard
                </div>
                <div>
                    <input type="radio" name="roomtype" value="Deluxe">Deluxe
                </div>
            </div><br>

            <label>Checkin:</label>
            <input id="booking-form-checkin" type="date" name="checkin"><br><br>

            <label>Checkout:</label>
            <input id="booking-form-checkout" type="date" name="checkout"><br><br>

            <label>Rooms:</label>
            <select id="booking-form-rooms" name="rooms">
                <?php
                for ($i = 1; $i <= 7; $i++) {
                    echo "<option value='$i'>$i</option>";
                }
                ?>
            </select><br><br>

            <label>Guests:</label>
            <select id="booking-form-guests" name="guests">
                <?php
                for ($i = 1; $i <= 20; $i++) {
                    echo "<option value='$i'>$i</option>";
                }
                ?>
            </select><br><br>

            <h4>Thông tin cá nhân (được lấy từ tài khoản của bạn):</h4><br>
            <label>Name:</label>
            <input id="booking-form-name" type="text" disabled><br><br>
            
            <label>ID card:</label>
            <input type="text" id="booking-form-id-card" disabled><br><br>
        
            <label>Address:</label>
            <input id="booking-form-address" type="text" disabled><br><br>

            <label>Email:</label>
            <input type="email" id="booking-form-email" disabled><br><br>

            <label>Phone:</label>
            <input type="tel" id="booking-form-phone" disabled><br><br>
            
            <input type="button" id="booking-form-submit-button" value="Book now">
        </div>
    </div>
</form>

<div id="histories-ctn" class="hidden">
    <div id="account-history-x" class="x-ctn"><i class='fa-regular fa-circle-xmark x'></i></div>
    <h1>Booking histories</h1>
    <div id="histories-table-ctn">
        <table id="histories-table">
            <thead>
                <tr>
                    <th>Mã đơn</th>
                    <th>Ngày nhận</th>
                    <th>Ngày trả</th>
                    <th>Số phòng</th>
                    <th>Số người</th>
                    <th>Loại phòng</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<div id="invoice-details" class="hidden"></div>
