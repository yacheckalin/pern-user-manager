const UserStats = ({ total, online, active, notActive, founded }) => (
  <div className="panel-info">
    <span className="text-muted">Total</span>
    <span className="count-badge">{total}</span>
    <span className="text-muted">Founded: </span>
    <span className="count-badge">{founded}</span>

    <div className="mini-stats">
      <span className="dot dot-success"></span> {online} Online
    </div>
    <div className="mini-stats active">
      <span className="dot dot-active"></span>
      {active} Active
    </div>
    <div className="mini-stats not-active">
      <span className="dot dot-not-active"></span>
      {notActive} Not Active Yet
    </div>
  </div>
);

export default UserStats;
