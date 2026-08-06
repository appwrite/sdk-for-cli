```bash
appwrite databases create-document \
    --database-id "<DATABASE_ID>" \
    --collection-id "<COLLECTION_ID>" \
    --document-id "<DOCUMENT_ID>" \
    --data map[string]interface{}{
        "username": "walter.obrien",
        "email": "walter.obrien@example.com",
        "fullName": "Walter O'Brien",
        "age": 30,
        "isAdmin": false
    }
```
