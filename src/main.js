const faceButton = document.getElementById('faceButton');
const googleButton = document.getElementById('googleButton');
const registerButton = document.getElementById('registerButton');
const loginButton = document.getElementById('loginButton');
const formInicio = document.getElementById('formInicio');
const formRegister = document.getElementById('formRegister');
const registerLink = document.getElementById('registerLink');
const emailLogin = document.getElementById('email-login');
const passwordLogin = document.getElementById('password-login');
const updatePassword = document.getElementById('update-password');

const nameUser = document.getElementById('nameUser');
const email = document.getElementById('email');
const password = document.getElementById('password');
const confirPassword = document.getElementById('confirPassword')
const validInputs = document.getElementById('valid-inputs');
const validInputs2 = document.getElementById('valid-inputs2');
const errorPassword = document.getElementById('error-password');
//formInicio.classList.remove('hidden');
//formRegister.classList.add('hidden');

registerLink.addEventListener('click', () => {
  formRegister.classList.remove('hidden');
  formInicio.classList.add('hidden');
})


// ***************** Registra datos  ************************
registerButton.addEventListener('click', () => {
  nameUsers = nameUser.value;
  emailUser = email.value;
  passwordUser = password.value;
  confirPasswordUser = confirPassword.value;

  if (validationRegisterUser(nameUsers, emailUser, passwordUser, confirPasswordUser) === true) {
    registerNew(emailUser, passwordUser);
    formRegister.classList.add('hidden');
    formInicio.classList.remove('hidden');
  }
  else {
    if (isNotEmpty(nameUsers) === false) {
      validInputs.innerHTML = 'Ingrese su nombre';
    } else if (isEmail(emailUser) === false) {
      validInputs.innerHTML = 'Ingrese email válido';
    } else if (isNotEmpty(passwordUser) === false) {
      validInputs.innerHTML = 'Ingrese contraseña con mínimo 6 caracteres';
    } else if (isNotEmpty(confirPasswordUser) == false) {
      validInputs.innerHTML = 'Confirmar contraseña';
    } else if (equalPassword(passwordUser, confirPasswordUser) == false) {
      validInputs.innerHTML = 'Las contraseñas no coinciden';
    } else if (miniLenght(passwordUser) == false) {
      validInputs.innerHTML = 'Su contraseña debe tener mínimo 6 caracteres';
    }
  }
});





// *********** Loguea al Usuario **************************
loginButton.addEventListener('click', () => {
  if (isValidLogin(emailLogin.value, passwordLogin.value)) {
    login(emailLogin.value, passwordLogin.value);
    validation();
  } else {
    validInputs2.innerHTML = 'email y/o pasword incorrecto';
  }
});


// *********** Resetea contraseña **************************
updatePassword.addEventListener('click', () => {
  if (emailLogin.value === '') {
    validInputs2.innerHTML = 'Ingrese un correo válido para resetear contraseña';
  } else {
    if (validationUpdatePassword(emailLogin.value)) {
      resetPassword(emailLogin.value);
      validInputs2.innerHTML = 'Se envió correo para el cambio de contraseña';
    }
  }
});

// *********** Loguea con Google **************************
googleButton.addEventListener('click', (e) => {
  if (e.target) {
    loginGoogle();
  }
});

// *********** Loguea al Facebook **************************
faceButton.addEventListener('click', (e) => {
  if (e.target) {
    loginFacebook()
  }
});

