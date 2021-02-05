/** @jsxImportSource @emotion/react */
import { useEffect, useRef, useState } from "react";
import { Modal } from "src/base";
import { ActiveOrder } from "src/model/orders";
import {
  FormField,
  UserAddressForm,
  UserDetailsForm,
} from "../subscribe/forms";
import * as api from "src/api/app-pages";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { DATE_FORMAT_INPUT_DATE } from "src/constants";
import { ENGLISH, FRENCH } from "src/i18n/languages";

interface Iprops {
  hide: () => void;
  title: string;
  order: ActiveOrder;
  onOk: (updated: ActiveOrder) => void;
}
let countriesCache: string[];
const OrderUpdateModal = ({ hide, title, order, onOk }: Iprops) => {
  console.log({ order });

  const isPrintVariant = order.packageInfo.type === "print";

  const [countries, setCountries] = useState<string[]>([]);

  const userDetailRef = useRef();
  const billingDetailRef = useRef();
  const userAddressRef = useRef();
  const billingAddressRef = useRef();
  const orderDetailRef = useRef();

  useEffect(() => {
    if (countriesCache == null) {
      api.getCheckoutPageData().then((data) => {
        countriesCache = data.countries;
        setCountries(data.countries);
      });
    } else {
      setCountries(countriesCache);
    }
  }, []);

  const updateData = async () => {
    await (orderDetailRef.current as any).submitForm();
    await (userDetailRef.current as any).submitForm();
    if (isPrintVariant) {
      await (billingDetailRef.current as any).submitForm();
      await (userAddressRef.current as any).submitForm();
      await (billingAddressRef.current as any).submitForm();
    }
    if (
      (orderDetailRef.current as any).isValid &&
      (userDetailRef.current as any).isValid &&
      (!isPrintVariant ||
        ((userAddressRef.current as any).isValid &&
          (billingDetailRef.current as any).isValid &&
          (billingAddressRef.current as any).isValid))
    ) {
      const orderDetails = (orderDetailRef.current as any).values;
      const userDetails = (userDetailRef.current as any).values;
      const userAddress = ((userAddressRef.current as any) || {}).values;
      const billingDetails = ((billingDetailRef.current as any) || {}).values;
      const billingAddress = ((billingAddressRef.current as any) || {}).values;

      const finalData = {
        ...order,
        userDetails,
        ...(userAddress ? { userAddress } : {}),
        ...(billingDetails ? { billingDetails } : {}),
        ...(billingAddress ? { billingAddress } : {}),
        startDate: new Date(orderDetails.startDate),
        endDate: new Date(orderDetails.endDate),
        mbockyId: orderDetails.mbockyId,
      };
      console.log(finalData);
      onOk(finalData);
    }
  };

  return (
    <Modal title={title} onClose={hide} onOk={updateData}>
      <div css={{ maxHeight: "80vh", overflow: "auto" }}>
        <div css={{ margin: 10 }}>User Details</div>
        <div css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}>
          <UserDetailsForm
            formRef={userDetailRef}
            userDetails={order.userDetails}
            confirm={false}
          />
        </div>
        {isPrintVariant && (
          <>
            <div css={{ margin: 10 }}>User Address</div>
            <div
              css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}
            >
              <UserAddressForm
                formRef={userAddressRef}
                userAddress={order.userAddress}
                confirm={false}
                countries={countries}
              />
            </div>
            <div css={{ margin: 10 }}>Delivery Details</div>
            <div
              css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}
            >
              <UserDetailsForm
                formRef={billingDetailRef}
                userDetails={order.billingDetails || order.userDetails}
                confirm={false}
              />
            </div>
            <div css={{ margin: 10 }}>Delivery Address</div>
            <div
              css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}
            >
              <UserAddressForm
                formRef={billingAddressRef}
                userAddress={order.billingAddress || order.userAddress}
                confirm={false}
                countries={countries}
              />
            </div>
          </>
        )}
        <div css={{ margin: 10 }}>Transaction Details</div>
        <div css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}>
          <pre>{JSON.stringify(order.transaction, null, 4)}</pre>
        </div>
        <div css={{ margin: 10 }}>Magazine Details</div>
        <div css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}>
          <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
            <div css={{ width: 200 }}>ID</div>
            <div>{order.packageInfo.id}</div>
          </div>
          <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
            <div css={{ width: 200 }}>Subscription Term</div>
            <div>{order.packageInfo.term}</div>
          </div>
          <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
            <div css={{ width: 200 }}>Subscription Type</div>
            <div>{order.packageInfo.type}</div>
          </div>
          <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
            <div css={{ width: 200 }}>Price (€)</div>
            <div>{order.packageInfo.price}</div>
          </div>
          <div css={{ display: "flex", flexWrap: "wrap", margin: 5 }}>
            <div css={{ width: 200 }}>Chosen Start Option</div>
            <div>{order.packageInfo.startDate}</div>
          </div>
        </div>
        <div css={{ margin: 10 }}>Provide Duration</div>
        <div css={{ marginTop: 5, padding: 10, borderTop: "4px solid black" }}>
          <div>
            <Formik
              innerRef={orderDetailRef as any}
              initialValues={
                order.startDate && order.endDate
                  ? {
                      mbockyId: order.mbockyId || "",
                      language: order.packageInfo.language,
                      startDate: dayjs(order.startDate).format(
                        DATE_FORMAT_INPUT_DATE
                      ),
                      endDate: dayjs(order.endDate).format(
                        DATE_FORMAT_INPUT_DATE
                      ),
                    }
                  : {
                      mbockyId: order.mbockyId || "",
                      language: order.packageInfo.language,
                    }
              }
              validationSchema={Yup.object().shape({
                mbockyId: Yup.string().required("required"),
                startDate: Yup.date().required("required"),
                endDate: Yup.date()
                  .min(
                    Yup.ref("startDate"),
                    "End date can't be before Start date"
                  )
                  .required("required"),
              })}
              onSubmit={(values) => {}}
            >
              {() => {
                return (
                  <Form>
                    <FormField
                      label="Mbocky Id"
                      name="mbockyId"
                      required
                      confirm={false}
                    />
                    <FormField
                      label="Start Date"
                      type="date"
                      name="startDate"
                      required
                      confirm={false}
                    />
                    <FormField
                      label="End Date"
                      name="endDate"
                      required
                      confirm={false}
                      type="date"
                    />
                    <FormField
                      label="Language"
                      as="select"
                      name="language"
                      required
                    >
                      <option value={ENGLISH}>English</option>
                      <option value={FRENCH}>French</option>
                    </FormField>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderUpdateModal;
