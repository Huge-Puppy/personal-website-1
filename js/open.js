async function initialize() {
  let container = document.getElementById("contributions");
  let response = await fetch(
    // "http://localhost:54321/functions/v1/github-contributions",
    "https://jyyhfyrnykdencwlwcus.functions.supabase.co/github-contributions",
    {
      headers: {
        Authorization:
        //   "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5eWhmeXJueWtkZW5jd2x3Y3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2MjAwODAsImV4cCI6MTk4NDE5NjA4MH0.60YINNo4_tUzfrf7BgzWLMMs_v92vpT4UBJLHQmQ_Tk",
        "Content-Type": "application/json",
      },
      method: "POST",
    }
  );
  let responseData = await response.json();
  let data = responseData.data.user.contributionsCollection
    .contributionCalendar;
  let total = data.totalContributions;
  let weeks = data.weeks;

  var year = document.createElement("div");
  year.classList.add("year");
  for (var week of weeks) {
    var weekCol = document.createElement("div");
    weekCol.classList.add("week");
    for (var day of week.contributionDays) {
      var dayBox = document.createElement("div");
      dayBox.classList.add("day");
      dayBox.style.backgroundColor = day.color;
      weekCol.appendChild(dayBox);
    }
    year.appendChild(weekCol);
  }
  container.appendChild(year);
}
initialize();
