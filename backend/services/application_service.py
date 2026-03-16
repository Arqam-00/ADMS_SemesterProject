from database import get_db
from utils import generate_card_number

def create_application(data):

    conn = get_db()
    cursor = conn.cursor()

    try:

        conn.start_transaction()

        cursor.execute(
        """
        INSERT INTO Application
        (citizen_cnic,application_type)
        VALUES(%s,%s)
        """,
        (data.citizen_cnic,data.application_type)
        )

        application_id = cursor.lastrowid

        cursor.execute(
        """
        INSERT INTO Payment
        (application_id,amount,payment_method)
        VALUES(%s,5000,'cash')
        """,
        (application_id,)
        )

        conn.commit()

        return application_id

    except Exception as e:

        conn.rollback()
        raise e