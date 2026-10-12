/* site msg move */
document.addEventListener("DOMContentLoaded", function () {
  const isMobile = window.innerWidth <= 768;
  const siteMsg = document.querySelector(".site-msg");
  const header = document.querySelector(".top-navigation-bar");
  const cartCount = document.querySelector(".cart-count");
  const navigation = document.querySelector("#navigation");
  const headerOF = document.querySelector("#header");
  const closeBtn = document.querySelector(".js-close-information-msg");

  if (isMobile && siteMsg && header && header.parentElement) {
    header.parentElement.insertBefore(siteMsg, header);

    if (cartCount) cartCount.style.setProperty("top", "34px", "important");
    if (header) header.style.setProperty("top", "34px", "important");
    headerOF.style.setProperty("margin-bottom", "30px", "important");
    if (navigation) {
      navigation.style.setProperty("top", "82px", "important");
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      siteMsg.style.display = "none";

      if (cartCount) cartCount.style.setProperty("top", "0", "important");
      if (header) header.style.setProperty("top", "0", "important");
      headerOF.style.setProperty("margin-bottom", "0px", "important");
      if (navigation && isMobile) {
        navigation.style.setProperty("top", "52px", "important");
      }
    });
  }
});

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
