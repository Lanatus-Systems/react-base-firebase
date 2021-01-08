import { useState } from "react";
import { useAsync } from "src/hooks";
import { Category } from "src/model/article";

import * as api from "src/api/article";
import { MultiLanguage } from "src/model/common";
import { ENGLISH, FRENCH } from "src/i18n/languages";

interface Iprops {
  item: Category;
  retrieve: () => void;
  allCategories: Category[];
}

const Item = ({ item, retrieve, allCategories }: Iprops) => {
  const [order, setOrder] = useState<string>(item.order + "" || "1");
  const [updateData, updating, error] = useAsync(api.updateCategory);
  const [removeData, removing, deleteError] = useAsync(api.removeCategory);

  const [labelState, setLabelState] = useState<MultiLanguage>(
    item.label || {
      [ENGLISH]: "",
      [FRENCH]: "",
    }
  );

  const [parentCategory, setParentCategory] = useState(item.parent || "");

  console.log({ parentCategory });
  const parentOptions = allCategories.filter((c) => c.id !== item.id);
  return (
    <>
      <div
        key={item.id}
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "5px 0px",
          height: 40,
        }}
      >
        <div style={{ width: 100 }}>{item.id}</div>
        <div style={{ width: 150 }}>
          <input
            style={{ width: 150 }}
            value={labelState[ENGLISH]}
            onChange={(e) =>
              setLabelState((val) => ({ ...val, [ENGLISH]: e.target.value }))
            }
          />
        </div>
        <div style={{ width: 150 }}>
          <input
            style={{ width: 150 }}
            value={labelState[FRENCH]}
            onChange={(e) =>
              setLabelState((val) => ({ ...val, [FRENCH]: e.target.value }))
            }
          />
        </div>
        <div style={{ width: 50 }}>
          <input
            style={{ width: 50 }}
            type="number"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </div>
        <div style={{ width: 100 }}>
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value={""}></option>
            {parentOptions.map((val) => (
              <option key={val.id} value={val.id}>
                {val.id}
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: 50 }}>
          {updating ? (
            "updating ..."
          ) : (
            <button
              onClick={() =>
                updateData({
                  ...item,
                  label: labelState,
                  order: +order,
                  parent: parentCategory,
                }).then(retrieve)
              }
            >
              Update
            </button>
          )}
        </div>
        <div style={{ width: 50 }}>
          {removing ? (
            "deleting ..."
          ) : (
            <button
              onClick={() => {
                window.confirm(`Are you sure you want to remove category "${item.id}" ?`) &&
                  removeData(item).then(retrieve);
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {error && <div>{error.message}</div>}
      {deleteError && <div>{deleteError.message}</div>}
    </>
  );
};

const Categories = () => {
  const [data, setData] = useState<Category[]>([]);

  const [newCategoryId, setNewCategoryId] = useState("");

  const [getAllItems, loading, getError] = useAsync<void, Category[]>(
    api.getCategories
  );

  const [addNewItem, adding, addError] = useAsync(api.addCategory);

  const retrieve = () => {
    setData([]);
    getAllItems().then(setData);
  };

  const categoriesGroupedByParent = data.reduce(
    (acc: Record<string, Category[]>, val) => {
      const parent = val.parent || "";
      const group = acc[parent] || [];
      group.push(val);
      acc[parent] = group;
      return acc;
    },
    { "": [] }
  );

  return (
    <div>
      <div>
        <h1>Categories</h1>
      </div>
      <div>
        <button onClick={retrieve}>Retrieve</button>
        <div style={{ padding: 10, border: "1px dashed lightgrey" }}>
          <b>Add Category</b>
          <div style={{ display: "flex", marginTop: 10 }}>
            <span>Category ID :</span>
            <div>
              <input
                value={newCategoryId}
                onChange={(e) => setNewCategoryId(e.target.value)}
              />
            </div>
            <div>
              {adding ? (
                "adding"
              ) : (
                <button
                  onClick={() => {
                    newCategoryId &&
                      addNewItem({
                        id: newCategoryId,
                        order: 1,
                      } as Category).then(() => retrieve());
                    setNewCategoryId("");
                  }}
                >
                  Add
                </button>
              )}
            </div>
          </div>
          <div>{addError && <div>{addError.message}</div>}</div>
        </div>
      </div>

      <div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <div style={{ width: 100 }}>Id</div>
            <div style={{ width: 150, textAlign: "center" }}>Label(EN)</div>
            <div style={{ width: 150, textAlign: "center" }}>Label(FR)</div>
            <div style={{ width: 50 }}>Order</div>
            <div style={{ width: 100 }}>Parent</div>
            <div style={{ width: 50 }}>Update</div>
            <div style={{ width: 50 }}>Delete</div>
          </div>

          {loading ? (
            <div>"Loading..."</div>
          ) : (
            <div>
              {data.length
                ? categoriesGroupedByParent[""].map((parent) => {
                    const child = categoriesGroupedByParent[parent.id];
                    return (
                      <div
                        key={parent.id}
                        style={{
                          padding: "10px 0px",
                        }}
                      >
                        <div style={{ background: "lightgrey" }}>
                          <Item
                            item={parent}
                            retrieve={retrieve}
                            allCategories={data}
                          />
                        </div>
                        {child && (
                          <div>
                            {child.map((item) => (
                              <Item
                                item={item}
                                retrieve={retrieve}
                                allCategories={data}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                : "RetrieveData"}
            </div>
          )}
        </div>
      </div>

      {getError && <div>{getError.message}</div>}
    </div>
  );
};

export default Categories;
