// TableComponent.tsx
import React, { useState } from 'react';
import StickyHeaderTable from '../molecules/StickyHeaderTable';
import '../styles/components/organisms/TableComponent.css';

interface TableComponentProps {
  headers: string[];
  rows: (string | number)[][];
  onRowClick: (rowData: (any | number)[]) => void; // Agregamos una función de devolución de llamada para manejar el clic en la fila
}

// interface TableComponentProps {
//   headers: string[];
//   rows: { [key: string]: string | number }[]; // Cambiar a un array de objetos
//   onRowClick: (rowData: { [key: string]: string | number }) => void;
// }

const TableComponent: React.FC<TableComponentProps> = ({ headers, rows, onRowClick }) => {
  const handleRowClick = (rowData: (string | number)[]) => {
    onRowClick(rowData); // Llama a la función de devolución de llamada con los datos de la fila
  };

  // Oculta la primera columna del ID
  const visibleHeaders = headers.slice(0);
  const visibleRows = rows.map((row) => row.slice(0));

  return (
    <div>
      <StickyHeaderTable headers={visibleHeaders} rows={visibleRows} onRowClick={handleRowClick} />
    </div>
  );
};

export default TableComponent;
