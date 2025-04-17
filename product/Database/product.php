<?php
    class product{
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
            $sql = "SELECT * FROM `do_dung`";
            $res = mysqli_query($this->con, $sql);
            $cnt = 0;
            while($row = mysqli_fetch_array($res)){
                $cnt++;
                echo "<tbody>
                <tr id='$cnt'>
                    <td>$row[0]</td>
                    <td>$row[1]</td>
                    <td>$row[2]</td>
                    <td>$row[3]</td>
                    <td>$row[4]</td>
                    <td>
                        <button id='edit-btn$cnt' class='edit-btn' onclick='update(this)'>Chỉnh sửa</button>
                        <button id='delete-btn' class='delete-btn'>
                            <a href = '../../product/handle/handle_product.php?op=delete&id=$row[0]'>Xóa</a>
                        </button>
                    </td>
                </tr>
            </tbody>";
            }
        }

        function update($id, $name, $category, $price, $quantity){
            $sql = "UPDATE `do_dung` SET Ten = '$name',Loai = '$category',Gia = '$price',so_luong = '$quantity' WHERE MA_DO_DUNG = '$id'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Cập nhật thành công');
                    window.location.href = '../index.php?tab=product';
                </script>";
            }
            else{
                echo "<script>alert('Không thành công')</script>";
            }
        }

        function insert($id, $name, $category, $price, $quantity){
            $sql = "INSERT INTO `do_dung`(Ma_Do_Dung, Ten, Loai, Gia, So_luong)
            values ('$id', '$name', '$category', '$price', '$quantity')";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Thêm thành công');
                    window.location.href = '../index.php?tab=product';
                </script>";
            }
            else{
                echo "<script>alert('Không thành công')</script>";
            }
        }

        function delete($id){
            $sql = "DELETE FROM `do_dung` WHERE Ma_Do_Dung = '$id'";
            if(mysqli_query($this->con, $sql)){
                echo "<script>
                    alert('Xóa thành công');
                    window.location.href = '../index.php?tab=product';
                </script>";
            }
            else{
                echo "<script>alert('Không thành công')</script>";
            }
        }
    }
?>