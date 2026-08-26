const response = await fetch("https://api.deepseek.com/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`
  },
  body: JSON.stringify({
    model: "deepseek-v4-flash",
    messages: 
      {
        role: "user",
        content: code
      }
    ]
  })
});