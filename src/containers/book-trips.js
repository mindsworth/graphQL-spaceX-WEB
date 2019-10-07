import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Button from '../components/button';
import { GET_LAUNCH_DETAILS } from '../pages/launch';

const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function BookTrips({ cartItems }) {
  const [bookTrips, { data, loading, error }] = useMutation(
    BOOK_TRIPS,
    {
      refetchQueries: cartItems.map(launchId => ({
        query: GET_LAUNCH_DETAILS,
        variables: { launchId },
      })),

      update(cache) {
        cache.writeData({ data: { cartItems: [] } });
      }
    }
  )
  return data && data.bookTrips && !data.bookTrips.success
    ? <p data-testid="message">{data.bookTrips.message}</p>
    : (
      <Button onClick={bookTrips} data-testid="book-button">
        Book All
      </Button>
    );
}