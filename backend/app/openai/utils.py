import re


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

def messages_to_string(messages):
    result = ""
    for message in messages:
        for key, value in message.items():
            result += f"{key}: {value}\n"
    return result