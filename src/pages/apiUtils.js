// apiUtils.js
const Base_Url = "http://medskey-api.sourceinfosys.com:30156/admin-api/"; // Replace with your actual base URL
//http://medskey-api.sourceinfosys.com:30156/admin-api/

export const networkRequest = async (endpoint, method = "GET", params = {}) => {
  // const storedToken = "your_access_token"; // Replace with your actual access token
  const storedToken = localStorage.getItem("token");

  const guid = "8f430dd92a3ff151";

  const url = `${Base_Url}${endpoint}`;
  // console.log("url", url);
  // console.log("storedToken", storedToken);
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type,*",
    "Access-Control-Allow-Credentials": "*",
    "Access-Control-Allow-Origin": url,
    "Access-Control-Allow-Methods": method,
    "Content-Type": "application/json",
    Authorization: `Bearer ${storedToken}`,
    Accept: "application/json",
    guid: guid,
  };

  const options = {
    method,
    headers,
    body: method === "POST" ? JSON.stringify(params) : undefined,
  };

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (response.ok) {
      return responseData; // Adjust this based on your actual API response structure
    } else {
      throw new Error(responseData || "Failed to fetch data");
    }
  } catch (error) {
    throw new Error("An error occurred while fetching data");
  }
};
