// Initialize Firebase
var config = {
  apiKey: "AIzaSyBt7Ap6YvpAzIXc3UNihWlWomZfrHVBOOE",
  authDomain: "projecto2-272727.firebaseapp.com",
  databaseURL: "https://projecto2-272727.firebaseio.com",
  projectId: "projecto2-272727",
  storageBucket: "projecto2-272727.appspot.com",
  messagingSenderId: "1040741679215"
};
firebase.initializeApp(config);

// Guardar datos de login en BD
const saveData = (userId, name, email, imageUrl) => {
  firebase.database().ref('users/' + userId).
  set({
    username: name,
    email: email,
    picture: imageUrl,
    id: userId,
  });
}

// Registro de Usuarios Nuevos
const registerNew = (email, password) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      const user = result.user;
      if (user.displayName == null) {
        username = document.getElementById('nameUser').value;
      } else {
        username = user.displayName;
      }
      if (user.photoURL == null) {
        picture = "https://thumbs.dreamstime.com/b/icono-del-usuario-46707697.jpg";
      } else {
        picture = user.photoURL;
      }
      saveData(user.uid, username, user.email, picture);
      check();
      alert('Tu usuario ha sido registrado! \nConfirma el mensaje de verificación en tu correo y seguidamente puedes Iniciar Sesión');
      formRegister.classList.add('hidden');
      formStart.classList.remove('hidden');
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (error.message === 'auth/email-already-in-use') {
        validInputs.innerHTML = "El email ingresado ya está en uso";
      } else if (error.message === 'The email address is already in use by another account.') {
        validInputs.innerHTML = "El email está siendo utilizado por otro usuario";
      }
    })
}

// Inicio de sesión de usuario existente
let login = (email, password) => {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(()=> {
      window.location.href = 'timeline.html';
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      if (error.message === 'The password is invalid or the user does not have a password.') {
        validInputs2.innerHTML = "email o password incorrectos";
      } else if (error.message === 'There is no user record corresponding to this identifier. The user may have been deleted.') {
        validInputs2.innerHTML = "Usuario no registrado";
      }
    });
}

// Validación de autenticación de usuarios
const validation = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let displayName = user.displayName;
      let email = user.email;
      let emailVerified = user.emailVerified;
      let photoURL = user.photoURL;
      let isAnonymous = user.isAnonymous;
      let uid = user.uid;
      let providerData = user.providerData;
    } else {
      alert('No está logueado');
      window.location.href = 'index.html';
    }
  });
}

// Login con Google
const loginGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
    const token = result.credential.accessToken;
    // Información de usuario
    const userData = result.user;
    saveData(userData.uid, userData.displayName, userData.email, userData.photoURL);
    window.location.href = 'timeline.html';
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      alert(error);
    });
}

// Validación de correo al usuario
const check = () => {
  const user = firebase.auth().currentUser;
  user.sendEmailVerification().then(() => {
  }).catch((error) => {
  });
}

// Cambio de contraseña
const resetPassword = (email) => {
  firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
  })
  .catch((error) => {
  })
}

// Función para cerrar sesion
const signOut = () => {
  firebase.auth().signOut().then(() => {
    window.location.href = 'index.html';
  }).catch((error) => {
  });
}

// Login con Facebook
const loginFacebook = () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const token = result.credential.accessToken;
      const user = result.user;
      saveData(user.uid, user.displayName, user.email, user.photoURL);
      window.location.href = 'timeline.html';
    })
    .catch((error) => {
    });
}

// Función para escribir nuevo post
const writeNewPost = (uid, name, textPost, state) => {
  let postData = {
    id: uid,
    author: name,
    newPost: textPost,
    privacy: state,
    likeCount: 0,
    usersLikes: []
  };

  // Key para nueva publicación
  let postKey = firebase.database().ref().child('posts').push().key;    
  let updates = {};
  updates['/posts/' + postKey] = postData;
  updates['/user-posts/' + uid + '/' + postKey] = postData;
  return firebase.database().ref().update(updates);
}

// Función para eliminar Post
window.deletePost = (id) => {
  const questions = confirm('¿Está seguro de eliminar?');
  if (questions) {
    const userId = firebase.auth().currentUser.uid;
    firebase.database().ref().child('/user-posts/' + userId + '/' + id).remove();
    firebase.database().ref().child('posts/' + id).remove();
    while (publications.firstChild) publications.removeChild(publications.firstChild);
    alert('Post eliminado');
    window.location.reload();
  }
}

// Función para editar Post
window.editPost = (id) => {
  const currentPost = document.getElementById(id);
  const currentTextarea = currentPost.querySelector('.textarea-post');
  currentTextarea.disabled = false;
  const editButton = currentPost.querySelector('.edit-button');
  const saveButton = currentPost.querySelector('.save-button');
  editButton.classList.add('hidden');
  saveButton.classList.remove('hidden');
  currentTextarea.focus();
}

