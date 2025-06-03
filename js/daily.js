
async function loadDailyThing() {
  const response = await fetch("daily.json");
  const dailyData = await response.json();
  const availableDates = Object.keys(dailyData).sort().reverse();

  const currentDate = availableDates[0];
  const entry = dailyData[currentDate];

  const dateObj = new Date(currentDate);
  const formatted = dateObj.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  document.getElementById("entryDate").textContent = "📅 " + formatted;

  let mediaHtml = "";

  if (entry.items && Array.isArray(entry.items)) {
    entry.items.forEach(item => {
      if (item.type === "image") {
        mediaHtml += `<div class="media-block"><img src="${item.src}" style="max-width: 100%; height: auto;"><p>${item.caption || ""}</p></div>`;
      } else if (item.type === "video") {
        mediaHtml += `<div class="media-block"><video controls src="${item.src}" style="max-width: 100%;"></video><p>${item.caption || ""}</p></div>`;
      } else if (item.type === "audio") {
        mediaHtml += `<div class="media-block"><audio controls src="${item.src}"></audio><p>${item.caption || ""}</p></div>`;
      } else if (item.type === "map") {
        mediaHtml += `<div class="media-block"><iframe src="${item.src}" style="width:100%; height:500px; border:none;" allowfullscreen></iframe><p>${item.caption || ""}</p></div>`;
      }
    });
  } else {
    mediaHtml = "<p>No media items found.</p>";
  }

  document.getElementById("dailyContainer").innerHTML = mediaHtml;
  document.getElementById("descriptionContainer").innerHTML =
    '<div class="last-entry-date" id="entryDate">📅 ' + formatted + '</div>' +
    "<p>" + (entry.description || "").replace(/\n/g, "<br>") + "</p>";
}
