/* AHOME mobile header v1. Keep native controls and cart markup/handlers. */
(function () {
  if (window.ahomeHeaderV1) {
    window.ahomeHeaderV1.refresh();
    return;
  }

  const root = document.documentElement;
  const media = window.matchMedia("(max-width: 767px)");
  let frame = 0;
  let cartHome = null;
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
    if (cartHome && cartHome.parentNode && cartWrapper) {
      cartHome.parentNode.insertBefore(cartWrapper, cartHome);
      cartHome.remove();
    }
    cartHome = null;
    cartWrapper = null;
  }

  function refresh() {
    frame = 0;
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
    const checkout = ["cart", "billingAndShipping", "customerDetails"].includes(pageType);
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
      if (!logoLink.querySelector(".ahome-header-v1-logo")) {
        const image = document.createElement("img");
        image.className = "ahome-header-v1-logo";
        image.src = "/user/documents/upload/gaelta/header-redesign-v1/logo-slogan.svg";
        image.alt = "Ahome – Vyrábíme radost";
        image.decoding = "async";
        logoLink.appendChild(image);
      }
      if (!cartHome) {
        cartHome = document.createComment("AHOME cart original position");
        nativeCartWrapper.parentNode.insertBefore(cartHome, nativeCartWrapper);
        cartWrapper = nativeCartWrapper;
      }
      if (cartWrapper.parentNode !== tools || cartWrapper.nextElementSibling !== menu) {
        tools.insertBefore(cartWrapper, menu);
      }
    } else {
      restoreCart();
    }
    root.classList.toggle("ahome-header-v1-mobile", enabled);
    const barHeight = enabled ? 64 : (bar ? bar.getBoundingClientRect().height : 52);
    setVariable("--ahome-header-v1-bar-height", barHeight + "px");
  }

  function init() {
    const observer = new MutationObserver(schedule);
    // Observe replacements and native cart counts without changing their values.
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
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

/*Posun "Skladem cez mobil" */

document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 768) {
    const availability = document.querySelector(".availability-value");
    const priceWrapper = document.querySelector(".p-final-price-wrapper");
    const addToCart = document.querySelector(".add-to-cart");

    if (availability && priceWrapper && addToCart) {
      addToCart.parentNode.insertBefore(availability, addToCart);
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

//Popup modal pre darcek - Presun akce
document.addEventListener("DOMContentLoaded", function () {
  if (getShoptetDataLayer().pageType === "productDetail") {
    const observer = new MutationObserver((mutations, obs) => {
      const popup = document.querySelector(
        "#cboxLoadedContent .up-product-modal",
      );
      const image = document.querySelector(".up-product-modal-images img");
      const flag = document.querySelector(
        ".up-product-modal-information .flags",
      );

      if (popup && image && flag) {
        image.parentElement.style.position = "relative";

        flag.style.position = "absolute";
        flag.style.top = "0";
        flag.style.left = "0";
        flag.style.zIndex = "10";

        image.parentElement.appendChild(flag);
        obs.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
});

// Kosik - details - pokladna - Header prerabka bez menu ako na starom ahome
document.addEventListener("DOMContentLoaded", function () {
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
