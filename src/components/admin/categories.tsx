import { useState } from "react";
import { useAsync, useMultiLanguage } from "src/hooks";
import { Category } from "src/model/article";

import * as api from "src/api/article";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import { MultiLanguage } from "src/model/common";

interface Iprops {
  item: Category;
  index: number;
  retrieve: () => void;
  allCategories: Category[];
}

const Item = ({ item, retrieve, allCategories }: Iprops) => {
  const { derive } = useMultiLanguage();
  const [order, setOrder] = useState<string>(item.order + "" || "1");
  const [updateData, updating, error] = useAsync(api.updateCategory);

  const [labelState, setLabelState] = useState<MultiLanguage>(item.label);

  const [parentCategory, setParentCategory] = useState(item.parent);

  console.log({ parentCategory });
  const parentOptions = allCategories.filter((c) => c.id !== item.id);
  return (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {derive(labelState)}{" "}
          <MultiLangTextEdit
            title="Edit Category Label"
            value={labelState}
            onChange={(val) => setLabelState(val)}
          />
        </div>
      </td>
      <td>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        />
      </td>
      <td>
        <select
          value={parentCategory}
          onChange={(e) => setParentCategory(e.target.value)}
        >
          <option value={""}></option>
          {parentOptions.map((val) => (
            <option key={val.id} value={val.id}>
              {val.id}
            </option>
          ))}
        </select>
      </td>

      <td>
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
      </td>
      <td>{error && <div>{error.message}</div>}</td>
    </tr>
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
        <table style={{ border: "1px solid lightgrey" }}>
          <tbody>
            <tr>
              <th>Id</th>
              <th>Label</th>
              <th>Order</th>
              <th>Parent</th>
            </tr>

            {loading ? (
              <tr>"Loading..."</tr>
            ) : (
              <>
                {data.length
                  ? data.map((item, index) => (
                      <Item
                        key={index}
                        index={index}
                        item={item}
                        retrieve={retrieve}
                        allCategories={data}
                      />
                    ))
                  : "RetrieveData"}
              </>
            )}
          </tbody>
        </table>
      </div>

      {getError && <div>{getError.message}</div>}
    </div>
  );
};

export default Categories;
