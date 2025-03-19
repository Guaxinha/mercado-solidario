const addProductButton = document.querySelector('#addProduct');
const addFamilyButton = document.querySelector('#addFamily');
const addSupportButton = document.querySelector('#addSupport');
const addSupportProductButton = document.querySelector('#addSupportProduct');
const cashierTitle = document.querySelector('#cashierTitle');
const mensageDialog = document.querySelector('#mensageDialog');

if(addSupportProductButton){
    addSupportProductButton.addEventListener('click', () => {
        const selectProduct = document.querySelector('#selectProduct');
        const selectSupport = document.querySelector('#selectSupport');
        const quantityProduct = document.querySelector('#quantityProduct');

        const newSupportProduct = {
            produto_id: selectProduct.value,
            padrinho_id: selectSupport.value,
            quantidade: quantityProduct.value
        };

        fetch('../../assets/php/adicionar_padrinho_produto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newSupportProduct })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                mensageDialog.classList.add('error');
                mensageDialog.textContent = 'Erro ao adicionar produto ao padrinho: ' + data.error;
                setTimeout(() => {
                    mensageDialog.classList.remove('error');
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Erro ao adicionar produto ao padrinho:', error);
        });
    });
}

if (cashierTitle) {
    const confirmButton = document.querySelector('#confirmCashier');

    fetch('../../assets/php/consultas.php')
        .then(response => response.json())
        .then(data => {
            const code = document.querySelector('#productCode');
            const name = document.querySelector('#productName');
            const price = document.querySelector('#priceProduct');
            const quantity = document.querySelector('#quantityProduct');
            const total = document.querySelector('#totalProduct');
            const button = document.querySelector('#addCashier');
            const cashier = document.querySelector('#cashierTotal');
            const family = document.querySelector('#familyCashier');
            const cashierTable = document.querySelector('#cashierTableBody');

            data.familias.forEach(familia => {
                const optionFamily = document.createElement('option');
                optionFamily.value = familia.id;
                optionFamily.textContent = familia.nome;
                family.appendChild(optionFamily);
            });

            data.produtos.forEach(produto => {
                const optionProduct = document.createElement('option');    
                optionProduct.value = produto.codigo_produto; // Use o código do produto como valor
                optionProduct.textContent = `${produto.codigo_produto}`;
                code.appendChild(optionProduct);
            });

            // Adicionar event listener para atualizar o texto quando um item for selecionado
            code.addEventListener('change', () => {
                const selectedProduct = data.produtos.find(produto => produto.codigo_produto === code.value);
                if (selectedProduct) {
                    name.textContent = selectedProduct.produto;
                    price.textContent = parseFloat(selectedProduct.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    quantity.addEventListener('input', () => {
                        total.textContent = (selectedProduct.preco * quantity.value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    });
                }
            });

            // Adicionar event listener ao botão apenas uma vez
            button.addEventListener('click', () => {
                const selectedProduct = data.produtos.find(produto => produto.codigo_produto === code.value);
                if (!selectedProduct || !quantity.value) {
                    alert('Por favor, preencha todos os campos.');
                    return;
                }

                let existingRow = null;

                // Verificar se o produto já foi inserido
                cashierTable.querySelectorAll('tr').forEach(row => {
                    if (row.querySelector('td:nth-child(2)').textContent === code.value) {
                        existingRow = row;
                    }
                });

                if (existingRow) {
                    // Atualizar a quantidade e o total do produto existente
                    const quantityCell = existingRow.querySelector('td:nth-child(1)');
                    const totalCell = existingRow.querySelector('#totalCashier');
                    const newQuantity = parseInt(quantityCell.textContent) + parseInt(quantity.value);
                    quantityCell.textContent = newQuantity;
                    totalCell.textContent = (selectedProduct.preco * newQuantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                } else {
                    // Adicionar um novo produto
                    const cashierItem = document.createElement('tr');
                    cashierItem.classList.add('table-cashier');

                    cashierItem.innerHTML = `
                        <td>${quantity.value}</td>
                        <td>${code.value}</td>
                        <td>${name.textContent}</td>
                        <td>${price.textContent}</td>
                        <td id="totalCashier">${total.textContent}</td>
                        <td class="delete-button delete-button-cashier">X</td>
                    `;
                    cashierTable.appendChild(cashierItem);

                    // Adicionar event listener ao novo botão de exclusão
                    addDeleteEventListeners();
                }

                // Atualizar o total do caixa
                let preco = 0;
                const totalCashier = document.querySelectorAll('#totalCashier');
                totalCashier.forEach(item => {
                    preco += parseFloat(item.textContent.replace(',', '.'));
                });
                cashier.textContent = `Total: ${preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₢`;
            });

            function addDeleteEventListeners() {
                const deleteButtons = document.querySelectorAll('.delete-button-cashier');

                deleteButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const row = button.closest('tr');
                        row.remove();

                        // Atualizar o total do caixa
                        let preco = 0;
                        const totalCashier = document.querySelectorAll('#totalCashier');
                        totalCashier.forEach(item => {
                            preco += parseFloat(item.textContent.replace(',', '.'));
                        });
                        cashier.textContent = `Total: ${preco.toLocaleString('pt-BR',{ minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₢`;
                    });
                });
            }

            // Chamar a função para adicionar event listeners aos botões de exclusão existentes
            addDeleteEventListeners();

            // Adicionar event listener ao botão de confirmação
            confirmButton.addEventListener('click', () => {
                const cashierTable = document.querySelector('#cashierTableBody');
                const rows = cashierTable.querySelectorAll('tr');
                const items = [];
                const selectedFamily = family.options[family.selectedIndex].text;
            
                rows.forEach(row => {
                    const quantity = row.querySelector('td:nth-child(1)').textContent;
                    const code = row.querySelector('td:nth-child(2)').textContent;
                    const totalItem = row.querySelector('#totalCashier').textContent.replace(',', '.');
                    items.push({ code, quantity, totalItem });
                });
            
                fetch('../../assets/php/atualizar_estoque.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ items })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const newReceipt = {
                            items,
                            total: cashier.textContent,
                            family: selectedFamily
                        };
            
                        fetch('../../assets/php/nova_fatura.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newReceipt)
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                alert('Fatura cadastrada com sucesso!');
                            } else {
                                alert('Erro ao cadastrar fatura: ' + data.error);
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao cadastrar fatura:', error);
                        });
                        // location.reload();
                    } else {
                        alert('Erro ao atualizar estoque: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Erro ao atualizar estoque:', error);
                });
            });
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
}

