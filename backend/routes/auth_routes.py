from fastapi import APIRouter, HTTPException
from database import get_db
from auth import verify_password, create_token, hash_password
from schemas import LoginRequest
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import random

router = APIRouter(prefix="/api/v1/auth")

class RegisterRequest(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: str
    cnic: Optional[str] = None

def generate_unique_cnic(cursor):
    """Generate a unique CNIC that doesn't exist in database"""
    area_code = "35201"
    
    while True:
        random_digits = ''.join(str(random.randint(0, 9)) for _ in range(8))
        new_cnic = area_code + random_digits
        
        cursor.execute("SELECT cnic FROM Person WHERE cnic = %s", (new_cnic,))
        if not cursor.fetchone():
            return new_cnic

def verify_person_matches(cursor, cnic, first_name, last_name, gender, date_of_birth):
    """Verify that the provided personal information matches the existing person"""
    cursor.execute("""
        SELECT first_name, last_name, gender, date_of_birth 
        FROM Person 
        WHERE cnic = %s
    """, (cnic,))
    
    person = cursor.fetchone()
    
    if not person:
        return False, "Person not found"
    
    # Check each field
    if person[0].lower() != first_name.lower():
        return False, f"First name mismatch. Expected: {person[0]}"
    if person[1].lower() != last_name.lower():
        return False, f"Last name mismatch. Expected: {person[1]}"
    if person[2].lower() != gender.lower():
        return False, f"Gender mismatch. Expected: {person[2]}"
    if str(person[3]) != date_of_birth:
        return False, f"Date of birth mismatch. Expected: {person[3]}"
    
    return True, "Match found"

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
        
        # 2. Handle CNIC
        final_cnic = data.cnic
        
        if final_cnic:
            # User provided CNIC - Check if Person exists
            cursor.execute("SELECT cnic FROM Person WHERE cnic = %s", (final_cnic,))
            person_exists = cursor.fetchone()
            
            if person_exists:
                # SCENARIO 2: Person exists - VERIFY information matches
                is_match, error_msg = verify_person_matches(
                    cursor, final_cnic, 
                    data.first_name, data.last_name, 
                    data.gender, data.date_of_birth
                )
                
                if not is_match:
                    raise HTTPException(status_code=400, detail=f"Information mismatch: {error_msg}")
                
                # Check if User account already exists for this CNIC
                cursor.execute("SELECT user_id FROM Users WHERE cnic = %s", (final_cnic,))
                if cursor.fetchone():
                    raise HTTPException(status_code=400, detail="User account already exists for this CNIC. Please login.")
                
                # Create User account only
                hashed_password = hash_password(data.password)
                cursor.execute("""
                    INSERT INTO Users (email, password_hash, role, cnic)
                    VALUES (%s, %s, 'citizen', %s)
                """, (data.email, hashed_password, final_cnic))
                
                conn.commit()
                return {
                    "message": "Account created successfully! Please login.", 
                    "cnic": final_cnic, 
                    "auto_assigned": False,
                    "existing_person": True
                }
            else:
                # CNIC provided but Person doesn't exist - Create new Person + Citizen + User
                hashed_password = hash_password(data.password)
                cursor.execute("""
                    INSERT INTO Person (cnic, first_name, last_name, gender, date_of_birth)
                    VALUES (%s, %s, %s, %s, %s)
                """, (final_cnic, data.first_name, data.last_name, data.gender, data.date_of_birth))
                
                cursor.execute("""
                    INSERT INTO Citizen (cnic, date_of_death)
                    VALUES (%s, NULL)
                """, (final_cnic,))
                
                cursor.execute("""
                    INSERT INTO Users (email, password_hash, role, cnic)
                    VALUES (%s, %s, 'citizen', %s)
                """, (data.email, hashed_password, final_cnic))
                
                conn.commit()
                return {
                    "message": "Citizen registered successfully! Please login.", 
                    "cnic": final_cnic, 
                    "auto_assigned": False,
                    "existing_person": False
                }
        
        else:
            # No CNIC provided - Auto-generate new CNIC for new person
            final_cnic = generate_unique_cnic(cursor)
            
            hashed_password = hash_password(data.password)
            
            cursor.execute("""
                INSERT INTO Person (cnic, first_name, last_name, gender, date_of_birth)
                VALUES (%s, %s, %s, %s, %s)
            """, (final_cnic, data.first_name, data.last_name, data.gender, data.date_of_birth))
            
            cursor.execute("""
                INSERT INTO Citizen (cnic, date_of_death)
                VALUES (%s, NULL)
            """, (final_cnic,))
            
            cursor.execute("""
                INSERT INTO Users (email, password_hash, role, cnic)
                VALUES (%s, %s, 'citizen', %s)
            """, (data.email, hashed_password, final_cnic))
            
            conn.commit()
            return {
                "message": f"Citizen registered successfully! Your auto-assigned CNIC is {final_cnic}", 
                "cnic": final_cnic, 
                "auto_assigned": True,
                "existing_person": False
            }
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()