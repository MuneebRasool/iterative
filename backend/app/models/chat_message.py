from app.extensions import db
from app.models.constants import AssistantModel

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)  # 'user' or 'assistant'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    project_state_id = db.Column(db.Integer, db.ForeignKey('project_state.id'), nullable=False)
    user = db.relationship('User', back_populates='chat_messages')
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    model_name = db.Column(db.Enum(AssistantModel), default=AssistantModel.GPT_3_5_TURBO, nullable=True)

    def __repr__(self):
        return f"ChatMessage(ID: {self.id}, User: {self.user_id}, Content: {self.content[:50]})"
    
    def to_dict(self):
        time_str = ""
        if self.created_at:
            time_str = self.created_at.strftime('%Y-%m-%d %H:%M:%S')

        model_name = ""
        if self.model_name:
            model_name = self.model_name.value

        return {
            'id': str(self.id),
            'content': self.content,
            'role': self.role,
            'user_id': self.user_id,
            'project_state_id': str(self.project_state_id),
            'created_at': time_str,
            'model_name': model_name
        }
    
    @classmethod
    def from_dict(cls, data):
        return cls(
            id=int(data.get('id')),
            content=data.get('content'),
            role=data.get('role'),
            user_id=data.get('user_id'),
            project_state_id=int(data.get('project_state_id')),
            model_name=AssistantModel(data.get('model_name'))
        )