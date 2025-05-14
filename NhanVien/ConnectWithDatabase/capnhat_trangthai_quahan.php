<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';
$db   = new Database();
$conn = $db->conn;

$data = json_decode(file_get_contents("php://input"), true);
date_default_timezone_set('Asia/Ho_Chi_Minh');
$today = date('Y-m-d');

// Cập nhật trạng thái các đơn "Chưa xác nhận" hoặc "Đã xác nhận" và có ngày trả nhỏ hơn hôm nay
$sql = "UPDATE don_dat_phong 
        SET Trang_thai = 'Quá hạn' 
        WHERE (Trang_thai = 'Chưa xác nhận' OR Trang_thai = 'Đã xác nhận') 
        AND Ngay_tra < ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $today);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Đã cập nhật trạng thái quá hạn."]);
} else {
    echo json_encode(["success" => false, "message" => "Lỗi khi cập nhật: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
