from flask import jsonify, request
from app.auth_middleware import token_required
from app.main import bp
from app.models.deployment import Deployment
from app.extensions import db

@bp.get("/api/deployments")
@token_required
def deployments_get(current_user):
  if current_user is None:
    return jsonify({"error": "Not Authorized"}), 401
  deployments = current_user.deployments
  return jsonify({"deployments": [d.serialize() for d in deployments]})

@bp.post("/api/deployments")
@token_required
def deployments_post(current_user):
  data = request.json
  project_state_id = data.get("project_state_id")
  deployment_name = data.get("deployment_name")
  passcode = data.get("passcode")
  deployment = Deployment(project_state_id=project_state_id, user_id=current_user.id, password=passcode, name=deployment_name)
  db.session.add(deployment)
  db.session.commit()
  return jsonify({"deployment": deployment.serialize()})

@bp.get("/api/deployments/<deployment_id>")
@token_required
def deployment_get(current_user, deployment_id: int, passcode = None):
  # If current user is viewing it - we don't need to validate the passcode.
  deployment = Deployment.query.get(deployment_id)
  if current_user and deployment.user_id == current_user.id:
    return jsonify({"deployment": deployment.show()})
  # if unauthenticated validate the passcode.
  passcode = request.args.get("passcode")
  if passcode == deployment.password:
    return jsonify({"deployment": deployment.show()})
  else:
    response = jsonify({'error': "incorrect passcode"})
    return response, 401

@bp.delete("/api/deployments")
@token_required
def deployment_delete(current_user):
  data = request.json
  deployment_id = data.get("deployment_id")
  deployment = Deployment.query.get(deployment_id)
  
  if current_user is None:
    return jsonify({"error": "Unauthorized"}), 401
  if current_user.id == deployment.user_id:
    db.session.delete(deployment)
    db.session.commit()
    return jsonify({"success": True})
  else:
    return jsonify({"error": "Unauthorized to delete deployment"}), 401
  
