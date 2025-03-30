import { ReactNode } from "react";
import classnames from "classnames";

import "./style.less";

import Footer from "../Footer";

type PageProps = {
  children: ReactNode;
  className?: string;
};

function Page({ children, className }: PageProps) {
  return (
    <div className={classnames("Page", className)}>
      <div className="PageContent">{children}</div>

      <Footer />
    </div>
  );
}

export default Page;
