import Table from "@shared/ui/table";
import { USER_COLUMNS } from "@entities/user/model/user-columns";
import UserRow from "../user-row";
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
