import requests
class PromptFetcher:
  def __init__(self):
    self.api_key = "OpenAI-API-KEY"
  def fetch_recommendations(self):
    return requests.get('https://api.jsonbin.io/v3/b/6597b87d1f5677401f17c0af', headers= { "X-Master-Key" :self.api_key }).json()["record"]

  def fetch_design_framework(self):
    return requests.get('https://api.jsonbin.io/v3/b/65b5fccddc746540189cb2af', headers= { "X-Master-Key" :self.api_key }).json()["record"]
