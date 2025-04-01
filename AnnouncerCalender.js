/**
 * 本日21時締切の通知メッセージを作成し、LINEに送信する関数
 */
function announcerKaishimeIsToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const groups = createGroups();

  getGroupedEvents(today, tomorrow, groups, GOOGLE_CALENDER_ID_KAISHIME);

  let baseMessage = "❗️本日21時に大会受付締切❗️\n\n";
  baseMessage += "次の大会は、本日21時に受付を締め切ります。\n";
  baseMessage += "申込入力URL（調整さん）上で、⭕️か❌になっているか、いま一度ご確認ください。\n\n";
  baseMessage += kaishimeMessage;

  const { message, totalEvents } = buildGroupMessages(baseMessage, groups);

  if (totalEvents > 0) {
    pushTextV2MessageToLine(GROUP_ID_ZENTAI, message, null);
  }
}

/**
 * 今週の（次の土曜まで）のイベントをグループ分けし、締切3日前のリマインド通知をLINEに送信する関数
 */
function announcerKaishimeIsNextWeek() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextSaturday = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const groups = createGroups();

  getGroupedEvents(today, nextSaturday, groups, GOOGLE_CALENDER_ID_KAISHIME);

  let baseMessage = "❗️大会受付締め切りまで間近❗️\n\n";
  baseMessage += "受付締め切りが近い大会のリマインド案内になります。\n";
  baseMessage += "来週中に受付締切です。\n";
  baseMessage += "ぜひ積極的に参加をご検討ください◎\n\n";
  baseMessage += kaishimeMessage;

  const { message, totalEvents } = buildGroupMessages(baseMessage, groups);

  if (totalEvents > 0) {
    pushTextV2MessageToLine(GROUP_ID_ZENTAI, message, null);
  }
}

/**
 * 本〆カレンダーの当日の予定を取得し、役員用のLINE通知を送信する関数
 */
function announcerHonshimeIsToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  const formattedDate = today.toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" });

  const calendar = CalendarApp.getCalendarById(GOOGLE_CALENDER_ID_HONSHIME);
  const events = calendar.getEvents(today, tomorrow);
  const eventMessages = events.map((event) => event.getTitle());

  if (eventMessages.length === 0) return;

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
