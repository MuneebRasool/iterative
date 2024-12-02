from app.extensions import db, user_project_table
from app.models.constants import CSSFramework
from app.models.project_state import ProjectState
from app.models.recommendation import Recommendation
from app.models.user import User

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    last_modified_at = db.Column(db.DateTime, nullable=False, default=db.func.now(), onupdate=db.func.now())
    last_accessed_at = db.Column(db.DateTime)
    css_framework = db.Column(db.Enum(CSSFramework), default=CSSFramework.DAISYUI, server_default=CSSFramework.BOOTSTRAP.name, nullable=False)
    project_states = db.relationship('ProjectState', backref='project', cascade='all, delete-orphan', order_by=db.asc(ProjectState.id))
    users = db.relationship('User', secondary=user_project_table, back_populates='projects')
    recommendations = db.relationship('Recommendation', backref='project', cascade='all, delete-orphan', order_by=db.asc(Recommendation.id))

    def __repr__(self):
        return f"Project('{self.name}')"
    
    def to_dict(self):
        if isinstance(self.css_framework, CSSFramework):
            css_framework = self.css_framework.name
        else:
            css_framework = self.css_framework
        return {
            'id': str(self.id),
            'name': self.name,
            'users': [{'id': user.id} for user in self.users],
            'projectStates': [{
                'reactCode': state.react_code,
                'cssCode': state.css_code,
                'messages': [msg.to_dict() for msg in state.chat_messages],
                'projectStateId': state.id,
            } for state in self.project_states],
            'cssFramework': css_framework
        }
    
    @classmethod
    def from_dict(cls, data):
        project = cls()
        project.id = int(data.get('id'))
        project.name = data.get('name')
                
        # Users
        user_data = data.get('users', [])
        project.users = [User.from_dict(user) for user in user_data]
        
        # Project States
        state_data = data.get('projectStates', [])
        project.project_states = [ProjectState.from_dict(state) for state in state_data]

        # CSS Framework
        css_framework_data = data.get('cssFramework', )
        project.css_framework = css_framework_data
        
        return project
