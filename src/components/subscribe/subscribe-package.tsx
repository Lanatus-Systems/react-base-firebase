/** @jsxImportSource @emotion/react */
import { useMultiLanguage } from "src/hooks";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";

import ImageEdit from "../editables/ImageEdit";
import ImagePlaceholder from "../image-placeholder";
import TextPlaceholder from "../text-placeholder";
import { useContext } from "react";
import { AuthContext, LayoutContext } from "src/context";
import parseQuillHtml from "src/utils/quill-parser";
import { SubscriptionPackage } from "src/model/app-pages";
import TextEdit from "../editables/TextEdit";
import { PlainLink } from "src/base";

interface Iprops {
  value: SubscriptionPackage;
  onChange: (item: SubscriptionPackage) => void;
  onRemove: () => void;
}

const SubscribePackage = ({ value, onChange, onRemove }: Iprops) => {
  const { derive, deriveImage, localize, i18n } = useMultiLanguage();

  const { roles } = useContext(AuthContext);
  const { isMobile } = useContext(LayoutContext);

  console.log({ value });

  const availabilityText = derive(value.availability).trim();

  const isAvailable = availabilityText === "-";

  return (
    <div
      css={{
        width: isMobile ? "90vw" : "40vw",
        margin: "2vw",
        minHeight: 200,
        backgroundColor: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {roles.admin && (
        <button
          onClick={() => {
            window.confirm("Are you sure you want to remove packageInfo?") &&
              onRemove();
          }}
        >
          Remove
        </button>
      )}

      {roles.admin && (
        <div
          css={{
            position: "relative",
            height: 30,
            marginTop: 10,
            width: "80%",
            textAlign: "center",
            fontWeight: "bold",
            border: "2px solid black",
          }}
        >
          Package Id : {value.id || "Not set"}
          <TextEdit
            title="Edit Package ID"
            value={value.id}
            onChange={(updated) => onChange({ ...value, id: updated })}
          />
        </div>
      )}
      {roles.admin && (
        <div
          css={{
            position: "relative",
            height: 30,
            marginTop: 10,
            width: "80%",
            textAlign: "center",
            fontWeight: "bold",
            border: "2px solid black",
          }}
        >
          Package Term : {value.term || "Not set (will be displayed on buy)"}
          <TextEdit
            multiline
            title="Edit Package Term ( you can able see this line in list of order)"
            value={value.term}
            onChange={(updated) => onChange({ ...value, term: updated })}
          />
        </div>
      )}

      {roles.admin && (
        <div
          css={{
            position: "relative",
            height: 30,
            marginTop: 10,
            width: "80%",
            textAlign: "center",
            fontWeight: "bold",
            border: "2px solid black",
          }}
        >
          Type :{" "}
          <select
            value={value.type || "digital"}
            onChange={(e) =>
              onChange({
                ...value,
                type: e.target.value === "digital" ? "digital" : "print",
              })
            }
          >
            <option value="digital">Digital</option>
            <option value="print">Print</option>
          </select>
        </div>
      )}

      <div style={{ padding: 40, paddingBottom: 20, position: "relative" }}>
        <span css={{ fontSize: 30 }}>{derive(value.title)}</span>
        <MultiLangTextEdit
          title="Edit Title"
          value={value.title}
          onChange={(updated) => onChange({ ...value, title: updated })}
        />
      </div>

      <div
        css={{
          position: "relative",
          height: 250,
          padding: 20,
          display: "flex",
          width: isMobile ? "80%" : "80%",
          justifyContent: "center",
        }}
      >
        {value.image ? (
          <img
            css={{ height: "100%", maxWidth: "100%" }}
            src={deriveImage(value.image)}
            alt="Not Available"
          />
        ) : (
          <ImagePlaceholder css={{ position: "absolute" }} />
        )}

        <ImageEdit
          css={{ position: "absolute", right: 10, cursor: "pointer" }}
          title="Edit Package Image"
          value={value.image}
          onChange={(url) => onChange({ ...value, image: url })}
        />
      </div>

      <div
        css={{
          position: "relative",
          padding: 20,
          paddingBottom: 0,
          paddingTop: 0,
        }}
      >
        {value.info ? parseQuillHtml(derive(value.info)) : <TextPlaceholder />}
        <MultiLangTextEdit
          rich
          title="Edit Information"
          value={value.info}
          onChange={(updated) => onChange({ ...value, info: updated })}
        />
      </div>

      <div
        style={{
          width: "80%",
          padding: "0% 10%",
          marginBottom: 20,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#eaeaea",
            color: "#666",
            position: "relative",
            textAlign: "center",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <span css={{ fontSize: 15, fontWeight: "bold" }}>
            {derive(value.priceOffer)}
          </span>
          <MultiLangTextEdit
            title="Edit Price Offer"
            value={value.priceOffer}
            onChange={(updated) => onChange({ ...value, priceOffer: updated })}
          />
        </div>
      </div>
      {roles.admin && (
        <div
          css={{
            position: "relative",
            height: 30,
            width: 200,
            textAlign: "center",
            fontWeight: "bold",
            border: "2px solid black",
          }}
        >
          Price : {value.price || "Not set"} (€)
          <TextEdit
            title="Edit Price"
            value={value.price + ""}
            type="number"
            onChange={(updated) => onChange({ ...value, price: +updated })}
          />
        </div>
      )}

      {roles.admin && (
        <div
          css={{
            position: "relative",
            paddingTop: 10,
            height: 30,
            width: 200,
            textAlign: "center",
            fontWeight: "bold",
            border: "2px solid black",
          }}
        >
          {isAvailable ? (
            <div>
              Make Unavailable
              <MultiLangTextEdit
                title="Unavailability Text (Ex, Out of Stock or Coming Soon )"
                value={value.availability || {}}
                onChange={(updated) =>
                  onChange({ ...value, availability: updated })
                }
              />
            </div>
          ) : (
            <button
              onClick={() => {
                onChange({ ...value, availability: {} });
              }}
            >
              Make Available
            </button>
          )}
        </div>
      )}

      <div
        style={{
          width: "100%",
          padding: 10,
          paddingBottom: 30,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PlainLink
          to={{
            pathname: "/checkout",
            state: { ...value, language: i18n.language },
          }}
        >
          <button
            onClick={() => {
              window.scrollTo(0, 0);
            }}
            style={{
              width: 200,
              height: 50,
              border: 0,
              color: "white",
              fontWeight: "bolder",
              fontFamily: "'Montserrat', sans-serif",
              backgroundColor: isAvailable ? "#c00000" : "#999999",
              cursor: isAvailable ? "pointer" : "auto",
            }}
            disabled={!isAvailable}
          >
            {isAvailable
              ? localize("start-now").toLocaleUpperCase()
              : availabilityText}
          </button>
        </PlainLink>
      </div>
    </div>
  );
};

export default SubscribePackage;
