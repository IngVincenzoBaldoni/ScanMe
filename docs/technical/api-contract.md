# API Contract

## Endpoint pubblici

### `GET /r/{shirt_id}`

- Scopo: redirect pubblico verso il link attivo della maglietta.
- Auth: nessuna.
- Risposta attesa: `302` con header `Location`.

## Endpoint autenticati

### `POST /v1/shirts/claim`

- Scopo: associare una maglietta a un utente autenticato.
- Auth: Cognito JWT.
- Payload minimo:

```json
{
  "activationCode": "ABC123-PLACEHOLDER"
}
```

### `PUT /v1/shirts/{shirt_id}/target`

- Scopo: aggiornare il link attivo.
- Auth: Cognito JWT.
- Payload minimo:

```json
{
  "targetUrl": "https://example.com/my-profile"
}
```

### `GET /v1/shirts`

- Scopo: recuperare le magliette dell'utente autenticato.
- Auth: Cognito JWT.

## Risposte d'errore minime

- `400` input non valido
- `401` non autenticato
- `403` non autorizzato
- `404` maglietta non trovata
- `409` maglietta gia' reclamata
