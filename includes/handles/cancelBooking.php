<?php
require_once "connect.php";
session_start();

header("Content-Type: application/json");

// Kiểm tra đăng nhập và dữ liệu
if (!isset($_SESSION['user']) || !isset($_POST['id'])) {
    echo json_encode([
        "status" => "error",
        "message" => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Không hợp lệ. Vui lòng đăng nhập và thử lại.</p>'
    ]);
    exit;
}

$maDon = $_POST['id'];
$username = $_SESSION['user']['Username'];

$conn->begin_transaction();

try {
    // Kiểm tra đơn thuộc về user và trạng thái
    $checkStmt = $conn->prepare("
        SELECT Trang_thai 
        FROM don_dat_phong 
        WHERE Ma_don_dat_phong = ? AND Account = ?
        FOR UPDATE
    ");
    $checkStmt->bind_param("ss", $maDon, $username);
    $checkStmt->execute();
    $result = $checkStmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('<p><i class="fa-regular fa-circle-xmark red icon"></i>Không tìm thấy đơn đặt phòng hợp lệ.</p>');
    }

    $row = $result->fetch_assoc();
    if ($row['Trang_thai'] !== "Chưa xác nhận") {
        throw new Exception('<p><i class="fa-regular fa-circle-xmark red icon"></i>Chỉ có thể hủy đơn chưa xác nhận.</p>');
    }

    // Cập nhật trạng thái đơn
    $updateStmt = $conn->prepare("
        UPDATE don_dat_phong 
        SET Trang_thai = 'Đã hủy' 
        WHERE Ma_don_dat_phong = ?
    ");
    $updateStmt->bind_param("s", $maDon);
    if (!$updateStmt->execute()) {
        throw new Exception('<p><i class="fa-regular fa-circle-xmark red icon"></i>Không thể cập nhật trạng thái đơn.</p>');
    }

    // (Tùy chọn) Xử lý thêm liên quan đến hoàn tiền, hủy hóa đơn, v.v. tại đây

    $conn->commit();

    echo json_encode([
        "status" => "success",
        "message" => '<p><i class="fa-regular fa-circle-check green icon"></i>Đã hủy đơn đặt phòng thành công.</p>'
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
