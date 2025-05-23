import { db } from "./firebase.ts";
import { NotePT } from "../static/types.tsx";

import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { arrayRemove } from "@firebase/firestore";

export const createNoteFb = async (
  userId: string,
  newItem: NotePT,
): Promise<NotePT | null> => {
  if (!userId) {
    console.warn("Отсутствует id пользователя");
    return null;
  }

  // Ссылка на документ пользователя
  const userRef = doc(db, "users", userId),
    // Получаем текущий документ пользователя
    userDoc = await getDoc(userRef);

  try {
    if (userDoc.exists()) {
      // Если документ существует, обновляем массив
      await updateDoc(userRef, {
        items: arrayUnion(newItem),
      });
    } else {
      // Если документ не существует, создаем его с массивом
      await setDoc(userRef, {
        items: [newItem],
      });
    }

    return newItem;
  } catch (err) {
    console.error("Ошибка при создании записи:", err);
    return null;
  }
};

export const deleteNoteFb = async (
  userId: string,
  itemId: string,
): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId),
      userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Извлекаем массив items из документа
      const items = userDoc.data()?.items || [];
      const item = items.find((item: NotePT) => item.noteId === itemId);

      if (item) {
        // Удаляем элемент из массива
        await updateDoc(userRef, {
          items: arrayRemove(item),
        });
        console.log("Запись успешно удалена!");
        return true;
      } else {
        console.error("Запись с указанным ID не найдена.");
        return false;
      }
    } else {
      console.error("Документ пользователя не существует.");
      return false;
    }
  } catch (err) {
    console.error("Ошибка при удалении записи:", err);
    return false;
  }
};

export const updateNoteFb = async (
  userId: string,
  itemId: string,
  updatedData: object,
) => {
  try {
    const userRef = doc(db, "users", userId),
      userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const items = userDoc.data()?.items || [];
      const itemIdx = items.findIndex((item: NotePT) => item.noteId === itemId);

      if (itemIdx !== -1) {
        // Создаем новый массив с обновленным элементом
        const updatedItems = items.map((item: NotePT) =>
          item.noteId === itemId ? { ...item, ...updatedData } : item,
        );

        // Обновляем массив items в документе
        await updateDoc(userRef, {
          items: updatedItems,
        });

        console.log("Запись успешно изменена!");
        return updatedData;
      } else {
        console.error("Запись с указанным ID не найдена.");
        return null;
      }
    } else {
      console.error("Документ пользователя не существует.");
      return null;
    }
  } catch (err) {
    console.error("Ошибка при изменении записи:", err);
    return null;
  }
};
