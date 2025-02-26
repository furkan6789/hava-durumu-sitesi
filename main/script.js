// Türkiye'deki şehirler
const cities = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale",
    "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
    "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin",
    "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt",
    "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük",
    "Kilis", "Osmaniye", "Düzce"
];

// OpenWeather API anahtarı
const API_KEY = 'a30c35a71099b90394ab34d8f2c11a6e';
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM elementleri
const cityList = document.getElementById('cityList');
const citySearch = document.getElementById('citySearch');
const selectedCityElement = document.getElementById('selectedCity');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const weeklyForecastElement = document.getElementById('weeklyForecast');
const weatherIconElement = document.getElementById('weatherIcon');

// Tema değiştirme butonu
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Ayarlar ikonu ve menüsü
const settingsIcon = document.getElementById('settingsIcon');
const settingsMenu = document.getElementById('settingsMenu');
const languageOption = document.getElementById('languageOption');
const contactOption = document.getElementById('contactOption');

// Dil seçme menüsü
const languageMenu = document.getElementById('languageMenu');
const trOption = document.getElementById('trOption');
const enOption = document.getElementById('enOption');

// Kelvin'i Santigrat'a çevir
function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

// Hava durumu verilerini API'den çek
async function getWeatherData(city) {
    try {
        const response = await fetch(`${CURRENT_WEATHER_URL}?q=${city},TR&appid=${API_KEY}&lang=tr`);
        if (!response.ok) {
            throw new Error('Hava durumu verileri alınamadı');
        }
        const data = await response.json();
        return {
            temperature: kelvinToCelsius(data.main.temp),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // m/s'yi km/s'ye çevir
            condition: data.weather[0].main.toLowerCase(),
            description: data.weather[0].description
        };
    } catch (error) {
        console.error('Hava durumu verisi çekilirken hata:', error);
        return null;
    }
}

// 1 Haftalık ve 15 Günlük Hava Tahmini
async function getWeeklyForecast(city) {
    try {
        const response = await fetch(`${FORECAST_URL}?q=${city},TR&cnt=8&appid=${API_KEY}&lang=tr&units=metric`);
        if (!response.ok) {
            throw new Error('Haftalık tahmin verileri alınamadı');
        }
        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error('Haftalık tahmin verisi çekilirken hata:', error);
        return null;
    }
}

// Haftalık tahmini ekranda göster
function displayWeeklyForecast(forecast) {
    const language = localStorage.getItem('language') || 'tr';
    const locale = language === 'tr' ? 'tr-TR' : 'en-US';
    
    weeklyForecastElement.innerHTML = forecast.map(day => `
        <div class="forecast-day">
            <p>${new Date(day.dt * 1000).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}: ${day.weather[0].description}, ${day.main.temp}°C</p>
        </div>
    `).join('');
}

// Hava durumuna göre ikon seç
function getWeatherIcon(condition) {
    const iconMap = {
        'clear': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
        'clouds': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',
        'rain': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-rain"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>',
        'drizzle': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-drizzle"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 19v1"/><path d="M8 14v1"/><path d="M16 19v1"/><path d="M16 14v1"/><path d="M12 21v1"/><path d="M12 16v1"/></svg>',
        'thunderstorm': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-lightning"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>',
        'snow': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-snow"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/></svg>',
        'mist': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-fog"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>',
        'fog': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-fog"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>',
        'haze': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-fog"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 17H7"/><path d="M17 21H9"/></svg>'
    };
    
    return iconMap[condition] || '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-question"><path d="M10 9.9V9a3 3 0 1 1 6 0v.9"/><path d="M10 14h4"/><path d="M4 15.907A7 7 0 1 1 15.71 9h1.79a4.5 4.5 0 0 1 2.5 8.242"/></svg>';
}

// Hava durumu verilerini güncelle
async function updateWeather(city) {
    const currentWeather = await getWeatherData(city);
    const weeklyForecast = await getWeeklyForecast(city);

    if (currentWeather && weeklyForecast) {
        selectedCityElement.textContent = city;
        temperatureElement.textContent = `${currentWeather.temperature}°C`;
        humidityElement.textContent = `%${currentWeather.humidity}`;
        windSpeedElement.textContent = `${currentWeather.windSpeed} km/s`;
        weatherIconElement.innerHTML = getWeatherIcon(currentWeather.condition);
        displayWeeklyForecast(weeklyForecast);
    } else {
        alert('Hava durumu verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
    }
}

// Şehir listesini oluştur
function createCityList(searchTerm = '') {
    cityList.innerHTML = '';
    const filteredCities = cities.filter(city => 
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filteredCities.forEach(city => {
        const button = document.createElement('button');
        button.className = 'city-button';
        button.textContent = city;
        button.onclick = () => {
            document.querySelectorAll('.city-button').forEach(btn => 
                btn.classList.remove('active')
            );
            button.classList.add('active');
            updateWeather(city);
        };
        cityList.appendChild(button);
    });
}

// Arama kutusunu dinle
citySearch.addEventListener('input', (e) => {
    createCityList(e.target.value);
});

// Tema değiştirme işlevi
let isDarkTheme = localStorage.getItem('theme') === 'dark';

function applyTheme() {
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
        themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    } else {
        document.body.classList.remove('dark-theme');
        themeIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    }
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
}

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    applyTheme();
});

