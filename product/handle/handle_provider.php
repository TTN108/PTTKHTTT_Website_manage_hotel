<?php
    require("../Database/provider.php");
    $op = $_GET["op"];
    if($op == "insert"){
        $provider = new provider();
        $id = $_GET["id"];
        $name = $_GET["name"];
        $address = $_GET["address"];
        $phone = $_GET["phone"];
        $provider->insert($id, $name, $address, $phone);
        $provider->close();
    }
    if($op == "update"){
        $provider = new provider();
        $id = $_GET["editID"];
        $name = $_GET["editName"];
        $address = $_GET["editAddress"];
        $phone = $_GET["editPhone"];
        $provider->update($id, $name, $address, $phone);
        $provider->close();
    }
    if($op == "delete"){
        $provider = new provider();
        $id = $_GET["id"];
        $provider->delete($id);
        $provider->close();
    }
?>