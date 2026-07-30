'use client';

import { useEffect, useRef } from 'react';

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const dropZone = root.querySelector<HTMLDivElement>('#dropZone')!;
    const fileInput = root.querySelector<HTMLInputElement>('#fileInput')!;
    const demoBtn = root.querySelector<HTMLButtonElement>('#demoBtn')!;
    const linkInput = root.querySelector<HTMLInputElement>('#linkInput')!;
    const fetchBtn = root.querySelector<HTMLButtonElement>('#fetchBtn')!;
    const stepsEl = root.querySelector<HTMLDivElement>('#steps')!;
    const statusLine = root.querySelector<HTMLDivElement>('#statusLine')!;
    const statusText = root.querySelector<HTMLSpanElement>('#statusText')!;
    const cancelBtn = root.querySelector<HTMLButtonElement>('#cancelBtn')!;
    const viewBtn = root.querySelector<HTMLButtonElement>('#viewBtn')!;
    const toast = root.querySelector<HTMLDivElement>('#toast')!;
    const errorText = root.querySelector<HTMLDivElement>('#errorText')!;
    const errorMsg = root.querySelector<HTMLSpanElement>('#errorMsg')!;
    const stagedFile = root.querySelector<HTMLDivElement>('#stagedFile')!;
    const stagedName = root.querySelector<HTMLDivElement>('#stagedName')!;
    const stagedMeta = root.querySelector<HTMLDivElement>('#stagedMeta')!;
    const removeStaged = root.querySelector<HTMLButtonElement>('#removeStaged')!;
    const analyzeStaged = root.querySelector<HTMLButtonElement>('#analyzeStaged')!;

    const MAX_MB = 20;
    let running = false;
    let cancelled = false;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let pendingSource: { name: string; meta: string; isLink: boolean } | null = null;

    const stageMessagesFile = [
      'Reading file and extracting raw text…',
      'Splitting the paper into chunks…',
      'Generating embeddings for each chunk…',
      'Analyzing structure, figures and references…',
      'Generating summary and workspace…',
    ];
    const stageMessagesLink = [
      'Fetching the paper from the link…',
      'Splitting the paper into chunks…',
      'Generating embeddings for each chunk…',
      'Analyzing structure, figures and references…',
      'Generating summary and workspace…',
    ];

    let toastTimer: ReturnType<typeof setTimeout>;
    function showToast(msg: string, isError?: boolean) {
      toast.textContent = msg;
      toast.classList.toggle('error', !!isError);
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    let errorTimer: ReturnType<typeof setTimeout>;
    function showError(msg: string) {
      errorMsg.textContent = msg;
      errorText.classList.add('show');
      dropZone.classList.remove('shake');
      void dropZone.offsetWidth;
      dropZone.classList.add('shake');
      clearTimeout(errorTimer);
      errorTimer = setTimeout(() => errorText.classList.remove('show'), 3600);
    }

    function formatSize(bytes: number) {
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function stageFile(name: string, meta: string, isLink: boolean) {
      pendingSource = { name, meta, isLink };
      stagedName.textContent = name;
      stagedMeta.textContent = meta;
      stagedFile.classList.add('show');
    }

    function clearStaged() {
      pendingSource = null;
      stagedFile.classList.remove('show');
    }

    function resetPipeline() {
      stepsEl.className = 'steps progress-0';
      root.querySelectorAll('.step').forEach((s) => s.classList.remove('active', 'done'));
      statusLine.classList.remove('done');
      statusText.textContent = 'Waiting for a paper — choose a file above.';
      cancelBtn.style.display = 'none';
      viewBtn.classList.remove('show');
    }

    function stopPipeline() {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
      running = false;
    }

    function runPipeline(name: string, isLink: boolean) {
      if (running) return;
      running = true;
      cancelled = false;
      clearStaged();
      resetPipeline();
      cancelBtn.style.display = 'inline-block';
      statusText.textContent = `Preparing "${name}"…`;

      const messages = isLink ? stageMessagesLink : stageMessagesFile;
      const steps = root.querySelectorAll('.step');
      let i = 0;

      function nextStep() {
        if (cancelled) return;
        if (i > 0) {
          steps[i - 1].classList.remove('active');
          steps[i - 1].classList.add('done');
        }
        if (i < steps.length) {
          steps[i].classList.add('active');
          stepsEl.className = 'steps progress-' + (i + 1);
          statusText.textContent = messages[i];
          i++;
          timers.push(setTimeout(nextStep, 750));
        } else {
          stepsEl.className = 'steps progress-5';
          statusLine.classList.add('done');
          statusText.textContent = `Paper ready — opening workspace…`;
          cancelBtn.style.display = 'none';
          viewBtn.classList.add('show');
          running = false;
        }
      }
      timers.push(setTimeout(nextStep, 300));
    }

    function handleIncomingFile(file: File) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        showError(`Hmm, "${file.name}" isn't a PDF yet — try one of those, or paste a link instead.`);
        return;
      }
      const mb = file.size / (1024 * 1024);
      if (mb > MAX_MB) {
        showError(`That one's ${mb.toFixed(1)}MB — a bit big for the demo (${MAX_MB}MB max). Try a smaller file.`);
        return;
      }
      stageFile(file.name, formatSize(file.size) + ' · PDF', false);
    }

    function submitLink() {
      const val = linkInput.value.trim();
      if (!val) {
        showError('Paste a link, arXiv ID, or DOI first.');
        return;
      }
      stageFile(val, 'fetching from link · will confirm format after fetch', true);
      linkInput.value = '';
    }

    const onCancelClick = () => {
      cancelled = true;
      stopPipeline();
      resetPipeline();
      statusText.textContent = 'Cancelled — waiting for a paper.';
      showToast('Analysis cancelled.');
    };
    const onViewClick = () => showToast('Opening your brief… (demo only)');
    const onDemoClick = () => fileInput.click();
    const onFileChange = () => {
      const file = fileInput.files && fileInput.files[0];
      if (file) handleIncomingFile(file);
    };
    const onRemoveStaged = () => clearStaged();
    const onAnalyzeStaged = () => {
      if (!pendingSource) return;
      runPipeline(pendingSource.name, pendingSource.isLink);
    };
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        handleIncomingFile(file);
      } else {
        showError('Drop an actual PDF file to upload.');
      }
    };
    const onFetchClick = () => submitLink();
    const onLinkKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') submitLink();
    };
    const onDocKeydown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== linkInput) {
        e.preventDefault();
        linkInput.focus();
      }
    };

    cancelBtn.addEventListener('click', onCancelClick);
    viewBtn.addEventListener('click', onViewClick);
    demoBtn.addEventListener('click', onDemoClick);
    fileInput.addEventListener('change', onFileChange);
    removeStaged.addEventListener('click', onRemoveStaged);
    analyzeStaged.addEventListener('click', onAnalyzeStaged);
    dropZone.addEventListener('dragenter', onDragEnter);
    dropZone.addEventListener('dragover', onDragEnter);
    dropZone.addEventListener('dragleave', onDragLeave);
    dropZone.addEventListener('drop', onDrop);
    fetchBtn.addEventListener('click', onFetchClick);
    linkInput.addEventListener('keydown', onLinkKeydown);
    document.addEventListener('keydown', onDocKeydown);

    return () => {
      stopPipeline();
      clearTimeout(toastTimer);
      clearTimeout(errorTimer);
      cancelBtn.removeEventListener('click', onCancelClick);
      viewBtn.removeEventListener('click', onViewClick);
      demoBtn.removeEventListener('click', onDemoClick);
      fileInput.removeEventListener('change', onFileChange);
      removeStaged.removeEventListener('click', onRemoveStaged);
      analyzeStaged.removeEventListener('click', onAnalyzeStaged);
      dropZone.removeEventListener('dragenter', onDragEnter);
      dropZone.removeEventListener('dragover', onDragEnter);
      dropZone.removeEventListener('dragleave', onDragLeave);
      dropZone.removeEventListener('drop', onDrop);
      fetchBtn.removeEventListener('click', onFetchClick);
      linkInput.removeEventListener('keydown', onLinkKeydown);
      document.removeEventListener('keydown', onDocKeydown);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <style>{`
        html, body{ margin:0; padding:0; }
        :root{
          --bg-deep: #05070d;
          --card-bg: rgba(18, 22, 34, 0.55);
          --card-border: rgba(255,255,255,0.08);
          --text-hi: #F2F4F8;
          --text-mid: #A8AEBB;
          --text-low: #6B7180;
          --node-cyan: #38E1F2;
          --grad-a: #4F7DF3;
          --grad-b: #9B5DE5;
          --green: #34D399;
          --red: #F87171;
        }
        .dash-page{ font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background: var(--bg-deep); color: var(--text-hi); min-height:100vh; position:relative; }
        .dash-page::before{
          content:"";
          position:fixed; inset:0;
          background:
            radial-gradient(ellipse 800px 600px at 15% -5%, rgba(79,125,243,0.14), transparent 60%),
            radial-gradient(ellipse 700px 600px at 90% 10%, rgba(155,93,229,0.10), transparent 60%);
          pointer-events:none; z-index:0;
        }
        .dash-page::after{
          content:"";
          position:fixed; inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 42px 42px;
          mask-image: radial-gradient(ellipse 60% 50% at 50% 20%, black 20%, transparent 80%);
          pointer-events:none; z-index:0;
        }
        .mono{ font-family:'IBM Plex Mono', monospace; }
        main{ position:relative; z-index:2; max-width: 900px; margin: 0 auto; padding: 24px 20px 60px; }
        .eyebrow{ display:flex; align-items:center; gap:8px; justify-content:center; font-family:'IBM Plex Mono', monospace; font-size:11.5px; color: var(--text-low); margin-bottom: 14px; text-transform:uppercase; letter-spacing:.04em; }
        .status-dot{ width:6px; height:6px; border-radius:50%; background: var(--green); box-shadow: 0 0 0 0 rgba(52,211,153,0.6); animation: dotPulse 2s infinite; }
        @keyframes dotPulse{ 0%{ box-shadow: 0 0 0 0 rgba(52,211,153,0.5); } 70%{ box-shadow: 0 0 0 5px rgba(52,211,153,0); } 100%{ box-shadow: 0 0 0 0 rgba(52,211,153,0); } }
        .btn-primary{ background: linear-gradient(90deg, var(--grad-a), var(--grad-b)); color:white; border:none; border-radius:8px; padding:9px 18px; font-size:14px; font-weight:600; cursor:pointer; transition: filter .15s ease, transform .1s ease; box-shadow: 0 6px 20px -6px rgba(93,138,245,0.6); }
        .btn-primary:hover{ filter: brightness(1.1); }
        .btn-primary:active{ transform: scale(0.97); }
        .upload-card{ background: var(--card-bg); border: 1px dashed rgba(255,255,255,0.16); border-radius: 16px; padding: 48px 40px 36px; text-align:center; backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); transition: border-color .15s ease, background .15s ease, transform .15s ease; }
        .upload-card.dragover{ border-color: var(--node-cyan); background: rgba(56, 225, 242, 0.06); }
        .upload-card.shake{ animation: shake .4s ease; }
        @keyframes shake{ 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        .upload-icon{ width:52px; height:52px; margin:0 auto 18px; border-radius:14px; background: linear-gradient(135deg, var(--grad-a), var(--grad-b)); display:flex; align-items:center; justify-content:center; color:white; font-size: 20px; box-shadow: 0 0 24px rgba(93,138,245,0.45); transition: transform .2s ease; }
        .upload-card:hover .upload-icon{ transform: translateY(-2px) rotate(-4deg); }
        .upload-card h2{ margin:0 0 6px; font-size:19px; font-weight:600; font-family:'Space Grotesk', sans-serif; }
        .upload-card p.sub{ margin:0 0 22px; font-size:13.5px; color: var(--text-mid); }
        .upload-card p.sub .hl{ color: var(--node-cyan); }
        .upload-actions{ display:flex; gap:10px; justify-content:center; margin-bottom: 22px; flex-wrap:wrap; }
        .paste-row{ display:flex; gap:8px; max-width:480px; margin: 0 auto 14px; }
        .paste-input-wrap{ flex:1; display:flex; align-items:center; gap:8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 0 12px; transition: border-color .15s ease, box-shadow .15s ease; }
        .paste-input-wrap:focus-within{ border-color: rgba(93,138,245,0.55); box-shadow: 0 0 0 3px rgba(93,138,245,0.14); }
        .paste-input-wrap input{ flex:1; background:transparent; border:none; outline:none; color: var(--text-hi); font-size: 13px; padding: 9px 0; font-family:'Inter', sans-serif; }
        .paste-input-wrap input::placeholder{ color: var(--text-low); }
        .paste-hint{ font-family:'IBM Plex Mono', monospace; font-size:10px; color: var(--text-low); border:1px solid rgba(255,255,255,0.12); border-radius:4px; padding:1px 5px; flex-shrink:0; }
        .btn-fetch{ background: rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); color: var(--text-hi); border-radius:9px; padding:0 16px; font-size:13.5px; font-weight:600; cursor:pointer; transition: background .15s ease; }
        .btn-fetch:hover{ background: rgba(255,255,255,0.11); }
        .error-text{ margin: 10px auto 0; max-width: 480px; font-size: 12.5px; color: var(--red); display:none; align-items:center; justify-content:center; gap:6px; }
        .error-text.show{ display:flex; }
        .staged-file{ max-width: 480px; margin: 18px auto 0; display:none; align-items:center; gap:12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 14px; text-align:left; animation: slideDown .25s ease; }
        .staged-file.show{ display:flex; }
        @keyframes slideDown{ from{ opacity:0; transform: translateY(-6px); } to{ opacity:1; transform: translateY(0); } }
        .staged-icon{ width:32px; height:32px; border-radius:8px; flex-shrink:0; background: rgba(93,138,245,0.15); color: var(--node-cyan); display:flex; align-items:center; justify-content:center; font-size:14px; }
        .staged-info{ flex:1; min-width:0; }
        .staged-name{ font-size:13px; font-weight:600; color: var(--text-hi); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .staged-meta{ font-size:11.5px; color: var(--text-low); font-family:'IBM Plex Mono', monospace; }
        .staged-actions{ display:flex; gap:6px; flex-shrink:0; }
        .btn-mini{ border:none; border-radius:7px; padding:7px 12px; font-size:12.5px; font-weight:600; cursor:pointer; }
        .btn-mini.analyze{ background: linear-gradient(90deg, var(--grad-a), var(--grad-b)); color:white; }
        .btn-mini.remove{ background: rgba(255,255,255,0.06); color: var(--text-mid); border:1px solid rgba(255,255,255,0.1); }
        .btn-mini.remove:hover{ background: rgba(248,113,113,0.12); color: var(--red); border-color: rgba(248,113,113,0.3); }
        .pipeline-card{ margin-top: 22px; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 14px; padding: 26px 30px 22px; backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
        .steps{ display:flex; align-items:center; justify-content:space-between; position:relative; }
        .steps::before{ content:""; position:absolute; top:15px; left:8%; right:8%; height:2px; background: rgba(255,255,255,0.1); z-index:0; }
        .steps::after{ content:""; position:absolute; top:15px; left:8%; height:2px; background: linear-gradient(90deg, var(--grad-a), var(--green)); z-index:0; width: 0%; transition: width .5s ease; }
        .steps.progress-0::after{ width:0%; }
        .steps.progress-1::after{ width:0%; }
        .steps.progress-2::after{ width:21%; }
        .steps.progress-3::after{ width:42%; }
        .steps.progress-4::after{ width:63%; }
        .steps.progress-5::after{ width:84%; }
        .step{ display:flex; flex-direction:column; align-items:center; gap:8px; z-index:1; flex:1; }
        .step-circle{ width:30px; height:30px; border-radius:50%; background: rgba(255,255,255,0.08); color: var(--text-low); border: 1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; transition: background .3s ease, color .3s ease, border-color .3s ease; }
        .step.active .step-circle{ background: var(--green); color:#04140d; border-color: transparent; animation: pulse 1s infinite; }
        .step.done .step-circle{ background: var(--green); color:#04140d; border-color: transparent; }
        .step-label{ font-family:'IBM Plex Mono', monospace; font-size:10.5px; letter-spacing:.05em; text-transform:uppercase; color: var(--text-low); font-weight:500; }
        .step.active .step-label, .step.done .step-label{ color: var(--text-hi); }
        @keyframes pulse{ 0%{ box-shadow: 0 0 0 0 rgba(52,211,153,0.5); } 70%{ box-shadow: 0 0 0 8px rgba(52,211,153,0); } 100%{ box-shadow: 0 0 0 0 rgba(52,211,153,0); } }
        .status-row{ margin-top: 20px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
        .status-line{ font-size: 13.5px; color: var(--text-mid); display:flex; align-items:center; gap:8px; min-height: 20px; }
        .status-line.done{ color: var(--green); font-weight:600; }
        .status-check{ display:none; }
        .status-line.done .status-check{ display:inline; }
        .status-actions{ display:flex; gap:10px; align-items:center; }
        .link-btn{ background:none; border:none; color: var(--text-low); font-size:12.5px; cursor:pointer; text-decoration:underline; padding:0; }
        .link-btn:hover{ color: var(--text-mid); }
        .btn-view{ display:none; background: linear-gradient(90deg, var(--grad-a), var(--grad-b)); color:white; border:none; border-radius:8px; padding:8px 14px; font-size:13px; font-weight:600; cursor:pointer; }
        .btn-view.show{ display:inline-flex; align-items:center; gap:6px; }
        input[type=file]{ display:none; }
        .toast{ position: fixed; bottom: 24px; left:50%; transform: translateX(-50%) translateY(20px); background: #151a26; border: 1px solid rgba(255,255,255,0.1); color:white; padding:10px 18px; border-radius:9px; font-size:13px; opacity:0; transition: opacity .25s ease, transform .25s ease; pointer-events:none; z-index:10; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .toast.show{ opacity:1; transform: translateX(-50%) translateY(0); }
        .toast.error{ border-color: rgba(248,113,113,0.4); }
        @media (max-width: 640px){
          .upload-card{ padding: 32px 18px; }
          .paste-row{ flex-direction:column; }
          .steps{ flex-wrap:wrap; row-gap: 16px; }
          .steps::before, .steps::after{ display:none; }
        }
      `}</style>

      <div className="dash-page">
        <main>
          <div className="eyebrow"><span className="status-dot"></span> parsing engine warmed up · avg. 11s per paper</div>

          <div className="upload-card" id="dropZone">
            <div className="upload-icon">⬆</div>
            <h2>Drag a paper here, or choose a file</h2>
            <p className="sub">PDF, arXiv, or a straight-up DOI — <span className="hl">first one's free</span>, no sign-up.</p>

            <div className="paste-row">
              <div className="paste-input-wrap">
                <input type="text" id="linkInput" placeholder="Drop your pdf here" autoComplete="off" />
                <span className="paste-hint">/</span>
              </div>
              <button className="btn-fetch" id="fetchBtn">Fetch</button>
            </div>

            <div className="upload-actions">
              <button className="btn-primary" id="demoBtn">Choose File</button>
              <input type="file" id="fileInput" accept=".pdf" />
            </div>

            <div className="error-text" id="errorText">⚠ <span id="errorMsg"></span></div>

            <div className="staged-file" id="stagedFile">
              <div className="staged-icon">📄</div>
              <div className="staged-info">
                <div className="staged-name" id="stagedName">—</div>
                <div className="staged-meta" id="stagedMeta">—</div>
              </div>
              <div className="staged-actions">
                <button className="btn-mini remove" id="removeStaged">Remove</button>
                <button className="btn-mini analyze" id="analyzeStaged">Analyze →</button>
              </div>
            </div>
          </div>

          <div className="pipeline-card">
            <div className="steps progress-0" id="steps">
              <div className="step" data-step="1"><div className="step-circle">1</div><div className="step-label">Extract</div></div>
              <div className="step" data-step="2"><div className="step-circle">2</div><div className="step-label">Chunk</div></div>
              <div className="step" data-step="3"><div className="step-circle">3</div><div className="step-label">Embed</div></div>
              <div className="step" data-step="4"><div className="step-circle">4</div><div className="step-label">Analyze</div></div>
              <div className="step" data-step="5"><div className="step-circle">5</div><div className="step-label">Generate</div></div>
            </div>
            <div className="status-row">
              <div className="status-line" id="statusLine">
                <span id="statusText">Waiting for a paper — choose a file above.</span>
                <span className="status-check">✓</span>
              </div>
              <div className="status-actions">
                <button className="link-btn" id="cancelBtn" style={{ display: 'none' }}>Cancel</button>
                <button className="btn-view" id="viewBtn">Open brief →</button>
              </div>
            </div>
          </div>
        </main>

        <div className="toast" id="toast"></div>
      </div>
    </div>
  );
}
   