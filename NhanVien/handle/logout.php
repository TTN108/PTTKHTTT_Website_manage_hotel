<?php
    session_start();
    session_destroy();
    header("Location: ../nv_p.php");
?>