/**
 * 指定期間内のGoogleカレンダーのイベントをグループ別にまとめる共通関数
 * @param {Date} start 開始日時
 * @param {Date} end 終了日時
 * @param {Object} groups グループ定義（各グループは { events: [], url: "..." } ）
 * @return {Object} 各グループに振り分けたイベントが格納された groups オブジェクト
 */
function getGroupedEvents(start, end, groups, calendarId) {
  const calendar = CalendarApp.getCalendarById(calendarId);
  const events = calendar.getEvents(start, end);

  events.forEach(event => {
    const eventTitle = event.getTitle();
    const parts = eventTitle.split("|");
    if (parts.length < 2) return;
    const eventName = parts[1].trim();
    const taikaiClassString = parts[0].replace("〆", "");
    const letters = Array.from(taikaiClassString);

    for (const letter in groups) {
      if (letters.includes(letter)) {
        groups[letter].events.push(eventName);
      }
    }
  });
  return groups;
}

/**
 * グループごとのミニメッセージをベースメッセージに追記する共通関数
 * @param {string} baseMessage すでに作成されているメッセージ
 * @param {Object} groups グループ情報（各グループは { events: [], url: "..." } ）
 * @return {Object} { message: 生成されたメッセージ, totalEvents: 全イベント数 }
 */
function buildGroupMessages(baseMessage, groups) {
  let totalEvents = 0;
  for (const letter in groups) {
    const group = groups[letter];
    if (group.events.length > 0) {
      baseMessage += `<${letter}級>\n申込入力 → ${group.url}\n`;
      group.events.forEach(eventName => {
        baseMessage += `・${eventName}\n`;
      });
      baseMessage += "\n";
      totalEvents += group.events.length;
    }
  }
  return { message: baseMessage, totalEvents: totalEvents };
}
