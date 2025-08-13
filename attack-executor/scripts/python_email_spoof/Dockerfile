# attack-executor/scripts/python_email_spoof/Dockerfile

# Use a minimal Python base image
FROM python:3.9-slim-buster

# Set working directory inside the container
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the script itself
COPY main.py .

# Command to run the script when the container starts
CMD ["python", "main.py"]