import pystache
import subprocess
import smtplib
from email.mime.text import MIMEText

def render_email(campaignId, userId, userName, expiryDate):
    with open("email_worker/templates/TrackedEmailTemplate.mjml", "r") as f:
        mjml_template = f.read()

    data = {
        "campaignId": campaignId,
        "userId": userId,
        "userName": userName,
        "expiryDate": expiryDate
    }

    rendered_mjml = pystache.render(mjml_template, data)

    with open("email_worker/templates/rendered.mjml", "w") as f:
        f.write(rendered_mjml)

    subprocess.run(["mjml", "email_worker/templates/rendered.mjml", "-o", "email_worker/templates/rendered.html"])

    with open("email_worker/templates/rendered.html", "r") as f:
        html_output = f.read()

    return html_output

def send_email(to_email, subject, html_content):
    from_email = "lokeshreddyneelapu@gmail.com"
    password = "fwmx shnw gjrj rsrg"

    msg = MIMEText(html_content, "html")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(from_email, password)
        server.sendmail(from_email, to_email, msg.as_string())
