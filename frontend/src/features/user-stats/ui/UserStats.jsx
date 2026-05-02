import { useUsersStats } from "../hooks/useUsersStats";
import Spinner from "@shared/ui/spinner";

const UserStats = ({ total, online, active, notActive, founded }) => {
  const { data, isLoading, error, isError } = useUsersStats();

  return (
    <div className="panel-info">
      {isLoading && <Spinner />}
      <span className="text-muted">Total</span>
      <span className="count-badge">{total}</span>
      <span className="text-muted">Founded: </span>
      <span className="count-badge">{founded}</span>

      <div className="mini-stats">
        <span className="dot dot-success"></span> {data?.logged_in} Online
      </div>
      <div className="mini-stats active">
        <span className="dot dot-active"></span>
        {data?.activated} Active
      </div>
      <div className="mini-stats not-active">
        <span className="dot dot-not-active"></span>
        {data?.not_activated} Not Active Yet
      </div>
    </div>
  );
};

export default UserStats;
