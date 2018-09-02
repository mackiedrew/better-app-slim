firebase
  .auth()
  .createUserWithEmailAndPassword(email, password)
  .catch(error => {
    // Handle Errors here.
    const errorCode = error.code
    const errorMessage = error.message
    // ...
  })
