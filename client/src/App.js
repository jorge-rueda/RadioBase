import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const API_URL = process.env.REACT_APP_API_URL || 'https://radiobase.netlify.app/.netlify/functions/api-radiobases';

const App = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [dates, setDates] = useState([]);

    const fetchData = useCallback(async (searchTerm) => {
        try {
            const response = await axios.get(API_URL, { params: { searchTerm } });
            const fetchedData = response.data;

            console.log('Fetched Data:', fetchedData);

            const transformedData = fetchedData.reduce((acc, { name, traffic_value, traffic_date }) => {
                if (!acc[name]) {
                    acc[name] = { name, traffic: {} };
                }
                acc[name].traffic[traffic_date] = traffic_value;
                return acc;
            }, {});

            const resultArray = Object.values(transformedData);
            const allDates = Array.from(new Set(fetchedData.map(item => item.traffic_date))).sort();

            console.log('All Dates:', allDates);

            setData(resultArray);
            setDates(allDates);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData(searchTerm);
    }, [fetchData, searchTerm]);

    const getColor = (value) => {
        if (value === undefined) return 'grey';
        if (value <= 15) return 'red';
        if (value > 15 && value <= 40) return 'orange';
        if (value > 40 && value <= 90) return 'yellow';
        return 'green';
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="App">
            <header className="navbar">
                <div className="navbar-container">
                    <h1>Gerencia Corporativa de Ingeniería y Planeación de RAN</h1>
                    <nav>
                        <img src="/images/logo.png" className="logo" alt="Logo"/>
                    </nav>
                </div>
            </header>

            <div className="search-container">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Buscar por radiobase..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <button className="search-button">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>
            </div>

            <div className="table-wrapper">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Radiobases</th>
                                {dates.map(date => <th key={date}>{date}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((radiobase) => (
                                <tr key={radiobase.name}>
                                    <td>{radiobase.name}</td>
                                    {dates.map((date, index) => {
                                        const value = radiobase.traffic[date];
                                        const nextDate = dates[index + 1];
                                        const nextValue = nextDate ? radiobase.traffic[nextDate] : '';

                                        return (
                                            <td key={date} className={getColor(value)}>
                                                {value || ''}
                                                {nextDate && <div className="next-date-value">{nextValue || ''}</div>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App;
