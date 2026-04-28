import { Trash2 } from "lucide-react";

const DeleteUserButton = ({ onCallback }) => (
  <button className="btn-icon btn-danger" onClick={onCallback} title="Delete">
    <Trash2 size={18} />
  </button>
);
export default DeleteUserButton;
