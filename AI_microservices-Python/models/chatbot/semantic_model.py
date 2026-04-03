from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json

class SemanticIntentRecognizer:
    def __init__(self, model_name='all-MiniLM-L6-v2', threshold=0.65):
        """
        threshold: Nivel mínimo de similitud para considerar que entendió la intención.
        """
        self.model = SentenceTransformer(model_name)
        self.threshold = threshold
        
        with open("intents.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        
        self.intent_phrases = []
        self.intent_tags = []
        
        for intent in data["intents"]:
            for pattern in intent["patterns"]:
                self.intent_phrases.append(pattern)
                self.intent_tags.append(intent["tag"])
        
        print("[INFO] Generando embeddings de todos los patrones...")
        self.intent_embeddings = self.model.encode(self.intent_phrases, convert_to_numpy=True, normalize_embeddings=True)

    def predict_intent(self, message):
        input_emb = self.model.encode(message, convert_to_numpy=True, normalize_embeddings=True)
        sims = cosine_similarity([input_emb], self.intent_embeddings)[0]
        
        best_index = np.argmax(sims)
        best_score = sims[best_index]
        best_tag = self.intent_tags[best_index]
        
        if best_score < self.threshold:
            return "fallback", float(best_score)
        
        return best_tag, float(best_score)
