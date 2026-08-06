```bash
appwrite tablesdb create-row \
    --database-id "<DATABASE_ID>" \
    --table-id "<TABLE_ID>" \
    --row-id "<ROW_ID>" \
    --data map[string]interface{}{
        "username": "walter.obrien",
        "email": "walter.obrien@example.com",
        "fullName": "Walter O'Brien",
        "age": 30,
        "isAdmin": false
    }
```
