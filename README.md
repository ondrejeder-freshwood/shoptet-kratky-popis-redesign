# AHOME – úpravy vzhledu Shoptetu

- Aktuální lokální verze: **v20**.
- Soubory pro nasazení jsou ve složce `AHOME-product-top-pilot-v20/`.
- Starší verze a původní zálohy jsou lokálně v `old files/` a neukládají se na GitHub.
- Výsledky kontrol a ověřovací skripty ve `verification/` zůstávají pouze lokálně.

## Co který soubor dělá

- **CSS/headerFooter-redesign.css** – vzhled hlavičky, menu, drobečkové navigace a hlavičky košíku.
- **JS/headerFooter-redesign.js** – chování hlavičky, hledání a menu; obsahuje také zachované původní úpravy košíku a objednávky.
- **CSS/kratky-popis.css** – vzhled produktové stránky: název, galerie, cena, dostupnost, benefity a doplňková nabídka.
- **JS/kratky-popis.js** – propojení nového vzhledu s původními údaji a ovládáním produktu.
- **html-editor/** – připravený obsah Záhlaví a Zápatí pro HTML editor Shoptetu.
- **Ikonky/** – všech 12 používaných SVG log a ikon, součást v20.

## Před nasazením

- Ulož celý aktuální obsah **Záhlaví a Zápatí** z administrace.
- Stáhni zálohu čtyř CSS/JS souborů, které budeš přepisovat, a případných přepisovaných ikon.
- Původní soubory obchodu a logo v administraci zachovej.

## Jak nasadit

- Nejdřív změny vyzkoušej na testovacím obchodě.
- Obsah `CSS/` nahraj do `/user/documents/upload/CSS/`.
- Obsah `JS/` nahraj do `/user/documents/upload/JS/`.
- Obsah `Ikonky/` nahraj do `/user/documents/upload/Ikonky/`.
- Zachovej přesné názvy souborů i velikost písmen.
- V HTML editoru porovnej připravené Záhlaví/Zápatí s aktuálním obsahem. Zachovej ostatní skripty a nastavení obchodu; na ostrém webu nepřepisuj celé bloky testovací kopií.
- Načítej každé naše CSS/JS pouze jednou. Připravené HTML používá hlavičku `?v=20.4` a produktové soubory `?v=20.1`.

## Kontrola a návrat

- Na mobilu i počítači ověř hlavičku, hledání, menu, produkt, galerii a košík.
- Úplná kontrola před nasazením je v [TESTING.md](TESTING.md).
- Při potížích obnov zálohované soubory i Záhlaví/Zápatí.
- Ukázkové hodnocení před ostrým nasazením nahraď skutečnými daty nebo odstraň.
