import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import mockWeatherData from '../mockWeatherData';

const WeatherSection = ({ title, summary, details, isExpanded, onToggle }) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity onPress={onToggle}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.summary}>{summary}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.details}>
          {details.map((item, index) => (
            <Text key={index} style={styles.detailText}>{item}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({
    now: false,
    today: false,
    tomorrow: false,
    week: false,
    weekend: false
  });

  // Replace with your actual API key
  const API_KEY = 'AT9UfsG7atXGtwzEX2Tkhs1IkPDFGKNX';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        // OPTION 1: Use the mock data for development
        // setWeatherData(mockWeatherData);
        // setLoading(false);
        
        // OPTION 2: Use the Pirate Weather API
        // Uncomment the code below and add your API key when ready for production
        
        const response = await axios.get(
          `https://api.pirateweather.net/forecast/${API_KEY}/37.7749,-122.4194`
        );
        console.log('Weather data fetched:', response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data. Please try again.');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const toggleExpanded = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading weather information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!weatherData) {
    return (
      <View style={styles.centerContainer}>
        <Text>No weather data available.</Text>
      </View>
    );
  }

  // Format temperature
  const formatTemp = (temp) => `${Math.round(temp)}°F`;

  // Get current weather
  const current = weatherData.currently;
  const daily = weatherData.daily.data;
  const hourly = weatherData.hourly.data;

  // Prepare data for each section
  const nowSummary = `${current.summary}, ${formatTemp(current.temperature)}`;
  const nowDetails = [
    `Feels like: ${formatTemp(current.apparentTemperature)}`,
    `Humidity: ${Math.round(current.humidity * 100)}%`,
    `Wind: ${Math.round(current.windSpeed)} mph`,
    `UV Index: ${current.uvIndex}`,
    `Visibility: ${current.visibility} miles`
  ];

  const todaySummary = `${daily[0].summary}, High: ${formatTemp(daily[0].temperatureHigh)}, Low: ${formatTemp(daily[0].temperatureLow)}`;
  const todayDetails = hourly
    .slice(0, 24)
    .filter((hour, idx) => idx % 3 === 0) // Every 3 hours
    .map(hour => {
      const date = new Date(hour.time * 1000);
      const hourStr = date.getHours();
      const ampm = hourStr >= 12 ? 'PM' : 'AM';
      const hour12 = hourStr % 12 || 12;
      return `${hour12}${ampm}: ${hour.summary}, ${formatTemp(hour.temperature)}`;
    });

  const tomorrowSummary = `${daily[1].summary}, High: ${formatTemp(daily[1].temperatureHigh)}, Low: ${formatTemp(daily[1].temperatureLow)}`;
  const tomorrowDetails = hourly
    .slice(24, 48)
    .filter((hour, idx) => idx % 3 === 0) // Every 3 hours
    .map(hour => {
      const date = new Date(hour.time * 1000);
      const hourStr = date.getHours();
      const ampm = hourStr >= 12 ? 'PM' : 'AM';
      const hour12 = hourStr % 12 || 12;
      return `${hour12}${ampm}: ${hour.summary}, ${formatTemp(hour.temperature)}`;
    });

  const weekSummary = weatherData.daily.summary;
  const weekDetails = daily.slice(0, 7).map(day => {
    const date = new Date(day.time * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return `${dayName}: ${day.summary}, High: ${formatTemp(day.temperatureHigh)}, Low: ${formatTemp(day.temperatureLow)}`;
  });

  // Get weekend days (Saturday and Sunday)
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = dayOfWeek === 6 ? 7 : (6 - dayOfWeek) % 7;
  const saturdayIndex = daysUntilSaturday;
  const sundayIndex = (daysUntilSaturday + 1) % 7;

  const weekendSummary = `Weekend forecast: ${daily[saturdayIndex].summary}`;
  const weekendDetails = [
    `Saturday: ${daily[saturdayIndex].summary}, High: ${formatTemp(daily[saturdayIndex].temperatureHigh)}, Low: ${formatTemp(daily[saturdayIndex].temperatureLow)}`,
    `Sunday: ${daily[sundayIndex].summary}, High: ${formatTemp(daily[sundayIndex].temperatureHigh)}, Low: ${formatTemp(daily[sundayIndex].temperatureLow)}`
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Weather App</Text>

      <WeatherSection
        title="Now"
        summary={nowSummary}
        details={nowDetails}
        isExpanded={expanded.now}
        onToggle={() => toggleExpanded('now')}
      />

      <WeatherSection
        title="Today"
        summary={todaySummary}
        details={todayDetails}
        isExpanded={expanded.today}
        onToggle={() => toggleExpanded('today')}
      />

      <WeatherSection
        title="Tomorrow"
        summary={tomorrowSummary}
        details={tomorrowDetails}
        isExpanded={expanded.tomorrow}
        onToggle={() => toggleExpanded('tomorrow')}
      />

      <WeatherSection
        title="This Week"
        summary={weekSummary}
        details={weekDetails}
        isExpanded={expanded.week}
        onToggle={() => toggleExpanded('week')}
      />

      <WeatherSection
        title="This Weekend"
        summary={weekendSummary}
        details={weekendDetails}
        isExpanded={expanded.weekend}
        onToggle={() => toggleExpanded('weekend')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  summary: {
    fontSize: 16,
    color: '#333',
  },
  details: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  }
});

export default Weather;