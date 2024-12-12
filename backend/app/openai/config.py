import os

class OpenAIConstants:
  #TODO Bump default to gpt-4 of some variety when tiktoken is updated
  MODEL_NAME = os.environ.get('OPENAI_MODEL', 'gpt-3.5-turbo')
  TOKEN_LIMIT = 4096
  RECOMMENDATION_TOKEN_LIMIT = 4096