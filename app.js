const STORE_KEY = "alalari-full-store-v1";
const CART_KEY = "alalari-cart-v1";

const categories = {
  all: "الكل",
  books: "كتب",
  stationery: "قرطاسية",
  school: "مدرسي",
  gifts: "هدايا"
};

const defaultStore = {
  name: "مكتبة العلاري",
  whatsapp: "+972569740120",
  address: "الشارع الرئيسي، بجوار المدرسة",
  hours: "يوميًا من 9 صباحًا إلى 10 مساءً",
  heroText: "متجر مرتب للطلاب والمعلمين: اختار المنتجات، أضفها للسلة، وأرسل الطلب مباشرة عبر واتساب.",
  offerTitle: "حقيبة الدراسة الكاملة",
  offerText: "جهز طلب المدرسة كاملًا من مكان واحد: شنطة، دفاتر، أقلام، ألوان، وملفات.",
  products: [
    { id: "p1", name: "دفتر جامعي 100 ورقة", description: "ورق ناعم وغلاف قوي للاستخدام اليومي.", price: 18, category: "stationery", icon: "📓" },
    { id: "p2", name: "طقم أقلام جل ملونة", description: "ألوان واضحة للكتابة والتحديد والمذاكرة.", price: 12, category: "stationery", icon: "🖊️" },
    { id: "p3", name: "قصص أطفال مصورة", description: "قصص ممتعة برسومات واضحة ومناسبة للصغار.", price: 20, category: "books", icon: "📖" },
    { id: "p4", name: "علبة ألوان خشب", description: "درجات زاهية مناسبة للمدرسة والأنشطة الفنية.", price: 15, category: "school", icon: "🎨" },
    { id: "p5", name: "شنطة مدرسية خفيفة", description: "مساحات متعددة وحمالات مريحة للاستخدام الطويل.", price: 85, category: "school", icon: "🎒" },
    { id: "p6", name: "كتاب تأسيس لغة عربية", description: "تمارين مبسطة للقراءة والكتابة والمراجعة.", price: 25, category: "books", icon: "🔤" },
    { id: "p7", name: "ملفات حفظ شفافة", description: "حماية وترتيب للأوراق والفواتير والمذكرات.", price: 8, category: "stationery", icon: "📁" },
    { id: "p8", name: "تغليف هدايا", description: "ورق وأكياس هدايا للمناسبات والطلبات الخاصة.", price: 10, category: "gifts", icon: "🎁" }
  ]
};

let store = readJson(STORE_KEY, defaultStore);
let cart = readJson(CART_KEY, []);
let activeCategory = "all";
let currentSearch = "";
let toastTimer;

const els = {
  brandName: document.getElementById("brandName"),
  heroTitle: document.getElementById("heroTitle"),
  heroText: document.getElementById("heroText"),
  heroPhone: document.getElementById("heroPhone"),
  offerTitle: document.getElementById("offerTitle"),
  offerText: document.getElementById("offerText"),
  storeAddress: document.getElementById("storeAddress"),
  storeHours: document.getElementById("storeHours"),
  whatsappLink: document.getElementById("whatsappLink"),
  phoneLink: document.getElementById("phoneLink"),
  productGrid: document.getElementById("productGrid"),
  emptyState: document.getElementById("emptyState"),
  categoryTabs: document.getElementById("categoryTabs"),
  searchInput: document.getElementById("searchInput"),
  cartOpen: document.getElementById("cartOpen"),
  quickCart: document.getElementById("quickCart"),
  cartClose: document.getElementById("cartClose"),
  cartDrawer: document.getElementById("cartDrawer"),
  cartItems: document.getElementById("cartItems"),
  cartCount: document.getElementById("cartCount"),
  cartSummary: document.getElementById("cartSummary"),
  cartTotal: document.getElementById("cartTotal"),
  cartClear: document.getElementById("cartClear"),
  checkoutJump: document.getElementById("checkoutJump"),
  checkoutForm: document.getElementById("checkoutForm"),
  adminOpen: document.getElementById("adminOpen"),
  adminClose: document.getElementById("adminClose"),
  adminPanel: document.getElementById("adminPanel"),
  storeForm: document.getElementById("storeForm"),
  productForm: document.getElementById("productForm"),
  newProduct: document.getElementById("newProduct"),
  adminProducts: document.getElementById("adminProducts"),
  exportData: document.getElementById("exportData"),
  resetStore: document.getElementById("resetStore"),
  offerAdd: document.getElementById("offerAdd"),
  overlay: document.getElementById("overlay"),
  toast: document.getElementById("toast")
};

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : structuredClone(fallback);
  } catch {
    return structuredClone(fallback);
  }
}

function saveStore() {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function money(value) {
  return `₪${Number(value || 0).toLocaleString("en-US")}`;
}

function cleanWhatsappNumber(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 1900);
}

function openDrawer(drawer) {
  drawer.classList.add("open");
  els.overlay.classList.add("show");
  document.body.classList.add("drawer-open");
}

