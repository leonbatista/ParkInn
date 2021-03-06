import React, { Component } from "react";
import "./Management.css";
import { AddEmployee } from "./AddEmployee";

class Management extends Component {
  render() {
    return (
      <div class="page">
        <div class="page-header">Account Management</div>
        <div class="management-container">
          <button class="button change-password">Change Password</button>
          <div class="add-employee-container">
            <AddEmployee></AddEmployee>
          </div>
        </div>
      </div>
    );
  }
}

export default Management;
