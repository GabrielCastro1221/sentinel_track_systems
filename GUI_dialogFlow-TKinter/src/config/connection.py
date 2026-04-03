import os
from pymongo import MongoClient

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
        db_name = os.getenv("MONGO_DB")

        if not mongo_url:
            raise Exception("MONGO_URL is not defined in environment variables")

        if not db_name:
            raise Exception("MONGO_DB is not defined in environment variables")

        try:
            cls._client = MongoClient(mongo_url)
            cls._db = cls._client[db_name]

            cls._client.admin.command("ping")

            print("[MongoDB] Connected successfully")
            print(f"URI: {mongo_url.split('@')[-1]}")
            print(f"Database: {db_name}")

        except Exception as e:
            print("[MongoDB] Connection failed")
            raise RuntimeError(e)

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