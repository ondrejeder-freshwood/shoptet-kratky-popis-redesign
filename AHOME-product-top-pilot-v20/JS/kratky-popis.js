/* AHOME product top v13: native product identity, shared title and native product controls. */
(function () {
  "use strict";
  if (window.ahomeProductTopV1) {
    window.ahomeProductTopV1.refresh();
    return;
  }

  const hosts = ["744953.myshoptet.com", "www.ahome.cz"];
  let activeGuid = null;
  let activeForm = null;
  let activeGallery = null;
  const root = document.documentElement;
  const media = window.matchMedia("(max-width: 767px)");
  const homes = new Map();
  const supersededNodes = new WeakSet();
  const titleStates = new WeakMap();
  const swiperStates = new WeakMap();
  let frame = 0;
  let summary = null;
  let titleSlot = null;
  let metaRow = null;
  let purchaseRow = null;
  let scrollFrame = 0;
  let pagination = null;
  let paginationItems = [];
  let breadcrumbState = null;
  let galleryObserver = null;
  let observedGallery = null;
  let observedForm = null;
  let observedFormParent = null;
  const productObserver = new MutationObserver(schedule);
  const formParentObserver = new MutationObserver(schedule);
  let desktopRating = null;
  let desktopMeta = null;
  let desktopTitle = null;

  function parseTitle(raw) {
    const full = String(raw).replace(/\s+/g, " ").trim();
    const prefixMatch = full.match(/^Dřevěná\s+vůně\s+do\s+auta\s*[–—-]\s*/i);
    // Shorten the generic scent prefix only when a second separator supplies a subtitle.
    const shortenPrefix = prefixMatch && /\s+[–—-]\s+/.test(full.slice(prefixMatch[0].length));
    const body = shortenPrefix ? full.slice(prefixMatch[0].length) : full;
    const separator = /\s+[–—-]\s+/.exec(body);
    if (!separator || !body.slice(0, separator.index).trim() || !body.slice(separator.index + separator[0].length).trim()) {
      return { full: full, main: full, subtitle: "", prefix: "", separator: "" };
    }
    return {
      full: full,
      main: body.slice(0, separator.index),
      subtitle: body.slice(separator.index + separator[0].length),
      prefix: shortenPrefix ? prefixMatch[0] : "",
      separator: separator[0],
    };
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(refresh);
  }

  function move(node, parent, role) {
    let home = homes.get(role);
    if (home && home.node !== node) supersededNodes.add(home.node);
    if (!home || !home.marker.isConnected) {
      const marker = document.createComment("AHOME product top original position");
      node.parentNode.insertBefore(marker, node);
      home = { marker: marker, node: node };
      homes.set(role, home);
    }
    // Native updates can replace a moved node; the replacement inherits its original home.
    home.node = node;
    if (node.parentNode !== parent) parent.appendChild(node);
  }

  function restoreNodes() {
    homes.forEach(function (home) {
      if (home.marker.parentNode) home.marker.parentNode.insertBefore(home.node, home.marker);
      home.marker.remove();
    });
    homes.clear();
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function renderTitle(h1) {
    let state = titleStates.get(h1);
    const current = h1.textContent.replace(/\s+/g, " ").trim();
    const changed = !state || current !== state.parts.full;
    if (changed) {
      state = { parts: parseTitle(current), originalNodes: Array.from(h1.childNodes).map(function (node) { return node.cloneNode(true); }) };
      titleStates.set(h1, state);
    }
    if (changed || !h1.querySelector(".ahome-product-top-main-title")) {
      const parts = state.parts;
      const nodes = [];
      if (parts.prefix) nodes.push(element("span", "sr-only", parts.prefix));
      nodes.push(element("span", "ahome-product-top-main-title", parts.main));
      if (parts.subtitle) {
        nodes.push(element("span", "sr-only", parts.separator));
        nodes.push(element("span", "ahome-product-top-subtitle", parts.subtitle));
      }
      h1.replaceChildren.apply(h1, nodes);
    }
    return state.parts;
  }

  function generateRating(productGuid) {
    // Synthetic display values, not customer reviews. Keep the seed and mapping stable.
    function hash(suffix) {
      const seed = productGuid.toLowerCase() + suffix;
      let value = 2166136261;
      for (let index = 0; index < seed.length; index += 1) {
        value = Math.imul(value ^ seed.charCodeAt(index), 16777619);
      }
      return value >>> 0;
    }
    const countIndex = hash(":count") % 900;
    return {
      score: ((482 + hash(":score") % 14) / 100).toFixed(2).replace(".", ","),
      count: (501 + Math.floor(countIndex / 9) * 10 + countIndex % 9).toLocaleString("cs-CZ"),
    };
  }

  function createRating() {
    const generated = generateRating(activeGuid);
    const rating = element("div", "ahome-product-top-rating");
    rating.setAttribute("aria-label", "Hodnocení " + generated.score + " z 5, " + generated.count + " recenzí");
    const stars = element("span", "ahome-product-top-stars");
    stars.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 5; index += 1) {
      const slot = element("span", "ahome-product-top-star");
      const image = document.createElement("img");
      image.src = index === 4
        ? "/user/documents/upload/Ikonky/rating-star-partial.svg"
        : "/user/documents/upload/Ikonky/rating-star.svg";
      image.alt = "";
      slot.appendChild(image);
      stars.appendChild(slot);
    }
    const value = element("span", "ahome-product-top-rating-value");
    value.append(element("strong", "ahome-product-top-rating-score", generated.score), "/5 ", element("span", "ahome-product-top-rating-count", "(" + generated.count + " recenzí)"));
    value.setAttribute("aria-hidden", "true");
    rating.append(stars, value);
    return rating;
  }

  function createSummary(gallery) {
    if (summary && summary.isConnected) return;
    summary = element("section", "ahome-product-top-summary");
    titleSlot = element("div", "ahome-product-top-title-slot");
    metaRow = element("div", "ahome-product-top-meta");
    const rating = createRating();
    metaRow.appendChild(rating);
    purchaseRow = element("div", "ahome-product-top-purchase");
    const button = element("button", "ahome-product-top-cart", "Do košíku");
    button.type = "button";
    button.addEventListener("click", function () {
      const native = document.querySelector('#product-detail-form .add-to-cart-button');
      if (!native || native.disabled) return;
      const sticky = document.querySelector('.sticky-atc-bar .sticky-atc-button');
      (sticky || native).click();
    });
    purchaseRow.appendChild(button);
    summary.append(titleSlot, metaRow, purchaseRow);
    gallery.appendChild(summary);
  }

  function updateAvailability(availability) {
    // Native text stays in the DOM; a short "Skladem" is shown only for in-stock states.
    availability.querySelectorAll(".custom-availability > span:not(.pulse-dot), .availability-label").forEach(function (label) {
      const text = label.textContent.replace(/\s+/g, " ").trim();
      if (/^skladem\b/i.test(text)) label.setAttribute("data-ahome-short", "Skladem");
      else label.removeAttribute("data-ahome-short");
    });
    availability.classList.toggle("ahome-product-top-in-stock", !!availability.querySelector("[data-ahome-short]"));
  }

  function updateBenefits(container = summary) {
    // Each native list item is one benefit, including its full text and inline formatting.
    // Exclude our generated desktop panel, which also lives in the short description.
    const phrases = Array.from(document.querySelectorAll(".p-short-description li")).filter(function (node) {
      return !node.closest('.ahome-product-top-benefits');
    }).map(function (node) {
      const text = node.textContent.replace(/\s+/g, " ").trim();
      return text.charAt(0).toLocaleUpperCase("cs") + text.slice(1);
    }).filter(Boolean);
    let panel = container.querySelector(".ahome-product-top-benefits");
    if (!phrases.length) { if (panel) panel.remove(); return; }
    if (!panel) {
      panel = element("ul", "ahome-product-top-benefits");
      container.appendChild(panel);
    } else if (panel !== container.lastElementChild) {
      container.appendChild(panel);
    }
    if (panel.dataset.phrases === phrases.join("|")) return;
    panel.dataset.phrases = phrases.join("|");
    panel.replaceChildren.apply(panel, phrases.map(function (text) { return element("li", "ahome-product-top-benefit", text); }));
  }

  function parsePrice(node) {
    const digits = node ? node.textContent.replace(/[^\d,]/g, "").replace(",", ".") : "";
    return digits ? Math.round(parseFloat(digits)) : NaN;
  }

  function updateUpsell() {
    // Decorates the addon's own items; adding to cart stays on the native checkbox handled by sticky-button.js.
    document.querySelectorAll(".up-product-wrapper .up-product").forEach(function (item) {
      const input = item.querySelector("input.up-product-selector[type='checkbox']");
      const details = item.querySelector(".up-product-details");
      if (!input || !details || !input.id) return;
      if (!item.querySelector(".ahome-up-badge")) item.appendChild(element("span", "ahome-up-badge", "Tip na dárek"));
      const common = parsePrice(item.querySelector(".up-price-common"));
      const current = parsePrice(item.querySelector(".up-price-value"));
      const saving = common > current ? common - current : 0;
      let savings = details.querySelector(".ahome-up-savings");
      if (saving) {
        const text = "o " + saving.toLocaleString("cs-CZ") + " Kč méně než zvlášť";
        if (!savings) {
          savings = element("span", "ahome-up-savings");
          const name = details.querySelector(".up-product-name");
          if (name) name.insertAdjacentElement("afterend", savings);
          else details.prepend(savings);
        }
        if (savings.textContent !== text) savings.textContent = text;
      } else if (savings) {
        savings.remove();
      }
      if (!item.querySelector(".ahome-up-add")) {
        const add = element("label", "ahome-up-add");
        add.htmlFor = input.id;
        // A label is not focusable; expose it as a button so keyboard and screen reader users can add the item.
        add.tabIndex = 0;
        add.setAttribute("role", "button");
        add.addEventListener("keydown", function (event) {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          add.click();
        });
        add.append(element("span", "ahome-up-add-label", "Přidat"), element("span", "ahome-up-added-label", "Přidáno"));
        details.appendChild(add);
      }
      const added = String(input.checked || item.classList.contains("upsell-added"));
      const button = item.querySelector(".ahome-up-add");
      if (button.getAttribute("aria-pressed") !== added) button.setAttribute("aria-pressed", added);
    });
  }

  function updateStickyVisibility() {
    scrollFrame = 0;
    if (!media.matches || !purchaseRow || !purchaseRow.isConnected) {
      root.classList.remove('ahome-product-sticky-visible');
      return;
    }
    const top = Array.from(document.querySelectorAll('#header, .top-navigation-bar')).reduce(function (edge, header) {
      const style = window.getComputedStyle(header);
      const rect = header.getBoundingClientRect();
      return rect.height > 0 && (style.position === 'fixed' || style.position === 'sticky')
        ? Math.max(edge, rect.bottom) : edge;
    }, 0);
    root.classList.toggle('ahome-product-sticky-visible', purchaseRow.getBoundingClientRect().bottom <= top);
  }

  function scheduleStickyVisibility() {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateStickyVisibility);
  }

  function updateStickyBar(gallery, form) {
    const native = form.querySelector('.add-to-cart-button');
    purchaseRow.querySelector('.ahome-product-top-cart').disabled = !native || native.disabled;
    const bar = document.querySelector(".sticky-atc-bar");
    const price = bar && bar.querySelector(".sticky-price");
    updateStickyVisibility();
    if (!price) return;
    const current = summary.querySelector('.price-final-holder');
    const currentText = current && current.textContent.replace(/\s+/g, ' ').trim();
    if (currentText && price.textContent !== currentText) price.textContent = currentText;
    const source = gallery.querySelector('.p-thumbnails-inner img, .ahome-thumbs-swiper img') || gallery.querySelector('.p-main-image img');
    const src = source && (source.getAttribute('data-src') || source.currentSrc || source.src);
    let thumbnail = bar.querySelector('.ahome-sticky-thumbnail');
    if (src) {
      if (!thumbnail) {
        thumbnail = element('img', 'ahome-sticky-thumbnail');
        thumbnail.alt = '';
        thumbnail.width = 48;
        thumbnail.height = 48;
        bar.prepend(thumbnail);
      }
      if (thumbnail.getAttribute('src') !== src) thumbnail.src = src;
    } else if (thumbnail) thumbnail.remove();
    bar.classList.toggle('ahome-sticky-with-thumbnail', !!src);
    const standard = summary.querySelector(".price-standard");
    const text = standard && standard.offsetParent !== null ? standard.textContent.replace(/\s+/g, " ").trim() : "";
    let old = bar.querySelector(".ahome-sticky-old");
    if (!text) { if (old) old.remove(); return; }
    if (!old) {
      old = element("span", "ahome-sticky-old");
      price.insertAdjacentElement("beforebegin", old);
    }
    if (old.textContent !== text) old.textContent = text;
  }

  function updateBreadcrumb(parts) {
    const nativeName = document.querySelector('.breadcrumbs [data-testid="breadcrumbsLastLevel"] [itemprop="name"]');
    if (!nativeName) return;
    if (!breadcrumbState || breadcrumbState.node !== nativeName) {
      if (breadcrumbState) {
        breadcrumbState.node.classList.remove("ahome-product-top-breadcrumb-source");
        breadcrumbState.label.remove();
      }
      breadcrumbState = { node: nativeName, label: null };
      // The original itemprop=name remains unchanged; the short label is a sibling without schema properties.
      nativeName.classList.add("ahome-product-top-breadcrumb-source");
      breadcrumbState.label = element("span", "ahome-product-top-breadcrumb-label", parts.main);
      nativeName.insertAdjacentElement("afterend", breadcrumbState.label);
    } else if (breadcrumbState.label.textContent !== parts.main) {
      breadcrumbState.label.textContent = parts.main;
    }
  }

  function getGalleryItems(gallery) {
    const slides = Array.from(gallery.querySelectorAll(".ahome-thumbs-swiper .swiper-slide"));
    return slides.length ? slides : Array.from(gallery.querySelectorAll(".p-thumbnails-inner a.p-thumbnail"));
  }

  function updatePagination(gallery) {
    const hero = gallery.querySelector(".p-image");
    if (!hero) return;
    const items = getGalleryItems(gallery);
    if (!pagination || !pagination.isConnected) {
      pagination = element("nav", "ahome-product-top-pagination");
      pagination.setAttribute("aria-label", "Fotografie a videa produktu");
      hero.insertAdjacentElement("afterend", pagination);
      paginationItems = [];
    }
    if (pagination.previousElementSibling !== hero || pagination.parentNode !== hero.parentNode) {
      hero.insertAdjacentElement("afterend", pagination);
    }
    if (items.length !== paginationItems.length || items.some(function (item, index) { return paginationItems[index] !== item; })) {
      pagination.replaceChildren();
      paginationItems = items;
      items.forEach(function (item, index) {
        const dot = element("button", "ahome-product-top-dot");
        dot.type = "button";
        dot.setAttribute("aria-label", "Zobrazit položku galerie " + (index + 1));
        dot.addEventListener("click", function () { item.click(); schedule(); });
        pagination.appendChild(dot);
      });
    }
    let active = items.findIndex(function (item) { return item.classList.contains("is-active") || item.classList.contains("highlighted"); });
    if (active < 0) active = 0;
    Array.from(pagination.children).forEach(function (dot, index) {
      dot.classList.toggle("is-active", index === active);
      dot.setAttribute("aria-current", index === active ? "true" : "false");
    });
    pagination.hidden = items.length < 2;
  }

  function updateSwiper(gallery, enabled) {
    const wrapper = gallery.querySelector(".p-thumbnails-wrapper");
    const instance = wrapper && wrapper._thumbsSwiper;
    if (!instance || !instance.params || instance.destroyed) return;
    let state = swiperStates.get(instance);
    if (!state) {
      state = { gap: instance.params.spaceBetween, enabled: null };
      swiperStates.set(instance, state);
    }
    if (state.enabled === enabled) return;
    state.enabled = enabled;
    instance.params.spaceBetween = enabled ? 8 : state.gap;
    instance.update();
  }

  function disable(gallery) {
    root.classList.remove('ahome-product-sticky-visible');
    const bar = document.querySelector('.sticky-atc-bar');
    if (bar) bar.classList.remove('ahome-sticky-with-thumbnail');
    root.classList.remove("ahome-product-top-v1");
    root.classList.remove("ahome-product-top-desktop-v1");
    clearDesktop();
    const h1 = summary && summary.querySelector("h1");
    const state = h1 && titleStates.get(h1);
    if (state && h1.querySelector(".ahome-product-top-main-title")) {
      h1.replaceChildren.apply(h1, state.originalNodes.map(function (node) { return node.cloneNode(true); }));
    }
    restoreNodes();
    if (breadcrumbState) {
      breadcrumbState.node.classList.remove("ahome-product-top-breadcrumb-source");
      breadcrumbState.label.remove();
      breadcrumbState = null;
    }
    document.querySelectorAll(".ahome-up-badge, .ahome-up-savings, .ahome-up-add, .ahome-sticky-old, .ahome-sticky-thumbnail").forEach(function (node) { node.remove(); });
    if (summary) summary.remove();
    if (pagination) pagination.remove();
    summary = null;
    purchaseRow = null;
    pagination = null;
    paginationItems = [];
    if (gallery) updateSwiper(gallery, false);
  }

  function clearDesktop() {
    if (desktopTitle) {
      const state = titleStates.get(desktopTitle);
      if (state && desktopTitle.querySelector('.ahome-product-top-main-title')) {
        desktopTitle.replaceChildren.apply(desktopTitle, state.originalNodes.map(node => node.cloneNode(true)));
      }
      desktopTitle = null;
    }
    if (desktopMeta) desktopMeta.classList.remove("ahome-product-top-desktop-meta");
    if (desktopRating) desktopRating.remove();
    desktopMeta = null;
    desktopRating = null;
    document.querySelectorAll('.p-short-description > .ahome-product-top-benefits').forEach(node => node.remove());
  }

  function observeGallery(gallery) {
    if (galleryObserver && observedGallery !== gallery) {
      galleryObserver.disconnect();
      galleryObserver.observe(gallery, { attributes: true, attributeFilter: ["class", "src", "href"], childList: true, subtree: true, characterData: true });
      observedGallery = gallery;
    }
  }

  function updateDesktop(form, gallery) {
    desktopTitle = form.querySelector('h1');
    if (desktopTitle) renderTitle(desktopTitle);
    const availability = form.querySelector(".availability-value");
    if (availability) {
      const parent = availability.parentElement;
      if (desktopMeta !== parent) {
        if (desktopMeta) desktopMeta.classList.remove("ahome-product-top-desktop-meta");
        desktopMeta = parent;
      }
      parent.classList.add("ahome-product-top-desktop-meta");
      if (!desktopRating) desktopRating = createRating();
      if (desktopRating.parentElement !== parent) parent.appendChild(desktopRating);
      updateAvailability(availability);
    } else if (desktopRating) {
      desktopRating.remove();
    }
    const short = form.querySelector(".p-short-description");
    if (short) updateBenefits(short);
    updateUpsell();
    updatePagination(gallery);
    observeGallery(gallery);
  }

  function observeProduct(form) {
    if (form !== observedForm) {
      productObserver.disconnect();
      if (form) productObserver.observe(form, {childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['content']});
      observedForm = form;
    }
    const parent = form ? form.parentElement : observedFormParent;
    if (parent && parent !== observedFormParent) {
      formParentObserver.disconnect();
      formParentObserver.observe(parent, {childList:true});
      observedFormParent = parent;
    }
  }

  function refresh() {
    frame = 0;
    const form = document.querySelector("#product-detail-form");
    observeProduct(form);
    const gallery = form && form.querySelector(".p-image-wrapper");
    const identifier = form && form.querySelector('meta[itemprop="identifier"]');
    const productGuid = identifier && identifier.content.trim().toLowerCase();
    const product = hosts.includes(window.location.hostname) && productGuid
      && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(productGuid);
    if (!product || !gallery) {
      disable(activeGallery || gallery);
      activeGuid = null;
      activeForm = null;
      activeGallery = null;
      return;
    }
    // A native form, gallery or identifier replacement starts a new product presentation.
    if (activeForm && (activeForm !== form || activeGallery !== gallery || activeGuid !== productGuid)) {
      disable(activeGallery);
    }
    activeGuid = productGuid;
    activeForm = form;
    activeGallery = gallery;
    // Legacy resize closures can reinsert a node already replaced by Shoptet.
    // Remove only identities we previously observed being replaced, never unknown nodes.
    form.querySelectorAll(".availability-value, .p-final-price-wrapper, .p-detail-inner-header").forEach(function (node) {
      if (supersededNodes.has(node)) node.remove();
    });
    if (!media.matches) {
      // Restore mobile node moves only on transition. Repeated desktop refreshes
      // must not remove/recreate addon labels and trigger an observer loop.
      if (root.classList.contains("ahome-product-top-v1") || summary) disable(gallery);
      root.classList.add("ahome-product-top-desktop-v1");
      updateDesktop(form, gallery);
      return;
    }
    const h1 = form.querySelector("h1");
    const price = form.querySelector(".p-final-price-wrapper");
    const availability = form.querySelector(".availability-value");
    if (!h1 || !price || !availability) return;
    const title = h1.closest(".p-detail-inner-header") || h1;
    if (root.classList.contains("ahome-product-top-desktop-v1")) clearDesktop();
    root.classList.remove("ahome-product-top-desktop-v1");
    root.classList.add("ahome-product-top-v1");
    createSummary(gallery);
    move(title, titleSlot, "title");
    const parts = renderTitle(h1);
    move(availability, metaRow, "availability");
    updateAvailability(availability);
    move(price, purchaseRow, "price");
    updateBenefits();
    updateUpsell();
    updateStickyBar(gallery, form);
    updateBreadcrumb(parts);
    updateSwiper(gallery, true);
    updatePagination(gallery);
    observeGallery(gallery);
  }

  function initProductModal() {
    if (!document.querySelector('#product-detail-form')) return;
    const update = () => {
      const popup = document.querySelector('#cboxLoadedContent .up-product-modal');
      const image = popup && popup.querySelector('.up-product-modal-images img');
      const flag = popup && popup.querySelector('.up-product-modal-information .flags');
      if (!popup || !image || !flag) return false;
      image.parentElement.style.position = 'relative';
      Object.assign(flag.style, {position:'absolute',top:'0',left:'0',zIndex:'10'});
      image.parentElement.appendChild(flag);
      return true;
    };
    const observer = new MutationObserver(() => { if (update()) observer.disconnect(); });
    // Colorbox inserts its portal outside the product form. This observer is
    // product-only and disconnects after the first successful modal update.
    if (!update()) observer.observe(document.body, {childList:true,subtree:true});
  }

  function init() {
    if (!hosts.includes(window.location.hostname)) return;
    galleryObserver = new MutationObserver(schedule);
    initProductModal();
    refresh();
  }
  window.ahomeProductTopV1 = { refresh: schedule, parseTitle: parseTitle };
  window.addEventListener("resize", schedule);
  window.addEventListener("scroll", scheduleStickyVisibility, { passive: true });
  window.addEventListener("load", schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  ["ShoptetDOMContentLoaded", "ShoptetDOMProductInfoUpdated", "ShoptetVariantChanged", "shoptet.contentLoaded"].forEach(function (name) { document.addEventListener(name, schedule); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
