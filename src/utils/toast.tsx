import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ToastExample extends Component {
  // Define constants for toast messages
  toastSucc = () => toast.success("Wow so easy!");
  toastErr = () => toast.warn("Wow so easy!");

  render() {
    return (
      <div>
        <button onClick={this.toastSucc}>Show Success Toast</button>
        <button onClick={this.toastErr}>Show Error Toast</button>
        <ToastContainer />
      </div>
    );
  }
}

export default ToastExample;
