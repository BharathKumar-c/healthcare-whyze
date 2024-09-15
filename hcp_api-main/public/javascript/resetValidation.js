/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
function togglePassword() {
  const img = document.getElementById('imgpassword');
  const password = document.getElementById('password');
  if (img && password.type === 'password') {
    password.type = 'text';
    img.src = '/images/EyesClose.svg';
  } else {
    password.type = 'password';
    img.src = '/images/EyesOpen.svg';
  }
}
function toggleConfirmPassword() {
  const img = document.getElementById('imgconfirmpassword');
  const password = document.getElementById('confirm-password');
  if (img && password.type === 'password') {
    password.type = 'text';
    img.src = '/images/EyesClose.svg';
  } else {
    password.type = 'password';
    img.src = '/images/EyesOpen.svg';
  }
}

function validation() {
  const password = document.getElementById('password').value;
  if (password.length > 7 && password.length <= 20) {
    const img = document.getElementById('length-message');
    img.src = '/images/CheckGreen.svg';
  } else {
    const img = document.getElementById('length-message');
    img.src = '/images/Check.svg';
  }

  if (password.match(/[0-9]/)) {
    const img = document.getElementById('number-message');
    img.src = '/images/CheckGreen.svg';
  } else {
    const img = document.getElementById('number-message');
    img.src = '/images/Check.svg';
  }

  if (password.match(/[a-z]/)) {
    const img = document.getElementById('lowercase-message');
    img.src = '/images/CheckGreen.svg';
  } else {
    const img = document.getElementById('lowercase-message');
    img.src = '/images/Check.svg';
  }

  if (password.match(/[A-Z]/)) {
    const img = document.getElementById('uppercase-message');
    img.src = '/images/CheckGreen.svg';
  } else {
    const img = document.getElementById('uppercase-message');
    img.src = '/images/Check.svg';
  }
}

function handleSubmit() {
  const btnSubmit = document.getElementById('button');
  const password = document.getElementById('password');
  const email = document.getElementById('email');

  const confirmPassword = document.getElementById('confirm-password');
  const message = document.getElementById('error');
  if (confirmPassword.value) {
    if (password.value === confirmPassword.value) {
      btnSubmit.disabled = false;
      message.innerHTML = '';
    } else {
      btnSubmit.disabled = true;
      message.style.color = 'Red';
      message.style.fontSize = '12px';
      message.style.fontFamily = 'DMSansRegular';
      message.innerHTML = 'Passwords do not match.';
    }
  } else {
    message.innerHTML = '';
    btnSubmit.disabled = true;
  }
}

function closeWindow() {
  window.close();
}
