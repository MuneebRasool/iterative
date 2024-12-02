import time
from app import create_app
from app.extensions import db

app = create_app()
time.sleep(10)

with app.app_context():
    db.create_all()