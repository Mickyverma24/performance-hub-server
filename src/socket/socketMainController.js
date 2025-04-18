const registery = new Map();
const socketsMain = (io) => {
  io.on("connection", (socket) => {
    const auth = socket.handshake.auth;
    if (auth.clientType === "cli") {
      // then we will join cli client.
      socket.join("pscli");
      console.log("Some cli client joined");
    } else if (auth.clientType === "frontend") {
      // join frontend
      socket.join("frontend");
      console.log("Someone from frontend is watching");
      if (registery.has(auth.token)) {
        registery.get(auth.token).push(socket.id);
      } else {
        registery.set(auth.token, [socket.id]);
      }
    } else {
      socket.disconnect();
      console.log("You are out of here");
      // write here disconnect logic from redis and map
    }
    socket.emit(
      "welcome",
      "Welcome to our cluser driven socket.io server for performance moniter "
    );
    socket.on("prefData", (data) => {
      // get the rooms id from registery which are connected and want to get the data
      const toSend = registery.get(auth.token);
      if (!toSend) {
        console.log(
          "No client is connect either no one is watching from frontend.."
        );
        // stoping recieving data from them if no one is watching ....
      } else {
        console.log("Sendeing data to respective frontend..");
        socket.to(toSend).emit("prefData", data);
      }
    });
  });
};

module.exports = socketsMain 
