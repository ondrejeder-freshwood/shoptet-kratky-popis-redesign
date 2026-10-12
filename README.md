# AHOME — mobilní redesign Shoptetu

Lokální CSS/JS balíček pro postupný redesign e-shopu AHOME podle Figma. Projekt se soustředí nejprve na mobilní zobrazení a zachovává nativní data i funkce Shoptetu.

## Cíl a podklady

Celkovým cílem je sjednotit mobilní hlavičku a detail produktu: galerii, název, cenu, dostupnost a následně krátký popis s existujícím upsellem. Rozšíření na další produkty a desktop naváže po schválení a ověření pilotu.

- [Figma — návrh](https://www.figma.com/design/joSFQnFtYp4wqVpWU841pF/?node-id=182-10108), [detail produktu](https://www.figma.com/design/joSFQnFtYp4wqVpWU841pF/?node-id=162-25314).
- [Asana — úkol 1219408067364701](https://app.asana.com/0/0/1219408067364701).
- Produkční obchod: [www.ahome.cz](https://www.ahome.cz/).
- Testovací obchod: [744953.myshoptet.com](https://744953.myshoptet.com/).
- [Pilotní produkt Nekonečno](https://www.ahome.cz/drevena-vune-do-auta-fresh-wood-nekonecno/), nativní GUID `0842d0bc-3f9c-11f0-b701-1abd5f483e00`, kód `DV 39`.

Podklady byly dostupné přes read-only přístupy Shoptet, Figma, GitHub a Asana. Repozitář neobsahuje přístupová hesla ani tokeny.

## Aktuální stav k 12. 10. 2026

Mobilní hlavička v1 a pilot horní části produktu jsou lokálně implementované, schválené a připravené k instalaci podle přiložených postupů. Uživatel již dříve nahrál hlavičku; agent produktový pilot do obchodu nenahrál ani nepublikoval. Skutečné vykreslení aktuálního balíčku v testovacím obchodě zůstává neověřené.

| Část | Stav |
| --- | --- |
| Mobilní hlavička v1 | Panel 64 px, SVG logo a ikony, původní hledání/menu/košík; badge používá nativní počet položek. |
| CSS hlavičky v2 | Obsahuje v1 jako přesný prefix a odstraňuje prázdný prostor zavřené nativní hlavičky pro produktový pilot. |
| Horní část produktu v1 | Galerie, mobilní breadcrumbs, název/podtitulek, cena a dostupnost; aktivace pouze pro pilot pod 768 px. |
| Hodnocení | Ukázka 4,9/5 a 102 recenzí, výslovně označená `Ukázka`; bez hodnoticího schema. |
| Krátký popis a upsell | Další etapa; konkrétní integraci existujícího upsell doplňku je potřeba nejprve identifikovat. |
| Další produkty a desktop | Budoucí rozsah vyžadující schválení. |

Pilot kontroluje současně šířku pod 768 px, přesnou cestu produktu, doménu `744953.myshoptet.com` nebo `www.ahome.cz` a nativní GUID. Na jiných produktech se neaktivuje; na desktopu se obnoví původní rozložení.

Název se odvozuje z původního Shoptet H1: hlavní část `Nekonečno` a podtitulek začínající `Jeď…`. Při odlišném formátu se zachová úplný název. Zůstává jediné H1; nevzniká duplicitní produktový JSON ani databáze.

Galerie používá původní obrázky, videa a obsluhu. Cena a dostupnost používají aktuální nativní uzly včetně stavových barev. Košík, varianty, původní upsell, personalizace a Product/BreadcrumbList schema zůstávají zachované. Původní nesouvisející CSS/JS je součástí kopií.

Ukázkové hodnocení není ověřeným hodnocením produktu ani obchodu. U pilotního produktu nejsou doložené produktové recenze a testovací obchod má projektové hodnocení vypnuté. Před produkčním nasazením musí ukázku nahradit ověřený zdroj nebo musí být odstraněna.

## Mapa souborů

| Soubor / složka | Účel |
| --- | --- |
| [headerFooter-redesign-v1.css](headerFooter-redesign-v1.css) | Původní CSS doplněné o mobilní hlavičku; zachované pro návrat. |
| [header-mobile-gaelta-redesign-v1.js](header-mobile-gaelta-redesign-v1.js) | Hlavička v1 a zachovaný nesouvisející původní JS. |
| [headerFooter-redesign-v2.css](headerFooter-redesign-v2.css) | CSS hlavičky pro produktový pilot; v1 se nepřepisuje. |
| [product-top-redesign-v1.css](product-top-redesign-v1.css), [product-top-redesign-v1.js](product-top-redesign-v1.js) | Styly a propojení pilotu s nativním produktovým DOM. |
| `assets/header-v1/` | SVG logo, hledání, košík a menu. |
| `assets/product-top-v1/` | SVG play/hvězda, lokální Montserrat Latin/LatinExt WOFF2 a [licence OFL](assets/product-top-v1/OFL-Montserrat.txt). |
| `backup-original-test-shop/` | Záloha původních `headerFooter.css` a `header-mobile-gaelta.js` pro porovnání a návrat. |
| [AHOME-header-redesign-v1.zip](AHOME-header-redesign-v1.zip), `AHOME-header-redesign-v1/` | Instalační ZIP hlavičky a jeho rozbalená pracovní složka. |
| [AHOME-product-top-pilot-v1.zip](AHOME-product-top-pilot-v1.zip), `AHOME-product-top-pilot-v1/` | Instalační ZIP pilotu a jeho rozbalená pracovní složka včetně rollback CSS v1. |
| [HEADER-INSTALL.md](HEADER-INSTALL.md) | Přesné upload cesty, vložení hlavičky a úplný návrat původního řešení. |
| [PRODUCT-TOP-INSTALL.md](PRODUCT-TOP-INSTALL.md) | Instalace pilotu, pořadí načítání, hodnocení a návrat k hlavičce v1. |
| [TESTING.md](TESTING.md), `verification/` | Dohodnutý standardní režim, výsledky, JSON diagnostiky a screenshoty. |
| [AGENTS.md](AGENTS.md) | Projektový pracovní postup a schvalování změn. |

## Instalace a návrat

Používat samostatné verzované názvy souborů; pouhá změna parametru `?v=` neodděluje nové řešení od původní zálohy. Původní veřejné shop soubory ani administrativní logo nepřepisovat. Zachovat pořadí ostatních vložených skriptů a nenačítat původní i nový hlavičkový JS současně.

Instalace pilotu nejprve do testovacího obchodu se řídí [PRODUCT-TOP-INSTALL.md](PRODUCT-TOP-INSTALL.md). Hlavičkový JS v1 se ponechá, CSS hlavičky se přepne na v2 a přidají se produktové CSS/JS a assety. Pokud hlavička v1 není nainstalovaná, předpoklady doplňuje [HEADER-INSTALL.md](HEADER-INSTALL.md).

Pro návrat k hlavičce v1 odstranit produktové CSS/JS odkazy a vrátit hlavičkové CSS z v2 na v1. Pro úplný návrat obnovit původní odkazy podle [HEADER-INSTALL.md](HEADER-INSTALL.md). Samotný commit a push do GitHubu nemění konfiguraci obchodu.

## Ověření a jeho hranice

Dohodnutý režim je **standardní**. Projekt nemá build ani frameworkovou testovací sadu; relevantní ověření a jeho výsledky jsou v [TESTING.md](TESTING.md).

Lokální kontrola nad veřejným produkčním DOM s dosazenými soubory prošla na šířkách **360, 394, 430, 768 a 1280 px**. Ověřila mobilní geometrii, absenci přetečení, původní desktop, hledání/menu, přechody šířek a jediný košíkový wrapper. Syntaxe JS, cílené regrese parseru názvu a přesný prefix CSS v1 ve v2 také prošly.

Cílené kontroly zahrnuly změnu H1, syntetickou náhradu nativní ceny/dostupnosti, zachování stavových barev a obnovu uzlů na desktopu. Klik miniatury i pagination přepnul skutečnou fotografii; video položka otevřela původní video. Fallback galerie bez Swiperu prošel po syntetické úpravě DOM.

- [Finální mobilní screenshot 394 px](verification/product-top-final-394.png).
- [Výsledky pilotu](verification/product-top-results.json), [datové regrese](verification/product-data-results.json), [galerie](verification/product-gallery-results.json).
- [Výsledky hlavičky](verification/header-results.json) a screenshoty `verification/header-{360,394,430}.png`.
- [Původní chyba resize](verification/product-baseline-resize.json): produkční price/swipe v154 má chybu `updateSlides` → `alignToCurrent`, reprodukovanou i bez pilotu.

Testovací obchod chrání vstupní heslo. Lokální kontrola produkčního DOM nepotvrzuje jeho skutečnou konfiguraci ani odlišný price/swipe v155. Reálné serverové změny košíku a variant, checkout v oprávněné relaci a síťové přehrání videa nebyly provedeny. Oprava původní obsluhy galerie nebyla součástí této dávky.

## Další postup

1. Po výslovné autorizaci nahrát pilot do testovacího obchodu podle instalačního postupu.
2. Ověřit jeho skutečnou šablonu, v155, galerii, hledání/menu, košík, varianty a checkout v oprávněné relaci podle TESTING.md.
3. Ve schválené dávce odstranit ukázkové hodnocení nebo připojit ověřený zdroj.
4. Připravit a schválit krátký popis a napojení existujícího upsellu po identifikaci doplňku.
5. Po schválení rozšířit na další produkty a desktop. Produkční upload a nasazení vyžadují výslovnou žádost.

Uživatel nyní autorizoval commit a push lokálních změn do [GitHub repozitáře](https://github.com/ondrejeder-freshwood/shoptet-kratky-popis-redesign). Tato autorizace nezahrnuje další upload ani nasazení do Shoptetu.
