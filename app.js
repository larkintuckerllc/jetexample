(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var Firebase = window.Firebase;
    var myDataRef = new Firebase('https://jetexample.firebaseio.com/');
    var accountEl = document.getElementById('account');
    var accountLoginFormEl = document.getElementById('account__login__form');
    var accountLoginFormEmailEl =
      document.getElementById('account__login__form__email');
    var accountLoginFormPasswordEl =
      document.getElementById('account__login__form__password');
    var accountCreateFormEl = document.getElementById('account__create__form');
    var accountCreateFormEmailEl =
      document.getElementById('account__create__form__email');
    var accountCreateFormPasswordEl =
      document.getElementById('account__create__form__password');
    var accountCreateFormConfirmEl =
      document.getElementById('account__create__form__confirm');
    var chatEl = document.getElementById('chat');
    var chatLogoutEl = document.getElementById('chat__logout');
    var chatMessagesEl = document.getElementById('chat__messages');
    var chatInputsMessageEl = document.getElementById('chat__inputs__message');
    myDataRef.onAuth(authDataCallback);
    accountLoginFormEl.addEventListener('submit', login);
    accountCreateFormEl.addEventListener('submit', create);
    chatLogoutEl.addEventListener('click', logout);
    chatInputsMessageEl.addEventListener('keypress', postMessage);
    function authDataCallback(authData) {
      if (authData) {
        accountEl.style.display = 'none';
        chatEl.style.display = 'block';
        myDataRef.on('child_added', displayChatMessage);
      } else {
        chatEl.style.display = 'none';
        accountEl.style.display = 'block';
        myDataRef.off('child_added', displayChatMessage);
        chatMessagesEl.innerHTML = '';
      }
      function displayChatMessage(snapshot) {
        var value = snapshot.val();
        var messageEl = document.createElement('div');
        messageEl.classList.add('chat__messages__message');
        // TODO: HTML SANITIZE
        messageEl.innerHTML = [
          '<div class="chat__messages__message__message">' +
           value.message + '</div>'
        ].join('\n');
        chatMessagesEl.appendChild(messageEl);
      }
    }
    function login(e) {
      var email = accountLoginFormEmailEl.value;
      var password = accountLoginFormPasswordEl.value;
      e.preventDefault();
      if (email && password) {
        myDataRef.authWithPassword({
          email: email,
          password: password
        }, authHandler);
      }
      function authHandler(error) {
        if (!error) {
          accountLoginFormEmailEl.value = '';
        }
        accountLoginFormPasswordEl.value = '';
      }
    }
    function create(e) {
      var email = accountCreateFormEmailEl.value;
      var password = accountCreateFormPasswordEl.value;
      var confirm = accountCreateFormConfirmEl.value;
      e.preventDefault();
      if (email && password && password === confirm) {
        myDataRef.createUser({
          email: email,
          password: password
        }, createHandler);
      } else {
        accountCreateFormPasswordEl.value = '';
        accountCreateFormConfirmEl.value = '';
      }
      function createHandler(error) {
        if (!error) {
          accountCreateFormEmailEl.value = '';
        }
        accountCreateFormPasswordEl.value = '';
        accountCreateFormConfirmEl.value = '';
      }
    }
    function logout() {
      myDataRef.unauth();
    }
    function postMessage(e) {
      var message;
      if (e.keyCode === 13) {
        message = chatInputsMessageEl.value;
        if (message) {
          // TODO: ADD IDENTITY
          myDataRef.push({message: message});
          chatInputsMessageEl.value = '';
        }
      }
    }
  }
})();
