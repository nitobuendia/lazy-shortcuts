/** @file Provides the main view for the options page. */

import { Component } from 'react';
import { UrlMapping, getRules } from '@app/rules_handler';
import { AddNewForm } from '@app/options/add_new_form';
import { UrlRulesList } from '@app/options/rules_list';
import {
  OptionsContext,
  OptionsContextType,
} from '@app/options/options_context';

export class OptionsPage extends Component {
  state: OptionsContextType;

  constructor() {
    super({});

    const updateUrlMapping = async () => {
      this.setState({
        urlMapping: await getRules(),
      });
    };

    this.state = {
      urlMapping: [] as UrlMapping[],
      updateUrlMapping: updateUrlMapping,
    };
  }

  /** Loads rules when the component mounted. */
  async componentDidMount() {
    await this.state.updateUrlMapping();
  }

  render() {
    return (
      <OptionsContext.Provider value={this.state}>
        <div>
          <h1>Lazy Shortcuts</h1>
            <AddNewForm />
            <UrlRulesList />
        </div>
      </OptionsContext.Provider>
    );
  }
}
