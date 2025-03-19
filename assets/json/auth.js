const loginButton = document.querySelector('.login-button');
const mensage = document.querySelector('#mensage');

if (loginButton){
    loginButton.addEventListener('click', (event) => {
        event.preventDefault();

        const inputUser = document.querySelector('#user').value;
        const inputPassword = document.querySelector('#password').value;

        // Validação simples de campos
        if (!inputUser || !inputPassword) {
            mensage.classList.add('alert');
            mensage.textContent = 'Por favor, preencha todos os campos.';
            setTimeout(closeMensage(mensage), 3000);

            return;
        }

        fetch('../assets/php/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: inputUser,
                password: inputPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') { // Verifique o campo 'status' e não 'success'
                // Redirecionar ou realizar outras ações após o login bem-sucedido
                window.location.href = data.redirect;  // Redirecionar para a URL fornecida pelo PHP
            } else {
                // Caso de falha no login
                if (data.message === 'Senha incorreta.' || data.message === 'Usuário inexistente.') {
                    mensage.textContent = 'Usuário ou senha incorretos, por favor tente novamente.';
                    mensage.classList.add('error');
                    setTimeout(closeMensage(mensage), 3000);
                }
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            mensage.style.display = 'block';
            mensage.classList.add('error');
            mensage.textContent = 'Erro ao fazer login. Por favor, tente novamente.';
            setTimeout(closeMensage(mensage), 3000);
        });
    });
}

function checkAccess(requiredLevel) {
    fetch('../../assets/php/auth.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const user = data.user;

                // Verificar o nível do usuário
                if (user.level === requiredLevel) {
                    const userNameElement = document.querySelector('#username');
                    const userImageElement = document.querySelector('#userImage');
                    if (userNameElement) {
                        userNameElement.textContent = `${user.name}`;
                    }
                    if (userImageElement) {
                        userImageElement.src = `../../assets/images/log/${user.login}.png`;
                    }

                } else {
                    window.location.href = '../unauthorized.html'; // Redirecionar para página de acesso negado
                }
            } else {
                // Usuário não autenticado, redirecionar para login
                window.location.href = '../unauthorized.html';
            }
        })
        .catch(error => {
            console.error('Erro ao verificar a sessão:', error);
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.textContent = 'Erro ao verificar sua sessão. Por favor, tente novamente.';
                errorMessage.style.display = 'block';
            }
        });
}