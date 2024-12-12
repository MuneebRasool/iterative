from openai import OpenAI
import os
from app.openai.config import OpenAIConstants

class OpenAIClient:
  def __init__(self):
    self.client = OpenAI(
      api_key = os.environ.get('OPENAI_API_KEY'),
      organization = os.environ.get('OPENAI_ORG_ID'),
      )
  
  def chat_completion(self, messages, max_tokens, streaming):
    response = self.client.chat.completions.create(
        model=OpenAIConstants.MODEL_NAME,
        messages=messages,
        temperature=0.1,
        max_tokens=max_tokens,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        stream=streaming)
    
    if not streaming:
      return response
    collected_chunks = []
    collected_messages = []
    for chunk in response:
        collected_chunks.append(chunk)  # save the event response
        chunk_message = chunk.choices[0].delta  # extract the message
        collected_messages.append(chunk_message)  # save the message

    return ''.join(["" if m.content is None else m.content for m in collected_messages])
  