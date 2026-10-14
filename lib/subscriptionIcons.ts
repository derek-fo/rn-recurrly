import type { ImageSourcePropType } from "react-native";
import { icons } from "../constants/icons";

// Logos bundled in assets/icons, preferred over the CDN so they work offline.
const LOCAL_BRAND_ICONS: Record<string, ImageSourcePropType> = {
  spotify: icons.spotify,
  notion: icons.notion,
  figma: icons.figma,
  github: icons.github,
  claude: icons.claude,
  canva: icons.canva,
  adobe: icons.adobe,
  openai: icons.openai,
  chatgpt: icons.openai,
  dropbox: icons.dropbox,
  medium: icons.medium,
};

// Simple Icons (https://simpleicons.org) slug rules: lowercase, "+" -> "plus",
// "." -> "dot", "&" -> "and", everything else non-alphanumeric removed.
const toSimpleIconsSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\+/g, "plus")
    .replace(/\./g, "dot")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");

export const resolveSubscriptionIcon = (name: string): ImageSourcePropType => {
  const slug = toSimpleIconsSlug(name);
  const localKey = Object.keys(LOCAL_BRAND_ICONS).find((key) => slug.includes(key));
  if (localKey) return LOCAL_BRAND_ICONS[localKey];

  return slug ? { uri: `https://cdn.simpleicons.org/${slug}` } : icons.wallet;
};
