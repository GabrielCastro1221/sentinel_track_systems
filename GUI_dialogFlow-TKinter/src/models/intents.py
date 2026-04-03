from pydantic import BaseModel, Field
from typing import List, Optional, Literal

class Context(BaseModel):
    area: str = "general"
    company: str = "sentinel_track_systems"
    module: Optional[str] = None

class Metadata(BaseModel):
    source: Optional[str] = None
    notes: Optional[str] = None

class TrainingConfig(BaseModel):
    useForNLP: bool = True
    useForEmbedding: bool = False
    useForFAQ: bool = True

class Intent(BaseModel):
    name: str = Field(..., min_length=1)
    description: str = ""

    trainingPhrases: List[str] = Field(default_factory=list)
    responses: List[str] = Field(default_factory=list)

    context: Context = Field(default_factory=Context)

    tags: List[str] = Field(default_factory=list)
    language: str = "es"
    priority: int = 0

    status: Literal["active", "inactive", "training"] = "active"
    version: int = 1

    metadata: Metadata = Field(default_factory=Metadata)
    trainingConfig: TrainingConfig = Field(default_factory=TrainingConfig)

    embedding: List[float] = Field(default_factory=list)
    createdBy: str = "system"