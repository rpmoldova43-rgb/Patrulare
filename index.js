console.log("BOT STARTING...");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  ChannelType,
  MessageFlags,
} = require("discord.js");

const {
  DISCORD_TOKEN,
  CLIENT_ID,
  GUILD_ID,
  PANEL_CHANNEL_ID,
  PATROL_START_CHANNEL_ID,
  PATROL_END_CHANNEL_ID,
  PATROL_STATS_CHANNEL_ID,
  PATROL_STATS_MESSAGE_ID,
  GRADE_SUB_CHESTOR_ID,
  GRADE_CHESTOR_ID,
} = process.env;

if (
  !DISCORD_TOKEN ||
  !CLIENT_ID ||
  !GUILD_ID ||
  !PANEL_CHANNEL_ID ||
  !PATROL_START_CHANNEL_ID ||
  !PATROL_END_CHANNEL_ID ||
  !PATROL_STATS_CHANNEL_ID ||
  !PATROL_STATS_MESSAGE_ID ||
  !GRADE_SUB_CHESTOR_ID ||
  !GRADE_CHESTOR_ID
) {
  console.error("❌ Lipsesc variabile în .env");
  process.exit(1);
}

const PANEL_TEMP_DELETE_MS = 5 * 60 * 1000;
const STATS_FILE = path.join(__dirname, "patrol-stats.json");

/* ================= VEHICLE LIST PE GRADE ================= */

const VEHICLES_BY_RANK = {
  agent: [{ label: "Charger", value: "Charger" }],
  agent_principal: [
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
  ],
  agent_sef_adjunct: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
  ],
  agent_sef: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Trx", value: "Trx" },
  ],
  agent_sef_principal: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Trx", value: "Trx" },
  ],
  subinspector: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Trx", value: "Trx" },
  ],
  inspector: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Trx", value: "Trx" },
  ],
  inspector_principal: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Trx", value: "Trx" },
  ],
  subcomisar: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Trx", value: "Trx" },
  ],
  comisar: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Trx", value: "Trx" },
  ],
  comisar_sef: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Trx", value: "Trx" },
  ],
  sub_chestor: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Bugati", value: "Bugati" },
    { label: "Trx", value: "Trx" },
  ],
  chestor_general: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Trx", value: "Trx" },
    { label: "Bugati", value: "Bugati" },
  ],
};

/* ================= ROLE IDS ================= */

const RANK_ROLES = {
  agent: "1479937563467845722",
  agent_principal: "1479937860357591224",
  agent_sef_adjunct: "1479937949809377404",
  agent_sef: "1479938054259998984",
  agent_sef_principal: "1479938118491574534",
  subinspector: "1479938188524130539",
  inspector: "1479938247554502867",
  inspector_principal: "1479938306580938784",
  subcomisar: "1479938369101234217",
  comisar: "1479938441096597625",
  comisar_sef: "1479938499057680406",
  sub_chestor: "1481376606508285952",
  chestor_general: "1474582052312711278",
};

/* ================= STORAGE ================= */

const pendingPatrols = new Map();
const activePatrols = new Map();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

/* ================= HELPERS ================= */

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

function formatDurationShort(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

async function sendTempMessage(channel, payload) {
  const sent = await channel.send(payload);
  setTimeout(() => {
    sent.delete().catch(() => {});
  }, PANEL_TEMP_DELETE_MS);
  return sent;
}

function canViewPatrolStats(member) {
  if (!member?.roles?.cache) return false;
  return (
    member.roles.cache.has(GRADE_SUB_CHESTOR_ID) ||
    member.roles.cache.has(GRADE_CHESTOR_ID)
  );
}

function readStats() {
  try {
    if (!fs.existsSync(STATS_FILE)) return {};
    return JSON.parse(fs.readFileSync(STATS_FILE, "utf8"));
  } catch (err) {
    console.error("❌ Eroare la citirea patrol-stats.json:", err);
    return {};
  }
}

function writeStats(data) {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Eroare la scrierea patrol-stats.json:", err);
  }
}

