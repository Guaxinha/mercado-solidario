const openMenu = document.querySelector('#openButtonMenu');
const closeMenu = document.querySelector('#closeButtonMenu');
const sidebar = document.querySelector('.sidebar');
const backButton = document.querySelector('#back');
const toggleButton = document.getElementById("darkModeButton");
const addButton = document.getElementById("addButton");
const addMemberButton = document.getElementById("addMember");
const openSpportProduct = document.getElementById("openSpportProduct");
const htmlElement = document.documentElement;
const dateContainer = document.querySelector('#date');
const dataAtual = new Date(); // Obtem a data atual
const dia = String(dataAtual.getDate()).padStart(2, '0'); // Garante dois dígitos
const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mês começa em 0 (Jan = 0)
const ano = dataAtual.getFullYear();

let counterMember = 0;

if(dateContainer){
    dateContainer.textContent = `${dia}/${mes}/${ano}`;
}

if(openSpportProduct){
    openSpportProduct.addEventListener('click', () => {
        const dialog = document.querySelector('#supportProduct');
        const closeDialogButton = dialog.querySelector('#closeDialog');
        dialog.showModal(); // Abre o dialog como modal

        closeDialogButton.addEventListener('click', () => {
            dialog.close(); // Fecha o dialog
        });
    });
}

// Verifica o tema atual no localStorage (se disponível)
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  htmlElement.setAttribute("data-theme", savedTheme);
}

// Alterna o tema ao clicar no botão
if(toggleButton){
    toggleButton.addEventListener("click", () => {
        const currentTheme = htmlElement.getAttribute("data-theme");
        const newTheme = currentTheme === "light" ? "dark" : "light";
        htmlElement.setAttribute("data-theme", newTheme);
      
        // Salva a preferência no localStorage
        localStorage.setItem("theme", newTheme);
      });
}


if(backButton) {
    backButton.addEventListener('click', () => {
        history.go(-2);
    });
}

if(openMenu && closeMenu && sidebar) {
    openMenu.addEventListener('click', () => {
        sidebar.style.left = '0';
    });
    
    closeMenu.addEventListener('click', () => {
        sidebar.style.left = '-100%';
    });
}

if (addButton) {
    const dialog = document.querySelector('dialog');

    addButton.addEventListener('click', () => {
        dialog.showModal(); // Abre o dialog como modal
    });

    // Adicionar um botão para fechar o dialog
    const closeDialogButton = dialog.querySelector('#closeDialog');
    if (closeDialogButton) {
        closeDialogButton.addEventListener('click', () => {
            dialog.close(); // Fecha o dialog
        });
    }
}

if (addMemberButton) {
    addMemberButton.addEventListener('click', () => {
        const memberContainer = document.getElementById('memberContainer');
        const newMember = document.createElement('div');

        counterMember++;

        newMember.classList.add('member');
        newMember.id = `member-${counterMember}`;
        newMember.innerHTML = `
            <div class="list-member-container">
                <h3 class="member-title">Membro ${counterMember}</h3>
                <button class="delete-button" id="removeMember-${counterMember}">X</button>
            </div>
            <div class="member-info">
                <input type="text" placeholder="Nome" class="dialog-input" id="memberName-${counterMember}">
                <input type="date" placeholder="Nascimento" class="dialog-input" id="memberBirth-${counterMember}">
            </div>
            <div class="member-info">
                <input type="text" placeholder="Escolaridade" class="dialog-input" id="memberEducation-${counterMember}">
                <input type="text" placeholder="Parentesco" class="dialog-input" id="memberKinship-${counterMember}">
            </div>
            <div class="member-info">
                <input type="text" placeholder="Profissão" class="dialog-input" id="memberProfession-${counterMember}">
                <input type="number" placeholder="Renda" class="dialog-input" id="memberIncome-${counterMember}">
            </div>
        `;
        memberContainer.appendChild(newMember);
    });
}