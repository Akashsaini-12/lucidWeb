import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { AES, enc, SHA256, mode, pad } from "crypto-js";
import JSEncrypt from "jsencrypt"; // By using jsencrypt generate RSA Keys
import { Base_Url } from "./Network";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [responseMessageSuccess, setResponseSuccessMessage] = useState("");
  const [keys, setKeys] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleFormValidation = () => {
    let formIsValid = true;
    if (!username) {
      setEmailErr("Email is required.");
      formIsValid = false;
    } else if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(username)) {
      setEmailErr("Invalid email address.");
      formIsValid = false;
    } else {
      setEmailErr("");
    }

    if (!password) {
      setPasswordErr("Password is required.");
      formIsValid = false;
    } else {
      setPasswordErr("");
    }

    return formIsValid;
  };
  //_____________By Using jsencrypt for RSA KeyPair Generation____________//
  const generateKeyPair = async () => {
    const crypt = new JSEncrypt({ default_key_size: 2048 });
    crypt.getKey();
    const publicKeyString = crypt.getPublicKey();
    const privateKeyString = crypt.getPrivateKey();
    //converting PublicKey in RSA By using
    const convertJSEncryptPublicKeyToRSA = (publicKey) => {
      const header = "-----BEGIN RSA PUBLIC KEY-----\n";
      const footer = "\n-----END RSA PUBLIC KEY-----";
      let pem = publicKey.replace(/\n/g, ""); // Remove line breaks
      pem = pem.match(/.{1,64}/g).join("\n"); // Insert line breaks every 64 characters
      pem = header + pem + footer;
      return pem;
    };
    const publicKeyInRSAFormat = publicKeyString
      .replace("-----BEGIN PUBLIC KEY-----", "") // Remove the BEGIN header
      .replace("-----END PUBLIC KEY-----", "") // Remove the END header
      .replace(/\s/g, "");
    const publicKeyInRSAString =
      convertJSEncryptPublicKeyToRSA(publicKeyInRSAFormat);
    try {
      //Store the keys in localStorage
      // console.log(privateKeyString, "privateKeyString");
      // console.log(publicKeyInRSAString, "publicKeyInRSAString");
      localStorage.setItem("publicKey", publicKeyInRSAString);
      localStorage.setItem("privateKey", privateKeyString);
    } catch (error) {
      // Handle any errors that occur during localStorage operations
      // console.error("Error storing keys in localStorage:", error);
      throw error; // Rethrow the error to handle it further if needed
    }
  };
  useEffect(() => {
    // Call the async function and update state
    generateKeyPair().then((keyPairData) => {
      setKeys(keyPairData);
    });
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    const guid = "8f430dd92a3ff151";
    // Make an API request to authenticate the user

    const publicKeyInRSAString = localStorage.getItem("publicKey");
    const privateKeyString = localStorage.getItem("privateKey");
    const encryptionKey = guid;

    const encryptAESData = (addInfoString, encryptionKey) => {
      const options = {
        mode: mode.CBC,
        padding: pad.Pkcs7,
        iv: enc.Utf8.parse(encryptionKey.substring(0, 16)),
      };
      const encryptedData = AES.encrypt(
        encryptionKey.substring(0, 16) + addInfoString,
        enc.Utf8.parse(encryptionKey),
        options
      ).toString();
      return encryptedData;
    };
    // Send the data to the backend
    const params = {
      eventID: "1001",
      addInfo: {
        userId: username,
        pass: password,
        guid: guid,
      },
    };
    const addInfoString = JSON.stringify(params.addInfo);
    const encryptedData = encryptAESData(addInfoString, encryptionKey);
    //convert in to SHA256
    const hashedAddInfoString = SHA256(addInfoString).toString();
    const crypt = new JSEncrypt({ default_key_size: 2048 });
    //Encryptrd Decrypted HashData By using PublicKey And PrivateKey
    const encryptedHashData = crypt.encrypt(
      hashedAddInfoString,
      publicKeyInRSAString
    );
    const encryptedKeyData = encryptAESData(privateKeyString, encryptionKey);
    const encParams = {
      eventID: "1001",
      addInfo: {
        encData: encryptedData,
        encHashData: encryptedHashData,
        kID: encryptedKeyData,
        guid: guid,
      },
    };
    // console.log("encParamsLogin", encParams);
    if (handleFormValidation() == true) {
      try {
        const response = await fetch(`${Base_Url}login`, {
          method: "POST",

          body: JSON.stringify(encParams),
        });
        console.log("response", response);
        if (response.ok) {
          const data = await response.json();
          // console.log("response", data);

          //  const docCount = data.rData.docCount;
          //  const facCount = data.rData.facCount;
          //  const apptCount= data.rData.apptCount;
          //  console.log(apptCount,"dhsfkjhdsgkjh");
          const loginSuccessful = true;
          console.log("data", data);
          if (data?.rData?.rCode == 0 && loginSuccessful) {
            // console.log("nitish");
            // localStorage.setItem("doctorCount", data.rData.docCount);
            // localStorage.setItem("hospCount", data.rData.facCount);
            // localStorage.setItem("appontCount", data.rData.apptCount);
            localStorage.setItem("username", username);
            localStorage.setItem("token", data?.rData?.jwt);
            localStorage.setItem("loginId", data.rData.id);
            // console.log(docCount, facCount, apptCount, "totalcount");
            setLoggedIn(true);
            // navigate("/dashboard", {
            //   state: { docCount, facCount, apptCount },
            // });
            // // console.log("vikash");
            setResponseSuccessMessage("Login successful");
            setTimeout(() => {
              setShowLoader(false); // Hide loader after 1 second
              navigate("/dashboard");
            }, 1000);
          } else {
            // const errorMessage = data.errorMessage || "Unknown error";
            // setResponseMessage(`Login failed: ${errorMessage}`);
            // setResponseMessage(
            //   `Login failed`,
            //   toast.error("*Invalid Credentials!", {
            //     position: toast.POSITION.TOP_CENTER,
            //   })
            // );
            setResponseMessage("Login failed");

            toast.error("*Invalid Credentials!", {
              // position: toast.POSITION.TOP_CENTER, // Make sure you are using the correct constant
              position: "top-center", // Make sure you are using the correct constant
            });
          }
        } else {
          //Handle login error
          const data = await response.json();
          setResponseMessage(`Login failed: ${data.errorMessage}`);
        }
      } catch (error) {
        setResponseMessage(
          toast.error("*Invalid Credentials!", {
            position: toast.POSITION.TOP_CENTER,
          })
        );
      }
    }
  };
  return (
    <div id="layout" className="theme-cyan">
      <div id="wrapper">
        <div className="d-flex h100vh align-items-center auth-main w-100">
          <div className="auth-box">
            <div className="card shadow p-lg-4">
              <div className="card-header">
                <div className="logo">
                  <img
                    src="assets/images/medsKeylogo.png"
                    className="avatar lg rounded me-3"
                    alt="User Profile Picture"
                  />
                </div>
                <p className="fs-5 mb-0">Login to your account</p>
              </div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="form-floating mb-1">
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Email address</label>
                    <p className="error" style={{ color: "red" }}>
                      {emailErr}
                    </p>
                  </div>
                  <div className="form-floating">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                    <p className="error" style={{ color: "red" }}>
                      {passwordErr}
                    </p>
                  </div>
                  <div className="form-check my-1"></div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 px-3 py-2"
                  >
                    LOGIN
                  </button>
                </form>
              </div>

              <div>
                <ToastContainer />
                {/* ... rest of your component ... */}
                {/* {responseMessage && <p>{responseMessage}</p>} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
