<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';
$db   = new Database();
$conn = $db->conn;

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['Ma_don_dat_phong'])) {
    $ma_don_dat_phong = $data['Ma_don_dat_phong'];

    // Sau đó xóa hóa đơn
    $stmt = $conn->prepare("UPDATE don_dat_phong SET Trang_thai = 'Đã huỷ' WHERE Ma_don_dat_phong = ?");
    $stmt->bind_param("s", $ma_don_dat_phongs);

    if ($stmt2->execute()) {
        echo json_encode(["success" => true, "message" => "Xóa thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi xóa hóa đơn"]);
    }

    $stmt2->close();
} else {
    echo json_encode(["success" => false, "message" => "Thiếu mã hóa đơn"]);
}

$conn->close();
?>
