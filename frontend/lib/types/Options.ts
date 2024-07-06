import { iconList } from "@/lib/helpers/iconList";
import { Color } from "@/lib/types/Colors";

export type Option = {
  label: string;
  iconName: keyof typeof iconList;
  onClick: () => void;
  iconColor: Color;
  disabled?: boolean;
};
