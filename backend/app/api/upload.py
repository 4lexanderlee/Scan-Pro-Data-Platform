from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Extraer el nombre original del archivo
        filename = file.filename
        # Leer el contenido del archivo a la memoria RAM
        content = await file.read()
        # Calculamos cuánto pesa el archivo (bytes)
        file_size = len(content)
        # En futuros avances, aqui pasaremos 'content' a pandas o DuckDB para limpiarlo, transformarlo y analizarlo
        # Respuesta al frontend en un diccionario, fastAPI lo convierte automaticamente a JSON
        return {
            "status": "success",
            "mensaje": "Archivo recibido correctamente en el backend",
            "nombre_archivo": filename,
            "tamaño_bytes": file_size,

        }
    except Exception as e:
        # Si hay un error, devolvemos un mensaje de error al frontend
        return {
            "status": "error",
            "mensaje": str(e),
        }