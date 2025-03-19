<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    include('conexao.php');

    $userId = $_SESSION['user_id'];
    $sql = "SELECT nome, nivel, login FROM usuarios WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Retornar os dados do usuário
        echo json_encode([
            "status" => "success",
            "user" => [
                "name" => $row['nome'],
                "level" => $row['nivel'],
                "login" => $row['login']
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Usuário não encontrado."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Usuário não autenticado."
    ]);
}
exit();
?>
