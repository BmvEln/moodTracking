import { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store.tsx";

import "./style.less";

import { auth } from "../../firebase/firebase.ts";
import { LINK_HISTORY } from "../../static/static.tsx";

import { signOut } from "firebase/auth";
import { setUser } from "../../redux/slices/userSlice.tsx";

import Button from "../../components/controls/Button";
import Page from "../../components/layout/Page";

function Profile() {
  const dispatch = useAppDispatch(),
    navigate = useNavigate(),
    userSingOut = useCallback(() => {
      signOut(auth)
        .then(() => {
          dispatch(
            setUser({
              id: null,
              email: null,
              token: null,
            }),
          );

          navigate("/");
        })
        .catch((err) => {
          console.error("Ошибка при выходе из аккаунта", err);
        });
    }, [dispatch, navigate]);

  return (
    <Page className="Profile">
      <div className="ProfilePanel">
        <div className="ProfileTitle">Профиль</div>

        <div className="ProfileSeparator" />

        <div className="ProfileSubtitle">Регистрационная информация</div>

        <div className="ProfileLoginInfo">
          {!auth?.currentUser ? (
            <div>Анонимный пользователь</div>
          ) : (
            ["Почта", "Пароль"].map((text, i) => {
              const isEmail = !i;

              return (
                <div key={text}>
                  <div>{text}</div>
                  <div>
                    <div>{isEmail ? auth?.currentUser?.email : "******"}</div>
                    <Button
                      onClick={
                        isEmail
                          ? () => alert("Функционал в разработке ฅ^•ﻌ•^ฅ")
                          : () => alert("Функционал в разработке ฅ^•ﻌ•^ฅ")
                      }
                    >
                      Изменить
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!auth?.currentUser ? null : (
          <>
            <div className="ProfileSeparator" />

            <div className="ProfileCreationTime">
              <div>Дата создания личного кабинета:</div>
              <div>{auth?.currentUser?.metadata.creationTime}</div>
            </div>

            <div className="ProfileSeparator" />

            <Button onClick={userSingOut}>Выйти из кабинета</Button>
          </>
        )}
      </div>

      <Link to={LINK_HISTORY}>
        <Button style={{ position: "absolute", top: "24px", left: "60px" }}>
          ← К настроениям
        </Button>
      </Link>
    </Page>
  );
}

export default Profile;
