import { SortAscIcon, SortDescIcon } from "lucide-react";
import "./Table.css";
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
    <tbody>
      {data?.length ? (
        data.map((item, index) => renderRow(item, index))
      ) : (
        <tr class="no-data-row">
          <td colspan="11">
            <div class="no-data">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>There is no data ...</p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default Table;
