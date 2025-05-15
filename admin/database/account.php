<?php
    class account{
        private $con;
        function __construct(){
            $this->con = mysqli_connect("localhost", "root", "", "hotel");
        }
        function getConnect(){
            return $this->con;
        }
        function close(){
            mysqli_close($this->con);
        }
        function get_employee(){
            $sql = "SELECT * FROM nhan_vien, account where account.Username = nhan_vien.Account";
            $res = mysqli_query($this->con, $sql);
            $cnt = 0;
            while($row = mysqli_fetch_array($res)){
                // print_r($row);
                $str = "";
                if($row[9] == "Đã khóa"){
                    $str .= "<button id='delete-btn' class='delete-btn'>
                                <a href = 'handle/handle_employee.php?id=$row[0]&username=$row[4]&op=unlock'>Mở khóa</a>
                            </button>";
                        }
                else{
                    $str .= "<button id='delete-btn' class='delete-btn'>
                                <a href = 'handle/handle_employee.php?id=$row[0]&username=$row[4]&op=lock'>Khóa</a>
                            </button>";
                            
                }
                $cnt++;
                echo "
                <tbody>
                    <tr>
                        <td>$row[0]</td>
                        <td>$row[1]</td>
                        <td>$row[2]</td>
                        <td>$row[3]</td>
                        <td>$row[5]</td>
                        <td>$row[4]</td>
                        <td>$row[7]</td>
                        <td>$row[8]</td>
                        <td>$row[9]</td>
                        <td>
                            <button id='edit-btn$cnt' class='edit-btn' onclick='update(this)'>Chỉnh sửa</button>
                             $str
                        </td>
                    </tr>
                </tbody>";
            }
        }
        function insert_employee($id, $name, $phone, $address, $username, $password, $email, $role){
            $sql = "INSERT INTO account(Username, Password, Email, Status)
            values ('$username', '$password', '$email', 'Hoạt động')";
            if(mysqli_query($this->con, $sql)){
                $sql1 = "INSERT INTO nhan_vien(Ma_nhan_vien, Ten, SDT, Dia_chi, Account, Chuc_vu)
                values ('$id', '$name', '$phone', '$address', '$username', '$role')";
                if(mysqli_query($this->con, $sql1)){
                    echo "<script>
                        alert('Thêm thành công');
                        window.location.href = '../admin.php';
                    </script>";
                }
            }
        }
        function lock_employee($username){
            $sql = "UPDATE account SET Status = 'Đã khóa' WHERE Username = '$username'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Khóa thành công');
                    window.location.href = '../admin.php';
                </script>";
            }
        }
        function unlock_employee($username){
            $sql = "UPDATE account SET Status = 'Hoạt động' WHERE Username = '$username'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Mở khóa thành công');
                    window.location.href = '../admin.php';
                </script>";
            }
        }

        function update_employee($id, $name, $phone, $address){
            $sql = "UPDATE nhan_vien SET Ten = '$name', SDT = '$phone', Dia_chi = '$address' WHERE Ma_nhan_vien = '$id'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                        alert('Cập nhật thành công');
                        window.location.href = '../admin.php';
                </script>";
            }
        }
        
        function get_customer(){
            $sql = "SELECT * FROM khach_hang, account where khach_hang.Account = account.Username";
            $res = mysqli_query($this->con, $sql);
            $cnt = 0;
            while($row = mysqli_fetch_array($res)){
                // print_r($row);
                $cnt++;
                $str = "";
                if($row[9] == "Đã khóa"){
                    $str .= "<button id='delete-btn' class='delete-btn'>
                                <a href = 'handle/handle_employee.php?id=$row[0]&username=$row[6]&op=unlock'>Mở khóa</a>
                            </button>";
                        }
                else{
                    $str .= "<button id='delete-btn' class='delete-btn'>
                                <a href = 'handle/handle_employee.php?id=$row[0]&username=$row[6]&op=lock'>Khóa</a>
                            </button>";
                            
                }
                echo "
                <tbody>
                <td>$row[0]</td>
                <td>$row[1]</td>
                <td>$row[2]</td>
                <td>$row[4]</td>
                <td>$row[6]</td>
                <td>$row[7]</td>
                <td>$row[8]</td>
                <td>$row[9]</td>
                <td>
                <button id='edit-btn$cnt' class='edit-btn' onclick='update1(this)'>Chỉnh sửa</button>
                 $str
                </button>
                </td>
                </tbody>
                ";
            }
        }
        function insert_customer($id, $name, $phone, $address, $username, $password, $email){
            $sql = "INSERT INTO account(Username, Password, Email, Status)
            values ('$username', '$password', '$email', 'Hoạt động')";
            if(mysqli_query($this->con, $sql)){
                $sql1 = "INSERT INTO khach_hang(CCCD, Ten, SDT, Dia_chi, Account)
                values ('$id', '$name', '$phone', '$address', '$username')";
                if(mysqli_query($this->con, $sql1)){
                    echo "<script>
                    alert('Thêm thành công');
                    window.location.href = '../admin.php';
                    </script>";
                }
            }
        }

        function update_customer($id, $name, $phone, $address){
            $sql = "UPDATE khach_hang SET Ten = '$name', SDT = '$phone', Dia_chi = '$address' WHERE CCCD = '$id'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                        alert('Cập nhật thành công');
                        window.location.href = '../admin.php';
                </script>";
            }
        }

        function lock_customer($username){
            $sql = "UPDATE account SET Status = 'Đã khóa' WHERE Username = '$username'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Khóa thành công');
                    window.location.href = '../admin.php';
                </script>";
            }
        }
        function unlock_customer($username){
            $sql = "UPDATE account SET Status = 'Hoạt động' WHERE Username = '$username'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Mở khóa thành công');
                    window.location.href = '../admin.php';
                </script>";
            }
        }
    }
    ?>