# LINE通知＆調整さん集計ボット (GAS)

Google カレンダーや調整さんの情報を自動取得し、LINE グループへ定期通知するボットです。  
GAS（Google Apps Script）上で動作し、以下のような機能を提供します:

- **カレンダー通知**  
  - 今日・今週中に締切となる大会情報を自動通知  
  - 本締用カレンダーの当日大会を運営担当向けにリマインド
- **調整さん集計**  
  - 調整さん(CSV)を取得し、参加者状況を集計してLINEに送信
- **週次アナウンス**  
  - 毎週固定メッセージを通知（活動カレンダー、周知済み大会情報、調整さんURL など）

---

## ファイル構成 (GASプロジェクト内の複数 `.gs`)

GAS ではディレクトリを作れないため、以下のように複数 `.gs` ファイルに分割し、機能ごとに管理する形式を推奨します。

```text
(プロジェクト)
├── Announcer_Calender.gs   // カレンダー締切通知 (kaishimeIsToday 等)
├── Announcer_Weekly.gs     // 週次アナウンス (weeklyAnnounce)
├── Chouseisan_Main.gs      // 調整さん集計 (checkChouseisanToday 等)
├── Constants.gs            // LINEトークン・カレンダーID 等の定数
├── Line_TextV2.gs          // LINE へ textV2 形式のメッセージを送る関数
├── Utils_Date.gs           // 日付変換 (toYMD, toMD 等)
├── Utils_CSV.gs            // CSVパーサー (parseCSV)
├── Utils_Event.gs          // イベントのグループ化・メッセージ組み立て
└── Tests.gs                // テスト関数 (testParseCSV 等)
```

---

## セットアップ

1. **GASプロジェクト作成**  
   - Google ドライブ → 新規 → その他 → Google Apps Script から空プロジェクトを作成し、上記ファイルを追加してコードを貼り付けます。
2. **定数の設定**  
   - `Constants.gs` に各種定数を記載します。
3. **権限承認**  
   - GAS は初回実行時に UrlFetchApp や Google カレンダーの使用に対して権限を確認します。画面表示に従い承認してください。

---

## 使い方

### 手動実行

- GAS エディタ画面右上の「関数を選択」で関数名 (例：`kaishimeIsToday`) を選び、「▶実行」ボタンで手動実行できます。
- ログ出力は「表示 → 実行ログ」で確認してください。

### トリガー（自動実行）設定

1. GAS エディタ左メニュー「トリガー」を選択  
2. 右下の「トリガーを追加」ボタン  
3. 対象関数を選び、「時間主導型」「毎日 / 毎週」の繰り返しなどを設定  
4. 保存すると指定日時に自動で関数が実行されます  

#### 例：トリガー設定

- **毎朝 7時** → `kaishimeIsToday()` (今日締切の大会通知)
- **毎週 土曜 9時** → `weeklyAnnounce()` (週次アナウンス)
- **毎朝 8時** → `checkChouseisanToday()` (調整さんCSVの当日締切イベント通知)

---

## 主な関数一覧

| 関数名                      | 概要                                                     | ファイル              |
| --------------------------- | -------------------------------------------------------- | --------------------- |
| `kaishimeIsToday()`         | Googleカレンダーから **本日21時締切** イベントをLINE通知 | Announcer_Calender.gs |
| `kaishimeIsNextWeek()`      | 今週土曜までの締切イベントをリマインド                   | Announcer_Calender.gs |
| `honshimeIsToday()`         | 本締用カレンダーの当日イベントを運営向けに通知           | Announcer_Calender.gs |
| `weeklyAnnounce()`          | 毎週送る周知メッセージ（活動カレンダーURLなど）          | Announcer_Weekly.gs   |
| `checkChouseisanToday()`    | 調整さんの **当日締切** イベントを集計・通知             | Chouseisan_Main.gs    |
| `checkChouseisanThisWeek()` | 今週締切の調整さんイベントを集計・通知                   | Chouseisan_Main.gs    |
| `checkChouseisan()`         | 日付範囲を指定し、CSV解析 → LINE通知                     | Chouseisan_Main.gs    |

---

## テスト

- `Tests.gs` にテスト用関数（例：`testParseCSV()`）を定義し、スクリプトエディタで実行→ログ出力を確認します。  
- 想定通りの出力になっているか検証してください。

---

## 注意点

1. **LINE Messaging API**  
   - プッシュメッセージ送信には[LINE Developers](https://developers.line.biz/)で取得する「チャンネルアクセストークン」が必要です。  
   - Bot を通知先グループに **参加** させた上で `GROUP_ID` を取得してください。

2. **Googleカレンダー**  
   - カレンダーID が正しく `Constants.gs` に設定されているか確認します。  
   - GASがそのカレンダーを参照できるよう権限を付与してください。

3. **調整さんCSV URL**  
   - 公開範囲を誤るとデータが取得できない場合があります。  
   - 定期的に有効URLかどうか確認してください。

4. **実行上限・使用量**  
   - GASの無料枠制限 (UrlFetchApp 呼び出し回数など) に注意してください。  
   - トリガーの実行頻度が多すぎると上限に達する可能性があります。

---

## ライセンス

- 組織やクラブ内での運用を想定しています。  
- 再利用や改変はチーム内規定に従ってください。  

以上で README となります。  
GAS のプロジェクト運用を続けながら適宜テスト＆改修を行ってください。
