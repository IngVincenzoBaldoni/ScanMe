# User Journeys

## Journey 1: acquisto e provisioning interno

1. Il cliente acquista la maglietta sullo store Shopify.
2. In checkout o sulla pagina prodotto comunica il link che desidera associare al QR.
3. L'ordine entra nel processo operativo interno.
4. Il founder apre il portale interno ScanMe.
5. Crea il digital twin del capo inserendo dati cliente, order reference, variante prodotto, stato produzione e link richiesto.
6. Il sistema genera uno `shirtId` univoco che diventera' l'identita' digitale permanente del capo.
7. Il QR stampato viene costruito sul redirect stabile `/r/{shirtId}`.
8. Il team usa quel QR nel design destinato a Printify.

## Journey 2: produzione e spedizione

1. Il digital twin viene aggiornato a stato `qr_ready`.
2. Il QR viene inserito nel file grafico destinato a Printify.
3. Il capo passa a `sent_to_printify` e poi `in_production`.
4. Quando Printify spedisce, il twin passa a `shipped`.
5. Quando il cliente riceve la maglietta e la prima scansione va a buon fine, il twin puo' essere considerato `active`.

## Journey 3: scansione pubblica

1. Una persona scansiona il QR sul retro della maglietta.
2. Il QR punta a un endpoint pubblico ScanMe con ID maglietta.
3. Il backend recupera il digital twin da DynamoDB.
4. Il backend aggiorna analytics e contatori giornalieri.
5. Il backend risponde con redirect HTTP 302 verso il link live associato al capo.

## Journey 4: gestione interna del link

1. Il founder accede al portale interno.
2. Apre la scheda del digital twin.
3. Verifica il link richiesto dal cliente e il link live corrente.
4. Aggiorna il link live quando necessario.
5. Le scansioni successive usano immediatamente il nuovo target.

## Regole funzionali chiave

- Il cliente finale non deve accedere al portale interno per generare il QR.
- Il QR stampato contiene sempre un redirect stabile ScanMe, non il link finale.
- Il founder crea il digital twin solo dopo l'ordine o durante il processo di fulfillment.
- Ogni digital twin deve contenere dati minimi di commercio, produzione e analytics.
- Il backend deve mostrare una fallback page chiara se il QR non e' ancora configurato.
