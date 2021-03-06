import React, { useEffect, useState } from "react";

import "./App.css";

import { GoogleLogin } from "react-google-login";
import { Button, Paper, Container, Typography } from "@material-ui/core";
import { decodeAndFetch, getEvents } from "./actions/events";
import { useDispatch } from "react-redux";
import Events from "./Events";

function App() {
  const dispatch = useDispatch();
  //Google Console Client Id with calendar read-only scope
  const ClientID = "";

  const [cookie, setCookie] = useState(null);

  const googleFailure = (res) => {
    console.log("failed login");
  };
  const googleSuccess = async (res) => {
    const token = {
      access_token: res.uc.access_token,
      scope: res.uc.scope,
      token_type: res.uc.token_type,
      id_token: res.uc.id_token,
      expiry_date: res.uc.expires_at,
    };

    dispatch(decodeAndFetch(token)).then(() => {
      document.cookie.split(" ").forEach((data) => {
        const temp = data.split("=");
        if (temp[0] === "calendarCookie") setCookie(temp[1]);
      });
    });
  };

  useEffect(() => {
    document.cookie.split(" ").forEach((data) => {
      const temp = data.split("=");
      if (temp[0] === "calendarCookie") setCookie(temp[1]);
    });
    if (cookie) dispatch(getEvents());
  }, [dispatch, cookie, setCookie]);

  return (
    <>
      <div className="nav">
        <h1 style={{ textAlign: "center", color: "white" }}>Google Events</h1>
        {!cookie && (
          <GoogleLogin
            clientId={ClientID}
            render={(renderProps) => (
              <Button
                color="primary"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                variant="contained"
                size="small"
                style={{ float: "right", marginRight: "10px" }}
              >
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy={"single_host_origin"}
            scope={"https://www.googleapis.com/auth/calendar.events.readonly"}
          />
        )}
        {cookie && (
          <Button
            color="secondary"
            variant="contained"
            style={{ float: "right", marginRight: "10px" }}
            onClick={() => {
              dispatch({ type: "LOGOUT" });
              setCookie(null);
            }}
          >
            logout
          </Button>
        )}
      </div>
      {!cookie && (
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={3}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "200px",
              padding: "20px",
            }}
          >
            <Typography variant="h5">Sign In To View Events</Typography>
          </Paper>
        </Container>
      )}
      <Events />
    </>
  );
}

export default App;
