// 国際音声記号 (IPA) キーボード アプリケーションスクリプト (Swiss Style)

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('ipa-input');
  const tooltip = document.getElementById('smart-tooltip');
  const statusSymbol = document.getElementById('status-symbol');
  const statusName = document.getElementById('status-name');
  const statusDesc = document.getElementById('status-desc');
  const helpModal = document.getElementById('help-modal');
  const helpCloseBtn = document.getElementById('help-close-btn');
  const helpTriggerBtn = document.getElementById('help-trigger-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  // UNDO履歴管理
  const historyStack = [];
  const maxHistory = 50;

  function pushHistory() {
    const state = {
      val: textarea.value,
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    };
    // 直前の状態と全く同じなら二重登録しない
    if (historyStack.length > 0) {
      const last = historyStack[historyStack.length - 1];
      if (last.val === state.val && last.start === state.start && last.end === state.end) {
        return;
      }
    }
    historyStack.push(state);
    if (historyStack.length > maxHistory) {
      historyStack.shift();
    }
  }

  function undo() {
    if (historyStack.length === 0) {
      showToast('NOTHING TO UNDO');
      return;
    }
    const prevState = historyStack.pop();
    textarea.value = prevState.val;
    textarea.setSelectionRange(prevState.start, prevState.end);
    textarea.focus();
    updateCharCount();
    showToast('UNDO');
  }

  // テキスト挿入ユーティリティ
  function insertAtCursor(text) {
    pushHistory();
    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    textarea.value = currentVal.substring(0, start) + text + currentVal.substring(end);
    const newCursorPos = start + text.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    updateCharCount();
  }

  // 1文字削除（サロゲートペア・結合文字列対応）
  function deletePrevChar() {
    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    if (start !== end) {
      pushHistory();
      textarea.value = currentVal.substring(0, start) + currentVal.substring(end);
      textarea.setSelectionRange(start, start);
    } else if (start > 0) {
      pushHistory();
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' });
        const beforeSegments = Array.from(segmenter.segment(currentVal.substring(0, start)));
        if (beforeSegments.length > 0) {
          const lastSegment = beforeSegments[beforeSegments.length - 1];
          const delLen = lastSegment.segment.length;
          textarea.value = currentVal.substring(0, start - delLen) + currentVal.substring(start);
          textarea.setSelectionRange(start - delLen, start - delLen);
        }
      } else {
        textarea.value = currentVal.substring(0, start - 1) + currentVal.substring(start);
        textarea.setSelectionRange(start - 1, start - 1);
      }
    }
    updateCharCount();
  }

  // 囲み文字の追加 ([ ... ] または / ... /)
  function wrapSelection(openChar, closeChar) {
    pushHistory();
    textarea.focus();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    if (start !== end) {
      const selectedText = currentVal.substring(start, end);
      textarea.value = currentVal.substring(0, start) + openChar + selectedText + closeChar + currentVal.substring(end);
      textarea.setSelectionRange(start + 1, end + 1);
    } else if (currentVal.length > 0) {
      if (!currentVal.startsWith(openChar) || !currentVal.endsWith(closeChar)) {
        textarea.value = openChar + currentVal + closeChar;
        textarea.setSelectionRange(start + 1, start + 1);
      }
    } else {
      insertAtCursor(openChar + closeChar);
      textarea.setSelectionRange(start + 1, start + 1);
    }
    updateCharCount();
  }

  // トースト表示
  let toastTimer = null;
  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2000);
  }

  // クリップボードコピー
  async function copyToClipboard() {
    const val = textarea.value;
    if (!val) {
      showToast('NO CONTENT TO COPY');
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(val);
      } else {
        textarea.select();
        document.execCommand('copy');
      }
      showToast('COPIED TO CLIPBOARD');
    } catch (e) {
      showToast('COPY FAILED');
    }
  }

  // 文字数カウント更新
  function updateCharCount() {
    const countBadge = document.getElementById('char-count');
    if (countBadge) {
      const len = [...textarea.value].length;
      countBadge.textContent = `${len} CHARS`;
    }
  }

  // === イベント委任によるIPAボタンのクリック＆ホバー処理 ===
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-ipa]');
    if (btn) {
      const val = btn.getAttribute('data-ipa');
      insertAtCursor(val);
    }
  });

  // 操作バーボタン
  const actionBtns = {
    'btn-space': () => insertAtCursor(' '),
    'btn-bracket': () => wrapSelection('[', ']'),
    'btn-slash': () => wrapSelection('/', '/'),
    'btn-backspace': () => deletePrevChar(),
    'btn-clear': () => {
      if (textarea.value.length === 0) return;
      textarea.value = '';
      textarea.focus();
      updateCharCount();
      showToast('CLEARED');
    },
    'btn-copy': () => copyToClipboard(),
    'btn-undo': () => undo(),
    'btn-sample': () => {
      pushHistory();
      textarea.value = '/ɪntəˈnæʃənəl fəˈnɛtɪk ˈælfəbɛt/';
      updateCharCount();
      showToast('SAMPLE INSERTED');
    }
  };

  Object.entries(actionBtns).forEach(([id, handler]) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', handler);
  });

  textarea.addEventListener('input', updateCharCount);

  // === ホバー時のスマートツールチップ ＆ ステータスバー ===
  document.body.addEventListener('mousemove', (e) => {
    const btn = e.target.closest('button[data-ipa]');
    if (btn) {
      const ipa = btn.getAttribute('data-ipa');
      const info = window.IPA_DATA && window.IPA_DATA[ipa];
      const name = info ? info.name : ipa;
      const en = info ? info.en : '';
      const cat = info ? info.cat : '';

      tooltip.innerHTML = `
        <div class="tt-symbol">${escapeHtml(ipa)}</div>
        <div class="tt-body">
          <div class="tt-name">${escapeHtml(name)}</div>
          ${en ? `<div class="tt-en">${escapeHtml(en)}</div>` : ''}
          ${cat ? `<div class="tt-cat">${escapeHtml(cat)}</div>` : ''}
        </div>
      `;
      tooltip.style.display = 'flex';

      const ttWidth = 260;
      const ttHeight = 70;
      let left = e.clientX + 14;
      let top = e.clientY + 14;

      if (left + ttWidth > window.innerWidth - 10) {
        left = e.clientX - ttWidth - 14;
      }
      if (top + ttHeight > window.innerHeight - 10) {
        top = e.clientY - ttHeight - 14;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;

      if (statusSymbol) statusSymbol.textContent = `[ ${ipa} ]`;
      if (statusName) statusName.textContent = name;
      if (statusDesc) statusDesc.textContent = en ? `(${en}) · ${cat}` : cat;
    } else {
      tooltip.style.display = 'none';
    }
  });

  document.body.addEventListener('mouseleave', () => {
    tooltip.style.display = 'none';
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // === 「？」コマンド ＆ ヘルプモーダル ===
  function openHelp() {
    helpModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeHelp() {
    helpModal.classList.remove('active');
    document.body.style.overflow = '';
    textarea.focus();
  }

  if (helpTriggerBtn) helpTriggerBtn.addEventListener('click', openHelp);
  if (helpCloseBtn) helpCloseBtn.addEventListener('click', closeHelp);

  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) closeHelp();
  });

  // キーボードショートカット
  window.addEventListener('keydown', (e) => {
    // Ctrl+Z または Cmd+Z による UNDO
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
      // モーダルが開いていない場合に実行
      if (!helpModal.classList.contains('active')) {
        e.preventDefault();
        undo();
        return;
      }
    }

    if (e.key === 'Escape') {
      if (helpModal.classList.contains('active')) {
        closeHelp();
      }
      return;
    }

    if (e.key === '?' || (e.shiftKey && (e.key === '/' || e.key === '?'))) {
      const isInputFocused = document.activeElement === textarea;
      if (!isInputFocused || e.altKey || e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (helpModal.classList.contains('active')) {
          closeHelp();
        } else {
          openHelp();
        }
      }
    }
  });

  // === モバイル用タブ切り替えロジック ===
  const mobileTabs = document.querySelectorAll('.mobile-tab-btn');
  const sections = document.querySelectorAll('.swiss-section');

  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      mobileTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      sections.forEach(sec => {
        if (sec.id === targetId) {
          sec.classList.add('tab-active');
        } else {
          sec.classList.remove('tab-active');
        }
      });
    });
  });

  // 初期化カウント
  updateCharCount();
});
