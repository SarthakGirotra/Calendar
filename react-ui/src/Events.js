import React from "react";
import { useSelector } from "react-redux";
import { Container, Grow, Grid } from "@material-ui/core";
import Event from "./Event";
function Events() {
  const event_index_list = useSelector((state) => {
    return state.Events.idx;
  });

  return (
    <div>
      <Grow in>
        <Container>
          <Grid container alignItems="stretch" spacing={3}>
            {event_index_list.map((event_id) => (
              <Grid key={event_id} item xs={12} sm={6} md={4} lg={3}>
                <Event event_id={event_id} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Grow>
    </div>
  );
}

export default Events;
