import "./UserTable.css";
import { formatDate } from "../utils/user.helpers"; // Обычный CSS или CSS Modules
import { Spinner } from "@shared/Spinner";

export const UserTable = ({
  users = [],
  isLoading,
  onDelete,
  total,
  onEdit,
  highlightedId,
}) => {
  if (isLoading) return <Spinner size="lg" lable="Loading Users ..." />;
  if (!users.length)
    return <div className="status-message">Users list is empty!</div>;

  return (
    <div className="table-wrapper">
      <div>TOTAL: {total}</div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Age</th>
            <th>Status</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Activated</th>
            <th>Login</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className={`
              ${!user.isActive ? "row-disabled" : ""}
              ${highlightedId === user.id ? "row-highlight" : ""}
            `.trim()}
            >
              <td className="cell-id">#{user.id}</td>
              <td className="cell-username">{user.username}</td>
              <td>{user.email}</td>
              <td>{user.age || "—"}</td>
              <td>
                <span
                  className={`status-pill ${user.isActive ? "active" : "inactive"}`}
                >
                  {user.isActive ? "Active" : "Not Active"}
                </span>
              </td>
              <td
                className="cell-date"
                title={`Updated: ${formatDate(user.updatedAt)}`}
              >
                {formatDate(user.createdAt)}
              </td>
              <td
                className="cell-date"
                title={`Updated: ${formatDate(user.updatedAt)}`}
              >
                {formatDate(user.updatedAt)}
              </td>
              <td className="cell-date">{formatDate(user.activatedAt)}</td>
              <td className="cell-date">{formatDate(user.lastLogin)}</td>
              <td className="text-right">
                <div className="action-group">
                  <button
                    className="btn-icon"
                    title="Edit"
                    onClick={() => onEdit({ ...user, id: user.id })}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => onDelete(user)}
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
