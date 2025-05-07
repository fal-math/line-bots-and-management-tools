function notifyAttendance() {
  const query = `(to:${ATTENDANCE_ADDRESS} is:unread)`
  const threads = GmailApp.search(query)

  if (threads.length === 0) return;

  const mails = GmailApp.getMessagesForThreads(threads)
  const replyBody = `遅刻、欠席連絡を受け付けました。※こちらは自動配信メールのため返信はできません。`

  for (const messages of mails) {
    const latestMessage = messages[messages.length - 1] // 最新のメッセージを取得

    const messageDate = Utilities.formatDate(latestMessage.getDate(), "JST", "MM/dd HH:mm:ss")
    let notice = `件名　　: ${latestMessage.getSubject()}\n`;
    notice += `受信時刻: ${messageDate}\n`;
    notice += `--------------------------------------\n`

    // HTMLをプレーンテキストに変換して通知
    let plainBody = latestMessage.getPlainBody();
    notice += `${removeCSSRules(plainBody)}`;

    Logger.log(notice);

    try {
      pushTextV2MessageToLine(GROUP_ID_UNNEI_SHIFT, notice, null); // LINE通知
    } catch (e) {
      Logger.log("LINE通知エラー: " + e.message);
    }

    try {
      latestMessage.reply(replyBody, { from: ATTENDANCE_ADDRESS });
    } catch (e) {
      Logger.log("Gmail返信エラー: " + e.message);
    }
    latestMessage.markRead();
  }
  return;
}

function removeCSSRules(text) {
  text = text.replace(/([^\{]+)\s*\{[^}]*\}/g, '');
  text = text.replace(/[\n\r]*\s*[\n\r]+/g, '\n');
  return text;
}