function addPatrolStats(patrolData, durationMs) {
  const allStats = readStats();
  const userId = patrolData.officerId;

  if (!allStats[userId]) {
    allStats[userId] = {
      officerId: patrolData.officerId,
      officerTag: patrolData.officerTag,
      officerName: patrolData.officerName,
      patrolCount: 0,
      totalMs: 0,
      lastPatrolAt: null,
    };
  }

  allStats[userId].officerTag = patrolData.officerTag;
  allStats[userId].officerName = patrolData.officerName;
  allStats[userId].patrolCount += 1;
  allStats[userId].totalMs += durationMs;
  allStats[userId].lastPatrolAt = Date.now();

  writeStats(allStats);
}

function buildStatsEmbed(entries) {
  const totalHoursMs = entries.reduce((sum, entry) => sum + (entry.totalMs || 0), 0);
  const totalPatrols = entries.reduce((sum, entry) => sum + (entry.patrolCount || 0), 0);

  const embed = new EmbedBuilder()
    .setColor(0x2b5cff)
    .setTitle("📊 Statistica patrulelor - Poliție")
    .addFields(
      { name: "👮 Polițiști înregistrați", value: String(entries.length), inline: true },
      { name: "🚓 Patrule totale", value: String(totalPatrols), inline: true },
      { name: "⏱️ Ore totale", value: formatDurationShort(totalHoursMs), inline: true }
    )
    .setFooter({ text: "Moldova RP • Mesaj automat actualizat" })
    .setTimestamp();

  if (!entries.length) {
    embed.setDescription("Nu există încă patrule salvate în statistică.");
    return embed;
  }

  const topLines = entries.slice(0, 25).map((entry, index) => {
    return `**${index + 1}.** <@${entry.officerId}> — **${entry.patrolCount || 0}** patrule • **${formatDurationShort(entry.totalMs || 0)}**`;
  });

  embed.setDescription(topLines.join("\n"));
  return embed;
}

function buildSingleOfficerStatsEmbed(entry, position, totalOfficers) {
  const avgMs = entry.patrolCount > 0 ? Math.floor(entry.totalMs / entry.patrolCount) : 0;

  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("👮 Statistica unui polițist")
    .addFields(
      { name: "Polițist", value: `<@${entry.officerId}>`, inline: true },
      { name: "Poziție în top", value: `#${position} din ${totalOfficers}`, inline: true },
      { name: "Patrule efectuate", value: String(entry.patrolCount || 0), inline: true },
      { name: "Timp total", value: formatDuration(entry.totalMs || 0), inline: true },
      { name: "Medie / patrulă", value: formatDuration(avgMs), inline: true },
      {
        name: "Ultima patrulă",
        value: entry.lastPatrolAt ? `<t:${Math.floor(entry.lastPatrolAt / 1000)}:f>` : "Nu există",
        inline: true,
      }
    )
    .setFooter({ text: "Moldova RP • Statistici patrulare" })
    .setTimestamp();
}

async function updatePatrolStatsMessage(guild) {
  try {
    const statsChannel = await guild.channels.fetch(PATROL_STATS_CHANNEL_ID).catch(() => null);

    if (!statsChannel || statsChannel.type !== ChannelType.GuildText) {
      console.log("❌ Canalul de statistică nu a fost găsit sau nu este text.");
      return;
    }

    const stats = readStats();
    const entries = Object.values(stats).sort((a, b) => (b.totalMs || 0) - (a.totalMs || 0));
    const embed = buildStatsEmbed(entries);

    let statsMessage = null;

    if (PATROL_STATS_MESSAGE_ID) {
      statsMessage = await statsChannel.messages.fetch(PATROL_STATS_MESSAGE_ID).catch(() => null);
    }

    if (!statsMessage) {
      console.log("⚠️ Mesajul de statistică nu a fost găsit. Creez unul nou...");

      statsMessage = await statsChannel.send({
        content: "📊 Statistica patrulelor",
        embeds: [embed],
      });

      console.log(`✅ Mesaj statistică nou creat. Pune acest ID în .env la PATROL_STATS_MESSAGE_ID: ${statsMessage.id}`);
      return;
    }

    await statsMessage.edit({
      content: "📊 Statistica patrulelor",
      embeds: [embed],
      components: [],
    });

    console.log("✅ Mesajul fix de statistică a fost actualizat.");
  } catch (err) {
    console.error("❌ Eroare la update mesaj fix statistică:", err);
  }
}

