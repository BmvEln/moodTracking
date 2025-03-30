import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppDispatch } from "../../../redux/store.tsx";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import "./App.less";
import "../../../firebase/firebase.ts";

import {
  LINK_ADD_NOTE,
  LINK_HISTORY,
  LINK_PROFILE,
  LINK_SING_IN,
  LINK_SING_UP,
} from "../../../static/static.tsx";
import { auth, db } from "../../../firebase/firebase.ts";

import { setUser } from "../../../redux/slices/userSlice.tsx";
import { setNotes } from "../../../redux/slices/notesSlice.tsx";
import { doc, getDoc } from "firebase/firestore";

import MainLayout from "../MainLayout";
import Home from "../../../pages/Home";
import NoteFound from "../../../pages/NoteFound";
import AddNote from "../../../pages/AddNote";
import History from "../../../pages/History";
import Login from "../../../pages/Login";
import Profile from "../../../pages/Profile";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async (userId: string) => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        dispatch(setNotes(userDoc.data().items));
      } else {
        console.log("Пользователь не создавал записи");
        return null;
      }
    };

    const listener = onAuthStateChanged(auth, (user) => {
      setLoading(true);

      if (user) {
        dispatch(
          setUser({
            userId: user.uid,
            email: user.email,
            token: user.refreshToken,
          }),
        );

        getUserData(user.uid);
      } else {
        dispatch(
          setUser({
            userId: null,
            email: null,
            token: null,
          }),
        );
      }

      setLoading(false);

      return () => listener();
    });
  }, [dispatch]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={LINK_ADD_NOTE} element={<AddNote />} />
          <Route path={LINK_HISTORY} element={<History />} />
          <Route path={LINK_PROFILE} element={<Profile />} />

          <Route path={LINK_SING_IN} element={<Login method="singIn" />} />
          <Route path={LINK_SING_UP} element={<Login method="singUp" />} />

          <Route path="*" element={<NoteFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
