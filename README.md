# 🖥️ API Callback Terminal Script – Node.js

A single-file Node.js script to interact with a test API using **HTTP requests** and **callback handling**. Everything runs from the terminal — no GUI required.

---

## ⚙️ Requirements

- Node.js **v18+** (native `fetch()` support)  
- Internet connection  
- **ngrok** (to expose local server for callback)

---

## 📂 Files
```
.
├── script.js # Main Node.js script
└── README.md # This documentation
```


---

## 🚀 Setup & Run

### 1. Expose local server using ngrok

```bash
ngrok http 5050
```

```code
const CALLBACK_URL = "https://abc1234.ngrok.io/callback";
```


### In other terminal


```bash
node task.js
```