function getVehiclesForMember(member) {
  if (!member?.roles?.cache) return [];

  if (member.roles.cache.has(RANK_ROLES.chestor_general)) return VEHICLES_BY_RANK.chestor_general;
  if (member.roles.cache.has(RANK_ROLES.sub_chestor)) return VEHICLES_BY_RANK.sub_chestor;
  if (member.roles.cache.has(RANK_ROLES.comisar_sef)) return VEHICLES_BY_RANK.comisar_sef;
  if (member.roles.cache.has(RANK_ROLES.comisar)) return VEHICLES_BY_RANK.comisar;
  if (member.roles.cache.has(RANK_ROLES.subcomisar)) return VEHICLES_BY_RANK.subcomisar;
  if (member.roles.cache.has(RANK_ROLES.inspector_principal)) return VEHICLES_BY_RANK.inspector_principal;
  if (member.roles.cache.has(RANK_ROLES.inspector)) return VEHICLES_BY_RANK.inspector;
  if (member.roles.cache.has(RANK_ROLES.subinspector)) return VEHICLES_BY_RANK.subinspector;
  if (member.roles.cache.has(RANK_ROLES.agent_sef_principal)) return VEHICLES_BY_RANK.agent_sef_principal;
  if (member.roles.cache.has(RANK_ROLES.agent_sef)) return VEHICLES_BY_RANK.agent_sef;
  if (member.roles.cache.has(RANK_ROLES.agent_sef_adjunct)) return VEHICLES_BY_RANK.agent_sef_adjunct;
  if (member.roles.cache.has(RANK_ROLES.agent_principal)) return VEHICLES_BY_RANK.agent_principal;
  if (member.roles.cache.has(RANK_ROLES.agent)) return VEHICLES_BY_RANK.agent;

  return [];
}

function buildPanelEmbed() {
  return new EmbedBuilder()
    .setColor(0x1f8b4c)
    .setTitle("🚓 Sistem Patrule Poliție")
    .setDescription(
      [
        "Apasă pe butonul de mai jos pentru a crea o patrulă nouă.",
        "",
        "**Flux creare patrulă:**",
        "1. Selectezi partenerul",
        "2. Selectezi vehiculul",
        "3. Completezi zona și statusul",
        "4. Botul pornește automat timer-ul",
        "5. La final se generează raport automat",
      ].join("\n")
    )
    .setFooter({ text: "Moldova RP • Patrule automate" })
    .setTimestamp();
}

function buildStartEmbed(data) {
  return new EmbedBuilder()
    .setColor(0x00a8ff)
    .setTitle("🚔 Patrulă începută")
    .addFields(
      { name: "👮 Ofițer", value: `<@${data.officerId}>`, inline: true },
      { name: "🤝 Partener", value: data.partnerLabel, inline: true },
      { name: "🚓 Vehicul", value: data.vehicle, inline: true },
      { name: "📍 Zona", value: data.zone, inline: true },
      { name: "📡 Status", value: data.status, inline: true },
      { name: "⏱️ Început", value: `<t:${Math.floor(data.startedAt / 1000)}:f>`, inline: false }
    )
    .setFooter({ text: "Moldova RP • Patrulă activă" })
    .setTimestamp();
}

function buildClosedStartEmbed(data, closedBy, durationText) {
  return new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("🛑 Patrulă închisă")
    .addFields(
      { name: "👮 Ofițer", value: `<@${data.officerId}>`, inline: true },
      { name: "🤝 Partener", value: data.partnerLabel, inline: true },
      { name: "🚓 Vehicul", value: data.vehicle, inline: true },
      { name: "📍 Zona", value: data.zone, inline: true },
      { name: "📡 Status", value: data.status, inline: true },
      { name: "⏱️ Început", value: `<t:${Math.floor(data.startedAt / 1000)}:f>`, inline: false },
      { name: "🕒 Durată totală", value: durationText, inline: true },
      { name: "🔒 Închisă de", value: `<@${closedBy}>`, inline: true }
    )
    .setFooter({ text: "Moldova RP • Patrulă închisă" })
    .setTimestamp();
}

