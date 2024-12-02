import re
from app.auth_middleware import token_required
from app.models.chat_message import ChatMessage
from app.models.constants import AssistantModel, CSSFramework
from app.models.project import Project
from app.models.project_state import ProjectState
from flask import request, jsonify
from app.projects import bp
from app.extensions import db

@bp.route('/api/projects', methods=['POST'])
@token_required
def create_project(current_user):
    # Retrieve project information from the request
    project_id = request.json.get('project_id')
    project_name = request.json.get('project_name')
    if project_id:
      project = Project.query.get(project_id)
      if project:
        return jsonify({'status': 'success', 'project': project.to_dict()})
    project = Project(name=project_name or "My First Project")
    # Create a new Project instance

    if current_user:
        # Associate the current user with the project
        project.users.append(current_user)
        # Add and commit the new project to the database
        
    db.session.add(project)
    db.session.commit()

    # Return a success response
    return jsonify({'status': 'success', 'project': project.to_dict()})

@bp.route('/api/projects', methods=['DELETE'])
@token_required
def delete_project(current_user):
    # Retrieve the project_id from the request body
    project_id = request.json['project_id']
    
    if current_user:
        # Retrieve the project by its ID
        project = Project.query.get(project_id)
        
    # Check if the project exists
    if project is None:
        return jsonify({'status': 'error', 'message': 'Project not found'}), 404
  
    
    if current_user:
        # Check if the current user is associated with the project
        if current_user not in project.users:
            return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403
        
        # Delete the project from the database
        db.session.delete(project)
        db.session.commit()

    # Return a success response
    return jsonify({'status': 'success', 'message': 'Project deleted successfully'})

@bp.route('/api/projects', methods=['PATCH'])
@token_required
def update_project(current_user):
    # Retrieve the project_id from the request body
    project_id = request.json['project_id']
    project_name = request.json['project_name'] 
    project = Project.query.get(project_id)
    
    if current_user is None:
      return jsonify({'status': 'error', 'message': 'Not Authorized'}), 401
    if project is None:
      return jsonify({'status': 'error', 'message': 'Project not found'}), 404
  
    project.user_id = current_user.id
    project.name = project_name
    db.session.add(project)
    db.session.commit()

    # Return a success response
    return jsonify({'status': 'success', 'message': 'Project Updated successfully'})

@bp.route('/api/project/<project_id>', methods=['GET'])
@token_required
def get_project(current_user, project_id):
    # Retrieve the project_id and project_name from the request body
    project_id = request.args.get('project_id')
    
    user_projects = current_user.projects  # Access the projects relationship directly
    retrieved_project = None

    for project in user_projects:
        if project.id == project_id:
            retrieved_project = project
            break

    if retrieved_project is None:
        return jsonify({'status': 'error', 'message': 'Project not found'}), 404

    project_data = retrieved_project.to_dict()
    return jsonify({'project': project_data})

@bp.post('/api/projects/project_state')
def get_project_states():
    # Retrieve the project_id and project_name from the request body
    project_id = request.json['project_id']
    project = Project.query.get(project_id)
    
    if project is None:
        return jsonify({'project_states': []})
    
    return jsonify({'project_states': [s.to_dict() for s in project.project_states]})

@bp.delete('/api/projects/project_state')
@token_required
def delete_project_states(current_user):
    # Retrieve the project_id and project_name from the request body
    data = request.json
    project_state_id = data.get("project_state_id")
    project_state = ProjectState.query.get(project_state_id)
    
    if project_state is None:
        return jsonify({'success': False})
   
    db.session.delete(project_state)
    db.session.commit()
    return jsonify({'success': True})

@bp.route('/api/projects', methods=['GET'])
@token_required
def get_projects(current_user):
    user_projects = current_user.projects  # Access the projects relationship directly
    projects_data = [project.to_dict() for project in user_projects]
    return jsonify({'projects': projects_data})

@bp.route('/api/recommendations', methods=['GET'])
@token_required
def get_recommendations(current_user):
    project_id = request.args.get("project_id")
    if not project_id:
      return jsonify({'recommendations': []})
    project = Project.query.get(int(project_id))
    
    if not project:
      return jsonify({'recommendations': []})
      
    recommendation_data = [rec.to_dict() for rec in project.recommendations]
    return jsonify({'recommendations': recommendation_data})

@bp.route('/api/projects/reset', methods=['POST'])
def reset():
    project_id = request.json['project_id']
    project = Project.query.get(project_id)
    
    for state in project.project_states:
        for chat_message in state.chat_messages:
            db.session.delete(chat_message)
        db.session.delete(state)
      
    for recommendation in project.recommendations:
      db.session.delete(recommendation)
    
    db.session.commit()
    
    return jsonify({'status': 'State has been reset'})

def extract_code(response_text):
    # # Use a regular expression to find code blocks
    js_pattern = r'```javascript.*?\n(.*?)```'
    css_pattern = r'```css.*?\n(.*?)```'
    
    js_code_blocks = re.findall(js_pattern, response_text, re.DOTALL)
    css_code_blocks = re.findall(css_pattern, response_text, re.DOTALL)
    
    # # Remove leading/trailing whitespace from each block
    react_code = js_code_blocks[0].strip() if js_code_blocks else ""
    css_code = css_code_blocks[0].strip() if css_code_blocks else ""
 
    return react_code, css_code