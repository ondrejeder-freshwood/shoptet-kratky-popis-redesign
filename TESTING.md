# Režim testování

Schválený režim: **standardní** pro mobilní redesign hlavičky AHOME. Schválený orientační rozpočet ověření: 1–2 hodiny. Krátká lokální browser kontrola je dílčí součást této kontroly; před publikováním následuje ověření testovacího obchodu. Související kontroly sdružovat po implementaci.

Projekt obsahuje samostatné CSS/JS pro vložení do Shoptetu; nemá build ani frameworkovou testovací sadu. Pro textové/CSS změny nevytvářet testy, které pouze opakují implementaci.

Ověření této dávky:

- Kontrola syntaxe nového JS pomocí `node --check header-mobile-gaelta-redesign-v1.js`.
- Porovnání s veřejným původním CSS `headerFooter.css?v=2.82` a JS `header-mobile-gaelta.js?v=0.89`: původní CSS jako přesný prefix; všechny části JS od `/*Zmena popup kosik text */` beze změn.
- Nenulové SVG, XML/SVG validita a původní root geometrie: logo 159 × 31, hledání a košík 28 × 28, menu 48 × 48.
- Krátká browser kontrola skutečného Shoptet DOM s lokálním dosazením nových souborů: šířky 360/394/430 px bez přetečení, hlavička 64 px, desktop 768/1280 px, přechod mobil → desktop → mobil bez duplikace, nativní otevření hledání/menu a odkaz do košíku.
- Badge zachová nativní obsah při změně košíku; není odvozený z Figma ukázkové hodnoty. Vyšší oznámení a jeho zavření přepočítají odsazení.
- Checkout zůstane zjednodušený a použije původní kód. Živou objednávku ani nákup neprovádět.

Browser výsledek a případná omezení zapisuje koordinátor do ověřovacího výstupu. Dostupnost produkčního DOM nepotvrzuje konfiguraci heslem chráněného testovacího obchodu. Před publikováním je potřeba ověřit jeho skutečnou šablonu, native cart aktualizaci a checkout v oprávněné relaci.

## Výsledek lokálního ověření — 12. 10. 2026

**PASS** v izolovaném Edge nad veřejným produkčním Shoptet DOM. Požadavky na nové soubory byly dosazeny z lokálního balíčku; test nezapisoval na server.

- Mobil 360/394/430 px: hlavička 64 px, logo 159 × 31 px, žádné přetečení, původní hledání a menu se otevřely. Po zavření oznámení začínala hlavička na y = 0.
- Přechod mobil → 1280 px → mobil zachoval jediný wrapper košíku. Desktop 768/1280 px bez přetečení a s původním rozložením. Ve všech kontrolách bez `pageerror`.
- Detail produktu Nekonečno při 394 px aktivoval mobilní redesign bez přetečení.
- Syntetický nativní badge `<i>` s počtem 2 a následná náhrada košíkového odkazu klonem s počtem 3 zachovaly jediný košík a růžový badge 20 × 20 px vpravo nahoře (`rgb(248, 50, 123)`). Jde o test obnovy DOM, nikoli skutečnou mutaci obsahu košíku na serveru.
- Syntetické víceřádkové oznámení mělo výšku 112,21875 px; horní pozice hlavičky se přepočítala na stejnou hodnotu.
- GET stránky košíku s `pageType=cart`: redesign vynechán, původní zjednodušená hlavička 52 px, wrapper košíku v `header-top`, žádná nová loga ani přetečení.

Podklady: `verification/header-{360,394,430}.png`, `verification/header-results.json` a `verification/header-detail-results.json`.

Zbývá skutečné vykreslení v přihlášeném testovacím obchodě a reálná změna položek košíku. Tyto scénáře nebyly provedeny. Upload ani publikování neproběhly.

## Schválené rozšíření: pilot horní části produktu

Režim zůstává **standardní**, ověření sdružit po implementaci. Target files: `headerFooter-redesign-v2.css`, `product-top-redesign-v1.css`, `product-top-redesign-v1.js`, `PRODUCT-TOP-INSTALL.md`, tento dokument. V1 soubory zachovat beze změny.

