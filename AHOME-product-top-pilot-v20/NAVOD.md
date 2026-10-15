# V20 – oprava společné hlavičky a rozdělení odpovědností

Aktualizace existující v20 dne 15. 10. 2026. Nevzniká složka v21. Všechny čtyři funkční soubory jsou nyní v této složce.

## Poslední úprava D31 – jedno logo, zarovnání na obsah, první vykreslení košíku

D31: od 768 px se drobečky měří podle skutečné levé hrany nadpisu kategorie (na jiných stránkách podle obsahového bloku), bez pevného odsazení. V košíku se zobrazuje pouze jeden označený nativní odkaz s SVG logem; další loga/odkazy, nativní obrázky a pseudoprvky jsou skryté. Bílý 52px styl se aktivuje přímo podle serverové body.in-kosik ještě před spuštěním JS. Cache obou hlavičkových souborů 20.4. Minimum kontroly; podklady ../../verification/v20/header-logo-alignment/.

Aktualizace z předchozí v20: nahraď jen CSS/headerFooter-redesign.css a JS/headerFooter-redesign.js a v záhlaví změň jejich dva cache parametry na ?v=20.4. Produktové soubory ani zápatí se touto dávkou nemění (zůstávají ?v=20.1).

- Drobečky mají stejný textový formát s lomítky i na tabletu/desktopu; rozměry vnějšího mobilního obalu zůstávají mobilní.
- V obou nativních stavech otevřeného hledání (search-visible a search-window-visible) je Další včetně potomků skryté a neinteraktivní, jeho šířka se pro měření menu zachovává.
- Jen stránka košíku má novou bílou 52px hlavičku: existující SVG logo a gradientní pilulka ‹ Zpět do e-shopu, 155 × 32 px, Montserrat 700/12. Vychází z mobilní Figmy 83:6761; širší zobrazení je schválené přizpůsobení stejného řádku. Další kroky checkoutu a obsah/logika košíku se nemění.
- Na výslovnou žádost jen syntaxe JS, struktura CSS, diff a odkazy PASS; browser ani vizuální QA neprovedeny. Zobrazení ověří uživatel. Podklady: ../../verification/v20/header-cart52/summary.md.

## Co nahradit (úplná v20)

| Lokální soubor | Stávající cesta na serveru |
| --- | --- |
| CSS/headerFooter-redesign.css | /user/documents/upload/CSS/headerFooter-redesign.css |
| JS/headerFooter-redesign.js | /user/documents/upload/JS/headerFooter-redesign.js |
| CSS/kratky-popis.css | /user/documents/upload/CSS/kratky-popis.css |
| JS/kratky-popis.js | /user/documents/upload/JS/kratky-popis.js |

Nahraď všechny čtyři jako jeden celek. Hlavičkový JS je nově součástí této v20; nenechávej na serveru jeho původní obsah z v18. SVG zůstávají stejné a všech 12 je nyní součástí této v20 ve složce Ikonky/; na server patří do /user/documents/upload/Ikonky/. Před výměnou zálohuj aktuální serverové soubory a HTML.

## Je nutná změna HTML?

Cesty a názvy se nemění, ale server u těchto souborů vrací Cache-Control: public, max-age=31536000. Samotná výměna obsahu proto návštěvníkům s uloženou kopií nezaručuje aktualizaci. V existujících odkazech změň jen parametr v:

- headerFooter-redesign.css?v=20 → headerFooter-redesign.css?v=20.4
- headerFooter-redesign.js?v=18 → headerFooter-redesign.js?v=20.4
- kratky-popis.css?v=20 → kratky-popis.css?v=20.1
- kratky-popis.js?v=20 → kratky-popis.js?v=20.1

První tři odkazy jsou v záhlaví, poslední v zápatí. Není třeba přidávat další tagy ani měnit ostatní HTML. Připravené html-editor/zahlavi-v20.html a zapati-v20.html obsahují právě tyto změny; záhlaví má 8 154 znaků z limitu 8 192. Pokud se od původní v20 mezitím změnila administrace, uprav pouze čtyři parametry v aktuálních blocích a nepřepisuj je starší kopií. Tvrdé obnovení aktualizuje vlastní prohlížeč, ne cache všech návštěvníků.

## Co je opraveno

- Hlavičkové CSS/JS vlastní měření navigace, přepočty a Další od 768 px na titulní stránce, kategoriích i produktech. Text má odsazení 12 px, hover/focus zaoblené rohy.
- Obecné drobečky Domů, stejný textový formát a deduplikace jsou společné na všech šířkách. Produkt řeší pouze vlastní zkrácený název a zachovává původní strukturovaná data.
- Produktové styly dostupnosti, poznámek a parametrů jsou v produktovém CSS. Původní jednorázový přesun dostupnosti odstraněn jako duplicitní vůči move/restore životnímu cyklu produktu. Úprava vlaječky produktového upsell modalu je v produktovém JS.
- Nepoužívaná pomocná varianta produktového loga a její úklid odstraněny po kontrole DOM; běžné logo hlavičky a administrativní logo se nemění.
- Nová obsluha sleduje příslušné podstromy hlavičky, drobečků a formuláře. Produktový modal sleduje vložení Colorbox portálu jen na produktu a po úspěchu se odpojí.
- Logika košíku/checkoutu a další nesouvisející původní JS zachovány. Jejich samostatné oddělení je odložené. Hlavička samotného košíku je nově upravená podle D29; hlavičky dalších objednávkových kroků zůstávají původní. Rozbalovací běžné menu se na košíku/checkoutu neaktivuje.

## Ověření a návrat

Syntaxe obou JS, statické rozdělení odpovědností a porovnání zachované původní části JS prošly. V izolovaném Chromium prohlížeči se načítá HTML pořízené z přihlášeného testshopu; čtyři naše zdroje se nahrazují lokálně na původních URL, bez přidání dalších opravných CSS nebo duplicitních JS. Titulní stránka, kategorie, produkt a košík zkontrolovány při 1280/768/1100/1600/393/1280/393 px. U košíku porovnán původní stav. Ověřena náhrada ceny/dostupnosti, oprava přepsaného labelu a přesunutí vlaječky modalu v lokálním DOM. Podrobné výsledky a omezení: ../../verification/v20/refactor/summary.md.

Před produkčním nasazením zůstává nutná plná L3 kontrola podle TESTING.md na cílové instalaci, zejména reálný upsell a naplněný košík/checkout. Upload, deploy, ZIP ani commit nebyly provedeny.

Pro návrat obnov čtyři soubory a předchozí parametry URL z vlastní zálohy. Lokální výchozí obsah před touto úpravou je uložen v ../../verification/v20/refactor/before.json; hlavičkový JS tam odpovídá dosavadní v18. Samotná změna parametru neobnoví starý obsah na serveru.
