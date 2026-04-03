from models.chatbot.intent import ChatbotIntent
from services.response_services import ResponseService
import random

class ChatbotService:
    @staticmethod
    def process_message(tag, prob):
        if prob > 0.75:
            intent_doc = ChatbotIntent.objects(name=tag).first()
            if intent_doc and intent_doc.responses:
                response = random.choice(intent_doc.responses)
                return ResponseService.format_response(response)
        return ResponseService.not_understood()
