```bash
appwrite tablesdb update-enum-column \
    --database-id '<DATABASE_ID>' \
    --table-id '<TABLE_ID>' \
    --key '<KEY>' \
    --elements "active"  "inactive" \
    --required false \
    --default active
```
