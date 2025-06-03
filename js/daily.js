
window.loadComments = function(dateKey) {
  const container = document.getElementById("dailyCommentsContainer");
  const db = firebase.database();
  const ref = db.ref("daily-comments/" + dateKey);

  container.innerHTML = "";
  ref.off();
  ref.on("value", snap => {
    container.innerHTML = "";
    const data = snap.val();
    if (!data) return;
    Object.values(data).forEach(entry => {
      const div = document.createElement("div");
      div.style.marginBottom = "1rem";
      div.innerHTML = `<strong>${entry.name}</strong><br>${entry.text}`;
      container.appendChild(div);
    });
  });
};
