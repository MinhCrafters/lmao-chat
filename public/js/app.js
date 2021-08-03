const messageTypes = { LEFT: 'left', RIGHT: 'right', LOGIN: 'login' };

const chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginBtn = document.getElementById('loginBtn');
const loginWindow = document.getElementById('login');

const messages = [];

var socket = io();

$(document).ready(function() {
    setTimeout(function() {
        $("body").addClass("loaded");
        $("h1").css("color", "#bbdefb");
    }, 2000);
});

socket.on('message', message => {
    if (message.type !== messageTypes.LOGIN) {
        if (message.author === username) {
            message.type = messageTypes.RIGHT;
        } else {
            message.type = messageTypes.LEFT;
        }
    }

    messages.push(message);
    displayMessages();

    chatWindow.scrollTop = chatWindow.scrollHeight;
});

createMessageHTML = message => {
    if (message.type === messageTypes.LOGIN) {
        return `
			<p class="secondary-text text-center mb-2">${
				message.author
			} joined the chat!</p>
		`;
    }
    return `
	<div class="message ${
		message.type === messageTypes.LEFT ? 'message-left' : 'message-right'
	}">
		<div class="message-details flex">
			<p class="flex-grow-1 message-author">${
				message.type === messageTypes.LEFT ? message.author : ''
			}</p>
			<p class="message-date">${message.date}</p>
		</div>
		<p class="message-content">${message.content}</p>
	</div>
	`;
};

displayMessages = () => {
    const messagesHTML = messages
        .map(message => createMessageHTML(message))
        .join('');
    messagesList.innerHTML = messagesHTML;
};

var checkLength = function() {
    if (messageInput.value.length > 2000) {
        document.getElementById('more').setAttribute('style', 'display: block');
        document.getElementById('less').setAttribute('style', 'display: none');
    } else {
        document.getElementById('more').setAttribute('style', 'display: none');
        document.getElementById('less').setAttribute('style', 'display: block');
    }
}

sendBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!messageInput.value) {
        return console.log('Invalid input');
    }

    const date = new Date();
    const month = ('0' + date.getMonth()).slice(0, 2);
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const mins = date.getMinutes();
    const dateString = `${hour}:${mins} - ${month}/${day}/${year}`;

    const message = {
        author: username,
        date: dateString,
        content: messageInput.value
    };

    sendMessage(message);

    messageInput.value = '';
});

loginBtn.addEventListener('click', e => {
    e.preventDefault();
    if (!usernameInput.value) {
        return console.log('Must supply a username');
    }

    username = usernameInput.value;
    sendMessage({ author: username, type: messageTypes.LOGIN });

    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
});

sendMessage = message => {
    socket.emit('message', message);
};