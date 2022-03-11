import { h, FunctionComponent } from 'preact';

import { ButtonType } from 'types';

const Button: FunctionComponent<ButtonType> = ({ text, ...rest }) => <button {...rest}>{text}</button>;

export default Button;
