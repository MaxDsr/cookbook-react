import os
import requests
from functools import wraps
from flask import request, jsonify
from jose import jwt
from auth0.authentication import GetToken
from auth0.management import Auth0
from authlib.integrations.flask_client import OAuth
from authlib.integrations.flask_oauth2 import ResourceProtector
from validator import Auth0JWTBearerTokenValidator

# Auth0 Configuration
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = os.getenv('AUTH0_CLIENT_SECRET')
AUTH0_API_AUDIENCE = os.getenv('AUTH0_API_AUDIENCE')
AUTH0_ALGORITHMS = ['RS256']

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    AUTH0_DOMAIN,
    AUTH0_API_AUDIENCE
)
require_auth.register_token_validator(validator)

# Export the decorator
requires_auth = require_auth(None)  # None means no specific scope required
