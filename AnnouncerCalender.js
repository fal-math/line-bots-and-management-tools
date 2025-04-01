/**
 * 本日21時締切の通知メッセージを作成し、LINEに送信する関数
 */
function kaishimeIsToday() {
  // 今日の午前0時に日時を調整
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 翌日午前0時
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  // グループ定義
  const groups = {
    A: { events: [], url: CHOUSEISAN_A_URL },
    B: { events: [], url: CHOUSEISAN_B_URL },
    C: { events: [], url: CHOUSEISAN_C_URL },
    D: { events: [], url: CHOUSEISAN_D_URL },
    E: { events: [], url: CHOUSEISAN_E_URL },
    F: { events: [], url: CHOUSEISAN_F_URL },
    G: { events: [], url: CHOUSEISAN_G_URL }
  };

  // 指定期間のイベントをグループ分け
  getGroupedEvents(today, tomorrow, groups, GOOGLE_CALENDER_ID_KAISHIME);

  // メッセージの共通部分
  let baseMessage = "❗️本日21時に大会受付締切❗️\n\n";
  baseMessage += "次の大会は、本日21時に受付を締め切ります。\n";
  baseMessage += "申込入力URL（調整さん）上で、⭕️か❌になっているか、いま一度ご確認ください。\n\n";
  baseMessage += "各大会情報については、級別のLINEノートを参照してください。\n";
  baseMessage += "LINEノートは、画面右上≡より確認できます。\n\n";
  baseMessage += "⚠️申込入力URL（調整さん）では、⭕️か❌の入力をお願いいたします。\n";
  baseMessage += "空欄や△は検討中と判断します。全員の確認が取れるまでは会からの申し込みができません。\n";
  baseMessage += "ご協力お願いいたします。\n\n";

  // 各グループのメッセージ生成
  const { message, totalEvents } = buildGroupMessages(baseMessage, groups);

  // イベントが存在する場合のみLINE通知を実施
  if (totalEvents > 0) {
    pushTextV2MessageToLine(GROUP_ID_TAIKAI_MOUSHIKOMI, message, null);
  }
}

/**
 * 今週の（次の土曜まで）のイベントをグループ分けし、締切3日前のリマインド通知をLINEに送信する関数
 */
function kaishimeIsNextWeek() {
  // 今週（土曜）の午前0時に日時を調整（実行日は土曜とする）
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 翌週の土曜（7日後）
  const nextSaturday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  // グループ定義
  const groups = {
    A: { events: [], url: CHOUSEISAN_A_URL },
    B: { events: [], url: CHOUSEISAN_B_URL },
    C: { events: [], url: CHOUSEISAN_C_URL },
    D: { events: [], url: CHOUSEISAN_D_URL },
    E: { events: [], url: CHOUSEISAN_E_URL },
    F: { events: [], url: CHOUSEISAN_F_URL },
    G: { events: [], url: CHOUSEISAN_G_URL }
  };

  // 指定期間のイベントをグループ分け
  getGroupedEvents(today, nextSaturday, groups, GOOGLE_CALENDER_ID_KAISHIME);

  // メッセージの共通部分
  let baseMessage = "❗️大会受付締め切りまで間近❗️\n\n";
  baseMessage += "受付締め切りが近い大会のリマインド案内になります。\n";
  baseMessage += "来週中に受付締切です。\n";
  baseMessage += "ぜひ積極的に参加をご検討ください◎\n\n";
  baseMessage += "各大会情報については、級別のLINEノートを参照してください。\n";
  baseMessage += "LINEノートは、画面右上≡より確認できます。\n\n";
  baseMessage += "⚠️申込入力URL（調整さん）では、⭕️か❌の入力をお願いいたします。\n";
  baseMessage += "空欄や△は検討中と判断します。全員の確認が取れるまでは会からの申し込みができません。\n";
  baseMessage += "⭕️か❌を入力するよう、ご協力お願いいたします。\n\n";

  // 各グループのメッセージ生成
  const { message, totalEvents } = buildGroupMessages(baseMessage, groups);

  // イベントが存在する場合のみLINE通知を実施
  if (totalEvents > 0) {
    pushTextV2MessageToLine(GROUP_ID_TAIKAI_MOUSHIKOMI, message, null);
  }
}

/**
 * 本〆カレンダーの当日の予定を取得し、運営用のLINE通知を送信する関数
 */
function honshimeIsToday() {
  // 今日の午前0時に日時を調整
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // 翌日午前0時
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const formattedDate = today.toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" });

  // カレンダーからイベントを取得
  const calendar = CalendarApp.getCalendarById(GOOGLE_CALENDER_ID_HONSHIME);
  const events = calendar.getEvents(today, tomorrow);
  const eventMessages = events.map((event) => event.getTitle());

  // イベントが存在しない場合は通知しない
  if (eventMessages.length === 0) return;

  // メッセージ作成
  const header = `${formattedDate} {maintainer}さん\n大会本〆リマインダーです。以下の大会の申込を確認してください。\n\n`;
  const schedule = eventMessages.join('\n');
  const substitution = {
    "maintainer": {
      "type": "mention",
      "mentionee": {
        "type": "user",
        "userId": USER_ID_MAINTAINER
      }
    }
  }

  pushTextV2MessageToLine(GROUP_ID_TAIKAI_MOUSHIKOMI, header + schedule, substitution)
}
