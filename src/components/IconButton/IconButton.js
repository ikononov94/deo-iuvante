import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './IconButton.css'

class IconButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const CustomComponent = this.props.component || 'button';
        const children = this.props.children || <i 
                className='material-icons icon-button__icon' 
                style={{color: this.props.disabled ? '#aaa' : this.props.color}}
            >{this.props.glyph}</i>;
        return (
            <CustomComponent             
                role='button'
                {...this.props}
                className={`icon-button ${this.props.className} ${this.props.disabled ? 'icon-button_disabled' : ''}`}
            >
                {children}
            </CustomComponent>
        );
    }
}

IconButton.propTypes = {
    /** Glyph icon name according to Material Icons library */
    glyph: PropTypes.string,
    onClick: PropTypes.func,
    /** Custom component for button */
    component: PropTypes.node,
    href: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    /** Glyph color */
    color: PropTypes.string,
    disabled: PropTypes.bool
};
 
export default IconButton;
