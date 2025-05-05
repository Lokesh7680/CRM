# email_worker/tasks.py

from celery import shared_task

@shared_task(name="send_email_task")  # ✅ Explicitly name the task
def send_email_task(to, subject, campaign_id, user_id, first_name, coupon_code, expiry_date):
    # Your email sending logic
    print(f"✅ Email sent to: {to}")
    return {"to": to, "status": "sent"}
