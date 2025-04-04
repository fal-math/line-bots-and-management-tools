function announcerWeekly() {
  let message = "【活動カレンダー】 \n";
  message += "https://sites.google.com/view/chyfrfr/cfc \n";
  message += "\n";
  message += "【周知済み大会情報】\n";
  message += "https://drive.google.com/drive/folders/1fij2cGZfeHOOECdVujgLiO6SAAvY40Py \n";
  message += "\n";
  message += "【申込入力URL（調整さん）】\n";
  message += "<A級>\n";
  message += CHOUSEISAN_A_URL + "\n";
  message += "<B級>\n";
  message += CHOUSEISAN_B_URL + "\n";
  message += "<C級>\n";
  message += CHOUSEISAN_C_URL + "\n";
  message += "<D級>\n";
  message += CHOUSEISAN_D_URL + "\n";
  message += "<E級>\n";
  message += CHOUSEISAN_E_URL + "\n";
  message += "<F級>\n";
  message += CHOUSEISAN_F_URL + "\n";
  message += "<G級>\n";
  message += CHOUSEISAN_G_URL;
  pushTextV2MessageToLine(GROUP_ID_ZENTAI, message, null, Utilities.getUuid());
}