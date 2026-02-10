/* Variables de base*/
let map, geoLayer;

const countryNamesFr = {
    "Albania": "Albanie", "Algeria": "Algérie", "Andorra": "Andorre",
    "Antigua and Barbuda": "Antigua-et-Barbuda", "Argentina": "Argentine",
    "Armenia": "Arménie", "Australia": "Australie", "Austria": "Autriche",
    "Azerbaijan": "Azerbaïdjan", "Bahrain": "Bahreïn", "Barbados": "Barbade",
    "Belarus": "Biélorussie", "Belgium": "Belgique", "Benin": "Bénin",
    "Bhutan": "Bhoutan", "Bolivia": "Bolivie", "Bosnia and Herz.": "Bosnie-Herzégovine",
    "Brazil": "Brésil", "Bulgaria": "Bulgarie", "Cabo Verde": "Cap-Vert", "Cambodia": "Cambodge",
    "Cameroon": "Cameroun", "Central African Rep.": "République centrafricaine",
    "Chad": "Tchad", "Chile": "Chili", "China": "Chine", "Colombia": "Colombie", "Comoros": "Comores",
    "Croatia": "Croatie", "Cyprus": "Chypre", "Czech Republic": "République tchèque",
    "Dem. Rep. Congo": "République démocratique du Congo", "Denmark": "Danemark", "Dominica": "Dominique",
    "Dominican Rep.": "République dominicaine", "Ecuador": "Équateur", "Egypt": "Égypte",
    "El Salvador": "Salvador", "Eq. Guinea": "Guinée équatoriale", "Eritrea": "Érythrée",
    "Estonia": "Estonie", "Ethiopia": "Éthiopie", "Fiji": "Fidji", "Finland": "Finlande", "Gambia": "Gambie", "Georgia": "Géorgie",
    "Germany": "Allemagne", "Greece": "Grèce", "Grenada": "Grenade",
    "Guinea": "Guinée", "Guinea-Bissau": "Guinée-Bissau", "Haiti": "Haïti",
    "Hungary": "Hongrie", "Iceland": "Islande", "India": "Inde",
    "Indonesia": "Indonésie", "Iraq": "Irak", "Ireland": "Irlande", "Israel": "Israël",
    "Italy": "Italie", "Jamaica": "Jamaïque", "Japan": "Japon", "Jordan": "Jordanie", "Kuwait": "Koweït",
    "Kyrgyzstan": "Kirghizistan", "Latvia": "Lettonie", "Lebanon": "Liban", "Lesotho": "Lesotho",
    "Liberia": "Libéria", "Libya": "Libye", "Lithuania": "Lituanie",
    "Malaysia": "Malaisie", "Malta": "Malte", "Marshall Islands": "Îles Marshall",
    "Mauritania": "Mauritanie", "Mauritius": "Maurice", "Mexico": "Mexique", "Micronesia": "Micronésie",
    "Moldova": "Moldavie", "Mongolia": "Mongolie", "Montenegro": "Monténégro",
    "Morocco": "Maroc", "Myanmar": "Birmanie (Myanmar)", "Namibia": "Namibie",
    "Nauru": "Nauru", "Nepal": "Népal", "Netherlands": "Pays-Bas", "New Zealand": "Nouvelle-Zélande",
    "Nicaragua": "Nicaragua", "Niger": "Niger", "Nigeria": "Nigéria", "North Korea": "Corée du Nord",
    "North Macedonia": "Macédoine du Nord", "Norway": "Norvège", "Oman": "Oman", "Pakistan": "Pakistan",
    "Palau": "Palaos", "Panama": "Panama", "Papua New Guinea": "Papouasie-Nouvelle-Guinée",
    "New Caledonia": "Nouvelle-Calédonie", "Faeroe Is.": "Îles Féroé", "Pitcairn Is.": "Îles Pitcairn",
    "Falkland Is.": "Îles Malouines/ Falkland", "Greenland": "Groenland (Danemark)", "Fr. Polynesia": "Polynésie française",
    "S. Geo. and the Is.": "Géorgie du Sud et les îles Sandwich du Sud", "Fr. S. Antarctic Lands": "Terres australes et antarctiques françaises",
    "Heard I. and McDonald Is.": "Îles Heard et McDonald", "Br. Indian Ocean Ter.": "Territoires britanniques de l'Océan Indien",
    "Cayman Is.": "Îles Caïmans", "Turks and Caicos Is.": "Îles Turques-et-Caïques", "Puerto Rico": "Porto Rico (États-Unis)",
    "British Virgin Is.": "Îles Vierges britanniques", " U.S. Virgin Is.": "Îles Vierges des États-Unis",
    "Paraguay": "Paraguay", "Peru": "Pérou", "Philippines": "Philippines", "Poland": "Pologne",
    "Portugal": "Portugal", "Qatar": "Qatar", "Romania": "Roumanie", "Russia": "Russie", "Rwanda": "Rwanda",
    "Saint Kitts and Nevis": "Saint-Christophe-et-Niévès", "Saint Lucia": "Sainte-Lucie",
    "Saint Vincent and the Grenadines": "Saint-Vincent-et-les-Grenadines",
    "San Marino": "Saint-Marin", "São Tome and Principe": "São Tomé-et-Principe",
    "Saudi Arabia": "Arabie saoudite", "Senegal": "Sénégal", "Serbia": "Serbie", "Seychelles": "Seychelles",
    "Sierra Leone": "Sierra Leone", "Singapore": "Singapour", "Slovakia": "Slovaquie", "Slovenia": "Slovénie",
    "Solomon Is.": "Îles Salomon", "Somalia": "Somalie", "South Africa": "Afrique du Sud",
    "South Korea": "Corée du Sud", "S. Sudan": "Soudan du Sud", "Spain": "Espagne",
    "Sudan": "Soudan", "Sweden": "Suède", "Switzerland": "Suisse",
    "Syria": "Syrie", "Taiwan": "Taïwan", "Tajikistan": "Tadjikistan", "Tanzania": "Tanzanie",
    "Thailand": "Thaïlande", "Timor-Leste": "Timor oriental",
    "Trinidad and Tobago": "Trinité-et-Tobago", "Tunisia": "Tunisie", "Turkey": "Turquie",
    "Turkmenistan": "Turkménistan", "Uganda": "Ouganda",
    "United Arab Emirates": "Émirats arabes unis", "United Kingdom": "Royaume-Uni",
    "United States of America": "États-Unis", "Uruguay": "Uruguay", "Uzbekistan": "Ouzbékistan",
    "Vatican City": "Vatican", "Vietnam": "Viêt Nam", "Yemen": "Yémen",
    "Zambia": "Zambie",
};

