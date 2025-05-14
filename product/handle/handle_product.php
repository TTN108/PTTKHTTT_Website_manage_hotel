<?php
    require("../Database/product.php");
    $op = $_GET["op"];
    if($op == "update"){
        $product = new product();
        $id = $_GET["editID"];
        $name = $_GET["editName"];
        $category = $_GET["editCategory"];
        $price = $_GET["editPrice"];
        $quantity = $_GET["editQuantity"];
        $product->update($id, $name, $category, $price, $quantity);
        $product->close();
    }
    if($op == "insert"){
        $product = new product();
        $id = $_GET["id"];
        $name = $_GET["name"];
        $category = $_GET["category"];
        $price = $_GET["price"];
        $quantity = $_GET["quantity"];
        $product->insert($id, $name, $category, $price, $quantity);
        $product->close();
    }
    if($op == "delete"){
        $product = new product();
        $id = $_GET["id"];
        $product->delete($id);
        $product->close();
    }
?>