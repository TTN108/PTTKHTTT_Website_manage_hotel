<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
  echo json_encode(['success'=>false,'message'=>'Không có dữ liệu input']);
  exit;
}
$ma_ddp = $data['Ma_don_dat_phong'];
$items   = $data['items'];        // mảng { Ma_Do_Dung, Ma_phong }
$tong    = $data['Tong_tien'];

try {
  // 1) kết nối
  $pdo = new PDO('mysql:host=localhost;dbname=your_db;charset=utf8', 'user','pass', [
    PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION
  ]);
  $pdo->beginTransaction();

  // 2) insert vào HOA_DON
  $stmt = $pdo->prepare(
    "INSERT INTO HOA_DON (Ma_don_dat_phong, Tong_tien, Ngay_thanh_toan)
     VALUES (:mddp, :tong, NOW())"
  );
  $stmt->execute([':mddp'=>$ma_ddp, ':tong'=>$tong]);
  $ma_hd = $pdo->lastInsertId();

  // 3) insert chi tiết
  $stmtDet = $pdo->prepare(
    "INSERT INTO Chi_tiet_hoa_don (Ma_Hoa_Don, Ma_Do_Dung, Ma_phong)
     VALUES (:mhd, :mdung, :mphong)"
  );
  foreach($items as $it) {
    $stmtDet->execute([
      ':mhd'=>$ma_hd,
      ':mdung'=>$it['Ma_Do_Dung'],
      ':mphong'=>$it['Ma_phong']
    ]);
  }

  // 4) cập nhật trạng thái phòng = 'Đang dọn dẹp'
  $roomIds = array_unique(array_column($items, 'Ma_phong'));
  $in  = implode(',', array_fill(0, count($roomIds), '?'));
  $upd = $pdo->prepare("UPDATE PHONG SET Trang_thai='Đang dọn dẹp' WHERE ID IN ($in)");
  $upd->execute($roomIds);

  // 5) tạo event tự động chuyển sang 'Trống' sau 12s
  // — đảm bảo MySQL event_scheduler = ON trên server!
  foreach($roomIds as $rid) {
    $ename = "evt_checkout_{$rid}_" . time();
    $sqlE = "
      CREATE EVENT `$ename`
      ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 12 SECOND
      DO
        UPDATE PHONG SET Trang_thai='Trống' WHERE ID = :rid;
    ";
    $pdo->prepare($sqlE)->execute([':rid'=>$rid]);
  }

  $pdo->commit();
  echo json_encode(['success'=>true]);
}
catch(Exception $ex) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  echo json_encode(['success'=>false,'message'=>$ex->getMessage()]);
}