function getCountryNameFr(nameEn) {
    return countryNamesFr[nameEn] || nameEn;
}

/*Normaliser noms et distance de Levenshtein pour correspondance approximative*/
function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, " ")
        .replace(/\b(the|of|and|republic|state|states|islamic|arab|democratic|people|union|federal|america|dr|islands|is)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

function bestMatch(countryName, candidates) {
    const normA = normalizeName(countryName);
    let best = null;
    let bestDist = Infinity;

    for (const c of candidates) {
        const normB = normalizeName(c);
        const dist = levenshtein(normA, normB);
        if (dist < bestDist) {
            bestDist = dist;
            best = c;
        }
    }
    const threshold = Math.floor(normA.length * 0.5);
    return bestDist <= threshold ? best : null;
}

let worldData, gunData, gdpData;
let gunsField = "Estimation des possession d'armes civiles pour 100 personnes";
let indicator = "guns";
let gdpYear = "2023";

let timelineYears = [];
let timelineIndex = 0;
let timelineTimer = null;
let timelineReady = false;

/*Initialiser Leaflet*/
map = L.map('map').setView([20, 0], 2)

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 4
}).addTo(map);

/* Infobox*/
const info = L.control();
info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    if (!props) {
        this._div.innerHTML = "Survolez un pays";
        return;
    }

    const name = props.name_fr || props.name;

    const value = indicator === "guns"
        ? props[gunsField]
        : props[gdpYear];

    this._div.innerHTML =
        `<h4>${name}</h4>` +
        (value ? value.toLocaleString() : "N/A");
};
info.addTo(map);

