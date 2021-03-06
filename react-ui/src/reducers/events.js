import { FETCH, DECODEANDFETCH } from "../constants";

export default (
  events = {
    data: {},
    idx: [],
  },
  action
) => {
  switch (action.type) {
    case FETCH:
      const ret_state = { data: { ...events.data }, idx: [...events.idx] };

      action.payload.forEach((data) => {
        const key = data.recurringEventId || data.id;
        if (key in ret_state.data) {
          ret_state.data[key].count++;
        } else {
          ret_state.data[key] = data;
          ret_state.data[key].count = 1;
          ret_state.idx.push(key);
        }
      });
      return ret_state;

    case DECODEANDFETCH: {
      var now = new Date();
      now.setTime(now.getTime() + 1 * 3590 * 1000);
      //localStorage.setItem("calendarToken", action.payload.jwtToken);
      //cookie
      document.cookie = `calendarCookie=${action.payload.jwtToken
        }; expires=${now.toUTCString()};path=/;`;

      const ret_state = { data: [...events.data], idx: [...events.idx] };
      action.payload.events.forEach((data) => {
        const key = data.recurringEventId || data.id;
        if (key in ret_state.data) {
          ret_state[key].count++;
        } else {
          ret_state.data[key] = data;
          ret_state.data[key].count = 1;
          ret_state.idx.push(key);
        }
      });
      return ret_state;
    }
    case 'LOGOUT':
      document.cookie = "calendarCookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return {
        data: {},
        idx: [],
      }
    default:
      return events;
  }
};
