/** @jsxImportSource @emotion/react */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import styled from "@emotion/styled";

const StyledAnchor = styled.a({
  color: "unset",
  textDecoration: "unset",
});

interface Iprops {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  pinterest?: string;
}

const SocialMediaLinks = ({
  facebook,
  twitter,
  instagram,
  youtube,
  pinterest,
}: Iprops) => {
  return (
    <div
      css={{
        width: "100%",
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {facebook && (
        <StyledAnchor href={facebook} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            icon={faFacebook}
            size="3x"
            css={{
              backgroundColor: "black",
              color: "white",
              borderRadius: 25,
              ":hover": {
                backgroundColor: "red",
              },
              cursor: "pointer",
            }}
          />
        </StyledAnchor>
      )}
      {twitter && (
        <StyledAnchor href={twitter} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            icon={faTwitter}
            size="3x"
            css={{
              ":hover": {
                color: "red",
              },
              cursor: "pointer",
            }}
          />
        </StyledAnchor>
      )}
      {pinterest && (
        <StyledAnchor href={pinterest} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            icon={faPinterest}
            size="3x"
            css={{
              backgroundColor: "black",
              color: "white",
              borderRadius: 25,
              ":hover": {
                backgroundColor: "red",
              },
              cursor: "pointer",
            }}
          />
        </StyledAnchor>
      )}
      {instagram && (
        <StyledAnchor href={instagram} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            icon={faInstagram}
            size="3x"
            css={{
              ":hover": {
                color: "red",
              },
              cursor: "pointer",
            }}
          />
        </StyledAnchor>
      )}
      {youtube && (
        <StyledAnchor href={youtube} target="_blank" rel="noreferrer">
          <FontAwesomeIcon
            icon={faYoutube}
            size="3x"
            css={{
              ":hover": {
                color: "red",
              },
              cursor: "pointer",
            }}
          />
        </StyledAnchor>
      )}
    </div>
  );
};

export default SocialMediaLinks;
