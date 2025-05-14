// 0. Map Western digits → Bengali digits
const bnDigits = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
function toBengaliDigits(str) {
  return str.replace(/\d/g, d => bnDigits[+d]);
}

// 1. Conversion Logic
const conversionMap = {
  // Base: 1 Decimal (Shotangsho)
  Decimal:    1,               
  Shotok:     1,               // 1 Decimal = 1 Shotangsho/Shotok
  Ojutangsho: 0.01,            // 1 Shotok = 100 Ojutangsho

  // Traditional units
  Katha: 1.65,                 // 1.65 Shotok
  Chotak: 1.65 / 16,           // 1/16 of a Katha
  Bigha: 33,                   // 33 Shotok
  Kani: 120,                   // 120 Shotok
  Gonda: 6,                    // 20 Gonda = 1 Kani → 120/20 = 6
  Kora: 1.5,                   // 4 Kora = 1 Gonda → 6/4 = 1.5
  Kranti: 0.5,                 // 3 Kranti = 1 Kora → 1.5/3 = 0.5
  Til: 0.025,                  // 20 Til = 1 Kranti → 0.5/20 = 0.025

  // Acre & hectare
  Acre:    100,                // 3 Bigha ≈ 1 Acre → 3×33 = 99 ≈100
  Hectare: 247.105,            // 1 Ha = 100 Ayer = 247.105 Shotok
  Ayer:    2.47105,            // 1 Ayer = 1/100 Ha

  // Square‑foot‑based units
  SqFeet:  1 / 435.6,          // 1 Shotok = 435.6 sq ft
  SqYard:  1 / 48.4,           // 1 Shotok = 435.6 sq ft ÷9 = 48.4 sq yd
  // Bargogaz: 1 / 48.4,          // exact same as SqYard

  SqMeter: 1 / 40.46856,       // 1 Shotok = 435.6 sq ft ÷10.7639 = 40.46856 m²

  Bargohat: 1 / 193.6,         // 1 Shotok = 193.6 sq hat (8‑hat nol)
  Bargolink: 1 / 1000,         // 1 Shotok = 1000 sq link
  Link:      1 / 1000,         // alias

  // Square chain
  SqChain:  10                 // 1 sq chain = 66×66 ft = 4356 sq ft = 10 Shotok
};

// 2. Two parallel unit-name dictionaries
const unitNamesEn = {
  Decimal: "Decimal/Dishim/Dismil",
  Shotok: "Shotok/Shotangsho",
  Ojutangsho: "Ojutangsho",
  Katha: "Katha",
  Chotak: "Chotak",
  Bigha: "Bigha",
  Kani: "Kani",
  Gonda: "Gonda",
  Kora: "Kora",
  Kranti: "Kranti",
  Til: "Til",
  Acre: "Acre",
  Hectare: "Hectare",
  Ayer: "Ayer",
  SqFeet: "Square Feet",
  SqMeter: "Square Meter",
  SqYard: "Square Yard/Bargo Gaz",
  Bargohat: "Bargo Hat",
  Bargolink: "Bargo Link",
  Link: "Link",
  SqChain: "Bargo Chain"
};

const unitNamesBn = {
  Decimal: "দশমিক/ডিসিম/ডিসমিল",
  Shotok: "শতক/শতাংশ",
  Ojutangsho: "ওজুতাংশ",
  Katha: "কাঠা",
  Chotak: "ছটাক",
  Bigha: "বিঘা",
  Kani: "কানি",
  Gonda: "গন্ডা",
  Kora: "কড়া",
  Kranti: "কান্তি",
  Til: "তিল",
  Acre: "একর",
  Hectare: "হেক্টর",
  Ayer: "আইর",
  SqFeet: "বর্গফুট",
  SqMeter: "বর্গমিটার",
  SqYard: "বর্গগজ",
  Bargohat: "বর্গহাট",
  Bargolink: "বর্গলিঙ্ক",
  Link: "লিঙ্ক",
  SqChain: "বর্গচেইন"
};

