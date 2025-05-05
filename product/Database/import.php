<?php
    class import{
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
        function getAll(){
            $sql = "SELECT * FROM `nhap_hang`, `nha_cung_cap`
            WHERE nhap_hang.Ma_nha_cung_cap = nha_cung_cap.Ma_nha_cung_cap";
            $res = mysqli_query($this->con, $sql);
            $cnt = 0;
            while($row = mysqli_fetch_array($res)){
                $cnt++;
                $sql1 = "SELECT * FROM `nhap_hang`, `chi_tiet_phieu_nhap`, `do_dung`
                WHERE nhap_hang.Ma_Nhap_Hang = chi_tiet_phieu_nhap.Ma_Nhap_Hang and chi_tiet_phieu_nhap.Ma_Do_Dung = do_dung.Ma_Do_Dung and nhap_hang.Ma_Nhap_Hang = '$row[0]' ORDER BY nhap_hang.Ma_Nhap_Hang ASC";
                $res1 = mysqli_query($this->con, $sql1);
                // print_r($row);
                // while($row1 = mysqli_fetch_array($res1)){
                //     print_r($row1);
                // }
                $s = "";
                while($row1 = mysqli_fetch_array($res1)){
                    $s .= "Tên: $row1[10] - Số lượng: $row1[7] - Giá nhập: $row1[8]\n";
                }
                $s1 = "";
                if($row[2] == "Đã giao"){
                    $s1 .= "
                    <input type='radio' name='status_$cnt' value='Đã nhận hàng' checked disabled>Đã nhận hàng
                    <input type='radio' name='status_$cnt' value='Chưa nhận hàng' disabled>Chưa nhận hàng
                    ";
                }
                else{
                    $s1 .= "
                    <input type='radio' name='status' id='yes' value='Đã nhận hàng'>Đã nhận hàng
                    <input type='radio' name='status' id='no' value='Chưa nhận hàng' checked>Chưa nhận hàng
                    ";
                }
                echo "<tbody id='$cnt' onclick='update(this)'>
                <tr>
                    <td>$row[0]</td>
                    <td>$s</td>
                    <td>$row[1]</td>
                    <td>$row[7]</td>
                    <td>$row[3]</td>
                    <td>
                        $s1
                    </td>
                </tr>
            </tbody>";
            }
        }
        function insert_import($date, $status, $total, $providerID){
            $sql = "INSERT INTO `nhap_hang`(Ngay_cung_cap, Trang_thai, Tong_tien_nhap, Ma_nha_cung_cap)
            values('$date', '$status', '$total', '$providerID')";
            if(mysqli_query($this->con, $sql)){
                return;
            }
            else{
                echo "<script>alert('Không thành công')</script>";
            }
        }
        function insert_detail($importID, $productID, $quantity, $price){
            $sql = "INSERT INTO `chi_tiet_phieu_nhap`(Ma_Nhap_Hang, Ma_Do_Dung, So_luong, Gia_nhap)
            values('$importID', '$productID', $quantity, $price)";
            if(mysqli_query($this->con, $sql)){
                return;
            }
            else{
                echo "<script>alert('Không thành công')</script>";
            }
        }
        function update_product($productID, $quantity){
            $sql = "SELECT So_luong FROM do_dung WHERE Ma_Do_Dung = '$productID'";
            $res = mysqli_query($this->con, $sql);
            while($row = mysqli_fetch_array($res)){
                $quan = $row[0];
                $quan += $quantity;
                $sql1 = "UPDATE `do_dung` SET So_luong = $quan WHERE Ma_Do_Dung = '$productID'";
                if(mysqli_query($this->con, $sql1)){
                    return;
                }
                else{
                    echo "<script>alert('Không thành công')</script>";
                }
            }
        }
    }
?>