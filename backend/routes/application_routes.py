from fastapi import APIRouter, Depends
from schemas import ApplicationCreate, ApplicationCreateWithCorrection
from services.application_service import create_application
from rbac import require_roles

router = APIRouter(prefix="/api/v1/applications")

@router.post("/create")
def new_application(data: ApplicationCreateWithCorrection, user=Depends(require_roles(["citizen"]))):
    app_id = create_application(data)
    return {"application_id": app_id}

@router.post("/test-rollback")
def test_rollback():
    # This endpoint was for testing - keeping it simple
    return {"message": "Use /create endpoint for applications"}