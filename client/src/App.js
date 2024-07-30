import React, { useState, useEffect } from 'react';

const PAGE_SIZE = 10; // Número de registros por página

const PaginatedTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Función para obtener los datos
  const fetchData = async () => {
    const response = await fetch('/api/data');
    const result = await response.json();
    setData(result);
    setTotalPages(Math.ceil(result.length / PAGE_SIZE));
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
            <th>Columna 1</th>
            <th>Columna 2</th>
            {/* Agrega más encabezados según sea necesario */}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.columna1}</td>
              <td>{item.columna2}</td>
              {/* Agrega más celdas según sea necesario */}
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
