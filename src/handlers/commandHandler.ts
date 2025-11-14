import fs from "fs";
import path from "path";

export async function loadCommands(client: ExtendedClient) {
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  for (const file of commandFiles) {
    const { default: CommandClass } = await import(`${commandsPath}/${file}`);
    const command = new CommandClass();

    client.commands.set(command.data.name, command);
  }

  console.log(
    "✔️ Comandos carregados:",
    client.commands.map((c) => c.data.name),
  );
}
