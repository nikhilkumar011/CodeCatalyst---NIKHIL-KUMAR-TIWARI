import { prisma } from '@/lib/db';
import React from 'react'

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const data = await prisma.output.findUnique({
    where: { uploadedFileId: id },
    select: {
      summary: true,
      contributions: true,
      limitations: true,
      flashcards: true,
    },
  });

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070d] text-[#F2F4F8]">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/5 text-lg text-[#6B7180]">
            📄
          </div>
          <p className="text-[14.5px] font-medium text-[#D7DAE2]">No results found</p>
          <p className="mt-1 text-[13px] text-[#6B7180]">
            This paper hasn&apos;t finished processing yet, or the id is invalid.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#05070d] text-[#F2F4F8]">
      {/* Background glows */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 15% -5%, rgba(79,125,243,0.14), transparent 60%), radial-gradient(ellipse 700px 600px at 90% 10%, rgba(155,93,229,0.10), transparent 60%)',
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 20%, black 20%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 20%, black 20%, transparent 80%)',
        }}
      />

      <main className="relative z-10 mx-auto max-w-[840px] px-5 pb-20 pt-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#4F7DF3] to-[#9B5DE5] text-lg shadow-[0_0_20px_rgba(93,138,245,0.4)]">
            📄
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Paper Dashboard</h1>
            <p className="font-mono text-[11.5px] uppercase tracking-wider text-[#6B7180]">
              generated brief · id {id}
            </p>
          </div>
        </div>

        {/* Summary */}
        <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.55)] p-6 backdrop-blur-[18px] sm:p-5">
          <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-[#38E1F2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#38E1F2]" />
            Summary
          </h2>
          <p className="text-[15px] leading-relaxed text-[#D7DAE2]">
            {data?.summary || (
              <span className="text-[#6B7180]">No summary available.</span>
            )}
          </p>
        </section>

        {/* Contributions & Limitations */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <section className="rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.55)] p-6 backdrop-blur-[18px] sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-[#34D399]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              Contributions
            </h2>
            {data?.contributions?.length ? (
              <ul className="space-y-2">
                {data.contributions.map((item, i) => (
                  <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-[#D7DAE2]">
                    <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[#34D399]" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-[#6B7180]">None listed.</p>
            )}
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.55)] p-6 backdrop-blur-[18px] sm:p-5">
            <h2 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-[#F87171]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F87171]" />
              Limitations
            </h2>
            {data?.limitations?.length ? (
              <ul className="space-y-2">
                {data.limitations.map((item, i) => (
                  <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-[#D7DAE2]">
                    <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-[#F87171]" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-[#6B7180]">None listed.</p>
            )}
          </section>
        </div>

        {/* Flashcards */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-[#A78BFA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A78BFA]" />
            Flashcards
            {!!data?.flashcards?.length && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10.5px] normal-case tracking-normal text-[#6B7180]">
                {data.flashcards.length}
              </span>
            )}
          </h2>

          {data?.flashcards?.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.flashcards.map((card, index) => (
                <details
                  key={index}
                  className="group rounded-2xl border border-white/[0.08] bg-[rgba(18,22,34,0.55)] p-5 backdrop-blur-[18px] transition-colors open:border-[rgba(155,93,229,0.35)]"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[14.5px] font-medium text-[#F2F4F8] marker:content-none">
                    <span className="flex gap-2">
                      <span className="font-mono text-[12px] text-[#6B7180]">
                        Q{index + 1}
                      </span>
                      {card.question}
                    </span>
                    <span className="mt-0.5 flex-shrink-0 text-[#6B7180] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-3 border-t border-white/[0.08] pt-3 text-[14px] leading-relaxed text-[#A8AEBB]">
                    {card.answer}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] p-8 text-center text-[14px] text-[#6B7180]">
              No flashcards generated yet.
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default page