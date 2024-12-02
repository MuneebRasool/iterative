from enum import Enum
from sqlalchemy.dialects.postgresql import UUID
import uuid
from app.extensions import db

class ChatConversationStatus(Enum):
    NOT_STARTED = 0
    RUNNING = 1
    COMPLETED = 2

class ChatConversation(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    gpt_result = db.Column(db.Text)
    status = db.Column(db.Enum(ChatConversationStatus, default=ChatConversationStatus.NOT_STARTED, server_default=ChatConversationStatus.NOT_STARTED.name, nullable = False))