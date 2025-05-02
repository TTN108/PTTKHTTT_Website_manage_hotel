<?php
    require_once "connect.php";
    function checkUserExist($username)
    {
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM account WHERE Username = ? LIMIT 1");
        $stmt->bind_param("s", $username); // s la du lieu kieu chuoi
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) 
        {
            return true;
        }
        else
        {
            return false;
        }
    }
?>