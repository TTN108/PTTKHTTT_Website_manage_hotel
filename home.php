<html lang="vi">
    <head>
        <title>Sunset Hotel</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <link rel="icon" type="image/png" href="imgs/logo-icon.png">
        <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
        <link rel="stylesheet" href="css/home.css">
    </head>
    <body>
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
            </div>
        </div>
        <!-- ------------------------ Login/Signin Form ------------------------------------ -->
        <div id="login-form-container" class="">
            <!-- ------------------------ Login Form ------------------------------------ -->
            <form id="login-form" class="login-form">
                <div class="back-arrow-container"><i class='bx bx-arrow-back back-arrow'></i></div>
                <div class="login-form-mini-container">
                    <h1>Login</h1>
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-login-username" id="login-form-label">Username:</label>
                    <input id="login-form-login-username" type="text">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-login-password" id="login-form-label">Password:</label>
                    <input id="login-form-login-password" type="password">
                </div>
                <div class="login-form-mini-container form-link">
                    <a class="signin-button" href="javascript:void(0)" id="login-form-signin">Signin?</a>
                    <i>&nbsp;</i>
                    <a href="javascript:void(0)" id="login-form-forgot-password">Forgot password?</a>
                </div>
                <div class="login-form-mini-container form-login-button">
                    <button id="login-form-login-button" type="button">Login</button>
                </div>
            </form>
            <!-- ------------------------ Signin Form ------------------------------------ -->
            <form id="signin-form" class="login-form">
                <div class="back-arrow-container"><i class='bx bx-arrow-back back-arrow'></i></div>
                <div class="login-form-mini-container">
                    <h1>Signin</h1>
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-signin-username" id="login-form-label">Username:</label>
                    <input id="login-form-signin-username" type="text" placeholder="Enter username">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-signin-password" id="login-form-label">Password:</label>
                    <input id="login-form-signin-password" type="password" placeholder="Enter password">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-signin-confirm-password" id="login-form-label">Confirm:</label>
                    <input id="login-form-signin-confirm-password" type="password" placeholder="Enter password again">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-signin-fullname" id="login-form-label">Fullname:</label>
                    <input id="login-form-signin-fullname" type="text" placeholder="Enter your fullname">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-signin-id-card" id="login-form-label">ID card:</label>
                    <input id="login-form-signin-id-card" type="text" placeholder="Enter your ID card">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-signin-email" id="login-form-label">Email:</label>
                    <input id="login-form-signin-email" type="email" placeholder="Enter your email">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-signin-country" id="login-form-label">Country:</label>
                    <input id="login-form-signin-country" type="text" placeholder="Enter your country">
                </div>
                <div class="login-form-mini-container form-signin-button">
                    <button id="login-form-signin-button" type="button">Signin</button>
                </div>
            </form>
            <!-- ------------------------ Forgot Password Form ------------------------------------ -->
            <form id="forgot-password-form" class="login-form">
                <div class="back-arrow-container"><i class='bx bx-arrow-back back-arrow'></i></div>
                <div class="login-form-mini-container">
                    <h1>Password</h1>
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-password-username" id="login-form-label">Username:</label>
                    <input id="login-form-password-username" type="text" placeholder="Enter username">
                </div>
                <div class="login-form-mini-container">
                    <label for="login-form-password-email" id="login-form-label">Email:</label>
                    <input id="login-form-password-email" type="email" placeholder="Enter email">
                </div>
                <div class="login-form-mini-container form-password-button" id="form-password-button">
                    <button id="login-form-password-button" type="button">Submit</button>
                </div>
            </form>
        </div>
