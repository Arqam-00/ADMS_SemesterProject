from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from rbac import require_roles
from datetime import datetime

router = APIRouter(prefix="/api/v1/verification")

@router.get("/applications")
def get_assigned_applications(user=Depends(require_roles(["verification_officer"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    # Get applications assigned to this officer or pending for verification
    cursor.execute("""
        SELECT 
            a.application_id,
            a.citizen_cnic,
            a.application_type,
            a.status,
            a.submitted_at,
            p.first_name,
            p.last_name,
            pay.payment_status
        FROM Application a
        JOIN Citizen c ON c.cnic = a.citizen_cnic
        JOIN Person p ON p.cnic = c.cnic
        LEFT JOIN Payment pay ON pay.application_id = a.application_id
        WHERE a.status IN ('pending', 'processing')
        ORDER BY a.submitted_at ASC
    """)
    
    applications = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return applications

@router.put("/applications/{application_id}/verify")
def verify_application(application_id: int, action: str, remarks: str = None, user=Depends(require_roles(["verification_officer"]))):
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        conn.start_transaction()
        
        # Check if application exists
        cursor.execute("SELECT status FROM Application WHERE application_id = %s", (application_id,))
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Application not found")
        
        current_status = result[0]
        
        if action == "approve":
            new_status = "approved"
        elif action == "reject":
            new_status = "rejected"
        else:
            raise HTTPException(status_code=400, detail="Invalid action. Use 'approve' or 'reject'")
        
        # Update application status
        cursor.execute("""
            UPDATE Application 
            SET status = %s, processed_at = %s
            WHERE application_id = %s
        """, (new_status, datetime.now(), application_id))
        
        # Update payment status if approved
        if action == "approve":
            cursor.execute("""
                UPDATE Payment 
                SET payment_status = 'completed', paid_at = %s
                WHERE application_id = %s
            """, (datetime.now(), application_id))
        
        conn.commit()
        
        return {"message": f"Application {action}d successfully", "application_id": application_id, "new_status": new_status}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/applications/{application_id}/details")
def get_application_details(application_id: int, user=Depends(require_roles(["verification_officer"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            a.*,
            p.first_name,
            p.last_name,
            p.gender,
            p.date_of_birth,
            pay.amount,
            pay.payment_method,
            pay.payment_status
        FROM Application a
        JOIN Citizen c ON c.cnic = a.citizen_cnic
        JOIN Person p ON p.cnic = c.cnic
        LEFT JOIN Payment pay ON pay.application_id = a.application_id
        WHERE a.application_id = %s
    """, (application_id,))
    
    application = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application