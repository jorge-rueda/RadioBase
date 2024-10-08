import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const API_URL = process.env.REACT_APP_API_URL || 'https://radiobase.netlify.app/.netlify/functions/api-radiobases';
const ITEMS_PER_PAGE = 20; // Cambiado a 20

const App = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const tableContainerRef = useRef(null);
    const cache = useRef({});

    const fetchData = useCallback(async (searchTerm) => {
        if (cache.current[searchTerm]) {
            setData(cache.current[searchTerm].resultArray);
            return;
        }

        try {
            const response = await axios.get(API_URL, { params: { searchTerm } });
            const fetchedData = response.data;

            console.log('Fetched Data:', fetchedData);

            // Transformar datos
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

            // Filtrar datos según el término de búsqueda
            const filteredData = resultArray.filter(radiobase => 
                radiobase.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setData(filteredData);
            cache.current[searchTerm] = { resultArray: filteredData, allDates };
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

    const dates = (cache.current[searchTerm] && cache.current[searchTerm].allDates) || [];
    console.log('Dates:', dates);

    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handlePageChange = (direction) => {
        setCurrentPage(prevPage => {
            if (direction === 'next') {
                return Math.min(prevPage + 1, totalPages);
            } else if (direction === 'prev') {
                return Math.max(prevPage - 1, 1);
            }
            return prevPage;
        });
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Resetear a la primera página al realizar una búsqueda
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
                    <button
                        onClick={() => handlePageChange('prev')}
                        className="carousel-button"
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <button
                        onClick={() => handlePageChange('next')}
                        className="carousel-button"
                        disabled={currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
                <div className="table-container" ref={tableContainerRef}>
                    <table>
                        <thead>
                            <tr>
                                <th>Radiobases</th>
                                {dates.map(date => <th key={date}>{date}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((radiobase) => (
                                    <tr key={radiobase.name}>
                                        <td>{radiobase.name}</td>
                                        {dates.map(date => (
                                            <td key={date} className={getColor(radiobase.traffic[date])}>
                                                {radiobase.traffic[date] || ''}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={dates.length + 1}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-controls">
                    <span>Página {currentPage} de {totalPages}</span>
                </div>
            </div>
        </div>
    );
};

export default App;
