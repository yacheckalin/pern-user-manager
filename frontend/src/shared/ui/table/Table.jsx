const Table = ({ columns, renderRow, data }) => (
  <table className="custom-table">
    <thead>
      <tr>
        {columns.map(({ key }) => (
          <th>{key}</th>
        ))}

        {/* <th>ID</th>
        <th>Avatar</th>
        <th>Username</th>
        <th>Email</th>
        <th>Age</th>
        <th>Status</th>
        <th>Created</th>
        <th>Updated</th>
        <th>Activated</th>
        <th>Login</th>
        <th className="text-right">Actions</th> */}
      </tr>
    </thead>
    <tbody>{data && data.map((item, index) => renderRow(item, index))}</tbody>
  </table>
);

export default Table;
