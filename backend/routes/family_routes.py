from fastapi import APIRouter, Depends, HTTPException
from database import get_db
from rbac import require_roles

router = APIRouter(prefix="/api/v1/family")

@router.get("/tree/{cnic}")
def get_family_tree(cnic: str, user=Depends(require_roles(["citizen", "admin", "registration_officer", "verification_officer"]))):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    
    # ============================================================
    # LEVEL 1: Get the citizen (Self)
    # ============================================================
    cursor.execute("""
        SELECT cnic, first_name, last_name, gender, date_of_birth
        FROM Person 
        WHERE cnic = %s
    """, (cnic,))
    
    citizen = cursor.fetchone()
    if not citizen:
        raise HTTPException(status_code=404, detail="Citizen not found")
    
    # ============================================================
    # LEVEL 2: Get Parents (RAW SQL with JOIN)
    # ============================================================
    cursor.execute("""
        SELECT 
            p.father_cnic,
            pf.first_name AS father_first_name,
            pf.last_name AS father_last_name,
            pf.date_of_birth AS father_dob,
            p.mother_cnic,
            pm.first_name AS mother_first_name,
            pm.last_name AS mother_last_name,
            pm.date_of_birth AS mother_dob
        FROM Parents p
        LEFT JOIN Person pf ON pf.cnic = p.father_cnic
        LEFT JOIN Person pm ON pm.cnic = p.mother_cnic
        WHERE p.child_cnic = %s
    """, (cnic,))
    
    parents = cursor.fetchone()
    
    # ============================================================
    # LEVEL 3: Get Paternal Grandparents (Father's Parents)
    # ============================================================
    paternal_grandparents = None
    if parents and parents.get('father_cnic'):
        cursor.execute("""
            SELECT 
                pg.father_cnic AS grandfather_cnic,
                pgf.first_name AS grandfather_first_name,
                pgf.last_name AS grandfather_last_name,
                pg.mother_cnic AS grandmother_cnic,
                pgm.first_name AS grandmother_first_name,
                pgm.last_name AS grandmother_last_name
            FROM Parents pg
            LEFT JOIN Person pgf ON pgf.cnic = pg.father_cnic
            LEFT JOIN Person pgm ON pgm.cnic = pg.mother_cnic
            WHERE pg.child_cnic = %s
        """, (parents['father_cnic'],))
        
        paternal_grandparents = cursor.fetchone()
    
    # ============================================================
    # LEVEL 3: Get Maternal Grandparents (Mother's Parents)
    # ============================================================
    maternal_grandparents = None
    if parents and parents.get('mother_cnic'):
        cursor.execute("""
            SELECT 
                pg.father_cnic AS grandfather_cnic,
                pgf.first_name AS grandfather_first_name,
                pgf.last_name AS grandfather_last_name,
                pg.mother_cnic AS grandmother_cnic,
                pgm.first_name AS grandmother_first_name,
                pgm.last_name AS grandmother_last_name
            FROM Parents pg
            LEFT JOIN Person pgf ON pgf.cnic = pg.father_cnic
            LEFT JOIN Person pgm ON pgm.cnic = pg.mother_cnic
            WHERE pg.child_cnic = %s
        """, (parents['mother_cnic'],))
        
        maternal_grandparents = cursor.fetchone()
    
    # ============================================================
    # Get Siblings (Brothers and Sisters)
    # Same parents, different child
    # ============================================================
    siblings = []
    if parents and (parents.get('father_cnic') or parents.get('mother_cnic')):
        # Build dynamic WHERE clause
        conditions = []
        params = []
        
        if parents.get('father_cnic'):
            conditions.append("father_cnic = %s")
            params.append(parents['father_cnic'])
        if parents.get('mother_cnic'):
            conditions.append("mother_cnic = %s")
            params.append(parents['mother_cnic'])
        
        if conditions:
            query = f"""
                SELECT DISTINCT
                    p.child_cnic AS cnic,
                    pe.first_name,
                    pe.last_name,
                    pe.gender,
                    pe.date_of_birth
                FROM Parents p
                JOIN Person pe ON pe.cnic = p.child_cnic
                WHERE ({' OR '.join(conditions)})
                AND p.child_cnic != %s
            """
            params.append(cnic)
            
            cursor.execute(query, tuple(params))
            siblings = cursor.fetchall()
    
    # ============================================================
    # Get Spouse (if married)
    # ============================================================
    spouse = None
    cursor.execute("""
        SELECT 
            CASE 
                WHEN husband_cnic = %s THEN wife_cnic
                ELSE husband_cnic
            END AS spouse_cnic,
            p.first_name,
            p.last_name,
            m.marriage_date,
            m.divorce_date
        FROM Marriage m
        JOIN Person p ON p.cnic = (
            CASE 
                WHEN m.husband_cnic = %s THEN m.wife_cnic
                ELSE m.husband_cnic
            END
        )
        WHERE (m.husband_cnic = %s OR m.wife_cnic = %s)
        AND (m.divorce_date IS NULL OR m.divorce_date > CURDATE())
    """, (cnic, cnic, cnic, cnic))
    
    spouse = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    # Build response
    return {
        "self": citizen,
        "parents": {
            "father": {
                "cnic": parents.get('father_cnic') if parents else None,
                "first_name": parents.get('father_first_name') if parents else None,
                "last_name": parents.get('father_last_name') if parents else None,
                "date_of_birth": parents.get('father_dob') if parents else None
            } if parents and parents.get('father_cnic') else None,
            "mother": {
                "cnic": parents.get('mother_cnic') if parents else None,
                "first_name": parents.get('mother_first_name') if parents else None,
                "last_name": parents.get('mother_last_name') if parents else None,
                "date_of_birth": parents.get('mother_dob') if parents else None
            } if parents and parents.get('mother_cnic') else None
        },
        "grandparents": {
            "paternal": {
                "grandfather": {
                    "cnic": paternal_grandparents.get('grandfather_cnic') if paternal_grandparents else None,
                    "first_name": paternal_grandparents.get('grandfather_first_name') if paternal_grandparents else None,
                    "last_name": paternal_grandparents.get('grandfather_last_name') if paternal_grandparents else None
                } if paternal_grandparents and paternal_grandparents.get('grandfather_cnic') else None,
                "grandmother": {
                    "cnic": paternal_grandparents.get('grandmother_cnic') if paternal_grandparents else None,
                    "first_name": paternal_grandparents.get('grandmother_first_name') if paternal_grandparents else None,
                    "last_name": paternal_grandparents.get('grandmother_last_name') if paternal_grandparents else None
                } if paternal_grandparents and paternal_grandparents.get('grandmother_cnic') else None
            } if paternal_grandparents else None,
            "maternal": {
                "grandfather": {
                    "cnic": maternal_grandparents.get('grandfather_cnic') if maternal_grandparents else None,
                    "first_name": maternal_grandparents.get('grandfather_first_name') if maternal_grandparents else None,
                    "last_name": maternal_grandparents.get('grandfather_last_name') if maternal_grandparents else None
                } if maternal_grandparents and maternal_grandparents.get('grandfather_cnic') else None,
                "grandmother": {
                    "cnic": maternal_grandparents.get('grandmother_cnic') if maternal_grandparents else None,
                    "first_name": maternal_grandparents.get('grandmother_first_name') if maternal_grandparents else None,
                    "last_name": maternal_grandparents.get('grandmother_last_name') if maternal_grandparents else None
                } if maternal_grandparents and maternal_grandparents.get('grandmother_cnic') else None
            } if maternal_grandparents else None
        },
        "siblings": [
            {
                "cnic": sib['cnic'],
                "first_name": sib['first_name'],
                "last_name": sib['last_name'],
                "gender": sib['gender'],
                "relationship": "Brother" if sib['gender'] == 'male' else "Sister",
                "date_of_birth": sib['date_of_birth']
            }
            for sib in siblings
        ],
        "spouse": {
            "cnic": spouse['spouse_cnic'] if spouse else None,
            "first_name": spouse['first_name'] if spouse else None,
            "last_name": spouse['last_name'] if spouse else None,
            "marriage_date": spouse['marriage_date'] if spouse else None,
            "divorce_date": spouse['divorce_date'] if spouse else None
        } if spouse else None
    }