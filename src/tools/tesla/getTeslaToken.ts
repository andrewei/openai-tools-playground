//create new token from Tesla with refresh token stored in src/.refresh_token
import fs from "fs";
import axios from "axios";

export const getTeslaToken = async () => {
  const refreshToken = fs.readFileSync('src/.refreshToken', 'utf8').trim();
  const url = `https://auth.tesla.com/oauth2/v3/token`;

  try {
    console.log("sending tesla request")
    const response = await axios.post(url, {
    grant_type: 'refresh_token',
    client_id: 'ownerapi',
    refresh_token: refreshToken,
    scope: 'openid email offline_access'
  });

  if(response.status !== 200) {
    return "Could not update token";
  }
  console.log(response);
  const data = response.data;
  //console.log(data);
  fs.writeFileSync('src/.token', data.access_token);
  fs.writeFileSync('src/.refreshToken', data.refresh_token);
  return "Token refreshed successfully";
  } catch (error) {
    console.log(error);
    return "Could not update token";
  }
}


export const getRefreshTokenDescription = {
  type: "function", function: {
    name: "get_refresh_token_from_tesla",
    description: "Refresh token from Tesla. This is needed if the old token has expired. Will get new refresh_token and new token",
  }
}