function buildEndReportEmbed(data, closedBy, durationText) {
  return new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle("📋 Raport automat patrulă")
    .addFields(
      { name: "👮 Ofițer", value: `<@${data.officerId}>`, inline: true },
      { name: "🤝 Partener", value: data.partnerLabel, inline: true },
      { name: "🚓 Vehicul", value: data.vehicle, inline: true },
      { name: "📍 Zona", value: data.zone, inline: true },
      { name: "📡 Status inițial", value: data.status, inline: true },
      { name: "🕒 Început", value: `<t:${Math.floor(data.startedAt / 1000)}:f>`, inline: true },
      { name: "🛑 Final", value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true },
      { name: "⏱️ Durată patrulă", value: durationText, inline: true },
      { name: "🔒 Închisă de", value: `<@${closedBy}>`, inline: true }
    )
    .setFooter({ text: "Moldova RP • Patrule terminate" })
    .setTimestamp();
}

/* ================= SLASH COMMANDS ================= */

const commands = [
  new SlashCommandBuilder()
    .setName("patrula-panel")
    .setDescription("Trimite panelul pentru sistemul de patrule")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder()
    .setName("statistica-patrule")
    .setDescription("Actualizează mesajul fix cu statistica patrulelor"),
  new SlashCommandBuilder()
    .setName("statistica-politist")
    .setDescription("Vezi statistica unui polițist")
    .addUserOption((option) =>
      option
        .setName("politist")
        .setDescription("Selectează polițistul")
        .setRequired(true)
    ),
].map((cmd) => cmd.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

  try {
    console.log("🔄 Se înregistrează slash commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Slash commands înregistrate.");
  } catch (error) {
    console.error("❌ Eroare la înregistrarea comenzilor:", error);
  }
}

/* ================= READY ================= */

client.once("clientReady", async () => {
  console.log(`✅ Bot pornit ca ${client.user.tag}`);
  await registerCommands();

  const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
  if (guild) {
    await updatePatrolStatsMessage(guild);
  }
});

