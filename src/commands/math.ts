import {
  ModalSubmitInteraction,
  ChatInputCommandInteraction,
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

import { BaseCommand } from "./BaseCommands";
import { StateManager } from "../utils/stateManager";

const stateManager = new StateManager();

// 🔹 EMBED INICIAL
const initialEmbed = new EmbedBuilder()
  .setTitle("Calculadora")
  .setDescription("Clique nos botões para inserir os números.");

// 🔹 BOTÕES
const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("math_set_num1")
    .setLabel("Número 1")
    .setStyle(ButtonStyle.Primary),

  new ButtonBuilder()
    .setCustomId("math_set_num2")
    .setLabel("Número 2")
    .setStyle(ButtonStyle.Primary),

  new ButtonBuilder()
    .setCustomId("math_calculate")
    .setLabel("Calcular")
    .setStyle(ButtonStyle.Success),
);

// 🔹 MODAL PARA NUM1
const modalNum1 = new ModalBuilder()
  .setCustomId("math_modal_num1")
  .setTitle("Digite o Número 1")
  .addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("math_input_number")
        .setLabel("Número 1")
        .setStyle(TextInputStyle.Short),
    ),
  );

// 🔹 MODAL PARA NUM2
const modalNum2 = new ModalBuilder()
  .setCustomId("math_modal_num2")
  .setTitle("Digite o Número 2")
  .addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("math_input_number")
        .setLabel("Número 2")
        .setStyle(TextInputStyle.Short),
    ),
  );

export class MathCommand extends BaseCommand {
  public userSession: StateManager;

  constructor() {
    super("math", "Multiplica dois números");
    this.userSession = stateManager;
  }

  async execute(interaction: ChatInputCommandInteraction) {
    const reply = await interaction.reply({
      embeds: [initialEmbed],
      components: [row],
      fetchReply: true,
    });

    this.userSession.createSession(reply.id, interaction.user.id);

    // Desativa botões após 60 segundos
    setTimeout(async () => {
      try {
        const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          ...row.components.map((btn) =>
            ButtonBuilder.from(btn as ButtonBuilder).setDisabled(true),
          ),
        );

        await reply.edit({ components: [disabledRow] });
        this.userSession.deleteState(reply.id);
      } catch (err) {
        console.error("Erro ao desativar os botões:", err);
      }
    }, 60_000);
  }

  async handleButton(interaction: ButtonInteraction) {
    if (interaction.customId === "math_set_num1") {
      return interaction.showModal(modalNum1);
    }

    if (interaction.customId === "math_set_num2") {
      return interaction.showModal(modalNum2);
    }

    if (interaction.customId === "math_calculate") {
      return this.handleCalculate(interaction);
    }
  }

  async handleModalSubmit(interaction: ModalSubmitInteraction) {
    const rawValue = interaction.fields.getTextInputValue("math_input_number");
    const number = parseFloat(rawValue.replace(",", "."));
    const messageId = interaction.message?.id;

    if (isNaN(number)) {
      return interaction.reply({
        content: "❌ Entrada inválida. Envie um número.",
        ephemeral: true,
      });
    }

    // Verifica qual modal chamou
    const key: "num1" | "num2" =
      interaction.customId === "math_modal_num1" ? "num1" : "num2";

    const updated = this.userSession.updateSession(messageId!, key, number);

    if (updated.error) {
      return interaction.reply({
        content: "Erro ao atualizar sessão.",
        ephemeral: true,
      });
    }

    return interaction.reply({
      content: `Número **${key}** definido como **${number}**.`,
      ephemeral: true,
    });
  }

  async handleCalculate(interaction: ButtonInteraction) {
    const messageId = interaction.message.id;
    const state = this.userSession.getSession(messageId);

    if (!state.data || state.data.num1 == null || state.data.num2 == null) {
      return interaction.reply({
        content: "⚠️ Defina ambos os números antes de calcular.",
        ephemeral: true,
      });
    }

    const result = state.data.num1 * state.data.num2;

    this.userSession.deleteState(messageId);

    return interaction.reply({
      content: `🧮 Resultado: **${result}**`,
      ephemeral: true,
    });
  }
}
