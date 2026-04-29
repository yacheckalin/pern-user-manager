const Button = ({
  callback,
  disabled,
  title,
  className,
  icon,
  text,
  type,
  ...props
}) => (
  <button
    className={className}
    title={title}
    disabled={disabled}
    onClick={callback}
    type={type || "button"}
    {...props}
  >
    {icon}
    {text}
  </button>
);

export default Button;
