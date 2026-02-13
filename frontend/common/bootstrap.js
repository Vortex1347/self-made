(function bootstrapSite(global) {
  if (!global.qaSite || !global.qaSiteDom) return;

  global.qaSiteDom.applyYear();
  global.qaSiteDom.applyWhatsappLinks();
  global.qaSiteDom.applyContacts();
})(window);
