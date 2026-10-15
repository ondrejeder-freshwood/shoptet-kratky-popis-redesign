# Projektové instrukce

Lokální Shoptet CSS/JS balíček. Ověřovací příkazy a plná kontrola jsou v [TESTING.md](TESTING.md), stav práce v [PLAN.md](PLAN.md). Instalace a návrat jsou v [README.md](README.md) a [návodu v20](AHOME-product-top-pilot-v20/NAVOD.md). Starší verze a původní zálohy jsou lokálně v `old files/`; tato složka a `verification/` jsou ignorované Gitem.

- Před změnami ověřit workspace a stav souborů; nepřepisovat souběžnou práci jiných agentů.
- Neměnit veřejné původní shop soubory, jiné shop funkce ani administrativní logo. Původní nesouvisející kód zachovat v kopiích.
- Schválený rozsah zahrnuje mobilní hlavičku a pilot horní části produktu `/drevena-vune-do-auta-fresh-wood-nekonecno/` na `744953.myshoptet.com` a `www.ahome.cz`, ověřený nativním GUID `0842d0bc-3f9c-11f0-b701-1abd5f483e00`.
- Pro pilot číst název z původního Shoptet H1, galerii/cenu/dostupnost z nativních uzlů. Nezavádět duplicitní produktový JSON ani přepis obsluhy galerie, košíku, upsellu či personalizace.
- Ukázkové hodnocení zůstává výslovně označené jako ukázka a bez hodnoticího schema. Hlavičku v1 zachovat pro návrat.
- API kontrakt `api.md` vyžadovat jen při změně API.
- Git: autorizovaným cílem pro commit a push lokálních změn je `https://github.com/ondrejeder-freshwood/shoptet-kratky-popis-redesign.git`; provést je na výslovnou žádost. Upload a deploy do Shoptetu vyžadují samostatnou výslovnou žádost.
- Výjimka pro verze: před úpravou souboru, který už je v instalačním balíčku, se zeptej, zda upravit stávající soubor, nebo vytvořit novou verzi (`-vN`). Instalační složku vytvářej jen na požádání, ZIP jen na výslovnou žádost.
