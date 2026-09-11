import os
import uuid
from typing import Tuple
from fastapi import UploadFile

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local").lower() # "local" or "s3"

os.makedirs(UPLOAD_DIR, exist_ok=True)

class StorageService:
    """
    Modular storage service supporting local disk storage and
    S3 / Cloudflare R2 / Google Cloud Storage buckets.
    """

    @staticmethod
    async def save_uploaded_file(file: UploadFile) -> Tuple[str, str, int]:
        """
        Saves uploaded file and returns (file_url, saved_filename, file_size)
        """
        file_bytes = await file.read()
        file_size = len(file_bytes)
        ext = os.path.splitext(file.filename or "")[1]
        unique_name = f"{uuid.uuid4()}{ext}"
        
        if STORAGE_BACKEND == "s3" and os.getenv("AWS_BUCKET_NAME"):
            # S3 / Cloudflare R2 / GCS cloud bucket handler
            try:
                import boto3
                s3 = boto3.client(
                    "s3",
                    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                    endpoint_url=os.getenv("S3_ENDPOINT_URL"),
                    region_name=os.getenv("AWS_REGION", "ap-south-1")
                )
                bucket = os.getenv("AWS_BUCKET_NAME")
                s3.put_object(
                    Bucket=bucket,
                    Key=f"medikiosk/{unique_name}",
                    Body=file_bytes,
                    ContentType=file.content_type or "application/octet-stream"
                )
                file_url = f"https://{bucket}.s3.amazonaws.com/medikiosk/{unique_name}"
                return file_url, unique_name, file_size
            except Exception as e:
                print(f"[Storage Warning] S3 upload failed: {e}. Falling back to local storage.")

        # Local fallback storage
        local_path = os.path.join(UPLOAD_DIR, unique_name)
        with open(local_path, "wb") as f:
            f.write(file_bytes)

        file_url = f"/uploads/{unique_name}"
        return file_url, unique_name, file_size

storage_service = StorageService()
