const apiKey = "676ef2f468ac297227c3288cb0819f44";

const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const weatherBox = document.getElementById("weatherBox");

function showLoader(show) {
    loader.style.display = show ? "block" : "none";
}

function showError(message) {
    errorBox.innerText = message;
}

function clearUI() {
    errorBox.innerText = "";
    weatherBox.style.display = "none";

    const icon = document.getElementById("icon");
    icon.src = "";
    icon.style.display = "none";
}

async function fetchWeather(url) {
    try {
        showLoader(true);
        clearUI();

        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        displayWeather(data);
    } catch (error) {
        showError(error.message || "Something went wrong");
    } finally {
        showLoader(false);
    }
}

function displayWeather(data) {
    weatherBox.style.display = "block";

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temperature").innerText =
        `🌡 Temperature: ${data.main.temp} °C`;
    document.getElementById("description").innerText =
        `☁ Weather: ${data.weather[0].description}`;
    document.getElementById("humidity").innerText =
        `💧 Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").innerText =
        `🌬 Wind Speed: ${data.wind.speed} m/s`;

    const icon = document.getElementById("icon");
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.style.display = "block";

}

function getWeather() {
    const city = document.getElementById("city").value.trim();
    if (!city) {
        showError("Please enter a city name");
        return;
    }

    localStorage.setItem("lastCity", city); // ✅ SAVE CITY

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetchWeather(url);
}

function getLocationWeather() {
    if (!navigator.geolocation) {
        showError("Geolocation is not supported by your browser");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const url =
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            fetchWeather(url);
        },
        () => {
            showError("Location access denied");
        }
    );
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
window.onload = () => {
    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
        document.getElementById("city").value = lastCity;
        getWeather();
    }
};
