const socketsMain = (io, socketRegisterClient) => {
  io.on("connection", async (socket) => {
    // taking auth details from socket
    const auth = socket.handshake.auth;

    if (!auth.clientType || !auth.token) {
      console.log("Missing clientType or token. Disconnecting...");
      socket.disconnect();
      return;
    }

    // Joining client room according to their type
    if (auth.clientType === "cli") {
      socket.join("cli");
      console.log("Some CLI client joined:", socket.id);
    } else if (auth.clientType === "frontend") {
      socket.join("frontend");
      console.log("Frontend client joined:", socket.id);
      // Registering frontend clients.
      await socketRegisterClient.set(auth.token, socket.id);
    } else {
      console.log("Unknown client type:", auth.clientType);
      socket.disconnect();
    }

    socket.emit(
      "welcome",
      "Welcome to the performance monitoring server just down our cli match api key and run..."
    );

    // CLI sends data to frontends matching its token
    socket.on("prefData", async (data) => {
      if (auth.clientType !== "cli") return;

      const frontendSockets = await socketRegisterClient.get(auth.token);

      if (!frontendSockets || frontendSockets.length === 0) {
        console.log("No frontend clients watching for token:", auth.token);
        return;
      }

      console.log("Sending data to frontend clients:", frontendSockets);
      // logic behind it --> may user from same account can be logged in. and watching
      frontendSockets.forEach((id) => {
        socket.to(id).emit("prefData", data);
      });
    });

    socket.on("disconnect", async () => {
      const token = auth.token;
      if (!token) return;

      // Remove this socket from the registry
      if (await socketRegisterClient.has(token, socket.id)) {
        await socketRegisterClient.remove(token, socket.id);
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = socketsMain;
