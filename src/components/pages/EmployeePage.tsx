import React from 'react';
import TableComponent from '../organisms/TableComponent';

const EmployeePage = () => {
  const headers = ['id', 'Name', 'NOMBRE COMPLETO']; // Excluimos el encabezado 'ID'
  const rows = [
    [1, 'fisio', 'Brandon Baushell Hernández Granados'],
    [2, 'fisio', 'José Pérez Leon'],
    [3, 'fisio', 'Vicente Fernández Martinez'],
    // Agrega más filas según sea necesario
  ];

  // Función de manejo de clic de fila
  const handleRowClick = (rowData: any) => {
    // Aquí puedes realizar acciones con los datos de la fila, como mostrarlos en un modal
    console.log('Fila clickeada:', rowData);
  };

  return (
    <div>
      <h1>Empleados</h1>
      {/* Pasa la función de manejo de clic de fila como prop 'onRowClick' */}
      <TableComponent headers={headers} rows={rows} onRowClick={handleRowClick} />
    </div>
  );
};

export default EmployeePage;
