<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';

try {
    $db   = new Database();
    $conn = $db->conn;

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Không có dữ liệu hoặc JSON lỗi']);
        exit;
    }

    $ma_ddp = $data['Ma_don_dat_phong'] ?? null;
    $items  = $data['items'] ?? [];
    $tong   = $data['Tong_tien'] ?? 0;
    $hd     = $data['idhd'] ?? 0;
    $phong  = $data['phong'] ?? null;

    if (!$ma_ddp || !$hd) {
        echo json_encode(['success' => false, 'message' => 'Thiếu dữ liệu cần thiết']);
        exit;
    }

    $conn->begin_transaction();

    // 1. Cập nhật hóa đơn
    $stmt = $conn->prepare("UPDATE hoa_don SET Tong_tien = ? WHERE Ma_don_dat_phong = ? AND Ma_Hoa_Don = ?");
    $stmt->bind_param("dii", $tong, $ma_ddp, $hd);
    $stmt->execute();

    // 2. Thêm chi tiết hóa đơn
    $stmtDetail = $conn->prepare("INSERT INTO chi_tiet_phong_hoa_don (Ma_Hoa_Don, Ma_phong, Ma_do_dung) VALUES (?, ?, ?)");
    $stmtUpdateItem = $conn->prepare("UPDATE do_dung SET So_luong = So_luong - 1 WHERE Ma_Do_Dung = ? AND so_luong > 0");

    foreach ($items as $item) {
      if (!isset($item['Ma_Do_Dung'], $item['Ma_phong'])) {
        throw new Exception("Dữ liệu item không hợp lệ: " . json_encode($item));
      }
      $ma_dd    = $item['Ma_Do_Dung'];
      $ma_phong = $item['Ma_phong'];

      // Thêm chi tiết hóa đơn
      $stmtDetail->bind_param("iss", $hd, $ma_phong, $ma_dd);
      $stmtDetail->execute();

      // Trừ số lượng đồ dùng
      $stmtUpdateItem->bind_param("s", $ma_dd);
      $stmtUpdateItem->execute();
    }

    // 3. Cập nhật trạng thái phòng
    $stmtUpdate = $conn->prepare("UPDATE phong SET Trang_thai = 'Đang dọn dẹp' WHERE ID = ?");
    foreach ($phong as $p) {
      $stmtUpdate->bind_param("s", $p);
      $stmtUpdate->execute();
    }
    // 5. Cập nhật trạng thái đơn đặt phòng
    $stmt = $conn->prepare("UPDATE don_dat_phong SET Trang_thai = 'Đã trả phòng', Ngay_tra = NOW() WHERE Ma_don_dat_phong = ?");
    $stmt->bind_param("i", $ma_ddp);
    $stmt->execute();

    $conn->commit();
    echo json_encode(['success' => true, 'ma_hoa_don' => $hd]);
} catch (Exception $e) {
    if ($conn && $conn->errno === 0) {
        $conn->rollback();
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
