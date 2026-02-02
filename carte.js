/* ============================================================
   1. VARIABLES GLOBALES
============================================================ */
let map, geoLayer;

const countryNamesFr = {
    "Albania":"Albanie","Algeria":"Algérie","Andorra":"Andorre",
    "Antigua and Barbuda":"Antigua-et-Barbuda","Argentina":"Argentine",
    "Armenia":"Arménie","Australia":"Australie","Austria":"Autriche",
    "Azerbaijan":"Azerbaïdjan","Bahrain":"Bahreïn","Barbados":"Barbade",
    "Belarus":"Biélorussie","Belgium":"Belgique","Benin":"Bénin",
    "Bhutan":"Bhoutan","Bolivia":"Bolivie","Bosnia and Herz.":"Bosnie-Herzégovine",
    "Brazil":"Brésil","Bulgaria":"Bulgarie","Cabo Verde":"Cap-Vert","Cambodia":"Cambodge",
    "Cameroon":"Cameroun","Central African Rep.":"République centrafricaine",
    "Chad":"Tchad","Chile":"Chili","China":"Chine","Colombia":"Colombie","Comoros":"Comores",
    "Croatia":"Croatie","Cyprus":"Chypre","Czech Republic":"République tchèque",
    "Dem. Rep. Congo":"République démocratique du Congo","Denmark":"Danemark","Dominica":"Dominique",
    "Dominican Rep.":"République dominicaine","Ecuador":"Équateur","Egypt":"Égypte",
    "El Salvador":"Salvador","Eq. Guinea":"Guinée équatoriale","Eritrea":"Érythrée",
    "Estonia":"Estonie","Ethiopia":"Éthiopie","Fiji":"Fidji","Finland":"Finlande","Gambia":"Gambie","Georgia":"Géorgie",
    "Germany":"Allemagne","Greece":"Grèce","Grenada":"Grenade",
    "Guinea":"Guinée","Guinea-Bissau":"Guinée-Bissau","Haiti":"Haïti",
    "Hungary":"Hongrie","Iceland":"Islande","India":"Inde",
    "Indonesia":"Indonésie","Iraq":"Irak","Ireland":"Irlande","Israel":"Israël",
    "Italy":"Italie","Jamaica":"Jamaïque","Japan":"Japon","Jordan":"Jordanie","Kuwait":"Koweït",
    "Kyrgyzstan":"Kirghizistan","Latvia":"Lettonie","Lebanon":"Liban","Lesotho":"Lesotho",
    "Liberia":"Libéria","Libya":"Libye","Lithuania":"Lituanie",
    "Malaysia":"Malaisie","Malta":"Malte","Marshall Islands":"Îles Marshall",
    "Mauritania":"Mauritanie","Mauritius":"Maurice","Mexico":"Mexique","Micronesia":"Micronésie",
    "Moldova":"Moldavie","Mongolia":"Mongolie","Montenegro":"Monténégro",
    "Morocco":"Maroc","Myanmar":"Birmanie (Myanmar)","Namibia":"Namibie",
    "Nauru":"Nauru","Nepal":"Népal","Netherlands":"Pays-Bas","New Zealand":"Nouvelle-Zélande",
    "Nicaragua":"Nicaragua","Niger":"Niger","Nigeria":"Nigéria","North Korea":"Corée du Nord",
    "North Macedonia":"Macédoine du Nord","Norway":"Norvège","Oman":"Oman","Pakistan":"Pakistan",
    "Palau":"Palaos","Panama":"Panama","Papua New Guinea":"Papouasie-Nouvelle-Guinée", 
    "New Caledonia":"Nouvelle-Calédonie", "Faeroe Is.":"Îles Féroé", "Pitcairn Is.":"Îles Pitcairn",
    "Falkland Is.": "Îles Malouines/ Falkland","Greenland":"Groenland (Danemark)", "Fr. Polynesia":"Polynésie française",
    "S. Geo. and the Is.":"Géorgie du Sud et les îles Sandwich du Sud", "Fr. S. Antarctic Lands":"Terres australes et antarctiques françaises",
    "Heard I. and McDonald Is.":"Îles Heard et McDonald", "Br. Indian Ocean Ter.":"Territoires britanniques de l'Océan Indien",
    "Cayman Is.":"Îles Caïmans", "Turks and Caicos Is.":"Îles Turques-et-Caïques", "Puerto Rico":"Porto Rico (États-Unis)",
    "British Virgin Is.":"Îles Vierges britanniques"," U.S. Virgin Is.":"Îles Vierges des États-Unis",
    "Paraguay":"Paraguay","Peru":"Pérou","Philippines":"Philippines","Poland":"Pologne",
    "Portugal":"Portugal","Qatar":"Qatar","Romania":"Roumanie","Russia":"Russie","Rwanda":"Rwanda", 
    "Saint Kitts and Nevis":"Saint-Christophe-et-Niévès","Saint Lucia":"Sainte-Lucie",
    "Saint Vincent and the Grenadines":"Saint-Vincent-et-les-Grenadines",
    "San Marino":"Saint-Marin","São Tome and Principe":"São Tomé-et-Principe",
    "Saudi Arabia":"Arabie saoudite","Senegal":"Sénégal","Serbia":"Serbie","Seychelles":"Seychelles",
    "Sierra Leone":"Sierra Leone","Singapore":"Singapour","Slovakia":"Slovaquie","Slovenia":"Slovénie",
    "Solomon Is.":"Îles Salomon","Somalia":"Somalie","South Africa":"Afrique du Sud",
    "South Korea":"Corée du Sud","S. Sudan":"Soudan du Sud","Spain":"Espagne",
    "Sudan":"Soudan","Sweden":"Suède","Switzerland":"Suisse",
    "Syria":"Syrie","Taiwan":"Taïwan","Tajikistan":"Tadjikistan","Tanzania":"Tanzanie",
    "Thailand":"Thaïlande","Timor-Leste":"Timor oriental",
    "Trinidad and Tobago":"Trinité-et-Tobago","Tunisia":"Tunisie","Turkey":"Turquie",
    "Turkmenistan":"Turkménistan","Uganda":"Ouganda",
    "United Arab Emirates":"Émirats arabes unis","United Kingdom":"Royaume-Uni",
    "United States of America":"États-Unis","Uruguay":"Uruguay","Uzbekistan":"Ouzbékistan",
    "Vatican City":"Vatican","Vietnam":"Viêt Nam","Yemen":"Yémen",
    "Zambia":"Zambie",
};

