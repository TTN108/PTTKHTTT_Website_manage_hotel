<?php
    if($_SERVER['REQUEST_METHOD']==='POST')
    {
        require_once "connect.php";
        session_start();
        $conn->begin_transaction();
        $response=[];
        try
        {
            $roomtype = $_POST['roomtype'];
            $stmt = $conn->prepare("
            select Ma_Loai_Phong
            from loai_phong
            where Ten_loai = ? limit 1
            ");
            $stmt->bind_param("s",$roomtype);
            $stmt->execute();
            $result=$stmt->get_result();
            $ma_loai_phong = $result->fetch_assoc()['Ma_Loai_Phong'];
    
            $account = $_SESSION['user']['Username'];
            $checkin = $_POST['checkin'];
            $checkout = $_POST['checkout'];
            $rooms = (int)$_POST['rooms'];
            $guests = (int)$_POST['guests'];
            $trang_thai = 'Chưa xác nhận';
    
            $stmt=$conn->prepare("
                INSERT INTO hotel.don_dat_phong (
                    Account,
                    Ngay_nhan,
                    Ngay_tra,
                    So_luong_phong,
                    So_luong_nguoi,
                    Ma_Loai_Phong,
                    Trang_thai
                )
                VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                );
            ");
            $stmt->bind_param("sssiiss", $account, $checkin, $checkout, $rooms, $guests, $ma_loai_phong, $trang_thai);
            $stmt->execute();
            $conn->commit();
            $response=[
                'status' => 'success',
                'message' => '<p><i class="fa-regular fa-circle-check green icon"></i>Đặt phòng thành công!</p>'
            ];
        }
        catch(Exception $e)
        {
            $conn->rollback();
            $response=[
                'status' => 'error',
                'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Đặt phòng thất bại, vui lòng thử lại!</p>'
            ];
        }
    }
    else
    {
        echo "Phương thức không hợp lệ";
    }

    header('Content-Type: application/json');
    echo json_encode($response);
?>