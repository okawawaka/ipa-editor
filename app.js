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

  // 言語ボタン
  const langJaBtn = document.getElementById('lang-ja');
  const langEnBtn = document.getElementById('lang-en');

  // ==========================================================
  // 言語管理 (i18n) & 自動判定ロジック
  // ==========================================================
  let currentLang = 'ja';

  function getInitialLanguage() {
    // 1. ユーザーの手動選択が保存されていればそれを優先
    const saved = localStorage.getItem('ipa_editor_lang');
    if (saved === 'ja' || saved === 'en') {
      return saved;
    }
    // 2. なければブラウザ言語を判定 (日本語以外なら自動的に英語 'en')
    const navLang = (navigator.language || (navigator.languages && navigator.languages[0]) || '').toLowerCase();
    if (navLang.startsWith('ja')) {
      return 'ja';
    }
    return 'en';
  }

  function setLanguage(lang) {
    if (!window.IPA_I18N || !window.IPA_I18N[lang]) return;
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('ipa_editor_lang', lang);

    const dict = window.IPA_I18N[lang];

    // ページタイトル更新
    if (dict.pageTitle) {
      document.title = dict.pageTitle;
    }

    // data-i18n のテキスト更新
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        if (dict[key].includes('<') && dict[key].includes('>')) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
    });

    // data-i18n-title 属性の更新
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) {
        el.setAttribute('title', dict[key]);
      }
    });

    // data-i18n-placeholder 属性の更新
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // JA | EN トグルボタンのアクティブ表示
    if (langJaBtn && langEnBtn) {
      if (lang === 'ja') {
        langJaBtn.classList.add('active');
        langEnBtn.classList.remove('active');
      } else {
        langEnBtn.classList.add('active');
        langJaBtn.classList.remove('active');
      }
    }

    // ステータスバーの初期状態更新
    if (statusName && (!statusSymbol || statusSymbol.textContent === '[ - ]')) {
      statusName.textContent = dict.statusDefault || '';
      if (statusDesc) statusDesc.textContent = '';
    }

    updateCharCount();
  }

  if (langJaBtn) {
    langJaBtn.addEventListener('click', () => setLanguage('ja'));
  }
  if (langEnBtn) {
    langEnBtn.addEventListener('click', () => setLanguage('en'));
  }

  // ==========================================================
  // UNDO履歴管理
  // ==========================================================
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
    const dict = (window.IPA_I18N && window.IPA_I18N[currentLang]) || {};
    if (historyStack.length === 0) {
      showToast(dict.toastNothingToUndo || 'NOTHING TO UNDO');
      return;
    }
    const prevState = historyStack.pop();
    textarea.value = prevState.val;
    textarea.setSelectionRange(prevState.start, prevState.end);
    textarea.focus();
    updateCharCount();
    showToast(dict.toastUndo || 'UNDO');
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
    const dict = (window.IPA_I18N && window.IPA_I18N[currentLang]) || {};
    const val = textarea.value;
    if (!val) {
      showToast(dict.toastNoContent || 'NO CONTENT TO COPY');
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(val);
      } else {
        textarea.select();
        document.execCommand('copy');
      }
      showToast(dict.toastCopied || 'COPIED TO CLIPBOARD');
    } catch (e) {
      showToast(dict.toastCopyFailed || 'COPY FAILED');
    }
  }

  // 文字数カウント更新
  function updateCharCount() {
    const countBadge = document.getElementById('char-count');
    if (countBadge) {
      const len = [...textarea.value].length;
      const dict = (window.IPA_I18N && window.IPA_I18N[currentLang]) || {};
      const unit = dict.charCount || 'CHARS';
      countBadge.textContent = `${len} ${unit}`;
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
      const dict = (window.IPA_I18N && window.IPA_I18N[currentLang]) || {};
      showToast(dict.toastCleared || 'CLEARED');
    },
    'btn-copy': () => copyToClipboard(),
    'btn-undo': () => undo(),
    'btn-sample': () => {
      pushHistory();
      textarea.value = '/ɪntəˈnæʃənəl fəˈnɛtɪk ˈælfəbɛt/';
      updateCharCount();
      const dict = (window.IPA_I18N && window.IPA_I18N[currentLang]) || {};
      showToast(dict.toastSampleInserted || 'SAMPLE INSERTED');
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
      const isEn = currentLang === 'en';

      let primaryName = '';
      let secondaryName = '';
      let category = '';

      if (info) {
        if (isEn) {
          primaryName = info.en || ipa;
          secondaryName = ''; // 英語モード時は日本語を混在させず100%英語のみ
          category = (window.IPA_CAT_EN && window.IPA_CAT_EN[info.cat]) || '';
        } else {
          primaryName = info.name || ipa;
          secondaryName = info.en || '';
          category = info.cat || '';
        }
      } else {
        primaryName = ipa;
      }

      tooltip.innerHTML = `
        <div class="tt-symbol">${escapeHtml(ipa)}</div>
        <div class="tt-body">
          <div class="tt-name">${escapeHtml(primaryName)}</div>
          ${secondaryName ? `<div class="tt-en">${escapeHtml(secondaryName)}</div>` : ''}
          ${category ? `<div class="tt-cat">${escapeHtml(category)}</div>` : ''}
        </div>
      `;
      tooltip.style.display = 'flex';

      const ttWidth = 270;
      const ttHeight = 72;
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
      if (statusName) statusName.textContent = primaryName;
      if (statusDesc) {
        if (isEn) {
          statusDesc.textContent = category;
        } else {
          statusDesc.textContent = secondaryName ? `(${secondaryName}) · ${category}` : category;
        }
      }
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
    if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'z') && !e.shiftKey) {
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

  // 初期言語の適用
  const initialLang = getInitialLanguage();
  setLanguage(initialLang);

  // 初期化カウント
  updateCharCount();
});
