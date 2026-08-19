import os
import mysql.connector


def get_connection():
    config = {
        "host": os.environ["DB_HOST"],
        "port": int(os.getenv("DB_PORT", "4000")),
        "user": os.environ["DB_USER"],
        "password": os.environ["DB_PASSWORD"],
        "database": os.environ.get("DB_NAME", "Todo-App"),
    }

    # TiDB Cloud requires TLS
    if os.getenv("DB_SSL", "true").lower() == "true":
        config["ssl_ca"] = "/etc/ssl/certs/ca-certificates.crt"
        config["ssl_verify_cert"] = True
        config["ssl_verify_identity"] = True

    return mysql.connector.connect(**config)
