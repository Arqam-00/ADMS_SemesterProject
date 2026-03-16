from fastapi import APIRouter, Depends
from database import get_db
from rbac import require_roles

router = APIRouter(prefix="/api/v1/officers")

@router.get("/workload")

def workload(user=Depends(require_roles(["admin","verification_officer"]))):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM vw_officer_workload")

    return cursor.fetchall()