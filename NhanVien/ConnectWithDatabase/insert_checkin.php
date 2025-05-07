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
  
  $conn->begin_transaction();
  
  try {
    // 1. Thêm tài khoản
    $acc = $data['account'];
    $stmt = $conn->prepare("INSERT INTO account (Username, Password, Email, Status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $acc['Username'], $acc['Password'], $acc['Email'], $acc['Status']);
    $stmt->execute();
  
    // 2. Thêm khách hàng
    $cus = $data['customer'];
    $stmt = $conn->prepare("INSERT INTO khach_hang (CCCD, Ten, SDT, Dia_chi, Account) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $cus['CCCD'], $cus['Ten'], $cus['SDT'], $cus['Dia_chi'], $cus['Account']);
    $stmt->execute();
  
    // 3. Thêm đơn đặt phòng
    $booking = $data['booking'];
    $stmt = $conn->prepare("INSERT INTO don_dat_phong (Account, Ngay_nhan, Ngay_tra, So_luong_phong, So_luong_nguoi, Ma_Loai_Phong, Ngay_dat, Trang_thai) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiisss", $booking['Account'], $booking['Ngay_nhan'], $booking['Ngay_tra'], $booking['So_luong_phong'], $booking['So_luong_nguoi'], $booking['Ma_Loai_Phong'], $booking['Ngay_dat'], $booking['Trang_thai']);
    $stmt->execute();
  
    // 4. Thêm hóa đơn
    $stmt = $conn->prepare("INSERT INTO hoa_don (Ma_don_dat_phong, Ma_nhan_vien, Tong_tien) VALUES (?, NULL, ?)");
    $maDon = $conn->insert_id; // Lấy ID của đơn đặt
    $amount = 0;
    $phong = $data['phong'];
    $stmt->bind_param("id", $maDon, $data['Gia']);
    $stmt->execute();
    $maHD = $conn->insert_id; // Mã hóa đơn thực tế
    
    // 5. Thêm chi tiết hóa đơn
    foreach ($phong as $ct) {
      $stmt = $conn->prepare("INSERT INTO chi_tiet_hoa_don (Ma_Hoa_Don, Ma_phong) VALUES (?, ?)");
      $stmt->bind_param("is", $maHD, $ct);
      $stmt->execute();
    }
  
    // 6. Cập nhật trạng thái phòng
    foreach ($phong as $maPhong) {
      $stmt = $conn->prepare("UPDATE phong SET Trang_thai = 'Có người ở' WHERE ID = ?");
      $stmt->bind_param("s", $maPhong);
      $stmt->execute();
    }
  
    $conn->commit();
    echo json_encode(['success' => true, 'ma_hoa_don' => $maHD]);
  } catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
  }
?>