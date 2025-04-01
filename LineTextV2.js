/**
 * LINEにプッシュメッセージ（textV2）を送信する関数。
 * Send a push message (textV2) to LINE.
 *
 * @param {string} targetId - 送信先のグループIDまたはユーザーID / The target group or user ID.
 * @param {string} messageText - 送信するメッセージのテキスト / The text of the message to send.
 * @param {Object} substitution - プレースホルダーの置換内容（空の場合は空オブジェクトかnull） / The substitution object for placeholders (empty if none).
 * @param {string} retryKey - X-Line-Retry-Key用のUUID / The UUID for the X-Line-Retry-Key header.
 */
function pushTextV2MessageToLine(targetId, messageText, substitution, retryKey) {
  // retryKeyが指定されていなければ、UUIDを生成する
  // If retryKey is not provided, generate a UUID.
  if (!retryKey) {
    retryKey = Utilities.getUuid();
  }
  
  // LINE APIのプッシュメッセージ用エンドポイントURL
  // LINE API endpoint for push messages.
  const url = 'https://api.line.me/v2/bot/message/push';

  // 送信するペイロードの基本形を作成する
  // Build the base payload for the push message.
  const messagePayload = {
    type: "textV2",
    text: messageText
  };

  // substitutionが有効なオブジェクトの場合のみペイロードに追加する
  // Only add substitution if it is a valid, non-empty object.
  if (substitution && Object.keys(substitution).length > 0) {
    messagePayload.substitution = substitution;
  }

  const payload = {
    to: targetId,
    messages: [messagePayload]
  };

  // HTTPリクエストのオプションを設定する（メソッド、ヘッダー、ペイロードなど）
  // Setup the HTTP request options, including method, headers, and payload.
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESS_TOKEN,
      'X-Line-Retry-Key': retryKey
    },
    payload: JSON.stringify(payload)
  };

  // UrlFetchAppを使用してLINEにプッシュメッセージを送信する
  // Send the push message to LINE using UrlFetchApp.
  UrlFetchApp.fetch(url, options);
}
