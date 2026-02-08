 document.addEventListener('DOMContentLoaded', function () {
            var chartDom = document.getElementById('3D');

            if (!chartDom) {
                console.error('Élément #3D non trouvé');
                return;
            }

            var myChart = echarts.init(chartDom, 'dark');
            var allCountriesData = [];

            // Dictionnaire de traduction
            const countryNamesFr = {
                "Albania": "Albanie", "Algeria": "Algérie", "Andorra": "Andorre", "American Samoa": "Samoa américaines",
                "Antigua and Barbuda": "Antigua-et-Barbuda", "Argentina": "Argentine",
                "Armenia": "Arménie", "Australia": "Australie", "Austria": "Autriche",
                "Azerbaijan": "Azerbaïdjan", "Bahrain": "Bahreïn", "Barbados": "Barbade",
                "Belarus": "Biélorussie", "Belgium": "Belgique", "Benin": "Bénin", "Bermuda": "Bermudes",
                "Bhutan": "Bhoutan", "Bolivia": "Bolivie", "Bosnia and Herzegovina": "Bosnie-Herzégovine",
                "Brazil": "Brésil", "Bulgaria": "Bulgarie", "Cape Verde": "Cap-Vert", "Channel Islands": "Îles Anglo-Normandes", "Cambodia": "Cambodge",
                "Cameroon": "Cameroun", "Cayman Islands": "Îles Caïmans", "Central African Rep.": "République centrafricaine",
                "Chad": "Tchad", "Chile": "Chili", "China": "Chine", "Colombia": "Colombie", "Comoros": "Comores",
                "Croatia": "Croatie", "Cyprus": "Chypre", "Czechia": "République tchèque",
                "Dem. Rep. Congo": "République démocratique du Congo", "Denmark": "Danemark", "Dominica": "Dominique",
                "Dominican Republic": "République dominicaine", "Ecuador": "Équateur", "Egypt": "Égypte",
                "El Salvador": "Salvador", "Equatorial Guinea": "Guinée équatoriale", "Eritrea": "Érythrée",
                "Estonia": "Estonie", "Ethiopia": "Éthiopie", "Faroe Islands": "Îles Féroé", "Fiji": "Fidji", "Finland": "Finlande", "French Polynesia": "Polynésie française", "France": "France", "Gabon": "Gabon",
                "Gambia": "Gambie", "Georgia": "Géorgie", "Germany": "Allemagne", "Greece": "Grèce", "Greenland": "Groenland",
                "Grenada": "Grenade", "Guinea": "Guinée", "Guinea-Bissau": "Guinée-Bissau", "Haiti": "Haïti",
                "Hungary": "Hongrie", "Iceland": "Islande", "India": "Inde", "Indonesia": "Indonésie",
                "Iraq": "Irak", "Ireland": "Irlande", " Isle of Man": "Île de Man", "Israel": "Israël", "Italy": "Italie",
                "Jamaica": "Jamaïque", "Japan": "Japon", "Jordan": "Jordanie", "Kuwait": "Koweït",
                "Kyrgyzstan": "Kirghizistan", "Lao PDR": "Laos", "Latvia": "Lettonie", "Lebanon": "Liban",
                "Liberia": "Libéria", "Libya": "Libye", "Lithuania": "Lituanie", "Malaysia": "Malaisie",
                "Malta": "Malte", "Marshall Islands": "Îles Marshall", "Mauritania": "Mauritanie",
                "Mauritius": "Maurice", "Mexico": "Mexique", "Micronesia": "Micronésie", "Moldova": "Moldavie",
                "Mongolia": "Mongolie", "Montenegro": "Monténégro", "Morocco": "Maroc",
                "Myanmar": "Birmanie (Myanmar)", "Namibia": "Namibie", "Nepal": "Népal",
                "Netherlands": "Pays-Bas", "New Zealand": "Nouvelle-Zélande",
                "Nigeria": "Nigéria", "North Korea": "Corée du Nord",
                "North Macedonia": "Macédoine du Nord", "Northern Mariana Islands": "Îles Mariannes du Nord", "Norway": "Norvège",
                "Oman": "Oman", "Pakistan": "Pakistan", "Palau": "Palaos",
                "Papua New Guinea": "Papouasie-Nouvelle-Guinée", "Peru": "Pérou", "Poland": "Pologne", "Puerto Rico (US)": "Porto Rico",
                "Romania": "Roumanie", "Russia": "Russie", "Sao Tome and Principe": "Sao Tomé-et-Principe",
                "Saint Kitts and Nevis": "Saint-Christophe-et-Niévès", "St. Lucia": "Sainte-Lucie",
                "Saint Vincent and the Grenadines": "Saint-Vincent-et-les-Grenadines",
                "San Marino": "Saint-Marin", "Saudi Arabia": "Arabie Saoudite", "Senegal": "Sénégal",
                "Serbia": "Serbie",
                "Singapore": "Singapour", "Slovak Republic": "Slovaquie", "Slovenia": "Slovénie", "Small states": "Petits États",
                "Solomon Islands": "Îles Salomon", "Somalia": "Somalie", "South Africa": "Afrique du Sud",
                "South Korea": "Corée du Sud", "South Sudan": "Soudan du Sud", "Spain": "Espagne",
                "Sudan": "Soudan", "Sweden": "Suède", "Switzerland": "Suisse", "Syria": "Syrie",
                "Taiwan": "Taïwan", "Tajikistan": "Tadjikistan", "Tanzania": "Tanzanie",
                "Thailand": "Thaïlande", "Timor-Leste": "Timor oriental",
                "Trinidad and Tobago": "Trinité-et-Tobago", "Tunisia": "Tunisie", "Turkiye": "Turquie",
                "Turks and Caicos Islands": "Îles Turques-et-Caïques", "Turkmenistan": "Turkménistan", "Uganda": "Ouganda",
                "United Arab Emirates": "Émirats arabes unis", "United Kingdom": "Royaume-Uni",
                "United States of America": "États-Unis", "Uzbekistan": "Ouzbékistan",
                "Vatican City": "Vatican", "Vietnam": "Viêt Nam", "World": "Monde", "Yemen": "Yémen", "Zambia": "Zambie"
            };

            function getCountryNameFr(nameEn) {
                return countryNamesFr[nameEn] || nameEn;
            }

            function parseGDPData(csvText, filterType = 'alphabetical') {
                const lines = csvText.trim().split('\n');
                const headers = lines[0].split(',');
                const years = headers.slice(3);

                const countriesAvgGDP = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',');
                    const countryNameEn = values[0].replace(/"/g, '');
                    if (countryNameEn === "World" || countryNameEn === "Small States") {
                        continue;
                    }
                    const countryNameFr = getCountryNameFr(countryNameEn);

                    let totalGDP = 0;
                    let count = 0;
                    years.forEach((year, yearIndex) => {
                        const gdpValue = parseFloat(values[3 + yearIndex]);
                        if (!isNaN(gdpValue) && gdpValue > 0) {
                            totalGDP += gdpValue;
                            count++;
                        }
                    });

                    if (count > 0) {
                        countriesAvgGDP.push({
                            name: countryNameFr,
                            avgGDP: totalGDP / count,
                            index: i
                        });
                    }
                }

                let selectedCountries = [];

                if (filterType === 'top10') {
                    selectedCountries = countriesAvgGDP
                        .sort((a, b) => b.avgGDP - a.avgGDP)
                        .slice(0, 10);
                } else if (filterType === 'bottom10') {
                    selectedCountries = countriesAvgGDP
                        .sort((a, b) => a.avgGDP - b.avgGDP)
                        .slice(0, 10);
                } else if (filterType === 'random10') {
                    const shuffled = [...countriesAvgGDP].sort(() => Math.random() - 0.5);
                    const minCountries = Math.min(10, countriesAvgGDP.length);
                    selectedCountries = shuffled.slice(0, minCountries);
                } else {
                    selectedCountries = countriesAvgGDP
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .slice(0, 10);
                }

                const transformedData = [];
                selectedCountries.forEach(country => {
                    const values = lines[country.index].split(',');

                    years.forEach((year, yearIndex) => {
                        const gdpValue = parseFloat(values[3 + yearIndex]);
                        if (!isNaN(gdpValue) && gdpValue > 0) {
                            transformedData.push([year, country.name, gdpValue]);
                        }
                    });
                });

                return transformedData;
            }

            function updateChart(csvText, filterType) {
                const data = parseGDPData(csvText, filterType);
                const maxGDP = Math.max(...data.map(d => d[2]));

                const option = {
                    tooltip: {
                        formatter: function (params) {
                            return `
                        <b>${params.value[1]}</b><br/>
                        Année: ${params.value[0]}<br/>
                        PIB: $${(params.value[2] / 1e9).toFixed(2)} milliards
                    `;
                        }
                    },
                    visualMap: {
                        max: maxGDP,
                        min: 0,
                        inRange: {
                            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8',
                                '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                        },
                        text: ['PIB élevé', 'PIB faible'],
                        calculable: true,
                        bottom: 20
                    },
                    xAxis3D: {
                        type: 'category',
                        name: 'Année'
                    },
                    yAxis3D: {
                        type: 'category',
                        name: 'Pays'
                    },
                    zAxis3D: {
                        type: 'value',
                        name: 'PIB (US$)',
                        axisLabel: {
                            formatter: function (val) {
                                return '$' + (val / 1e12).toFixed(1) + 'T';
                            }
                        }
                    },
                    grid3D: {
                        boxWidth: window.innerWidth < 768 ? 150 : 200,
                        boxDepth: window.innerWidth < 768 ? 100 : 100,
                        viewControl: {
                            projection: 'perspective',
                            autoRotate: false
                        }
                    },
                    series: [{
                        type: 'bar3D',
                        data: data.map(item => ({
                            value: item
                        })),
                        shading: 'color',
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: false
                            },
                            itemStyle: {
                                color: '#ff3643'
                            }
                        }
                    }]
                };

                myChart.setOption(option);
            }

            $.get('gdp-by-country_cleaned.csv', function (csvText) {
                allCountriesData = csvText;
                updateChart(csvText, 'alphabetical');

                document.getElementById('countryFilter').addEventListener('change', function (e) {
                    updateChart(allCountriesData, e.target.value);
                });

            }).fail(function () {
                console.error('Erreur lors du chargement du fichier CSV');
            });

            window.addEventListener('resize', function () {
                myChart.resize();
            });
        });