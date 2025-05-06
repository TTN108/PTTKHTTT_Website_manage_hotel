<?php
// connect.php
require_once __DIR__ . 'ConnectDataBase.php'; // Đường dẫn đến file chứa class Database
$db   = new Database();
$conn = $db->conn;
?>