# JPY ⇄ USD Currency Converter

A modern web application for converting between Japanese Yen (JPY) and US Dollar (USD).

## Features

- Real-time currency conversion between JPY and USD
- Live exchange rates from Exchange Rates API
- Elegant UI with Japanese and American visual elements
- Responsive design for mobile and desktop

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Exchange Rates API

## Installation

```bash
# Clone the repository
git clone https://github.com/Andres9888/jpy-usd-converter.git

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Andres9888/jpy-usd-converter.git
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Enter an amount in the input field (either JPY or USD depending on selected direction)
2. The converted amount will be displayed in the output field
3. Toggle between JPY to USD and USD to JPY conversion using the direction switch
4. Click the refresh button to update the exchange rate

## Error Handling

The application includes robust error handling:

- API failures are managed with multiple fallback mechanisms
- Input validation ensures only valid numbers are accepted
- Clear error messages inform users of any issues
- Ability to manually refresh rates if needed

## License

This project is open source and available under the [MIT License](LICENSE).