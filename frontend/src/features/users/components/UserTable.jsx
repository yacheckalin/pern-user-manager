import "./UserTable.css";
import { formatDate } from "../utils/user.helpers"; // Обычный CSS или CSS Modules
import { Spinner } from "@shared/Spinner";
import {
  Trash2,
  KeyRound,
  UserCheck,
  UserMinus,
  RefreshCw,
  LogOut,
  Pencil,
} from "lucide-react";

export const UserTable = ({
  users = [],
  isLoading,
  onDelete,
  total,
  onEdit,
  highlightedId,
  onActivate,
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
                  {/* Change Password */}
                  <button
                    className="btn-icon text-success"
                    title="Change Password"
                  >
                    <KeyRound size={18} />
                  </button>

                  {/* Activate / Deactivate */}
                  <button
                    className={`btn-icon ${user.isActive ? "text-danger" : "text-success"}`}
                    title={
                      user.isActive ? "Already Activated" : "Activate User"
                    }
                    onClick={() => onActivate({ id: user.id })}
                    disabled={!!user.isActive}
                  >
                    {user.isActive ? (
                      <UserMinus size={18} />
                    ) : (
                      <UserCheck size={18} />
                    )}
                  </button>

                  {/* Refresh Token */}
                  <button
                    className="btn-icon text-success"
                    title="Refresh Token"
                  >
                    <RefreshCw size={18} />
                  </button>

                  <button
                    className="btn-icon"
                    onClick={() => onEdit({ ...user, id: user.id })}
                    title="Edit User"
                  >
                    <Pencil size={18} />
                  </button>
                  {/* Revoke / Logout */}
                  <button
                    className="btn-icon btn-danger"
                    title="Revoke Session"
                  >
                    <LogOut size={18} />
                  </button>
                  <button
                    className="btn-icon btn-danger"
                    onClick={() => onDelete(user)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
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
