# API Contract

## Endpoint pubblici

### `GET /r/{shirt_id}`

- Scopo: redirect pubblico verso il link attivo della maglietta.
- Auth: nessuna.
- Risposta attesa: `302` con header `Location`.
- Fallback: se il QR non e' configurato, il backend restituisce una pagina HTML di fallback.

## Endpoint admin MVP

Il target attuale e' un MVP single-admin. Gli endpoint privati sono protetti da login admin e token `Bearer`.

### `POST /v1/admin/login`

- Scopo: autenticare l'admin del MVP.
- Auth: nessuna.
- Payload:

```json
{
  "email": "founder@example.com",
  "password": "ChangeMe123!"
}
```

### `GET /v1/shirts`

- Scopo: recuperare la lista delle magliette gestite dall'admin.
- Auth: `Bearer token`.

### `POST /v1/shirts`

- Scopo: creare una nuova maglietta con QR dinamico.
- Auth: `Bearer token`.
- Payload:

```json
{
  "label": "ScanMe Founder Tee",
  "targetUrl": "https://example.com/my-profile"
}
```

### `PUT /v1/shirts/{shirt_id}/target`

- Scopo: aggiornare il link attivo.
- Auth: `Bearer token`.
- Payload:

```json
{
  "targetUrl": "https://example.com/my-profile"
}
```

## Risposte d'errore minime

- `400` input non valido
- `401` non autenticato
- `404` maglietta non trovata
- `409` conflitto su creazione
