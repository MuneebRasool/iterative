from app.extensions import db
from app.models.constants import AssistantModel, CSSFramework, ColorScheme

class UserSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)  # Ensure one-to-one relationship
    
    model_name = db.Column(db.Enum(AssistantModel), default=AssistantModel.GPT_3_5_TURBO, server_default=AssistantModel.GPT_3_5_TURBO.name, nullable=False)
    color_scheme = db.Column(db.Enum(ColorScheme), default=ColorScheme.SYSTEM, server_default=ColorScheme.SYSTEM.name, nullable=False)
    show_assistant_messages = db.Column(db.Boolean, default=False, server_default="false", nullable=False)
    css_framework = db.Column(db.Enum(CSSFramework), default=CSSFramework.DAISYUI, server_default=CSSFramework.DAISYUI.name, nullable=False)
    
    user = db.relationship('User', back_populates='settings', uselist=False)
    
    def __repr__(self):
        return f"UserSettings(user_id={self.user_id}, color_scheme='{self.color_scheme.name}'), model_name='{self.model_name.name}', css_framework='{self.css_framework.name}')"
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_email': self.user.email,
            'model_name': self.model_name.name,
            'color_scheme': self.color_scheme.name,
            'show_assistant_messages': self.show_assistant_messages,
            'css_framework': self.css_framework.name
        }