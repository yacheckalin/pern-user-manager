import { formatDate } from "@features/users/utils/user.helpers";
import {
  UserMinus,
  UserCheck,
  KeyRound,
  LogOut,
  Pencil,
  Trash2,
} from "lucide-react";
import UserAvatar from "../user-avatar";
import DeleteUserButton from "@features/user-delete";
import UserActivateButton from "@features/user-activate";
import LogoutUserButton from "@features/user-logout/";
import EditUserButton from "@features/user-edit";
import UserChangePasswordButton from "@features/user-change-password";

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
        <UserChangePasswordButton
          icon={<KeyRound size={18} />}
          onCallback={() => onChangePassword({ id: user.id })}
        />
        <UserActivateButton
          {...user}
          onCallback={() => onActivate(user)}
          icons={{
            on: <UserMinus size={18} />,
            off: <UserCheck size={18} />,
          }}
        />
        <EditUserButton
          onCallback={() => onEdit({ ...user, id: user.id })}
          icon={<Pencil size={18} />}
        />
        <LogoutUserButton
          onCallback={() => onLogout(user)}
          icon={<LogOut size={18} disabled />}
          {...user}
        />
        <DeleteUserButton
          {...user}
          onCallback={() => onDelete(user)}
          icon={<Trash2 size={18} />}
        />
      </div>
    </td>
  </tr>
);

export default UserRow;
