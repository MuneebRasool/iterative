
from flask_socketio import send, emit
from app.openai.prompt_fetcher import PromptFetcher
from app import socketio
from app.models.chat_message import ChatMessage
from app.models.project import Project
from app.models.project_state import ProjectState
from app.extensions import db
from app.models.recommendation import Recommendation
from app.openai.client import OpenAIClient
from app.openai.config import OpenAIConstants
from app.openai.utils import extract_code, messages_to_string
import tiktoken  

def generate_recommendation_prompt(user_msg, project):  
  initial_prompts = PromptFetcher().fetch_recommendations()
  is_initial_recommendation = (len(project.recommendations) == 0)
  if is_initial_recommendation:
    generate_initial_recommendation(user_msg, project, initial_prompts)
  else:
    generate_subsequent_recommendation(user_msg, project, initial_prompts)


def generate_initial_recommendation(user_msg, project, initial_prompts):
  print("Generating Initial Recommendation")
  user_prompt_primer = f"""
    {user_msg}
  """
  
  user_prompt = {
    "role": "user",
    "content": user_prompt_primer
  }
  
  
  recommendation_input = initial_prompts
  
  recommendation_input.append(user_prompt)
  
  tokens_remaining = OpenAIConstants.RECOMMENDATION_TOKEN_LIMIT
  
  response = OpenAIClient().chat_completion(recommendation_input, tokens_remaining, True)
  content = response
  recommendation = Recommendation(name="Initial Recommendation", project_id=project.id, description=content)
  db.session.add(recommendation)
  db.session.commit()
  emit("server_recommendation", content)
  
def generate_subsequent_recommendation(user_msg, project, initial_prompts):
  print("Generating Subsequent Recommendation")
  previous_recommendations = [{"role": "user", "content": rec.description} for rec in project.recommendations]
  user_prompt = {
    "role": "user",
    "content": user_msg
  }
  recommendation_input = initial_prompts
  
  for rec in previous_recommendations:
    recommendation_input.append(rec)
  recommendation_input.append(user_prompt)
  
  tokens_remaining = OpenAIConstants.RECOMMENDATION_TOKEN_LIMIT
  
  response = OpenAIClient().chat_completion(recommendation_input, tokens_remaining, True)
  content = response
  recommendation = Recommendation(name=f"Subsequent Recommendation #{len(previous_recommendations) + 1}", project_id=project.id, description=content)
  db.session.add(recommendation)
  db.session.commit()
  emit("server_recommendation", content)

@socketio.on("user_message")
def on_user_message(payload):
  user_msg = payload['description']
  project_id = payload['project_id']
  css_framework_str = "TailwindCSS"
  project = Project.query.get(project_id)
  
  if project.project_states:
        latest_project_state = project.project_states[-1]
        persisted_react_code = latest_project_state.react_code
        chat_messages_content = [{'role': msg.role, 'content': msg.content, 'created_at': msg.created_at} for msg in latest_project_state.chat_messages]
  else:
      latest_project_state = None
      persisted_react_code = ""
      chat_messages_content = []
  
  chat_messages_content.append({"role": "user", "content": user_msg, 'created_at': None})
  
  user_messages_content = [
        {key: value for key, value in chat_message_content.items() if key in ['role', 'content']}
        for chat_message_content in chat_messages_content if chat_message_content['role'] == 'user'
    ]

  for user_message_content in user_messages_content:
    user_message_content['content'] = user_message_content['content'] + "- Please return the full React code in your response."

  design_framework = PromptFetcher().fetch_design_framework()
  system_prompt = f"""
                      Based on the user's request, please provide the code for a Single Page Application, using a functional React component named 'App', following these specific guidelines:
                          - [x] To start, first identify and build the PRIMARY features essential to the described application.
                          - [x] Also include SECONDARY features that enhance the functionality and user experience.
                          - [x] Enclose the code within triple backticks.
                          - [x] For the div with the container - add the CSS class iterativeBody
                          - [x] Use only design themes from #{css_framework_str}
                          - [x] Only import components from react-google-charts or react-icons/fa
                          - [x] If you need icons - use icons from react-icons/fa
                          - [x] Use only inline standard {css_framework_str} components for styling, including colors, margins, padding, and spacing. Ensure components are responsive and aesthetically pleasing, and ensure all components are visible.
                          - [x] Don't make up any fictional {css_framework_str} component names. Check {css_framework_str} docs if you have to, and find the closest theme, color, or component to what the user asks for.
                          - [x] In case of conflicting user requests, follow the most recent request for styling or functionality, and ignore the previous conflicting requests. Interpret the provided user messages in chronological order.
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
      *user_messages_content,
      *design_framework
  ]


  tokens_remaining = calculate_tokens_remaining(messages)
  
  response = OpenAIClient().chat_completion(messages, 4096, True)
  react_code = extract_code_and_update_project(user_msg, response, project_id)
  emit("server_code", react_code)
  generate_recommendation_prompt(user_msg, project)


def calculate_tokens_remaining(messages):
  encoding = tiktoken.encoding_for_model(OpenAIConstants.MODEL_NAME)
  messages_string = messages_to_string(messages)
  current_num_tokens = len(encoding.encode(messages_string))
  return OpenAIConstants.TOKEN_LIMIT - current_num_tokens

def extract_code_and_update_project(user_message, full_reply_comment, project_id):
  react_code, css_code = extract_code(full_reply_comment)
  new_project_state = ProjectState(react_code=react_code, css_code=css_code, project_id=project_id)
  db.session.add(new_project_state)
  db.session.flush()
  chat_message = ChatMessage(content=user_message, role="user", project_state_id=new_project_state.id)
  db.session.add(chat_message)
  db.session.commit()
  return react_code
  

