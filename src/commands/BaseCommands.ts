import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export abstract class BaseCommand {
  public data: SlashCommandBuilder;

  constructor(name: string, description: string) {
    this.data = new SlashCommandBuilder()
      .setName(name.toLowerCase())
      .setDescription(description);
  }

  // Método que OBRIGA a subclasse a implementar
  abstract execute(interaction: ChatInputCommandInteraction): Promise<any>;
}
