import { iconList } from "@/lib/helpers/iconList";

export interface Tab {
  label: string;
  isSelected: boolean;
  disabled?: boolean;
  iconName: keyof typeof iconList;
  onClick: () => void;
  badge?: number;
}
