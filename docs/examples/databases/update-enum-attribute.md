```bash
appwrite databases update-enum-attribute \
    --database-id '<DATABASE_ID>' \
    --collection-id '<COLLECTION_ID>' \
    --key '<KEY>' \
    --elements "active"  "inactive" \
    --required false \
    --default active
```
