<link rel="stylesheet" href="css/admin.css">

<?php
    if($_GET["op"] == "product"){
        echo "<form class='login-container' onsubmit='return check()' method='get' action='product/handle/login.php'>
            <div class='background-image'>
                <div class='login-form'>
                    <h2>Login</h2>
                    <input type='text' id='username' name='username' placeholder='Username' required>
                    <input type='password' id='password' name='password' placeholder='Password' required>
                    <button type='submit'>Submit</button>
                </div>
            </div>
        </form>";
    }
    if($_GET["op"] == "admin"){
        echo "<form class='login-container' method='get' action='admin/handle/login.php'>
                <div class='background-image'>
                    <div class='login-form'>
                        <h2>Login</h2>
                        <input type='text' id='username' name='username' placeholder='Username'>
                        <input type='password' id='password' name='password' placeholder='Password'>
                        <button type='submit'>Submit</button>
                    </div>
                </div>
            </form>";
    }
    if($_GET["op"] == "employee"){
        echo "<form class='login-container' action='NhanVien/handle/login.php'>
                <div class='background-image'>
                <div class='login-form'>
                    <h2>Login</h2>
                    <input type='text' id='username' name='username' placeholder='Username'>
                    <input type='password' id='password' name='password' placeholder='Password'>
                    <button type='submit'>Submit</button>
                </div>
                </div>
            </form>";
    }
?>