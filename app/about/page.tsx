'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function DashboardPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    let animationId = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = Math.max(window.innerHeight, document.body.scrollHeight);
    }

    function initNodes() {
      const count = Math.max(18, Math.floor(w / 110));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * Math.min(h, window.innerHeight * 1.4),
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 1.2,
      }));
    }

    function step() {
      ctx!.clearRect(0, 0, w, h);
      const maxDist = 150;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > window.innerHeight * 1.4) n.vy *= -1;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx!.strokeStyle = `rgba(90,140,255,${(1 - dist / maxDist) * 0.16})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(120,170,255,0.55)';
        ctx!.shadowColor = 'rgba(51,224,255,0.8)';
        ctx!.shadowBlur = 6;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      if (!reduceMotion) {
        animationId = requestAnimationFrame(step);
      }
    }

    const handleResize = () => {
      resize();
      initNodes();
    };

    window.addEventListener('resize', handleResize);
    resize();
    initNodes();
    step();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <style>{`
        :root{
          --bg-deep:#080b16;
          --bg-deep-2:#0c1024;
          --bg-card:#12152a;
          --bg-card-2:#161a33;
          --border-soft:rgba(255,255,255,0.08);
          --border-soft-2:rgba(255,255,255,0.14);
          --text-primary:#f4f5fb;
          --text-muted:#9298b8;
          --text-dim:#666c8c;
          --accent-indigo:#6366f1;
          --accent-purple:#a855f7;
          --accent-cyan:#33e0ff;
          --accent-cyan-dim:#33e0ff55;
          --gradient-cta: linear-gradient(90deg, #5b6ef5 0%, #9d4bf0 100%);
        }

        .briefly-page{
          background: radial-gradient(120% 90% at 15% -10%, #171c3d 0%, var(--bg-deep) 45%), var(--bg-deep);
          color:var(--text-primary);
          font-family:'Inter',sans-serif;
          line-height:1.5;
          overflow-x:hidden;
          min-height:100vh;
        }

        @media (prefers-reduced-motion: reduce){
          .briefly-page *{animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important;}
        }

        .bg-grid{
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size:48px 48px;
          mask-image: radial-gradient(80% 60% at 50% 0%, black, transparent 90%);
        }

        #network-canvas{position:fixed; inset:0; z-index:0; pointer-events:none; opacity:0.55;}

        .wrap{position:relative; z-index:1;}
        .container{max-width:1180px; margin:0 auto; padding:0 32px;}

        nav{
          display:flex; align-items:center; justify-content:space-between;
          padding:26px 0; max-width:1180px; margin:0 auto; padding-left:32px; padding-right:32px;
        }
        .logo{display:flex; align-items:center; gap:10px; font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:17px;}
        .logo-mark{
          width:30px; height:30px; border-radius:8px;
          background:var(--gradient-cta);
          display:flex; align-items:center; justify-content:center;
          font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:14px;
          box-shadow:0 0 22px rgba(99,102,241,0.45);
        }
        .navlinks{display:flex; gap:36px; align-items:center;}
        .navlinks a{color:var(--text-muted); text-decoration:none; font-size:14.5px; font-weight:500; transition:color .2s;}
        .navlinks a:hover{color:var(--text-primary);}
        .nav-cta{
          background:var(--gradient-cta); color:white; text-decoration:none;
          padding:9px 18px; border-radius:9px; font-size:14px; font-weight:600;
          box-shadow:0 0 0 1px rgba(255,255,255,0.06) inset;
        }
        @media (max-width:760px){ .navlinks{display:none;} }

        .hero{
          padding:100px 0 70px;
          text-align:center;
          display:flex; flex-direction:column; align-items:center;
        }
        .eyebrow{
          display:inline-flex; align-items:center; gap:8px;
          font-size:12.5px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase;
          color:var(--accent-cyan);
          background:rgba(51,224,255,0.08);
          border:1px solid rgba(51,224,255,0.25);
          padding:6px 14px; border-radius:999px;
          margin-bottom:28px;
        }
        .eyebrow .dot{width:6px; height:6px; border-radius:50%; background:var(--accent-cyan); box-shadow:0 0 8px var(--accent-cyan);}

        h1.hero-title{
          font-family:'Space Grotesk',sans-serif;
          font-weight:700;
          font-size:clamp(34px, 5.2vw, 58px);
          line-height:1.12;
          max-width:820px;
          letter-spacing:-0.01em;
        }
        h1.hero-title .grad{
          background:linear-gradient(90deg, #8b93ff, #c98bff 55%, #33e0ff);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }

        .hero-sub{
          margin-top:22px;
          max-width:600px;
          color:var(--text-muted);
          font-size:17px;
          line-height:1.65;
        }

        .hero-actions{display:flex; gap:14px; margin-top:36px;}
        .btn-primary{
          background:var(--gradient-cta); color:white; text-decoration:none; font-weight:600; font-size:15px;
          padding:13px 26px; border-radius:10px; display:inline-flex; align-items:center; gap:8px;
          box-shadow:0 8px 30px -8px rgba(107,89,240,0.6);
          transition:transform .2s;
        }
        .btn-primary:hover{transform:translateY(-1px);}
        .btn-secondary{
          background:rgba(255,255,255,0.03); color:var(--text-primary); text-decoration:none; font-weight:600; font-size:15px;
          padding:13px 26px; border-radius:10px; border:1px solid var(--border-soft-2);
        }

        section{padding:88px 0;}
        .section-head{max-width:620px; margin-bottom:56px;}
        .section-eyebrow{
          font-size:12.5px; font-weight:700; letter-spacing:0.09em; text-transform:uppercase;
          color:var(--accent-purple); margin-bottom:14px; display:block;
        }
        .section-title{
          font-family:'Space Grotesk',sans-serif; font-weight:600;
          font-size:clamp(24px,3vw,34px); line-height:1.25; letter-spacing:-0.01em;
        }
        .section-desc{color:var(--text-muted); font-size:15.5px; margin-top:14px; line-height:1.7;}
        .center{text-align:center; margin-left:auto; margin-right:auto;}

        .mission-row{display:grid; grid-template-columns:1.1fr 0.9fr; gap:60px; align-items:center;}
        @media (max-width:860px){ .mission-row{grid-template-columns:1fr;} }
        .mission-copy p{color:var(--text-muted); font-size:16px; line-height:1.8; margin-bottom:16px;}
        .mission-copy strong{color:var(--text-primary); font-weight:600;}

        .stat-card{
          background:var(--bg-card);
          border:1px solid var(--border-soft);
          border-radius:16px;
          padding:26px 22px;
        }
        .stat-grid{display:grid; grid-template-columns:1fr 1fr; gap:14px;}
        .stat-num{
          font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:26px;
          background:linear-gradient(90deg,#8b93ff,#33e0ff);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .stat-label{font-size:13px; color:var(--text-muted); margin-top:6px;}

        .pipeline-shell{
          position:relative;
          border-radius:24px;
          border:1px solid var(--border-soft);
          background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
          padding:56px 40px;
          overflow:hidden;
        }
        .pipeline-track{
          display:flex; justify-content:space-between; align-items:flex-start;
          position:relative; gap:12px;
        }
        .pipeline-track::before{
          content:"";
          position:absolute; top:26px; left:6%; right:6%; height:1px;
          background:linear-gradient(90deg, transparent, var(--border-soft-2) 15%, var(--border-soft-2) 85%, transparent);
        }
        .pipe-node{flex:1; display:flex; flex-direction:column; align-items:center; text-align:center; position:relative;}
        .pipe-dot{
          width:52px; height:52px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          background:var(--bg-card-2);
          border:1.5px solid var(--border-soft-2);
          font-size:20px;
          position:relative; z-index:1;
          box-shadow:0 0 0 6px rgba(8,11,22,1);
        }
        .pipe-dot.lit{
          border-color:var(--accent-cyan);
          box-shadow:0 0 0 6px rgba(8,11,22,1), 0 0 24px rgba(51,224,255,0.45);
        }
        .pipe-title{margin-top:16px; font-weight:600; font-size:14.5px;}
        .pipe-desc{margin-top:6px; font-size:13px; color:var(--text-muted); max-width:150px; line-height:1.5;}
        @media (max-width:820px){
          .pipeline-track{flex-direction:column; gap:34px;}
          .pipeline-track::before{display:none;}
          .pipe-desc{max-width:280px;}
        }

        .feature-grid{
          display:grid; grid-template-columns:repeat(3,1fr); gap:20px;
        }
        @media (max-width:900px){ .feature-grid{grid-template-columns:1fr 1fr;} }
        @media (max-width:600px){ .feature-grid{grid-template-columns:1fr;} }
        .feature-card{
          background:var(--bg-card);
          border:1px solid var(--border-soft);
          border-radius:16px;
          padding:26px;
          transition:border-color .2s, transform .2s;
        }
        .feature-card:hover{border-color:var(--border-soft-2); transform:translateY(-2px);}
        .feature-icon{
          width:38px; height:38px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(99,102,241,0.12);
          border:1px solid rgba(99,102,241,0.25);
          font-size:17px; margin-bottom:16px;
        }
        .feature-card h3{font-size:16px; font-weight:600; margin-bottom:8px;}
        .feature-card p{font-size:14px; color:var(--text-muted); line-height:1.6;}

        .stack-strip{
          display:flex; flex-wrap:wrap; gap:12px; justify-content:center;
        }
        .stack-pill{
          display:flex; align-items:center; gap:9px;
          background:var(--bg-card); border:1px solid var(--border-soft);
          padding:11px 18px; border-radius:999px; font-size:13.5px; color:var(--text-muted); font-weight:500;
        }
        .stack-pill .sq{width:8px; height:8px; border-radius:2px; background:var(--accent-cyan);}

        .cta-panel{
          border-radius:24px;
          background:linear-gradient(135deg, rgba(99,102,241,0.14), rgba(168,85,247,0.10));
          border:1px solid rgba(168,85,247,0.25);
          padding:64px 40px;
          text-align:center;
        }
        .cta-panel h2{font-family:'Space Grotesk',sans-serif; font-size:clamp(24px,3.4vw,34px); font-weight:600;}
        .cta-panel p{color:var(--text-muted); margin-top:14px; font-size:15.5px;}
        .cta-panel .hero-actions{justify-content:center; margin-top:30px;}

        .extra-gap-top{margin-top:64px;}
        .extra-gap-top-lg{margin-top:80px;}

        footer{
          padding:40px 0 60px; text-align:center; color:var(--text-dim); font-size:13.5px;
          border-top:1px solid var(--border-soft); margin-top:20px;
        }
      `}</style>

      <div className="briefly-page">
        <canvas ref={canvasRef} id="network-canvas"></canvas>
        <div className="bg-grid"></div>

        <div className="wrap">
          <header className="hero container">
            <div className="eyebrow"><span className="dot"></span> About Briefly</div>
            <h1 className="hero-title">
              Every paper holds a hidden structure. <span className="grad">We map it.</span>
            </h1>
            <p className="hero-sub">
              Briefly is an intelligent document processing app — built on SOFC 2.0 Code Catalyst — that turns dense
              PDFs into structured, readable insight in seconds, powered by Google&apos;s Gemini AI.
            </p>
            <div className="hero-actions">
              <Link href={'/root'} className="btn-primary">See how it works →</Link>
              <a href={'/chat'} className="btn-secondary">Chat with AI</a>
            </div>
          </header>

          <section id="mission" className="container">
            <div className="mission-row">
              <div className="mission-copy">
                <span className="section-eyebrow">Our mission</span>
                <h2 className="section-title">
                  Reading shouldn&apos;t be the bottleneck between a document and a decision.
                </h2>
                <p>
                  Technical papers, reports, and long-form PDFs bury their most useful parts — the findings, the
                  caveats, the numbers that matter — inside pages of prose.{' '}
                  <strong>Briefly reads them so you don&apos;t have to start from page one.</strong>
                </p>
                <p>
                  Upload a document, and Gemini AI breaks it down into a summary, key findings, technical details,
                  and concrete recommendations — each with a confidence score, so you know how much to trust it.
                </p>
              </div>
              <div className="stat-card">
                <div className="stat-grid">
                  <div>
                    <div className="stat-num">PDF → JSON</div>
                    <div className="stat-label">Structured extraction, not just text dumps</div>
                  </div>
                  <div>
                    <div className="stat-num">Gemini AI</div>
                    <div className="stat-label">Analysis engine under the hood</div>
                  </div>
                  <div>
                    <div className="stat-num">BetterAuth</div>
                    <div className="stat-label">Secure sessions, every upload</div>
                  </div>
                  <div>
                    <div className="stat-num">PostgreSQL</div>
                    <div className="stat-label">Your documents, durably stored</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="pipeline" className="container extra-gap-top">
            <div className="section-head center">
              <span className="section-eyebrow">The pipeline</span>
              <h2 className="section-title">From PDF to insight, in four stages</h2>
              <p className="section-desc">
                The same network that lights up on your dashboard represents a real path — every document actually
                travels through these four stages.
              </p>
            </div>

            <div className="pipeline-shell">
              <div className="pipeline-track">
                <div className="pipe-node">
                  <div className="pipe-dot lit">📄</div>
                  <div className="pipe-title">Upload</div>
                  <div className="pipe-desc">Drop in a PDF — text is extracted and prepared for analysis.</div>
                </div>
                <div className="pipe-node">
                  <div className="pipe-dot lit">🔎</div>
                  <div className="pipe-title">Parse</div>
                  <div className="pipe-desc">Raw content is cleaned and structured into analyzable sections.</div>
                </div>
                <div className="pipe-node">
                  <div className="pipe-dot lit">✨</div>
                  <div className="pipe-title">Analyze</div>
                  <div className="pipe-desc">Gemini AI reads the document and reasons over its content.</div>
                </div>
                <div className="pipe-node">
                  <div className="pipe-dot lit">🧩</div>
                  <div className="pipe-title">Extract</div>
                  <div className="pipe-desc">Summaries, findings, and recommendations land in your dashboard.</div>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="container extra-gap-top">
            <div className="section-head center">
              <span className="section-eyebrow">What Briefly does</span>
              <h2 className="section-title">Built for the full document lifecycle</h2>
            </div>
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">📤</div>
                <h3>Upload &amp; parse PDFs</h3>
                <p>Seamlessly upload PDF documents and extract clean, structured text content ready for analysis.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h3>AI-powered analysis</h3>
                <p>Google&apos;s Gemini AI reads each document in full, understanding context rather than skimming keywords.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>Extract insights</h3>
                <p>Summaries, key findings, technical details, recommendations, and confidence scores — automatically.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h3>User authentication</h3>
                <p>Secure sign-in and session management powered by BetterAuth, keeping every account and upload protected.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🗄️</div>
                <h3>Database storage</h3>
                <p>User data and processed documents persist reliably in PostgreSQL, ready whenever you come back.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Built to scale</h3>
                <p>SOFC 2.0 Code Catalyst under the hood, designed to handle growing libraries of documents over time.</p>
              </div>
            </div>
          </section>

          <section id="stack" className="container extra-gap-top">
            <div className="section-head center">
              <span className="section-eyebrow">Under the hood</span>
              <h2 className="section-title">The stack powering Briefly</h2>
            </div>
            <div className="stack-strip">
              <div className="stack-pill"><span className="sq"></span> Gemini AI</div>
              <div className="stack-pill"><span className="sq"></span> BetterAuth</div>
              <div className="stack-pill"><span className="sq"></span> PostgreSQL</div>
              <div className="stack-pill"><span className="sq"></span> PDF Parsing Engine</div>
              <div className="stack-pill"><span className="sq"></span> SOFC 2.0 Code Catalyst</div>
            </div>
          </section>

          <section className="container extra-gap-top-lg">
            <div className="cta-panel">
              <h2>Stop reading page one. Start with what matters.</h2>
              <p>Upload your first document and see the pipeline turn a PDF into structured insight.</p>
              <div className="hero-actions">
                <Link href={'/landingPage'} className="btn-primary">Get started →</Link>
                <Link href={'/root'} className="btn-secondary">Upload PDF</Link>
              </div>
            </div>
          </section>

          <footer>
            © 2026 Briefly — SOFC 2.0 Code Catalyst. All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
}