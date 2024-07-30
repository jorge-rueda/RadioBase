import React, { useState, useEffect } from 'react';
import './App.css'; // Importa un archivo de estilo CSS si es necesario

// Define el tamaño de la página
const PAGE_SIZE = 10;

const PaginatedTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Función para obtener los datos
  const fetchData = async () => {
    try {
      // Reemplaza '/api/data' con la URL de tu API
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);

      // Calcula el total de páginas
      setTotalPages(Math.ceil(result.length / PAGE_SIZE));
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  // Obtener los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, []);

  // Obtener los datos para la página actual
  const paginatedData = data.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Cambiar de página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Valor de Tráfico</th>
              <th>Fecha de Tráfico</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.traffic_value}</td>
                <td>{item.traffic_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="carousel-controls">
        <button
          className="carousel-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        <span className="pagination-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="carousel-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default App;
