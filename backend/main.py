from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes
from routes import citizen_routes
from routes import officer_routes
from routes import application_routes
from routes import admin_routes
from routes import verification_routes
from routes import registration_routes
from routes import family_routes

app = FastAPI(
    title="Citizen Identity Management API",
    version="1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(citizen_routes.router)
app.include_router(officer_routes.router)
app.include_router(application_routes.router)
app.include_router(admin_routes.router)
app.include_router(verification_routes.router)
app.include_router(registration_routes.router)
app.include_router(family_routes.router)