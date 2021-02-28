/** @jsxImportSource @emotion/react  */
import { useContext } from "react";
import { LayoutContext } from "src/context";
import { UserMagazine } from "src/model/orders";
import { StyledMenuItem } from "src/layout/header";
import { Button } from "primereact/button";
import { PlainLink } from "src/base";

interface Iprops {
  magazine: UserMagazine;
}

const Magazine = ({ magazine }: Iprops) => {
  const { isMobile } = useContext(LayoutContext);

  console.log({ magazine });
  return (
    <div
      css={{
        width: isMobile ? "90%" : "30%",
        margin: "5%",
        minHeight: "40vh",
      }}
    >
      <PlainLink
        to={{ pathname: "/pdf-view", state: { pdfUrl: magazine.pdf } }}
      >
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
      </PlainLink>
    </div>
  );
};

export default Magazine;
