import React, { useState, useEffect } from 'react';

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
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Valor de Tráfico</th>
            <th>Fecha de Tráfico</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.traffic_value}</td>
              <td>{item.traffic_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;
