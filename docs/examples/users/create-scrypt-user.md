```bash
appwrite users create-scrypt-user \
    --user-id '<USER_ID>' \
    --email email@example.com \
    --password password \
    --password-salt '<PASSWORD_SALT>' \
    --password-cpu 8 \
    --password-memory 65536 \
    --password-parallel 1 \
    --password-length 64
```
