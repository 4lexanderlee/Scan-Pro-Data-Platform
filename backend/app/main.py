from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload

app = FastAPI(
    title="ScanPro API",
    description="Motor de procesamiento de datos y SQL para Scan Pro",
    version="1.0.0"
)

#Configuración estricta de CORS para conectar con React
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# "Enchufamos" nuestro router a la aplicación principal.
# Le ponemos el prefijo "/api" para que la ruta final sea "http://localhost:8000/api/upload"
app.include_router(upload.router, prefix="/api", tags=["Ingesta de datos"])

@app.get("/")
def health_check():
    return {"message": "ScanPro API is running"}