import { useState, useEffect } from 'react';
import './App.css';

type FlagItem = {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
  }
};

function CountryFlag({ name, flags }: FlagItem) {
  return (
    <div className="countryCard">
      <img src={flags.png} alt={`Flag of ${name}`} />
      <p>{name.common}</p>
    </div>
  );
}

let countryData = [] as FlagItem[];

function App() {
  const [countries, setCountries] = useState<FlagItem[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        countryData = data;
        setCountries(data);
      } catch (error) {
        const errorMessage = `Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMessage);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    setCountries(filter?.length > 0 ?
      countryData.filter((country) => {
        let { common } = country.name;
        common = common.toLowerCase();
        const thisFilter = filter.toLowerCase();
        return common.includes(thisFilter);
      }) :
      countryData
    ) 
  }, [filter]);

  return (
    <div className="container">
      <nav>
        <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </nav>
      <div className="grid">
        {countries.map((country, cIdx) => ( // Some countries are apparently repeated, idk if they are meant to not be included
          <CountryFlag
            key={country.name + '-' + cIdx}
            name={country.name}
            flags={country.flags}
          />
        ))}
      </div>
    </div>
  );
}

export default App;