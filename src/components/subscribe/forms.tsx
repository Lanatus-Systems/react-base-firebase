import { Formik, Field, Form, useFormikContext } from "formik";
import { UserAddress, UserDetails } from "src/model/orders";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { ReactNode, useContext } from "react";
import { LayoutContext } from "src/context";
import { useMultiLanguage } from "src/hooks";

const StyledField = styled(Field)`
  border: ${(props) => (props.error ? "1px solid #F00" : "1px solid #e2e2e2")};
  background: #ffffff;
  margin: 5px 0 6px;
  padding: 5px;
  width: ${(props) =>
    props.isMobile
      ? props.as === "select"
        ? "98%"
        : "95%"
      : props.as === "select"
      ? "262px"
      : "250px"};
  height: ${(props) => (props.as === "select" ? "42px" : "32px")};
`;

interface IfieldProps {
  name: string;
  label: string;
  children?: ReactNode;
  as?: string;
  type?: string;
  required?: boolean;
  confirm?: boolean;
}
export const FormField = ({
  name,
  label,
  children,
  as,
  type,
  required,
  confirm,
}: IfieldProps) => {
  const { errors, touched, values, submitCount } = useFormikContext();
  const { isMobile } = useContext(LayoutContext);

  const err =
    ((touched as any)[name] || submitCount > 0) && (errors as any)[name];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "96%",
        justifyContent: "start",
        padding: isMobile ? "2%" : confirm ? 2 : "",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: isMobile ? "100%" : "30%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div>
          {!confirm && required ? (
            <span>
              <span>{label}</span>
              <span style={{ marginLeft: 5, color: "red" }}>*</span>
            </span>
          ) : (
            label
          )}
        </div>
      </div>
      <div>
        {confirm ? (
          <div style={{ marginTop: isMobile ? 10 : "unset" }}>
            {((values as any) || {})[name] || "-"}
          </div>
        ) : children ? (
          <StyledField
            error={err}
            placeholder={label}
            name={name}
            as={as}
            type={type}
            isMobile={isMobile}
          >
            {children}
          </StyledField>
        ) : (
          <StyledField
            error={err}
            placeholder={label}
            name={name}
            as={as}
            isMobile={isMobile}
            type={type}
          />
        )}
      </div>
      {err && (
        <div
          style={{
            fontSize: 12,
            marginLeft: 10,
            color: "red",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>{err}</div>
        </div>
      )}
    </div>
  );
};

interface IuserDetailForm {
  userDetails: UserDetails;
  formRef: any;
  confirm: boolean;
}

export const UserDetailsForm = ({
  userDetails = {} as any,
  formRef,
  confirm,
}: IuserDetailForm) => {
  const { localize } = useMultiLanguage();
  const UserDetailSchema = Yup.object().shape({
    title: Yup.string().required(localize("required")),
    firstName: Yup.string().required(localize("required")),
    lastName: Yup.string().required(localize("required")),
    email: Yup.string().email("Invalid email").required(localize("required")),
    emailConfirm: Yup.string().oneOf(
      [Yup.ref("email"), null],
      "Emails must match"
    ),
    phone: Yup.string(),
  });
  return (
    <div>
      <Formik
        innerRef={formRef}
        initialValues={userDetails}
        validationSchema={UserDetailSchema}
        onSubmit={(values) => {}}
      >
        {() => {
          return (
            <Form>
              <FormField
                label={localize("title")}
                as="select"
                name="title"
                required
                confirm={confirm}
              >
                <option></option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Dr">Dr</option>
                <option value="Dr">Dr</option>
              </FormField>
              <FormField
                label={localize("first-name")}
                name="firstName"
                required
                confirm={confirm}
              />
              <FormField
                label={localize("last-name")}
                name="lastName"
                required
                confirm={confirm}
              />
              <FormField
                label={localize("email")}
                name="email"
                type="email"
                required
                confirm={confirm}
              />
              <FormField
                label={localize("verify-email")}
                name="emailConfirm"
                type="email"
                required
                confirm={confirm}
              />
              <FormField
                label={localize("phone")}
                name="phone"
                confirm={confirm}
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

interface IuserAddressForm {
  userAddress: UserAddress;
  formRef: any;
  countries: string[];
  confirm: boolean;
}

export const UserAddressForm = ({
  userAddress = {} as any,
  countries = [],
  formRef,
  confirm,
}: IuserAddressForm) => {
  const { localize } = useMultiLanguage();
  const UserAddressSchema = Yup.object().shape({
    address1: Yup.string().required(localize("required")),
    company: Yup.string(),
    address2: Yup.string(),
    address3: Yup.string(),
    town: Yup.string().required(localize("required")),
    postalCode: Yup.string(),
    country: Yup.string().required(localize("required")),
  });
  return (
    <div>
      <Formik
        innerRef={formRef}
        initialValues={userAddress}
        validationSchema={UserAddressSchema}
        onSubmit={(values) => {}}
      >
        {() => {
          return (
            <Form>
              <FormField
                label={localize("address1")}
                name="address1"
                required
                confirm={confirm}
              />
              <FormField
                label={localize("company")}
                name="company"
                confirm={confirm}
              />
              <FormField
                label={localize("address2")}
                name="address2"
                confirm={confirm}
              />
              <FormField
                label={localize("address3")}
                name="address3"
                confirm={confirm}
              />
              <FormField
                label={localize("town")}
                name="town"
                required
                confirm={confirm}
              />
              <FormField
                label={localize("postal-code")}
                name="postalCode"
                confirm={confirm}
              />
              <FormField
                label={localize("country")}
                as="select"
                name="country"
                required
                confirm={confirm}
              >
                <option></option>
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </FormField>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
