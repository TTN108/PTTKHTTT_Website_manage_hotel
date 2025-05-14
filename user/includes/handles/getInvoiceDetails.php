<?php
require 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $ma_don_dat_phong = $_POST['id'];

    // 1. Lấy thông tin đơn đặt phòng và hóa đơn
    $sql1 = "SELECT 
                ddp.Ma_don_dat_phong,
                ddp.Ngay_nhan,
                ddp.Ngay_tra,
                ddp.Ngay_dat,
                ddp.So_luong_phong,
                ddp.So_luong_nguoi,
                hd.Ma_Hoa_Don,
                hd.Tong_tien,
                hd.Ma_nhan_vien
            FROM don_dat_phong ddp
            JOIN HOA_DON hd ON ddp.Ma_don_dat_phong = hd.Ma_don_dat_phong
            WHERE ddp.Ma_don_dat_phong = ?";
    $stmt1 = $conn->prepare($sql1);
    $stmt1->bind_param("i", $ma_don_dat_phong);
    $stmt1->execute();
    $result1 = $stmt1->get_result();
    $invoice = $result1->fetch_assoc();

    if (!$invoice) {
        echo json_encode(["error" => "Không tìm thấy hóa đơn cho đơn đặt phòng này."]);
        exit;
    }

    $ma_hoa_don = $invoice['Ma_Hoa_Don'];

    // 2. Lấy danh sách phòng trong hóa đơn
    $sql2 = "SELECT 
                p.ID AS Ma_phong
            FROM Chi_tiet_hoa_don ct
            JOIN PHONG p ON ct.Ma_phong = p.ID
            WHERE ct.Ma_Hoa_Don = ?";
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $ma_hoa_don);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $rooms = [];
    while ($row = $result2->fetch_assoc()) {
        $rooms[] = $row;
    }

    // 3. Lấy chi tiết đồ dùng hư hại trong các phòng
    $sql3 = "SELECT 
                dd.Ma_phong,
                d.Ten AS Ten_do_dung,
                d.Gia
            FROM chi_tiet_phong_hoa_don dd
            JOIN DO_DUNG d ON dd.Ma_do_dung = d.Ma_Do_Dung
            WHERE dd.Ma_Hoa_Don = ?";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("i", $ma_hoa_don);
    $stmt3->execute();
    $result3 = $stmt3->get_result();
    $damaged_items = [];
    while ($row = $result3->fetch_assoc()) {
        $damaged_items[] = $row;
    }

    // Trả về JSON
    echo json_encode([
        "hoa_don" => $invoice,
        "phong" => $rooms,
        "do_dung_hu" => $damaged_items
    ]);
} else {
    echo json_encode(["error" => "Thiếu mã đơn đặt phòng hoặc sai phương thức."]);
}
?>
