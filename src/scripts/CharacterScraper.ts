import { Character } from "../entities/Characters";
import { CharacterInput } from "../types/CharacterInput";
import axios from "axios";
import cheerio from "cheerio";
import logger from "../logger";

const __CLASSES__ = [
  "World",
  "Fighter",
  "Dragonborn",
  "Hwarang",
  "Paladin",
  "Berserker",
  "Scoundrel",
  "Shadow",
  "Ranger",
  "Bard",
  "Spellthief",
  "Wizard",
  "Phoenix",
  "Vampire",
  "Warlock",
  "Arch Magi",
  "Priest",
  "Bishop",
  "Druid",
  "Medic",
  "Crusader",
];

const calculateEXP = (newVita: number, newMana: number) => {
  let experience = 0;
  let vitaCost, manaCost;
  const vitaSells = Math.floor(newVita / 100);
  const manaSells = Math.floor(newMana / 50);
  const vitaSegments = Math.floor((vitaSells - 1000) / 200);
  const manaSegments = Math.floor((manaSells - 1000) / 200);

  if (newVita < 100000) {
    vitaCost = 20;
    experience = vitaSells * 20;
  } else {
    vitaCost = Math.floor(
      Math.floor(newVita / 20000) * 4 - (Math.floor(newVita / 20000) - 6) * 2
    );
    experience =
      vitaSells * 20 +
      ((2 * vitaSegments + 20 + 22) / 2 - 20) * (vitaSegments * 200) +
      (vitaSells - 1000 - vitaSegments * 200) * (vitaCost - 20);
  }

  if (newMana < 50000) {
    manaCost = 20;
    experience += manaSells * 20;
  } else {
    manaCost = Math.floor(
      Math.floor(newMana / 10000) * 4 - (Math.floor(newMana / 10000) - 6) * 2
    );
    experience +=
      manaSells * 20 +
      ((2 * manaSegments + 20 + 22) / 2 - 20) * (manaSegments * 200) +
      (manaSells - 1000 - manaSegments * 200) * (manaCost - 20);
  }

  return experience * 1000000;
};

const updateCharacter = async (characterData: CharacterInput) => {
  const charEntity = await Character.findOne({
    where: { name: characterData.name },
  });

  if (!charEntity) {
    logger.info(`Creating Character ${JSON.stringify(characterData, null, 2)}`);
    await Character.create({ ...characterData }).save();
  } else {
    logger.info(`Updating Character ${JSON.stringify(characterData, null, 2)}`);
    await Character.update({ id: charEntity.id }, { ...characterData }).catch(
      (err) => {
        logger.info(err);
      }
    );
  }
};

export const CharacterScraper = async () => {
  const charArray: CharacterInput[] = [];
  __CLASSES__.forEach(async (charClass) => {
    try {
      const url = `https://www.mornatales.com/rankings/?class=${charClass}`;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      $(
        ".elementor-element-jbyisfw > div:nth-child(1) > table:nth-child(6) > tbody:nth-child(1) > tr"
      ).each(async (_index, element) => {
        const name = $($(element).find("td")[1])
          ?.text()
          ?.split(" ")
          ?.pop()
          ?.toLowerCase();
        const newVita =
          parseInt($($(element).find("td")[3]).text().slice(0, -1)) * 1000;
        const newMana =
          parseInt($($(element).find("td")[4]).text().slice(0, -1)) * 1000;
        const charEntity = await Character.findOne({
          where: { name },
        });
        const totalXP = calculateEXP(newVita, newMana);
        let difference = 0;
        let dailyXP = 0;

        if (charEntity) {
          const prevTotalXP = charEntity.totalXP;
          difference = totalXP - Number(prevTotalXP);
          dailyXP = Number(charEntity.dailyXP) + difference;
        }

        if (!name) return;

        const characterData = {
          class: $($(element).find("td")[0]).text().trim(),
          name: name,
          level: parseInt($($(element).find("td")[2]).text()),
          vita: newVita,
          mana: newMana,
          clan: $($(element).find("td")[5]).text(),
          totalXP: totalXP,
          dailyXP: dailyXP,
        };

        if (charArray.some((char) => char.name === characterData.name)) {
          logger.info(`${characterData.name} already in the array skipping`);
        } else {
          updateCharacter(characterData);
          charArray.push(characterData);
        }
      });
    } catch (error) {
      logger.error(error);
    } 
  });
};
