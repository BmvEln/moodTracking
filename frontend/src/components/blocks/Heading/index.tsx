import { ReactNode } from "react";
import "./style.less";

function Heading({ children }: { children: ReactNode }) {
  return <h1 className="Heading">{children}</h1>;
}

export default Heading;
