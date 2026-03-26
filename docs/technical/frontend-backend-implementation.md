# Frontend / Backend Implementation

## Frontend

Il frontend iniziale e' una SPA React con tre macro-capacita':

- login o signup in modalita' mock;
- claim maglietta con activation code;
- gestione del target URL delle magliette collegate.

La UI e' progettata per essere semplice da evolvere verso Cognito reale e API reali, senza rifare la struttura.

## Backend

Le Lambda implementano i casi d'uso minimi del prodotto:

- redirect pubblico;
- claim della maglietta;
- lista delle magliette per owner;
- update del target URL.

## Gap intenzionali

- integrazione Cognito frontend ancora a placeholder;
- seed iniziale magliette non ancora automatizzato;
- analytics scansioni non ancora presenti;
- packaging Lambda da irrobustire prima della produzione.
