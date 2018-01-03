/* @flow */
/* eslint "react/prop-types": "warn" */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { t } from 'c-3po';

import { createMultiwordSearchRegex } from "metabase/lib/string";

import { getHumanReadableValue } from "metabase/lib/query/field";

import SelectPicker from "../../../query_builder/components/filters/pickers/SelectPicker.jsx";

import cx from "classnames";

type Props = {
    value: any,
    values: any[],
    setValue: () => void,
    onClose: () => void
}
type State = {
    searchText: string,
    searchRegex: ?RegExp,
    selectedValues: Array<string>
}

export default class CategoryWidget extends Component {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            searchText: "",
            searchRegex: null,
            selectedValues: Array.isArray(props.value) ? props.value : [props.value]
        };
    }

    static propTypes = {
        value: PropTypes.any,
        values: PropTypes.array.isRequired,
        setValue: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    };

    updateSearchText = (value: string) => {
        let regex = null;

        if (value) {
            regex = createMultiwordSearchRegex(value);
        }

        this.setState({
            searchText: value,
            searchRegex: regex
        });
    }

    static format(value, fieldValues) {
        return getHumanReadableValue(value, fieldValues);
    }

    getOptions() {
        return this.props.values.slice().map((value) => {
            return {
                key: value[0],
                name: value[0]
            }
        });
    }

    commitValues = (values: Array<string>) => {
        this.props.setValue(values);
        this.props.onClose();
    }

    onSelectedValuesChange = (values: Array<string>) => {
        this.setState({selectedValues: values});
    }

    render() {
        const options = this.getOptions();
        const selectedValues = this.state.selectedValues;

        return (
            <div style={{ maxWidth: 200 }}>
                <SelectPicker
                    options={options}
                    values={(selectedValues: Array<string>)}
                    onValuesChange={this.onSelectedValuesChange}
                    placeholder="Find a value"
                    multi={true}
                />
                <div className="p1">
                    <button
                        data-ui-tag="add-category-filter"
                        className={cx("Button Button--purple full", { "disabled": selectedValues.length === 0 })}
                        onClick={() => this.commitValues(this.state.selectedValues)}
                    >
                        { t`Done`}
                    </button>
                </div>
            </div>
        );
    }
}
