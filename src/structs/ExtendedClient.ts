import { BaseCommand } from "@/commands/BaseCommands";
import {
  BitFieldResolvable,
  Client,
  Collection,
  GatewayIntentsString,
  IntentsBitField,
  Partials,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

export class ExtendedClient extends Client {
  public commands: Collection<string, BaseCommand> = new Collection();
  constructor() {
    super({
      intents: Object.keys(IntentsBitField.Flags) as BitFieldResolvable<
        GatewayIntentsString,
        number
      >,
      partials: [
        Partials.Poll,
        Partials.User,
        Partials.Channel,
        Partials.Message,
        Partials.GuildScheduledEvent,
        Partials.Reaction,
        Partials.PollAnswer,
        Partials.ThreadMember,
        Partials.SoundboardSound,
      ],
    });
  }

  public initBot() {
    this.login(process.env.BOT_TOKEN);
  }
}
