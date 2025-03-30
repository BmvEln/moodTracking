import { Link } from "react-router-dom";

import "./style.less";

import {
  LINK_ADD_NOTE,
  LINK_HISTORY,
  LINK_HOME,
  LINK_PROFILE,
  LINK_SING_IN,
} from "../../../static/static.tsx";

import Theme from "../../controls/Theme";

function Header() {
  return (
    <div className="Header">
      <div className="HeaderContent">
        <div className="HeaderLogo">
          <Link to={LINK_HOME}>MOOD</Link>
        </div>

        <div className="HeaderLinks">
          <Theme />
          <Link to=".">Home</Link>
          <Link to={LINK_ADD_NOTE}>AddNote</Link>
          <Link to={LINK_HISTORY}>History</Link>
          <Link to={LINK_SING_IN}>Login</Link>
          <Link to={LINK_PROFILE}>Profile</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
