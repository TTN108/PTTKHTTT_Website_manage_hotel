<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';
$db   = new Database();
$conn = $db->conn;
$data = json_decode(file_get_contents("php://input"), true);

$invoiceId = $data['invoice']['invoiceId'] ?? $data['invoice'] ?? null;
$roomId    = $data['roomId'] ?? null;
$object    = $data['item'] ?? [];

try {
    if (!$roomId || !$invoiceId || !is_array($object)) {
        throw new Exception("Thiếu dữ liệu đầu vào hoặc sai định dạng.");
    }

    // 1. Cập nhật trạng thái phòng => 'Trống'
    $stmt = $conn->prepare("UPDATE phong SET Trang_thai = 'Trống' WHERE ID = ?");
    $stmt->execute([$roomId]);

    // 2. Cập nhật ngày trả và trạng thái hóa đơn (chỉ update hóa đơn chưa có Ngay_tra)
    $stmt = $conn->prepare("UPDATE hoa_don SET Ngay_tra = NOW() 
                            WHERE Ma_phong = ? AND Ngay_tra IS NULL");
    $stmt->execute([$roomId]);

    // 3. Cập nhật chi tiết hóa đơn (nếu có item)
    $stmt = $conn->prepare("UPDATE chi_tiet_hoa_don SET Ma_Do_dung = ? 
                            WHERE Ma_Hoa_Don = ?");
    foreach ($object as $item) {
        if (isset($item['id'])) {
            $stmt->execute([$item['id'], $invoiceId]);
        }
    }

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>
