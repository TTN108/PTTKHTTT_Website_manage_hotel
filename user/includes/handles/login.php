<?php
    if($_SERVER['REQUEST_METHOD']==='POST')
    {
        require_once 'getUser.php';

        $username=$_POST['login-username'] ?? '';
        $password=$_POST['login-password'] ?? '';
        $user=getUser($username);

        $response=[];

        if($user!=null)
        {
            if ($user['Status']==='Hoạt động')
            {
                if ($password===$user['Password']) 
                {
                    session_start();
                    $_SESSION['user']=$user;
    
                    $response = [
                        'status' => 'success',
                        'message' => '<p><i class="fa-regular fa-circle-check green icon"></i>Đăng nhập thành công!</p>',
                        'html' => "Chào, $username",
                    ];
                }
                else {
                    $response = [
                        'status' => 'error',
                        'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Tên đăng nhập hoặc mật khẩu không đúng!</p>',
                        'html' => '',
                    ];
                }
            }
            else
            {
                $response = [
                    'status' => 'error',
                    'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Tài khoản đã bị khóa!</p>',
                    'html' => '',
                ];
            }
        }
        else
        {
            $response = [
                'status' => 'error',
                'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Tên đăng nhập hoặc mật khẩu không đúng</p>',
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