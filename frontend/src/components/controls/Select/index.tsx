import { useCallback, useEffect, useRef, useState } from "react";

import "./style.less";

type SelectProps = {
  variants: { id: number; name: string }[];
  onChange?: (value: number | undefined) => void;
  width: number;
  curIdx?: number | undefined;
  withoutNoSelected?: boolean;
};

function Select({
  variants = [{ id: 1, name: "" }],
  onChange,
  width,
  curIdx = undefined,
  withoutNoSelected = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false),
    [idxItem, setIdxItem] = useState<number | undefined>(curIdx),
    selectRef = useRef(null),
    handleClickOutside = useCallback((e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }, []),
    handleClickPoint = useCallback(
      (i: number, id: number, isNoSelected: boolean) => {
        setIdxItem(isNoSelected ? undefined : i);
        setIsOpen(false);

        if (onChange) {
          onChange(isNoSelected ? undefined : id);
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
              {withoutNoSelected ? null : (
                <div
                  key={`${id}-noSelected`}
                  className="Select__point"
                  style={{ pointerEvents }}
                  onClick={() => handleClickPoint(i, id, true)}
                >
                  <div>Не выбрано</div>
                </div>
              )}
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
