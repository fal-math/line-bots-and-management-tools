function checkChouseisan(startYMD, endYMD, id) {
  const startMD = toMD(startYMD);
  const endMD = toMD(endYMD);

  let message = `＝大会申込状況まとめ（〆切 ${startMD}〜${endMD}）＝\n\n`;
  message += fetchChouseisan(CHOUSEISAN_A_CSV, "A", startYMD, endYMD);
  message += fetchChouseisan(CHOUSEISAN_B_CSV, "B", startYMD, endYMD);
  message += fetchChouseisan(CHOUSEISAN_C_CSV, "C", startYMD, endYMD);
  message += fetchChouseisan(CHOUSEISAN_D_CSV, "D", startYMD, endYMD);
  message += fetchChouseisan(CHOUSEISAN_E_CSV, "E", startYMD, endYMD);
  message += fetchChouseisan(CHOUSEISAN_F_CSV, "F", startYMD, endYMD);
  message += fetchChouseisan(CHOUSEISAN_G_CSV, "G", startYMD, endYMD);

  pushTextV2MessageToLine(id, message, null, Utilities.getUuid());
}

function fetchChouseisan(url, karutaClass, startYMD, endYMD) {
  const postheader = {
    "accept": "gzip, */*",
    "timeout": "20000"
  };
  const parameters = {
    "method": "get",
    "muteHttpExceptions": true,
    "headers": postheader
  };

  const eventData = UrlFetchApp.fetch(url, parameters).getContentText('UTF-8');
  const events = parseCSVToEventStatus(eventData);
  const filtered = filterEventsWithDeadlineInRange(events, startYMD, endYMD);
  return formatEventStatus(filtered, karutaClass);
}

function parseCSVToEventStatus(csvContent) {
  const lines = csvContent.split(/\r?\n/);
  const headerIndex = lines.findIndex(line => line.includes(','));
  if (headerIndex === -1) throw new Error("CSVのヘッダー行が見つかりませんでした。");
  const csvData = lines.slice(headerIndex).join("\n");
  const rows = parseCSV(csvData);
  if (rows.length < 1) return {};

  const header = rows[0];
  const rawParticipants = header.slice(1);
  const participants = rawParticipants.map(p => p.split(/[\u0020\u3000]/)[0].trim());

  const eventRegex = /^(\d{1,2}\/\d{1,2})(?:[日月火水木金土](?:祝)?)?\.(.+?)\(〆(\d{1,2}\/\d{1,2})(?:[日月火水木金土](?:祝)?)?\)$/;

  const events = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0) continue;
    let firstCol = row[0].trim();
    if (firstCol === "コメント" || firstCol === "") continue;

    const match = firstCol.match(eventRegex);
    if (!match) {
      Logger.log(`イベント情報の形式が不正です: ${firstCol}`);
      continue;
    }
    const [, dateMD, eventName, deadlineMD] = match;
    const dateYMD = toYMD(dateMD);
    const deadlineYMD = toYMD(deadlineMD);

    const member = {};
    for (let j = 1; j < header.length; j++) {
      const participantName = participants[j - 1].trim();
      const attendance = row[j] ? row[j].trim() : "";
      member[participantName] = attendance;
    }

    events[eventName] = {
      event: eventName,
      date: dateYMD,
      deadline: deadlineYMD,
      member
    };
  }

  return events;
}

function filterEventsWithDeadlineInRange(events, startYMD, endYMD) {
  const result = {};

  for (const key in events) {
    if (Object.hasOwnProperty.call(events, key)) {
      const eventData = events[key];
      const deadline = eventData.deadline;

      if (deadline >= startYMD && deadline <= endYMD) {
        const attending = [];
        const notAttending = [];
        const noAnswer = [];

        for (const name in eventData.member) {
          const status = eventData.member[name];
          if (status === "◯") attending.push(name);
          else if (status === "×") notAttending.push(name);
          else noAnswer.push(name);
        }

        result[eventData.event] = {
          event: eventData.event,
          date: eventData.date,
          deadline: eventData.deadline,
          participants: { attending, notAttending, noAnswer }
        };
      }
    }
  }
  return result;
}

function formatEventStatus(eventsJson, karutaClass) {
  if (Object.keys(eventsJson).length === 0) return "";

  let output = `【${karutaClass}級】\n\n`;
  for (const key in eventsJson) {
    if (Object.hasOwnProperty.call(eventsJson, key)) {
      const eventInfo = eventsJson[key];
      const { date, event, participants } = eventInfo;
      const { noAnswer, attending } = participants;

      const noAnswerStr = noAnswer.length ? noAnswer.join(", ") : "";
      const attendingStr = attending.length ? attending.join(", ") : "";

      output += `${toMD(date)} ${event}\n`;
      output += `未定:${noAnswerStr}\n`;
      output += `参加:${attendingStr}\n`;
      output += `\n`;
    }
  }

  return output;
}