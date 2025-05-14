<?php
    require("../Database/import.php");
    $import = new import();
    $orderDetail = $_GET["orderDetail"];
    $date = $_GET["date"];
    $status = $_GET["status"];
    $providerID = $_GET["providerID"];
    $array = preg_split("/\r\n|\n|\r/", $orderDetail);
    $total = 0;
    for($i = 0; $i < sizeof($array); $i++){
        $array1 = preg_split("/-/", $array[$i]);
        // echo $array1[0] ." ". $array1[1] ." ". $array1[2];
        $total += (int)$array1[1]*(int)$array1[2];
    }
    $import->insert_import($date, $status, $total, $providerID);
    $sql = "SELECT Ma_Nhap_Hang FROM `nhap_hang` ORDER BY Ma_Nhap_Hang ASC";
    $res = mysqli_query($import->getConnect(), $sql);
    while($row = mysqli_fetch_array($res)){
        $orderId = $row[0];
    }
    for($i = 0; $i < sizeof($array); $i++){
        $array1 = preg_split("/-/", $array[$i]);
        $import->insert_detail($orderId, $array1[0].trim(" "), (int)$array1[1].trim(" "), (int)$array1[2].trim(" "));
        $import->update_product($array1[0].trim(" "), (int)$array1[1].trim(" "));
    }
    $import->close();
    header("Location: ../index.php?tab=import");
?>