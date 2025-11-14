import { ExtendedClient } from "@/structs/ExtendedClient";
import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export async function deployCommands(client: ExtendedClient) {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

  const body = client.commands.map((cmd) => cmd.data.toJSON());

  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID!,
      process.env.GUILD_ID!,
    ),
    { body },
  );

  console.log("🌐 Slash commands registrados!");
}
