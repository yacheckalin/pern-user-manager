import Table from "@shared/ui/table";
import { USER_COLUMNS } from "@entities/user/model/user-columns";
import UserRow from "../user-row";
import UserInfoPanel from "@entities/user/ui/user-info-panel";
import { onlineUsers, notActive, activeUsers } from "@features/users";
import "./UserTable.css";

const UserTable = ({
  data,
  highlightedId,
  onCreate,
  onEdit,
  onDelete,
  onActivate,
  onLogout,
  onChangePassword,
}) => {
  return (
    <div className="table-wrapper">
      <UserInfoPanel
        total={data?.length}
        online={data?.length && onlineUsers(data)}
        onCreate={onCreate}
        notActive={data?.length && notActive(data)}
        active={data?.length && activeUsers(data)}
      />
      <Table
        columns={USER_COLUMNS}
        data={data}
        renderRow={(user) => (
          <UserRow
            {...user}
            key={user.id}
            onCreate={onCreate}
            onDelete={onDelete}
            onEdit={onEdit}
            onActivate={onActivate}
            onLogout={onLogout}
            highlightedId={highlightedId}
            onChangePassword={onChangePassword}
          />
        )}
      />
    </div>
  );
};

export default UserTable;
