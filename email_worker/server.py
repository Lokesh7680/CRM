from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from email_worker.worker import send_email_task  # ✅ Must match the Celery app's file and task
import uvicorn

app = FastAPI()

# ✅ Allow CORS (optional but useful for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/queue-email")
async def queue_email(request: Request):
    body = await request.json()
    emails = body.get("emails", [])
    
    for email in emails:
        print("🔁 Queuing email for:", email.get("to"))

        result = send_email_task.delay(
            email.get("to"),
            email.get("subject"),
            email.get("campaignId"),
            email.get("userId"),
            email.get("firstName", ""),
            email.get("couponCode", ""),
            email.get("expiryDate", "")
        )

        print("📨 Task queued with ID:", result.id)  # ✅ DEBUG: Confirm task pushed to Redis
    
    return {"message": "Emails queued successfully"}
