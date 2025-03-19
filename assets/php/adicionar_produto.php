<?php
session_start();
date_default_timezone_set('America/Sao_Paulo');
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

$codigo_produto = $data['codigo_produto'];
$nome = $data['nome'];
$quantidade_estoque = $data['quantidade_estoque'];
$quantidade_necessaria = $data['quantidade_necessaria'];
$preco = $data['preco'];

try {
    // Inserir o novo produto no banco de dados
    $stmt = $conn->prepare("INSERT INTO produtos (codigo_produto, produto, quantidade_estoque, quantidade_necessaria, preco) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssidd", $codigo_produto, $nome, $quantidade_estoque, $quantidade_necessaria, $preco);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Inserir uma nova linha na tabela "atualizacoes"
        $nome_usuario = $_SESSION['user_name']; // Assumindo que o nome do usuário está armazenado na sessão
        $data_atualizacao = date('Y-m-d');
        $hora_atualizacao = date('H:i:s');
        $atualizacao = "Adicionou o produto $nome";

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