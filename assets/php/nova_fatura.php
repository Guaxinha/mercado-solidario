<?php
session_start();
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['items']) || !isset($data['total']) || !isset($data['family'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$items = $data['items'];
$total = $data['total'];
$family = $data['family'];
$date = date('Y-m-d H:i:s'); // Obter a data e hora atuais

try {
    // Inserir a fatura na tabela faturas
    $stmt = $conn->prepare("INSERT INTO faturas (familia, total, data) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $family, $total, $date);
    $stmt->execute();
    $fatura_id = $stmt->insert_id; // Obter o ID da fatura recém-criada
    $stmt->close();

    // Inserir os itens da fatura na tabela fatura_itens
    $stmt_item = $conn->prepare("INSERT INTO fatura_itens (id_fatura, codigo_produto, quantidade, total) VALUES (?, ?, ?, ?)");
    foreach ($items as $item) {
        $codigo_produto = $item['code'];
        $quantidade = $item['quantity'];
        $total_item = $item['totalItem'];
        $stmt_item->bind_param("isid", $fatura_id, $codigo_produto, $quantidade, $total_item);
        $stmt_item->execute();
    }
    $stmt_item->close();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Fechar a conexão
$conn->close();
?>