<?php
session_start();
date_default_timezone_set('America/Sao_Paulo');
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['newSuport'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$newSuport = $data['newSuport'];

try {
    // Verificar se já existe um padrinho com o mesmo nome
    $stmt = $conn->prepare("SELECT COUNT(*) FROM padrinhos WHERE nome = ?");
    $stmt->bind_param("s", $newSuport['nome']);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();

    if ($count > 0) {
        echo json_encode(['success' => false, 'error' => 'Já existe um padrinho com esse nome.']);
        exit;
    }

    // Inserir dados na tabela padrinhos
    $stmt = $conn->prepare("INSERT INTO padrinhos (nome, celular) VALUES (?, ?)");
    $stmt->bind_param("ss", $newSuport['nome'], $newSuport['celular']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        // Inserir uma nova linha na tabela "atualizacoes"
        $nome_usuario = $_SESSION['user_name']; // Assumindo que o nome do usuário está armazenado na sessão
        $data_atualizacao = date('Y-m-d');
        $hora_atualizacao = date('H:i:s');
        $atualizacao = "Adicionou o padrinho {$newSuport['nome']}";

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