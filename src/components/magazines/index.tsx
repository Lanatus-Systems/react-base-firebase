/** @jsxImportSource @emotion/react  */
import { useAsync } from "src/hooks";
import * as api from "src/api/orders";
import { useContext, useEffect, useState } from "react";
import Loading from "src/base/Loading";
import { AuthContext, LayoutContext } from "src/context";
import { UserMagazine } from "src/model/orders";
import Magazine from "./magazine";

const UserMagazines = () => {
  const { user } = useContext(AuthContext);

  const { isMobile } = useContext(LayoutContext);

  const [userMagazines, setUserMagazines] = useState<UserMagazine[]>();

  const [getUserMagazines, retrieving] = useAsync(api.getUserMagazines);

  useEffect(() => {
    if (user) {
      getUserMagazines(user.email).then((data) => {
        setUserMagazines(data);
      });
    }
  }, [getUserMagazines, user]);

  return (
    <div>
      <div
        css={{
          padding: isMobile ? 40 : 20,
          fontSize: isMobile ? 30 : 40,
          textAlign: "center",
        }}
      >
        My Magazines
      </div>
      <div
        css={{
          margin: "0px 5%",
          width: "90%",
          borderBottom: "1px solid lightgrey",
        }}
      />
      <div
        css={{
          display: "flex",
          minHeight: "50vh",
          margin: isMobile ? 0 : "0px 10vw",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {userMagazines == null || retrieving ? (
          <Loading />
        ) : (
          userMagazines.map((magazine) => {
            return <Magazine magazine={magazine} />;
          })
        )}
      </div>
    </div>
  );
};

export default UserMagazines;
