from app.extensions import db, user_project_table
from flask_login import UserMixin

    
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    stytch_user_id = db.Column(db.String(100), nullable=False, index=True)

    projects = db.relationship('Project', secondary=user_project_table, back_populates='users')
    chat_messages = db.relationship('ChatMessage', back_populates='user')
    deployments = db.relationship('Deployment')

    def __repr__(self):
        return f"User('{self.id}')"
      
    def get_id(self):
      return self.id
    
    def to_dict(self):
        return {
            'id': self.id,
        }

    @classmethod
    def from_dict(cls, data):
        user = cls()
        user.id = data.get('id')
        return user
    
    @property
    def is_guest(self):
        return False