function getPrintCashierStyle(){
    return `
    <style>
        html, body, div, span, applet, object, iframe,
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
        a, abbr, acronym, address, big, cite, code,
        del, dfn, em, img, ins, kbd, q, s, samp,
        small, strike, strong, sub, sup, tt, var,
        b, u, i, center,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td,
        article, aside, canvas, details, embed, 
        figure, figcaption, footer, header, hgroup, 
        menu, nav, output, ruby, section, summary,
        time, mark, audio, video {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
        }

        article, aside, details, figcaption, figure, 
        footer, header, hgroup, menu, nav, section {
            display: block;
        }
        body {
            line-height: 1;
        }
        ol, ul {
            list-style: none;
        }
        blockquote, q {
            quotes: none;
        }
        blockquote:before, blockquote:after,
        q:before, q:after {
            content: '';
            content: none;
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 0.75rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            height: 250mm;
            padding: 1em;
            text-transform: uppercase;
        }

        h1{
            font-size: 1.25rem;
        }
    </style>
    `
}

if(addSupportProductButton){
    const selectProduct = document.querySelector('#selectProduct');
    const selectSupport = document.querySelector('#selectSupport');

    fetch('../../assets/php/consultas.php')
        .then(response => response.json())
        .then(data => {
            selectProduct.innerHTML = '';
            selectSupport.innerHTML = '';
            data.produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = `${produto.produto}`;
                selectProduct.appendChild(option);
            });
            data.padrinhos.forEach(padrinho => {
                const option = document.createElement('option');
                option.value = padrinho.id;
                option.textContent = `${padrinho.nome}`;
                selectSupport.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar produtos:', error);
        });
}

function getSelectedAddressType() {
    const selectedRadio = document.querySelector('input[name="addressType"]:checked');
    if (selectedRadio) {
        return selectedRadio.value;
    } else {
        return null;
    }
}

