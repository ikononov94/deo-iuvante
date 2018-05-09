import React from 'react';
import PropTypes from 'prop-types';

import FormInput from '../FormInput/FormInput';

import styles from './UserForm.module.css';

class UserForm extends React.Component {
  constructor(props) {
    super(props);

    const { name, email, phone } = props.values;

    this.state = {
      values: {
        name: name || '',
        email: email || '',
        phone: phone || '',
      },
    };

    this.handleNameChange = this.handleChange.bind(this, 'name');
    this.handleEmailChange = this.handleChange.bind(this, 'email');
    this.handlePhoneChange = this.handleChange.bind(this, 'phone');
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(name, event) {
    const { value } = event.target;

    this.setState(prevState => ({
      values: {
        ...prevState.values,
        [name]: value,
      },
    }));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { isSubmitting, onSubmit } = this.props;

    if (isSubmitting || !this.state.values.name) return;

    onSubmit(this.state.values);
  }

  render() {
    const { className } = this.props;

    return (
      <form className={`${styles.form} ${className}`} onSubmit={this.handleSubmit}>
        <FormInput
          label="Name"
          id="name"
          type="text"
          placeholder="Name"
          value={this.state.values.name}
          onChange={this.handleNameChange}
        />
        <FormInput
          label="Email"
          id="email"
          type="email"
          placeholder="Email"
          value={this.state.values.email}
          onChange={this.handleEmailChange}
        />
        <FormInput
          label="Phone"
          id="phone"
          type="tel"
          placeholder="Phone"
          value={this.state.values.phone}
          onChange={this.handlePhoneChange}
        />
        <button className={styles.buttonCreateAccount} type="submit">Save</button>
      </form>
    );
  }
}

UserForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  values: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
  }),
  className: PropTypes.string,
};

UserForm.defaultProps = {
  values: {},
  className: '',
};

export default UserForm;
