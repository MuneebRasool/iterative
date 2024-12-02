import requests
class PromptFetcher:
  def __init__(self):
    self.api_key = "$2a$10$No8dXG4S5NVTsfmN3otgnueEgWvlAhdeDDWFaIubT5EwXr9WVL0Z2"
  def fetch_recommendations(self):
    return requests.get('https://api.jsonbin.io/v3/b/6597b87d1f5677401f17c0af', headers= { "X-Master-Key" :self.api_key }).json()["record"]

  def fetch_design_framework(self):
    return requests.get('https://api.jsonbin.io/v3/b/65b5fccddc746540189cb2af', headers= { "X-Master-Key" :self.api_key }).json()["record"]