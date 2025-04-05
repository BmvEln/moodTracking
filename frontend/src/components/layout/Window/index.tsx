import React from "react";
import classNames from "classnames";

import "./style.less";

import Button from "../../controls/Button";

type Props = {
  id?: string;
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  hideClose?: boolean;
  theme?: string;
  confirm?: string | React.ReactNode;
  noQuestion?: boolean;
  confirmYes?: string;
  confirmNo?: string;
  onClickYes?: () => void;
  isUnderstand?: boolean;
  width?: number;
  height?: number;
  btnYesLoading?: boolean;
};

function Window({
  id,
  open,
  onClose,
  children,
  hideClose = false,
  confirm,
  noQuestion = false,
  confirmYes = "Да",
  confirmNo = "Нет",
  isUnderstand = false,
  onClickYes,
  theme,
  width,
  height,
  btnYesLoading,
}: Props) {
  return (
    <div
      id={id}
      className={classNames("Window", theme, {
        active: open,
        confirm: confirm,
      })}
      onClick={onClose}
    >
      <div
        className={classNames("Window__content", { active: open })}
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideClose ? (
          <div className="Window__close" onClick={onClose} />
        ) : null}

        {!confirm ? null : (
          <>
            {noQuestion ? null : (
              <div className="Window__question">{confirm}</div>
            )}

            {isUnderstand ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Button onClick={onClose} size="big">
                  Понятно
                </Button>
              </div>
            ) : (
              <div className="Window__btns">
                <Button onClick={onClose} width={60} size="big" theme="green">
                  {confirmNo}
                </Button>
                <Button
                  className={btnYesLoading ? "animLoading" : undefined}
                  onClick={onClickYes}
                  width={60}
                  size="big"
                  theme="pink"
                >
                  {confirmYes}
                </Button>
              </div>
            )}
          </>
        )}

        {children}
      </div>
    </div>
  );
}

export default Window;
