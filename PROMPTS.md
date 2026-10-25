# AI Prompts and Conversation Records

## AI Tools Used

ChatGPT was used as a development assistant while building CARDECK, a car dealership inventory management system. Assistance included understanding requirements, implementing functionality, debugging errors, writing tests, improving the frontend, and preparing documentation.

## Prompt Records

**Note:** The prompts below are reconstructed records of the types of requests used during development. They are not verbatim conversation exports.

### Prompt 1 — Understanding the Assignment

I am building a car dealership inventory management system called CARDECK. Help me understand the assignment requirements and break the project into manageable steps. The application should have a frontend, backend REST API, MySQL database, user authentication, and administrator functionality. Explain the features I need to implement and how I can organize the project.

### Prompt 2 — Vehicle Inventory API

Help me implement vehicle inventory functionality using Node.js, Express, and MySQL. I need endpoints to list and search vehicles, filter by category and price, create vehicles, update vehicle details, and delete vehicles. Make sure administrator-only operations are protected by authentication and authorization middleware. Explain the code in a beginner-friendly way.

### Prompt 3 — Vehicle Purchase and Restock

Help me implement purchase and restock functionality for my CARDECK vehicle inventory system. When an authenticated user purchases a vehicle, its available stock should decrease by one. If the vehicle is out of stock, the API should reject the purchase. Restocking should be restricted to administrators and increase the available stock. Help me handle errors and test these behaviors.

### Prompt 4 — Automated Testing and Debugging

Help me write and debug automated tests for my Node.js and Express backend. I need tests for authentication, protected routes, vehicle creation, updating and deletion, database behavior, and purchase and restock operations. Explain how to run the tests, interpret failures, and verify that the expected behavior is correct.

### Prompt 5 — React Frontend and User Interface

Help me develop the CARDECK frontend using React and Vite. I want a car dealership homepage, featured vehicles, vehicle cards, search and filter controls, authentication screens, and an administrator interface for adding, editing, and deleting vehicles. Help me improve the layout and CSS while keeping the existing application functionality working.

### Prompt 6 — README and Project Screenshots

Help me prepare a professional README for my CARDECK GitHub repository. Include the project overview, features, technology stack, local setup instructions, environment variable configuration, test commands, and screenshots of the homepage, inventory, vehicle cards, sign-in page, and administrator management interface. Use relative image paths so screenshots display correctly on GitHub.

## Reflection

ChatGPT was used to assist with understanding requirements, implementation approaches, frontend development, automated testing, debugging, and documentation. Suggestions were reviewed and applied as appropriate, and tests were run locally during development. I am responsible for understanding the submitted code and verifying that the final application works correctly.