/** @file Provides a form to add a new redirect. */

import {createRef, Component, ReactNode, RefObject} from 'react';
import { addNewRule } from '@app/rules_handler';
import { OptionsContext } from '@app/options/options_context';
import { InputField } from '@app/components/input_field';

/** Form that allows to add a new URL redirect. */
export class AddNewForm extends Component {
  static contextType = OptionsContext;
  context!: React.ContextType<typeof OptionsContext>;

  shortUrl: RefObject<HTMLInputElement | null> = createRef();
  longUrl: RefObject<HTMLInputElement | null> = createRef();

  constructor() {
    super({});
    this.handleAddRule = this.handleAddRule.bind(this);
  }

  /** Adds a new URL redirect. */
  async handleAddRule(event: React.FormEvent) {
    event.preventDefault();

    const shortUrl = this.shortUrl?.current?.value;
    if (!shortUrl) {
      window.alert('Short URL not provided.');
      return;
    }

    const longUrl = this.longUrl?.current?.value;
    if (!longUrl) {
      window.alert('Long URL not provided.');
      return;
    }

    await addNewRule(shortUrl, longUrl);
    await this.context.updateUrlMapping();
  }

  /** Renders the form to add new URL redirects. */
  render(): ReactNode {
    return <section>
      <h2>Add New URL Shortcut</h2>
      <form onSubmit={this.handleAddRule} id="addForm">
        <InputField
          id="shortUrl"
          inputRef={this.shortUrl}
          type="url"
          required
          placeholder="Short URL (e.g. http://m)"
        />
        <InputField
          id="longUrl"
          inputRef={this.longUrl}
          type="url"
          required
          placeholder="Long URL (e.g. https://mail.google.com)"
        />
        <button type="submit">Add Shortcut</button>
      </form>
    </section>;
  }
}
