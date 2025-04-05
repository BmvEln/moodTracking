import { FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./style.less";

import { auth } from "../../firebase/firebase.ts";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { EmailAuthProvider, linkWithCredential } from "firebase/auth";

import Page from "../../components/layout/Page";
import Input from "../../components/controls/Input";
import Button from "../../components/controls/Button";
import { LINK_HISTORY, LINK_HOME } from "../../static/static.tsx";

function Login({ method }: { method: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isSignUp = method === "singUp";

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>, email: string, password: string) => {
      e.preventDefault();

      try {
        if (isSignUp) {
          createUserWithEmailAndPassword(auth, email, password).then(() => {
            navigate(`${LINK_HOME}`);
          });
        } else {
          signInWithEmailAndPassword(auth, email, password).then(() => {
            navigate(`${LINK_HISTORY}`);
          });
        }
      } catch (err) {
        if (isSignUp) {
          console.log("Ошибка при регистрации", err);
        } else {
          console.log("Ошибка при входе", err);
        }
      }
    },
    [isSignUp, navigate],
  );

  const singInAnon = useCallback(
    (e: FormEvent<HTMLFormElement>, email: string, pass: string) => {
      e.preventDefault();

      if (auth?.currentUser) {
        linkWithCredential(
          auth?.currentUser,
          EmailAuthProvider.credential(email, pass),
        )
          .then((usercred) => {
            const user = usercred.user;
            console.log("Анонимная учетная запись успешно обновлена", user);
            navigate(`${LINK_HISTORY}`);
          })
          .catch((error) => {
            console.warn(
              "Ошибка при обновлении анонимной учетной записи",
              error,
            );
          });
      }
    },
    [navigate],
  );

  return (
    <Page className="Login">
      <form
        className="LoginForm"
        onSubmit={(e) => {
          e.preventDefault();

          if (auth?.currentUser?.isAnonymous) {
            singInAnon(e, email, password);
          } else {
            handleSubmit(e, email, password);
          }
        }}
      >
        <div className="LoginTitle">{isSignUp ? "Регистрация" : "Вход"}</div>

        <div className="LoginEmail">
          <div>Почта</div>
          <Input
            placeholder="your@email.com"
            value={email}
            onChange={(v) => setEmail(v)}
            type="email"
          />
        </div>
        <div className="LoginPassword">
          <div>Пароль</div>
          <Input
            placeholder="*****"
            value={password}
            onChange={(v) => setPassword(v)}
            type="password"
          />
        </div>

        <div>
          <Button>{isSignUp ? "Регистрация" : "Вход"}</Button>
        </div>
      </form>
    </Page>
  );
}

export default Login;
