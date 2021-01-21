import { Formik, Field, Form, useFormikContext } from "formik";
import { UserAddress, UserDetails } from "src/model/orders";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { ReactNode, useContext } from "react";
import { LayoutContext } from "src/context";

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
}
const FormField = ({
  name,
  label,
  children,
  as,
  type,
  required,
}: IfieldProps) => {
  const { errors, touched } = useFormikContext();
  const { isMobile } = useContext(LayoutContext);

  const err = (touched as any)[name] && (errors as any)[name];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "96%",
        justifyContent: "start",
        padding: isMobile ? "2%" : "",
      }}
    >
      <div
        style={{
          width: isMobile ? "100%" : "20%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div>
          {required ? (
            <span>
              <span>{label}</span>
              <span style={{ marginLeft: 5, color: "red" }}>*</span>
            </span>
          ) : (
            label
          )}
        </div>
      </div>
      <div style={{ width: isMobile ? "100%" : "40%" }}>
        {children ? (
          <StyledField
            error={err != null}
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
            error={err != null}
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
            width: isMobile ? "100%" : "30%",
            fontSize: 12,
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

const UserDetailSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  emailConfirm: Yup.string().oneOf(
    [Yup.ref("email"), null],
    "Emails must match"
  ),
  phone: Yup.string(),
});

interface IuserDetailForm {
  userDetails: UserDetails;
  formRef: any;
}

export const UserDetailsForm = ({ userDetails, formRef }: IuserDetailForm) => {
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
              <FormField label="Title" as="select" name="title" required>
                <option></option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Miss">Miss</option>
                <option value="Dr">Dr</option>
                <option value="Dr">Dr</option>
              </FormField>
              <FormField label="First Name" name="firstName" required />
              <FormField label="Last Name" name="lastName" required />
              <FormField label="Email" name="email" type="email" required />
              <FormField
                label="Verify Email"
                name="emailConfirm"
                type="email"
                required
              />
              <FormField label="Phone" name="phone" />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

const UserAddressSchema = Yup.object().shape({
  address1: Yup.string().required("Required"),
  company: Yup.string(),
  address2: Yup.string(),
  address3: Yup.string(),
  town: Yup.string().required("Required"),
  postalCode: Yup.string(),
  country: Yup.string().required("Required"),
});

interface IuserAddressForm {
  userAddress: UserAddress;
  formRef: any;
}

export const UserAddressForm = ({ userAddress, formRef }: IuserAddressForm) => {
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
              <FormField label="Address1" name="address1" required />
              <FormField label="Company" name="company" />
              <FormField
                label="Address2"
                name="address2"
                type="email"
                required
              />
              <FormField label="Address3" name="address3" />
              <FormField label="Town" name="town" required />
              <FormField label="Postal Code" name="postalCode" />
              <FormField label="Country" as="select" name="country" required>
                <option></option>
                <option value="Mr">England</option>
              </FormField>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
