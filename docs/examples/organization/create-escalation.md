```bash
appwrite organization create-escalation \
    --escalation-id '<ESCALATION_ID>' \
    --name '<NAME>' \
    --steps '{"delay":0,"roles":["owner"]}' \
    --steps '{"delay":900,"roles":["developer"],"userIds":["<USER_ID>"]}'
```
