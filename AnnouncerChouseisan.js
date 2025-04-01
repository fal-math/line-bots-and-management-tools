function checkChouseisanToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const ymd = `${yyyy}-${mm}-${dd}`;
  checkChouseisan(ymd, ymd, GROUP_ID_TAIKAI_MOUSHIKOMI);
}

function checkChouseisanThisWeek() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 3);
  const end = new Date(today);
  end.setDate(end.getDate() + 3);

  const startYMD = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
  const endYMD = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;

  checkChouseisan(startYMD, endYMD, GROUP_ID_TAIKAI_MOUSHIKOMI);
}
