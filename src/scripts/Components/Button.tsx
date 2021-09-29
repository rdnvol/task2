import { h, FunctionComponent } from "preact";

import { ButtonType } from "../types";

const Button: FunctionComponent<ButtonType> = ({
  type,
  text,
  className,
  name,
  other,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
      name={name}
      {...other}
    >
      {text}
    </button>
  );
};

export default Button;
