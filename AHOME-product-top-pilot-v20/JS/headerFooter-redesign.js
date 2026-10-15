/* AHOME mobile header v1. Keep native controls and cart markup/handlers. */
(function () {
  if (window.ahomeHeaderV1) {
    window.ahomeHeaderV1.refresh();
    return;
  }

  const root = document.documentElement;
  const hosts = ["744953.myshoptet.com", "www.ahome.cz"];
  let desktopMenuKey = "";
  let observedHeader = null;
  const headerObserver = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
  const layoutObserver = new MutationObserver(schedule);
  let observedLayout = [];
  const media = window.matchMedia("(max-width: 767px)");
  let frame = 0;
  let cartWrapper = null;
  let messageHome = null;
  let siteMessage = null;
  let observedMessage = null;
  const messageObserver = typeof ResizeObserver === "function"
    ? new ResizeObserver(schedule)
    : null;

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(refresh);
  }

  function setVariable(name, value) {
    if (root.style.getPropertyValue(name) !== value) {
      root.style.setProperty(name, value);
    }
  }

  function restoreCart() {
    cartWrapper = null;
    root.style.removeProperty("--ahome-header-cart-left");
  }

  function resetDesktopMenu() {
    root.classList.remove('ahome-desktop-menu-v9');
    ['--ahome-menu-left', '--ahome-menu-width', '--ahome-menu-helper-left', '--ahome-menu-top'].forEach(name => root.style.removeProperty(name));
    desktopMenuKey = '';
    if (headerObserver) headerObserver.disconnect();
    observedHeader = null;
  }

  function updateDesktopMenu(checkout) {
    if (checkout || !hosts.includes(location.hostname) || window.innerWidth < 768) { resetDesktopMenu(); return; }
    const wrapper = document.querySelector('#header .navigation-wrapper');
    const logo = document.querySelector('#header .site-name > a');
    const controls = document.querySelector('#header .navigation-buttons');
    const menu = document.querySelector('#header .navigation-in > .menu-level-1');
    const helper = document.querySelector('#header .menu-helper');
    const nativeMenu = window.shoptet && window.shoptet.menu;
    if (!wrapper || !logo || !controls || !menu || !helper) {
      resetDesktopMenu(); return;
    }
    root.classList.add('ahome-desktop-menu-v9');
    const helperLabel = helper.querySelector(':scope > span');
    if (helperLabel && helperLabel.textContent !== 'Další') helperLabel.textContent = 'Další';
    const box = wrapper.getBoundingClientRect();
    const logoBox = logo.getBoundingClientRect();
    const top = logoBox.top + logoBox.height / 2 - box.top;
    if (root.style.getPropertyValue('--ahome-menu-top') !== top + 'px') root.style.setProperty('--ahome-menu-top', top + 'px');
    const left = Math.max(0, logo.getBoundingClientRect().right - box.left + 24);
    const controlRects = Array.from(controls.querySelectorAll('.lupa, [data-target="search"], a.cart-count')).map(node => node.getBoundingClientRect()).filter(rect => rect.width > 0 && rect.height > 0);
    const controlsLeft = controlRects.length ? Math.min(...controlRects.map(rect => rect.left)) : controls.getBoundingClientRect().left;
    const right = Math.min(box.width, controlsLeft - box.left - 12);
    const helperWidth = helper.getBoundingClientRect().width;
    const helperLeft = Math.max(left, right - helperWidth);
    const items = Array.from(menu.children).filter(node => node.tagName === 'LI');
    const widths = items.map(node => {
      const style = getComputedStyle(node);
      return node.getBoundingClientRect().width + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
    });
    // Always leave at least the last category in the native helper dropdown.
    const budget = Math.max(0, helperLeft - left - 16);
    let width = 0;
    let visibleCount = 0;
    for (let index = 0; index < widths.length - 1; index += 1) {
      if (width + widths[index] > budget - 2) break;
      width += widths[index];
      visibleCount += 1;
    }
    const start = left + Math.max(0, (budget - width) / 2);
    const key = [start, width, helperLeft, helperWidth, items.length, ...widths].map(value => Math.round(value * 10) / 10).join('|');
    if (key !== desktopMenuKey) {
      desktopMenuKey = key;
      root.style.setProperty('--ahome-menu-left', start + 'px');
      root.style.setProperty('--ahome-menu-width', width + 'px');
      root.style.setProperty('--ahome-menu-helper-left', helperLeft + 'px');
      if (nativeMenu && typeof nativeMenu.updateMenu === 'function') nativeMenu.updateMenu();
    }
    // Use the existing native lists and handlers. Reapply the measured partition
    // after native resize splitting, even if the available width did not change.
    const helperItems = Array.from(helper.querySelectorAll(':scope > .menu-level-1 > li'));
    const overflow = new Map();
    items.forEach(function (item, index) {
      const hidden = index >= visibleCount;
      item.classList.toggle('splitted', hidden);
      const link = item.querySelector(':scope > a');
      if (link) overflow.set(link.getAttribute('href'), hidden);
    });
    helperItems.forEach(function (item) {
      const link = item.querySelector(':scope > a');
      if (link && overflow.has(link.getAttribute('href'))) {
        item.classList.toggle('splitted', !overflow.get(link.getAttribute('href')));
      }
    });
    // Native resize handlers may repeat splitMenu. Our measured bounds remain
    // authoritative through CSS; the helper stays keyboard-accessible.
    if (helper.getAttribute('aria-hidden') !== 'false') helper.setAttribute('aria-hidden', 'false');
    if (helper.getAttribute('tabindex') !== '0') helper.setAttribute('tabindex', '0');
    if (headerObserver && observedHeader !== wrapper) {
      headerObserver.disconnect();
      headerObserver.observe(wrapper);
      headerObserver.observe(logo);
      headerObserver.observe(controls);
      observedHeader = wrapper;
    }
  }

  function refreshBreadcrumbs() {
    // Shared breadcrumb format on every width; cart and checkout are excluded.
    const ordering = document.body.classList.contains("ordering-process") || document.body.classList.contains("in-kosik");
    const enabled = hosts.includes(window.location.hostname) && !ordering && !!document.querySelector(".breadcrumbs");
    root.classList.toggle("ahome-breadcrumbs-v1", enabled);
    // Use the actual content edge instead of a fixed desktop gutter.
    const breadcrumbWrapper = document.querySelector('.breadcrumbs-wrapper');
    const content = (document.body.classList.contains('type-category') && document.querySelector('#content h1')) || document.querySelector('#content');
    if (enabled && !media.matches && breadcrumbWrapper && content) {
      const padding = content.id === 'content' ? parseFloat(getComputedStyle(content).paddingLeft) || 0 : 0;
      const inset = Math.max(0, content.getBoundingClientRect().left + padding - breadcrumbWrapper.getBoundingClientRect().left);
      setVariable('--ahome-breadcrumb-inset', inset + 'px');
    } else {
      root.style.removeProperty('--ahome-breadcrumb-inset');
    }
    const home = document.querySelector('.breadcrumbs a.ahome-breadcrumb-home-link, .breadcrumbs a.navigation-home-icon, .breadcrumbs a[href="/"]');
    if (home) {
      const showHome = hosts.includes(window.location.hostname) && !ordering;
      home.classList.toggle('ahome-breadcrumb-home-link', showHome);
      const level = home.closest('[itemprop="itemListElement"]');
      if (level) level.classList.toggle('ahome-breadcrumb-home', showHome);
      if (showHome) {
        // Remove the native icon class and glyph children, preserving link/schema attributes.
        home.classList.remove('navigation-home-icon');
        const label = home.querySelector('[itemprop="name"], .sr-only') || document.createElement('span');
        label.classList.remove('sr-only');
        if (label.textContent !== 'Domů') label.textContent = 'Domů';
        if (home.childNodes.length !== 1 || home.firstChild !== label) home.replaceChildren(label);
      }
    }
    // When a parent and child category share a name, the parent level is hidden.
    const levels = Array.from(document.querySelectorAll('.breadcrumbs > [itemprop="itemListElement"]'));
    levels.forEach(function (level, index) {
      const name = level.querySelector('[itemprop="name"]');
      const nextName = levels[index + 1] && levels[index + 1].querySelector('[itemprop="name"]');
      const duplicate = enabled && !level.contains(home) && !!(name && nextName && name.textContent.trim() === nextName.textContent.trim());
      if (level.classList.contains("ahome-breadcrumb-duplicate") !== duplicate) level.classList.toggle("ahome-breadcrumb-duplicate", duplicate);
    });
  }

  function renderCartHeader(cartPage) {
    root.classList.toggle('ahome-cart-header-v20', cartPage);
    if (!cartPage) return;
    const row = document.querySelector('#header .header-top');
    if (!row) return;
    // The native mobile header can move the logo into the top navigation bar.
    // Bring the same node back to the cart row before that bar is hidden.
    const logo = row.querySelector('.site-name') || document.querySelector('.top-navigation-bar .site-name');
    document.querySelectorAll('.ahome-cart-header-logo').forEach(function (other) {
      if (other !== logo) other.classList.remove('ahome-cart-header-logo');
    });
    if (logo) {
      if (!logo.classList.contains('ahome-cart-header-logo')) logo.classList.add('ahome-cart-header-logo');
      const link = logo.querySelector('a');
      if (link && !link.classList.contains('ahome-cart-logo-link')) link.classList.add('ahome-cart-logo-link');
    }
    if (logo && !row.contains(logo)) {
      const wrapper = row.querySelector(':scope > .site-name-wrapper');
      if (wrapper) wrapper.appendChild(logo);
      else row.insertBefore(logo, row.firstChild);
    }
    let back = row.querySelector(':scope > .ahome-cart-header-back');
    if (!back) {
      back = document.createElement('a');
      back.className = 'btn btn-back-to-shop ahome-cart-header-back';
      row.appendChild(back);
    }
    const href = document.querySelector('.btn.next-step-back')?.getAttribute('href') || '/';
    if (back.getAttribute('href') !== href) back.setAttribute('href', href);
    if (back.textContent !== '‹  Zpět do e-shopu') back.textContent = '‹  Zpět do e-shopu';
  }

  function observeLayout() {
    const nodes = ['#header','.top-navigation-bar','.breadcrumbs-wrapper','.site-msg'].map(selector=>document.querySelector(selector)).filter(Boolean);
    if (nodes.length===observedLayout.length && nodes.every((node,index)=>node===observedLayout[index])) return;
    layoutObserver.disconnect();
    nodes.forEach(node=>layoutObserver.observe(node,{childList:true,subtree:true,characterData:true,...(node.id==='header'||node.classList.contains('top-navigation-bar')?{attributes:true,attributeFilter:['class']}:{})}));
    observedLayout = nodes;
  }

  function refresh() {
    frame = 0;
    observeLayout();
    refreshBreadcrumbs();
    const mobile = media.matches;
    const bar = document.querySelector(".top-navigation-bar");
    siteMessage = document.querySelector(".site-msg");

    if (messageObserver && siteMessage !== observedMessage) {
      messageObserver.disconnect();
      if (siteMessage) messageObserver.observe(siteMessage);
      observedMessage = siteMessage;
    }
    if (mobile && siteMessage && bar && bar.parentNode) {
      if (!messageHome) {
        messageHome = document.createComment("AHOME site message original position");
        siteMessage.parentNode.insertBefore(messageHome, siteMessage);
      }
      if (siteMessage.nextElementSibling !== bar) {
        bar.parentNode.insertBefore(siteMessage, bar);
      }
    } else if (!mobile && messageHome && messageHome.parentNode && siteMessage) {
      messageHome.parentNode.insertBefore(siteMessage, messageHome);
      messageHome.remove();
      messageHome = null;
    }

    const messageHeight = mobile && siteMessage && siteMessage.getClientRects().length
      ? siteMessage.getBoundingClientRect().height
      : 0;
    setVariable("--ahome-header-v1-message-height", messageHeight + "px");
    root.classList.toggle("ahome-header-v1-offsets", mobile);

    const pageType = typeof getShoptetDataLayer === "function"
      ? getShoptetDataLayer().pageType
      : "";
    const checkout = ["cart", "billingAndShipping", "customerDetails"].includes(pageType) || document.body.matches(".ordering-process, .in-kosik");
    renderCartHeader(pageType === 'cart' || document.body.classList.contains('in-kosik'));
    updateDesktopMenu(checkout);
    const tools = bar && bar.querySelector(".responsive-tools");
    const logoLink = tools && tools.querySelector(".site-name a");
    const search = tools && tools.querySelector('a[data-target="search"]');
    const menu = tools && tools.querySelector('a[data-target="navigation"]');
    const nativeCartWrapper = cartWrapper && cartWrapper.isConnected
      ? cartWrapper
      : document.querySelector("#header .navigation-buttons");
    const cart = nativeCartWrapper && nativeCartWrapper.querySelector('a.cart-count[data-target="cart"]');
    const enabled = Boolean(mobile && !checkout && logoLink && search && menu && cart);

    if (enabled) {
      cartWrapper = nativeCartWrapper;
      // Keep the native cart inside #header so Shoptet can update it after AJAX.
    } else {
      restoreCart();
    }
    root.classList.toggle("ahome-header-v1-mobile", enabled);
    if (enabled) {
      setVariable("--ahome-header-cart-left", (menu.getBoundingClientRect().left - cart.getBoundingClientRect().width) + "px");
    }
    const barHeight = bar ? bar.getBoundingClientRect().height : 52;
    setVariable("--ahome-header-v1-bar-height", barHeight + "px");
  }

  function init() {
    let switchingPanel = false;
    document.addEventListener("click", function (event) {
      if (switchingPanel || !(event.target instanceof Element)) return;
      const trigger = event.target.closest('[data-target="search"], [data-target="navigation"], #header .lupa, #header .menu-helper');
      if (!trigger) return;
      const openingSearch = trigger.matches('[data-target="search"], .lupa');
      const body = document.body;
      const selectors = openingSearch
        ? (body.classList.contains('menu-helper-visible') ? '#header .menu-helper' : '[data-target="navigation"]')
        : '[data-target="search"], #header .lupa';
      const oppositeOpen = openingSearch
        ? body.classList.contains('navigation-window-visible') || body.classList.contains('menu-helper-visible')
        : body.classList.contains('search-window-visible');
      if (!oppositeOpen) return;
      const opposite = Array.from(document.querySelectorAll(selectors)).find(node => node.getClientRects().length && node.getBoundingClientRect().width > 0);
      if (!opposite) return;
      switchingPanel = true;
      try { opposite.click(); } finally { switchingPanel = false; }
    }, true);
    // Header/cart counts and breadcrumbs are watched in their own subtrees.
    // Native content events below reconnect observers after replacements.
    const shellObserver = new MutationObserver(schedule);
    shellObserver.observe(document.body, {childList:true});
    document.addEventListener("click", function (event) {
      if (event.target instanceof Element && event.target.closest(".js-close-information-msg")) {
        const message = document.querySelector(".site-msg");
        if (message) message.style.display = "none";
        schedule();
      }
    });
    refresh();
  }

  window.ahomeHeaderV1 = { refresh: schedule };
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  ["ShoptetCartUpdated", "ShoptetDOMCartContentLoaded", "ShoptetDOMContentLoaded"].forEach(function (name) {
    document.addEventListener(name, schedule);
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

/*Zmena popup kosik text */
document.addEventListener("ShoptetDOMAdvancedOrderLoaded", function () {
  const suggestionDiv = document.querySelector(
    "#cboxLoadedContent .advanced-order .advanced-order-suggestion",
  );
  if (suggestionDiv) {
    suggestionDiv.textContent = "S tímto produktem ostatní kupují";
  }
});

/*Zmena textu kosik > info > checkout */
function textInCheckout() {
  if (getShoptetDataLayer().pageType === "cart") {
    const checkoutBtn = document.querySelector("#continue-order-button");
    const cartStep1 = document.querySelector(".step-0 .step-1 span");
    const cartStep2 = document.querySelector(".step-0 .step-2 span");
    const cartStep3 = document.querySelector(".step-0 .step-3 span");
    if (checkoutBtn) {
      checkoutBtn.textContent = "VYPLNIT DOPRAVU A PLATBU";
    }
    if (cartStep1) {
      cartStep1.innerHTML = "Souhrn <br>košíku";
    }
    if (cartStep2) {
      cartStep2.innerHTML = "Doprava <br>a platba";
    }
    if (cartStep3) {
      cartStep3.innerHTML = "Sumarizace <br>a dokončení";
    }
  }
  if (getShoptetDataLayer().pageType === "billingAndShipping") {
    const checkoutBtn = document.querySelector("#orderFormButton");
    const cartStep1 = document.querySelector(".step-0 .step-1 span");
    const cartStep2 = document.querySelector(".step-0 .step-2 span");
    const cartStep3 = document.querySelector(".step-0 .step-3 span");
    if (checkoutBtn) {
      checkoutBtn.textContent = "POKRAČOVAT";
    }
    if (cartStep1) {
      cartStep1.innerHTML = "Souhrn <br>košíku";
    }
    if (cartStep2) {
      cartStep2.innerHTML = "Doprava <br>a platba";
    }
    if (cartStep3) {
      cartStep3.innerHTML = "Sumarizace <br>a dokončení";
    }
  }
  if (getShoptetDataLayer().pageType === "customerDetails") {
    const checkoutBtnfirst = document.querySelector(
      "#submit-order .order-button-text",
    );
    const checkoutBtnSecond = document.querySelector(
      "#submit-order .order-button-suffix",
    );
    const cartStep1 = document.querySelector(".step-0 .step-1 span");
    const cartStep2 = document.querySelector(".step-0 .step-2 span");
    const cartStep3 = document.querySelector(".step-0 .step-3 span");

    if (checkoutBtnfirst && checkoutBtnSecond) {
      checkoutBtnfirst.textContent = "ODESLAT OBJEDNÁVKU";
      checkoutBtnSecond.textContent = "";
      checkoutBtnSecond.style.fontSize = "0px";
    }

    if (cartStep1) {
      cartStep1.innerHTML = "Souhrn <br>košíku";
    }
    if (cartStep2) {
      cartStep2.innerHTML = "Doprava <br>a platba";
    }
    if (cartStep3) {
      cartStep3.innerHTML = "Sumarizace <br>a dokončení";
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  textInCheckout();
});

document.addEventListener("ShoptetDOMCartContentLoaded", function () {
  textInCheckout();
});

document.addEventListener("ShoptetCartUpdated", function () {
  textInCheckout();
});

/*Zmena dakovka text */
document.addEventListener("DOMContentLoaded", function () {
  if (getShoptetDataLayer().pageType === "thankYou") {
    const suggestionDiv = document.querySelector(".order-summary-heading");
    if (suggestionDiv) {
      suggestionDiv.textContent = "Objednávka přijata";
    }
    const recapWrapper = document.querySelector(
      '[data-testid="recapTable"].recapitulation-wrapper',
    );
    if (!recapWrapper) return;

    const paymentMethod = recapWrapper.querySelector(
      '[data-testid="recapPaymentMethod"] strong',
    );
    if (
      paymentMethod &&
      paymentMethod.textContent.trim().toLowerCase() === "převodem"
    ) {
      const orderDiv = recapWrapper.querySelector(".co-order");
      const paymentDiv = recapWrapper.querySelector(".co-payment-method");

      if (orderDiv && paymentDiv) {
        recapWrapper.insertBefore(paymentDiv, orderDiv);
      }
    }
  }
});

/*Posun page produkt */
document.addEventListener("ShoptetPageMoreProductsRequested", function () {
  setTimeout(function () {
    const overlay = document.querySelector(".overlay.spinner");
    if (overlay) {
      overlay.style.display = "none";
      overlay.remove();
    }
  }, 50);
});

/*Text zmena detail na variant */
function zmenaTextuDetailNaVariant() {
  const buttons = document.querySelectorAll(".p-tools a.btn-primary");
  if (buttons.length === 0) return;
  buttons.forEach((btn) => {
    btn.innerText = "VYBRAT";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(zmenaTextuDetailNaVariant, 50);
});

document.addEventListener("ShoptetDOMContentLoaded", function () {
  setTimeout(zmenaTextuDetailNaVariant, 50);
});

document.addEventListener("ShoptetDOMPageMoreProductsLoaded", function () {
  setTimeout(zmenaTextuDetailNaVariant, 50);
});

document.addEventListener("ShoptetPageMoreProductsRequested", function () {
  setTimeout(zmenaTextuDetailNaVariant, 50);
});

document.addEventListener("DOMContentLoaded", function () {
  if (getShoptetDataLayer().pageType === "article") {
    const articleContent = document.querySelector("h1");
    if (articleContent) {
      articleContent.style.marginBottom = "20px";
      articleContent.style.marginTop = "20px";
    }
  }
});

/* Posun firmy */
document.addEventListener("DOMContentLoaded", function () {
  if (getShoptetDataLayer().pageType === "customerDetails") {
    const companyField = document.querySelector(".company-shopping");
    const moveAfter = document.querySelector(".co-billing-address > div");
    const noteField = document.querySelector("#note textarea");

    noteField.setAttribute("placeholder", "Poznámka");
    if (companyField && moveAfter) {
      moveAfter.parentNode.insertBefore(companyField, moveAfter.nextSibling);
      companyField.style.marginBottom = "0px";
    }
  }
});

// Upsell checkboxes
function initUpsellCheckboxes() {
  if (getShoptetDataLayer().pageType !== "cart") return;

  document
    .querySelectorAll(".fvDoplnek-upsell input[type='checkbox']")
    .forEach((cb, i) => {
      if (cb.nextElementSibling && cb.nextElementSibling.tagName === "LABEL")
        return;

      if (!cb.id) cb.id = "upsell-cb-" + i;

      const label = document.createElement("label");
      label.setAttribute("for", cb.id);

      cb.insertAdjacentElement("afterend", label);
    });
}

window.addEventListener("load", initUpsellCheckboxes);

const observer = new MutationObserver(initUpsellCheckboxes);
observer.observe(document.body, { childList: true, subtree: true });

// Doprava a platba + kosik
document.addEventListener("DOMContentLoaded", function () {
  if (
    getShoptetDataLayer().pageType === "billingAndShipping" ||
    getShoptetDataLayer().pageType === "customerDetails"
  ) {
    document.querySelectorAll(".cart-item a").forEach((link) => {
      link.href = "#";
      link.style.pointerEvents = "none";
    });
  }
});

// Kosik - details - pokladna - Header prerabka bez menu ako na starom ahome
document.addEventListener("DOMContentLoaded", function () {
  // Only the cart gets the new header; subsequent checkout steps keep this code.
  if (getShoptetDataLayer().pageType === "cart") {
    window.ahomeHeaderV1.refresh();
    return;
  }
  if (
    getShoptetDataLayer().pageType === "cart" ||
    getShoptetDataLayer().pageType === "billingAndShipping" ||
    getShoptetDataLayer().pageType === "customerDetails"
  ) {
    const header = document.querySelector("#header");
    const headerTop = document.querySelector(".header-top");
    const cartCount = document.querySelector(".cart-count");
    const navButtons = headerTop.querySelector(".navigation-buttons");
    const navigation = header.querySelector("#navigation");
    const mobileHeader = document.querySelector(".top-navigation-bar");
    const phone = header.querySelector(".project-phone");

    //DEsign
    if (navigation) navigation.style.display = "none";
    if (navButtons) navButtons.style.display = "none";
    if (mobileHeader) {
      mobileHeader
        .querySelector(".responsive-tools a[data-target='search']")
        ?.style.setProperty("display", "none");
      mobileHeader
        .querySelector(".responsive-tools a[data-target='navigation']")
        ?.style.setProperty("display", "none");
    }
    header.querySelector(".menu-helper").style.display = "none";
    if (phone) {
      phone.style.display = "none";
    }
    headerTop.style.alignItems = "center";

    if (window.innerWidth > 768 && headerTop) {
      const phoneItem = document.createElement("div");
      phoneItem.className = "header-phone-desktop";
      phoneItem.innerHTML = `<img src="/user/documents/upload/gaelta/phone-calling-rounded-svgrepo-com.svg" alt="Phone" class="phone-icon" /><a href="tel:+420511444919">+420 511 444 919</a>`;
      headerTop.insertBefore(phoneItem, headerTop.firstChild);
    }
    //Button
    if (headerTop) {
      createHeader("desktop");
    }

    //if mobile
    if (window.innerWidth <= 768) {
      createHeader("mobile");
    }
  }
});

function createHeader(data) {
  const headerTop = document.querySelector(".header-top");

  const backButton = document.createElement("a");
  if (getShoptetDataLayer().pageType === "cart") {
    const backLink = document
      .querySelector(".btn.next-step-back")
      ?.getAttribute("href");
    backButton.href = backLink;
    if (!backLink) backButton.href = "/";
  } else if (getShoptetDataLayer().pageType === "billingAndShipping") {
    backButton.href = "/";
  } else if (getShoptetDataLayer().pageType === "customerDetails") {
    backButton.href = "/";
  }

  backButton.className = "btn btn-back-to-shop";
  backButton.textContent = "Zpět do eshopu";

  if (data === "desktop") {
    headerTop.appendChild(backButton);
    backButton.style.padding = "0px 6px";
    backButton.style.width = "fit-content";
    backButton.style.height = "24px";
    backButton.style.lineHeight = "22px";
  } else {
    const mobileHeader = document.querySelector(
      ".top-navigation-bar .responsive-tools",
    );
    document.querySelectorAll(".site-name").forEach((el) => {
      el.style.setProperty("left", "0px", "important");
    });
    mobileHeader.style.justifyContent = "space-evenly";
    backButton.style.position = "relative";
    backButton.style.color = "white";
    backButton.style.padding = "0px 3px";
    backButton.style.fontSize = "11px";
    backButton.style.width = "fit-content";
    backButton.style.height = "22px";
    backButton.style.lineHeight = "20px";
    mobileHeader.appendChild(backButton);
  }
}