/* Couleur PIB et stats sur armes (taux ou nb d'armes) */
const getColorGuns = d =>
    d > 10000000 ? "#800026" :
        d > 1000000 ? "#b30000" :
            d > 100000 ? "#d41a1a" :
                d > 50 ? '#cb181d' :
                    d > 20 ? '#ef3b2c' :
                        d > 10 ? '#fb6a4a' :
                            d > 5 ? '#fc9272' :
                                d > 1 ? '#fcbba1' :
                                    d > 0.5 ? '#fee0b6' :
                                        d > 0.3 ? '#fef0d9' :
                                            d > 0.1 ? '#fff7ec' : '#fff7ec';

const getColorGDP = d =>
    d > 1e12 ? '#084594' :
        d > 5e11 ? '#2171b5' :
            d > 1e11 ? '#4292c6' :
                d > 5e10 ? '#6baed6' :
                    d > 1e10 ? '#9ecae1' :
                        d > 1e9 ? '#c6dbef' : '#deebf7';

const style = feature => {
    const val = indicator === "guns"
        ? feature.properties[gunsField]
        : feature.properties[gdpYear];

    const thresholds = indicator === "guns" ? gunThresholds : gdpThresholds;
    const isVisible = thresholds.some(t => t.active && val >= t.min && val < t.max);

    return {
        fillColor: indicator === "guns" ? getColorGuns(val) : getColorGDP(val),
        color: "#222",
        weight: 1,
        fillOpacity: isVisible ? 0.7 : 0
    };
};

const hoverStyle = {
    weight: 2,
    color: "#000"
};

function highlightFeature(e) {
    const layer = e.target;
    const props = layer.feature.properties;
    props.name_fr = getCountryNameFr(props.name);
    info.update(props);
    layer.setStyle({
        weight: 2,
        color: '#000',
        fillOpacity: layer.options.fillOpacity
    });

    layer.bringToFront();
}

