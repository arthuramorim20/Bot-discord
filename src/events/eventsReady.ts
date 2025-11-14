import { ExtendedClient } from "../structs/ExtendedClient";
import { deployCommands } from "../handlers/deployCommands";

export default async function eventReady(client: ExtendedClient) {
  console.log(`✅ Logado como ${client.user?.tag}`);
  await deployCommands(client);
}
