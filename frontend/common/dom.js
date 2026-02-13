(function initSiteDom(global) {
  function applyYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function applyWhatsappLinks() {
    const link = global.qaSite.whatsappLink;
    document.querySelectorAll("[data-whatsapp-link]").forEach((element) => {
      element.setAttribute("href", link);
    });
  }

  function applyContacts() {
    const siteConfig = global.qaSite.config;
    const whatsappNumber = global.qaSite.whatsappNumber;

    const contactNameEl = document.getElementById("sales-contact-name");
    if (contactNameEl && siteConfig.salesContactName) {
      contactNameEl.textContent = siteConfig.salesContactName;
    }

    const contactHoursEl = document.getElementById("sales-contact-hours");
    if (contactHoursEl && siteConfig.salesContactHours) {
      contactHoursEl.textContent = siteConfig.salesContactHours;
    }

    const contactPhoneEl = document.getElementById("sales-contact-phone");
    if (contactPhoneEl) {
      contactPhoneEl.textContent = whatsappNumber ? `+${whatsappNumber}` : "Укажите номер в site-config.js";
    }
  }

  global.qaSiteDom = {
    applyYear,
    applyWhatsappLinks,
    applyContacts,
  };
})(window);
