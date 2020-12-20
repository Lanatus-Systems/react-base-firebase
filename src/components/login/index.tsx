import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "src/context";

const LoginPage = () => {
  const { emailPasswordLogin } = useContext(AuthContext);

  const history = useHistory();

  const [email, setEmail] = useState<string>("test@test.com");
  const [password, setPassword] = useState<string>("test123");

  const login = () => {
    emailPasswordLogin(email, password).then(() => history.push("/"));
  };

  return (
    <div>
      <div>
        {" "}
        <label>Email : </label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        {" "}
        <label>Password : </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button onClick={login}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
