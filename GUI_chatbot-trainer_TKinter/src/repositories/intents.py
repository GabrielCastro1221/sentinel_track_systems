from typing import Dict, List
from uuid import uuid4
from datetime import datetime
from fastapi import HTTPException
from pymongo.collection import Collection
from src.models.intents import Intent
from src.config.connection import MongoConnection

class IntentRepository:
    def __init__(self):
        try:
            db = MongoConnection().get_db()
            self.collection: Collection = db["intents"]

            self.collection.create_index("name")

        except Exception as e:
            raise RuntimeError(f"Error conectando a MongoDB: {str(e)}")

    def create_intent(self, intent: Intent) -> Dict[str, str]:
        try:
            intent_id = str(uuid4())

            data = intent.model_dump()
            data["_id"] = intent_id
            data["created_at"] = datetime.utcnow()
            data["updated_at"] = datetime.utcnow()

            self.collection.insert_one(data)

            return {
                "id": intent_id,
                "status": "created",
                "timestamp": data["created_at"].isoformat()
            }

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al crear intent: {str(e)}"
            )

    def get_intent(self, intent_id: str) -> Intent:
        try:
            intent = self.collection.find_one({"_id": intent_id})

            if not intent:
                raise HTTPException(status_code=404, detail="Intent no encontrado")

            intent.pop("_id")
            return Intent(**intent)

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al obtener intent: {str(e)}"
            )

    def list_intents(self) -> Dict[str, Dict]:
        try:
            intents_cursor = self.collection.find()

            result = {}
            for intent in intents_cursor:
                intent_id = intent["_id"]
                intent.pop("_id")
                result[intent_id] = intent

            return result

        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al listar intents: {str(e)}"
            )

    def delete_intent(self, intent_id: str) -> Dict[str, str]:
        try:
            result = self.collection.delete_one({"_id": intent_id})

            if result.deleted_count == 0:
                raise HTTPException(status_code=404, detail="Intent no encontrado")

            return {"id": intent_id, "status": "deleted"}

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al eliminar intent: {str(e)}"
            )
        
    def update_intent(self, intent_id: str, data: Dict) -> Dict[str, str]:
        try:
            data["updated_at"] = datetime.utcnow()

            result = self.collection.update_one(
                {"_id": intent_id},
                {"$set": data}
            )

            if result.matched_count == 0:
                raise HTTPException(status_code=404, detail="Intent no encontrado")

            return {"id": intent_id, "status": "updated"}

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al actualizar intent: {str(e)}"
            )