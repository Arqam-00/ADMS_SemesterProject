# ADMS_SemesterProject
It is a project made on management of Citizen IDs
## The backend uses the following technologies:

- Python
- FastAPI(web framework)
- MySQL(database)
- JWT for authentication
- bcrypt for password hashing
- Raw SQL queries for database operations

## Backend Features

The backend provides the following capabilities:

- User authentication using JWT tokens
- Role-based access control (Citizen, Registration Officer, Verification Officer, Admin)
- Citizen identity data management
- Identity card application submission
- Application verification and approval
- Payment tracking
- Transaction management using SQL BEGIN, COMMIT, and ROLLBACK
- Secure password storage using bcrypt
- API documentation using Swagger
- Family Tree

### Before running the backend, make sure the following software is installed:

- Python 3.9 or later
- MySQL Server
- pip

# Running the Backend

- Run schema.sql and seed.sql in mysql
- if required python libraries are not installed,install them from requirements.txt
- change diretory to backend
- run command : python -m uvicorn main:app --reload
- Stagger UI will be at http://127.0.0.1:8000/docs