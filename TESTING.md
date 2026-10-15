# Testování

Úrovně L0–L3 platí podle globálních pravidel; tento projekt nemá build ani frameworkovou testovací sadu.

## Šířky a příkazy
- 393 px: mobil do 767 px; 768 px: střední pásmo 768–1199 px; 1280 px: desktop od 1200 px. Výběr vychází z breakpointů CSS 767/768 a 1199/1200 a dat z GA; další šířky jen na vyžádání.
- Syntaxe JS: `node --check <soubor.js>`.
- Projektový QA: `node verification/qa.mjs` — zatím neexistuje; připravovaný rozsah viz [PLAN.md, D1](PLAN.md). Do jeho implementace jej nevykazovat jako provedenou kontrolu.

## L3 – plná kontrola před uploadem/deployem
- Na 393/768/1280 px žádné přetečení; desktopové rozložení beze změny.
- Mobilní hlavička 64 px; nativní hledání, menu a košík funkční; badge z nativního obsahu. Vyšší oznámení a zavření přepočítají odsazení.
- Přechod mobil → desktop → mobil bez duplikace hlavičky, košíku, titulku, ceny či dostupnosti; nativní uzly se obnoví.
- Galerie: klik miniatury, pagination, video a swipe přes nativní obsluhu; zachovat fallback bez Swiperu. Síťové přehrání ověřit, pokud je dostupné.
- Název z původního H1, jediné H1 a původní schema; změna názvu a fallback formátu fungují. Ukázkové hodnocení označené a bez hodnoticího schema.
- Cena a dostupnost z aktuálních nativních uzlů včetně barev a variantových tříd; ověřit syntetickou změnu a náhradu uzlů.
- SVG dostupné a s očekávanou geometrií; Montserrat načtený, při nedostupnosti sítě sans-serif fallback.
- Nesouvisející produkty a stránka košíku pilot neaktivují; košík má původní zjednodušenou hlavičku. Zachovat upsell, personalizaci a nesouvisející původní CSS/JS.
- Žádné `pageerror` způsobené redesignem; známou původní chybu níže zaznamenat odděleně.
- Bez nákupu, objednávek a zápisů na server; podklady ukládat do `verification/`.

## Omezení a historie
- Původní chyba resize price/swipe v154 (`updateSlides` → `alignToCurrent`) není regresí pilotu; reprodukce a historické výsledky v [HISTORY.md](verification/HISTORY.md).
- Neověřeno: přihlášená konfigurace testovacího obchodu, odlišný skript v155 a reálné serverové změny košíku/variant. Historické výsledky nepotvrzují novější lokální verze.
