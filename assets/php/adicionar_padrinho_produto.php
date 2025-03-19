<?php
session_start();
date_default_timezone_set('America/Sao_Paulo');
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['newSupportProduct'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$newSupportProduct = $data['newSupportProduct'];

try {
    // Inserir dados na tabela padrinho_produto
    $stmt = $conn->prepare("INSERT INTO produtos_pendentes (id_produto, id_padrinho, quantidade) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $newSupportProduct['produto_id'], $newSupportProduct['padrinho_id'], $newSupportProduct['quantidade']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Obter o nome do padrinho
        $stmt_padrinho = $conn->prepare("SELECT nome FROM padrinhos WHERE id = ?");
        $stmt_padrinho->bind_param("i", $newSupportProduct['padrinho_id']);
        $stmt_padrinho->execute();
        $stmt_padrinho->bind_result($nome_padrinho);
        $stmt_padrinho->fetch();
        $stmt_padrinho->close();

        // Obter o nome do produto
        $stmt_produto = $conn->prepare("SELECT produto FROM produtos WHERE id = ?");
        $stmt_produto->bind_param("i", $newSupportProduct['produto_id']);
        $stmt_produto->execute();
        $stmt_produto->bind_result($nome_produto);
        $stmt_produto->fetch();
        $stmt_produto->close();

        // Inserir uma nova linha na tabela "atualizacoes"
        $nome_usuario = $_SESSION['user_name']; // Assumindo que o nome do usuário está armazenado na sessão
        $data_atualizacao = date('Y-m-d');
        $hora_atualizacao = date('H:i:s');
        $atualizacao = "{$nome_padrinho} se comprometeu em dar {$newSupportProduct['quantidade']} unidades de {$nome_produto}";

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