<!-- -------------------------------- Content ---------------------------------------- -->
        <div id="content">
        <!-- ---------------------- Hero Banner -------------------------------------- -->
            <div id="hero-banner-container">
                <img id="hero-banner" src="imgs/banner.jpg">
            </div>
        <!-- ---------------------- Home Block -------------------------------------- -->
            <div id="home-block" class="block active">
                <!-- ------------------- Mini Booking Form ----------------------------------- -->
                    <div id="mini-booking-form-container">
                        <form action="" id="mini-booking-form">
                            <div id="label-group">
                                <div class="mini-container">
                                    <label for="checkin" id="checkin-label">Check-in</label>
                                </div>
                                <div class="mini-container">
                                    <label for="checkout" id="checkout-label">Check-out</label>
                                </div>
                                <div class="mini-container">
                                    <label for="rooms" id="rooms-label">Rooms</label>
                                </div>
                                <div class="mini-container">
                                    <label for="guests" id="guests-label">Guests</label>
                                </div>
                            </div>
                            <div id="input-group">
                                <div class="mini-container">
                                    <input type="date" id="checkin" class="mini-form-input" value="<?php echo date('Y-m-d');?>" min="<?php echo date('Y-m-d');?>">
                                </div>
                                <div class="mini-container">
                                    <input type="date" id="checkout" class="mini-form-input" <?php $checkoutMinValue=date('Y-m-d', strtotime(date('Y-m-d').'+1 day')); echo "value=\"$checkoutMinValue\" min=\"$checkoutMinValue\""?>>
                                </div>
                                <div class="mini-container">
                                    <select id="rooms" class="mini-form-input" >
                                        <?php 
                                            for($i=1;$i<=30;$i++)
                                            {
                                                echo "<option>$i</option>";
                                            }
                                        ?>
                                    </select>
                                </div>
                                <div class="mini-container">
                                    <select id="guests" class="mini-form-input" >
                                        <?php 
                                            for($i=1;$i<=30;$i++)
                                            {
                                                echo "<option>$i</option>";
                                            }
                                        ?>
                                    </select>
                                </div>
                                <div class="mini-container">
                                    <button id="book-button" class="mini-form-input" type="button" value="book-now">
                                        Book now
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- ------------------------- Hero Section ------------------------------- -->
                    <div id="hero-section-container">
                        <h1>Sunset Hotel - Ấm áp và thân thiện</h1>
                        <br>
                        <p>Tọa lạc ở thành phố Hồ Chí Minh. Sunset Hotel sẽ</p>
                        <p>đưa bạn đến trải nghiệm tuyệt vời với phòng ốc</p>
                        <p>sang trọng và nhân viên thân thiện.</p>
                    </div>
                    <!-- ------------------------ Room Selection ------------------------------ -->
                    <div id="room-selection-container">
                        <div class="room-card">
                            <img class="room-image" src="imgs/standard.png">
                            <p>Standard Room</p>
                            <button class="detail-button" type="button">Detail</button>
                        </div>
                        <div class="room-card">
                            <img class="room-image" src="imgs/deluxe.png">
                            <p>Deluxe Room</p>
                            <button class="detail-button" type="button">Detail</button>
                        </div>
                    </div>
            </div>
        <!-- ---------------------- Room Block -------------------------------------- -->
            <div id="room-block" class="block">
                
            </div>
        <!-- -------------------- About Us Block -------------------------------------- -->
            <div id="about-us-block" class="block">
                <div id="about-us-textfield">
                    <h1>Sunset Hotel</h1>
                    <p>Được thành lập vào năm 2025, Sunset Hotel sẽ trở thành một nơi mà du khách có thể dừng chân, nghỉ ngơi với phòng ốc sạch sẽ và nhân viên thân thiện. Nằm ở vị trí thuận lợi có thể nhìn ra Landmark 81 và Bitexco và đi ra phố đi bộ Nguyễn Huệ.</p>
                </div>
            </div>
        <!-- ---------------------- Contact Block -------------------------------------- -->
            <div id="contact-block" class="block">
                <form id="contact-form">
                    <div id="contact-field">
                        <label id="contact-label" for="contact-name-input">Name</label>
                        <input type="text" id="contact-name-input" class="contact-input" placeholder="Enter your name">
                    </div>
                    <div id="contact-field">
                        <label id="contact-email-label" for="contact-email-input">Email</label>
                        <input id="contact-email-input" type="email" class="contact-input" placeholder="Enter your email - example: example@domain.com">
                        <p id="invalid-email">Định dạng email không hợp lệ</p>
                    </div>
                    <div id="contact-field">
                    <label id="contact-label" for="contact-message-input">Message</label>
                        <textarea id="contact-message-input" class="contact-input textarea" placeholder="Enter the message..."></textarea>
                    </div>
                </form>
            </div>
        </div>
<!-- -------------------------------- Footer ---------------------------------------- -->
        <div id="footer">
            <div id="address-block">
                <p>Sunset Hotel</p>
                <br>
                <p>273 An Dương Vương, Phường 3, Quận 5, Thành phố Hồ Chí Minh, Việt Nam</p>
            </div>
        </div>

        <script src="js/home.js"></script>
    </body>
</html>