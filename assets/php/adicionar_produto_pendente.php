<?php
session_start();
date_default_timezone_set('America/Sao_Paulo');
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$id = $data['id'];

try {
    // Obter os dados do produto pendente
    $stmt = $conn->prepare("SELECT id_produto, id_padrinho, quantidade FROM produtos_pendentes WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->bind_result($id_produto, $id_padrinho, $quantidade);
    $stmt->fetch();
    $stmt->close();

    // Atualizar a quantidade em estoque do produto existente na tabela produtos
    $stmt_update = $conn->prepare("UPDATE produtos SET quantidade_estoque = quantidade_estoque + ? WHERE id = ?");
    $stmt_update->bind_param("ii", $quantidade, $id_produto);
    $stmt_update->execute();
    $stmt_update->close();

    // Deletar o produto pendente da tabela produtos_pendentes
    $stmt_delete = $conn->prepare("DELETE FROM produtos_pendentes WHERE id = ?");
    $stmt_delete->bind_param("i", $id);
    $stmt_delete->execute();
    $stmt_delete->close();

    // Obter o nome do padrinho e do produto para a atualização
    $stmt_info = $conn->prepare("SELECT p.nome AS nome_padrinho, pr.produto AS produto 
                                 FROM produtos_pendentes pp
                                 JOIN padrinhos p ON pp.id_padrinho = p.id
                                 JOIN produtos pr ON pp.id_produto = pr.id
                                 WHERE pp.id = ?");
    $stmt_info->bind_param("i", $id);
    $stmt_info->execute();
    $stmt_info->bind_result($nome_padrinho, $nome_produto);
    $stmt_info->fetch();
    $stmt_info->close();

    // Inserir uma nova linha na tabela "atualizacoes"
    $nome_usuario = $_SESSION['user_name']; // Assumindo que o nome do usuário está armazenado na sessão
    $data_atualizacao = date('Y-m-d');
    $hora_atualizacao = date('H:i:s');
    $atualizacao = "{$nome_padrinho} confirmou a doação de {$quantidade} unidades do produto {$nome_produto}";

    $stmt_atualizacao = $conn->prepare("INSERT INTO atualizacoes (nome_usuario, data_atualizacao, hora_atualizacao, atualizacao) VALUES (?, ?, ?, ?)");
    $stmt_atualizacao->bind_param("ssss", $nome_usuario, $data_atualizacao, $hora_atualizacao, $atualizacao);
    $stmt_atualizacao->execute();
    $stmt_atualizacao->close();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Fechar a conexão
$conn->close();
?>