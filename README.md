# Main Server for Performance Monitor

This server is responsible for:

- User authentication
- API key management
- Acting as a bridge between server-side clients and frontend clients

## Architecture Overview

![Flow Diagram](/images/flow.png)

### Room Creation & Communication Flow

- The server uses **Node.js cluster module** to utilize all CPU cores.
- **Socket.io** is used for real-time communication.
- **socket.io-sticky** ensures that a client remains connected to the same worker.
- **socket.io-cluster-adapter** enables real-time event sharing between different workers.
- **Redis** is used to:
  - Store and match `socket.id` with the user's API key
  - Create separate rooms for each user's connected clients

In the diagram, multiple server clients belong to two different users. The main goal is to ensure that each user only sees performance data from their own clients on their dashboard.

---

## How It Works

1. **User Registration and API Key**

   - Visit the [Frontend App](https://pmfrontend.netlify.app/login) to sign up or log in.
   - After logging in, an API key will be generated for the user.

2. **Client CLI Installation**

   - Users install the CLI tool from [here](https://github.com/Mickyverma24/client-cli) on their server.
   - To start sending performance data, use the generated API key:
     ```bash
     pmclient.exe connect --auth_key YOUR_API_KEY --host_url HOST_URL_FROM_DASHBOARD
     ```

3. **Sending Performance Data**

   - The CLI sends computer performance data along with:
     - The user’s API key
     - The client type (`cli` for CLI clients or `frontend` for frontend connections)

4. **Data Handling in the Server**

   - When a frontend client connects:
     - Its `socket.id` is registered in Redis with the corresponding API key.
   - When a CLI client sends data:
     - The server retrieves all socket IDs associated with the API key from Redis.
     - Performance data is then sent to all frontend clients connected with the same API key.

5. **Client Disconnection**
   - When a frontend client logs out or disconnects:
     - Its socket ID is removed from Redis.
     - All associated connections are cleaned up.
6. **Frontend idea for sticking to same dashboard of each client**
   - For this purpose i'm using mac address which is coming from client in payload and in frontend while rendering the data of each cli clients data i'm providing data according to their mac address so that metrics get isoloated from other server clients

---

## Summary

Each user receives only their own performance data, securely isolated via API keys and real-time socket communication. Redis ensures fast lookup and broadcasting to the correct set of clients.
