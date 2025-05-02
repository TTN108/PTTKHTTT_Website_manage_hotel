<?php
    if($_SERVER['REQUEST_METHOD']==='POST')
    {
        require_once 'connect.php';
        require_once 'getUser.php';
        
        $username = $_POST['signin-username'] ?? '';
        $password = $_POST['signin-password'] ?? '';
        $confirm = $_POST['signin-confirm-password'] ?? '';
        $fullname = $_POST['signin-fullname'] ?? '';
        $idcard = $_POST['signin-id-card'] ?? '';
        $email = $_POST['signin-email'] ?? '';
        $phone = $_POST['signin-phone'] ?? '';
        $country = $_POST['signin-country'] ?? '';
        $city = $_POST['signin-city'] ?? '';
        $address = $city.', '.$country;

        $response=[];

        $stmt=$conn->prepare("select * from khach_hang where CCCD = ? limit 1");
        $stmt->bind_param('s',$idcard);
        $stmt->execute();
        $result=$stmt->get_result();

        if($result->num_rows==0)
        {
            $user=getUser($username);
            if($user!=null)
            {
                $response = [
                    'status' => 'error',
                    'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Tên đăng nhập đã tồn tại</p>',
                ];
            }
            else
            {
                $conn->begin_transaction();
                try
                {
                    $status='Hoạt động';
                    $stmt= $conn->prepare('insert into account(Username,Password,Email,Status) values (?,?,?,?)');
                    $stmt->bind_param("ssss",$username,$password,$email,$status);
                    $stmt->execute();
                    $stmt= $conn->prepare('insert into khach_hang(CCCD,Ten,SDT,Dia_chi,Account) values (?,?,?,?,?)');
                    $stmt->bind_param("sssss",$idcard,$fullname,$phone,$address,$username);
                    $stmt->execute();

                    $conn->commit();
                    $response=[
                        'status' => 'success',
                        'message' => '<p><i class="fa-regular fa-circle-check green icon"></i>Đăng kí thành công!</p>',
                    ];
                }
                catch(Exception $e)
                {
                    $conn->rollback();
                    $response=[
                        'status' => 'error',
                        'message' => '<p><i class="fa-regular fa-circle-check green icon"></i>Đăng kí thất bại, vui lòng thử lại!</p>',
                        'error' => $e,
                    ];
                }
            }
        }
        else
        {
            $response = [
                'status' => 'error',
                'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Căn cước công dân đã được sử dụng</p>',
                'html' => '',
            ];
        }


        header('Content-Type: application/json');
        echo json_encode($response);
        exit();
    }
    else
    {
        echo 'Phương thức không hợp lệ';
    }
?>