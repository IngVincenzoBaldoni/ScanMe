# User Journeys

## Journey 1: attivazione maglietta

1. L'utente acquista la maglietta.
2. Scansiona il QR iniziale o visita la piattaforma.
3. Crea un account o effettua login.
4. Inserisce un codice di attivazione univoco associato alla maglietta.
5. Il sistema collega la maglietta al profilo utente.

## Journey 2: aggiornamento del link

1. L'utente accede alla dashboard.
2. Seleziona la propria maglietta.
3. Inserisce un nuovo URL di destinazione.
4. Il sistema valida il formato dell'URL e salva la modifica.
5. Da quel momento ogni nuova scansione usa il nuovo link.

## Journey 3: scansione pubblica

1. Una persona scansiona il QR sul retro della maglietta.
2. Il QR punta a un endpoint pubblico ScanMe con ID maglietta.
3. Il backend recupera il link attivo da DynamoDB.
4. Il backend risponde con redirect HTTP 302.
5. Il browser apre la destinazione configurata dall'utente.

## Regole funzionali chiave

- Una maglietta puo' avere un solo proprietario attivo.
- Solo il proprietario autenticato puo' cambiare il link.
- Il redirect deve essere veloce e disponibile anche con alto traffico.
- In caso di link non configurato il sistema deve mostrare una pagina di fallback chiara.
