import { nanoid } from "nanoid";
import { Form, FormSchema } from "./form.model";

export interface Menu {
  id: string;
  title?: string;
  items?: Array<MenuItem>;
}

export const createMenu: (id: string, menu: Omit<Menu, "id">) => Menu = (id: string, menu: Omit<Menu, "id">) => ({
  ...menu,
  id: `${id}-${menu.title || "menu"}-${nanoid()}`,
  items: menu.items?.map((item: Omit<MenuItem, "id">) =>
    createMenuItem(`${id}-${menu.title || "menu"}-${nanoid()}`, item)
  ),
});

export interface MenuItem {
  id: string;
  title?: string;
  image?: { src: string };
  isDivider?: boolean;
  paths?: Array<SvgPath>;
  secrets?: {}; // will be inherited by every component created from this menu
  forms?: Array<Form>;
}

export const createMenuItem: (id: string, menuItem: Omit<MenuItem, "id">) => MenuItem = (
  id: string,
  menuItem: Omit<MenuItem, "id">
) => ({
  ...menuItem,
  id: `${id}-${menuItem.title || "menu-item"}-${nanoid()}`,
});

export interface SvgPath {
  d: string;
  fill?: string;
  stroke?: string;
  style?: string;
  transform?: string;
}

export const SvgPathSchema = {
  d: { type: String, required: true },
  fill: String,
  stroke: String,
  style: String,
  transform: String,
};

export const MenuItemSchema = {
  id: { type: String, required: true },
  forms: [FormSchema],
  title: String,
  image: { src: { type: String, required: true } },
  isDivider: { type: Boolean, default: false },
  paths: [SvgPathSchema],
  secrets: { type: {} },
};

export const MenuSchema = {
  id: { type: String, required: true },
  title: String,
  items: [MenuItemSchema],
};