/* ================= INTERACTIONS ================= */

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "patrula-panel") {
        if (interaction.channelId !== PANEL_CHANNEL_ID) {
          return interaction.reply({
            content: "❌ Această comandă poate fi folosită doar în canalul de panel.",
            flags: MessageFlags.Ephemeral,
          });
        }

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("patrol_create_start")
            .setLabel("Creează patrulă")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🚔")
        );

        return interaction.reply({
          embeds: [buildPanelEmbed()],
          components: [row],
        });
      }

      if (interaction.commandName === "statistica-patrule") {
        if (!canViewPatrolStats(interaction.member)) {
          return interaction.reply({
            content: "⛔ Doar gradul Sub Chestor sau Chestor poate folosi această comandă.",
            flags: MessageFlags.Ephemeral,
          });
        }

        if (interaction.channelId !== PATROL_STATS_CHANNEL_ID) {
          return interaction.reply({
            content: `❌ Această comandă poate fi folosită doar în <#${PATROL_STATS_CHANNEL_ID}>.`,
            flags: MessageFlags.Ephemeral,
          });
        }

        const statsChannel = await interaction.guild.channels.fetch(PATROL_STATS_CHANNEL_ID).catch(() => null);
        if (!statsChannel || statsChannel.type !== ChannelType.GuildText) {
          return interaction.reply({
            content: "❌ Canalul de statistică nu este valid.",
            flags: MessageFlags.Ephemeral,
          });
        }

        const statsMessage = await statsChannel.messages.fetch(PATROL_STATS_MESSAGE_ID).catch(() => null);
        if (!statsMessage) {
          return interaction.reply({
            content: "❌ Nu am găsit mesajul fix de statistică. Verifică PATROL_STATS_MESSAGE_ID.",
            flags: MessageFlags.Ephemeral,
          });
        }

        await updatePatrolStatsMessage(interaction.guild);

        return interaction.reply({
          content: "✅ Mesajul fix cu statistica patrulelor a fost actualizat.",
          flags: MessageFlags.Ephemeral,
        });
      }

      if (interaction.commandName === "statistica-politist") {
        if (!canViewPatrolStats(interaction.member)) {
          return interaction.reply({
            content: "⛔ Doar gradul Sub Chestor sau Chestor poate folosi această comandă.",
            flags: MessageFlags.Ephemeral,
          });
        }

        if (interaction.channelId !== PATROL_STATS_CHANNEL_ID) {
          return interaction.reply({
            content: `❌ Această comandă poate fi folosită doar în <#${PATROL_STATS_CHANNEL_ID}>.`,
            flags: MessageFlags.Ephemeral,
          });
        }

        const targetUser = interaction.options.getUser("politist", true);
        const stats = readStats();
        const entries = Object.values(stats).sort((a, b) => (b.totalMs || 0) - (a.totalMs || 0));
        const entry = entries.find((x) => x.officerId === targetUser.id);

        if (!entry) {
          return interaction.reply({
            content: `❌ ${targetUser} nu are încă patrule salvate în statistică.`,
            flags: MessageFlags.Ephemeral,
          });
        }

        const position = entries.findIndex((x) => x.officerId === targetUser.id) + 1;

        return interaction.reply({
          embeds: [buildSingleOfficerStatsEmbed(entry, position, entries.length)],
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    if (interaction.isButton() && interaction.customId === "patrol_create_start") {
      const userSelect = new UserSelectMenuBuilder()
        .setCustomId("patrol_select_partner")
        .setPlaceholder("Selectează partenerul de patrulă")
        .setMinValues(1)
        .setMaxValues(1);

      const row = new ActionRowBuilder().addComponents(userSelect);

      return interaction.reply({
        content: "👥 Selectează partenerul din listă:",
        components: [row],
        flags: MessageFlags.Ephemeral,
      });
    }

      if (interaction.isUserSelectMenu() && interaction.customId === "patrol_select_partner") {
        const partnerId = interaction.values[0];

        if (!partnerId) {
          return interaction.update({
            content: "❌ Nu a fost selectat niciun partener.",
            components: [],
          });
        }

        if (partnerId === interaction.user.id) {
          return interaction.update({
            content: "❌ Nu poți începe o patrulă singur. Selectează un alt polițist ca partener.",
            components: [],
          });
        }

        const creatorMember = await interaction.guild.members.fetch(interaction.user.id).catch(() => null);
        const partnerMember = await interaction.guild.members.fetch(partnerId).catch(() => null);

        if (!creatorMember || !partnerMember) {
          return interaction.update({
            content: "❌ Nu am putut găsi unul dintre membrii selectați pe server.",
            components: [],
          });
        }

        const vehicles = getVehiclesForMember(creatorMember);

        if (!vehicles.length) {
          return interaction.update({
            content: "❌ Nu ai niciun vehicul disponibil pentru gradul tău. Verifică rolurile setate în bot.",
            components: [],
          });
        }

        pendingPatrols.set(interaction.user.id, {
          partnerId,
          partnerLabel: `<@${partnerId}>`,
        });

        const vehicleMenu = new StringSelectMenuBuilder()
          .setCustomId("patrol_select_vehicle")
          .setPlaceholder("Selectează vehiculul de patrulă")
          .addOptions(vehicles);

        const row = new ActionRowBuilder().addComponents(vehicleMenu);

        await interaction.update({
          content: `✅ Partener selectat: <@${partnerId}>\n\n🚓 Acum selectează vehiculul:`,
          components: [row],
        });
        return;
      }

    if (interaction.isStringSelectMenu() && interaction.customId === "patrol_select_vehicle") {
      const data = pendingPatrols.get(interaction.user.id);

      if (!data) {
        return interaction.update({
          content: "❌ Sesiunea a expirat. Apasă din nou pe butonul de creare patrulă.",
          components: [],
        });
      }

      data.vehicle = interaction.values[0];
      pendingPatrols.set(interaction.user.id, data);

      const modal = new ModalBuilder()
        .setCustomId("patrol_modal_details")
        .setTitle("Detalii patrulă");

      const zoneInput = new TextInputBuilder()
        .setCustomId("zone")
        .setLabel("Zona")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex: Spital / Vinewood / Centru / Vespuci / Groove")
        .setRequired(true)
        .setMaxLength(100);

      const statusInput = new TextInputBuilder()
        .setCustomId("status")
        .setLabel("Status")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex: Patrulă / Filtru / Control trafic")
        .setRequired(true)
        .setMaxLength(100);

      modal.addComponents(
        new ActionRowBuilder().addComponents(zoneInput),
        new ActionRowBuilder().addComponents(statusInput)
      );

      return interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === "patrol_modal_details") {
      const temp = pendingPatrols.get(interaction.user.id);

      if (!temp || !temp.partnerId || !temp.vehicle) {
        return interaction.reply({
          content: "❌ Sesiunea de creare a patrulei a expirat. Reîncearcă.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const zone = interaction.fields.getTextInputValue("zone");
      const status = interaction.fields.getTextInputValue("status");

      const startChannel = await client.channels.fetch(PATROL_START_CHANNEL_ID).catch(() => null);
      const panelChannel = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);

      if (!startChannel || startChannel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: "❌ Canalul pentru patrule începute nu este valid.",
          flags: MessageFlags.Ephemeral,
        });
      }

      if (!panelChannel || panelChannel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: "❌ Canalul de panel nu este valid.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const startedAt = Date.now();
      const patrolData = {
        officerId: interaction.user.id,
        officerTag: interaction.user.tag,
        officerName: interaction.user.username,
        partnerId: temp.partnerId,
        partnerLabel: temp.partnerLabel,
        vehicle: temp.vehicle,
        zone,
        status,
        startedAt,
      };

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`patrol_close:${interaction.user.id}`)
          .setLabel("Închide patrula")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🛑")
      );

      const patrolMsg = await startChannel.send({
        embeds: [buildStartEmbed(patrolData)],
        components: [buttons],
      });

      activePatrols.set(patrolMsg.id, {
        ...patrolData,
        startMessageId: patrolMsg.id,
      });

      pendingPatrols.delete(interaction.user.id);

      await sendTempMessage(panelChannel, {
        content:
          `✅ <@${interaction.user.id}> a început o patrulă cu ${temp.partnerLabel}.\n` +
          `📍 Zona: **${zone}**\n` +
          `🚓 Vehicul: **${temp.vehicle}**\n` +
          `🕒 Acest mesaj se va șterge automat în 2 minute.`,
      });

      return interaction.reply({
        content: `✅ Patrula a fost pornită.\n📢 Mesajul a fost trimis în <#${PATROL_START_CHANNEL_ID}>.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    if (interaction.isButton() && interaction.customId.startsWith("patrol_close:")) {
      const ownerId = interaction.customId.split(":")[1];
      const patrolMessageId = interaction.message.id;
      const patrolData = activePatrols.get(patrolMessageId);

      if (!patrolData) {
        return interaction.reply({
          content: "❌ Nu am găsit datele acestei patrule.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const canClose =
        interaction.user.id === ownerId ||
        interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) ||
        interaction.member.permissions.has(PermissionFlagsBits.Administrator);

      if (!canClose) {
        return interaction.reply({
          content: "⛔ Doar creatorul patrulei sau conducerea o poate închide.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const endChannel = await client.channels.fetch(PATROL_END_CHANNEL_ID).catch(() => null);
      if (!endChannel || endChannel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: "❌ Canalul pentru patrule terminate nu este valid.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const durationMs = Date.now() - patrolData.startedAt;
      const durationText = formatDuration(durationMs);
      addPatrolStats(patrolData, durationMs);

      const existingButton = interaction.message.components?.[0]?.components?.[0];
      const disabledRow = new ActionRowBuilder().addComponents(
        existingButton
          ? ButtonBuilder.from(existingButton).setDisabled(true)
          : new ButtonBuilder()
              .setCustomId("patrol_closed")
              .setLabel("Patrulă închisă")
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(true)
      );

      await interaction.update({
        embeds: [buildClosedStartEmbed(patrolData, interaction.user.id, durationText)],
        components: [disabledRow],
      });

      await endChannel.send({
        embeds: [buildEndReportEmbed(patrolData, interaction.user.id, durationText)],
      });

      activePatrols.delete(patrolMessageId);
      await updatePatrolStatsMessage(interaction.guild);
      return;
    }
  } catch (err) {
    console.error("❌ Eroare interactionCreate:", err);

    const errorPayload = {
      content: "❌ A apărut o eroare.",
      flags: MessageFlags.Ephemeral,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorPayload).catch(() => {});
    } else {
      await interaction.reply(errorPayload).catch(() => {});
    }
  }
});

client.login(DISCORD_TOKEN);
