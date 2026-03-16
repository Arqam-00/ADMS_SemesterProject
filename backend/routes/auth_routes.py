from fastapi import APIRouter, HTTPException
from database import get_db
from auth import verify_password, create_token
from schemas import LoginRequest

router = APIRouter(prefix="/api/v1/auth")

@router.post("/login")
def login(data: LoginRequest):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT user_id, email, password_hash, role, cnic
        FROM Users
        WHERE email=%s
        """,
        (data.email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(user)

    return {
        "token": token,
        "role": user["role"],
        "cnic": user["cnic"]
    }