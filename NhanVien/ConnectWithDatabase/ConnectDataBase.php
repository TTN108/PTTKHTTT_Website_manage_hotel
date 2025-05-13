<?php
class Database {
    private $servername = "localhost"; // Thay đổi nếu cần
    private $username = "root"; // Thay đổi với tên người dùng của bạn
    private $password = ""; // Thay đổi với mật khẩu của bạn
    private $dbname = "hotel"; // Thay đổi với tên cơ sở dữ liệu của bạn
    public $conn;
    public function __construct() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);
        if ($this->conn->connect_error) {
            die("Kết nối thất bại: " . $this->conn->connect_error);
        }
    }

    public function getRooms() {
        $sql = "SELECT * FROM phong"; // Thay đổi tên bảng nếu cần
        $result = $this->conn->query($sql);
        $rooms = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $rooms[] = $row; // Lưu dữ liệu vào mảng
            }
        }
        return $rooms;
    }
    public function getRoomTypes() {
        $sql = "SELECT * FROM loai_phong"; // Thay đổi tên bảng nếu cần
        $result = $this->conn->query($sql);
        $roomTypes = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $roomTypes[] = $row; // Lưu dữ liệu vào mảng
            }
        }
        return $roomTypes;
    }
    public function getCustomers() {
        $sql = "SELECT * FROM khach_hang"; // Thay đổi tên bảng nếu cần
        $result = $this->conn->query($sql);
        $customers = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $customers[] = $row; // Lưu dữ liệu vào mảng
            }
        }
        return $customers;
    }
    public function getInvoices() {
        $sql = "SELECT * FROM hoa_don"; // Thay đổi tên bảng nếu cần
        $result = $this->conn->query($sql);
        $invoices = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $invoices[] = $row; // Lưu dữ liệu vào mảng
            }
        }
        return $invoices;
    }
    function getRoomDetails() {
        $sql = "SELECT * FROM chi_tiet_phong";
        $result = $this->conn->query($sql);
        $roomDetails = [];
    
        while ($row = $result->fetch_assoc()) {
            $roomDetails[] = $row;
        }
        return $roomDetails;
    }
    function getOrderDetails() {
        $sql = "SELECT * FROM chi_tiet_hoa_don";
        $result = $this->conn->query($sql);
        $orderDetails = [];
    
        while ($row = $result->fetch_assoc()) {
            $orderDetails[] = $row;
        }
        return $orderDetails;
    }
    function getObjects() {
        $sql = "SELECT * FROM do_dung";
        $result = $this->conn->query($sql);
        $objects = [];
    
        while ($row = $result->fetch_assoc()) {
            $objects[] = $row;
        }
        return $objects;
    }
    function getApplyForm() {
        $sql = "SELECT * FROM don_dat_phong";
        $result = $this->conn->query($sql);
        $objects = [];
    
        while ($row = $result->fetch_assoc()) {
            $objects[] = $row;
        }
        return $objects;
    }
    function getDetails() {
        $sql = "SELECT * FROM chi_tiet_phong_hoa_don";
        $result = $this->conn->query($sql);
        $objects = [];
    
        while ($row = $result->fetch_assoc()) {
            $objects[] = $row;
        }
        return $objects;
    }
    function getAccounts() {
        $sql = "SELECT * FROM account";
        $result = $this->conn->query($sql);
        $accounts = [];
    
        while ($row = $result->fetch_assoc()) {
            $accounts[] = $row;
        }
        return $accounts;
    }
    function getStaffs() {
        $sql = "SELECT * FROM nhan_vien";
        $result = $this->conn->query($sql);
        $staffs = [];
    
        while ($row = $result->fetch_assoc()) {
            $staffs[] = $row;
        }
        return $staffs;
    }
    // public function __destruct() {
    //     if ($this->conn && @$this->conn instanceof mysqli) {
    //         // Nếu còn mở, thì đóng lại an toàn
    //         if (@$this->conn->ping()) {
    //             $this->conn->close();
    //         }
    //     }
    // }
}
?>