import torch
from flask import jsonify
from core.chatbot.nltk_utils import tokenize, bag_of_words
from core.chatbot.responder import responder_saludo
from middlewares.load_chatbot import model, all_words, tags, intents, device
from services.response_services import ResponseService

class ChatbotController:

    @staticmethod
    def handle_message(sentence):
        if not sentence:
            return jsonify(ResponseService.not_understood())

        sentence_tokens = tokenize(sentence)
        X = bag_of_words(sentence_tokens, all_words)
        X = torch.tensor(X, dtype=torch.float32).unsqueeze(0).to(device)

        output = model(X)
        _, predicted = torch.max(output, dim=1)
        tag = tags[predicted.item()]

        probs = torch.softmax(output, dim=1)
        prob = probs[0][predicted.item()]

        if tag == "saludo":
            saludo = responder_saludo(sentence)
            return jsonify(ResponseService.greeting_response(saludo))

        if prob.item() > 0.75:
            for intent in intents["intents"]:
                if tag == intent["tag"]:
                    return jsonify(ResponseService.format_response(intent["responses"][0]))

        return jsonify(ResponseService.not_understood())
