const outBtnHorizontal = document.getElementById('signOutHorizontal');
const outBtnVertical = document.getElementById('signOutVertical');
const publicButton = document.getElementById('buttonPost');
const selectPrivacy = document.getElementById('privacy');
const publications = document.getElementById('publications');
const startBtnHorizontal = document.getElementById('startHorizontal');
const startBtnVertical = document.getElementById('startVertical');
const myPostBtnHorizontal = document.getElementById('myPostHorizontal');
const myPostBtnVertical = document.getElementById('myPostVertical');
const validPost = document.getElementById('valid-post');

// Inicializando el side-nav
document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.sidenav');
  const instances = M.Sidenav.init(elems);
});

// Inicializando select de privacidad del post
document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('select');
  const instances = M.FormSelect.init(elems);
});
    
// Cerrar sesión (NavBar)
if (outBtnVertical !== null){
  outBtnVertical.addEventListener('click', () => {
  signOut();
});
}

// Cerrar sesión
if (outBtnHorizontal !== null){
  outBtnHorizontal.addEventListener('click', () => {
  signOut();
  window.location.href = 'index.html';
});
}

if (publicButton !== null){
publicButton.addEventListener('click', () => {
  let userId = firebase.auth().currentUser.uid;
  firebase.database().ref('/users/' + userId).once('value')
    .then((user) => {
    const nameUser = (user.val().username);
    let newPost = document.getElementById('post').value;
    let state = selectPrivacy.value;
    if (selectPrivacy.value != '0' && validationPublicPost(newPost)) {
      writeNewPost(userId, nameUser, newPost, state);
      printPost();
      document.getElementById('post').value = '';
      document.getElementById('privacy').value = '0';
      validPost.innerHTML = '';
    } else {
      validPost.innerHTML = '* ¡Selecciona privacidad y/o escribe un mensaje! *';
    }
  })
})
}

if (startBtnHorizontal !== null){
  startBtnHorizontal.addEventListener('click', () => {
  printPost();
})
}
 
if (myPostBtnHorizontal !== null){
  myPostBtnHorizontal.addEventListener('click', () => {
  showMyPost();
})
}

if (startBtnVertical !== null){
  startBtnVertical.addEventListener('click', () => {
  printPost();
})
}

if (myPostBtnVertical !== null){  
  myPostBtnVertical.addEventListener('click', () => {
  let userId = firebase.auth().currentUser.uid;
  showMyPost(userId);
})
}
      