<?php
header('Content-Type: application/json');
require_once __DIR__ . '/ConnectDataBase.php';

try {
    $db   = new Database();
    $conn = $db->conn;

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'No data received or JSON malformed']);
        exit;
    }

    $accountData  = $data['account'] ?? null;
    $customerData = $data['customer'] ?? null;
    $booking      = $data['booking'] ?? null;
    $phong        = $data['phong'] ?? null;
    $tongTien     = $data['Gia'] ?? 0;
<<<<<<< HEAD
=======
    $NVID         = $data['Ma_nhan_vien'] ?? null;
>>>>>>> 9d397ef5eadaf216c1a0fb1a3a32e3b2a065e9a4

    if (!$booking || !$phong) {
        echo json_encode(['success' => false, 'message' => 'Missing booking or room data']);
        exit;
    }

    $username = $accountData['Username'] ?? $booking['Account'];
    $cccd     = $customerData['CCCD'] ?? '';

    $conn->begin_transaction();

    // Kiểm tra và thêm account
    if ($accountData) {
        $checkUser = $conn->prepare("SELECT 1 FROM account WHERE Username = ?");
        $checkUser->bind_param("s", $username);
        $checkUser->execute();
        $checkUser->store_result();
        $userExists = $checkUser->num_rows > 0;

        if (!$userExists) {
            $stmt = $conn->prepare("INSERT INTO account (Username, Password, Email, Status) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $accountData['Username'], $accountData['Password'], $accountData['Email'], $accountData['Status']);
            $stmt->execute();
        }
    }

    // Kiểm tra và thêm khách hàng
    if ($customerData) {
        $checkCCCD = $conn->prepare("SELECT 1 FROM khach_hang WHERE CCCD = ?");
        $checkCCCD->bind_param("s", $cccd);
        $checkCCCD->execute();
        $checkCCCD->store_result();
        $cccdExists = $checkCCCD->num_rows > 0;

        if (!$cccdExists) {
            $stmt = $conn->prepare("INSERT INTO khach_hang (CCCD, Ten, SDT, Dia_chi, Account) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $customerData['CCCD'], $customerData['Ten'], $customerData['SDT'], $customerData['Dia_chi'], $customerData['Account']);
            $stmt->execute();
        }
    }

    // Đơn đặt phòng
    $stmt = $conn->prepare("INSERT INTO don_dat_phong (Account, Ngay_nhan, Ngay_tra, So_luong_phong, So_luong_nguoi, Ma_Loai_Phong, Ngay_dat, Trang_thai) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssiisss", $booking['Account'], $booking['Ngay_nhan'], $booking['Ngay_tra'], $booking['So_luong_phong'], $booking['So_luong_nguoi'], $booking['Ma_Loai_Phong'], $booking['Ngay_dat'], $booking['Trang_thai']);
    $stmt->execute();

    $maDon = $conn->insert_id;

    // Hóa đơn
<<<<<<< HEAD
    $stmt = $conn->prepare("INSERT INTO hoa_don (Ma_don_dat_phong, Ma_nhan_vien, Tong_tien) VALUES (?, NULL, ?)");
    $stmt->bind_param("id", $maDon, $tongTien);
=======
    $stmt = $conn->prepare("INSERT INTO hoa_don (Ma_don_dat_phong, Ma_nhan_vien, Tong_tien) VALUES (?, ?, ?)");
    $stmt->bind_param("isd", $maDon, $NVID,$tongTien);
>>>>>>> 9d397ef5eadaf216c1a0fb1a3a32e3b2a065e9a4
    $stmt->execute();
    $maHD = $conn->insert_id;

    // Chi tiết hóa đơn + cập nhật phòng
    foreach ($phong as $maPhong) {
        $stmt = $conn->prepare("INSERT INTO chi_tiet_hoa_don (Ma_Hoa_Don, Ma_phong) VALUES (?, ?)");
        $stmt->bind_param("is", $maHD, $maPhong);
        $stmt->execute();

        $stmt = $conn->prepare("UPDATE phong SET Trang_thai = 'Có người ở' WHERE ID = ?");
        $stmt->bind_param("s", $maPhong);
        $stmt->execute();
    }

    $conn->commit();
    echo json_encode(['success' => true, 'ma_hoa_don' => $maHD]);
} catch (Exception $e) {
    if ($conn && $conn->errno === 0) {
        $conn->rollback();
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>