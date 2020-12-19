import { useEffect, useState } from "react";
import { firebaseAuth, firestore } from "src/firebase";

const App = () => {
  const [data, setData] = useState<object[]>([]);

  useEffect(() => {
    firebaseAuth.signInAnonymously().then((result) => {
      console.log("sign in result", { result });
    });
  }, []);

  const retrieve = () => {
    firestore
      .collection("testing")
      .get()
      .then((querySnapshot) => {
        const list = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setData(list);
      })
      .catch((err) => console.error({ err }));
  };

  return (
    <div>
      <button onClick={retrieve}>Retrieve</button>
      <div>
        {data.map((item,index) => (
          <div key={index}>{JSON.stringify(item)}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
