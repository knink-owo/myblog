/**
 * Music player — auto-parses song list from music-recommendation page.
 *
 * To add a song, just edit content/music-recommendation.md:
 *
 *   ## 歌名
 *   - **作者**: 作者名
 *   - **音频**: attachment/filename.mp3
 */
(function () {
  if (window.__musicPlayerLoaded) return;
  window.__musicPlayerLoaded = true;

  var SONG_SLUG = "music-recommendation";

  function basepath() {
    var bp = document.body.dataset.basepath || "";
    return bp === "." ? "" : bp;
  }

  function songPageUrl() {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      return "/" + SONG_SLUG;
    }
    return basepath() + "/" + SONG_SLUG;
  }

  // ============================================================
  // Parse the music-recommendation page HTML
  // ============================================================
  function parseSongs(html) {
    var songs = [];
    var div = document.createElement("div");
    div.innerHTML = html;
    var article = div.querySelector("article");
    if (!article) return songs;
    var h2s = article.querySelectorAll("h2");
    for (var i = 0; i < h2s.length; i++) {
      var h2 = h2s[i];
      var title = (h2.textContent || "").trim();
      if (!title) continue;
      var artist = "", audioSrc = "";
      var el = h2.nextElementSibling;
      while (el) {
        if (el.tagName === "H2") break;
        if (el.tagName === "UL") {
          var lis = el.querySelectorAll("li");
          for (var j = 0; j < lis.length; j++) {
            var t = (lis[j].textContent || "").trim();
            var ma = t.match(/^作者\s*[:：]\s*(.+)/);
            var mm = t.match(/^音频\s*[:：]\s*(.+)/);
            if (ma) artist = ma[1].trim();
            if (mm) audioSrc = mm[1].trim();
          }
        }
        el = el.nextElementSibling;
      }
      if (audioSrc) {
        songs.push({ title: title, artist: artist || "未知", src: audioSrc, slug: h2.id || "" });
      }
    }
    return songs;
  }

  async function loadPlaylist() {
    try {
      var resp = await fetch(songPageUrl());
      if (!resp.ok) return [];
      return parseSongs(await resp.text());
    } catch (e) { return []; }
  }

  // ============================================================
  // State
  // ============================================================
  var playlist = [];
  var currentIndex = 0;
  var isPlaying = false;
  var audio = null;
  var cardEl = null;

  // ============================================================
  // Helpers
  // ============================================================
  function resolveSrc(src) {
    if (/^(https?:|\/)/.test(src)) return src;
    return basepath() ? basepath() + "/" + src : src;
  }

  function songUrl(idx) {
    if (idx === undefined) idx = currentIndex;
    var s = playlist[idx];
    if (!s) return songPageUrl();
    return songPageUrl() + (s.slug ? "#" + s.slug : "");
  }

  // ============================================================
  // UI — build card
  // ============================================================
  function buildUI() {
    var sidebar = document.querySelector(".sidebar.left");
    if (!sidebar) return;
    var old = sidebar.querySelector(".music-card");
    if (old) old.remove();

    var card = document.createElement("div");
    card.className = "music-card";

    // Row 1: 🎵 + song title (inline)
    var row1 = document.createElement("div");
    row1.className = "music-card-row1";

    var note = document.createElement("span");
    note.className = "music-card-note";
    note.textContent = "🎵";
    row1.appendChild(note);

    var titleA = document.createElement("a");
    titleA.className = "music-card-title";
    titleA.href = songPageUrl();
    titleA.textContent = "加载中…";
    row1.appendChild(titleA);

    card.appendChild(row1);

    // Row 2: artist
    var artistS = document.createElement("span");
    artistS.className = "music-card-artist";
    card.appendChild(artistS);

    // Row 3: controls
    var ctrls = document.createElement("div");
    ctrls.className = "music-card-controls";

    var prevBtn = document.createElement("button");
    prevBtn.className = "music-card-btn";
    prevBtn.innerHTML = "⏮";
    prevBtn.title = "上一首";
    prevBtn.addEventListener("click", prevSong);
    ctrls.appendChild(prevBtn);

    var playBtn = document.createElement("button");
    playBtn.className = "music-card-btn music-card-btn-play";
    playBtn.innerHTML = "▶";
    playBtn.title = "播放";
    playBtn.addEventListener("click", togglePlay);
    ctrls.appendChild(playBtn);

    var nextBtn = document.createElement("button");
    nextBtn.className = "music-card-btn";
    nextBtn.innerHTML = "⏭";
    nextBtn.title = "下一首";
    nextBtn.addEventListener("click", nextSong);
    ctrls.appendChild(nextBtn);

    card.appendChild(ctrls);

    // Row 4: progress bar
    var prog = document.createElement("div");
    prog.className = "music-card-progress";
    var progFill = document.createElement("div");
    progFill.className = "music-card-progress-fill";
    prog.appendChild(progFill);
    card.appendChild(prog);

    sidebar.appendChild(card);

    cardEl = card;
    cardEl.__title = titleA;
    cardEl.__artist = artistS;
    cardEl.__playBtn = playBtn;
    cardEl.__progress = progFill;

    updateDisplay();
  }

  function updateDisplay() {
    if (!cardEl) return;
    if (playlist.length === 0) {
      cardEl.__title.textContent = "无歌曲";
      cardEl.__artist.textContent = "在音乐推荐页添加歌曲";
      return;
    }
    var s = playlist[currentIndex];
    cardEl.__title.textContent = s.title;
    cardEl.__title.href = songUrl();
    cardEl.__artist.textContent = s.artist;
    cardEl.__artist.style.display = s.artist ? "" : "none";
  }

  function updatePlayBtn() {
    if (!cardEl) return;
    cardEl.__playBtn.innerHTML = isPlaying ? "⏸" : "▶";
  }

  function updateProgress() {
    if (!cardEl || !audio || !audio.duration) return;
    var pct = (audio.currentTime / audio.duration) * 100;
    cardEl.__progress.style.width = pct + "%";
  }

  // ============================================================
  // Audio control
  // ============================================================
  function playCurrent() {
    if (playlist.length === 0) return;
    var s = playlist[currentIndex];
    if (!audio) {
      audio = new Audio();
      audio.addEventListener("ended", nextSong);
      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("error", function () {
        isPlaying = false;
        updatePlayBtn();
      });
    }
    audio.src = resolveSrc(s.src);
    audio.play().then(function () {
      isPlaying = true;
      updatePlayBtn();
    }).catch(function () {
      isPlaying = false;
      updatePlayBtn();
    });
  }

  function togglePlay() {
    if (playlist.length === 0) return;
    if (!audio) { playCurrent(); return; }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      updatePlayBtn();
    } else {
      audio.play().then(function () {
        isPlaying = true;
        updatePlayBtn();
      }).catch(function () {
        isPlaying = false;
        updatePlayBtn();
      });
    }
  }

  function prevSong() {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    isPlaying = false;
    updateDisplay();
    playCurrent();
  }

  function nextSong() {
    if (playlist.length === 0) return;
    currentIndex = (currentIndex + 1) % playlist.length;
    isPlaying = false;
    updateDisplay();
    playCurrent();
  }

  // ============================================================
  // Lifecycle
  // ============================================================
  function destroy() {
    if (audio) {
      audio.pause();
      audio.removeEventListener("ended", nextSong);
      audio.removeEventListener("timeupdate", updateProgress);
      audio.src = "";
      audio = null;  // Force recreate on next play — fixes SPA bug
    }
    isPlaying = false;
    currentIndex = 0;
    cardEl = null;
  }

  var initAttempts = 0;
  async function init() {
    var sidebar = document.querySelector(".sidebar.left");
    if (!sidebar) {
      if (++initAttempts < 30) setTimeout(init, 300);
      return;
    }
    initAttempts = 0;

    // Build card with "loading" state
    buildUI();

    // Load songs
    playlist = await loadPlaylist();
    if (playlist.length > 0) {
      updateDisplay();
    } else {
      if (cardEl) {
        cardEl.__title.textContent = "无歌曲";
        cardEl.__artist.textContent = "在音乐推荐页添加歌曲";
      }
    }
  }

  function tryStart() {
    if (document.querySelector(".sidebar.left")) { init(); return true; }
    return false;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryStart);
    tryStart();
  } else {
    tryStart();
  }

  document.addEventListener("nav", function () {
    destroy();
    init();
  });
  document.addEventListener("prenav", function () {
    if (audio) audio.pause();
  });
})();
