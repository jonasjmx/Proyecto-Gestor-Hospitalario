import type { TableColumn } from '../@types';

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage = 'No hay datos disponibles'
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className="table-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <i className="fas fa-inbox"></i>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {item[column.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td>
                  <div className="table-actions">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="btn btn-warning btn-small"
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="btn btn-danger btn-small"
                        title="Eliminar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