function resetHighlight(e) {
    geoLayer.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

/* légende carte */
let gunThresholds = [
    { min: 0.1, max: 0.3, active: true },
    { min: 0.3, max: 0.5, active: true },
    { min: 0.5, max: 1, active: true },
    { min: 1, max: 5, active: true },
    { min: 5, max: 10, active: true },
    { min: 10, max: 20, active: true },
    { min: 20, max: 50, active: true },
    { min: 50, max: 100, active: true },
    { min: 100, max: 100000, active: true },
    { min: 100000, max: 1000000, active: true },
    { min: 1000000, max: 10000000, active: true },
    { min: 10000000, max: Infinity, active: true }
];

let gdpThresholds = [
    { min: 0, max: 1e9, active: true },
    { min: 1e9, max: 1e10, active: true },
    { min: 1e10, max: 5e10, active: true },
    { min: 5e10, max: 1e11, active: true },
    { min: 1e11, max: 5e11, active: true },
    { min: 5e11, max: 1e12, active: true },
    { min: 1e12, max: Infinity, active: true }
];

const legend = L.control({ position: "bottomright" });
function updateLegend() {
    map.removeControl(legend);
    legend.onAdd = function () {
        const div = L.DomUtil.create("div", "legend");
        const thresholds = indicator === "guns" ? gunThresholds : gdpThresholds;
        const getColor = indicator === "guns" ? getColorGuns : getColorGDP;

        thresholds.forEach(t => {
            const label = `${t.min.toLocaleString()} – ${t.max === Infinity ? '+' : t.max.toLocaleString()}`;

            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.marginBottom = "5px";
            row.style.cursor = "pointer";

            const colorBox = document.createElement("span");
            colorBox.style.display = "inline-block";
            colorBox.style.width = "18px";
            colorBox.style.height = "18px";
            colorBox.style.backgroundColor = getColor(t.min + 0.1);
            colorBox.style.marginRight = "8px";
            colorBox.style.border = t.active ? "2px solid #000" : "2px solid #ccc";

            const toggleState = () => {
                t.active = !t.active;
                colorBox.style.border = t.active ? "2px solid #000" : "2px solid #ccc";
                geoLayer.setStyle(style);
            };

            row.appendChild(colorBox);
            row.appendChild(document.createTextNode(label));
            row.addEventListener("click", toggleState);
            div.appendChild(row);
        });

        return div;
    };
    legend.addTo(map);
}
updateLegend();

Promise.all([
    d3.json("world.geo.json"),
    d3.csv("dataset_gun_cleaned.csv"),
    d3.csv("gdp-by-country_cleaned.csv")
]).then(init);

/* Charger et re- initialiser carte  */
function init([geo, guns, gdp]) {

    worldData = geo;
    gunData = guns;
    gdpData = gdp;

    timelineYears = Object.keys(gdp[0]).filter(k => /^[0-9]{4}$/.test(k));
    timelineIndex = timelineYears.indexOf("2023");

    const gdpSelect = document.getElementById("gdpYear");
    timelineYears.forEach(y => {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        if (y === "2023") opt.selected = true;
        gdpSelect.appendChild(opt);
    });

    function cleanNumber(v) {
        if (!v) return null;
        v = v.toString()
            .replace(/Est\.?/gi, "")
            .replace(/[–—]/g, "")
            .replace(/,/g, "")
            .replace(/\s+/g, "")
            .trim();
        if (v === "" || v === "-") return null;
        const n = Number(v);
        return isNaN(n) ? null : n;
    }

    /*fusion des données */
    const gunNames = gunData.map(d => d.Country);
    const gdpNames = gdpData.map(d => d["Country Name"]);

    worldData.features.forEach(f => {
        const name = f.properties.name;

        const gunMatch = bestMatch(name, gunNames);
        const gdpMatch = bestMatch(name, gdpNames);

        if (gunMatch) {
            const gunRow = gunData.find(d => d.Country === gunMatch);
            Object.keys(gunRow).forEach(k => {
                f.properties[k] = cleanNumber(gunRow[k]);
            });
        }

        if (gdpMatch) {
            const gdRow = gdpData.find(d => d["Country Name"] === gdpMatch);
            timelineYears.forEach(y => {
                f.properties[y] = cleanNumber(gdRow[y]);
            });
        }
    });

    /*Ajouter le geojson */
    geoLayer = L.geoJson(worldData, { style, onEachFeature }).addTo(map);

    const slider = document.getElementById("timelineSlider");
    slider.max = timelineYears.length - 1;
    slider.value = timelineIndex;

    updateYearDisplay();
    timelineReady = true;
}

/* timeline */
function updateYearDisplay() {
    document.getElementById("timelineYear").textContent = gdpYear;
    document.getElementById("yearOverlay").textContent = gdpYear;
    document.getElementById("gdpYear").value = gdpYear;
}

function setYearFromIndex() {
    gdpYear = timelineYears[timelineIndex];
    updateYearDisplay();
    geoLayer.setStyle(style);
}

function nextYear() {
    timelineIndex = (timelineIndex + 1) % timelineYears.length;
    setYearFromIndex();
}

document.getElementById("playTimeline").addEventListener("click", () => {
    if (!timelineReady) return;
    if (!timelineTimer) timelineTimer = setInterval(nextYear, 1000);
});

document.getElementById("pauseTimeline").addEventListener("click", () => {
    if (!timelineReady) return;
    clearInterval(timelineTimer);
    timelineTimer = null;
});

document.getElementById("timelineSlider").addEventListener("input", e => {
    if (!timelineReady) return;
    timelineIndex = +e.target.value;
    setYearFromIndex();
});

/* changer indicateur (de gdp a stats sur armes) */
document.getElementById("indicator").addEventListener("change", e => {
    indicator = e.target.value;
    updateLegend();
    geoLayer.setStyle(style);
});

document.getElementById("gunsField").addEventListener("change", e => {
    gunsField = e.target.value;
    geoLayer.setStyle(style);
});

document.getElementById("gdpYear").addEventListener("change", e => {
    gdpYear = e.target.value;
    timelineIndex = timelineYears.indexOf(gdpYear);
    geoLayer.setStyle(style);
    updateYearDisplay();
});