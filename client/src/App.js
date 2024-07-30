import React, { useState, useEffect } from 'react';
import './App.css'; // Asegúrate de tener este archivo si usas estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { format, parseISO } from 'date-fns'; // Importa solo si usas formateo de fechas

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Función para obtener datos, por ejemplo desde una API
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data'); // Reemplaza con tu endpoint
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Inicializa filteredData
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filtra datos basado en el término de búsqueda
    const result = data.filter(item => 
      item.radiobase.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(result);
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Mi Aplicación</h1>
        <div className="search">
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
          <button>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </header>
      <main>
        {loading ? (
          <p>Cargando datos...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Radiobases</th>
                {/* Aquí puedes agregar más encabezados si es necesario */}
                {/* Ejemplo: <th>Fecha</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.radiobase}</td>
                  {/* Ejemplo de formato de fecha, solo si tienes una fecha */}
                  {/* <td>{item.date ? format(parseISO(item.date), 'dd-MM-yyyy') : 'No disponible'}</td> */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Ejemplo de paginación */}
        <div className="pagination">
          <button>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <button>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
