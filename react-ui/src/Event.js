import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@material-ui/core";
import moment from "moment";
import { useSelector } from "react-redux";
function Event({ event_id }) {
  const event = useSelector((state) => state.Events.data[event_id]);
  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "15px",
        height: "100%",
        position: "relative",
        // backgroundColor: "#e8efed",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {event.summary}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Starts{" "}
          {event.start.date
            ? moment(event.start.date).fromNow()
            : moment(event.start.dateTime).fromNow()}
        </Typography>
        {event.location && (
          <Typography variant="caption">{event.location}</Typography>
        )}
        {event.description && (
          <Typography
            variant="caption"
            color="textSecondary"
            component="p"
            gutterBottom
          >
            {event.description}
          </Typography>
        )}
        {event.count && event.recurringEventId && (
          <Typography variant="subtitle2">Frequency : {event.count}</Typography>
        )}
      </CardContent>
      <CardActions>
        <a
          href={event.htmlLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Button size="small">Link</Button>
        </a>
        {event.hangoutLink && (
          <a
            href={event.hangoutLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button size="small">Join with Google Meet</Button>
          </a>
        )}
      </CardActions>
    </Card>
  );
}

export default Event;
