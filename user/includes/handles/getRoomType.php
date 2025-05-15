<?php
require_once 'connect.php';  
$response = [];

try {
    // $sql = "SELECT * FROM Loai_Phong";
    $sql = "SELECT * FROM loai_phong";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $loaiPhongData = [];
        while ($row = $result->fetch_assoc()) {
            $loaiPhongData[] = $row;
        }

        $response = [
            'status' => 'success',
            'data' => $loaiPhongData
        ];
    } else {
        $response = [
            'status' => 'error',
            'message' => 'Không có loại phòng nào trong cơ sở dữ liệu.'
        ];
    }
} catch (Exception $e) {
    $response = [
        'status' => 'error',
        'message' => 'Có lỗi khi truy xuất dữ liệu: ' . $e->getMessage()
    ];
}

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
