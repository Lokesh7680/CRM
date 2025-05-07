from celery import Celery
import smtplib
import redis
import json  # ❗ You forgot to import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Celery app config
app = Celery("email_tasks", broker="redis://localhost:6379/0")

# Redis connection (only used for optional queue reading)
r = redis.Redis(host="localhost", port=6379, db=0)

# SMTP credentials
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

@app.task(name="send_email_task")
def send_email_task(to, subject, campaign_id, user_id, first_name, coupon_code, expiry_date):
    print("📨 Sending Email to:", to)

    message = MIMEMultipart("alternative")
    message["From"] = SMTP_USER
    message["To"] = to
    message["Subject"] = subject

    template_path = os.path.join(os.path.dirname(__file__), "compiled_template.html")
    with open(template_path, "r") as f:
        html_template = f.read()

    # 🔁 Replace placeholders
    html_content = html_template.replace("{{firstName}}", first_name or "there")
    html_content = html_content.replace("{{couponCode}}", coupon_code or "")
    html_content = html_content.replace("{{expiryDate}}", expiry_date or "")
    html_content = html_content.replace("{{campaignId}}", campaign_id or "")
    html_content = html_content.replace("{{userId}}", user_id or "")

    # Attach HTML content
    html_part = MIMEText(html_content, "html")
    message.attach(html_part)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(message)
        print("✅ Email sent to", to)
    except Exception as e:
        print("❌ Email failed:", str(e))


# Optional background polling task (not used if using delay())
@app.task
def check_email_queue():
    while True:
        task_data = r.lpop("email_queue")
        if task_data:
            email = json.loads(task_data)
            send_email_task(
                to=email.get("to"),
                subject=email.get("subject"),
                campaign_id=email.get("campaignId"),
                user_id=email.get("userId"),
                first_name=email.get("firstName"),
                coupon_code=email.get("couponCode"),
                expiry_date=email.get("expiryDate"),
            )
