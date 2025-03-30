import React, { useRef } from "react";
import classNames from "classnames";

import "./style.less";

type Props = {
  value: string;
  onChange: (e: string) => void;
  placeholder?: string;
  type?: string;
  width?: number;
  style?: object;
  className?: string;
};

function Input({
  placeholder,
  type,
  value,
  onChange,
  width,
  style,
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className={classNames("Input", className)}>
      <input
        style={{
          width,
          ...style,
        }}
        ref={inputRef}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        disabled={false}
      />
    </div>
  );
}

export default Input;
