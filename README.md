# Vue 3 + Vite

## Helm deploy

```
helm upgrade --install frontend-service ./helm/frontend-service \
-n cloudshopt \ 
-f helm/frontend-service/values.yaml
```

## Test stripe checkout locally 
```
stripe listen --forward-to http://app.localhost/api/payments/webhooks/strip
```
