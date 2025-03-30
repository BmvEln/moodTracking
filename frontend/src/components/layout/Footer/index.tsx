import "./style.less";
import { LINK_HOME } from "../../../static/static.tsx";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="Footer">
      <div className="FooterContent">
        <Link to={LINK_HOME}>MOOD</Link>
      </div>
    </div>
  );
}

export default Footer;
