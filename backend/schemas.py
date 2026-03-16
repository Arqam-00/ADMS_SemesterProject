from pydantic import BaseModel

class LoginRequest(BaseModel):

    email:str
    password:str


class ApplicationCreate(BaseModel):

    citizen_cnic:str
    application_type:str


class PaymentCreate(BaseModel):

    application_id:int
    amount:float
    payment_method:str