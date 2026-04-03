from flask import Blueprint, request, jsonify
from controllers.chatbot_controller import ChatbotController

chatbot_bp = Blueprint("chatbot", __name__)

@chatbot_bp.route("/chatbot/message", methods=["POST", "OPTIONS"])
def chatbot_response():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200
    
    data_json = request.get_json(silent=True)

    if not data_json:
        return jsonify({"response": "No data"}), 400
    
    sentence = data_json.get("message", "")
    return ChatbotController.handle_message(sentence)