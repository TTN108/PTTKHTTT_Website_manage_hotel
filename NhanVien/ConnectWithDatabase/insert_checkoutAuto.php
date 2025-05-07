<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';
$db   = new Database();
$conn = $db->conn;

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$ma_don_dat_phong = $data["Ma_don_dat_phong"];
$items = $data["phong"];

$conn->begin_transaction();
try {
    foreach ($items as $item) {
        $ma_phong = $conn->real_escape_string($item["Ma_phong"]);
        $conn->query("UPDATE phong SET Trang_thai = 'Trống' WHERE ID = '$ma_phong' and Trang_thai = 'Có người ở'");
    }
    $conn->query("UPDATE don_dat_phong SET Trang_thai = 'Đã trả phòng' WHERE Ma_don_dat_phong = '$ma_don_dat_phong'");

    $conn->commit(); // QUAN TRỌNG
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
