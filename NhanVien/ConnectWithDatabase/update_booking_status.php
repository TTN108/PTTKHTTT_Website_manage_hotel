<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';
$db   = new Database();
$conn = $db->conn;

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['Ma_don_dat_phong']) && isset($data['Trang_thai'])) {
    $ma_don = $data['Ma_don_dat_phong'];
    $trang_thai = $data['Trang_thai'];

    $stmt = $conn->prepare("UPDATE don_dat_phong SET Trang_thai = ? WHERE Ma_don_dat_phong = ?");
    $stmt->bind_param("ss", $trang_thai, $ma_don);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Cập nhật thành công"]);
    } else {
        echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật"]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
}

$conn->close();
?>
