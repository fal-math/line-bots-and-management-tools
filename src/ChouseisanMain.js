function checkChouseisanByClass(startYMD, endYMD, id) {
  function getter(url, karutaClass) {
    const allEvents = fetchChouseisan(url)
    const filteredEvents = filterEventsWithDeadlineInRange(allEvents, startYMD, endYMD);
    const categorizedEvents = categorizeParticipants(filteredEvents);
    return formatEventStatus(categorizedEvents, karutaClass);
  }

  let message = `＝大会申込状況まとめ（〆切 ${toMD(startYMD)}〜${toMD(endYMD)}）＝\n\n`;
  message += getter(CHOUSEISAN_A_CSV, "A");
  message += getter(CHOUSEISAN_B_CSV, "B");
  message += getter(CHOUSEISAN_C_CSV, "C");
  message += getter(CHOUSEISAN_D_CSV, "D");
  message += getter(CHOUSEISAN_E_CSV, "E");
  message += getter(CHOUSEISAN_F_CSV, "F");
  message += getter(CHOUSEISAN_G_CSV, "G");

  pushTextV2MessageToLine(id, message, null, Utilities.getUuid());
}

function fetchChouseisan(url) {
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
  return parseCSVToEventStatus(eventData);
  // return :
  // events data format
  // {
  //   "$title": {
  //     "event": "$title",
  //     "date": "YYYY-MM-DD",
  //     "deadline": "YYYY-MM-DD",
  //     "member": {
  //       "$player1": "○",
  //       "$player2": "△",
  //       "$player3": "×",
  //       "$player4": ,
  //     }
  //   },
  //   ...
  // }
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
  const participants = rawParticipants.map(p => p.trim());

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
    if (events.hasOwnProperty(key)) {
      const eventData = events[key];
      const deadline = eventData.deadline;
      if (deadline >= startYMD && deadline <= endYMD) {
        result[eventData.event] = eventData;
      }
    }
  }

  return result;
}

function categorizeParticipants(events) {
  const result = {};
  for (const key in events) {
    eventData = events[key];
    members = eventData.member;

    const attending = [];
    const notAttending = [];
    const noAnswer = [];

    for (const name in members) {
      if (members.hasOwnProperty(name)) {
        const status = members[name];
        if (status === "◯") attending.push(name);
        else if (status === "×") notAttending.push(name);
        else noAnswer.push(name);
      }
    }

    result[eventData.event] = {
      event: eventData.event,
      date: eventData.date,
      deadline: eventData.deadline,
      participants: { attending, notAttending, noAnswer }
    };
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

      const noAnswerStr = noAnswer.length ? noAnswer.join("\n") : "";
      const attendingStr = attending.length ? attending.join("\n") : "";

      output += `🏆${toMD(date)} ${event}\n`;
      output += `▼未定\n${noAnswerStr}\n`;
      output += `▼参加\n${attendingStr}\n`;
      output += `\n`;
    }
  }

  return output;
}