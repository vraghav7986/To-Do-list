# ✅ Task Manager (TO-DO)

A fully featured task management app with priority levels, due dates, dark mode, drag‑and‑drop reordering, and persistent local storage.

🔗 Live Demo: [https://to-do-list-seven-alpha-93.vercel.app/](https://to-do-list-seven-alpha-93.vercel.app/)

<img width="1916" height="1077" alt="image" src="https://github.com/user-attachments/assets/95034aae-dffb-4b00-aa03-8c8d85ec3612" />
<img width="1909" height="1076" alt="image" src="https://github.com/user-attachments/assets/8e92a267-b642-43db-858c-ae1d88fbe17e" />
<img width="580" height="555" alt="image" src="https://github.com/user-attachments/assets/60b3b56f-a2d0-4e34-9b54-864b34528957" />


## ✨ Features

- **Create tasks** – title, description, due date, priority (Low/Medium/High)
- **Edit tasks** – change any detail after creation
- **Mark complete / active** – toggle task status with a single click
- **Delete completed tasks** – bulk clear using the trash button
- **Drag & drop** – reorder tasks freely
- **Filter tasks** – All / Active / Completed
- **Search tasks** – by title or description (live filtering)
- **Dark / Light theme** – toggle with moon/sun button, remembers preference
- **Local storage** – all tasks and settings survive page refresh
- **Responsive design** – works on desktop, tablet, and mobile

## 🛠️ Technologies

- **HTML5** – semantic structure, modal dialog
- **CSS3** – CSS variables, flexbox, transitions, dark/light themes
- **JavaScript (ES6)** – modules, local storage, drag & drop, DOM manipulation

## 🚀 Live Demo

Try it now: [https://to-do-list-seven-alpha-93.vercel.app/](https://to-do-list-seven-alpha-93.vercel.app/)

## 📦 Local Setup
```bash
# Clone the repository
git clone https://github.com/vraghav7986/To-Do-list.git

# Enter the directory
cd To-Do-list

# Open index.html in your browser (or use a live server)
No build steps, no dependencies – just open and use.

📂 Project Structure
text
To-Do-list/
├── index.html      # Main UI with modal and filters
├── style.css       # Theming, drag & drop styles, responsive layout
├── script.js       # All logic: CRUD, filters, drag & drop, local storage
└── README.md       # This file
💾 Data Persistence
All tasks are saved in localStorage under the key tasks

User preferences (filter and theme) are also stored

Tasks persist across browser sessions

🧩 Usage Highlights
Adding a task
Click the ➕ button in the header

Fill in the modal form (title is required)

Press Save

Editing a task
Click the ✏️ (pencil) icon on any task

Modify any field in the modal

Save your changes

Completing a task
Click the ✅ (checkmark) to mark as complete (strikethrough)

Click the ↩️ (return) to mark as active again

Reordering tasks
Drag any task by grabbing its card

Drop it above or below another task

The new order is saved automatically

Filtering & searching
Use the All / Active / Completed buttons

Type into the Search field to filter by title or description

Dark mode
Click the 🌙 (moon) button – changes to dark mode

Click again (sun) to return to light mode

Preference is remembered next time you visit

Clearing completed tasks
Click the 🗑️ (trash) button in the header – removes all completed tasks

🔮 Future Improvements
Subtasks / checklist inside each task

Recurring tasks (daily, weekly)

Export/import tasks as JSON

Notifications for due dates

Tagging or categories

🤝 Contributing
This is a personal project, but feedback and suggestions are welcome.
Open an issue or submit a pull request on GitHub.

📄 License
MIT © Raghav Verma

📬 Contact
GitHub: @vraghav7986
Live demo: https://to-do-list-seven-alpha-93.vercel.app/


