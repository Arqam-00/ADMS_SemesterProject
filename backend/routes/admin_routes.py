from fastapi import APIRouter, Depends
from database import get_db
from rbac import require_roles

router = APIRouter(prefix="/api/v1/admin")

@router.get("/analytics/application-stats")
def get_application_stats(user=Depends(require_roles(["admin"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    # Total applications by status
    cursor.execute("""
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
            SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing
        FROM Application
    """)
    stats = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return stats

@router.get("/analytics/monthly-trend")
def get_monthly_trend(user=Depends(require_roles(["admin"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            DATE_FORMAT(submitted_at, '%b') as month,
            COUNT(*) as applications,
            SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
        FROM Application
        WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(submitted_at, '%b'), DATE_FORMAT(submitted_at, '%m')
        ORDER BY DATE_FORMAT(submitted_at, '%m')
    """)
    data = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return data

@router.get("/analytics/branch-stats")
def get_branch_stats(user=Depends(require_roles(["admin"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            b.branch_name as name,
            COUNT(a.application_id) as applications,
            COUNT(DISTINCT o.cnic) as officers
        FROM Branch b
        LEFT JOIN Officer o ON o.branch_id = b.branch_id
        LEFT JOIN Application a ON a.assigned_officer_cnic = o.cnic
        GROUP BY b.branch_id
        LIMIT 10
    """)
    data = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return data

@router.get("/analytics/application-fees")
def get_application_fees(user=Depends(require_roles(["admin"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            a.application_type,
            COUNT(*) as count,
            SUM(p.amount) as total_amount
        FROM Application a
        JOIN Payment p ON p.application_id = a.application_id
        GROUP BY a.application_type
    """)
    data = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return data

@router.get("/analytics/processing-time")
def get_processing_time(user=Depends(require_roles(["admin"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("""
        SELECT 
            application_type,
            AVG(TIMESTAMPDIFF(DAY, submitted_at, processed_at)) as avg_days
        FROM Application
        WHERE processed_at IS NOT NULL
        GROUP BY application_type
    """)
    data = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return data