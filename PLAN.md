# Plán: aktuální v20 a úklid projektu

## Cíl
Uchovat jedinou kompletní lokální v20 a připravit přehledný současný stav pro pozdější uložení na GitHub.

## Rozhodnutí a omezení
- Schváleno uživatelem 15. 10. 2026: zachovat v20, doplnit 12 SVG z v13, starší soubory přesunout do `old files/`, opravit dokumentaci a vyřadit archiv ze sledování Gitu.
- Celé `old files/`, `verification/` a místní `.mcp.json` zůstávají pouze lokálně a jsou v `.gitignore`. Tyto podklady nebudou součástí nového klonu repozitáře; původní commity Git historie zůstávají zachované.
- Aktuální instalace: `AHOME-product-top-pilot-v20/` obsahuje CSS/, JS/, html-editor/, Ikonky/ a NAVOD.md. Funkční CSS/JS/HTML se při úklidu nemění; hlavičkové cache parametry 20.4, produktové 20.1.
- Současné nasazení na serveru tímto není potvrzeno. Bez commitu, pushe, uploadu a deploye.
- Původní plán a úplný deník D1–D31: [lokální archiv](<old files/PLAN-pred-uklidem.md>). Původní hlavička v1 a původní shop soubory jsou zachované v archivu.
- Minimum ověření, bez browseru a vizuálního QA podle předchozího rozhodnutí uživatele.

## Dávky
- [x] D32 Úklid aktuálního stavu – soubory: README.md, .gitignore, PLAN.md, AGENTS.md, návod a SVG v20, tools/verify-page.mjs; mechanický přesun 54 položek do archivu – test: L0 + syntaxe upraveného nástroje, hashe a kontrola referencí/Gitu. Větší počet souborů je pouze přesun zachovaného obsahu, bez změny funkčního balíčku. Dokončeno 15. 10. 2026: SHA256, 12 SVG a reference, syntaxe nástroje a Git kontroly PASS; souhrn verification/cleanup-summary.md.

## Otevřené otázky
- Před nasazením ověřit cílovou instalaci podle TESTING.md; poslední vzhled D31 čeká na ruční potvrzení uživatelem.
- Zajistit skutečný zdroj hodnocení nebo odstranit ukázku; rozhodnout produktové versus celkové hodnocení obchodu.
- Sjednotit formát názvů produktů podle schváleného pravidla dělení původního H1. Benefity se od v19 čtou z celých seznamových položek krátkého popisu; původní závislost na tučném textu je již vyřešená.
- Panel „Naše dárky dělají radost“, případné nové ikony benefitů a videa zůstávají odložené. Růžové zvýraznění v bannerech používá `*text*`.
- Původní hlavičkový JS obsahuje zachované úpravy košíku/checkoutu; oddělení odloženo. QA skript verification/qa.mjs zatím neexistuje; zavedení vyžaduje vlastní schválený krok.
- Lokálně zůstávají zálohy produktových popisů a výsledky obsahových změn testshopu ve verification/. Po úklidu nejsou zálohované novým stavem na GitHubu.

## Deník
- 15. 10. 2026 – D32 hotová: přesunuto 54 položek; 217 archivovaných souborů má shodné SHA256, šest aktuálních CSS/JS/HTML zachováno. Podklady: verification/cleanup-manifest.json. Doplněno 12 SVG do stávající v20, archiv a verification vyřazeny ze sledování Gitu. Kontroly PASS: verification/cleanup-summary.md. Pro další fázi lze pokračovat v novém chatu z tohoto plánu; bez commitu a pushe.
- 15. 10. 2026 – Výchozí D31: společná hlavička, jediné logo košíku, zarovnání drobečků na obsah, cache hlavičky 20.4. Výsledky a omezení v lokálním verification/v20/header-logo-alignment/summary.md.

