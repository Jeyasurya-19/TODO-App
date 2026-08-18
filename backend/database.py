import os
import mysql.connector


def get_connection():
    config = {
        "host": os.environ["DB_HOST"],
        "port": int(os.getenv("DB_PORT", "4000")),
        "user": os.environ["DB_USER"],
        "password": os.environ["DB_PASSWORD"],
        "database": os.environ.get("DB_NAME", "todoapp"),
    }

    # TiDB Cloud Starter/Essential requires TLS for public connections.
    if os.getenv("DB_SSL", "true").lower() == "true":
        config["ssl_verify_cert"] = True
        config["ssl_verify_identity"] = True

        # Optional CA file if the platform/environment requires an explicit CA.
        ssl_ca = os.getenv("DB_SSL_CA")
        if ssl_ca:
            config["ssl_ca"] = ssl_ca

    return mysql.connector.connect(**config)
