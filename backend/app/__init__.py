import os
from flask_socketio import SocketIO
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from celery import Celery, Task
from . import config
from app.extensions import db, login_manager
  
socketio = SocketIO()

from app.chat.events import *

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app
  
def create_app():
    app = Flask(__name__)

    if os.environ.get("ITERATIVE_ENV", "production").lower() in ["production", "prod"]:
        app.config.from_object(config.ProductionConfig)
    else:
        app.config.from_object(config.DevelopmentConfig)
    
    # Initialize Flask extensions here
    migrate = Migrate(app, db)
    bcrypt = Bcrypt(app)
    db.init_app(app)
    CORS(app, resources={r"/*": {"origins": app.config['CORS_ORIGINS']}}, supports_credentials=True)
  
    celery_init_app(app)

    # Register blueprints here
    from app.main import bp as main_bp
    from app.projects import bp as project_bp
    from app.settings import bp as settings_bp
    from app.core import bp as core_bp
    from app.deployments import bp as deployments_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(project_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(core_bp)
    app.register_blueprint(deployments_bp)

    if not app.debug:
      socketio.init_app(app, cors_allowed_origins="*", logger=True, engineio_logger=True, async_mode='gevent')
    else:
      socketio.init_app(app, cors_allowed_origins="*", logger=True, engineio_logger=True)
    return app
  
if __name__ == '__main__':
  app = create_app()
  socketio.run(app)
