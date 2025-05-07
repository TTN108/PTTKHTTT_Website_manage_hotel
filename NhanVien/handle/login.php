<?php
    session_start();
    $user = $_GET["username"];
    $_SESSION["user"] = $user;
    $con = mysqli_connect("localhost", "root", "", "hotel");
    $sql = "SELECT nhan_vien.Ten FROM account, nhan_vien WHERE account.Username = nhan_vien.Account";
    $res = mysqli_query($con, $sql);
    $row = mysqli_fetch_array($res);
    $_SESSION["name"] = $row[0];
    mysqli_close($con);
    echo "<script>
        alert('Đăng nhập thành công');
        window.location.href = '../nv_p.php';
    </script>";
?>