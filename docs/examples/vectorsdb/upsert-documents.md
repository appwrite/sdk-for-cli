```bash
appwrite vectorsdb upsert-documents \
    --database-id '<DATABASE_ID>' \
    --collection-id '<COLLECTION_ID>' \
    --documents '{"$id":"example1","embeddings":[0.12,-0.55,0.88,1.02],"metadata":{"name":"First document"}}'
```
