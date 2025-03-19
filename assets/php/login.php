<?php
session_start();
include('conexao.php');
header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

if ($data) {
    $user = $data['user'];
    $password = $data['password'];

    $sql = "SELECT id, login, nome, senha, nivel FROM usuarios WHERE login = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $id = $row['id'];
        $hash = $row['senha'];
        $nivel = $row['nivel'];

        if (password_verify($password, $hash)) {
            // Salvar informações na sessão
            $_SESSION['user_id'] = $id;
            $_SESSION['user_name'] = $row['login'];
            $_SESSION['user_level'] = $nivel;

            // Redirecionar baseado no nível
            $redirect = "";
            if ($nivel == 1) $redirect = "nivel_01/nivel_01.html";
            elseif ($nivel == 2) $redirect = "nivel_02/dashboard_nv_02.html";
            elseif ($nivel == 3) $redirect = "nivel_03.html";

            $response = [
                "status" => "success",
                "message" => "Login bem-sucedido!",
                "redirect" => $redirect
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "Senha incorreta."
            ];
        }
    } else {
        $response = [
            "status" => "error",
            "message" => "Usuário inexistente."
        ];
    }
} else {
    $response = [
        "status" => "error",
        "message" => "Dados inválidos."
    ];
}

echo json_encode($response);
exit();
?>
