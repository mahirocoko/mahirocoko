/**
 * Mahiro AI Dev Sharing — Slide Deck Engine
 * Zero dependencies, accessible, keyboard-first, responsive 16:9 stage
 */

(function () {
  'use strict';

  // Slide Metadata & Authoritative Speaker Notes
  const SLIDES_DATA = [
    {
      id: 1,
      title: 'ผมใช้ AI ทำงานยังไง',
      subtitle: 'จาก AI Chat สู่ Letta Code',
      category: 'JOURNEY',
      notes: 'Session นี้แชร์ setup และวิธีทำงานจริงของผม ไม่ใช่การจัดอันดับ model หรือบอกว่าทุกคนต้องเซ็ตเหมือนกัน'
    },
    {
      id: 2,
      title: 'เครื่องมือที่ผมใช้ตามลำดับ',
      subtitle: 'Evolution & Taxonomy',
      category: 'OVERVIEW',
      notes: 'ใช้สไลด์นี้เป็น roadmap ของ session และปูพื้นความต่างระหว่าง model, tool กับ agent สั้น ๆ เพราะคำพวกนี้จะถูกพูดถึงตลอด'
    },
    {
      id: 3,
      title: 'จากก๊อปคำตอบเอง สู่ให้ agent ลงมือใน repo',
      subtitle: 'Paradigm Shift',
      category: 'PARADIGM',
      notes: 'Claude Code เป็น coding agent ตัวแรกที่ผมใช้จริงจัง ความต่างที่ชัดมากคือไม่ต้องคอยก๊อป code ข้ามไปมาระหว่าง chat, editor และ terminal เองทุกขั้นตอน'
    },
    {
      id: 4,
      title: 'ก่อน Letta ผมลองสร้าง memory layer เอง',
      subtitle: 'The Memory Problem',
      category: 'ARCHITECTURE',
      notes: 'ช่วงนี้ผมพยายามสร้าง memory layer ครอบ Claude Code ผ่าน MCP (Model Context Protocol) เป้าหมายคือเปลี่ยน coding tool ได้โดย context เดิมไม่หายตามไปด้วย'
    },
    {
      id: 5,
      title: 'ทำไมผมย้ายไป OpenCode',
      subtitle: 'Harness Migration',
      category: 'MIGRATION',
      notes: 'OpenCode ทำหน้าที่เป็น runtime หลัก ส่วน Oh My OpenCode ช่วยจัด workflow และแบ่งบทบาท agent ช่วงนี้ทำให้ผมเริ่มเลือก model ตามงาน แทนการใช้ตัวเดียวทำทุกอย่าง'
    },
    {
      id: 6,
      title: 'Letta Code เป็นตัวหลัก แต่ workflow ไม่ได้ผูกกับตัวเดียว',
      subtitle: 'Dual-Core Architecture',
      category: 'ARCHITECTURE',
      notes: 'สิ่งที่ผมชอบใน Letta Code คือความต่อเนื่องของ main agent แต่ผมไม่ได้ย้ายทุก workflow เข้าไปผูกกับ Letta Code เพราะ skills เป็น procedure ที่ติดตั้งและใช้กับ agent อื่นได้ ส่วน mods ใช้ขยาย runtime ของ Letta Code โดยเฉพาะ'
    },
    {
      id: 7,
      title: 'ผมแบ่งงานให้ agent ยังไง',
      subtitle: 'Multi-Agent Division of Labor',
      category: 'ROSTER',
      notes: 'ผมเลือก model ตามบทบาทของงานมากกว่าหาตัวที่เก่งที่สุดทุกเรื่อง และเพราะ model เปลี่ยนรุ่นเร็วมาก จึงไม่ใส่ชื่อรุ่นเฉพาะเจาะจงไว้บนสไลด์'
    },
    {
      id: 8,
      title: 'หนึ่งงานจริง ผมเริ่มและจบยังไง',
      subtitle: 'Execution Lifecycle',
      category: 'WORKFLOW',
      notes: 'นี่คือ workflow ทั่วไปในการทำงานจริง ไม่ใช่ checklist แข็งตัว งานเล็ก main agent อาจทำจบเอง แต่งานใหญ่ค่อยกระจายให้ scout, writer หรือ reviewer ช่วยกัน โดยเราเป็นคนคุมและตัดสินใจขั้นสุดท้ายเสมอ'
    },
    {
      id: 9,
      title: 'เปิดหลาย agent พร้อมกัน ผมดูและคุมยังไง',
      subtitle: 'Multi-Agent Observability',
      category: 'CONTROL',
      notes: 'Herdr เป็นที่สั่งและคุมงานจริง ส่วน Agent Halo แสดงสถานะของทุก session บน Notch ทั้งคู่ช่วยให้ผมตามงานหลาย session ได้โดยไม่ต้องเฝ้า terminal ตลอดเวลา'
    },
    {
      id: 10,
      title: 'Ecosystem ที่ผมใช้จริง',
      subtitle: 'Complete Ecosystem',
      category: 'ECOSYSTEM',
      notes: 'เส้นแบ่งสำคัญคือ skills พก workflow ไปใช้ข้าม agent ได้ ส่วน mods เป็น Letta-specific runtime extension ไม่ได้พกไปใช้กับ Agy โดยตรง ณ วันที่ 17 สิงหาคม 2026 Agy ติดตั้ง Mahiro Skills แบบ managed อยู่ 24 skills'
    },
    {
      id: 11,
      title: 'Mahiro Skills ที่ผมพกไปใช้ข้าม agent',
      subtitle: 'Mahiro Core Skills',
      category: 'SKILLS',
      notes: 'Skill family ที่คุณหมายถึงคือ `mahiro-*` ไม่ใช่ prefix `/mh-*`: `mahiro-guidance-refine` ถูกใช้ 59 ครั้ง, `mahiro-style` 21 และ `mahiro-docs-rules-init` 10 ส่วน `/mh-*` เป็นเพียงชื่อ alias ที่ Agy สร้างตอนติดตั้ง ปัจจุบัน Agy มี Mahiro Skills แบบ managed 24 skills'
    },
    {
      id: 12,
      title: 'Q&A',
      subtitle: 'Open Discussion',
      category: 'DISCUSSION',
      notes: 'ชวนคุยแลกเปลี่ยน: ตอนนี้ในทีมใช้ AI Chat, coding agent หรือเครื่องมือตัวไหนกันอยู่บ้าง มี pain point หรือ workflow ตรงไหนที่อยากลองปรับ'
    }
  ];

  const TOTAL_SLIDES = SLIDES_DATA.length;
  let currentSlideIndex = 1;

  // DOM Elements
  const stageViewport = document.getElementById('stageViewport');
  const stageFrame = document.getElementById('stageFrame');
  const slidePanes = document.querySelectorAll('.slide-pane');
  const currentSlideNumEl = document.getElementById('currentSlideNum');
  const headerTopicEl = document.getElementById('headerTopic');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressTicksContainer = document.getElementById('progressTicks');
  const progressContainer = document.getElementById('progressContainer');

  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnNotes = document.getElementById('btnNotes');
  const btnOverview = document.getElementById('btnOverview');
  const btnFullscreen = document.getElementById('btnFullscreen');

  const notesDrawer = document.getElementById('notesDrawer');
  const notesSlideTitle = document.getElementById('notesSlideTitle');
  const notesContent = document.getElementById('notesContent');
  const btnCloseNotes = document.getElementById('btnCloseNotes');

  const overviewModal = document.getElementById('overviewModal');
  const overviewGrid = document.getElementById('overviewGrid');
  const btnCloseOverview = document.getElementById('btnCloseOverview');
  const modalBackdrop = document.getElementById('modalBackdrop');

  /**
   * Initialize Presentation Deck
   */
  function init() {
    buildProgressTicks();
    buildOverviewGrid();
    bindEvents();
    syncWithHash();
    updateStageScale();
    window.addEventListener('resize', debounce(updateStageScale, 50));
  }

  /**
   * Calculate and apply clean responsive 16:9 stage scaling
   */
  function updateStageScale() {
    if (!stageViewport || !stageFrame) return;

    const baseWidth = 1440;
    const baseHeight = 810; // 16:9 ratio

    const availWidth = stageViewport.clientWidth - 24; // padding allowance
    const availHeight = stageViewport.clientHeight - 16;

    if (availWidth <= 0 || availHeight <= 0) return;

    const scaleX = availWidth / baseWidth;
    const scaleY = availHeight / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    // Apply scale variable
    document.documentElement.style.setProperty('--stage-scale', scale.toFixed(4));
  }

  /**
   * Build Progress Ticks in Footer
   */
  function buildProgressTicks() {
    if (!progressTicksContainer) return;
    progressTicksContainer.innerHTML = '';

    SLIDES_DATA.forEach((slide) => {
      const tick = document.createElement('button');
      tick.type = 'button';
      tick.className = 'tick-btn';
      tick.title = `Slide ${slide.id}: ${slide.title}`;
      tick.setAttribute('aria-label', `Jump to slide ${slide.id}`);
      tick.addEventListener('click', () => goToSlide(slide.id));
      progressTicksContainer.appendChild(tick);
    });
  }

  /**
   * Build Slide Overview Grid Modal Cards
   */
  function buildOverviewGrid() {
    if (!overviewGrid) return;
    overviewGrid.innerHTML = '';

    SLIDES_DATA.forEach((slide) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'grid-card';
      card.dataset.slideIndex = slide.id;
      card.setAttribute('aria-label', `Slide ${slide.id}: ${slide.title}`);

      card.innerHTML = `
        <div class="gc-header">
          <span class="gc-num">${String(slide.id).padStart(2, '0')}</span>
          <span class="gc-tag">${slide.category}</span>
        </div>
        <div class="gc-title">${slide.title}</div>
        <div class="gc-subtitle">${slide.subtitle}</div>
      `;

      card.addEventListener('click', () => {
        goToSlide(slide.id);
        toggleOverview(false);
      });

      overviewGrid.appendChild(card);
    });
  }

  /**
   * Sync Slide Display
   */
  function goToSlide(targetIndex, updateHash = true) {
    const validIndex = Math.max(1, Math.min(TOTAL_SLIDES, Number(targetIndex) || 1));
    currentSlideIndex = validIndex;

    // Update active class on slides
    slidePanes.forEach((pane) => {
      const idx = Number(pane.dataset.slideIndex);
      if (idx === currentSlideIndex) {
        pane.classList.add('active');
        pane.removeAttribute('aria-hidden');
      } else {
        pane.classList.remove('active');
        pane.setAttribute('aria-hidden', 'true');
      }
    });

    // Update header & indicator
    const currentData = SLIDES_DATA[currentSlideIndex - 1];
    if (currentSlideNumEl) {
      currentSlideNumEl.textContent = String(currentSlideIndex).padStart(2, '0');
    }
    if (headerTopicEl && currentData) {
      headerTopicEl.textContent = currentData.title;
    }

    // Update progress bar
    if (progressBarFill) {
      const percent = (currentSlideIndex / TOTAL_SLIDES) * 100;
      progressBarFill.style.width = `${percent}%`;
    }
    if (progressContainer) {
      progressContainer.setAttribute('aria-valuenow', currentSlideIndex);
    }

    // Update ticks
    const ticks = progressTicksContainer ? progressTicksContainer.querySelectorAll('.tick-btn') : [];
    ticks.forEach((tick, i) => {
      if (i + 1 === currentSlideIndex) {
        tick.classList.add('active');
      } else {
        tick.classList.remove('active');
      }
    });

    // Update grid overview active state
    const gridCards = overviewGrid ? overviewGrid.querySelectorAll('.grid-card') : [];
    gridCards.forEach((card, i) => {
      if (i + 1 === currentSlideIndex) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Update speaker notes content
    updateSpeakerNotes();

    // Update Prev / Next button disabled state
    if (btnPrev) btnPrev.disabled = currentSlideIndex === 1;
    if (btnNext) btnNext.disabled = currentSlideIndex === TOTAL_SLIDES;

    // Update URL hash
    if (updateHash) {
      window.location.hash = `#${currentSlideIndex}`;
    }
  }

  function nextSlide() {
    if (currentSlideIndex < TOTAL_SLIDES) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 1) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  /**
   * Speaker Notes Drawer Controller
   */
  function updateSpeakerNotes() {
    const data = SLIDES_DATA[currentSlideIndex - 1];
    if (!data) return;

    if (notesSlideTitle) {
      notesSlideTitle.textContent = `Slide ${data.id} — ${data.title}`;
    }

    if (notesContent) {
      notesContent.innerHTML = `
        <div class="note-section">
          <div class="note-kicker">ON-SLIDE TOPIC</div>
          <div class="note-topic-text">${data.subtitle || data.title}</div>
        </div>
        <div class="note-section note-main-block">
          <div class="note-kicker">SPEAKER SCRIPT / CONTEXT NOTES</div>
          <p class="note-body-text">${escapeHtml(data.notes)}</p>
        </div>
      `;
    }
  }

  function toggleNotes(force) {
    const isOpen = notesDrawer.classList.contains('open');
    const targetState = typeof force === 'boolean' ? force : !isOpen;

    if (targetState) {
      notesDrawer.classList.add('open');
      notesDrawer.setAttribute('aria-hidden', 'false');
      btnNotes.setAttribute('aria-expanded', 'true');
      btnNotes.classList.add('active-tool');
    } else {
      notesDrawer.classList.remove('open');
      notesDrawer.setAttribute('aria-hidden', 'true');
      btnNotes.setAttribute('aria-expanded', 'false');
      btnNotes.classList.remove('active-tool');
    }
  }

  /**
   * Overview Grid Modal Controller
   */
  function toggleOverview(force) {
    const isOpen = overviewModal.classList.contains('open');
    const targetState = typeof force === 'boolean' ? force : !isOpen;

    if (targetState) {
      overviewModal.classList.add('open');
      overviewModal.setAttribute('aria-hidden', 'false');
      btnOverview.setAttribute('aria-expanded', 'true');
      btnOverview.classList.add('active-tool');
      // Focus on active card
      setTimeout(() => {
        const activeCard = overviewGrid.querySelector('.grid-card.active');
        if (activeCard) activeCard.focus();
      }, 50);
    } else {
      overviewModal.classList.remove('open');
      overviewModal.setAttribute('aria-hidden', 'true');
      btnOverview.setAttribute('aria-expanded', 'false');
      btnOverview.classList.remove('active-tool');
    }
  }

  /**
   * Fullscreen Controller
   */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }

  /**
   * URL Hash Synchronizer
   */
  function syncWithHash() {
    const hash = window.location.hash.replace('#', '');
    const slideNum = parseInt(hash, 10);
    if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= TOTAL_SLIDES) {
      goToSlide(slideNum, false);
    } else {
      goToSlide(1, true);
    }
  }

  /**
   * Event Listeners
   */
  function bindEvents() {
    // Hash change handler (browser back/forward)
    window.addEventListener('hashchange', () => {
      syncWithHash();
    });

    // Keyboard Navigation
    window.addEventListener('keydown', (e) => {
      // If typing inside an input or textarea, ignore
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case 'l':
        case 'j':
          e.preventDefault();
          nextSlide();
          break;

        case ' ': // Space key advances slide unless target is a button
          if (document.activeElement && document.activeElement.tagName === 'BUTTON') {
            return;
          }
          e.preventDefault();
          nextSlide();
          break;

        case 'ArrowLeft':
        case 'PageUp':
        case 'h':
        case 'k':
          e.preventDefault();
          prevSlide();
          break;

        case 'Home':
          e.preventDefault();
          goToSlide(1);
          break;

        case 'End':
          e.preventDefault();
          goToSlide(TOTAL_SLIDES);
          break;

        case 'n':
        case 'N':
          e.preventDefault();
          toggleNotes();
          break;

        case 'o':
        case 'O':
          e.preventDefault();
          toggleOverview();
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;

        case 'Escape':
          toggleNotes(false);
          toggleOverview(false);
          break;

        default:
          break;
      }
    });

    // Button Clicks
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);
    btnNotes.addEventListener('click', () => toggleNotes());
    btnCloseNotes.addEventListener('click', () => toggleNotes(false));
    btnOverview.addEventListener('click', () => toggleOverview());
    btnCloseOverview.addEventListener('click', () => toggleOverview(false));
    modalBackdrop.addEventListener('click', () => toggleOverview(false));
    btnFullscreen.addEventListener('click', toggleFullscreen);

    // Touch Swipe Navigation
    let touchStartX = 0;
    let touchStartY = 0;

    stageViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    stageViewport.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and exceeds threshold
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });
  }

  // Utilities
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
