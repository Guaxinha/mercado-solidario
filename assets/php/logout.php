<?php
session_start();
session_destroy(); // Destruir a sessão
header('Location: ../../html/login.html'); // Redirecionar para o login
exit();
?>