- Syntaxe: `node --check product-top-redesign-v1.js`; v2 CSS musí obsahovat finalized v1 jako přesný prefix.
- Lokální Montserrat Latin/LatinExt WOFF2 a licence, při browser kontrole skutečně načtený font pro český název. SVG sloty zachovat: play 27 × 26 px, rating star intrinsic přibližně 9,432 × 9,443 px ve slotu 10 × 10 px.
- Cílená regrese parseru názvu: skutečný název se dvěma mezerami a en-dash prefixem, hyphen/en-dash/emdash oddělovače, zachování textu po prvním oddělovači podtitulu, úplný fallback při odlišném či neúplném formátu. Název odvozovat pouze z původního H1; jediné H1 a původní schema zůstávají zachované.
- Mobil 360/394/430 px: žádné přetečení, zavřená hlavička bez prázdného 52px bloku, hledání a menu funkční, breadcrumbs s původními odkazy. Hlavní galerie 374 × 375 px při 394 px; miniatury 84 × 75 px s rozestupem 8 px. Pagination odpovídá skutečnému počtu médií a aktivnímu stavu.
- Ověřit původní klik miniatury/pagination, původní video a swipe; nepřepisovat obsluhu galerie. Podpora nativních miniatur při nedostupném Swiperu musí zůstat.
- Syntetická změna textu a náhrada nativních uzlů ceny/dostupnosti se zobrazí aktuálně; zachovat nativní stav, barvy a variantové třídy. Hodnoty ceny a dostupnosti nekopírovat do konfigurace ani nepřebarvovat všechny stavy zeleně.
- Ukázkové hodnocení obchodu 4,9/5 (102 recenzí) viditelně označit `Ukázka`, přístupně jako ukázková data a bez nového hodnoticího schema.
- Desktop a přechod mobil → desktop → mobil: původní titul/cena/dostupnost se vrátí bez duplikace. Nesouvisející produkt a jiné stránky pilot neaktivují. Původní košík, upsell a personalizaci zachovat.

Browser výsledek rozšíření doplní koordinátor. Kontroly používají pouze lokální soubory a čtení veřejného DOM, bez změn serveru, objednávek či publikování. Oprávněná relace testovacího obchodu a reálné serverové změny košíku/varianty zůstávají samostatnou kontrolou před publikováním.

Při první kontrole produkčního DOM se potvrdila předchozí chyba resize v původním price/swipe v154: `updateSlides` → `alignToCurrent`, přístup k chybějící `length`. Izolovaná kontrola bez produktového CSS/JS ji reprodukovala stejně; podklad `verification/product-baseline-resize.json`. Tato chyba není regresí pilotu a oprava původní obsluhy galerie není v této dávce. Testovací obchod používá odlišný skript v155, který je potřeba ověřit samostatně.

## Ověřený výsledek pilotu — 12. 10. 2026

Sdružená funkční a vizuální kontrola nad veřejným produkčním DOM s lokálním dosazením souborů prošla na 360/394/430/768/1280 px. Zavřený nativní header má nulovou výšku v toku; po zavření oznámení začínají breadcrumbs bezprostředně pod 64px mobilním panelem. Galerie, titul, typografie, ceny a kompaktní řádek hodnocení/dostupnosti jsou vykreslené bez přetečení. Nativní klik miniatury mění hlavní fotografii na všech třech mobilních šířkách; desktop zůstává původní.

Syntaxe produktového JS, šest cílených regresí parseru názvu a přesný finalized v1 prefix v CSS v2 prošly. Podklady obsahují `verification/product-top-results.json`, screenshoty `verification/product-top-{360,394,430}.png` a cílené style/pagination diagnostiky. Známé původní chyby resize Swiperu jsou popsány výše a reprodukované bez pilotu.

Závěrečné cílené regrese **PASS**:

- Změna původního H1 přepočítá hlavní název i podtitulek; název bez očekávaného formátu zůstane úplný. Montserrat je skutečně načtený a prázdný původní obal dostupnosti není viditelný.
- Syntetická nativní náhrada ceny na `199 Kč` odstranila běžnou cenu podle aktuálního DOM. Nová dostupnost `Není skladem` zachovala skutečnou červenou barvu `rgb(190, 20, 30)`. Pilot používá vložené nativní uzly bez duplikace.
- Desktop obnovil cenu do `bottom` a dostupnost do `top`; při opětovné aktivaci mobilu zůstala právě jedna cena, jedna dostupnost a jeden summary. Původní v154 při resize oživoval svou starou referenci na nahrazenou dostupnost; pilot odstraňuje pouze konkrétní uzly, které dříve viděl nativně nahrazené, a zachovává aktuální uzel.
- Nesouvisející produkt pilot neaktivoval. Stránka košíku zůstala s původní zjednodušenou 52px hlavičkou.
- Klik skutečné pagination změnil hlavní fotografii i aktivní bod. Výběr video položky otevřel původní nativní video; síťové přehrání médií nebylo ověřováno.
- Syntetické odstranění Swiper wrapperu a zobrazení původních miniatur ověřilo fallback: 14 nativních médií, 14 bodů a funkční změna fotografie. Nejde o ověření skutečné konfigurace testovacího obchodu.

Podklady cílených kontrol: `verification/product-data-results.json`, `verification/product-gallery-results.json`, `verification/product-top-final-394.png`. Zůstávají pouze již reprodukované chyby původního v154 při resize; oprava tohoto skriptu nebyla součástí pilotu.

Upload a publikování neproběhly. Skutečná přihlášená konfigurace testovacího obchodu, jeho odlišný v155 a serverové mutace košíku/variant zůstávají neověřené.
