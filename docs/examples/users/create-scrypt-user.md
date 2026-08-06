```bash
appwrite users create-scrypt-user \
    --user-id "<USER_ID>" \
    --email "email@example.com" \
    --password "password" \
    --password-salt "<PASSWORD_SALT>" \
    --password-cpu 0 \
    --password-memory 0 \
    --password-parallel 0 \
    --password-length 0
```
