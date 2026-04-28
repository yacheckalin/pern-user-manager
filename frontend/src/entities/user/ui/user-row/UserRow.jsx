import { formatDate } from "@features/users/utils/user.helpers";
import {
  UserMinus,
  UserCheck,
  KeyRound,
  RefreshCw,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react";
import UserAvatar from "../user-avatar";
import DeleteUserButton from "../../../../features/user-delete/ui";

const UserRow = ({
  highlightedId,
  onActivate,
  onChangePassword,
  onDelete,
  onEdit,
  onLogout,
  ...user
}) => (
  <tr
    key={user.id}
    className={`
              ${!user.isActive ? "row-disabled" : ""}
              ${highlightedId === user.id ? "row-highlight" : ""}
            `.trim()}
  >
    <td className="cell-id">#{user.id}</td>
    <td className="cell-date">
      <UserAvatar {...user} />
    </td>
    <td className="cell-username">{user.username}</td>
    <td>{user.email}</td>
    <td>{user.age || "—"}</td>
    <td>
      <span className={`status-pill ${user.isActive ? "active" : "inactive"}`}>
        {user.isActive ? "Active" : "Not Active"}
      </span>
    </td>
    <td className="cell-date" title={`Updated: ${formatDate(user.updatedAt)}`}>
      {formatDate(user.createdAt)}
    </td>
    <td className="cell-date" title={`Updated: ${formatDate(user.updatedAt)}`}>
      {formatDate(user.updatedAt)}
    </td>
    <td className="cell-date">{formatDate(user.activatedAt)}</td>
    <td className="cell-date">{formatDate(user.lastLogin)}</td>

    <td className="text-right">
      <div className="action-group">
        <button
          className="btn-icon text-success"
          title="Change Password"
          onClick={() => onChangePassword({ id: user.id })}
        >
          <KeyRound size={18} />
        </button>

        <button
          className={`btn-icon ${user.isActive ? "text-danger" : "text-success"}`}
          title={user.isActive ? "Already Activated" : "Activate User"}
          onClick={() => onActivate(user)}
          disabled={!!user.isActive}
        >
          {user.isActive ? <UserMinus size={18} /> : <UserCheck size={18} />}
        </button>

        <button className="btn-icon text-success" title="Refresh Token">
          <RefreshCw size={18} />
        </button>
        <button
          className="btn-icon"
          onClick={() => onEdit({ ...user, id: user.id })}
          title="Edit User"
        >
          <Pencil size={18} />
        </button>
        <button
          className="btn-icon btn-danger"
          title="Revoke Session"
          disabled={!user.hasActiveSession}
          onClick={() => onLogout(user)}
        >
          <LogOut size={18} disabled />
        </button>
        <DeleteUserButton onCallback={() => onDelete(user)} />
      </div>
    </td>
  </tr>
);

export default UserRow;
