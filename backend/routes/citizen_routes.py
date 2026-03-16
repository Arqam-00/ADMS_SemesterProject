from fastapi import APIRouter, Depends
from database import get_db
from rbac import require_roles

router = APIRouter(prefix="/api/v1/citizens")

@router.get("/profile/{cnic}")

def citizen_profile(cnic:str,user=Depends(require_roles(["citizen","admin"]))):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM vw_citizen_profile WHERE cnic=%s",
        (cnic,)
    )

    return cursor.fetchone()


@router.get("/parents/{cnic}")

def parents(cnic:str,user=Depends(require_roles(["citizen","admin"]))):

    conn = get_db()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
    """
    SELECT father_cnic,mother_cnic
    FROM Parents
    WHERE child_cnic=%s
    """,
    (cnic,)
    )

    return cursor.fetchone()