/* eslint-disable consistent-return */
import { Meteor } from 'meteor/meteor';
import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

export default function useOffSetTop(top) {
  const [offsetTop, setOffSetTop] = useState(false);
  const isTop = top || 100;

  useEffect(() => {
    if (Meteor.isClient) {
      window.onscroll = () => {
        if (window.pageYOffset > isTop) {
          setOffSetTop(true);
        } else {
          setOffSetTop(false);
        }
      };
      return () => {
        window.onscroll = null;
      };
    }
  }, [isTop]);

  return offsetTop;
}

// Usage
// const offset = useOffSetTop(100);