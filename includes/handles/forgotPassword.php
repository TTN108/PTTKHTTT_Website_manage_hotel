<?php 
    if($_SERVER['REQUEST_METHOD']==='POST')
    {
        header("Content-Type: application/json");
        require_once "connect.php";

        $stmt=$conn->prepare("
            select * 
            from account
            where Username = ? 
            and Email = ? 
        ");

        $stmt->bind_param("ss",$_POST['username'],$_POST['email']);
        $stmt->execute();
        $result=$stmt->get_result();

        $response=[];

        if($result->num_rows==0)
        {
            $response=[
                'status' => 'error',
                'message' => '<p><i class="fa-regular fa-circle-xmark red icon"></i>Tên đăng nhập hoặc email không đúng!</p>'
            ];
        }
        else
        {
            $response=[
                'status' => 'success',
                'message' => '<p><i class="fa-regular fa-circle-check green icon"></i>Lấy mật khẩu thành công!</p>',
                'password' => $result->fetch_assoc()['Password']
            ];
        }
        echo json_encode($response);
    }
    else
    {
        echo "Phuong thuc khong hop le";
    }
?>