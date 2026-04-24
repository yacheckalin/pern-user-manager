import React from "react";
import "./UserTable.css";
import { formatDate } from "../utils/user.helpers"; // Обычный CSS или CSS Modules

export const UserTable = ({ users = [], isLoading, onDelete }) => {
  if (isLoading)
    return <div className="status-message">Загрузка данных...</div>;
  if (!users.length)
    return <div className="status-message">Список пользователей пуст</div>;

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Age</th>
            <th>Status</th>
            <th>Created</th>
            <th>Activated</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={!user.isActive ? "row-disabled" : ""}>
              <td className="cell-id">#{user.id}</td>
              <td className="cell-username">{user.username}</td>
              <td>{user.email}</td>
              <td>{user.age || "—"}</td>
              <td>
                <span
                  className={`status-pill ${user.isActive ? "active" : "inactive"}`}
                >
                  {user.isActive ? "Active" : "Banned"}
                </span>
              </td>
              <td
                className="cell-date"
                title={`Updated: ${formatDate(user.updatedAt)}`}
              >
                {formatDate(user.createdAt)}
              </td>
              <td className="cell-date">{formatDate(user.activatedAt)}</td>
              <td className="text-right">
                <div className="action-group">
                  <button className="btn-icon" title="Edit">
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => onDelete(user.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
