# Projektové instrukce

Projekt obsahuje lokální Shoptet CSS/JS balíček. Dohodnutý standardní režim a rozsah ověření je v [TESTING.md](TESTING.md).

- Primární plánování a koordinace: `gpt-6-astra`, reasoning `high`. Změny kódu nejprve popsat stručným plánem s účelem, přesnými target files a ověřením; implementovat až po schválení. Již schválený plán znovu neschvalovat.
- Schválenou implementaci předat subagentovi `implementation`, `gpt-6.1-sol`, reasoning `high`; koordinátor ověřuje výsledek. Dávka obsahuje nejvýše 3–5 target files. Případnou nedostupnost modelu/delegování oznámit.
- Před změnami ověřit workspace a stav souborů. Nezávislá čtení sdružovat a neduplikovat úspěšné kontroly. Nepřepisovat souběžnou práci jiných agentů.
- Neměnit veřejné původní shop soubory, jiné shop funkce ani administrativní logo. Původní nesouvisející kód zachovat v kopiích. Schválený rozsah zahrnuje mobilní hlavičku a pilot horní části produktu `/drevena-vune-do-auta-fresh-wood-nekonecno/` na `744953.myshoptet.com` a `www.ahome.cz`, ověřený nativním GUID `0842d0bc-3f9c-11f0-b701-1abd5f483e00`.
- Pro pilot číst název z původního Shoptet H1, galerii/cenu/dostupnost z nativních uzlů. Nezavádět duplicitní produktový JSON ani přepis obsluhy galerie, košíku, upsellu či personalizace. Ukázkové hodnocení zůstává výslovně označené jako ukázka a bez hodnoticího schema. Hlavičku v1 zachovat pro návrat; instalační postupy jsou v [HEADER-INSTALL.md](HEADER-INSTALL.md) a [PRODUCT-TOP-INSTALL.md](PRODUCT-TOP-INSTALL.md).
- Rozšíření schváleného rozsahu předem vysvětlit a schválit. API kontrakt vyžadovat jen při změně API. Read-only průzkum a kontroly nové schválení nepotřebují.
- Používat relevantní skills. Test/build/lint konfiguraci neměnit kvůli průchodu; pro samotné CSS nebo text nepřidávat regresní testy.
- Commit, push, upload a deploy pouze na výslovnou žádost. Uživatel autorizoval commit a push lokálních změn do `https://github.com/ondrejeder-freshwood/shoptet-kratky-popis-redesign.git`; upload a deploy do Shoptetu vyžadují samostatnou výslovnou žádost. Navrhnout commit message po implementační dávce.
