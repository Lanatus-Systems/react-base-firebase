/** @jsxImportSource @emotion/react  */
import { useContext } from "react";
import { LayoutContext } from "src/context";
import { UserMagazine } from "src/model/orders";
import { StyledMenuItem } from "src/layout/header";
import { Button } from "primereact/button";
import { useHistory } from "react-router-dom";
import { saveAs } from "file-saver";

interface Iprops {
  magazine: UserMagazine;
}

const Magazine = ({ magazine }: Iprops) => {
  const { isMobile } = useContext(LayoutContext);

  const history = useHistory();

  const navigateToPdfView = () => {
    if (magazine.pdf) {
      history.push("/pdf-view", { pdfUrl: magazine.pdf });
    } else {
      alert(
        "PDF is not available for this edition, we'll send you it over mail"
      );
    }
  };

  console.log({ magazine });
  return (
    <div
      css={{
        width: isMobile ? "90%" : "30%",
        margin: "5%",
        minHeight: "40vh",
      }}
    >
      <div onClick={navigateToPdfView}>
        <div>
          <img
            css={{ cursor: "pointer" }}
            src={magazine.image}
            alt="Missing"
            width="100%"
            height="100%"
          />
        </div>
        <div
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 30,
          }}
        >
          <StyledMenuItem>{`${magazine.priceOffer || "-"} (${
            magazine.price
          } €)`}</StyledMenuItem>
        </div>
        <div>
          <Button css={{ width: "100%" }} label="View" />
        </div>
      </div>
      <div css={{ marginTop: 10 }}>
        <Button
          className="p-button-danger"
          css={{ width: "100%" }}
          label="Download"
          onClick={() => {
            fetch(magazine.pdf)
              .then((res) => res.blob())
              .then((blob) => {
                saveAs(blob, magazine.priceOffer);
              });
          }}
        />
      </div>
    </div>
  );
};

export default Magazine;
