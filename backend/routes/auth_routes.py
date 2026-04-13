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
from pydantic import BaseModel
from datetime import datetime

class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: str
    cnic: str

@router.post("/register")
def register(data: RegisterRequest):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        conn.start_transaction()
        
        # 1. Check if email already exists
        cursor.execute("SELECT user_id FROM Users WHERE email = %s", (data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # 2. Check if CNIC already exists
        cursor.execute("SELECT cnic FROM Person WHERE cnic = %s", (data.cnic,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="CNIC already registered")
        
        # 3. Hash password
        hashed_password = hash_password(data.password)
        
        # 4. Insert into Person table
        cursor.execute("""
            INSERT INTO Person (cnic, first_name, last_name, gender, date_of_birth)
            VALUES (%s, %s, %s, %s, %s)
        """, (data.cnic, data.first_name, data.last_name, data.gender, data.date_of_birth))
        
        # 5. Insert into Citizen table
        cursor.execute("""
            INSERT INTO Citizen (cnic, date_of_death)
            VALUES (%s, NULL)
        """, (data.cnic,))
        
        # 6. Insert into Users table
        cursor.execute("""
            INSERT INTO Users (email, password_hash, role, cnic)
            VALUES (%s, %s, 'citizen', %s)
        """, (data.email, hashed_password, data.cnic))
        
        conn.commit()
        
        return {"message": "Registration successful! Please login.", "cnic": data.cnic}
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()