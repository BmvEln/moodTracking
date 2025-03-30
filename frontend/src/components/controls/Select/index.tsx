import { useCallback, useEffect, useRef, useState } from "react";

import "./style.less";

type SelectProps = {
  variants: { id: number; name: string }[];
  onChange?: (value: number | undefined) => void;
  width: number;
};

function Select({
  variants = [{ id: 1, name: "" }],
  onChange,
  width,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false),
    [idxItem, setIdxItem] = useState<number | undefined>(undefined),
    selectRef = useRef(null),
    handleClickOutside = useCallback((e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }, []),
    handleClickPoint = useCallback(
      (i: number, id: number, isNotSelected: boolean) => {
        setIdxItem(isNotSelected ? undefined : i);
        setIsOpen(false);

        if (onChange) {
          onChange(isNotSelected ? undefined : id);
        }
      },
      [onChange],
    );

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, [handleClickOutside]);

  return (
    <div className="Select" ref={selectRef} style={{ width }}>
      <div className="Select__header" onClick={() => setIsOpen(!isOpen)}>
        {typeof idxItem === "number" ? (
          variants[idxItem].name
        ) : (
          <span className="Select__notDefined">Не выбрано</span>
        )}
      </div>
      <div
        className="Select__popUp"
        style={{
          opacity: isOpen ? 1 : 0,
          width,
          maxHeight: isOpen ? "250px" : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {variants.map(({ id, name }, i) => {
          const pointerEvents = isOpen ? "auto" : "none";
          const pointLayout = (
            <div
              key={id}
              className="Select__point"
              style={{ pointerEvents }}
              onClick={() => handleClickPoint(i, id, false)}
            >
              <div>{name}</div>
            </div>
          );

          return !i ? (
            <>
              <div
                key={`${id}-notSelected`}
                className="Select__point"
                style={{ pointerEvents }}
                onClick={() => handleClickPoint(i, id, true)}
              >
                <div>Не выбрано</div>
              </div>
              {pointLayout}
            </>
          ) : (
            pointLayout
          );
        })}
      </div>
    </div>
  );
}

export default Select;
