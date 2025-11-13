import { ExtendedClient } from "./structs/ExtendedClient";

const client = new ExtendedClient();

client.initBot();

client.on("ready", () => console.log("tá pronto"));
