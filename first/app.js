(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', ready);
  function ready() {
    var Firebase = window.Firebase;
    var myDataRef = new Firebase('https://jetexample.firebaseio.com/');
    var chatMessagesEl = document.getElementById('chat__messages');
    var chatInputsMessageEl = document.getElementById('chat__inputs__message');
    myDataRef.on('child_added', displayChatMessage);
    chatInputsMessageEl.addEventListener('keypress', postMessage);
    function displayChatMessage(snapshot) {
      var value = snapshot.val();
      var messageEl = document.createElement('li');
      messageEl.innerHTML = [
        '<div>' +
         escapeHtml(value.message) + '</div>',
        '<div>' +
        value.email + '</div>'
      ].join('\n');
      chatMessagesEl.appendChild(messageEl);
    }
    function postMessage(e) {
      var message;
      if (e.keyCode === 13) {
        message = chatInputsMessageEl.value;
        if (message) {
          myDataRef.push({
            email: 'john@larkintuckerllc.com',
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
})();
