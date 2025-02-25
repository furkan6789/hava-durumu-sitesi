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
const API_KEY = 'a30c35a71099b90394ab34d8f2c11a6e'; // Bu kısmı kendi API anahtarınızla değiştirin
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM elementleri
const cityList = document.getElementById('cityList');
const citySearch = document.getElementById('citySearch');
const selectedCityElement = document.getElementById('selectedCity');
const temperatureElement = document.getElementById('temperature');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('windSpeed');
const forecastTextElement = document.getElementById('forecastText');
const weatherIconElement = document.getElementById('weatherIcon');

// Lucide ikonlarını başlat
lucide.createIcons();

// Kelvin'i Santigrat'a çevir
function kelvinToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

// Hava durumu verilerini API'den çek
async function getWeatherData(city) {
    try {
        const response = await fetch(`${API_URL}?q=${city},TR&appid=${API_KEY}&lang=tr`);
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

// Hava durumuna göre ikon seç
function getWeatherIcon(condition) {
    const iconMap = {
        'clear': 'sun',
        'clouds': 'cloud',
        'rain': 'cloud-rain',
        'drizzle': 'cloud-drizzle',
        'thunderstorm': 'cloud-lightning',
        'snow': 'cloud-snow',
        'mist': 'cloud-fog',
        'fog': 'cloud-fog',
        'haze': 'cloud-fog'
    };
    
    return iconMap[condition] || 'cloud-question';
}

// Hava durumu verilerini güncelle
async function updateWeather(city) {
    const weather = await getWeatherData(city);
    if (!weather) {
        alert('Hava durumu verileri alınamadı. Lütfen daha sonra tekrar deneyin.');
        return;
    }

    selectedCityElement.textContent = city;
    temperatureElement.textContent = `${weather.temperature}°C`;
    humidityElement.textContent = `%${weather.humidity}`;
    windSpeedElement.textContent = `${weather.windSpeed} km/s`;
    
    // Hava durumu ikonunu güncelle
    weatherIconElement.innerHTML = `<i data-lucide="${getWeatherIcon(weather.condition)}"></i>`;
    
    // Tahmin metnini güncelle
    forecastTextElement.textContent = `${city} için şu anda hava ${weather.description}. 
        Sıcaklık ${weather.temperature}°C civarında seyrediyor. 
        Nem oranı %${weather.humidity} ve rüzgar hızı ${weather.windSpeed} km/s.`;
    
    // Yeni ikonları oluştur
    lucide.createIcons();
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
            // Aktif şehri güncelle
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

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    createCityList();
    updateWeather('İstanbul');
    // İstanbul'u varsayılan olarak seç
    const istanbulButton = document.querySelector('.city-button');
    if (istanbulButton) {
        istanbulButton.classList.add('active');
    }
});