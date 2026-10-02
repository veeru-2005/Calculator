# Smart Calculator

## Project Description

A beautiful, responsive, and robust calculator web application built using HTML, CSS and Vanilla JavaScript. It features a modern dark/light mode UI, a full calculation history saved to LocalStorage, and complete keyboard support for quick desktop use.

## Features

- Basic Arithmetic: Addition, Subtraction, Multiplication, Division.
- Advanced Operators: Decimal calculations, Percentage, Positive/negative toggle.
- Corrections: Delete (backspace) and Clear (AC).
- Keyboard Support: Fully operational via keyboard with visual feedback.
- Calculation History: Shows a history of recent calculations, persisting across sessions.
- Data Persistence: Uses LocalStorage for theme preference and calculation history.
- Themes: Smooth toggle between Dark Mode and Light Mode.
- Responsive Design: Adapts seamlessly to mobile, tablet, and desktop views.
- Error Handling: Gracefully handles division by zero and invalid inputs.
- Accessibility: Semantic HTML, aria-labels, and contrast-aware color palette.

## Technologies

- HTML5
- CSS3 (Variables, Flexbox, Grid, Transitions)
- Vanilla JavaScript (ES6)
- LocalStorage API

## How to Run

1. Clone or download this repository.
2. Open the `calculator` folder.
3. Simply double-click on `index.html` to open it in your default web browser. No local server or build tools are required!

## Project Structure

```text
calculator/
│
├── index.html       # Main HTML file structure
├── README.md        # Project documentation
│
├── css/
│   └── style.css    # Styling, theming, and layout
│
└── js/
    └── script.js    # Calculator logic, events, and LocalStorage
```

## Keyboard Shortcuts

- `0` - `9`: Numbers
- `.` : Decimal point
- `+`, `-`, `*`, `/`: Arithmetic operators
- `Enter` or `=`: Calculate Result
- `Backspace` or `Delete`: Delete last character
- `Escape`: All Clear (AC)
- `%`: Percentage

---
*Created for a college assignment with focus on clean UI/UX and robust functionality.*