function getCountryNameFr(nameEn) {
    return countryNamesFr[nameEn] || nameEn;
}

// -------- NORMALISATION DES NOMS ----------
// -------- NORMALISATION DES NOMS ----------
function normalizeName(name) {
    return name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, " ")
        // Ajout de mots/abréviations à ignorer : 'america', 'dr' (pour Dem. Rep.)
        // J'ai aussi ajouté 'islands' et 'is', car les noms d'îles sont souvent incohérents.
        .replace(/\b(the|of|and|republic|state|states|islamic|arab|democratic|people|union|federal|america|dr|islands|is)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

// ------- LEVENSHTEIN --------
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

// -------- BEST MATCH --------
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
let gunsField = "Estimation de possession d'armes civiles pour 100 personnes";
let indicator = "guns";
let gdpYear = "2023";

let timelineYears = [];
let timelineIndex = 0;
let timelineTimer = null;
let timelineReady = false;

/* ============================================================
   2. INITIALISATION LEAFLET
============================================================ */
map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 1,
    maxZoom: 6
}).addTo(map);

/* 3. INFOBOX*/
const info = L.control();
info.onAdd = function() {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function(props) {
    if (!props) {
        this._div.innerHTML = "Survolez un pays";
        return;
    }

    const name = props.name_fr || props.name;

    // Valeur de l’indicateur (guns ou GDP)
    const value = indicator === "guns"
        ? props[gunsField]
        : props[gdpYear];

    this._div.innerHTML =
        `<h4>${name}</h4>` +
        (value ? value.toLocaleString() : "N/A");
};
info.addTo(map);

/* ============================================================
   4. COULEURS
============================================================ */
const getColorGuns = d =>
    d > 100 ? '#800026' :
    d > 50 ? '#BD0026' :
    d > 20 ? '#E31A1C' :
    d > 10 ? '#FC4E2A' :
    d > 5 ? '#FD8D3C' :
    d > 1 ? '#FEB24C' : '#FFEDA0';

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

    return {
        fillColor: indicator === "guns" ? getColorGuns(val) : getColorGDP(val),
        color: "#222",
        weight: 1,
        fillOpacity: 0.7
    };
};

/* 6. INTERACTIONS SANS BUG (pas de déplacement) */
const hoverStyle = {
    weight: 2,
    color: "#000"
};

function highlightFeature(e) {
    const layer = e.target;
    const props = layer.feature.properties;

    // Ajoute le nom français dans les propriétés
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

/* 7. LÉGENDE */
const legend = L.control({ position: "bottomright" });
function updateLegend() {
    map.removeControl(legend);
    legend.onAdd = function() {
        const div = L.DomUtil.create("div", "legend");
        let grades, getColor;

        if (indicator === "guns") {
            grades = [0, 1, 5, 10, 20, 50, 100];
            getColor = getColorGuns;
        } else {
            grades = [0, 1e9, 1e10, 5e10, 1e11, 5e11, 1e12];
            getColor = getColorGDP;
        }

        grades.forEach((g, i) => {
            div.innerHTML +=
                `<i style="background:${getColor(g+0.1)}"></i>
                 ${g.toLocaleString()} ${grades[i+1] ? "– " + grades[i+1].toLocaleString() + "<br>" : "+"}`;
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

/* 9. INITIALISATION APRÈS CHARGEMENT */
function init([geo, guns, gdp]) {

    worldData = geo;
    gunData = guns;
    gdpData = gdp;

    // Années PIB
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

    // Nettoyage valeur
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

    // Fusion données
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

    // Ajout carte
    geoLayer = L.geoJson(worldData, { style, onEachFeature }).addTo(map);

    // Timeline
    const slider = document.getElementById("timelineSlider");
    slider.max = timelineYears.length - 1;
    slider.value = timelineIndex;

    updateYearDisplay();
    timelineReady = true;
}

/* ============================================================
   10. TIMELINE
============================================================ */
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

// PLAY
document.getElementById("playTimeline").addEventListener("click", () => {
    if (!timelineReady) return;
    if (!timelineTimer) timelineTimer = setInterval(nextYear, 1000);
});

// PAUSE
document.getElementById("pauseTimeline").addEventListener("click", () => {
    if (!timelineReady) return;
    clearInterval(timelineTimer);
    timelineTimer = null;
});

// SLIDER
document.getElementById("timelineSlider").addEventListener("input", e => {
    if (!timelineReady) return;
    timelineIndex = +e.target.value;
    setYearFromIndex();
});

/* ============================================================
   11. CHANGEMENT INDICATEURS
============================================================ */
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