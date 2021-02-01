/** @jsxImportSource @emotion/react */
import { Redirect, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
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
import { Form, Formik } from "formik";
import { FormField } from "./forms";
import * as Yup from "yup";
import { ENGLISH, FRENCH } from "src/i18n/languages";
import TextEdit from "../editables/TextEdit";
import { PlainLink } from "src/base";
import PaymentComponent from "./payment";
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

const Checkout = () => {
  const location = useLocation();
  const packageDetails = location.state as SubscriptionPackage;
  const { isMobile } = useContext(LayoutContext);
  const { roles } = useContext(AuthContext);
  const [pageData, setPageData] = useState<CheckoutPage>();

  const [differentBillingDetails, setDifferentBillingDetails] = useState(false);
  const [differentBillingAddress, setDifferentBillingAddress] = useState(false);

  const userDetailRef = useRef();
  const billingDetailRef = useRef();
  const userAddressRef = useRef();
  const billingAddressRef = useRef();
  const magazineDetailRef = useRef();

  const [activeStep, setActiveStep] = useState(2);
  const { localize, derive, deriveImage } = useMultiLanguage();
  const [saveSubscriptionPageData, saving] = useAsync(api.savePageData);
  const steps = [localize("detail"), localize("review"), localize("complete")];
  useEffect(() => {
    api.getCheckoutPageData().then(setPageData);
  }, []);

  console.log({ packageDetails });

  const saveData = () => {
    if (pageData) {
      saveSubscriptionPageData(pageData);
    }
  };

  if (packageDetails == null) {
    return <Redirect to="/subscribe" />;
  }
  const isPrintVariant = packageDetails.type === "print";
  if (pageData == null) {
    return <Loading />;
  }
  return (
    <div css={{ display: "flex", color: "#555", justifyContent: "center" }}>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          width: isMobile ? "100%" : 720,
          //   padding: 10,
        }}
      >
        {/* using zIndex 101 as paypal button have 100 */}
        <Sticky css={{ zIndex: 101 }}>
          <div
            css={{
              backgroundColor: "#fff",
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "4px solid black",
              padding: isMobile ? "20px 5px" : 20,
            }}
          >
            <PlainLink
              to="/subscribe"
              css={{
                display: "flex",
                height: 30,
                width: 100,
              }}
            >
              <StyledStep active={false}>{localize("back")}</StyledStep>
            </PlainLink>
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
          <PlainLink to="/">
            <h1
              css={{
                margin: 30,
                marginBottom: 10,
                fontSize: isMobile ? 40 : 60,
                cursor: "pointer",
                fontFamily: "serif",
                color: "black",
              }}
            >
              {localize("brandName")}
            </h1>
          </PlainLink>
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

        {roles.admin && (
          <div
            css={{
              marginTop: 10,
              padding: 10,
              border: "2px solid black",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div css={{ position: "relative", padding: 5 }}>
              <div>
                <div>Country List ( admin only )</div>
                <ol>
                  {pageData.countries.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
              <TextEdit
                multiline
                title="Edit Countries ( Comma Separated )"
                value={pageData.countries.join(",")}
                onChange={(updated) =>
                  setPageData(
                    (val) =>
                      val && {
                        ...val,
                        countries: updated.split(","),
                      }
                  )
                }
              />
            </div>
            <div css={{ position: "relative", padding: 5 }}>
              <div>
                <div>Start Dates List ( admin only )</div>
                <table css={{ border: "1px solid black" }}>
                  <thead>
                    <tr>
                      <th css={{ minWidth: 200 }}>English</th>
                      <th css={{ minWidth: 200 }}>French</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.startOptions.map((item, index) => (
                      <tr key={index}>
                        <td css={{ border: "1px solid black" }}>
                          {item[ENGLISH]}
                        </td>
                        <td css={{ border: "1px solid black" }}>
                          {item[FRENCH]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <MultiLangTextEdit
                multiline
                title="Edit Countries ( Comma Separated )"
                value={pageData.startOptions.reduce(
                  (acc, val) => {
                    return Object.keys(acc).reduce((base, currKey) => {
                      return {
                        ...base,
                        [currKey]:
                          acc[currKey] === ""
                            ? `${val[currKey]}`
                            : `${acc[currKey]},${val[currKey]}`,
                      };
                    }, {});
                  },
                  { [ENGLISH]: "", [FRENCH]: "" }
                )}
                onChange={(updated) => {
                  const valueArrays = Object.keys(updated).map((item) => {
                    return updated[item].split(",");
                  });

                  const englishArray = valueArrays[0];

                  const finalOptions = englishArray.map((_, arrInd) => {
                    return Object.keys(updated).reduce(
                      (base, currKey, keyInd) => {
                        return {
                          ...base,
                          [currKey]: valueArrays[keyInd][arrInd] || "",
                        };
                      },
                      {}
                    );
                  });

                  setPageData(
                    (val) =>
                      val && {
                        ...val,
                        startOptions: finalOptions,
                      }
                  );
                }}
              />
            </div>
          </div>
        )}

        {roles.admin && (
          <div style={{ margin: 20 }}>
            {saving ? "Saving...." : <button onClick={saveData}>Save</button>}
          </div>
        )}

        <div
          css={{
            marginTop: 30,
            fontSize: 20,
            fontWeight: "bold",
            fontFamily: "'Montserrat', sans-serif",
            color: "black",
          }}
        >
          {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
          {localize("your-order").toLocaleUpperCase()}
        </div>
        <div css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}>
          <div
            css={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap-reverse",
            }}
          >
            <div>
              <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
                <div css={{ width: 200 }}>{localize("id")}</div>
                <div>{packageDetails.id}</div>
              </div>
              <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
                <div css={{ width: 200 }}>{localize("name")}</div>
                <div>{derive(packageDetails.title)}</div>
              </div>
              <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
                <div css={{ width: 200 }}>{localize("subscription-term")}</div>
                <div>{packageDetails.term}</div>
              </div>
              <div css={{ width: 200, margin: 5, marginBottom: 0 }}>
                {localize("details")}
              </div>
              <div>{parseQuillHtml(derive(packageDetails.info))}</div>
              <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
                <div css={{ width: 200 }}>{localize("offer")}</div>
                <div>{derive(packageDetails.priceOffer)}</div>
              </div>
              <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
                <div css={{ width: 200 }}>{localize("price")} (€)</div>
                <div>{packageDetails.price}</div>
              </div>
            </div>
            <div>
              <img
                src={deriveImage(packageDetails.image)}
                alt="magazine"
                width="100px"
              />
            </div>
          </div>
          <div css={{ margin: 5 }}>
            <Formik
              innerRef={magazineDetailRef as any}
              initialValues={(magazineDetailRef.current as any)?.values || {}}
              validationSchema={Yup.object().shape({
                startDate: Yup.string().required("required"),
              })}
              onSubmit={(values) => {}}
            >
              {() => {
                return (
                  <Form>
                    <FormField
                      label={localize("start-date")}
                      as="select"
                      name="startDate"
                      required
                      confirm={activeStep !== 0}
                    >
                      <option></option>
                      {pageData.startOptions.map((item, index) => (
                        <option key={index} value={item[ENGLISH]}>
                          {derive(item)}
                        </option>
                      ))}
                    </FormField>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>

        {activeStep < 2 && (
          <>
            <div
              css={{
                marginTop: 30,
                fontSize: 20,
                fontWeight: "bold",
                fontFamily: "'Montserrat', sans-serif",
                color: "black",
              }}
            >
              {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
              {localize("your-details").toLocaleUpperCase()}
            </div>
            <div
              css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}
            >
              <UserDetailsForm
                formRef={userDetailRef}
                userDetails={(userDetailRef.current as any)?.values}
                confirm={activeStep !== 0}
              />
            </div>
            {isPrintVariant && (
              <>
                <div
                  css={{
                    marginTop: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                    fontFamily: "'Montserrat', sans-serif",
                    color: "black",
                  }}
                >
                  {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
                  {localize("billing-address").toLocaleUpperCase()}
                </div>
                <div
                  css={{
                    marginTop: 5,
                    padding: 10,
                    borderTop: "4px solid black",
                  }}
                >
                  <UserAddressForm
                    formRef={userAddressRef}
                    userAddress={(userAddressRef.current as any)?.values}
                    countries={pageData.countries}
                    confirm={activeStep !== 0}
                  />
                </div>
                <div
                  css={{
                    marginTop: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                    fontFamily: "'Montserrat', sans-serif",
                    color: "black",
                  }}
                >
                  {isMobile ? <span css={{ marginLeft: 10 }} /> : ""}
                  {localize("delivery-details").toLocaleUpperCase()}
                </div>
                <div
                  css={{
                    marginTop: 5,
                    padding: 10,
                    borderTop: "1px solid lightgrey",
                    backgroundColor: "#fbfbfb",
                  }}
                >
                  <div
                    css={{
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {activeStep === 0 && (
                      <input
                        type="checkbox"
                        checked={differentBillingDetails}
                        onChange={(e) => {
                          setDifferentBillingDetails(e.target.checked);
                        }}
                        css={{ transform: "scale(1.3)" }}
                      />
                    )}
                    <div css={{ marginLeft: 10 }}>
                      {activeStep === 0
                        ? localize("use-different-delivery-details")
                        : differentBillingAddress
                        ? ""
                        : localize("same-details-will-be-used-for-delivery")}
                    </div>
                  </div>
                  <div
                    css={{
                      overflow: "hidden",
                      height: differentBillingDetails
                        ? isMobile
                          ? 520
                          : 330
                        : 0,
                      transition: "0.5s ease-in",
                    }}
                  >
                    <UserDetailsForm
                      formRef={billingDetailRef}
                      userDetails={(billingDetailRef.current as any)?.values}
                      confirm={activeStep !== 0}
                    />
                  </div>
                </div>
                <div
                  css={{
                    marginTop: 5,
                    padding: 10,
                    borderTop: "1px solid lightgrey",
                    backgroundColor: "#fbfbfb",
                  }}
                >
                  <div
                    css={{
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {activeStep === 0 && (
                      <input
                        type="checkbox"
                        checked={differentBillingAddress}
                        onChange={(e) => {
                          setDifferentBillingAddress(e.target.checked);
                        }}
                        css={{ transform: "scale(1.3)" }}
                      />
                    )}
                    <div css={{ marginLeft: 10 }}>
                      {activeStep === 0
                        ? localize("use-different-delivery-address")
                        : differentBillingAddress
                        ? ""
                        : localize("same-address-will-be-used-for-delivery")}
                    </div>
                  </div>
                  <div
                    css={{
                      overflow: "hidden",
                      height: differentBillingAddress
                        ? isMobile
                          ? 600
                          : 400
                        : 0,
                      transition: "0.5s ease-in",
                    }}
                  >
                    <UserAddressForm
                      formRef={billingAddressRef}
                      userAddress={(billingAddressRef.current as any)?.values}
                      countries={pageData.countries}
                      confirm={activeStep !== 0}
                    />
                  </div>
                </div>
              </>
            )}
            <div
              css={{ display: "flex", justifyContent: "flex-end", margin: 20 }}
            >
              <button
                css={css`
                  color: #fff;
                  font-size: 17px;
                  border-radius: 6px;
                  text-shadow: 0px -1px 0px rgba(0, 0, 0, 0.25);
                  background: #333 none repeat scroll 0% 0%;
                  font-weight: bold;
                  font-family: "'Montserrat', sans-serif";
                  padding: 10px 20px;
                  cursor: pointer;
                `}
                onClick={async () => {
                  if (activeStep === 0) {
                    await (magazineDetailRef.current as any).submitForm();
                    await (userDetailRef.current as any).submitForm();
                    if (isPrintVariant) {
                      await (billingDetailRef.current as any).submitForm();
                      await (userAddressRef.current as any).submitForm();
                      await (billingAddressRef.current as any).submitForm();
                    }

                    if (
                      (magazineDetailRef.current as any).isValid &&
                      (userDetailRef.current as any).isValid &&
                      (!isPrintVariant ||
                        ((userAddressRef.current as any).isValid &&
                          (!differentBillingDetails ||
                            (billingDetailRef.current as any).isValid) &&
                          (!differentBillingAddress ||
                            (billingAddressRef.current as any).isValid)))
                    ) {
                      setActiveStep(1);
                    }
                  } else if (activeStep === 1) {
                    setActiveStep(2);
                  }
                  // setActiveStep((step) => step + 1);
                  window.scrollTo(0, 400);
                }}
              >
                {activeStep === 0 ? localize("review") : localize("pay")}
              </button>
            </div>
          </>
        )}

        {activeStep === 2 && (
          <PaymentComponent
            packageInfo={packageDetails}
            userDetails={(userDetailRef.current as any)?.values}
            userAddress={(userAddressRef.current as any)?.values}
            billingDetails={
              differentBillingDetails
                ? (billingDetailRef.current as any)?.values
                : undefined
            }
            billingAddress={
              differentBillingAddress
                ? (billingAddressRef.current as any)?.values
                : undefined
            }
            magazineDetails={(magazineDetailRef.current as any)?.values}
          />
        )}
      </div>
    </div>
  );
};

export default Checkout;
