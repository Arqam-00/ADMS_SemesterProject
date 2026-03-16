import bcrypt
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SECRET = os.getenv("JWT_SECRET")

if not SECRET:
    raise Exception("JWT_SECRET not set in .env")


def hash_password(password):

    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)

    return hashed.decode()


def verify_password(password, hashed):

    return bcrypt.checkpw(password.encode(), hashed.encode())


def create_token(user):

    payload = {
        "user_id": user["user_id"],
        "role": user["role"],
        "cnic": user["CNIC"],
        "exp": datetime.utcnow() + timedelta(minutes=120)
    }

    token = jwt.encode(payload, SECRET, algorithm="HS256")

    return token


def verify_token(token):

    return jwt.decode(token, SECRET, algorithms=["HS256"])