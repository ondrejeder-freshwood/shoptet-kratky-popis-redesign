# Pilot: horní část produktu AHOME

Balíček rozšiřuje lokální hlavičku v1 podle Figma `joSFQnFtYp4wqVpWU841pF`, uzel `162:25314`. Aktivuje se pouze pod 768 px na `/drevena-vune-do-auta-fresh-wood-nekonecno/` a jen na doménách `744953.myshoptet.com` a `www.ahome.cz`, pokud nativní produkt obsahuje GUID `0842d0bc-3f9c-11f0-b701-1abd5f483e00` (kód DV 39).

Název se čte z původního H1. Kategorie `Dřevěná vůně do auta` s oddělovačem a další pomlčka dovolí rozdělit název na hlavní část a podtitulek; při jiném formátu zůstane úplný název. Nevkládá se duplicitní H1 ani produktová databáze/JSON. Původní Product a BreadcrumbList schema, obrázky, cena, dostupnost a formulář zůstávají zdrojem dat. Nativní prvky titulu, dostupnosti a ceny se přesouvají pouze uvnitř produktového formuláře a na desktopu se vracejí.

Galerie používá původní fotky, videa a ovládání. Rozměr hlavního slotu je při šířce 394 px 374 × 375 px, miniatury 84 × 75 px s rozestupem 8 px. Pagination se vytváří podle skutečných nativních miniatur/Swiper slidů a kliká na původní ovládání. Balíček nevyžaduje novou instanci Swiper; podporuje i původní miniatury bez Swiperu.

Pagination je v samostatném bílém řádku pod fotografií, aby nezakrývala její obsah. Dlouhá nativní dostupnost se v kompaktním řádku může vizuálně zkrátit výpustkou; úplný text zůstává v původním DOM a přístupný čtečkám. Její stav, barvy ani variantové třídy se nemění.

## Soubory k nahrání

Instalujte pilot nejprve pouze do testovacího obchodu `744953.myshoptet.com`. Veřejná produkční stránka sloužila pro lokální browser ověření s dosazenými soubory. Před dalším rolloutem ověřte skutečnou přihlášenou relaci testovacího obchodu podle [TESTING.md](TESTING.md); publikování na produkci není součástí této lokální dodávky. Stávající hlavičkový JS v1 ponechte.

| Lokální soubor | Cílová cesta |
| --- | --- |
| `headerFooter-redesign-v2.css` | `/user/documents/upload/gaelta/headerFooter-redesign-v2.css` |
| `product-top-redesign-v1.css` | `/user/documents/upload/gaelta/product-top-redesign-v1.css` |
| `product-top-redesign-v1.js` | `/user/documents/upload/gaelta/product-top-redesign-v1.js` |
| `assets/product-top-v1/play-video.svg` | `/user/documents/upload/gaelta/product-top-redesign-v1/play-video.svg` |
| `assets/product-top-v1/rating-star.svg` | `/user/documents/upload/gaelta/product-top-redesign-v1/rating-star.svg` |
| `assets/product-top-v1/montserrat-latin-ext.woff2` | `/user/documents/upload/gaelta/product-top-redesign-v1/montserrat-latin-ext.woff2` |
| `assets/product-top-v1/montserrat-latin.woff2` | `/user/documents/upload/gaelta/product-top-redesign-v1/montserrat-latin.woff2` |

Lokální `assets/product-top-v1/OFL-Montserrat.txt` obsahuje licenci dodaných fontů; uchovejte ji s balíčkem. CSS používá lokální Montserrat variable 100–900, včetně LatinExt pro český název. Fonty a ikony jsou relativní vůči CSS cestě v tabulce.

Pokud hlavička v1 ještě není nainstalovaná, nahrajte také `header-mobile-gaelta-redesign-v1.js` a čtyři hlavičkové assety z [HEADER-INSTALL.md](HEADER-INSTALL.md). Hlavičkový JS v1 zůstává stejný. Nové CSS v2 obsahuje v1 v plném znění a přidává odstranění prázdného 52px prostoru nativního zavřeného hledání; nezakrývá jeho okno ani menu. V1 soubory a původní shop soubory nepřepisujte.

## Vložené odkazy

Nahraďte pouze dosavadní CSS hlavičky v1:

```html
<!-- Předtím -->
<link rel="stylesheet" href="/user/documents/upload/gaelta/headerFooter-redesign-v1.css?v=1">
<!-- Potom -->
<link rel="stylesheet" href="/user/documents/upload/gaelta/headerFooter-redesign-v2.css?v=1">
```

Ponechte stávající hlavičkový JS a přidejte dva produktové odkazy. Produktové CSS načtěte za CSS hlavičky a za stávajícími produktovými styly; produktový JS vložte za stávající gaelta, hlavičkové, price/swipe a sticky-button skripty. Zachovejte jejich dosavadní pořadí a atributy:

```html
<script src="/user/documents/upload/gaelta/header-mobile-gaelta-redesign-v1.js?v=1" defer></script>
<link rel="stylesheet" href="/user/documents/upload/gaelta/product-top-redesign-v1.css?v=1">
<script src="/user/documents/upload/gaelta/product-top-redesign-v1.js?v=1" defer></script>
```

Řádek hlavičkového JS ukazuje ponechaný odkaz; nevkládejte jej podruhé. Nepřidávejte současně původní i nový hlavičkový JS. Při přechodu přímo z původních `headerFooter.css?v=2.82` a `header-mobile-gaelta.js?v=0.89` použijte místo původního CSS rovnou v2 a místo původního JS verzi hlavičky v1 podle [HEADER-INSTALL.md](HEADER-INSTALL.md).

## Ukázkové hodnocení

Uživatel výslovně zadal pro tento pilot **4,9/5 (102 recenzí)** jako ukázková data. Řádek je viditelně označen `Ukázka`, přístupný název říká `Ukázková data hodnocení obchodu`; nejde o ověřené hodnocení produktu ani obchodu. Nezapisuje se `AggregateRating` ani jiné hodnoticí schema. Před produkčním publikováním ukázku odstraňte nebo nahraďte ověřeným skutečným zdrojem ve schválené další dávce. Produktová data se do této ukázky nezahrnují.

## Ověření a návrat v1

Rozsah standardního ověření a skutečný výsledek najdete v [TESTING.md](TESTING.md). Testovací obchod je chráněný vstupem; veřejná produkční stránka umožňuje ověřit DOM s lokálně dosazenými soubory. To nepotvrzuje shodu jeho konfigurace ani reálnou mutaci košíku/varianty testovacího obchodu.

Sdružená browser kontrola prošla na 360/394/430/768/1280 px: odstraněný prázdný prostor hlavičky, mobilní breadcrumbs a typografie, galerie se skutečným přepnutím fotografie, původní desktop a rozložení bez přetečení. Zdrojový obsah fotografie zůstává skutečný produktový obsah, včetně videí přidaných dosavadními skripty.

Cílené datové regrese také prošly: změna skutečného H1 a fallback, nativní náhrada ceny/dostupnosti při zachování identity a barvy nových uzlů, návrat na desktop a zpět s jedinou dostupností/cenou, neaktivní pilot na jiném produktu a původní stránka košíku. Pilot chrání nové uzly před znovuvložením konkrétních starých referencí původním resize skriptem. Přepnutí fotografie pagination i výběr původní video položky prošly; samotné síťové přehrání videa se netestovalo. Fallback bez Swiperu prošel syntetickým odstraněním jeho wrapperu nad produkčním DOM, nikoli v přihlášeném testovacím obchodě. Podrobnosti a podklady jsou v [TESTING.md](TESTING.md).

Návrat k hlavičce v1: odstraňte produktové CSS a JS odkazy a vraťte CSS hlavičky z v2 na v1. Hlavičkový JS v1 ponechte. Úplný návrat původního řešení: obnovte oba původní odkazy z [HEADER-INSTALL.md](HEADER-INSTALL.md). Obnovte stránku; původní obsah a logo administrace jsou zachované.

Balíček vznikl lokálně. Upload, publikování, commit ani push nebyly provedeny.

Při kontrole veřejné produkční stránky se potvrdila již existující chyba resize v původním price/swipe skriptu v154 (`updateSlides` při `alignToCurrent`). Stejná chyba nastává i bez produktového balíčku; jeho obsluhu galerie tento pilot nepřepisuje. Výsledek a odlišnou konfiguraci testovacího obchodu viz [TESTING.md](TESTING.md).
