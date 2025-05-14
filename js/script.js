const conversionMap = {
  // Base: 1 Decimal (Shotangsho)
  Decimal:    1,               // 1 Decimal = 1 Shotangsho
  Dishim:     1,
  Dismil:     1,
  Shotangsho: 1,
  Shotok:     1,             
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
  Bargogaz: 1 / 48.4,          // exact same as SqYard

  SqMeter: 1 / 40.46856,       // 1 Shotok = 435.6 sq ft ÷10.7639 = 40.46856 m²

  Bargohat: 1 / 193.6,         // 1 Shotok = 193.6 sq hat (8‑hat nol)
  Bargolink: 1 / 1000,         // 1 Shotok = 1000 sq link
  Link:      1 / 1000,         // alias

  // Square chain
  SqChain:  10                 // 1 sq chain = 66×66 ft = 4356 sq ft = 10 Shotok
};


const unitNames = {
  Decimal: "Decimal",
  Dishim: "Dishim",
  Dismil: "Dismil",
  Shotok: "Shotok",
  Shotangsho: "Shotangsho",
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
  SqYard: "Square Yard",
  Bargogaz: "Bargo Gaz",
  Bargohat: "Bargo Hat",
  Bargolink: "Bargo Link",
  Link: "Link",
  SqChain: "Square Chain"
};

const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

function populateDropdowns() {
  for (let key in unitNames) {
    const opt1 = new Option(unitNames[key], key);
    const opt2 = new Option(unitNames[key], key);
    fromUnit.appendChild(opt1);
    toUnit.appendChild(opt2);
  }
  fromUnit.value = "Bigha";
  toUnit.value = "Decimal";
}

function convert() {
  const val = parseFloat(inputValue.value);
  const from = fromUnit.value;
  const to = toUnit.value;

  if (isNaN(val) || val < 0) {
    result.textContent = "0";
    return;
  }

  const base = val * conversionMap[from];
  const converted = base / conversionMap[to];
  result.textContent = `${converted.toFixed(6)} ${unitNames[to]}`;
}
document.getElementById("swapButton").addEventListener("click", () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
    convert();
});
inputValue.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    convert();
  }
});
inputValue.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

populateDropdowns();