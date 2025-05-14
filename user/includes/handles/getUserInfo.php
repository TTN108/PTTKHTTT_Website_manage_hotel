<?php
    $response=[];
    session_start();
    require_once 'getUser.php';
    if(isset($_SESSION['user']))
    {
        $user=getUser($_SESSION['user']['Username']);
        if($user!=null)
        {
            $stmt=$conn->prepare('select * from khach_hang where Account = ? limit 1');
            $stmt->bind_param("s",$user['Username']);
            $stmt->execute();
            $result=$stmt->get_result()->fetch_assoc();
            
            $response=[
                'status' => 'success',
                'userInfo' => $user + $result,
            ];
        }
        else
        {
            $response=[
                'status' => 'error'
            ];
        }
    }
    else 
    {
        $response=[
            'status' => 'error',
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
?>