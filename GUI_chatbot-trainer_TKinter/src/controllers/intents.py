from typing import Dict, Any
from fastapi import HTTPException, status
from src.models.intents import Intent
from src.repositories.intents import IntentRepository

class IntentController:
    def __init__(self, repo: IntentRepository):
        self.repo = repo

    def post_intent(self, intent: Intent) -> Dict[str, Any]:
        try:
            result = self.repo.create_intent(intent)

            return {
                "message": "Intent creado exitosamente",
                "data": result
            }

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error inesperado al crear intent: {str(e)}"
            )

    def get_intent(self, intent_id: str) -> Dict[str, Any]:
        try:
            intent = self.repo.get_intent(intent_id)

            return {
                "message": "Intent encontrado",
                "data": intent.model_dump() if isinstance(intent, Intent) else intent
            }

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error inesperado al obtener intent: {str(e)}"
            )

    def list_intents(self) -> Dict[str, Any]:
        try:
            intents = self.repo.list_intents()

            return {
                "message": "Lista de intents obtenida",
                "count": len(intents),
                "data": intents
            }

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al listar intents: {str(e)}"
            )

    def delete_intent(self, intent_id: str) -> Dict[str, Any]:
        try:
            result = self.repo.delete_intent(intent_id)

            return {
                "message": "Intent eliminado correctamente",
                "data": result
            }

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error inesperado al eliminar intent: {str(e)}"
            )
        
    def update_intent(self, intent_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            result = self.repo.update_intent(intent_id, payload)

            return {
                "message": "Intent actualizado correctamente",
                "data": result
            }

        except HTTPException:
            raise

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error al actualizar intent: {str(e)}"
            )