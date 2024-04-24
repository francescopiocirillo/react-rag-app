const userInput = `{
    "instances": [
      {
              "prompt": "What is a car?"
          }
    ]
  }`;

fetch("http://localhost:3000/api/answer", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
    },
    body: userInput,
    }).then(
        console.log
    );