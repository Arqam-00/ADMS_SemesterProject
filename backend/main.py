from fastapi import FastAPI
from routes import auth_routes
from routes import citizen_routes
from routes import officer_routes
from routes import application_routes

app = FastAPI(
title="Citizen Identity Management API",
version="1.0"
)

app.include_router(auth_routes.router)
app.include_router(citizen_routes.router)
app.include_router(officer_routes.router)
app.include_router(application_routes.router)