<?php
    require("../database/account.php");
    if($_GET["op"] == "add"){
        $account = new account();
        $id = $_GET["id"];
        $name = $_GET["fullname"];
        $phone = $_GET["phone"];
        $address = $_GET["address"];
        $username = $_GET["username"];
        $pass = $_GET["password"];
        $email = $_GET["email"];
        $role = $_GET["role"];
        $account->insert_employee($id, $name, $phone, $address, $username, $pass, $email, $role);
        $account->close();
    }
    if($_GET["op"] == "lock"){
        $account = new account();
        $id = $_GET["id"];
        $username = $_GET["username"];
        $account->lock_employee($username);
        $account->close();
    }
    if($_GET["op"] == "unlock"){
        $account = new account();
        $id = $_GET["id"];
        $username = $_GET["username"];
        $account->unlock_employee($username);
        $account->close();
    }
    if($_GET["op"] == "update"){
        $account = new account();
        $id = $_GET["id"];
        $name = $_GET["fullname"];
        $phone = $_GET["phone"];
        $address = $_GET["address"];
        $account->update_employee($id, $name, $phone, $address);
        $account->close();
    }
?>