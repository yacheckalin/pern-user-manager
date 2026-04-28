import { SortAscIcon, SortDescIcon } from "lucide-react";
const Table = ({ columns, renderRow, data, sortConfig, onSort }) => (
  <table className="custom-table">
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col.key} onClick={() => onSort?.(col.key)}>
            {col.label}
            {sortConfig?.key === col.key &&
              (sortConfig.direction ? <SortAscIcon /> : <SortDescIcon />)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>{data && data.map((item, index) => renderRow(item, index))}</tbody>
  </table>
);

export default Table;
