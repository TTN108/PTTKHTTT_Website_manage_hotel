<?php
    session_start();
    require_once "check_exist.php" ;
    require_once "getUser.php";
    if (isset($_SESSION['user'])&&checkUserExist($_SESSION['user']['Username'])) 
    {
        $user=getUser($_SESSION['user']['Username']);

        if($user['Status']==='Hoạt động')
        {
            $response = [
                'status' => 'success',
                'message' => '<p><i class="fa-regular fa-circle-check green icon"></i>Chào mừng trở lại, '.htmlspecialchars($user['Username'], ENT_QUOTES, 'UTF-8').'!</p>',
                'html' => "Chào, {$user['Username']}",
            ];
        }
        else
        {
            session_destroy();
            if($user['Status']==="Ngưng")
            {
                $response = [
                    'status' => 'error',
                    'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Tài khoản '.htmlspecialchars($user['Username'], ENT_QUOTES, 'UTF-8').' đã bị khóa!</p>',
                    'html' => '',
                ];
            }
            else
            {
                $response = [
                    'status' => 'error',
                    'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Tài khoản '.htmlspecialchars($user['Username'], ENT_QUOTES, 'UTF-8').' không tồn tại!</p>',
                    'html' => '',
                ];
            }
        }
    }
    else
    {
        session_destroy();
        $response = [
            'status' => 'error',
            'message' => '',
            'html' => '',
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
?>
