from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import router
import models
from database import engine

models.BaseModel.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)