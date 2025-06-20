const VAT_RATE = 0.21;

    const form = document.getElementById("orderForm");
    const totalPriceEl = document.getElementById("totalPrice");
    const summaryEl = document.getElementById("summary");
    const productGrid = document.getElementById("productGrid");
    const quantityInput = document.getElementById("quantity");
    const unitPriceHidden = document.getElementById("unitPrice");
    const productHidden = document.getElementById("productInput");
    const unitPriceVisible = document.getElementById("unitPriceVisible");

    let exchangeRates = {};

    // Inicializuj všechny produkty jako nezaškrtnuté (šedý rámeček)
    document.querySelectorAll(".product-card").forEach(card => {
      card.classList.remove("selected");
    });

    productGrid.addEventListener("click", (e) => {
      if (!highlightAndReportInvalid(e)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const card = e.target.closest(".product-card");
      if (!card) return;

      document.querySelectorAll(".product-card").forEach(el => el.classList.remove("selected"));
      card.classList.add("selected");

      const product = card.dataset.product;
      const price = parseFloat(card.dataset.price);
      productHidden.value = product;
      unitPriceHidden.value = price.toFixed(2);
      unitPriceVisible.value = price.toFixed(2);
      updateTotal();
    });

    function updateTotal() {
      const unit = parseFloat(unitPriceHidden.value) || 0;
      const qty = parseInt(quantityInput.value) || 0;
      const total = unit * qty;
      totalPriceEl.textContent = total.toFixed(2);
    }

    quantityInput.addEventListener("input", updateTotal);

    
  // 🔄 NOVÁ FUNKCE: Načítání kurzů přes proxy
  async function loadRates() {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const cnbUrl = encodeURIComponent('https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml');

    try {
      const res = await fetch(`${proxyUrl}${cnbUrl}`);
      if (!res.ok) throw new Error("Chyba při načítání přes proxy.");

      const data = await res.json();

      if (!data.contents || data.contents.startsWith("<!DOCTYPE html")) {
        throw new Error("Proxy vrátila HTML místo XML.");
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data.contents, "text/xml");
      const rows = xmlDoc.getElementsByTagName("radek");

      exchangeRates = {};
      for (let i = 0; i < rows.length; i++) {
        const code = rows[i].getAttribute("kod");
        const amount = parseInt(rows[i].getAttribute("mnozstvi"));
        const rateStr = rows[i].getAttribute("kurz").replace(",", ".");
        const rate = parseFloat(rateStr) / amount;

        exchangeRates[code] = rate;
      }

      console.log("Načtené kurzy:", exchangeRates);
    } catch (e) {
      console.error("Chyba při načítání kurzů:", e);
      alert("Kurzovní lístek ČNB se nepodařilo načíst. Proxy server pravděpodobně nevrací očekávaná data.");
    }
  }

  loadRates();

    
    const personalFields = [
      document.querySelector('input[name="name"]'),
      document.querySelector('input[name="email"]'),
      document.querySelector('input[name="phone"]'),
      document.querySelector('input[name="street"]'),
      document.querySelector('input[name="city"]'),
      document.querySelector('input[name="zip"]')
    ];

    function highlightAndReportInvalid(e) {
      let firstInvalid = null;
      personalFields.forEach(input => {
        if (!input.checkValidity() || input.value.trim() === "") {
          input.classList.add("invalid-input");
          if (!firstInvalid) firstInvalid = input;
        } else {
          input.classList.remove("invalid-input");
        }
      });
      if (firstInvalid) {
        e.preventDefault();
        firstInvalid.reportValidity();
        return false;
      }
      return true;
    }

    // Původní výběr produktu nahradíme touto verzí
    productGrid.addEventListener("click", (e) => {
      if (!highlightAndReportInvalid(e)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      const card = e.target.closest(".product-card");
      if (!card) return;

      document.querySelectorAll(".product-card").forEach(el => el.classList.remove("selected"));
      card.classList.add("selected");

      const product = card.dataset.product;
      const price = parseFloat(card.dataset.price);
      productHidden.value = product;
      unitPriceHidden.value = price.toFixed(2);
      unitPriceVisible.value = price.toFixed(2);
      updateTotal();
    });

    // Přidáme ochranu i na input kusů
    quantityInput.addEventListener("focus", (e) => {
      if (!highlightAndReportInvalid(e)) quantityInput.blur();
    });

    quantityInput.addEventListener("input", (e) => {
      if (!highlightAndReportInvalid(e)) {
        e.preventDefault();
        quantityInput.value = "1";
        return;
      }
      updateTotal();
    });

    quantityInput.addEventListener("focus", (e) => {
      if (!highlightAndReportInvalid(e)) {
        quantityInput.blur();
      }
    });


    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const formData = new FormData(form);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const street = formData.get("street");
      const city = formData.get("city");
      const zip = formData.get("zip");
      const address = `${street}, ${city}, ${zip}`;
      
      const selectedProduct = formData.get("product");
      if (!selectedProduct) {
        alert("Vyberte prosím produkt.");
        productGrid.classList.add("highlight-error");
        return;
      } else {
        productGrid.classList.remove("highlight-error");
      }

      const product = formData.get("product");
      const unit = parseFloat(formData.get("unitPrice"));
      const qty = parseInt(formData.get("quantity"));
      const total = unit * qty;
      const base = total / (1 + VAT_RATE);
      const vat = total - base;

      
    const currencyNames = {
      EUR: "Eurozóna",
      USD: "USA",
      GBP: "Velká Británie",
      PLN: "Polsko",
      HUF: "Maďarsko",
      CHF: "Švýcarsko",
      JPY: "Japonsko",
      CNY: "Čína",
      NOK: "Norsko",
      SEK: "Švédsko",
      DKK: "Dánsko",
      AUD: "Austrálie",
      CAD: "Kanada",
      BGN: "Bulharsko",
      RON: "Rumunsko",
      HRK: "Chorvatsko",
      RUB: "Rusko",
      KRW: "Jižní Korea",
      TRY: "Turecko",
      MXN: "Mexiko",
      BRL: "Brazílie",
      ZAR: "Jihoafrická republika",
      INR: "Indie",
      IDR: "Indonésie",
      SGD: "Singapur",
      HKD: "Hongkong",
      THB: "Thajsko",
      MYR: "Malajsie",
      NZD: "Nový Zéland",
      PHP: "Filipíny",
      ILS: "Izrael",
      ISK: "Island",
      XDR: "Mezinárodní měnový fond"
    };

const convertedCurrencyOptions = Object.keys(exchangeRates).map(code => {
      const label = currencyNames[code] ? `${code} - ${currencyNames[code]}` : code;
      return `<option value="${code}">${label}</option>`;
    }).join("");


    const summary = `
      <h2>Souhrn objednávky</h2>
      <table>
        <tr><th>Jméno a Příjmení</th><td>${name}</td></tr>
        <tr><th>E‑mail</th><td>${email}</td></tr>
        <tr><th>Telefon</th><td>${phone}</td></tr>
        <tr><th>Adresa</th><td>${address}</td></tr>
        <tr><td colspan="2" style="height:1rem;"></td></tr>
        <tr><th>Produkt</th><td>${product}</td></tr>
        <tr><th>Cena za kus</th><td>${unit.toFixed(2)} CZK</td></tr>
        <tr><th>Množství</th><td>${qty} ks</td></tr>
        <tr><th>Celková cena bez DPH</th><td>${base.toFixed(2)} CZK</td></tr>
        <tr><th>DPH (21%)</th><td>${vat.toFixed(2)} CZK</td></tr>
<tr><td colspan="2" style="height:1rem;"></td></tr>
        <tr><th>Celková cena s DPH</th><td><strong>${total.toFixed(2)} CZK</strong></td></tr>
        <tr>
          <th>
            Zobrazit cenu v jiné měně<br/>
            <select id="currencySelect">
              <option disabled selected>Vyberte měnu</option>
              ${convertedCurrencyOptions}
            </select>
          </th>
          <td>
            <strong>Přepočtená cena:</strong><br><span id="convertedPrice">–</span>
          </td>
        </tr>
      </table>
    `;


      summaryEl.innerHTML = summary;
      summaryEl.hidden = false;
      
    document.getElementById("currencySelect").addEventListener("change", function() {
      const selected = this.value;
      const rate = exchangeRates[selected];
      const converted = (total / rate).toFixed(2);
      document.getElementById("convertedPrice").textContent = `${converted} ${selected}`;
    });

    form.hidden = true;
    });