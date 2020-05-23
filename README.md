### Setup

1. If you are using PostgreSQL create your database with following. Make sure to replace `<password>` with your own.

```
CREATE DATABASE <DATABASE_NAME>;

CREATE USER <DATABASE_USER> WITH PASSWORD '<password>';

ALTER ROLE <DATABASE_USER> SET client_encoding TO 'utf8';
ALTER ROLE <DATABASE_USER> SET default_transaction_isolation TO 'read committed';
ALTER ROLE <DATABASE_USER> SET timezone TO 'Asia/Ulaanbaatar';

GRANT ALL PRIVILEGES ON DATABASE <DATABASE_NAME> TO <USER_NAME>;
```
2. Setup environment and setup database:

```
pip install -r requirements.txt
./manage.py migrate
./manage.py createcachetable
```