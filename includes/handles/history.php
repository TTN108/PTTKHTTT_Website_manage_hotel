<?php
    require_once "connect.php";
    session_start();

    $stmt = $conn->prepare("
        select Ma_don_dat_phong, Ngay_nhan, Ngay_tra, So_luong_phong, So_luong_nguoi, Ten_loai, Ngay_dat, Trang_thai
        from don_dat_phong join loai_phong on don_dat_phong.Ma_Loai_Phong = loai_phong.Ma_Loai_Phong
        where Account = ?
        order by Ngay_dat DESC
    ");

    $stmt->bind_param("s",$_SESSION['user']['Username']);
    $stmt->execute();
    $result=$stmt->get_result();

    $response = [];
    while ($row = $result->fetch_assoc()) {
        $response[] = $row;
    }

    header("Content-Type: application/json");
    echo json_encode($response);
?>