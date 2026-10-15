(function () {
  var arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var list = document.getElementById("nicheList");
  var preview = document.getElementById("preview");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }

  NSR.niches.forEach(function (n, i) {
    var li = document.createElement("li");
    li.innerHTML =
      '<a class="niche-row" href="demo.html?n=' + n.id + '" data-id="' + n.id + '">' +
      '<span class="n-name">' + esc(n.label) + '</span>' +
      '<span class="n-pain">' + esc(n.pain) + '</span>' +
      '<span class="n-go">' + arrow + '</span></a>';
    list.appendChild(li);
  });

  /* Tomorrow's day page: the hovered industry's old lead lands in a lime slot. */
  var dayTitle = document.getElementById("dayTitle");
  var dayRows = document.getElementById("dayRows");
  function renderDay(n, p) {
    var rows = [
      ["8:00 am", "Existing appointment", false],
      ["9:30 am", p.lead + " · " + n.apptType, true],
      ["11:00 am", "Existing appointment", false],
      ["1:00 pm", "Reactivated lead · Sam R.", true],
      ["3:30 pm", "Reactivated lead · Maria G.", true],
      ["5:00 pm", "", false]
    ];
    dayTitle.textContent = "Tomorrow at " + p.biz;
    dayRows.innerHTML = rows.map(function (r) {
      var ev = r[1]
        ? '<div class="cal-ev' + (r[2] ? " new" : "") + '"><span>' + esc(r[1]) + "</span>" + (r[2] ? "<small>booked overnight</small>" : "") + "</div>"
        : "";
      return '<div class="cal-row"><time>' + r[0] + '</time><div class="cal-slot">' + ev + "</div></div>";
    }).join("");
  }

  var current = null;
  function show(id) {
    if (id === current) return;
    current = id;
    var n = NSR.byId(id);
    var p = NSR.personal(n);
    if (dayRows) renderDay(n, p);
    list.querySelectorAll(".niche-row").forEach(function (a) { a.classList.toggle("is-on", a.dataset.id === id); });
    preview.innerHTML =
      '<div class="preview-head"><h2>' + esc(n.headline) + '</h2><p>' + esc(n.sub) + '</p></div>' +
      '<div class="thread">' +
      '<div class="msg in msg-enter">Hey, it\'s ' + esc(p.ai) + ' from ' + esc(p.biz) + '.</div>' +
      '<div class="msg in msg-enter" style="animation-delay:.12s">Is this the same ' + esc(p.lead) + ' that was interested in ' + esc(p.service) + ' recently?</div>' +
      '<div class="msg out msg-enter" style="animation-delay:.5s">yes that\'s me</div>' +
      '<span class="stamp r">Sample conversation</span>' +
      '</div>' +
      '<div class="preview-cta"><a class="btn btn-lime" href="demo.html?n=' + n.id + '">Open the ' + esc(n.label.toLowerCase()) + ' demo ' + arrow + '</a><small>4 steps · about 3 minutes</small></div>';
  }

  list.addEventListener("mouseover", function (e) {
    var a = e.target.closest(".niche-row");
    if (a) show(a.dataset.id);
  });
  list.addEventListener("focusin", function (e) {
    var a = e.target.closest(".niche-row");
    if (a) show(a.dataset.id);
  });
  show(NSR.niches[0].id);

  /* Fit checklist */
  var boxes = document.querySelectorAll("#fitList .check");
  var msg = document.getElementById("fitMsg");
  var out = msg.parentNode;
  function score() {
    var c = 0;
    boxes.forEach(function (b) { if (b.checked) c++; });
    var text, cta = "";
    if (c === 0) text = "Check the boxes that apply.";
    else if (c <= 2) text = c + " of 6. Worth a quick look at the list before deciding.";
    else if (c <= 4) text = c + " of 6. Your list is a good candidate for a 1,000-lead test.";
    else text = c + " of 6. This is exactly the kind of list we reactivate.";
    msg.textContent = text;
    msg.classList.toggle("idle", c === 0);
    var old = out.querySelector(".btn");
    if (old) old.remove();
    if (c >= 3) {
      cta = document.createElement("a");
      cta.className = "btn btn-lime";
      cta.href = "#demos";
      cta.textContent = "Pick your demo";
      out.appendChild(cta);
    }
  }
  boxes.forEach(function (b) { b.addEventListener("change", score); });
})();
