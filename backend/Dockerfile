FROM python:3.9-slim
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y build-essential gcc
RUN pip install -r requirements.txt
CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]
