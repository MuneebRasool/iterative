class SuggestionPrompt:
  pass
class GenerationPrompt:
  def __init__(self):
    self.user_message = None
    self.previous_react_code = None
    self.css_framework = None
    self.previous_chat_messages = None
  
  def set_user_message(self, message):
    self.user_message = message
  
  def set_previous_chat_messages(self, messages):
    self.previous_chat_messages = messages
  
  def set_css_framework(self, css_framework):
    self.css_framework = css_framework
  
  def set_react_code(self, react_code):
     self.previous_react_code = react_code