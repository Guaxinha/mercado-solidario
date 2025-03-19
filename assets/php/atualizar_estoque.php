<?php
session_start();
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['items'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$items = $data['items'];

try {
    foreach ($items as $item) {
        $codigo_produto = $item['code'];
        $quantidade = $item['quantity'];

        // Atualizar a quantidade em estoque do produto
        $stmt = $conn->prepare("UPDATE produtos SET quantidade_estoque = quantidade_estoque - ? WHERE codigo_produto = ?");
        $stmt->bind_param("is", $quantidade, $codigo_produto);
        $stmt->execute();
        $stmt->close();
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Fechar a conexão
$conn->close();
?>