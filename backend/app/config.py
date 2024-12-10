import os
import redis
from datetime import timedelta

class Base(object):
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  SESSION_TYPE = 'redis'
  SESSION_PERMANENT = True
  PERMANENT_SESSION_LIFETIME = timedelta(days=30)
  SESSION_USE_SIGNER = True
  SESSION_KEY_PREFIX = 'Iterative:'
  SECRET_KEY = os.environ.get('SECRET_KEY', "secret_key")
  OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', "test-api-key")
  CORS_ORIGINS = [
    os.environ.get('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000'),
    os.environ.get('FRONTEND_HOSTNAME', 'http://localhost:3000'),
    ]
  
class DevelopmentConfig(Base):
  DEBUG=True
  DEVELOPMENT=True
  SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
  REDIS_URL = "redis://localhost:6379/0"
  FLASK_ENV="development"
  CELERY = dict(
    broker_url=REDIS_URL,
    result_backend=REDIS_URL,
  )
  SESSION_REDIS = redis.from_url(REDIS_URL)
  
class ProductionConfig(Base):
  DEBUG=False
  DEVELOPMENT=False
  FLASK_ENV="production"
  REDIS_URL=os.environ.get("REDISCLOUD_URL", "redis://localhost:6379")
  SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "fake-db-url").replace('postgres://', 'postgresql://')
  CELERY = dict(
    broker_url=REDIS_URL,
    result_backend=REDIS_URL,
  )
  SESSION_REDIS = redis.from_url(REDIS_URL)
