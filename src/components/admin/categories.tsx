import { useContext, useEffect, useState } from "react";
import { LayoutContext } from "src/context";
import { useAsync } from "src/hooks";
import { Category } from "src/model/article";

import * as api from "src/api/article";

interface Iprops {
  item: Category;
  index: number;
  retrieve: () => void;
}

const Item = ({ item, index, retrieve }: Iprops) => {
  const [englishValue, setEnglishValue] = useState(item.label.en);
  const [frenchValue, setFrenchValue] = useState(item.label.fr);

  const [updateData, updating, error] = useAsync(api.updateCategory);

  useEffect(() => {
    setEnglishValue(item.label.en);
    setFrenchValue(item.label.fr);
  }, [item]);
  return (
    <div style={{ margin: 10 }}>
      <span style={{ margin: 5 }}>{index} ) </span>

      <label>{item.id}</label>
      <label>English : </label>
      <input
        value={englishValue}
        onChange={(e) => setEnglishValue(e.target.value)}
      />

      <label>French :</label>
      <input
        value={frenchValue}
        onChange={(e) => setFrenchValue(e.target.value)}
      />

      {updating ? (
        "updating ..."
      ) : (
        <button
          onClick={() =>
            updateData({
              ...item,
              label: { en: englishValue, fr: frenchValue },
            }).then(retrieve)
          }
        >
          Update
        </button>
      )}
      {error && <div>{error.message}</div>}
    </div>
  );
};

const Categories = () => {
  const [data, setData] = useState<Category[]>([]);

  const [newCategoryId, setNewCategoryId] = useState("");
  const [newCategoryEnText, setNewCategoryEnText] = useState("");
  const [newCategoryFrText, setNewCategoryFrText] = useState("");

  const { isMobile } = useContext(LayoutContext);

  const [getAllItems, loading, getError] = useAsync<void, Category[]>(
    api.getCategories
  );

  const [addNewItem, adding, addError] = useAsync(api.addCategory);

  const retrieve = () => {
    getAllItems().then(setData);
  };

  return (
    <div>
      {isMobile ? "Mobile" : "PC"}
      <div>
        <button onClick={retrieve}>Retrieve</button>
        <div>
          <legend>Add Category</legend>
          <label>Id:</label>
          <input
            value={newCategoryId}
            onChange={(e) => setNewCategoryId(e.target.value)}
          />
          <label>English Label : </label>
          <input
            value={newCategoryEnText}
            onChange={(e) => setNewCategoryEnText(e.target.value)}
          />
          <label> French Label : </label>
          <input
            value={newCategoryFrText}
            onChange={(e) => setNewCategoryFrText(e.target.value)}
          />
          {adding ? (
            "adding"
          ) : (
            <button
              onClick={() => {
                newCategoryId &&
                  addNewItem({
                    id: newCategoryId,
                    label: { en: newCategoryEnText, fr: newCategoryFrText },
                  }).then(() => retrieve());
                setNewCategoryId("");
                setNewCategoryEnText("");
                setNewCategoryFrText("");
              }}
            >
              Add
            </button>
          )}

          <span>
            you can not add without login, i didn't hide this button
            automatically because it shows that backend is also secured
          </span>
          {addError && <div>{addError.message}</div>}
        </div>
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

export default Categories;
