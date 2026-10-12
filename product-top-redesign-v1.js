/* AHOME product top v1: pilot presentation, native product/gallery/action nodes. */
(function () {
  "use strict";
  if (window.ahomeProductTopV1) {
    window.ahomeProductTopV1.refresh();
    return;
  }

  const slug = "/drevena-vune-do-auta-fresh-wood-nekonecno/";
  const hosts = ["744953.myshoptet.com", "www.ahome.cz"];
  const guid = "0842d0bc-3f9c-11f0-b701-1abd5f483e00";
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
  let pagination = null;
  let paginationItems = [];
  let breadcrumbState = null;
  let galleryObserver = null;
  let observedGallery = null;

  function parseTitle(raw) {
    const full = String(raw).replace(/\s+/g, " ").trim();
    const prefixMatch = full.match(/^Dřevěná\s+vůně\s+do\s+auta\s*[–—-]\s*/i);
    if (!prefixMatch) return { full: full, main: full, subtitle: "", prefix: "", separator: "" };
    const body = full.slice(prefixMatch[0].length);
    const separator = /\s+[–—-]\s+/.exec(body);
    if (!separator || !body.slice(0, separator.index).trim() || !body.slice(separator.index + separator[0].length).trim()) {
      return { full: full, main: full, subtitle: "", prefix: "", separator: "" };
    }
    return {
      full: full,
      main: body.slice(0, separator.index),
      subtitle: body.slice(separator.index + separator[0].length),
      prefix: prefixMatch[0],
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

  function createSummary(gallery) {
    if (summary && summary.isConnected) return;
    summary = element("section", "ahome-product-top-summary");
    titleSlot = element("div", "ahome-product-top-title-slot");
    metaRow = element("div", "ahome-product-top-meta");
    const rating = element("div", "ahome-product-top-rating");
    rating.setAttribute("aria-label", "Ukázková data hodnocení obchodu: 4,9 z 5, 102 recenzí");
    const stars = element("span", "ahome-product-top-stars");
    stars.setAttribute("aria-hidden", "true");
    for (let index = 0; index < 5; index += 1) {
      const slot = element("span", "ahome-product-top-star");
      const image = document.createElement("img");
      image.src = "/user/documents/upload/gaelta/product-top-redesign-v1/rating-star.svg";
      image.alt = "";
      slot.appendChild(image);
      stars.appendChild(slot);
    }
    rating.append(stars, element("span", "ahome-product-top-rating-value", "4,9/5 (102 recenzí)"), element("small", "ahome-product-top-demo-label", "Ukázka"));
    metaRow.appendChild(rating);
    summary.append(titleSlot, metaRow);
    gallery.appendChild(summary);
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
    root.classList.remove("ahome-product-top-v1");
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
    if (summary) summary.remove();
    if (pagination) pagination.remove();
    summary = null;
    pagination = null;
    paginationItems = [];
    if (gallery) updateSwiper(gallery, false);
  }

  function refresh() {
    frame = 0;
    const form = document.querySelector("#product-detail-form");
    const gallery = form && form.querySelector(".p-image-wrapper");
    const identifier = form && form.querySelector('meta[itemprop="identifier"]');
    const pilot = hosts.includes(window.location.hostname) && window.location.pathname.replace(/\/?$/, "/") === slug
      && identifier && identifier.content.toLowerCase() === guid;
    if (!pilot || !gallery) { disable(gallery); return; }
    // Legacy resize closures can reinsert a node already replaced by Shoptet.
    // Remove only identities we previously observed being replaced, never unknown nodes.
    form.querySelectorAll(".availability-value, .p-final-price-wrapper, .p-detail-inner-header").forEach(function (node) {
      if (supersededNodes.has(node)) node.remove();
    });
    if (!media.matches) { disable(gallery); return; }
    const h1 = form.querySelector("h1");
    const price = form.querySelector(".p-final-price-wrapper");
    const availability = form.querySelector(".availability-value");
    if (!h1 || !price || !availability) return;
    const title = h1.closest(".p-detail-inner-header") || h1;
    root.classList.add("ahome-product-top-v1");
    createSummary(gallery);
    move(title, titleSlot, "title");
    const parts = renderTitle(h1);
    move(availability, metaRow, "availability");
    move(price, summary, "price");
    updateBreadcrumb(parts);
    updateSwiper(gallery, true);
    updatePagination(gallery);
    if (galleryObserver && observedGallery !== gallery) {
      galleryObserver.disconnect();
      galleryObserver.observe(gallery, { attributes: true, attributeFilter: ["class", "src", "href"], childList: true, subtree: true, characterData: true });
      observedGallery = gallery;
    }
  }

  function init() {
    if (!hosts.includes(window.location.hostname) || window.location.pathname.replace(/\/?$/, "/") !== slug) return;
    galleryObserver = new MutationObserver(schedule);
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    refresh();
  }
  window.ahomeProductTopV1 = { refresh: schedule, parseTitle: parseTitle };
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  ["ShoptetDOMContentLoaded", "ShoptetDOMProductInfoUpdated", "ShoptetVariantChanged", "shoptet.contentLoaded"].forEach(function (name) { document.addEventListener(name, schedule); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
