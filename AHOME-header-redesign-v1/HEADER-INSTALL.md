# AHOME mobilní hlavička v1

Lokální balíček pro Shoptet, podle Figma `joSFQnFtYp4wqVpWU841pF`, uzel `162:25563`. Mobilní hlavička pod 768 px má výšku 64 px, bílé pozadí, vodorovné odsazení 16 px, logo se sloganem 159 × 31 px a původní ovládání v pořadí hledání → košík → menu. Dotykové plochy mají 48 × 48 px; badge používá skutečný nativní počet položek. Při prázdném košíku se badge nevytváří. Pokladna používá dosavadní zjednodušenou hlavičku.

## Soubory k nahrání

| Lokální soubor | Cílová cesta v Shoptetu |
| --- | --- |
| `headerFooter-redesign-v1.css` | `/user/documents/upload/gaelta/headerFooter-redesign-v1.css` |
| `header-mobile-gaelta-redesign-v1.js` | `/user/documents/upload/gaelta/header-mobile-gaelta-redesign-v1.js` |
| `assets/header-v1/logo-slogan.svg` | `/user/documents/upload/gaelta/header-redesign-v1/logo-slogan.svg` |
| `assets/header-v1/search.svg` | `/user/documents/upload/gaelta/header-redesign-v1/search.svg` |
| `assets/header-v1/cart.svg` | `/user/documents/upload/gaelta/header-redesign-v1/cart.svg` |
| `assets/header-v1/menu.svg` | `/user/documents/upload/gaelta/header-redesign-v1/menu.svg` |

Nahrajte nejprve všech šest souborů. Zachovejte původní soubory, nativní logo v administraci a ostatní vložené CSS/JS. Relativní cesty ikon v CSS předpokládají přesné umístění podle tabulky. Logo v JS používá uvedenou absolutní cestu vůči doméně obchodu.

## Nahrazení odkazů

V nastavení vlastního HTML nahraďte pouze hodnoty `href` a `src` těchto dvou odkazů. Zachovejte ostatní atributy, pozici a pořadí načítání.

Původní odkazy:

```html
<link rel="stylesheet" href="/user/documents/upload/gaelta/headerFooter.css?v=2.82">
<script src="/user/documents/upload/gaelta/header-mobile-gaelta.js?v=0.89" defer></script>
```

Nové odkazy:

```html
<link rel="stylesheet" href="/user/documents/upload/gaelta/headerFooter-redesign-v1.css?v=1">
<script src="/user/documents/upload/gaelta/header-mobile-gaelta-redesign-v1.js?v=1" defer></script>
```

Používáte-li ve stávajících odkazech absolutní CDN adresu, změňte pouze název souboru a parametr verze. Každý nový odkaz musí nahradit příslušný původní odkaz. Nenačítejte oba JS současně: nová verze již obsahuje stávající checkout, košík a upsell úpravy. Nové CSS obsahuje celý původní soubor a mobilní úpravy doplněné na konci.

## Kontrola před publikováním

V testovacím obchodě podle [TESTING.md](TESTING.md) ověřte mobil 360/394/430 px, desktop od 768 px, hledání, menu a košík. Ověřte prázdný i naplněný košík, změnu počtu položek, vyšší víceřádkové oznámení `.site-msg`, jeho zavření a checkout. SVG musí vracet HTTP 200 a správné rozměry. Pokud testovací obchod chrání vstupní heslo, proveďte kontrolu v oprávněné přihlášené relaci.

Původní logo zůstává v DOM; nové SVG se zobrazuje pouze v mobilní hlavičce. Nativní wrapper košíku se na mobilu přesouvá mezi hledání a menu a na desktopu vrací na původní místo. Modul čeká na mobilní logo vytvořené šablonou Venus; není-li potřebná struktura dostupná, nechá původní hlavičku.

## Návrat původní verze

Vraťte oba odkazy na původní názvy a verze výše a obnovte stránku. Protože se původní soubory ani logo v administraci nepřepisují, není potřebná žádná změna obsahu obchodu. Nové soubory lze ponechat nahrané pro další testování.

Tento balíček byl vytvořen lokálně; nahrání ani publikování neproběhlo. Ověření na produkčním DOM s lokálně dosazenými soubory nenahrazuje kontrolu konfigurace testovacího obchodu.

Lokální browser kontrola prošla v izolovaném Edge: mobil 360/394/430 px, desktop 768/1280 px, nativní hledání/menu, návrat košíku při změně šířky, zavření a změna výšky oznámení, detail produktu a zjednodušená stránka košíku. Badge prošel syntetickou náhradou nativního košíkového odkazu. Podrobnosti a podklady jsou v [TESTING.md](TESTING.md) a `verification/`. Přihlášené vykreslení testovacího obchodu a skutečná změna položek košíku zatím ověřeny nebyly; patří do kontroly před publikováním.

Lokální kopie původních test-shop souborů jsou v `backup-original-test-shop/`. Slouží pro porovnání a zálohu; při instalaci je nenahrávejte. SHA-256 původního CSS: `F038F1ECDB99E050522D7E9C65B432BF33DCEA480D8F9F0101B29CFDD8D111B6`, původního JS: `AF4FD032A8EF417687A200995CBBDAE9C35D1BF578658D6128B6FBDA5455F04E`.
