from app.settings import bp
from flask_login import login_required, current_user
from flask import jsonify, request
from app.extensions import db

@bp.route('/api/get-user-settings', methods=['GET'])
@login_required
def get_user_settings():
    user_settings = current_user.settings
    settings_data = user_settings.to_dict()
    return jsonify({"settings": settings_data})

@bp.route('/api/update-user-settings', methods=['POST'])
@login_required
def update_user_settings():
    settings = request.json['settings']
    current_user.settings.color_scheme = settings['color_scheme']
    current_user.settings.model_name = settings['model_name']
    current_user.settings.show_assistant_messages = settings['show_assistant_messages']
    current_user.settings.css_framework = settings['css_framework']
    db.session.commit()

    return jsonify({"success": True})