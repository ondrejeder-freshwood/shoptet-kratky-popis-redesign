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
