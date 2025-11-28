1. What was built
A functional proof-of-concept (POC) Customer Portal MVP that allows customers to:
    - Log in using email and phone number.
    - View a list of their bookings.
    - Access details of a specific booking.
    - View associated file attachments.
    - Send messages related to a booking, with messages persisted in the backend.

The frontend is implemented using Next.js, while the backend uses Express.js. The project integrates at  ServiceM8 API endpoint to fetch company, jobs, or attachments. Additional integrations such as json files are mocked for simplicity.

2. Reasoning behind my approach.
    - 

3. Assumptions made
    - each user is uniquely identified by email + phone number.
    - Only logged-in users can access bookings and messages.
    - File attachments are accessible via URLs provided by ServiceM8 and can be downloaded  if it's existing.
    - Added a session and authentication for user submitting message.

4. Potential improvements
    - Implement full JWT-based authentication and session handling.
    - Persist data in a database (e.g., PostgreSQL, MongoDB) instead of in-memory storage.
    - Add unit and integration tests for both frontend and backend.
    - Expand ServiceM8 integration to cover multiple endpoints (bookings, clients, invoices).
    - Improve error handling and validation on both frontend and backend.
    - Fully optimized the hooks.

5. How AI assisted the workflow
    - Help me assist on setting up the backend and frontend.
    - Give me insights and clarity on how I can create a first api that fetches user's data from company.json.
    - Assists me on maintaining a neat code, seperate render functions to the controller functions.
    - Give some recommendation how can I use OOP properly, query and maximize the purpose of the hooks.

So far, I have really enjoyed integrating the ServiceM8 API. It provided me with in-depth knowledge of how real-time services operate and are delivered to customers. I also gained valuable experience with Next.js, which gave me a comprehensive view of how easily a frontend framework can manage routing, server-side rendering, and dynamic data fetching. I look forward to exploring more advanced features and maximizing Next.js’s capabilities in future projects.