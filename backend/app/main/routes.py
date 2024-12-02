from app.main import bp
import os
from app.models.user import User
from flask import send_from_directory, jsonify, current_app
from celery.result import AsyncResult

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def index(path):
  if path != "" and os.path.exists(current_app.static_folder + '/' + path):
        return send_from_directory(current_app.static_folder, path)
  else:
      return send_from_directory(current_app.static_folder, 'index.html')
  
@bp.route('/api/health', methods=['GET'])
def health_check():
    return jsonify(status="OK"), 200
  
@bp.get("/api/tasks/<id>")
def task_result(id: str) -> dict[str, object]:
    result = AsyncResult(id)
    return {
        "ready": result.ready(),
        "successful": result.successful(),
        "value": result.result if result.ready() else None,
    }

