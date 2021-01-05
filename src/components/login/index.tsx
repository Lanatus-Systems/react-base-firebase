import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "src/context";
import { useAsync } from "src/hooks";

const LoginPage = () => {
  const { emailPasswordLogin } = useContext(AuthContext);

  const history = useHistory();

  const [email, setEmail] = useState<string>("test@test.com");
  const [password, setPassword] = useState<string>("test123");

  const [loginUser, loggingIn, error] = useAsync(emailPasswordLogin);

  const login = () => {
    loginUser({ email, password }).then(() => history.push("/"));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: 200,
      }}
    >
      <div style={{ display: "flex", margin: 5 }}>
        <div style={{ width: 80 }}>Email :</div>

        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div style={{ display: "flex", margin: 5 }}>
        <div style={{ width: 80 }}>Password :</div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        {loggingIn ? (
          "Logging in ..."
        ) : (
          <button style={{ width: "100%" }} onClick={login}>
            Login
          </button>
        )}
      </div>
      {error && <div>{error.message}</div>}
    </div>
  );
};

export default LoginPage;
