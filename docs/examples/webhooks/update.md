```bash
appwrite webhooks update \
    --webhook-id '<WEBHOOK_ID>' \
    --name '<NAME>' \
    --url https://example.com/webhook \
    --events 'users.*.create'
```
