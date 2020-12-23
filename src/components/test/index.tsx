import { useContext, useEffect, useState } from "react";
import { AuthContext, LayoutContext } from "src/context";
import { firestore } from "src/firebase";
import { useAsync } from "src/hooks";

interface ItemType {
  id?: string;
  test: string;
}

interface Iprops {
  item: ItemType;
  editor: boolean;
  index: number;
  retrieve: () => void;
}

const updateValue = (item: ItemType) => {
  return firestore.collection("testing").doc(item.id).set({ test: item.test });
};

const deleteValue = (item: ItemType) => {
  return firestore.collection("testing").doc(item.id).delete();
};

const Item = ({ item, editor, index, retrieve }: Iprops) => {
  const [value, setValue] = useState<string>(item.test);

  const [updateData, updating, error] = useAsync(updateValue);
  const [deleteData, deleting, deleteError] = useAsync(deleteValue);

  useEffect(() => {
    setValue(item.test);
  }, [item]);
  return (
    <div style={{ margin: 10 }}>
      <span style={{ margin: 5 }}>{index} ) </span>
      {editor ? (
        <input value={value} onChange={(e) => setValue(e.target.value)} />
      ) : (
        value
      )}
      {updating || deleting
        ? deleting
          ? "deleting ..."
          : "updating ..."
        : editor && (
            <>
              <button
                onClick={() =>
                  updateData({ ...item, test: value }).then(retrieve)
                }
              >
                Update
              </button>
              <button onClick={() => deleteData(item).then(retrieve)}>
                Delete
              </button>
              <span> You can only edit if you are logged in</span>
            </>
          )}
      {error && <div>{error.message}</div>}
      {deleteError && <div>{deleteError.message}</div>}
    </div>
  );
};

const getItems = () => {
  return firestore
    .collection("testing")
    .get()
    .then((querySnapshot) => {
      const list: ItemType[] = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as ItemType;
      });
      return list;
    });
};

const getCategories = () => {
  return firestore
    .collection("categories")
    .get()
    .then((querySnapshot) => {
      const list = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as ItemType;
      });
      console.log({ categories: list });
      return list;
    });
};

const addItem = (item: ItemType) => {
  return firestore.collection("testing").add(item);
};

const Test = () => {
  const [data, setData] = useState<ItemType[]>([]);

  const [newItemText, setNewItemText] = useState<string>("");

  const { roles, user } = useContext(AuthContext);

  const { isMobile } = useContext(LayoutContext);

  const [getAllItems, loading, getError] = useAsync<void, ItemType[]>(getItems);

  const [addNewItem, adding, addError] = useAsync(addItem);

  const retrieve = () => {
    getAllItems().then(setData);
  };

  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div>
      {isMobile ? "Mobile" : "PC"}
      <div>
        <button onClick={retrieve}>Retrieve</button>
        <input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
        />
        {adding ? (
          "adding"
        ) : (
          <button
            onClick={() => {
              newItemText &&
                addNewItem({ test: newItemText }).then(() => retrieve());
              setNewItemText("");
            }}
          >
            Add
          </button>
        )}
        <span>
          you can not add without login, i didn't hide this button automatically
          because it shows that backend is also secured
        </span>
        {addError && <div>{addError.message}</div>}
      </div>
      <div style={{ margin: 20 }}>
        {user ? `${user.email} is logged in` : "please login to edit"}
      </div>
      <div>
        {loading ? (
          "Loading..."
        ) : (
          <div>
            {data.length
              ? data.map((item, index) => (
                  <Item
                    key={index}
                    index={index}
                    item={item}
                    editor={roles.editor}
                    retrieve={retrieve}
                  />
                ))
              : "RetrieveData"}
          </div>
        )}
      </div>

      {getError && <div>{getError.message}</div>}
    </div>
  );
};

export default Test;
