import { BiBookAdd } from "react-icons/bi";
import {
  BsFiletypeCsv,
  BsFiletypeDocx,
  BsFiletypeHtml,
  BsFiletypeMd,
  BsFiletypeMp3,
  BsFiletypeMp4,
  BsFiletypePdf,
  BsFiletypePpt,
  BsFiletypePptx,
  BsFiletypePy,
  BsFiletypeTxt,
  BsFiletypeXls,
  BsFiletypeXlsx,
} from "react-icons/bs";
import { FaFile, FaRegFileAudio } from "react-icons/fa";
import { LiaFileVideo } from "react-icons/lia";
import { IconType } from "react-icons/lib";

import { getFileType } from "@/lib/helpers/getFileType";
import { SupportedFileExtensions } from "@/lib/types/SupportedFileExtensions";

const fileTypeIcons: Record<SupportedFileExtensions, IconType> = {
  pdf: BsFiletypePdf,
  mp3: BsFiletypeMp3,
  mp4: BsFiletypeMp4,
  html: BsFiletypeHtml,
  txt: BsFiletypeTxt,
  csv: BsFiletypeCsv,
  md: BsFiletypeMd,
  markdown: BsFiletypeMd,
  m4a: LiaFileVideo,
  mpga: FaRegFileAudio,
  mpeg: LiaFileVideo,
  webm: LiaFileVideo,
  wav: FaRegFileAudio,
  pptx: BsFiletypePptx,
  ppt: BsFiletypePpt,
  docx: BsFiletypeDocx,
  odt: BsFiletypeDocx,
  xlsx: BsFiletypeXlsx,
  xls: BsFiletypeXls,
  epub: FaFile,
  ipynb: BsFiletypePy,
  py: BsFiletypePy,
  bib: BiBookAdd,
  telegram: BsFiletypeDocx,
};

export const getFileIcon = (fileName: string): JSX.Element => {
  const fileType = getFileType(fileName);

  const Icon = fileType !== undefined ? fileTypeIcons[fileType] : FaFile;

  return <Icon width={16} />;
};
