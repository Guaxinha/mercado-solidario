<?php
session_start();
date_default_timezone_set('America/Sao_Paulo');
include('conexao.php');

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['newFamily']) || !isset($data['adressFamily']) || !isset($data['spouseFamily']) || !isset($data['members'])) {
    echo json_encode(['success' => false, 'error' => 'Dados incompletos.']);
    exit;
}

$newFamily = $data['newFamily'];
$adressFamily = $data['adressFamily'];
$spouseFamily = $data['spouseFamily'];
$members = $data['members'];

// Calcular data_inicio e data_final
$data_inicio = date('Y-m-d');
$data_final = date('Y-m-d', strtotime('+3 months', strtotime($data_inicio)));
$situacao = 'ativada';

try {
    // Inserir dados na tabela familias
    $stmt = $conn->prepare("INSERT INTO familias (nome, nascimento, rg, cpf, filiacao, celular, escolaridade, endereco, profissao, renda, estado_civil, data_inicio, data_final, situacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssssssss", $newFamily['nome'], $newFamily['nascimento'], $newFamily['rg'], $newFamily['cpf'], $newFamily['filiacao'], $newFamily['celular'], $newFamily['escolaridade'], $newFamily['endereco'], $newFamily['profissao'], $newFamily['renda'], $newFamily['estado_civil'], $data_inicio, $data_final, $situacao);
    $stmt->execute();
    $familyId = $stmt->insert_id; // Obter o ID da família inserida
    $stmt->close();

    // Inserir dados na tabela familias_endereco
    $stmt = $conn->prepare("INSERT INTO familias_endereco (id_familia, endereco, situacao, aluguel, prestacao) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $familyId, $adressFamily['endereco'], $adressFamily['situacao'], $adressFamily['aluguel'], $adressFamily['prestacao']);
    $stmt->execute();
    $stmt->close();

    // Inserir dados na tabela familias_conjuge
    $stmt = $conn->prepare("INSERT INTO familias_conjuge (id_familia, nome, nascimento, rg, cpf, filiacao, escolaridade, profissao, renda) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssssss", $familyId, $spouseFamily['nome'], $spouseFamily['nascimento'], $spouseFamily['rg'], $spouseFamily['cpf'], $spouseFamily['filiacao'], $spouseFamily['escolaridade'], $spouseFamily['profissao'], $spouseFamily['renda']);
    $stmt->execute();
    $stmt->close();

    // Inserir dados na tabela familias_membros
    $stmt = $conn->prepare("INSERT INTO familias_membros (id_familia, nome, nascimento, escolaridade, filiacao, profissao, renda) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($members as $member) {
        $stmt->bind_param("issssss", $familyId, $member['nome'], $member['nascimento'], $member['escolaridade'], $member['parentesco'], $member['profissao'], $member['renda']);
        $stmt->execute();
    }
    $stmt->close();

    // Inserir uma nova linha na tabela "atualizacoes"
    $nome_usuario = $_SESSION['user_name']; // Assumindo que o nome do usuário está armazenado na sessão
    $data_atualizacao = date('Y-m-d');
    $hora_atualizacao = date('H:i:s');
    $atualizacao = "Adicionou a família '{$newFamily['nome']}' com ID $familyId";

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