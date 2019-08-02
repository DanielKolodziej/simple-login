// We are going to use localStorage and store our token there. 
// If you look in the call back of the signIn method you see setInStorage . 
// When the user opens our page, we check storage for the token. 
// If they have one, we assume they are logged in or we can verify it’s a valid token. 
// If they don’t have a token, we load our sign in and sign up form. 
// When they sign in with valid credentials, we save a new token.


//SWITCHTED TO COOKIES FOR HANDLING PRIVATE DATA(token + user id)
//KEEPING THIS LOCALSTORAGE AS REFERENCE/LATER USE

export function getFromStorage(key) {
    if (!key) {
      return null;
    }
    try {
      const valueStr = localStorage.getItem(key);
      if (valueStr) {
        return JSON.parse(valueStr);
      }
      return null;
    } catch (err) {
      return null;
    }
  }
  export function setInStorage(key, obj) {
    if (!key) {
      console.error('Error: Key is missing');
    }
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (err) {
      console.error(err);
    }
  }