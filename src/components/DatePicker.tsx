import {useState, useCallback} from 'react';
import RDatePicker from 'react-datepicker';

export default function DatePicker() {
  return (
    <RDatePicker
      showIcon
      placeholder="시작일"
    />
  );
};
