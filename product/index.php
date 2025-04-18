<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý đồ dùng</title>
    <link rel="stylesheet" href="../css/style.css">
</head>

<body>

    <div class="sidebar">
        <button class="menu-toggle">☰</button>
        <a href="index.php?tab=product">
            <button id="inventory" class="tab">
                <i class="fa-solid fa-box-open"></i> <span class="text">Đồ dùng</span>
            </button>
        </a>
        <a href="index.php?tab=import">
            <button id="import_contract" class="tab">
                <i class="fas fa-file-invoice"></i> <span class="text">Đơn nhập hàng</span>
            </button>
        </a>
        <a href="index.php?tab=provider">
            <button id="provider" class="tab">
                <i class="fa-solid fa-image-portrait"></i>
                <span class="text">Nhà cung cấp</span>
            </button>
        </a>
    </div>

    <?php
    $page = isset($_GET["tab"]) ? $_GET["tab"] : "product";
    switch ($page) {
        case "product":
            echo "<script>document.getElementById('inventory').classList.add('active')</script>";
            include("../product/layout/product.php");
            break;
        case "import":
            echo "<script>document.getElementById('import_contract').classList.add('active')</script>";
            include("../product/layout/import.php");
            break;
        case "provider":
            echo "<script>document.getElementById('provider').classList.add('active')</script>";
            include("../product/layout/provider.php");
            break;
        default:
            include("../product/layout/product.php");
    }
    ?>

    <script src="../js/script.js"></script>

</body>

</html>