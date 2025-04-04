/**
 * ユーティリティ：グループ定義用オブジェクトを作成
 */
function createGroups() {
  return {
    A: { events: [], url: CHOUSEISAN_A_URL },
    B: { events: [], url: CHOUSEISAN_B_URL },
    C: { events: [], url: CHOUSEISAN_C_URL },
    D: { events: [], url: CHOUSEISAN_D_URL },
    E: { events: [], url: CHOUSEISAN_E_URL },
    F: { events: [], url: CHOUSEISAN_F_URL },
    G: { events: [], url: CHOUSEISAN_G_URL }
  };
}

const kaishimeMessage =
  "各大会情報については、級別のLINEノート(画面右上≡)を参照してください。\n\n"
  + "⚠️申込入力URL(調整さん)では、⭕️か❌の入力をお願いいたします。\n"
  + "空欄や△は検討中と判断します。\n"
  + "⭕️か❌を期限内にご入力ください。\n\n"