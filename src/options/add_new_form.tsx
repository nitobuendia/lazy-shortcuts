/** @file Provides a form to add a new redirect. */

import {createRef, Component, ReactNode, RefObject} from 'react';
import { addNewRule, getRules } from '@app/rules_handler';
import { OptionsContext } from '@app/options/options_context';

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
    return <>
      <h2>Add New Redirect</h2>
      <form onSubmit={this.handleAddRule}>
        <div>
          <label htmlFor="shortUrl">Short URL:</label>
          <input
            ref={this.shortUrl}
            type="url"
            id="shortUrl"
            required
            placeholder="http://m"
          />
        </div>
        <div>
          <label htmlFor="longUrl">Long URL:</label>
          <input
            ref={this.longUrl}
            type="url"
            id="longUrl"
            required
            placeholder="https://mail.google.com"
          />
        </div>
        <button type="submit">Add Redirect</button>
      </form>
    </>;
  }
}
