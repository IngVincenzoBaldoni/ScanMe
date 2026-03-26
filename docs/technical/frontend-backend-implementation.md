# Frontend / Backend Implementation

## Frontend

Il frontend iniziale e' una SPA React con tre macro-capacita':

- login admin;
- creazione di una nuova maglietta digitale;
- preview del QR stabile e gestione del target URL.

La UI e' progettata per essere semplice da evolvere verso autenticazione piu' robusta, senza rifare la struttura.

## Backend

Le Lambda implementano i casi d'uso minimi del prodotto:

- redirect pubblico;
- login admin MVP;
- creazione della maglietta;
- lista delle magliette;
- update del target URL.

## Gap intenzionali

- autenticazione single-admin pensata per MVP e non per produzione;
- analytics scansioni non ancora presenti;
- packaging Lambda da irrobustire prima della produzione.
