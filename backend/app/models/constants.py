from enum import Enum


class AssistantModel(Enum):
    GPT_3_5_TURBO = "gpt-3.5-turbo"
    GPT_3_5_TURBO_16K = "gpt-3.5-turbo-16k"
    GPT_4 = "gpt-4"

    def max_tokens_allowed(self):
        if self == AssistantModel.GPT_3_5_TURBO:
            return 4097
        elif self == AssistantModel.GPT_3_5_TURBO_16K:
            return 16384
        elif self == AssistantModel.GPT_4:
            return 8192

class ColorScheme(Enum):
    LIGHT = "light"
    DARK = "dark"
    SYSTEM = "system" # just follow the system settings

class CSSFramework(Enum):
    BOOTSTRAP = "bootstrap"
    DAISYUI = "daisyui"

    def to_str(self):
        if self == CSSFramework.BOOTSTRAP:
            return "Bootstrap 5"
        elif self == CSSFramework.DAISYUI:
            return "daisyUI"
        
    def dark_mode_str(self):
        if self == CSSFramework.BOOTSTRAP:
            return "data-bs-theme='dark'"
        elif self == CSSFramework.DAISYUI:
            return "data-theme='dark'"