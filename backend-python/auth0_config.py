import os
from functools import wraps
from flask import request, jsonify
from jose import jwt
from auth0.v3.authentication import GetToken
from auth0.v3.management import Auth0

# Auth0 Configuration
AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')
AUTH0_CLIENT_SECRET = os.getenv('AUTH0_CLIENT_SECRET')
AUTH0_API_AUDIENCE = os.getenv('AUTH0_API_AUDIENCE')
AUTH0_ALGORITHMS = ['RS256']

# Auth0 Management API
auth0 = Auth0(
    domain=AUTH0_DOMAIN,
    client_id=AUTH0_CLIENT_ID,
    client_secret=AUTH0_CLIENT_SECRET
)

def get_token_auth_header():
    """Obtains the access token from the Authorization Header"""
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise Exception("Authorization header is expected")

    parts = auth.split()
    if parts[0].lower() != "bearer":
        raise Exception("Authorization header must start with Bearer")
    elif len(parts) == 1:
        raise Exception("Token not found")
    elif len(parts) > 2:
        raise Exception("Authorization header must be Bearer token")

    token = parts[1]
    return token

def requires_auth(f):
    """Determines if the access token is valid"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            token = get_token_auth_header()
            jsonurl = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
            jwks = requests.get(jsonurl).json()
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = {}
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
            if rsa_key:
                try:
                    payload = jwt.decode(
                        token,
                        rsa_key,
                        algorithms=AUTH0_ALGORITHMS,
                        audience=AUTH0_API_AUDIENCE,
                        issuer=f"https://{AUTH0_DOMAIN}/"
                    )
                except jwt.ExpiredSignatureError:
                    raise Exception("Token is expired")
                except jwt.JWTClaimsError:
                    raise Exception("Incorrect claims, please check the audience and issuer")
                except Exception:
                    raise Exception("Unable to parse authentication token")
                
                return f(*args, **kwargs)
            raise Exception("Unable to find appropriate key")
        except Exception as e:
            return jsonify({"error": str(e)}), 401
    return decorated 