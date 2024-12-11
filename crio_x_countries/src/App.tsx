import { useState, useEffect } from 'react';
import './App.css';

type FlagItem = {
  name: string;
  flag: string;
};

function CountryFlag({ name, flag }: FlagItem) {
  return (
    <div className="flag">
      <img src={flag} alt={`Flag of ${name}`} />
      <p>{name}</p>
    </div>
  );
}

function App() {
  const [countries, setCountries] = useState<FlagItem[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://xcountries-backend.azurewebsites.net/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        const errorMessage = `Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMessage);
        setError(errorMessage);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="container">
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {countries.map((country, cIdx) => ( // Some countries are apparently repeated, idk if they are meant to not be included
          <CountryFlag
            key={country.name + '-' + cIdx}
            name={country.name}
            flag={country.flag}
          />
        ))}
      </div>
    </div>
  );
}

export default App;