// Función para guardar post editado
window.savePostEdit = (id) => {
  const currentPost = document.getElementById(id);
  const currentTextarea = currentPost.querySelector('.textarea-post');
  const editButton = currentPost.querySelector('.edit-button');
  const saveButton = currentPost.querySelector('.save-button');
  const userId = firebase.auth().currentUser.uid;

  firebase.database().ref('posts/')
  .once('value', (postsRef) => { 
      const posts = postsRef.val();
      const postEdit = posts[id];
  
      let postEditRef = {
        id: postEdit.id,
        author: postEdit.author,
        newPost: currentTextarea.value,
        privacy: postEdit.privacy,
        likeCount: postEdit.likeCount,
        usersLikes: postEdit.usersLikes || []
      }
  
      let updates = {};
      updates['/posts/' + id] = postEditRef;
      updates['/user-posts/' + userId + '/' + id] = postEditRef;
      return firebase.database().ref().update(updates);

      currentTextarea.disabled = true;
      saveButton.classList.add('hidden');
      editButton.classList.remove('hidden');
    });
}

// Función para like's
window.like = (id) => {
  let userId = firebase.auth().currentUser.uid;
  const currentPost = document.getElementById(id);
  firebase.database().ref('posts/')
  .once('value', (postsRef) => {
    const listPost = postsRef.val();
    const postLike = listPost[id];
    
    let postLikeRef = {
      id: postLike.id,
      author: postLike.author,
      newPost: postLike.newPost,
      privacy: postLike.privacy,
      likeCount: postLike.likeCount,
      usersLikes: postLike.usersLikes || []
    }

    const objRefLike = postLikeRef.usersLikes;
    
    if (objRefLike.indexOf(userId) === -1) {
      objRefLike.push(userId);
      postLikeRef.likeCount = objRefLike.length; 
    } else {
      let dislike = objRefLike.filter(user => user !== userId)
      postLikeRef.usersLikes = dislike;
      postLikeRef.likeCount = dislike.length;
    }
    
    let updates = {};
    updates['/posts/' + id] = postLikeRef;
    updates['/user-posts/' + userId + '/' + id] = postLikeRef;
    return firebase.database().ref().update(updates);
  })
}

// Imprimir total post publicados
window.printPost = () => { 
  validation();
  firebase.database().ref('posts/')
  .on('value', (postsRef) =>{
    const posts = postsRef.val();
    const publications = document.getElementById('publications');
    publications.innerHTML='';
    const postsOrder = Object.keys(posts).reverse();
    let userId = firebase.auth().currentUser.uid;
    const postActions = (id) => {
      return `<div class="actions">
      <a onclick="savePostEdit('${id}')" class="save-button hidden"><img src="../img/icon-save.png" alt="icono de guardar" width="20px"></a>
      <a onclick="editPost('${id}')" class="edit-button"><img src="../img/icon-edit.png" alt="icono de editar" width="25px"></a>
      <a onclick="deletePost('${id}')" id="delete-button"><img src="../img/icon-delete.png" alt="icono de eliminar" width="20px"></a>
      </div>`
    }
                   
    postsOrder.forEach((id) => {
      const post = posts[id];
      if (post.privacy === 'Público'){
        publications.innerHTML += `
        <div class="show-post" id=${id}>
          <div class="card post2">
            <div class="col s12 m12"> 
              <div class="card-stacked">
                <span class="card-title">${post.author}</span>
                <div class="actions"><img src="${post.privacy === 'Amigos' ? '../img/keyhole.png' : '../img/worldwide.png'}"></div>
              </div class="card-content">
              <textarea class="textarea-post" cols="80" rows="30" disabled>${post.newPost}</textarea>
              <div>
                <div class="icon-like">
                  <a class="like-button">
                    <img onclick="like('${id}')" src="../img/icon-like1.png" alt="icono de like" width="20px">
                  </a>
                  <p class="count-like" id="show-count">${post.likeCount}</p>
                </div>
                <div class="actions">${userId === post.id ? postActions(id) : ''}</div>
              </div>
            </div>
          </div>
        </div>
        </div>
       ` 
      }
      
    })
  })
}

// Imprimir sólo post del usuario logueado
const showMyPost = () => {
  let userId = firebase.auth().currentUser.uid;
  firebase.database().ref('/user-posts/' + userId + '/')
  .once('value', (userPostsRef) => {
    const listPosts = userPostsRef.val();
    const listPostsOrder = Object.keys(listPosts).reverse();
    const publications = document.getElementById('publications');
    publications.innerHTML='';

    listPostsOrder.forEach((id) => {
      const userPostId = listPosts[id]; 
      if (userPostId.id === userId) {
        publications.innerHTML += `
        <div class="show-post" id=${id}>
          <div class="card post2">
            <div class="col s12 m12"> 
              <div class="card-stacked">
                <span class="card-title">${userPostId.author}</span>
                <div class="actions"><img src="${userPostId.privacy === 'Amigos' ? '../img/keyhole.png' : '../img/worldwide.png'}"></div>
              </div>
              <textarea class="textarea-post" cols="80" rows="7" disabled>${userPostId.newPost}</textarea>
              <div>
                <div class="icon-like">
                  <a class="like-button">
                    <img onclick="like('${id}')" src="../img/icon-like1.png" alt="icono de like" width="20px">
                  </a>
                  <p class="count-like" id="show-count">${userPostId.likeCount}</p>
                </div>
                <div class="actions">
                  <a onclick="savePostEdit('${id}')" class="save-button hidden"><img src="../img/icon-save.png" alt="icono de guardar" width="20px"></a>
                  <a onclick="editPost('${id}')" class="edit-button"><img src="../img/icon-edit.png" alt="icono de editar" width="25px"></a>
                  <a onclick="deletePost('${id}')" id="delete-button"><img src="../img/icon-delete.png" alt="icono de eliminar" width="20px"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
       ` 
      }  
    })
  })
}
