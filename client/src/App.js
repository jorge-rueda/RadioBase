import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api/radiobases'; // Cambiado al URL adecuado
const ITEMS_PER_PAGE = 20; // Número de ítems por página

const App = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const tableContainerRef = useRef(null);
    const cache = useRef({});

    // Hook para obtener datos cuando cambia el término de búsqueda
    useEffect(() => {
        fetchData(searchTerm);
    }, [searchTerm]);

    // Función para obtener datos de la API
    const fetchData = useCallback(async (searchTerm) => {
        if (cache.current[searchTerm]) {
            setData(cache.current[searchTerm].resultArray);
            return;
        }

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
            cache.current[searchTerm] = { resultArray, allDates };
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    // Función para determinar el color de la celda basado en el valor
    const getColor = (value) => {
        if (value === undefined) return 'grey';
        if (value <= 15) return 'red';
        if (value > 15 && value <= 40) return 'orange';
        if (value > 40 && value <= 90) return 'yellow';
        return 'green';
    };

    // Función para formatear la fecha en español
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

    // Obtener las fechas de los datos
    const dates = (cache.current[searchTerm] && cache.current[searchTerm].allDates) || [];
    console.log('Dates:', dates);

    // Paginación
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    // Función para desplazar la tabla horizontalmente
    const scrollTable = (direction) => {
        const container = tableContainerRef.current;
        const scrollAmount = 200;

        if (direction === 'left') {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else if (direction === 'right') {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Manejar el cambio en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Resetear a la primera página al realizar una búsqueda
    };

    // Manejar el cambio de página
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
            
            {/* Contenedor de búsqueda */}
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

            {/* Contenedor de la tabla con controles de carrusel */}
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
                                {dates.map(date => <th key={date}>{formatDate(date)}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((radiobase) => (
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
                <div className="pagination-controls">
                    <span>Página {currentPage} de {totalPages}</span>
                </div>
            </div>
        </div>
    );
};

export default App;
