import requests
from src.config.enviroment import config

BASE_URL = f"http://{config['server']['base_url']}:{config['server']['port']}"

def get_intents():
    return requests.get(f"{BASE_URL}/intents").json()

def create_intent(data):
    return requests.post(f"{BASE_URL}/intents", json=data).json()

def delete_intent(intent_id):
    return requests.delete(f"{BASE_URL}/intents/{intent_id}").json()