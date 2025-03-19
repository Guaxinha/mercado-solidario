<?php
session_start();
date_default_timezone_set('America/Sao_Paulo');
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

$id = $data['id'];
$field = $data['field'];
$value = $data['value'];
$produto = $data['produto'];

try {
    // Validar o campo para evitar SQL Injection
    $allowedFields = ['produto', 'quantidade_estoque', 'quantidade_necessaria', 'preco'];
    if (!in_array($field, $allowedFields)) {
        throw new Exception('Campo inválido.');
    }

    // Atualizar o valor no banco de dados
    $stmt = $conn->prepare("UPDATE produtos SET $field = ? WHERE codigo_produto = ?");
    $stmt->bind_param(is_numeric($value) ? 'di' : 'si', $value, $id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Definir uma descrição amigável para o campo atualizado
        switch ($field) {
            case 'produto':
                $field_description = 'Nome do produto';
                break;
            case 'quantidade_estoque':
                $field_description = 'Quantidade em estoque';
                break;
            case 'quantidade_necessaria':
                $field_description = 'Quantidade necessária';
                break;
            case 'preco':
                $field_description = 'Preço';
                break;
            default:
                $field_description = $field;
        }

        // Inserir uma nova linha na tabela "atualizacoes"
        $nome_usuario = $_SESSION['user_name']; // Assumindo que o nome do usuário está armazenado na sessão
        $data_atualizacao = date('Y-m-d');
        $hora_atualizacao = date('H:i:s');
        $atualizacao = "Atualizou o(a) $field_description do produto $produto para $value";

        $stmt_atualizacao = $conn->prepare("INSERT INTO atualizacoes (nome_usuario, data_atualizacao, hora_atualizacao, atualizacao) VALUES (?, ?, ?, ?)");
        $stmt_atualizacao->bind_param("ssss", $nome_usuario, $data_atualizacao, $hora_atualizacao, $atualizacao);
        $stmt_atualizacao->execute();
        $stmt_atualizacao->close();

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Nenhuma alteração foi feita.']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Fechar a conexão
$conn->close();
?>