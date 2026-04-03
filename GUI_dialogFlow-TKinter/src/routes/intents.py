from fastapi import APIRouter
from src.models.intents import Intent
from src.repositories.intents import IntentRepository
from src.controllers.intents import IntentController

router = APIRouter()
repo = IntentRepository()
controller = IntentController(repo)

@router.post("/intents")
def create_intent(intent: Intent):
    return controller.post_intent(intent)

@router.get("/intents/{intent_id}")
def get_intent(intent_id: str):
    return controller.get_intent(intent_id)

@router.get("/intents")
def list_intents():
    return controller.list_intents()

@router.delete("/intents/{intent_id}")
def delete_intent(intent_id: str):
    return controller.delete_intent(intent_id)

@router.put("/intents/{intent_id}")
def update_intent(intent_id: str, payload: dict):
    return controller.update_intent(intent_id, payload)