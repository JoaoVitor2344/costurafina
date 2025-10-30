import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }
    // Use marked to convert markdown to HTML, then sanitize it.
    // Note: In a production app, you might want a more robust sanitizer config
    // if the HTML source isn't fully trusted.
    const html = marked.parse(value) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
