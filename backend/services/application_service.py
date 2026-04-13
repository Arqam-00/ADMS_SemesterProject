from database import get_db
from utils import generate_card_number

def create_application(data):
    conn = get_db()
    cursor = conn.cursor()

    try:
        conn.start_transaction()

        # Insert application
        cursor.execute(
        """
        INSERT INTO Application
        (citizen_cnic, application_type, status)
        VALUES(%s, %s, 'pending')
        """,
        (data.citizen_cnic, data.application_type)
        )

        application_id = cursor.lastrowid

        # Store correction details if provided
        if hasattr(data, 'correction_details') and data.correction_details:
            # You can add a correction_details table or store in application notes
            cursor.execute(
            """
            UPDATE Application 
            SET status = 'processing', processed_at = NULL 
            WHERE application_id = %s
            """,
            (application_id,)
            )
            # Note: For now, we'll just log it. In production, add a correction_details table

        # Insert payment
        cursor.execute(
        """
        INSERT INTO Payment
        (application_id, amount, payment_method, payment_status)
        VALUES(%s, 5000, 'cash', 'pending')
        """,
        (application_id,)
        )

        conn.commit()
        return application_id

    except Exception as e:
        conn.rollback()
        raise e