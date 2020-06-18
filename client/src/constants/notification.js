export const weekDays = [
  {name: 'mon', title: 'Monday'},
  {name: 'tue', title: 'Tuesday'},
  {name: 'wed', title: 'Wednesday'},
  {name: 'thu', title: 'Thursday'},
  {name: 'fri', title: 'Friday'},
  {name: 'sat', title: 'Saturday'},
  {name: 'sun', title: 'Sunday'}
];

let weekDaysChecked = {};
weekDays.forEach((day) => {
  weekDaysChecked[day.name] = false;
});

export const defaultNotification = {...weekDaysChecked, time: "07:30" };
