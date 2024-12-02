from uuid import uuid4
from sqlalchemy import UUID
from app.extensions import db
from app.models.project_state import ProjectState

class Deployment(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name = db.Column(db.String(100), nullable=False)
    project_state_id = db.Column(db.Integer, db.ForeignKey('project_state.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable = False)
    password = db.Column(db.String(40), nullable = False)
    
    def serialize(self):
      return {
        "id": self.id,
        "project_state_id": self.project_state_id,
        "user_id": self.user_id,
        "name": self.name,
        "password": self.password,
      }
    
    def show(self):
      project_state = ProjectState.query.get(self.project_state_id)
      return {
        "id": self.id,
        "react_code": project_state.react_code,
      }
    
