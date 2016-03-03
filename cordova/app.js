(function() {
  'use strict';
  var Firebase = window.Firebase;
  // CORDOVA START
  var app = {
    initialize: function() {
      this.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
      app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
      if (id === 'deviceready') {
        // CORDOVA END
        var me;
        var myDataRef = new Firebase('https://jetexample.firebaseio.com/');
        var chatInputsMessageEl
          = document.getElementById('chat__inputs__message');
        myDataRef.onAuth(authDataCallback);
        document.getElementById('account__login__form')
          .addEventListener('submit', login);
        document.getElementById('account__create__form')
          .addEventListener('submit', create);
        document.getElementById('chat__logout')
          .addEventListener('click', logout);
        chatInputsMessageEl.addEventListener('keypress', postMessage);
      }
      function authDataCallback(authData) {
        var accountEl = document.getElementById('account');
        var chatMessagesEl = document.getElementById('chat__messages');
        me = authData;
        if (me) {
          accountEl.style.display = 'none';
          document.getElementById('chat__email').innerHTML = me.password.email;
          document.getElementById('chat').style.display = 'block';
          myDataRef.on('child_added', displayChatMessage);
        } else {
          accountEl.style.display = 'block';
        }
        function displayChatMessage(snapshot) {
          var value = snapshot.val();
          var messageEl = document.createElement('li');
          messageEl.classList.add('list-group-item');
          messageEl.innerHTML = [
            '<div>' +
             escapeHtml(value.message) + '</div>',
            '<div class="chat__messages__message__email">' +
            value.email + '</div>'
          ].join('\n');
          chatMessagesEl.appendChild(messageEl);
        }
      }
      function login(e) {
        var accountLoginFormEmailEl =
          document.getElementById('account__login__form__email');
        var accountLoginFormPasswordEl =
          document.getElementById('account__login__form__password');
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
        var accountCreateFormEmailEl =
          document.getElementById('account__create__form__email');
        var accountCreateFormPasswordEl =
          document.getElementById('account__create__form__password');
        var accountCreateFormConfirmEl =
          document.getElementById('account__create__form__confirm');
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
        window.location.reload();
      }
      function postMessage(e) {
        var message;
        if (e.keyCode === 13) {
          message = chatInputsMessageEl.value;
          if (message) {
            myDataRef.push({
              email: me.password.email,
              message: message
            });
            chatInputsMessageEl.value = '';
          }
        }
      }
      function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
      }
    }
    // CORDOVA START
  };
  app.initialize();
  // CORDOVA END
})();
