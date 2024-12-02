from flask import Blueprint
bp = Blueprint('deployments', __name__)

from app.deployments import routes