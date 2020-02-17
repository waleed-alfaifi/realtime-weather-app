import moment from 'moment';

moment.locale('ar', {
  meridiem: function(hours, minutes, isLower) {
    return hours < 12 ? 'ص' : 'م';
  },
});

export default moment;
