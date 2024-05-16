import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App', () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          time: '2024-05-15T11:00:00Z',
          data: {
            instant: {},
            next_12_hours: {},
            next_1_hours: {},
            next_6_hours: {}
          }
        },
        {
          time: '2024-05-16T11:00:00Z',
          data: {
            instant: {},
            next_12_hours: {},
            next_1_hours: {},
            next_6_hours: {}
          }
        },
        {
          time: '2024-05-17T11:00:00Z',
          data: {
            instant: {},
            next_12_hours: {},
            next_1_hours: {},
            next_6_hours: {}
          }
        }
      ]
    });
  });

  test('renders weather forecast title', () => {
    render(<App />);
    const titleElement = screen.getByText(/weather forecast/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('toggles language', async () => {
    render(<App />);
    const toggleButton = screen.getByRole('button', { name: /EN/i });
    await act(async () => {
      userEvent.click(toggleButton);
    });
    expect(screen.getByText(/enter location/i)).toBeInTheDocument();
  });

  test('fetches weather data based on location input', async () => {
    render(<App />);
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    const fetchButton = screen.getByRole('button', { name: /fetch weather/i });
    userEvent.type(locationInput, 'New York');
    userEvent.click(fetchButton);
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/air_temperature/i)).toBeInTheDocument();
  });

  test('fetches weather data based on coordinates input', async () => {
    render(<App />);
    const latInput = screen.getByPlaceholderText(/enter latitude/i);
    const lonInput = screen.getByPlaceholderText(/enter longitude/i);
    const fetchButton = screen.getByRole('button', { name: /fetch weather/i });
    userEvent.clear(latInput);
    userEvent.type(latInput, '40');
    userEvent.clear(lonInput);
    userEvent.type(lonInput, '-73');
    userEvent.click(fetchButton);
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(/air_temperature/i)).toBeInTheDocument();
  });

  test('displays error message when location input is empty', async () => {
    render(<App />);
    const fetchButton = screen.getByRole('button', { name: /fetch weather/i });
    userEvent.click(fetchButton);
    expect(await screen.findByText(/please enter a location/i)).toBeInTheDocument();
  });

  test('displays error message when coordinates input is empty', async () => {
    render(<App />);
    const fetchButton = screen.getByRole('button', { name: /fetch weather/i });
    userEvent.click(fetchButton);
    expect(await screen.findByText(/please enter latitude and longitude/i)).toBeInTheDocument();
  });

  test('displays error message when API request fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('API request failed'));
    render(<App />);
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    const fetchButton = screen.getByRole('button', { name: /fetch weather/i });
    userEvent.type(locationInput, 'New York');
    userEvent.click(fetchButton);
    expect(await screen.findByText(/error fetching weather data/i)).toBeInTheDocument();
  });

  test('displays spinner when fetching weather data', async () => {
    render(<App />);
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    const fetchButton = screen.getByRole('button', { name: /fetch weather/i });
    userEvent.type(locationInput, 'New York');
    userEvent.click(fetchButton);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    await act(async () => {
      await screen.findByText(/air_temperature/i);
    });
    expect(screen.queryByTestId('spinner')).toBeNull();
  });
});
