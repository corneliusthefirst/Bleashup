

import moment from "moment"
import testForURL from '../../../services/testForURL';
export function writeChange() {
    const change = this.props.change.new_value &&
        this.props.change.new_value.new_value && 
        typeof this.props.change.new_value.new_value === "string" &&
        !testForURL(this.props.change.new_value.new_value) 
        ? this.props.change.new_value.new_value
        : ""
    return moment(change).isValid() ? moment(change).calendar() : change
}
export function writeChangeWithContent(content){
    const change = typeof this.state.content == 'string' && !testForURL(content)?content:""
    return moment(change).isValid() ? moment(change).calendar() : change
}