// API Configuration for Chatbot
// Choose one of these APIs by uncommenting the relevant section

// Option 1: OpenAI (GPT) Configuration
// Replace YOUR_OPENAI_API_KEY with your actual API key
// const API_CONFIG = {
//   provider: 'openai',
//   endpoint: 'https://api.openai.com/v1/chat/completions',
//   apiKey: 'YOUR_OPENAI_API_KEY',
//   modelName: 'gpt-3.5-turbo',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
//   },
//   formatRequest: function(messages) {
//     return {
//       model: this.modelName,
//       messages: messages,
//       temperature: 0.7,
//       max_tokens: 1000
//     };
//   },
//   parseResponse: function(response) {
//     return response.choices[0].message.content;
//   }
// };

// Option 2: Hugging Face Inference API
// Replace YOUR_HUGGINGFACE_API_KEY with your actual API key
// const API_CONFIG = {
//   provider: 'huggingface',
//   endpoint: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
//   apiKey: 'YOUR_HUGGINGFACE_API_KEY',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Bearer YOUR_HUGGINGFACE_API_KEY'
//   },
//   formatRequest: function(messages) {
//     // Format messages into a prompt string for Llama
//     let prompt = '';
//     messages.forEach(msg => {
//       if (msg.role === 'user') {
//         prompt += `User: ${msg.content}\n`;
//       } else if (msg.role === 'assistant') {
//         prompt += `Assistant: ${msg.content}\n`;
//       }
//     });
//     prompt += 'Assistant: ';
//     
//     return {
//       inputs: prompt,
//       parameters: {
//         max_new_tokens: 1000,
//         temperature: 0.7,
//         top_p: 0.9
//       }
//     };
//   },
//   parseResponse: function(response) {
//     // Extract generated text from Hugging Face response
//     return response[0].generated_text;
//   }
// };

// Option 3: Mock API (for development and testing without real API calls)
const API_CONFIG = {
    provider: 'mock',
    endpoint: null,
    apiKey: null,
    formatRequest: function(messages) {
      return messages;
    },
    parseResponse: function(mockResponse) {
      return mockResponse;
    },
    mockResponses: {
      debug: [
        "I see the issue. You're using a for loop to iterate through all items, but you're not checking if price or quantity are valid numbers. Try adding validation like this:\n```\nfunction calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    const price = parseFloat(items[i].price) || 0;\n    const quantity = parseInt(items[i].quantity) || 0;\n    total += price * quantity;\n  }\n  return total;\n}```",
        "Looking at your code, the potential issue might be that you're not handling edge cases. What if items is null or undefined? You should add a check at the beginning: \n```\nfunction calculateTotal(items) {\n  if (!items || !Array.isArray(items)) return 0;\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price * items[i].quantity;\n  }\n  return total;\n}```"
      ],
      explain: [
        "This function `calculateTotal` takes an array of item objects and calculates the total cost by multiplying each item's price by its quantity and summing them up. It uses a basic for-loop to iterate through each item in the array, accesses the price and quantity properties, multiplies them together, and adds to a running total variable. Finally, it returns the total amount.",
        "Let me break down this function:\n1. It takes an array of objects as input\n2. It initializes a total variable to 0\n3. It loops through each item in the array\n4. For each item, it multiplies the price by quantity and adds to the total\n5. It returns the final sum\n\nThis is a common pattern used in e-commerce applications to calculate cart or order totals."
      ],
      optimize: [
        "Your calculate function could be optimized using a more modern approach:\n```\nfunction calculateTotal(items) {\n  return items.reduce((total, item) => total + (item.price * item.quantity), 0);\n}```\nThis uses the array reduce method which is more concise and often considered more readable by modern JavaScript developers.",
        "For better performance, especially with large arrays, consider these optimizations:\n1. Use array.reduce instead of a for loop: `return items.reduce((sum, item) => sum + item.price * item.quantity, 0);`\n2. Add early validation to avoid unnecessary processing\n3. Use destructuring for cleaner code: `return items.reduce((sum, {price, quantity}) => sum + price * quantity, 0);`"
      ],
      generic: [
        "Looking at your code, I see you've implemented a shopping cart total calculator. This looks quite straightforward and should work for basic cases. Some considerations:\n\n1. What happens if an item has a missing price or quantity?\n2. Do you need to handle currency formatting?\n3. Have you considered adding tax calculations?\n\nWould you like me to expand on any of these points?",
        "Your function seems to work correctly for calculating order totals. If you plan to use this in a production environment, consider adding:\n\n1. Input validation\n2. Error handling\n3. Support for discounts or promotions\n4. Currency formatting\n\nWhich of these would be most valuable to implement next?"
      ]
    }
  };
  
  // Export the configuration
  export default API_CONFIG;