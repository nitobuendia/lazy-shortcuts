/** @file Provides a list of URL redirections. */

import {
  Component,
  ReactNode,
  RefObject,
  createRef,
} from 'react';
import {
  UrlMapping,
  editRule,
  removeRule,
} from '@app/rules_handler';
import { OptionsContext } from '@app/options/options_context';

type EditingRuleId = {
  value: number|null;
}

type UrlRuleProps = {
  urlMapping: UrlMapping;
  editingRuleId: EditingRuleId;
}

type UrlRuleListState = {
  editingRuleId: EditingRuleId;
}

type UrlRuleRowState = {
  isEditing: boolean;
};

/** A row of URL redirects, allowing Edit and Delete. */
class UrlRuleRow extends Component<UrlRuleProps, UrlRuleRowState> {
  selfRowRef = createRef<HTMLTableRowElement>();
  ruleId: RefObject<HTMLInputElement | null> = createRef();
  shortUrl: RefObject<HTMLInputElement | null> = createRef();
  longUrl: RefObject<HTMLInputElement | null> = createRef();

  constructor(props: UrlRuleProps) {
    super(props);
    this.state = {isEditing: false};

    this.handleDeleteRule = this.handleDeleteRule.bind(this);
    this.handleEditRule = this.handleEditRule.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);
  }

  /** Set the isEditing state value. */
  setIsEditing(value: boolean) {
    this.setState((state) => {
      return {
        ...state,
        isEditing: value,
      }
    });
  }

  /** Handles the click on the Delete button. */
  handleDeleteRule() {
    const deleteMessage =
      'Are you sure you want to delete the redirect for ' +
      `${this.props.urlMapping.shortUrl}?`;

    if (window.confirm(deleteMessage)) {
      removeRule(this.props.urlMapping.ruleId);
      this.selfRowRef.current?.remove();
    }
  }

  /** Handles the click on the Edit button. */
  handleEditRule() {
    this.setIsEditing(true);
  }

  /**
   * Handles the click on the Save button during an edit.
   *
   * Saves changes for the new rule.
   */
  handleSaveEdit() {
    let ruleIdValue = this.ruleId.current?.value;
    if (!ruleIdValue) {
      console.error('Unable to edit rule. No rule id.');
      return;
    }
    const ruleId = parseInt(ruleIdValue);

    const shortUrl = this.shortUrl.current?.value;
    if (!shortUrl) {
      console.error(`No short url for ${ruleId}.`);
      return;
    }

    const longUrl = this.longUrl.current?.value;
    if (!longUrl) {
      console.error(`No long url for ${ruleId}.`);
      return;
    }

    this.props.urlMapping.ruleId = this.props.urlMapping.ruleId;
    this.props.urlMapping.shortUrl = shortUrl;
    this.props.urlMapping.longUrl = longUrl;

    editRule(shortUrl, longUrl, ruleId);
    this.setIsEditing(false);
  }

  /** Handles the click on the Cancel button during an edit. */
  handleCancelEdit() {
    this.setIsEditing(false);
  }

  /** Renders the current url mapping row as a form. */
  renderRowAsForm(): ReactNode {
    return <tr key={this.props.urlMapping.ruleId}>
      <td>
        <input
          type="hidden"
          ref={this.ruleId}
          defaultValue={this.props.urlMapping.ruleId}
          />
        <input
          type="url"
          ref={this.shortUrl}
          defaultValue={this.props.urlMapping.shortUrl}
          />
      </td>
      <td>
        <input
          type="url"
          ref={this.longUrl}
          defaultValue={this.props.urlMapping.longUrl}
          />
      </td>
      <td>
        <button onClick={this.handleSaveEdit}>Save</button>
        <button onClick={this.handleCancelEdit}>Cancel</button>
      </td>
    </tr>;
  }

  /** Renders the current url mapping row as a text row. */
  renderRowAsText(): ReactNode {
    return <tr key={this.props.urlMapping.ruleId}>
      <td>{this.props.urlMapping.shortUrl}</td>
      <td>{this.props.urlMapping.longUrl}</td>
      <td>
        <button onClick={this.handleEditRule}>Edit</button>
        <button onClick={this.handleDeleteRule}>Delete</button>
      </td>
    </tr>;
  }

  /** Renders the URL mapping row. */
  render(): ReactNode {
    return <tr key={this.props.urlMapping.ruleId} ref={this.selfRowRef}>
      { this.state.isEditing ? this.renderRowAsForm() : this.renderRowAsText() }
    </tr>;
  }
}


/** List of URL redirect rules. */
export class UrlRulesList extends Component<{}, UrlRuleListState> {
  static contextType = OptionsContext;
  context!: React.ContextType<typeof OptionsContext>;

  constructor() {
    super({});
    this.state = {
      editingRuleId: {value: null},
    };
  }

  /** Loads rules when the component mounted. */
  async componentDidMount() {
    if (!this.context.urlMapping) {
      await this.context.updateUrlMapping();
    }
  }

  /** Renders the rows for each url mapping. */
  renderRowList(): ReactNode {
    return this.context.urlMapping.map((urlMapping) => {
      return <UrlRuleRow
        editingRuleId={this?.state?.editingRuleId}
        urlMapping={urlMapping}
        />
    });
  }

  /** Renders the list of URL redirects. */
  render(): ReactNode {
    return <>
      <h2>Existing URL Redirects</h2>
      <table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Long URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.renderRowList()}
        </tbody>
      </table>
    </>;
  }
}
