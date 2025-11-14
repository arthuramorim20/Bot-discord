import { ExtendedClient } from "./structs/ExtendedClient";
import { MathCommand } from "./commands/math";
import { Interaction } from "discord.js";
import eventReady from "./events/eventsReady";

class BotClient {
  private client: ExtendedClient;
  private token: string;
  private commands: Map<string, MathCommand>;

  constructor() {
    this.client = new ExtendedClient();
    this.token = process.env.BOT_TOKEN!;
    this.commands = new Map();
  }

  loadCommands() {
    const mathCommand = new MathCommand();

    // Registro local (execução)
    this.commands.set(mathCommand.data.name, mathCommand);

    // Registro no ExtendedClient (deploy)
    this.client.commands.set(mathCommand.data.name, mathCommand);
  }

  setupEvents() {
    this.client.on("interactionCreate", (interaction: Interaction) => {
      if (interaction.isChatInputCommand()) {
        const command = this.commands.get(interaction.commandName);
        if (command) command.execute(interaction);
      } else if (interaction.isButton()) {
        const command = this.commands.get("math");
        if (command) command.handleButton(interaction);
      } else if (interaction.isModalSubmit()) {
        const command = this.commands.get("math");
        if (command) command.handleModalSubmit(interaction);
      }
    });

    // EVENTO READY → agora está chamando deployCommands()
    this.client.on("ready", () => eventReady(this.client));
  }

  start() {
    if (!this.token) throw new Error("Missing Token");

    console.log(
      "ENV:",
      process.env.BOT_TOKEN!,
      process.env.CLIENT_ID,
      process.env.GUILD_ID,
    );

    this.loadCommands();
    this.setupEvents();

    // Login do bot
    this.client.login(this.token);
  }
}

const bot = new BotClient();
bot.start();
