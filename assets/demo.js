(function () {
  var q = new URLSearchParams(location.search);
  var N = NSR.byId(q.get("n"));
  var P;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  }
  function pct(n) { return Math.round(n) + "%"; }
  function count(n) { return Math.round(n).toLocaleString("en-US"); }

  /* Names that change when the presenter personalizes the demo */
  function names() {
    var advisorFull = P.advisorShort === N.advisorShort ? N.advisor : P.advisorShort;
    var svcShort = P.service !== N.service ? P.service : N.serviceShort;
    return { advisorFull: advisorFull, svcShort: svcShort };
  }
  function swapAdvisor(text) {
    return text.split(N.advisorShort.toLowerCase()).join(P.advisorShort.toLowerCase());
  }

  /* ---------------- Steps ---------------- */
  var tabs = document.querySelectorAll(".step-tab");
  var panels = document.querySelectorAll(".panel");
  var step = 1;
  function go(n) {
    step = n;
    panels.forEach(function (p) { p.hidden = Number(p.dataset.panel) !== n; });
    tabs.forEach(function (t) {
      var s = Number(t.dataset.step);
      if (s === n) t.setAttribute("aria-current", "step"); else t.removeAttribute("aria-current");
      t.classList.toggle("done", s < n);
    });
    if (n === 2 && !convoStarted) startConvo();
    if (n === 3) renderMorning();
    if (n === 4) renderDeal();
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    try { history.replaceState(null, "", "#step" + n); } catch (e) {}
  }
  tabs.forEach(function (t) { t.addEventListener("click", function () { go(Number(t.dataset.step)); }); });
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () { go(Number(b.dataset.go)); });
  });

  /* ---------------- Step 1: the owner's numbers ---------------- */
  var inLeads = $("inLeads"), inValue = $("inValue"), inClose = $("inClose"), inReply = $("inReply"), inBook = $("inBook");
  var state = { last: null, ads: null };

  function fill(r) {
    var p = (r.value - r.min) / (r.max - r.min) * 100;
    r.style.setProperty("--fill", p + "%");
  }
  function calc() {
    var leads = +inLeads.value, value = +inValue.value, close = +inClose.value / 100;
    var reply = +inReply.value / 100, book = +inBook.value / 100;
    var replies = leads * reply, booked = replies * book, closed = booked * close;
    var testBooked = 2000 * reply * book;
    $("outLeads").textContent = count(leads);
    $("outValue").textContent = NSR.money(value);
    $("outClose").textContent = pct(close * 100);
    $("outReply").textContent = pct(reply * 100);
    $("outBook").textContent = pct(book * 100);
    $("bigNum").textContent = NSR.money(closed * value);
    $("rReplies").textContent = count(replies);
    $("rBooked").textContent = count(booked);
    $("rClosed").textContent = count(closed);
    $("rTest").textContent = "≈ " + count(testBooked) + " booked";
    [inLeads, inValue, inClose, inReply, inBook].forEach(fill);
    calc.out = { leads: leads, value: value, close: close, reply: reply, book: book, testBooked: testBooked, testClosed: testBooked * close };
    pain();
  }
  function pain() {
    var line = $("painLine");
    var bits = [];
    if (state.last === "never") bits.push("<b>Nobody has called them.</b> Every one of those leads is untouched.");
    if (state.last === "year") bits.push("<b>Over a year of silence.</b> Most of them assume you forgot about them.");
    if (state.last === "recent") bits.push("<b>Your team already calls them.</b> Texts reach the ones who never pick up.");
    if (state.ads === "yes") bits.push("You're paying for new leads every month while " + count(calc.out.leads) + " paid-for leads sit untouched.");
    if (state.ads === "some") bits.push("Every ad push adds to a list nobody works.");
    line.hidden = !bits.length;
    line.innerHTML = bits.join(" ");
  }
  function seg(id, key) {
    var group = $(id);
    group.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      group.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      state[key] = b.dataset.v;
      pain();
    });
  }
  seg("segLast", "last");
  seg("segAds", "ads");
  [inLeads, inValue, inClose, inReply, inBook].forEach(function (r) { r.addEventListener("input", calc); });

  /* ---------------- Step 2: the conversation ----------------
     Two engines share one phone. Script mode (default, offline) reads typed
     replies with simple intent matching. Live mode hands every reply after the
     opener to Claude, using this niche's playbook as the system prompt. */
  var thread = $("thread"), feed = $("feed"), replies = $("replies");
  var composer = $("composer"), msgIn = $("msgIn");
  var convoStarted = false, token = 0, busy = false;
  var A = {}, history = [], current = null, aiStage = false, aiFailed = false;

  var RE = {
    stop: /\b(stop|unsubscribe|remove me|don'?t text|do not text|leave me alone)\b/,
    no: /\b(no|nope|nah|not interested|not anymore|already|pass|sorted|handled|went with|found someone|wrong number)\b/,
    yes: /\b(yes|yeah|yea|yep|yup|sure|ok|okay|still|absolutely|definitely|interested|correct|that'?s me|it is|sounds good|go ahead|please)\b/,
    who: /\b(who('?s| is)? (this|that)|who are you|what is this|how did you get)\b|^who\??$/,
    bot: /\b(bot|robot|a\.?i\.?|real person|human|automated|computer)\b/,
    price: /\b(price|prices|pricing|cost|costs|how much|rate|rates|expensive|fee|fees|quote|worth|afford)\b|\$/,
    call: /\b(call me|phone me|give me a call|ring me|call instead)\b/
  };

  function liveKey() { try { return localStorage.getItem("nsr-ai-key") || ""; } catch (e) { return ""; } }
  function live() { return !!liveKey() && !aiFailed; }
  function setMode() {
    var pill = $("modePill");
    pill.textContent = live() ? (provider() === "anthropic" ? "Live · Claude" : "Live · OpenAI") : "Script";
    pill.classList.toggle("live", live());
  }

  function scroll() { feed.scrollTop = feed.scrollHeight; }
  function add(html, cls, plain) {
    var d = document.createElement("div");
    d.className = "msg " + cls + (reduced ? "" : " msg-enter");
    d.innerHTML = html;
    thread.appendChild(d);
    if (cls === "in") history.push({ role: "assistant", text: plain });
    if (cls === "out") history.push({ role: "user", text: plain });
    scroll();
    return d;
  }
  function beat(n) {
    document.querySelectorAll(".beat").forEach(function (b) {
      if (Number(b.dataset.beat) <= n) b.classList.add("on");
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduced ? Math.min(ms, 150) : ms); }); }
  function setBusy(b) {
    busy = b;
    composer.classList.toggle("busy", b);
    composer.querySelector("button").disabled = b;
  }
  function typingDots() {
    var t = document.createElement("div");
    t.className = "typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    thread.appendChild(t);
    scroll();
    return t;
  }

  /* Typing indicator, then each AI line in turn. Nothing already shown is ever removed. */
  function say(lines, done) {
    var my = token;
    replies.innerHTML = "";
    setBusy(true);
    var i = 0;
    function next() {
      if (my !== token) return;
      if (i >= lines.length) { setBusy(false); if (done) done(); return; }
      var t = typingDots();
      var line = lines[i++];
      wait(Math.min(1500, 500 + line.length * 12)).then(function () {
        if (my !== token) return;
        t.remove();
        add(esc(line), "in", line);
        wait(250).then(next);
      });
    }
    wait(350).then(next);
  }
  function note(text, ai) { add(esc(text), "note" + (ai ? " ai" : "")); }

  /* A reply point: tappable chips plus whatever the lead types.
     opts.free(text) takes any typed answer the chips don't cover. */
  function ask(options, opts) {
    current = { options: options, opts: opts || {} };
    replies.innerHTML = "";
    options.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "reply" + (o.alt ? " alt" : "");
      b.textContent = o.label;
      b.addEventListener("click", function () {
        if (busy) return;
        replies.innerHTML = "";
        current = null;
        if (!o.silent) add(esc(o.label.toLowerCase()), "out", o.label.toLowerCase());
        if (aiStage && live() && !o.local) return liveTurn();
        o.then(o.label);
      });
      replies.appendChild(b);
    });
  }

  function onType(text) {
    if (busy || !text) return;
    add(esc(text), "out", text);
    replies.innerHTML = "";
    if (RE.price.test(text.toLowerCase())) { A.price = true; }
    if (RE.stop.test(text.toLowerCase())) { current = null; return optOut(); }
    if (aiStage && live()) return liveTurn();
    route(text);
  }
  composer.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = msgIn.value.trim();
    if (!v || busy) return;
    msgIn.value = "";
    onType(v);
  });

  /* Script mode: match typed text to the current reply point */
  function route(text) {
    var t = text.toLowerCase();
    if (!current) {
      return say([A.slot ? "got it. see you " + A.slot.toLowerCase() + "!" : "got it, thanks!"], function () {
        if (A.slot) nextBtn();
        else ask([{ label: "Start over", silent: true, local: true, then: startConvo }]);
      });
    }
    var c = current;
    current = null;
    if (A.stopped) return c.opts.free(text);
    if (RE.stop.test(t)) return optOut();
    var opts = c.options.slice().sort(function (a, b) { return (b.first ? 1 : 0) - (a.first ? 1 : 0); });
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].match && opts[i].match.test(t)) return opts[i].then(text);
    }
    var again = function () { ask(c.options, c.opts); };
    if (RE.bot.test(t)) {
      return say(["i'm " + P.ai.toLowerCase() + ", the booking assistant at " + P.biz + ". " + P.advisorShort.toLowerCase() + " is a real person and handles the detailed questions."], again);
    }
    if (RE.price.test(t) && !c.opts.noPrice) {
      beat(4);
      A.price = true;
      return say([swapAdvisor(N.price.ai)], again);
    }
    if (c.opts.free) return c.opts.free(text);
    say([c.opts.reprompt || "sorry, just so i get this right: is that a yes?"], again);
  }

  function chipMatch(label) {
    var words = label.toLowerCase().replace(/[^a-z0-9$+ ]/g, " ").split(/\s+/).filter(function (w) {
      return w.length > 3 && ["this", "that", "with", "want", "just", "your", "have", "been", "time", "years"].indexOf(w) < 0;
    });
    return words.length ? new RegExp("\\b(" + words.join("|").replace(/[$+]/g, "\\$&") + ")") : null;
  }
  /* If the lead already answered the first question, use it instead of asking again */
  function toQ1(text) {
    var hit = text && N.q1.chips.filter(function (c) { var r = chipMatch(c); return r && r.test(text.toLowerCase()); })[0];
    if (hit) { A.q1 = hit; return q2(); }
    q1();
  }
  function article(w) { return /^[aeiou]/i.test(w) ? "an" : "a"; }
  function slotMatch(slot) {
    var parts = slot.toLowerCase().split(" ");
    var hour = (slot.match(/(\d{1,2})(:\d\d)?/) || [])[1];
    return new RegExp("\\b(" + parts[0].slice(0, 3) + "\\w*" + (hour ? "|" + hour + "(:\\d\\d)?\\s*(am|pm)?" : "") + ")\\b");
  }

  function startConvo() {
    token++;
    convoStarted = true;
    aiStage = false;
    A = { q1: null, q2: null, slot: null, price: false, closed: false };
    history = [];
    thread.innerHTML = "";
    setBusy(false);
    setMode();
    document.querySelectorAll(".beat").forEach(function (b) { b.classList.remove("on"); });
    var s = document.createElement("span");
    s.className = "stamp";
    s.style.alignSelf = "center";
    s.textContent = "Today 7:42 pm";
    thread.appendChild(s);
    beat(1);
    say([
      "hey, it's " + P.ai.toLowerCase() + " from " + P.biz + ".",
      "is this the same " + P.lead + " that was interested in " + P.service + " recently?"
    ], function () {
      ask([
        { label: "Yes, that's me", match: RE.yes, then: followUp },
        { label: "Who is this?", alt: true, match: RE.who, first: true, then: whoIsThis },
        { label: "Not interested anymore", alt: true, match: RE.no, first: true, then: notNow }
      ], { free: function () { goLive(followUp); }, noPrice: true });
    });
  }

  /* After the opener: live mode takes over from here unless the lead said yes,
     in which case the templated follow-up goes first, as in the playbook. */
  function goLive(fallback) {
    if (!live()) return fallback();
    aiStage = true;
    beat(3);
    note("AI takes over", true);
    liveTurn();
  }

  function whoIsThis() {
    if (live()) return goLive(whoIsThis);
    say([
      "sorry! it's " + P.ai.toLowerCase() + " from " + P.biz + ". you asked us about " + P.service + " a while back and i'm just following up.",
      "is that still on your mind?"
    ], function () {
      ask([
        { label: "Yes, actually", match: RE.yes, then: followUp },
        { label: "Not anymore", alt: true, match: RE.no, first: true, then: closeOut }
      ], { reprompt: "no worries. is " + names().svcShort + " still something you're thinking about?" });
    });
  }
  function notNow() {
    if (live()) return goLive(notNow);
    say(["totally fair, thanks for telling me. did you get it sorted, or was the timing just off?"], function () {
      ask([
        { label: "Timing was off", match: /\b(timing|time|busy|later|not yet|wasn'?t ready|money|budget)\b/, then: function () {
          beat(3);
          note("AI takes over", true);
          say(["that happens. no pressure at all. can i ask a couple of quick questions so you have real info when you're ready?"], function () {
            ask([
              { label: "Sure", match: RE.yes, then: q1 },
              { label: "No thanks", alt: true, match: RE.no, first: true, then: closeOut }
            ]);
          });
        } },
        { label: "Already sorted", alt: true, match: RE.no, first: true, then: closeOut }
      ], { reprompt: "no worries either way. did you already get it taken care of?" });
    });
  }
  function closeOut() {
    A.closed = true;
    say([
      "glad it's handled. i'll close your file so you don't hear from us again.",
      "if anything changes, this number works anytime."
    ], function () {
      note("Lead closed. No more texts. Nobody gets chased.");
      ask([{ label: "Start over and say yes", silent: true, local: true, then: startConvo }], {
        free: function () { A.closed = false; say(["oh good, glad you reached out!"], followUp); }
      });
    });
  }
  function optOut() {
    if (A.stopped) return stoppedAsk();
    A.stopped = true;
    A.closed = true;
    aiStage = false;
    say(["you're unsubscribed and won't get any more texts from us. sorry for the bother."], function () {
      note("Opted out. Number suppressed from every future campaign.");
      stoppedAsk();
    });
  }
  /* After STOP, nothing the lead types gets a reply */
  function stoppedAsk() {
    ask([{ label: "Start over", silent: true, local: true, then: startConvo }], {
      free: function () { note("No reply sent. Opted-out numbers never get another text."); stoppedAsk(); }
    });
  }
  function followUp() {
    beat(2);
    var n = names();
    say([
      "thank goodness. my calendar just pinged me to call, but i didn't want to disturb you.",
      "are you still looking for help with " + n.svcShort + "?"
    ], function () {
      if (live()) {
        aiStage = true;
        beat(3);
        note("AI takes over", true);
        return ask([
          { label: "Yes, still looking", then: function () {} },
          { label: "How much is it?", alt: true, then: function () {} }
        ]);
      }
      ask([
        { label: "Yes, still looking", match: RE.yes, then: function (v) { beat(3); note("AI takes over", true); toQ1(v); } },
        { label: "Depends on the price", alt: true, match: RE.price, first: true, then: function () {
          beat(4); note("AI takes over", true);
          A.price = true;
          say([swapAdvisor(N.price.ai), "mind if i ask two quick questions so " + P.advisorShort.toLowerCase() + " is ready for you?"], function () {
            ask([{ label: "Go ahead", match: RE.yes, then: function (v) { beat(3); toQ1(v); } }], { free: function (v) { beat(3); toQ1(v); } });
          });
        } },
        { label: "Not anymore", alt: true, match: RE.no, first: true, then: closeOut }
      ], { free: function (v) { beat(3); note("AI takes over", true); toQ1(v); }, noPrice: true });
    });
  }
  function q1() {
    say([N.q1.ai], function () {
      ask(N.q1.chips.map(function (c) {
        return { label: c, match: chipMatch(c), then: function () { A.q1 = c; q2(); } };
      }), { free: function (v) { A.q1 = v; q2(); } });
    });
  }
  function q2() {
    var opts = N.q2.chips.map(function (c) {
      return { label: c, match: chipMatch(c), then: function () { A.q2 = c; offer(); } };
    });
    if (!A.price) {
      opts.push({ label: N.price.ask, alt: true, match: RE.price, first: true, then: function () {
        beat(4);
        A.price = true;
        say([swapAdvisor(N.price.ai), "so, quickly: " + N.q2.ai.replace(/^[^.]*\.\s*/, "")], function () {
          ask(N.q2.chips.map(function (c) {
            return { label: c, match: chipMatch(c), then: function () { A.q2 = c; offer(); } };
          }), { free: function (v) { A.q2 = v; offer(); } });
        });
      } });
    }
    say([N.q2.ai], function () { ask(opts, { free: function (v) { A.q2 = v; offer(); } }); });
  }
  function offer() {
    var slots = N.slots;
    var slotOpts = function () {
      return [
        { label: slots[0], match: slotMatch(slots[0]), then: function () { book(slots[0]); } },
        { label: slots[1], match: slotMatch(slots[1]), then: function () { book(slots[1]); } }
      ];
    };
    say([
      "perfect, that helps a lot. " + P.advisorShort.toLowerCase() + " has " + slots[0].toLowerCase() + " or " + slots[1].toLowerCase() + " open for " + article(N.apptType) + " " + N.apptType.toLowerCase() + ".",
      "which works better?"
    ], function () {
      ask(slotOpts().concat([
        { label: "Can someone call me instead?", alt: true, match: RE.call, first: true, then: function () {
          say(["of course. " + P.advisorShort.toLowerCase() + " can call you at either time. which one?"], function () {
            ask(slotOpts(), { free: otherTime });
          });
        } },
        { label: "Neither works", alt: true, match: /\b(neither|none|no|can'?t|cannot|other|different|another)\b/, first: true, then: function () { otherTime(); } }
      ]), { free: otherTime });
    });
  }
  var TIME = /\b(mon|tue|wed|thu|fri|sat|sun|tomorrow|today|tonight|morning|afternoon|evening|noon|next week|\d{1,2}(:\d\d)?\s*(am|pm)?)/;
  function otherTime(text) {
    if (text && TIME.test(text.toLowerCase())) return book(text.charAt(0).toUpperCase() + text.slice(1));
    var adv = P.advisorShort.toLowerCase();
    var again = function () { ask([], { free: otherTime }); };
    if (text && RE.call.test(text.toLowerCase())) return say(["sure, " + adv + " can call you. what day and time is best?"], again);
    say([text ? "no problem. what day and time works for you? even a rough time is fine." : "no problem. what day and time works best for you? i'll get it on " + adv + "'s calendar."], again);
  }
  function book(slot) {
    A.slot = slot;
    beat(5);
    var n = names();
    say([
      "you're all set for " + slot.toLowerCase() + " with " + n.advisorFull.toLowerCase() + ". i'll text you a reminder the day before.",
      "if anything comes up, call us at " + P.phone + "."
    ], booked);
  }
  function booked() {
    add("<b>Booked</b><span>" + esc(N.apptType) + " · " + esc(A.slot) + "</span>", "booked");
    aiStage = false;
    nextBtn();
    $("toMorning").focus({ preventScroll: true });
  }
  function nextBtn() {
    current = null;
    replies.innerHTML = "";
    var b = document.createElement("button");
    b.type = "button";
    b.className = "reply";
    b.textContent = "See what your team gets →";
    b.addEventListener("click", function () { go(3); });
    replies.appendChild(b);
  }
  $("restart").addEventListener("click", startConvo);

  /* ---------------- Live mode: Claude writes the replies ---------------- */
  var sdk = null;
  function loadSdk() {
    if (!sdk) sdk = import("https://esm.sh/@anthropic-ai/sdk@0.60.0").then(function (m) { return m.default || m.Anthropic; });
    return sdk;
  }
  function systemPrompt() {
    var n = names();
    return [
      "You are " + P.ai + ", the text-message assistant for " + P.biz + ", a " + N.owner + ". This is a live sales demo: the business owner is role-playing " + P.lead + ", a past lead who asked about " + P.service + " a while back and never booked. Your texts appear on a phone screen, so they have to read like real SMS from a friendly, competent person.",
      "",
      "Goal: restart the conversation, qualify the lead, and book " + article(N.apptType) + " " + N.apptType.toLowerCase() + " (" + N.apptLength + ") with " + n.advisorFull + ". The opening texts are already sent and appear in the conversation.",
      "",
      "How to text:",
      "- lowercase, casual and warm. one or two short sentences per text, and at most two texts per turn, each on its own line.",
      "- no emojis, no markdown, no lists, no salesy hype. ask one question at a time.",
      "- in your own words, find out: (1) " + N.q1.ai + " (2) " + N.q2.ai,
      "- never quote prices, rates, payments or estimates. if asked, explain that " + P.advisorShort + " gives exact numbers at the appointment, then keep moving toward booking. example of the right tone: \"" + swapAdvisor(N.price.ai) + "\"",
      "- offer these two times: " + N.slots[0] + " or " + N.slots[1] + ". if neither works, ask what works and accept the time they give.",
      "- if they ask whether you're a bot, be honest: you're " + P.biz + "'s AI assistant and " + P.advisorShort + " is a real person.",
      "- don't invent facts about " + P.biz + " (hours, prices, promotions, guarantees, reviews). if you don't know, say " + P.advisorShort + " can answer that.",
      "- if they say they're not interested, ask once whether it was timing or whether they got it handled. if they still decline, close their file politely.",
      "",
      "Hidden markers (the demo strips these before showing your text; put each on its own final line):",
      "- when the lead answers the first question, add [[NOTE1: short answer]]. when they answer the second, add [[NOTE2: short answer]].",
      "- when the lead clearly accepts a time, confirm it, mention a reminder text the day before and that they can call " + P.phone + ", then add [[BOOKED: the time]].",
      "- when you close their file or they ask you to stop texting, add [[CLOSED]]."
    ].join("\n");
  }
  function apiMessages() {
    var msgs = [{ role: "user", content: "[demo starts: your opening texts arrive on " + P.lead + "'s phone]" }];
    history.forEach(function (h) {
      var last = msgs[msgs.length - 1];
      if (last.role === h.role) last.content += "\n" + h.text;
      else msgs.push({ role: h.role, content: h.text });
    });
    return msgs;
  }
  /* The saved key decides the provider: sk-ant-… is Anthropic, anything else OpenAI. */
  function provider() { return /^sk-ant-/.test(liveKey()) ? "anthropic" : "openai"; }
  function openaiModel() {
    try { return localStorage.getItem("nsr-ai-model") || "gpt-4o-mini"; } catch (e) { return "gpt-4o-mini"; }
  }
  function callClaude() {
    return loadSdk().then(function (Anthropic) {
      var client = new Anthropic({ apiKey: liveKey(), dangerouslyAllowBrowser: true });
      return client.beta.messages.create({
        model: "claude-opus-5-5",
        max_tokens: 4000,
        output_config: { effort: "low" },
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system: systemPrompt(),
        messages: apiMessages()
      });
    }).then(function (res) {
      if (res.stop_reason === "refusal") throw new Error("refusal");
      return res.content.filter(function (b) { return b.type === "text"; }).map(function (b) { return b.text; }).join("\n");
    });
  }
  function callOpenAI() {
    return fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + liveKey() },
      body: JSON.stringify({
        model: openaiModel(),
        messages: [{ role: "system", content: systemPrompt() }].concat(apiMessages())
      })
    }).then(function (r) {
      return r.json().then(function (data) {
        if (!r.ok) {
          var e = new Error((data.error && data.error.message) || "OpenAI error " + r.status);
          e.status = r.status;
          throw e;
        }
        return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
      });
    });
  }
  function liveTurn() {
    var my = token;
    setBusy(true);
    var t = typingDots();
    if (A.price) beat(4);
    var call = provider() === "anthropic" ? callClaude() : callOpenAI();
    call.then(function (text) {
      if (my !== token) return;
      t.remove();
      var m;
      if ((m = text.match(/\[\[NOTE1:\s*([^\]]+)\]\]/))) A.q1 = m[1].trim();
      if ((m = text.match(/\[\[NOTE2:\s*([^\]]+)\]\]/))) A.q2 = m[1].trim();
      var bookedAt = (text.match(/\[\[BOOKED:\s*([^\]]+)\]\]/) || [])[1];
      var closed = /\[\[CLOSED\]\]/.test(text);
      var lines = text.replace(/\[\[[^\]]*\]\]/g, "").split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 3);
      if (!lines.length) lines = ["sorry, say that one more time?"];
      say(lines, function () {
        if (bookedAt) { A.slot = bookedAt.trim(); beat(5); return booked(); }
        if (closed) {
          A.closed = true;
          aiStage = false;
          note("Lead closed. No more texts. Nobody gets chased.");
          return ask([{ label: "Start over", silent: true, local: true, then: startConvo }]);
        }
        msgIn.focus({ preventScroll: true });
      });
    }).catch(function (err) {
      if (my !== token) return;
      t.remove();
      setBusy(false);
      aiFailed = true;
      setMode();
      aiStage = false;
      var st = err && err.status;
      var why = st === 401 ? "the API key was rejected"
        : st === 429 ? "out of credits or rate limited"
        : st === 404 || st === 400 ? "the model name wasn't accepted; check it in Personalize"
        : "it couldn't connect";
      note("Live AI paused (" + why + "). Continuing in script mode.");
      if (window.console) console.warn("Live AI error:", err);
      q1();
    });
  }

  /* ---------------- Step 3: next morning ---------------- */
  function renderMorning() {
    var n = names();
    var slot = A.slot || N.slots[0];
    $("apptName").textContent = P.lead + ", " + N.apptType.toLowerCase();
    $("apptWhen").textContent = slot + " · " + N.apptLength + " with " + n.advisorFull;
    var facts = [
      [N.q1.field, A.q1 || N.q1.chips[0]],
      [N.q2.field, A.q2 || N.q2.chips[0]],
      ["Asked about price", A.price ? "Yes. Told the exact number comes at the appointment." : "No"],
      ["Source", "Old lead, reactivated by text"],
      ["Reminder", "Texted the day before"]
    ];
    $("apptFacts").innerHTML = facts.map(function (f) {
      return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>";
    }).join("");
    $("apptQuote").innerHTML = A.slot
      ? "Full text thread attached. Last reply from " + esc(P.lead) + ": <b>“" + esc(A.slot.toLowerCase()) + "”</b>"
      : "Full text thread attached. Play step 2 to fill this card with your answers.";

    $("calTitle").textContent = P.advisorShort + "'s day";
    var rows = [
      ["8:00 am", "Existing customer follow-up", false],
      ["9:30 am", "", false],
      ["11:00 am", "New inquiry from this week's ads", false],
      ["12:30 pm", "", false],
      ["2:00 pm", "Reactivated lead · " + P.lead, true],
      ["3:30 pm", "Reactivated lead · Sam R.", true],
      ["5:00 pm", "", false]
    ];
    $("calRows").innerHTML = rows.map(function (r) {
      var ev = r[1]
        ? '<div class="cal-ev' + (r[2] ? " new" : "") + '"><span>' + esc(r[1]) + "</span>" + (r[2] ? "<small>booked overnight</small>" : "") + "</div>"
        : "";
      return '<div class="cal-row"><time>' + r[0] + '</time><div class="cal-slot">' + ev + "</div></div>";
    }).join("");

    var bumps = [
      ["Day 2", "hey " + P.lead.toLowerCase() + ", just bumping this in case it got buried."],
      ["Day 3", "no worries if the timing's off. should i keep your file open or close it out?"],
      ["Day 5", "last one from me. still want help with " + n.svcShort + "? a quick yes or no is perfect."]
    ];
    $("bumpList").innerHTML = bumps.map(function (b) {
      return "<li><time>" + b[0] + '</time><div class="msg in">' + esc(b[1]) + "</div></li>";
    }).join("");
  }

  /* ---------------- Step 4: the deal ---------------- */
  function renderDeal() {
    var c = calc.out;
    $("h4").textContent = "Let's start with " + count(Math.max(1, Math.round(c.testClosed))) + " customers you already paid for.";
    $("testEst").textContent = "From your numbers, that's about " + count(c.testBooked) + " booked appointments and " +
      count(c.testClosed) + " new customers, worth roughly " + NSR.money(c.testClosed * c.value) + ". That's an estimate, not a promise.";
    if (!$("fBiz").value && P.custom) $("fBiz").value = P.biz;
    if (!$("fLeads").value) $("fLeads").value = count(c.leads);
  }
  var summary = "";
  $("auditForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    var bad = ["name", "biz", "phone"].filter(function (k) { return !f[k].value.trim(); });
    f.querySelectorAll("input").forEach(function (i) { i.removeAttribute("aria-invalid"); });
    if (bad.length) {
      bad.forEach(function (k) { f[k].setAttribute("aria-invalid", "true"); });
      $("formNote").textContent = "Add your name, business and mobile so Connor can reach you.";
      f[bad[0]].focus();
      return;
    }
    summary = "Lead audit request (" + N.label + " demo)\n" +
      "Name: " + f.name.value.trim() + "\nBusiness: " + f.biz.value.trim() +
      "\nMobile: " + f.phone.value.trim() + (f.email.value.trim() ? "\nEmail: " + f.email.value.trim() : "") +
      "\nOld leads: " + (f.leads.value.trim() || "unknown");
    $("doneText").textContent = "Text these details to Connor at " + NSR.contact.phoneDisplay + " and he'll set up your free lead audit.";
    $("smsLink").href = "sms:" + NSR.contact.phoneE164 + "?&body=" + encodeURIComponent(summary);
    f.hidden = true;
    $("formDone").hidden = false;
  });
  $("copyBtn").addEventListener("click", function () {
    var b = this;
    function ok() { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy details"; }, 1800); }
    if (navigator.clipboard) navigator.clipboard.writeText(summary).then(ok, function () { b.textContent = "Copy failed"; });
  });

  /* ---------------- Personalize drawer ---------------- */
  var drawer = $("drawer"), pForm = $("pForm"), lastFocus = null;
  function openDrawer() {
    lastFocus = document.activeElement;
    NSR.fields.forEach(function (k) { pForm[k].value = P[k]; });
    pForm.aiKey.value = liveKey();
    pForm.aiModel.value = openaiModel();
    link();
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    setTimeout(function () { pForm.biz.focus(); }, 50);
  }
  function closeDrawer() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    if (lastFocus) lastFocus.focus();
  }
  function link() {
    var u = new URL(location.href.split("#")[0]);
    u.search = "";
    u.searchParams.set("n", N.id);
    NSR.fields.forEach(function (k) { if (pForm[k].value.trim()) u.searchParams.set(k, pForm[k].value.trim()); });
    $("pLink").textContent = u.toString();
  }
  pForm.addEventListener("input", link);
  pForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = {};
    NSR.fields.forEach(function (k) { v[k] = pForm[k].value.trim(); });
    NSR.savePersonal(N, v);
    try {
      var key = pForm.aiKey.value.trim();
      if (key) localStorage.setItem("nsr-ai-key", key); else localStorage.removeItem("nsr-ai-key");
      var model = pForm.aiModel.value.trim();
      if (model) localStorage.setItem("nsr-ai-model", model); else localStorage.removeItem("nsr-ai-model");
    } catch (err) {}
    aiFailed = false;
    applyPersonal(true);
    closeDrawer();
  });
  $("pReset").addEventListener("click", function () {
    try { localStorage.removeItem("nsr-p-" + N.id); } catch (e) {}
    var u = new URL(location.href);
    NSR.fields.forEach(function (k) { u.searchParams.delete(k); });
    history.replaceState(null, "", u.toString());
    applyPersonal(true);
    NSR.fields.forEach(function (k) { pForm[k].value = P[k]; });
    link();
  });
  $("personalizeBtn").addEventListener("click", openDrawer);
  $("drawerX").addEventListener("click", closeDrawer);
  drawer.addEventListener("click", function (e) { if (e.target === drawer) closeDrawer(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
    if (e.key === "Tab" && drawer.classList.contains("open")) {
      var els = drawer.querySelectorAll("button, input");
      var first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- Init ---------------- */
  function applyPersonal(restart) {
    P = NSR.personal(N);
    var label = P.custom ? P.biz : N.label;
    document.title = label + " demo · Night Shift Revenue";
    $("crumbNiche").textContent = label;
    $("phoneName").textContent = P.biz;
    $("phoneNum").textContent = P.phone;
    $("avatar").textContent = P.ai.charAt(0).toUpperCase();
    $("sub2").textContent = "Picture this: you asked " + P.biz + " about " + P.service + " a while back, then life got busy. Tonight this text arrives. Reply however you'd really reply.";
    setMode();
    if (restart && convoStarted) startConvo();
    if (step === 3) renderMorning();
  }

  $("h1").textContent = N.headline;
  $("sub1").textContent = N.sub + " First, a quick look at what's sitting in your list.";
  $("valueLabel").textContent = N.valueLabel;
  $("closeLabel").textContent = N.closeLabel;
  inLeads.value = N.defaults.leads;
  inValue.value = N.defaults.value;
  inClose.value = N.defaults.close;
  applyPersonal(false);
  calc();
  var start = Number((location.hash.match(/step(\d)/) || [])[1]) || 1;
  go(Math.min(4, Math.max(1, start)));
})();
