import bcrypt
from database import get_db

# Generate hash for password "password123"
password = "password123"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode(), salt)
hashed_str = hashed.decode()

print(f"Password: {password}")
print(f"Hash: {hashed_str}")
print("")

# Get database connection
conn = get_db()
cursor = conn.cursor()

# Clear existing users
cursor.execute("DELETE FROM Users")
print("Cleared existing users")

# Add test users
users = [
    ('ali.iqbal@example.com', hashed_str, 'citizen', '3520112345675'),
    ('admin@nadra.gov.pk', hashed_str, 'admin', None),
    ('bilal.rahman@nadra.gov.pk', hashed_str, 'verification_officer', '3520112345683'),
    ('ahmed.iqbal@nadra.gov.pk', hashed_str, 'registration_officer', '3520112345673')
]

for email, pwd_hash, role, cnic in users:
    try:
        cursor.execute(
            "INSERT INTO Users (email, password_hash, role, cnic) VALUES (%s, %s, %s, %s)",
            (email, pwd_hash, role, cnic)
        )
        print(f"Added user: {email} ({role})")
    except Exception as e:
        print(f"Failed to add {email}: {e}")

conn.commit()

# Verify
cursor.execute("SELECT user_id, email, role, cnic FROM Users")
print("\nUsers in database:")
for row in cursor.fetchall():
    print(f"   ID: {row[0]}, Email: {row[1]}, Role: {row[2]}, CNIC: {row[3]}")

cursor.close()
conn.close()