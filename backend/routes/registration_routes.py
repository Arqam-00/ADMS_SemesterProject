from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from rbac import require_roles
from datetime import datetime
import random

router = APIRouter(prefix="/api/v1/registration")

def generate_card_number():
    """Generate a unique ID card number"""
    import random
    number = "34101"
    for i in range(10):
        number += str(random.randint(0, 9))
    return number

@router.get("/applications/pending")
def get_pending_applications(user=Depends(require_roles(["registration_officer"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            a.application_id,
            a.citizen_cnic,
            a.application_type,
            a.status,
            a.submitted_at,
            p.first_name,
            p.last_name,
            p.gender,
            p.date_of_birth,
            pay.payment_status,
            pay.amount
        FROM Application a
        JOIN Citizen c ON c.cnic = a.citizen_cnic
        JOIN Person p ON p.cnic = c.cnic
        LEFT JOIN Payment pay ON pay.application_id = a.application_id
        WHERE a.status = 'approved' AND a.application_type = 'new'
        ORDER BY a.submitted_at ASC
    """)
    
    applications = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return applications

@router.get("/applications/all")
def get_all_applications(user=Depends(require_roles(["registration_officer"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            a.application_id,
            a.citizen_cnic,
            a.application_type,
            a.status,
            a.submitted_at,
            p.first_name,
            p.last_name,
            ic.card_number,
            ic.issue_date,
            ic.expiry_date
        FROM Application a
        JOIN Citizen c ON c.cnic = a.citizen_cnic
        JOIN Person p ON p.cnic = c.cnic
        LEFT JOIN ID_Card ic ON ic.application_id = a.application_id
        ORDER BY a.submitted_at DESC
        LIMIT 50
    """)
    
    applications = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return applications

@router.post("/applications/{application_id}/issue-card")
def issue_id_card(application_id: int, user=Depends(require_roles(["registration_officer"]))):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        conn.start_transaction()
        
        # Check if application exists and is approved
        cursor.execute("""
            SELECT a.status, a.citizen_cnic 
            FROM Application a 
            WHERE a.application_id = %s
        """, (application_id,))
        
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Application not found")
        
        if result[0] != 'approved':
            raise HTTPException(status_code=400, detail=f"Cannot issue card. Application status is '{result[0]}'")
        
        # Check if card already issued
        cursor.execute("SELECT id_card_id FROM ID_Card WHERE application_id = %s", (application_id,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="ID Card already issued for this application")
        
        # Generate unique card number
        card_number = generate_card_number()
        issue_date = datetime.now().date()
        expiry_date = datetime.now().replace(year=datetime.now().year + 10).date()
        
        # Create ID Card
        cursor.execute("""
            INSERT INTO ID_Card (card_number, application_id, issue_date, expiry_date, version_number, is_active)
            VALUES (%s, %s, %s, %s, 1, TRUE)
        """, (card_number, application_id, issue_date, expiry_date))
        
        conn.commit()
        
        return {
            "message": "ID Card issued successfully",
            "application_id": application_id,
            "card_number": card_number,
            "issue_date": issue_date,
            "expiry_date": expiry_date
        }
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/citizen/{cnic}")
def get_citizen_info(cnic: str, user=Depends(require_roles(["registration_officer"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            p.cnic,
            p.first_name,
            p.last_name,
            p.gender,
            p.date_of_birth,
            c.date_of_death,
            a.building_no,
            a.street_no,
            ci.city_name,
            pr.province_name,
            a.postal_code,
            a.landmark
        FROM Person p
        JOIN Citizen c ON c.cnic = p.cnic
        LEFT JOIN Citizen_Address ca ON ca.citizen_cnic = p.cnic AND ca.valid_to IS NULL
        LEFT JOIN Address a ON a.address_id = ca.address_id
        LEFT JOIN City ci ON ci.city_id = a.city_id
        LEFT JOIN Province pr ON pr.province_id = ci.province_id
        WHERE p.cnic = %s
    """, (cnic,))
    
    citizen = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen not found")
    
    # Format address properly
    address_parts = []
    if citizen.get('building_no'):
        address_parts.append(citizen['building_no'])
    if citizen.get('street_no'):
        address_parts.append(citizen['street_no'])
    if citizen.get('city_name'):
        address_parts.append(citizen['city_name'])
    if citizen.get('province_name'):
        address_parts.append(citizen['province_name'])
    if citizen.get('postal_code'):
        address_parts.append(citizen['postal_code'])
    
    citizen['formatted_address'] = ', '.join(address_parts) if address_parts else 'No address recorded'
    
    return citizen