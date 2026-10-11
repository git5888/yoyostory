'use strict';
const players = Array.from(document.querySelectorAll('audio'));
const continuous = document.getElementById('continue');
const statusText = document.getElementById('status');
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
const collectionTitles = {
  english3: '爸爸陪我学英语第三辑',
  english2: '爸爸陪我学英语第二辑',
  english: '爸爸陪我学英语',
  bedtime: '睡前故事',
};
function selectCollection(name, focus = false) {
  if (!panels.some(panel => panel.dataset.collection === name)) name = 'english3';
  players.forEach(player => player.pause());
  tabs.forEach(tab => {
    const selected = tab.dataset.collection === name;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  panels.forEach(panel => { panel.hidden = panel.dataset.collection !== name; });
  statusText.textContent = `${collectionTitles[name]}：选一个故事，轻点播放。`;
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    selectCollection(tab.dataset.collection);
    history.replaceState(null, '', '#' + tab.dataset.collection);
  });
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    selectCollection(tabs[nextIndex].dataset.collection, true);
    history.replaceState(null, '', '#' + tabs[nextIndex].dataset.collection);
  });
});
window.addEventListener('hashchange', () => selectCollection(location.hash.slice(1)));
players.forEach(player => {
  const card = player.closest('.story');
  const panel = player.closest('[role="tabpanel"]');
  const title = card.querySelector('h3').textContent;
  player.addEventListener('play', () => {
    players.forEach(other => { if (other !== player) other.pause(); });
    card.classList.add('playing');
    statusText.textContent = `正在播放：${title}`;
    if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: '悠悠 · 故事时光', album: collectionTitles[panel.dataset.collection] });
    }
  });
  player.addEventListener('pause', () => {
    card.classList.remove('playing');
    if (!panel.hidden && !player.ended && players.every(item => item.paused)) statusText.textContent = `已暂停：${title}`;
  });
  player.addEventListener('ended', async () => {
    card.classList.remove('playing');
    const collectionPlayers = Array.from(panel.querySelectorAll('audio'));
    const next = collectionPlayers[collectionPlayers.indexOf(player) + 1];
    if (!continuous.checked || panel.hidden || !next) {
      statusText.textContent = continuous.checked && !next ? '这一辑故事听完啦，休息一下吧。' : `${title}，讲完啦。`;
      return;
    }
    next.currentTime = 0;
    try { await next.play(); }
    catch { statusText.textContent = '下一个故事准备好了，轻点播放即可继续。'; }
  });
  player.addEventListener('error', () => { statusText.textContent = '故事暂时加载失败，请检查网络后刷新页面重试。'; });
});
selectCollection(location.hash.slice(1) || 'english3');
