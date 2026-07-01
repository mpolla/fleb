// Vanilla reimplementation of the textarea overlay highlighter, replacing the
// jQuery plugin `highlight-within-textarea`. The technique is unchanged: a
// backdrop <div> sits behind a transparent-background <textarea> and re-renders
// the same text with <mark class="..."> wrappers around regex matches; the
// existing .hwt-*/.fleb-* CSS classes paint the colors. The range/boundary/
// token algorithm below is ported 1:1 from the original plugin so the rendered
// markup (including cleanly-nested marks) stays identical.

export interface HighlightRule {
    highlight: RegExp;
    className?: string;
}

export interface HighlightConfig {
    highlight: HighlightRule[];
}

interface Range {
    start: number;
    stop: number;
    className?: string;
}

interface Boundary {
    type: 'start' | 'stop';
    index: number;
    className?: string;
}

function getRegExpRanges(input: string, regex: RegExp): Range[] {
    const ranges: Range[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(input)) !== null) {
        ranges.push({ start: match.index, stop: match.index + match[0].length });
        if (!regex.global) {
            // Non-global regexes never advance lastIndex; break after first match.
            break;
        }
        if (match.index === regex.lastIndex) {
            // Guard against zero-width matches looping forever.
            regex.lastIndex++;
        }
    }
    return ranges;
}

function getRanges(input: string, rules: HighlightRule[]): Range[] {
    const ranges: Range[] = [];
    for (const rule of rules) {
        for (const r of getRegExpRanges(input, rule.highlight)) {
            r.className = rule.className;
            ranges.push(r);
        }
    }
    return ranges;
}

// Drop staggered (partial) overlaps; clean nesting is kept so nested marks work.
function removeStaggeredRanges(ranges: Range[]): Range[] {
    const kept: Range[] = [];
    for (const range of ranges) {
        const staggered = kept.some((u) => {
            const startInside = range.start > u.start && range.start < u.stop;
            const stopInside = range.stop > u.start && range.stop < u.stop;
            return startInside !== stopInside; // xor
        });
        if (!staggered) {
            kept.push(range);
        }
    }
    return kept;
}

function getBoundaries(ranges: Range[]): Boundary[] {
    const boundaries: Boundary[] = [];
    for (const r of ranges) {
        boundaries.push({ type: 'start', index: r.start, className: r.className });
        boundaries.push({ type: 'stop', index: r.stop });
    }
    // Backwards sort, since marks are inserted right-to-left.
    boundaries.sort((a, b) => {
        if (a.index !== b.index) {
            return b.index - a.index;
        } else if (a.type === 'stop' && b.type === 'start') {
            return 1;
        } else if (a.type === 'start' && b.type === 'stop') {
            return -1;
        }
        return 0;
    });
    return boundaries;
}

function buildHighlightHtml(input: string, boundaries: Boundary[]): string {
    boundaries.forEach((boundary, index) => {
        const markup = boundary.type === 'start'
            ? `{{hwt-mark-start|${index}}}`
            : '{{hwt-mark-stop}}';
        input = input.slice(0, boundary.index) + markup + input.slice(boundary.index);
    });

    // Keep scrolling aligned when input ends with a newline.
    input = input.replace(/\n(\{\{hwt-mark-stop\}\})?$/, '\n\n$1');

    // Encode HTML entities before injecting mark tags.
    input = input.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    input = input.replace(/\{\{hwt-mark-start\|(\d+)\}\}/g, (_match, sub) => {
        const className = boundaries[+sub].className;
        return className ? `<mark class="${className}">` : '<mark>';
    });
    input = input.replace(/\{\{hwt-mark-stop\}\}/g, '</mark>');

    return input;
}

// Firefox hides text that scrolls into a textarea's padding; move the padding
// and border off the highlights div onto the backdrop so they behave alike.
function applyFirefoxFix(highlights: HTMLElement, backdrop: HTMLElement): void {
    if (!/firefox/i.test(navigator.userAgent)) {
        return;
    }
    const hs = getComputedStyle(highlights);
    const pad = [hs.paddingTop, hs.paddingRight, hs.paddingBottom, hs.paddingLeft];
    const bor = [hs.borderTopWidth, hs.borderRightWidth, hs.borderBottomWidth, hs.borderLeftWidth];
    highlights.style.padding = '0';
    highlights.style.borderWidth = '0';

    const bs = getComputedStyle(backdrop);
    const px = (v: string) => parseFloat(v || '0');
    backdrop.style.marginTop = px(bs.marginTop) + px(pad[0]) + px(bor[0]) + 'px';
    backdrop.style.marginRight = px(bs.marginRight) + px(pad[1]) + px(bor[1]) + 'px';
    backdrop.style.marginBottom = px(bs.marginBottom) + px(pad[2]) + px(bor[2]) + 'px';
    backdrop.style.marginLeft = px(bs.marginLeft) + px(pad[3]) + px(bor[3]) + 'px';
}

// iOS adds 3px of unremovable horizontal padding to a textarea; match it.
function applyIOSFix(highlights: HTMLElement): void {
    if (!/ipad|iphone|ipod/i.test(navigator.userAgent)) {
        return;
    }
    const hs = getComputedStyle(highlights);
    const px = (v: string) => parseFloat(v || '0');
    highlights.style.paddingLeft = px(hs.paddingLeft) + 3 + 'px';
    highlights.style.paddingRight = px(hs.paddingRight) + 3 + 'px';
}

export interface HighlighterHandle {
    update(): void;
    destroy(): void;
}

export function highlightWithinTextarea(
    el: HTMLTextAreaElement,
    config: HighlightConfig,
): HighlighterHandle {
    const rules = config.highlight;

    el.classList.add('hwt-input', 'hwt-content');

    const highlights = document.createElement('div');
    highlights.className = 'hwt-highlights hwt-content';
    highlights.setAttribute('aria-hidden', 'true');

    const backdrop = document.createElement('div');
    backdrop.className = 'hwt-backdrop';
    backdrop.appendChild(highlights);

    const container = document.createElement('div');
    container.className = 'hwt-container';

    // Insert the container where the textarea is, then move the backdrop and the
    // textarea into it (same DOM shape the jQuery plugin produced).
    el.parentNode!.insertBefore(container, el);
    container.appendChild(backdrop);
    container.appendChild(el);

    const render = () => {
        const ranges = removeStaggeredRanges(getRanges(el.value, rules));
        highlights.innerHTML = buildHighlightHtml(el.value, getBoundaries(ranges));
    };

    const handleScroll = () => {
        backdrop.scrollTop = el.scrollTop;
        const scrollLeft = el.scrollLeft;
        backdrop.style.transform = scrollLeft > 0 ? `translateX(${-scrollLeft}px)` : '';
    };

    const blockContainerScroll = () => {
        container.scrollLeft = 0;
    };

    el.addEventListener('input', render);
    el.addEventListener('scroll', handleScroll);
    container.addEventListener('scroll', blockContainerScroll);

    applyFirefoxFix(highlights, backdrop);
    applyIOSFix(highlights);

    render();

    return {
        update: render,
        destroy() {
            el.removeEventListener('input', render);
            el.removeEventListener('scroll', handleScroll);
            container.removeEventListener('scroll', blockContainerScroll);
            container.parentNode?.insertBefore(el, container);
            container.remove();
            el.classList.remove('hwt-input', 'hwt-content');
        },
    };
}
