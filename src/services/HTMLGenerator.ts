import handlebars from 'handlebars';
import { readFileSync } from 'fs';
import MarkdownIt from 'markdown-it';
import { Memory } from '../model/Memory';

export class HTMLGenerator {

  private template: HandlebarsTemplateDelegate;
  
  private readonly markdown: MarkdownIt;

  constructor(){
    this.markdown = new MarkdownIt();
  }

  public generate({ color, from, title, when, content, to, id }: Memory): string {

    if (!this.template) {
      const htmlDoc = readFileSync('./src/memory.html').toString('utf-8');
      this.template = handlebars.compile(htmlDoc);
    }

    const _when: Date = new Date(Number(when.N) * 1000);
    const summary: string = `A memory on ${_when.getUTCDate()} has been shared with you.`;

    return this.template({
      color: color.S,
      from: from.S,
      title: title.S,
      content: this.markdown.render(content.S),
      image: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg', //`https://cdn.tinyily.com/${to.S}/${id.S}.png`,
      when: _when,
      summary
    });
  }
}