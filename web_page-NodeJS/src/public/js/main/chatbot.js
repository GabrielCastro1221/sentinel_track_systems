class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.chatbox__send--footer'),
            input: document.querySelector('.chatbox__footer input'),
            messagesContainer: document.querySelector('.chatbox__messages div')
        };
        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, sendButton, input } = this.args;

        openButton.addEventListener('click', () => this.toggleState(this.args.chatBox));

        sendButton.addEventListener('click', () => this.onSendButton());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.onSendButton();
        });
    }

    toggleState(chatbox) {
        this.state = !this.state;
        if (this.state) {
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    async onSendButton() {
        const { input } = this.args;
        const text = input.value.trim();
        if (!text) return;

        this.addMessage('user', text);
        input.value = '';

        try {
            const response = await fetch('http://127.0.0.1:3000/chatbot/message', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
                credentials: "include"
            });

            const data = await response.json();
            this.addMessage('bot', data.response);
        } catch (error) {
            console.error('Error al comunicarse con el bot:', error);
            this.addMessage('bot', 'Lo siento, hubo un error al procesar tu mensaje.');
        }
    }


    addMessage(sender, text) {
        const { messagesContainer } = this.args;
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.textContent = text;
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

const chatbox = new Chatbox();
chatbox.display();
