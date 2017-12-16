let socket = io();

let sendButton = $("#send");
let loginButton = $("#login");
let chatWindow = $("#chat-window");
let output = $("#output");
let handle = $("#handle");
let message = $("#message");

loginButton.click(() => {
    let username = handle.val();
    if (username) {
        socket.emit('login', username)
    }
});

socket.on('logged-in', () => {
    handle.css('display', 'none');
    loginButton.css('display', 'none');
    chatWindow.css('display', 'block');
    message.css('display', 'block');
    sendButton.css('display', 'block');
});

sendButton.click(() => {
    let messageData = message.val();
    if (messageData){
        socket.emit('message', messageData)
    }
    message.val("");
});

socket.on('chat', data => {
    let messageBody = `<p><b>${data.handle}:</b> ${data.message}</p>`;
    output.append(messageBody)
})