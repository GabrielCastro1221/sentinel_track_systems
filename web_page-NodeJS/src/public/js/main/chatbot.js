class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.chatbox__send--footer'),
            input: document.querySelector('.chatbox__footer input'),
            messagesContainer: document.querySelector('.chatbox__messages')
        };

        this.state = false;
    }

    display() {
        const { openButton, sendButton, input } = this.args;

        if (!openButton || !sendButton || !input) {
            console.error("Chatbox no inicializado correctamente");
            return;
        }

        openButton.addEventListener('click', () => {
            this.toggleState();
        });

        sendButton.addEventListener('click', () => {
            this.onSendButton();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.onSendButton();
            }
        });

        document.addEventListener('click', (e) => {
            if (!this.args.chatBox.contains(e.target) &&
                !this.args.openButton.contains(e.target)) {

                if (this.state) {
                    this.toggleState();
                }
            }
        });
    }

    toggleState() {
        this.state = !this.state;

        if (this.state) {
            this.args.chatBox.classList.add('chatbox--active');
        } else {
            this.args.chatBox.classList.remove('chatbox--active');
        }
    }

    async onSendButton() {
        const { input } = this.args;
        const text = input.value.trim();

        if (!text) return;

        this.addMessage('visitor', text);
        input.value = '';

        try {
            const response = await fetch('http://127.0.0.1:3000/chatbot/message', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
                credentials: "include"
            });

            const data = await response.json();
            this.addMessage('operator', data.response);

        } catch (error) {
            console.error("Error:", error);
            this.addMessage('operator', 'Lo siento, hubo un error.');
        }
    }

    addMessage(sender, text) {
        const msgDiv = document.createElement('div');

        msgDiv.classList.add('messages__item');

        if (sender === 'visitor') {
            msgDiv.classList.add('messages__item--visitor');
        } else {
            msgDiv.classList.add('messages__item--operator');
        }

        msgDiv.textContent = text;

        this.args.messagesContainer.prepend(msgDiv);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const chatbox = new Chatbox();
    chatbox.display();
});