function closeDrawers() {
  els.cartDrawer.classList.remove("open");
  els.adminPanel.classList.remove("open");
  els.overlay.classList.remove("show");
  document.body.classList.remove("drawer-open");
}

function applyStoreInfo() {
  els.brandName.textContent = store.name;
  els.heroTitle.textContent = store.name;
  els.heroText.textContent = store.heroText;
  els.heroPhone.textContent = `واتساب: ${store.whatsapp}`;
  els.offerTitle.textContent = store.offerTitle;
  els.offerText.textContent = store.offerText;
  els.storeAddress.textContent = store.address;
  els.storeHours.textContent = store.hours;
  els.whatsappLink.href = `https://wa.me/${cleanWhatsappNumber(store.whatsapp)}`;
  els.phoneLink.href = `tel:${store.whatsapp}`;
  els.storeForm.elements.name.value = store.name;
  els.storeForm.elements.whatsapp.value = store.whatsapp;
  els.storeForm.elements.address.value = store.address;
  els.storeForm.elements.hours.value = store.hours;
  els.storeForm.elements.heroText.value = store.heroText;
}

function renderCategories() {
  els.categoryTabs.replaceChildren();
  Object.entries(categories).forEach(([key, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = key === activeCategory ? "active" : "";
    button.addEventListener("click", () => {
      activeCategory = key;
      renderCategories();
      renderProducts();
    });
    els.categoryTabs.append(button);
  });
}

function filteredProducts() {
  const query = currentSearch.trim().toLowerCase();
  return store.products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    const text = `${product.name} ${product.description}`.toLowerCase();
    return matchesCategory && (!query || text.includes(query));
  });
}

function renderProducts() {
  const list = filteredProducts();
  els.productGrid.replaceChildren();
  els.emptyState.classList.toggle("show", list.length === 0);
  list.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media" aria-hidden="true">${product.icon || "📦"}</div>
      <div class="product-body">
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
      </div>
      <div class="product-foot">
        <span class="price">${money(product.price)}</span>
        <button class="add-button" type="button">أضف للسلة</button>
      </div>
    `;
    card.querySelector("button").addEventListener("click", () => addToCart(product.id));
    els.productGrid.append(card);
  });
}

function findProduct(id) {
  return store.products.find((product) => product.id === id);
}

function addToCart(id, qty = 1) {
  const product = findProduct(id);
  if (!product) return;
  const item = cart.find((entry) => entry.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  saveCart();
  renderCart();
  showToast(`تمت إضافة ${product.name} إلى السلة`);
}

function setQty(id, qty) {
  cart = cart
    .map((item) => item.id === id ? { ...item, qty } : item)
    .filter((item) => item.qty > 0);
  saveCart();
  renderCart();
}

function cartDetails() {
  return cart
    .map((item) => ({ ...item, product: findProduct(item.id) }))
    .filter((item) => item.product);
}

function cartTotal() {
  return cartDetails().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function renderCart() {
  const details = cartDetails();
  const count = details.reduce((sum, item) => sum + item.qty, 0);
  els.cartItems.replaceChildren();
  els.cartCount.textContent = count;
  els.cartSummary.textContent = `${count} منتجات`;
  els.cartTotal.textContent = money(cartTotal());

  if (details.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state show";
    empty.textContent = "السلة فارغة.";
    els.cartItems.append(empty);
    return;
  }

  details.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h3>${escapeHtml(item.product.name)}</h3>
        <p>${money(item.product.price)} × ${item.qty} = ${money(item.product.price * item.qty)}</p>
      </div>
      <div class="qty-controls">
        <button type="button" aria-label="تقليل">-</button>
        <strong>${item.qty}</strong>
        <button type="button" aria-label="زيادة">+</button>
      </div>
    `;
    const [minus, plus] = row.querySelectorAll("button");
    minus.addEventListener("click", () => setQty(item.id, item.qty - 1));
    plus.addEventListener("click", () => setQty(item.id, item.qty + 1));
    els.cartItems.append(row);
  });
}

function buildOrderMessage(formData) {
  const details = cartDetails();
  const lines = details.map((item, index) =>
    `${index + 1}. ${item.product.name} - الكمية: ${item.qty} - السعر: ${money(item.product.price * item.qty)}`
  );
  return [
    `طلب جديد من ${store.name}`,
    "",
    `الاسم: ${formData.get("customerName")}`,
    `هاتف الزبون: ${formData.get("customerPhone")}`,
    `طريقة الاستلام: ${formData.get("deliveryMethod")}`,
    `طريقة الدفع: ${formData.get("paymentMethod")}`,
    `العنوان: ${formData.get("address") || "غير محدد"}`,
    `ملاحظات: ${formData.get("notes") || "لا يوجد"}`,
    "",
    "المنتجات:",
    ...lines,
    "",
    `المجموع: ${money(cartTotal())}`
  ].join("\n");
}

