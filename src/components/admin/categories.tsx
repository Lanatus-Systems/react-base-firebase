import { useEffect, useState } from "react";
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
    <tr>
      <td>{item.id}</td>
      <td>
        <input
          value={englishValue}
          onChange={(e) => setEnglishValue(e.target.value)}
        />
      </td>

      <td>
        <input
          value={frenchValue}
          onChange={(e) => setFrenchValue(e.target.value)}
        />
      </td>

      <td>
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
      </td>
      <td>{error && <div>{error.message}</div>}</td>
    </tr>
  );
};

const Categories = () => {
  const [data, setData] = useState<Category[]>([]);

  const [newCategoryId, setNewCategoryId] = useState("");
  const [newCategoryEnText, setNewCategoryEnText] = useState("");
  const [newCategoryFrText, setNewCategoryFrText] = useState("");

  const [getAllItems, loading, getError] = useAsync<void, Category[]>(
    api.getCategories
  );

  const [addNewItem, adding, addError] = useAsync(api.addCategory);

  const retrieve = () => {
    getAllItems().then(setData);
  };

  return (
    <div>
      <div>
        <h1>Categories</h1>
      </div>
      <div>
        <button onClick={retrieve}>Retrieve</button>
        <div style={{ padding: 10, border: "1px dashed lightgrey" }}>
          <legend>Add Category</legend>
          <table>
            <tr>
              <th>Id</th>
              <th>English Label</th>
              <th>French Label</th>
            </tr>
            <tr>
              <td>
                <input
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value)}
                />
              </td>
              <td>
                <input
                  value={newCategoryEnText}
                  onChange={(e) => setNewCategoryEnText(e.target.value)}
                />
              </td>
              <td>
                <input
                  value={newCategoryFrText}
                  onChange={(e) => setNewCategoryFrText(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td style={{ textAlign: "center" }}>
                {adding ? (
                  "adding"
                ) : (
                  <button
                    onClick={() => {
                      newCategoryId &&
                        addNewItem({
                          id: newCategoryId,
                          label: {
                            en: newCategoryEnText,
                            fr: newCategoryFrText,
                          },
                        }).then(() => retrieve());
                      setNewCategoryId("");
                      setNewCategoryEnText("");
                      setNewCategoryFrText("");
                    }}
                  >
                    Add
                  </button>
                )}
              </td>
            </tr>
            {addError && <div>{addError.message}</div>}
          </table>
        </div>
      </div>

      <div>
        <table>
          <tr>
            <th>Id</th>
            <th>English Label</th>
            <th>French Label</th>
          </tr>

          {loading ? (
            "Loading..."
          ) : (
            <>
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
            </>
          )}
        </table>
      </div>

      {getError && <div>{getError.message}</div>}
    </div>
  );
};

export default Categories;
