
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================
     UTILITAS
     JavaScript biasa + JSDoc untuk pemeriksaan tipe
  ========================================= */

  /**
   * @param {string} selector
   * @param {ParentNode} [root]
   * @returns {Element|null}
   */
  const $ = (selector, root = document) =>
    root.querySelector(selector);

  /**
   * @param {string} selector
   * @param {ParentNode} [root]
   * @returns {Element[]}
   */
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  /**
   * @param {number|string|null|undefined} value
   * @returns {string}
   */
  const rupiah = value =>
    "Rp" + new Intl.NumberFormat("id-ID").format(Number(value) || 0);

  /**
   * @template T
   * @param {string} key
   * @param {T} [fallback]
   * @returns {T|any}
   */
  function readStorage(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  /**
   * @param {string} key
   * @param {any} value
   * @returns {boolean}
   */
  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      showToast(
        "Penyimpanan browser tidak tersedia. Periksa pengaturan browser."
      );
      return false;
    }
  }

  /**
   * @param {string} message
   */
  function showToast(message) {
    const toast = $("#siteToast");

    if (!toast) {
      alert(message);
      return;
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timeout);

    showToast.timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  /**
   * @param {Element|null} modal
   */
  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");

    if (
      !$(".ewallet-modal.show") &&
      !$(".payment-modal.show") &&
      !$(".order-modal")
    ) {
      document.body.classList.remove("modal-open");
    }
  }

  /**
   * @param {Element|null} modal
   */
  function openModal(modal) {
    if (!modal) return;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  /* =========================================
     HAMBURGER MENU
  ========================================= */

  const menuToggle = $("#menuToggle");
  const menuPanel = $("#menuPanel");
  const menuBackdrop = $("#menuBackdrop");
  const menuClose = $("#menuClose");

  /**
   * @param {boolean} open
   */
  function setMenu(open) {
    if (!menuPanel || !menuBackdrop || !menuToggle) return;

    menuPanel.classList.toggle("show", open);
    menuBackdrop.classList.toggle("show", open);
    menuToggle.classList.toggle("active", open);

    menuToggle.setAttribute("aria-expanded", String(open));
    menuPanel.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Tutup menu" : "Buka menu"
    );

    document.body.classList.toggle("menu-open", open);
  }

  menuToggle?.addEventListener("click", () => {
    setMenu(!menuPanel?.classList.contains("show"));
  });

  menuClose?.addEventListener("click", () => setMenu(false));
  menuBackdrop?.addEventListener("click", () => setMenu(false));

  $$(".menu-link").forEach(link => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setMenu(false);
      closeModal($("#ewalletModal"));
      closeModal($("#ewalletResultModal"));

      const gameModal = $(".order-modal");
      if (gameModal) {
        gameModal.remove();

        if (!$(".ewallet-modal.show") && !$(".payment-modal.show")) {
          document.body.classList.remove("modal-open");
        }
      }
    }
  });

  $("#cartButton")?.addEventListener("click", () => {
    $("#riwayat")?.scrollIntoView({ behavior: "smooth" });
  });

  /* =========================================
     DAFTAR NEGARA
  ========================================= */

  const countries = [
    { flag: "🇿🇦", name: "Afrika Selatan", code: "+27", min: 9, max: 9 },
    { flag: "🇦🇫", name: "Afghanistan", code: "+93", min: 9, max: 9 },
    { flag: "🇸🇦", name: "Arab Saudi", code: "+966", min: 9, max: 9 },
    { flag: "🇦🇷", name: "Argentina", code: "+54", min: 10, max: 10 },
    { flag: "🇺🇸", name: "Amerika Serikat", code: "+1", min: 10, max: 10 },
    { flag: "🇦🇺", name: "Australia", code: "+61", min: 9, max: 9 },
    { flag: "🇦🇹", name: "Austria", code: "+43", min: 10, max: 13 },
    { flag: "🇧🇪", name: "Belgia", code: "+32", min: 9, max: 9 },
    { flag: "🇧🇷", name: "Brasil", code: "+55", min: 10, max: 11 },
    { flag: "🇧🇳", name: "Brunei", code: "+673", min: 7, max: 7 },
    { flag: "🇨🇱", name: "Chile", code: "+56", min: 9, max: 9 },
    { flag: "🇨🇳", name: "China", code: "+86", min: 11, max: 11 },
    { flag: "🇨🇿", name: "Ceko", code: "+420", min: 9, max: 9 },
    { flag: "🇨🇴", name: "Kolombia", code: "+57", min: 10, max: 10 },
    { flag: "🇩🇰", name: "Denmark", code: "+45", min: 8, max: 8 },
    { flag: "🇪🇬", name: "Mesir", code: "+20", min: 10, max: 10 },
    { flag: "🇫🇮", name: "Finlandia", code: "+358", min: 9, max: 12 },
    { flag: "🇫🇷", name: "Prancis", code: "+33", min: 9, max: 9 },
    { flag: "🇩🇪", name: "Jerman", code: "+49", min: 10, max: 11 },
    { flag: "🇬🇷", name: "Yunani", code: "+30", min: 10, max: 10 },
    { flag: "🇭🇰", name: "Hong Kong", code: "+852", min: 8, max: 8 },
    { flag: "🇭🇺", name: "Hungaria", code: "+36", min: 9, max: 9 },
    { flag: "🇮🇳", name: "India", code: "+91", min: 10, max: 10 },
    { flag: "🇮🇩", name: "Indonesia", code: "+62", min: 10, max: 13 },
    { flag: "🇮🇪", name: "Irlandia", code: "+353", min: 9, max: 9 },
    { flag: "🇮🇱", name: "Israel", code: "+972", min: 9, max: 9 },
    { flag: "🇮🇹", name: "Italia", code: "+39", min: 9, max: 10 },
    { flag: "🇯🇵", name: "Jepang", code: "+81", min: 10, max: 10 },
    { flag: "🇨🇦", name: "Kanada", code: "+1", min: 10, max: 10 },
    { flag: "🇰🇷", name: "Korea Selatan", code: "+82", min: 9, max: 10 },
    { flag: "🇲🇾", name: "Malaysia", code: "+60", min: 9, max: 10 },
    { flag: "🇲🇽", name: "Meksiko", code: "+52", min: 10, max: 10 },
    { flag: "🇳🇴", name: "Norwegia", code: "+47", min: 8, max: 8 },
    { flag: "🇳🇿", name: "Selandia Baru", code: "+64", min: 8, max: 10 },
    { flag: "🇵🇰", name: "Pakistan", code: "+92", min: 10, max: 10 },
    { flag: "🇵🇪", name: "Peru", code: "+51", min: 9, max: 9 },
    { flag: "🇵🇭", name: "Filipina", code: "+63", min: 10, max: 10 },
    { flag: "🇵🇱", name: "Polandia", code: "+48", min: 9, max: 9 },
    { flag: "🇵🇹", name: "Portugal", code: "+351", min: 9, max: 9 },
    { flag: "🇷🇺", name: "Rusia", code: "+7", min: 10, max: 10 },
    { flag: "🇸🇬", name: "Singapura", code: "+65", min: 8, max: 8 },
    { flag: "🇪🇸", name: "Spanyol", code: "+34", min: 9, max: 9 },
    { flag: "🇸🇪", name: "Swedia", code: "+46", min: 9, max: 10 },
    { flag: "🇨🇭", name: "Swiss", code: "+41", min: 9, max: 9 },
    { flag: "🇹🇼", name: "Taiwan", code: "+886", min: 9, max: 9 },
    { flag: "🇹🇭", name: "Thailand", code: "+66", min: 9, max: 9 },
    { flag: "🇹🇷", name: "Turki", code: "+90", min: 10, max: 10 },
    { flag: "🇬🇧", name: "Inggris", code: "+44", min: 10, max: 10 },
    { flag: "🇦🇪", name: "Uni Emirat Arab", code: "+971", min: 9, max: 9 },
    { flag: "🇺🇦", name: "Ukraina", code: "+380", min: 9, max: 9 },
    { flag: "🇻🇳", name: "Vietnam", code: "+84", min: 9, max: 10 }
  ];

  countries.sort((a, b) => a.name.localeCompare(b.name, "id"));

  /* =========================================
     DETEKSI HALAMAN GAME
  ========================================= */

  const currentPage = location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  const isGamePage =
    currentPage === "ml.html" || currentPage === "ff.html";

  const isFreeFire = currentPage === "ff.html";
  const game = isFreeFire ? "Free Fire" : "Mobile Legends";

  /* =========================================
     CHECKOUT MOBILE LEGENDS / FREE FIRE
  ========================================= */

  if (isGamePage) {
    $$(".product-button").forEach(button => {
      button.addEventListener("click", event => {
        const card = button.closest(".product-card");
        if (!card) return;

        const productNameElement = $("h3", card);
        const priceElement = $(".price", card);

        if (!productNameElement || !priceElement) return;

        event.preventDefault();

        const productName = productNameElement.textContent.trim();
        const price = priceElement.textContent.trim();

        const modal = document.createElement("div");
        modal.className = "order-modal";

        const countryOptions = countries.map(country => `
          <option value="${country.code}"
            data-min="${country.min}"
            data-max="${country.max}"
            data-name="${country.name}">
            ${country.flag} ${country.name} (${country.code})
          </option>
        `).join("");

        const gameFields = isFreeFire
          ? `
            <div class="form-group">
              <label for="userId">ID Game</label>
              <input type="text" id="userId"
                placeholder="Masukkan ID Game" autocomplete="off">
            </div>
          `
          : `
            <div class="form-group">
              <label for="userId">User ID</label>
              <input type="text" id="userId"
                placeholder="Masukkan User ID" autocomplete="off">
            </div>
            <div class="form-group">
              <label for="zoneId">Zone ID</label>
              <input type="text" id="zoneId"
                placeholder="Masukkan Zone ID" autocomplete="off">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email"
                placeholder="contoh@email.com" autocomplete="email">
            </div>
          `;

        modal.innerHTML = `
          <div class="modal-box" role="dialog" aria-modal="true"
            aria-labelledby="gameModalTitle">
            <button type="button" class="modal-close"
              aria-label="Tutup">×</button>
            <p class="eyebrow">DATA PEMESANAN</p>
            <h2 id="gameModalTitle">${productName}</h2>
            <p class="modal-price">${price}</p>

            ${gameFields}

            <div class="form-group">
              <label for="country">Negara</label>
              <select id="country">${countryOptions}</select>
            </div>

            <div class="form-group">
              <label for="phone">No. HP</label>
              <div class="phone-field">
                <span class="phone-country-code" id="phoneCode">+62</span>
                <input type="tel" id="phone"
                  placeholder="XXXXXXXXXX"
                  inputmode="numeric" autocomplete="tel">
              </div>
              <small id="phoneHint" class="phone-hint"></small>
            </div>

            <p class="form-error" id="formError" aria-live="polite"></p>

            <button type="button" class="button modal-submit"
              id="continueButton">Lanjutkan →</button>
          </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add("modal-open");

        const closeButton = $(".modal-close", modal);
        const continueButton = $("#continueButton", modal);
        const userIdInput = $("#userId", modal);
        const zoneIdInput = $("#zoneId", modal);
        const emailInput = $("#email", modal);
        const countrySelect = $("#country", modal);
        const phoneCode = $("#phoneCode", modal);
        const phoneInput = $("#phone", modal);
        const phoneHint = $("#phoneHint", modal);
        const formError = $("#formError", modal);

        function closeGameModal() {
          modal.remove();

          if (
            !$(".order-modal") &&
            !$(".ewallet-modal.show") &&
            !$(".payment-modal.show")
          ) {
            document.body.classList.remove("modal-open");
          }
        }

        function updatePhoneRules() {
          const option =
            countrySelect.options[countrySelect.selectedIndex];

          phoneCode.textContent = option.value;
          phoneInput.maxLength = Number(option.dataset.max);

          phoneHint.textContent =
            `${option.dataset.name} • ` +
            `${option.dataset.min}-${option.dataset.max} digit`;

          formError.textContent = "";
        }

        countrySelect.value = "+62";
        updatePhoneRules();

        countrySelect.addEventListener("change", updatePhoneRules);

        phoneInput.addEventListener("input", () => {
          const option =
            countrySelect.options[countrySelect.selectedIndex];

          phoneInput.value = phoneInput.value
            .replace(/\D/g, "")
            .slice(0, Number(option.dataset.max));

          formError.textContent = "";
        });

        closeButton.addEventListener("click", closeGameModal);

        modal.addEventListener("click", event => {
          if (event.target === modal) closeGameModal();
        });

        continueButton.addEventListener("click", () => {
          const userId = userIdInput.value.trim();
          const zoneId = zoneIdInput ? zoneIdInput.value.trim() : "";
          const email = emailInput ? emailInput.value.trim() : "";
          const phone = phoneInput.value.trim();

          formError.textContent = "";

          if (!userId) {
            formError.textContent = isFreeFire
              ? "ID Game wajib diisi."
              : "User ID wajib diisi.";
            return;
          }

          if (!isFreeFire) {
            if (!zoneId) {
              formError.textContent = "Zone ID wajib diisi.";
              return;
            }

            if (!email) {
              formError.textContent = "Email wajib diisi.";
              return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              formError.textContent =
                "Email harus menggunakan format yang valid.";
              return;
            }
          }

          if (!phone) {
            formError.textContent = "Nomor HP wajib diisi.";
            return;
          }

          if (!/^\d+$/.test(phone)) {
            formError.textContent =
              "Nomor HP hanya boleh berisi angka.";
            return;
          }

          const option =
            countrySelect.options[countrySelect.selectedIndex];

          const countryCode = option.value;
          const countryName = option.dataset.name;
          const min = Number(option.dataset.min);
          const max = Number(option.dataset.max);

          if (phone.length < min || phone.length > max) {
            const digitText =
              min === max ? `${min}` : `${min}-${max}`;

            formError.textContent =
              `Nomor HP ${countryName} harus ${digitText} digit.`;
            return;
          }

          const checkoutData = {
            game,
            product: productName,
            price,
            userId,
            zoneId,
            email,
            phone,
            phoneInternational:
              countryCode + phone.replace(/^0+/, ""),
            country: countryName,
            countryCode
          };

          try {
            localStorage.setItem(
              "hndCheckout",
              JSON.stringify(checkoutData)
            );

            localStorage.removeItem("hndPaymentMethod");
            localStorage.removeItem("hndPaymentNumber");
          } catch {
            formError.textContent =
              "Data tidak bisa disimpan. Periksa penyimpanan browser.";
            return;
          }

          location.href = "checkout.html";
        });
      });
    });
  }

  /* =========================================
     E-WALLET
  ========================================= */

  const walletButtons = $$(".ewallet-button");
  const walletModal = $("#ewalletModal");
  const closeWalletModal = $("#closeEwalletModal");
  const selectedWallet = $("#selectedWallet");
  const walletName = $("#walletName");
  const walletIcon = $("#walletIcon");
  const walletNumber = $("#ewalletNumber");
  const walletAmount = $("#ewalletAmount");
  const saldoPrice = $("#saldoPrice");
  const totalPrice = $("#totalPrice");
  const walletError = $("#ewalletError");
  const continueWallet = $("#continueEwallet");

  const resultModal = $("#ewalletResultModal");
  const closeResultModal = $("#closeEwalletResult");
  const finishWallet = $("#finishEwalletButton");
  const copyInvoiceButton = $("#copyInvoiceButton");

  let currentWallet = "";
  let lastCreatedInvoice = "";

  const walletIcons = {
    DANA: "💙",
    OVO: "🟣",
    GoPay: "🟢"
  };

  function updateWalletTotal() {
    const amount = Number(walletAmount?.value) || 0;

    if (saldoPrice) saldoPrice.textContent = rupiah(amount);
    if (totalPrice) totalPrice.textContent = rupiah(amount + 3000);
  }

  /** @param {string} wallet */
(wallet) => {
    if (
      !selectedWallet ||
      !walletName ||
      !walletIcon ||
      !walletNumber ||
      !walletAmount ||
      !walletError ||
      !walletModal
    ) {
      showToast("Form E-Wallet belum lengkap di index.html.");
      return;
    }

    currentWallet = wallet;

    selectedWallet.textContent = "Top Up " + wallet;
    walletName.textContent = wallet;
    walletIcon.textContent = walletIcons[wallet] || "💳";

    walletNumber.value = "";
    walletAmount.value = "";
    walletError.textContent = "";

    updateWalletTotal();
    openModal(walletModal);

    setTimeout(() => walletNumber.focus(), 100);
  }

  walletButtons.forEach(button => {
    button.addEventListener("click", () => {
      openWallet(button.dataset.wallet || "");
    });
  });

  closeWalletModal?.addEventListener("click", () => {
    closeModal(walletModal);
  });

  walletModal?.addEventListener("click", event => {
    if (event.target === walletModal) closeModal(walletModal);
  });

  walletNumber?.addEventListener("input", () => {
    walletNumber.value = walletNumber.value
      .replace(/\D/g, "")
      .slice(0, 16);

    if (walletError) walletError.textContent = "";
  });

  walletAmount?.addEventListener("change", updateWalletTotal);

  continueWallet?.addEventListener("click", () => {
    const phoneNumber = (walletNumber?.value || "")
      .replace(/\D/g, "");

    const amount = Number(walletAmount?.value) || 0;
    const admin = 3000;

    if (!currentWallet) {
      if (walletError) {
        walletError.textContent =
          "Pilih E-Wallet terlebih dahulu.";
      }
      return;
    }

    if (!phoneNumber) {
      if (walletError) {
        walletError.textContent =
          "Masukkan nomor E-Wallet terlebih dahulu.";
      }
      return;
    }

    if (phoneNumber.length < 10 || phoneNumber.length > 16) {
      if (walletError) {
        walletError.textContent =
          "Nomor E-Wallet harus berisi 10–16 digit.";
      }
      return;
    }

    if (amount <= 0) {
      if (walletError) {
        walletError.textContent =
          "Pilih nominal saldo terlebih dahulu.";
      }
      return;
    }

    const invoice =
      "HND-EW-" + Date.now().toString(36).toUpperCase();

    const checkoutData = {
      type: "ewallet",
      invoice,
      wallet: currentWallet,
      number: phoneNumber,
      amount,
      admin,
      total: amount + admin,
      createdAt: new Date().toISOString(),
      status: "Menunggu konfirmasi pembayaran"
    };

    if (!writeStorage("hndEwallet", checkoutData)) return;

    const history = readStorage("hndHistory", []);
    const safeHistory = Array.isArray(history) ? history : [];

    safeHistory.unshift(checkoutData);

    if (!writeStorage("hndHistory", safeHistory.slice(0, 100))) {
      return;
    }

    lastCreatedInvoice = invoice;

    const invoiceOutput = $("#ewalletInvoiceOutput");
    const nameOutput = $("#ewalletNameOutput");
    const amountOutput = $("#ewalletAmountOutput");
    const totalOutput = $("#ewalletTotalOutput");

    if (invoiceOutput) invoiceOutput.textContent = invoice;
    if (nameOutput) nameOutput.textContent = currentWallet;
    if (amountOutput) amountOutput.textContent = rupiah(amount);
    if (totalOutput) totalOutput.textContent = rupiah(amount + admin);

    closeModal(walletModal);

    if (resultModal) {
      openModal(resultModal);
    } else {
      showToast("Invoice dibuat: " + invoice);
    }

    renderHistory();
  });

  closeResultModal?.addEventListener("click", () => {
    closeModal(resultModal);
  });

  finishWallet?.addEventListener("click", () => {
    closeModal(resultModal);
  });

  resultModal?.addEventListener("click", event => {
    if (event.target === resultModal) closeModal(resultModal);
  });

  copyInvoiceButton?.addEventListener("click", async () => {
    if (!lastCreatedInvoice) return;

    try {
      await navigator.clipboard.writeText(lastCreatedInvoice);
      showToast("Invoice berhasil disalin.");
    } catch {
      const helper = document.createElement("textarea");

      helper.value = lastCreatedInvoice;
      helper.style.position = "fixed";
      helper.style.opacity = "0";

      document.body.appendChild(helper);
      helper.select();

      let copied = false;

      try {
        copied = navigator.clipboard.writeText(teksYangMauDisalin)
  .then(() => {
    showToast("Berhasil disalin!");
  })
  .catch(() => {
    showToast("Gagal menyalin teks.");
  });
      } catch {
        copied = false;
      }

      helper.remove();

      showToast(
        copied
          ? "Invoice berhasil disalin."
          : "Salin invoice secara manual: " + lastCreatedInvoice
      );
    }
  });

  /* =========================================
     RIWAYAT TRANSAKSI LOKAL
  ========================================= */

  const historyList = $("#historyList");

  function renderHistory() {
    if (!historyList) return;

    const history = readStorage("hndHistory", []);
    const items = Array.isArray(history) ? history : [];

    historyList.replaceChildren();

    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty-state";

      const icon = document.createElement("span");
      icon.textContent = "🕘";

      const message = document.createElement("p");
      message.textContent =
        "Belum ada riwayat E-Wallet di perangkat ini.";

      empty.append(icon, message);
      historyList.appendChild(empty);
      return;
    }

    items.forEach(item => {
      const card = document.createElement("article");
      card.className = "history-item";

      const head = document.createElement("div");
      head.className = "history-item-head";

      const titleGroup = document.createElement("div");
      const title = document.createElement("h3");

      title.textContent =
        `${item.wallet || "E-Wallet"} · ` +
        `${item.invoice || "Tanpa invoice"}`;

      const date = document.createElement("small");

      date.textContent = item.createdAt
        ? new Date(item.createdAt).toLocaleString("id-ID")
        : "Tanggal tidak tersedia";

      titleGroup.append(title, date);

      const price = document.createElement("strong");
      price.textContent = rupiah(item.total);

      head.append(titleGroup, price);

      const number = document.createElement("p");
      number.textContent =
        "Nomor penerima: " + (item.number || "-");

      const status = document.createElement("p");
      status.textContent =
        "Status: " + (item.status || "Belum dikonfirmasi");

      const invoice = document.createElement("p");
      invoice.textContent =
        "Nominal saldo: " + rupiah(item.amount);

      card.append(head, number, invoice, status);
      historyList.appendChild(card);
    });
  }

  $("#clearHistoryButton")?.addEventListener("click", () => {
    const history = readStorage("hndHistory", []);

    if (!Array.isArray(history) || !history.length) {
      showToast("Riwayat lokal masih kosong.");
      return;
    }

    if (
      !confirm(
        "Hapus semua riwayat E-Wallet dari perangkat ini? " +
        "Tindakan ini tidak dapat dibatalkan."
      )
    ) {
      return;
    }

    try {
      localStorage.removeItem("hndHistory");
      renderHistory();
      showToast("Riwayat lokal dihapus.");
    } catch {
      showToast("Riwayat tidak bisa dihapus.");
    }
  });

  renderHistory();

  /* =========================================
     CEK INVOICE LOKAL
  ========================================= */

  $("#orderLookupForm")?.addEventListener("submit", event => {
    event.preventDefault();

    const query = ($("#orderInvoice")?.value || "")
      .trim()
      .toUpperCase();

    const result = $("#orderLookupResult");
    if (!result) return;

    result.replaceChildren();

    if (!query) {
      const message = document.createElement("p");
      message.className = "muted";
      message.textContent =
        "Masukkan nomor invoice terlebih dahulu.";

      result.appendChild(message);
      return;
    }

    const history = readStorage("hndHistory", []);
    const items = Array.isArray(history) ? history : [];

    const order = items.find(
      item => String(item.invoice || "").toUpperCase() === query
    );

    if (!order) {
      const message = document.createElement("p");
      message.className = "muted";

      message.textContent =
        "Invoice tidak ditemukan di riwayat lokal perangkat ini. " +
        "Pastikan nomor invoice benar atau gunakan perangkat/browser yang sama.";

      result.appendChild(message);
      return;
    }

    const details = document.createElement("div");
    details.className = "result-details";

    const rows = [
      ["Invoice", order.invoice],
      ["Jenis", order.wallet || "E-Wallet"],
      ["Nominal", rupiah(order.amount)],
      ["Biaya admin", rupiah(order.admin)],
      ["Total", rupiah(order.total)],
      ["Status", order.status || "Belum dikonfirmasi"],
      [
        "Tanggal",
        order.createdAt
          ? new Date(order.createdAt).toLocaleString("id-ID")
          : "-"
      ]
    ];

    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.className = "result-row";

      const left = document.createElement("span");
      left.textContent = label;

      const right = document.createElement("strong");
      right.textContent = value ?? "-";

      row.append(left, right);
      details.appendChild(row);
    });

    result.appendChild(details);
  });
});
