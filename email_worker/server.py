from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
from email_worker.worker import send_email_task

app = FastAPI()

class EmailPayload(BaseModel):
    to: str
    subject: str
    campaignId: str
    firstName: str
    couponCode: str
    expiryDate: str

class QueueRequest(BaseModel):
    emails: List[EmailPayload]

@app.post("/queue-email")
async def queue_email(request: QueueRequest):
    print("📨 Received request to queue emails:")
    print(request.emails)

    try:
        for email in request.emails:
            send_email_task.delay(
                email.to,
                email.subject,
                email.campaignId,
                email.firstName,
                email.couponCode,
                email.expiryDate
            )
        return {"status": "queued", "count": len(request.emails)}
    except Exception as e:
        print("❌ Error while queueing:", e)
        return {"error": str(e)}
