function runAllTests() {
  testParseCSV();
  testParseCSVToEventStatus();
  testFilterEventsWithTodayDeadline();
  testFormatEventStatus();
}
/**
 * parseCSV のテスト
 */
function testParseCSV() {
  const input = `"名前","年齢"\n"山田, 太郎",30\n"鈴木",25`;
  const expected = [
    ["名前", "年齢"],
    ["山田, 太郎", "30"],
    ["鈴木", "25"]
  ];
  const actual = parseCSV(input);
  console.assert(JSON.stringify(actual) === JSON.stringify(expected), "parseCSV 正常動作テスト");
}

/**
 * parseCSVToEventStatus のテスト
 */
function testParseCSVToEventStatus() {
  const sampleCSV = `名前,山田 太郎,佐藤 花子
04/20土 山形酒田ABCDE(〆3/25火),◯,×
コメント,メモ1,メモ2
04/21日 大阪大会(〆3/28金),,△`;

  const result = parseCSVToEventStatus(sampleCSV);
  console.assert(result["山形酒田ABCDE"] !== undefined, "1件目イベントが取得できている");
  console.assert(result["山形酒田ABCDE"].deadline === "3/25", "〆切が正しく抽出されている");
  console.assert(result["大阪大会"].member["佐藤"] === "△", "佐藤の出欠が正しく抽出されている");
}

/**
 * filterEventsWithTodayDeadline のテスト
 */
function testFilterEventsWithTodayDeadline() {
  const today = normalizeDate(getTodayMD());
  const dummy = {
    "テスト大会": {
      event: "テスト大会",
      date: "4/20",
      deadline: today,
      member: {
        "山田": "◯",
        "佐藤": "×",
        "高橋": ""
      }
    },
    "未来大会": {
      event: "未来大会",
      date: "5/5",
      deadline: "12/31",
      member: {
        "山田": "◯"
      }
    }
  };

  const filtered = filterEventsWithTodayDeadline(dummy);
  console.assert(filtered["テスト大会"] !== undefined, "〆切が今日のイベントが抽出されている");
  console.assert(filtered["未来大会"] === undefined, "〆切が違うイベントは除外されている");
}

/**
 * formatEventStatus のテスト
 */
function testFormatEventStatus() {
  const json = {
    "テスト大会": {
      event: "テスト大会",
      date: "4/20",
      deadline: "3/25",
      participants: {
        attending: ["山田"],
        notAttending: ["佐藤"],
        noAnswer: ["高橋"]
      }
    }
  };

  const output = formatEventStatus(json, "A");
  console.assert(output.includes("【A級】"), "クラス名が出力される");
  console.assert(output.includes("テスト大会"), "イベント名が出力される");
  console.assert(output.includes("山田"), "参加者が出力される");
  console.assert(output.includes("未定:高橋"), "未定者が出力される");
}
