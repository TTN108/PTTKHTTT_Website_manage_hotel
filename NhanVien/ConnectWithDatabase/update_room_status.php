<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';

try {
    $db   = new Database();
    $conn = $db->conn;

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['phong']) || !is_array($data['phong'])) {
        echo json_encode(['success' => false, 'message' => 'Dữ liệu phòng không hợp lệ']);
        exit;
    }

    $stmt = $conn->prepare("UPDATE phong SET Trang_thai = 'Trống' WHERE ID = ?");
    foreach ($data['phong'] as $ma_phong) {
        $stmt->bind_param("s", $ma_phong);
        $stmt->execute();
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
