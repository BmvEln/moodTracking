import React from "react";
import classNames from "classnames";

import "./style.less";

type Props = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  width?: number | "fit-content";
  theme?: string;
  size?: "md" | "big";
  style?: object;
  className?: string;
  selected?: boolean;
  disabled?: boolean;
  title?: string;
};

function Button({
  onClick = () => {},
  children,
  width,
  theme = "default",
  size = "md",
  style,
  className,
  selected,
  disabled,
  title,
}: Props) {
  return (
    <button
      title={title}
      className={classNames("Button", theme, className, size, {
        selected,
        disabled,
      })}
      style={{ width, ...style }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
