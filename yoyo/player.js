'use strict';
const players = Array.from(document.querySelectorAll('audio'));
const continuous = document.getElementById('continue');
const statusText = document.getElementById('status');
players.forEach((player, index) => {
  const card = player.closest('.story');
  const title = card.querySelector('h3').textContent;
  player.addEventListener('play', () => {
    players.forEach(other => { if (other !== player) other.pause(); });
    card.classList.add('playing');
    statusText.textContent = `正在播放：${title}`;
    if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: '悠悠 · 晚安故事', album: '宝宝的温柔睡前故事' });
    }
  });
  player.addEventListener('pause', () => {
    card.classList.remove('playing');
    if (!player.ended && players.every(item => item.paused)) statusText.textContent = `已暂停：${title}`;
  });
  player.addEventListener('ended', async () => {
    card.classList.remove('playing');
    if (!continuous.checked || index === players.length - 1) {
      statusText.textContent = index === players.length - 1 && continuous.checked ? '故事听完了。晚安，好梦。' : `${title}，讲完啦。`;
      return;
    }
    const next = players[index + 1];
    next.currentTime = 0;
    try { await next.play(); }
    catch { statusText.textContent = '下一个故事准备好了，轻点播放即可继续。'; }
  });
  player.addEventListener('error', () => { statusText.textContent = '故事暂时加载失败，请检查网络后刷新页面重试。'; });
});
