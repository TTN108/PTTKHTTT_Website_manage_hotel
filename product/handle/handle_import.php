<?php
    require("../Database/import.php");
    $import = new import();
    $orderId = $_GET["orderID"];
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
    $import->insert_import($orderId, $date, $status, $total, $providerID);
    for($i = 0; $i < sizeof($array); $i++){
        $array1 = preg_split("/-/", $array[$i]);
        $import->insert_detail($orderId, $array1[0].trim(" "), (int)$array1[1].trim(" "), (int)$array1[2].trim(" "));
        $import->update_product($array1[0].trim(" "), (int)$array1[1].trim(" "));
    }
    $import->close();
?>