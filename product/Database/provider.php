<?php
    class provider{
        private $con;
        function __construct(){
            $this->con = mysqli_connect("localhost", "root", "", "qlks");
        }
        function getConnect(){
            return $this->con;
        }
        function close(){
            mysqli_close($this->con);
        }
        function getAll(){
            $sql = "SELECT * FROM `nha_cung_cap`";
            $res = mysqli_query($this->con, $sql);
            $cnt = 0;
            while($row = mysqli_fetch_array($res)){
                $cnt++;
                echo "<tbody>
                <tr>
                    <td>$row[0]</td>
                    <td>$row[1]</td>
                    <td>$row[2]</td>
                    <td>$row[3]</td>
                    <td>
                        <button id='edit-btn$cnt' class='edit-btn' onclick='update(this)'>Chỉnh sửa</button>
                        <button id='delete-btn' class='delete-btn'>
                            <a href = '../../product/handle/handle_provider.php?op=delete&id=$row[0]'>Xóa</a>
                        </button>
                    </td>
                </tr>
            </tbody>";
            }
        }
        function insert($id, $name, $address, $phone){
            $sql = "INSERT INTO `nha_cung_cap`(Ma_nha_cung_cap, Ten_nha_cung_cap, Dia_chi, Dien_thoai)
            values ('$id', '$name', '$address', '$phone')";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Thêm thành công');
                    window.location.href = '../index.php?tab=provider';
                </script>";
            }
            else{
                echo "<script>alert('Không thành công');</script>";
            }
        }
        function update($id, $name, $address, $phone){
            $sql = "UPDATE `nha_cung_cap` SET Ten_nha_cung_cap = '$name', Dia_chi = '$address', Dien_thoai = '$phone' WHERE Ma_nha_cung_cap = '$id'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Cập nhật thành công');
                    window.location.href = '../index.php?tab=provider';
                </script>";
            }
            else{
                echo "<script>alert('Không thành công')</script>";
            }
        }
        function delete($id){
            $sql = "DELETE FROM `nha_cung_cap` WHERE Ma_nha_cung_cap = '$id'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Xóa thành công');
                    window.location.href = '../index.php?tab=provider';
                </script>";
            }
            else{
                echo "<script>alert('Không thành công')</script>";
            }
        }
    }
?>