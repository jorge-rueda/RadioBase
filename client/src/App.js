const App = () => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const tableContainerRef = useRef(null);

    useEffect(() => {
        fetchData(searchTerm);
    }, [searchTerm]);

    const fetchData = (searchTerm) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/radiobases`, {
            params: { searchTerm }
        })
        .then(response => {
            console.log('Data received:', response.data); // Añadido para depuración
            setData(response.data);
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    const getColor = (value) => {
        if (value === undefined) return 'grey';
        if (value <= 15) return 'red';
        if (value > 15 && value <= 40) return 'orange';
        if (value > 40 && value <= 90) return 'yellow';
        if (value > 90) return 'green';
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

    const dates = data.length && data[0].traffic ? Object.keys(data[0].traffic) : [];

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
                            {data.length > 0 ? (
                                data.map((radiobase) => (
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
            </div>
        </div>
    );
};

export default App;
