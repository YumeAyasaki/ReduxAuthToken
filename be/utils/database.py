def get_database_url(settings):
    return "{}+{}://{}:{}@{}:{}/{}".format(
            settings.rdbms, settings.connector,
            settings.DB_USER, settings.DB_PASS,
            settings.DB_HOST, settings.DB_PORT, settings.DB_NAME
        )