// 3. Label translations
const labels = {
  en: {
    documentTitle: "Jomi Mapo – Bangladesh Land Measurement Converter",
    title: "Jomi Mapo",
    tagline: "Bangladesh Land Measurement Converter",
    labelValue: "Enter Value",
    labelFrom: "From Unit",
    labelTo: "To Unit"
  },
  bn: {
    documentTitle: "জমি মাপ - বাংলাদেশের ভূমি/জমি মাপার কনভার্টার",
    title: "জমি মাপ",
    tagline: "বাংলাদেশের ভূমি/জমি মাপার কনভার্টার",
    labelValue: "মান লিখুন",
    labelFrom: "যে একক থেকে",
    labelTo: "যে এককে"
  }
};

// 4. Grab DOM elements
const langSwitch = document.getElementById("langSwitch");
const fromUnit = document.getElementById("fromUnit");
const toUnit   = document.getElementById("toUnit");
const inputValue = document.getElementById("inputValue");
const result = document.getElementById("result");

// labels
const titleEl = document.querySelector(".app-title");
const taglineEl = document.getElementById("tagline");
const labelValueEl = document.getElementById("labelValue");
const labelFromEl  = document.getElementById("labelFrom");
const labelToEl    = document.getElementById("labelTo");

// 5. Load saved language preference
const savedLang = localStorage.getItem("jomiMapLang") || "en";
langSwitch.value = savedLang;

// 6. Render dropdowns according to current language
function populateDropdowns() {
  const dict = langSwitch.value === "bn" ? unitNamesBn : unitNamesEn;
  [fromUnit, toUnit].forEach(sel => {
    sel.innerHTML = "";            // clear old
    for (let key in dict) {
      sel.add(new Option(dict[key], key));
    }
  });
  // keep defaults
  fromUnit.value = "Shotok";
  toUnit.value   = "Decimal";
}

// 7. Swap labels when language changes
function updateLabels() {
  const L = labels[langSwitch.value];
  document.title = L.documentTitle;
  titleEl.textContent = L.title;
  taglineEl.textContent    = L.tagline;
  labelValueEl.textContent = L.labelValue;
  labelFromEl.textContent  = L.labelFrom;
  labelToEl.textContent    = L.labelTo;

  // update input placeholder
  inputValue.placeholder = langSwitch.value === "bn"
    ? toBengaliDigits("অনুগ্রহ করে ইংরেজী সংখ্যায় লিখুন")
    : "e.g., 2.5";

  // update swap tooltip
  document.getElementById("swapButton").title = langSwitch.value === "bn"
    ? "ইউনিট অদলবদল করুন"
    : "Swap Units";
}


// 8. Conversion logic
function convert() {
  const val = parseFloat(inputValue.value);
  if (isNaN(val) || val < 0) {
    return result.innerHTML = langSwitch.value === "bn"
      ? toBengaliDigits("0")
      : "0";
  }

  const from = fromUnit.value, to = toUnit.value;
  const base = val * conversionMap[from];
  const converted = base / conversionMap[to];

  // pick unit label
  const nameDict = langSwitch.value === "bn" ? unitNamesBn : unitNamesEn;
  let display = `<strong>${converted.toFixed(6)}</strong><br>${nameDict[to]}`;

  // convert digits if Bengali
  if (langSwitch.value === "bn") {
    display = toBengaliDigits(display);
  }

  result.innerHTML = display;
}


// 9. Wire everything up
langSwitch.addEventListener("change", () => {
  localStorage.setItem("jomiMapLang", langSwitch.value);

  updateLabels();
  populateDropdowns();
  convert();
});

// 10. Initial render
updateLabels();
populateDropdowns();
convert();

// 11. Event listeners
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);
inputValue.addEventListener("input", convert);
document.getElementById("swapButton").addEventListener("click", () => {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
  convert();
});

inputValue.focus();