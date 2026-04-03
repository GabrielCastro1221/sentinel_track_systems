import os
from pymongo import MongoClient
from config.enviroment import config

class MongoConnection:
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoConnection, cls).__new__(cls)
            cls._connect()
        return cls._instance

    @classmethod
    def _connect(cls):
        mongo_url = os.getenv("MONGO_URL")

        if not mongo_url:
            raise Exception("MONGO_URL is not defined in environment variables")

        cls._client = MongoClient(mongo_url)
        db_name = mongo_url.split("/")[-1]
        cls._db = cls._client[db_name]
        print(f"[MongoDB] Connected to database: {db_name}")

    @classmethod
    def get_db(cls):
        if cls._db is None:
            cls._connect()
        return cls._db

    @classmethod
    def get_client(cls):
        if cls._client is None:
            cls._connect()
        return cls._client