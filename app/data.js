// Mekong Figures — the dataset behind the atlas.
//
// Every figure below carries its source and year where it is shown. Values
// are the published headline figures (rounded for display); where a series
// is an estimate it is labelled "approx." on the page that shows it.
// Sources: General Statistics Office of Viet Nam (GSO), World Bank World
// Development Indicators (WDI), General Department of Vietnam Customs,
// EVN, UNESCO Institute for Statistics, UNDP Human Development Report.

const ATLAS = {
  country: {
    name: "Viet Nam",
    capital: "Ha Noi",
    largestCity: "Ho Chi Minh City",
    areaKm2: 331690,
    currency: "Vietnamese dong (VND)",
    currencyPerUsd2024: 25350,
    regions: 6,
    provinces: 63,
  },

  years: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],

  // Headline indicators, 2024 unless noted.
  headline: [
    { key: "population", label: "Population", value: 101.3, unit: "million", year: 2024, source: "World Bank WDI" },
    { key: "gdp", label: "GDP (nominal)", value: 476.4, unit: "US$ bn", year: 2024, source: "World Bank WDI" },
    { key: "gdpPerCapita", label: "GDP per capita", value: 4700, unit: "US$", year: 2024, source: "World Bank WDI" },
    { key: "growth", label: "GDP growth", value: 7.1, unit: "%", year: 2024, source: "GSO Viet Nam" },
    { key: "exports", label: "Exports of goods", value: 405.5, unit: "US$ bn", year: 2024, source: "Vietnam Customs" },
    { key: "lifeExpectancy", label: "Life expectancy", value: 74.8, unit: "years", year: 2024, source: "World Bank WDI" },
  ],

  series: {
    population: {
      label: "Population",
      unit: "million people",
      source: "World Bank WDI, mid-year estimates",
      values: [93.0, 93.9, 94.8, 95.7, 96.6, 97.6, 98.5, 99.5, 100.4, 101.3],
    },
    gdp: {
      label: "GDP, nominal",
      unit: "US$ billion",
      source: "World Bank WDI",
      values: [233.4, 252.3, 280.8, 310.1, 334.4, 343.2, 366.1, 408.8, 429.7, 476.4],
    },
    gdpPerCapita: {
      label: "GDP per capita",
      unit: "US$",
      source: "World Bank WDI",
      values: [2509, 2686, 2961, 3238, 3465, 3517, 3718, 4108, 4280, 4700],
    },
    growth: {
      label: "Real GDP growth",
      unit: "% per year",
      source: "General Statistics Office of Viet Nam",
      values: [6.7, 6.2, 6.9, 7.1, 7.0, 2.9, 2.6, 8.0, 5.1, 7.1],
    },
    exports: {
      label: "Exports of goods",
      unit: "US$ billion",
      source: "General Department of Vietnam Customs",
      values: [162.1, 176.6, 214.0, 243.5, 264.3, 282.6, 336.3, 371.9, 355.5, 405.5],
    },
    imports: {
      label: "Imports of goods",
      unit: "US$ billion",
      source: "General Department of Vietnam Customs",
      values: [165.6, 174.1, 213.2, 236.7, 253.7, 262.7, 332.2, 360.7, 327.5, 380.8],
    },
    inflation: {
      label: "Consumer price inflation",
      unit: "% per year",
      source: "General Statistics Office of Viet Nam",
      values: [0.6, 2.7, 3.5, 3.5, 2.8, 3.2, 1.8, 3.2, 3.3, 3.6],
    },
    unemployment: {
      label: "Unemployment rate",
      unit: "% of labour force",
      source: "General Statistics Office of Viet Nam",
      values: [2.2, 2.3, 2.2, 2.2, 2.2, 2.5, 3.2, 2.3, 2.3, 2.2],
    },
    arrivals: {
      label: "International visitor arrivals",
      unit: "million people",
      source: "General Statistics Office of Viet Nam",
      values: [7.9, 10.0, 12.9, 15.5, 18.0, 3.8, 0.2, 3.7, 12.6, 17.6],
    },
    lifeExpectancy: {
      label: "Life expectancy at birth",
      unit: "years",
      source: "World Bank WDI",
      values: [75.6, 75.7, 75.7, 75.7, 75.7, 75.5, 75.1, 74.6, 74.7, 74.8],
    },
  },

  // Structure of the economy, 2024 (share of GDP, %).
  sectors2024: [
    { name: "Services", share: 42.4, note: "trade, transport, finance, tourism" },
    { name: "Industry & construction", share: 37.6, note: "manufacturing, mining, building" },
    { name: "Agriculture, forestry & fishing", share: 11.9, note: "rice, coffee, aquaculture" },
    { name: "Taxes less subsidies on products", share: 8.1, note: "net product taxes" },
  ],

  // Age structure, 2024 (% of population).
  ageStructure2024: [
    { name: "Ages 0–14", share: 23.0 },
    { name: "Ages 15–64", share: 68.4 },
    { name: "Ages 65+", share: 8.6 },
  ],

  // Society snapshot.
  society: [
    { label: "Median age", value: "33.5 years", year: 2024, source: "UN World Population Prospects" },
    { label: "Fertility rate", value: "1.91 children per woman", year: 2024, source: "GSO Viet Nam" },
    { label: "Urban population", value: "39.5% of people", year: 2023, source: "World Bank WDI" },
    { label: "Adult literacy", value: "95.8%", year: 2023, source: "UNESCO Institute for Statistics" },
    { label: "Mean years of schooling", value: "9.3 years", year: 2023, source: "UNDP Human Development Report" },
    { label: "Mobile subscriptions", value: "126 per 100 people", year: 2023, source: "World Bank WDI" },
    { label: "Internet users", value: "78.4 million (≈77%)", year: 2024, source: "DataReportal, approx." },
    { label: "Hospital beds", value: "2.6 per 1,000 people", year: 2019, source: "World Bank WDI" },
    { label: "Under-5 mortality", value: "17.1 per 1,000 live births", year: 2023, source: "World Bank WDI" },
    { label: "Electricity output", value: "≈297 TWh", year: 2024, source: "EVN, approx." },
    { label: "Renewables share of capacity", value: "≈43%", year: 2024, source: "EVN, approx." },
    { label: "Labour force", value: "52.5 million people", year: 2024, source: "GSO Viet Nam" },
  ],

  // Top export products, 2024 (US$ billion, approx.).
  exportProducts2024: [
    { name: "Electronics & computers", value: 72.5 },
    { name: "Phones & components", value: 53.9 },
    { name: "Machinery & equipment", value: 52.3 },
    { name: "Textiles & garments", value: 44.0 },
    { name: "Footwear", value: 22.0 },
    { name: "Wood & wooden products", value: 16.3 },
    { name: "Seafood", value: 10.0 },
    { name: "Rice", value: 5.7 },
    { name: "Coffee", value: 5.6 },
  ],

  // Top export destinations, 2024 (US$ billion, approx.).
  exportPartners2024: [
    { name: "United States", value: 136.6 },
    { name: "China", value: 61.2 },
    { name: "European Union", value: 51.7 },
    { name: "ASEAN", value: 37.4 },
    { name: "South Korea", value: 25.5 },
    { name: "Japan", value: 21.6 },
  ],

  // Provinces and centrally-run cities, 2024 (population in millions, area in km2).
  // Populations are GSO estimates rounded to one decimal; density is computed.
  provinces: [
    { name: "Ho Chi Minh City", pop: 9.5, area: 2061 },
    { name: "Ha Noi", pop: 8.7, area: 3359 },
    { name: "Thanh Hoa", pop: 3.7, area: 11129 },
    { name: "Nghe An", pop: 3.4, area: 16486 },
    { name: "Dong Nai", pop: 3.3, area: 5863 },
    { name: "Binh Duong", pop: 2.8, area: 2694 },
    { name: "Hai Phong", pop: 2.1, area: 1526 },
    { name: "An Giang", pop: 1.9, area: 3536 },
    { name: "Hai Duong", pop: 1.9, area: 1668 },
    { name: "Bac Giang", pop: 1.9, area: 3895 },
    { name: "Dak Lak", pop: 1.9, area: 13030 },
    { name: "Thai Binh", pop: 1.9, area: 1586 },
    { name: "Nam Dinh", pop: 1.8, area: 1669 },
    { name: "Tien Giang", pop: 1.8, area: 2510 },
    { name: "Kien Giang", pop: 1.7, area: 6348 },
    { name: "Long An", pop: 1.7, area: 4493 },
    { name: "Dong Thap", pop: 1.6, area: 3383 },
    { name: "Gia Lai", pop: 1.6, area: 15511 },
    { name: "Binh Dinh", pop: 1.5, area: 6066 },
    { name: "Quang Nam", pop: 1.5, area: 10574 },
    { name: "Phu Tho", pop: 1.5, area: 3534 },
    { name: "Binh Thuan", pop: 1.5, area: 7942 },
    { name: "Quang Ninh", pop: 1.4, area: 6179 },
    { name: "Can Tho", pop: 1.3, area: 1439 },
    { name: "Khanh Hoa", pop: 1.3, area: 5138 },
    { name: "Lam Dong", pop: 1.3, area: 9783 },
    { name: "Ben Tre", pop: 1.3, area: 2394 },
    { name: "Hung Yen", pop: 1.3, area: 930 },
    { name: "Ha Tinh", pop: 1.3, area: 5990 },
    { name: "Thai Nguyen", pop: 1.3, area: 3534 },
    { name: "Da Nang", pop: 1.2, area: 1285 },
    { name: "Ca Mau", pop: 1.2, area: 5221 },
    { name: "Soc Trang", pop: 1.2, area: 3311 },
    { name: "Thua Thien Hue", pop: 1.2, area: 5033 },
    { name: "Quang Ngai", pop: 1.2, area: 5155 },
    { name: "Ba Ria–Vung Tau", pop: 1.2, area: 1982 },
    { name: "Tay Ninh", pop: 1.2, area: 4041 },
    { name: "Vinh Phuc", pop: 1.2, area: 1236 },
    { name: "Bac Ninh", pop: 1.5, area: 822 },
    { name: "Vinh Long", pop: 1.0, area: 1525 },
    { name: "Tra Vinh", pop: 1.0, area: 2341 },
    { name: "Binh Phuoc", pop: 1.0, area: 6877 },
    { name: "Ninh Binh", pop: 1.0, area: 1411 },
    { name: "Phu Yen", pop: 0.9, area: 5023 },
    { name: "Ha Nam", pop: 0.9, area: 861 },
    { name: "Hoa Binh", pop: 0.9, area: 4590 },
    { name: "Ha Giang", pop: 0.9, area: 7914 },
    { name: "Quang Binh", pop: 0.9, area: 7999 },
    { name: "Bac Lieu", pop: 0.9, area: 2669 },
    { name: "Lao Cai", pop: 0.8, area: 6364 },
    { name: "Yen Bai", pop: 0.8, area: 6887 },
    { name: "Lang Son", pop: 0.8, area: 8310 },
    { name: "Tuyen Quang", pop: 0.8, area: 5867 },
    { name: "Ninh Thuan", pop: 0.6, area: 3355 },
    { name: "Quang Tri", pop: 0.6, area: 4744 },
    { name: "Dak Nong", pop: 0.7, area: 6509 },
    { name: "Hau Giang", pop: 0.7, area: 1622 },
    { name: "Dien Bien", pop: 0.6, area: 9539 },
    { name: "Kon Tum", pop: 0.6, area: 9674 },
    { name: "Son La", pop: 1.3, area: 14123 },
    { name: "Lai Chau", pop: 0.5, area: 9068 },
    { name: "Cao Bang", pop: 0.5, area: 6700 },
    { name: "Bac Kan", pop: 0.3, area: 4860 },
  ],

  // Short release notes shown on the home page.
  releases: [
    { date: "Nov 2026", text: "2024 population estimate: 101.3 million people (World Bank WDI)." },
    { date: "Oct 2026", text: "GDP 2024 confirmed at US$476.4 billion; growth 7.1% (GSO)." },
    { date: "Sep 2026", text: "Exports of goods 2024: US$405.5 billion, a record year (Vietnam Customs)." },
    { date: "Aug 2026", text: "International arrivals 2024: 17.6 million visitors (GSO)." },
    { date: "Jul 2026", text: "Fertility rate 2024: 1.91 children per woman (GSO)." },
  ],
};

// Node test harness can read the same file.
if (typeof module !== "undefined" && module.exports) module.exports = ATLAS;
