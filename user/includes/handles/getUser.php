<?php
    require_once('connect.php');
    function getUser($username)
    {
        global $conn;
        $stmt = $conn->prepare("SELECT * FROM account WHERE Username = ? LIMIT 1");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows>0)
        {
            return $result->fetch_assoc();
        }
        else
        {
            return null;
        }
    }
?>