// Dil değiştirme işlevi
function changeLanguage(lang) {
    localStorage.setItem('language', lang);
    applyLanguage();
    closeLanguageMenu();
}

// Dil ayarlarını uygula
function applyLanguage() {
    const language = localStorage.getItem('language') || 'tr';
    const translations = {
        tr: {
            title: "Türkiye Hava Durumu",
            subtitle: "81 İl için Güncel Hava Durumu",
            searchPlaceholder: "Şehir Ara...",
            temperature: "Sıcaklık",
            humidity: "Nem",
            windSpeed: "Rüzgar",
            forecastTitle: "1 Haftalık ve 15 Günlük Tahmin",
            settingsTitle: "Ayarlar",
            languageOption: "Dil Değiştir",
            contactOption: "Bize Ulaşın",
            languageMenuTitle: "Dil Seçin",
            turkish: "Türkçe",
            english: "English"
        },
        en: {
            title: "Turkey Weather",
            subtitle: "Current Weather for 81 Cities",
            searchPlaceholder: "Search City...",
            temperature: "Temperature",
            humidity: "Humidity",
            windSpeed: "Wind Speed",
            forecastTitle: "1 Week and 15 Days Forecast",
            settingsTitle: "Settings",
            languageOption: "Change Language",
            contactOption: "Contact Us",
            languageMenuTitle: "Select Language",
            turkish: "Turkish",
            english: "English"
        }
    };

    const translation = translations[language];
    document.title = translation.title;
    document.querySelector('header h1').textContent = translation.title;
    document.querySelector('header p').textContent = translation.subtitle;
    document.getElementById('citySearch').placeholder = translation.searchPlaceholder;
    document.querySelector('.info-card:nth-child(1) p').textContent = translation.temperature;
    document.querySelector('.info-card:nth-child(2) p').textContent = translation.humidity;
    document.querySelector('.info-card:nth-child(3) p').textContent = translation.windSpeed;
    document.querySelector('.forecast h3').textContent = translation.forecastTitle;
    document.querySelector('.settings-menu h3').textContent = translation.settingsTitle;
    document.querySelector('#languageOption span:nth-child(2)').textContent = translation.languageOption;
    document.querySelector('#contactOption span:nth-child(2)').textContent = translation.contactOption;
    document.querySelector('.language-menu h3').textContent = translation.languageMenuTitle;
    document.querySelector('#trOption span').textContent = translation.turkish;
    document.querySelector('#enOption span').textContent = translation.english;
}

// Ayarlar menüsünü aç/kapat
function toggleSettingsMenu() {
    const isVisible = settingsMenu.style.display === 'block';
    settingsMenu.style.display = isVisible ? 'none' : 'block';
    
    // Dil menüsünü kapat
    languageMenu.style.display = 'none';
}

// Dil seçme menüsünü aç
function openLanguageMenu() {
    languageMenu.style.display = 'block';
}

// Dil seçme menüsünü kapat
function closeLanguageMenu() {
    languageMenu.style.display = 'none';
}

// Event listeners
settingsIcon.addEventListener('click', toggleSettingsMenu);
languageOption.addEventListener('click', openLanguageMenu);
contactOption.addEventListener('click', () => {
    window.open('https://github.com/furkan6789', '_blank');
});
trOption.addEventListener('click', () => changeLanguage('tr'));
enOption.addEventListener('click', () => changeLanguage('en'));

// Menü dışına tıklandığında menüleri kapat
document.addEventListener('click', (e) => {
    if (!settingsIcon.contains(e.target) && 
        !settingsMenu.contains(e.target) && 
        !languageMenu.contains(e.target)) {
        settingsMenu.style.display = 'none';
        languageMenu.style.display = 'none';
    }
});

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    createCityList();
    updateWeather('İstanbul');
    applyTheme();
    applyLanguage();
});