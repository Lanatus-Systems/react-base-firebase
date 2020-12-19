import { useEffect, useState } from "react";
import { firestore } from "src/firebase";

interface ItemType {
  id: string;
  test: string;
}

interface Iprops {
  item: ItemType;
}
const Item = ({ item }: Iprops) => {
  const [value, setValue] = useState<string>(item.test);
  const updateValue = (docId: string, value: string) => {
    firestore.collection("testing").doc(docId).set({ test: value });
  };
  return (
    <div style={{ margin: 10 }}>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => updateValue(item.id, value)}>Update</button>
    </div>
  );
};
const Test = () => {
  const [data, setData] = useState<ItemType[]>([]);

  useEffect(() => {}, []);

  const retrieve = () => {
    firestore
      .collection("testing")
      .get()
      .then((querySnapshot) => {
        const list: ItemType[] = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() } as ItemType;
        });
        setData(list);
      })
      .catch((err) => console.error({ err }));
  };

  return (
    <div>
      <button onClick={retrieve}>Retrieve</button>
      <div>
        {data.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Test;
