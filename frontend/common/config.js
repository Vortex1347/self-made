(function initSiteConfig(global) {
  const defaults = {
    brandName: "QA Academy",
    salesWhatsappNumber: "",
    salesWhatsappText: "Здравствуйте!",
    salesContactName: "Отдел продаж",
    salesContactHours: "",
  };

  const rawConfig = global.QA_SITE_CONFIG || {};
  const mergedConfig = {
    ...defaults,
    ...rawConfig,
  };

  const whatsappNumber = String(mergedConfig.salesWhatsappNumber || "").replace(/[^\d]/g, "");
  const whatsappText = encodeURIComponent(String(mergedConfig.salesWhatsappText || defaults.salesWhatsappText));
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappText}` : "https://wa.me/";

  global.qaSite = {
    config: mergedConfig,
    whatsappNumber,
    whatsappLink,
  };
})(window);