function sendOrder(event) {
  event.preventDefault();
  if (cartDetails().length === 0) {
    showToast("أضف منتجات للسلة أولًا");
    openDrawer(els.cartDrawer);
    return;
  }
  const formData = new FormData(els.checkoutForm);
  const message = encodeURIComponent(buildOrderMessage(formData));
  const phone = cleanWhatsappNumber(store.whatsapp);
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener");
  showToast("تم تجهيز رسالة الطلب على واتساب");
}

function renderAdminProducts() {
  els.adminProducts.replaceChildren();
  store.products.forEach((product) => {
    const row = document.createElement("div");
    row.className = "admin-product-row";
    row.innerHTML = `
      <div>
        <h3>${product.icon || "📦"} ${escapeHtml(product.name)}</h3>
        <p>${categories[product.category] || product.category} - ${money(product.price)}</p>
      </div>
      <div class="admin-row-actions">
        <button type="button" data-action="edit">تعديل</button>
        <button type="button" data-action="delete">حذف</button>
      </div>
    `;
    row.querySelector('[data-action="edit"]').addEventListener("click", () => fillProductForm(product));
    row.querySelector('[data-action="delete"]').addEventListener("click", () => deleteProduct(product.id));
    els.adminProducts.append(row);
  });
}

function fillProductForm(product) {
  els.productForm.elements.id.value = product.id;
  els.productForm.elements.name.value = product.name;
  els.productForm.elements.price.value = product.price;
  els.productForm.elements.category.value = product.category;
  els.productForm.elements.icon.value = product.icon || "";
  els.productForm.elements.description.value = product.description;
}

function clearProductForm() {
  els.productForm.reset();
  els.productForm.elements.id.value = "";
  els.productForm.elements.category.value = "stationery";
}

function saveProduct(event) {
  event.preventDefault();
  const form = els.productForm.elements;
  const data = {
    id: form.id.value || `p${Date.now()}`,
    name: form.name.value.trim(),
    description: form.description.value.trim(),
    price: Number(form.price.value || 0),
    category: form.category.value,
    icon: form.icon.value.trim() || "📦"
  };
  const index = store.products.findIndex((product) => product.id === data.id);
  if (index >= 0) store.products[index] = data;
  else store.products.unshift(data);
  saveStore();
  clearProductForm();
  renderAll();
  showToast("تم حفظ المنتج");
}

function deleteProduct(id) {
  store.products = store.products.filter((product) => product.id !== id);
  cart = cart.filter((item) => item.id !== id);
  saveStore();
  saveCart();
  renderAll();
  showToast("تم حذف المنتج");
}

function saveStoreInfo(event) {
  event.preventDefault();
  const form = els.storeForm.elements;
  store.name = form.name.value.trim() || defaultStore.name;
  store.whatsapp = form.whatsapp.value.trim() || defaultStore.whatsapp;
  store.address = form.address.value.trim() || defaultStore.address;
  store.hours = form.hours.value.trim() || defaultStore.hours;
  store.heroText = form.heroText.value.trim() || defaultStore.heroText;
  saveStore();
  renderAll();
  showToast("تم حفظ بيانات المتجر");
}

function resetStore() {
  store = structuredClone(defaultStore);
  cart = [];
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(CART_KEY);
  clearProductForm();
  renderAll();
  showToast("تم استرجاع بيانات المتجر الأصلية");
}

function exportStoreData() {
  const blob = new Blob([JSON.stringify(store, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "alalari-store-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

function addOffer() {
  const id = "offer-bag";
  if (!findProduct(id)) {
    store.products.unshift({
      id,
      name: store.offerTitle,
      description: store.offerText,
      price: 120,
      category: "school",
      icon: "⭐"
    });
    saveStore();
    renderAll();
  }
  addToCart(id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAll() {
  applyStoreInfo();
  renderCategories();
  renderProducts();
  renderCart();
  renderAdminProducts();
}

els.searchInput.addEventListener("input", (event) => {
  currentSearch = event.target.value;
  renderProducts();
});

els.cartOpen.addEventListener("click", () => openDrawer(els.cartDrawer));
els.quickCart.addEventListener("click", () => openDrawer(els.cartDrawer));
els.cartClose.addEventListener("click", closeDrawers);
els.adminOpen.addEventListener("click", () => openDrawer(els.adminPanel));
els.adminClose.addEventListener("click", closeDrawers);
els.overlay.addEventListener("click", closeDrawers);
els.checkoutJump.addEventListener("click", closeDrawers);
els.cartClear.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
  showToast("تم تفريغ السلة");
});
els.checkoutForm.addEventListener("submit", sendOrder);
els.storeForm.addEventListener("submit", saveStoreInfo);
els.productForm.addEventListener("submit", saveProduct);
els.newProduct.addEventListener("click", clearProductForm);
els.resetStore.addEventListener("click", resetStore);
els.exportData.addEventListener("click", exportStoreData);
els.offerAdd.addEventListener("click", addOffer);

renderAll();
