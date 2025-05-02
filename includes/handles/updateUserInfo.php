<?php 
    if($_SERVER['REQUEST_METHOD']==='POST')
    {
        require_once 'connect.php';

        $response = [];

        $username = $_POST['account-info-username'];
        $password = $_POST['account-info-password'];
        $fullname = $_POST['account-info-fullname'];
        $idCard = $_POST['account-info-id-card'];
        $email = $_POST['account-info-email'];
        $phone = $_POST['account-info-phone'];
        $address = $_POST['account-info-address'];

        $conn->begin_transaction();

        try
        {
            $sql = "UPDATE account SET 
                Password = ?, 
                Email = ?
            WHERE Username = ?";

            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sss", $password, $email, $username);
            $stmt->execute();

            $sql = "UPDATE khach_hang SET 
                Ten = ?, 
                CCCD = ?, 
                SDT = ?, 
                Dia_chi = ? 
            WHERE Account = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssss", $fullname, $idCard, $phone, $address, $username);
            $stmt->execute();

            $conn->commit();

            $response = [
                'status' => 'success',
                'message' => '<p><i class="fa-regular fa-circle-check green icon"></i>Cập nhật thông tin thành công!</p>',
            ];
        }
        catch(Exception $e)
        {
            $conn->rollback();
            $response = [
                'status' => 'error',
                'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Cập nhật thất bại, vui lòng thử lại!</p>'
            ];
        }

        header('Content-Type: application/json');
        echo json_encode($response);
    }
    else
    {
        echo 'Phương thức không hợp lệ';
    }
?>