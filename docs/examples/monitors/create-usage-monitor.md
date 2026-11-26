```bash
appwrite monitors create-usage-monitor \
    --monitor-id '<MONITOR_ID>' \
    --name '<NAME>' \
    --rules '{"method":"greaterThan","attribute":"network.outbound","values":[5000000000]}'
```
