SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `atualizacoes` (
  `id` int(11) NOT NULL,
  `nome_usuario` varchar(255) NOT NULL,
  `data_atualizacao` date NOT NULL,
  `hora_atualizacao` time NOT NULL,
  `atualizacao` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `familias` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `nascimento` date NOT NULL,
  `rg` char(9) NOT NULL,
  `cpf` char(11) NOT NULL,
  `filiacao` varchar(255) NOT NULL,
  `celular` char(13) NOT NULL,
  `escolaridade` varchar(255) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `profissao` varchar(255) NOT NULL,
  `renda` int(11) NOT NULL,
  `estado_civil` varchar(255) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_final` date NOT NULL,
  `situacao` char(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `familias_conjuge` (
  `id` int(11) NOT NULL,
  `id_familia` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `nascimento` date NOT NULL,
  `rg` text NOT NULL,
  `cpf` text NOT NULL,
  `filiacao` varchar(255) NOT NULL,
  `escolaridade` varchar(255) NOT NULL,
  `profissao` varchar(255) NOT NULL,
  `renda` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `familias_endereco` (
  `id` int(11) NOT NULL,
  `id_familia` int(11) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `situacao` varchar(255) NOT NULL,
  `aluguel` int(11) NOT NULL,
  `prestacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `familias_membros` (
  `id` int(11) NOT NULL,
  `id_familia` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `nascimento` date NOT NULL,
  `escolaridade` varchar(255) NOT NULL,
  `filiacao` varchar(255) NOT NULL,
  `profissao` varchar(255) NOT NULL,
  `renda` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `faturas` (
  `id` int(11) NOT NULL,
  `familia` varchar(255) NOT NULL,
  `total` varchar(255) NOT NULL,
  `data` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `fatura_itens` (
  `id` int(11) NOT NULL,
  `id_fatura` int(11) NOT NULL,
  `codigo_produto` char(3) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `total` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `padrinhos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `celular` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `produtos` (
  `id` int(11) NOT NULL,
  `codigo_produto` char(3) NOT NULL,
  `produto` varchar(255) NOT NULL,
  `quantidade_estoque` int(11) NOT NULL,
  `quantidade_necessaria` int(11) NOT NULL,
  `preco` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `produtos` (`id`, `codigo_produto`, `produto`, `quantidade_estoque`, `quantidade_necessaria`, `preco`) VALUES
(1, '001', 'Arroz', 95, 1, 1),
(2, '002', 'Massa', 84, 1, 1),
(3, '003', 'Miojo', 984, 1, 1),
(4, '004', 'Feijão', -52, 1, 1),
(5, '005', 'Lentilha', -69, 1, 1),
(6, '006', 'Farinha de Trigo', 4, 1, 1),
(7, '007', 'Farinha de Milho', -275, 1, 1),
(8, '008', 'Sal', -4, 1, 1),
(9, '009', 'Molho de Tomate', -36, 1, 1),
(10, '010', 'Milho', -4, 1, 1),
(11, '011', 'Ervilha', -3, 1, 1),
(12, '012', 'Vinagre', -42, 1, 1),
(13, '013', 'Óleo', 0, 1, 1),
(14, '014', 'Leite', -18, 1, 1),
(15, '015', 'Açucar', -36, 1, 1),
(16, '016', 'Café em Pó', -1, 1, 1),
(17, '017', 'Café Solúvel', 1, 1, 1),
(18, '018', 'Mistura para Bolo', 1, 1, 1),
(19, '019', 'Creme de Leite', -1, 1, 1),
(20, '020', 'Leite Condensado', -4, 1, 1),
(21, '021', 'Biscoito Doce', 1, 1, 1),
(22, '022', 'Biscoito Salgado', 1, 1, 1),
(23, '023', 'Bolacha Recheada', 1, 1, 1),
(24, '024', 'Wafer', 1, 1, 1),
(25, '025', 'Geleia', 0, 1, 1),
(26, '026', 'Suco em Pó', 1, 1, 1),
(27, '027', 'Achocolatado', 1, 1, 1),
(28, '028', 'Sabão em Pó', -1, 1, 1),
(29, '029', 'Detergente', 1, 1, 1),
(30, '030', 'Papel Higiênico', 1, 1, 1),
(31, '031', 'Shampoo', -1, 1, 1),
(32, '032', 'Sabonete', 1, 1, 1),
(33, '033', 'Creme Dental', -1, 1, 1),
(34, '034', 'Absorvente', -1, 1, 1);

CREATE TABLE `produtos_pendentes` (
  `id` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `id_padrinho` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `login` varchar(10) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `nivel` mediumint(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `usuarios` (`id`, `login`, `nome`, `senha`, `nivel`) VALUES
(1, 'Kaleb_01', 'Kaleb', '$2y$10$WdrcF7dMiJ4cjXlIHovXVeT.xveT/6e1RbiARGEMqRaXvXD179P.K', 1),
(2, 'Kaleb_02', 'Kaleb', '$2y$10$.Umq4OyxlNlDQRRlgg3nf.bzFAyTU0GjRN8Q9jKPrRBWFUoxzavc2', 2),
(3, 'Kaleb_03', 'Kaleb', '$2y$10$MVkd.xpiM3Bv/0L/wJqMxe3IFDz33cUKeH5CWmC0HGvWbezE97.vm', 3);

ALTER TABLE `atualizacoes`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `familias`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `familias_conjuge`
  ADD KEY `fk_familia_conjuge` (`id_familia`);

ALTER TABLE `familias_endereco`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_familia_endereco` (`id_familia`);

ALTER TABLE `familias_membros`
  ADD KEY `fk_familia_membros` (`id_familia`);

ALTER TABLE `faturas`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `fatura_itens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_fatura_item` (`id_fatura`);

ALTER TABLE `padrinhos`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `produtos_pendentes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_produtos_pendentes_produto` (`id_produto`),
  ADD KEY `fk_produtos_pendentes_padrinho` (`id_padrinho`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `atualizacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `familias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `familias_endereco`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `faturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `fatura_itens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `padrinhos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `produtos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

ALTER TABLE `produtos_pendentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

ALTER TABLE `familias_conjuge`
  ADD CONSTRAINT `fk_familia_conjuge` FOREIGN KEY (`id_familia`) REFERENCES `familias` (`id`) ON DELETE CASCADE;

ALTER TABLE `familias_endereco`
  ADD CONSTRAINT `fk_familia_endereco` FOREIGN KEY (`id_familia`) REFERENCES `familias` (`id`);

ALTER TABLE `familias_membros`
  ADD CONSTRAINT `fk_familia_membros` FOREIGN KEY (`id_familia`) REFERENCES `familias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `fatura_itens`
  ADD CONSTRAINT `fk_fatura_item` FOREIGN KEY (`id_fatura`) REFERENCES `faturas` (`id`) ON DELETE CASCADE;

ALTER TABLE `produtos_pendentes`
  ADD CONSTRAINT `fk_produtos_pendentes_padrinho` FOREIGN KEY (`id_padrinho`) REFERENCES `padrinhos` (`id`),
  ADD CONSTRAINT `fk_produtos_pendentes_produto` FOREIGN KEY (`id_produto`) REFERENCES `produtos` (`id`);
COMMIT;