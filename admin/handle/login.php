<?php
    require("../database/account.php");
    session_start();
    $user = $_GET["username"];
    $_SESSION["user"] = $user;
    $account = new account();
    $sql = "SELECT nhan_vien.Ten FROM account, nhan_vien WHERE account.Username = nhan_vien.Account";
    $res = mysqli_query($account->getConnect(), $sql);
    $row = mysqli_fetch_array($res);
    $_SESSION["name"] = $row[0];
    $account->close();
    echo "<script>
        alert('Đăng nhập thành công');
        window.location.href = '../admin.php';
    </script>";
?>