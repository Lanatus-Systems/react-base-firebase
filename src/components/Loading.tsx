/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const LoadingDot = styled.div`
  background-color: ${(props) => props.color} !important;
`;

interface Iprops {
  color?: string;
}

const Loading = ({ color = "black" }: Iprops) => {
  return (
    <div css={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div className="lds-ellipsis">
        <LoadingDot color={color} />
        <LoadingDot color={color} />
        <LoadingDot color={color} />
        <LoadingDot color={color} />
      </div>
    </div>
  );
};

export default Loading;
