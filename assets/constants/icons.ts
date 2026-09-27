import activity from "../icons/activiy.png";
import add from "../icons/add.png";
import adobe from "../icons/adobe.png";
import back from "../icons/back.png";
import canva from "../icons/canva.png";
import claude from "../icons/claude.png";
import dropbox from "../icons/dropbox.png";
import figma from "../icons/figma.png";
import github from "../icons/github.png";
import home from "../icons/home.png";
import medium from "../icons/medium.png";
import menu from "../icons/menu.png";
import notion from "../icons/notion.png";
import openai from "../icons/openai.png";
import plus from "../icons/plus.png";
import setting from "../icons/setting.png";
import spotify from "../icons/spotify.png";
import wallet from "../icons/wallet.png";

export const icons = {
    home,
    wallet,
    setting,
    activity,
    add,
    back,
    menu,
    plus,
    notion,
    dropbox,
    openai,
    adobe,
    medium,
    figma,
    spotify,
    github,
    claude,
    canva,
} as const;

export type IconKey = keyof typeof icons;