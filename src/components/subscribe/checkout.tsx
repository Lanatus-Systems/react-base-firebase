/** @jsxImportSource @emotion/react */
import { Redirect, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { AuthContext, LayoutContext } from "src/context";
import { useContext, useEffect, useRef, useState } from "react";
import { useAsync, useMultiLanguage } from "src/hooks";

import * as api from "src/api/app-pages";
import { CheckoutPage, SubscriptionPackage } from "src/model/app-pages";
import Loading from "src/base/Loading";
import parseQuillHtml from "src/utils/quill-parser";
import TextPlaceholder from "../text-placeholder";
import MultiLangTextEdit from "../editables/MultiLangTextEdit";
import { MultiLanguage } from "src/model/common";
import Sticky from "react-sticky-el";
import { UserAddressForm, UserDetailsForm } from "./forms";

interface IstepProps {
  active: boolean;
}

const StyledStep = styled.div<IstepProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.active ? "#333" : "none")};
  color: ${(props) => (props.active ? "#fff" : "rgba(0, 0, 0, 0.5)")};
  cursor: ${(props) => (props.active ? "pointer" : "unset")};
  border-radius: 20px;
  width: 32%;
`;

const steps = ["Detail", "Review", "Complete"];

const Checkout = () => {
  const location = useLocation();
  const packageDetails = location.state as SubscriptionPackage;
  const { isMobile } = useContext(LayoutContext);
  const { roles } = useContext(AuthContext);
  const [pageData, setPageData] = useState<CheckoutPage>();

  const userDetailRef = useRef();
  const billingDetailRef = useRef();
  const userAddressRef = useRef();
  const billingAddressRef = useRef();

  const [activeStep, setActiveStep] = useState(0);
  const { localize, derive, deriveImage } = useMultiLanguage();
  const [saveSubscriptionPageData, saving] = useAsync(api.savePageData);

  useEffect(() => {
    api.getCheckoutPageData().then(setPageData);
  }, []);

  console.log({ packageDetails });

  if (packageDetails == null) {
    return <Redirect to="/subscribe" />;
  }
  if (pageData == null) {
    return <Loading />;
  }
  return (
    <div css={{ display: "flex", justifyContent: "center" }}>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : 720,
          //   padding: 10,
        }}
      >
        <Sticky>
          <div
            css={{
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "flex-end",
              borderBottom: "4px solid black",
              padding: isMobile ? "20px 5px" : 20,
            }}
          >
            <div
              css={{
                display: "flex",
                justifyContent: "space-between",
                width: isMobile ? "70%" : "35%",
                height: 30,
              }}
            >
              {steps.map((item, index) => {
                return (
                  <StyledStep
                    key={index}
                    onClick={() => {
                      if (index <= activeStep) {
                        setActiveStep(index);
                      }
                    }}
                    active={index <= activeStep}
                  >
                    {item}
                  </StyledStep>
                );
              })}
            </div>
          </div>
        </Sticky>

        <div css={{ display: "flex", justifyContent: "center" }}>
          <h1
            css={{
              margin: 30,
              marginBottom: 10,
              fontSize: isMobile ? 40 : 60,
              cursor: "pointer",
              fontFamily: "serif",
            }}
          >
            {localize("brandName")}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", padding: 10 }}>
            {pageData.subHeadInfo ? (
              parseQuillHtml(derive(pageData.subHeadInfo))
            ) : (
              <TextPlaceholder />
            )}
            <MultiLangTextEdit
              rich
              title="Edit Checkout Header"
              value={pageData.subHeadInfo as MultiLanguage}
              onChange={(updated) =>
                setPageData((val) => val && { ...val, subHeadInfo: updated })
              }
            />
          </div>
        </div>
        <div css={{ display: "flex", justifyContent: "center" }}>
          <img
            src={deriveImage(packageDetails.image)}
            alt="Not Available"
            css={{ maxHeight: 200, maxWidth: "100%" }}
          />
        </div>

        <div
          css={{
            marginTop: 30,
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
          {"Your Details".toLocaleUpperCase()}
        </div>
        <div css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}>
          <UserDetailsForm
            formRef={userDetailRef}
            userDetails={(userDetailRef.current as any)?.values || {}}
          />
        </div>
        <div
          css={{
            marginTop: 10,
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
          {"Billing Address".toLocaleUpperCase()}
        </div>
        <div css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}>
          <UserAddressForm
            formRef={userAddressRef}
            userAddress={(userAddressRef.current as any)?.values || {}}
          />
        </div>
        <div
          css={{
            marginTop: 30,
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {"Delivery Details".toLocaleUpperCase()}
        </div>
        <div css={{ marginTop: 5, borderTop: "4px solid black" }}></div>

        <button
          onClick={() => {
            setActiveStep((step) => step + 1);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Checkout;
