import { Link } from "react-router-dom";
import { RootState, useAppSelector } from "../../../redux/store.tsx";

import "./style.less";

import {
  LINK_ADD_NOTE,
  LINK_HISTORY,
  LINK_HOME,
  LINK_PROFILE,
  LINK_SING_IN,
  LINK_SING_UP,
} from "../../../static/static.tsx";

import Theme from "../../controls/Theme";

function Header() {
  const { email } = useAppSelector((state: RootState) => state.user);

  return (
    <div className="Header">
      <div className="HeaderContent">
        <div className="HeaderLogo">
          <Link to={LINK_HOME}>MOOD</Link>
        </div>

        <div className="HeaderLinks">
          <Theme />
          <Link to={LINK_HOME}>Главная</Link>
          <Link to={LINK_ADD_NOTE}>Запись</Link>
          <Link to={LINK_HISTORY}>История</Link>

          {email ? (
            <Link to={LINK_PROFILE}>
              <div className="HeaderProfile">{email.slice(0, 1)}</div>
            </Link>
          ) : (
            <>
              <Link to={LINK_SING_IN}>Вход</Link>
              <Link to={LINK_SING_UP}>Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
