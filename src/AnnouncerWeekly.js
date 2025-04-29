function announcerWeekly() {
  let message = "【活動カレンダー】 \n";
  message += CALENDER_URL + "\n"
  message += "\n";
  message += "【周知済み大会情報】\n";
  message += DRIVE_URL + "\n";
  message += "\n";
  message += "【申込入力URL（調整さん）】\n";
  message += "A級| ";
  message += CHOUSEISAN_A_URL + "\n";
  message += "B級| ";
  message += CHOUSEISAN_B_URL + "\n";
  message += "C級| ";
  message += CHOUSEISAN_C_URL + "\n";
  message += "D級| ";
  message += CHOUSEISAN_D_URL + "\n";
  message += "E級| ";
  message += CHOUSEISAN_E_URL + "\n";
  message += "F級| ";
  message += CHOUSEISAN_F_URL + "\n";
  message += "G級| ";
  message += CHOUSEISAN_G_URL;
  pushTextV2MessageToLine(GROUP_ID_ZENTAI, message, null, Utilities.getUuid());
}