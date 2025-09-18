# Baby Shower Invitation App

This is a web application for a baby shower invitation. It allows guests to see the event details, and confirm their attendance.

## Features

*   **Event Details:** Displays the date, time, and location of the baby shower.
*   **Image Carousel:** Shows a carousel of images.
*   **Interactive Map:** Displays a map with the location of the event.
*   **RSVP Form:** Guests can confirm their attendance by filling out a form with their name. The application prevents duplicate entries.
*   **Background Music:** Plays background music automatically.

## Technologies Used

*   **Frontend:** React with Vite
*   **Backend:** Firebase (Firestore for the database)
*   **Styling:** Tailwind CSS (as seen in App.jsx)

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd baby-shower-app
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

## Usage

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and go to `http://localhost:5173` (or the address shown in the terminal).

## Build for Production

To create a production build of the application, run the following command:

```bash
npm run build
```

This will create a `dist` folder with the optimized files for production.

## Linting

To check the code for linting errors, run:

```bash
npm run lint
```
