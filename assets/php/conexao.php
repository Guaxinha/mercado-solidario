<?php
// Configurações do banco de dados
$host = 'localhost';
$dbname = 'mercado_solidario';
$username = 'root';
$password = '';

// Criando a conexão
$conn = new mysqli($host, $username, $password, $dbname);

// Verificando se há erros na conexão
if ($conn->connect_error) {
    die("Erro na conexão: " . $conn->connect_error);
}

?>