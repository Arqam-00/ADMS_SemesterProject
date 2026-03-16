import mysql.connector
from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

dbconfig = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME")
}

connection_pool = pooling.MySQLConnectionPool(
    pool_name="citizen_pool",
    pool_size=10,
    **dbconfig
)

def get_db():
    return connection_pool.get_connection()