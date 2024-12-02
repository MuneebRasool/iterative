from app.extensions import db

class Recommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())
    
    def to_dict(self):
      return {
          'id': str(self.id),
          'name': self.name,
          'description': self.description,
          'project_id': self.project_id,
      }