if(addSupportButton) {
    addSupportButton.addEventListener('click', () => {
        const nome = document.querySelector('#nameSupport').value.trim();
        const celular = document.querySelector('#phoneSupport').value.trim();

        if (!nome || !celular) {
            mensageDialog.classList.add('error');
            mensageDialog.textContent = 'Todos os campos devem estar preenchidos.';
            setTimeout(() => {
                mensageDialog.classList.remove('error');
                mensageDialog.textContent = '';
            }, 3000);
            return;
        }

        const newSuport = {
            nome: nome,
            celular: celular,
        };

        fetch('../../assets/php/adicionar_padrinho.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newSuport })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                mensageDialog.classList.add('error');
                mensageDialog.textContent = 'Erro ao adicionar padrinho: ' + data.error;
                setTimeout(() => {
                    mensageDialog.classList.remove('error');
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Erro ao adicionar suporte:', error);
            mensageDialog.classList.add('error');
            mensageDialog.textContent = 'Erro ao adicionar padrinho.';
            setTimeout(() => {
                mensageDialog.classList.remove('error');
            }, 3000);
        });
    });
}

if (addFamilyButton) {
    addFamilyButton.addEventListener('click', () => {
        const newFamily = {
            nome: document.querySelector('#nameFamily').value,
            nascimento: document.querySelector('#birthFamily').value,
            rg: document.querySelector('#rgFamily').value,
            cpf: document.querySelector('#cpfFamily').value,
            filiacao: document.querySelector('#parentsFamily').value,
            celular: document.querySelector('#phoneFamily').value,
            escolaridade: document.querySelector('#educationFamily').value, 
            endereco: document.querySelector('#addressFamily').value,
            profissao: document.querySelector('#professionFamily').value,
            renda: document.querySelector('#incomeFamily').value,
            estado_civil: document.querySelector('#civilStateFamily').value,
        };

        const adressFamily = {
            endereco: document.querySelector('#addressEspecificFamily').value,
            situacao: getSelectedAddressType(), // Obter o tipo de endereço selecionado
            aluguel: document.querySelector('#rentValueFamily').value,
            prestacao: document.querySelector('#installmentFamily').value,
        };

        const spouseFamily = {
            nome: document.querySelector('#nameSpouseFamily').value,
            nascimento: document.querySelector('#birthSpouseFamily').value,
            rg: document.querySelector('#rgSpouseFamily').value,
            cpf: document.querySelector('#cpfSpouseFamily').value,
            filiacao: document.querySelector('#parentsSpouseFamily').value,
            escolaridade: document.querySelector('#educationSpouseFamily').value, 
            profissao: document.querySelector('#professionSpouseFamily').value,
            renda: document.querySelector('#incomeSpouseFamily').value,
        };

        // Coletar dados dos membros adicionais
        const members = [];
        for (let i = 1; i <= counterMember; i++) {
            const member = {
                nome: document.querySelector(`#memberName-${i}`).value,
                nascimento: document.querySelector(`#memberBirth-${i}`).value,
                escolaridade: document.querySelector(`#memberEducation-${i}`).value,
                parentesco: document.querySelector(`#memberKinship-${i}`).value,
                profissao: document.querySelector(`#memberProfession-${i}`).value,
                renda: document.querySelector(`#memberIncome-${i}`).value
            };
            members.push(member);
        }

        console.log(newFamily, adressFamily, spouseFamily, members);

        fetch('../../assets/php/adicionar_familia.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newFamily, adressFamily, spouseFamily, members })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
                // Atualizar a tabela de produtos ou fazer outras ações necessárias
                location.reload(); // Recarregar a página para atualizar a lista de produtos
            } else {
                alert('Erro ao adicionar família: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao adicionar família.');
        });
    });
}
            

