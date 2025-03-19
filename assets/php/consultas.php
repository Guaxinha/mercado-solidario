<?php 
include('conexao.php');

try {
    // Array para armazenar os dados de todas as tabelas
    $dados = [];

    // Consultar tabelas banco de dados
    $queryUsuarios = "SELECT * FROM usuarios";
    $queryProdutos = "SELECT * FROM produtos";
    $queryPadrinhos = "SELECT * FROM padrinhos";
    $queryAtualizacoes = "SELECT * FROM atualizacoes";
    $queryFamilias = "SELECT * FROM familias";
    $queryFamiliasConjuges = "SELECT * FROM familias_conjuge";
    $queryFamiliasMembros = "SELECT * FROM familias_membros";
    $queryFamiliasEnderecos = "SELECT * FROM familias_endereco";
    $queryProdutosPendentes = "SELECT * FROM produtos_pendentes";
    $queryFaturas = "SELECT * FROM faturas";
    $queryFaturaItens = "SELECT * FROM fatura_itens";

    // Executar as consultas
    $resultProdutosPendentes = $conn->query($queryProdutosPendentes); // Executar a consulta
    if ($resultProdutosPendentes->num_rows > 0) { // Verificar se algum produto pendente foi encontrado
        $produtosPendentes = []; // Array para armazenar os produtos pendentes
        while ($produtoPendente = $resultProdutosPendentes->fetch_assoc()) { // Iterar sobre os resultados
            $produtosPendentes[] = $produtoPendente; // Adicionar o produto pendente ao array
        }
        $dados['produtosPendentes'] = $produtosPendentes; // Adicionar ao array principal
    } else {
        $dados['produtosPendentes'] = []; // Caso nenhum produto pendente seja encontrado
    }

    $resultUsuarios = $conn->query($queryUsuarios); // Executar a consulta
    if ($resultUsuarios->num_rows > 0) { // Verificar se algum usuário foi encontrado
        $usuarios = []; // Array para armazenar os usuários
        while ($usuario = $resultUsuarios->fetch_assoc()) { // Iterar sobre os resultados
            $usuarios[] = $usuario; // Adicionar o usuário ao array
        }
        $dados['usuarios'] = $usuarios; // Adicionar ao array principal
    } else {
        $dados['usuarios'] = []; // Caso nenhum usuário seja encontrado
    }

    $resultProdutos = $conn->query($queryProdutos); // Executar a consulta
    if ($resultProdutos->num_rows > 0) { // Verificar se algum produto foi encontrado
        $produtos = []; // Array para armazenar os produtos
        while ($produto = $resultProdutos->fetch_assoc()) { // Iterar sobre os resultados
            $produtos[] = $produto; // Adicionar o produto ao array
        }
        $dados['produtos'] = $produtos; // Adicionar ao array principal
    } else {
        $dados['produtos'] = []; // Caso nenhum produto seja encontrado
    }

    $resultPadrinhos = $conn->query($queryPadrinhos); // Executar a consulta
    if ($resultPadrinhos->num_rows > 0) { // Verificar se algum padrinho foi encontrado
        $padrinhos = []; // Array para armazenar os padrinhos
        while ($padrinho = $resultPadrinhos->fetch_assoc()) { // Iterar sobre os resultados
            $padrinhos[] = $padrinho; // Adicionar o padrinho ao array
        }
        $dados['padrinhos'] = $padrinhos; // Adicionar ao array principal
    } else {
        $dados['padrinhos'] = []; // Caso nenhum padrinho seja encontrado
    }

    $resultAtualizacoes = $conn->query($queryAtualizacoes); // Executar a consulta
    if ($resultAtualizacoes->num_rows > 0) { // Verificar se alguma atualização foi encontrada
        $atualizacoes = []; // Array para armazenar as atualizações
        while ($atualizacao = $resultAtualizacoes->fetch_assoc()) { // Iterar sobre os resultados
            $atualizacoes[] = $atualizacao; // Adicionar a atualização ao array
        }
        $dados['atualizacoes'] = $atualizacoes; // Adicionar ao array principal
    } else {
        $dados['atualizacoes'] = []; // Caso nenhuma atualização seja encontrada
    }

    $resultFamilias = $conn->query($queryFamilias); // Executar a consulta
    if ($resultFamilias->num_rows > 0) { // Verificar se alguma familia foi encontrada
        $familias = []; // Array para armazenar as familias
        while ($familia = $resultFamilias->fetch_assoc()) { // Iterar sobre os resultados
            $familias[] = $familia; // Adicionar a familia ao array
        }
        $dados['familias'] = $familias; // Adicionar ao array principal
    } else {
        $dados['familias'] = []; // Caso nenhuma familia seja encontrada
    }

    $resultFamiliasConjuges = $conn->query($queryFamiliasConjuges); // Executar a consulta
    if ($resultFamiliasConjuges->num_rows > 0) { // Verificar se algum conjugue foi encontrado
        $familiasConjuges = []; // Array para armazenar os conjugues    
        while ($familiasConjuge = $resultFamiliasConjuges->fetch_assoc()) { // Iterar sobre os resultados
            $familiasConjuges[] = $familiasConjuge; // Adicionar o conjugue ao array
        }
        $dados['familiasConjuges'] = $familiasConjuges; // Adicionar ao array principal
    } else {
        $dados['familiasConjuges'] = []; // Caso nenhum conjugue seja encontrado
    }

    $resultFamiliasMembros = $conn->query($queryFamiliasMembros); // Executar a consulta
    if ($resultFamiliasMembros->num_rows > 0) { // Verificar se algum membro foi encontrado
        $familiasMembros = []; // Array para armazenar os membros
        while ($familiasMembro = $resultFamiliasMembros->fetch_assoc()) { // Iterar sobre os resultados
            $familiasMembros[] = $familiasMembro; // Adicionar o membro ao array
        }
        $dados['familiasMembros'] = $familiasMembros; // Adicionar ao array principal
    } else {
        $dados['familiasMembros'] = []; // Caso nenhum membro seja encontrado
    }

    $resultFamiliasEnderecos = $conn->query($queryFamiliasEnderecos); // Executar a consulta
    if ($resultFamiliasEnderecos->num_rows > 0) { // Verificar se algum endereco foi encontrado
        $familiasEnderecos = []; // Array para armazenar os endereços
        while ($familiasEndereco = $resultFamiliasEnderecos->fetch_assoc()) { // Iterar sobre os resultados
            $familiasEnderecos[] = $familiasEndereco; // Adicionar o endereço ao array
        }    
        $dados['familiasEnderecos'] = $familiasEnderecos; // Adicionar ao array principal
    } else {
        $dados['familiasEnderecos'] = []; // Caso nenhum endereço seja encontrado
    }

    $resultFaturas = $conn->query($queryFaturas); // Executar a consulta
    if ($resultFaturas->num_rows > 0) { // Verificar se alguma fatura foi encontrada
        $faturas = []; // Array para armazenar as faturas
        while ($fatura = $resultFaturas->fetch_assoc()) { // Iterar sobre os resultados
            $faturas[] = $fatura; // Adicionar a fatura ao array
        }
        $dados['faturas'] = $faturas; // Adicionar ao array principal
    } else {
        $dados['faturas'] = []; // Caso nenhuma fatura seja encontrada
    }

    $resultFaturasItens = $conn->query($queryFaturaItens); // Executar a consulta
    if ($resultFaturasItens->num_rows > 0) { // Verificar se algum item da fatura foi encontrado
        $faturasItens = []; // Array para armazenar os itens da fatura
        while ($faturasItem = $resultFaturasItens->fetch_assoc()) { // Iterar sobre os resultados
            $faturasItens[] = $faturasItem; // Adicionar o item da fatura ao array
        }
        $dados['faturasItens'] = $faturasItens; // Adicionar ao array principal
    } else {
        $dados['faturasItens'] = []; // Caso nenhum item da fatura seja encontrado
    }

    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); // Retornar os dados
} catch (Exception $e) {
    echo "Erro: " . $e->getMessage(); // Retornar o erro
}

// Fechar a conexão
$conn->close();
?>