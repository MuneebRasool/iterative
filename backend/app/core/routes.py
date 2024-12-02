from app.models.constants import AssistantModel, CSSFramework
from app.core import bp
from app.models.project import Project
from app.openai.utils import messages_to_string
from app.tasks import stream_gpt_response
import tiktoken
from flask_login import current_user
from flask import jsonify, request

@bp.route('/api/generate', methods=['POST'])
def generate():
    project_id = request.json['project_id']

    if current_user.is_authenticated:
        project = Project.query.get(project_id)
        css_framework_str = project.css_framework.to_str()
        dark_mode_str = project.css_framework.dark_mode_str()
        model_name = current_user.settings.model_name.value
        model = current_user.settings.model_name
    
    if project is None:
        return jsonify({'error': 'Project not found'}), 404

    description = request.json['description']

    # Retrieve the latest ProjectState if exists
    if project.project_states:
        latest_project_state = project.project_states[-1]
        persisted_react_code = latest_project_state.react_code
        chat_messages_content = [{'role': msg.role, 'content': msg.content, 'created_at': msg.created_at} for msg in latest_project_state.chat_messages]
    else:
        latest_project_state = None
        persisted_react_code = ""
        chat_messages_content = []

    # Add the new chat message to the list
    chat_messages_content.append({"role": "user", "content": description, 'created_at': None})


    user_messages_content = [
        {key: value for key, value in chat_message_content.items() if key in ['role', 'content']}
        for chat_message_content in chat_messages_content if chat_message_content['role'] == 'user'
    ]

    # This is a nuclear fix to force gpt-4 (especially) to listen and return the full code every time. Too many optimizations built in to it which return truncated responses.
    # Remove this once the diffing system is in.
    for user_message_content in user_messages_content:
        user_message_content['content'] = user_message_content['content'] + "- Please return the full React code in your response."

    system_prompt = f"""
                        Based on the user's request, please provide the code for a Single Page Application, using a functional React component named 'App', following these specific guidelines:
                            - [x] To start, first identify and build the PRIMARY features essential to the described application.
                            - [x] Also include SECONDARY features that enhance the functionality and user experience.
                            - [x] Do NOT use import, export or require statements. Only return a function App() {{}}.
                            - [x] Enclose the code within triple backticks.
                            - [x] Use only inline standard {css_framework_str} components for styling, including colors, margins, padding, and spacing. Ensure components are responsive and aesthetically pleasing, and ensure all components are visible.
                            - [x] Don't make up any fictional {css_framework_str} component names. Check {css_framework_str} docs if you have to, and find the closest theme, color, or component to what the user asks for.
                            - [x] If the user asks for a dark theme, set {dark_mode_str} on the outermost component. Use neutral colors throughout, so they will respect this setting.
                            - [x] In case of conflicting user requests, follow the most recent request for styling or functionality, and ignore the previous conflicting requests. Interpret the provided user messages in chronological order.
                            - [x] When the user asks to simply re-position or move an element, ensure there are no unwanted side effects, such as changing the size or visual styling.
                            - [x] Use React hooks like this: 'React.useState('')'.
                            - [x] Build out the secondary features as well. Do NOT just give me a starting point.
                            - [x] No explanations needed, only code. You're an experienced UI engineer and know what to do without being told.
                            - [x] Provide reasonable placeholder data so UI components aren't empty or filled with generic placeholder text.
                            - [x] Ensure continuity with previous code snippets, building upon the existing structure and returning the full, updated React code each time.
                            - [x] The code you return will be executed unaltered, so it should be complete and working in every response. Therefore, NEVER shorten the code with substitutions like '{{/* ...existing code... */}}'. Always return the full code.
                            - [x] If the user asks for a webpage, expand the page to fill the full available height and width.

                        Here's my current React code, please add to this:
                        \\`\\`\\`javascript
                        {persisted_react_code}
                        \\`\\`\\`

                        Here's an example structure you can follow:

                        \\`\\`\\`javascript
                        function App() {{
                            ... = React.useState("Click me");

                        }}
                        \\`\\`\\`
                        """

    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        *user_messages_content
    ]

    max_tokens_allowed = model.max_tokens_allowed()

    encoding = tiktoken.encoding_for_model(model_name)
    messages_string = messages_to_string(messages)
    current_num_tokens = len(encoding.encode(messages_string))

    tokens_remaining = max_tokens_allowed - current_num_tokens

    # Enqueue Celery Job Here
    task = stream_gpt_response.delay(model_name, messages, tokens_remaining)

    return jsonify({"task_id": task.id})

