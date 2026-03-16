from fastapi import APIRouter, Depends
from schemas import ApplicationCreate
from services.application_service import create_application
from rbac import require_roles
from database import get_db

router = APIRouter(prefix="/api/v1/applications")

@router.post("/create")

def new_application(data:ApplicationCreate,user=Depends(require_roles(["citizen"]))):

    app_id = create_application(data)

    return {
        "application_id":app_id
    }
    
@router.post("/test-rollback")
def test_rollback(conn = Depends(get_db)):

    cursor = conn.cursor()

    try:
        conn.start_transaction()

        cursor.execute(
            "UPDATE Application SET status='approved' WHERE application_id=1"
        )

        cursor.execute(
            "INSERT INTO Wrong_Table(application_id) VALUES (1)"
        )

        conn.commit()

        return {"message": "Transaction success"}

    except Exception:

        conn.rollback()

        return {"message": "Transaction failed. Rollback executed"}