from django.core.exceptions import ValidationError
import re

def validate_choices(value):
    pattern = re.compile(r"^([a-zA-Z]+)(,[a-zA-Z]+)*")
    if pattern.match(value) == None:
        raise ValidationError("Enter only alphabets separated by commas.")
    else:
        return value