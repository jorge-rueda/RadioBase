import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const API_URL = process.env.REACT_APP_API_URL || 'https://radiobase.netlify.app/.netlify/functions/api-radiobases';

const App = () => {
    const [data, setData] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');  
    const tableContainerRef = useRef(null);  
    const cache = useRef({}); // Use useRef for cache

    const fetchData = useCallback(async (searchTerm) => {
        if (cache.current[searchTerm]) {
            setData(cache.current[searchTerm]);
            return;
        }

        try {
            const response = await axios.get(API_URL, { params: { searchTerm } });
            const fetchedData = response.data;
            setData(fetchedData);
            cache.current[searchTerm] = fetchedData;
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
        return 'green'; // Valor > 90
    };

    const formatDate = (dateStr) => {
        try {
            const date = new Date(dateStr);
            const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
            return date.toLocaleDateString('es-MX', options);
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateStr;
        }
    };

    const dates = data.length ? Object.keys(data[0].traffic || {}) : [];

    const scrollTable = (direction) => {
        const container = tableContainerRef.current;
        const scrollAmount = 200;

        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else if (direction === 'right') {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
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
                <div className="carousel-controls">
                    <button onClick={() => scrollTable('left')} className="carousel-button">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <button onClick={() => scrollTable('right')} className="carousel-button">
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
                <div className="table-container" ref={tableContainerRef}>
                    <table>
                        <thead>
                            <tr>
                                <th>Radiobases</th>
                                {dates.map(date => <th key={date}>{formatDate(date)}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((radiobase) => (
                                <tr key={radiobase.name}>
                                    <td>{radiobase.name}</td>
                                    {dates.map(date => (
                                        <td key={date} className={getColor(radiobase.traffic[date])}>
                                            {radiobase.traffic[date] || ''}
                                        </td>
                                    ))}
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
