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
import { InputField } from '@app/components/input_field';
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

type UrlShortcutState = {
  isEditing: boolean;
};

/** A row of URL redirects, allowing Edit and Delete. */
class UrlShortcut extends Component<UrlRuleProps, UrlShortcutState> {
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
    return <>
      <div className="redirectUrls editing">
        <InputField
          id="ruleId"
          inputRef={this.ruleId}
          type="hidden"
          value={this.props.urlMapping.ruleId}
        />
        <span className="shortUrl">
          <InputField
            id="shortUrl"
            inputRef={this.shortUrl}
            type="url"
            value={this.props.urlMapping.shortUrl}
            />
        </span>
        <span className="longUrl">
          <InputField
            id="longUrl"
            inputRef={this.longUrl}
            type="url"
            value={this.props.urlMapping.longUrl}
            />
        </span>
      </div>
      <div className="actionButtons">
        <button onClick={this.handleSaveEdit}>Save</button>
        <button onClick={this.handleCancelEdit}>Cancel</button>
      </div>
    </>;
  }

  /** Renders the current url mapping row as a text row. */
  renderRowAsText(): ReactNode {
    return <>
      <div className="redirectUrls">
        <span className="shortUrl">{this.props.urlMapping.shortUrl}</span>
        <span className="longUrl">{this.props.urlMapping.longUrl}</span>
      </div>
      <div className="actionButtons">
        <button onClick={this.handleEditRule}>Edit</button>
        <button onClick={this.handleDeleteRule}>Delete</button>
      </div>
    </>;
  }

  /** Renders the URL mapping row. */
  render(): ReactNode {
    return <div
      className="shortcut"
      key={this.props.urlMapping.ruleId}
      ref={this.selfRowRef}>
        {
          this.state.isEditing ?
            this.renderRowAsForm() :
            this.renderRowAsText()
        }
    </div>;
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
      return <UrlShortcut
        editingRuleId={this?.state?.editingRuleId}
        urlMapping={urlMapping}
        />
    });
  }

  /** Renders the list of URL redirects. */
  render(): ReactNode {
    return <section>
      <h2>Existing URL Shortcuts</h2>
      {this.renderRowList()}
    </section>;
  }
}
