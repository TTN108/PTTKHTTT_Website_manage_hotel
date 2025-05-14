<html lang="vi">
    <head>
        <title>Sunset Hotel</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <link rel="icon" type="image/png" href="imgs/logo-icon.png">
        <link rel="stylesheet" href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
        <link rel="stylesheet" href="css/home.css">
        <link rel="stylesheet" href="css/header.css">
        <link rel="stylesheet" href="css/content.css">
        <link rel="stylesheet" href="css/footer.css">
    </head>
    <body>
        <div id="messageDialog">
            
        </div>
        <?php
            require_once 'includes/header/header.php';
            require_once 'includes/content/content.php';
            require_once 'includes/footer/footer.php';
        ?>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script src="js/messageDialog.js"></script>
        <script src="js/checkin_checkout.js"></script>
        <script src="js/login_signin.js"></script>
        <script src="js/check_login.js"></script>
        <script src="js/header.js"></script>
        <script src="js/room.js"></script>
        <script src="js/logout.js"></script>
        <script src="js/booking.js"></script>
    </body>
</html>