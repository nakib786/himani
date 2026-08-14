import type { JournalBlock } from '@/lib/types';

/**
 * Renders a block array as editorial prose.
 *
 * Body text is capped at 65ch — beyond that the eye loses the line return.
 * Headings sit on a hairline, matching the section rules used everywhere else.
 */
export function Prose({ blocks }: { blocks: JournalBlock[] }) {
  return (
    <div className="measure">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={i}
                className="display-md mt-12 border-t border-rule pt-6 text-fg first:mt-0"
              >
                {block.text}
              </h2>
            );

          case 'p':
            return (
              <p key={i} className="body-lg mt-5">
                {block.text}
              </p>
            );

          case 'list':
            return (
              <ul key={i} className="mt-5 flex flex-col gap-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3.5">
                    <span
                      className="mt-3 h-px w-3.5 shrink-0 bg-rule-strong"
                      aria-hidden="true"
                    />
                    <span className="body-lg">{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'note':
            return (
              <p key={i} className="caption mt-8 border-l border-rule-strong pl-5">
                {block.text}
              </p>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
