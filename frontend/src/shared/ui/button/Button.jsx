const Button = ({ callback, disabled, title, className, icon, text }) => (
  <button
    className={className}
    title={title}
    disabled={disabled}
    onClick={callback}
  >
    {icon}
    {text}
  </button>
);

export default Button;
