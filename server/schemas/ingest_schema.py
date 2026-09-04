from pydantic import BaseModel, Field
from typing import Optional

class TextIngestRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Patient symptoms or query")
    session_id: Optional[str] = Field(default=None, description="Conversation session identifier")

class TextIngestResponse(BaseModel):
    status: str = "success"
    session_id: Optional[str]
    reply: str