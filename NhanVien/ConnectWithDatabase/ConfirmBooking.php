<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';
$db   = new Database();
$conn = $db->conn;

$data = json_decode(file_get_contents("php://input"), true);

$ma_don    = $data['Ma_don_dat_phong'];
$tong_tien = $data['Tong_tien'];
$phong_ids = $data['phong'];
$NVID      = $data['Ma_nhan_vien'];


$conn->begin_transaction();

try {
    // Thêm hóa đơn
    $stmt = $conn->prepare("INSERT INTO hoa_don (Ma_don_dat_phong, Ma_nhan_vien, Tong_tien) VALUES (?, ?, ?)");
    $stmt->bind_param("isd", $ma_don, $NVID, $tong_tien);
    $stmt->execute();

    $ma_hoa_don = $conn->insert_id;

    // Thêm chi tiết hóa đơn
    $stmt_ct = $conn->prepare("INSERT INTO chi_tiet_hoa_don (Ma_Hoa_Don, Ma_phong) VALUES (?, ?)");
    $stmt_update = $conn->prepare("UPDATE phong SET Trang_thai = 'Có người ở' WHERE ID = ?");
    foreach ($phong_ids as $room_id) {
        $stmt_ct->bind_param("is", $ma_hoa_don, $room_id);
        $stmt_ct->execute();

        // Cập nhật trạng thái phòng
        $stmt_update->bind_param("s", $room_id);
        $stmt_update->execute();
    }
    $stmt_ap = $conn->prepare("UPDATE don_dat_phong SET Trang_thai = 'Đã nhận phòng' WHERE Ma_don_dat_phong = ?");
    $stmt_ap->bind_param("i", $ma_don);
    $stmt_ap->execute();
    $conn->commit();
    echo json_encode(["success" => true, "Ma_Hoa_Don" => $ma_hoa_don]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$conn->close();
?>
