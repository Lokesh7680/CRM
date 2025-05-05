from celery import Celery
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
import subprocess

# Load .env variables
load_dotenv()

# Celery app config
app = Celery("email_worker", broker="redis://localhost:6379/0")

# SMTP credentials from .env
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")

# ✅ REGISTER the task with explicit name
@app.task(name="send_email_task")
def send_email_task(to, subject, campaign_id, user_id, first_name, coupon_code, expiry_date):
    try:
        print("\n📨 Sending Email...")
        print(f"To: {to}")
        print(f"Subject: {subject}")
        print(f"Campaign ID: {campaign_id}")
        print(f"User ID: {user_id}")
        print(f"Coupon Code: {coupon_code}")
        print(f"Expiry Date: {expiry_date}")

        # Load and inject MJML
        base_dir = os.path.dirname(os.path.abspath(__file__))
        mjml_path = os.path.join(base_dir, "template.mjml")

        with open(mjml_path, "r") as f:
            mjml = f.read()

        mjml = mjml.replace("{{firstName}}", first_name)
        mjml = mjml.replace("{{couponCode}}", coupon_code)
        mjml = mjml.replace("{{expiryDate}}", expiry_date)
        mjml = mjml.replace("{{campaignId}}", campaign_id)
        mjml = mjml.replace("{{userId}}", user_id)

        # Convert MJML to HTML
        result = subprocess.run(
            ["npx", "mjml", "--stdin"],
            input=mjml.encode(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        if result.returncode != 0:
            raise Exception("❌ MJML to HTML conversion failed:\n" + result.stderr.decode())

        html = result.stdout.decode()

        # Email setup
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = SMTP_USER
        msg["To"] = to
        msg.attach(MIMEText(html, "html"))

        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.sendmail(msg["From"], [to], msg.as_string())
        server.quit()

        print("✅ Email sent successfully!")
        return {"to": to, "status": "sent"}

    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return {"to": to, "status": "failed", "error": str(e)}