if (addProductButton) {
    addProductButton.addEventListener('click', () => {
        const codigo_produto = document.querySelector('#productCode').value.trim();
        const nome = document.querySelector('#productName').value.trim();
        const quantidade_estoque = document.querySelector('#productStock').value.trim();
        const quantidade_necessaria = document.querySelector('#productNecessary').value.trim();
        const preco = document.querySelector('#productValue').value.trim();

        // Verificação para garantir que nenhum campo esteja vazio
        if (!codigo_produto || !nome || !quantidade_estoque || !quantidade_necessaria || !preco) {
            mensageDialog.textContent = 'Insira todos os campos para adicionar um novo produto.';
            mensageDialog.classList.add('error');
            setTimeout(() => {
                mensageDialog.classList.remove('error');
            }, 3000);
            return;
        }

        if (isNaN(quantidade_estoque) || isNaN(quantidade_necessaria) || isNaN(preco) || 
            parseFloat(quantidade_estoque) <= 0 || parseFloat(quantidade_necessaria) <= 0 || parseFloat(preco) <= 0) {
            mensageDialog.textContent = 'Por favor, insira valores numéricos válidos e diferentes de zero para quantidade em estoque, quantidade necessária e preço.';
            mensageDialog.classList.add('error');
            setTimeout(() => {
                mensageDialog.classList.remove('error');
            }, 3000);
            return;
}

        const newProduct = {
            codigo_produto: codigo_produto,
            nome: nome,
            quantidade_estoque: quantidade_estoque,
            quantidade_necessaria: quantidade_necessaria,
            preco: preco
        };

        fetch('../../assets/php/adicionar_produto.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
                // Atualizar a tabela de produtos ou fazer outras ações necessárias
                location.reload(); // Recarregar a página para atualizar a lista de produtos
            } else {
                alert('Erro ao adicionar produto: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    });
}

// Função para formatar data
function formatDate(dateString) {
    const [ano, mes, dia] = dateString.split('-');
    return `${dia}/${mes}/${ano}`;
}

// Função para formatar hora
function formatTime(timeString) {
    const [hora, minuto] = timeString.split(':');
    return `${hora}:${minuto}`;
}

// Função para ordenar atualizações
function sortUpdates(updates) {
    return updates.sort((a, b) => {
        const dateA = new Date(`${a.data_atualizacao}T${a.hora_atualizacao}`);
        const dateB = new Date(`${b.data_atualizacao}T${b.hora_atualizacao}`);
        return dateB - dateA;
    });
}

// Função para renderizar atualizações
function renderUpdates(updates, users, container) {
    const sortedUpdates = sortUpdates(updates);
    sortedUpdates.forEach(atualizacao => {
        const nomeUsuario = users.find(usuario => usuario.login === atualizacao.nome_usuario).nome;
        const dataFormatada = formatDate(atualizacao.data_atualizacao);
        const horaFormatada = formatTime(atualizacao.hora_atualizacao);

        container.innerHTML += `
            <div class="update-container">
                <img src="../../assets/images/log/${atualizacao.nome_usuario}.png" class="update-image"></img>
                <p class="update-text">${nomeUsuario} ${atualizacao.atualizacao} - <span class="update-date">${dataFormatada} ${horaFormatada}</span></p>
            </div>
            <hr>
        `;
    });
}

// Função para renderizar tabela de famílias
function renderFamilyTable(families, table, members, addresses, spouses) {
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = ''; // Limpar o conteúdo existente da tabela
    families.forEach(family => {
        const familyMembers = members.filter(member => member.id_familia === family.id);
        const familySpouses = spouses.filter(spouse => spouse.id_familia === family.id);

        const totalMembers = 1 + familySpouses.length + familyMembers.length;
        const monthsDifference = calculateMonthsDifference(family.data_inicio, family.data_final);
        const totalSolidarios = calculateTotalSolidarios(totalMembers);

        const row = document.createElement('tr');
        row.classList.add('table-row', 'table-family');
        row.innerHTML = `
            <td>${family.nome}</td>
            <td>${totalMembers}</td>
            <td>${monthsDifference}</td>
            <td>${totalSolidarios}</td>
            <td>${family.situacao}</td>
            <td class="delete-cell"><button class="delete-button" data-id="${family.id}">X</button></td>     
        `;
        tableBody.appendChild(row);

        row.addEventListener('click', () => {
            renderFamilyDetails(family, familyMembers, familySpouses, addresses);
        });
    });

    addDeleteEventListeners();
}

// Função para calcular a diferença em meses entre duas datas
function calculateMonthsDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const yearsDifference = end.getFullYear() - start.getFullYear();
    const monthsDifference = end.getMonth() - start.getMonth();
    return yearsDifference * 12 + monthsDifference;
}

// Função para calcular o total de solidários
function calculateTotalSolidarios(totalMembers) {
    if (totalMembers <= 2) return 20;
    if (totalMembers <= 3) return 30;
    if (totalMembers <= 4) return 40;
    if (totalMembers <= 5) return 50;
    return 60;
}


// Função para renderizar os detalhes da família
function renderFamilyDetails(family, familyMembers, familySpouses, addresses) {
    const dialogFamily = document.querySelector('#family');
    const buttonClose = document.querySelector('#closeFamily');
    const print = document.querySelector('#printFamily');

    const familyName = document.querySelector('#familyName');
    const familyBirth = document.querySelector('#familyBirth');
    const familyRg = document.querySelector('#familyRG');
    const familyCpf = document.querySelector('#familyCPF');
    const familyAddress = document.querySelector('#familyAddress');
    const familyPhone = document.querySelector('#familyPhone');
    const famiyParents = document.querySelector('#familyParents');
    const familyEducation = document.querySelector('#familyEducation');
    const familyProfession = document.querySelector('#familyProfession');
    const familyIncome = document.querySelector('#familyIncome');
    const familyCivilState = document.querySelector('#familyCivilState');

    familyName.innerHTML = `<p class="family-strong">Nome:</p><p class="family-sub">${family.nome}</p>`;
    familyBirth.innerHTML = `<p class="family-strong">Data de Nascimento:</p><p class="family-sub">${formatDate(family.nascimento)}</p>`;
    familyRg.innerHTML = `<p class="family-strong">RG:</p><p class="family-sub">${family.rg}</p>`;
    familyCpf.innerHTML = `<p class="family-strong">CPF:</p><p class="family-sub">${family.cpf}</p>`;
    familyAddress.innerHTML = `<p class="family-strong">Endereço:</p><p class="family-sub">${family.endereco}</p>`;
    familyPhone.innerHTML = `<p class="family-strong">Celular:</p><p class="family-sub">${family.celular}</p>`;
    famiyParents.innerHTML = `<p class="family-strong">Parentesco:</p><p class="family-sub">${family.filiacao}</p>`;
    familyEducation.innerHTML = `<p class="family-strong">Escolaridade:</p><p class="family-sub">${family.escolaridade}</p>`;
    familyProfession.innerHTML = `<p class="family-strong">Profissão:</p><p class="family-sub">${family.profissao}</p>`;
    familyIncome.innerHTML = `<p class="family-strong">Renda:</p><p class="family-sub">${parseFloat(family.renda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
    familyCivilState.innerHTML = `<p class="family-strong">Estado Civil:</p><p class="family-sub">${family.estado_civil}</p>`;

    const spouseName = document.querySelector('#spouseName');
    const spouseBirth = document.querySelector('#spouseBirth');
    const spouseRg = document.querySelector('#spouseRG');
    const spouseCpf = document.querySelector('#spouseCPF');
    const spouseParents = document.querySelector('#spouseParents');
    const spouseEducation = document.querySelector('#spouseEducation');
    const spouseProfession = document.querySelector('#spouseProfession');
    const spouseIncome = document.querySelector('#spouseIncome');

    if (familySpouses.length > 0) {
        const spouse = familySpouses[0];
        spouseName.innerHTML = `<p class="family-strong">Nome:</p><p class="family-sub">${spouse.nome}</p>`;
        spouseBirth.innerHTML = `<p class="family-strong">Data de Nascimento:</p><p class="family-sub">${formatDate(spouse.nascimento)}</p>`;
        spouseRg.innerHTML = `<p class="family-strong">RG:</p><p class="family-sub">${spouse.rg}</p>`;
        spouseCpf.innerHTML = `<p class="family-strong">CPF:</p><p class="family-sub">${spouse.cpf}</p>`;
        spouseParents.innerHTML = `<p class="family-strong">Parentesco:</p><p class="family-sub">${spouse.filiacao}</p>`;
        spouseEducation.innerHTML = `<p class="family-strong">Escolaridade:</p><p class="family-sub">${spouse.escolaridade}</p>`;
        spouseProfession.innerHTML = `<p class="family-strong">Profissão:</p><p class="family-sub">${spouse.profissao}</p>`;
        spouseIncome.innerHTML = `<p class="family-strong">Renda:</p><p class="family-sub">${parseFloat(spouse.renda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
    }

    const addressFamily = document.querySelector('#address');
    const addressType = document.querySelector('#addressType');
    const rentValueFamily = document.querySelector('#rentValue');
    const prestValue = document.querySelector('#prestValue');

    // Filtrar o endereço correto para a família atual
    const address = addresses.find(addr => addr.id_familia === family.id);
    if (address) {
        const situacaoText = address.situacao === '1' ? 'Alugada' : address.situacao === '2' ? 'Própria' : 'Cedida';
        addressFamily.innerHTML = `<p class="family-strong">Endereço:</p><p class="family-sub"> ${address.endereco}</p>`;
        addressType.innerHTML = `<p class="family-strong">Tipo:</p><p class="family-sub"> ${situacaoText}</p>`;
        rentValueFamily.innerHTML = `<p class="family-strong">Aluguel:</p><p class="family-sub"> ${parseFloat(address.aluguel).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;
        prestValue.innerHTML = `<p class="family-strong">Prestação:</p><p class="family-sub">${parseFloat(address.prestacao).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>`;

        console.log(address);
    }

    const memberContainer = document.querySelector('#familyMembers');
    memberContainer.innerHTML = '';
    familyMembers.forEach(member => {
        const memberRow = document.createElement('tr');
        memberRow.classList.add('member-table');
        memberRow.innerHTML = `
            <td class="member-line">${member.nome}</td>
            <td class="member-line">${formatDate(member.nascimento)}</td>
            <td class="member-line">${member.escolaridade}</td>
            <td class="member-line">${member.filiacao}</td>
            <td class="member-line">${member.profissao}</td>
            <td class="member-line">${parseFloat(member.renda).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        `;
        memberContainer.appendChild(memberRow);
    });

    buttonClose.addEventListener('click', () => {
        dialogFamily.close();
    });
    dialogFamily.showModal();

    print.addEventListener('click', () => {
        const printContent = document.querySelector('#printContainer').innerHTML;
        const styles = getPrintStyles();
        const win = window.open('', '', 'height=700,width=700');
        win.document.write('<html><head>' + styles + '</head><body>');
        win.document.write('<h1 class="print-title">Fé Viva Church - Mercado Solidário</h1>');
        win.document.write('<h2 class="print-subtitle">Cadastro da Família</h2>');
        win.document.write(printContent);
        win.document.write('<div class="print-footer"><p class="print-footer">Rua Fernando Antõnio Merlin Rochelle, 554, Ouro Verde</p><p class="print-footer">Bento Gonçalves - RS</p></div>');
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    });
}

function getPrintStyles() {
    return `
        <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 0.75rem;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                height: 250mm;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                text-align: center;
                border: 1px solid #6e7784;
            }
            .family-main {
                font-size: 0.75rem;
                margin: 0 0 1em 0;
                border: 1px solid #6e7784;
                padding: 1em;
            }
            p {
                margin: 0;
            }
            .family-strong {
                font-weight: bold;
            }
            .family-sub {
                border-bottom: 1px solid #6e7784;
            }
            .family-table {
                width: 100%;
            }
            .member-table {
                font-size: 0.75rem;
                width: 100%;
                display: grid;
                grid-template-columns: 25% 15% 15% 15% 15% 15%;
                justify-content: space-between;
                justify-items: center;
                align-items: center;
            }
            .member-line {
                padding: 0.5em 0;
            }
            .family-text {
                display: grid;
                grid-template-columns: 25% 73%;
                margin: 0 0 0.5em 0;
                justify-content: space-between;
                width: 100%;
            }
            .print-title {
                font-size: 1.5rem;
                font-weight: bold;
                margin: 0 0 0.5em 0;
                text-align: center;
            }
            .print-subtitle {
                font-size: 1rem;
                font-weight: bold;
                margin: 0 0 0.5em 0;
                text-align: center;
            }

            .print-footer{
                display: flex;
                flex-direction: column;
                align-items: center;
                margin: auto 0 0 0;
            }
        </style>
    `;
}

// Função para adicionar event listeners aos botões de exclusão
function addDeleteEventListeners() {
    const deleteFamilyButtons = document.querySelectorAll('.delete-button');
    const confirmDeleteDialog = document.getElementById('confirmDeleteDialog');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    let familyIdToDelete = null;

    if (deleteFamilyButtons) {
        deleteFamilyButtons.forEach(button => {
            button.addEventListener('click', () => {
                familyIdToDelete = button.getAttribute('data-id');
                confirmDeleteDialog.showModal();
            });
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            if (familyIdToDelete) {
                fetch('../../assets/php/deletar_familia.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: familyIdToDelete })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        alert('Erro ao remover família: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
            }
            confirmDeleteDialog.close();
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
            confirmDeleteDialog.close();
            familyIdToDelete = null;
        });
    }
}

// Função para renderizar produtos na tabela
function renderProductsTable(products, table) {
    const tableBody = table.querySelector('tbody');
    tableBody.innerHTML = ''; // Limpar o conteúdo existente da tabela
    products.forEach(produto => {
        const row = document.createElement('tr');
        row.classList.add('table-row', 'table-product');
        row.innerHTML = `
            <td>${produto.codigo_produto}</td>
            <td class="editable" data-key="produto">${produto.produto}</td>    
            <td class="editable" data-key="quantidade_estoque">${produto.quantidade_estoque}</td>
            <td>${parseInt(produto.quantidade_necessaria) - parseInt(produto.quantidade_estoque)}</td>
            <td class="editable" data-key="quantidade_necessaria">${produto.quantidade_necessaria}</td>
            <td class="editable" data-key="preco">${Number(produto.preco).toFixed(2).replace('.', ',')} ₢</td>
            <td><button class="delete-button" data-id="${produto.codigo_produto}">X</button></td>
        `;
        tableBody.appendChild(row);

        row.querySelectorAll('.editable').forEach(cell => {
            cell.addEventListener('click', () => {
                const oldValue = cell.textContent.trim();
                const input = document.createElement('input');
                input.type = 'text';
                input.value = oldValue.replace(',', '.'); // Corrigir valores decimais
                cell.textContent = ''; // Limpar o conteúdo da célula
                cell.appendChild(input);
                input.focus();

                // Salvar ao pressionar Enter
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const newValue = input.value.trim();
                        const field = cell.dataset.key;
                        cell.textContent = newValue.replace('.', ',') + (field === 'preco' ? ' ₢' : '');

                        // Enviar atualização ao servidor
                        fetch('../../assets/php/atualizar.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                id: produto.codigo_produto,
                                produto: produto.produto,
                                field: field,
                                value: field === 'preco' ? parseFloat(newValue) : newValue
                            })
                        })
                        .then(response => response.json())
                        .then(result => {
                            if (result.success) {
                                location.reload(); // Recarregar a página
                            } else {
                                console.error('Erro ao atualizar o valor:', result.error);
                            }
                        })
                        .catch(error => console.error('Erro:', error));
                    }
                });

                // Retornar ao valor original se o input perder o foco
                input.addEventListener('blur', () => {
                    cell.textContent = oldValue.replace('.', ',') + (cell.dataset.key === 'preco' ? ' ₢' : '');
                });
            });
        });
    });

    // Adicionar event listeners aos botões de exclusão após renderizar a tabela
    const deleteProductButtons = document.querySelectorAll('.delete-button');
    const confirmDeleteDialog = document.getElementById('confirmDeleteDialog');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    let productIdToDelete = null;

    if (deleteProductButtons) {
        deleteProductButtons.forEach(button => {
            button.addEventListener('click', () => {
                productIdToDelete = button.getAttribute('data-id');
                confirmDeleteDialog.showModal();
            });
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            if (productIdToDelete) {
                fetch('../../assets/php/deletar_produto.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: productIdToDelete })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                        // Atualizar a tabela de produtos ou fazer outras ações necessárias
                        location.reload(); // Recarregar a página para atualizar a lista de produtos
                    } else {
                        alert('Erro ao deletar produto: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
            }
            confirmDeleteDialog.close();
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
            confirmDeleteDialog.close();
            productIdToDelete = null;
        });
    }
}

// Função para renderizar produtos no dashboard
function renderDashboardTable(products, table) {
    const tableBody = table.querySelector('tbody');
    const produtosExibidos = products.slice(0, 10);

    produtosExibidos.forEach(produto => {
        const row = document.createElement('tr');
        row.classList.add('table-row', 'table-product');
        row.innerHTML = `
            <td>${produto.codigo_produto}</td>
            <td>${produto.produto}</td>    
            <td>${produto.quantidade_estoque}</td>
            <td>${parseInt(produto.quantidade_necessaria) - parseInt(produto.quantidade_estoque)}</td>
            <td>${produto.quantidade_necessaria}</td>
            <td>${Number(produto.preco).toFixed(2).replace('.', ',')} ₢</td>
        `;
        tableBody.appendChild(row);

        row.addEventListener('click', () => {
            console.log(produto);
        });
    });
}

function addDeleteSupportEventListeners() {
    const deleteSupportButtons = document.querySelectorAll('.delete-button-support');
    const confirmDeleteDialog = document.getElementById('confirmDeleteDialog');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    let supportIdToDelete = null;

    if (deleteSupportButtons) {
        deleteSupportButtons.forEach(button => {
            button.addEventListener('click', () => {
                supportIdToDelete = button.getAttribute('data-id');
                confirmDeleteDialog.showModal();
            });
        });
    }

    if (confirmDeleteButton) {
        confirmDeleteButton.addEventListener('click', () => {
            if (supportIdToDelete) {
                fetch('../../assets/php/deletar_padrinho.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: supportIdToDelete })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        alert('Erro ao remover padrinho: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                });
            }
            confirmDeleteDialog.close();
        });
    }

    if (cancelDeleteButton) {
        cancelDeleteButton.addEventListener('click', () => {
            confirmDeleteDialog.close();
            supportIdToDelete = null;
        });
    }
}

function renderPadrinhos(padrinhos) {
    const padrinhosContainer = document.querySelector('#suportTableBody');
    padrinhosContainer.innerHTML = '';
    padrinhos.sort((a, b) => a.nome.localeCompare(b.nome));

    padrinhos.forEach(padrinho => {
        const row = document.createElement('tr');
        row.classList.add('table-row', 'table-support');
        row.innerHTML = `
            <td>${padrinho.nome}</td>
            <td>${padrinho.celular}</td>
            <td><button class="delete-button delete-button-support" data-id="${padrinho.id}">X</button></td>
        `;
        padrinhosContainer.appendChild(row);
    });

    addDeleteSupportEventListeners();
}

function renderProductsSupport(products, padrinhos, produtos) {
    const productsContainer = document.querySelector('#suportProductTableBody');
    productsContainer.innerHTML = '';

    products.forEach(product => {
        const padrinho = padrinhos.find(p => p.id === product.id_padrinho);
        const produto = produtos.find(p => p.id === product.id_produto);

        const row = document.createElement('tr');
        row.classList.add('table-row', 'table-support-product');
        row.innerHTML = `
            <td>${padrinho ? padrinho.nome : 'Desconhecido'}</td>
            <td>${produto ? produto.produto : 'Desconhecido'}</td>
            <td>${product.quantidade}</td>
            <td><button class="delete-button delete-product-support" data-id="${product.id}">X</button></td>
            <td><button class="confirm-button" data-id="${product.id}">V</button></td>
        `;
        productsContainer.appendChild(row);
    });

    addDeleteProductEventListeners();
    addConfirmProductEventListeners();
}

function addConfirmProductEventListeners() {
    const confirmButtons = document.querySelectorAll('.confirm-button');

    confirmButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');

            fetch('../../assets/php/adicionar_produto_pendente.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert('Erro ao confirmar produto: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        });
    });
}

function addDeleteProductEventListeners() {
    const deleteButtons = document.querySelectorAll('.delete-product-support');
    console.log(deleteButtons);

    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');

            fetch('../../assets/php/deletar_padrinho_produto.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: productId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert('Erro ao deletar produto: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        });
    });
}

function renderFaturas(faturas, faturasItens, faturasContainer, produtos) {
    console.log(faturasItens, faturas);
    faturasContainer.innerHTML = '';

    // Ordenar as faturas da mais nova para a mais velha
    faturas.sort((a, b) => b.id - a.id);

    faturas.forEach(fatura => {
        const div = document.createElement('div');
        div.classList.add('fatura-container');
        const dataFormatada = new Date(fatura.data).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        div.innerHTML = `
            <div class="fatura-header">
                <span class="fatura-text">Recibo nº${fatura.id}</span>
                <span class="fatura-text">${dataFormatada}</span>
            </div>
            <span class="fatura-familia">Família: ${fatura.familia}</span>
            <div class="fatura-content">
                ${faturasItens
                    .filter(item => item.id_fatura === fatura.id)
                    .map(item => {
                        const produto = produtos.find(p => p.codigo_produto === item.codigo_produto);
                        const nomeProduto = produto ? produto.produto : 'Produto desconhecido';
                        const totalFormatado = parseFloat(item.total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        return `
                            <div class="fatura-item">
                                <span class="fatura-text">${item.quantidade}x</span>
                                <span class="fatura-text">${nomeProduto}</span>
                                <span class="fatura-text">${totalFormatado} ₢</span>
                            </div>
                        `;
                    }).join('')}
            </div>
            <span class="fatura-total">${fatura.total}</span>
        `;
        faturasContainer.appendChild(div);
    });
}
// Função principal para buscar dados e renderizar
function fetchDataAndRender() {
    fetch('../../assets/php/consultas.php')
        .then(response => response.json())
        .then(data => {
            const produtos = data.produtos;
            const padrinhos = data.padrinhos;
            const usuarios = data.usuarios;
            const atualizacoes = data.atualizacoes;
            const familias = data.familias;
            const familiasConjuge = data.familiasConjuges;
            const familiasMembros = data.familiasMembros;
            const familiasEndereco = data.familiasEnderecos;
            const produtosPendentes = data.produtosPendentes;
            const faturas = data.faturas;
            const faturasItens = data.faturasItens;
            const produtosPendentesTable = document.querySelector('#suportProductTableBody');
            const faturasContainer = document.querySelector('#historicalContainer');
            const produtcsCountContainer = document.querySelector('#productsCount');
            const supportCountContainer = document.querySelector('#supportersCount');
            const familyCountContainer = document.querySelector('#familiesCount');
            const productsTable = document.querySelector('#productsTable');
            const dashboardTable = document.querySelector('#productsTableDashboard');
            const familyTable = document.querySelector('#familyTable');
            const supportTable = document.querySelector('#suportTableBody');
            const updatesContaienr = document.querySelector('#update');

            if (faturasContainer) {
                renderFaturas(faturas, faturasItens, faturasContainer, produtos);
            }

            if (produtosPendentesTable) {
                renderProductsSupport(produtosPendentes, padrinhos, produtos);
            }

            if (supportTable) {
                renderPadrinhos(padrinhos);
            }

            if (familyTable) {
                renderFamilyTable(familias, familyTable, familiasMembros, familiasEndereco, familiasConjuge);
            }

            if (updatesContaienr) {
                renderUpdates(atualizacoes, usuarios, updatesContaienr);
            }

            if (produtcsCountContainer) {
                produtcsCountContainer.textContent = produtos.length;
            }

            if (familyCountContainer) {
                familyCountContainer.textContent = familias.length;
            }

            if (supportCountContainer) {
                supportCountContainer.textContent = padrinhos.length;
            }

            if (productsTable) {
                renderProductsTable(produtos, productsTable);
            }

            if (dashboardTable) {
                renderDashboardTable(produtos, dashboardTable);
            }
        })
        .catch(error => {
            console.error('Erro ao obter produtos:', error);
        });
}

// Chamar a função principal
fetchDataAndRender();

function closeMensage(whateventMensage) {
    whateventMensage.classList.remove('alert');
    whateventMensage.classList.remove('error');
}