// ユーティリティ関数：M/D -> YYYY-MM-DD（半年以上前なら翌年）
function toYMD(mdStr) {
  const [month, day] = mdStr.split("/").map(Number);
  const today = new Date();
  const thisYear = today.getFullYear();
  const candidate = new Date(thisYear, month - 1, day);
  const diffInDays = (today - candidate) / (1000 * 60 * 60 * 24);
  if (diffInDays > 183) {
    candidate.setFullYear(thisYear + 1);
  }
  const yyyy = candidate.getFullYear();
  const mm = String(candidate.getMonth() + 1).padStart(2, '0');
  const dd = String(candidate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ユーティリティ関数：YYYY-MM-DD -> M/D
function toMD(ymdStr) {
  const [year, month, day] = ymdStr.split("-");
  return `${parseInt(month, 10)}/${parseInt(day, 10)}`;
}