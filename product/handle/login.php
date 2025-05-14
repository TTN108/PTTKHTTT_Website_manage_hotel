<?php
    function login($username, $password){
        $con = mysqli_connect("localhost", "root", "", "hotel");
        $sql = "SELECT nhan_vien.Chuc_vu FROM account, nhan_vien WHERE account.Username = nhan_vien.Account and account.Username = '$username' and account.Password = '$password'";
        $res = mysqli_query($con, $sql);
        if(mysqli_num_rows($res) > 0){
            $row = mysqli_fetch_row($res);
            if($row[0] == "Chủ doanh nghiệp" || $row[0] == "Quản lý kho"){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    if($_SERVER["REQUEST_METHOD"] == "GET"){
        $username = $_GET["username"];
        $password = $_GET["password"];
        if(login($username, $password)){
            session_start();
            $_SESSION["user"] = $username;
            $con = mysqli_connect("localhost", "root", "", "hotel");
            $sql = "SELECT nhan_vien.Ten FROM account, nhan_vien WHERE account.Username = nhan_vien.Account and account.Username = '$username'";
            $res = mysqli_query($con, $sql);
            $row = mysqli_fetch_row($res);
            $_SESSION["name"] = $row[0];
            echo "<script>
                alert('Đăng nhập thành công');
                window.location.href = '../index.php';
            </script>";
            exit();
        }
        else{
            echo "<script>
                alert('Tên đăng nhập hoặc mật khẩu sai.');
                window.history.back();
            </script>";
        }
    }
?>