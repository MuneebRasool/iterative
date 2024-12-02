from app.extensions import db
from app.models.chat_message import ChatMessage

class ProjectState(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    react_code = db.Column(db.Text, nullable=True)
    css_code = db.Column(db.Text, nullable=True)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.now())
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    chat_messages = db.relationship('ChatMessage', backref='project_state', cascade='all, delete-orphan', order_by=db.asc(ChatMessage.id))
    deployments = db.relationship('Deployment', backref='project_state', cascade='all, delete-orphan')

    def __repr__(self):
        messages_summary = ", ".join([msg.content[:20] for msg in self.chat_messages]) # Truncate messages
        react_code_summary = self.react_code[:50] if self.react_code else "None" # Truncate react code
        css_code_summary = self.css_code[:50] if self.css_code else "None" # Truncate css code
        return f"ProjectState(ID: {self.id}, Project: {self.project_id}, Messages: [{messages_summary}], React Code: {react_code_summary}, CSS Code: {css_code_summary})"
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'reactCode': self.react_code,
            'cssCode': self.css_code,
            'projectID': str(self.project_id),
            'messages': [msg.to_dict() for msg in self.chat_messages]
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            id=int(data.get('id')),
            react_code=data.get('reactCode'),
            css_code=data.get('cssCode'),
            project_id=int(data.get('projectID')),
            chat_messages=[ChatMessage.from_dict(message) for message in data.get('messages', [])]
        )