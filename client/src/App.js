import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const App = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const tableContainerRef = useRef(null);

    // Hook para obtener datos cuando cambia el término de búsqueda
    useEffect(() => {
        fetchData(searchTerm);
    }, [searchTerm]);

    // Función para obtener datos de la API
    const fetchData = (searchTerm) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/radiobases`, {
            params: { searchTerm }
        })
        .then(response => setData(response.data))
        .catch(error => console.error('Error fetching data:', error));
    };

    // Función para determinar el color de la celda basado en el valor
    const getColor = (value) => {
        if (value === undefined) return 'grey';
        if (value <= 15) return 'red';
        if (value > 15 && value <= 40) return 'orange';
        if (value > 40 && value <= 90) return 'yellow';
        if (value > 90) return 'green';
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
    const dates = data.length && data[0].traffic ? Object.keys(data[0].traffic) : [];

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
