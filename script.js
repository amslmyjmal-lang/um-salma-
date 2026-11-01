/* Um Salma Perfumes - script.js (مشترك بين كل الصفحات) */
(function () {
  "use strict";

  /* ====== الإعدادات: عدّل المنتجات والأسعار هنا ====== */
  var CURRENCY = "ج.س";
  var PRODUCTS = [
    { id: 1, name: "ورد الطائف", cat: "نسائي", price: 25000, icon: "🌹", desc: "عطر زهري ناعم برائحة الورد." },
    { id: 2, name: "ياسمين الليل", cat: "نسائي", price: 22000, icon: "🌸", desc: "رائحة ياسمين هادئة تدوم طويلًا." },
    { id: 3, name: "خشب الصندل", cat: "رجالي", price: 28000, icon: "🌲", desc: "عطر خشبي دافئ للمناسبات." },
    { id: 4, name: "عنبر أسود", cat: "رجالي", price: 30000, icon: "🖤", desc: "رائحة قوية وفخمة بلمسة عنبر." },
    { id: 5, name: "عود كمبودي", cat: "عود وبخور", price: 45000, icon: "🔥", desc: "عود فاخر لتعطير البيت والملابس." },
    { id: 6, name: "بخور أم سلمى", cat: "عود وبخور", price: 18000, icon: "💨", desc: "خلطة بخور خاصة بالمتجر." }
  ];

  /* ====== أدوات صغيرة ====== */
  function $(id) { return document.getElementById(id); }
  function money(n) { return n.toLocaleString("en-US") + " " + CURRENCY; }
  function store(key, val) {
    try {
      if (val === undefined) { return JSON.parse(localStorage.getItem(key)); }
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  /* ====== CSS خاص بالـ JavaScript (السلة والمنتجات) ====== */
  var css = [
    ".pw-wrap{position:relative}",
    ".pw-wrap input{padding-left:72px}",
    ".pw-toggle{position:absolute;top:50%;left:10px;transform:translateY(-50%);padding:6px 10px;font:inherit;font-size:.85rem;color:var(--rose-dusk);background:transparent;border:0;border-radius:8px;cursor:pointer}",
    ".cart-btn{position:relative;min-height:40px;padding:8px 14px;font:inherit;font-weight:500;color:#fff;background:transparent;border:1.5px solid var(--rose-dusk);border-radius:10px;cursor:pointer}",
    ".cart-btn:hover{background:var(--plum-mid)}",
    ".badge{display:inline-block;min-width:22px;padding:1px 6px;margin-inline-start:4px;font-size:.8rem;font-weight:700;line-height:1.5;color:var(--plum-deep);background:var(--gold);border-radius:11px}",
    "#products{margin-top:clamp(32px,6vw,64px)}",
    "#products h2{font-size:clamp(1.6rem,5vw,2.1rem);margin-bottom:16px}",
    ".tools{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px}",
    ".tools input,.tools select{flex:1 1 200px;padding:12px 14px;font:inherit;font-size:1rem;color:var(--plum-deep);background:#fff;border:1.5px solid var(--line);border-radius:12px}",
    ".tools input:focus,.tools select:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 4px rgba(201,164,92,.25)}",
    ".products{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}",
    ".product{display:flex;flex-direction:column;padding:20px;background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 22px rgba(43,18,51,.07)}",
    ".product .pic{font-size:2.4rem}",
    ".product h3{margin:8px 0 2px;font-size:1.3rem}",
    ".product .tag{font-size:.85rem;color:var(--rose-dusk)}",
    ".product p{flex:1;margin:8px 0 12px;line-height:1.7;color:#5b4a60}",
    ".product .price{margin-bottom:10px;font-weight:700}",
    ".product .btn{width:100%}",
    "#noResults{padding:24px;text-align:center;color:var(--rose-dusk)}",
    ".overlay{position:fixed;inset:0;z-index:40;background:rgba(20,5,28,.55);opacity:0;pointer-events:none;transition:opacity .25s}",
    ".overlay.open{opacity:1;pointer-events:auto}",
    ".drawer{position:fixed;top:0;bottom:0;left:0;z-index:50;display:flex;flex-direction:column;width:min(100%,380px);background:var(--paper);box-shadow:8px 0 30px rgba(20,5,28,.35);transform:translateX(-105%);transition:transform .3s}",
    ".drawer.open{transform:none}",
    ".drawer-head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;color:var(--gold-soft);background:var(--plum-deep)}",
    ".drawer-head h2{font-size:1.4rem}",
    ".drawer-head button{padding:6px 12px;font:inherit;font-size:1.2rem;color:#fff;background:transparent;border:0;cursor:pointer}",
    ".drawer-body{flex:1;overflow-y:auto;padding:14px 18px}",
    ".empty{padding:30px 0;text-align:center;color:var(--rose-dusk)}",
    ".item{display:flex;align-items:center;gap:10px;padding:12px 0;border-bottom:1px solid var(--line)}",
    ".item .info{flex:1}",
    ".item .info b{display:block}",
    ".item .info span{font-size:.9rem;color:#5b4a60}",
    ".qty{display:flex;align-items:center;gap:6px}",
    ".qty button{width:32px;height:32px;font:inherit;font-weight:700;color:var(--plum-deep);background:#fff;border:1.5px solid var(--line);border-radius:8px;cursor:pointer}",
    ".qty .remove{color:var(--danger)}",
    ".drawer-foot{padding:16px 18px;padding-bottom:max(16px,env(safe-area-inset-bottom));background:#fff;border-top:1px solid var(--line)}",
    ".total{display:flex;justify-content:space-between;margin-bottom:12px;font-weight:700}",
    ".drawer-foot .btn{width:100%}",
    ".drawer-foot .clear{margin-top:8px;color:var(--plum-deep);background:transparent;border:1.5px solid var(--line);box-shadow:none}",
    "#cartMsg{min-height:1.4em;margin-top:8px;font-weight:700;text-align:center;color:#2e7d32}",
    ".counter{margin-top:4px;font-size:.85rem;text-align:left;color:#7a6a80}",
    "#msg.error{color:var(--danger)}"
  ].join("\n");
  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ====== 1) صفحة تسجيل الدخول ====== */
  var loginForm = $("loginForm");
  if (loginForm) {
    var pass = $("password");
    var wrap = document.createElement("div");
    wrap.className = "pw-wrap";
    pass.parentNode.insertBefore(wrap, pass);
    wrap.appendChild(pass);
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "pw-toggle";
    toggle.textContent = "إظهار";
    toggle.addEventListener("click", function () {
      var hidden = pass.type === "password";
      pass.type = hidden ? "text" : "password";
      toggle.textContent = hidden ? "إخفاء" : "إظهار";
    });
    wrap.appendChild(toggle);

    var attempts = 0, locked = false;
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = $("error");
      if (locked) { return; }
      var user = $("username").value.trim();
      var pw = pass.value.trim();
      // الاسم: um salma  والباسورد: 1234
      if (user === "um salma" && pw === "1234") {
        sessionStorage.setItem("loggedIn", "true");
        location.href = "services.html";
        return;
      }
      attempts++;
      if (attempts >= 3) {
        locked = true;
        var left = 10;
        var timer = setInterval(function () {
          err.textContent = "محاولات كثيرة. حاول بعد " + left + " ثانية";
          if (left-- <= 0) {
            clearInterval(timer);
            locked = false; attempts = 0; err.textContent = "";
          }
        }, 1000);
      } else {
        err.textContent = "خطأ في الاسم أو كلمة السر";
      }
    });
    return; // لا شيء آخر في صفحة الدخول
  }

  /* ====== 2) حماية الصفحات + تسجيل الخروج ====== */
  if (sessionStorage.getItem("loggedIn") !== "true") {
    location.replace("index.html");
    return;
  }
  var logoutBtn = $("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("loggedIn");
      location.href = "index.html";
    });
  }

  /* ====== 3) السلة (تظهر في كل الصفحات الداخلية) ====== */
  var cart = store("umSalmaCart") || {};
  function saveCart() { store("umSalmaCart", cart); renderCart(); }
  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) { if (PRODUCTS[i].id === id) { return PRODUCTS[i]; } }
    return null;
  }

  var nav = document.querySelector("nav");
  var cartBtn = document.createElement("button");
  cartBtn.type = "button";
  cartBtn.className = "cart-btn";
  cartBtn.innerHTML = "🛒 السلة <span class='badge' id='cartCount'>0</span>";
  nav.insertBefore(cartBtn, logoutBtn);

  var overlay = document.createElement("div");
  overlay.className = "overlay";
  var drawer = document.createElement("aside");
  drawer.className = "drawer";
  drawer.setAttribute("aria-label", "سلة الطلبات");
  drawer.innerHTML =
    "<div class='drawer-head'><h2>سلة الطلبات</h2><button type='button' id='closeCart' aria-label='إغلاق'>✕</button></div>" +
    "<div class='drawer-body' id='cartBody'></div>" +
    "<div class='drawer-foot'><div class='total'><span>الإجمالي</span><span id='cartTotal'></span></div>" +
    "<button type='button' class='btn' id='checkout'>إتمام الطلب</button>" +
    "<button type='button' class='btn clear' id='clearCart'>تفريغ السلة</button>" +
    "<div id='cartMsg' role='status'></div></div>";
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  function openCart() { overlay.classList.add("open"); drawer.classList.add("open"); }
  function closeCart() { overlay.classList.remove("open"); drawer.classList.remove("open"); }
  cartBtn.addEventListener("click", openCart);
  overlay.addEventListener("click", closeCart);
  $("closeCart").addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCart(); } });

  function renderCart() {
    var body = $("cartBody"), count = 0, total = 0, html = "";
    Object.keys(cart).forEach(function (id) {
      var p = findProduct(Number(id));
      if (!p) { delete cart[id]; return; }
      var q = cart[id];
      count += q; total += p.price * q;
      html += "<div class='item'><div class='info'><b>" + p.icon + " " + p.name + "</b><span>" + money(p.price * q) + "</span></div>" +
        "<div class='qty'><button type='button' data-act='minus' data-id='" + id + "' aria-label='إنقاص'>−</button>" +
        "<span>" + q + "</span>" +
        "<button type='button' data-act='plus' data-id='" + id + "' aria-label='زيادة'>+</button>" +
        "<button type='button' class='remove' data-act='del' data-id='" + id + "' aria-label='حذف'>🗑</button></div></div>";
    });
    body.innerHTML = html || "<p class='empty'>السلة فارغة</p>";
    $("cartCount").textContent = count;
    $("cartTotal").textContent = money(total);
  }
  $("cartBody").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-act]");
    if (!b) { return; }
    var id = b.getAttribute("data-id"), act = b.getAttribute("data-act");
    if (act === "plus") { cart[id]++; }
    if (act === "minus") { cart[id]--; if (cart[id] <= 0) { delete cart[id]; } }
    if (act === "del") { delete cart[id]; }
    saveCart();
  });
  $("clearCart").addEventListener("click", function () { cart = {}; saveCart(); $("cartMsg").textContent = ""; });
  $("checkout").addEventListener("click", function () {
    var msg = $("cartMsg");
    if (!Object.keys(cart).length) { msg.style.color = "#b3261e"; msg.textContent = "السلة فارغة"; return; }
    msg.style.color = "#2e7d32";
    msg.textContent = "تم استلام طلبك! سنتواصل معك قريبًا.";
    cart = {}; saveCart();
    msg.textContent = "تم استلام طلبك! سنتواصل معك قريبًا.";
  });
  renderCart();

  /* ====== 4) المنتجات: بحث وتصفية (صفحة الخدمات) ====== */
  var grid = $("productGrid");
  if (grid) {
    var search = $("searchBox"), filter = $("catFilter"), none = $("noResults");
    var cats = [];
    PRODUCTS.forEach(function (p) { if (cats.indexOf(p.cat) === -1) { cats.push(p.cat); } });
    filter.innerHTML = "<option value=''>كل الأصناف</option>" +
      cats.map(function (c) { return "<option>" + c + "</option>"; }).join("");

    function renderProducts() {
      var q = search.value.trim(), c = filter.value;
      var list = PRODUCTS.filter(function (p) {
        return (!c || p.cat === c) && (!q || (p.name + " " + p.desc).indexOf(q) !== -1);
      });
      grid.innerHTML = list.map(function (p) {
        return "<article class='product'><div class='pic'>" + p.icon + "</div><h3>" + p.name + "</h3>" +
          "<span class='tag'>" + p.cat + "</span><p>" + p.desc + "</p>" +
          "<div class='price'>" + money(p.price) + "</div>" +
          "<button type='button' class='btn' data-add='" + p.id + "'>أضف للسلة</button></article>";
      }).join("");
      none.hidden = list.length > 0;
    }
    search.addEventListener("input", renderProducts);
    filter.addEventListener("change", renderProducts);
    grid.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-add]");
      if (!b) { return; }
      var id = b.getAttribute("data-add");
      cart[id] = (cart[id] || 0) + 1;
      saveCart();
      b.textContent = "تمت الإضافة ✓";
      setTimeout(function () { b.textContent = "أضف للسلة"; }, 1000);
    });
    renderProducts();
  }

  /* ====== 5) صفحة التواصل: تحقق وعدّاد حروف ====== */
  var contactForm = $("contactForm");
  if (contactForm) {
    var opinion = $("opinion"), MAX = 500;
    opinion.maxLength = MAX;
    var counter = document.createElement("div");
    counter.className = "counter";
    opinion.parentNode.appendChild(counter);
    function updateCounter() { counter.textContent = opinion.value.length + " / " + MAX; }
    opinion.addEventListener("input", updateCounter);
    updateCounter();

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("msg"), name = $("name").value.trim(), email = $("email").value.trim(), text = opinion.value.trim();
      msg.className = "error";
      if (name.length < 2) { msg.textContent = "اكتب اسمك (حرفان على الأقل)"; $("name").focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "اكتب بريدًا إلكترونيًا صحيحًا"; $("email").focus(); return; }
      if (text.length < 10) { msg.textContent = "اكتب رأيك في 10 أحرف على الأقل"; opinion.focus(); return; }
      msg.className = "";
      msg.textContent = "شكرًا لك يا " + name + "! تم استلام رسالتك.";
      contactForm.reset();
      updateCounter();
    });
  }
})();
